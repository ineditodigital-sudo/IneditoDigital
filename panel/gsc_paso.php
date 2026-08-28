<?php
/**
 * Un paso de la sincronización con Search Console, para el botón del panel.
 *
 * El navegador lo llama en cadena: primero fase "inicio" (rendimiento y
 * consultas, una llamada rápida), luego "urls" tantas veces como haga falta
 * (LOTE URLs inspeccionadas por viaje, ~10 s), y al final "cierre" (conteos
 * y cambios contra ayer). Cada respuesta llega mucho antes del corte de
 * 100 s de Cloudflare, que era lo que mataba al botón viejo.
 */
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/inc/google.php';
require_once __DIR__ . '/inc/gsc.php';

require_login();
header('Content-Type: application/json; charset=utf-8');
@set_time_limit(90);

function json_salir(array $d): void {
    while (ob_get_level() > 0) ob_end_clean();
    echo json_encode($d, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json_salir(['error' => 'Método no permitido.']);
if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) json_salir(['error' => 'Sesión inválida. Recarga la página.']);

const LOTE = 6;

$fase = (string)($_POST['fase'] ?? 'inicio');
$offset = max(0, (int)($_POST['offset'] ?? 0));
$hoy = date('Y-m-d');

$tok = g_access_token();
if (!$tok) json_salir(['error' => 'Falta conectar Google (abajo, en «Conexión con Google»).']);
$sitio = g_get('sc_site', 'sc-domain:inedito.digital');

try {
    gsc_tablas();

    if ($fase === 'inicio') {
        $tot = gsc_guardar_rendimiento($tok, $sitio, $hoy);
        $total = count(gsc_urls_sitemap());
        json_salir([
            'fase' => 'urls', 'offset' => 0, 'total' => $total,
            'msg' => 'Rendimiento guardado: ' . number_format($tot['impresiones']) . ' impresiones · '
                   . $tot['clics'] . ' clics · ' . $tot['consultas'] . ' consultas.',
        ]);
    }

    if ($fase === 'urls') {
        $urls = gsc_urls_sitemap();
        $total = count($urls);
        $lote = array_slice($urls, $offset, LOTE);
        gsc_inspeccionar($tok, $sitio, $lote, $hoy);
        $hecho = min($offset + LOTE, $total);
        if ($hecho >= $total) {
            json_salir(['fase' => 'cierre', 'offset' => 0, 'total' => $total, 'hecho' => $total,
                        'msg' => "Inspeccionadas $total páginas."]);
        }
        json_salir(['fase' => 'urls', 'offset' => $hecho, 'total' => $total, 'hecho' => $hecho,
                    'msg' => "Inspeccionando páginas… $hecho de $total"]);
    }

    if ($fase === 'cierre') {
        $fin = gsc_cerrar_dia($hoy);
        $msg = $fin['indexadas'] . ' dentro del índice · ' . $fin['fuera'] . ' fuera.';
        if ($fin['cambios']) $msg .= ' ' . count($fin['cambios']) . ' páginas cambiaron de estado.';
        json_salir(['fase' => 'fin', 'msg' => $msg]);
    }

    json_salir(['error' => 'Fase desconocida.']);
} catch (Throwable $e) {
    json_salir(['error' => 'Algo falló hablando con Google: ' . $e->getMessage()]);
}
