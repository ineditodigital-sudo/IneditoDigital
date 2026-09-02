<?php
/**
 * El reporte quincenal, como presentación.
 *
 * Diez láminas de 16:9 con el aspecto del sitio: fondo casi negro, el morado
 * de la casa en degradado, Hanson en mayúsculas para los títulos —la
 * tipografía de la marca no se usa en caja baja— y la retícula de puntos que
 * aparece en la portada de inedito.digital.
 *
 * Cada lámina se arma en dos capas. GD dibuja lo que es imagen (degradados,
 * Hanson, barras, líneas) y entra como un JPEG de fondo; encima, el PDF pone
 * el texto de verdad, para que las cifras y las tablas se puedan seleccionar
 * y buscar. Ver panel/inc/pdf.php.
 */
declare(strict_types=1);

require_once __DIR__ . '/pdf.php';

/* --- la paleta, la misma del panel y del sitio --- */
const R_FONDO  = [0x07, 0x07, 0x0b];
const R_CARTA  = '#10101A';
const R_LINEA  = '#232336';
const R_TXT    = '#F2F0F6';
const R_MUT    = '#9A97AD';
const R_MUT2   = '#6B6884';
const R_PUR    = '#7700CE';
const R_PUR2   = '#9933FF';
const R_PUR3   = '#CC66FF';
const R_VERDE  = '#00E585';
const R_ROJO   = '#FF7D9C';

/** Cuántos píxeles por punto dibuja GD. Dos basta para que no se vea el pixel. */
const R_ESCALA = 2;

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
 * El resplandor morado de la marca.
 *
 * Se dibuja por anillos concéntricos y no píxel a píxel: un degradado real
 * sobre 1920×1080 son dos millones de llamadas y el cron tiene prisa.
 */
function r_resplandor($im, float $cx, float $cy, float $radio, string $hex = R_PUR, float $fuerza = 0.55): void
{
    $cx *= R_ESCALA; $cy *= R_ESCALA; $radio *= R_ESCALA;
    /* Muchos pasos y una caida cubica: con pocos anillos se ven los bordes
       de cada circulo y el resplandor deja de parecer luz. */
    $pasos = 110;
    for ($i = $pasos; $i > 0; $i--) {
        $t = $i / $pasos;
        $caida = (1 - $t) * (1 - $t) * (1 - $t);
        $a = (int)round(127 - $caida * 127 * $fuerza);
        if ($a >= 127) continue;
        imagefilledellipse($im, (int)$cx, (int)$cy, (int)($radio * 2 * $t), (int)($radio * 2 * $t), r_color($im, $hex, $a));
    }
}

/** La retícula de puntos de la portada del sitio. */
function r_reticula($im, float $x, float $y, float $w, float $h, int $paso = 22, int $alfa = 108): void
{
    $c = r_color($im, '#FFFFFF', $alfa);
    for ($i = $x; $i < $x + $w; $i += $paso)
        for ($j = $y; $j < $y + $h; $j += $paso)
            imagefilledellipse($im, (int)($i * R_ESCALA), (int)($j * R_ESCALA), R_ESCALA, R_ESCALA, $c);
}

/** Un rectángulo en unidades de diseño. */
function r_caja($im, float $x, float $y, float $w, float $h, string $hex, int $alfa = 0): void
{
    imagefilledrectangle($im, (int)($x*R_ESCALA), (int)($y*R_ESCALA),
        (int)(($x+$w)*R_ESCALA), (int)(($y+$h)*R_ESCALA), r_color($im, $hex, $alfa));
}

/** Una barra con el degradado de la casa, de morado oscuro a claro. */
function r_barraDegradada($im, float $x, float $y, float $w, float $h, bool $vertical = true): void
{
    $n = max(1, (int)(($vertical ? $h : $w) * R_ESCALA));
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
    $px0 = $x;
    if ($alineado === 'centro') $px0 = $x - $w / 2;
    elseif ($alineado === 'der') $px0 = $x - $w;
    imagettftext($im, $px, 0, (int)($px0 * R_ESCALA), (int)($y * R_ESCALA), r_color($im, $hex, $alfa), r_fuente(), $txt);
    return $w;
}

function r_jpeg($im, int $calidad = 88): string
{
    ob_start(); imagejpeg($im, null, $calidad); $b = (string)ob_get_clean();
    imagedestroy($im);
    return $b;
}

/* ------------------------------------------------------------------ */
/*  Piezas que se repiten                                             */
/* ------------------------------------------------------------------ */

/** El fondo común: base oscura, resplandor en una esquina y retícula. */
function r_fondoBase($im, string $lado = 'der'): void
{
    /* El centro del resplandor cae FUERA de la lamina a proposito: asi solo
       entra el borde de la luz y no un circulo morado recortado. */
    if ($lado === 'der') r_resplandor($im, 1080, -110, 560, R_PUR, 0.62);
    else                 r_resplandor($im, -120, 650, 560, R_PUR, 0.58);
    r_reticula($im, 0, 0, Pdf::ANCHO, Pdf::ALTO, 24, 118);
    r_caja($im, 0, 0, Pdf::ANCHO, 3, R_PUR2);
}

/** El encabezado de las láminas interiores. Devuelve la y donde sigue todo. */
function r_encabezado($im, Pdf $pdf, string $kicker, string $titulo): float
{
    r_caja($im, 56, 46, 26, 2, R_PUR3);
    $pdf->texto(92, 50, mb_strtoupper($kicker, 'UTF-8'), 8.5, true, R_PUR3, 'izq', 1.6);
    r_hanson($im, $titulo, 56, 96, 30);
    r_caja($im, 56, 116, Pdf::ANCHO - 112, 1, R_LINEA);
    return 150;
}

/** El pie con la marca y el número de lámina. */
function r_pie($im, Pdf $pdf, int $n, int $total, string $periodo): void
{
    r_caja($im, 56, Pdf::ALTO - 44, Pdf::ANCHO - 112, 1, R_LINEA);
    $pdf->texto(56, Pdf::ALTO - 26, 'INÉDITO DIGITAL · ' . $periodo, 8, false, R_MUT2, 'izq', 0.8);
    $pdf->texto(Pdf::ANCHO - 56, Pdf::ALTO - 26, $n . ' / ' . $total, 8, false, R_MUT2, 'der');
}

/** La variación contra la quincena pasada, en palabras y color. */
function r_variacion(?array $d, bool $menosEsMejor = false): array
{
    if (!$d || $d['pct'] === null) return ['—', R_MUT2];
    if ($d['signo'] === 0) return ['igual', R_MUT];
    $txt = ($d['signo'] > 0 ? '+' : '') . $d['pct'] . '%';
    $bueno = $menosEsMejor ? $d['signo'] < 0 : $d['signo'] > 0;
    return [$txt, $bueno ? R_VERDE : R_ROJO];
}

/** Una tarjeta de cifra: el número grande, su rótulo y la variación. */
function r_tarjeta($im, Pdf $pdf, float $x, float $y, float $w, float $h,
                   string $rotulo, string $valor, ?array $delta = null, bool $menosEsMejor = false, string $nota = ''): void
{
    r_caja($im, $x, $y, $w, $h, R_CARTA);
    r_caja($im, $x, $y, $w, 2, R_PUR2);
    r_caja($im, $x, $y + $h - 1, $w, 1, R_LINEA);
    /* Todo se coloca en proporcion al alto: la misma tarjeta se usa a 104
       puntos en el resumen y a 88 en el buscador, y con posiciones fijas el
       numero grande se encimaba con la nota. */
    $pdf->texto($x + 18, $y + 27, mb_strtoupper($rotulo, 'UTF-8'), 8, true, R_MUT, 'izq', 1.2);
    $pdf->texto($x + 18, $y + $h * 0.60, $valor, $h > 96 ? 30 : 26, true, R_TXT);
    $pie = $y + $h - 13;
    if ($delta !== null) {
        [$t, $c] = r_variacion($delta, $menosEsMejor);
        $pdf->texto($x + 18, $pie, $t . ' vs. la quincena anterior', 8.5, false, $c);
    } elseif ($nota !== '') {
        $pdf->texto($x + 18, $pie, $nota, 8.5, false, R_MUT2);
    }
}

/* ------------------------------------------------------------------ */
/*  Las láminas                                                       */
/* ------------------------------------------------------------------ */

function reporte_pdf(array $d): string
{
    /* Sin la tipografia de la marca no hay reporte: mejor fallar aqui que
       entregar diez laminas sin un solo titulo. */
    if (!is_readable(r_fuente())) {
        throw new RuntimeException('Falta la tipografia del reporte: ' . r_fuente());
    }
    $pdf = new Pdf();
    $per = reporte_fecha_larga($d['periodo']['desde']) . ' — ' . reporte_fecha_larga($d['periodo']['hasta']);
    $perCorto = substr($d['periodo']['desde'], 8, 2) . '/' . substr($d['periodo']['desde'], 5, 2)
              . ' — ' . substr($d['periodo']['hasta'], 8, 2) . '/' . substr($d['periodo']['hasta'], 5, 2)
              . '/' . substr($d['periodo']['hasta'], 0, 4);
    $pdf->titulo = 'Reporte de resultados ' . $perCorto;
    $cmp = $d['comparacion'] ?? null;
    $hall = $d['hallazgos'] ?? ['logros' => [], 'alertas' => [], 'recomendaciones' => []];

    $laminas = [];
    $laminas[] = fn($n, $t) => r_portada($pdf, $d, $per);
    $laminas[] = fn($n, $t) => r_resumen($pdf, $d, $cmp, $n, $t, $perCorto);
    $laminas[] = fn($n, $t) => r_visitas($pdf, $d, $cmp, $n, $t, $perCorto);
    $laminas[] = fn($n, $t) => r_buscador($pdf, $d, $cmp, $n, $t, $perCorto);
    $laminas[] = fn($n, $t) => r_ia($pdf, $d, $cmp, $n, $t, $perCorto);
    $laminas[] = fn($n, $t) => r_embudo($pdf, $d, $cmp, $n, $t, $perCorto);
    if ($hall['logros'])   $laminas[] = fn($n, $t) => r_puntos($pdf, $d, $hall['logros'], 'Lo que salió bien', 'Avances', R_VERDE, $n, $t, $perCorto);
    if ($hall['alertas'])  $laminas[] = fn($n, $t) => r_puntos($pdf, $d, $hall['alertas'], 'Lo que hay que atender', 'Atención', R_ROJO, $n, $t, $perCorto);
    if ($hall['recomendaciones']) $laminas[] = fn($n, $t) => r_recomendaciones($pdf, $d, $hall['recomendaciones'], $n, $t, $perCorto);
    $laminas[] = fn($n, $t) => r_cierre($pdf, $d, $per);

    $total = count($laminas);
    foreach ($laminas as $i => $hacer) $hacer($i + 1, $total);
    return $pdf->salida();
}

/* --- 1. portada --- */
function r_portada(Pdf $pdf, array $d, string $per): void
{
    $pdf->pagina();
    $im = r_lienzo();
    r_resplandor($im, 1010, 150, 620, R_PUR, 0.72);
    r_resplandor($im, 120, 640, 460, R_PUR3, 0.42);
    r_reticula($im, 0, 0, Pdf::ANCHO, Pdf::ALTO, 24, 128);
    r_caja($im, 0, 0, Pdf::ANCHO, 4, R_PUR2);
    r_caja($im, 84, 160, 44, 3, R_PUR3);
    r_hanson($im, 'Reporte de', 84, 244, 58);
    r_hanson($im, 'resultados', 84, 314, 58, R_PUR3);
    r_barraDegradada($im, 84, 392, 300, 2, false);

    $pdf->fondo(r_jpeg($im, 90), (int)(Pdf::ANCHO * R_ESCALA), (int)(Pdf::ALTO * R_ESCALA));
    $pdf->texto(84, 152, 'INÉDITO DIGITAL · AGENCIA DIGITAL', 9, true, R_PUR3, 'izq', 2.2);
    $pdf->texto(84, 372, $per, 13, false, R_TXT);
    $pdf->texto(84, 424, 'Sitio, buscadores y posicionamiento en asistentes de IA', 10.5, false, '#CFC6DC');
    $pdf->texto(84, 446, 'Quincena de ' . $d['periodo']['dias'] . ' días · generado el ' . reporte_fecha_larga(substr((string)$d['generado'], 0, 10)), 9, false, '#A79CB8');
    $pdf->texto(Pdf::ANCHO - 84, Pdf::ALTO - 40, 'inedito.digital', 9.5, true, R_MUT, 'der', 1.2);
}

/* --- 2. resumen --- */
function r_resumen(Pdf $pdf, array $d, ?array $cmp, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im);
    $y = r_encabezado($im, $pdf, 'De un vistazo', 'El resumen');

    $v = $d['visitas']; $b = $d['buscador']; $ia = $d['ia']; $e = $d['embudo'];
    $primero = $cmp === null ? 'primer reporte: nada con qué comparar' : '';
    $tar = [
        ['Personas distintas', number_format($v['personas']), $cmp['personas'] ?? null, false, $primero],
        ['Páginas vistas',     number_format($v['total']),    $cmp['visitas'] ?? null,  false, ''],
        ['Clics desde Google', number_format($b['clics']),    $cmp['clics'] ?? null,    false, ''],
        ['Impresiones',        number_format($b['impresiones']), $cmp['impresiones'] ?? null, false, ''],
        ['Posición media',     $b['posicion'] > 0 ? (string)$b['posicion'] : '—', $cmp['posicion'] ?? null, true, 'cuanto más bajo, mejor'],
        ['Lecturas de IA',     number_format($ia['lecturas']), $cmp['ia'] ?? null,      false, count($ia['motores']) . ' motores distintos'],
        ['Acciones',           number_format($e['acciones']),  $cmp['acciones'] ?? null, false, 'WhatsApp, teléfono, asistente'],
        ['Prospectos',         number_format($e['leads']),     $cmp['leads'] ?? null,   false, 'formularios enviados'],
    ];
    $w = 202; $h = 104; $gx = 214; $gy = 118;
    foreach ($tar as $i => [$rot, $val, $del, $inv, $nota]) {
        r_tarjeta($im, $pdf, 56 + ($i % 4) * $gx, $y + (int)($i / 4) * $gy, $w, $h, $rot, $val, $del, $inv, $nota);
    }

    $ry = $y + 2 * $gy + 6;
    r_caja($im, 56, $ry, Pdf::ANCHO - 112, 62, R_CARTA);
    r_caja($im, 56, $ry, 3, 62, R_PUR2);
    $pdf->texto(76, $ry + 24, 'LA LECTURA DE LA QUINCENA', 8, true, R_PUR3, 'izq', 1.4);
    $pdf->parrafo(76, $ry + 44, Pdf::ANCHO - 152, r_lectura($d), 10, false, R_TXT, 1.4, 2);

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/** El párrafo que abre el reporte, armado con los propios números. */
function r_lectura(array $d): string
{
    $v = $d['visitas']; $b = $d['buscador']; $ia = $d['ia']; $e = $d['embudo'];
    $p = [];
    $p[] = number_format($v['personas']) . ' personas distintas vieron ' . number_format($v['total'])
         . ' páginas en ' . $d['periodo']['dias'] . ' días.';
    if ($b['impresiones'] > 0) {
        $p[] = 'El sitio apareció ' . number_format($b['impresiones']) . ' veces en Google y recibió '
             . number_format($b['clics']) . ' clics'
             . ($b['posicion'] > 0 ? ', con una posición media de ' . $b['posicion'] . '.' : '.');
    }
    if ($ia['lecturas'] > 0) {
        $p[] = count($ia['motores']) . ' motores de IA leyeron el sitio ' . number_format($ia['lecturas']) . ' veces.';
    }
    $p[] = $e['leads'] > 0
        ? 'Llegaron ' . $e['leads'] . ' prospecto' . ($e['leads'] === 1 ? '' : 's') . '.'
        : ($e['acciones'] > 0
            ? 'Hubo ' . $e['acciones'] . ($e['acciones'] === 1 ? ' acción' : ' acciones')
              . ' pero ningún prospecto dejó sus datos.'
            : 'Todavía no se registran acciones ni prospectos en el periodo.');
    return implode(' ', $p);
}

/* --- 3. visitas --- */
function r_visitas(Pdf $pdf, array $d, ?array $cmp, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im, 'izq');
    $y = r_encabezado($im, $pdf, 'Quién entra al sitio', 'Las visitas');
    $v = $d['visitas'];

    /* la serie por día */
    $serie = array_values($v['por_dia']);
    $fechas = array_keys($v['por_dia']);
    $gx = 56; $gy = $y + 6; $gw = 540; $gh = 178;
    r_caja($im, $gx, $gy, $gw, $gh + 34, R_CARTA);
    $max = max(1, max($serie ?: [1]));
    $nb = max(1, count($serie));
    $bw = ($gw - 44) / $nb;
    foreach ($serie as $i => $val) {
        $hh = $val / $max * ($gh - 46);
        $bx = $gx + 22 + $i * $bw;
        if ($hh > 0.8) r_barraDegradada($im, $bx + $bw * 0.16, $gy + 30 + ($gh - 46 - $hh), $bw * 0.68, $hh);
        else r_caja($im, $bx + $bw * 0.16, $gy + 30 + ($gh - 46) - 1.5, $bw * 0.68, 1.5, R_LINEA);
    }
    r_caja($im, $gx + 20, $gy + $gh - 16, $gw - 40, 1, R_LINEA);
    $pdf->texto($gx + 22, $gy + 22, 'PÁGINAS VISTAS POR DÍA', 8, true, R_MUT, 'izq', 1.2);
    $pdf->texto($gx + $gw - 22, $gy + 22, 'máximo ' . number_format($max) . ' en un día', 8, false, R_MUT2, 'der');
    if ($fechas) {
        $pdf->texto($gx + 22, $gy + $gh + 2, substr($fechas[0], 8, 2) . '/' . substr($fechas[0], 5, 2), 8, false, R_MUT2);
        $ult = end($fechas);
        $pdf->texto($gx + $gw - 22, $gy + $gh + 2, substr($ult, 8, 2) . '/' . substr($ult, 5, 2), 8, false, R_MUT2, 'der');
    }

    /* de dónde llegan */
    $fx = 620; $fw = Pdf::ANCHO - 56 - $fx;
    r_caja($im, $fx, $gy, $fw, $gh + 34, R_CARTA);
    $pdf->texto($fx + 20, $gy + 22, 'DE DÓNDE LLEGAN', 8, true, R_MUT, 'izq', 1.2);
    $nombres = ['directo'=>'Directo','organic'=>'Buscador','referral'=>'Otros sitios','social'=>'Redes','internal'=>'Interno','ia'=>'Asistentes de IA','email'=>'Correo'];
    $tot = max(1, array_sum($v['fuentes']));
    $fy = $gy + 46;
    foreach (array_slice($v['fuentes'], 0, 6, true) as $k => $c) {
        $pct = $c / $tot * 100;
        $pdf->texto($fx + 20, $fy, $nombres[$k] ?? ucfirst((string)$k), 9.5, false, R_TXT);
        $pdf->texto($fx + $fw - 20, $fy, round($pct) . '%', 9.5, true, R_TXT, 'der');
        r_caja($im, $fx + 20, $fy + 7, $fw - 40, 4, R_LINEA);
        if ($pct > 0) r_barraDegradada($im, $fx + 20, $fy + 7, max(2.0, ($fw - 40) * $pct / 100), 4, false);
        $fy += 30;
    }

    /* páginas más vistas */
    $ty = $gy + $gh + 52;
    r_caja($im, 56, $ty, Pdf::ANCHO - 112, 118, R_CARTA);
    $pdf->texto(76, $ty + 24, 'LAS PÁGINAS MÁS VISTAS', 8, true, R_MUT, 'izq', 1.2);
    $col = 0; $fila = 0;
    foreach (array_slice($v['paginas'], 0, 8) as $pg) {
        $px = 76 + $col * 424; $py = $ty + 50 + $fila * 24;
        $pdf->texto($px, $py, r_recorta($pg['path'], 46), 9.5, false, R_TXT);
        $pdf->texto($px + 388, $py, number_format($pg['n']), 9.5, true, R_PUR3, 'der');
        if (++$fila >= 3) { $fila = 0; $col++; }
    }

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/* --- 4. buscador --- */
function r_buscador(Pdf $pdf, array $d, ?array $cmp, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im);
    $y = r_encabezado($im, $pdf, 'Cómo te ve Google', 'El buscador');
    $b = $d['buscador'];

    if (!$b['fecha']) {
        r_caja($im, 56, $y + 40, Pdf::ANCHO - 112, 120, R_CARTA);
        $pdf->texto(80, $y + 84, 'Sin datos de Search Console en este periodo', 16, true, R_TXT);
        $pdf->parrafo(80, $y + 110, Pdf::ANCHO - 160,
            'No se guardó ninguna foto entre estas fechas. La sincronización diaria es la que permite comparar una quincena con la anterior.',
            10, false, R_MUT);
        r_pie($im, $pdf, $n, $t, $pc); r_pagina($pdf, $im); return;
    }

    $tar = [
        ['Clics', number_format($b['clics']), $cmp['clics'] ?? null, false, ''],
        ['Impresiones', number_format($b['impresiones']), $cmp['impresiones'] ?? null, false, 'veces que apareciste'],
        ['CTR', $b['ctr'] . '%', null, false, 'de cada 100 que te ven, entran'],
        ['Posición media', (string)$b['posicion'], $cmp['posicion'] ?? null, true, 'cuanto más bajo, mejor'],
    ];
    /* Tarjetas mas bajas que en el resumen: aqui lo que importa es que quepan
       ocho busquedas debajo, no las cifras. */
    foreach ($tar as $i => [$rot, $val, $del, $inv, $nota])
        r_tarjeta($im, $pdf, 56 + $i * 214, $y - 8, 202, 88, $rot, $val, $del, $inv, $nota);

    /* las consultas que más te muestran */
    $ty = $y + 88;
    $alto = Pdf::ALTO - $ty - 52;
    r_caja($im, 56, $ty, Pdf::ANCHO - 112, $alto, R_CARTA);
    $pdf->texto(76, $ty + 24, 'LAS BÚSQUEDAS QUE MÁS TE MUESTRAN', 8, true, R_MUT, 'izq', 1.2);
    $pdf->texto(Pdf::ANCHO - 76, $ty + 24, 'foto del ' . reporte_fecha_larga((string)$b['fecha']), 8, false, R_MUT2, 'der');

    $cx = [76, 560, 660, 780];
    $enc = ['Búsqueda', 'Impresiones', 'Clics', 'Puesto'];
    foreach ($enc as $i => $h)
        $pdf->texto($i === 0 ? $cx[0] : $cx[$i] + 76, $ty + 44, mb_strtoupper($h, 'UTF-8'), 7.5, true, R_MUT2, $i === 0 ? 'izq' : 'der', 1);
    r_caja($im, 76, $ty + 52, Pdf::ANCHO - 152, 1, R_LINEA);

    /* Se reservan 26 puntos al final para la nota: antes la ultima fila y la
       nota se pisaban. */
    $cabe = max(1, (int)(($alto - 68 - 22) / 19));
    $filas = array_slice($b['consultas'], 0, $cabe);
    foreach ($filas as $i => $c) {
        $fy = $ty + 68 + $i * 19;
        /* Las de la segunda página con demanda son la oportunidad del mes:
           se marcan para que no haya que buscarlas en la tabla. */
        $cerca = $c['posicion'] > 10 && $c['posicion'] <= 20 && $c['impresiones'] >= 15;
        if ($cerca) r_caja($im, 68, $fy - 11.5, Pdf::ANCHO - 136, 17, R_PUR, 96);
        $pdf->texto($cx[0], $fy, r_recorta($c['consulta'], 62), 9.5, false, $cerca ? R_TXT : R_MUT);
        $pdf->texto($cx[1] + 76, $fy, number_format($c['impresiones']), 9.5, false, R_MUT, 'der');
        $pdf->texto($cx[2] + 76, $fy, (string)$c['clics'], 9.5, false, $c['clics'] > 0 ? R_VERDE : R_MUT2, 'der');
        $pdf->texto($cx[3] + 76, $fy, (string)$c['posicion'], 9.5, true, $cerca ? R_PUR3 : R_MUT, 'der');
    }
    $pdf->texto(76, $ty + 68 + count($filas) * 19 + 8,
        'Las ' . count($filas) . ' con más impresiones de ' . count($b['consultas'])
        . '. Resaltadas: entre el puesto 11 y el 20 con demanda real, las que menos esfuerzo piden para llegar a la primera página.',
        7.5, false, R_MUT2);

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/* --- 5. posicionamiento en IA --- */
function r_ia(Pdf $pdf, array $d, ?array $cmp, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im, 'izq');
    $y = r_encabezado($im, $pdf, 'Qué asistentes te leen', 'Posicionamiento en IA');
    $ia = $d['ia'];

    r_tarjeta($im, $pdf, 56, $y, 202, 104, 'Lecturas', number_format($ia['lecturas']), $cmp['ia'] ?? null);
    r_tarjeta($im, $pdf, 270, $y, 202, 104, 'Motores distintos', (string)count($ia['motores']), null, false, 'de ' . count(REPORTE_MOTORES) . ' conocidos');
    r_tarjeta($im, $pdf, 484, $y, 202, 104, 'Visitas desde IA', number_format($ia['visitas']), null, false, 'personas enviadas por un asistente');
    r_tarjeta($im, $pdf, 698, $y, 206, 104, 'URLs leídas', (string)count($ia['urls']), null, false, 'páginas distintas');

    /* barras por motor */
    $by = $y + 124;
    $alto = Pdf::ALTO - $by - 64;
    r_caja($im, 56, $by, 470, $alto, R_CARTA);
    $pdf->texto(76, $by + 24, 'CUÁNTO TE LEE CADA MOTOR', 8, true, R_MUT, 'izq', 1.2);
    $max = max(1, max($ia['motores'] ?: [1]));
    $fy = $by + 52;
    foreach (array_slice($ia['motores'], 0, 8, true) as $bot => $c) {
        $pdf->texto(76, $fy, REPORTE_MOTORES[$bot] ?? $bot, 9.5, false, R_TXT);
        $pdf->texto(506, $fy, number_format($c), 9.5, true, R_PUR3, 'der');
        r_caja($im, 76, $fy + 7, 430, 4, R_LINEA);
        r_barraDegradada($im, 76, $fy + 7, max(2.0, 430 * $c / $max), 4, false);
        $fy += 30;
    }

    /* qué páginas leen */
    r_caja($im, 542, $by, Pdf::ANCHO - 56 - 542, $alto, R_CARTA);
    $pdf->texto(562, $by + 24, 'LAS PÁGINAS QUE MÁS LEEN', 8, true, R_MUT, 'izq', 1.2);
    $fy = $by + 52;
    foreach (array_slice($ia['urls'], 0, 8) as $u) {
        $pdf->texto(562, $fy, r_recorta($u['url'], 40), 9.5, false, R_TXT);
        $pdf->texto(Pdf::ANCHO - 76, $fy, number_format($u['n']), 9.5, true, R_PUR3, 'der');
        $pdf->texto(562, $fy + 13, $u['motores'] . ' motor' . ($u['motores'] === 1 ? '' : 'es'), 7.5, false, R_MUT2);
        $fy += 32;
    }

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/* --- 6. embudo --- */
function r_embudo(Pdf $pdf, array $d, ?array $cmp, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im);
    $y = r_encabezado($im, $pdf, 'De la visita a la venta', 'El embudo');
    $v = $d['visitas']; $e = $d['embudo'];

    $pasos = [
        ['Personas que entraron', $v['personas'], 'alguien abrió una página'],
        ['Hicieron algo',         $e['personas'], 'tocaron WhatsApp, el teléfono o el asistente'],
        ['Dejaron sus datos',     $e['leads'],    'enviaron el formulario'],
    ];
    $max = max(1, $v['personas']);
    $py = $y + 10;
    foreach ($pasos as $i => [$rot, $val, $nota]) {
        $ancho = max(120.0, (Pdf::ANCHO - 112) * ($val / $max));
        r_caja($im, 56, $py, Pdf::ANCHO - 112, 78, R_CARTA);
        if ($val > 0) r_barraDegradada($im, 56, $py, $ancho, 78, false);
        else r_caja($im, 56, $py, 3, 78, R_LINEA);
        $pdf->texto(80, $py + 32, mb_strtoupper($rot, 'UTF-8'), 9, true, R_TXT, 'izq', 1.4);
        $pdf->texto(80, $py + 56, $nota, 8.5, false, $val > 0 ? '#E4D7F5' : R_MUT2);
        $pdf->texto(Pdf::ANCHO - 80, $py + 50, number_format($val), 30, true, R_TXT, 'der');
        if ($i > 0 && $pasos[$i-1][1] > 0) {
            $pdf->texto(Pdf::ANCHO - 80, $py + 68, round($val / $pasos[$i-1][1] * 100, 1) . '% del paso anterior', 8, false, R_MUT2, 'der');
        }
        $py += 92;
    }

    $ny = $py + 4;
    r_caja($im, 56, $ny, Pdf::ANCHO - 112, 56, R_CARTA);
    r_caja($im, 56, $ny, 3, 56, R_PUR2);
    $nombres = ['whatsapp' => 'WhatsApp', 'telefono' => 'teléfono', 'asistente' => 'asistente', 'cotizar' => 'cotizar'];
    $texto = $e['acciones'] > 0
        ? 'Se registró ' . number_format($e['acciones']) . ($e['acciones'] === 1 ? ' acción' : ' acciones') . ' en total: '
          . implode(', ', array_map(fn($k, $c) => ($nombres[$k] ?? $k) . ' (' . $c . ')', array_keys($e['por_tipo']), $e['por_tipo'])) . '.'
        : 'No se registró ninguna acción en la quincena. Con visitas y sin acciones, lo que falta no es tráfico: es que el siguiente paso se vea sin tener que bajar.';
    $pdf->parrafo(76, $ny + 26, Pdf::ANCHO - 152, $texto, 9.5, false, R_MUT, 1.4, 2);

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/* --- 7 y 8. logros y alertas --- */
function r_puntos(Pdf $pdf, array $d, array $items, string $titulo, string $kicker, string $acento, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im, $acento === R_VERDE ? 'der' : 'izq');
    $y = r_encabezado($im, $pdf, $kicker, $titulo);

    $items = array_slice($items, 0, 4);
    $alto = min(96.0, (Pdf::ALTO - $y - 70) / max(1, count($items)) - 12);
    foreach ($items as $it) {
        r_caja($im, 56, $y, Pdf::ANCHO - 112, $alto, R_CARTA);
        r_caja($im, 56, $y, 3, $alto, $acento);
        $pdf->texto(80, $y + 28, $it['titulo'], 13, true, R_TXT);
        $yy = $pdf->parrafo(80, $y + 50, Pdf::ANCHO - 172, $it['texto'], 9.5, false, R_MUT, 1.4, 2);
        if (!empty($it['lista'])) {
            $pdf->texto(80, $yy + 6, implode('   ·   ', array_slice($it['lista'], 0, 3)), 8.5, false, R_MUT2);
        }
        $y += $alto + 12;
    }

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/* --- 9. recomendaciones --- */
function r_recomendaciones(Pdf $pdf, array $d, array $reco, int $n, int $t, string $pc): void
{
    $pdf->pagina(); $im = r_lienzo(); r_fondoBase($im);
    $y = r_encabezado($im, $pdf, 'Qué hacer en la próxima quincena', 'Recomendaciones');

    $reco = array_slice($reco, 0, 4);
    $alto = min(94.0, (Pdf::ALTO - $y - 70) / max(1, count($reco)) - 12);
    foreach ($reco as $i => $r) {
        r_caja($im, 56, $y, Pdf::ANCHO - 112, $alto, R_CARTA);
        r_barraDegradada($im, 56, $y, 3, $alto);
        r_hanson($im, (string)($i + 1), 84, $y + 42, 26, R_PUR3);
        $pdf->texto(122, $y + 30, $r['titulo'], 13, true, R_TXT);
        $etq = ['1' => 'ALTA', '2' => 'MEDIA', '3' => 'BAJA'][(string)$r['prioridad']] ?? '';
        $pdf->texto(Pdf::ANCHO - 80, $y + 30, 'PRIORIDAD ' . $etq, 7.5, true,
            $r['prioridad'] === 1 ? R_PUR3 : R_MUT2, 'der', 1.2);
        $yy = $pdf->parrafo(122, $y + 52, Pdf::ANCHO - 260, $r['texto'], 9.5, false, R_MUT, 1.4, 2);
        if (!empty($r['lista'])) {
            $pdf->texto(122, $yy + 4, implode('   ·   ', array_slice($r['lista'], 0, 2)), 8.5, false, R_MUT2);
        }
        $y += $alto + 12;
    }

    r_pie($im, $pdf, $n, $t, $pc);
    r_pagina($pdf, $im);
}

/* --- 10. cierre --- */
function r_cierre(Pdf $pdf, array $d, string $per): void
{
    $pdf->pagina();
    $im = r_lienzo();
    r_resplandor($im, 480, 720, 620, R_PUR, 0.66);
    r_resplandor($im, 990, -60, 380, R_PUR3, 0.40);
    r_reticula($im, 0, 0, Pdf::ANCHO, Pdf::ALTO, 24, 120);
    r_caja($im, 0, 0, Pdf::ANCHO, 4, R_PUR2);
    r_hanson($im, 'El siguiente', Pdf::ANCHO / 2, 250, 46, R_TXT, 'centro');
    r_hanson($im, 'reporte', Pdf::ANCHO / 2, 306, 46, R_PUR3, 'centro');
    r_barraDegradada($im, Pdf::ANCHO / 2 - 90, 340, 180, 2, false);

    $sig = date('Y-m-d', strtotime($d['periodo']['hasta'] . ' +' . REPORTE_DIAS . ' days'));
    $pdf->fondo(r_jpeg($im, 90), (int)(Pdf::ANCHO * R_ESCALA), (int)(Pdf::ALTO * R_ESCALA));
    $pdf->texto(Pdf::ANCHO / 2, 176, 'SE GENERA SOLO', 9, true, R_PUR3, 'centro', 2.2);
    $pdf->texto(Pdf::ANCHO / 2, 372, reporte_fecha_larga($sig), 14, false, R_TXT, 'centro');
    $pdf->texto(Pdf::ANCHO / 2, 400, 'Cubrirá del ' . reporte_fecha_larga(date('Y-m-d', strtotime($d['periodo']['hasta'] . ' +1 day')))
        . ' al ' . reporte_fecha_larga($sig), 9.5, false, R_MUT, 'centro');
    $pdf->texto(Pdf::ANCHO / 2, 462, 'INÉDITO DIGITAL · AGUASCALIENTES · inedito.digital', 9, true, '#CFC6DC', 'centro', 1.8);
}

/* ------------------------------------------------------------------ */

/**
 * Cierra el lienzo y lo adjunta como fondo de la lámina en curso.
 *
 * Se llama al final porque el fondo depende de lo que lleva encima: la
 * altura de la tabla de búsquedas, cuántas barras tiene la gráfica. El PDF
 * lo pinta debajo del texto aunque llegue después.
 */
function r_pagina(Pdf $pdf, $im): void
{
    $pdf->fondo(r_jpeg($im), (int)(Pdf::ANCHO * R_ESCALA), (int)(Pdf::ALTO * R_ESCALA));
}

function r_recorta(string $s, int $n): string
{
    return mb_strlen($s, 'UTF-8') > $n ? mb_substr($s, 0, $n - 1, 'UTF-8') . '…' : $s;
}
