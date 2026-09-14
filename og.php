<?php
/**
 * La imagen que se ve al compartir un enlace. Una por página, dibujada aquí.
 *
 * Antes todas las páginas compartían el logotipo de la marca, y salía en
 * blanco en WhatsApp y Telegram por tres razones a la vez: era un WEBP —que
 * esos previsualizadores no pintan—, medía 2818x653 cuando esperan 1200x630,
 * y tenía fondo transparente, que sobre la tarjeta del chat se ve como un
 * rectángulo vacío. Tres motivos independientes para el mismo cuadro blanco.
 *
 * Se dibuja y no se guardan 30 PNG a mano porque los servicios, las entradas
 * del blog y el portafolio se editan desde el panel: un archivo por página se
 * queda viejo en cuanto el cliente cambia un título, y no existe para lo que
 * dé de alta mañana. Esto lee el título de la base y siempre va al día.
 *
 * NO acepta texto libre. Recibe una ruta, la busca en nuestros propios datos y
 * dibuja lo que encuentre. Si aceptara el texto por parámetro, cualquiera
 * podría poner lo que quisiera sobre una tarjeta con nuestra marca y
 * compartirla como si fuera nuestra, servida desde nuestro dominio.
 *
 * GD con FreeType ya se usaba en producción para el reporte quincenal en PDF
 * (panel/inc/reporte_pdf.php), así que la tipografía y el logotipo ya estaban
 * en el servidor. La paleta es la misma del sitio y la de ese reporte.
 */
declare(strict_types=1);

/* Se sube al cambiar el DIBUJO. La llave de la cache la lleva dentro, asi que
 * una tarjeta ya guardada con el diseño anterior deja de servirse sola. Sin
 * esto habria que entrar a borrar la carpeta a mano en cada retoque. */
const OG_VERSION = 2;

const OG_W = 1200;          // el tamaño que esperan todos los previsualizadores
const OG_H = 630;
const OG_FONDO = [0x07, 0x06, 0x0b];
const OG_PUR   = '#7700CE';
const OG_PUR2  = '#9933FF';
const OG_PUR3  = '#CC66FF';
const OG_BLANCO = '#FFFFFF';
const OG_TENUE  = '#8F8AA6';

/**
 * La Hanson que ya vive en el servidor para el reporte.
 *
 * Se puede apuntar a otra ruta con $GLOBALS['og_fuente'], igual que hace
 * reporte_pdf.php y por el mismo motivo: en Windows FreeType no abre rutas con
 * acentos, y la carpeta del proyecto se llama «INÉDITO». En el servidor la
 * ruta es ASCII y esto nunca entra.
 */
function og_fuente(): string
{
    return (string)($GLOBALS['og_fuente'] ?? __DIR__ . '/panel/inc/reporte/Hanson-Bold.ttf');
}

/** En GD la transparencia va de 0 (opaco) a 127 (invisible), no a 255. */
function og_color($im, string $hex, int $alfa = 0)
{
    $hex = ltrim($hex, '#');
    $alfa = max(0, min(127, $alfa));
    return imagecolorallocatealpha(
        $im,
        (int)hexdec(substr($hex, 0, 2)),
        (int)hexdec(substr($hex, 2, 2)),
        (int)hexdec(substr($hex, 4, 2)),
        $alfa
    );
}

/** El resplandor de la marca: círculos concéntricos cada vez más opacos. */
function og_resplandor($im, int $cx, int $cy, int $radio, string $hex, float $fuerza): void
{
    $pasos = 90;
    for ($i = $pasos; $i > 0; $i--) {
        $t = $i / $pasos;
        $a = (int)round(127 - (1 - $t) * (1 - $t) * (1 - $t) * 127 * $fuerza);
        if ($a >= 127) continue;
        $d = (int)($radio * 2 * $t);
        imagefilledellipse($im, $cx, $cy, $d, $d, og_color($im, $hex, $a));
    }
}

/** Lo que ocupa un texto a un tamaño dado. */
function og_ancho(string $t, float $px): int
{
    if ($t === '') return 0;
    $b = imagettfbbox($px, 0, og_fuente(), $t);
    return (int)abs($b[2] - $b[0]);
}

/** Parte en renglones que quepan, sin cortar palabras. */
function og_renglones(string $t, float $px, int $max): array
{
    $out = [];
    $linea = '';
    foreach (preg_split('/\s+/u', trim($t)) as $p) {
        $prueba = $linea === '' ? $p : $linea . ' ' . $p;
        if (og_ancho($prueba, $px) <= $max || $linea === '') {
            $linea = $prueba;
        } else {
            $out[] = $linea;
            $linea = $p;
        }
    }
    if ($linea !== '') $out[] = $linea;
    return $out;
}

/**
 * El tamaño más grande al que el título cabe en el hueco.
 *
 * Se prueba de mayor a menor en vez de calcularlo: Hanson tiene anchuras muy
 * dispares por letra y cualquier formula con un ancho medio se pasa o se queda
 * corta según la palabra. Probar es exacto y son treinta iteraciones.
 */
/** Lo que separa dos renglones. Con menos, las tildes del renglon de abajo
 *  chocan con el de arriba: Hanson tiene mayúsculas altas y la Ó acentuada
 *  sobresale bastante. */
const OG_INTERLINEA = 1.18;

function og_ajustar(string $t, int $anchoMax, int $altoMax, float $desde = 88.0, int $lineasMax = 4): array
{
    for ($px = $desde; $px >= 28; $px -= 2) {
        $r = og_renglones($t, $px, $anchoMax);
        if (count($r) > $lineasMax) continue;
        if (count($r) * $px * OG_INTERLINEA > $altoMax) continue;
        /* Y que cada renglon quepa de verdad. Contar renglones no basta:
           og_renglones() no parte palabras, asi que una sola palabra mas ancha
           que el hueco sale como un renglon —el conteo pasa— y se derrama por
           el borde. Es el mismo descuido que recortaba el h1 del sitio. */
        $cabe = true;
        foreach ($r as $l) { if (og_ancho($l, $px) > $anchoMax) { $cabe = false; break; } }
        if ($cabe) return [$px, $r];
    }
    /*
     * No cabe entero. Antes se encogia la letra hasta que entrara, y un titulo
     * largo de blog acababa en seis renglones a 36 px: eso ya no es un titulo,
     * es un parrafo, y en una miniatura no se lee ninguno de los seis.
     *
     * Asi que se usa el tamano mas grande que permiten los renglones que caben,
     * se corta y se dice que se corto. El titulo completo viaja igual en
     * og:title, que es el texto que el chat pinta debajo de la imagen.
     */
    $px = max(28.0, min($desde, floor($altoMax / ($lineasMax * OG_INTERLINEA))));
    /* Y que ninguna palabra suelta se salga a ese tamano. og_renglones() no
       parte palabras, asi que una mas ancha que el hueco sale en su propio
       renglon y se derrama; hay que bajar hasta que quepa. Es la tercera vez
       que este descuido muerde en este proyecto: contar sin medir el ancho. */
    $r = og_renglones($t, $px, $anchoMax);
    for (; $px > 20; $px -= 2) {
        $r = og_renglones($t, $px, $anchoMax);
        $cabe = true;
        foreach ($r as $l) { if (og_ancho($l, $px) > $anchoMax) { $cabe = false; break; } }
        if ($cabe) break;
    }
    if (count($r) > $lineasMax) {
        $r = array_slice($r, 0, $lineasMax);
        $ult = rtrim($r[$lineasMax - 1], " ,.;:") . '…';
        while (mb_strlen($ult) > 2 && og_ancho($ult, $px) > $anchoMax) {
            $ult = rtrim(mb_substr($ult, 0, mb_strlen($ult) - 2), ' ') . '…';
        }
        $r[$lineasMax - 1] = $ult;
    }
    return [$px, $r];
}

/* ------------------------------------------------------------------ */
/*  Qué página es                                                      */
/* ------------------------------------------------------------------ */

/**
 * De una ruta a [rótulo, título]. Solo de nuestros datos: lo que no esté aquí
 * se lleva la tarjeta genérica de la marca, nunca texto de quien llama.
 */
function og_pagina(string $ruta): array
{
    $ruta = '/' . trim(parse_url($ruta, PHP_URL_PATH) ?? '', '/');
    if ($ruta === '/') return ['Agencia digital', 'DIRECCIÓN COMERCIAL ASISTIDA POR IA'];

    $fijas = [
        '/servicios'   => ['Servicios', 'TODO LO QUE HACEMOS'],
        '/servicios-ia'=> ['Inteligencia artificial', 'IA QUE HACE CRECER TU NEGOCIO'],
        '/portafolio'  => ['Portafolio', 'TRABAJO PUBLICADO'],
        '/blog'        => ['Blog', 'LO QUE VAMOS APRENDIENDO'],
        '/nosotros'    => ['Nosotros', 'QUIÉNES SOMOS'],
        '/contacto'    => ['Contacto', 'HABLEMOS DE TU NEGOCIO'],
    ];
    if (isset($fijas[$ruta])) return $fijas[$ruta];

    /* Lo editable vive en la base. Sin conexión no se cae: se devuelve la
       tarjeta de la marca, que es mejor que una imagen rota. */
    try {
        $cfg = require __DIR__ . '/api/config.php';
        require_once __DIR__ . '/api/db.php';
        $pdo = db_connect($cfg);

        if (preg_match('~^/servicios/([a-z0-9-]+)$~', $ruta, $m)) {
            $st = $pdo->prepare("SELECT title, category FROM services WHERE slug = :s AND status='published' LIMIT 1");
            $st->execute([':s' => $m[1]]);
            if ($r = $st->fetch(PDO::FETCH_ASSOC)) {
                return [$r['category'] ?: 'Servicios', $r['title']];
            }
        }
        if (preg_match('~^/blog/([a-z0-9-]+)$~', $ruta, $m)) {
            $st = $pdo->prepare("SELECT title, category FROM blog_posts WHERE slug = :s AND status='published' LIMIT 1");
            $st->execute([':s' => $m[1]]);
            if ($r = $st->fetch(PDO::FETCH_ASSOC)) {
                return [$r['category'] ?: 'Blog', $r['title']];
            }
        }
        if (preg_match('~^/portafolio/([a-z0-9-]+)$~', $ruta, $m)) {
            $st = $pdo->prepare("SELECT title, category FROM portfolio WHERE slug = :s AND status='published' LIMIT 1");
            $st->execute([':s' => $m[1]]);
            if ($r = $st->fetch(PDO::FETCH_ASSOC)) {
                return [$r['category'] ?: 'Portafolio', $r['title']];
            }
        }
        /* Lo que vive en `pages`: las tarjetas de los integrantes y las
           paginas que arma el cliente por bloques. Se buscan por su ruta, que
           es la misma con la que render.php las encuentra.

           Las tarjetas de integrante importan especialmente: existen PARA
           compartirse —se abren acercando una tarjeta NFC a un telefono—, asi
           que salir con la tarjeta generica de la marca en vez de con el
           nombre de la persona seria fallar justo donde mas se usa. */
        $st = $pdo->prepare("SELECT nombre, tipo, contenido, seo_title
                             FROM pages WHERE ruta = :r AND status='published' LIMIT 1");
        $st->execute([':r' => $ruta]);
        if ($r = $st->fetch(PDO::FETCH_ASSOC)) {
            $c = json_decode((string)$r['contenido'], true);
            $c = is_array($c) ? $c : [];
            if ($r['tipo'] === 'miembro') {
                $nombre = trim((string)($c['nombre'] ?? $r['nombre']));
                $puesto = trim((string)($c['puesto'] ?? ''));
                if ($nombre !== '') return [$puesto !== '' ? $puesto : 'Contacto', $nombre];
            }
            $nombre = trim((string)$r['nombre']);
            if ($nombre !== '') return ['Inédito Digital', $nombre];
        }
    } catch (Throwable $e) {
        error_log('[og] ' . $e->getMessage());
    }

    return ['Agencia digital', 'INÉDITO DIGITAL'];
}

/* ------------------------------------------------------------------ */
/*  El dibujo                                                          */
/* ------------------------------------------------------------------ */

function og_dibujar(string $rotulo, string $titulo): string
{
    $im = imagecreatetruecolor(OG_W, OG_H);
    imagealphablending($im, true);
    imagefilledrectangle($im, 0, 0, OG_W, OG_H, imagecolorallocate($im, ...OG_FONDO));

    /* Los dos resplandores de la marca, como en el sitio. */
    og_resplandor($im, 1120, 40, 380, OG_PUR2, 0.22);
    og_resplandor($im, 40, 660, 320, OG_PUR, 0.20);

    /* La retícula de puntos, muy tenue. Es lo que hace que el fondo no sea
       un rectángulo plano sin que compita con el título. */
    $punto = og_color($im, '#9933FF', 112);
    for ($y = 24; $y < OG_H; $y += 34) {
        for ($x = 24; $x < OG_W; $x += 34) {
            imagefilledrectangle($im, $x, $y, $x + 1, $y + 1, $punto);
        }
    }

    /*
     * El area segura: el cuadrado del centro.
     *
     * WhatsApp no siempre pinta la tarjeta entera. En su formato compacto
     * recorta un CUADRADO del centro, y con el texto pegado al margen
     * izquierdo lo que sale es la mitad de una palabra. Asi que todo lo que
     * hay que leer vive dentro de esos 630x630 centrados y el resto es aire y
     * resplandor. En Facebook, LinkedIn o Telegram se ve la tarjeta completa y
     * el conjunto queda centrado, que es una composicion de toda la vida.
     */
    $seguro = OG_H;                       // 630: el lado del cuadrado
    $x0 = (int)((OG_W - $seguro) / 2);    // donde empieza
    $anchoSeguro = $seguro - 70;          // con margen dentro, que el texto
                                          // no toque el borde del recorte
    $centro = (int)(OG_W / 2);

    $M = 72;   // el margen del que cuelga todo

    /* El logotipo, arriba. Es el mismo PNG del reporte. */
    $logo = __DIR__ . '/panel/inc/reporte/logo.png';
    $yTexto = $M;
    if (is_file($logo) && ($src = @imagecreatefrompng($logo))) {
        $lw = imagesx($src); $lh = imagesy($src);
        $alto = 52;
        $ancho = (int)round($lw * $alto / $lh);
        imagecopyresampled($im, $src, $centro - (int)($ancho / 2), $M, 0, 0, $ancho, $alto, $lw, $lh);
        imagedestroy($src);
        $yTexto = $M + $alto;
    }

    /* El rótulo: la categoría, en mayúsculas y muy espaciada. GD no sabe de
       tracking, así que se dibuja letra a letra. */
    $rot = mb_strtoupper(trim($rotulo), 'UTF-8');
    if ($rot !== '') {
        $px = 18.0;
        $sep = 7;
        $letras = preg_split('//u', $rot, -1, PREG_SPLIT_NO_EMPTY);
        $total = 0;
        foreach ($letras as $ch) $total += og_ancho($ch, $px) + ($ch === ' ' ? 9 : $sep);
        $x = $centro - $total / 2;
        $y = $yTexto + 74;
        foreach ($letras as $ch) {
            imagettftext($im, $px, 0, (int)$x, (int)$y, og_color($im, OG_PUR3), og_fuente(), $ch);
            $x += og_ancho($ch, $px) + ($ch === ' ' ? 9 : $sep);
        }
        $yTexto = $y;
    }

    /* El título. Manda él: ocupa lo que le quede. */
    /* El titulo manda: ocupa el hueco que queda entre el rotulo y el filete de
       abajo, y se centra en el. Asi un titulo de una palabra no deja un vacio
       enorme debajo y uno de tres renglones no se come el filete. */
    $tit = mb_strtoupper(trim($titulo), 'UTF-8');
    $arriba = $yTexto + 34;
    $abajo  = OG_H - 92;
    [$px, $renglones] = og_ajustar($tit, $anchoSeguro, $abajo - $arriba, 74.0);

    $interlinea = $px * OG_INTERLINEA;
    $alto = count($renglones) * $interlinea;
    /* imagettftext dibuja desde la BASE, no desde arriba: hay que bajar una
       mayúscula con su acento para que el primer renglon empiece donde toca. */
    $y = $arriba + ($abajo - $arriba - $alto) / 2 + $px * 0.78;
    foreach ($renglones as $r) {
        $x = $centro - og_ancho($r, $px) / 2;
        imagettftext($im, $px, 0, (int)round($x), (int)round($y), og_color($im, OG_BLANCO), og_fuente(), $r);
        $y += $interlinea;
    }

    /* El filete y el dominio, abajo. Cierra la tarjeta y dice de dónde es. */
    imagefilledrectangle($im, $centro - 32, OG_H - 78, $centro + 32, OG_H - 75, og_color($im, OG_PUR3));
    $dom = 'inedito.digital';
    imagettftext($im, 16.0, 0, $centro - (int)(og_ancho($dom, 16.0) / 2), OG_H - 44,
                 og_color($im, OG_TENUE), og_fuente(), $dom);

    ob_start();
    imagepng($im, null, 6);
    $png = (string)ob_get_clean();
    imagedestroy($im);
    return $png;
}

/* ------------------------------------------------------------------ */
/*  La respuesta                                                       */
/* ------------------------------------------------------------------ */

/* Modo prueba: `php og.php /servicios/x salida.png`, para ver la tarjeta sin
   desplegar. Por la web nunca entra aquí. */
if (PHP_SAPI === 'cli') {
    $ruta = $argv[1] ?? '/';
    $dest = $argv[2] ?? 'og.png';
    /* El rotulo y el titulo sueltos son SOLO para esto: en el escritorio no hay
       base que consultar. Por la web no se llega aqui, asi que el texto de una
       tarjeta servida por el dominio sale siempre de nuestros datos. */
    [$rot, $tit] = isset($argv[4]) ? [$argv[3], $argv[4]] : og_pagina($ruta);
    file_put_contents($dest, og_dibujar($rot, $tit));
    fwrite(STDOUT, "$dest · $rot · $tit\n");
    exit;
}

$ruta = (string)($_GET['p'] ?? '/');
if (strlen($ruta) > 200) $ruta = '/';

[$rot, $tit] = og_pagina($ruta);

/* Caché en disco: un rastreador pide esto muchas veces y dibujar cuesta. La
   llave lleva el título, así que si el cliente lo cambia en el panel la
   imagen se rehace sola. Si la carpeta no se puede escribir, se dibuja y ya:
   vale más una imagen lenta que ninguna. */
$dir = __DIR__ . '/cache-og';
$llave = $dir . '/' . md5(OG_VERSION . '|' . $rot . '|' . $tit) . '.png';
$png = null;
if (is_file($llave)) {
    $png = @file_get_contents($llave);
}
if ($png === null || $png === false || $png === '') {
    $png = og_dibujar($rot, $tit);
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    if (is_dir($dir) && is_writable($dir)) @file_put_contents($llave, $png);
}

header('Content-Type: image/png');
header('Content-Length: ' . strlen($png));
header('Cache-Control: public, max-age=86400');
header('X-Content-Type-Options: nosniff');
echo $png;
