<?php
/**
 * Trae las opiniones de la ficha de Google (panel/inc/resenas.php).
 *
 * No hace falta ponerlo en cPanel: gsc_sync.php, que ya corre a diario, lo
 * hace al terminar. Existe para correrlo solo, por consola o desde el
 * navegador con sesión del panel:
 *   /usr/local/bin/ea-php83 /home/inedito/public_html/panel/cron/resenas_sync.php
 */
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../inc/google.php';
require_once __DIR__ . '/../inc/resenas.php';

if (PHP_SAPI !== 'cli') { require_login(); header('Content-Type: text/plain; charset=utf-8'); }

$r = resenas_sincronizar();
echo $r['ok'] ? "ok · {$r['resumen']}\n" : "FALLO: {$r['error']}\n";
