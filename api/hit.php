<?php
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: image/gif');
// respuesta mínima (gif 1x1) para el beacon
$gif = base64_decode('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
// excluir bots
if (preg_match('/bot|crawl|spider|slurp|preview|monitor|facebookexternalhit|whatsapp|telegram|gptbot|claudebot|perplexity|google-extended|bingpreview|headless|lighthouse/i', $ua)) { echo $gif; exit; }

// cookies de visitante y sesión
$vis = $_COOKIE['_iv'] ?? '';
$newVisitor = 0;
if (!preg_match('/^[a-f0-9]{32}$/', $vis)) { $vis = bin2hex(random_bytes(16)); $newVisitor = 1; setcookie('_iv', $vis, ['expires'=>time()+31536000,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']); }
$ses = $_COOKIE['_is'] ?? '';
if (!preg_match('/^[a-f0-9]{32}$/', $ses)) { $ses = bin2hex(random_bytes(16)); setcookie('_is', $ses, ['expires'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']); }

$path = substr((string)($_GET['p'] ?? '/'), 0, 255);
if ($path === '') $path = '/';
$ref  = substr((string)($_GET['r'] ?? ($_SERVER['HTTP_REFERER'] ?? '')), 0, 255);
$host = $ref !== '' ? (parse_url($ref, PHP_URL_HOST) ?: '') : '';

$src = 'direct';
if ($host !== '') {
    if (strpos($host, 'inedito.digital') !== false)                              $src = 'internal';
    elseif (preg_match('/google|bing|yahoo|duckduckgo|ecosia|yandex/i', $host))   $src = 'organic';
    elseif (preg_match('/facebook|fb\.com|instagram|t\.co|twitter|x\.com|linkedin|youtube|tiktok|whatsapp|wa\.me|pinterest/i', $host)) $src = 'social';
    else                                                                          $src = 'referral';
}
$device = preg_match('/mobile|android|iphone|ipod|windows phone/i', $ua) ? 'mobile' : (preg_match('/ipad|tablet/i', $ua) ? 'tablet' : 'desktop');
$browser = 'Otro';
foreach (['Edg'=>'Edge','OPR'=>'Opera','Chrome'=>'Chrome','Firefox'=>'Firefox','Safari'=>'Safari'] as $k=>$name) { if (stripos($ua,$k)!==false) { $browser=$name; break; } }

try {
    require __DIR__ . '/db.php';
    $pdo = db_connect($cfg);
    $st = $pdo->prepare("INSERT INTO pageviews (path, referrer, source, visitor, session, device, browser, is_new) VALUES (:p,:r,:s,:v,:se,:d,:b,:n)");
    $st->execute([':p'=>$path, ':r'=>$ref, ':s'=>$src, ':v'=>$vis, ':se'=>$ses, ':d'=>$device, ':b'=>$browser, ':n'=>$newVisitor]);
} catch (Throwable $e) { /* silencioso */ }
echo $gif;
