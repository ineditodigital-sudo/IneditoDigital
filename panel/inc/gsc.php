<?php
/**
 * Search Console: la lógica que comparten el cron diario y el botón
 * "Actualizar ahora" del panel.
 *
 * El trabajo pesado —inspeccionar URL por URL— tarda uno o dos minutos para
 * todo el sitemap, y Cloudflare corta cualquier respuesta a los 100 s. Por
 * eso está partido en funciones: el cron (CLI, sin Cloudflare) las corre de
 * un tirón, y el panel las corre por lotes desde gsc_paso.php, contestando
 * en segundos cada vez.
 */
declare(strict_types=1);

function gsc_tablas(): void {
    db()->exec("CREATE TABLE IF NOT EXISTS gsc_indexacion (
      fecha DATE NOT NULL,
      url VARCHAR(255) NOT NULL,
      estado VARCHAR(120) NOT NULL,
      ultimo_rastreo DATE NULL,
      PRIMARY KEY (fecha, url)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    db()->exec("CREATE TABLE IF NOT EXISTS gsc_totales (
      fecha DATE NOT NULL PRIMARY KEY,
      clics INT NOT NULL DEFAULT 0,
      impresiones INT NOT NULL DEFAULT 0,
      ctr DECIMAL(6,3) NOT NULL DEFAULT 0,
      posicion DECIMAL(6,2) NOT NULL DEFAULT 0,
      indexadas INT NOT NULL DEFAULT 0,
      sin_indexar INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    db()->exec("CREATE TABLE IF NOT EXISTS gsc_consultas (
      fecha DATE NOT NULL,
      consulta VARCHAR(255) NOT NULL,
      clics INT NOT NULL DEFAULT 0,
      impresiones INT NOT NULL DEFAULT 0,
      posicion DECIMAL(6,2) NOT NULL DEFAULT 0,
      PRIMARY KEY (fecha, consulta)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

/** Las URLs del sitemap, tal como las conoce el sitio. */
function gsc_urls_sitemap(): array {
    $ch = curl_init('https://www.inedito.digital/sitemap.xml');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20]);
    $xml = (string)curl_exec($ch);
    curl_close($ch);
    preg_match_all('~<loc>([^<]+)</loc>~', $xml, $m);
    return $m[1];
}

function gsc_consulta_api(string $sitio, string $tok, array $cuerpo): array {
    $u = 'https://www.googleapis.com/webmasters/v3/sites/' . rawurlencode($sitio) . '/searchAnalytics/query';
    $r = g_http($u, json_encode($cuerpo), ['Authorization: Bearer ' . $tok, 'Content-Type: application/json']);
    return $r['json'] ?? [];
}

/**
 * Rendimiento de 28 días (con el retraso de 2 que trae Google) y las
 * consultas. Toca solo esas columnas: los conteos de indexación los pone
 * gsc_cerrar_dia() cuando la inspección termina, en cualquier orden.
 */
function gsc_guardar_rendimiento(string $tok, string $sitio, string $hoy): array {
    $hasta = date('Y-m-d', strtotime('-2 days'));
    $desde = date('Y-m-d', strtotime('-30 days'));

    $t = gsc_consulta_api($sitio, $tok, ['startDate' => $desde, 'endDate' => $hasta, 'dimensions' => []]);
    $fila = $t['rows'][0] ?? null;
    $tot = [
        'clics' => (int)($fila['clicks'] ?? 0),
        'impresiones' => (int)($fila['impressions'] ?? 0),
        'ctr' => round((float)($fila['ctr'] ?? 0) * 100, 3),
        'posicion' => round((float)($fila['position'] ?? 0), 2),
    ];
    db()->prepare("INSERT INTO gsc_totales (fecha,clics,impresiones,ctr,posicion) VALUES (:f,:c,:i,:t,:p)
                   ON DUPLICATE KEY UPDATE clics=VALUES(clics), impresiones=VALUES(impresiones),
                                           ctr=VALUES(ctr), posicion=VALUES(posicion)")
      ->execute([':f' => $hoy, ':c' => $tot['clics'], ':i' => $tot['impresiones'], ':t' => $tot['ctr'], ':p' => $tot['posicion']]);

    $q = gsc_consulta_api($sitio, $tok, ['startDate' => $desde, 'endDate' => $hasta, 'dimensions' => ['query'], 'rowLimit' => 500]);
    $st = db()->prepare("INSERT INTO gsc_consultas (fecha,consulta,clics,impresiones,posicion) VALUES (:f,:c,:cl,:i,:p)
                         ON DUPLICATE KEY UPDATE clics=VALUES(clics), impresiones=VALUES(impresiones), posicion=VALUES(posicion)");
    $n = 0;
    foreach (($q['rows'] ?? []) as $r) {
        $st->execute([':f' => $hoy, ':c' => mb_substr($r['keys'][0], 0, 255), ':cl' => (int)$r['clicks'],
                      ':i' => (int)$r['impressions'], ':p' => round((float)$r['position'], 2)]);
        $n++;
    }
    $tot['consultas'] = $n;
    return $tot;
}

/** Inspecciona un puñado de URLs y guarda el estado de cada una. */
function gsc_inspeccionar(string $tok, string $sitio, array $urls, string $hoy): void {
    $ins = db()->prepare("INSERT INTO gsc_indexacion (fecha,url,estado,ultimo_rastreo) VALUES (:f,:u,:e,:r)
                          ON DUPLICATE KEY UPDATE estado=VALUES(estado), ultimo_rastreo=VALUES(ultimo_rastreo)");
    foreach ($urls as $u) {
        $r = g_http('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
            json_encode(['inspectionUrl' => $u, 'siteUrl' => $sitio, 'languageCode' => 'es-MX']),
            ['Authorization: Bearer ' . $tok, 'Content-Type: application/json']);
        $s = $r['json']['inspectionResult']['indexStatusResult'] ?? null;
        if (!$s) continue;
        $estado = (string)($s['coverageState'] ?? 'desconocido');
        $rastreo = !empty($s['lastCrawlTime']) ? substr($s['lastCrawlTime'], 0, 10) : null;
        $ins->execute([':f' => $hoy, ':u' => mb_substr($u, 0, 255), ':e' => mb_substr($estado, 0, 120), ':r' => $rastreo]);
        usleep(60000);
    }
}

/** Un estado cuenta como "dentro del índice" si dice indexada y no lo niega. */
function gsc_es_indexada(string $estado): bool {
    return stripos($estado, 'indexada') !== false && stripos($estado, 'sin indexar') === false;
}

/**
 * Cierra la foto del día: cuenta dentro/fuera a partir de lo inspeccionado
 * y devuelve los cambios de estado contra la foto anterior.
 */
function gsc_cerrar_dia(string $hoy): array {
    $filas = db()->prepare("SELECT estado, COUNT(*) c FROM gsc_indexacion WHERE fecha = :f GROUP BY estado");
    $filas->execute([':f' => $hoy]);
    $ix = 0; $fuera = 0;
    foreach ($filas->fetchAll() as $r) {
        gsc_es_indexada($r['estado']) ? $ix += (int)$r['c'] : $fuera += (int)$r['c'];
    }
    db()->prepare("INSERT INTO gsc_totales (fecha,indexadas,sin_indexar) VALUES (:f,:ix,:si)
                   ON DUPLICATE KEY UPDATE indexadas=VALUES(indexadas), sin_indexar=VALUES(sin_indexar)")
      ->execute([':f' => $hoy, ':ix' => $ix, ':si' => $fuera]);

    $cambios = [];
    $ant = db()->prepare("SELECT MAX(fecha) FROM gsc_indexacion WHERE fecha < :f");
    $ant->execute([':f' => $hoy]);
    $ant = $ant->fetchColumn();
    if ($ant) {
        $q = db()->prepare("SELECT h.url, v.estado AS antes, h.estado AS ahora
                            FROM gsc_indexacion h JOIN gsc_indexacion v ON v.url = h.url AND v.fecha = :a
                            WHERE h.fecha = :h AND h.estado <> v.estado");
        $q->execute([':a' => $ant, ':h' => $hoy]);
        $cambios = $q->fetchAll();
    }
    return ['indexadas' => $ix, 'fuera' => $fuera, 'anterior' => $ant ?: null, 'cambios' => $cambios];
}
