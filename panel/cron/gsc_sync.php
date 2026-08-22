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
 * Sirve para dos cosas: que el panel muestre la evolución, y que se pueda
 * contestar "¿qué cambió desde la última vez?" con datos y no con
 * impresiones. Todo con permiso de solo lectura.
 *
 * Se corre por cron una vez al día:
 *   /usr/local/bin/ea-php83 /home/inedito/public_html/panel/cron/gsc_sync.php
 *
 * Se puede correr a mano las veces que sea: escribe una fila por día y URL,
 * así que repetirlo el mismo día actualiza en vez de duplicar.
 */
declare(strict_types=1);

$raiz = dirname(__DIR__, 2);
require_once $raiz . '/panel/bootstrap.php';
require_once $raiz . '/panel/inc/google.php';

$porWeb = PHP_SAPI !== 'cli';
if ($porWeb) {
    require_login();
    header('Content-Type: text/plain; charset=utf-8');
}
@set_time_limit(600);
// Cloudflare corta la respuesta a los 100 s. Sin esto, PHP se muere con ella
// y la sincronizacion queda a medias. Por cron (CLI) no aplica, pero el
// disparo manual desde el navegador tambien tiene que poder terminar.
@ignore_user_abort(true);

function paso(string $t): void { echo $t . "\n"; @ob_flush(); @flush(); }

/* ------------------------------------------------------------------ */
/* Tablas                                                              */
/* ------------------------------------------------------------------ */
db()->exec("CREATE TABLE IF NOT EXISTS gsc_indexacion (
  fecha DATE NOT NULL,
  url VARCHAR(255) NOT NULL,
  estado VARCHAR(120) NOT NULL,
  ultimo_rastreo DATE NULL,
  PRIMARY KEY (fecha, url)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

db()->exec("CREATE TABLE IF NOT EXISTS gsc_totales (
  fecha DATE NOT NULL PRIMARY KEY,
  clics INT NOT NULL DEFAULT 0,
  impresiones INT NOT NULL DEFAULT 0,
  ctr DECIMAL(6,3) NOT NULL DEFAULT 0,
  posicion DECIMAL(6,2) NOT NULL DEFAULT 0,
  indexadas INT NOT NULL DEFAULT 0,
  sin_indexar INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

db()->exec("CREATE TABLE IF NOT EXISTS gsc_consultas (
  fecha DATE NOT NULL,
  consulta VARCHAR(255) NOT NULL,
  clics INT NOT NULL DEFAULT 0,
  impresiones INT NOT NULL DEFAULT 0,
  posicion DECIMAL(6,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (fecha, consulta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

/* ------------------------------------------------------------------ */
/* Conexión                                                            */
/* ------------------------------------------------------------------ */
$tok = g_access_token();
if (!$tok) { paso('SIN CONEXIÓN: falta conectar Google en el panel.'); exit(1); }
$sitio = g_get('sc_site', 'sc-domain:inedito.digital');
$hoy = date('Y-m-d');
paso("Sincronizando $sitio · $hoy");

/* ------------------------------------------------------------------ */
/* 1 · Rendimiento                                                     */
/* ------------------------------------------------------------------ */
// Google publica los datos con dos días de retraso; se pide una ventana
// de 28 días que termina ahí, para comparar siempre lo mismo.
$hasta = date('Y-m-d', strtotime('-2 days'));
$desde = date('Y-m-d', strtotime('-30 days'));

function consultar(string $sitio, string $tok, array $cuerpo): array {
    $u = 'https://www.googleapis.com/webmasters/v3/sites/' . rawurlencode($sitio) . '/searchAnalytics/query';
    $r = g_http($u, json_encode($cuerpo), ['Authorization: Bearer ' . $tok, 'Content-Type: application/json']);
    return $r['json'] ?? [];
}

$t = consultar($sitio, $tok, ['startDate' => $desde, 'endDate' => $hasta, 'dimensions' => []]);
$fila = $t['rows'][0] ?? null;
$clics = (int)($fila['clicks'] ?? 0);
$impr  = (int)($fila['impressions'] ?? 0);
$ctr   = round((float)($fila['ctr'] ?? 0) * 100, 3);
$pos   = round((float)($fila['position'] ?? 0), 2);
paso("  rendimiento 28d: $clics clics · $impr impresiones · CTR {$ctr}% · posición $pos");

$q = consultar($sitio, $tok, ['startDate' => $desde, 'endDate' => $hasta, 'dimensions' => ['query'], 'rowLimit' => 500]);
$st = db()->prepare("INSERT INTO gsc_consultas (fecha,consulta,clics,impresiones,posicion) VALUES (:f,:c,:cl,:i,:p)
                     ON DUPLICATE KEY UPDATE clics=VALUES(clics), impresiones=VALUES(impresiones), posicion=VALUES(posicion)");
$n = 0;
foreach (($q['rows'] ?? []) as $r) {
    $st->execute([':f' => $hoy, ':c' => mb_substr($r['keys'][0], 0, 255), ':cl' => (int)$r['clicks'],
                  ':i' => (int)$r['impressions'], ':p' => round((float)$r['position'], 2)]);
    $n++;
}
paso("  guardadas $n consultas");

/* ------------------------------------------------------------------ */
/* 2 · Indexación URL por URL                                          */
/* ------------------------------------------------------------------ */
$ch = curl_init('https://www.inedito.digital/sitemap.xml');
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20]);
$xml = (string)curl_exec($ch);
curl_close($ch);
preg_match_all('~<loc>([^<]+)</loc>~', $xml, $m);
$urls = $m[1];
paso('  inspeccionando ' . count($urls) . ' URLs del sitemap...');

$ins = db()->prepare("INSERT INTO gsc_indexacion (fecha,url,estado,ultimo_rastreo) VALUES (:f,:u,:e,:r)
                      ON DUPLICATE KEY UPDATE estado=VALUES(estado), ultimo_rastreo=VALUES(ultimo_rastreo)");
$indexadas = 0; $fuera = 0;
foreach ($urls as $u) {
    $r = g_http('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
        json_encode(['inspectionUrl' => $u, 'siteUrl' => $sitio, 'languageCode' => 'es-MX']),
        ['Authorization: Bearer ' . $tok, 'Content-Type: application/json']);
    $s = $r['json']['inspectionResult']['indexStatusResult'] ?? null;
    if (!$s) continue;
    $estado = (string)($s['coverageState'] ?? 'desconocido');
    $rastreo = !empty($s['lastCrawlTime']) ? substr($s['lastCrawlTime'], 0, 10) : null;
    $ins->execute([':f' => $hoy, ':u' => mb_substr($u, 0, 255), ':e' => mb_substr($estado, 0, 120), ':r' => $rastreo]);
    // "Enviada e indexada" y variantes cuentan como dentro del índice
    stripos($estado, 'indexada') !== false && stripos($estado, 'sin indexar') === false ? $indexadas++ : $fuera++;
    usleep(60000);
}
paso("  indexadas: $indexadas · fuera del índice: $fuera");

db()->prepare("INSERT INTO gsc_totales (fecha,clics,impresiones,ctr,posicion,indexadas,sin_indexar)
               VALUES (:f,:c,:i,:t,:p,:ix,:si)
               ON DUPLICATE KEY UPDATE clics=VALUES(clics), impresiones=VALUES(impresiones), ctr=VALUES(ctr),
                                       posicion=VALUES(posicion), indexadas=VALUES(indexadas), sin_indexar=VALUES(sin_indexar)")
  ->execute([':f' => $hoy, ':c' => $clics, ':i' => $impr, ':t' => $ctr, ':p' => $pos, ':ix' => $indexadas, ':si' => $fuera]);

/* ------------------------------------------------------------------ */
/* 3 · Qué cambió desde la foto anterior                               */
/* ------------------------------------------------------------------ */
$ant = db()->query("SELECT MAX(fecha) FROM gsc_indexacion WHERE fecha < '$hoy'")->fetchColumn();
if ($ant) {
    paso("\n  Cambios contra $ant:");
    $cambios = db()->prepare("SELECT h.url, v.estado AS antes, h.estado AS ahora
                              FROM gsc_indexacion h JOIN gsc_indexacion v ON v.url = h.url AND v.fecha = :a
                              WHERE h.fecha = :h AND h.estado <> v.estado");
    $cambios->execute([':a' => $ant, ':h' => $hoy]);
    $filas = $cambios->fetchAll();
    if (!$filas) paso('    sin cambios de indexación');
    foreach ($filas as $c) {
        paso('    ' . str_replace('https://www.inedito.digital', '', $c['url']) . ': ' . $c['antes'] . ' → ' . $c['ahora']);
    }
} else {
    paso("\n  Primera foto guardada: desde mañana ya se puede comparar.");
}

paso("\nListo.");
