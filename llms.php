<?php
declare(strict_types=1);
$cfg = require __DIR__ . '/api/config.php'; require __DIR__ . '/api/db.php';
header('Content-Type: text/plain; charset=utf-8');
$BASE='https://www.inedito.digital'; $ss=[]; $S=[]; $Bl=[];
try { $pdo=db_connect($cfg);
  foreach($pdo->query("SELECT k,v FROM site_settings") as $r) $ss[$r['k']]=$r['v'];
  foreach($pdo->query("SELECT slug,title,short_desc,data_json FROM services WHERE status='published' ORDER BY id") as $r){ $d=json_decode((string)$r['data_json'],true)?:[]; $S[]=['slug'=>$r['slug'],'title'=>$r['title'] ?: ($d['title']??''),'d'=>$r['short_desc'] ?: ($d['shortDescription']??'')]; }
  foreach($pdo->query("SELECT slug,title,excerpt FROM blog_posts WHERE status='published' ORDER BY id") as $r) $Bl[]=$r;
} catch (Throwable $e) {}
$n=$ss['businessName']??'Inédito Digital';
echo "# $n\n\n";
echo "> Agencia de marketing digital en Aguascalientes, México. Ayudamos a las empresas a crecer con diseño y desarrollo web, branding, SEO, publicidad (Google Ads), embudos de venta, e-commerce, WhatsApp y soluciones de inteligencia artificial (chatbots y agentes).\n\n";
echo "Contacto: WhatsApp ".($ss['whatsappNumber']??'')." · ".($ss['businessEmail']??'')." · ".($ss['businessCity']??'').", ".($ss['businessState']??'')." · ".$BASE."\n\n";
echo "## Servicios\n";
foreach($S as $s) echo "- [".$s['title']."]($BASE/servicios/".$s['slug']."): ".$s['d']."\n";
echo "\n## Artículos del blog\n";
foreach($Bl as $b) echo "- [".$b['title']."]($BASE/blog/".$b['slug']."): ".$b['excerpt']."\n";
echo "\n## Páginas principales\n- Servicios: $BASE/servicios\n- Servicios de IA: $BASE/servicios-ia\n- Portafolio: $BASE/portafolio\n- Blog: $BASE/blog\n- Nosotros: $BASE/nosotros\n- Contacto: $BASE/contacto\n";
