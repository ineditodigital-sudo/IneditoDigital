<?php
/**
 * Páginas de contacto del equipo.
 *
 * Cada integrante tiene la suya en inedito.digital/su-nombre. Es lo que se
 * abre al acercar su tarjeta NFC, así que la dirección tiene que ser corta y
 * no cambiar: se arma sola con el nombre y después ya no se toca.
 *
 * Mismo trato que el resto del panel: borrador aparte de lo publicado, y
 * nada se ve en el sitio hasta darle a Publicar.
 */
require __DIR__ . '/../inc/contenido.php';
require __DIR__ . '/../inc/miembros.php';
require __DIR__ . '/../inc/vcard.php';

$grupos = campos_miembro();
$id = (int)($_GET['id'] ?? 0);

/* ---------------------------------------------------------------- */
/* Acciones                                                          */
/* ---------------------------------------------------------------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $accion = $_POST['accion'] ?? '';
    $id     = (int)($_POST['id'] ?? 0);

    /* --- crear --- */
    if ($accion === 'crear') {
        $nombre = trim((string)($_POST['nombre'] ?? ''));
        if ($nombre === '') { set_flash('Escribe el nombre del integrante para poder crear su página.'); redirect('/panel/?p=miembros'); }

        $slug = slugify($nombre) ?: 'integrante';
        $base = $slug; $n = 2;
        while (in_array($slug, rutas_reservadas(), true)) { $slug = $base . '-' . $n; $n++; }
        $ex = db()->prepare('SELECT id FROM pages WHERE slug = :s');
        $ex->execute([':s' => $slug]);
        while ($ex->fetch()) { $slug = $base . '-' . $n; $n++; $ex->execute([':s' => $slug]); }

        $datos = miembro_limpio(['nombre' => $nombre] + miembro_defaults());
        $json  = json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        db()->prepare("INSERT INTO pages (slug, nombre, ruta, tipo, contenido, borrador, status) VALUES (:s,:n,:r,'miembro',:c,:c2,'draft')")
            ->execute([':s' => $slug, ':n' => $nombre, ':r' => '/' . $slug, ':c' => $json, ':c2' => $json]);
        set_flash('Creamos la página de ' . $nombre . '. Llena sus datos y publícala cuando esté lista.');
        redirect('/panel/?p=miembros&id=' . (int)db()->lastInsertId());
    }

    $q = db()->prepare("SELECT * FROM pages WHERE id = :id AND tipo = 'miembro'");
    $q->execute([':id' => $id]);
    $m = $q->fetch();
    if (!$m) { set_flash('No encontramos esa página.'); redirect('/panel/?p=miembros'); }

    /* --- borrar --- */
    if ($accion === 'borrar') {
        db()->prepare('DELETE FROM page_versions WHERE page_id = :id')->execute([':id' => $id]);
        db()->prepare('DELETE FROM pages WHERE id = :id')->execute([':id' => $id]);
        set_flash('Borramos la página de ' . $m['nombre'] . '.');
        redirect('/panel/?p=miembros');
    }

    /* --- recuperar una versión anterior --- */
    if ($accion === 'restaurar') {
        $v = db()->prepare('SELECT contenido FROM page_versions WHERE id = :v AND page_id = :p');
        $v->execute([':v' => (int)($_POST['version'] ?? 0), ':p' => $id]);
        if ($c = $v->fetchColumn()) {
            db()->prepare('UPDATE pages SET borrador = :b, updated_at = NOW() WHERE id = :id')->execute([':b' => $c, ':id' => $id]);
            set_flash('Recuperamos esa versión como borrador. Revísala y publícala si te gusta.');
        }
        redirect('/panel/?p=miembros&id=' . $id);
    }

    /* --- guardar o publicar --- */
    $datos = miembro_limpio($_POST);
    $json  = json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $nombre = $datos['nombre'] !== '' ? $datos['nombre'] : $m['nombre'];
    $seo = [
        ':st' => trim((string)($_POST['seo_title'] ?? '')),
        ':sd' => trim((string)($_POST['seo_desc'] ?? '')),
    ];

    if ($accion === 'publicar') {
        if (!empty($m['contenido'])) {
            db()->prepare('INSERT INTO page_versions (page_id, contenido, autor) VALUES (:p,:c,:a)')
                ->execute([':p' => $id, ':c' => $m['contenido'], ':a' => $_SESSION['admin_user'] ?? '']);
        }
        db()->prepare("UPDATE pages SET nombre=:n, contenido=:c, borrador=:c2, seo_title=:st, seo_desc=:sd, seo_image=:si, status='published', updated_at=NOW() WHERE id=:id")
            ->execute([':n' => $nombre, ':c' => $json, ':c2' => $json, ':si' => $datos['foto'], ':id' => $id] + $seo);
        set_flash('¡Listo! La página de ' . $nombre . ' ya está en línea.');
    } else {
        db()->prepare('UPDATE pages SET nombre=:n, borrador=:b, seo_title=:st, seo_desc=:sd, seo_image=:si, updated_at=NOW() WHERE id=:id')
            ->execute([':n' => $nombre, ':b' => $json, ':si' => $datos['foto'], ':id' => $id] + $seo);
        if ($accion === 'borrador') set_flash('Guardamos el borrador. Todavía no se ve en el sitio.');
    }
    redirect('/panel/?p=miembros&id=' . $id);
}

$ct = csrf();

/* ---------------------------------------------------------------- */
/* Lista                                                             */
/* ---------------------------------------------------------------- */
if (!$id) {
    $rows = db()->query("SELECT * FROM pages WHERE tipo='miembro' ORDER BY nombre ASC")->fetchAll();
    ?>
    <div class="topbar">
      <div>
        <h1 class="title">Equipo</h1>
        <p class="subt">La página de contacto de cada integrante. Es la que se abre al acercar su tarjeta NFC.</p>
      </div>
    </div>

    <form method="post" class="card">
      <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="accion" value="crear">
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">Agregar a alguien del equipo</div>
      <div class="mini" style="margin-bottom:14px">Solo su nombre. La dirección se arma sola: Armando Trejo &rarr; <code>/armando-trejo</code></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:240px">
          <input type="text" name="nombre" placeholder="Por ejemplo: Armando Trejo" required>
        </div>
        <button class="btn" type="submit">Crear su página</button>
      </div>
    </form>

    <?php if (!$rows): ?>
      <div class="card"><p class="muted" style="text-align:center;padding:26px 0">
        Todavía no hay nadie. Agrega al primer integrante aquí arriba.</p></div>
    <?php else: ?>
      <div class="card"><table>
        <thead><tr><th>Integrante</th><th>Dirección</th><th>Estado</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($rows as $r):
            $d = miembro_con_respaldo(json_decode((string)$r['contenido'], true) ?: []); ?>
          <tr>
            <td>
              <strong><?= e($r['nombre']) ?></strong>
              <?php if ($d['puesto'] !== ''): ?><div class="mini"><?= e($d['puesto']) ?></div><?php endif; ?>
            </td>
            <td><code><?= e($r['ruta']) ?></code></td>
            <td>
              <?php if ($r['status'] === 'published'): ?>
                <span style="color:#5ad18c">En línea</span>
              <?php else: ?>
                <span style="color:#d1a25a">Borrador</span>
              <?php endif; ?>
            </td>
            <td style="text-align:right;white-space:nowrap">
              <a class="btn small ghost" href="/panel/?p=miembros&id=<?= (int)$r['id'] ?>">Editar</a>
              <?php if ($r['status'] === 'published'): ?>
                <a class="btn small ghost" href="<?= e($r['ruta']) ?>" target="_blank">Ver</a>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table></div>
    <?php endif;
    return;
}

/* ---------------------------------------------------------------- */
/* Edición                                                           */
/* ---------------------------------------------------------------- */
$q = db()->prepare("SELECT * FROM pages WHERE id = :id AND tipo = 'miembro'");
$q->execute([':id' => $id]);
$m = $q->fetch();
if (!$m) { set_flash('No encontramos esa página.'); redirect('/panel/?p=miembros'); }

$d = miembro_con_respaldo(json_decode((string)($m['borrador'] ?: $m['contenido']), true) ?: []);
$hayCambios = $m['status'] === 'published' && (string)$m['borrador'] !== (string)$m['contenido'];

$vers = db()->prepare('SELECT id, autor, creado FROM page_versions WHERE page_id = :p ORDER BY id DESC LIMIT 10');
$vers->execute([':p' => $id]);
$vers = $vers->fetchAll();
?>
<div class="topbar">
  <div>
    <a class="mini" href="/panel/?p=miembros">&larr; Equipo</a>
    <h1 class="title"><?= e($m['nombre']) ?></h1>
    <p class="subt">Su dirección es <code><?= e($m['ruta']) ?></code> &mdash; esa es la que se graba en su tarjeta NFC.</p>
  </div>
  <?php if ($m['status'] === 'published'): ?>
    <a class="btn ghost" href="<?= e($m['ruta']) ?>" target="_blank">Ver la página</a>
  <?php endif; ?>
</div>

<?php if ($m['status'] !== 'published'): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <strong>Todavía no está en línea.</strong> Llena lo que quieras y dale a <em>Publicar</em> para que se pueda abrir.
  </div>
<?php elseif ($hayCambios): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <strong>Tienes cambios sin publicar.</strong> El sitio sigue mostrando la versión anterior.
  </div>
<?php endif; ?>

<form method="post" id="f">
  <input type="hidden" name="csrf" value="<?= $ct ?>">
  <input type="hidden" name="id" value="<?= $id ?>">
  <input type="hidden" name="accion" id="accion" value="borrador">

  <?php foreach ($grupos as $gk => $g): ?>
    <div class="card">
      <div style="font-size:17px;font-weight:700;margin-bottom:<?= isset($g['ayuda']) ? '4' : '14' ?>px"><?= e($g['nombre']) ?></div>
      <?php if (isset($g['ayuda'])): ?><div class="mini" style="margin-bottom:14px"><?= e($g['ayuda']) ?></div><?php endif; ?>

      <?php $ultimoEnlace = null;
      foreach ($g['campos'] as $k => $c):
          $v = $d[$k] ?? '';
          $req = !empty($c['req']) ? 'required' : '';
          // Separador entre un enlace y el siguiente, para no leer 48 campos seguidos
          if ($gk === 'enlaces' && preg_match('/^e(\d+)_/', $k, $mm) && $mm[1] !== $ultimoEnlace):
              $ultimoEnlace = $mm[1]; ?>
            <div style="border-top:1px solid var(--line);margin:18px 0 14px;padding-top:14px;font-size:13px;color:var(--mut2)">Enlace <?= e($mm[1]) ?></div>
      <?php endif; ?>
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:13px;color:var(--mut);margin-bottom:5px"><?= e($c['label']) ?></label>

          <?php if ($c['tipo'] === 'parrafo'): ?>
            <textarea name="<?= e($k) ?>" rows="3" <?= $req ?>><?= e($v) ?></textarea>

          <?php elseif ($c['tipo'] === 'switch'): ?>
            <label style="display:flex;align-items:center;gap:9px;font-size:14px;color:var(--txt)">
              <input type="hidden" name="<?= e($k) ?>" value="0">
              <input type="checkbox" name="<?= e($k) ?>" value="1" <?= $v === '1' ? 'checked' : '' ?> style="width:auto;margin:0">
              Sí, mostrarla
            </label>

          <?php elseif ($c['tipo'] === 'lista'): ?>
            <select name="<?= e($k) ?>">
              <?php foreach ($c['opciones'] as $ov => $ol): ?>
                <option value="<?= e($ov) ?>" <?= $v === $ov ? 'selected' : '' ?>><?= e($ol) ?></option>
              <?php endforeach; ?>
            </select>

          <?php elseif ($c['tipo'] === 'color'): ?>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" value="<?= e($v ?: '#000000') ?>" style="width:46px;height:38px;padding:2px"
                     oninput="this.nextElementSibling.value=this.value.toUpperCase()">
              <input type="text" name="<?= e($k) ?>" value="<?= e($v) ?>" style="flex:1"
                     oninput="if(/^#[0-9a-fA-F]{6}$/.test(this.value))this.previousElementSibling.value=this.value">
            </div>

          <?php elseif ($c['tipo'] === 'imagen'): ?>
            <input type="text" name="<?= e($k) ?>" value="<?= e($v) ?>" placeholder="https://…">
            <?php if ($v !== ''): ?>
              <img src="<?= e($v) ?>" alt="" style="margin-top:8px;max-height:110px;border-radius:10px;display:block">
            <?php endif; ?>

          <?php else: ?>
            <input type="text" name="<?= e($k) ?>" value="<?= e($v) ?>" <?= $req ?>
                   <?= $c['tipo'] === 'enlace' ? 'placeholder="https://…"' : '' ?>>
          <?php endif; ?>

          <?php if (isset($c['ayuda'])): ?><div class="mini" style="margin-top:5px"><?= e($c['ayuda']) ?></div><?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endforeach; ?>

  <?php
  /* Lo que de verdad se va a entregar: se arma con el mismo generador que
     sirve el archivo, no con una imitación. La foto se pide aparte para no
     bajar la imagen cada vez que se abre esta pantalla. */
  $vcfTexto = vcard_texto($d, 'https://www.inedito.digital' . $m['ruta'], false);
  $vcfArchivo = vcard_archivo($d, (string)$m['slug']);
  $conFoto = ($d['vcf_foto'] ?? '1') !== '0' && trim((string)$d['foto']) !== '';
  ?>
  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">La tarjeta que se van a guardar</div>
    <div class="mini" style="margin-bottom:14px">
      Esto es exactamente lo que recibe el celular de quien toca “<?= e($d['b_guardar'] ?: 'Guardar mi contacto') ?>”.
      <?php if ($conFoto): ?>La foto se agrega al final, encogida.<?php endif; ?>
    </div>
    <pre style="background:#0a0a10;border:1px solid var(--line);border-radius:10px;padding:14px;overflow:auto;font-size:12px;line-height:1.55;color:#c9c9dd;margin:0"><?= e($vcfTexto) ?><?php if ($conFoto): ?>PHOTO;ENCODING=b;TYPE=JPEG:<span style="color:var(--mut2)">(la foto, ya encogida)</span>
<?php endif; ?></pre>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;align-items:center">
      <?php if ($m['status'] === 'published'): ?>
        <a class="btn small ghost" href="<?= e($m['ruta']) ?>.vcf" target="_blank">Descargar para probarla</a>
      <?php endif; ?>
      <span class="mini">Se guarda como <code><?= e($vcfArchivo) ?></code></span>
    </div>
    <?php if ($m['status'] !== 'published'): ?>
      <div class="mini" style="margin-top:10px">La podrás descargar en cuanto publiques la página.</div>
    <?php endif; ?>
  </div>

  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Cómo se ve al compartir</div>
    <div class="mini" style="margin-bottom:14px">Lo que aparece en Google y en la vista previa cuando alguien manda el enlace. Si lo dejas vacío lo armamos solos.</div>
    <div style="margin-bottom:14px">
      <label style="display:block;font-size:13px;color:var(--mut);margin-bottom:5px">Título para buscadores</label>
      <input type="text" name="seo_title" value="<?= e($m['seo_title']) ?>" maxlength="200">
    </div>
    <div>
      <label style="display:block;font-size:13px;color:var(--mut);margin-bottom:5px">Descripción corta</label>
      <textarea name="seo_desc" rows="2" maxlength="300"><?= e($m['seo_desc']) ?></textarea>
    </div>
  </div>

  <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 30px">
    <button class="btn" type="submit" onclick="document.getElementById('accion').value='publicar'">Publicar cambios</button>
    <button class="btn ghost" type="submit" onclick="document.getElementById('accion').value='borrador'">Guardar sin publicar</button>
  </div>
</form>

<?php if ($vers): ?>
  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Versiones anteriores</div>
    <div class="mini" style="margin-bottom:14px">Cada vez que publicas guardamos cómo estaba antes. Recuperar la trae como borrador, para que la revises.</div>
    <table><tbody>
      <?php foreach ($vers as $v): ?>
        <tr>
          <td><?= e($v['creado']) ?><?php if ($v['autor']): ?> <span class="mini">por <?= e($v['autor']) ?></span><?php endif; ?></td>
          <td style="text-align:right">
            <form method="post" style="display:inline">
              <input type="hidden" name="csrf" value="<?= $ct ?>">
              <input type="hidden" name="id" value="<?= $id ?>">
              <input type="hidden" name="accion" value="restaurar">
              <input type="hidden" name="version" value="<?= (int)$v['id'] ?>">
              <button class="btn small ghost" type="submit">Recuperar</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody></table>
  </div>
<?php endif; ?>

<div class="card" style="border-color:#3a1212">
  <div style="font-size:17px;font-weight:700;margin-bottom:4px">Borrar esta página</div>
  <div class="mini" style="margin-bottom:14px">Si esta persona ya tiene tarjetas NFC impresas, dejarán de funcionar. Esto no se puede deshacer.</div>
  <form method="post" onsubmit="return confirm('¿Seguro que quieres borrar la página de <?= e($m['nombre']) ?>? Sus tarjetas NFC dejarán de funcionar.')">
    <input type="hidden" name="csrf" value="<?= $ct ?>">
    <input type="hidden" name="id" value="<?= $id ?>">
    <input type="hidden" name="accion" value="borrar">
    <button class="btn small ghost" type="submit" style="color:#e07b7b;border-color:#5a2a2a">Borrar</button>
  </form>
</div>
