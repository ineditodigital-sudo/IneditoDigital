<?php
/*
 * Prueba de la sincronización de opiniones (panel/inc/resenas.php) sin tocar
 * Google ni la base: SQLite en memoria y respuestas de Google simuladas.
 *
 *   php scripts/probar_resenas.php
 *
 * Córrela antes de desplegar cambios en resenas.php. Revisa que se emparejen
 * las copiadas, se conserven o suelten las traducciones, se retiren las
 * borradas, se expliquen los errores de la API y se armen bien los nombres.
 */
declare(strict_types=1);

class PdoPrueba extends PDO {
    public function exec(string $sql): int|false {
        if (stripos($sql, 'ENGINE=InnoDB') !== false) return 0; // la tabla se crea abajo, a la manera de SQLite
        return parent::exec($sql);
    }
}
function nueva_base(): PdoPrueba {
    $p = new PdoPrueba('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $p->sqliteCreateFunction('CHAR_LENGTH', fn($s) => mb_strlen((string)$s), 1);
    $p->exec("CREATE TABLE resenas_google (id INTEGER PRIMARY KEY AUTOINCREMENT, google_id TEXT UNIQUE, autor TEXT NOT NULL DEFAULT '',
      estrellas INT NOT NULL DEFAULT 5, texto TEXT NOT NULL, texto_en TEXT, fecha TEXT NOT NULL, fecha_aprox INT NOT NULL DEFAULT 0,
      actualizada TEXT, origen TEXT NOT NULL DEFAULT 'google', visible INT NOT NULL DEFAULT 1, creada TEXT)");
    return $p;
}
$PDO = nueva_base();
function db(): PDO { return $GLOBALS['PDO']; }
$G = [];
function g_all(): array { return $GLOBALS['G']; }
function g_get(string $k, string $d = ''): string { return $GLOBALS['G'][$k] ?? $d; }
function g_save(array $d): void { foreach ($d as $k => $v) $GLOBALS['G'][$k] = (string)$v; }
function g_del(string $k): void { unset($GLOBALS['G'][$k]); }
function g_access_token(): ?string { return 'tok'; }
$RESP = []; $URLS = [];
function g_http(string $url, $post = null, array $h = []): array {
    $GLOBALS['URLS'][] = $url;
    return array_shift($GLOBALS['RESP']) ?? ['code' => 500, 'json' => null];
}
require __DIR__ . '/../panel/inc/resenas.php';

$fallas = 0;
function ok(bool $c, string $m): void { global $fallas; echo ($c ? '  ok   ' : '  FALLA ') . $m . "\n"; if (!$c) $fallas++; }
function rv(string $id, string $autor, string $est, ?string $txt, string $t = '2026-08-20T15:00:00Z'): array {
    $r = ['reviewId' => $id, 'reviewer' => ['displayName' => $autor, 'isAnonymous' => false], 'starRating' => $est, 'createTime' => $t, 'updateTime' => $t];
    if ($txt !== null) $r['comment'] = $txt;
    return $r;
}
function fila(string $autor): ?array { $s = db()->prepare('SELECT * FROM resenas_google WHERE autor = ?'); $s->execute([$autor]); return $s->fetch() ?: null; }
$ins = fn($a, $t, $en) => db()->prepare("INSERT INTO resenas_google (autor, estrellas, texto, texto_en, fecha, fecha_aprox, origen) VALUES (?, 5, ?, ?, '2026-08-21 12:00:00', 1, 'copiada')")->execute([$a, $t, $en]);

echo "== A · primera sincronizacion: descubre la ficha, empareja las copiadas, pagina en dos ==\n";
$ins('NANCY SORIA', 'Excelente servicio.', 'Excellent service.');
$ins('Mario Ocampo', 'Rapidez en la entrega.', 'Fast delivery.');
$ins('Georgette Cuellar Elizalde', '', null);
$RESP = [
    ['code' => 200, 'json' => ['accounts' => [['name' => 'accounts/111']]]],
    ['code' => 200, 'json' => ['locations' => [['name' => 'locations/9', 'title' => 'Otra cosa'], ['name' => 'locations/7', 'title' => 'Inedito Digital']]]],
    ['code' => 200, 'json' => ['reviews' => [rv('g1', 'NANCY SORIA', 'FIVE', 'Excelente servicio.'), rv('g2', 'Mario Ocampo', 'FIVE', 'Rapidez en la entrega del sitio.')], 'nextPageToken' => 'p2', 'totalReviewCount' => 4]],
    ['code' => 200, 'json' => ['reviews' => [rv('g3', 'Georgette Cuellar Elizalde', 'FIVE', null), rv('g4', 'Cliente Nuevo', 'FOUR', "Buen trabajo\n\n(Translated by Google)\nGood job")]]],
];
$r = resenas_sincronizar();
ok($r['ok'] === true, 'sincroniza: ' . ($r['resumen'] ?? $r['error'] ?? ''));
ok(g_get('gbp_ubicacion') === 'accounts/111/locations/7', 'elige la ficha que se llama Inedito: ' . g_get('gbp_ubicacion'));
ok(str_contains($URLS[2], 'accounts/111/locations/7/reviews?pageSize=50&orderBy=updateTime%20desc'), 'pide reseñas con orden y tamaño de página');
ok(str_contains($URLS[3], 'pageToken=p2'), 'pide la segunda página');
ok($r['emparejadas'] === 3 && $r['nuevas'] === 1 && $r['retiradas'] === 0, "3 emparejadas, 1 nueva, 0 retiradas ({$r['emparejadas']}/{$r['nuevas']}/{$r['retiradas']})");
$n = fila('NANCY SORIA');
ok($n['google_id'] === 'g1' && $n['origen'] === 'google' && (int)$n['fecha_aprox'] === 0, 'Nancy: id de Google, origen google, fecha exacta');
ok($n['texto_en'] === 'Excellent service.', 'Nancy: conserva la traducción (mismo texto)');
$m = fila('Mario Ocampo');
ok($m['texto'] === 'Rapidez en la entrega del sitio.' && $m['texto_en'] === null, 'Mario: toma el texto de Google y suelta la traducción vieja');
ok(fila('Cliente Nuevo')['texto'] === 'Buen trabajo', 'quita la traducción automática pegada al texto');
ok((int)db()->query('SELECT COUNT(*) FROM resenas_google')->fetchColumn() === 4, 'quedan 4 filas');
$pub = resenas_publicas(db());
ok($pub['total'] === 4 && $pub['promedio'] === 4.8, "resumen: {$pub['total']} opiniones, promedio {$pub['promedio']}");
ok(count($pub['lista']) === 2 && $pub['lista'][0]['nombre'] === 'Mario O.', 'en el sitio solo las de 5 con texto, misma fecha: la mas larga primero: ' . implode(', ', array_column($pub['lista'], 'nombre')));
ok(g_get('resenas_error') === '' && g_get('resenas_sync') !== '', 'guarda la hora y limpia el error');

echo "\n== B · segunda: una editada, una borrada en Google, nada nuevo ==\n";
$URLS = [];
$RESP = [['code' => 200, 'json' => ['reviews' => [
    rv('g1', 'NANCY SORIA', 'FIVE', 'Excelente servicio, muy recomendados.'),
    rv('g2', 'Mario Ocampo', 'FIVE', 'Rapidez en la entrega del sitio.'),
    rv('g4', 'Cliente Nuevo', 'FOUR', 'Buen trabajo'),
]]]];
$r = resenas_sincronizar();
ok(count($URLS) === 1, 'ya no busca la ficha: usa la guardada');
ok($r['editadas'] === 1 && $r['retiradas'] === 1 && $r['nuevas'] === 0, "1 editada, 1 retirada, 0 nuevas ({$r['editadas']}/{$r['retiradas']}/{$r['nuevas']})");
ok(fila('NANCY SORIA')['texto_en'] === null, 'Nancy editó: la traducción ya no corresponde y se suelta');
ok(fila('Georgette Cuellar Elizalde') === null, 'Georgette ya no está en Google: se retira');

echo "\n== C · Google todavía no aprueba la API ==\n";
$RESP = [['code' => 429, 'json' => ['error' => ['code' => 429, 'message' => "Quota exceeded for quota metric 'Requests' and limit 'Requests per minute' of service 'mybusiness.googleapis.com'", 'status' => 'RESOURCE_EXHAUSTED']]]];
$r = resenas_sincronizar();
ok($r['ok'] === false && str_contains($r['error'], 'todavía no aprueba'), 'explica la cuota: ' . $r['error']);
ok(g_get('resenas_error') === $r['error'], 'guarda el error para el panel');
ok((int)db()->query('SELECT COUNT(*) FROM resenas_google')->fetchColumn() === 3, 'no toca nada');
$RESP = [['code' => 403, 'json' => ['error' => ['code' => 403, 'message' => 'Request had insufficient authentication scopes.', 'status' => 'PERMISSION_DENIED', 'details' => [['reason' => 'ACCESS_TOKEN_SCOPE_INSUFFICIENT']]]]]];
$r = resenas_sincronizar();
ok(str_contains($r['error'], 'Reconectar Google'), 'explica el permiso faltante: ' . $r['error']);

echo "\n== D · otra ficha: ninguna copiada coincide, no se borran ==\n";
$PDO = nueva_base(); $G = ['gbp_ubicacion' => 'accounts/1/locations/2'];
$ins('NANCY SORIA', 'Excelente servicio.', null);
$ins('Mario Ocampo', 'Rapidez.', null);
$RESP = [['code' => 200, 'json' => ['reviews' => [rv('x1', 'Persona Ajena', 'FIVE', 'Muy bien')]]]];
$r = resenas_sincronizar();
ok($r['ok'] && $r['emparejadas'] === 0 && $r['retiradas'] === 0, 'no empareja ni retira: ' . $r['resumen']);
ok((int)db()->query("SELECT COUNT(*) FROM resenas_google WHERE origen = 'copiada'")->fetchColumn() === 2, 'las copiadas siguen ahí');

echo "\n== E · nombres para el sitio ==\n";
foreach (['NANCY SORIA' => 'Nancy S.', 'nancy esparza' => 'Nancy E.', 'JLuis Elizondo' => 'JLuis E.', 'Juan José Cervantes M.' => 'Juan J.',
          'Madonna' => 'Madonna', 'ÁLVARO ÑUÑEZ' => 'Álvaro Ñ.', '' => 'Cliente de Google'] as $en => $sale) {
    ok(resenas_nombre_publico($en) === $sale, "«{$en}» -> «" . resenas_nombre_publico($en) . "»");
}

echo $fallas ? "\n$fallas FALLAS\n" : "\nTODO BIEN\n";
exit($fallas ? 1 : 0);
