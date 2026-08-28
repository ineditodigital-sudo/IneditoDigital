<?php
/**
 * ============================================================
 * SINCRONIZACIÓN DIARIA CON SEARCH CONSOLE
 * ============================================================
 *
 * Guarda cada día una foto del estado del sitio en Google, para poder
 * comparar contra ayer en vez de contra la memoria:
 *
 *   - el estado de indexación de cada URL del sitemap
 *   - clics, impresiones, CTR y posición del sitio
 *   - la posición de cada consulta que ya genera impresiones
 *
 * Se corre por cron una vez al día:
 *   /usr/local/bin/ea-php83 /home/inedito/public_html/panel/cron/gsc_sync.php
 *
 * Se puede correr a mano las veces que sea: escribe una fila por día y URL,
 * así que repetirlo el mismo día actualiza en vez de duplicar.
 *
 * La lógica vive en panel/inc/gsc.php, compartida con el botón
 * "Actualizar ahora" del panel (que la corre por lotes vía gsc_paso.php
 * para no chocar con el corte de 100 s de Cloudflare).
 */
declare(strict_types=1);

$raiz = dirname(__DIR__, 2);
require_once $raiz . '/panel/bootstrap.php';
require_once $raiz . '/panel/inc/google.php';
require_once $raiz . '/panel/inc/gsc.php';

$porWeb = PHP_SAPI !== 'cli';
if ($porWeb) {
    require_login();
    header('Content-Type: text/plain; charset=utf-8');
}
@set_time_limit(600);
// Cloudflare corta la respuesta a los 100 s. Sin esto, PHP se muere con ella
// y la sincronizacion queda a medias. Por cron (CLI) no aplica.
@ignore_user_abort(true);

function paso(string $t): void { echo $t . "\n"; @ob_flush(); @flush(); }

gsc_tablas();

$tok = g_access_token();
if (!$tok) { paso('SIN CONEXIÓN: falta conectar Google en el panel.'); exit(1); }
$sitio = g_get('sc_site', 'sc-domain:inedito.digital');
$hoy = date('Y-m-d');
paso("Sincronizando $sitio · $hoy");

$tot = gsc_guardar_rendimiento($tok, $sitio, $hoy);
paso("  rendimiento 28d: {$tot['clics']} clics · {$tot['impresiones']} impresiones · CTR {$tot['ctr']}% · posición {$tot['posicion']}");
paso("  guardadas {$tot['consultas']} consultas");

$urls = gsc_urls_sitemap();
paso('  inspeccionando ' . count($urls) . ' URLs del sitemap...');
gsc_inspeccionar($tok, $sitio, $urls, $hoy);

$fin = gsc_cerrar_dia($hoy);
paso("  indexadas: {$fin['indexadas']} · fuera del índice: {$fin['fuera']}");

if ($fin['anterior']) {
    paso("\n  Cambios contra {$fin['anterior']}:");
    if (!$fin['cambios']) paso('    sin cambios de indexación');
    foreach ($fin['cambios'] as $c) {
        paso('    ' . str_replace('https://www.inedito.digital', '', $c['url']) . ': ' . $c['antes'] . ' → ' . $c['ahora']);
    }
} else {
    paso("\n  Primera foto guardada: desde mañana ya se puede comparar.");
}

paso("\nListo.");
