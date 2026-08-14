<?php
declare(strict_types=1);
session_start();
ob_start();
$GLOBALS['cfg'] = require __DIR__ . '/../api/config.php';

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $d = $GLOBALS['cfg']['db'];
    $pdo = new PDO("mysql:host={$d['host']};dbname={$d['name']};charset={$d['charset']}", $d['user'], $d['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
function is_logged(): bool { return !empty($_SESSION['admin_id']); }
function require_login(): void { if (!is_logged()) { header('Location: /panel/login.php'); exit; } }
function csrf(): string { if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16)); return $_SESSION['csrf']; }
function csrf_check(): void { if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) { http_response_code(400); exit('Solicitud inválida (CSRF).'); } }
function e($v): string { return htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8'); }
function redirect(string $to): void { while (ob_get_level() > 0) ob_end_clean(); header('Location: ' . $to); exit; }
function set_flash(string $m): void { $_SESSION['flash'] = $m; }
function get_flash(): ?string { $m = $_SESSION['flash'] ?? null; unset($_SESSION['flash']); return $m; }
function slugify(string $s): string {
    $s = iconv('UTF-8','ASCII//TRANSLIT',$s); $s = strtolower(preg_replace('/[^a-zA-Z0-9]+/','-',$s));
    return trim($s,'-');
}
