<?php
/**
 * Analítica del panel, expuesta como JSON de SOLO LECTURA.
 *
 * Espeja los agregados que ya calcula panel/pages/analiticas.php (pageviews,
 * GSC, ia_bots, events, embudo de leads) para que un script los baje y un
 * agente solo interprete el resultado. NO escribe nada en la base.
 *
 * Auth: idéntica a api/admin_leads.php — token HMAC de api/admin_token.php,
 * por cabecera `Authorization: Bearer <token>` o por `?token=<token>`.
 * (En producción el host suele descartar la cabecera Authorization; usa
 * `?token=` como en el resto del panel.)
 *
 * Ventana: parámetros `from` y `to` (YYYY-MM-DD, inclusivos). Por defecto,
 * los últimos 28 días. Sirve para pedir 28d vs 28d y grupos de control.
 *
 * SOLO LECTURA: rechaza métodos que no sean GET/POST/OPTIONS y cualquier
 * acción de escritura conocida.
 */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

// --- CORS: mismos hosts que el resto del panel ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    $h = parse_url($origin, PHP_URL_HOST) ?? '';
    if (in_array($h, $cfg['allowed_hosts'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') { http_response_code(204); exit; }

// SOLO LECTURA: solo GET/POST (POST se admite para pasar la ventana/token en el cuerpo).
if (!in_array($method, ['GET', 'POST'], true)) {
    http_response_code(405);
    header('Allow: GET, POST, OPTIONS');
    echo json_encode(['ok' => false, 'error' => 'Método no permitido (solo lectura)']); exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) $body = [];

require __DIR__ . '/admin_token.php';
$auth  = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
$token = (stripos($auth, 'Bearer ') === 0) ? substr($auth, 7) : ($_GET['token'] ?? ($body['token'] ?? ($_POST['token'] ?? null)));
if (!admin_verify_token($cfg, $token)) {
    http_response_code(401); echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

// Rechazo explícito de acciones de escritura: este endpoint no muta nada.
$action = (string)($body['action'] ?? ($_GET['action'] ?? ''));
$prohibidas = ['update_status', 'delete', 'update', 'insert', 'create', 'save', 'set'];
if ($action !== '' && in_array(strtolower($action), $prohibidas, true)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Endpoint de solo lectura: acción de escritura no permitida']); exit;
}

// --- Ventana de fechas ---
$isDate = static fn($s) => is_string($s) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) && strtotime($s) !== false;
$to   = $_GET['to']   ?? ($body['to']   ?? null);
$from = $_GET['from'] ?? ($body['from'] ?? null);
if (!$isDate($to))   $to   = date('Y-m-d');
if (!$isDate($from)) $from = date('Y-m-d', strtotime($to . ' -27 day')); // 28 días inclusivos
if (strtotime($from) > strtotime($to)) { $tmp = $from; $from = $to; $to = $tmp; }
$dias = (int)round((strtotime($to) - strtotime($from)) / 86400) + 1;

// Límites para créated_at (datetime): [from 00:00:00, to+1 00:00:00)
$fromDt = $from . ' 00:00:00';
$toExcl = date('Y-m-d', strtotime($to . ' +1 day')) . ' 00:00:00';
$P = [':from' => $fromDt, ':to' => $toExcl];   // pageviews / events / leads
$PF = [':df' => $from, ':dt' => $to];          // columnas DATE (ia_bots.fecha, gsc_*.fecha)

require __DIR__ . '/db.php';

try {
    $pdo = db_connect($cfg);
} catch (Throwable $e) {
    error_log('[admin_analytics] DB connect: ' . $e->getMessage());
    http_response_code(500); echo json_encode(['ok' => false, 'error' => 'Error del servidor']); exit;
}

/** Ejecuta y devuelve filas; ante error (p. ej. tabla ausente) devuelve []. */
$q = static function (string $sql, array $p = []) use ($pdo): array {
    try { $st = $pdo->prepare($sql); $st->execute($p); return $st->fetchAll(); }
    catch (Throwable $e) { return []; }
};
/** Primer escalar de la primera fila (0 si nada). */
$q1 = static function (string $sql, array $p = []) use ($q) {
    $r = $q($sql, $p); return $r ? array_values($r[0])[0] : 0;
};
$tableExists = static function (string $t) use ($pdo): bool {
    try { $pdo->query("SELECT 1 FROM `$t` LIMIT 1"); return true; }
    catch (Throwable $e) { return false; }
};

$W  = "created_at >= :from AND created_at < :to"; // ventana datetime

// ============ PAGEVIEWS ============
$pv = [
    'visits'   => (int)$q1("SELECT COUNT(*) FROM pageviews WHERE $W", $P),
    'uniques'  => (int)$q1("SELECT COUNT(DISTINCT visitor) FROM pageviews WHERE $W", $P),
    'sessions' => (int)$q1("SELECT COUNT(DISTINCT session) FROM pageviews WHERE $W", $P),
    'by_day'    => array_map(fn($r) => ['date' => $r['d'], 'count' => (int)$r['c']],
        $q("SELECT DATE(created_at) d, COUNT(*) c FROM pageviews WHERE $W GROUP BY DATE(created_at) ORDER BY d", $P)),
    'by_source' => array_map(fn($r) => ['source' => $r['source'], 'count' => (int)$r['c']],
        $q("SELECT source, COUNT(*) c FROM pageviews WHERE $W GROUP BY source ORDER BY c DESC", $P)),
    'by_device' => array_map(fn($r) => ['device' => $r['device'], 'count' => (int)$r['c']],
        $q("SELECT device, COUNT(*) c FROM pageviews WHERE $W GROUP BY device ORDER BY c DESC", $P)),
    'top_paths' => array_map(fn($r) => ['path' => $r['path'], 'count' => (int)$r['c']],
        $q("SELECT path, COUNT(*) c FROM pageviews WHERE $W GROUP BY path ORDER BY c DESC LIMIT 20", $P)),
    'ia_visits_by_day' => array_map(fn($r) => ['date' => $r['f'], 'count' => (int)$r['c']],
        $q("SELECT DATE(created_at) f, COUNT(*) c FROM pageviews WHERE $W AND source='ia' GROUP BY 1 ORDER BY 1", $P)),
];
$pv['ia_visits_total'] = (int)$q1("SELECT COUNT(*) FROM pageviews WHERE $W AND source='ia'", $P);

// ============ GOOGLE SEARCH CONSOLE ============
$gsc = ['available' => false, 'totales' => [], 'latest' => null, 'consultas' => [], 'indexacion' => []];
if ($tableExists('gsc_totales')) {
    $gsc['available'] = true;
    $gsc['totales'] = $q(
        "SELECT fecha, indexadas, sin_indexar, impresiones, clics, ctr, posicion
         FROM gsc_totales WHERE fecha BETWEEN :df AND :dt ORDER BY fecha", $PF);
    // Última foto DENTRO de la ventana (o la más reciente disponible si la ventana está vacía).
    $latest = $q("SELECT * FROM gsc_totales WHERE fecha BETWEEN :df AND :dt ORDER BY fecha DESC LIMIT 1", $PF);
    if (!$latest) $latest = $q("SELECT * FROM gsc_totales ORDER BY fecha DESC LIMIT 1");
    $gsc['latest'] = $latest ? $latest[0] : null;
    if ($gsc['latest']) {
        $f = $gsc['latest']['fecha'];
        $gsc['consultas'] = $q(
            "SELECT consulta, clics, impresiones, posicion FROM gsc_consultas
             WHERE fecha = :f ORDER BY impresiones DESC LIMIT 100", [':f' => $f]);
        $gsc['indexacion'] = $q(
            "SELECT url, estado, ultimo_rastreo FROM gsc_indexacion
             WHERE fecha = :f ORDER BY estado, url", [':f' => $f]);
    }
}

// ============ BOTS DE IA (lecturas de asistentes) ============
// Se filtra a rutas reales del sitio, igual que el panel: los escáneres que
// se disfrazan de GPTBot/ClaudeBot piden rutas inexistentes y ensucian el conteo.
$rutasSitio = ['/', '/servicios', '/portafolio', '/blog', '/servicios-ia', '/nosotros',
               '/contacto', '/privacidad', '/terminos'];
try {
    foreach ($pdo->query("SELECT slug FROM services WHERE status='published'") as $r) $rutasSitio[] = '/servicios/' . $r['slug'];
    foreach ($pdo->query("SELECT slug FROM portfolio WHERE status='published'") as $r) $rutasSitio[] = '/portafolio/' . $r['slug'];
    foreach ($pdo->query("SELECT slug FROM blog_posts WHERE status='published'") as $r) $rutasSitio[] = '/blog/' . $r['slug'];
    foreach ($pdo->query("SELECT ruta FROM pages WHERE status='published' AND ruta <> ''") as $r) $rutasSitio[] = $r['ruta'];
} catch (Throwable $e) { $rutasSitio = []; }
$iaFiltro = ''; $iaParams = $PF;
if ($rutasSitio) {
    $rutasSitio = array_values(array_unique($rutasSitio));
    $marcas = [];
    foreach ($rutasSitio as $i => $ruta) { $marcas[] = ':r' . $i; $iaParams[':r' . $i] = $ruta; }
    $iaFiltro = ' AND url IN (' . implode(',', $marcas) . ')';
}
$ia = ['available' => false, 'reads_total' => 0, 'by_day' => [], 'by_bot' => [], 'top_urls' => []];
if ($tableExists('ia_bots')) {
    $ia['available'] = true;
    $WF = "fecha BETWEEN :df AND :dt" . $iaFiltro;
    $ia['by_day'] = array_map(fn($r) => ['date' => $r['f'], 'count' => (int)$r['c']],
        $q("SELECT fecha f, SUM(hits) c FROM ia_bots WHERE $WF GROUP BY 1 ORDER BY 1", $iaParams));
    $ia['by_bot'] = array_map(fn($r) => ['bot' => $r['bot'], 'count' => (int)$r['c']],
        $q("SELECT bot, SUM(hits) c FROM ia_bots WHERE $WF GROUP BY 1 ORDER BY 2 DESC", $iaParams));
    $ia['top_urls'] = array_map(fn($r) => ['url' => $r['url'], 'count' => (int)$r['c'], 'bots' => (int)$r['motores']],
        $q("SELECT url, SUM(hits) c, COUNT(DISTINCT bot) motores FROM ia_bots WHERE $WF GROUP BY 1 ORDER BY 2 DESC LIMIT 20", $iaParams));
    $ia['reads_total'] = array_sum(array_map(fn($r) => (int)$r['count'], $ia['by_bot']));
}

// ============ EVENTOS (engagement) ============
$events = ['available' => false, 'total' => 0, 'people' => 0, 'by_type' => [], 'asistente_detalle' => []];
if ($tableExists('events')) {
    $events['available'] = true;
    $events['by_type'] = array_map(fn($r) => ['evento' => $r['evento'], 'count' => (int)$r['c'], 'people' => (int)$r['u']],
        $q("SELECT evento, COUNT(*) c, COUNT(DISTINCT NULLIF(visitor,'')) u FROM events WHERE $W GROUP BY 1 ORDER BY 2 DESC", $P));
    $events['total'] = array_sum(array_map(fn($r) => (int)$r['count'], $events['by_type']));
    $events['people'] = (int)$q1("SELECT COUNT(DISTINCT NULLIF(visitor,'')) FROM events WHERE $W", $P);
    $events['asistente_detalle'] = array_map(fn($r) => ['detalle' => $r['detalle'], 'count' => (int)$r['c']],
        $q("SELECT detalle, COUNT(*) c FROM events WHERE $W AND evento='asistente' AND detalle <> '' GROUP BY 1 ORDER BY 2 DESC LIMIT 8", $P));
}

// ============ EMBUDO DE LEADS ============
// Excluye las pruebas de integración, igual que el panel.
$leads = [
    'total'     => (int)$q1("SELECT COUNT(*) FROM leads WHERE $W AND source <> 'Prueba de integracion'", $P),
    'by_status' => array_map(fn($r) => ['status' => $r['status'], 'count' => (int)$r['c']],
        $q("SELECT status, COUNT(*) c FROM leads WHERE $W AND source <> 'Prueba de integracion' GROUP BY status ORDER BY c DESC", $P)),
    'by_source' => array_map(fn($r) => ['source' => $r['source'], 'count' => (int)$r['c']],
        $q("SELECT source, COUNT(*) c FROM leads WHERE $W AND source <> 'Prueba de integracion' GROUP BY source ORDER BY c DESC", $P)),
];

echo json_encode([
    'ok' => true,
    'window' => ['from' => $from, 'to' => $to, 'days' => $dias],
    'generated_at' => date('c'),
    'pageviews' => $pv,
    'gsc' => $gsc,
    'ia_bots' => $ia,
    'events' => $events,
    'leads' => $leads,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
