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
/* El asistente marca 'whatsapp' cuando entrega la conversación por ahí. */
$canal   = $clean($data['canal']   ?? '');

/* --- Validación ---
 *
 * El formulario de contacto pide las cuatro cosas y siempre las manda. El
 * asistente, no: pregunta lo mínimo a propósito y muchas veces solo tiene el
 * nombre y lo que la persona quiere, porque el contacto se va a dar por
 * WhatsApp. Exigirle un correo válido significaba rechazar justo el lead que
 * ya venía caminando, así que en ese canal la conversación misma es la vía
 * de contacto y basta con saber quién es y qué pidió.
 */
$hayCorreo = $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
$hayTel    = strlen(preg_replace('/\D/', '', $phone)) >= 8;

$errors = [];
if ($name === '')                    $errors[] = 'name';
if ($message === '')                 $errors[] = 'message';
if ($email !== '' && !$hayCorreo)    $errors[] = 'email';
if (!$hayCorreo && !$hayTel && $canal !== 'whatsapp') {
    $errors[] = 'email';
    $errors[] = 'phone';
}
if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos inválidos', 'fields' => array_values(array_unique($errors))]);
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

/* --- Enviar correo ---
 *
 * TODOS los leads avisan, tambien los que se van por WhatsApp. Se probo lo
 * contrario —el mensaje ya llega al telefono, para que ademas un correo— y
 * no aguanta: quien recibe el WhatsApp no es siempre quien da seguimiento, y
 * el correo es el que queda como registro para el equipo. */
require __DIR__ . '/mailer.php';
require __DIR__ . '/email_template.php';
$lead['fecha'] = date('Y-m-d H:i:s');
$html    = lead_email_html($lead);
$texto   = lead_email_texto($lead);
/* El asunto dice quien y desde donde: en una bandeja llena, «Nuevo lead web»
   repetido veinte veces no distingue nada. */
$subject = 'Nuevo prospecto: ' . $name . ($company !== '' ? ' · ' . $company : ($service !== '' ? ' · ' . $service : ''));
$mailRes = send_lead_email($cfg, $lead, $html, $subject, $texto);

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
