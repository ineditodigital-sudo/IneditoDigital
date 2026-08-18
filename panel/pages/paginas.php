<?php
/**
 * Editor de páginas del sitio.
 *
 * El formulario se genera solo a partir de panel/inc/contenido.php, así que
 * agregar un campo editable es declararlo ahí, no escribir pantallas nuevas.
 *
 * Borrador vs publicado: se guardan por separado. El sitio siempre sirve lo
 * publicado, así que se puede trabajar tranquilo sin que se vea a medias.
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
        // Antes de publicar se guarda lo que había, para poder volver atrás
        if (!empty($fila['contenido'])) {
            db()->prepare('INSERT INTO page_versions (page_id, contenido, autor) VALUES (:p,:c,:a)')
                ->execute([':p' => (int)$fila['id'], ':c' => $fila['contenido'], ':a' => $_SESSION['admin_user'] ?? '']);
        }
        db()->prepare('UPDATE pages SET contenido=:c, borrador=:c, seo_title=:st, seo_desc=:sd, seo_image=:si, updated_at=NOW() WHERE id=:id')
            ->execute([':c' => $json, ':id' => (int)$fila['id']] + $seo);
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

/* ---------------------------------------------------------------- */
/* Lista de páginas                                                  */
/* ---------------------------------------------------------------- */
if (!$slug || !isset($registro[$slug])) {
    $estado = [];
    foreach (db()->query('SELECT slug, contenido, borrador, updated_at FROM pages') as $r) $estado[$r['slug']] = $r;
    ?>
    <div class="topbar"><div>
      <h1 class="title">Páginas del sitio</h1>
      <p class="subt">Elige una página para cambiar sus textos. Lo demás del diseño se queda igual.</p>
    </div></div>

    <div class="grid-kpi" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
      <?php foreach ($registro as $sk => $reg):
        $e = $estado[$sk] ?? null;
        $hayBorrador = $e && $e['borrador'] !== ($e['contenido'] ?? null) && !empty($e['borrador']);
      ?>
        <a class="kpi" href="/panel/?p=paginas&pagina=<?= e($sk) ?>" style="display:block">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
            <div>
              <div style="font-size:17px;font-weight:700"><?= e($reg['nombre']) ?></div>
              <div class="mini" style="margin-top:4px"><?= e($reg['ruta']) ?></div>
            </div>
            <?php if ($hayBorrador): ?><span class="badge b-draft">Borrador</span><?php endif; ?>
          </div>
          <div class="muted" style="margin-top:12px;font-size:13px"><?= e($reg['ayuda'] ?? '') ?></div>
          <div class="mini" style="margin-top:12px;color:#b58bff">Editar &rarr;</div>
        </a>
      <?php endforeach; ?>
    </div>
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

// Se edita siempre sobre el borrador; si no hay, sobre lo publicado
$fuente = $fila['borrador'] ?? ($fila['contenido'] ?? null);
$val = contenido_con_respaldo($slug, $fuente);

$versiones = [];
if (!empty($fila['id'])) {
    $vq = db()->prepare('SELECT id, autor, created_at FROM page_versions WHERE page_id = :p ORDER BY id DESC LIMIT 8');
    $vq->execute([':p' => (int)$fila['id']]);
    $versiones = $vq->fetchAll();
}
$hayBorrador = !empty($fila['borrador']) && ($fila['borrador'] !== ($fila['contenido'] ?? null));
?>
<div class="topbar">
  <div>
    <h1 class="title"><?= e($reg['nombre']) ?></h1>
    <p class="subt">
      <a href="/panel/?p=paginas" style="color:#b58bff">&larr; Todas las páginas</a>
      &nbsp;·&nbsp; <?= e($reg['ayuda'] ?? '') ?>
    </p>
  </div>
  <a class="btn ghost" href="<?= e($reg['ruta']) ?>" target="_blank">Ver la página</a>
</div>

<?php if ($hayBorrador): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <div class="mini" style="color:#e0c07a">
      Tienes cambios guardados que <strong>todavía no se ven en el sitio</strong>. Cuando estés conforme, usa «Publicar cambios».
    </div>
  </div>
<?php endif; ?>

<form method="post" id="formPagina">
  <input type="hidden" name="csrf" value="<?= $ct ?>">
  <input type="hidden" name="slug" value="<?= e($slug) ?>">
  <input type="hidden" name="accion" id="accion" value="borrador">

  <?php foreach ($reg['secciones'] as $sk => $sec): ?>
    <div class="card">
      <div style="border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:6px">
        <div style="font-size:17px;font-weight:700"><?= e($sec['nombre']) ?></div>
        <?php if (!empty($sec['ayuda'])): ?><div class="mini" style="margin-top:4px"><?= e($sec['ayuda']) ?></div><?php endif; ?>
      </div>

      <?php
      $campos = $sec['campos'];
      // Los switch van arriba y solos, para que se lean como un interruptor
      foreach ($campos as $ck => $campo):
          if ($campo['tipo'] !== 'switch') continue;
          $n = "c__{$sk}__{$ck}";
          $on = ($val[$sk][$ck] ?? '1') === '1';
      ?>
        <label style="display:flex;align-items:center;gap:10px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--txt);margin:16px 0 4px;cursor:pointer">
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
          $ancho = in_array($campo['tipo'], ['parrafo','imagen','enlace'], true);
          if ($ancho) echo '</div><div class="rowf" style="grid-template-columns:1fr">';
      ?>
        <div>
          <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)"><?= e($campo['label']) ?></label>
          <?php if ($campo['tipo'] === 'parrafo'): ?>
            <textarea name="<?= $n ?>" style="min-height:90px"><?= e($v) ?></textarea>

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
            <input type="text" name="<?= $n ?>" value="<?= e($v) ?>">
          <?php endif; ?>
          <?php if (!empty($campo['ayuda'])): ?><div class="mini" style="margin-top:5px"><?= e($campo['ayuda']) ?></div><?php endif; ?>
        </div>
      <?php if ($ancho) echo '</div><div class="rowf">'; ?>
      <?php endforeach; ?>
      </div>
    </div>
  <?php endforeach; ?>

  <div class="card">
    <div style="border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:6px">
      <div style="font-size:17px;font-weight:700">Cómo se ve al compartir esta página</div>
      <div class="mini" style="margin-top:4px">
        Esto es lo que aparece en Google y cuando alguien manda el enlace por WhatsApp. Si lo dejas vacío usamos uno automático.
      </div>
    </div>
    <div class="rowf" style="grid-template-columns:1fr">
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Título para buscadores</label>
        <input type="text" name="seo_title" maxlength="70" value="<?= e($fila['seo_title'] ?? '') ?>">
        <div class="mini" style="margin-top:5px">Lo ideal son unas 60 letras. Si es más largo, Google lo corta.</div>
      </div>
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Descripción corta</label>
        <textarea name="seo_desc" maxlength="180" style="min-height:70px"><?= e($fila['seo_desc'] ?? '') ?></textarea>
        <div class="mini" style="margin-top:5px">Dos renglones explicando de qué trata la página.</div>
      </div>
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Imagen para compartir</label>
        <input type="text" name="seo_image" value="<?= e($fila['seo_image'] ?? '') ?>" placeholder="Dirección de la imagen">
        <div class="mini" style="margin-top:5px">La imagen que se ve al mandar el enlace por WhatsApp o redes.</div>
      </div>
    </div>
  </div>

  <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:22px 0 40px">
    <button class="btn" type="submit" onclick="document.getElementById('accion').value='publicar'">Publicar cambios</button>
    <button class="btn ghost" type="submit" onclick="document.getElementById('accion').value='borrador'">Guardar sin publicar</button>
    <span class="mini" style="margin-left:6px">«Publicar» lo deja visible para todos. «Guardar sin publicar» lo deja pendiente para ti.</span>
  </div>
</form>

<?php if ($versiones): ?>
  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Versiones anteriores</div>
    <div class="mini" style="margin-bottom:14px">Cada vez que publicas guardamos cómo estaba antes, por si quieres volver.</div>
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
<?php endif; ?>

<script>
/* Autoguardado: si el cliente se distrae, no pierde lo escrito. */
(function () {
  var form = document.getElementById('formPagina');
  if (!form) return;
  var aviso = null, timer = null;

  function marcar() {
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.style.cssText = 'position:fixed;right:18px;bottom:18px;background:#14141f;border:1px solid #21212e;color:#8a8aa0;padding:10px 16px;border-radius:999px;font-size:13px;z-index:50';
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

  /* Selector de color: la muestra y el texto van sincronizados en los dos
     sentidos, para que el cliente no tenga que escribir códigos raros. */
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
