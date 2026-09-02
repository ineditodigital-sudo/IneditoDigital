<?php require __DIR__ . '/bootstrap.php'; require_login();
$allowed = ['dashboard','analiticas','reportes','leads','contenido','clientes','paginas','nueva','miembros','buscadores','blog','servicios','portafolio','seo','ajustes'];
$p = preg_replace('/[^a-z]/', '', (string)($_GET['p'] ?? 'dashboard'));
if (!in_array($p, $allowed, true)) $p = 'dashboard';
$page = $p;

/*
 * El reporte quincenal, por si el cron no está puesto.
 *
 * Lo normal es que lo levante panel/cron/reporte_quincenal.php. Pero el cron
 * se instala a mano en cPanel y es fácil que se quede pendiente —al de
 * Search Console le pasó—, así que abrir el panel también lo dispara cuando
 * ya toca. Reunir los datos son ocho consultas y unos milisegundos; el PDF,
 * que sí cuesta, se arma solo cuando alguien lo pide.
 *
 * Si algo falla aquí no puede tumbar el panel: el reporte es un extra, no la
 * razón por la que alguien entró.
 */
try {
    require_once __DIR__ . '/inc/reporte.php';
    if (reporte_toca()) reporte_crear();
} catch (Throwable $e) { /* se verá en Reportes, con su botón para reintentar */ }

require __DIR__ . '/inc/header.php';
require __DIR__ . "/pages/$p.php";
require __DIR__ . '/inc/footer.php';
