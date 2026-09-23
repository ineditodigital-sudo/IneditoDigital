<?php
/**
 * Banco de pruebas del CRUD, en local y contra SQLite: comprueba que los
 * tres formularios se pintan sin error y que guardar deja las dos copias
 * —columna y data_json— diciendo lo mismo. No toca produccion.
 */
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '1');

$RAIZ = dirname(__DIR__);

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec("CREATE TABLE portfolio (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT DEFAULT '', title TEXT DEFAULT '', client TEXT DEFAULT '', category TEXT DEFAULT '', image TEXT DEFAULT '', short_desc TEXT DEFAULT '', full_desc TEXT DEFAULT '', gallery TEXT DEFAULT '', challenge TEXT DEFAULT '', solution TEXT DEFAULT '', results TEXT DEFAULT '', testimonial TEXT DEFAULT '', testimonial_author TEXT DEFAULT '', testimonial_role TEXT DEFAULT '', meta_title TEXT DEFAULT '', meta_desc TEXT DEFAULT '', keywords TEXT DEFAULT '', status TEXT DEFAULT 'draft', created_at TEXT DEFAULT '', data_json TEXT DEFAULT '')");
$pdo->exec("CREATE TABLE services (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT DEFAULT '', title TEXT DEFAULT '', category TEXT DEFAULT '', price TEXT DEFAULT '', image TEXT DEFAULT '', short_desc TEXT DEFAULT '', full_desc TEXT DEFAULT '', features TEXT DEFAULT '', benefits TEXT DEFAULT '', meta_title TEXT DEFAULT '', meta_desc TEXT DEFAULT '', keywords TEXT DEFAULT '', status TEXT DEFAULT 'draft', created_at TEXT DEFAULT '', data_json TEXT DEFAULT '')");
$pdo->exec("CREATE TABLE blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT DEFAULT '', title TEXT DEFAULT '', category TEXT DEFAULT '', author TEXT DEFAULT '', image TEXT DEFAULT '', read_time TEXT DEFAULT '', publish_date TEXT, excerpt TEXT DEFAULT '', content TEXT DEFAULT '', meta_title TEXT DEFAULT '', meta_desc TEXT DEFAULT '', keywords TEXT DEFAULT '', status TEXT DEFAULT 'draft', created_at TEXT DEFAULT '', updated_at TEXT DEFAULT '', data_json TEXT DEFAULT '')");

/* Un caso igual que los de produccion: la mitad del contenido solo vive en
   el data_json, que es de donde el sitio lo lee. */
$pdo->exec("INSERT INTO portfolio (slug,title,client,category,image,short_desc,challenge,solution,results,keywords,gallery,status,data_json) VALUES (
  'ofitodo','OFITODO','OFITODO','Ecommerce','https://x/i.png','Rediseño completo.','Necesitaba presencia.','Sitio nuevo.','Conversión: +340%','muebles, ecommerce','https://x/1.png','published',
  '" . str_replace("'", "''", json_encode([
      'id'=>'1','slug'=>'ofitodo','title'=>'OFITODO','client'=>'OFITODO','category'=>'Ecommerce',
      'description'=>'Rediseño completo.','challenge'=>'Necesitaba presencia.','solution'=>'Sitio nuevo.',
      'results'=>[['metric'=>'Conversión','value'=>'+340%']],
      'services'=>['Diseño Web','SEO'],'tags'=>['muebles','ecommerce'],'highlights'=>['Catálogo 3D','Cotizador'],
      'screenshots'=>['https://x/1.png'],'websiteUrl'=>'https://ofitodo.com','logo'=>'https://x/logo.png','year'=>'2024',
  ], JSON_UNESCAPED_UNICODE)) . "')");

// --- las piezas del panel que el CRUD da por hechas ---
session_start();
$_SESSION['csrf'] = 'prueba';
function db(): PDO { global $pdo; return $pdo; }
function e($v): string { return htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8'); }
function csrf(): string { return 'prueba'; }
function csrf_check(): void {}
function set_flash(string $m): void { $GLOBALS['flash'] = $m; }
function slugify(string $s): string { $s = iconv('UTF-8','ASCII//TRANSLIT',$s); return trim(strtolower(preg_replace('/[^a-zA-Z0-9]+/','-',$s)), '-'); }
function redirect(string $to): void { $GLOBALS['redirigio'] = $to; throw new RuntimeException('__redirect__'); }
function pcard(array $a): string { return '<article>' . e($a['nombre']) . '</article>'; }

function prueba(string $nombre, callable $fn): void {
    try { $fn(); echo "  ok    $nombre\n"; }
    catch (Throwable $ex) { echo "  FALLA $nombre → " . get_class($ex) . ': ' . $ex->getMessage() . "\n    " . $ex->getFile() . ':' . $ex->getLine() . "\n"; $GLOBALS['fallos'] = ($GLOBALS['fallos'] ?? 0) + 1; }
}

function pintar(string $modulo, array $get): string {
    global $RAIZ;
    $_GET = $get; $_SERVER['REQUEST_METHOD'] = 'GET';
    ob_start();
    try { require $RAIZ . "/panel/pages/$modulo.php"; }
    catch (Throwable $ex) { ob_end_clean(); throw $ex; }
    return ob_get_clean();
}

echo "== los formularios se pintan ==\n";
foreach (['portafolio' => 1, 'servicios' => 0, 'blog' => 0] as $mod => $id) {
    prueba("$mod · formulario nuevo", function () use ($mod) {
        $h = pintar($mod, ['new' => '1']);
        if (stripos($h, 'Fatal') !== false || trim($h) === '') throw new RuntimeException('salida vacia o con error');
    });
}
prueba('portafolio · editar el caso existente', function () {
    $h = pintar('portafolio', ['edit' => '1']);
    foreach (['https://ofitodo.com', '2024', 'Diseño Web', 'Catálogo 3D', 'Conversión', 'muebles, ecommerce'] as $esperado) {
        if (strpos($h, $esperado) === false) throw new RuntimeException("no aparece {$esperado} en el formulario");
    }
});
prueba('portafolio · ya no pide testimonial ni descripcion completa', function () {
    $h = pintar('portafolio', ['edit' => '1']);
    foreach (['Testimonial', 'Descripción completa'] as $fuera)
        if (strpos($h, $fuera) !== false) throw new RuntimeException("sigue apareciendo «$fuera»");
});
prueba('portafolio · lista', function () {
    $h = pintar('portafolio', []);
    if (strpos($h, 'OFITODO') === false) throw new RuntimeException('el caso no sale en la lista');
});

echo "\n== guardar deja las dos copias iguales ==\n";
prueba('portafolio · guardar el sitio web del cliente', function () use ($pdo, $RAIZ) {
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $_GET = [];
    $_POST = [
        'csrf'=>'prueba','action'=>'save','id'=>'1',
        'title'=>'OFITODO','slug'=>'ofitodo','client'=>'OFITODO','category'=>'Ecommerce',
        'year'=>'2025','websiteUrl'=>'https://ofitodo.com/nuevo','status'=>'published',
        'short_desc'=>'Rediseño completo.','challenge'=>'Otro reto.','solution'=>'Sitio nuevo.',
        'results'=>json_encode([['metric'=>'Conversión','value'=>'+400%'],['metric'=>'Tráfico','value'=>'+120%']]),
        'services'=>"Diseño Web\nSEO\nConversión",
        'image'=>'https://x/i.png','logo'=>'https://x/logo.png',
        'highlights'=>"Catálogo 3D\nCotizador",'gallery'=>"https://x/1.png\nhttps://x/2.png",
        'keywords'=>'muebles, ecommerce, oficina','meta_title'=>'OFITODO | Caso','meta_desc'=>'Un caso.',
    ];
    try { require $RAIZ . '/panel/pages/portafolio.php'; }
    catch (RuntimeException $ex) { if ($ex->getMessage() !== '__redirect__') throw $ex; }

    $r = $pdo->query("SELECT * FROM portfolio WHERE id=1")->fetch();
    $j = json_decode($r['data_json'], true);

    $comprobar = [
        'el sitio del cliente llega al data_json' => $j['websiteUrl'] === 'https://ofitodo.com/nuevo',
        'el año llega al data_json'               => $j['year'] === '2025',
        'el reto se actualiza en las dos copias'  => $j['challenge'] === 'Otro reto.' && $r['challenge'] === 'Otro reto.',
        'los resultados quedan estructurados'     => $j['results'][1]['value'] === '+120%',
        'los resultados tambien en la columna'    => trim($r['results']) === "Conversión: +400%\nTráfico: +120%",
        'los servicios son un arreglo'            => $j['services'] === ['Diseño Web','SEO','Conversión'],
        'las capturas van a screenshots'          => count($j['screenshots']) === 2,
        'las etiquetas van a tags'                => $j['tags'] === ['muebles','ecommerce','oficina'],
        'la columna keywords lleva comas'         => $r['keywords'] === 'muebles, ecommerce, oficina',
        'los logros se guardan'                   => $j['highlights'] === ['Catálogo 3D','Cotizador'],
        'las etiquetas aceptan comas'            => $j['tags'] === ['muebles','ecommerce','oficina'],
        'el id no se pierde'                      => $j['id'] === '1',
    ];
    foreach ($comprobar as $q => $ok) if (!$ok) throw new RuntimeException("falla: $q");
});

prueba('servicios · crear uno nuevo con proceso y preguntas', function () use ($pdo, $RAIZ) {
    $_SERVER['REQUEST_METHOD'] = 'POST'; $_GET = [];
    $_POST = [
        'csrf'=>'prueba','action'=>'save',
        'title'=>'Servicio de prueba','slug'=>'','category'=>'Desarrollo','icon'=>'Bot','order'=>'3','status'=>'published',
        'short_desc'=>'Corta.','full_desc'=>'La definicion.','image'=>'','features'=>"Uno\nDos",'benefits'=>"A\nB",
        'ideal'=>"Empresas\nComercios",
        'process'=>json_encode([['title'=>'Diagnostico','description'=>'Se revisa.'],['title'=>'Entrega','description'=>'Se publica.']]),
        'faq'=>json_encode([['question'=>'¿Cuánto tarda?','answer'=>'Dos semanas.']]),
        'keywords'=>'uno, dos','meta_title'=>'Título SEO','meta_desc'=>'Descripción SEO',
    ];
    try { require $RAIZ . '/panel/pages/servicios.php'; }
    catch (RuntimeException $ex) { if ($ex->getMessage() !== '__redirect__') throw $ex; }

    $r = $pdo->query("SELECT * FROM services ORDER BY id DESC LIMIT 1")->fetch();
    $j = json_decode($r['data_json'], true);
    $comprobar = [
        'el slug se genera solo'          => $r['slug'] === 'servicio-de-prueba' && $j['slug'] === 'servicio-de-prueba',
        'la definicion va a definicion'   => $j['definicion'] === 'La definicion.',
        'el icono se guarda'              => $j['icon'] === 'Bot',
        'el orden se guarda'              => $j['order'] === '3',
        'para quien es'                   => $j['ideal'] === ['Empresas','Comercios'],
        'el proceso se numera solo'       => $j['process'][0]['step'] === 1 && $j['process'][1]['step'] === 2,
        'el proceso conserva el texto'    => $j['process'][1]['title'] === 'Entrega',
        'las preguntas se guardan'        => $j['faq'][0]['question'] === '¿Cuánto tarda?',
        'relacionados ya no se escribe'   => !array_key_exists('relatedServices', $j),
        'el seo va anidado'               => $j['seo']['metaTitle'] === 'Título SEO' && $j['seo']['keywords'] === ['uno','dos'],
        'el id nuevo entra al data_json'  => $j['id'] === (string)$r['id'],
    ];
    foreach ($comprobar as $q => $ok) if (!$ok) throw new RuntimeException("falla: $q");
});

prueba('blog · la fecha y las etiquetas llegan al sitio', function () use ($pdo, $RAIZ) {
    $_SERVER['REQUEST_METHOD'] = 'POST'; $_GET = [];
    $_POST = [
        'csrf'=>'prueba','action'=>'save',
        'title'=>'Un articulo','slug'=>'','category'=>'SEO','author'=>'Equipo','publish_date'=>'2026-03-01',
        'read_time'=>'6 min','status'=>'published','image'=>'','excerpt'=>'Resumen.','content'=>'# Hola',
        'keywords'=>'geo, ia','meta_title'=>'T','meta_desc'=>'D',
    ];
    try { require $RAIZ . '/panel/pages/blog.php'; }
    catch (RuntimeException $ex) { if ($ex->getMessage() !== '__redirect__') throw $ex; }

    $r = $pdo->query("SELECT * FROM blog_posts ORDER BY id DESC LIMIT 1")->fetch();
    $j = json_decode($r['data_json'], true);
    $comprobar = [
        'la fecha llega a date (la que se ve)' => $j['date'] === '2026-03-01',
        'y tambien a la columna (el schema)'   => $r['publish_date'] === '2026-03-01',
        'el tiempo de lectura llega'           => $j['readTime'] === '6 min',
        'las etiquetas van a tags'             => $j['tags'] === ['geo','ia'],
        'y tambien a seo.keywords'             => $j['seo']['keywords'] === ['geo','ia'],
        'el seo se guarda'                     => $j['seo']['metaTitle'] === 'T',
    ];
    foreach ($comprobar as $q => $ok) if (!$ok) throw new RuntimeException("falla: $q");
});

prueba('blog · una fecha vacia no rompe', function () use ($RAIZ) {
    $_SERVER['REQUEST_METHOD'] = 'POST'; $_GET = [];
    $_POST = ['csrf'=>'prueba','action'=>'save','title'=>'Sin fecha','slug'=>'','publish_date'=>'','status'=>'draft'];
    try { require $RAIZ . '/panel/pages/blog.php'; }
    catch (RuntimeException $ex) { if ($ex->getMessage() !== '__redirect__') throw $ex; }
});

echo "\n" . (empty($GLOBALS['fallos']) ? "TODO EN VERDE\n" : $GLOBALS['fallos'] . " FALLAS\n");
