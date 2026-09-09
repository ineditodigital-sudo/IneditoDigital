<?php
/**
 * El catálogo de espacios, para el componente del sitio.
 *
 * Sale de NUESTRA base, no de la API del proveedor: la página no puede caerse
 * porque un servidor ajeno tarde. La copia la refresca el cron una vez al día.
 *
 * Va aparte del contenido que se inyecta en cada página porque son 317
 * registros: meterlos en el arranque de todo el sitio sería cobrarle 60 KB a
 * quien entra a leer el blog.
 */
declare(strict_types=1);

$cfg = require __DIR__ . '/config.php';   // devuelve el arreglo, no lo asigna
require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=1800');   // media hora; el cron es diario

try {
    $pdo = db_connect($cfg);
    $ult = (string)$pdo->query("SELECT MAX(visto) FROM espectaculares")->fetchColumn();
    if ($ult === '') { echo json_encode(['espacios' => [], 'fecha' => null]); exit; }

    $st = $pdo->prepare("SELECT clave,titulo,tipo,colonia,direccion,zona,estatus,
                                referencia,medidas,altura,lat,lng
                         FROM espectaculares WHERE visto = :v
                         ORDER BY FIELD(estatus,'DISPONIBLE') DESC, zona, tipo, clave");
    $st->execute([':v' => $ult]);

    $espacios = [];
    foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $espacios[] = [
            'clave'  => $r['clave'],
            'titulo' => $r['titulo'],
            'tipo'   => $r['tipo'],
            'colonia'=> $r['colonia'],
            'calle'  => $r['direccion'],
            'zona'   => $r['zona'],
            'libre'  => $r['estatus'] === 'DISPONIBLE',
            'ref'    => $r['referencia'],
            'medidas'=> $r['medidas'],
            'altura' => $r['altura'] !== null ? (float)$r['altura'] : null,
            /* El precio NO sale. Es la tarifa del proveedor y publicarla es una
               decisión comercial de Inédito, no un detalle técnico. */
            'lat'    => $r['lat'] !== null ? (float)$r['lat'] : null,
            'lng'    => $r['lng'] !== null ? (float)$r['lng'] : null,
        ];
    }
    echo json_encode(['espacios' => $espacios, 'fecha' => $ult], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('[espectaculares] ' . $e->getMessage());
    http_response_code(503);
    echo json_encode(['espacios' => [], 'error' => 'no disponible']);
}
