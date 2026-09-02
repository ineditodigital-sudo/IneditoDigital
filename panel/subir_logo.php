<?php
/**
 * Subida de logos de clientes.
 *
 * Recibe una imagen, comprueba que lo sea de verdad —no basta la extensión—,
 * le recorta el lienzo vacío que casi todos los logos traen, la lleva a 320 px
 * de alto y la guarda en WebP. Ese tamaño es el que necesita el carrusel (se
 * ve a 48 px) y evita que un logo de 450 KB entre a la portada.
 *
 * Solo PNG, JPEG y WebP: el SVG puede llevar scripts dentro y no vale la pena
 * el riesgo por un logo.
 */
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_login();
header('Content-Type: application/json; charset=utf-8');

const MAX_BYTES = 8 * 1024 * 1024;   // 8 MB de origen
const ALTO      = 320;               // se muestra a 48 px; 320 cubre pantallas densas
const CARPETA   = '/media/clientes';

function salir(array $d, int $code = 200): never {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code($code);
    echo json_encode($d, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') salir(['error' => 'Método no permitido.'], 405);
if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) salir(['error' => 'Sesión inválida. Recarga la página.'], 400);

$f = $_FILES['logo'] ?? null;
if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $motivos = [
        UPLOAD_ERR_INI_SIZE => 'El archivo es más grande de lo que admite el servidor.',
        UPLOAD_ERR_FORM_SIZE => 'El archivo es demasiado grande.',
        UPLOAD_ERR_PARTIAL => 'La subida se cortó a medias. Inténtalo otra vez.',
        UPLOAD_ERR_NO_FILE => 'No llegó ningún archivo.',
    ];
    salir(['error' => $motivos[$f['error'] ?? UPLOAD_ERR_NO_FILE] ?? 'No se pudo recibir el archivo.'], 400);
}
if ($f['size'] > MAX_BYTES) salir(['error' => 'La imagen pesa más de 8 MB. Usa una más ligera.'], 400);
if (!is_uploaded_file($f['tmp_name'])) salir(['error' => 'Archivo no válido.'], 400);

/* Que sea una imagen de verdad, no un archivo con extensión de imagen. */
$info = @getimagesize($f['tmp_name']);
if (!$info) salir(['error' => 'Ese archivo no es una imagen.'], 400);
[$ancho, $alto, $tipo] = $info;

$lectores = [
    IMAGETYPE_PNG  => 'imagecreatefrompng',
    IMAGETYPE_JPEG => 'imagecreatefromjpeg',
    IMAGETYPE_WEBP => 'imagecreatefromwebp',
];
if (!isset($lectores[$tipo])) salir(['error' => 'Solo se admiten PNG, JPG o WebP. El SVG no, por seguridad.'], 400);
if ($ancho < 40 || $alto < 20) salir(['error' => 'La imagen es demasiado pequeña para verse bien.'], 400);

$im = @$lectores[$tipo]($f['tmp_name']);
if (!$im) salir(['error' => 'No pudimos leer la imagen. Prueba a exportarla de nuevo.'], 400);

imagealphablending($im, false);
imagesavealpha($im, true);

/* Recorta el lienzo transparente sobrante: casi todos los logos traen aire
   alrededor y eso los deja pequeños al lado de los demás en el carrusel. */
$caja = null;
if (function_exists('imagecropauto')) {
    $rec = @imagecropauto($im, IMG_CROP_TRANSPARENT);
    if ($rec !== false) { imagedestroy($im); $im = $rec; }
}
$ancho = imagesx($im);
$alto  = imagesy($im);

$nuevoAlto  = min(ALTO, $alto);
$nuevoAncho = max(1, (int) round($ancho * $nuevoAlto / $alto));
$dst = imagecreatetruecolor($nuevoAncho, $nuevoAlto);
imagealphablending($dst, false);
imagesavealpha($dst, true);
imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127));
imagecopyresampled($dst, $im, 0, 0, 0, 0, $nuevoAncho, $nuevoAlto, $ancho, $alto);
imagedestroy($im);

$nombre = trim((string)($_POST['nombre'] ?? '')) ?: 'cliente';
$slug = slugify($nombre) ?: 'cliente';
$archivo = $slug . '-' . bin2hex(random_bytes(3)) . '.webp';

$dirAbs = dirname(__DIR__) . CARPETA;
if (!is_dir($dirAbs)) @mkdir($dirAbs, 0755, true);
if (!is_writable($dirAbs)) { imagedestroy($dst); salir(['error' => 'La carpeta de logos no admite escritura.'], 500); }

$ok = imagewebp($dst, $dirAbs . '/' . $archivo, 92);
imagedestroy($dst);
if (!$ok) salir(['error' => 'No se pudo guardar la imagen.'], 500);

salir([
    'url'    => CARPETA . '/' . $archivo,
    'ancho'  => $nuevoAncho,
    'alto'   => $nuevoAlto,
    'peso'   => filesize($dirAbs . '/' . $archivo),
]);
