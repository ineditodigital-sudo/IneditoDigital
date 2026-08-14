<?php
declare(strict_types=1);

/** Genera un token firmado (HMAC-SHA256) con caducidad. */
function admin_make_token(array $cfg, int $uid, string $user): string
{
    $payload = ['uid' => $uid, 'user' => $user, 'exp' => time() + (int)($cfg['admin']['token_ttl'] ?? 28800)];
    $json = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    $sig  = hash_hmac('sha256', $json, $cfg['admin']['token_secret']);
    return $json . '.' . $sig;
}

/** Verifica un token; devuelve el payload o null. */
function admin_verify_token(array $cfg, ?string $token): ?array
{
    if (!$token || strpos($token, '.') === false) return null;
    [$json, $sig] = explode('.', $token, 2);
    $expected = hash_hmac('sha256', $json, $cfg['admin']['token_secret']);
    if (!hash_equals($expected, $sig)) return null;
    $p = json_decode(base64_decode(strtr($json, '-_', '+/')), true);
    if (!is_array($p) || (int)($p['exp'] ?? 0) < time()) return null;
    return $p;
}
