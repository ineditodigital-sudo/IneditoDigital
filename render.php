<?php
/** Renderizado dinámico para SEO/GEO. Usuarios -> SPA; bots -> HTML real + meta + JSON-LD. */
declare(strict_types=1);
$cfg = require __DIR__ . '/api/config.php';
require __DIR__ . '/api/db.php';
// Solo declara funciones; hace falta para completar los datos del equipo.
@include_once __DIR__ . '/panel/inc/miembros.php';

$BASE = 'https://www.inedito.digital';
$path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/');
if ($path === '') $path = '/';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$isBot = (bool)preg_match('/bot|crawl|spider|slurp|googlebot|bingbot|duckduck|baidu|yandex|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|gptbot|oai-searchbot|chatgpt-user|claudebot|anthropic|perplexity|google-extended|ccbot|bytespider|amazonbot|applebot|meta-externalagent/i', $ua);

function e($v){ return htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8'); }
function jval($r){ $o = json_decode((string)($r['data_json'] ?? ''), true); return is_array($o) ? $o : []; }
function lines($s){ $s=trim((string)$s); return $s===''?[]:array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $s)), fn($x)=>$x!=='')); }

// ---- cargar datos ----
$pdo = null; $settings = []; $seo = []; $services = []; $blog = []; $portfolio = []; $paginas = []; $paginasPorRuta = []; $nuevas = []; $miembros = [];
try {
  $pdo = db_connect($cfg);
  foreach ($pdo->query("SELECT k,v FROM site_settings") as $r) $settings[$r['k']] = $r['v'];
  foreach ($pdo->query("SELECT k,v FROM seo_settings") as $r) $seo[$r['k']] = $r['v'];
  foreach ($pdo->query("SELECT * FROM services WHERE status='published' ORDER BY id ASC") as $r) { $o=jval($r); $o['slug']=$r['slug']?:($o['slug']??''); $o['fecha']=$r['created_at'] ?? null; $o['title']=$r['title']?:($o['title']??''); $o['shortDescription']=$r['short_desc']?:($o['shortDescription']??''); if($r['image'])$o['bannerImage']=$r['image']; $fl=lines($r['features']); if($fl)$o['features']=$fl; $bl=lines($r['benefits']); if($bl)$o['benefits']=$bl; $services[]=$o; }
  foreach ($pdo->query("SELECT * FROM blog_posts WHERE status='published' ORDER BY id ASC") as $r) { $o=jval($r); $o['slug']=$r['slug']?:($o['slug']??''); $o['title']=$r['title']?:($o['title']??''); if($r['excerpt'])$o['excerpt']=$r['excerpt']; if($r['content'])$o['content']=$r['content']; if($r['image'])$o['image']=$r['image']; if($r['author'])$o['author']=$r['author']; if($r['category'])$o['category']=$r['category']; /* Las fechas viven en columnas propias y no en data_json: sin copiarlas aqui, el schema del articulo salia sin datePublished (CON-01). */ $o['publish_date']=$r['publish_date'] ?? ''; $o['created_at']=$r['created_at'] ?? ''; $o['updated_at']=$r['updated_at'] ?? ''; $portfolio_meta=null; $blog[]=$o; }
  foreach ($pdo->query("SELECT slug, nombre, tipo, contenido, seo_title, seo_desc, seo_image, ruta, en_menu FROM pages WHERE status='published'") as $r) {
    $c = json_decode((string)$r['contenido'], true);
    $reg = ['contenido' => is_array($c) ? $c : [], 'nombre' => $r['nombre'], 'seo_title' => $r['seo_title'], 'seo_desc' => $r['seo_desc'], 'seo_image' => $r['seo_image'], 'ruta' => $r['ruta']];
    if ($r['tipo'] === 'bloques') {
      $reg['enMenu'] = (bool)$r['en_menu'];
      $nuevas[$r['slug']] = $reg;
    } elseif ($r['tipo'] === 'miembro') {
      $miembros[$r['slug']] = $reg;
    } else {
      $paginas[$r['slug']] = $reg;
    }
    $paginasPorRuta[$r['ruta']] = $r['slug'];
  }
  foreach ($pdo->query("SELECT * FROM portfolio WHERE status='published' ORDER BY id ASC") as $r) { $o=jval($r); $o['slug']=$r['slug']?:($o['slug']??''); $o['title']=$r['title']?:($o['title']??''); if($r['short_desc'])$o['description']=$r['short_desc']; if($r['image'])$o['image']=$r['image']; if($r['client'])$o['client']=$r['client']; if($r['category'])$o['category']=$r['category']; $portfolio[]=$o; }
} catch (Throwable $ex) { /* si falla la BD, servimos el SPA base */ }

$siteName = $seo['siteName'] ?: 'Inédito Digital';

/* Autoría del blog (CON-02).
   Si el nombre coincide con alguien del equipo, se publica como Person con
   enlace a su página: eso es lo que Google y las IAs entienden por autoría
   real. Si no, se queda como la organización, que sigue siendo cierto. */
$GLOBALS['autorArticulo'] = function(string $nombre, array $miembros, string $BASE): array {
  foreach ($miembros as $slug => $m) {
    $dm = is_array($m['contenido'] ?? null) ? $m['contenido'] : [];
    if (mb_strtolower(trim((string)($dm['nombre'] ?? $m['nombre']))) === mb_strtolower(trim($nombre))) {
      $p = ['@type' => 'Person', 'name' => $nombre, 'url' => $BASE . $m['ruta']];
      if (!empty($dm['puesto'])) $p['jobTitle'] = $dm['puesto'];
      return $p;
    }
  }
  return ['@type' => 'Organization', 'name' => $nombre];
};

/* Fechas del artículo (CON-01).
   Se usa la fecha de publicación que el cliente puso en el panel; si todavía
   no la llena, la de alta en el sistema, que es real. Sin fecha, ni Google ni
   los asistentes pueden juzgar si el contenido está vigente. */
$GLOBALS['fechasArticulo'] = function(array $b): array {
  $pub = trim((string)($b['publish_date'] ?? ''));
  if ($pub === '' || $pub === '0000-00-00') $pub = substr((string)($b['created_at'] ?? ''), 0, 10);
  if ($pub === '') return [];
  $o = ['datePublished' => $pub];
  $mod = trim((string)($b['updated_at'] ?? ''));
  $o['dateModified'] = $mod !== '' ? substr($mod, 0, 10) : $pub;
  return $o;
};
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
  // 54 caracteres: entra completo en el resultado de Google (ONP-01)
  $title = 'Agencia de Marketing Digital con IA en Aguascalientes';
  $desc = $defaultDesc;
  $bodyBuilder = function() use ($services,$settings,$P,$e,$blog) {
    $h = '<h1>Inédito Digital · Agencia de Marketing Digital en Aguascalientes</h1>';
    $h .= '<p>Impulsamos tu negocio con estrategias de marketing digital, diseño web e inteligencia artificial. Diseño y desarrollo web, branding, SEO, Google Ads, embudos de venta, chatbots con IA, WhatsApp y e-commerce.</p>';
    $h .= '<h2>Nuestros servicios</h2><ul>';
    foreach ($services as $s) $h .= '<li><a href="/servicios/'.e($s['slug']).'"><strong>'.e($s['title']).'</strong></a> — '.e($s['shortDescription'] ?? '').'</li>';
    $h .= '</ul>';
    // La categoria que define direccion. Va debajo del H1, no en el:
      // arriba se conserva la frase que ya trae trafico.
    $h .= '<h2>Dirección comercial asistida por IA</h2>';
    $h .= '<p>No vendemos marketing digital genérico. Dirección define los objetivos, todo queda conectado —Search Console, Analytics, campañas y, donde aplica, el ERP— y una IA audita periódicamente si la estrategia está funcionando. El servicio se adapta al punto en que esté cada empresa: <a href="/servicios">construir, mejorar o vender</a>.</p>';
    // Enlazar lo ultimo publicado: es como Google lo descubre pronto.
    if ($blog) {
      $ult = array_slice(array_reverse($blog), 0, 4);
      $h .= '<h2>Del blog</h2><ul>';
      foreach ($ult as $b) $h .= '<li><a href="/blog/' . e($b['slug'] ?? '') . '">'
        . e($b['title'] ?? '') . '</a></li>';
      $h .= '</ul>';
      }
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
    $schema[] = ['@context'=>'https://schema.org','@type'=>'Service','name'=>$s['title'] ?? '','description'=>$s['shortDescription'] ?? '','provider'=>['@type'=>'Organization','name'=>$siteName,'url'=>$BASE],'areaServed'=>'Aguascalientes, México','url'=>$canonical,'dateModified'=>date('Y-m-d', strtotime((string)($s['fecha'] ?: 'now')))];
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
  $title = 'Servicios · Agencia de marketing digital y publicidad en Aguascalientes | '.$siteName; $desc = 'Marketing digital, publicidad, mercadotecnia y contenido para empresas de Aguascalientes. Tres niveles según en qué punto estés: construir, mejorar o vender.';
  $canonical=$BASE.'/servicios'; $crumbs[]=['Servicios','/servicios'];
    $bodyBuilder = function() use ($services,$e,$paginas){
    // Los tres niveles salen del panel, igual que en la version React.
    $n = is_array($paginas['servicios']['contenido']['niveles'] ?? null)
       ? $paginas['servicios']['contenido']['niveles'] : [];
    $h = '<h1>Servicios · Agencia de marketing digital y publicidad en Aguascalientes</h1>';
    $h .= '<p>Marketing digital, publicidad, mercadotecnia y contenido para empresas de Aguascalientes. El servicio se adapta al grado de posicionamiento de cada empresa.</p>';
    $tit = trim((string)($n['titulo'] ?? '')) ?: '¿En qué punto estás?';
    $h .= '<h2>' . e($tit) . '</h2><ul>';
    foreach ([1, 2, 3] as $k) {
      $v = trim((string)($n["n{$k}_verbo"] ?? ''));
      if ($v === '') continue;
      $h .= '<li><strong>' . e($v) . '</strong>'
          . (!empty($n["n{$k}_lema"]) ? ' · ' . e($n["n{$k}_lema"]) : '')
          . ': ' . e((string)($n["n{$k}_texto"] ?? ''))
          . (!empty($n["n{$k}_promesa"]) ? ' Promesa: ' . e($n["n{$k}_promesa"]) : '')
          . '</li>';
      }
    $h .= '</ul><h2>Todo lo que hacemos</h2><ul>';
    foreach ($services as $s) $h .= '<li><a href="/servicios/' . e($s['slug'] ?? '') . '">'
      . e($s['title'] ?? '') . '</a>: ' . e($s['shortDescription'] ?? $s['short_desc'] ?? '') . '</li>';
    return $h . '</ul>';
  };
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
    $schema[]=['@context'=>'https://schema.org','@type'=>'BlogPosting','headline'=>$b['title'] ?? '','description'=>$b['excerpt'] ?? '','image'=>$b['image'] ?? $GLOBALS['logo'],'author'=>$GLOBALS['autorArticulo']($b['author'] ?? $siteName, $miembros, $BASE),'publisher'=>['@type'=>'Organization','name'=>$siteName,'logo'=>['@type'=>'ImageObject','url'=>$GLOBALS['logo']]],'mainEntityOfPage'=>$canonical,'inLanguage'=>'es'] + $GLOBALS['fechasArticulo']($b);
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
  $bodyBuilder = function() use ($settings, $paginas) {
    $addr = trim(($settings['businessAddress'] ?? '') . ', ' . ($settings['businessCity'] ?? '') . ', ' . ($settings['businessState'] ?? '') . ' ' . ($settings['businessZip'] ?? ''), ', ');
    $maps = $settings['mapsUrl'] ?? '';
    $h = '<h1>Contacto</h1>';
    $h .= '<p><strong>Direccion:</strong> ' . ($maps ? '<a href="' . e($maps) . '">' . e($addr) . '</a>' : e($addr)) . '</p>';
    $h .= '<p><strong>Telefono:</strong> ' . e($settings['businessPhone'] ?? '') . '</p>';
    $h .= '<p><strong>Email:</strong> ' . e($settings['businessEmail'] ?? '') . '</p>';
    $h .= '<p><strong>WhatsApp:</strong> ' . e($settings['whatsappNumber'] ?? '') . '</p>';
    $h .= '<p><strong>Horario:</strong> ' . e($settings['businessHours'] ?? '') . '</p>';
    /* Lo que el cliente escribió en el panel para esta página: sin esto un
       asistente leía cuatro renglones de datos y nada más (GEO-02). */
    $cc = is_array($paginas['contacto']['contenido'] ?? null) ? $paginas['contacto']['contenido'] : [];
    $enc = $cc['encabezado'] ?? []; $tar = $cc['tarjetas'] ?? []; $frm = $cc['formulario'] ?? [];
    if (!empty($enc['bajada'])) $h .= '<p>' . e($enc['bajada']) . '</p>';
    if (!empty($tar['wa_titulo'])) $h .= '<h2>' . e($tar['wa_titulo']) . '</h2><p>' . e($tar['wa_texto'] ?? '') . '</p>';
    if (!empty($frm['titulo'])) {
      $h .= '<h2>' . e($frm['titulo']) . '</h2>';
      if (!empty($frm['bajada'])) $h .= '<p>' . e($frm['bajada']) . '</p>';
    }
    $h .= '<h2>Zona de servicio</h2><p>Atendemos a negocios de Aguascalientes y el Bajío, '
        . 'y damos servicio a distancia a todo México. Especialidades: diseño y desarrollo web, '
        . 'posicionamiento en buscadores (SEO), posicionamiento en inteligencias artificiales (GEO), '
        . 'Google Ads, chatbots y agentes de IA, e-commerce y tarjetas de presentación NFC.</p>';
    return $h;
  };
}
else {
  // Rutas estáticas del SPA. La clave es la RUTA COMPLETA, no solo el primer
  // segmento: si no, las 4 subpáginas de /servicios-ia heredaban el canonical
  // de /servicios-ia y Google las descartaba como duplicadas.
  $pages = [
    '/nosotros'                => ['Nosotros · Agencia de marketing digital en Aguascalientes | '.$siteName, 'Agencia de marketing digital en Aguascalientes que trabaja como dirección comercial asistida por IA. Todo conectado a datos reales y medido hasta la venta.'],
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
    /* Lo que lee un buscador o un asistente que no ejecuta JavaScript.
       Antes eran dos líneas para las ocho páginas; ahora cada una vuelca el
       contenido que el cliente ya escribió en el panel. Si una sección se
       queda vacía simplemente no se dibuja, igual que en el sitio. */
    $bodyBuilder = function() use ($title, $desc, $path, $paginas, $settings) {
      $c = function(string $slug) use ($paginas): array {
        return is_array($paginas[$slug]['contenido'] ?? null) ? $paginas[$slug]['contenido'] : [];
      };
      $h = '<h1>' . e(explode(' | ', $title)[0]) . '</h1><p>' . e($desc) . '</p>';

      /** Un bloque de título + texto, si tiene algo. */
      $bloque = function(?string $t, ?string $p) {
        $o = '';
        if (trim((string)$t) !== '') $o .= '<h2>' . e($t) . '</h2>';
        if (trim((string)$p) !== '') $o .= '<p>' . e($p) . '</p>';
        return $o;
      };

      if ($path === '/nosotros') {
        $d = $c('nosotros');
        $enc = $d['encabezado'] ?? []; $mis = $d['mision'] ?? [];
        $val = $d['valores'] ?? [];   $cif = $d['cifras'] ?? [];
        if (!empty($enc['bajada'])) $h .= '<p>' . e($enc['bajada']) . '</p>';
        $h .= $bloque($mis['mision_titulo'] ?? '', $mis['mision_texto'] ?? '');
        $h .= $bloque($mis['vision_titulo'] ?? '', $mis['vision_texto'] ?? '');
        if (!empty($val['titulo'])) {
          $h .= '<h2>' . e($val['titulo']) . '</h2><ul>';
          for ($i = 1; $i <= 4; $i++) {
            if (empty($val["v{$i}_titulo"])) continue;
            $h .= '<li><strong>' . e($val["v{$i}_titulo"]) . '</strong>: ' . e($val["v{$i}_texto"] ?? '') . '</li>';
          }
          $h .= '</ul>';
        }
        $nums = [];
        for ($i = 1; $i <= 3; $i++) {
          if (empty($cif["c{$i}_valor"])) continue;
          $nums[] = e($cif["c{$i}_valor"]) . ' ' . e($cif["c{$i}_texto"] ?? '');
        }
        if ($nums) $h .= '<p>' . implode(' · ', $nums) . '</p>';
      }

      elseif ($path === '/servicios-ia') {
        $d = $c('servicios-ia');
        $sol = $d['soluciones'] ?? []; $tar = $d['tarjetas'] ?? [];
        $por = $d['por_que'] ?? [];    $cif = $d['cifras'] ?? [];
        if (!empty($sol['bajada'])) $h .= '<p>' . e($sol['bajada']) . '</p>';
        $h .= '<h2>' . e(trim(($sol['titulo_1'] ?? 'Soluciones') . ' ' . ($sol['titulo_2'] ?? ''))) . '</h2><ul>';
        foreach (['w', 'v', 'm', 'e'] as $k) {
          if (empty($tar["{$k}_titulo"])) continue;
          $h .= '<li><strong>' . e($tar["{$k}_titulo"]) . '</strong>'
              . (!empty($tar["{$k}_sub"]) ? ' (' . e($tar["{$k}_sub"]) . ')' : '')
              . ': ' . e($tar["{$k}_texto"] ?? '') . '</li>';
        }
        $h .= '</ul>';
        if (!empty($por['titulo_2'])) {
          $h .= '<h2>' . e(trim(($por['titulo_1'] ?? '') . ' ' . $por['titulo_2'])) . '</h2><ul>';
          for ($i = 1; $i <= 3; $i++) {
            if (empty($por["r{$i}_titulo"])) continue;
            $h .= '<li><strong>' . e($por["r{$i}_titulo"]) . '</strong>: ' . e($por["r{$i}_texto"] ?? '') . '</li>';
          }
          $h .= '</ul>';
        }
        $nums = [];
        for ($i = 1; $i <= 4; $i++) {
          if (empty($cif["c{$i}_valor"])) continue;
          $nums[] = e($cif["c{$i}_valor"]) . ' ' . e($cif["c{$i}_texto"] ?? '');
        }
        if ($nums) $h .= '<p>' . implode(' · ', $nums) . '</p>';
      }

      elseif (strpos($path, '/servicios-ia/') === 0) {
        $mapa = ['/servicios-ia/whatsapp' => 'servicios-ia-whatsapp', '/servicios-ia/ventas' => 'servicios-ia-ventas',
                 '/servicios-ia/marketing' => 'servicios-ia-marketing', '/servicios-ia/ecommerce' => 'servicios-ia-ecommerce'];
        $d = $c($mapa[$path] ?? '');
        $ben = $d['beneficios'] ?? []; $inc = $d['incluye'] ?? [];
        $how = $d['como_funciona'] ?? []; $ide = $d['ideal_para'] ?? [];
        if (!empty($ben['titulo_2'])) {
          $h .= '<h2>' . e(trim(($ben['titulo_1'] ?? '') . ' ' . $ben['titulo_2'])) . '</h2><ul>';
          for ($i = 1; $i <= 6; $i++) {
            if (empty($ben["b{$i}_titulo"])) continue;
            $h .= '<li><strong>' . e($ben["b{$i}_titulo"]) . '</strong>: ' . e($ben["b{$i}_texto"] ?? '') . '</li>';
          }
          $h .= '</ul>';
        }
        if (!empty($inc['titulo_2'])) {
          $h .= '<h2>' . e(trim(($inc['titulo_1'] ?? '') . ' ' . $inc['titulo_2'])) . '</h2><ul>';
          for ($i = 1; $i <= 8; $i++) {
            if (empty($inc["f{$i}"])) continue;
            $h .= '<li>' . e($inc["f{$i}"]) . '</li>';
          }
          $h .= '</ul>';
        }
        if (!empty($how['titulo_2'])) {
          $h .= '<h2>' . e(trim(($how['titulo_1'] ?? '') . ' ' . $how['titulo_2'])) . '</h2>';
          if (!empty($how['bajada'])) $h .= '<p>' . e($how['bajada']) . '</p>';
          $h .= '<ol>';
          for ($i = 1; $i <= 4; $i++) {
            if (empty($how["p{$i}_titulo"])) continue;
            $h .= '<li><strong>' . e($how["p{$i}_titulo"]) . '</strong>: ' . e($how["p{$i}_texto"] ?? '') . '</li>';
          }
          $h .= '</ol>';
        }
        if (!empty($ide['titulo_2'])) {
          $h .= '<h2>' . e(trim(($ide['titulo_1'] ?? '') . ' ' . $ide['titulo_2'])) . '</h2><ul>';
          for ($i = 1; $i <= 8; $i++) {
            if (empty($ide["i{$i}"])) continue;
            $h .= '<li>' . e($ide["i{$i}"]) . '</li>';
          }
          $h .= '</ul>';
        }
      }

      elseif ($path === '/privacidad' || $path === '/terminos') {
        $d = $c($path === '/privacidad' ? 'privacidad' : 'terminos');
        $ap = $d['apartados'] ?? [];
        for ($i = 1; $i <= 10; $i++) {
          if (($ap["a{$i}_ver"] ?? '1') === '0') continue;
          $t = trim((string)($ap["a{$i}_titulo"] ?? ''));
          $x = trim((string)($ap["a{$i}_texto"] ?? ''));
          if ($t === '' && $x === '') continue;
          if ($t !== '') $h .= '<h2>' . e($t) . '</h2>';
          if ($x !== '') $h .= '<p>' . nl2br(e($x)) . '</p>';
          $pts = array_filter(array_map('trim', explode("\n", (string)($ap["a{$i}_lista"] ?? ''))));
          if ($pts) $h .= '<ul><li>' . implode('</li><li>', array_map('e', $pts)) . '</li></ul>';
        }
        if (!empty($d['encabezado']['fecha'])) $h .= '<p>' . e($d['encabezado']['fecha']) . '</p>';
      }

      return $h;
    };
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

/* Posicionamiento GEO: la página se arma con lo que el cliente escribió en el
   panel, y sus preguntas se publican como FAQPage. Un asistente que no ejecuta
   JavaScript tiene que poder leerla completa desde aquí; si no, estaríamos
   vendiendo un servicio que nuestra propia página no aplica. */
if ($path === '/servicios/posicionamiento-en-ia') {
  $is404 = false;
  $g   = $paginas['posicionamiento-ia']['contenido'] ?? [];
  $gp  = $g['portada'] ?? [];
  $gf  = $g['preguntas'] ?? [];
  $gs  = $g['servicio'] ?? [];
  $gl  = $g['local'] ?? [];

  $title = ($gp['seo_titulo'] ?? '') ?: 'Posicionamiento en IA (GEO) en Aguascalientes | ' . $siteName;
  $desc  = ($gp['seo_desc'] ?? '') ?: 'Logramos que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen bien a tu negocio. Diagnóstico gratuito en Aguascalientes.';
  $canonical = $BASE . $path;
  $crumbs[] = ['Servicios', '/servicios'];
  $crumbs[] = ['Posicionamiento en IA', $path];

  // Las preguntas, marcadas para que Google y los asistentes las reconozcan
  $faq = [];
  for ($i = 1; $i <= 12; $i++) {
    $q = trim((string)($gf['q' . $i] ?? ''));
    $a = trim((string)($gf['r' . $i] ?? ''));
    if ($q === '' || $a === '') continue;
    $faq[] = ['@type' => 'Question', 'name' => $q,
              'acceptedAnswer' => ['@type' => 'Answer', 'text' => $a]];
  }
  if ($faq) {
    $schema[] = ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $faq];
  }

  $schema[] = [
    '@context' => 'https://schema.org',
    '@type'    => 'Service',
    'name'     => 'Posicionamiento en inteligencia artificial (GEO)',
    'alternateName' => ['Generative Engine Optimization', 'Posicionamiento GEO', 'Posicionamiento en ChatGPT'],
    'serviceType'   => 'Generative Engine Optimization',
    'description'   => $desc,
    'url'      => $canonical,
    'provider' => [
      '@type' => 'LocalBusiness',
      'name'  => $settings['businessName'] ?? $siteName,
      'url'   => $BASE,
      'address' => [
        '@type' => 'PostalAddress',
        'streetAddress'   => $settings['businessAddress'] ?? '',
        'addressLocality' => $settings['businessCity'] ?? 'Aguascalientes',
        'addressRegion'   => $settings['businessState'] ?? 'Aguascalientes',
        'postalCode'      => $settings['businessZip'] ?? '',
        'addressCountry'  => 'MX',
      ],
    ],
    'areaServed' => [
      ['@type' => 'City',  'name' => 'Aguascalientes'],
      ['@type' => 'State', 'name' => 'Aguascalientes'],
      ['@type' => 'Country', 'name' => 'México'],
    ],
    'offers' => ['@type' => 'Offer', 'availability' => 'https://schema.org/InStock',
                 'description' => 'Diagnóstico de posicionamiento en IA sin costo'],
  ];

  // Y esto es lo que lee quien no ejecuta JavaScript
  $bodyBuilder = function() use ($gp, $gs, $gf, $gl, $g) {
    $h  = '<h1>' . e(trim(($gp['titulo_1'] ?? 'Tus clientes ya no buscan.') . ' ' . ($gp['titulo_2'] ?? 'Preguntan.'))) . '</h1>';
    $h .= '<p>' . e($gp['bajada'] ?? '') . '</p>';

    $mot = $g['motores'] ?? [];
    $lista = [];
    for ($i = 1; $i <= 6; $i++) if (!empty($mot['m' . $i])) $lista[] = $mot['m' . $i];
    if ($lista) $h .= '<h2>' . e(trim(($mot['titulo_1'] ?? '') . ' ' . ($mot['titulo_2'] ?? ''))) . '</h2><ul><li>' . implode('</li><li>', array_map('e', $lista)) . '</li></ul>';

    $h .= '<h2>' . e(trim(($gs['titulo_1'] ?? 'Qué') . ' ' . ($gs['titulo_2'] ?? 'hacemos'))) . '</h2><ul>';
    for ($i = 1; $i <= 6; $i++) {
      if (empty($gs['s' . $i . '_t'])) continue;
      $h .= '<li><strong>' . e($gs['s' . $i . '_t']) . '</strong>: ' . e($gs['s' . $i . '_d'] ?? '') . '</li>';
    }
    $h .= '</ul>';

    $h .= '<h2>Preguntas frecuentes</h2>';
    for ($i = 1; $i <= 12; $i++) {
      if (empty($gf['q' . $i])) continue;
      $h .= '<h3>' . e($gf['q' . $i]) . '</h3><p>' . e($gf['r' . $i] ?? '') . '</p>';
    }

    if (!empty($gl['titulo'])) $h .= '<h2>' . e($gl['titulo']) . '</h2><p>' . e($gl['texto'] ?? '') . '</p>';
    return $h;
  };
}

/* Páginas de contacto del equipo: son personas, así que llevan su propio
   título, su foto al compartir y una ficha Person para los buscadores. */
$slugMiembro = $paginasPorRuta[$path] ?? null;
if ($slugMiembro !== null && isset($miembros[$slugMiembro])) {
  $pg = $miembros[$slugMiembro];
  $dm = is_array($pg['contenido']) ? $pg['contenido'] : [];
  $is404 = false;
  $quien = trim(($dm['nombre'] ?? $pg['nombre']) . ($dm['puesto'] ? ' · ' . $dm['puesto'] : ''));
  $title = $pg['seo_title'] ?: ($quien . ' | ' . $siteName);
  $desc  = $pg['seo_desc'] ?: trim($dm['frase'] ?? '');
  if ($desc === '') {
    $desc = 'Contacto de ' . ($dm['nombre'] ?? $pg['nombre'])
          . ($dm['puesto'] ? ', ' . $dm['puesto'] : '')
          . ($dm['empresa'] ? ' en ' . $dm['empresa'] : '') . '.';
  }
  $canonical = $BASE . $path;
  $crumbs[] = [$dm['nombre'] ?? $pg['nombre'], $path];
  if (!empty($dm['foto'])) $GLOBALS['seoImagenPagina'] = $dm['foto'];

  $perfiles = [];
  foreach (['instagram','facebook','linkedin','tiktok','youtube','behance'] as $red) {
    if (!empty($dm[$red])) $perfiles[] = $dm[$red];
  }
  $person = ['@context' => 'https://schema.org', '@type' => 'Person',
             'name' => $dm['nombre'] ?? $pg['nombre'], 'url' => $canonical];
  if (!empty($dm['puesto']))   $person['jobTitle'] = $dm['puesto'];
  if (!empty($dm['foto']))     $person['image'] = $dm['foto'];
  if (!empty($dm['email']))    $person['email'] = $dm['email'];
  if (!empty($dm['telefono'])) $person['telephone'] = $dm['telefono'];
  if (!empty($dm['empresa']))  $person['worksFor'] = ['@type' => 'Organization', 'name' => $dm['empresa']];
  if ($perfiles)               $person['sameAs'] = $perfiles;
  $GLOBALS['schemaMiembro'] = $person;

  // Lo que lee un buscador, que no ejecuta JavaScript.
  $bodyBuilder = function() use ($dm, $pg) {
    $h  = '<h1>' . e($dm['nombre'] ?? $pg['nombre']) . '</h1>';
    if (!empty($dm['puesto']))  $h .= '<p><strong>' . e($dm['puesto']) . '</strong>'
                                   . (!empty($dm['empresa']) ? ' · ' . e($dm['empresa']) : '') . '</p>';
    if (!empty($dm['frase']))   $h .= '<p>' . e($dm['frase']) . '</p>';
    if (!empty($dm['telefono']))$h .= '<p>Teléfono: ' . e($dm['telefono']) . '</p>';
    if (!empty($dm['whatsapp']))$h .= '<p>WhatsApp: ' . e($dm['whatsapp']) . '</p>';
    if (!empty($dm['email']))   $h .= '<p>Email: ' . e($dm['email']) . '</p>';
    $r = [];
    foreach (['instagram'=>'Instagram','facebook'=>'Facebook','linkedin'=>'LinkedIn',
              'tiktok'=>'TikTok','youtube'=>'YouTube','behance'=>'Behance'] as $k => $n) {
      if (!empty($dm[$k])) $r[] = '<a href="' . e($dm[$k]) . '">' . $n . '</a>';
    }
    if ($r) $h .= '<p>' . implode(' · ', $r) . '</p>';
    return $h;
  };
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
  /* Convierte lo que el panel guarda en Markdown al HTML que lee un bot.
     Ademas de titulos y listas, ahora entiende negritas, codigo y tablas:
     sin eso los articulos salian con los asteriscos a la vista y las tablas
     comparativas se perdian, que son justo lo que una IA cita. */
  $inline = function (string $t): string {
    $t = e($t);                                    // primero se escapa
    $t = preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $t);
    $t = preg_replace('/`([^`]+)`/u', '<code>$1</code>', $t);
    // [texto](/ruta) -> enlace, solo rutas internas o https
    $t = preg_replace('~\[([^\]]+)\]\((/[^)\s]*|https://[^)\s]+)\)~u', '<a href="$2">$1</a>', $t);
    return $t;
  };
  $lineas = preg_split('/\r?\n/', $md);
  $out = []; $inUl = false; $n = count($lineas);
  for ($i = 0; $i < $n; $i++) {
    $t = trim($lineas[$i]);
    if ($t === '') { if ($inUl) { $out[] = '</ul>'; $inUl = false; } continue; }

    // Tabla: una fila con barras seguida del separador |---|---|
    if (strpos($t, '|') === 0 && isset($lineas[$i+1]) && preg_match('/^\s*\|[\s:|-]+\|\s*$/', $lineas[$i+1])) {
      if ($inUl) { $out[] = '</ul>'; $inUl = false; }
      $celdas = fn($f) => array_map('trim', explode('|', trim($f, " \t|")));
      $out[] = '<table><thead><tr>';
      foreach ($celdas($t) as $c) $out[] = '<th>' . $inline($c) . '</th>';
      $out[] = '</tr></thead><tbody>';
      $i += 2;
      while ($i < $n && strpos(trim($lineas[$i]), '|') === 0) {
        $out[] = '<tr>';
        foreach ($celdas($lineas[$i]) as $c) $out[] = '<td>' . $inline($c) . '</td>';
        $out[] = '</tr>';
        $i++;
      }
      $i--;
      $out[] = '</tbody></table>';
      continue;
    }

    if (preg_match('/^###\s+(.*)/', $t, $m))       { if ($inUl) { $out[]='</ul>'; $inUl=false; } $out[]='<h3>'.$inline($m[1]).'</h3>'; }
    elseif (preg_match('/^##\s+(.*)/', $t, $m))    { if ($inUl) { $out[]='</ul>'; $inUl=false; } $out[]='<h2>'.$inline($m[1]).'</h2>'; }
    elseif (preg_match('/^#\s+(.*)/', $t, $m))     { if ($inUl) { $out[]='</ul>'; $inUl=false; } $out[]='<h2>'.$inline($m[1]).'</h2>'; }
    elseif (preg_match('/^[-*]\s+(.*)/', $t, $m))  { if (!$inUl) { $out[]='<ul>'; $inUl=true; } $out[]='<li>'.$inline($m[1]).'</li>'; }
    elseif (preg_match('/^\d+\.\s+(.*)/', $t, $m)) { if (!$inUl) { $out[]='<ul>'; $inUl=true; } $out[]='<li>'.$inline($m[1]).'</li>'; }
    else { if ($inUl) { $out[]='</ul>'; $inUl=false; } $out[]='<p>'.$inline($t).'</p>'; }
  }
  if ($inUl) $out[] = '</ul>';
  return implode("\n", $out);
}

// JSON-LD organización (siempre)
$org = ['@context'=>'https://schema.org','@type'=>($seo['orgType'] ?: 'ProfessionalService'),'name'=>$seo['orgName'] ?: $siteName,'url'=>$BASE,'logo'=>$logo,'image'=>$logo,'description'=>$defaultDesc,'telephone'=>$seo['phone'] ?? ($settings['businessPhone'] ?? ''),'email'=>$seo['email'] ?? ($settings['businessEmail'] ?? ''),'priceRange'=>$seo['priceRange'] ?: '$$','address'=>['@type'=>'PostalAddress','streetAddress'=>$seo['address'] ?? ($settings['businessAddress'] ?? ''),'addressLocality'=>$seo['city'] ?? ($settings['businessCity'] ?? ''),'addressRegion'=>$seo['state'] ?? ($settings['businessState'] ?? ''),'postalCode'=>$seo['zip'] ?? ($settings['businessZip'] ?? ''),'addressCountry'=>'MX'],'areaServed'=>'Aguascalientes','sameAs'=>array_values(array_filter([$seo['facebook'] ?? '',$seo['instagram'] ?? '',$seo['linkedin'] ?? '']))];
$mapsUrl = $settings['mapsUrl'] ?? '';
if ($mapsUrl) $org['hasMap'] = $mapsUrl;
if (!empty($seo['latitude']) && !empty($seo['longitude'])) $org['geo'] = ['@type'=>'GeoCoordinates','latitude'=>$seo['latitude'],'longitude'=>$seo['longitude']];
/* Horario, para que un asistente pueda responder "¿a qué hora abren?".
   Se arma leyendo lo que el cliente escribió en Ajustes; si algún día pone
   un formato que no entendemos, simplemente no se publica el bloque. */
if (!empty($settings['businessHours']) && preg_match('/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/', $settings['businessHours'], $hm)) {
  $org['openingHoursSpecification'] = [[
    '@type' => 'OpeningHoursSpecification',
    'dayOfWeek' => ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    'opens'  => sprintf('%02d:%02d', (int)$hm[1], (int)$hm[2]),
    'closes' => sprintf('%02d:%02d', (int)$hm[3], (int)$hm[4]),
  ]];
}
/* El sitio como entidad. No se declara SearchAction porque no hay buscador
   interno: anunciar uno que no existe es peor que omitirlo. */
$schema[] = ['@context'=>'https://schema.org','@type'=>'WebSite','name'=>$seo['orgName'] ?: $siteName,
             'url'=>$BASE,'inLanguage'=>'es-MX','publisher'=>['@type'=>'Organization','name'=>$seo['orgName'] ?: $siteName]];
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
<?php
// Iconos. Si el cliente subio uno propio en el panel, manda ese; si no, el
// juego que vive en public_html. El logo horizontal NO sirve aqui: en 16x16
// queda ilegible, por eso el respaldo es un .ico cuadrado del isotipo.
// Se ignora el logo horizontal: en 16x16 queda ilegible.
$fav = trim((string)($paginas['marca']['contenido']['logo']['favicon'] ?? ''));
$propio = $fav !== '' && $fav !== '/favicon.ico' && strpos($fav, 'LOGO%20INEDITO') === false;
if ($propio): ?>
<link rel="icon" href="<?= e($fav) ?>" />
<link rel="apple-touch-icon" href="<?= e($fav) ?>" />
<?php else: ?>
<link rel="preload" href="/fonts/Hanson-Bold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<?php endif; ?>
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
<?php if (!empty($GLOBALS['schemaMiembro'])) $schema[] = $GLOBALS['schemaMiembro']; ?>
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
  /* Se completan con sus valores por defecto antes de mandarlos. Si el panel
     gana un campo nuevo, las páginas guardadas antes lo reciben igual, en vez
     de depender de que cada lugar del sitio acuerde su propio respaldo. */
  $miembrosLS = [];
  foreach ($miembros as $sl => $pg) {
    $datos = function_exists('miembro_con_respaldo')
      ? miembro_con_respaldo(is_array($pg['contenido']) ? $pg['contenido'] : [])
      : $pg['contenido'];
    $miembrosLS[$sl] = ['slug' => $sl, 'nombre' => $pg['nombre'], 'ruta' => $pg['ruta'], 'datos' => $datos];
  }
  $LS = ['inedito_services'=>$services,'inedito_blog'=>$blog,'inedito_portfolio'=>$portfolio,'inedito_settings'=>$settings,'inedito_seo_global'=>$seo_global,'inedito_seo_schema'=>$seo_schema,'inedito_paginas'=>$contenidoPaginas,'inedito_paginas_nuevas'=>$paginasNuevas,'inedito_miembros'=>$miembrosLS];
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