<?php
/**
 * Editor de páginas del sitio.
 *
 * El formulario se genera solo a partir de panel/inc/contenido.php, así que
 * agregar un campo editable es declararlo ahí, no escribir pantallas nuevas.
 *
 * Borrador vs publicado: se guardan por separado. El sitio siempre sirve lo
 * publicado, así que se puede trabajar tranquilo sin que se vea a medias.
 *
 * El editor es de vista dividida: la página real corre en un iframe y cada
 * letra que se escribe se pinta ahí al instante (src/app/editorEnVivo.ts la
 * recibe). Enfocar un campo resalta en la página lo que se está editando.
 */
require __DIR__ . '/../inc/contenido.php';

$registro = registro_paginas();
$slug = preg_replace('/[^a-z0-9\-]/', '', (string)($_GET['pagina'] ?? ''));

/* ---------------------------------------------------------------- */
/* Guardar                                                           */
/* ---------------------------------------------------------------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $slug   = preg_replace('/[^a-z0-9\-]/', '', (string)($_POST['slug'] ?? ''));
    $accion = $_POST['accion'] ?? '';
    $reg    = $registro[$slug] ?? null;

    if (!$reg) { set_flash('No encontramos esa página.'); redirect('/panel/?p=paginas'); }

    // Solo se aceptan los campos declarados: nada que venga de fuera entra.
    $contenido = [];
    foreach ($reg['secciones'] as $sk => $sec) {
        foreach ($sec['campos'] as $ck => $campo) {
            $nombre = "c__{$sk}__{$ck}";
            if ($campo['tipo'] === 'switch') {
                $contenido[$sk][$ck] = isset($_POST[$nombre]) ? '1' : '0';
            } else {
                $contenido[$sk][$ck] = trim((string)($_POST[$nombre] ?? ''));
            }
        }
    }
    $json = json_encode($contenido, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $seo = [
        ':st' => trim((string)($_POST['seo_title'] ?? '')),
        ':sd' => trim((string)($_POST['seo_desc'] ?? '')),
        ':si' => trim((string)($_POST['seo_image'] ?? '')),
    ];

    $existe = db()->prepare('SELECT id, contenido FROM pages WHERE slug = :s');
    $existe->execute([':s' => $slug]);
    $fila = $existe->fetch();

    if (!$fila) {
        db()->prepare('INSERT INTO pages (slug, nombre, ruta, borrador, seo_title, seo_desc, seo_image) VALUES (:s,:n,:r,:b,:st,:sd,:si)')
            ->execute([':s' => $slug, ':n' => $reg['nombre'], ':r' => $reg['ruta'], ':b' => $json] + $seo);
        $existe->execute([':s' => $slug]);
        $fila = $existe->fetch();
    }

    if ($accion === 'publicar') {
        // Antes de publicar se guarda lo que había, para poder volver atrás.
        // Si el historial falla, publicar sigue: la versión es un lujo, no
        // una condición.
        if (!empty($fila['contenido'])) {
            try {
                db()->prepare('INSERT INTO page_versions (page_id, contenido, autor) VALUES (:p,:c,:a)')
                    ->execute([':p' => (int)$fila['id'], ':c' => $fila['contenido'], ':a' => $_SESSION['admin_user'] ?? '']);
            } catch (Throwable $e) { /* sin historial esta vez */ }
        }
        // contenido y borrador llevan el mismo texto pero CADA UNO su
        // placeholder: con prepares nativos, repetir :c truena con HY093
        // (así se rompía el botón de publicar).
        db()->prepare('UPDATE pages SET contenido=:c1, borrador=:c2, seo_title=:st, seo_desc=:sd, seo_image=:si, updated_at=NOW() WHERE id=:id')
            ->execute([':c1' => $json, ':c2' => $json, ':id' => (int)$fila['id']] + $seo);
        set_flash('¡Listo! Los cambios ya están publicados en el sitio.');
    } else {
        db()->prepare('UPDATE pages SET borrador=:b, seo_title=:st, seo_desc=:sd, seo_image=:si, updated_at=NOW() WHERE id=:id')
            ->execute([':b' => $json, ':id' => (int)$fila['id']] + $seo);
        set_flash('Guardamos tu borrador. Todavía no se ve en el sitio.');
    }
    redirect('/panel/?p=paginas&pagina=' . $slug);
}

/* ---------------------------------------------------------------- */
/* Restaurar una versión anterior                                    */
/* ---------------------------------------------------------------- */
if (isset($_GET['restaurar'])) {
    $vid = (int)$_GET['restaurar'];
    $v = db()->prepare('SELECT v.contenido, p.slug, p.id FROM page_versions v JOIN pages p ON p.id = v.page_id WHERE v.id = :v');
    $v->execute([':v' => $vid]);
    if ($row = $v->fetch()) {
        db()->prepare('UPDATE pages SET borrador = :c WHERE id = :id')->execute([':c' => $row['contenido'], ':id' => (int)$row['id']]);
        set_flash('Recuperamos esa versión como borrador. Revísala y publica si te convence.');
        redirect('/panel/?p=paginas&pagina=' . $row['slug']);
    }
}

$ct = csrf();

/** "hace 3 días", para el pie de las tarjetas. */
function hace(?string $fecha): string {
    if (!$fecha) return 'sin ediciones aún';
    $s = time() - strtotime($fecha);
    if ($s < 3600) return 'hace ' . max(1, (int)($s / 60)) . ' min';
    if ($s < 86400) return 'hace ' . (int)($s / 3600) . ' h';
    $d = (int)($s / 86400);
    return $d === 1 ? 'ayer' : "hace $d días";
}

/* ---------------------------------------------------------------- */
/* Lista de páginas                                                  */
/* ---------------------------------------------------------------- */
if (!$slug || !isset($registro[$slug])) {
    $estado = [];
    foreach (db()->query('SELECT slug, contenido, borrador, seo_image, updated_at FROM pages') as $r) $estado[$r['slug']] = $r;
    ?>
    <div class="topbar">
      <div>
        <div class="kicker">Contenido del sitio</div>
        <h1 class="title">Páginas</h1>
        <p class="subt" style="margin-bottom:0">Elige una página y edítala viendo el cambio en vivo. El diseño se queda igual.</p>
      </div>
      <input type="search" id="buscaPag" placeholder="Buscar página…" style="width:230px;align-self:center">
    </div>

    <div class="pag-grid" id="gridPag">
      <?php foreach ($registro as $sk => $reg):
        $e = $estado[$sk] ?? null;
        $hayBorrador = $e && $e['borrador'] !== ($e['contenido'] ?? null) && !empty($e['borrador']);
        $secN = count($reg['secciones']);
      ?>
        <a class="pag-card" href="/panel/?p=paginas&pagina=<?= e($sk) ?>"
           data-busca="<?= e(mb_strtolower($reg['nombre'] . ' ' . $reg['ruta'])) ?>">
          <?php $foto = trim((string)($e['seo_image'] ?? '')); ?>
          <div class="pag-mini<?= $foto !== '' ? ' con-foto' : '' ?>" aria-hidden<?= $foto !== '' ? ' style="background-image:url(' . e($foto) . ')"' : '' ?>>
            <span class="pag-letra"><?= e(mb_strtoupper(mb_substr($reg['nombre'], 0, 1))) ?></span>
            <i class="pag-ruta-pill"><?= e($reg['ruta']) ?></i>
          </div>
          <div class="pag-info">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div class="n"><?= e($reg['nombre']) ?></div>
              <?php if ($hayBorrador): ?><span class="badge b-draft">Borrador</span><?php endif; ?>
            </div>
            <div class="r"><?= e($reg['ruta']) ?> · <?= $secN ?> secciones</div>
            <div class="a"><?= e($reg['ayuda'] ?? '') ?></div>
            <div class="pag-pie">
              <span class="f"><?= e(hace($e['updated_at'] ?? null)) ?></span>
              <span class="e">Editar →</span>
            </div>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
    <p class="mini" id="sinResultados" style="display:none;text-align:center;padding:30px 0">Ninguna página se llama así.</p>

    <script>
    (function () {
      var busca = document.getElementById('buscaPag');
      var tarjetas = Array.prototype.slice.call(document.querySelectorAll('#gridPag .pag-card'));
      var vacio = document.getElementById('sinResultados');
      busca.addEventListener('input', function () {
        var q = busca.value.trim().toLowerCase();
        var visibles = 0;
        tarjetas.forEach(function (t) {
          var ok = !q || t.dataset.busca.indexOf(q) !== -1;
          t.style.display = ok ? '' : 'none';
          if (ok) visibles++;
        });
        vacio.style.display = visibles ? 'none' : '';
      });
    })();
    </script>
    <?php
    return;
}

/* ---------------------------------------------------------------- */
/* Editor de una página                                              */
/* ---------------------------------------------------------------- */
$reg = $registro[$slug];
$q = db()->prepare('SELECT * FROM pages WHERE slug = :s');
$q->execute([':s' => $slug]);
$fila = $q->fetch() ?: [];

// Se edita siempre sobre el borrador; si no hay, sobre lo publicado.
// Lo PUBLICADO (con sus respaldos) es lo que el iframe muestra al cargar:
// cada campo lo lleva en data-pub para que el vivo sepa qué texto sustituir.
$fuente = $fila['borrador'] ?? ($fila['contenido'] ?? null);
$val = contenido_con_respaldo($slug, $fuente);
$pub = contenido_con_respaldo($slug, $fila['contenido'] ?? null);

$versiones = [];
if (!empty($fila['id'])) {
    try {
        $vq = db()->prepare('SELECT id, autor, created_at FROM page_versions WHERE page_id = :p ORDER BY id DESC LIMIT 8');
        $vq->execute([':p' => (int)$fila['id']]);
        $versiones = $vq->fetchAll();
    } catch (Throwable $e) { /* sin historial, el editor sigue */ }
}
$hayBorrador = !empty($fila['borrador']) && ($fila['borrador'] !== ($fila['contenido'] ?? null));
$rutaVista = $reg['ruta'] . (strpos($reg['ruta'], '?') === false ? '?' : '&') . 'editorVivo=1';
?>
<div class="topbar" style="margin-bottom:16px">
  <div>
    <div class="kicker"><a href="/panel/?p=paginas" style="color:inherit">&larr; Todas las páginas</a></div>
    <h1 class="title"><?= e($reg['nombre']) ?></h1>
  </div>
</div>

<div class="edt">
  <!-- ---- la página real, en vivo ---- -->
  <div class="edt-vista">
    <div class="edt-vista-top">
      <span class="edt-vivo-pill">En vivo</span>
      <span class="ruta"><?= e($reg['ruta']) ?></span>
      <button type="button" class="edt-btn" id="vDesk" title="Vista de escritorio">Escritorio</button>
      <button type="button" class="edt-btn" id="vMovil" title="Vista de teléfono">Teléfono</button>
      <button type="button" class="edt-btn" id="vRecargar" title="Volver a cargar la página">Recargar</button>
      <a class="edt-btn" href="<?= e($reg['ruta']) ?>" target="_blank" title="Abrir en una pestaña">↗</a>
    </div>
    <div class="edt-marco" id="marco">
      <iframe id="vivo" src="<?= e($rutaVista) ?>" title="Vista en vivo de <?= e($reg['nombre']) ?>"></iframe>
    </div>
  </div>

  <!-- ---- los campos ---- -->
  <div class="edt-campos">
    <?php if ($hayBorrador): ?>
      <div class="card" style="border-color:#3a2f12;background:#191305;padding:14px 18px">
        <div class="mini" style="color:#e0c07a">
          Tienes cambios que <strong>todavía no se ven en el sitio</strong> (aquí sí se previsualizan). Cuando estés conforme, «Publicar cambios».
        </div>
      </div>
    <?php endif; ?>

    <form method="post" id="formPagina">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="slug" value="<?= e($slug) ?>">
      <input type="hidden" name="accion" id="accion" value="borrador">

      <?php $primera = true; foreach ($reg['secciones'] as $sk => $sec): ?>
        <details class="sec" <?= $primera ? 'open' : '' ?>>
          <summary>
            <span class="nom"><?= e($sec['nombre']) ?></span>
            <span class="cnt"><?= count($sec['campos']) ?> campos</span>
            <span class="flecha">›</span>
          </summary>
          <div class="cuerpo">
          <?php if (!empty($sec['ayuda'])): ?><div class="mini" style="margin-top:12px"><?= e($sec['ayuda']) ?></div><?php endif; ?>

          <?php
          $campos = $sec['campos'];
          foreach ($campos as $ck => $campo):
              if ($campo['tipo'] !== 'switch') continue;
              $n = "c__{$sk}__{$ck}";
              $on = ($val[$sk][$ck] ?? '1') === '1';
          ?>
            <label style="display:flex;align-items:center;gap:10px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--txt);margin:16px 0 4px;cursor:pointer;font-family:inherit">
              <input type="checkbox" name="<?= $n ?>" <?= $on ? 'checked' : '' ?> style="width:auto;margin:0">
              <?= e($campo['label']) ?>
            </label>
            <?php if (!empty($campo['ayuda'])): ?><div class="mini" style="margin-left:26px"><?= e($campo['ayuda']) ?></div><?php endif; ?>
          <?php endforeach; ?>

          <div class="rowf">
          <?php foreach ($campos as $ck => $campo):
              if ($campo['tipo'] === 'switch') continue;
              $n = "c__{$sk}__{$ck}";
              $v = $val[$sk][$ck] ?? '';
              $enVivo = in_array($campo['tipo'], ['texto', 'parrafo', 'numero'], true);
              $vivoAttrs = $enVivo ? ' data-vivo-pub="' . e($pub[$sk][$ck] ?? '') . '"' : '';
              $ancho = in_array($campo['tipo'], ['parrafo','imagen','enlace'], true);
              if ($ancho) echo '</div><div class="rowf" style="grid-template-columns:1fr">';
          ?>
            <div>
              <label><?= e($campo['label']) ?></label>
              <?php if ($campo['tipo'] === 'parrafo'): ?>
                <textarea name="<?= $n ?>" style="min-height:90px"<?= $vivoAttrs ?>><?= e($v) ?></textarea>

              <?php elseif ($campo['tipo'] === 'color'): ?>
                <?php $cv = preg_match('/^#[0-9a-fA-F]{6}$/', $v) ? $v : ($campo['def'] ?? '#7700CE'); ?>
                <div style="display:flex;gap:10px;align-items:center">
                  <input type="color" value="<?= e($cv) ?>" data-color-para="<?= $n ?>"
                         style="width:52px;height:42px;padding:3px;cursor:pointer;flex:0 0 auto">
                  <input type="text" name="<?= $n ?>" value="<?= e($cv) ?>" data-color-txt="<?= $n ?>"
                         style="flex:1" placeholder="#7700CE">
                </div>

              <?php elseif ($campo['tipo'] === 'imagen'):
                      $bg = 'flex:0 0 78px;height:60px;border-radius:10px;border:1px solid var(--line);background:#0b0b12 center/cover no-repeat;';
                      if ($v !== '') $bg .= "background-image:url('" . e($v) . "');";
              ?>
                <div style="display:flex;gap:12px;align-items:flex-start">
                  <div style="<?= $bg ?>" data-vista="<?= $n ?>"></div>
                  <div style="flex:1">
                    <input type="text" name="<?= $n ?>" value="<?= e($v) ?>" data-img="<?= $n ?>" placeholder="Pega aquí la dirección de la imagen">
                    <div class="mini" style="margin-top:5px">Por ahora se pega la dirección. La subida con arrastrar y soltar llega en la siguiente fase.</div>
                  </div>
                </div>

              <?php elseif ($campo['tipo'] === 'enlace'): ?>
                <input type="text" name="<?= $n ?>" value="<?= e($v) ?>" placeholder="/contacto  o  https://...">
                <div class="mini" style="margin-top:5px">Puede ser una parte de tu sitio (por ejemplo <code>/contacto</code>) o una dirección completa.</div>

              <?php else: ?>
                <input type="text" name="<?= $n ?>" value="<?= e($v) ?>"<?= $vivoAttrs ?>>
              <?php endif; ?>
              <?php if (!empty($campo['ayuda'])): ?><div class="mini" style="margin-top:5px"><?= e($campo['ayuda']) ?></div><?php endif; ?>
            </div>
          <?php if ($ancho) echo '</div><div class="rowf">'; ?>
          <?php endforeach; ?>
          </div>
          </div>
        </details>
      <?php $primera = false; endforeach; ?>

      <details class="sec">
        <summary>
          <span class="nom">Cómo se ve en Google y al compartir</span>
          <span class="cnt">3 campos</span>
          <span class="flecha">›</span>
        </summary>
        <div class="cuerpo">
          <!-- la tarjeta tal como la pintaría Google, actualizada en vivo -->
          <div class="snippet" style="margin-top:14px">
            <div class="u"><b>inedito.digital</b><span>›<?= e($reg['ruta'] === '/' ? '' : str_replace('/', ' › ', trim($reg['ruta'], '/'))) ?></span></div>
            <div class="t" id="snpT"><?= e(($fila['seo_title'] ?? '') !== '' ? $fila['seo_title'] : $reg['nombre'] . ' | Inédito Digital') ?></div>
            <div class="d" id="snpD"><?= e(($fila['seo_desc'] ?? '') !== '' ? $fila['seo_desc'] : 'Si dejas la descripción vacía, se usa una automática.') ?></div>
          </div>
          <div class="rowf" style="grid-template-columns:1fr">
            <div>
              <label>Título para buscadores</label>
              <input type="text" name="seo_title" id="seoT" maxlength="70" value="<?= e($fila['seo_title'] ?? '') ?>">
              <div class="mini" style="margin-top:5px">Lo ideal son unas 60 letras. Si es más largo, Google lo corta.</div>
            </div>
            <div>
              <label>Descripción corta</label>
              <textarea name="seo_desc" id="seoD" maxlength="180" style="min-height:70px"><?= e($fila['seo_desc'] ?? '') ?></textarea>
              <div class="mini" style="margin-top:5px">Dos renglones explicando de qué trata la página.</div>
            </div>
            <div>
              <label>Imagen para compartir</label>
              <input type="text" name="seo_image" value="<?= e($fila['seo_image'] ?? '') ?>" placeholder="Dirección de la imagen">
              <div class="mini" style="margin-top:5px">La imagen que se ve al mandar el enlace por WhatsApp o redes.</div>
            </div>
          </div>
        </div>
      </details>

      <div class="edt-acciones">
        <button class="btn" type="submit" onclick="document.getElementById('accion').value='publicar'">Publicar cambios</button>
        <button class="btn ghost" type="submit" onclick="document.getElementById('accion').value='borrador'">Guardar sin publicar</button>
        <span class="mini">«Publicar» lo hace visible para todos.</span>
      </div>
    </form>

    <?php if ($versiones): ?>
      <details class="sec">
        <summary>
          <span class="nom">Versiones anteriores</span>
          <span class="cnt"><?= count($versiones) ?></span>
          <span class="flecha">›</span>
        </summary>
        <div class="cuerpo">
          <div class="mini" style="margin:12px 0 6px">Cada vez que publicas guardamos cómo estaba antes, por si quieres volver.</div>
          <table><tbody>
            <?php foreach ($versiones as $v): ?>
              <tr>
                <td>
                  <strong><?= e(date('d/m/Y', strtotime($v['created_at']))) ?></strong>
                  <span class="mini">a las <?= e(date('H:i', strtotime($v['created_at']))) ?></span>
                  <?php if (!empty($v['autor'])): ?><div class="mini">por <?= e($v['autor']) ?></div><?php endif; ?>
                </td>
                <td style="text-align:right">
                  <a class="btn small ghost" href="/panel/?p=paginas&pagina=<?= e($slug) ?>&restaurar=<?= (int)$v['id'] ?>"
                     onclick="return confirm('Recuperamos esa versión como borrador. Podrás revisarla antes de publicar. ¿Seguimos?')">Recuperar</a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody></table>
        </div>
      </details>
    <?php endif; ?>
  </div>
</div>

<script>
(function () {
  var form = document.getElementById('formPagina');
  if (!form) return;

  /* ============ la vista en vivo ============ */
  var vivo = document.getElementById('vivo');
  var marco = document.getElementById('marco');
  var origen = location.origin;

  function manda(msg) {
    try { vivo.contentWindow.postMessage(msg, origen); } catch (e) { /* nada */ }
  }

  /* Cada campo en vivo recuerda qué texto está pintado ahora mismo en la
     página (empieza siendo lo publicado). Editar manda el reemplazo y
     actualiza ese recuerdo; así los cambios se encadenan sin perderse. */
  var campos = Array.prototype.slice.call(document.querySelectorAll('[data-vivo-pub]'));

  function aplicarBorrador() {
    var cambios = [];
    campos.forEach(function (c) {
      c.dataset.vivoAhora = c.dataset.vivoPub;
      if (c.value !== c.dataset.vivoPub && c.dataset.vivoPub !== '') {
        cambios.push([c.dataset.vivoPub, c.value]);
        c.dataset.vivoAhora = c.value;
      }
    });
    if (cambios.length) manda({ tipo: 'lote', cambios: cambios });
  }
  /* React tarda un momento en pintar; un pequeño respiro y se aplica. */
  vivo.addEventListener('load', function () { setTimeout(aplicarBorrador, 900); });

  campos.forEach(function (c) {
    c.addEventListener('input', function () {
      var antes = c.dataset.vivoAhora || c.dataset.vivoPub || '';
      if (antes !== c.value) {
        manda({ tipo: 'reemplazar', antes: antes, ahora: c.value });
        c.dataset.vivoAhora = c.value;
      }
    });
    c.addEventListener('focus', function () {
      var valor = c.dataset.vivoAhora || c.dataset.vivoPub || c.value;
      manda({ tipo: 'resaltar', valor: valor });
    });
  });

  /* escritorio / teléfono / recargar */
  var bDesk = document.getElementById('vDesk'), bMovil = document.getElementById('vMovil');
  bDesk.classList.add('on');
  bDesk.addEventListener('click', function () { marco.classList.remove('movil'); bDesk.classList.add('on'); bMovil.classList.remove('on'); });
  bMovil.addEventListener('click', function () { marco.classList.add('movil'); bMovil.classList.add('on'); bDesk.classList.remove('on'); });
  document.getElementById('vRecargar').addEventListener('click', function () {
    vivo.src = vivo.src.split('&t=')[0] + '&t=' + Date.now();
  });

  /* ============ la tarjeta de Google, en vivo ============ */
  var seoT = document.getElementById('seoT'), seoD = document.getElementById('seoD');
  var snpT = document.getElementById('snpT'), snpD = document.getElementById('snpD');
  if (seoT && snpT) seoT.addEventListener('input', function () {
    snpT.textContent = seoT.value.trim() || <?= json_encode($reg['nombre'] . ' | Inédito Digital', JSON_UNESCAPED_UNICODE) ?>;
  });
  if (seoD && snpD) seoD.addEventListener('input', function () {
    snpD.textContent = seoD.value.trim() || 'Si dejas la descripción vacía, se usa una automática.';
  });

  /* ============ autoguardado ============ */
  var aviso = null, timer = null;
  function marcar() {
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.style.cssText = 'position:fixed;right:18px;bottom:18px;background:#14141f;border:1px solid #232336;color:#9a97ad;padding:10px 16px;border-radius:999px;font-size:13px;z-index:50';
      document.body.appendChild(aviso);
    }
    aviso.textContent = 'Guardando lo que escribiste…';
    clearTimeout(timer);
    timer = setTimeout(guardar, 2500);
  }
  function guardar() {
    var datos = new FormData(form);
    datos.set('accion', 'borrador');
    fetch(location.href, { method: 'POST', body: datos, redirect: 'manual' })
      .then(function () { if (aviso) aviso.textContent = 'Guardado como borrador'; })
      .catch(function () { if (aviso) aviso.textContent = 'No pudimos guardar. Revisa tu conexión.'; });
  }
  form.addEventListener('input', marcar);

  /* Selector de color: muestra y texto sincronizados en los dos sentidos. */
  document.querySelectorAll('[data-color-para]').forEach(function (sel) {
    var txt = document.querySelector('[data-color-txt="' + sel.dataset.colorPara + '"]');
    if (!txt) return;
    sel.addEventListener('input', function () { txt.value = sel.value; marcar(); });
    txt.addEventListener('input', function () {
      if (/^#[0-9a-fA-F]{6}$/.test(txt.value)) sel.value = txt.value;
    });
  });

  /* Vista previa de la imagen mientras se pega la dirección. */
  document.querySelectorAll('[data-img]').forEach(function (inp) {
    var caja = document.querySelector('[data-vista="' + inp.dataset.img + '"]');
    if (!caja) return;
    inp.addEventListener('input', function () {
      caja.style.backgroundImage = inp.value.trim() ? "url('" + inp.value.trim() + "')" : '';
    });
  });
})();
</script>
