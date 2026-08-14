<?php
/** Verifica un token de administrador (para proteger el panel y sus datos). */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/admin_token.php';

$auth  = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
$token = (stripos($auth, 'Bearer ') === 0) ? substr($auth, 7) : ($_GET['token'] ?? ($_POST['token'] ?? null));
$p = admin_verify_token($cfg, $token);
echo json_encode(['ok' => (bool)$p, 'user' => $p['user'] ?? null]);
