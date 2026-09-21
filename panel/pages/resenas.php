<?php
/**
 * Las opiniones de Google que corren en el carrusel de la portada y de
 * Nosotros.
 *
 * Llegan solas de la ficha de Google (panel/inc/resenas.php, una vez al día
 * con el cron de Search Console). Aquí se ve cómo va esa conexión, se
 * sincroniza a mano, se agrega una opinión copiada si se quiere mostrar hoy,
 * se escribe su traducción para el sitio en inglés y se oculta la que no
 * convenga. El texto de una opinión que viene de Google no se edita: es del
 * cliente.
 */
declare(strict_types=1);
require_once __DIR__ . '/../inc/google.php';
require_once __DIR__ . '/../inc/resenas.php';

try { resenas_tabla(); } catch (Throwable $e) { /* la lista de abajo lo dirá */ }

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $accion = $_POST['accion'] ?? '';
    $id = (int)($_POST['id'] ?? 0);

    if ($accion === 'sincronizar') {
        @set_time_limit(120);
        $r = resenas_sincronizar();
        set_flash($r['ok'] ? 'Opiniones al día: ' . $r['resumen'] . '.' : 'No se pudo sincronizar. ' . $r['error']);
    } elseif ($accion === 'agregar') {
        $autor = trim((string)($_POST['autor'] ?? ''));
        $texto = trim((string)($_POST['texto'] ?? ''));
        $fecha = (string)($_POST['fecha'] ?? '');
        if ($autor === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
            set_flash('Falta el nombre de quien opina o la fecha.');
        } else {
            db()->prepare("INSERT INTO resenas_google (autor, estrellas, texto, texto_en, fecha, fecha_aprox, origen, visible)
                           VALUES (:a, :e, :t, :en, :f, 0, 'copiada', 1)")
                ->execute([':a' => $autor, ':e' => max(1, min(5, (int)($_POST['estrellas'] ?? 5))), ':t' => $texto,
                           ':en' => trim((string)($_POST['texto_en'] ?? '')) ?: null, ':f' => $fecha . ' 12:00:00']);
            set_flash("La opinión de $autor ya está en la lista.");
        }
    } elseif ($accion === 'guardar' && $id) {
        $f = db()->prepare("SELECT origen FROM resenas_google WHERE id = :id");
        $f->execute([':id' => $id]);
        $origen = (string)$f->fetchColumn();
        $en = trim((string)($_POST['texto_en'] ?? ''));
        if ($origen === 'copiada') {
            // En una copiada sí se corrige el texto: el error pudo ser al copiar.
            db()->prepare("UPDATE resenas_google SET autor = COALESCE(NULLIF(:a, ''), autor), texto = :t, texto_en = :en, visible = :v WHERE id = :id")
                ->execute([':a' => trim((string)($_POST['autor'] ?? '')), ':t' => trim((string)($_POST['texto'] ?? '')),
                           ':en' => $en !== '' ? $en : null, ':v' => isset($_POST['visible']) ? 1 : 0, ':id' => $id]);
        } else {
            db()->prepare("UPDATE resenas_google SET texto_en = :en, visible = :v WHERE id = :id")
                ->execute([':en' => $en !== '' ? $en : null, ':v' => isset($_POST['visible']) ? 1 : 0, ':id' => $id]);
        }
        set_flash('Cambios guardados.');
    } elseif ($accion === 'borrar' && $id) {
        // Solo las copiadas: una de Google volvería con la siguiente
        // sincronización; para esas está «Se muestra en el sitio».
        db()->prepare("DELETE FROM resenas_google WHERE id = :id AND origen = 'copiada'")->execute([':id' => $id]);
        set_flash('Opinión quitada.');
    }
    redirect('/panel/?p=resenas');
}

$ct = csrf();
$filas = [];
try { $filas = db()->query("SELECT * FROM resenas_google ORDER BY fecha DESC, id DESC")->fetchAll(); } catch (Throwable $e) {}
$est = resenas_estado();
$total = count($filas);
$prom = $total ? array_sum(array_map(static fn($f) => (int)$f['estrellas'], $filas)) / $total : 0;
$enSitio = count(array_filter($filas, static fn($f) => (int)$f['visible'] === 1 && (int)$f['estrellas'] === 5 && trim((string)$f['texto']) !== ''));
$fechaCorta = static fn(string $iso): string => $iso === '' ? '' : date('d/m/Y H:i', strtotime($iso));
$estrellas = static fn(int $n): string => str_repeat('★', $n) . str_repeat('☆', 5 - $n);
?>
<style>
  .res-est{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .res-est .badge{flex-shrink:0}
  .b-error{background:rgba(255,80,110,.14);color:#ff8fa6}
  .res-acc{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
  .res-pasos{margin-top:16px;border-top:1px solid var(--line);padding-top:12px}
  .res-pasos summary{cursor:pointer;color:var(--txt);font-size:13.5px}
  .res-pasos ol{margin:12px 0 0;padding-left:20px;color:var(--mut);font-size:13.5px;line-height:1.65}
  .res-pasos a{color:var(--pur3);text-decoration:underline}
  .res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
  .res{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:10px}
  .res.oculta{opacity:.55}
  .res-cab{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}
  .res-autor{font-weight:700;font-size:14px}
  .res-est5{color:#f5b301;letter-spacing:2px;font-size:13px}
  .res-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .res-txt{font-size:13.5px;line-height:1.6;color:var(--txt);white-space:pre-line;margin:0}
  .res textarea{min-height:84px;font-size:13px}
  .res label{margin-top:4px}
  .res-aviso{font-size:12px;color:#ffcf7a}
  .res-pie{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:2px}
  .res-sw{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--mut);text-transform:none;letter-spacing:0;margin:0 auto 0 0;font-family:inherit;cursor:pointer}
  .res-sw input{width:auto;margin:0}
  @media (max-width:640px){ .res-grid{grid-template-columns:1fr} }
</style>

<div class="topbar">
  <div>
    <div class="kicker">Prueba social</div>
    <h1 class="title">Opiniones de Google</h1>
    <p class="subt" style="margin-bottom:0">
      Las de cinco estrellas con texto corren en el carrusel de la portada y de Nosotros.
      <?php if ($total): ?>
        <strong style="color:var(--txt)"><?= $total ?> opiniones</strong> · promedio <?= number_format($prom, 1) ?> ·
        <?= $enSitio ?> en el sitio
      <?php endif; ?>
    </p>
  </div>
</div>

<div class="card">
  <div class="form-sec" style="margin-top:0"><b>Actualización automática</b><span>desde la ficha de Google, una vez al día</span></div>
  <div class="res-est" style="margin-top:14px">
    <?php if (!$est['conectado']): ?>
      <span class="badge b-error">Sin conexión</span>
      <span class="muted">Google no está conectado en el panel.</span>
    <?php elseif ($est['error'] !== ''): ?>
      <span class="badge b-error">Pendiente</span>
      <span class="muted"><?= e($est['error']) ?><?= $est['intento'] ? ' <span class="mini">(' . e($fechaCorta($est['intento'])) . ')</span>' : '' ?></span>
    <?php elseif ($est['sync'] !== ''): ?>
      <span class="badge b-published">Al día</span>
      <span class="muted">Última sincronización: <?= e($fechaCorta($est['sync'])) ?> · <?= e($est['resultado']) ?>
        <?= $est['ficha'] ? ' · ficha «' . e($est['ficha']) . '»' : '' ?></span>
    <?php else: ?>
      <span class="badge b-draft">Sin sincronizar</span>
      <span class="muted">Todavía no se ha leído la ficha. Mientras tanto se muestran las copiadas.</span>
    <?php endif; ?>
  </div>

  <div class="res-acc">
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <button class="btn small" type="submit" name="accion" value="sincronizar" <?= $est['conectado'] ? '' : 'disabled' ?>>Sincronizar ahora</button>
    </form>
    <a class="btn small ghost" href="/panel/google_connect.php?volver=resenas"><?= $est['conectado'] ? 'Reconectar Google' : 'Conectar Google' ?></a>
    <a class="btn small ghost" href="<?= e(RESENAS_FICHA) ?>" target="_blank" rel="noopener">Ver la ficha en Google ↗</a>
  </div>

  <details class="res-pasos" <?= $est['sync'] === '' ? 'open' : '' ?>>
    <summary>Qué falta para que se actualicen solas</summary>
    <ol>
      <li>Pedir a Google acceso a la API de Perfil de Empresa con el
        <a href="https://developers.google.com/my-business/content/prereqs#request-access" target="_blank" rel="noopener">formulario de solicitud</a>.
        Se llena con la cuenta dueña de la ficha y el número del proyecto de Google Cloud donde vive el Client ID de este panel
        (el mismo de Analíticas). Google contesta por correo; suele tardar de unos días a un par de semanas.</li>
      <li>Ya aprobado, en ese proyecto se activan tres APIs: <em>My Business Account Management API</em>,
        <em>My Business Business Information API</em> y <em>Google My Business API</em>.</li>
      <li>Pulsar «Reconectar Google» aquí arriba y aceptar el permiso nuevo («ver, editar, crear y borrar tus fichas de empresa»).
        Tiene que ser con la cuenta dueña o administradora de la ficha de Inédito.</li>
      <li>Pulsar «Sincronizar ahora». Desde ahí se actualizan solas cada día: van en el mismo cron de Search Console, no hay que poner otro.
        Las copiadas se emparejan con su original y conservan su traducción.</li>
    </ol>
  </details>
</div>

<div class="card">
  <div class="form-sec" style="margin-top:0"><b>Agregar una opinión a mano</b><span>para mostrar hoy una nueva sin esperar a la sincronización</span></div>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= $ct ?>">
    <input type="hidden" name="accion" value="agregar">
    <div class="rowf">
      <div><label>Nombre, como aparece en Google</label><input type="text" name="autor" required placeholder="Por ejemplo: Nancy Soria"></div>
      <div class="rowf" style="gap:12px">
        <div><label>Estrellas</label>
          <select name="estrellas"><?php for ($i = 5; $i >= 1; $i--): ?><option value="<?= $i ?>"><?= $i ?></option><?php endfor; ?></select></div>
        <div><label>Fecha</label><input type="date" name="fecha" required value="<?= date('Y-m-d') ?>"></div>
      </div>
    </div>
    <label>Texto de la opinión, tal cual</label>
    <textarea name="texto" placeholder="Copia el texto completo de Google"></textarea>
    <label>Traducción al inglés (opcional)</label>
    <textarea name="texto_en" placeholder="Si se deja vacía, el sitio en inglés muestra la original con la nota «Review in Spanish»"></textarea>
    <div style="margin-top:14px"><button class="btn" type="submit">Agregar</button></div>
  </form>
</div>

<?php if (!$filas): ?>
  <div class="card"><p class="muted" style="text-align:center;padding:26px 0">Todavía no hay opiniones guardadas.</p></div>
<?php else: ?>
  <div class="res-grid">
    <?php foreach ($filas as $f):
      $copiada = $f['origen'] === 'copiada';
      $sale = (int)$f['estrellas'] === 5 && trim((string)$f['texto']) !== ''; ?>
      <form method="post" class="res <?= (int)$f['visible'] && $sale ? '' : 'oculta' ?>">
        <input type="hidden" name="csrf" value="<?= $ct ?>">
        <input type="hidden" name="id" value="<?= (int)$f['id'] ?>">
        <div class="res-cab">
          <?php if ($copiada): ?>
            <input type="text" name="autor" value="<?= e($f['autor']) ?>" aria-label="Nombre" style="max-width:62%;padding:7px 10px;font-size:13px">
          <?php else: ?>
            <span class="res-autor"><?= e($f['autor'] !== '' ? $f['autor'] : 'Anónimo') ?></span>
          <?php endif; ?>
          <span class="res-est5" aria-label="<?= (int)$f['estrellas'] ?> estrellas"><?= $estrellas((int)$f['estrellas']) ?></span>
        </div>
        <div class="res-meta">
          <span class="badge <?= $copiada ? 'b-draft' : 'b-published' ?>"><?= $copiada ? 'Copiada' : 'Google' ?></span>
          <span class="mini" <?= (int)$f['fecha_aprox'] ? 'title="Aproximada: al copiarla, Google solo decía «hace un mes», «hace un año»…"' : '' ?>><?= (int)$f['fecha_aprox'] ? '≈ ' : '' ?><?= e(date('d/m/Y', strtotime((string)$f['fecha']))) ?></span>
          <span class="mini">· en el sitio: <?= e(resenas_nombre_publico((string)$f['autor'])) ?></span>
        </div>
        <?php if ($copiada): ?>
          <textarea name="texto" aria-label="Texto"><?= e($f['texto']) ?></textarea>
        <?php elseif (trim((string)$f['texto']) !== ''): ?>
          <p class="res-txt"><?= e($f['texto']) ?></p>
        <?php endif; ?>
        <?php if (!$sale): ?>
          <div class="res-aviso"><?= (int)$f['estrellas'] < 5 ? 'No sale en el sitio: solo salen las de cinco estrellas.' : 'No sale en el sitio: es solo calificación, sin texto.' ?></div>
        <?php else: ?>
          <label>Traducción al inglés</label>
          <textarea name="texto_en" placeholder="Vacía = el sitio en inglés muestra la original"><?= e($f['texto_en'] ?? '') ?></textarea>
        <?php endif; ?>
        <div class="res-pie">
          <label class="res-sw"><input type="checkbox" name="visible" <?= (int)$f['visible'] ? 'checked' : '' ?>> Se muestra en el sitio</label>
          <button class="btn small ghost" type="submit" name="accion" value="guardar">Guardar</button>
          <?php if ($copiada): ?>
            <button class="btn small danger" type="submit" name="accion" value="borrar"
                    onclick="return confirm('¿Quitar esta opinión copiada?')">Quitar</button>
          <?php endif; ?>
        </div>
      </form>
    <?php endforeach; ?>
  </div>
<?php endif; ?>
