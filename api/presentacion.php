<?php
/**
 * La presentación de servicios, tal como está PUBLICADA en el panel.
 *
 * Devuelve {ok:true, datos:null} mientras nadie haya publicado: el deck usa
 * entonces el respaldo que trae el código. El borrador nunca sale de aquí; la
 * vista previa del panel se lo pasa al deck por postMessage, sin pasar por la
 * red.
 *
 * Sin caché: quien publica quiere ver el cambio al recargar, no treinta
 * segundos después. Pesa unos kilobytes y el deck se abre pocas veces al día.
 */
declare(strict_types=1);
$cfg = require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
header('X-Robots-Tag: noindex');
require __DIR__ . '/db.php';

try {
    $q = db_connect($cfg)->prepare(
        "SELECT contenido FROM pages WHERE slug = 'presentacion' AND tipo = 'presentacion' AND status = 'published' LIMIT 1"
    );
    $q->execute();
    $c = $q->fetchColumn();
    $d = is_string($c) ? json_decode($c, true) : null;
    echo json_encode(['ok' => true, 'datos' => is_array($d) ? $d : null], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'datos' => null]);
}
