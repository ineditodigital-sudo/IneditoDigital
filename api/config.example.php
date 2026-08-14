<?php
/**
 * PLANTILLA de configuración — Inédito Digital.
 *
 * Copiar como `config.php` y rellenar con las credenciales reales.
 * `config.php` está en .gitignore: NUNCA se sube al repositorio.
 * En el servidor vive solo en /public_html/api/config.php y está bloqueado
 * por HTTP desde api/.htaccess.
 *
 * Para generar un token_secret nuevo:  php -r "echo bin2hex(random_bytes(32));"
 */
return [
    'db' => [
        'host'    => 'localhost',
        'name'    => 'NOMBRE_BASE_DATOS',
        'user'    => 'USUARIO_BASE_DATOS',
        'pass'    => 'CONTRASENA_BASE_DATOS',
        'charset' => 'utf8mb4',
    ],
    'smtp' => [
        'host'       => 'localhost',
        'port'       => 465,
        'secure'     => 'ssl',
        'user'       => 'noreply@inedito.digital',
        'pass'       => 'CONTRASENA_SMTP',
        'from_email' => 'noreply@inedito.digital',
        'from_name'  => 'Inédito Digital · Web',
    ],
    'recipients' => [
        'armando@inedito.digital',
        'diego@inedito.digital',
    ],
    'allowed_hosts' => ['inedito.digital', 'www.inedito.digital'],
    'admin' => [
        'token_secret' => 'GENERAR_UNO_NUEVO_DE_64_CARACTERES_HEX',
        'token_ttl'    => 28800, // 8 horas
    ],
];
