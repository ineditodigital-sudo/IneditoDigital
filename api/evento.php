<?php
/**
 * Beacon de acciones: el hermano de hit.php.
 *
 * hit.php cuenta vistas; esto cuenta lo que la gente HACE — abrir el
 * asistente, tocar WhatsApp, tocar el teléfono. Con las dos tablas el panel
 * dibuja el embudo completo: visitantes → acciones → leads.
 *
 * Mismas exclusiones que las vistas: bots por user-agent y el equipo por la
 * cookie que planta el login del panel.
 */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: image/gif');
$gif = base64_decode('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (preg_match('/bot|crawl|spider|slurp|preview|monitor|facebookexternalhit|whatsapp|telegram|gptbot|claudebot|perplexity|google-extended|bingpreview|headless|lighthouse/i', $ua)) { echo $gif; exit; }
if (!empty($_COOKIE['_nc'])) { echo $gif; exit; }

$evento = substr(preg_replace('/[^a-z_]/', '', strtolower((string)($_GET['e'] ?? ''))), 0, 40);
if ($evento === '') { echo $gif; exit; }
$detalle = substr((string)($_GET['d'] ?? ''), 0, 160);
$path    = substr((string)($_GET['p'] ?? ''), 0, 255);

// las cookies de visitante las planta hit.php en la primera vista;
// aquí solo se leen, para poder cruzar acción con visitante
$vis = preg_match('/^[a-f0-9]{32}$/', $_COOKIE['_iv'] ?? '') ? $_COOKIE['_iv'] : '';
$ses = preg_match('/^[a-f0-9]{32}$/', $_COOKIE['_is'] ?? '') ? $_COOKIE['_is'] : '';

try {
    require __DIR__ . '/db.php';
    $pdo = db_connect($cfg);
    $pdo->prepare("INSERT INTO events (evento, detalle, path, visitor, session) VALUES (:e,:d,:p,:v,:s)")
        ->execute([':e' => $evento, ':d' => $detalle, ':p' => $path, ':v' => $vis, ':s' => $ses]);
} catch (Throwable $e) { /* silencioso: la tabla la crea el panel */ }
echo $gif;
