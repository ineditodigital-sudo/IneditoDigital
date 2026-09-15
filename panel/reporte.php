<?php
/**
 * Entrega el PDF de un reporte.
 *
 * Se genera en el momento a partir de la foto guardada, no se guarda el
 * archivo: los datos ya están congelados en `reportes`, así que el PDF sale
 * idéntico las mil veces que se pida y no hay que administrar una carpeta de
 * archivos viejos. Tres segundos de CPU valen menos que un directorio que
 * nadie limpia.
 */
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
require_login();
require_once __DIR__ . '/inc/reporte.php';
require_once __DIR__ . '/inc/reporte_pdf.php';

$id = (int)($_GET['id'] ?? 0);
$d = $id ? reporte_cargar($id) : null;
if (!$d) { http_response_code(404); exit('No existe ese reporte.'); }

$nombre = 'Inedito-reporte-' . $d['periodo']['desde'] . '_' . $d['periodo']['hasta'] . '.pdf';

try {
    $pdf = reporte_pdf($d);
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    exit('No se pudo generar el PDF: ' . $e->getMessage());
}

while (ob_get_level() > 0) ob_end_clean();

/*
 * El visor del panel es un <iframe> que apunta aquí, y bootstrap.php manda
 * `X-Frame-Options: DENY` a todo el panel. DENY prohíbe el marco incluso
 * desde el propio dominio —esa es la diferencia con SAMEORIGIN—, así que la
 * vista previa salía siempre como ERR_BLOCKED_BY_RESPONSE: «rechazó la
 * conexión». El botón de descargar sí funcionaba, porque eso es una
 * navegación y no un marco.
 *
 * Se relaja SOLO aquí y solo a SAMEORIGIN, que es el único sitio del panel
 * pensado para verse dentro de otra página. El resto sigue en DENY: la
 * protección que importa —que un sitio ajeno enmarque el panel para robarte
 * los clics— se mantiene intacta en los dos casos.
 *
 * Va acompañado de frame-ancestors, que es lo que miran los navegadores
 * nuevos y gana a X-Frame-Options cuando están los dos.
 */
header('X-Frame-Options: SAMEORIGIN');
header("Content-Security-Policy: frame-ancestors 'self'");

header('Content-Type: application/pdf');
header('Content-Length: ' . strlen($pdf));
/* `inline` para poder verlo dentro del panel; con ?bajar=1 se descarga. */
header('Content-Disposition: ' . (isset($_GET['bajar']) ? 'attachment' : 'inline') . '; filename="' . $nombre . '"');
header('Cache-Control: private, max-age=600');
echo $pdf;
