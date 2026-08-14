<?php
/** Leads del panel (protegido por token de admin).
 *  GET / action=list       -> lista de leads (MySQL)
 *  POST action=update_status {id,status}
 *  POST action=delete       {id}
 */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

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
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

// Cuerpo JSON (para token, acción y parámetros)
$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) $body = [];

require __DIR__ . '/admin_token.php';
$auth  = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
$token = (stripos($auth, 'Bearer ') === 0) ? substr($auth, 7) : ($_GET['token'] ?? ($body['token'] ?? ($_POST['token'] ?? null)));
if (!admin_verify_token($cfg, $token)) {
    http_response_code(401); echo json_encode(['ok' => false, 'error' => 'No autorizado']); exit;
}

$action = $body['action'] ?? ($_GET['action'] ?? 'list');
$idInt  = static fn($v) => (int) preg_replace('/\D/', '', (string)$v); // 'lead_3' -> 3

require __DIR__ . '/db.php';
try {
    $pdo = db_connect($cfg);

    if ($action === 'update_status') {
        $id = $idInt($body['id'] ?? '');
        $status = (string)($body['status'] ?? '');
        $allowed = ['new', 'contacted', 'qualified', 'converted', 'lost'];
        if (!$id || !in_array($status, $allowed, true)) {
            http_response_code(422); echo json_encode(['ok' => false, 'error' => 'Datos inválidos']); exit;
        }
        $stmt = $pdo->prepare('UPDATE leads SET status = :s WHERE id = :id');
        $stmt->execute([':s' => $status, ':id' => $id]);
        echo json_encode(['ok' => true]); exit;
    }

    if ($action === 'delete') {
        $id = $idInt($body['id'] ?? '');
        if (!$id) { http_response_code(422); echo json_encode(['ok' => false, 'error' => 'ID inválido']); exit; }
        $stmt = $pdo->prepare('DELETE FROM leads WHERE id = :id');
        $stmt->execute([':id' => $id]);
        echo json_encode(['ok' => true]); exit;
    }

    // list
    $rows = $pdo->query(
        'SELECT id, name, email, phone, company, service, industry, objective, urgency,
                budget, has_site, message, source, status, created_at
         FROM leads ORDER BY created_at DESC, id DESC'
    )->fetchAll();
} catch (Throwable $e) {
    error_log('[admin_leads] DB: ' . $e->getMessage());
    http_response_code(500); echo json_encode(['ok' => false, 'error' => 'Error del servidor']); exit;
}

$leads = array_map(function ($r) {
    return [
        'id' => 'lead_' . $r['id'], 'name' => $r['name'], 'email' => $r['email'],
        'phone' => $r['phone'], 'company' => $r['company'], 'service' => $r['service'],
        'industry' => $r['industry'], 'objective' => $r['objective'], 'urgency' => $r['urgency'],
        'budget' => $r['budget'], 'hasSite' => $r['has_site'], 'message' => $r['message'],
        'source' => $r['source'], 'status' => $r['status'],
        'date' => date('c', strtotime((string)$r['created_at'])),
    ];
}, $rows);

echo json_encode(['ok' => true, 'leads' => $leads]);
