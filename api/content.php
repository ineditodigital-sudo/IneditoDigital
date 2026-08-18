<?php
/** Contenido PÚBLICO publicado. Fusiona el detalle original (data_json) con los
 *  campos editados en el panel (columnas), para que las ediciones se reflejen. */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30');
require __DIR__ . '/db.php';

$lines = function ($s): array { $s = trim((string)$s); if ($s === '') return []; return array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $s)), fn($x) => $x !== '')); };
$commas = function ($s): array { $s = trim((string)$s); if ($s === '') return []; return array_values(array_filter(array_map('trim', explode(',', $s)), fn($x) => $x !== '')); };
$base = function ($r): array { $b = json_decode((string)($r['data_json'] ?? ''), true); return is_array($b) ? $b : []; };

try {
    $pdo = db_connect($cfg);

    $services = [];
    foreach ($pdo->query("SELECT * FROM services WHERE status='published' ORDER BY id ASC") as $r) {
        $b = $base($r);
        $b['id'] = $b['id'] ?? (string)$r['id'];
        if ($r['slug'] !== '') $b['slug'] = $r['slug'];
        if ($r['title'] !== '') $b['title'] = $r['title'];
        if ($r['short_desc'] !== '') $b['shortDescription'] = $r['short_desc'];
        if ($r['category'] !== '') $b['category'] = $r['category'];
        if (!empty($r['image'])) $b['bannerImage'] = $r['image'];
        $fl = $lines($r['features']); if ($fl) $b['features'] = $fl;
        $bl = $lines($r['benefits']); if ($bl) $b['benefits'] = $bl;
        $services[] = $b;
    }

    $blog = [];
    foreach ($pdo->query("SELECT * FROM blog_posts WHERE status='published' ORDER BY id ASC") as $r) {
        $b = $base($r);
        $b['id'] = $b['id'] ?? (string)$r['id'];
        foreach (['slug'=>'slug','title'=>'title','category'=>'category','author'=>'author','image'=>'image','excerpt'=>'excerpt','content'=>'content'] as $col=>$key)
            if ($r[$col] !== '') $b[$key] = $r[$col];
        if ($r['read_time'] !== '') $b['readTime'] = $r['read_time'];
        $seo = $b['seo'] ?? [];
        if ($r['meta_title'] !== '') $seo['metaTitle'] = $r['meta_title'];
        if ($r['meta_desc'] !== '') $seo['metaDescription'] = $r['meta_desc'];
        $kw = $commas($r['keywords']); if ($kw) $seo['keywords'] = $kw;
        if ($seo) $b['seo'] = $seo;
        $blog[] = $b;
    }

    $portfolio = [];
    foreach ($pdo->query("SELECT * FROM portfolio WHERE status='published' ORDER BY id ASC") as $r) {
        $b = $base($r);
        $b['id'] = $b['id'] ?? (string)$r['id'];
        foreach (['slug'=>'slug','title'=>'title','client'=>'client','category'=>'category','image'=>'image','challenge'=>'challenge','solution'=>'solution'] as $col=>$key)
            if ($r[$col] !== '') $b[$key] = $r[$col];
        if ($r['short_desc'] !== '') $b['description'] = $r['short_desc'];
        $g = $lines($r['gallery']); if ($g) $b['screenshots'] = $g;
        $rl = $lines($r['results']); if ($rl) { $res=[]; foreach ($rl as $ln){ $p=explode(':',$ln,2); $res[]=['metric'=>trim($p[0]),'value'=>trim($p[1]??'')]; } $b['results']=$res; }
        $tg = $commas($r['keywords']); if ($tg) $b['tags'] = $tg;
        $portfolio[] = $b;
    }

    /* Contenido editable de las páginas. Solo lo PUBLICADO: el borrador
       nunca sale al sitio. */
    $paginas = [];
    try {
        foreach ($pdo->query("SELECT slug, contenido FROM pages WHERE status='published'") as $r) {
            $c = json_decode((string)$r['contenido'], true);
            if (is_array($c)) $paginas[$r['slug']] = $c;
        }
    } catch (Throwable $e) { /* si aún no existe la tabla, el sitio sigue igual */ }

    $ss = []; foreach ($pdo->query("SELECT k,v FROM site_settings") as $r) $ss[$r['k']] = $r['v'];
    $seo = []; foreach ($pdo->query("SELECT k,v FROM seo_settings") as $r) $seo[$r['k']] = $r['v'];
} catch (Throwable $e) {
    http_response_code(500); echo json_encode(['ok' => false, 'error' => 'Error del servidor']); exit;
}

$settings = [
    'whatsappNumber'=>$ss['whatsappNumber']??'', 'businessName'=>$ss['businessName']??'',
    'businessAddress'=>$ss['businessAddress']??'', 'businessCity'=>$ss['businessCity']??'',
    'businessState'=>$ss['businessState']??'', 'businessZip'=>$ss['businessZip']??'',
    'businessPhone'=>$ss['businessPhone']??'', 'businessEmail'=>$ss['businessEmail']??'', 'businessHours'=>$ss['businessHours']??'', 'mapsUrl'=>$ss['mapsUrl']??'',
];
$seo_global = ['siteName'=>$seo['siteName']??'','author'=>$seo['author']??'','defaultImage'=>$seo['defaultImage']??'','twitterHandle'=>$seo['twitterHandle']??'','googleAnalytics'=>$seo['googleAnalytics']??'','facebookPixel'=>$seo['facebookPixel']??'','googleSiteVerification'=>$seo['googleSiteVerification']??'','bingVerification'=>$seo['bingVerification']??''];
$seo_schema = ['organizationName'=>$seo['orgName']??'','organizationType'=>$seo['orgType']??'ProfessionalService','phone'=>$seo['phone']??'','email'=>$seo['email']??'','priceRange'=>$seo['priceRange']??'$$','address'=>$seo['address']??'','city'=>$seo['city']??'','state'=>$seo['state']??'','zip'=>$seo['zip']??'','latitude'=>$seo['latitude']??'','longitude'=>$seo['longitude']??'','socialMedia'=>['facebook'=>$seo['facebook']??'','instagram'=>$seo['instagram']??'','linkedin'=>$seo['linkedin']??'']];

$payload = compact('services','blog','portfolio','settings','seo_global','seo_schema','paginas');
$sig = md5(json_encode($payload));
echo json_encode(['ok'=>true,'sig'=>$sig] + $payload);
