<?php
declare(strict_types=1);
$cfg = require __DIR__ . '/api/config.php'; require __DIR__ . '/api/db.php';
header('Content-Type: application/xml; charset=utf-8');
$BASE='https://www.inedito.digital'; $today=date('Y-m-d');
$urls=[['/','1.0','weekly'],['/servicios','0.9','weekly'],['/portafolio','0.8','monthly'],['/blog','0.8','weekly'],
['/servicios-ia','0.8','monthly'],['/servicios-ia/whatsapp','0.7','monthly'],['/servicios-ia/ventas','0.7','monthly'],
['/servicios-ia/marketing','0.7','monthly'],['/servicios-ia/ecommerce','0.7','monthly'],
['/nosotros','0.6','monthly'],['/contacto','0.7','monthly'],['/privacidad','0.3','yearly'],['/terminos','0.3','yearly']];
try { $pdo=db_connect($cfg);
  foreach($pdo->query("SELECT slug FROM services WHERE status='published'") as $r) $urls[]=['/servicios/'.$r['slug'],'0.8','monthly'];
  foreach($pdo->query("SELECT slug FROM portfolio WHERE status='published'") as $r) $urls[]=['/portafolio/'.$r['slug'],'0.7','monthly'];
  foreach($pdo->query("SELECT slug FROM blog_posts WHERE status='published'") as $r) $urls[]=['/blog/'.$r['slug'],'0.7','monthly'];
  // Páginas creadas desde el panel
  foreach($pdo->query("SELECT ruta FROM pages WHERE tipo='bloques' AND status='published'") as $r) $urls[]=[$r['ruta'],'0.6','monthly'];
} catch (Throwable $e) {}
echo '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
foreach($urls as $u) echo '<url><loc>'.htmlspecialchars($BASE.$u[0], ENT_QUOTES).'</loc><lastmod>'.$today.'</lastmod><changefreq>'.$u[2].'</changefreq><priority>'.$u[1].'</priority></url>'."\n";
echo '</urlset>';
