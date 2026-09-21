<?php
/**
 * Las opiniones de Google: de la ficha de Inédito al carrusel del sitio.
 *
 * Se leen con la API de Perfil de Empresa (la única que entrega TODAS las
 * reseñas de una ficha propia; la de Places solo da cinco y prohíbe
 * guardarlas). Usa la misma conexión de Google del panel, con un permiso
 * más: business.manage.
 *
 * Mientras Google no apruebe el acceso a esa API (la cuota empieza en cero y
 * se pide con un formulario), el carrusel vive de las reseñas copiadas a
 * mano, que se marcan como «copiada». En cuanto la sincronización funcione,
 * cada copiada se empareja con su original —Google solo deja una reseña por
 * cuenta y ficha, así que el autor basta— y hereda su fecha exacta; la
 * traducción al inglés, si el texto no cambió, se conserva.
 *
 * El sitio (render.php) solo usa resenas_publicas(), que no escribe nada.
 * Todo lo demás necesita el arranque del panel (db(), g_*).
 */
declare(strict_types=1);

const RESENAS_FICHA = 'https://maps.app.goo.gl/BTCS2Ma71gFEfixW7';

/* ------------------------------------------------------------ la tabla */

function resenas_tabla(?PDO $pdo = null): void {
    ($pdo ?? db())->exec("CREATE TABLE IF NOT EXISTS resenas_google (
      id INT AUTO_INCREMENT PRIMARY KEY,
      google_id VARCHAR(191) NULL,
      autor VARCHAR(160) NOT NULL DEFAULT '',
      estrellas TINYINT NOT NULL DEFAULT 5,
      texto TEXT NOT NULL,
      texto_en TEXT NULL,
      fecha DATETIME NOT NULL,
      fecha_aprox TINYINT(1) NOT NULL DEFAULT 0,
      actualizada DATETIME NULL,
      origen VARCHAR(10) NOT NULL DEFAULT 'google',
      visible TINYINT(1) NOT NULL DEFAULT 1,
      creada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY google_id (google_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

/* ------------------------------------------------------ lo que ve el sitio */

/**
 * «NANCY SORIA» → «Nancy S.». El nombre completo se queda en el panel: en el
 * sitio basta con el nombre y la inicial, como en cualquier testimonio.
 */
function resenas_nombre_publico(string $nombre): string {
    $partes = preg_split('/\s+/u', trim($nombre), -1, PREG_SPLIT_NO_EMPTY) ?: [];
    if (!$partes) return 'Cliente de Google';
    // Todo en mayúsculas o todo en minúsculas se lee mejor con la primera en
    // alto; «JLuis» ya viene como su dueño lo quiso.
    $bonito = static function (string $p): string {
        if ($p !== mb_strtoupper($p) && $p !== mb_strtolower($p)) return $p;
        return mb_strtoupper(mb_substr($p, 0, 1)) . mb_strtolower(mb_substr($p, 1));
    };
    $n = $bonito($partes[0]);
    if (count($partes) === 1) return $n;
    return $n . ' ' . mb_strtoupper(mb_substr($partes[1], 0, 1)) . '.';
}

/**
 * Lo que el carrusel necesita: el resumen de la ficha y las reseñas de cinco
 * estrellas con texto, las más recientes primero. null si no hay ninguna (o
 * si la tabla todavía no existe): el sitio entonces no pinta la sección.
 */
function resenas_publicas(PDO $pdo, string $ficha = '', int $max = 40): ?array {
    try {
        $sum = $pdo->query("SELECT COUNT(*) AS n, AVG(estrellas) AS p FROM resenas_google")->fetch(PDO::FETCH_ASSOC);
        $st = $pdo->prepare("SELECT autor, texto, texto_en, fecha, fecha_aprox FROM resenas_google
                              WHERE visible = 1 AND estrellas = 5 AND texto <> ''
                              ORDER BY fecha DESC, CHAR_LENGTH(texto) DESC LIMIT " . max(1, $max));
        $st->execute();
        $lista = [];
        foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
            $lista[] = [
                'nombre'   => resenas_nombre_publico((string)$r['autor']),
                'texto'    => (string)$r['texto'],
                'texto_en' => (string)($r['texto_en'] ?? ''),
                'fecha'    => substr((string)$r['fecha'], 0, 10),
                'aprox'    => (bool)$r['fecha_aprox'],
            ];
        }
    } catch (Throwable $e) {
        return null;
    }
    if (!$lista) return null;
    return [
        'promedio' => round((float)$sum['p'], 1),
        'total'    => (int)$sum['n'],
        'url'      => $ficha !== '' ? $ficha : RESENAS_FICHA,
        'lista'    => $lista,
    ];
}

/* ------------------------------------------------ sincronizar con Google */

/** El estado de la última sincronización, para el panel. */
function resenas_estado(): array {
    $g = g_all();
    return [
        'conectado' => !empty($g['refresh_token']),
        'intento'   => $g['resenas_intento'] ?? '',
        'sync'      => $g['resenas_sync'] ?? '',
        'error'     => $g['resenas_error'] ?? '',
        'resultado' => $g['resenas_resultado'] ?? '',
        'ubicacion' => $g['gbp_ubicacion'] ?? '',
        'ficha'     => $g['gbp_nombre'] ?? '',
    ];
}

/** ¿Ya toca intentar? Cuenta el último INTENTO, no el último éxito: mientras
    Google no apruebe la API, fallar una vez al día basta. */
function resenas_toca(int $horas = 20): bool {
    $i = g_get('resenas_intento');
    return $i === '' || strtotime($i) < time() - $horas * 3600;
}

/** Lo que Google contestó, dicho de forma que alguien sepa qué hacer. */
function resenas_explicar(array $r): string {
    $code = (int)($r['code'] ?? 0);
    $err = $r['json']['error'] ?? [];
    $msg = is_array($err) ? (string)($err['message'] ?? '') : (string)$err;
    $raw = strtolower($msg . ' ' . json_encode($r['json'] ?? []));
    if ($code === 0) return 'No hubo respuesta de Google (red o tiempo de espera). Se reintenta mañana.';
    if ($code === 401) return 'Google rechazó la sesión. Vuelve a conectar Google.';
    if (strpos($raw, 'scope') !== false) return 'Falta el permiso de Perfil de Empresa: pulsa «Reconectar Google» y acepta todos los permisos.';
    if (strpos($raw, 'has not been used') !== false || strpos($raw, 'service_disabled') !== false || strpos($raw, 'is disabled') !== false)
        return 'La API de Perfil de Empresa no está activada en el proyecto de Google Cloud (ver los pasos abajo).';
    if ($code === 429 || strpos($raw, 'quota') !== false || strpos($raw, 'rate') !== false || strpos($raw, 'resource_exhausted') !== false)
        return 'Google todavía no aprueba el acceso a la API de Perfil de Empresa (la cuota sigue en cero). Mientras tanto, el sitio muestra las copiadas.';
    if ($code === 404) return 'Google no encontró la ficha guardada; la próxima vez se busca de nuevo.';
    return "Google respondió $code" . ($msg !== '' ? ": $msg" : '.');
}

function resenas_fallo(string $error): array {
    g_save(['resenas_error' => $error]);
    return ['ok' => false, 'error' => $error];
}

/**
 * La ficha a leer, como la quiere la API de reseñas:
 * «accounts/{cuenta}/locations/{ficha}». Si la cuenta administra varias, la
 * que se llama Inédito.
 */
function resenas_buscar_ubicacion(string $tok): array {
    $auth = ['Authorization: Bearer ' . $tok];
    $r = g_http('https://mybusinessaccountmanagement.googleapis.com/v1/accounts?pageSize=20', null, $auth);
    if ($r['code'] !== 200) return ['ok' => false, 'error' => resenas_explicar($r)];
    $candidatas = []; $ultimoError = '';
    foreach (($r['json']['accounts'] ?? []) as $cuenta) {
        $l = g_http('https://mybusinessbusinessinformation.googleapis.com/v1/' . $cuenta['name']
                    . '/locations?readMask=name,title&pageSize=100', null, $auth);
        if ($l['code'] !== 200) { $ultimoError = resenas_explicar($l); continue; }
        foreach (($l['json']['locations'] ?? []) as $loc) {
            $candidatas[] = ['ubicacion' => $cuenta['name'] . '/' . $loc['name'], 'titulo' => (string)($loc['title'] ?? '')];
        }
    }
    $ined = array_values(array_filter($candidatas, static fn($c) => preg_match('/in[eé]dito/iu', $c['titulo'])));
    if (count($ined) === 1) return ['ok' => true] + $ined[0];
    if (count($candidatas) === 1) return ['ok' => true] + $candidatas[0];
    if (!$candidatas) return ['ok' => false, 'error' => $ultimoError !== '' ? $ultimoError
        : 'La cuenta de Google conectada no administra ninguna ficha de empresa. Conecta la cuenta dueña de la ficha de Inédito.'];
    return ['ok' => false, 'error' => 'La cuenta administra ' . count($candidatas) . ' fichas y no se pudo saber cuál es la de Inédito.'];
}

/** Si Google entrega la reseña con su traducción pegada, se queda la original. */
function resenas_texto_original(string $t): string {
    $t = trim(str_replace("\r\n", "\n", $t));
    if (($p = mb_strpos($t, '(Original)')) !== false) return trim(mb_substr($t, $p + mb_strlen('(Original)')));
    if (($p = mb_strpos($t, '(Translated by Google)')) !== false) return trim(mb_substr($t, 0, $p));
    return $t;
}

/** Para comparar autores: sin acentos, sin mayúsculas, sin espacios dobles. */
function resenas_norm(string $s): string {
    $s = mb_strtolower(trim(preg_replace('/\s+/u', ' ', $s)));
    return strtr($s, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n']);
}

/**
 * Trae todas las reseñas de la ficha y deja la tabla igual que Google:
 * agrega las nuevas, actualiza las editadas, retira las borradas y empareja
 * las copiadas a mano. Lo corre el cron diario y el botón del panel.
 */
function resenas_sincronizar(): array {
    resenas_tabla();
    g_save(['resenas_intento' => date('c')]);

    $tok = g_access_token();
    if (!$tok) return resenas_fallo('Google no está conectado. Conéctalo desde Analíticas.');

    $loc = g_get('gbp_ubicacion');
    if ($loc === '') {
        $u = resenas_buscar_ubicacion($tok);
        if (!$u['ok']) return resenas_fallo($u['error']);
        $loc = $u['ubicacion'];
        g_save(['gbp_ubicacion' => $loc, 'gbp_nombre' => $u['titulo']]);
    }

    $auth = ['Authorization: Bearer ' . $tok];
    $todas = []; $pagina = ''; $vueltas = 0;
    do {
        $url = 'https://mybusiness.googleapis.com/v4/' . $loc . '/reviews?pageSize=50&orderBy=' . rawurlencode('updateTime desc')
             . ($pagina !== '' ? '&pageToken=' . rawurlencode($pagina) : '');
        $r = g_http($url, null, $auth);
        if ($r['code'] === 404) g_del('gbp_ubicacion');
        if ($r['code'] !== 200) return resenas_fallo(resenas_explicar($r));
        foreach (($r['json']['reviews'] ?? []) as $rv) $todas[] = $rv;
        $pagina = (string)($r['json']['nextPageToken'] ?? '');
    } while ($pagina !== '' && ++$vueltas < 40);
    $completa = $pagina === '';

    $pdo = db();
    $porGoogle = []; $copiadas = [];
    foreach ($pdo->query("SELECT * FROM resenas_google")->fetchAll(PDO::FETCH_ASSOC) as $f) {
        if ($f['google_id'] !== null && $f['google_id'] !== '') $porGoogle[$f['google_id']] = $f;
        else $copiadas[(int)$f['id']] = $f;
    }
    $habiaCopiadas = count($copiadas);
    $ESTRELLAS = ['ONE' => 1, 'TWO' => 2, 'THREE' => 3, 'FOUR' => 4, 'FIVE' => 5];
    $n = ['recibidas' => count($todas), 'nuevas' => 0, 'editadas' => 0, 'emparejadas' => 0, 'retiradas' => 0];
    $vistas = [];

    $upd = $pdo->prepare("UPDATE resenas_google SET google_id = :g, autor = :a, estrellas = :e, fecha = :f, fecha_aprox = 0,
                            actualizada = :u, origen = 'google',
                            texto_en = CASE WHEN texto = :t1 THEN texto_en ELSE NULL END, texto = :t2
                          WHERE id = :id");
    $ins = $pdo->prepare("INSERT INTO resenas_google (google_id, autor, estrellas, texto, fecha, actualizada, origen, visible)
                          VALUES (:g, :a, :e, :t, :f, :u, 'google', 1)");

    foreach ($todas as $rv) {
        $gid = (string)($rv['reviewId'] ?? '');
        if ($gid === '') continue;
        $vistas[$gid] = true;
        $fila = [
            ':g' => $gid,
            ':a' => !empty($rv['reviewer']['isAnonymous']) ? '' : trim((string)($rv['reviewer']['displayName'] ?? '')),
            ':e' => $ESTRELLAS[$rv['starRating'] ?? ''] ?? 0,
            ':f' => date('Y-m-d H:i:s', strtotime((string)($rv['createTime'] ?? 'now'))),
            ':u' => date('Y-m-d H:i:s', strtotime((string)($rv['updateTime'] ?? $rv['createTime'] ?? 'now'))),
        ];
        $texto = resenas_texto_original((string)($rv['comment'] ?? ''));

        $previa = $porGoogle[$gid] ?? null;
        if ($previa === null) {
            // ¿Es una de las copiadas? Google deja una reseña por cuenta y
            // ficha: si el autor coincide, es la misma.
            foreach ($copiadas as $id => $c) {
                if ($fila[':a'] !== '' && resenas_norm($c['autor']) === resenas_norm($fila[':a'])) {
                    $previa = $c; unset($copiadas[$id]); $n['emparejadas']++;
                    break;
                }
            }
        } elseif ($previa['texto'] === $texto && (int)$previa['estrellas'] === $fila[':e'] && $previa['autor'] === $fila[':a']) {
            continue; // sin cambios
        } else {
            $n['editadas']++;
        }

        if ($previa !== null) {
            $upd->execute($fila + [':t1' => $texto, ':t2' => $texto, ':id' => (int)$previa['id']]);
        } else {
            $ins->execute($fila + [':t' => $texto]);
            $n['nuevas']++;
        }
    }

    if ($completa) {
        // Las que Google ya no entrega: su autor la borró o Google la retiró.
        $del = $pdo->prepare("DELETE FROM resenas_google WHERE id = :id");
        foreach ($porGoogle as $gid => $f) {
            if (!isset($vistas[$gid])) { $del->execute([':id' => (int)$f['id']]); $n['retiradas']++; }
        }
        // Las copiadas que no aparecieron sobran, pero solo si la mayoría sí
        // se emparejó: si ninguna lo hizo, lo más probable es que se esté
        // leyendo otra ficha, y borrar ahí sería perder las buenas.
        if ($habiaCopiadas && $n['emparejadas'] * 2 >= $habiaCopiadas) {
            foreach ($copiadas as $id => $c) { $del->execute([':id' => $id]); $n['retiradas']++; }
        }
    }

    $resumen = "{$n['recibidas']} en Google · {$n['nuevas']} nuevas · {$n['editadas']} editadas · "
             . "{$n['emparejadas']} copiadas emparejadas · {$n['retiradas']} retiradas";
    g_save(['resenas_sync' => date('c'), 'resenas_error' => '', 'resenas_resultado' => $resumen]);
    return ['ok' => true, 'resumen' => $resumen] + $n;
}
