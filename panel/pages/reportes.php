<?php
/**
 * Los reportes quincenales.
 *
 * El cron levanta uno cada quince días solo; esta pantalla es para verlos,
 * descargarlos y —cuando hace falta— adelantar el de hoy. El PDF se arma al
 * pedirlo desde la foto guardada, así que abrir uno de hace tres meses
 * devuelve exactamente los números de aquel día.
 */
declare(strict_types=1);
require_once __DIR__ . '/../inc/reporte.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    if (($_POST['accion'] ?? '') === 'generar') {
        try {
            $r = reporte_crear();
            set_flash('Reporte del ' . reporte_fecha_larga($r['periodo']['desde']) . ' al ' . reporte_fecha_larga($r['periodo']['hasta']) . ' listo.');
        } catch (Throwable $e) {
            set_flash('No se pudo generar: ' . $e->getMessage());
        }
    }
    redirect('/panel/?p=reportes');
}

$ct = csrf();
$lista = reporte_lista();
$verId = (int)($_GET['ver'] ?? ($lista[0]['id'] ?? 0));
$actual = $verId ? reporte_cargar($verId) : null;
$ultimo = $lista[0]['hasta'] ?? null;
$proximo = $ultimo ? date('Y-m-d', strtotime($ultimo . ' +' . REPORTE_DIAS . ' days')) : date('Y-m-d');
$faltan = (int)ceil((strtotime($proximo) - strtotime(date('Y-m-d'))) / 86400);
?>
<style>
  .rep-cols{display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start}
  .rep-item{display:block;text-decoration:none;color:inherit;background:var(--card);border:1px solid var(--line);
    border-radius:14px;padding:14px 16px;margin-bottom:10px;transition:border-color .18s,transform .18s}
  .rep-item:hover{border-color:rgba(153,51,255,.5);transform:translateY(-1px)}
  .rep-item.on{border-color:var(--pur2);background:linear-gradient(160deg,rgba(153,51,255,.13),var(--card) 70%)}
  .rep-item b{display:block;font-size:13.5px;margin-bottom:3px}
  .rep-visor{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
  .rep-visor iframe{display:block;width:100%;height:min(74vh,640px);border:0;background:#07070b}
  .rep-barra{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:13px 16px;border-bottom:1px solid var(--line)}
  .rep-barra .cuando{margin-right:auto}
  .rep-cifras{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:1px;background:var(--line)}
  .rep-cifras div{background:var(--card);padding:13px 15px}
  .rep-cifras span{display:block;font-size:10.5px;color:var(--mut2);text-transform:uppercase;letter-spacing:.09em;margin-bottom:5px}
  .rep-cifras b{font-size:19px}
  @media(max-width:900px){ .rep-cols{grid-template-columns:1fr} .rep-visor iframe{height:58vh} }
</style>

<div class="topbar">
  <div>
    <div class="kicker">Cada quince días</div>
    <h1 class="title">Reportes de resultados</h1>
    <p class="subt" style="margin-bottom:0">
      <?php if ($lista): ?>
        <?= count($lista) ?> generados · el siguiente toca el <?= e(reporte_fecha_larga($proximo)) ?>
        <?= $faltan > 0 ? '(en ' . $faltan . ' día' . ($faltan === 1 ? '' : 's') . ')' : '(hoy)' ?>
      <?php else: ?>
        Todavía no hay ninguno. Genera el primero y a partir de ahí sale solo cada <?= REPORTE_DIAS ?> días.
      <?php endif; ?>
    </p>
  </div>
  <form method="post" style="margin:0">
    <input type="hidden" name="csrf" value="<?= $ct ?>">
    <input type="hidden" name="accion" value="generar">
    <button class="btn" type="submit"><?= $lista ? 'Generar el de hoy' : 'Generar el primero' ?></button>
  </form>
</div>

<?php if (!$lista): ?>
  <div class="card"><p class="muted" style="text-align:center;padding:34px 0">
    El reporte reúne visitas, buscador, posicionamiento en IA y embudo, compara contra la quincena
    anterior y cierra con recomendaciones. Sale en PDF, listo para enviar.</p></div>
<?php else: ?>
<div class="rep-cols">
  <div>
    <?php foreach ($lista as $r): ?>
      <a class="rep-item <?= (int)$r['id'] === $verId ? 'on' : '' ?>" href="/panel/?p=reportes&ver=<?= (int)$r['id'] ?>">
        <b><?= e(reporte_fecha_larga($r['desde'])) ?></b>
        <span class="mini">al <?= e(reporte_fecha_larga($r['hasta'])) ?></span>
      </a>
    <?php endforeach; ?>
  </div>

  <div class="rep-visor">
    <?php if ($actual): ?>
      <div class="rep-barra">
        <div class="cuando">
          <b style="font-size:14px"><?= e(reporte_fecha_larga($actual['periodo']['desde'])) ?> — <?= e(reporte_fecha_larga($actual['periodo']['hasta'])) ?></b>
          <div class="mini">Congelado el <?= e(substr((string)($actual['creado_at'] ?? $actual['generado']), 0, 16)) ?></div>
        </div>
        <a class="btn small ghost" href="/panel/reporte.php?id=<?= (int)$actual['id'] ?>" target="_blank" rel="noopener">Abrir aparte ↗</a>
        <a class="btn small" href="/panel/reporte.php?id=<?= (int)$actual['id'] ?>&bajar=1">Descargar PDF</a>
      </div>

      <?php
        $v = $actual['visitas']; $b = $actual['buscador']; $ia = $actual['ia']; $em = $actual['embudo'];
        $cifras = [
          'Personas'      => number_format($v['personas']),
          'Páginas vistas'=> number_format($v['total']),
          'Clics Google'  => number_format($b['clics']),
          'Impresiones'   => number_format($b['impresiones']),
          'Posición'      => $b['posicion'] > 0 ? (string)$b['posicion'] : '—',
          'Lecturas IA'   => number_format($ia['lecturas']),
          'Acciones'      => number_format($em['acciones']),
          'Prospectos'    => number_format($em['leads']),
        ];
      ?>
      <div class="rep-cifras">
        <?php foreach ($cifras as $k => $val): ?>
          <div><span><?= e($k) ?></span><b><?= e($val) ?></b></div>
        <?php endforeach; ?>
      </div>

      <iframe src="/panel/reporte.php?id=<?= (int)$actual['id'] ?>#view=FitH" title="Reporte en PDF"></iframe>
    <?php else: ?>
      <p class="muted" style="text-align:center;padding:40px 0">Elige un reporte de la izquierda.</p>
    <?php endif; ?>
  </div>
</div>
<?php endif; ?>
