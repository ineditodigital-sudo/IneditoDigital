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
        <div class="kicker">La casa</div><h1 class="title">Equipo</h1>
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
      <div class="mie-grid">
        <?php foreach ($rows as $r):
            $d = miembro_con_respaldo(json_decode((string)$r['contenido'], true) ?: []);
            $foto = trim((string)($d['foto'] ?? ''));
            $palabras = preg_split('/\s+/u', trim((string)$r['nombre'])) ?: [];
            $ini = mb_strtoupper(mb_substr($palabras[0] ?? '?', 0, 1) . mb_substr($palabras[1] ?? '', 0, 1));
        ?>
          <div class="mie-card">
            <span class="mie-foto" style="<?= $foto !== '' ? 'background-image:url(' . e($foto) . ')' : 'background:' . grad_casa($r['nombre']) ?>"><?= $foto === '' ? e($ini) : '' ?></span>
            <div class="mie-n"><?= e($r['nombre']) ?></div>
            <?php if ($d['puesto'] !== ''): ?><div class="mie-p"><?= e($d['puesto']) ?></div><?php endif; ?>
            <div class="mie-r"><?= e($r['ruta']) ?></div>
            <div style="margin-top:9px">
              <?php if ($r['status'] === 'published'): ?><span class="badge b-published">En línea</span>
              <?php else: ?><span class="badge b-draft">Borrador</span><?php endif; ?>
            </div>
            <div class="mie-acc">
              <a class="btn small ghost" href="/panel/?p=miembros&id=<?= (int)$r['id'] ?>">Editar</a>
              <?php if ($r['status'] === 'published'): ?><a class="btn small ghost" href="<?= e($r['ruta']) ?>" target="_blank">Ver</a><?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
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

$vers = db()->prepare('SELECT id, autor, created_at FROM page_versions WHERE page_id = :p ORDER BY id DESC LIMIT 10');
$vers->execute([':p' => $id]);
$vers = $vers->fetchAll();

/* Un ícono por grupo, para que la lista de secciones se lea de un vistazo. */
$iconos_grupo = [
    'quien'      => 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8',
    'contacto'   => 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z',
    'redes'      => 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98',
    'enlaces'    => 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
    'botones'    => 'M4 7V4h16v3M9 20h6M12 4v16',
    'tarjeta'    => 'M3 5h18v14H3zM3 10h18M7 15h4',
    'apariencia' => 'M12 2l3 6 6 .9-4.5 4.2 1.1 6.4L12 16.5 6.4 19.5l1.1-6.4L3 8.9 9 8z',
];

/* Cuáles vienen ya llenos, para no obligar a abrir todo buscando. */
$grupo_lleno = [];
foreach ($grupos as $gk => $g) {
    $n = 0;
    foreach ($g['campos'] as $k => $c) {
        if ($c['tipo'] === 'switch' || $c['tipo'] === 'lista' || $c['tipo'] === 'color') continue;
        if (trim((string)($d[$k] ?? '')) !== '') $n++;
    }
    $grupo_lleno[$gk] = $n;
}
?>
<style>
  .ed { display:grid; grid-template-columns:minmax(0,1fr) 400px; gap:24px; align-items:start; }
  @media (max-width:1180px){ .ed { grid-template-columns:minmax(0,1fr); } .ed-prev { position:static !important; } }

  .sec { background:var(--card); border:1px solid var(--line); border-radius:14px; margin-bottom:12px; overflow:hidden; }
  .sec > summary { list-style:none; cursor:pointer; padding:15px 18px; display:flex; align-items:center; gap:12px; }
  .sec > summary::-webkit-details-marker { display:none; }
  .sec > summary:hover { background:var(--card2); }
  .sec svg.ic { width:17px; height:17px; stroke:var(--pur2); fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; flex-shrink:0; }
  .sec .st { font-size:15px; font-weight:700; flex:1; }
  .sec .cnt { font-size:11px; color:var(--mut2); background:var(--card2); border:1px solid var(--line); border-radius:20px; padding:2px 9px; }
  .sec .fl { transition:transform .18s; stroke:var(--mut2); }
  .sec[open] .fl { transform:rotate(90deg); }
  .sec .cuerpo { padding:4px 18px 18px; border-top:1px solid var(--line); }
  .sec .ay { font-size:12px; color:var(--mut); margin:12px 0 4px; line-height:1.5; }

  .campo { margin-bottom:14px; }
  .campo > label.et { display:block; font-size:12px; color:var(--mut); margin-bottom:5px; }
  .campo .pista { font-size:11px; color:var(--mut2); margin-top:5px; line-height:1.45; }
  .dos { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media (max-width:620px){ .dos { grid-template-columns:1fr; } }

  .swatch { display:flex; gap:8px; align-items:center; }
  .swatch input[type=color] { width:44px; height:38px; padding:2px; flex-shrink:0; }

  .fotoprev { display:flex; gap:12px; align-items:center; margin-top:9px; }
  .fotoprev img { width:58px; height:58px; border-radius:50%; object-fit:cover; border:2px solid var(--pur); }

  .enl { background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:14px; margin-bottom:10px; }
  .enl.off { opacity:.5; }
  .enl .cab { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .enl .cab .num { font-size:12px; font-weight:700; color:var(--mut); flex:1; }
  .sw { display:inline-flex; align-items:center; gap:8px; font-size:12px; color:var(--txt); cursor:pointer; }
  .sw input { width:auto; margin:0; }

  .ed-prev { position:sticky; top:24px; }
  .tel { background:#000; border:8px solid #1b1b26; border-radius:34px; overflow:hidden; box-shadow:0 18px 50px rgba(0,0,0,.5); }
  .tel iframe { display:block; width:100%; height:640px; border:0; background:#0D0010; }
  .prevbar { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  .prevbar .t { font-size:12px; color:var(--mut); flex:1; }
  .punto { width:7px; height:7px; border-radius:50%; background:var(--pur2); }
  .punto.viva { animation:lat 1.6s ease-in-out infinite; }
  @keyframes lat { 0%,100%{opacity:1} 50%{opacity:.25} }
</style>

<div class="topbar">
  <div>
    <a class="mini" href="/panel/?p=miembros">&larr; Equipo</a>
    <div class="kicker">La casa</div><h1 class="title"><?= e($m['nombre']) ?></h1>
    <p class="subt">Su dirección es <code><?= e($m['ruta']) ?></code> &mdash; esa es la que se graba en su tarjeta NFC.</p>
  </div>
  <?php if ($m['status'] === 'published'): ?>
    <a class="btn ghost" href="<?= e($m['ruta']) ?>" target="_blank">Abrir en grande</a>
  <?php endif; ?>
</div>

<?php if ($m['status'] !== 'published'): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <strong>Todavía no está en línea.</strong> Llena lo que quieras y dale a <em>Publicar</em> para que se pueda abrir. Aquí al lado la ves como quedará.
  </div>
<?php elseif ($hayCambios): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <strong>Tienes cambios sin publicar.</strong> El sitio sigue mostrando la versión anterior.
  </div>
<?php endif; ?>

<div class="ed">
  <!-- ================= formulario ================= -->
  <div>
    <form method="post" id="f">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="accion" id="accion" value="borrador">

      <?php foreach ($grupos as $gk => $g): ?>
        <details class="sec" <?= $gk === 'quien' ? 'open' : '' ?>>
          <summary>
            <svg class="ic" viewBox="0 0 24 24"><path d="<?= e($iconos_grupo[$gk] ?? '') ?>"/></svg>
            <span class="st"><?= e($g['nombre']) ?></span>
            <?php if ($grupo_lleno[$gk] > 0): ?><span class="cnt"><?= (int)$grupo_lleno[$gk] ?> llenos</span><?php endif; ?>
            <svg class="ic fl" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </summary>
          <div class="cuerpo">
            <?php if (isset($g['ayuda'])): ?><div class="ay"><?= e($g['ayuda']) ?></div><?php endif; ?>

            <?php if ($gk === 'enlaces'): ?>
              <?php for ($i = 1; $i <= MIEMBRO_ENLACES; $i++):
                  $encendido = ($d["e{$i}_ver"] ?? '0') === '1'; ?>
                <div class="enl <?= $encendido ? '' : 'off' ?>" data-enl="<?= $i ?>">
                  <div class="cab">
                    <span class="num">Enlace <?= $i ?></span>
                    <label class="sw">
                      <input type="hidden" name="e<?= $i ?>_ver" value="0">
                      <input type="checkbox" name="e<?= $i ?>_ver" value="1" <?= $encendido ? 'checked' : '' ?>>
                      Mostrar
                    </label>
                    <label class="sw">
                      <input type="hidden" name="e<?= $i ?>_destacado" value="0">
                      <input type="checkbox" name="e<?= $i ?>_destacado" value="1" <?= ($d["e{$i}_destacado"] ?? '0') === '1' ? 'checked' : '' ?>>
                      Resaltar
                    </label>
                  </div>
                  <div class="dos">
                    <div class="campo" style="margin-bottom:0">
                      <label class="et">Título</label>
                      <input type="text" name="e<?= $i ?>_titulo" value="<?= e($d["e{$i}_titulo"] ?? '') ?>" placeholder="Agendar una cita">
                    </div>
                    <div class="campo" style="margin-bottom:0">
                      <label class="et">Renglón de abajo</label>
                      <input type="text" name="e<?= $i ?>_sub" value="<?= e($d["e{$i}_sub"] ?? '') ?>" placeholder="30 minutos, sin costo">
                    </div>
                  </div>
                  <div class="dos" style="margin-top:12px">
                    <div class="campo" style="margin-bottom:0">
                      <label class="et">Destino</label>
                      <input type="text" name="e<?= $i ?>_url" value="<?= e($d["e{$i}_url"] ?? '') ?>" placeholder="https://…">
                    </div>
                    <div class="campo" style="margin-bottom:0">
                      <label class="et">Ícono</label>
                      <select name="e<?= $i ?>_icono">
                        <?php foreach (iconos_enlace() as $ov => $ol): ?>
                          <option value="<?= e($ov) ?>" <?= ($d["e{$i}_icono"] ?? 'enlace') === $ov ? 'selected' : '' ?>><?= e($ol) ?></option>
                        <?php endforeach; ?>
                      </select>
                    </div>
                  </div>
                </div>
              <?php endfor; ?>

            <?php else: ?>
              <?php foreach ($g['campos'] as $k => $c):
                  $v = $d[$k] ?? '';
                  $req = !empty($c['req']) ? 'required' : ''; ?>
                <div class="campo">
                  <label class="et"><?= e($c['label']) ?></label>

                  <?php if ($c['tipo'] === 'parrafo'): ?>
                    <textarea name="<?= e($k) ?>" rows="3" <?= $req ?>><?= e($v) ?></textarea>

                  <?php elseif ($c['tipo'] === 'switch'): ?>
                    <label class="sw">
                      <input type="hidden" name="<?= e($k) ?>" value="0">
                      <input type="checkbox" name="<?= e($k) ?>" value="1" <?= $v === '1' ? 'checked' : '' ?>>
                      Sí
                    </label>

                  <?php elseif ($c['tipo'] === 'lista'): ?>
                    <select name="<?= e($k) ?>">
                      <?php foreach ($c['opciones'] as $ov => $ol): ?>
                        <option value="<?= e($ov) ?>" <?= $v === $ov ? 'selected' : '' ?>><?= e($ol) ?></option>
                      <?php endforeach; ?>
                    </select>

                  <?php elseif ($c['tipo'] === 'color'): ?>
                    <div class="swatch">
                      <input type="color" value="<?= e($v ?: '#000000') ?>"
                             oninput="this.nextElementSibling.value=this.value.toUpperCase();this.nextElementSibling.dispatchEvent(new Event('input',{bubbles:true}))">
                      <input type="text" name="<?= e($k) ?>" value="<?= e($v) ?>"
                             oninput="if(/^#[0-9a-fA-F]{6}$/.test(this.value))this.previousElementSibling.value=this.value">
                    </div>

                  <?php elseif ($c['tipo'] === 'imagen'): ?>
                    <input type="text" name="<?= e($k) ?>" value="<?= e($v) ?>" placeholder="https://…">
                    <div class="fotoprev" <?= $v === '' ? 'style="display:none"' : '' ?>>
                      <img src="<?= e($v) ?>" alt="" onerror="this.parentElement.style.display='none'">
                      <span class="pista">Así se va a ver, redonda.</span>
                    </div>

                  <?php else: ?>
                    <input type="text" name="<?= e($k) ?>" value="<?= e($v) ?>" <?= $req ?>
                           <?= $c['tipo'] === 'enlace' ? 'placeholder="https://…"' : '' ?>>
                  <?php endif; ?>

                  <?php if (isset($c['ayuda'])): ?><div class="pista"><?= e($c['ayuda']) ?></div><?php endif; ?>
                </div>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </details>
      <?php endforeach; ?>

      <?php
      $vcfTexto   = vcard_texto($d, 'https://www.inedito.digital' . $m['ruta'], false);
      $vcfArchivo = vcard_archivo($d, (string)$m['slug']);
      $conFoto    = ($d['vcf_foto'] ?? '1') !== '0' && trim((string)$d['foto']) !== '';
      ?>
      <details class="sec">
        <summary>
          <svg class="ic" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          <span class="st">La tarjeta que se van a guardar</span>
          <svg class="ic fl" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </summary>
        <div class="cuerpo">
          <div class="ay">
            Esto es exactamente lo que recibe el celular de quien toca
            &ldquo;<?= e($d['b_guardar'] ?: 'Guardar mi contacto') ?>&rdquo;.
            <?php if ($conFoto): ?> La foto se agrega al final, encogida.<?php endif; ?>
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
      </details>

      <details class="sec">
        <summary>
          <svg class="ic" viewBox="0 0 24 24"><path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3"/></svg>
          <span class="st">Cómo se ve al compartir</span>
          <svg class="ic fl" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </summary>
        <div class="cuerpo">
          <div class="ay">Lo que aparece en Google y en la vista previa cuando alguien manda el enlace. Si lo dejas vacío lo armamos solos.</div>
          <div class="campo">
            <label class="et">Título para buscadores</label>
            <input type="text" name="seo_title" value="<?= e($m['seo_title']) ?>" maxlength="200">
          </div>
          <div class="campo" style="margin-bottom:0">
            <label class="et">Descripción corta</label>
            <textarea name="seo_desc" rows="2" maxlength="300"><?= e($m['seo_desc']) ?></textarea>
          </div>
        </div>
      </details>
    </form>

    <?php if ($vers): ?>
      <details class="sec">
        <summary>
          <svg class="ic" viewBox="0 0 24 24"><path d="M3 3v5h5M3.05 13A9 9 0 106 5.3L3 8M12 7v5l4 2"/></svg>
          <span class="st">Versiones anteriores</span>
          <span class="cnt"><?= count($vers) ?></span>
          <svg class="ic fl" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </summary>
        <div class="cuerpo">
          <div class="ay">Cada vez que publicas guardamos cómo estaba antes. Recuperar la trae como borrador, para que la revises.</div>
          <table><tbody>
            <?php foreach ($vers as $v): ?>
              <tr>
                <td><?= e($v['created_at']) ?><?php if ($v['autor']): ?> <span class="mini">por <?= e($v['autor']) ?></span><?php endif; ?></td>
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
      </details>
    <?php endif; ?>

    <details class="sec" style="border-color:#3a1212">
      <summary>
        <svg class="ic" viewBox="0 0 24 24" style="stroke:#e07b7b"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>
        <span class="st">Borrar esta página</span>
        <svg class="ic fl" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </summary>
      <div class="cuerpo">
        <div class="ay">Si esta persona ya tiene tarjetas NFC impresas, dejarán de funcionar. Esto no se puede deshacer.</div>
        <form method="post" onsubmit="return confirm('¿Seguro que quieres borrar la página de <?= e($m['nombre']) ?>? Sus tarjetas NFC dejarán de funcionar.')">
          <input type="hidden" name="csrf" value="<?= $ct ?>">
          <input type="hidden" name="id" value="<?= $id ?>">
          <input type="hidden" name="accion" value="borrar">
          <button class="btn small ghost" type="submit" style="color:#e07b7b;border-color:#5a2a2a">Borrar</button>
        </form>
      </div>
    </details>
  </div>

  <!-- ================= vista previa ================= -->
  <aside class="ed-prev">
    <div class="prevbar">
      <span class="punto viva" id="pulso"></span>
      <span class="t">Se actualiza mientras escribes</span>
    </div>
    <div class="tel">
      <iframe id="previa" src="<?= e($m['ruta']) ?>?previa=1" title="Vista previa"></iframe>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
      <button class="btn" type="submit" form="f" onclick="document.getElementById('accion').value='publicar'">Publicar</button>
      <button class="btn ghost" type="submit" form="f" onclick="document.getElementById('accion').value='borrador'">Guardar sin publicar</button>
    </div>
    <p class="mini" style="margin-top:10px">Lo que ves aquí incluye lo que todavía no has guardado.</p>
  </aside>
</div>

<script>
(function () {
  var form  = document.getElementById('f');
  var marco = document.getElementById('previa');
  var pulso = document.getElementById('pulso');
  if (!form || !marco) return;

  // Lo que se manda al recuadro es el formulario tal cual: así lo que se ve
  // es exactamente lo que se va a guardar, sin una segunda interpretación.
  function estado() {
    var datos = {};
    new FormData(form).forEach(function (v, k) { datos[k] = v; });
    return datos;
  }

  function enviar() {
    if (!marco.contentWindow) return;
    marco.contentWindow.postMessage({ tipo: 'inedito:previa', datos: estado() }, window.location.origin);
  }

  var pendiente = null;
  function programar() {
    clearTimeout(pendiente);
    pulso.classList.remove('viva');
    pendiente = setTimeout(function () { enviar(); pulso.classList.add('viva'); }, 220);
  }

  form.addEventListener('input', programar);
  form.addEventListener('change', programar);

  // El recuadro avisa cuando terminó de cargar y ya puede recibir
  window.addEventListener('message', function (ev) {
    if (ev.origin !== window.location.origin) return;
    if (ev.data && ev.data.tipo === 'inedito:previa-lista') enviar();
  });

  // Los enlaces apagados se ven atenuados, para no leer ocho cajas iguales
  form.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.type !== 'checkbox' || !/^e\d+_ver$/.test(t.name)) return;
    var caja = t.closest('.enl');
    if (caja) caja.classList.toggle('off', !t.checked);
  });
})();
</script>
