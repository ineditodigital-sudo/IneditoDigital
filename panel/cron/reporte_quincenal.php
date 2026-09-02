<?php
/**
 * ============================================================
 * REPORTE QUINCENAL DE RESULTADOS
 * ============================================================
 *
 * Congela cada quince días una foto de todo lo medible —visitas, buscador,
 * lecturas de motores de IA, embudo— la compara contra la quincena anterior
 * y guarda las conclusiones. El PDF se arma después, al pedirlo, desde esa
 * foto: así el reporte de hace tres meses sigue diciendo lo que decía.
 *
 * Se corre por cron TODOS LOS DÍAS; él decide si toca:
 *   /usr/local/bin/ea-php83 /home/inedito/public_html/panel/cron/reporte_quincenal.php
 *
 * Correrlo de más no hace daño: si no han pasado quince días desde el
 * último, no hace nada y lo dice. Con `--forzar` levanta el de hoy aunque
 * no toque, que es lo mismo que hace el botón del panel.
 */
declare(strict_types=1);

$raiz = dirname(__DIR__, 2);
require_once $raiz . '/panel/bootstrap.php';
require_once $raiz . '/panel/inc/reporte.php';

/* Vive dentro de public_html, así que por web es una URL abierta. Desde el
   navegador exige sesión: si no, cualquiera podría leer las métricas del
   sitio y hacer trabajar al servidor pidiéndolo en bucle. Por cron (CLI) no
   hay sesión que pedir. Mismo criterio que cron/gsc_sync.php. */
if (PHP_SAPI !== 'cli') {
    require_login();
    header('Content-Type: text/plain; charset=utf-8');
}

$forzar = in_array('--forzar', $argv ?? [], true);

function decir(string $s): void { echo $s . "\n"; }

decir('Reporte quincenal · ' . date('Y-m-d H:i:s'));

if (!$forzar && !reporte_toca()) {
    reporte_tabla();
    $ultimo = rq1("SELECT MAX(hasta) FROM reportes", [], null);
    $faltan = REPORTE_DIAS - (int)((strtotime(date('Y-m-d')) - strtotime((string)$ultimo)) / 86400);
    decir("  El ultimo cubre hasta $ultimo. Faltan $faltan dias. No se hace nada.");
    exit(0);
}

try {
    $r = reporte_crear();
} catch (Throwable $e) {
    decir('  ERROR: ' . $e->getMessage());
    exit(1);
}

decir('  Periodo: ' . $r['periodo']['desde'] . ' a ' . $r['periodo']['hasta'] . ' (' . $r['periodo']['dias'] . ' dias)');
decir('  Visitas: ' . $r['visitas']['total'] . ' de ' . $r['visitas']['personas'] . ' personas');
decir('  Buscador: ' . $r['buscador']['clics'] . ' clics, ' . $r['buscador']['impresiones']
    . ' impresiones, posicion ' . $r['buscador']['posicion']);
decir('  IA: ' . $r['ia']['lecturas'] . ' lecturas de ' . count($r['ia']['motores']) . ' motores');
decir('  Embudo: ' . $r['embudo']['acciones'] . ' acciones, ' . $r['embudo']['leads'] . ' prospectos');
decir('  Comparado contra: ' . ($r['anterior'] ? $r['anterior']['desde'] . ' a ' . $r['anterior']['hasta'] : 'nada, es el primero'));
foreach (['logros' => 'Logros', 'alertas' => 'Alertas', 'recomendaciones' => 'Recomendaciones'] as $k => $rot) {
    decir('  ' . $rot . ': ' . count($r['hallazgos'][$k]));
    foreach ($r['hallazgos'][$k] as $x) decir('      - ' . $x['titulo']);
}
decir('  Guardado con id ' . $r['id'] . '. El PDF se ve en el panel, en Reportes.');
