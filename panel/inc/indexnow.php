<?php
/**
 * Avisar a los buscadores en cuanto se publica algo (IndexNow).
 *
 * Por qué vale la pena
 * --------------------
 * Sin aviso, una página nueva espera a que un rastreador pase por el sitemap:
 * días o semanas. IndexNow es un protocolo abierto que Bing, Yandex, Seznam y
 * Naver aceptan, y con él la URL entra en cola en minutos.
 *
 * Google NO participa —ahí el camino sigue siendo Search Console—, pero esto
 * no es un premio de consolación: **la búsqueda de ChatGPT se apoya en el
 * índice de Bing**. Entrar rápido a Bing es entrar rápido a las respuestas de
 * ChatGPT, que es justo lo que se persigue.
 *
 * La llave vive en un archivo de texto en la raíz del sitio, que es como el
 * protocolo comprueba que quien avisa es el dueño del dominio.
 */
declare(strict_types=1);

/**
 * La llave del sitio. Tiene que coincidir con el archivo
 * https://www.inedito.digital/<llave>.txt, cuyo contenido es la llave misma.
 */
const INDEXNOW_LLAVE = 'a7f3c92e4b1d84605e7a2c3f9b8d1046';
const INDEXNOW_HOST  = 'www.inedito.digital';

/**
 * Avisa de una o varias URL. Nunca lanza: avisar es un extra, y que falle no
 * puede impedir que alguien guarde su contenido.
 *
 * @param string[] $urls rutas absolutas del sitio, con o sin dominio
 * @return array{ok:bool, codigo:int, enviadas:int, mensaje:string}
 */
function indexnow_avisar(array $urls): array
{
    $limpias = [];
    foreach ($urls as $u) {
        $u = trim((string)$u);
        if ($u === '') continue;
        if ($u[0] === '/') $u = 'https://' . INDEXNOW_HOST . $u;
        if (!preg_match('~^https://' . preg_quote(INDEXNOW_HOST, '~') . '/~', $u)) continue;
        $limpias[$u] = true;   // sin repetidas
    }
    $limpias = array_keys($limpias);
    if (!$limpias) return ['ok' => false, 'codigo' => 0, 'enviadas' => 0, 'mensaje' => 'ninguna URL válida'];

    $cuerpo = json_encode([
        'host'        => INDEXNOW_HOST,
        'key'         => INDEXNOW_LLAVE,
        'keyLocation' => 'https://' . INDEXNOW_HOST . '/' . INDEXNOW_LLAVE . '.txt',
        'urlList'     => array_slice($limpias, 0, 10000),
    ], JSON_UNESCAPED_SLASHES);

    $ch = curl_init('https://api.indexnow.org/indexnow');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $cuerpo,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json; charset=utf-8'],
        CURLOPT_RETURNTRANSFER => true,
        /* Corto a propósito: esto corre mientras alguien espera a que su
           cambio se guarde. Si el servicio tarda, se sigue sin avisar. */
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_CONNECTTIMEOUT => 3,
    ]);
    $resp = curl_exec($ch);
    $cod  = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    /* 200 aceptado · 202 aceptado, pendiente de validar la llave. */
    $ok = in_array($cod, [200, 202], true);
    return ['ok' => $ok, 'codigo' => $cod, 'enviadas' => count($limpias),
            'mensaje' => $ok ? 'aceptado' : ($err ?: trim((string)$resp) ?: 'sin respuesta')];
}

/** La URL pública de una ficha, según el módulo en el que vive. */
function indexnow_ruta(string $modulo, string $slug): string
{
    $rutas = ['blog' => '/blog/', 'portafolio' => '/portafolio/', 'servicios' => '/servicios/'];
    return isset($rutas[$modulo]) && $slug !== '' ? $rutas[$modulo] . $slug : '';
}
