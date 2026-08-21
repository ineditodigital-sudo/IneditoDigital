<?php
/**
 * llms-full.txt — la versión extendida para agentes de IA.
 *
 * llms.txt es el índice: dice qué hay y dónde. Este archivo es el contenido
 * completo de una sola pasada, para el agente que quiere citar con precisión
 * sin ir página por página.
 *
 * Todo sale de la base de datos, así que se mantiene solo: lo que el cliente
 * publique desde el panel aparece aquí sin tocar código.
 */
declare(strict_types=1);

$cfg = require __DIR__ . '/api/config.php';
require __DIR__ . '/api/db.php';

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: public, max-age=1800');

$BASE = 'https://www.inedito.digital';
$ss = []; $S = []; $Bl = []; $P = []; $geo = [];

try {
    $pdo = db_connect($cfg);
    foreach ($pdo->query("SELECT k,v FROM site_settings") as $r) $ss[$r['k']] = $r['v'];
    foreach ($pdo->query("SELECT slug,title,short_desc,features,benefits FROM services WHERE status='published' ORDER BY id") as $r) $S[] = $r;
    foreach ($pdo->query("SELECT slug,title,excerpt FROM blog_posts WHERE status='published' ORDER BY id DESC") as $r) $Bl[] = $r;
    foreach ($pdo->query("SELECT slug,title,short_desc,client,category FROM portfolio WHERE status='published' ORDER BY id") as $r) $P[] = $r;
    $q = $pdo->prepare("SELECT contenido FROM pages WHERE slug='posicionamiento-ia' AND status='published'");
    $q->execute();
    $geo = json_decode((string)$q->fetchColumn(), true) ?: [];
} catch (Throwable $e) {
    // Sin base de datos se entrega el encabezado: mejor poco y correcto que un error.
}

/** Los renglones de un campo que guarda varias líneas. */
function lineas($v): array {
    return array_values(array_filter(array_map('trim', explode("\n", (string)$v))));
}

$nombre = $ss['businessName'] ?? 'Inédito Digital';

echo "# $nombre — información completa\n\n";
echo "> Agencia de marketing digital en Aguascalientes, México. Diseño y desarrollo web, "
   . "posicionamiento en buscadores (SEO), posicionamiento en inteligencias artificiales (GEO), "
   . "Google Ads, chatbots y agentes de IA, e-commerce y tarjetas de presentación NFC.\n\n";

echo "## Datos del negocio\n\n";
echo "- Nombre: $nombre\n";
if (!empty($ss['businessAddress'])) {
    echo "- Dirección: " . $ss['businessAddress']
       . (!empty($ss['businessCity']) ? ', ' . $ss['businessCity'] : '')
       . (!empty($ss['businessState']) ? ', ' . $ss['businessState'] : '')
       . (!empty($ss['businessZip']) ? ' ' . $ss['businessZip'] : '') . ", México\n";
}
if (!empty($ss['businessPhone']))  echo "- Teléfono: " . $ss['businessPhone'] . "\n";
if (!empty($ss['whatsappNumber'])) echo "- WhatsApp: " . $ss['whatsappNumber'] . "\n";
if (!empty($ss['businessEmail']))  echo "- Correo: " . $ss['businessEmail'] . "\n";
if (!empty($ss['businessHours']))  echo "- Horario: " . $ss['businessHours'] . "\n";
echo "- Sitio: $BASE\n";
echo "- Zona de servicio: Aguascalientes y el Bajío; servicios entregables a todo México.\n\n";

echo "## Servicios\n\n";
foreach ($S as $s) {
    echo "### " . $s['title'] . "\n";
    echo $BASE . "/servicios/" . $s['slug'] . "\n\n";
    if ($s['short_desc']) echo $s['short_desc'] . "\n\n";
    $f = lineas($s['features']);
    if ($f) { echo "Incluye:\n"; foreach ($f as $x) echo "- $x\n"; echo "\n"; }
    $b = lineas($s['benefits']);
    if ($b) { echo "Beneficios:\n"; foreach ($b as $x) echo "- $x\n"; echo "\n"; }
}

echo "## Posicionamiento en inteligencia artificial (GEO)\n\n";
echo $BASE . "/servicios/posicionamiento-en-ia\n\n";
$gs = $geo['servicio'] ?? [];
for ($i = 1; $i <= 6; $i++) {
    if (empty($gs["s{$i}_t"])) continue;
    echo "- " . $gs["s{$i}_t"] . ": " . ($gs["s{$i}_d"] ?? '') . "\n";
}
echo "\n";

$faq = $geo['preguntas'] ?? [];
$hayFaq = false;
for ($i = 1; $i <= 12; $i++) {
    if (empty($faq["q$i"]) || empty($faq["r$i"])) continue;
    if (!$hayFaq) { echo "### Preguntas frecuentes sobre GEO\n\n"; $hayFaq = true; }
    echo "**" . $faq["q$i"] . "**\n" . $faq["r$i"] . "\n\n";
}

if ($P) {
    echo "## Casos de éxito\n\n";
    foreach ($P as $p) {
        echo "### " . $p['title'] . "\n";
        echo $BASE . "/portafolio/" . $p['slug'] . "\n";
        if ($p['client'])   echo "Cliente: " . $p['client'] . "\n";
        if ($p['category']) echo "Categoría: " . $p['category'] . "\n";
        if ($p['short_desc']) echo $p['short_desc'] . "\n";
        echo "\n";
    }
}

if ($Bl) {
    echo "## Artículos\n\n";
    foreach ($Bl as $b) {
        echo "### " . $b['title'] . "\n";
        echo $BASE . "/blog/" . $b['slug'] . "\n";
        if ($b['excerpt']) echo $b['excerpt'] . "\n";
        echo "\n";
    }
}

echo "## Cómo contactar\n\n";
echo "Por WhatsApp al " . ($ss['whatsappNumber'] ?? '') . ", por correo a " . ($ss['businessEmail'] ?? '')
   . ", o desde el formulario en $BASE/contacto\n";
