<?php
/**
 * Emisor de tokens de admin — SOLO línea de comandos (CLI).
 *
 * Genera un token HMAC-SHA256 firmado con `admin.token_secret` de config.php,
 * usando el MISMO esquema que api/admin_token.php, pero con un TTL a medida
 * (por defecto largo) para consumidores automáticos de solo lectura como el
 * puente de analítica del agente de marketing.
 *
 * El secreto NUNCA se imprime ni sale de este proceso: solo se emite el token.
 *
 * Uso (en el servidor, o donde viva config.php con el secreto de producción):
 *   php api/admin_issue_token.php [dias] [scope] [usuario]
 *   php api/admin_issue_token.php 3650 readonly analytics-bot
 *
 * - dias    : caducidad en días (por defecto 3650 ≈ 10 años).
 * - scope   : alcance guardado en el payload firmado ('readonly' para el
 *             puente de analítica). YA SE HACE CUMPLIR: los endpoints que
 *             mutan datos (p. ej. admin_leads.php) rechazan con 403 un token
 *             con scope 'readonly'; la analítica (solo lectura) lo acepta.
 * - usuario : nombre para atribución en el payload (por defecto 'analytics-bot').
 *
 * Imprime EXCLUSIVAMENTE el token en stdout (una línea), para poder capturarlo
 * en una variable de entorno sin filtrar nada más.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$cfg = require __DIR__ . '/config.php';
require __DIR__ . '/admin_token.php';

$dias  = isset($argv[1]) ? max(1, (int)$argv[1]) : 3650;
$scope = isset($argv[2]) ? preg_replace('/[^a-z0-9_-]/i', '', (string)$argv[2]) : 'readonly';
$user  = isset($argv[3]) ? substr((string)$argv[3], 0, 60) : 'analytics-bot';

$secret = $cfg['admin']['token_secret'] ?? '';
if (!is_string($secret) || strlen($secret) < 16) {
    fwrite(STDERR, "ERROR: admin.token_secret ausente o demasiado corto en config.php\n");
    exit(1);
}

// Mismo formato que admin_make_token(), con exp a medida y claim de scope.
$payload = [
    'uid'   => 0,
    'user'  => $user,
    'scope' => $scope,
    'exp'   => time() + ($dias * 86400),
];
$json = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
$sig  = hash_hmac('sha256', $json, $secret);

echo $json . '.' . $sig . "\n";
