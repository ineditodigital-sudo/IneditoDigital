<?php
/**
 * Entrega la tarjeta de contacto de un integrante.
 *
 * Se llega aquí por /su-nombre.vcf, que .htaccess manda para acá. Esa es la
 * dirección que abre el botón "Guardar mi contacto", y también sirve para
 * grabarla directo en una tarjeta NFC si algún día se quiere que el chip
 * entregue el contacto sin abrir el navegador.
 */
declare(strict_types=1);

$cfg = require __DIR__ . '/api/config.php';
require __DIR__ . '/api/db.php';
require __DIR__ . '/panel/inc/miembros.php';
require __DIR__ . '/panel/inc/vcard.php';

$slug = preg_replace('/[^a-z0-9-]/', '', strtolower((string)($_GET['m'] ?? '')));

if ($slug === '') {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    exit("No encontramos ese contacto.\n");
}

try {
    $pdo = db_connect($cfg);
    $q = $pdo->prepare("SELECT contenido FROM pages WHERE slug = :s AND tipo = 'miembro' AND status = 'published'");
    $q->execute([':s' => $slug]);
    $crudo = $q->fetchColumn();
} catch (Throwable $ex) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    exit("No pudimos preparar el contacto en este momento.\n");
}

if ($crudo === false) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    exit("No encontramos ese contacto.\n");
}

$d = miembro_con_respaldo(json_decode((string)$crudo, true) ?: []);

$esquema = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = (string)($_SERVER['HTTP_HOST'] ?? 'www.inedito.digital');
$vcf = vcard_texto($d, $esquema . '://' . $host . '/' . $slug);

/* Android reconoce el contacto por el tipo del archivo, y los filtros que
   traen muchos celulares (sobre todo los de fábrica y los que no son Google)
   solo declaran el tipo viejo, text/x-vcard. Los Android modernos entienden
   los dos, así que mandarles el viejo no le quita nada a nadie. iOS sí quiere
   el tipo nuevo: con el viejo lo baja como archivo suelto en vez de ofrecer
   agregar el contacto. */
$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
$tipo = stripos($ua, 'android') !== false ? 'text/x-vcard' : 'text/vcard';
header('Content-Type: ' . $tipo . '; charset=utf-8');
header('Vary: User-Agent');
header('Content-Disposition: attachment; filename="' . vcard_archivo($d, $slug) . '"');
header('Content-Length: ' . strlen($vcf));
// Cinco minutos: suficiente para no rearmar la foto en cada toque, y poco
// para que un cambio publicado se note casi enseguida.
header('Cache-Control: public, max-age=300');
header('X-Content-Type-Options: nosniff');

echo $vcf;
