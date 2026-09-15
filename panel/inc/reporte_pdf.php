<?php
/**
 * El reporte quincenal, como presentación.
 *
 * Qué se quitó y por qué
 * ----------------------
 * La primera versión repetía en cada lámina una barra morada arriba, una
 * retícula de puntos, un resplandor, un rótulo con guion, un filete bajo el
 * título y un pie con la marca y la fecha. Nada de eso decía nada: la fecha
 * ya está en la portada y la marca también. Ocho láminas con el mismo
 * andamio hacen que todas parezcan la misma, que es lo que pasa cuando el
 * adorno sustituye a la jerarquía.
 *
 * Ahora el adorno vive solo donde tiene sentido —portada, cierre— y las
 * láminas de datos son casi negras y sin marco. Lo que las distingue es el
 * número de sección en Hanson y lo que traen dentro.
 *
 * El orden también cambió: primero la conclusión, después los números. Quien
 * abre un reporte quiere saber si está mejor o peor; las tablas sirven para
 * comprobarlo, no para deducirlo. Cada sección abre con una o dos frases
 * (`reporte_resumenes`) y el reporte cierra diciendo dónde está la empresa
 * (`reporte_estatus`), que es la pregunta de fondo.
 *
 * Cada lámina se arma en dos capas: GD dibuja lo que es imagen —degradados,
 * Hanson, barras, filetes— y entra como un JPEG de fondo; encima, el PDF
 * pone el texto de verdad, para que las cifras se puedan seleccionar y
 * buscar. Ver panel/inc/pdf.php.
 */
declare(strict_types=1);

require_once __DIR__ . '/pdf.php';

/* --- la paleta, la misma del panel y del sitio --- */
const R_FONDO  = [0x07, 0x07, 0x0b];
const R_LINEA  = '#22222F';
const R_LINEA2 = '#33334A';
const R_TXT    = '#F4F2F8';
const R_SUAVE  = '#CFC8DC';
const R_MUT    = '#928EA6';
const R_MUT2   = '#67637C';
const R_PUR    = '#7700CE';
const R_PUR2   = '#9933FF';
const R_PUR3   = '#CC66FF';
const R_VERDE  = '#00E585';
const R_AMBAR  = '#FFB454';
const R_ROJO   = '#FF7D9C';

/** Cuántos píxeles por punto dibuja GD. Dos basta para que no se vea el pixel. */
const R_ESCALA = 2;

/** El margen del que cuelga todo. Una sola medida, repetida en cada lámina. */
const R_M = 64.0;

/**
 * La Hanson de los títulos.
 *
 * Se puede apuntar a otra ruta con $GLOBALS['reporte_fuente']: en Windows,
 * FreeType no abre rutas con acentos, y la carpeta del proyecto los tiene.
 * En el servidor la ruta es ASCII y nunca hace falta.
 */
function r_fuente(): string
{
    return (string)($GLOBALS['reporte_fuente'] ?? __DIR__ . '/reporte/Hanson-Bold.ttf');
}

/* ------------------------------------------------------------------ */
/*  Lienzo                                                            */
/* ------------------------------------------------------------------ */

/** @return GdImage */
function r_lienzo()
{
    $w = (int)(Pdf::ANCHO * R_ESCALA); $h = (int)(Pdf::ALTO * R_ESCALA);
    $im = imagecreatetruecolor($w, $h);
    imagealphablending($im, true);
    imagefilledrectangle($im, 0, 0, $w, $h, imagecolorallocate($im, ...R_FONDO));
    return $im;
}

/** En GD la transparencia va de 0 (opaco) a 127 (invisible), no a 255. */
function r_color($im, string $hex, int $alfa = 0)
{
    $hex = ltrim($hex, '#');
    $alfa = max(0, min(127, $alfa));
    return imagecolorallocatealpha($im, (int)hexdec(substr($hex,0,2)), (int)hexdec(substr($hex,2,2)), (int)hexdec(substr($hex,4,2)), $alfa);
}

/**
 * El resplandor morado de la marca. Solo en portada, cierre y la lámina de
 * conclusiones.
 *
 * Se dibuja por anillos concéntricos y no píxel a píxel: un degradado real
 * sobre 1920×1080 son dos millones de llamadas y el cron tiene prisa. Con
 * pocos anillos se ven los bordes y deja de parecer luz, de ahí los ciento
 * diez pasos y la caída cúbica.
 */
function r_resplandor($im, float $cx, float $cy, float $radio, string $hex = R_PUR, float $fuerza = 0.55): void
{
    $cx *= R_ESCALA; $cy *= R_ESCALA; $radio *= R_ESCALA;
    $pasos = 110;
    for ($i = $pasos; $i > 0; $i--) {
        $t = $i / $pasos;
        $a = (int)round(127 - (1 - $t) * (1 - $t) * (1 - $t) * 127 * $fuerza);
        if ($a >= 127) continue;
        imagefilledellipse($im, (int)$cx, (int)$cy, (int)($radio * 2 * $t), (int)($radio * 2 * $t), r_color($im, $hex, $a));
    }
}

/** La retícula de puntos del sitio. Portada y cierre, nada más. */
function r_reticula($im, int $paso = 24, int $alfa = 118): void
{
    $c = r_color($im, '#FFFFFF', $alfa);
    for ($i = 0; $i < Pdf::ANCHO; $i += $paso)
        for ($j = 0; $j < Pdf::ALTO; $j += $paso)
            imagefilledellipse($im, (int)($i * R_ESCALA), (int)($j * R_ESCALA), R_ESCALA, R_ESCALA, $c);
}

/** Un rectángulo en unidades de diseño. */
function r_caja($im, float $x, float $y, float $w, float $h, string $hex, int $alfa = 0): void
{
    imagefilledrectangle($im, (int)round($x*R_ESCALA), (int)round($y*R_ESCALA),
        (int)round(($x+$w)*R_ESCALA), (int)round(($y+$h)*R_ESCALA), r_color($im, $hex, $alfa));
}

/** El filete que separa bloques. Un pelo, no una raya. */
function r_filete($im, float $x, float $y, float $w, string $hex = R_LINEA): void
{
    r_caja($im, $x, $y, $w, 0.7, $hex);
}

/** Una barra con el degradado de la casa, de morado oscuro a claro. */
function r_degradado($im, float $x, float $y, float $w, float $h, bool $vertical = false): void
{
    $n = max(1, (int)round(($vertical ? $h : $w) * R_ESCALA));
    for ($i = 0; $i < $n; $i++) {
        $t = $i / max(1, $n - 1);
        $c = imagecolorallocate($im,
            (int)(0x77 + (0xCC - 0x77) * $t),
            (int)(0x00 + (0x66 - 0x00) * $t),
            (int)(0xCE + (0xFF - 0xCE) * $t));
        if ($vertical) imagefilledrectangle($im, (int)($x*R_ESCALA), (int)(($y+$h)*R_ESCALA)-$i-1, (int)(($x+$w)*R_ESCALA), (int)(($y+$h)*R_ESCALA)-$i, $c);
        else           imagefilledrectangle($im, (int)($x*R_ESCALA)+$i, (int)($y*R_ESCALA), (int)($x*R_ESCALA)+$i+1, (int)(($y+$h)*R_ESCALA), $c);
    }
}

/**
 * Hanson, siempre en mayúsculas: es la regla de la marca y además la fuente
 * está pensada para eso. `$y` es la línea base, en unidades de diseño.
 */
function r_hanson($im, string $txt, float $x, float $y, float $tam, string $hex = R_TXT,
                  string $alineado = 'izq', int $alfa = 0): float
{
    $txt = mb_strtoupper(trim($txt), 'UTF-8');
    if ($txt === '') return 0;
    $px = $tam * R_ESCALA;
    $caja = imagettfbbox($px, 0, r_fuente(), $txt);
    $w = ($caja[2] - $caja[0]) / R_ESCALA;
    $x0 = $x;
    if ($alineado === 'centro') $x0 = $x - $w / 2;
    elseif ($alineado === 'der') $x0 = $x - $w;
    imagettftext($im, $px, 0, (int)round($x0 * R_ESCALA), (int)round($y * R_ESCALA), r_color($im, $hex, $alfa), r_fuente(), $txt);
    return $w;
}

/**
 * El logotipo de la casa.
 *
 * Va grande en la portada y pequeño al pie de cada lámina, donde antes había
 * un renglón con el nombre y la fecha repetidos. Un logotipo dice lo mismo
 * ocupando una sexta parte, y la fecha ya está en la portada.
 *
 * Devuelve el alto que ocupó, en puntos, para poder apoyar lo de abajo.
 */
function r_logo($im, float $x, float $y, float $ancho): float
{
    $ruta = __DIR__ . '/reporte/logo.png';
    if (!is_readable($ruta)) return 0.0;
    $src = @imagecreatefrompng($ruta);
    if (!$src) return 0.0;
    $sw = imagesx($src); $sh = imagesy($src);
    $w = (int)round($ancho * R_ESCALA);
    $h = (int)round($w * $sh / $sw);
    imagealphablending($im, true);
    imagecopyresampled($im, $src, (int)round($x * R_ESCALA), (int)round($y * R_ESCALA), 0, 0, $w, $h, $sw, $sh);
    imagedestroy($src);
    return $ancho * $sh / $sw;
}

function r_jpeg($im, int $calidad = 86): string
{
    ob_start(); imagejpeg($im, null, $calidad); $b = (string)ob_get_clean();
    imagedestroy($im);
    return $b;
}

/* ------------------------------------------------------------------ */
/*  El andamio de una lámina de datos                                 */
/* ------------------------------------------------------------------ */

/**
 * Encabezado: número de sección y título en la misma línea, la conclusión
 * debajo y un filete. Sin rótulo con guion ni barra de color arriba: el
 * número en morado ya dice en qué parte del reporte estás.
 *
 * Devuelve la `y` donde empieza el contenido.
 */
function r_seccion($im, Pdf $pdf, string $num, string $titulo, string $resumen): float
{
    $anchoNum = r_hanson($im, $num, R_M, 82, 26, R_PUR3);
    r_hanson($im, $titulo, R_M + $anchoNum + 18, 82, 26, R_TXT);

    $y = 118;
    if (trim($resumen) !== '') {
        $y = $pdf->parrafo(R_M, $y, 730, $resumen, 12.5, false, R_SUAVE, 1.5, 2);
        $y += 6;
    }
    r_filete($im, R_M, $y, Pdf::ANCHO - R_M * 2);
    return $y + 30;
}

/** El pie: el logotipo a la izquierda y el número de lámina a la derecha. */
function r_folio($im, Pdf $pdf, int $n, int $total): void
{
    r_logo($im, R_M, Pdf::ALTO - 38, 74);
    $pdf->texto(Pdf::ANCHO - R_M, Pdf::ALTO - 26, $n . ' / ' . $total, 8, false, R_MUT2, 'der');
}

/**
 * Una cifra suelta: número grande, rótulo en minúsculas debajo y, si hay, la
 * variación. Sin recuadro: el recuadro no aporta y multiplica bordes.
 */
function r_cifra($im, Pdf $pdf, float $x, float $y, string $valor, string $rotulo,
                 ?array $delta = null, bool $menosEsMejor = false, string $nota = '', float $tam = 34): void
{
    $pdf->texto($x, $y, $valor, $tam, true, R_TXT);
    $pdf->texto($x, $y + 18, $rotulo, 9.5, false, R_MUT);
    if ($delta !== null && $delta['pct'] !== null) {
        $bueno = $menosEsMejor ? $delta['signo'] < 0 : $delta['signo'] > 0;
        $txt = $delta['signo'] === 0
            ? 'igual que antes'
            : (($delta['signo'] > 0 ? '+' : '') . $delta['pct'] . '% vs. quincena anterior');
        $pdf->texto($x, $y + 34, $txt, 8.5, false, $delta['signo'] === 0 ? R_MUT2 : ($bueno ? R_VERDE : R_AMBAR));
    } elseif ($nota !== '') {
        $pdf->texto($x, $y + 34, $nota, 8.5, false, R_MUT2);
    }
}

/* ------------------------------------------------------------------ */
/*  Las láminas                                                       */
/* ------------------------------------------------------------------ */

function reporte_pdf(array $d): string
{
    /* Sin la tipografía de la marca no hay reporte: mejor fallar aquí que
       entregar nueve láminas sin un solo título. */
    if (!is_readable(r_fuente())) {
        throw new RuntimeException('Falta la tipografía del reporte: ' . r_fuente());
    }

    $pdf = new Pdf();
    $per = reporte_fecha_larga($d['periodo']['desde']) . ' — ' . reporte_fecha_larga($d['periodo']['hasta']);
    $pdf->titulo = 'Reporte de resultados · ' . $d['periodo']['desde'] . ' a ' . $d['periodo']['hasta'];

    $cmp  = $d['comparacion'] ?? null;
    $hall = $d['hallazgos'] ?? ['logros' => [], 'alertas' => [], 'recomendaciones' => []];
    /* Los reportes guardados antes de que existieran estos dos bloques se
       siguen abriendo: se calculan al vuelo desde la misma foto. */
    $res  = $d['resumenes'] ?? reporte_resumenes($d, null);
    $est  = $d['estatus']   ?? reporte_estatus($d);

    /*
     * El número de sección lo reparte un contador, no se escribe a mano.
     *
     * Iba escrito dentro de cada función, y basta con que una lámina no se
     * dibuje —el balance y las recomendaciones son condicionales— para que la
     * numeración salte. Ya pasó: al añadir «En corto» había dos láminas 09.
     */
    $seccion = 0;
    $num = function () use (&$seccion) { return sprintf('%02d', ++$seccion); };

    /*
     * El orden cuenta una historia, no recorre las tablas de la base.
     *
     *   1. la portada
     *   2. el titular      qué pasó, en una cifra
     *   3. el recorrido    la cadena entera, de aparecer a que te escriban
     *   4-8. el detalle    por qué de cada escalón
     *   9-10. el juicio    qué está bien, qué atender, qué hacer
     *   11. en corto       todo lo anterior en palabras
     *   12. dónde estás
     */
    $laminas = [
        fn($n, $t) => r_portada($pdf, $d, $per),
        fn($n, $t) => r_titular($pdf, $d, $cmp, $est, $hall, $num(), $n, $t),
        fn($n, $t) => r_recorrido($pdf, $d, $num(), $n, $t),
        fn($n, $t) => r_visitas($pdf, $d, $cmp, $res, $num(), $n, $t),
        /* «A qué entran» va pegada a «Las visitas»: es la misma pregunta
           —quién vino— contestada por el otro lado, qué miraron. */
        fn($n, $t) => r_paginas($pdf, $d, $num(), $n, $t),
        fn($n, $t) => r_buscador($pdf, $d, $cmp, $res, $num(), $n, $t),
        fn($n, $t) => r_palabras($pdf, $d, $res, $num(), $n, $t),
        fn($n, $t) => r_ia($pdf, $d, $cmp, $res, $num(), $n, $t),
        fn($n, $t) => r_embudo($pdf, $d, $res, $num(), $n, $t),
    ];
    if ($hall['logros'] || $hall['alertas']) $laminas[] = fn($n, $t) => r_balance($pdf, $hall, $num(), $n, $t);
    if ($hall['recomendaciones'])            $laminas[] = fn($n, $t) => r_recomendaciones($pdf, $hall['recomendaciones'], $num(), $n, $t);
    /* «En corto» va justo antes del cierre: después de los números y antes
       del escalón en el que está cada cosa. */
    $laminas[] = fn($n, $t) => r_en_corto($pdf, $d, $res, $est, $num(), $n, $t);
    $laminas[] = fn($n, $t) => r_estatus($pdf, $d, $est, $num(), $n, $t);

    $total = count($laminas);
    foreach ($laminas as $i => $hacer) $hacer($i + 1, $total);
    return $pdf->salida();
}

/* --- portada --- */
function r_portada(Pdf $pdf, array $d, string $per): void
{
    $pdf->pagina();
    $im = r_lienzo();
    r_resplandor($im, 1010, 150, 620, R_PUR, 0.72);
    r_resplandor($im, 120, 640, 460, R_PUR3, 0.42);
    r_reticula($im, 24, 118);
    r_caja($im, 0, 0, Pdf::ANCHO, 4, R_PUR2);

    r_logo($im, 84, 118, 188);
    r_caja($im, 84, 184, 44, 3, R_PUR3);
    r_hanson($im, 'Reporte de', 84, 262, 56);
    r_hanson($im, 'resultados', 84, 330, 56, R_PUR3);
    r_degradado($im, 84, 402, 300, 2);

    $pdf->fondo(r_jpeg($im, 90), (int)(Pdf::ANCHO * R_ESCALA), (int)(Pdf::ALTO * R_ESCALA));
    $pdf->texto(84, 386, $per, 13.5, false, R_TXT);
    $pdf->texto(84, 432, 'Sitio, buscadores y asistentes de IA', 11, false, R_SUAVE);
    $pdf->texto(84, Pdf::ALTO - 40, 'Generado el ' . reporte_fecha_larga(substr((string)$d['generado'], 0, 10)), 8.5, false, '#A79CB8');
    $pdf->texto(Pdf::ANCHO - 84, Pdf::ALTO - 40, 'inedito.digital', 9, true, '#CFC6DC', 'der', 1.2);
}

/* --- 01 · el titular --- */
/*
 * Una cifra manda y las demás la acompañan.
 *
 * Antes eran cuatro cifras del mismo tamaño en fila: apariciones, personas,
 * lecturas de IA y prospectos, con la misma tipografía y el mismo peso. Una
 * lámina donde todo pesa igual no dice nada, y quien la abre no sabe adónde
 * mirar primero.
 *
 * De esas cuatro, tres son medios y una es el resultado: los prospectos. Lo
 * demás —que te vean, que entren, que las IA te lean— existe para llegar
 * ahí. Así que los prospectos van en grande, en la Hanson de la marca, y las
 * otras tres se quedan a un lado en su tamaño de apoyo.
 */
function r_titular(Pdf $pdf, array $d, ?array $cmp, array $est, array $hall, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    /*
     * Sin resplandor. Se probó y se quitó.
     *
     * Una mancha morada detrás de la cifra llegaba hasta los hallazgos de
     * abajo y les comía el contraste; al encogerla dejaba de molestar y
     * también de aportar. Con el número a 108 pt en la Hanson de la marca,
     * la lámina ya tiene jerarquía de sobra: la luz solo era adorno, y el
     * adorno que no hace nada es lo primero que sobra.
     *
     * El resplandor se queda donde sí dice algo: portada, «en corto» y el
     * cierre, que son las tres láminas que no son de datos.
     */
    $y = r_seccion($im, $pdf, $num, 'El titular', $est['frase']);

    $v = $d['visitas']; $b = $d['buscador']; $ia = $d['ia']; $e = $d['embudo'];

    /* --- la cifra que manda --- */
    $leads = (int)$e['leads'];
    $alto = r_hanson($im, (string)$leads, R_M, $y + 96, 108, R_TXT);
    $pdf->texto(R_M, $y + 126, $leads === 1 ? 'prospecto en la quincena' : 'prospectos en la quincena',
                12, true, R_SUAVE);
    $dl = $cmp['leads'] ?? null;
    if ($dl && !empty($dl['hay'])) {
        $signo = $dl['signo'] > 0 ? '▲' : ($dl['signo'] < 0 ? '▼' : '=');
        $txt = $dl['pct'] !== null
            ? $signo . ' ' . abs($dl['pct']) . '% contra la quincena pasada'
            : $signo . ' ' . number_format(abs($dl['abs'])) . ' contra la quincena pasada';
        $pdf->texto(R_M, $y + 146, $txt, 9.5, false, $dl['signo'] >= 0 ? R_VERDE : R_AMBAR);
    }

    /* --- las tres que la sostienen, a un lado y en su sitio --- */
    $bx = R_M + max(360.0, $alto + 150);
    $apoyo = [
        [number_format($b['impresiones']), 'veces te mostró Google',  $cmp['impresiones'] ?? null],
        [number_format($v['personas']),    'personas entraron',       $cmp['personas'] ?? null],
        [number_format($ia['lecturas']),   'lecturas de motores de IA', $cmp['ia'] ?? null],
    ];
    foreach ($apoyo as $i => [$val, $rot, $del]) {
        $py = $y + 18 + $i * 52;
        r_caja($im, $bx - 20, $py - 12, 2, 34, R_LINEA2);
        $pdf->texto($bx, $py + 4, $val, 21, true, R_TXT);
        $pdf->texto($bx + $pdf->ancho($val, 21, true) + 10, $py + 4, $rot, 10, false, R_MUT);
        if ($del && !empty($del['hay']) && $del['pct'] !== null) {
            $pdf->texto(Pdf::ANCHO - R_M, $py + 4,
                ($del['signo'] > 0 ? '▲ ' : '▼ ') . abs($del['pct']) . '%', 9.5, true,
                $del['signo'] >= 0 ? R_VERDE : R_AMBAR, 'der');
        }
    }

    /* Lo mejor, lo peor y lo primero: una línea cada uno, para que la lámina
       se pueda leer en diez segundos. */
    $y += 176;
    r_filete($im, R_M, $y, Pdf::ANCHO - R_M * 2);
    $y += 40;

    $pares = [];
    if ($hall['logros'])          $pares[] = ['Lo mejor de la quincena', $hall['logros'][0]['titulo'],  R_VERDE];
    if ($hall['alertas'])         $pares[] = ['Lo que hay que atender',  $hall['alertas'][0]['titulo'], R_AMBAR];
    if ($hall['recomendaciones']) $pares[] = ['Por dónde empezar',       $hall['recomendaciones'][0]['titulo'], R_PUR3];

    /* Se reparten en el alto que queda en vez de quedarse arriba: tres
       puntos apretados dejaban media lamina en blanco. */
    $paso = $pares ? min(72.0, (Pdf::ALTO - 56 - $y) / count($pares)) : 0.0;
    foreach ($pares as $i => [$rot, $txt, $color]) {
        $py = $y + $i * $paso;
        r_caja($im, R_M, $py - 11, 2.5, 32, $color);
        $pdf->texto(R_M + 16, $py, $rot, 8.5, true, R_MUT, 'izq', 1.2);
        $pdf->texto(R_M + 16, $py + 18, $txt, 13, true, R_TXT);
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 02 · las visitas --- */
function r_visitas(Pdf $pdf, array $d, ?array $cmp, array $res, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'Las visitas', $res['visitas'] ?? '');
    $v = $d['visitas'];
    $gw = Pdf::ANCHO - R_M * 2;

    /* La forma de la quincena, día a día.
       112 pt cuando esta lámina llevaba además las páginas más vistas; ahora
       que aquello tiene lámina propia, la gráfica se queda con el sitio que
       le sobraba a la de al lado y las diferencias entre días se notan. */
    $gh = 168;
    $serie = array_values($v['por_dia']);
    $fechas = array_keys($v['por_dia']);
    $max = max(1, max($serie ?: [1]));
    $nb = max(1, count($serie));
    $bw = $gw / $nb;
    $pdf->texto(R_M, $y - 10, 'Páginas vistas por día', 9, false, R_MUT);
    /*
     * Una línea de referencia arriba, con su cifra.
     *
     * Antes la gráfica solo decía el máximo en un rótulo suelto a la derecha:
     * se veía la forma de la quincena pero no se podía leer ningún día, ni
     * saber contra qué se compara la barra más alta. La línea y su número son
     * la escala; sin eso esto es un adorno con aspecto de dato.
     */
    r_filete($im, R_M, $y, $gw, R_LINEA);
    $pdf->texto(Pdf::ANCHO - R_M, $y - 10, number_format($max) . ' máx.', 9, false, R_MUT2, 'der');
    $iMax = array_search($max, $serie, true);
    foreach ($serie as $i => $val) {
        $hh = $val / $max * $gh;
        $bx = R_M + $i * $bw + $bw * 0.18;
        $bwR = $bw * 0.64;
        /* Barra plana y no degradada: el degradado no codificaba nada —son
           todas la misma serie— y hacía que se leyeran como dibujo en vez de
           como medida. El día más alto va en el morado claro; los demás, en
           el de marca. La única diferencia de color dice algo. */
        if ($hh >= 1) r_caja($im, $bx, $y + ($gh - $hh), $bwR, $hh, $i === $iMax ? R_PUR3 : R_PUR2);
        else r_caja($im, $bx, $y + $gh - 1, $bwR, 1, R_LINEA2);
    }
    r_filete($im, R_M, $y + $gh + 1, $gw, R_LINEA2);
    if ($fechas) {
        $pdf->texto(R_M, $y + $gh + 16, r_dia($fechas[0]), 8.5, false, R_MUT2);
        $pdf->texto(Pdf::ANCHO - R_M, $y + $gh + 16, r_dia((string)end($fechas)), 8.5, false, R_MUT2, 'der');
    }

    /* De dónde llegan, en una sola barra repartida: seis barras de progreso
       ocupaban media lámina para decir lo mismo. */
    $y += $gh + 50;
    $tot = max(1, array_sum($v['fuentes']));
    /* Cada fuente lleva SIEMPRE el mismo color, no el que le toque por su
       tamaño: si el verde cambia de dueño entre una quincena y otra, la
       gráfica engaña. El verde es del buscador, que es el tráfico que se
       gana; el interno va en gris porque es navegación propia. */
    /* Ninguna fuente usa el verde, el ámbar ni el rosa: esos tres son JUICIO
       —va bien, hay que atender, va mal— y aparecen así en el balance, en las
       posiciones y en el estatus. Antes el verde era «buscador» aquí y «va
       bien» tres láminas después, y el ámbar era «redes» aquí y «hay que
       atender» allá. Quien aprendía la leyenda en esta lámina llegaba a la
       siguiente con el significado cambiado. Un color, un oficio. */
    $fuentes = [
        'organic'  => ['Buscador',         '#B24BFF'],
        'directo'  => ['Directo',          '#6E4BFF'],
        'ia'       => ['Asistentes de IA', '#00A8E8'],
        'referral' => ['Otros sitios',     '#7C8AF0'],
        'social'   => ['Redes',            '#D08BFF'],
        'email'    => ['Correo',           '#8A93C7'],
        'internal' => ['Interno',          '#3B3752'],
    ];
    $pdf->texto(R_M, $y, 'De dónde llegan', 9, false, R_MUT);
    $bx = R_M; $leyenda = [];
    /* En el orden del mapa, no por volumen: así la barra se lee igual cada
       quincena aunque cambien las proporciones. */
    foreach ($fuentes as $k => [$rot, $color]) {
        $c = (int)($v['fuentes'][$k] ?? 0);
        if ($c === 0) continue;
        $w = $gw * $c / $tot;
        r_caja($im, $bx, $y + 10, max(1.0, $w), 13, $color);
        $leyenda[] = [$rot, (int)round($c / $tot * 100), $color];
        $bx += $w;
    }
    foreach ($v['fuentes'] as $k => $c) {   // cualquier origen que no esté en el mapa
        if (isset($fuentes[$k]) || $c === 0) continue;
        $w = $gw * $c / $tot;
        r_caja($im, $bx, $y + 10, max(1.0, $w), 13, '#2F2F49');
        $leyenda[] = [ucfirst((string)$k), (int)round($c / $tot * 100), '#2F2F49'];
        $bx += $w;
    }
    $lx = R_M;
    foreach ($leyenda as [$rot, $pct, $color]) {
        $etq = $rot . ' · ' . $pct . '%';
        r_caja($im, $lx, $y + 41, 7, 7, $color);
        $pdf->texto($lx + 12, $y + 47, $etq, 9, false, R_SUAVE);
        $lx += $pdf->ancho($etq, 9) + 40;
    }

    /* «Las páginas más vistas» ya NO vive aquí: tiene lámina propia.
       Estaba metida al pie, en dos columnas de texto, sin barra con la que
       comparar y con las rutas cortadas. Era el dato más accionable de la
       lámina —a qué entra la gente— y el que menos sitio tenía. */

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 03 · el buscador --- */
function r_buscador(Pdf $pdf, array $d, ?array $cmp, array $res, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'El buscador', $res['buscador'] ?? '');
    $b = $d['buscador'];
    $gw = Pdf::ANCHO - R_M * 2;

    if (!$b['fecha']) {
        $pdf->texto(R_M, $y + 46, 'Sin datos en este periodo', 20, true, R_TXT);
        $pdf->parrafo(R_M, $y + 74, 660,
            'La sincronización diaria con Search Console es la que permite comparar una quincena con la anterior. Se instala como tarea programada en el hosting.',
            11, false, R_MUT);
        r_folio($im, $pdf, $n, $t); r_cerrar($pdf, $im); return;
    }

    $cifras = [
        [number_format($b['impresiones']), 'veces que apareciste',   $cmp['impresiones'] ?? null, false, ''],
        [number_format($b['clics']),       'personas que entraron',  $cmp['clics'] ?? null,       false, ''],
        [$b['ctr'] . '%',                  'de cada 100 que te ven', null,                        false, 'entran al sitio'],
        [(string)$b['posicion'],           'puesto promedio',        $cmp['posicion'] ?? null,    true,  'la 1ª página acaba en 10'],
    ];
    $paso = $gw / 4;
    foreach ($cifras as $i => [$val, $rot, $del, $inv, $nota]) {
        if ($i > 0) r_caja($im, R_M + $i * $paso - 22, $y - 26, 0.7, 70, R_LINEA);
        r_cifra($im, $pdf, R_M + $i * $paso, $y, $val, $rot, $del, $inv, $nota, 34);
    }

    /* Las búsquedas, sin recuadro: bastan el filete del encabezado y el
       espacio entre renglones. */
    $y += 84;
    r_filete($im, R_M, $y, $gw);
    $y += 26;
    $cols = [R_M, R_M + 560, R_M + 662, R_M + 762];
    foreach ([['Búsqueda', 'izq'], ['Apariciones', 'der'], ['Entradas', 'der'], ['Puesto', 'der']] as $i => [$h, $al])
        $pdf->texto($i === 0 ? $cols[0] : $cols[$i] + 70, $y, $h, 8.5, false, R_MUT2, $al);
    r_filete($im, R_M, $y + 8, $gw);

    $alto = Pdf::ALTO - $y - 46;
    $cabe = max(1, (int)(($alto - 26) / 20));
    $filas = array_slice($b['consultas'], 0, $cabe);
    foreach ($filas as $i => $c) {
        $fy = $y + 28 + $i * 20;
        /* Las de la segunda página con demanda son la oportunidad del mes.
           Se marcan con un punto y el texto en blanco, no con una banda de
           color: una banda por fila convierte la tabla en un semáforo. */
        $cerca = $c['posicion'] > 10 && $c['posicion'] <= 20 && $c['impresiones'] >= 15;
        if ($cerca) r_caja($im, R_M - 13, $fy - 5, 4, 4, R_PUR3);
        $pdf->texto($cols[0], $fy, r_recorta($c['consulta'], 60), 9.5, false, $cerca ? R_TXT : R_SUAVE);
        $pdf->texto($cols[1] + 70, $fy, number_format($c['impresiones']), 9.5, false, R_MUT, 'der');
        $pdf->texto($cols[2] + 70, $fy, (string)$c['clics'], 9.5, false, $c['clics'] > 0 ? R_VERDE : R_MUT2, 'der');
        $pdf->texto($cols[3] + 70, $fy, (string)$c['posicion'], 9.5, true, $cerca ? R_PUR3 : R_MUT, 'der');
    }
    $marcadas = count(array_filter($filas, fn($c) => $c['posicion'] > 10 && $c['posicion'] <= 20 && $c['impresiones'] >= 15));
    $pdf->texto(R_M, $y + 28 + count($filas) * 20 + 8,
        'Las ' . count($filas) . ' con más apariciones de ' . count($b['consultas'])
        . ($marcadas ? '. Con punto: entre el puesto 11 y el 20 con demanda real, las que menos esfuerzo piden para llegar a la primera página.' : '.'),
        8, false, R_MUT2);

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}


/* --- 04 · las palabras clave --- */
function r_palabras(Pdf $pdf, array $d, array $res, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'Las palabras clave', $res['palabras'] ?? '');
    $pal = $d['palabras'] ?? ['temas' => [], 'declaradas' => 0, 'midiendo' => 0, 'sin_aparecer' => [], 'cuantas_sin' => 0];
    $gw = Pdf::ANCHO - R_M * 2;
    $cw = $gw * 0.56;

    /* Por tema y no consulta por consulta: ciento veintisiete renglones no
       caben ni se leen, y lo que importa es en qué terreno vas bien. */
    $pdf->texto(R_M, $y, 'Por dónde te encuentran', 9, false, R_MUT);
    $pdf->texto(R_M + $cw, $y, 'puesto medio', 9, false, R_MUT, 'der');
    $max = 1;
    foreach ($pal['temas'] as $tm) $max = max($max, (int)$tm['impresiones']);

    /* El paso se calcula con el alto que queda: con siete temas la ultima
       fila se metia debajo del logotipo del pie. */
    /* «Otras busquedas» es el cajon de lo que no encaja, no un tema: en la
       grafica ocupaba un renglon y no se puede hacer nada con el. Se
       menciona al pie y ya. */
    $otras = null;
    $lista = [];
    foreach ($pal['temas'] as $tm) {
        if ($tm['nombre'] === 'Otras búsquedas') { $otras = $tm; continue; }
        $lista[] = $tm;
    }
    $lista = array_slice($lista, 0, 6);
    $paso = $lista ? min(44.0, (Pdf::ALTO - 58 - ($y + 30)) / count($lista)) : 44.0;
    $fy = $y + 30;
    foreach ($lista as $tm) {
        /* El color dice a qué distancia estás: verde dentro de la primera
           página, ámbar en la segunda, rojo más allá. */
        $pos = (float)$tm['posicion'];
        $color = $pos <= 10 ? R_VERDE : ($pos <= 20 ? R_AMBAR : R_ROJO);
        $pdf->texto(R_M, $fy, $tm['nombre'], 10.5, true, R_TXT);
        $pdf->texto(R_M + $cw, $fy, (string)$tm['posicion'], 10.5, true, $color, 'der');
        r_caja($im, R_M, $fy + 7, $cw, 3, R_LINEA);
        r_caja($im, R_M, $fy + 7, max(2.0, $cw * $tm['impresiones'] / $max), 3, $color);
        $pdf->texto(R_M, $fy + 22, $tm['n'] . ($tm['n'] === 1 ? ' búsqueda · ' : ' búsquedas · ')
            . number_format((int)$tm['impresiones']) . ' apariciones'
            . ($tm['clics'] > 0 ? ' · ' . $tm['clics'] . ' entradas' : ''), 8.5, false, R_MUT2);
        $fy += $paso;
    }
    /* La columna derecha reutiliza $fy: donde acaban las barras se guarda
       aqui, o la nota de abajo cae en mitad de la lista. */
    $finTemas = $fy;

    /* Las que se trabajan y todavía no aparecen: es la otra mitad de la
       pregunta, y sin ella el bloque solo cuenta lo que ya salió bien. */
    $x2 = R_M + $cw + 56;
    $pdf->texto($x2, $y, 'Se trabajan y aún no aparecen', 9, false, R_MUT);
    $fy = $y + 30;
    foreach (array_slice($pal['sin_aparecer'], 0, 9) as $p) {
        r_caja($im, $x2, $fy - 3.5, 3, 3, R_LINEA2);
        $pdf->texto($x2 + 12, $fy, r_recorta($p, 46), 9.5, false, R_SUAVE);
        $fy += 19;
    }
    if ($pal['cuantas_sin'] > 9) {
        $pdf->texto($x2 + 12, $fy + 4, 'y ' . ($pal['cuantas_sin'] - 9) . ' más', 8.5, false, R_MUT2);
    }
    if ($otras) {
        /* Justo debajo de la ultima barra, no en una altura fija: con seis
           temas o con tres la nota tiene que caer siempre igual de cerca. */
        $pdf->texto(R_M, $finTemas + 4, 'Otras ' . $otras['n'] . ' búsquedas sueltas suman '
            . number_format((int)$otras['impresiones']) . ' apariciones más, sin un tema común.', 8.5, false, R_MUT2);
    }
    $pdf->texto($x2, Pdf::ALTO - 92, 'De las ' . $pal['declaradas'] . ' que declara el sitio,', 8.5, false, R_MUT2);
    $pdf->texto($x2, Pdf::ALTO - 78, $pal['cuantas_sin'] . ' no tienen ni una aparición todavía.', 8.5, false, R_MUT2);

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 05 · los asistentes de IA --- */
function r_ia(Pdf $pdf, array $d, ?array $cmp, array $res, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'Los asistentes de IA', $res['ia'] ?? '');
    $ia = $d['ia'];
    $gw = Pdf::ANCHO - R_M * 2;

    $cifras = [
        [number_format($ia['lecturas']), 'lecturas de bots', $cmp['ia'] ?? null, false, ''],
        [count($ia['motores']) . ' de ' . count(REPORTE_MOTORES), 'motores que te leen', null, false, 'de los que sabemos reconocer'],
        [number_format($ia['visitas']), 'visitas desde un asistente', null, false, 'personas, no bots'],
    ];
    $paso = $gw / 3;
    foreach ($cifras as $i => [$val, $rot, $del, $inv, $nota]) {
        if ($i > 0) r_caja($im, R_M + $i * $paso - 24, $y - 26, 0.7, 70, R_LINEA);
        r_cifra($im, $pdf, R_M + $i * $paso, $y, $val, $rot, $del, $inv, $nota, 34);
    }

    $y += 84;
    r_filete($im, R_M, $y, $gw);
    $y += 26;

    $cw = $gw / 2 - 26;
    $pdf->texto(R_M, $y, 'Cuánto te lee cada motor', 9, false, R_MUT);
    $max = max(1, max($ia['motores'] ?: [1]));
    $fy = $y + 28;
    foreach (array_slice($ia['motores'], 0, 7, true) as $bot => $c) {
        $pdf->texto(R_M, $fy, REPORTE_MOTORES[$bot] ?? $bot, 9.5, false, R_SUAVE);
        $pdf->texto(R_M + $cw, $fy, number_format($c), 9.5, true, R_TXT, 'der');
        r_caja($im, R_M, $fy + 6, $cw, 3, R_LINEA);
        r_degradado($im, R_M, $fy + 6, max(2.0, $cw * $c / $max), 3);
        $fy += 27;
    }

    $x2 = R_M + $gw / 2 + 26;
    $pdf->texto($x2, $y, 'Las páginas que más leen', 9, false, R_MUT);
    $fy = $y + 28;
    foreach (array_slice($ia['urls'], 0, 7) as $u) {
        $pdf->texto($x2, $fy, r_recorta($u['url'], 36), 9.5, false, R_SUAVE);
        $pdf->texto(Pdf::ANCHO - R_M, $fy, number_format($u['n']), 9.5, true, R_TXT, 'der');
        $pdf->texto($x2, $fy + 12, $u['motores'] . ' motor' . ($u['motores'] === 1 ? '' : 'es'), 8, false, R_MUT2);
        $fy += 27;
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 06 · el embudo --- */
function r_embudo(Pdf $pdf, array $d, array $res, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'De la visita al cliente', $res['embudo'] ?? '');
    $v = $d['visitas']; $e = $d['embudo'];
    $gw = Pdf::ANCHO - R_M * 2;

    $pasos = [
        ['Entraron al sitio', $v['personas'], 'abrieron al menos una página'],
        ['Hicieron algo',     $e['personas'], 'tocaron WhatsApp, el teléfono o el asistente'],
        ['Dejaron sus datos', $e['leads'],    'enviaron el formulario'],
    ];
    $max = max(1, $v['personas']);
    $alto = 66;
    foreach ($pasos as $i => [$rot, $val, $nota]) {
        $py = $y + $i * ($alto + 24);
        $w = $val > 0 ? max(160.0, $gw * ($val / $max)) : 0.0;
        /* El paso vacío se insinúa con dos filetes, no con un relleno gris:
           un cero merece verse como un cero. */
        r_filete($im, R_M, $py, $gw);
        r_filete($im, R_M, $py + $alto, $gw);
        if ($w > 0) r_degradado($im, R_M, $py, $w, $alto);
        else r_caja($im, R_M, $py, 2.5, $alto, R_LINEA2);

        $pdf->texto(R_M + 20, $py + 28, $rot, 13, true, $val > 0 ? R_TXT : R_MUT);
        $pdf->texto(R_M + 20, $py + 47, $nota, 9, false, $val > 0 ? '#EADCFA' : R_MUT2);
        $pdf->texto(Pdf::ANCHO - R_M - 20, $py + 42, number_format($val), 30, true, $val > 0 ? R_TXT : R_MUT2, 'der');
        if ($i > 0 && $pasos[$i - 1][1] > 0 && $val > 0) {
            $pdf->texto(Pdf::ANCHO - R_M - 20, $py + 58, round($val / $pasos[$i - 1][1] * 100, 1) . '% del paso anterior', 8, false, '#EADCFA', 'der');
        }
    }

    if ($e['por_tipo']) {
        $nombres = ['whatsapp'=>'WhatsApp', 'telefono'=>'teléfono', 'asistente'=>'asistente', 'cotizar'=>'cotizar'];
        $partes = [];
        foreach ($e['por_tipo'] as $k => $c) $partes[] = ($nombres[$k] ?? $k) . ' (' . $c . ')';
        $pdf->texto(R_M, Pdf::ALTO - 52, 'Reparto de las acciones: ' . implode(' · ', $partes), 9, false, R_MUT);
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/**
 * A qué entra la gente.
 *
 * Esto vivía al pie de «Las visitas», en dos columnas de texto, con la ruta
 * cortada con puntos suspensivos y la cifra a la derecha. Tres problemas a la
 * vez: no había con qué comparar 121 contra 58 —son números sueltos, no una
 * magnitud—, el orden zigzagueaba entre columnas así que no se podía leer el
 * ranking de un vistazo, y la ruta más larga era justo la que se cortaba.
 *
 * Y es el dato más accionable del reporte: dice a qué entra la gente de
 * verdad, que es lo que decide qué página se trabaja la quincena que viene.
 * Tenía el peor sitio de la lámina.
 *
 * Ahora: una lista sola, ordenada de mayor a menor, con la barra que permite
 * comparar de un golpe, el porcentaje del total y la ruta entera.
 */
function r_paginas(Pdf $pdf, array $d, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $v = $d['paginas_vistas'] ?? $d['visitas']['paginas'] ?? [];
    $total = max(1, (int)($d['visitas']['total'] ?? array_sum(array_column($v, 'n'))));

    /* Se ordena aquí y no se da por hecho.
       La consulta del panel ya trae ORDER BY, pero esta lámina se dibuja
       también desde reportes CONGELADOS hace meses, y basta con que una foto
       vieja venga en otro orden para que el ranking salga descolocado y la
       frase de arriba nombre la página equivocada. Ordenar cuesta una línea. */
    usort($v, fn($a, $b) => (int)$b['n'] <=> (int)$a['n']);

    $primera = $v[0]['path'] ?? '';
    /* El porcentaje se limita a 100: si una foto vieja trae las cuentas
       descuadradas, es mejor un 100 % raro que un 109160 % imposible. */
    $pctPrimera = min(100.0, ($v[0]['n'] ?? 0) / $total * 100);
    $y = r_seccion($im, $pdf, $num, 'A qué entran',
        $v ? 'De las ' . number_format($total) . ' páginas que se vieron, «' . $primera . '» se lleva '
             . round($pctPrimera) . ' de cada 100. El resto reparte lo que queda.'
           : 'Todavía no hay páginas registradas en el periodo.');

    $gw = Pdf::ANCHO - R_M * 2;
    if (!$v) { r_folio($im, $pdf, $n, $t); r_cerrar($pdf, $im); return; }

    /* Ocho y no seis: caben, y la séptima y la octava son justo las que dicen
       si algo nuevo está empezando a moverse. */
    $lista = array_slice($v, 0, 8);
    $max = max(1, max(array_column($lista, 'n')));

    /* La ruta ocupa su columna, la barra la suya y las cifras la última. Con
       columnas fijas las tres se leen en vertical: se puede recorrer solo la
       de la barra para ver el ranking, o solo la de la cifra para los datos. */
    $colRuta = 330.0;
    $colCifra = 130.0;
    $anchoBarra = $gw - $colRuta - $colCifra - 30;
    /* Los renglones se reparten el alto disponible en vez de quedarse
       apretados arriba: con cinco páginas, un paso fijo dejaba media lámina
       vacía debajo. El tope evita que con dos se separen tanto que dejen de
       leerse como una lista. */
    $paso = min(62.0, (Pdf::ALTO - 76 - $y) / max(1, count($lista)));

    foreach ($lista as $i => $pg) {
        $py = $y + $i * $paso;
        $ruta = (string)$pg['path'];
        $cuenta = (int)$pg['n'];
        $pct = min(100.0, $cuenta / $total * 100);

        /* La ruta entera si cabe; si no, se recorta por el MEDIO. Cortar por
           el final se come el nombre del servicio, que es lo que identifica
           la página: «/servicios/tarjetas-de-presen…» no dice cuál es. */
        /* La primera fila va en negrita, que es MAS ANCHA que la redonda: si
           se mide el recorte sin decirlo, la ruta mas larga se mete dentro de
           la barra. Pasa justo en la fila que mas se mira. */
        $destacada = $i === 0;
        $pdf->texto(R_M, $py + 4, r_ruta_corta($pdf, $ruta, $colRuta - 16, 10.5, $destacada),
                    10.5, $destacada, $destacada ? R_TXT : R_SUAVE);

        $bw = max(2.0, $anchoBarra * $cuenta / $max);
        r_caja($im, R_M + $colRuta, $py - 4, $anchoBarra, 12, R_LINEA);
        r_caja($im, R_M + $colRuta, $py - 4, $bw, 12, $i === 0 ? R_PUR3 : R_PUR2);

        $pdf->texto(Pdf::ANCHO - R_M - 54, $py + 4, number_format($cuenta), 11, true, R_TXT, 'der');
        $pdf->texto(Pdf::ANCHO - R_M, $py + 4, round($pct) . '%', 9.5, false, R_MUT2, 'der');
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/**
 * Una ruta que cabe en el ancho dado, recortada por el MEDIO.
 *
 * `/servicios/tarjetas-de-presentacion-digital-nfc` cortada por el final
 * queda en `/servicios/tarjetas-de-presen…`, que no dice de qué servicio
 * habla. Lo que identifica una página está al principio —la sección— y al
 * final —el nombre—; lo prescindible está en medio.
 */
function r_ruta_corta(Pdf $pdf, string $ruta, float $ancho, float $tam, bool $negrita = false): string
{
    if ($pdf->ancho($ruta, $tam, $negrita) <= $ancho) return $ruta;
    $n = mb_strlen($ruta);
    for ($quita = 1; $quita < $n - 8; $quita++) {
        $izq = (int)ceil(($n - $quita) * 0.42);
        $der = $n - $quita - $izq;
        $corta = mb_substr($ruta, 0, $izq) . '…' . mb_substr($ruta, -$der);
        if ($pdf->ancho($corta, $tam, $negrita) <= $ancho) return $corta;
    }
    return mb_substr($ruta, 0, 8) . '…';
}

/**
 * El recorrido: todo el negocio en una lámina.
 *
 * El reporte contaba esto en cuatro láminas separadas —buscador, visitas,
 * embudo, IA—, que es el orden en que están las tablas en la base, no el
 * orden en que ocurre. Quien lo lee tiene que ir juntando en la cabeza que
 * las apariciones de la lámina 3 y los prospectos de la lámina 6 son los dos
 * extremos de la misma cadena.
 *
 * Aquí se ve entera y de un vistazo: cuánta gente hay en cada escalón y qué
 * porcentaje sobrevive al siguiente. El escalón donde más se cae es dónde
 * está el trabajo de la quincena que viene.
 *
 * Son DOS cadenas y no una, a propósito. Encadenar «1,179 apariciones → 160
 * personas» sería mentir: la mayoría de esas 160 no vino de Google, llegó
 * escribiendo la dirección. Se dibujan por separado y se dice en medio
 * cuántas pasaron de una a la otra.
 */
function r_recorrido(Pdf $pdf, array $d, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'El recorrido',
        'Cada escalón se queda con una parte. Donde más se cae es donde está el trabajo.');

    $v = $d['visitas']; $b = $d['buscador']; $e = $d['embudo'];
    $gw = Pdf::ANCHO - R_M * 2;

    /*
     * La barra de cada escalón mide el porcentaje QUE SOBREVIVE del escalón
     * anterior, no su valor absoluto. Con valores absolutos, 1,179 contra 3
     * son cuatrocientos a uno: el último escalón sería un pelo invisible y
     * justo ese es el que importa. Lo que se quiere leer aquí no es cuánto
     * hay, es cuánto se pierde.
     */
    $cadena = function (float $x, float $ancho, string $rotulo, array $pasos) use ($im, $pdf, &$y) {
        $pdf->texto($x, $y, $rotulo, 9, true, R_MUT, 'izq', 1.4);
        $py = $y + 34;
        $previo = null;
        foreach ($pasos as $i => [$valor, $etiqueta]) {
            $pct = $previo === null || $previo <= 0 ? 1.0 : min(1.0, $valor / $previo);

            /* La caída, entre escalón y escalón */
            if ($previo !== null) {
                $porcentaje = $previo > 0 ? round($valor / $previo * 100, 1) : 0.0;
                $sobra = 100 - $porcentaje;
                $pdf->texto($x + 26, $py - 13,
                    'pasa el ' . rtrim(rtrim(number_format($porcentaje, 1), '0'), '.') . '%'
                    . ($sobra > 0 ? '  ·  se pierde el ' . rtrim(rtrim(number_format($sobra, 1), '0'), '.') . '%' : ''),
                    8.5, false, R_MUT2);
                /* El bajante: une los dos escalones para que se lean como
                   uno detrás de otro y no como cifras sueltas. */
                r_caja($im, $x + 9, $py - 26, 1.5, 22, R_LINEA2);
            }

            $bw = max(3.0, $ancho * $pct);
            r_caja($im, $x, $py + 22, $ancho, 10, R_LINEA);
            r_caja($im, $x, $py + 22, $bw, 10, $i === count($pasos) - 1 ? R_PUR3 : R_PUR2);

            $pdf->texto($x, $py + 12, number_format($valor), 24, true, R_TXT);
            $pdf->texto($x + $pdf->ancho(number_format($valor), 24, true) + 10, $py + 12,
                        $etiqueta, 10, false, R_SUAVE);

            $previo = (float)$valor;
            $py += 78;
        }
        return $py;
    };

    $col = $gw / 2 - 40;
    $izq = $cadena(R_M, $col, 'EN GOOGLE', [
        [(int)$b['impresiones'], 'veces apareciste'],
        [(int)$b['clics'],       'entraron desde ahí'],
    ]);
    $der = $cadena(R_M + $gw / 2 + 40, $col, 'YA DENTRO DEL SITIO', [
        [(int)$v['personas'],  'personas entraron'],
        [(int)$e['personas'],  'hicieron algo'],
        [(int)$e['leads'],     'dejaron sus datos'],
    ]);

    /* La costura entre las dos cadenas, dicha y no dibujada: es la frase que
       evita leer esto como un embudo único, que sería falso. */
    $org = (int)($v['fuentes']['organic'] ?? 0);
    $otros = max(0, (int)$v['personas'] - (int)$b['clics']);
    $abajo = max($izq, $der) + 6;
    r_filete($im, R_M, $abajo, $gw);
    $pdf->parrafo(R_M, $abajo + 24, $gw,
        'Las dos cadenas no son una sola: de las ' . number_format((int)$v['personas'])
        . ' personas que entraron, ' . number_format((int)$b['clics']) . ' llegaron desde Google y las otras '
        . number_format($otros) . ' escribieron la dirección o vinieron por otra vía. '
        . 'Por eso el buscador se mide aparte: ahí se gana gente nueva, y en el sitio se decide si se queda.',
        9.5, false, R_MUT, 1.5, 2);

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 07 · el balance --- */
function r_balance(Pdf $pdf, array $hall, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'El balance', '');
    $gw = Pdf::ANCHO - R_M * 2;
    $cw = $gw / 2 - 30;

    /* Dos columnas en vez de dos láminas: lado a lado se leen como un
       balance; separadas parecían dos listas sin relación. */
    $cols = [
        [R_M,                'Va bien',         R_VERDE, array_slice($hall['logros'], 0, 4)],
        [R_M + $gw / 2 + 30, 'Hay que atender', R_AMBAR, array_slice($hall['alertas'], 0, 4)],
    ];

    /*
     * Cuando hay poco que decir, el bloque baja hasta el centro.
     *
     * Una quincena con un logro y una alerta dejaba dos párrafos arriba y
     * media lámina en negro debajo: se lee como una página a medio hacer, no
     * como un balance corto. Se mide lo que de verdad ocupa la columna más
     * alta y se reparte el sobrante mitad arriba, mitad abajo, con un tope
     * para que una lámina llena no se mueva de sitio.
     */
    $altoMax = 0.0;
    foreach ($cols as [, , , $items]) {
        if (!$items) continue;
        $aireCol = count($items) >= 4 ? 14.0 : 26.0;
        $h = 0.0;
        foreach ($items as $it) {
            $h += $pdf->lineas($it['titulo'], $cw, 11.5, true, 2) * 11.5 * 1.25;
            $h += 4 + $pdf->lineas($it['texto'], $cw, 9.5, false, 3) * 9.5 * 1.4;
            if (!empty($it['lista']) && count($items) <= 2) $h += 6 + min(6, count($it['lista'])) * 17;
            $h += $aireCol;
        }
        $altoMax = max($altoMax, $h);
    }
    $sobra = (Pdf::ALTO - 70) - ($y + 30 + $altoMax);
    $y += max(0.0, min(70.0, $sobra / 2));

    foreach ($cols as [$x, $rot, $color, $items]) {
        r_caja($im, $x, $y - 18, 26, 2.5, $color);
        $pdf->texto($x, $y - 2, $rot, 9, true, $color, 'izq', 1.4);
        $fy = $y + 30;
        if (!$items) {
            $pdf->texto($x, $fy, 'Nada que señalar en esta quincena.', 10, false, R_MUT2);
            continue;
        }
        /* El hueco entre puntos crece cuando hay pocos: cuatro apretados
           arriba y media lamina vacia abajo se ve como un descuido. */
        $aire = count($items) >= 4 ? 14.0 : 26.0;
        foreach ($items as $it) {
            /* El titulo se parte al ancho de SU columna.
               Iba con texto(), que no mide nada: un titulo largo —«Sales en la
               primera pagina de Google y practicamente nadie entra al sitio»—
               se pasaba 13 pt del margen derecho de la lamina, y mucho antes
               ya se habia metido en la columna de al lado. Medido con el
               auditor de geometria, no a ojo. */
            $fy = $pdf->parrafo($x, $fy, $cw, $it['titulo'], 11.5, true, R_TXT, 1.25, 2);
            $fy = $pdf->parrafo($x, $fy + 4, $cw, $it['texto'], 9.5, false, R_MUT, 1.4, 3);
            /* El desglose, cuando el hallazgo lo trae: son los datos que lo
               sostienen y evitan que haya que creerse el titular. */
            if (!empty($it['lista']) && count($items) <= 2) {
                $fy += 6;
                foreach (array_slice($it['lista'], 0, 6) as $ln) {
                    r_caja($im, $x, $fy - 3.5, 3, 3, R_LINEA2);
                    $pdf->texto($x + 11, $fy, $ln, 9, false, R_MUT2);
                    $fy += 17;
                }
            }
            $fy += $aire;
        }
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 08 · qué hacer --- */
function r_recomendaciones(Pdf $pdf, array $reco, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, $num, 'Qué hacer ahora', 'En orden: arriba está lo que más mueve con menos esfuerzo.');
    $gw = Pdf::ANCHO - R_M * 2;

    $reco = array_slice($reco, 0, 4);
    $alto = min(90.0, (Pdf::ALTO - $y - 50) / max(1, count($reco)));
    foreach ($reco as $i => $r) {
        $py = $y + $i * $alto;
        if ($i > 0) r_filete($im, R_M, $py - 16, $gw);
        r_hanson($im, (string)($i + 1), R_M, $py + 20, 24, R_PUR3);
        /* El titulo se corta antes de llegar a la etiqueta de prioridad, que
           vive pegada al margen derecho. Iba sin medir, asi que un titulo
           largo se le montaba encima. Una sola linea a proposito: si no cabe
           en una linea no es un titulo, es la descripcion de debajo. */
        $etq = ['1' => 'Ahora', '2' => 'Después', '3' => 'Cuando se pueda'][(string)$r['prioridad']] ?? '';
        $anchoEtq = $etq === '' ? 0 : $pdf->ancho($etq, 8.5, true) + 8.5 * 1.2 + 24;
        $pdf->parrafo(R_M + 46, $py + 14, $gw - 46 - $anchoEtq, $r['titulo'], 13.5, true, R_TXT, 1.2, 1);
        $pdf->texto(Pdf::ANCHO - R_M, $py + 14, $etq, 8.5, true, $r['prioridad'] === 1 ? R_PUR3 : R_MUT2, 'der', 1.2);
        $yy = $pdf->parrafo(R_M + 46, $py + 34, $gw - 160, $r['texto'], 9.5, false, R_MUT, 1.4, 2);
        if (!empty($r['lista'])) {
            $pdf->parrafo(R_M + 46, $yy + 3, $gw - 160,
                implode('   ·   ', array_slice($r['lista'], 0, 2)), 8.5, false, R_MUT2, 1.3, 1);
        }
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 09 · dónde está Inédito --- */
/**
 * En corto: el reporte entero contado sin una sola cifra suelta.
 *
 * Las ocho láminas anteriores están llenas de números, y esa es su función.
 * Pero quien abre esto entre dos juntas no necesita los números: necesita
 * saber en qué quedó. Esta lámina reúne la lectura que ya encabeza cada
 * sección —la misma frase, sin reescribirla— para que se pueda entender el
 * reporte completo leyendo una sola página.
 *
 * No repite la de «Dónde está Inédito», que va después: aquella dice en qué
 * escalón está cada cosa, y esta dice qué pasó en la quincena.
 */
function r_en_corto(Pdf $pdf, array $d, array $res, array $est, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    r_resplandor($im, 120, 640, 460, R_PUR3, 0.34);
    $gw = Pdf::ANCHO - R_M * 2;

    $anchoNum = r_hanson($im, $num, R_M, 82, 26, R_PUR3);
    r_hanson($im, 'En corto', R_M + $anchoNum + 18, 82, 26, R_TXT);
    $y = 118;
    $y = $pdf->parrafo(R_M, $y, 730, $est['frase'] ?? '', 12.5, false, R_SUAVE, 1.5, 2);
    r_filete($im, R_M, $y + 6, $gw);
    $y += 36;

    /* En el mismo orden y con el mismo número que las láminas, para poder
       volver a la que interese sin buscarla. */
    $partes = [
        ['02', 'Las visitas',          $res['visitas']  ?? ''],
        ['03', 'El buscador',          $res['buscador'] ?? ''],
        ['04', 'Las palabras clave',   $res['palabras'] ?? ''],
        ['05', 'Los asistentes de IA', $res['ia']       ?? ''],
        ['06', 'De la visita al cliente', $res['embudo'] ?? ''],
    ];
    $partes = array_values(array_filter($partes, fn($p) => trim($p[2]) !== ''));

    /*
     * La medida: 560 pt y no el ancho entero.
     *
     * A todo lo ancho, cada renglón pasaba de 140 caracteres y el ojo se
     * pierde al volver: la línea es tan larga que cuesta encontrar dónde
     * empieza la siguiente. Aquí caben unos 85, que para un párrafo de tres
     * renglones se lee de corrido. El hueco que queda a la derecha no es
     * desperdicio, es el margen que hace legible la columna.
     */
    $medida = 560.0;

    /* Cada bloque ocupa lo que necesita y el aire se reparte entre lo que
       sobra, en vez de dar el mismo alto a todas: «los asistentes de IA» son
       una línea y «las palabras clave» tres, y con paso fijo la de una línea
       dejaba un hueco y la de tres quedaba pegada a la siguiente. */
    $altos = [];
    foreach ($partes as [$num, $titulo, $texto]) {
        $lineas = $pdf->lineas($texto, $medida, 10, false, 3);
        $altos[] = 22 + $lineas * 10 * 1.45;
    }
    $aire = (Pdf::ALTO - 64 - $y - array_sum($altos)) / max(1, count($partes) - 1);
    $aire = max(16.0, min(40.0, $aire));

    $py = $y;
    foreach ($partes as $i => [$num, $titulo, $texto]) {
        if ($i > 0) r_filete($im, R_M, $py - $aire / 2, $gw, R_LINEA);
        $pdf->texto(R_M, $py + 2, $num, 10, true, R_PUR3, 'izq', 1.4);
        $pdf->texto(R_M + 34, $py + 2, $titulo, 10.5, true, R_TXT);
        $pdf->parrafo(R_M + 34, $py + 22, $medida, $texto, 10, false, R_SUAVE, 1.45, 3);
        $py += $altos[$i] + $aire;
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

function r_estatus(Pdf $pdf, array $d, array $est, string $num, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    /* La única lámina de datos con luz: es la conclusión y conviene que se
       note al llegar. */
    r_resplandor($im, 1090, 660, 540, R_PUR, 0.44);
    /* 10 y no 09: «En corto» se quedó con el 09. */
    $y = r_seccion($im, $pdf, $num, 'Dónde está Inédito', $est['frase']);
    $gw = Pdf::ANCHO - R_M * 2;

    $tonos = [0 => R_ROJO, 1 => R_AMBAR, 2 => R_PUR3, 3 => R_VERDE];
    $paso = min(84.0, (Pdf::ALTO - 66 - $y) / max(1, count($est['dimensiones'])));
    foreach ($est['dimensiones'] as $i => $dim) {
        $py = $y + $i * $paso;
        r_filete($im, R_M, $py - 18, $gw);
        $nivel = (int)$dim['nivel'];

        $pdf->texto(R_M, $py + 4, $dim['que'], 12.5, true, R_TXT);
        $pdf->texto(R_M, $py + 23, $dim['texto'], 9.5, false, R_MUT);

        /* Cuatro tramos: en cuál de los pasos va cada cosa. No es una nota
           del 0 al 10, es un lugar en la cadena; por eso se pintan los
           cuatro y solo se rellenan los alcanzados. */
        $bx = Pdf::ANCHO - R_M - 250;
        for ($k = 0; $k < 4; $k++) {
            r_caja($im, $bx + $k * 20, $py - 5, 14, 5, $k <= $nivel ? $tonos[$nivel] : R_LINEA2);
        }
        $pdf->texto(Pdf::ANCHO - R_M, $py + 4, $dim['estado'], 11, true, $tonos[$nivel], 'der');
    }

    $sig = date('Y-m-d', strtotime($d['periodo']['hasta'] . ' +' . REPORTE_DIAS . ' days'));
    r_filete($im, R_M, Pdf::ALTO - 58, $gw);
    $pdf->texto(R_M, Pdf::ALTO - 36, 'El siguiente reporte se genera solo el ' . reporte_fecha_larga($sig)
        . ', y cubrirá desde el ' . reporte_fecha_larga(date('Y-m-d', strtotime($d['periodo']['hasta'] . ' +1 day'))) . '.',
        9, false, R_MUT2);
    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* ------------------------------------------------------------------ */

/** Cierra el lienzo y lo adjunta como fondo de la lámina en curso. */
function r_cerrar(Pdf $pdf, $im): void
{
    $pdf->fondo(r_jpeg($im), (int)(Pdf::ANCHO * R_ESCALA), (int)(Pdf::ALTO * R_ESCALA));
}

function r_recorta(string $s, int $n): string
{
    return mb_strlen($s, 'UTF-8') > $n ? mb_substr($s, 0, $n - 1, 'UTF-8') . '…' : $s;
}

/** «19 ago», para los extremos de la gráfica. */
function r_dia(string $iso): string
{
    $m = ['01'=>'ene','02'=>'feb','03'=>'mar','04'=>'abr','05'=>'may','06'=>'jun',
          '07'=>'jul','08'=>'ago','09'=>'sep','10'=>'oct','11'=>'nov','12'=>'dic'];
    return (int)substr($iso, 8, 2) . ' ' . ($m[substr($iso, 5, 2)] ?? '');
}
