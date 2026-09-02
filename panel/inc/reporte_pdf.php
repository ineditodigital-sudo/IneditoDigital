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

    $laminas = [
        fn($n, $t) => r_portada($pdf, $d, $per),
        fn($n, $t) => r_titular($pdf, $d, $cmp, $est, $hall, $n, $t),
        fn($n, $t) => r_visitas($pdf, $d, $cmp, $res, $n, $t),
        fn($n, $t) => r_buscador($pdf, $d, $cmp, $res, $n, $t),
        fn($n, $t) => r_palabras($pdf, $d, $res, $n, $t),
        fn($n, $t) => r_ia($pdf, $d, $cmp, $res, $n, $t),
        fn($n, $t) => r_embudo($pdf, $d, $res, $n, $t),
    ];
    if ($hall['logros'] || $hall['alertas']) $laminas[] = fn($n, $t) => r_balance($pdf, $hall, $n, $t);
    if ($hall['recomendaciones'])            $laminas[] = fn($n, $t) => r_recomendaciones($pdf, $hall['recomendaciones'], $n, $t);
    $laminas[] = fn($n, $t) => r_estatus($pdf, $d, $est, $n, $t);

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
function r_titular(Pdf $pdf, array $d, ?array $cmp, array $est, array $hall, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '01', 'El titular', $est['frase']);

    $v = $d['visitas']; $b = $d['buscador']; $ia = $d['ia']; $e = $d['embudo'];
    /* Cuatro cifras, no ocho: las que cuentan la cadena entera —te ven, te
       visitan, te leen las IA, te escriben—. El resto tiene su lámina. */
    $cifras = [
        [number_format($b['impresiones']), 'apariciones en Google', $cmp['impresiones'] ?? null, false, ''],
        [number_format($v['personas']),    'personas en el sitio',  $cmp['personas'] ?? null,    false, ''],
        [number_format($ia['lecturas']),   'lecturas de IA',        $cmp['ia'] ?? null,          false, count($ia['motores']) . ' motores distintos'],
        [number_format($e['leads']),       'prospectos',            $cmp['leads'] ?? null,       false, 'formularios enviados'],
    ];
    $paso = (Pdf::ANCHO - R_M * 2) / 4;
    foreach ($cifras as $i => [$val, $rot, $del, $inv, $nota]) {
        if ($i > 0) r_caja($im, R_M + $i * $paso - 22, $y - 26, 0.7, 72, R_LINEA);
        r_cifra($im, $pdf, R_M + $i * $paso, $y, $val, $rot, $del, $inv, $nota, 38);
    }

    /* Lo mejor, lo peor y lo primero: una línea cada uno, para que la lámina
       se pueda leer en diez segundos. */
    $y += 76;
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
function r_visitas(Pdf $pdf, array $d, ?array $cmp, array $res, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '02', 'Las visitas', $res['visitas'] ?? '');
    $v = $d['visitas'];
    $gw = Pdf::ANCHO - R_M * 2;

    /* la forma de la quincena, día a día */
    $gh = 112;
    $serie = array_values($v['por_dia']);
    $fechas = array_keys($v['por_dia']);
    $max = max(1, max($serie ?: [1]));
    $nb = max(1, count($serie));
    $bw = $gw / $nb;
    $pdf->texto(R_M, $y - 10, 'Páginas vistas por día', 9, false, R_MUT);
    $pdf->texto(Pdf::ANCHO - R_M, $y - 10, 'máximo ' . number_format($max) . ' en un día', 9, false, R_MUT2, 'der');
    foreach ($serie as $i => $val) {
        $hh = $val / $max * $gh;
        $bx = R_M + $i * $bw + $bw * 0.18;
        $bwR = $bw * 0.64;
        if ($hh >= 1) r_degradado($im, $bx, $y + ($gh - $hh), $bwR, $hh, true);
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
    $fuentes = [
        'organic'  => ['Buscador',         '#00E585'],
        'directo'  => ['Directo',          '#9933FF'],
        'ia'       => ['Asistentes de IA', '#CC66FF'],
        'referral' => ['Otros sitios',     '#5B8CFF'],
        'social'   => ['Redes',            '#FFB454'],
        'email'    => ['Correo',           '#FF7D9C'],
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

    /* y qué miran */
    $y += 78;
    r_filete($im, R_M, $y, $gw);
    $pdf->texto(R_M, $y + 24, 'Las páginas más vistas', 9, false, R_MUT);
    $col = 0; $fila = 0;
    foreach (array_slice($v['paginas'], 0, 6) as $pg) {
        $px = R_M + $col * ($gw / 2); $py = $y + 46 + $fila * 20;
        $pdf->texto($px, $py, r_recorta($pg['path'], 42), 9.5, false, R_SUAVE);
        $pdf->texto($px + $gw / 2 - 34, $py, number_format($pg['n']), 9.5, true, R_TXT, 'der');
        if (++$fila >= 3) { $fila = 0; $col++; }
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 03 · el buscador --- */
function r_buscador(Pdf $pdf, array $d, ?array $cmp, array $res, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '03', 'El buscador', $res['buscador'] ?? '');
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
function r_palabras(Pdf $pdf, array $d, array $res, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '04', 'Las palabras clave', $res['palabras'] ?? '');
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
function r_ia(Pdf $pdf, array $d, ?array $cmp, array $res, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '05', 'Los asistentes de IA', $res['ia'] ?? '');
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
function r_embudo(Pdf $pdf, array $d, array $res, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '06', 'De la visita al cliente', $res['embudo'] ?? '');
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

/* --- 07 · el balance --- */
function r_balance(Pdf $pdf, array $hall, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '07', 'El balance', '');
    $gw = Pdf::ANCHO - R_M * 2;
    $cw = $gw / 2 - 30;

    /* Dos columnas en vez de dos láminas: lado a lado se leen como un
       balance; separadas parecían dos listas sin relación. */
    $cols = [
        [R_M,                'Va bien',         R_VERDE, array_slice($hall['logros'], 0, 4)],
        [R_M + $gw / 2 + 30, 'Hay que atender', R_AMBAR, array_slice($hall['alertas'], 0, 4)],
    ];
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
            $pdf->texto($x, $fy, $it['titulo'], 11.5, true, R_TXT);
            $fy = $pdf->parrafo($x, $fy + 18, $cw, $it['texto'], 9.5, false, R_MUT, 1.4, 3);
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
function r_recomendaciones(Pdf $pdf, array $reco, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    $y = r_seccion($im, $pdf, '08', 'Qué hacer ahora', 'En orden: arriba está lo que más mueve con menos esfuerzo.');
    $gw = Pdf::ANCHO - R_M * 2;

    $reco = array_slice($reco, 0, 4);
    $alto = min(90.0, (Pdf::ALTO - $y - 50) / max(1, count($reco)));
    foreach ($reco as $i => $r) {
        $py = $y + $i * $alto;
        if ($i > 0) r_filete($im, R_M, $py - 16, $gw);
        r_hanson($im, (string)($i + 1), R_M, $py + 20, 24, R_PUR3);
        $pdf->texto(R_M + 46, $py + 14, $r['titulo'], 13.5, true, R_TXT);
        $etq = ['1' => 'Ahora', '2' => 'Después', '3' => 'Cuando se pueda'][(string)$r['prioridad']] ?? '';
        $pdf->texto(Pdf::ANCHO - R_M, $py + 14, $etq, 8.5, true, $r['prioridad'] === 1 ? R_PUR3 : R_MUT2, 'der', 1.2);
        $yy = $pdf->parrafo(R_M + 46, $py + 34, $gw - 160, $r['texto'], 9.5, false, R_MUT, 1.4, 2);
        if (!empty($r['lista'])) {
            $pdf->texto(R_M + 46, $yy + 3, implode('   ·   ', array_slice($r['lista'], 0, 2)), 8.5, false, R_MUT2);
        }
    }

    r_folio($im, $pdf, $n, $t);
    r_cerrar($pdf, $im);
}

/* --- 09 · dónde está Inédito --- */
function r_estatus(Pdf $pdf, array $d, array $est, int $n, int $t): void
{
    $pdf->pagina();
    $im = r_lienzo();
    /* La única lámina de datos con luz: es la conclusión y conviene que se
       note al llegar. */
    r_resplandor($im, 1090, 660, 540, R_PUR, 0.44);
    $y = r_seccion($im, $pdf, '09', 'Dónde está Inédito', $est['frase']);
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
