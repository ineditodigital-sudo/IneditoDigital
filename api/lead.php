<?php
/**
 * Endpoint de recepción de leads del formulario de contacto.
 * POST /api/lead.php  (JSON)  ->  guarda en MySQL + envía correo a Armando y Diego.
 */
declare(strict_types=1);

$cfg = require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

// --- CORS (solo dominios propios; para same-origin ni siquiera aplica) ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    $host = parse_url($origin, PHP_URL_HOST) ?? '';
    if (in_array($host, $cfg['allowed_hosts'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// --- Leer JSON ---
$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) { $data = $_POST; }

// --- Anti-spam: honeypot. Si el campo oculto 'website' viene lleno, es bot. ---
if (!empty($data['website'])) { echo json_encode(['ok' => true]); exit; }

$clean = fn($v) => trim((string)($v ?? ''));
$name    = $clean($data['name']    ?? '');
$email   = $clean($data['email']   ?? '');
$phone   = $clean($data['phone']   ?? '');
$company = $clean($data['company'] ?? '');
$service = $clean($data['service'] ?? '');
$message = $clean($data['message'] ?? '');
$source  = $clean($data['source']  ?? '') ?: 'Formulario de contacto web';

// --- Validación ---
$errors = [];
if ($name === '')                                     $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))       $errors[] = 'email';
if ($phone === '')                                    $errors[] = 'phone';
if ($message === '')                                  $errors[] = 'message';
if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos inválidos', 'fields' => $errors]);
    exit;
}

$lead = compact('name', 'email', 'phone', 'company', 'service', 'message', 'source');

// --- Guardar en MySQL ---
$dbFailed = false;
try {
    require __DIR__ . '/db.php';
    $pdo = db_connect($cfg);
    $stmt = $pdo->prepare(
        'INSERT INTO leads (name,email,phone,company,service,message,source,ip,user_agent)
         VALUES (:name,:email,:phone,:company,:service,:message,:source,:ip,:ua)'
    );
    $stmt->execute([
        ':name' => $name, ':email' => $email, ':phone' => $phone,
        ':company' => $company, ':service' => $service, ':message' => $message,
        ':source' => $source,
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ':ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
    ]);
} catch (Throwable $e) {
    $dbFailed = true;
    error_log('[lead] DB error: ' . $e->getMessage());
}

// --- Enviar correo ---
require __DIR__ . '/mailer.php';
require __DIR__ . '/email_template.php';
$html    = lead_email_html($lead);
$subject = 'Nuevo lead web: ' . $name . ($company !== '' ? ' (' . $company . ')' : '');
$mailRes = send_lead_email($cfg, $lead, $html, $subject);

if (!$mailRes['ok']) {
    error_log('[lead] Mail error: ' . ($mailRes['error'] ?? '?'));
    // Si también falló la BD, no se guardó nada: error real.
    if ($dbFailed) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'No se pudo procesar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.']);
        exit;
    }
}

echo json_encode(['ok' => true]);
