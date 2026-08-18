<?php
/** Renderizado dinámico para SEO/GEO. Usuarios -> SPA; bots -> HTML real + meta + JSON-LD. */
declare(strict_types=1);
$cfg = require __DIR__ . '/api/config.php';
require __DIR__ . '/api/db.php';

$BASE = 'https://www.inedito.digital';
$path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/');
if ($path === '') $path = '/';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$isBot = (bool)preg_match('/bot|crawl|spider|slurp|googlebot|bingbot|duckduck|baidu|yandex|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|gptbot|oai-searchbot|chatgpt-user|claudebot|anthropic|perplexity|google-extended|ccbot|bytespider|amazonbot|applebot|meta-externalagent/i', $ua);

function e($v){ return htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8'); }
function jval($r){ $o = json_decode((string)($r['data_json'] ?? ''), true); return is_array($o) ? $o : []; }
function lines($s){ $s=trim((string)$s); return $s===''?[]:array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $s)), fn($x)=>$x!=='')); }

// ---- cargar datos ----
$pdo = null; $settings = []; $seo = []; $services = []; $blog = []; $portfolio = []; $paginas = []; $paginasPorRuta = []; $nuevas = [];
try {
  $pdo = db_connect($cfg);
  foreach ($pdo->query("SELECT k,v FROM site_settings") as $r) $settings[$r['k']] = $r['v'];
  foreach ($pdo->query("SELECT k,v FROM seo_settings") as $r) $seo[$r['k']] = $r['v'];
  foreach ($pdo->query("SELECT * FROM services WHERE status='published' ORDER BY id ASC") as $r) { $o=jval($r); $o['slug']=$r['slug']?:($o['slug']??''); $o['title']=$r['title']?:($o['title']??''); $o['shortDescription']=$r['short_desc']?:($o['shortDescription']??''); if($r['image'])$o['bannerImage']=$r['image']; $fl=lines($r['features']); if($fl)$o['features']=$fl; $bl=lines($r['benefits']); if($bl)$o['benefits']=$bl; $services[]=$o; }
  foreach ($pdo->query("SELECT * FROM blog_posts WHERE status='published' ORDER BY id ASC") as $r) { $o=jval($r); $o['slug']=$r['slug']?:($o['slug']??''); $o['title']=$r['title']?:($o['title']??''); if($r['excerpt'])$o['excerpt']=$r['excerpt']; if($r['content'])$o['content']=$r['content']; if($r['image'])$o['image']=$r['image']; if($r['author'])$o['author']=$r['author']; if($r['category'])$o['category']=$r['category']; $portfolio_meta=null; $blog[]=$o; }
  foreach ($pdo->query("SELECT slug, nombre, tipo, contenido, seo_title, seo_desc, seo_image, ruta, en_menu FROM pages WHERE status='published'") as $r) {
    $c = json_decode((string)$r['contenido'], true);
    $reg = ['contenido' => is_array($c) ? $c : [], 'nombre' => $r['nombre'], 'seo_title' => $r['seo_title'], 'seo_desc' => $r['seo_desc'], 'seo_image' => $r['seo_image'], 'ruta' => $r['ruta']];
    if ($r['tipo'] === 'bloques') {
      $reg['enMenu'] = (bool)$r['en_menu'];
      $nuevas[$r['slug']] = $reg;
    } else {
      $paginas[$r['slug']] = $reg;
    }
    $paginasPorRuta[$r['ruta']] = $r['slug'];
  }
  foreach ($pdo->query("SELECT * FROM portfolio WHERE status='published' ORDER BY id ASC") as $r) { $o=jval($r); $o['slug']=$r['slug']?:($o['slug']??''); $o['title']=$r['title']?:($o['title']??''); if($r['short_desc'])$o['description']=$r['short_desc']; if($r['image'])$o['image']=$r['image']; if($r['client'])$o['client']=$r['client']; if($r['category'])$o['category']=$r['category']; $portfolio[]=$o; }
} catch (Throwable $ex) { /* si falla la BD, servimos el SPA base */ }

$siteName = $seo['siteName'] ?: 'Inédito Digital';
$defaultDesc = 'Agencia de marketing digital en Aguascalientes: diseño web, branding, SEO, campañas y soluciones de IA para ventas, WhatsApp, e-commerce y marketing.';
$logo = 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp';
$findBySlug = function(array $arr, string $slug) { foreach ($arr as $x) if (($x['slug'] ?? '') === $slug) return $x; return null; };

// ---- resolver ruta ----
$seg = array_values(array_filter(explode('/', $path)));
$title = $siteName; $desc = $defaultDesc; $canonical = $BASE . $path; $ogType='website'; $schema=[]; $bodyBuilder=null; $crumbs=[['Inicio','/']];
$is404 = false; // rutas inexistentes -> 404 real + noindex (evita soft 404)

$H = function($t){ return '<h1>'.e($t).'</h1>'; };
$P = function($t){ return '<p>'.e($t).'</p>'; };

if ($path === '/') {
  $title = $siteName.' | Agencia de Marketing Digital en Aguascalientes';
  $desc = $defaultDesc;
  $bodyBuilder = function() use ($services,$settings,$P,$e) {
    $h = '<h1>Inédito Digital · Agencia de Marketing Digital en Aguascalientes</h1>';
    $h .= '<p>Impulsamos tu negocio con estrategias de marketing digital, diseño web e inteligencia artificial. Diseño y desarrollo web, branding, SEO, Google Ads, embudos de venta, chatbots con IA, WhatsApp y e-commerce.</p>';
    $h .= '<h2>Nuestros servicios</h2><ul>';
    foreach ($services as $s) $h .= '<li><a href="/servicios/'.e($s['slug']).'"><strong>'.e($s['title']).'</strong></a> — '.e($s['shortDescription'] ?? '').'</li>';
    $h .= '</ul>';
    $h .= '<h2>Contacto</h2><p>WhatsApp: '.e($settings['whatsappNumber'] ?? '').' · Email: '.e($settings['businessEmail'] ?? '').' · '.e(($settings['businessCity'] ?? '').', '.($settings['businessState'] ?? '')).'</p>';
    return $h;
  };
}
elseif ($seg[0] === 'servicios' && isset($seg[1])) {
  $s = $findBySlug($services, $seg[1]);
  if ($s) {
    $title = ($s['title'] ?? '').' | Servicios · '.$siteName;
    $desc = $s['shortDescription'] ?? $defaultDesc;
    $canonical = $BASE.'/servicios/'.$s['slug']; $crumbs[]=['Servicios','/servicios']; $crumbs[]=[$s['title'],'/servicios/'.$s['slug']];
    $schema[] = ['@context'=>'https://schema.org','@type'=>'Service','name'=>$s['title'] ?? '','description'=>$s['shortDescription'] ?? '','provider'=>['@type'=>'Organization','name'=>$siteName,'url'=>$BASE],'areaServed'=>'Aguascalientes, México','url'=>$canonical];
    $bodyBuilder = function() use ($s,$e) {
      $h='<h1>'.e($s['title'] ?? '').'</h1><p>'.e($s['shortDescription'] ?? '').'</p>';
      foreach (['features'=>'Características','benefits'=>'Beneficios','ideal'=>'Ideal para'] as $k=>$lbl) if(!empty($s[$k]) && is_array($s[$k])){ $h.='<h2>'.$lbl.'</h2><ul>'; foreach($s[$k] as $it) $h.='<li>'.e($it).'</li>'; $h.='</ul>'; }
      if(!empty($s['process']) && is_array($s['process'])){ $h.='<h2>Proceso</h2><ol>'; foreach($s['process'] as $p) $h.='<li><strong>'.e($p['title'] ?? '').':</strong> '.e($p['description'] ?? '').'</li>'; $h.='</ol>'; }
      if(!empty($s['faq']) && is_array($s['faq'])){ $h.='<h2>Preguntas frecuentes</h2>'; foreach($s['faq'] as $f) $h.='<h3>'.e($f['question'] ?? '').'</h3><p>'.e($f['answer'] ?? '').'</p>'; }
      return $h;
    };
    if (!empty($s['faq']) && is_array($s['faq'])) {
      $faq=['@context'=>'https://schema.org','@type'=>'FAQPage','mainEntity'=>[]];
      foreach($s['faq'] as $f) $faq['mainEntity'][]=['@type'=>'Question','name'=>$f['question'] ?? '','acceptedAnswer'=>['@type'=>'Answer','text'=>$f['answer'] ?? '']];
      $schema[]=$faq;
    }
  } else { $is404 = true; }
}
elseif ($seg[0] === 'servicios') {
  $title = 'Servicios de Marketing Digital | '.$siteName; $desc = 'Todos nuestros servicios: diseño web, branding, SEO, Google Ads, embudos, chatbots con IA y más.';
  $canonical=$BASE.'/servicios'; $crumbs[]=['Servicios','/servicios'];
  $bodyBuilder = function() use ($services,$e){ $h='<h1>Servicios</h1><ul>'; foreach($services as $s) $h.='<li><a href="/servicios/'.e($s['slug']).'"><strong>'.e($s['title']).'</strong></a> — '.e($s['shortDescription'] ?? '').'</li>'; return $h.'</ul>'; };
}
elseif ($seg[0] === 'portafolio' && isset($seg[1])) {
  $s = $findBySlug($portfolio, $seg[1]);
  if ($s) {
    $title = ($s['title'] ?? '').' | Portafolio · '.$siteName; $desc = $s['description'] ?? $defaultDesc;
    $canonical=$BASE.'/portafolio/'.$s['slug']; $crumbs[]=['Portafolio','/portafolio']; $crumbs[]=[$s['title'],'/portafolio/'.$s['slug']];
    $bodyBuilder = function() use ($s,$e){ $h='<h1>'.e($s['title'] ?? '').'</h1>'; if(!empty($s['client']))$h.='<p><strong>Cliente:</strong> '.e($s['client']).'</p>'; $h.='<p>'.e($s['description'] ?? '').'</p>'; foreach(['challenge'=>'Reto','solution'=>'Solución'] as $k=>$l) if(!empty($s[$k]))$h.='<h2>'.$l.'</h2><p>'.e($s[$k]).'</p>'; if(!empty($s['results'])&&is_array($s['results'])){ $h.='<h2>Resultados</h2><ul>'; foreach($s['results'] as $r) $h.='<li>'.e(($r['metric'] ?? '').': '.($r['value'] ?? '')).'</li>'; $h.='</ul>'; } return $h; };
  } else { $is404 = true; }
}
elseif ($seg[0] === 'portafolio') {
  $title='Portafolio · Casos de éxito | '.$siteName; $desc='Proyectos y casos de éxito de marketing digital, diseño web y e-commerce.'; $canonical=$BASE.'/portafolio'; $crumbs[]=['Portafolio','/portafolio'];
  $bodyBuilder=function() use ($portfolio,$e){ $h='<h1>Portafolio</h1><ul>'; foreach($portfolio as $p) $h.='<li><a href="/portafolio/'.e($p['slug']).'"><strong>'.e($p['title']).'</strong></a> — '.e($p['description'] ?? '').'</li>'; return $h.'</ul>'; };
}
elseif ($seg[0] === 'blog' && isset($seg[1])) {
  $b = $findBySlug($blog, $seg[1]);
  if ($b) {
    $title=($b['title'] ?? '').' | Blog · '.$siteName; $desc=$b['excerpt'] ?? $defaultDesc; $ogType='article';
    $canonical=$BASE.'/blog/'.$b['slug']; $crumbs[]=['Blog','/blog']; $crumbs[]=[$b['title'],'/blog/'.$b['slug']];
    $schema[]=['@context'=>'https://schema.org','@type'=>'BlogPosting','headline'=>$b['title'] ?? '','description'=>$b['excerpt'] ?? '','image'=>$b['image'] ?? $GLOBALS['logo'],'author'=>['@type'=>'Organization','name'=>$b['author'] ?? $siteName],'publisher'=>['@type'=>'Organization','name'=>$siteName,'logo'=>['@type'=>'ImageObject','url'=>$GLOBALS['logo']]],'mainEntityOfPage'=>$canonical,'inLanguage'=>'es'];
    $bodyBuilder=function() use ($b){ $md=(string)($b['content'] ?? ''); if(trim($md)==='') $md=$b['excerpt'] ?? ''; return md_html($md); };
  } else { $is404 = true; }
}
elseif ($seg[0] === 'blog') {
  $title='Blog de Marketing Digital | '.$siteName; $desc='Artículos y guías de marketing digital, SEO, IA y ventas.'; $canonical=$BASE.'/blog'; $crumbs[]=['Blog','/blog'];
  $bodyBuilder=function() use ($blog,$e){ $h='<h1>Blog</h1><ul>'; foreach($blog as $b) $h.='<li><a href="/blog/'.e($b['slug']).'"><strong>'.e($b['title']).'</strong></a> — '.e($b['excerpt'] ?? '').'</li>'; return $h.'</ul>'; };
}
elseif (($seg[0] ?? '') === 'contacto') {
  $title = 'Contacto | ' . $siteName;
  $desc = 'Contactanos para una consulta gratuita de marketing digital en Aguascalientes.';
  $canonical = $BASE . '/contacto'; $crumbs[] = ['Contacto', '/contacto'];
  $bodyBuilder = function() use ($settings) {
    $addr = trim(($settings['businessAddress'] ?? '') . ', ' . ($settings['businessCity'] ?? '') . ', ' . ($settings['businessState'] ?? '') . ' ' . ($settings['businessZip'] ?? ''), ', ');
    $maps = $settings['mapsUrl'] ?? '';
    $h = '<h1>Contacto</h1>';
    $h .= '<p><strong>Direccion:</strong> ' . ($maps ? '<a href="' . e($maps) . '">' . e($addr) . '</a>' : e($addr)) . '</p>';
    $h .= '<p><strong>Telefono:</strong> ' . e($settings['businessPhone'] ?? '') . '</p>';
    $h .= '<p><strong>Email:</strong> ' . e($settings['businessEmail'] ?? '') . '</p>';
    $h .= '<p><strong>WhatsApp:</strong> ' . e($settings['whatsappNumber'] ?? '') . '</p>';
    $h .= '<p><strong>Horario:</strong> ' . e($settings['businessHours'] ?? '') . '</p>';
    return $h;
  };
}
else {
  // Rutas estáticas del SPA. La clave es la RUTA COMPLETA, no solo el primer
  // segmento: si no, las 4 subpáginas de /servicios-ia heredaban el canonical
  // de /servicios-ia y Google las descartaba como duplicadas.
  $pages = [
    '/nosotros'                => ['Nosotros | '.$siteName, 'Conoce a Inédito Digital, agencia de marketing digital en Aguascalientes.'],
    '/privacidad'              => ['Aviso de Privacidad | '.$siteName, 'Aviso de privacidad de Inédito Digital.'],
    '/terminos'                => ['Términos y Condiciones | '.$siteName, 'Términos y condiciones de Inédito Digital.'],
    '/servicios-ia'            => ['Servicios de IA | '.$siteName, 'Soluciones de inteligencia artificial para ventas, WhatsApp, marketing y e-commerce.'],
    '/servicios-ia/whatsapp'   => ['IA para WhatsApp | '.$siteName, 'Chatbots y agentes de IA en WhatsApp para atender y vender 24/7.'],
    '/servicios-ia/ventas'     => ['IA para Ventas | '.$siteName, 'Agentes de inteligencia artificial que califican prospectos y cierran más ventas.'],
    '/servicios-ia/marketing'  => ['IA para Marketing | '.$siteName, 'Inteligencia artificial aplicada a campañas, contenido y segmentación.'],
    '/servicios-ia/ecommerce'  => ['IA para E-commerce | '.$siteName, 'Recomendación, atención y recuperación de carritos con inteligencia artificial.'],
  ];
  if (isset($pages[$path])) {
    $title = $pages[$path][0]; $desc = $pages[$path][1]; $canonical = $BASE . $path;
    if ($path !== '/servicios-ia' && strpos($path, '/servicios-ia/') === 0) $crumbs[] = ['Servicios de IA', '/servicios-ia'];
    $crumbs[] = [explode(' | ', $title)[0], $path];
    $bodyBuilder = function() use ($title,$desc){ return '<h1>'.e(explode(' | ',$title)[0]).'</h1><p>'.e($desc).'</p>'; };
  } elseif ($path !== '/') {
    $is404 = true;
  }
}

/* SEO por página desde el panel: si el cliente lo llenó, manda sobre el
   texto automático. Si lo dejó vacío, se conserva el de antes. */
if (!$is404 && isset($paginasPorRuta[$path])) {
  $pg = $paginas[$paginasPorRuta[$path]];
  if (!empty($pg['seo_title'])) $title = $pg['seo_title'];
  if (!empty($pg['seo_desc']))  $desc  = $pg['seo_desc'];
  if (!empty($pg['seo_image'])) $GLOBALS['seoImagenPagina'] = $pg['seo_image'];
}

/* Páginas creadas desde el panel: dejan de ser 404 y se les arma el HTML
   que ven los buscadores a partir de sus bloques. */
$slugNueva = $paginasPorRuta[$path] ?? null;
if ($slugNueva !== null && isset($nuevas[$slugNueva])) {
  $pg = $nuevas[$slugNueva];
  $is404 = false;
  $title = ($pg['seo_title'] ?: $pg['nombre']) . ' | ' . $siteName;
  $desc  = $pg['seo_desc'] ?: $defaultDesc;
  $canonical = $BASE . $path;
  $crumbs[] = [$pg['nombre'], $path];
  if (!empty($pg['seo_image'])) $GLOBALS['seoImagenPagina'] = $pg['seo_image'];
  $bloquesPg = $pg['contenido'];
  $bodyBuilder = function() use ($bloquesPg, $pg) {
    $h = '<h1>' . e($pg['nombre']) . '</h1>';
    foreach ((is_array($bloquesPg) ? $bloquesPg : []) as $b) {
      if (($b['visible'] ?? '1') === '0') continue;
      $d = $b['datos'] ?? [];
      $tit = trim((string)($d['titulo'] ?? ''));
      if ($tit !== '') $h .= '<h2>' . e($tit) . '</h2>';
      foreach (['bajada','texto'] as $k) {
        $v = trim((string)($d[$k] ?? ''));
        if ($v !== '') $h .= '<p>' . e($v) . '</p>';
      }
      // puntos y pasos: se listan para que el buscador los lea
      $li = '';
      foreach ([1,2,3,4] as $n) {
        foreach ([["p{$n}_titulo","p{$n}_texto"], ["paso_{$n}_titulo","paso_{$n}_texto"], ["p{$n}","r{$n}"]] as $par) {
          $a = trim((string)($d[$par[0]] ?? '')); $bb = trim((string)($d[$par[1]] ?? ''));
          if ($a !== '' || $bb !== '') $li .= '<li>' . ($a !== '' ? '<strong>' . e($a) . '</strong>' : '') . ($bb !== '' ? ' — ' . e($bb) : '') . '</li>';
        }
      }
      if ($li !== '') $h .= '<ul>' . $li . '</ul>';
    }
    return $h;
  };
}

// --- 404 real: nada que indexar, y sin canonical propio ---
if ($is404) {
  http_response_code(404);
  $title = 'Página no encontrada | ' . $siteName;
  $desc  = 'La página que buscas no existe o cambió de dirección.';
  $schema = [];
  $crumbs = [['Inicio','/']];
  $bodyBuilder = function() {
    return '<h1>Página no encontrada</h1><p>La página que buscas no existe o cambió de dirección.</p>';
  };
}

function md_html(string $md): string {
  $out=[]; $inUl=false;
  foreach (preg_split('/\r?\n/', $md) as $ln) {
    $t=trim($ln);
    if ($t==='') { if($inUl){$out[]='</ul>';$inUl=false;} continue; }
    if (preg_match('/^###\s+(.*)/',$t,$m)) { if($inUl){$out[]='</ul>';$inUl=false;} $out[]='<h3>'.e($m[1]).'</h3>'; }
    elseif (preg_match('/^##\s+(.*)/',$t,$m)) { if($inUl){$out[]='</ul>';$inUl=false;} $out[]='<h2>'.e($m[1]).'</h2>'; }
    elseif (preg_match('/^#\s+(.*)/',$t,$m)) { if($inUl){$out[]='</ul>';$inUl=false;} $out[]='<h2>'.e($m[1]).'</h2>'; }
    elseif (preg_match('/^[-*]\s+(.*)/',$t,$m)) { if(!$inUl){$out[]='<ul>';$inUl=true;} $out[]='<li>'.e($m[1]).'</li>'; }
    else { if($inUl){$out[]='</ul>';$inUl=false;} $out[]='<p>'.e($t).'</p>'; }
  }
  if($inUl)$out[]='</ul>';
  return implode("\n",$out);
}

// JSON-LD organización (siempre)
$org = ['@context'=>'https://schema.org','@type'=>($seo['orgType'] ?: 'ProfessionalService'),'name'=>$seo['orgName'] ?: $siteName,'url'=>$BASE,'logo'=>$logo,'image'=>$logo,'description'=>$defaultDesc,'telephone'=>$seo['phone'] ?? ($settings['businessPhone'] ?? ''),'email'=>$seo['email'] ?? ($settings['businessEmail'] ?? ''),'priceRange'=>$seo['priceRange'] ?: '$$','address'=>['@type'=>'PostalAddress','streetAddress'=>$seo['address'] ?? ($settings['businessAddress'] ?? ''),'addressLocality'=>$seo['city'] ?? ($settings['businessCity'] ?? ''),'addressRegion'=>$seo['state'] ?? ($settings['businessState'] ?? ''),'postalCode'=>$seo['zip'] ?? ($settings['businessZip'] ?? ''),'addressCountry'=>'MX'],'areaServed'=>'Aguascalientes','sameAs'=>array_values(array_filter([$seo['facebook'] ?? '',$seo['instagram'] ?? '',$seo['linkedin'] ?? '']))];
$mapsUrl = $settings['mapsUrl'] ?? '';
if ($mapsUrl) $org['hasMap'] = $mapsUrl;
if (!empty($seo['latitude']) && !empty($seo['longitude'])) $org['geo'] = ['@type'=>'GeoCoordinates','latitude'=>$seo['latitude'],'longitude'=>$seo['longitude']];
array_unshift($schema, $org);
if (count($crumbs) > 1) { $bl=['@context'=>'https://schema.org','@type'=>'BreadcrumbList','itemListElement'=>[]]; $i=1; foreach($crumbs as $c){ $bl['itemListElement'][]=['@type'=>'ListItem','position'=>$i++,'name'=>$c[0],'item'=>$BASE.$c[1]]; } $schema[]=$bl; }

// asset refs desde index.html (para no hardcodear hashes)
$assetJs='/assets/index-CR3aYFRn.js'; $assetCss='/assets/index-BbJMuNT-.css';
$idx=@file_get_contents(__DIR__.'/index.html');
if ($idx) { if(preg_match('/src="(\/assets\/index-[^"]+\.js)"/',$idx,$m))$assetJs=$m[1]; if(preg_match('/href="(\/assets\/index-[^"]+\.css)"/',$idx,$m))$assetCss=$m[1]; }

$ogImg = $GLOBALS['seoImagenPagina'] ?? ($seo['defaultImage'] ?: $logo);
$gaId = $seo['googleAnalytics'] ?? ''; $pixel = $seo['facebookPixel'] ?? ''; $gsv = $seo['googleSiteVerification'] ?? '';

$seo_global = ['siteName'=>$seo['siteName']??'','author'=>$seo['author']??'','defaultImage'=>$seo['defaultImage']??'','twitterHandle'=>$seo['twitterHandle']??'','googleAnalytics'=>$seo['googleAnalytics']??'','facebookPixel'=>$seo['facebookPixel']??'','googleSiteVerification'=>$seo['googleSiteVerification']??'','bingVerification'=>$seo['bingVerification']??''];
$seo_schema = ['organizationName'=>$seo['orgName']??'','organizationType'=>$seo['orgType']??'ProfessionalService','phone'=>$seo['phone']??'','email'=>$seo['email']??'','priceRange'=>$seo['priceRange']??'$$','address'=>$seo['address']??'','city'=>$seo['city']??'','state'=>$seo['state']??'','zip'=>$seo['zip']??'','latitude'=>$seo['latitude']??'','longitude'=>$seo['longitude']??'','socialMedia'=>['facebook'=>$seo['facebook']??'','instagram'=>$seo['instagram']??'','linkedin'=>$seo['linkedin']??'']];
// Cabeceras de seguridad. Van aqui y NO solo en .htaccess: LiteSpeed no
// aplica las directivas Header de .htaccess a las respuestas de PHP.
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
header('Strict-Transport-Security: max-age=31536000');
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
?><!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title><?= e($title) ?></title>
<meta name="description" content="<?= e($desc) ?>" />
<meta name="author" content="<?= e($siteName) ?>" />
<meta name="robots" content="<?= $is404 ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' ?>" />
<meta name="theme-color" content="#7700CE" />
<?php if (!$is404): ?><link rel="canonical" href="<?= e($canonical) ?>" /><?php endif; ?>
<?php if($gsv): ?><meta name="google-site-verification" content="<?= e($gsv) ?>" /><?php endif; ?>
<meta property="og:type" content="<?= e($ogType) ?>" />
<meta property="og:site_name" content="<?= e($siteName) ?>" />
<meta property="og:title" content="<?= e($title) ?>" />
<meta property="og:description" content="<?= e($desc) ?>" />
<meta property="og:url" content="<?= e($canonical) ?>" />
<meta property="og:image" content="<?= e($ogImg) ?>" />
<meta property="og:locale" content="es_MX" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="<?= e($title) ?>" />
<meta name="twitter:description" content="<?= e($desc) ?>" />
<meta name="twitter:image" content="<?= e($ogImg) ?>" />
<?php foreach ($schema as $sch): ?>
<script type="application/ld+json"><?= json_encode($sch, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) ?></script>
<?php endforeach; ?>
<?php if($gaId): ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?= e($gaId) ?>"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','<?= e($gaId) ?>');</script>
<?php endif; ?>
<?php if($pixel): ?>
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','<?= e($pixel) ?>');fbq('track','PageView');</script>
<?php endif; ?>
<?php if (!$isBot):
  $FL = JSON_UNESCAPED_UNICODE|JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP;
  $contenidoPaginas = [];
  foreach ($paginas as $sl => $pg) $contenidoPaginas[$sl] = $pg['contenido'];
  $paginasNuevas = [];
  foreach ($nuevas as $sl => $pg) {
    $paginasNuevas[$sl] = ['nombre' => $pg['nombre'], 'ruta' => $pg['ruta'], 'bloques' => $pg['contenido'],
                           'seoTitle' => $pg['seo_title'], 'seoDesc' => $pg['seo_desc'], 'enMenu' => !empty($pg['enMenu'])];
  }
  $LS = ['inedito_services'=>$services,'inedito_blog'=>$blog,'inedito_portfolio'=>$portfolio,'inedito_settings'=>$settings,'inedito_seo_global'=>$seo_global,'inedito_seo_schema'=>$seo_schema,'inedito_paginas'=>$contenidoPaginas,'inedito_paginas_nuevas'=>$paginasNuevas];
?>
<script>try{
<?php foreach($LS as $k=>$v): ?>localStorage.setItem(<?= json_encode($k) ?>, <?= json_encode(json_encode($v, JSON_UNESCAPED_UNICODE), $FL) ?>);
<?php endforeach; ?>localStorage.setItem('inedito_data_version','2.0');
}catch(e){}</script>
<script type="module" crossorigin src="<?= e($assetJs) ?>"></script>
<link rel="stylesheet" crossorigin href="<?= e($assetCss) ?>">
<?php endif; ?>
</head>
<body>
<?php if ($isBot && $bodyBuilder): ?>
<main><?= $bodyBuilder() ?>
<nav aria-label="Enlaces"><a href="/">Inicio</a> · <a href="/servicios">Servicios</a> · <a href="/portafolio">Portafolio</a> · <a href="/blog">Blog</a> · <a href="/nosotros">Nosotros</a> · <a href="/contacto">Contacto</a></nav>
</main>
<?php else: ?>
<div id="root"></div>
<script>
/* NOTA: aquí vivía un "puente" que interceptaba el submit del formulario y hacía
   POST a /api/lead.php. Se eliminó porque el bundle actual ya lo hace desde
   ContactPage.tsx; mantener ambos generaba DOS leads y DOS correos por envío.
   No reintroducir sin quitar antes el fetch de ContactPage.tsx. */
(function(){
  /* Enlaza la dirección a Google Maps. Acotado: deja de reintentar en cuanto lo
     logra, y como mucho durante 15 s (antes era un setInterval infinito que
     recorría todos los div/p/span de la página cada segundo). */
  var tries=0,timer=null;
  function inj(){
    var s;try{s=JSON.parse(localStorage.getItem('inedito_settings')||'{}');}catch(e){return false;}
    if(!s.mapsUrl)return false;
    var addr=(s.businessAddress||'').trim();if(!addr)return false;
    var all=document.querySelectorAll('p,span,address'),i,c,hecho=false;
    for(i=0;i<all.length;i++){
      var el=all[i];
      if((el.textContent||'').indexOf(addr)===-1)continue;
      var ch=false;
      for(c=0;c<el.children.length;c++){if((el.children[c].textContent||'').indexOf(addr)>-1){ch=true;break;}}
      if(ch)continue;
      if(el.firstElementChild&&el.firstElementChild.className==='inedito-addr-link')continue;
      if(el.closest('a'))continue;
      var a=document.createElement('a');
      a.href=s.mapsUrl;a.target='_blank';a.rel='noopener';a.className='inedito-addr-link';
      a.style.color='inherit';a.style.textDecoration='none';a.style.cursor='pointer';
      while(el.firstChild)a.appendChild(el.firstChild);
      el.appendChild(a);hecho=true;
    }
    return hecho;
  }
  function tick(){ if(inj()||++tries>15){ clearInterval(timer); } }
  if(!inj()) timer=setInterval(tick,1000);
})();
(function(){function hit(){try{new Image().src='/api/hit.php?p='+encodeURIComponent(location.pathname)+'&r='+encodeURIComponent(document.referrer||'')+'&t='+Date.now();}catch(e){}}hit();var _p=history.pushState;history.pushState=function(){_p.apply(this,arguments);setTimeout(hit,60);};window.addEventListener('popstate',function(){setTimeout(hit,60);});})();
</script>
<?php endif; ?>
</body>
</html>