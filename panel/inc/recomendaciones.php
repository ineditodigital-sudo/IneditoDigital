<?php
/**
 * «Arma tu ruta» en el editor de servicios.
 *
 * Lo que cada ficha recomienda según si el negocio empieza de cero o ya
 * funciona. Vive en el data_json de cada servicio (`recomendaciones`); lo lee
 * la ficha del sitio (RutaServicio.tsx) y render.php para los robots.
 *
 * Mientras un servicio no guarde las suyas, el sitio muestra las del código
 * (src/app/data/recomendaciones.ts, que la compilación deja en
 * /datos/recomendaciones.json), y el formulario enseña esas mismas para que
 * se editen a partir de lo que ya se ve, no de una lista en blanco.
 */

/** Las recomendaciones que el sitio muestra hoy para un servicio sin las suyas. */
function recomendaciones_de_codigo(string $slug): array
{
    static $datos = null;
    if ($datos === null) {
        $datos = [];
        /* En el servidor, junto al sitio; en local, en la carpeta de compilado. */
        foreach ([__DIR__ . '/../../datos/recomendaciones.json', __DIR__ . '/../../dist/datos/recomendaciones.json'] as $f) {
            if (!is_file($f)) continue;
            $j = json_decode((string)file_get_contents($f), true);
            if (is_array($j)) { $datos = $j; break; }
        }
    }
    $out = [];
    foreach ((array)($datos[$slug] ?? []) as $r) {
        if (!is_array($r)) continue;
        $out[] = [
            'a'     => (string)($r['a'] ?? ''),
            'tipo'  => (string)($r['tipo'] ?? 'complemento'),
            'etapa' => (string)($r['etapa'] ?? ''),
            'razon' => (string)($r['razon'] ?? ''),
        ];
    }
    return $out;
}

/**
 * A dónde puede llevar una recomendación: los servicios publicados, sin las
 * páginas de ciudad ni de giro, más las páginas de servicio que no viven en
 * esta sección (las de IA y la de posicionamiento en IA). Por ruta, que es
 * lo que guarda la ficha, y ordenadas por nombre.
 */
function recomendaciones_destinos(): array
{
    $d = [];
    try {
        foreach (db()->query("SELECT slug, title, data_json FROM services WHERE status = 'published'") as $r) {
            $j = json_decode((string)($r['data_json'] ?? ''), true);
            if (!is_array($j)) $j = [];
            $cat = (string)($j['category'] ?? '');
            if ($cat === 'Cobertura' || $cat === 'Sectores') continue;
            $slug = trim((string)($r['slug'] ?? ''));
            if ($slug === '') continue;
            $d['/servicios/' . $slug] = (string)(($r['title'] ?? '') ?: ($j['title'] ?? $slug));
        }
    } catch (Throwable $e) {
        /* sin base, al menos las páginas fijas */
    }
    $d += [
        '/servicios/posicionamiento-en-ia' => 'Posicionamiento en IA',
        '/servicios-ia/whatsapp'           => 'Agente de IA para WhatsApp',
        '/servicios-ia/ventas'             => 'IA de ventas',
        '/servicios-ia/marketing'          => 'IA para Marketing',
        '/servicios-ia/ecommerce'          => 'IA para E-commerce',
    ];
    asort($d, SORT_NATURAL | SORT_FLAG_CASE);
    return $d;
}

/** El papel de cada recomendación, como lo dice la ficha. */
const RECOMENDACIONES_TIPOS = [
    'base'        => 'Primero (lo que va antes)',
    'complemento' => 'Va con este',
    'alcance'     => 'Más alcance',
    'siguiente'   => 'Después (lo que sigue)',
    'ruta'        => 'Otra ruta (una alternativa)',
];

/** Para quién sale. Vacío: para los dos. */
const RECOMENDACIONES_ETAPAS = [
    ''        => 'Las dos',
    'cero'    => 'Empiezo de cero',
    'negocio' => 'Ya tengo un negocio',
];
