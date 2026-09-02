<?php
/**
 * El carrusel de clientes de la portada.
 *
 * Vive aparte del portafolio a propósito: un logo en la cinta es prueba
 * social, no un caso con página propia. Antes había que inventar una ficha
 * de portafolio solo para colar un logo, y eso dejaba páginas vacías
 * indexándose. Aquí se sube el logo, se ordena y se muestra; el caso
 * completo, si algún día existe, va en Contenido → Portafolio.
 */
declare(strict_types=1);

/* La tabla se crea sola la primera vez que se abre la pantalla. */
try {
    db()->exec("CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      logo VARCHAR(255) NOT NULL,
      url VARCHAR(255) NOT NULL DEFAULT '',
      orden INT NOT NULL DEFAULT 0,
      visible TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Throwable $e) { /* si falla, la lista de abajo lo dice */ }

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $accion = $_POST['accion'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($accion === 'crear') {
        $nombre = trim((string)($_POST['nombre'] ?? ''));
        $logo   = trim((string)($_POST['logo'] ?? ''));
        if ($nombre === '' || $logo === '') {
            set_flash('Falta el nombre o el logo.');
        } else {
            $max = (int)db()->query("SELECT COALESCE(MAX(orden),0) FROM clientes")->fetchColumn();
            db()->prepare("INSERT INTO clientes (nombre, logo, url, orden) VALUES (:n,:l,:u,:o)")
                ->execute([':n' => $nombre, ':l' => $logo, ':u' => trim((string)($_POST['url'] ?? '')), ':o' => $max + 10]);
            set_flash("«$nombre» ya aparece en el carrusel.");
        }
    } elseif ($accion === 'guardar' && $id) {
        db()->prepare("UPDATE clientes SET nombre=:n, url=:u, visible=:v WHERE id=:id")
            ->execute([':n' => trim((string)($_POST['nombre'] ?? '')), ':u' => trim((string)($_POST['url'] ?? '')),
                       ':v' => isset($_POST['visible']) ? 1 : 0, ':id' => $id]);
        set_flash('Cambios guardados.');
    } elseif ($accion === 'borrar' && $id) {
        db()->prepare("DELETE FROM clientes WHERE id=:id")->execute([':id' => $id]);
        set_flash('Logo retirado del carrusel.');
    } elseif (($accion === 'subir' || $accion === 'bajar') && $id) {
        /* Se intercambia el orden con el vecino: mover uno no descoloca al resto. */
        $dir = $accion === 'subir' ? '<' : '>';
        $ord = $accion === 'subir' ? 'DESC' : 'ASC';
        $yo = db()->prepare("SELECT id, orden FROM clientes WHERE id = :id");
        $yo->execute([':id' => $id]);
        if ($yo = $yo->fetch()) {
            $v = db()->prepare("SELECT id, orden FROM clientes WHERE orden $dir :o ORDER BY orden $ord LIMIT 1");
            $v->execute([':o' => (int)$yo['orden']]);
            if ($vec = $v->fetch()) {
                $u = db()->prepare("UPDATE clientes SET orden = :o WHERE id = :id");
                $u->execute([':o' => (int)$vec['orden'], ':id' => (int)$yo['id']]);
                $u->execute([':o' => (int)$yo['orden'], ':id' => (int)$vec['id']]);
            }
        }
    }
    redirect('/panel/?p=clientes');
}

$ct = csrf();
$filas = [];
try { $filas = db()->query("SELECT * FROM clientes ORDER BY orden ASC, id ASC")->fetchAll(); } catch (Throwable $e) {}
$visibles = count(array_filter($filas, fn($f) => (int)$f['visible'] === 1));
?>
<style>
  .cli-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:16px}
  .cli{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
  .cli.oculto{opacity:.5}
  /* el logo se ve como en la portada: blanco sobre oscuro */
  .cli-vista{height:104px;display:flex;align-items:center;justify-content:center;padding:18px;
    background:linear-gradient(160deg,#150022,#0b0b13 70%);border-bottom:1px solid var(--line);position:relative}
  .cli-vista img{max-height:48px;max-width:150px;width:auto;object-fit:contain;filter:brightness(0) invert(1);opacity:.72}
  .cli-cuerpo{padding:13px 15px;display:flex;flex-direction:column;gap:9px;flex:1}
  .cli-cuerpo input[type=text]{font-size:13px;padding:8px 10px}
  .cli-pie{display:flex;gap:6px;align-items:center;padding:0 12px 12px;flex-wrap:wrap}
  .cli-orden{display:flex;gap:4px;margin-right:auto}
  .cli-orden button{border:1px solid var(--line);background:transparent;color:var(--mut);border-radius:8px;
    width:28px;height:28px;cursor:pointer;font-size:13px;line-height:1}
  .cli-orden button:hover{color:var(--txt);border-color:var(--line2)}
  .cli-sw{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--mut);text-transform:none;letter-spacing:0;margin:0;font-family:inherit;cursor:pointer}
  .cli-sw input{width:auto;margin:0}
  .zona{border:1.5px dashed var(--line2);border-radius:16px;padding:26px;text-align:center;transition:border-color .2s,background .2s}
  .zona.encima{border-color:var(--pur2);background:rgba(153,51,255,.06)}
  .zona .prev{max-height:70px;max-width:190px;margin:0 auto 12px;display:block;filter:brightness(0) invert(1);opacity:.85}
</style>

<div class="topbar">
  <div>
    <div class="kicker">Prueba social</div>
    <h1 class="title">Carrusel de clientes</h1>
    <p class="subt" style="margin-bottom:0">
      Los logos que corren en la portada, bajo «Marcas que ya confían».
      <?= $filas ? "<strong style=\"color:var(--txt)\">$visibles visibles</strong> de " . count($filas) : '' ?>
    </p>
  </div>
</div>

<div class="card">
  <div class="form-sec" style="margin-top:0"><b>Agregar una marca</b><span>PNG, JPG o WebP · el logo se optimiza solo</span></div>

  <form method="post" id="fCrear">
    <input type="hidden" name="csrf" value="<?= $ct ?>">
    <input type="hidden" name="accion" value="crear">
    <input type="hidden" name="logo" id="logoUrl">

    <div class="zona" id="zona">
      <img class="prev" id="prev" hidden alt="">
      <div id="zonaTexto">
        <div style="font-size:14px;color:var(--txt);margin-bottom:4px">Arrastra el logo aquí o haz clic para elegirlo</div>
        <div class="mini">Mejor si el fondo es transparente: en la portada los logos se pintan en blanco.</div>
      </div>
      <div class="mini" id="zonaEstado" style="margin-top:10px"></div>
      <input type="file" id="archivo" accept="image/png,image/jpeg,image/webp" hidden>
    </div>

    <div class="rowf" style="margin-top:16px">
      <div>
        <label>Nombre de la marca</label>
        <input type="text" name="nombre" id="nombreCrear" placeholder="Por ejemplo: Alaman" required>
      </div>
      <div>
        <label>Sitio del cliente (opcional)</label>
        <input type="text" name="url" placeholder="https://…">
      </div>
    </div>
    <div style="margin-top:16px">
      <button class="btn" type="submit" id="btnCrear" disabled>Agregar al carrusel</button>
    </div>
  </form>
</div>

<?php if (!$filas): ?>
  <div class="card"><p class="muted" style="text-align:center;padding:26px 0">
    Todavía no hay logos. Sube el primero aquí arriba.</p></div>
<?php else: ?>
  <div class="cli-grid">
    <?php foreach ($filas as $c): ?>
      <form method="post" class="cli <?= (int)$c['visible'] ? '' : 'oculto' ?>">
        <input type="hidden" name="csrf" value="<?= $ct ?>">
        <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">

        <div class="cli-vista">
          <img src="<?= e($c['logo']) ?>" alt="<?= e($c['nombre']) ?>">
        </div>

        <div class="cli-cuerpo">
          <input type="text" name="nombre" value="<?= e($c['nombre']) ?>" aria-label="Nombre">
          <input type="text" name="url" value="<?= e($c['url']) ?>" placeholder="https://…" aria-label="Sitio">
          <label class="cli-sw">
            <input type="checkbox" name="visible" <?= (int)$c['visible'] ? 'checked' : '' ?>>
            Se muestra en la portada
          </label>
        </div>

        <div class="cli-pie">
          <span class="cli-orden">
            <button type="submit" name="accion" value="subir" title="Mover antes">&uarr;</button>
            <button type="submit" name="accion" value="bajar" title="Mover después">&darr;</button>
          </span>
          <button class="btn small ghost" type="submit" name="accion" value="guardar">Guardar</button>
          <button class="btn small danger" type="submit" name="accion" value="borrar"
                  onclick="return confirm('¿Quitar <?= e(addslashes($c['nombre'])) ?> del carrusel?')">Quitar</button>
        </div>
      </form>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<script>
(function () {
  var zona = document.getElementById('zona'), input = document.getElementById('archivo');
  var prev = document.getElementById('prev'), estado = document.getElementById('zonaEstado');
  var texto = document.getElementById('zonaTexto'), url = document.getElementById('logoUrl');
  var btn = document.getElementById('btnCrear'), nombre = document.getElementById('nombreCrear');

  zona.addEventListener('click', function () { input.click(); });
  ['dragenter', 'dragover'].forEach(function (e) {
    zona.addEventListener(e, function (ev) { ev.preventDefault(); zona.classList.add('encima'); });
  });
  ['dragleave', 'drop'].forEach(function (e) {
    zona.addEventListener(e, function (ev) { ev.preventDefault(); zona.classList.remove('encima'); });
  });
  zona.addEventListener('drop', function (ev) {
    if (ev.dataTransfer.files.length) subir(ev.dataTransfer.files[0]);
  });
  input.addEventListener('change', function () { if (input.files.length) subir(input.files[0]); });

  function subir(archivo) {
    estado.textContent = 'Subiendo y optimizando…';
    btn.disabled = true;
    var datos = new FormData();
    datos.append('csrf', '<?= $ct ?>');
    datos.append('logo', archivo);
    datos.append('nombre', nombre.value || archivo.name);
    fetch('/panel/subir_logo.php', { method: 'POST', body: datos })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.error) { estado.textContent = j.error; return; }
        url.value = j.url;
        prev.src = j.url; prev.hidden = false;
        texto.style.display = 'none';
        estado.textContent = 'Listo · ' + j.ancho + '×' + j.alto + ' · ' + Math.round(j.peso / 1024) + ' KB';
        btn.disabled = false;
      })
      .catch(function () { estado.textContent = 'No se pudo subir. Revisa tu conexión.'; });
  }
})();
</script>
