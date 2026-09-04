<?php
/**
 * El titular del correo, dibujado con la Hanson.
 *
 * Un correo no puede cargar una tipografía. Gmail borra @font-face antes de
 * enseñar nada, así que la display de la marca no llega por CSS a ninguna
 * bandeja; poner Arial Black en su lugar no es un respaldo, es otra fuente.
 * La salida honesta es dibujarla aquí y mandarla como imagen.
 *
 * Solo el titular, y no por falta de ganas: si el mensaje y los datos también
 * fueran imagen, quien tiene las imágenes apagadas —Outlook de fábrica— abriría
 * un correo mudo. El nombre se repite en el alt y en el asunto, de modo que
 * bloquear las imágenes cuesta el gesto, nunca la información.
 *
 * La URL va firmada. Sin firma, cualquiera podría pedirle a este dominio que
 * le dibujara el texto que quisiera y colgar esas imágenes en otra parte con
 * el nombre de Inédito detrás.
 */
declare(strict_types=1);

const TITULO_FUENTE = __DIR__ . '/../panel/inc/reporte/Hanson-Bold.ttf';
const TITULO_CACHE  = __DIR__ . '/../media/titulos';
const TITULO_BASE   = 'https://www.inedito.digital';
const TITULO_FONDO  = '#101018';   // el mismo de la carta: la costura no se ve
const TITULO_TINTA  = '#FFFFFF';
const TITULO_MAX    = 90;          // caracteres

/** El secreto con el que se firma. Vacío si no hay configuración cargada. */
function titulo_secreto(): string
{
    $cfg = $GLOBALS['cfg'] ?? null;
    if (!is_array($cfg) && is_file(__DIR__ . '/config.php')) $cfg = require __DIR__ . '/config.php';
    return (string)($cfg['admin']['token_secret'] ?? '');
}

function titulo_firma(string $texto, int $ancho): string
{
    return substr(hash_hmac('sha256', $texto . '|' . $ancho, titulo_secreto()), 0, 16);
}

/**
 * Reparte el texto en renglones que quepan en $maxAncho.
 * Una palabra más larga que el renglón se queda sola y desborda: cortarla a la
 * mitad sería peor, porque son nombres de personas.
 */
function titulo_renglones(string $texto, int $px, int $maxAncho): array
{
    $palabras = preg_split('/\s+/u', trim($texto)) ?: [];
    $lineas = [];
    $actual = '';
    foreach ($palabras as $p) {
        $prueba = $actual === '' ? $p : $actual . ' ' . $p;
        $caja = @imagettfbbox($px, 0, TITULO_FUENTE, $prueba);
        if ($caja && ($caja[2] - $caja[0]) > $maxAncho && $actual !== '') {
            $lineas[] = $actual;
            $actual = $p;
        } else {
            $actual = $prueba;
        }
    }
    if ($actual !== '') $lineas[] = $actual;
    return $lineas;
}

/**
 * Dibuja el titular y devuelve la ruta del PNG, o null si no se pudo.
 * El archivo se guarda con el nombre del hash de su contenido, así que el mismo
 * nombre nunca se vuelve a dibujar y la URL se puede cachear para siempre.
 */
function titulo_render(string $texto, int $ancho): ?string
{
    if (!function_exists('imagettftext') || !is_file(TITULO_FUENTE)) return null;

    $texto = mb_substr(trim($texto), 0, TITULO_MAX);
    if ($texto === '') return null;
    $texto = mb_strtoupper($texto, 'UTF-8');   // la Hanson solo va en mayúsculas

    $archivo = TITULO_CACHE . '/' . sha1($texto . '|' . $ancho . '|v2') . '.png';
    if (is_file($archivo) && filesize($archivo) > 0) return $archivo;

    /* Se dibuja al doble para que no se vea pixeleada en pantallas densas. */
    $lienzo = $ancho * 2;
    $margen = 4;

    /* Del tamaño más grande hacia abajo hasta que quepa en tres renglones. Un
       nombre corto llena el ancho; uno largo baja de cuerpo en vez de partirse
       en cinco líneas que ya no leen como titular. */
    $lineas = [];
    $px = 0;
    foreach ([96, 86, 76, 68, 60, 54] as $tam) {
        $r = titulo_renglones($texto, $tam, $lienzo - $margen * 2);
        if (count($r) <= 3) { $px = $tam; $lineas = $r; break; }
    }
    if ($px === 0) { $px = 54; $lineas = titulo_renglones($texto, 54, $lienzo - $margen * 2); }

    /* La altura de las mayúsculas manda el interlineado: la Hanson no lleva
       bajos aquí, y medir por el alto nominal dejaría un hueco muerto abajo. */
    $cajaH = @imagettfbbox($px, 0, TITULO_FUENTE, 'H');
    if (!$cajaH) return null;
    $alto  = $cajaH[1] - $cajaH[7];
    $paso  = (int)round($alto * 1.2);
    $altoImg = $alto + $paso * (count($lineas) - 1) + $margen * 2;

    $im = imagecreatetruecolor($lienzo, $altoImg);
    if (!$im) return null;
    $rgb = static fn(string $h): array => [hexdec(substr($h,1,2)), hexdec(substr($h,3,2)), hexdec(substr($h,5,2))];
    [$fr,$fg,$fb] = $rgb(TITULO_FONDO);
    [$tr,$tg,$tb] = $rgb(TITULO_TINTA);
    imagefilledrectangle($im, 0, 0, $lienzo, $altoImg, imagecolorallocate($im, $fr, $fg, $fb));
    $tinta = imagecolorallocate($im, $tr, $tg, $tb);

    foreach ($lineas as $i => $linea) {
        imagettftext($im, $px, 0, $margen, $margen + $alto + $paso * $i, $tinta, TITULO_FUENTE, $linea);
    }

    if (!is_dir(TITULO_CACHE)) @mkdir(TITULO_CACHE, 0755, true);
    $ok = @imagepng($im, $archivo, 9);
    imagedestroy($im);
    return $ok ? $archivo : null;
}

/**
 * La etiqueta <img> lista para el correo, o cadena vacía si no se pudo dibujar.
 * Se dibuja aquí mismo, al armar el correo, para no mandar una imagen que
 * después no exista: si algo falla, quien llama vuelve al texto vivo.
 */
function titulo_imagen(string $texto, int $ancho): string
{
    $archivo = titulo_render($texto, $ancho);
    if ($archivo === null) return '';

    $tam = @getimagesize($archivo);
    if (!$tam) return '';
    $alto = (int)round($tam[1] / 2);

    $q = TITULO_BASE . '/api/titulo.php?t=' . rawurlencode($texto)
       . '&w=' . $ancho . '&s=' . titulo_firma($texto, $ancho);

    return '<img src="' . htmlspecialchars($q, ENT_QUOTES, 'UTF-8') . '"'
         /* Sin atributo width: en una tabla fluida volveria a fijar el ancho
            minimo y la carta no encogeria. El alto si va, para que el cliente
            reserve el hueco antes de descargar la imagen y no salte el texto. */
         . ' height="' . $alto . '"'
         . ' alt="' . htmlspecialchars(mb_strtoupper($texto, 'UTF-8'), ENT_QUOTES, 'UTF-8') . '"'
         /* Ancho relativo y no fijo: en un telefono la imagen tiene que poder
            encoger, o arrastra toda la tabla y saca la carta de la pantalla. */
         . ' style="display:block;width:100%;max-width:' . $ancho . 'px;height:auto;border:0;'
         . 'font:900 34px/1.05 Helvetica,Arial,sans-serif;color:#FFFFFF;">';
}

/* ------------------------------------------------------------------ endpoint
   Solo cuando se pide el archivo directamente. Incluido desde la plantilla,
   este bloque no corre. */
if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === realpath(__FILE__)) {
    $texto = (string)($_GET['t'] ?? '');
    $ancho = max(120, min(1200, (int)($_GET['w'] ?? 540)));
    $firma = (string)($_GET['s'] ?? '');

    if ($texto === '' || titulo_secreto() === '' || !hash_equals(titulo_firma($texto, $ancho), $firma)) {
        http_response_code(404);
        exit;
    }

    $archivo = titulo_render($texto, $ancho);
    if ($archivo === null) { http_response_code(404); exit; }

    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($archivo));
    /* El nombre del archivo sale del hash de su contenido: si el texto cambia,
       cambia la URL, así que esta puede guardarse para siempre. */
    header('Cache-Control: public, max-age=31536000, immutable');
    readfile($archivo);
}
