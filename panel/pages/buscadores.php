<?php
/**
 * Cómo te ve Google.
 *
 * Lee las fotos diarias que guarda panel/cron/gsc_sync.php. No llama a la API
 * al abrir la pantalla: así carga instantánea y no gasta cuota.
 */
require_once __DIR__ . '/../inc/google.php';

$conectado = !empty(g_get('refresh_token'));

function tabla_existe(string $t): bool {
    try { db()->query("SELECT 1 FROM $t LIMIT 1"); return true; } catch (Throwable $e) { return false; }
}
$hayDatos = tabla_existe('gsc_totales');

/* Sincronizar a mano desde el botón */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['accion'] ?? '') === 'sync') {
    csrf_check();
    @ignore_user_abort(true);
    @set_time_limit(600);
    ob_start(); require __DIR__ . '/../cron/gsc_sync.php'; ob_end_clean();
    set_flash('Sincronizado con Google.');
    redirect('/panel/?p=buscadores');
}

$hoy = $ayer = null; $urls = []; $consultas = []; $serie = [];
if ($hayDatos) {
    $hoy  = db()->query("SELECT * FROM gsc_totales ORDER BY fecha DESC LIMIT 1")->fetch() ?: null;
    $ayer = db()->query("SELECT * FROM gsc_totales ORDER BY fecha DESC LIMIT 1 OFFSET 1")->fetch() ?: null;
    if ($hoy) {
        $q = db()->prepare("SELECT url, estado, ultimo_rastreo FROM gsc_indexacion WHERE fecha = :f ORDER BY estado, url");
        $q->execute([':f' => $hoy['fecha']]);
        $urls = $q->fetchAll();
        $q = db()->prepare("SELECT consulta, clics, impresiones, posicion FROM gsc_consultas WHERE fecha = :f
                            ORDER BY impresiones DESC LIMIT 25");
        $q->execute([':f' => $hoy['fecha']]);
        $consultas = $q->fetchAll();
    }
    $serie = db()->query("SELECT fecha, indexadas, sin_indexar, impresiones FROM gsc_totales ORDER BY fecha DESC LIMIT 30")->fetchAll();
    $serie = array_reverse($serie);
}

/* Agrupar por estado */
$grupos = [];
foreach ($urls as $u) $grupos[$u['estado']][] = $u;
$buenos = ['Enviada e indexada', 'Indexada'];
$ct = csrf();
?>
<style>
  .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px}
  .kpi2{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}
  .kpi2 .et{font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:var(--mut);margin-bottom:6px}
  .kpi2 .v{font-size:28px;font-weight:700;color:#fff}
  .kpi2 .d{font-size:12px;margin-top:4px}
  .sube{color:#5ad18c}.baja{color:#e07b7b}.igual{color:var(--mut2)}
  .barra{display:flex;height:26px;border-radius:8px;overflow:hidden;margin:6px 0 14px;border:1px solid var(--line)}
  .barra span{display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#0b0b12}
  .est{margin-bottom:16px}
  .est h4{font-size:13px;margin-bottom:6px;display:flex;align-items:center;gap:8px}
  .pt{width:9px;height:9px;border-radius:50%;display:inline-block}
  .lista{font-size:12.5px;color:var(--mut);line-height:1.9}
  .lista code{font-size:12px}
</style>

<div class="topbar">
  <div>
    <h1 class="title">Cómo te ve Google</h1>
    <p class="subt">Datos reales de Search Console. Se actualiza solo una vez al día.</p>
  </div>
  <?php if ($conectado): ?>
    <form method="post" onsubmit="this.querySelector('button').textContent='Sincronizando… (puede tardar 2 min)';this.querySelector('button').disabled=true">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="accion" value="sync">
      <button class="btn ghost" type="submit">Actualizar ahora</button>
    </form>
  <?php endif; ?>
</div>

<?php if (!$conectado): ?>
  <div class="card" style="border-color:#3a2f12;background:#191305">
    <strong>Falta conectar Google.</strong> Ve a <a href="/panel/?p=analiticas">Analíticas</a> y pulsa “Conectar con Google”.
  </div>
<?php elseif (!$hoy): ?>
  <div class="card"><p class="muted" style="text-align:center;padding:26px 0">
    Todavía no hay ninguna foto guardada. Pulsa <em>Actualizar ahora</em>.</p></div>
<?php else: ?>

  <?php
  $ix = (int)$hoy['indexadas']; $fu = (int)$hoy['sin_indexar']; $tt = max($ix + $fu, 1);
  function delta($a, $b, $inv = false) {
      if ($b === null) return '<span class="igual">primera medición</span>';
      $d = $a - $b;
      if (abs($d) < 0.01) return '<span class="igual">igual que ayer</span>';
      $bueno = $inv ? $d < 0 : $d > 0;
      return '<span class="' . ($bueno ? 'sube' : 'baja') . '">' . ($d > 0 ? '+' : '') . round($d, 2) . ' vs. ayer</span>';
  }
  ?>

  <div class="kpis">
    <div class="kpi2"><div class="et">Páginas indexadas</div><div class="v"><?= $ix ?> <span style="font-size:15px;color:var(--mut)">de <?= $tt ?></span></div>
      <div class="d"><?= delta($ix, $ayer ? (int)$ayer['indexadas'] : null) ?></div></div>
    <div class="kpi2"><div class="et">Impresiones (28 días)</div><div class="v"><?= number_format((int)$hoy['impresiones']) ?></div>
      <div class="d"><?= delta((int)$hoy['impresiones'], $ayer ? (int)$ayer['impresiones'] : null) ?></div></div>
    <div class="kpi2"><div class="et">Clics (28 días)</div><div class="v"><?= (int)$hoy['clics'] ?></div>
      <div class="d"><?= delta((int)$hoy['clics'], $ayer ? (int)$ayer['clics'] : null) ?></div></div>
    <div class="kpi2"><div class="et">Posición media</div><div class="v"><?= $hoy['posicion'] ?></div>
      <div class="d"><?= delta((float)$hoy['posicion'], $ayer ? (float)$ayer['posicion'] : null, true) ?></div></div>
  </div>

  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Qué páginas conoce Google</div>
    <div class="mini" style="margin-bottom:10px">De las <?= $tt ?> del sitemap. Foto del <?= e($hoy['fecha']) ?>.</div>
    <div class="barra">
      <span style="width:<?= round($ix / $tt * 100) ?>%;background:#5ad18c"><?= $ix ?> dentro</span>
      <span style="width:<?= round($fu / $tt * 100) ?>%;background:#e07b7b"><?= $fu ?> fuera</span>
    </div>

    <?php foreach ($grupos as $estado => $lista):
      $ok = in_array($estado, $buenos, true); ?>
      <div class="est">
        <h4><span class="pt" style="background:<?= $ok ? '#5ad18c' : '#e07b7b' ?>"></span>
            <?= e($estado) ?> <span class="mini">(<?= count($lista) ?>)</span></h4>
        <div class="lista">
          <?php foreach ($lista as $u): ?>
            <code><?= e(str_replace('https://www.inedito.digital', '', $u['url']) ?: '/') ?></code><?php
              if ($u['ultimo_rastreo']) echo ' <span class="mini">· visitada ' . e($u['ultimo_rastreo']) . '</span>';
            ?><br>
          <?php endforeach; ?>
        </div>
        <?php if (!$ok): ?>
          <div class="mini" style="margin-top:6px">
            <?php if (stripos($estado, 'Descubierta') !== false): ?>
              Google sabe que existen pero <strong>nunca las ha visitado</strong>. No es problema del contenido: es que al sitio le falta autoridad y Google le dedica poco tiempo. Se acelera pidiendo la indexación a mano y consiguiendo enlaces de otros sitios.
            <?php elseif (stripos($estado, 'no reconoce') !== false): ?>
              Google ni siquiera sabe que existen. Pide la indexación a mano desde Search Console.
            <?php elseif (stripos($estado, 'Rastreada') !== false): ?>
              Las visitó y decidió no incluirlas. Suele ser contenido muy nuevo o que necesita más sustancia.
            <?php endif; ?>
          </div>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>

  <?php if (count($serie) > 1): ?>
    <div class="card">
      <div style="font-size:17px;font-weight:700;margin-bottom:10px">Evolución</div>
      <table><thead><tr><th>Fecha</th><th>Indexadas</th><th>Fuera</th><th>Impresiones</th></tr></thead><tbody>
        <?php foreach (array_reverse($serie) as $s): ?>
          <tr><td><?= e($s['fecha']) ?></td><td><?= (int)$s['indexadas'] ?></td>
              <td><?= (int)$s['sin_indexar'] ?></td><td><?= number_format((int)$s['impresiones']) ?></td></tr>
        <?php endforeach; ?>
      </tbody></table>
    </div>
  <?php endif; ?>

  <div class="card">
    <div style="font-size:17px;font-weight:700;margin-bottom:4px">Lo que busca la gente para encontrarte</div>
    <div class="mini" style="margin-bottom:10px">Las 25 con más impresiones en los últimos 28 días.</div>
    <table>
      <thead><tr><th>Búsqueda</th><th>Impresiones</th><th>Clics</th><th>Posición</th></tr></thead>
      <tbody>
      <?php foreach ($consultas as $c):
        $sinClic = (int)$c['clics'] === 0 && (float)$c['posicion'] <= 10; ?>
        <tr>
          <td><?= e($c['consulta']) ?><?php if ($sinClic): ?>
            <span class="mini" style="color:#e0b07b"> · sale en página 1 y nadie entra</span><?php endif; ?></td>
          <td><?= (int)$c['impresiones'] ?></td>
          <td><?= (int)$c['clics'] ?></td>
          <td><?= $c['posicion'] ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
<?php endif; ?>
