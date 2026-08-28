<?php
/**
 * Crear y componer páginas nuevas con bloques.
 *
 * El cliente elige piezas de un catálogo cerrado y las acomoda. No escribe
 * HTML, no elige rutas técnicas y no puede dejar la página sin dirección:
 * la dirección se arma sola a partir del nombre.
 */
require __DIR__ . '/../inc/bloques.php';
require __DIR__ . '/../inc/contenido.php';

$cat = catalogo_bloques();
$id  = (int)($_GET['id'] ?? 0);

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
        if ($nombre === '') { set_flash('Ponle un nombre a la página para poder crearla.'); redirect('/panel/?p=nueva'); }

        $slug = slugify($nombre);
        if ($slug === '') $slug = 'pagina';

        // Ni pisar páginas del sitio ni chocar con secciones que ya existen
        $reservadas = array_merge(array_keys(registro_paginas()),
            ['servicios','servicios-ia','portafolio','blog','contacto','nosotros','privacidad','terminos','admin','panel','api','assets']);
        $base = $slug; $n = 2;
        while (in_array($slug, $reservadas, true)) { $slug = $base . '-' . $n; $n++; }
        $ex = db()->prepare('SELECT id FROM pages WHERE slug = :s');
        $ex->execute([':s' => $slug]);
        while ($ex->fetch()) { $slug = $base . '-' . $n; $n++; $ex->execute([':s' => $slug]); }

        $inicial = json_encode([bloque_nuevo('portada')], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        db()->prepare("INSERT INTO pages (slug, nombre, ruta, tipo, contenido, borrador, status) VALUES (:s,:n,:r,'bloques',:c,:c2,'draft')")
            ->execute([':s' => $slug, ':n' => $nombre, ':r' => '/' . $slug, ':c' => $inicial, ':c2' => $inicial]);
        $nid = (int)db()->lastInsertId();
        set_flash('Creamos tu página. Ahora agrégale contenido y publícala cuando esté lista.');
        redirect('/panel/?p=nueva&id=' . $nid);
    }

    $q = db()->prepare("SELECT * FROM pages WHERE id = :id AND tipo = 'bloques'");
    $q->execute([':id' => $id]);
    $pag = $q->fetch();
    if (!$pag) { set_flash('No encontramos esa página.'); redirect('/panel/?p=nueva'); }

    /* --- borrar la página --- */
    if ($accion === 'borrar_pagina') {
        db()->prepare('DELETE FROM page_versions WHERE page_id = :id')->execute([':id' => $id]);
        db()->prepare('DELETE FROM pages WHERE id = :id')->execute([':id' => $id]);
        set_flash('Borramos la página.');
        redirect('/panel/?p=nueva');
    }

    // Bloques que vienen del formulario, ya filtrados contra el catálogo
    $bloques = bloques_limpios(json_decode((string)($_POST['bloques'] ?? '[]'), true));

    /* --- agregar, mover, quitar --- */
    if ($accion === 'agregar') {
        $nb = bloque_nuevo((string)($_POST['tipo_nuevo'] ?? ''));
        if ($nb) $bloques[] = $nb;
    } elseif ($accion === 'subir' || $accion === 'bajar') {
        $i = (int)($_POST['indice'] ?? -1);
        $j = $accion === 'subir' ? $i - 1 : $i + 1;
        if (isset($bloques[$i], $bloques[$j])) { $t = $bloques[$i]; $bloques[$i] = $bloques[$j]; $bloques[$j] = $t; }
    } elseif ($accion === 'quitar') {
        $i = (int)($_POST['indice'] ?? -1);
        if (isset($bloques[$i])) { array_splice($bloques, $i, 1); }
    }

    $json = json_encode($bloques, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $seo = [
        ':st' => trim((string)($_POST['seo_title'] ?? '')),
        ':sd' => trim((string)($_POST['seo_desc'] ?? '')),
        ':si' => trim((string)($_POST['seo_image'] ?? '')),
    ];
    $menu = isset($_POST['en_menu']) ? 1 : 0;
    $nombre = trim((string)($_POST['nombre'] ?? $pag['nombre'])) ?: $pag['nombre'];

    if ($accion === 'publicar') {
        if (!empty($pag['contenido'])) {
            db()->prepare('INSERT INTO page_versions (page_id, contenido, autor) VALUES (:p,:c,:a)')
                ->execute([':p' => $id, ':c' => $pag['contenido'], ':a' => $_SESSION['admin_user'] ?? '']);
        }
        db()->prepare("UPDATE pages SET nombre=:n, contenido=:c, borrador=:c2, seo_title=:st, seo_desc=:sd, seo_image=:si, en_menu=:m, status='published', updated_at=NOW() WHERE id=:id")
            ->execute([':n' => $nombre, ':c' => $json, ':c2' => $json, ':m' => $menu, ':id' => $id] + $seo);
        set_flash('¡Listo! Tu página ya está en línea.');
    } else {
        db()->prepare('UPDATE pages SET nombre=:n, borrador=:b, seo_title=:st, seo_desc=:sd, seo_image=:si, en_menu=:m, updated_at=NOW() WHERE id=:id')
            ->execute([':n' => $nombre, ':b' => $json, ':m' => $menu, ':id' => $id] + $seo);
        if ($accion === 'borrador') set_flash('Guardamos tu borrador. Todavía no se ve en el sitio.');
    }
    redirect('/panel/?p=nueva&id=' . $id);
}

$ct = csrf();

/* ---------------------------------------------------------------- */
/* Lista de páginas creadas                                          */
/* ---------------------------------------------------------------- */
if (!$id) {
    $rows = db()->query("SELECT * FROM pages WHERE tipo='bloques' ORDER BY id DESC")->fetchAll();
    ?>
    <div class="topbar">
      <div>
        <div class="kicker">Contenido libre</div><h1 class="title">Páginas que tú creaste</h1>
        <p class="subt">Arma páginas nuevas combinando bloques. Sin tocar código.</p>
      </div>
    </div>

    <form method="post" class="card">
      <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="accion" value="crear">
      <div style="font-size:17px;font-weight:700;margin-bottom:4px">Crear una página nueva</div>
      <div class="mini" style="margin-bottom:14px">Solo dinos cómo se va a llamar. La dirección se arma sola.</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div style="flex:1;min-width:240px">
          <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Nombre de la página</label>
          <input type="text" name="nombre" placeholder="Por ejemplo: Promociones de verano" required>
        </div>
        <button class="btn" type="submit">Crear página</button>
      </div>
    </form>

    <?php if (!$rows): ?>
      <div class="card"><p class="muted" style="text-align:center;padding:26px 0">
        Todavía no has creado ninguna página. Empieza arriba.
      </p></div>
    <?php else: ?>
      <div class="pag-grid">
        <?php foreach ($rows as $r):
          $nb = count(json_decode((string)$r['borrador'], true) ?: []);
          $pendiente = ($r['borrador'] ?? '') !== ($r['contenido'] ?? '');
        ?>
          <a class="pag-card" href="/panel/?p=nueva&id=<?= (int)$r['id'] ?>">
            <div class="pag-mini" aria-hidden style="background:<?= grad_casa('nueva' . (string)$r['slug']) ?>">
              <i class="pag-ruta-pill"><?= e($r['ruta']) ?></i>
            </div>
            <div class="pag-info">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
                <div class="n" style="text-transform:none;font-family:inherit;font-size:14.5px;font-weight:700"><?= e($r['nombre']) ?></div>
                <span class="badge b-<?= $r['status'] === 'published' ? 'published' : 'draft' ?>"><?= $r['status'] === 'published' ? 'En línea' : 'Borrador' ?></span>
              </div>
              <div class="r"><?= $nb ?> bloque(s)<?= $pendiente && $r['status'] === 'published' ? ' · cambios pendientes' : '' ?></div>
              <div class="pag-pie" style="margin-top:11px">
                <span class="f"></span>
                <span class="e">Editar →</span>
              </div>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    <?php endif;
    return;
}

/* ---------------------------------------------------------------- */
/* Editor de una página                                              */
/* ---------------------------------------------------------------- */
$q = db()->prepare("SELECT * FROM pages WHERE id = :id AND tipo = 'bloques'");
$q->execute([':id' => $id]);
$pag = $q->fetch();
if (!$pag) { set_flash('No encontramos esa página.'); redirect('/panel/?p=nueva'); }

$bloques = bloques_limpios(json_decode((string)($pag['borrador'] ?: $pag['contenido']), true));
$pendiente = ($pag['borrador'] ?? '') !== ($pag['contenido'] ?? '');
?>
<div class="topbar">
  <div>
    <div class="kicker">Contenido libre</div><h1 class="title"><?= e($pag['nombre']) ?></h1>
    <p class="subt">
      <a href="/panel/?p=nueva" style="color:#b58bff">&larr; Mis páginas</a>
      &nbsp;·&nbsp; Dirección: <strong><?= e($pag['ruta']) ?></strong>
    </p>
  </div>
  <?php if ($pag['status'] === 'published'): ?>
    <a class="btn ghost" href="<?= e($pag['ruta']) ?>" target="_blank">Ver la página</a>
  <?php endif; ?>
</div>

<?php if ($pag['status'] !== 'published'): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <div class="mini" style="color:#e0c07a">Esta página <strong>todavía no está en línea</strong>. Nadie puede verla hasta que le des a «Publicar página».</div>
  </div>
<?php elseif ($pendiente): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <div class="mini" style="color:#e0c07a">Tienes cambios guardados que todavía no se ven en el sitio.</div>
  </div>
<?php endif; ?>

<form method="post" id="formBloques">
  <input type="hidden" name="csrf" value="<?= $ct ?>">
  <input type="hidden" name="id" value="<?= $id ?>">
  <input type="hidden" name="accion" id="accion" value="borrador">
  <input type="hidden" name="indice" id="indice" value="">
  <input type="hidden" name="tipo_nuevo" id="tipo_nuevo" value="">
  <input type="hidden" name="bloques" id="bloques" value="">

  <div class="card">
    <div class="rowf">
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Nombre de la página</label>
        <input type="text" name="nombre" value="<?= e($pag['nombre']) ?>">
      </div>
      <div>
        <label style="display:flex;align-items:center;gap:10px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--txt);margin-top:30px;cursor:pointer">
          <input type="checkbox" name="en_menu" <?= (int)$pag['en_menu'] ? 'checked' : '' ?> style="width:auto;margin:0">
          Mostrarla en el menú del sitio
        </label>
      </div>
    </div>
  </div>

  <?php if (!$bloques): ?>
    <div class="card"><p class="muted" style="text-align:center;padding:24px 0">
      Esta página está vacía. Agrégale un bloque abajo para empezar.
    </p></div>
  <?php endif; ?>

  <?php foreach ($bloques as $i => $b):
    $def = $cat[$b['tipo']]; ?>
    <div class="card" data-bloque="<?= $i ?>">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:6px">
        <div>
          <div style="font-size:17px;font-weight:700"><?= e($def['nombre']) ?></div>
          <div class="mini" style="margin-top:4px"><?= e($def['ayuda']) ?></div>
        </div>
        <div class="actions">
          <?php if ($i > 0): ?><button class="btn small ghost" type="submit" onclick="mover('subir',<?= $i ?>)" title="Subir">&uarr;</button><?php endif; ?>
          <?php if ($i < count($bloques) - 1): ?><button class="btn small ghost" type="submit" onclick="mover('bajar',<?= $i ?>)" title="Bajar">&darr;</button><?php endif; ?>
          <button class="btn small danger" type="submit" onclick="return quitar(<?= $i ?>)">Quitar</button>
        </div>
      </div>

      <label style="display:flex;align-items:center;gap:10px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--txt);margin:14px 0 4px;cursor:pointer">
        <input type="checkbox" class="bv" data-i="<?= $i ?>" <?= ($b['visible'] ?? '1') !== '0' ? 'checked' : '' ?> style="width:auto;margin:0">
        Mostrar este bloque
      </label>

      <div class="rowf">
      <?php foreach ($def['campos'] as $ck => $campo):
        $v = $b['datos'][$ck] ?? '';
        $ancho = in_array($campo['tipo'], ['parrafo','imagen'], true);
        if ($ancho) echo '</div><div class="rowf" style="grid-template-columns:1fr">';
      ?>
        <div>
          <?php if ($campo['tipo'] === 'switch'): ?>
            <label style="display:flex;align-items:center;gap:10px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--txt);margin:14px 0 4px;cursor:pointer">
              <input type="checkbox" class="bc" data-i="<?= $i ?>" data-k="<?= e($ck) ?>" data-sw="1" <?= $v === '1' ? 'checked' : '' ?> style="width:auto;margin:0">
              <?= e($campo['label']) ?>
            </label>
          <?php else: ?>
            <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)"><?= e($campo['label']) ?></label>
            <?php if ($campo['tipo'] === 'parrafo'): ?>
              <textarea class="bc" data-i="<?= $i ?>" data-k="<?= e($ck) ?>" style="min-height:80px"><?= e($v) ?></textarea>
            <?php else: ?>
              <input type="text" class="bc" data-i="<?= $i ?>" data-k="<?= e($ck) ?>" value="<?= e($v) ?>"
                     <?= $campo['tipo'] === 'imagen' ? 'placeholder="Dirección de la imagen"' : '' ?>>
            <?php endif; ?>
          <?php endif; ?>
          <?php if (!empty($campo['ayuda'])): ?><div class="mini" style="margin-top:5px"><?= e($campo['ayuda']) ?></div><?php endif; ?>
        </div>
      <?php if ($ancho) echo '</div><div class="rowf">'; ?>
      <?php endforeach; ?>
      </div>
    </div>
  <?php endforeach; ?>

  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Agregar un bloque</div>
    <div class="mini" style="margin-bottom:14px">Elige qué quieres poner. Puedes acomodarlos después con las flechas.</div>
    <div class="actions">
      <?php foreach ($cat as $tk => $tdef): ?>
        <button class="btn small ghost" type="submit" onclick="agregar('<?= e($tk) ?>')" title="<?= e($tdef['ayuda']) ?>">
          + <?= e($tdef['nombre']) ?>
        </button>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Cómo se ve al compartir</div>
    <div class="mini" style="margin-bottom:10px">Lo que aparece en Google y al mandar el enlace por WhatsApp. Si lo dejas vacío usamos uno automático.</div>
    <div class="rowf" style="grid-template-columns:1fr">
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Título para buscadores</label>
        <input type="text" name="seo_title" maxlength="70" value="<?= e($pag['seo_title'] ?? '') ?>">
      </div>
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Descripción corta</label>
        <textarea name="seo_desc" maxlength="180" style="min-height:64px"><?= e($pag['seo_desc'] ?? '') ?></textarea>
      </div>
      <div>
        <label style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--txt)">Imagen para compartir</label>
        <input type="text" name="seo_image" value="<?= e($pag['seo_image'] ?? '') ?>" placeholder="Dirección de la imagen">
      </div>
    </div>
  </div>

  <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:22px 0 16px">
    <button class="btn" type="submit" onclick="document.getElementById('accion').value='publicar'">Publicar página</button>
    <button class="btn ghost" type="submit" onclick="document.getElementById('accion').value='borrador'">Guardar sin publicar</button>
  </div>

  <div style="margin-bottom:40px">
    <button class="btn small danger" type="submit"
            onclick="if(!confirm('Se va a borrar esta página y ya no se podrá recuperar. ¿Seguro?')) return false; document.getElementById('accion').value='borrar_pagina';">
      Borrar esta página
    </button>
  </div>
</form>

<script>
/* Los bloques viajan como un solo campo, armado desde los inputs. Así el
   servidor recibe una lista ordenada y solo con campos conocidos. */
(function () {
  var form = document.getElementById('formBloques');
  var tipos = <?= json_encode(array_map(fn($b) => $b['tipo'], $bloques), JSON_UNESCAPED_UNICODE) ?>;

  function recolectar() {
    var out = tipos.map(function (t) { return { tipo: t, visible: '1', datos: {} }; });
    document.querySelectorAll('.bv').forEach(function (el) {
      var i = +el.dataset.i; if (out[i]) out[i].visible = el.checked ? '1' : '0';
    });
    document.querySelectorAll('.bc').forEach(function (el) {
      var i = +el.dataset.i, k = el.dataset.k; if (!out[i]) return;
      out[i].datos[k] = el.dataset.sw ? (el.checked ? '1' : '0') : el.value;
    });
    document.getElementById('bloques').value = JSON.stringify(out);
  }

  form.addEventListener('submit', recolectar);

  window.mover = function (dir, i) {
    document.getElementById('accion').value = dir;
    document.getElementById('indice').value = i;
  };
  window.quitar = function (i) {
    if (!confirm('¿Quitamos este bloque de la página?')) return false;
    document.getElementById('accion').value = 'quitar';
    document.getElementById('indice').value = i;
    return true;
  };
  window.agregar = function (tipo) {
    document.getElementById('accion').value = 'agregar';
    document.getElementById('tipo_nuevo').value = tipo;
  };
})();
</script>
