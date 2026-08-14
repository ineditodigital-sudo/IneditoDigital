<?php
/** Login de administrador validado contra MySQL con password_verify (bcrypt). */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    $h = parse_url($origin, PHP_URL_HOST) ?? '';
    if (in_array($h, $cfg['allowed_hosts'], true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405); echo json_encode(['ok' => false, 'error' => 'Método no permitido']); exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) $data = $_POST;
$username = trim((string)($data['username'] ?? ''));
$password = (string)($data['password'] ?? '');
if ($username === '' || $password === '') {
    http_response_code(422); echo json_encode(['ok' => false, 'error' => 'Faltan credenciales']); exit;
}

require __DIR__ . '/db.php';
try {
    $pdo = db_connect($cfg);
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $row = $stmt->fetch();
} catch (Throwable $e) {
    error_log('[admin_login] DB: ' . $e->getMessage());
    http_response_code(500); echo json_encode(['ok' => false, 'error' => 'Error del servidor']); exit;
}

// Comparación en tiempo ~constante aunque el usuario no exista
$hash = $row['password_hash'] ?? '$2y$10$abcdefghijklmnopqrstuvCa/qz6vJH5xkq0kq0kq0kq0kq0kq0kq';
if (!$row || !password_verify($password, $hash)) {
    usleep(400000);
    http_response_code(401); echo json_encode(['ok' => false, 'error' => 'Credenciales incorrectas']); exit;
}

require __DIR__ . '/admin_token.php';
$token = admin_make_token($cfg, (int)$row['id'], $row['username']);
echo json_encode(['ok' => true, 'token' => $token, 'user' => $row['username']]);
