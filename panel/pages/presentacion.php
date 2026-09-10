<?php
/**
 * Editor de la presentación de servicios (/service-presentation).
 *
 * Funciona como el editor de páginas: vista dividida con el deck real en un
 * iframe, borrador y publicado por separado, autoguardado y versiones. La
 * diferencia es que aquí la estructura también se edita —qué láminas hay, en
 * qué orden, cuáles se ven— y eso el reemplazo de textos en vivo no lo puede
 * enseñar. Por eso la vista no recibe «cambia este texto por este otro»: recibe
 * el borrador completo (postMessage, solo dentro del propio dominio) y el deck
 * se vuelve a dibujar con él. Nada se guarda en la red para previsualizar.
 *
 * El formulario lo arma el JavaScript de abajo a partir de un solo objeto, el
 * mismo que se manda al servidor. El servidor no confía en él: todo pasa por
 * presentacion_limpia() antes de tocar la base.
 */
require_once __DIR__ . '/../inc/presentacion.php';

$q = db()->prepare("SELECT * FROM pages WHERE slug = :s AND tipo = 'presentacion'");
$q->execute([':s' => PRESENTACION_SLUG]);
$fila = $q->fetch() ?: null;

/* ---------------------------------------------------------------- */
/* Guardar                                                           */
/* ---------------------------------------------------------------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $accion = (string)($_POST['accion'] ?? 'borrador');

    if ($accion === 'original') {
        $datos = presentacion_base();
        if (!$datos) { set_flash('No encontramos el contenido original. Hay que volver a desplegar el sitio.'); redirect('/panel/?p=presentacion'); }
    } else {
        $datos = presentacion_limpia(json_decode((string)($_POST['datos'] ?? ''), true));
    }
    if (!$datos['laminas']) {
        if ($accion === 'auto') { while (ob_get_level() > 0) ob_end_clean(); header('Content-Type: application/json'); echo '{"ok":false}'; exit; }
        set_flash('La presentación necesita al menos una lámina.');
        redirect('/panel/?p=presentacion');
    }
    $json = presentacion_json($datos);

    if (!$fila) {
        db()->prepare("INSERT INTO pages (slug, nombre, ruta, tipo, borrador, status) VALUES (:s, :n, :r, 'presentacion', :b, 'draft')")
            ->execute([':s' => PRESENTACION_SLUG, ':n' => 'Presentación de servicios', ':r' => '/service-presentation', ':b' => $json]);
        $q->execute([':s' => PRESENTACION_SLUG]);
        $fila = $q->fetch();
    }

    if ($accion === 'publicar') {
        // Antes de publicar se guarda lo que había, para poder volver atrás.
        if (!empty($fila['contenido'])) {
            try {
                db()->prepare('INSERT INTO page_versions (page_id, contenido, autor) VALUES (:p,:c,:a)')
                    ->execute([':p' => (int)$fila['id'], ':c' => $fila['contenido'], ':a' => $_SESSION['admin_user'] ?? '']);
            } catch (Throwable $e) { /* sin historial esta vez */ }
        }
        // Cada columna con su placeholder: repetir uno truena con prepares nativos.
        db()->prepare("UPDATE pages SET contenido = :c1, borrador = :c2, status = 'published', updated_at = NOW() WHERE id = :id")
            ->execute([':c1' => $json, ':c2' => $json, ':id' => (int)$fila['id']]);
        set_flash('¡Listo! La presentación ya muestra estos cambios.');
    } else {
        db()->prepare('UPDATE pages SET borrador = :b, updated_at = NOW() WHERE id = :id')
            ->execute([':b' => $json, ':id' => (int)$fila['id']]);
        if ($accion === 'auto') { while (ob_get_level() > 0) ob_end_clean(); header('Content-Type: application/json'); echo '{"ok":true}'; exit; }
        set_flash($accion === 'original'
            ? 'Recuperamos el contenido original como borrador. Revísalo y publica si te convence.'
            : 'Guardamos tu borrador. Todavía no se ve en la presentación.');
    }
    redirect('/panel/?p=presentacion');
}

/* ---------------------------------------------------------------- */
/* Recuperar una versión anterior (como borrador)                    */
/* ---------------------------------------------------------------- */
if (isset($_GET['restaurar']) && $fila) {
    $v = db()->prepare('SELECT contenido FROM page_versions WHERE id = :v AND page_id = :p');
    $v->execute([':v' => (int)$_GET['restaurar'], ':p' => (int)$fila['id']]);
    if ($c = $v->fetchColumn()) {
        db()->prepare('UPDATE pages SET borrador = :c WHERE id = :id')->execute([':c' => $c, ':id' => (int)$fila['id']]);
        set_flash('Recuperamos esa versión como borrador. Revísala y publica si te convence.');
    }
    redirect('/panel/?p=presentacion');
}

/* ---------------------------------------------------------------- */
/* Lo que se edita                                                   */
/* ---------------------------------------------------------------- */
$base = presentacion_base();
$fuente = $fila ? ($fila['borrador'] ?: $fila['contenido']) : null;
$datos = $fuente ? presentacion_limpia(json_decode((string)$fuente, true)) : $base;
if (!$datos || !$datos['laminas']) $datos = $base;

$publicada = $fila && ($fila['status'] ?? '') === 'published';
$hayBorrador = $fila && !empty($fila['borrador']) && $fila['borrador'] !== ($fila['contenido'] ?? null);

$versiones = [];
if ($fila) {
    try {
        $vq = db()->prepare('SELECT id, autor, created_at FROM page_versions WHERE page_id = :p ORDER BY id DESC LIMIT 8');
        $vq->execute([':p' => (int)$fila['id']]);
        $versiones = $vq->fetchAll();
    } catch (Throwable $e) { /* sin historial, el editor sigue */ }
}
$ct = csrf();
$FLAGS = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
?>
<style>
  .pres-idi{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;margin:0 0 14px}
  .pres-idi button{border:0;background:transparent;color:var(--mut);font:inherit;font-size:12.5px;padding:7px 14px;border-radius:999px;cursor:pointer}
  .pres-idi button.on{color:#fff;background:linear-gradient(90deg,rgba(119,0,206,.45),rgba(153,51,255,.22))}
  .lam>summary .n{font-family:var(--f-mono);font-size:11px;color:var(--pur3);min-width:20px}
  .lam>summary .nom{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px}
  .lam.oculta>summary .nom{opacity:.45;text-decoration:line-through}
  .lam-acc{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;margin:14px 0 2px}
  .pres-campo{margin-top:14px}
  .pres-campo label{text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)}
  .pres-sw{display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:30px;font-size:14px;color:var(--txt);text-transform:none;letter-spacing:0}
  .pres-sw input{width:auto;margin:0}
  .pres-tarjeta{border:1px dashed var(--line2);border-radius:12px;padding:4px 14px 14px;margin-top:14px}
  .pres-url{font-family:var(--f-mono);font-size:11.5px;color:var(--mut2);margin-top:6px;word-break:break-all}
  .pres-url b{color:var(--pur3);font-weight:600}
</style>

<div class="topbar" style="margin-bottom:16px">
  <div>
    <div class="kicker"><a href="/panel/?p=contenido&t=presentacion" style="color:inherit">&larr; Todo el contenido</a></div>
    <h1 class="title">Presentación de servicios</h1>
  </div>
</div>

<?php if (!$datos): ?>
  <div class="card"><p class="muted" style="text-align:center;padding:26px 0">
    No encontramos el contenido de la presentación. Vuelve a desplegar el sitio y recarga esta página.
  </p></div>
<?php return; endif; ?>

<div class="edt">
  <!-- ---- el deck real, en vivo ---- -->
  <div class="edt-vista">
    <div class="edt-vista-top">
      <span class="edt-vivo-pill">En vivo</span>
      <span class="ruta">/service-presentation</span>
      <button type="button" class="edt-btn on" id="vDesk">Escritorio</button>
      <button type="button" class="edt-btn" id="vMovil">Teléfono</button>
      <a class="edt-btn" href="/service-presentation" target="_blank" title="Abrir la presentación publicada">↗</a>
    </div>
    <div class="edt-marco" id="marco">
      <iframe id="vivo" src="/service-presentation?editorVivo=1" title="Vista en vivo de la presentación"></iframe>
    </div>
  </div>

  <!-- ---- los campos ---- -->
  <div class="edt-campos">
    <?php if (!$publicada): ?>
      <div class="card" style="border-color:#3a2f12;background:#191305;padding:14px 18px"><div class="mini" style="color:#e0c07a">
        Todavía no has publicado desde aquí: la presentación muestra el contenido original. Lo que cambies se verá al pulsar «Publicar cambios».
      </div></div>
    <?php elseif ($hayBorrador): ?>
      <div class="card" style="border-color:#3a2f12;background:#191305;padding:14px 18px"><div class="mini" style="color:#e0c07a">
        Tienes cambios que <strong>todavía no se ven</strong> en la presentación (aquí sí se previsualizan).
      </div></div>
    <?php endif; ?>

    <form method="post" id="formPres">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="accion" id="accion" value="borrador">
      <input type="hidden" name="datos" id="datosCampo" value="">

      <div class="pres-idi" role="group" aria-label="Idioma que editas">
        <button type="button" data-idi="es" class="on">Español</button>
        <button type="button" data-idi="en">English</button>
      </div>

      <div id="editor"></div>

      <div class="edt-acciones">
        <button class="btn" type="submit" onclick="document.getElementById('accion').value='publicar'">Publicar cambios</button>
        <button class="btn ghost" type="submit" onclick="document.getElementById('accion').value='borrador'">Guardar sin publicar</button>
        <span class="mini">«Publicar» lo hace visible para quien abra el enlace.</span>
      </div>
    </form>

    <?php if ($versiones): ?>
      <details class="sec">
        <summary><span class="nom">Versiones anteriores</span><span class="cnt"><?= count($versiones) ?></span><span class="flecha">›</span></summary>
        <div class="cuerpo">
          <div class="mini" style="margin:12px 0 6px">Cada vez que publicas guardamos cómo estaba antes, por si quieres volver.</div>
          <table><tbody>
            <?php foreach ($versiones as $v): ?>
              <tr>
                <td><strong><?= e(date('d/m/Y', strtotime($v['created_at']))) ?></strong>
                  <span class="mini">a las <?= e(date('H:i', strtotime($v['created_at']))) ?></span>
                  <?php if (!empty($v['autor'])): ?><div class="mini">por <?= e($v['autor']) ?></div><?php endif; ?></td>
                <td style="text-align:right"><a class="btn small ghost" href="/panel/?p=presentacion&restaurar=<?= (int)$v['id'] ?>"
                   onclick="return confirm('La recuperamos como borrador para que la revises antes de publicar. ¿Seguimos?')">Recuperar</a></td>
              </tr>
            <?php endforeach; ?>
          </tbody></table>
        </div>
      </details>
    <?php endif; ?>

    <?php if ($base): ?>
      <form method="post" style="margin:4px 0 40px" onsubmit="return confirm('Se reemplaza tu borrador por el contenido original de la presentación. Lo publicado no cambia hasta que publiques. ¿Seguimos?')">
        <input type="hidden" name="csrf" value="<?= $ct ?>">
        <input type="hidden" name="accion" value="original">
        <button class="btn small danger" type="submit">Volver al contenido original</button>
      </form>
    <?php endif; ?>
  </div>
</div>

<script type="application/json" id="presDatos"><?= json_encode($datos, $FLAGS) ?></script>
<script type="application/json" id="presEscenas"><?= json_encode(presentacion_escenas(), $FLAGS) ?></script>
<script type="application/json" id="presTipos"><?= json_encode(presentacion_tipos(), $FLAGS) ?></script>

<script>
(function () {
  var datos = JSON.parse(document.getElementById('presDatos').textContent);
  var ESCENAS = JSON.parse(document.getElementById('presEscenas').textContent);
  var TIPOS = JSON.parse(document.getElementById('presTipos').textContent);
  var form = document.getElementById('formPres');
  var editor = document.getElementById('editor');
  var vivo = document.getElementById('vivo');
  var idi = 'es';
  var abiertas = {};          // qué láminas están desplegadas, por posición
  var enfocada = null;        // la lámina que se está tocando

  /* ============ un objeto, rutas y un ayudante para armar el DOM ============ */
  function leer(ruta) {
    return ruta.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, datos);
  }
  function poner(ruta, v) {
    var ks = ruta.split('.'), o = datos;
    for (var i = 0; i < ks.length - 1; i++) {
      if (o[ks[i]] == null) o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {};
      o = o[ks[i]];
    }
    o[ks[ks.length - 1]] = v;
  }
  /* Nunca innerHTML con lo que escribe el cliente: todo va por textContent y value. */
  function h(tag, attrs, hijos) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'texto') el.textContent = attrs[k];
      else if (k === 'clase') el.className = attrs[k];
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (hijos || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function campo(etiqueta, ruta, opciones) {
    opciones = opciones || {};
    var v = leer(ruta);
    var entrada = opciones.largo
      ? h('textarea', { 'data-ruta': ruta, rows: opciones.filas || 3, style: 'min-height:' + (opciones.alto || 76) + 'px', placeholder: opciones.ejemplo || '' })
      : h('input', { type: 'text', 'data-ruta': ruta, placeholder: opciones.ejemplo || '' });
    entrada.value = v == null ? '' : v;
    return h('div', { clase: 'pres-campo' }, [
      h('label', { texto: etiqueta }), entrada,
      opciones.ayuda ? h('div', { clase: 'mini', style: 'margin-top:5px', texto: opciones.ayuda }) : null,
    ]);
  }
  function selector(etiqueta, ruta, opciones) {
    var s = h('select', { 'data-ruta': ruta });
    Object.keys(opciones).forEach(function (k) {
      var o = h('option', { value: k, texto: opciones[k] });
      if ((leer(ruta) || '') === k) o.selected = true;
      s.appendChild(o);
    });
    return h('div', { clase: 'pres-campo' }, [h('label', { texto: etiqueta }), s]);
  }

  /* ============ contacto y botones ============ */
  function seccionContacto() {
    var c = 'contacto.', b = 'botones.';
    return h('details', { clase: 'sec' }, [
      h('summary', {}, [h('span', { clase: 'nom', texto: 'Contacto y botones' }), h('span', { clase: 'cnt', texto: 'enlaces' }), h('span', { clase: 'flecha', texto: '›' })]),
      h('div', { clase: 'cuerpo' }, [
        h('div', { clase: 'mini', style: 'margin-top:12px', texto: 'Van en la última lámina y en los botones que llevan a algún lado. Un campo vacío oculta su botón.' }),
        campo('WhatsApp (solo números, con 521)', c + 'whatsapp', { ejemplo: '5214491204353', ayuda: 'El botón abre wa.me con este número.' }),
        campo('Mensaje con que se abre el chat · ' + (idi === 'es' ? 'español' : 'inglés'), c + 'mensaje.' + idi, { largo: true, alto: 60, ejemplo: 'Hola, vi la presentación de servicios y quiero…', ayuda: 'Opcional. Llega ya escrito para que el cliente solo pulse enviar.' }),
        campo('Teléfono como se lee', c + 'telefono', { ejemplo: '+52 1 449 120 4353' }),
        campo('Correo', c + 'correo', { ejemplo: 'contacto@inedito.digital' }),
        campo('Sitio web (como se lee)', c + 'sitio', { ejemplo: 'inedito.digital' }),
        campo('Botón de la portada', b + 'empezar.' + idi),
        campo('Botón de WhatsApp', b + 'escribir.' + idi),
        campo('Botón de correo', b + 'correo.' + idi),
      ]),
    ]);
  }

  /* ============ una lámina ============ */
  function tarjetaLamina(l, n) {
    var r = 'laminas.' + n + '.';
    var servicio = l.tipo === 'servicio';
    var nombre = (l.nombre && (l.nombre[idi] || l.nombre.es)) || 'Sin nombre';
    var det = h('details', { clase: 'sec lam' + (l.visible === false ? ' oculta' : ''), 'data-n': n });
    if (abiertas[n]) det.open = true;
    det.addEventListener('toggle', function () { abiertas[n] = det.open; if (det.open) irA(n); });

    var sumNombre = h('span', { clase: 'nom', texto: nombre.replace(/\n/g, ' ') });
    det.appendChild(h('summary', {}, [
      h('span', { clase: 'n', texto: String(n + 1).padStart(2, '0') }), sumNombre,
      h('span', { clase: 'cnt', texto: TIPOS[l.tipo] || 'Servicio' }),
      l.visible === false ? h('span', { clase: 'cnt', texto: 'Oculta' }) : null,
      h('span', { clase: 'flecha', texto: '›' }),
    ]));

    var cuerpo = h('div', { clase: 'cuerpo' });
    cuerpo.appendChild(h('div', { clase: 'lam-acc' }, [
      n > 0 ? h('button', { type: 'button', clase: 'btn small ghost', title: 'Subir', texto: '↑', onclick: function () { mover(n, -1); } }) : null,
      n < datos.laminas.length - 1 ? h('button', { type: 'button', clase: 'btn small ghost', title: 'Bajar', texto: '↓', onclick: function () { mover(n, 1); } }) : null,
      h('button', { type: 'button', clase: 'btn small ghost', texto: 'Duplicar', onclick: function () { duplicar(n); } }),
      h('button', { type: 'button', clase: 'btn small danger', texto: 'Quitar', onclick: function () { quitar(n); } }),
    ]));

    var fila1 = h('div', { clase: 'rowf' }, [selector('Tipo de lámina', r + 'tipo', TIPOS)]);
    if (servicio) {
      var ops = { '': 'Sin animación' };
      Object.keys(ESCENAS).forEach(function (k) { ops[k] = ESCENAS[k]; });
      fila1.appendChild(selector('Animación', r + 'escena', ops));
    }
    cuerpo.appendChild(fila1);

    var url = h('div', { clase: 'pres-url' });
    function pintaUrl() {
      url.textContent = '';
      url.appendChild(document.createTextNode('inedito.digital/service-presentation#'));
      url.appendChild(h('b', { texto: leer(r + 'id') || '' }));
    }
    pintaUrl();
    var copiar = h('button', { type: 'button', clase: 'btn small ghost', style: 'margin-top:8px', texto: 'Copiar enlace', onclick: function () {
      var u = 'https://www.inedito.digital/service-presentation#' + (leer(r + 'id') || '');
      if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { copiar.textContent = 'Copiado'; setTimeout(function () { copiar.textContent = 'Copiar enlace'; }, 1400); });
    } });
    var idCampo = campo('Dirección de la lámina', r + 'id', { ayuda: 'Solo minúsculas, números y guiones. Sirve para mandar esta lámina directo.' });
    idCampo.appendChild(url); idCampo.appendChild(copiar);
    idCampo.querySelector('input').addEventListener('input', pintaUrl);

    var vis = h('input', { type: 'checkbox', 'data-ruta': r + 'visible', 'data-sw': '1' });
    vis.checked = l.visible !== false;
    cuerpo.appendChild(h('div', { clase: 'rowf' }, [idCampo, h('label', { clase: 'pres-sw' }, [vis, 'Mostrar esta lámina'])]));

    var kicker = campo('Etiqueta pequeña de arriba', r + 'kicker.' + idi, servicio ? { ayuda: 'Si dice «Servicio 01» (o «Service 01»), el número se acomoda solo según el orden.' } : {});
    var nombreCampo = campo('Nombre, en grande', r + 'nombre.' + idi, { largo: true, filas: 2, alto: 60, ayuda: 'Para partirlo en dos renglones, pulsa Enter donde quieras el corte.' });
    nombreCampo.querySelector('textarea').addEventListener('input', function (ev) { sumNombre.textContent = ev.target.value.replace(/\n/g, ' ') || 'Sin nombre'; });
    cuerpo.appendChild(kicker);
    cuerpo.appendChild(nombreCampo);
    cuerpo.appendChild(campo('Descripción', r + 'descripcion.' + idi, { largo: true }));

    if (servicio) {
      for (var k = 0; k < 3; k++) {
        var rt = r + 'tarjetas.' + idi + '.' + k + '.';
        cuerpo.appendChild(h('div', { clase: 'pres-tarjeta' }, [
          campo('Tarjeta ' + (k + 1) + ' · título', rt + 't'),
          campo('Tarjeta ' + (k + 1) + ' · explicación', rt + 'd', { largo: true, alto: 64 }),
        ]));
      }
      cuerpo.appendChild(h('div', { clase: 'mini', style: 'margin-top:8px', texto: 'Una tarjeta vacía no se muestra. Caben tres.' }));
    }

    cuerpo.appendChild(h('div', { clase: 'rowf' }, [
      campo('Enlace opcional · texto', r + 'enlace.texto.' + idi, { ejemplo: 'Ver el servicio en el sitio' }),
      campo('Enlace opcional · destino', r + 'enlace.url', { ejemplo: '/servicios/…  o  https://…' }),
    ]));
    det.appendChild(cuerpo);

    det.addEventListener('focusin', function () { enfocada = n; irA(n); });
    return det;
  }

  /* ============ armar todo ============ */
  function pintar() {
    editor.textContent = '';
    editor.appendChild(seccionContacto());
    var lista = h('div', { id: 'laminas' });
    datos.laminas.forEach(function (l, n) { lista.appendChild(tarjetaLamina(l, n)); });
    editor.appendChild(h('div', { style: 'margin:18px 0 8px;font-weight:700', texto: 'Láminas · ' + datos.laminas.length }));
    editor.appendChild(lista);
    editor.appendChild(h('button', { type: 'button', clase: 'btn small ghost', style: 'margin:4px 0 10px', texto: '+ Agregar lámina de servicio', onclick: agregar }));
  }

  function vacia() {
    return { id: 'nuevo-servicio', tipo: 'servicio', visible: true, escena: '',
      kicker: { es: 'Servicio 01', en: 'Service 01' }, nombre: { es: 'NUEVO SERVICIO', en: 'NEW SERVICE' },
      descripcion: { es: '', en: '' }, tarjetas: { es: [], en: [] } };
  }
  function cambioEstructura(abrir) {
    abiertas = {}; if (abrir != null) abiertas[abrir] = true;
    pintar(); enviarVista(); marcar();
  }
  function mover(n, d) {
    var m = n + d, L = datos.laminas;
    if (m < 0 || m >= L.length) return;
    var t = L[n]; L[n] = L[m]; L[m] = t;
    cambioEstructura(m);
  }
  function duplicar(n) {
    var copia = JSON.parse(JSON.stringify(datos.laminas[n]));
    copia.id = (copia.id || 'lamina') + '-copia';
    datos.laminas.splice(n + 1, 0, copia);
    cambioEstructura(n + 1);
  }
  function quitar(n) {
    if (datos.laminas.length < 2) { alert('La presentación necesita al menos una lámina.'); return; }
    if (!confirm('¿Quitamos esta lámina? Si solo quieres esconderla, desmarca «Mostrar esta lámina».')) return;
    datos.laminas.splice(n, 1);
    cambioEstructura(null);
  }
  function agregar() {
    // Antes del cierre, que es donde tiene sentido un servicio más.
    var i = datos.laminas.length;
    for (var k = datos.laminas.length - 1; k >= 0; k--) if (datos.laminas[k].tipo === 'cierre') { i = k; break; }
    datos.laminas.splice(i, 0, vacia());
    cambioEstructura(i);
  }

  /* Cada tecla actualiza el objeto, la vista y el autoguardado. Cambiar el tipo
     cambia qué campos tiene la lámina, así que ese sí vuelve a armarla. */
  editor.addEventListener('input', function (ev) {
    var el = ev.target, ruta = el.getAttribute && el.getAttribute('data-ruta');
    if (!ruta) return;
    poner(ruta, el.getAttribute('data-sw') ? el.checked : el.value);
    enviarVista(); marcar();
  });
  editor.addEventListener('change', function (ev) {
    var el = ev.target, ruta = el.getAttribute && el.getAttribute('data-ruta');
    if (!ruta) return;
    if (/\.tipo$/.test(ruta) || /\.visible$/.test(ruta)) {
      poner(ruta, el.getAttribute('data-sw') ? el.checked : el.value);
      var n = +ruta.split('.')[1];
      cambioEstructura(n);
    }
  });

  /* ============ idioma que se edita ============ */
  document.querySelectorAll('[data-idi]').forEach(function (b) {
    b.addEventListener('click', function () {
      idi = b.getAttribute('data-idi');
      document.querySelectorAll('[data-idi]').forEach(function (x) { x.classList.toggle('on', x === b); });
      pintar();
      manda({ tipo: 'presentacion-idioma', idioma: idi });
    });
  });

  /* ============ la vista en vivo ============ */
  function manda(m) { try { vivo.contentWindow.postMessage(m, location.origin); } catch (e) { /* nada */ } }
  var tVista = null;
  function enviarVista() {
    clearTimeout(tVista);
    tVista = setTimeout(function () { manda({ tipo: 'presentacion', datos: datos }); }, 120);
  }
  function irA(n) {
    var l = datos.laminas[n];
    if (l) manda({ tipo: 'presentacion-ir', id: l.id });
  }
  /* El deck avisa cuando está listo; entonces recibe el borrador entero. */
  window.addEventListener('message', function (ev) {
    if (ev.origin !== location.origin || ev.source !== vivo.contentWindow) return;
    if (ev.data && ev.data.tipo === 'presentacion-lista') {
      manda({ tipo: 'presentacion', datos: datos });
      manda({ tipo: 'presentacion-idioma', idioma: idi });
      if (enfocada != null) setTimeout(function () { irA(enfocada); }, 150);
    }
  });

  var marco = document.getElementById('marco');
  var bDesk = document.getElementById('vDesk'), bMovil = document.getElementById('vMovil');
  bDesk.addEventListener('click', function () { marco.classList.remove('movil'); bDesk.classList.add('on'); bMovil.classList.remove('on'); });
  bMovil.addEventListener('click', function () { marco.classList.add('movil'); bMovil.classList.add('on'); bDesk.classList.remove('on'); });

  /* ============ guardar ============ */
  form.addEventListener('submit', function () {
    clearTimeout(tGuardar);
    document.getElementById('datosCampo').value = JSON.stringify(datos);
  });

  var aviso = null, tGuardar = null;
  function marcar() {
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.style.cssText = 'position:fixed;right:18px;bottom:18px;background:#14141f;border:1px solid #232336;color:#9a97ad;padding:10px 16px;border-radius:999px;font-size:13px;z-index:50';
      document.body.appendChild(aviso);
    }
    aviso.textContent = 'Guardando lo que escribiste…';
    clearTimeout(tGuardar);
    tGuardar = setTimeout(guardar, 2500);
  }
  function guardar() {
    var fd = new FormData();
    fd.set('csrf', form.querySelector('[name=csrf]').value);
    fd.set('accion', 'auto');
    fd.set('datos', JSON.stringify(datos));
    fetch(location.href, { method: 'POST', body: fd, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (j) { aviso.textContent = j && j.ok ? 'Guardado como borrador' : 'No se guardó: revisa que quede al menos una lámina.'; })
      .catch(function () { aviso.textContent = 'No pudimos guardar. Revisa tu conexión.'; });
  }

  pintar();
})();
</script>
