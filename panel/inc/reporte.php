<?php
/**
 * El reporte quincenal: reunir, comparar y concluir.
 *
 * Cada quince días se congela una foto de todo lo medible y se guarda en
 * `reportes`. Congelarla importa: Search Console reescribe los últimos días
 * y las visitas se acumulan, así que un reporte calculado en vivo cambiaría
 * cada vez que se abre y dejaría de servir para comparar. Aquí el número que
 * se guardó es el número que se enseña, siempre.
 *
 * La lectura no la escribe una IA: sale de reglas sobre los propios datos
 * (`reporte_hallazgos`). Prefiero un párrafo que se pueda auditar contra la
 * tabla de al lado a uno bonito que nadie pueda comprobar.
 */
declare(strict_types=1);

/** Cada cuánto se levanta un reporte. */
const REPORTE_DIAS = 15;

/**
 * Los motores de IA que se pueden reconocer por su user-agent.
 *
 * Gemini y Apple Intelligence NO están, y no es un olvido: `Google-Extended`
 * y `Applebot-Extended` no son rastreadores. Son etiquetas que se ponen en
 * robots.txt para autorizar el uso del contenido; el rastreo lo hacen
 * Googlebot y Applebot con su user-agent de siempre. Nunca van a dejar
 * huella aquí, así que listarlos hacía que el reporte recomendara perseguir
 * un fantasma.
 *
 * Que Gemini te cite no depende de esto: sus respuestas con enlaces salen de
 * Google Search, así que lo que decide es la posición en el buscador.
 */
const REPORTE_MOTORES = [
    'gptbot'            => 'ChatGPT (rastreo)',
    'oai-searchbot'     => 'ChatGPT (búsqueda)',
    'chatgpt-user'      => 'ChatGPT (en vivo)',
    'claudebot'         => 'Claude (rastreo)',
    'claude-user'       => 'Claude (en vivo)',
    'claude-searchbot'  => 'Claude (búsqueda)',
    'perplexitybot'     => 'Perplexity',
    'perplexity-user'   => 'Perplexity (en vivo)',
    'bytespider'        => 'TikTok / Doubao',
    'meta-externalagent'=> 'Meta AI',
    'amazonbot'         => 'Amazon',
    'ccbot'             => 'Common Crawl',
];

function reporte_tabla(): void {
    db()->exec("CREATE TABLE IF NOT EXISTS reportes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      desde DATE NOT NULL,
      hasta DATE NOT NULL,
      datos MEDIUMTEXT NOT NULL,
      creado_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_periodo (desde, hasta)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

/** Consulta que nunca revienta el reporte: sin la tabla, devuelve vacío. */
function rq(string $sql, array $p = []): array {
    try { $st = db()->prepare($sql); $st->execute($p); return $st->fetchAll(); }
    catch (Throwable $e) { return []; }
}
function rq1(string $sql, array $p = [], $def = 0) {
    $r = rq($sql, $p);
    return $r ? array_values($r[0])[0] : $def;
}

/**
 * Los temas en los que se reparten las búsquedas.
 *
 * El orden manda: una consulta cae en el primero que la reconoce. Por eso la
 * marca va primero («inédito digital» no es marketing) y las ciudades antes
 * que marketing («agencia de marketing digital en celaya» cuenta como
 * cobertura nacional, que es la estrategia que la puso ahí).
 */
const REPORTE_TEMAS = [
    ['Tu marca',                ['inedito', 'inédito']],
    ['IA, GEO y ChatGPT',       ['ia', 'inteligencia artificial', 'chatgpt', 'chat gpt', 'geo', 'aeo',
                                 'chatbot', 'agente', 'automatiz', 'asistente']],
    ['Otras ciudades',          ['celaya', 'guanajuato', 'durango', 'leon', 'león', 'penjamo', 'pénjamo',
                                 'abasolo', 'zacatecas', 'san luis', 'queretaro', 'querétaro', 'irapuato',
                                 'salamanca', 'silao', 'guadalajara', 'jalisco', 'cdmx', 'monterrey']],
    ['Diseño y desarrollo web', ['web', 'pagina', 'página', 'sitio', 'diseño', 'diseno', 'ecommerce', 'tienda']],
    ['SEO y posicionamiento',   ['seo', 'posicionamiento', 'organico', 'orgánico', 'google maps', 'ficha de google', 'indexa']],
    ['Publicidad',              ['publicidad', 'ads', 'anuncio', 'campaña', 'campana']],
    ['Marketing digital',       ['marketing', 'mercadotecnia', 'digital', 'agencia']],
];

/** Sin acentos y en minúsculas, para poder comparar dos textos escritos a mano. */
function reporte_llano(string $s): string
{
    $s = mb_strtolower(trim($s), 'UTF-8');
    $s = strtr($s, ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n']);
    return trim(preg_replace('/\s+/u', ' ', $s));
}

/** ¿Aparece esta palabra dentro del texto, empezando en un límite? */
function reporte_contiene(string $texto, string $palabra): bool
{
    /* El límite solo por la izquierda: así «automatiz» reconoce
       «automatización», y «ia» no se dispara dentro de «agencia». */
    return (bool)preg_match('/(?<![\p{L}])' . preg_quote($palabra, '/') . '/u', $texto);
}

/** Reparte las consultas medidas en temas, con su mejor puesto y su volumen. */
function reporte_temas(array $consultas): array
{
    $temas = [];
    foreach (REPORTE_TEMAS as [$nombre, $_]) $temas[$nombre] = ['nombre'=>$nombre, 'n'=>0, 'impresiones'=>0, 'clics'=>0, 'mejor'=>null, 'suma'=>0.0];
    $temas['Otras búsquedas'] = ['nombre'=>'Otras búsquedas', 'n'=>0, 'impresiones'=>0, 'clics'=>0, 'mejor'=>null, 'suma'=>0.0];

    foreach ($consultas as $c) {
        $q = reporte_llano((string)$c['consulta']);
        $donde = 'Otras búsquedas';
        foreach (REPORTE_TEMAS as [$nombre, $palabras]) {
            foreach ($palabras as $p) {
                if (reporte_contiene($q, reporte_llano($p))) { $donde = $nombre; break 2; }
            }
        }
        $t = &$temas[$donde];
        $t['n']++;
        $t['impresiones'] += (int)$c['impresiones'];
        $t['clics'] += (int)$c['clics'];
        $t['suma'] += (float)$c['posicion'] * max(1, (int)$c['impresiones']);
        if ($t['mejor'] === null || (float)$c['posicion'] < $t['mejor']) $t['mejor'] = round((float)$c['posicion'], 1);
        unset($t);
    }

    $out = [];
    foreach ($temas as $t) {
        if ($t['n'] === 0) continue;
        $t['posicion'] = round($t['suma'] / max(1, $t['impresiones']), 1);
        unset($t['suma']);
        $out[] = $t;
    }
    usort($out, fn($x, $y) => $y['impresiones'] <=> $x['impresiones']);
    return $out;
}

/* ------------------------------------------------------------------ */
/*  Reunir                                                            */
/* ------------------------------------------------------------------ */

/**
 * Todo lo medible entre dos fechas, ambas incluidas.
 *
 * `$hasta` entra completo: se compara contra el día siguiente para no
 * perder las visitas de la tarde del último día.
 */
function reporte_reunir(string $desde, string $hasta): array {
    $p = [':d' => $desde . ' 00:00:00', ':h' => $hasta . ' 23:59:59'];
    $dias = max(1, (int)((strtotime($hasta) - strtotime($desde)) / 86400) + 1);
    $W = "created_at BETWEEN :d AND :h";

    /* --- visitas --- */
    $porDia = [];
    foreach (rq("SELECT DATE(created_at) f, COUNT(*) c FROM pageviews WHERE $W GROUP BY 1 ORDER BY 1", $p) as $r)
        $porDia[$r['f']] = (int)$r['c'];
    /* Los días sin una sola visita no salen del GROUP BY, y una gráfica que
       se los salta miente sobre la forma de la quincena. */
    for ($t = strtotime($desde); $t <= strtotime($hasta); $t += 86400)
        $porDia[date('Y-m-d', $t)] = $porDia[date('Y-m-d', $t)] ?? 0;
    ksort($porDia);

    $visitas = [
        'total'     => (int)rq1("SELECT COUNT(*) FROM pageviews WHERE $W", $p),
        'personas'  => (int)rq1("SELECT COUNT(DISTINCT visitor) FROM pageviews WHERE $W AND visitor <> ''", $p),
        'sesiones'  => (int)rq1("SELECT COUNT(DISTINCT session) FROM pageviews WHERE $W AND session <> ''", $p),
        'nuevos'    => (int)rq1("SELECT COUNT(*) FROM pageviews WHERE $W AND is_new = 1", $p),
        'por_dia'   => $porDia,
        'paginas'   => array_map(fn($r) => ['path' => $r['path'], 'n' => (int)$r['c']],
                        rq("SELECT path, COUNT(*) c FROM pageviews WHERE $W GROUP BY 1 ORDER BY 2 DESC LIMIT 12", $p)),
        /* hit.php escribe 'direct'; una visita sin origen llega vacia. Las dos
           son lo mismo y se juntan aqui, porque medio analisis pregunta por
           esta clave y con dos nombres distintos no encontraba ninguna. */
        'fuentes'   => array_column(rq("SELECT CASE WHEN COALESCE(source,'') IN ('','direct') THEN 'directo' ELSE source END s, COUNT(*) c FROM pageviews WHERE $W GROUP BY 1 ORDER BY 2 DESC", $p), 'c', 's'),
        'aparatos'  => array_column(rq("SELECT COALESCE(NULLIF(device,''),'?') d, COUNT(*) c FROM pageviews WHERE $W GROUP BY 1 ORDER BY 2 DESC", $p), 'c', 'd'),
    ];
    $visitas['fuentes'] = array_map('intval', $visitas['fuentes']);
    $visitas['aparatos'] = array_map('intval', $visitas['aparatos']);

    /* --- buscador (Search Console): la foto más reciente del periodo --- */
    $g = rq("SELECT * FROM gsc_totales WHERE fecha BETWEEN :d AND :h ORDER BY fecha DESC LIMIT 1",
            [':d' => $desde, ':h' => $hasta]);
    $g = $g ? $g[0] : null;
    $buscador = [
        'fecha'       => $g['fecha'] ?? null,
        'clics'       => (int)($g['clics'] ?? 0),
        'impresiones' => (int)($g['impresiones'] ?? 0),
        'ctr'         => round((float)($g['ctr'] ?? 0), 2),
        'posicion'    => round((float)($g['posicion'] ?? 0), 1),
        'indexadas'   => (int)($g['indexadas'] ?? 0),
        'sin_indexar' => (int)($g['sin_indexar'] ?? 0),
        'consultas'   => [],
        'fotos'       => (int)rq1("SELECT COUNT(DISTINCT fecha) FROM gsc_totales WHERE fecha BETWEEN :d AND :h", [':d'=>$desde, ':h'=>$hasta]),
    ];
    if ($buscador['fecha']) {
        $buscador['consultas'] = array_map(fn($r) => [
            'consulta'    => $r['consulta'],
            'clics'       => (int)$r['clics'],
            'impresiones' => (int)$r['impresiones'],
            'posicion'    => round((float)$r['posicion'], 1),
        ], rq("SELECT consulta, clics, impresiones, posicion FROM gsc_consultas WHERE fecha = :f ORDER BY impresiones DESC LIMIT 40",
              [':f' => $buscador['fecha']]));
    }

    /* --- posicionamiento en IA --- */
    $fp = [':d' => $desde, ':h' => $hasta];
    $ia = [
        'lecturas' => (int)rq1("SELECT COALESCE(SUM(hits),0) FROM ia_bots WHERE fecha BETWEEN :d AND :h", $fp),
        'motores'  => array_map('intval', array_column(rq("SELECT bot, SUM(hits) c FROM ia_bots WHERE fecha BETWEEN :d AND :h GROUP BY 1 ORDER BY 2 DESC", $fp), 'c', 'bot')),
        'urls'     => array_map(fn($r) => ['url' => $r['url'], 'n' => (int)$r['c'], 'motores' => (int)$r['m']],
                      rq("SELECT url, SUM(hits) c, COUNT(DISTINCT bot) m FROM ia_bots WHERE fecha BETWEEN :d AND :h GROUP BY 1 ORDER BY 2 DESC LIMIT 10", $fp)),
        'visitas'  => (int)rq1("SELECT COUNT(*) FROM pageviews WHERE $W AND source = 'ia'", $p),
    ];

    /* --- embudo --- */
    $embudo = [
        'acciones' => (int)rq1("SELECT COUNT(*) FROM events WHERE $W", $p),
        'personas' => (int)rq1("SELECT COUNT(DISTINCT visitor) FROM events WHERE $W AND visitor <> ''", $p),
        'por_tipo' => array_map('intval', array_column(rq("SELECT evento, COUNT(*) c FROM events WHERE $W GROUP BY 1 ORDER BY 2 DESC", $p), 'c', 'evento')),
        'leads'    => (int)rq1("SELECT COUNT(*) FROM leads WHERE $W AND source <> 'Prueba de integracion'", $p),
    ];

    /* --- las palabras clave: lo que se trabaja contra lo que ya aparece --- */
    /* Para agrupar por tema se miran TODAS las consultas de la foto, no las
       cuarenta que caben en la tabla: con una muestra recortada por volumen
       los temas de cola larga —que son justo los nuevos— desaparecian. */
    $todasLasConsultas = $buscador['fecha']
        ? array_map(fn($r) => ['consulta' => $r['consulta'], 'clics' => (int)$r['clics'],
                               'impresiones' => (int)$r['impresiones'], 'posicion' => (float)$r['posicion']],
            rq("SELECT consulta, clics, impresiones, posicion FROM gsc_consultas WHERE fecha = :f", [':f' => $buscador['fecha']]))
        : [];

    $declaradas = [];
    foreach (['services', 'blog_posts', 'portfolio'] as $tabla) {
        foreach (rq("SELECT keywords, data_json FROM `$tabla` WHERE status='published'") as $r) {
            $lista = preg_split('/[,\n]+/', (string)$r['keywords']) ?: [];
            $j = json_decode((string)$r['data_json'], true);
            foreach ((array)($j['seo']['keywords'] ?? []) as $k) $lista[] = (string)$k;
            foreach ($lista as $k) {
                $k = trim($k);
                if ($k !== '') $declaradas[reporte_llano($k)] = $k;
            }
        }
    }
    /* Una palabra «ya aparece» si alguna consulta medida la contiene o al
       revés: nadie escribe en Google exactamente lo que puso en el panel. */
    $medidasLlano = array_map(fn($c) => reporte_llano((string)$c['consulta']), $todasLasConsultas);
    $sinAparecer = [];
    foreach ($declaradas as $llano => $original) {
        foreach ($medidasLlano as $m) {
            if ($m === $llano || str_contains($m, $llano) || str_contains($llano, $m)) continue 2;
        }
        $sinAparecer[] = $original;
    }
    /* Primero las frases: son objetivos de verdad, no palabras sueltas. */
    usort($sinAparecer, fn($a, $b) => substr_count($b, ' ') <=> substr_count($a, ' '));

    $palabras = [
        'temas'        => reporte_temas($todasLasConsultas),
        'declaradas'   => count($declaradas),
        'midiendo'     => count($todasLasConsultas),
        'sin_aparecer' => array_slice($sinAparecer, 0, 12),
        'cuantas_sin'  => count($sinAparecer),
    ];

    /* --- inventario de contenido, al día de hoy --- */
    $contenido = [
        'servicios'  => (int)rq1("SELECT COUNT(*) FROM services WHERE status='published'"),
        'articulos'  => (int)rq1("SELECT COUNT(*) FROM blog_posts WHERE status='published'"),
        'casos'      => (int)rq1("SELECT COUNT(*) FROM portfolio WHERE status='published'"),
        'paginas'    => (int)rq1("SELECT COUNT(*) FROM pages WHERE status='published' AND tipo <> 'presentacion'"),
        'clientes'   => (int)rq1("SELECT COUNT(*) FROM clientes WHERE visible=1"),
        'ultimo_articulo' => rq1("SELECT MAX(publish_date) FROM blog_posts WHERE status='published'", [], null),
    ];

    return [
        'periodo'   => ['desde' => $desde, 'hasta' => $hasta, 'dias' => $dias],
        'generado'  => date('Y-m-d H:i:s'),
        'visitas'   => $visitas,
        'buscador'  => $buscador,
        'ia'        => $ia,
        'palabras'  => $palabras,
        'embudo'    => $embudo,
        'contenido' => $contenido,
    ];
}

/* ------------------------------------------------------------------ */
/*  Comparar                                                          */
/* ------------------------------------------------------------------ */

/** Variación entre dos números, con su signo y su lectura. */
function reporte_delta($ahora, $antes, bool $menos_es_mejor = false): array {
    $ahora = (float)$ahora; $antes = (float)$antes;
    if ($antes == 0.0) {
        return ['hay' => $ahora != 0.0, 'abs' => $ahora, 'pct' => null,
                'signo' => $ahora > 0 ? 1 : 0, 'bueno' => $ahora > 0 ? !$menos_es_mejor : null];
    }
    $abs = $ahora - $antes;
    $pct = $abs / $antes * 100;
    $signo = $abs > 0 ? 1 : ($abs < 0 ? -1 : 0);
    return ['hay' => abs($pct) >= 0.5, 'abs' => $abs, 'pct' => round($pct, 1),
            'signo' => $signo, 'bueno' => $signo === 0 ? null : ($menos_es_mejor ? $signo < 0 : $signo > 0)];
}

/* ------------------------------------------------------------------ */
/*  Concluir                                                          */
/* ------------------------------------------------------------------ */

/**
 * Lo que dicen los números, en frases.
 *
 * Devuelve `logros`, `alertas` y `recomendaciones`; cada una lleva el dato
 * que la sostiene para que se pueda comprobar en la lámina de al lado.
 */
function reporte_hallazgos(array $h, ?array $a): array {
    $logros = []; $alertas = []; $reco = [];
    $v = $h['visitas']; $b = $h['buscador']; $ia = $h['ia']; $e = $h['embudo'];

    /* ---- visitas ---- */
    if ($a) {
        $d = reporte_delta($v['total'], $a['visitas']['total']);
        if ($d['pct'] !== null && abs($d['pct']) >= 10) {
            $f = ['peso' => 1, 'titulo' => 'Las visitas ' . ($d['signo'] > 0 ? 'subieron' : 'bajaron') . ' ' . abs($d['pct']) . '%',
                  'texto'  => 'De ' . number_format((int)$a['visitas']['total']) . ' a ' . number_format($v['total'])
                              . ' páginas vistas, y de ' . number_format((int)$a['visitas']['personas']) . ' a '
                              . number_format($v['personas']) . ' personas distintas.'];
            if ($d['signo'] > 0) $logros[] = $f; else $alertas[] = $f;
        }
    }

    $dir = (int)($v['fuentes']['directo'] ?? 0);
    $org = (int)($v['fuentes']['organic'] ?? 0);
    if ($v['total'] > 30 && $dir / max(1, $v['total']) > 0.6) {
        $alertas[] = ['peso' => 2, 'titulo' => 'Casi todo el tráfico llega directo',
                      'texto'  => round($dir / $v['total'] * 100) . '% entra escribiendo la dirección o desde un enlace sin rastro, '
                                  . 'contra ' . round($org / max(1, $v['total']) * 100) . '% desde el buscador. '
                                  . 'Es gente que ya te conocía: el sitio todavía no está trayendo desconocidos.'];
        $reco[] = ['prioridad' => 1, 'titulo' => 'Convertir visibilidad en visitas',
                   'texto' => 'Hay ' . number_format($b['impresiones']) . ' impresiones y solo ' . $b['clics'] . ' clics. '
                              . 'El sitio ya sale en Google; lo que falta es que el título y la descripción de cada resultado den ganas de entrar.'];
    }

    /* ---- buscador ---- */
    if ($b['fecha']) {
        if ($a && $a['buscador']['posicion'] > 0 && $b['posicion'] > 0) {
            $d = reporte_delta($b['posicion'], $a['buscador']['posicion'], true);
            if ($d['hay'] && abs((float)$d['abs']) >= 1) {
                $f = ['peso' => 2, 'titulo' => 'La posición media ' . ($d['signo'] < 0 ? 'mejoró' : 'empeoró') . ' ' . abs(round((float)$d['abs'], 1)) . ' puestos',
                      'texto'  => 'Pasó de ' . $a['buscador']['posicion'] . ' a ' . $b['posicion'] . ' en promedio sobre todas las búsquedas donde apareces.'];
                if ($d['signo'] < 0) $logros[] = $f; else $alertas[] = $f;
            }
        }

        /* Las que están a un empujón: segunda página con demanda real. */
        $cerca = array_values(array_filter($b['consultas'],
            fn($c) => $c['posicion'] > 10 && $c['posicion'] <= 20 && $c['impresiones'] >= 15));
        usort($cerca, fn($x, $y) => $y['impresiones'] <=> $x['impresiones']);
        if ($cerca) {
            $lista = array_slice($cerca, 0, 5);
            $reco[] = ['prioridad' => 1, 'titulo' => 'A un empujón de la primera página',
                       'texto'  => count($cerca) . ' búsquedas están entre el puesto 11 y el 20 con demanda real. '
                                   . 'Son las de menor esfuerzo por resultado: mejorar la página que ya responde a cada una mueve más que escribir contenido nuevo.',
                       'lista'  => array_map(fn($c) => $c['consulta'] . ' · puesto ' . $c['posicion'] . ' · ' . $c['impresiones'] . ' impresiones', $lista)];
        }

        /* Sales arriba y no te hacen clic: el problema es el texto del resultado. */
        $mudas = array_values(array_filter($b['consultas'],
            fn($c) => $c['posicion'] <= 10 && $c['clics'] === 0 && $c['impresiones'] >= 20));
        if ($mudas) {
            $reco[] = ['prioridad' => 2, 'titulo' => 'Apareces arriba pero nadie entra',
                       'texto'  => count($mudas) . ' búsquedas te ponen en la primera página y no generan un solo clic. '
                                   . 'Ahí no falta posición: falta que el título y la descripción del resultado prometan algo.',
                       'lista'  => array_map(fn($c) => $c['consulta'] . ' · puesto ' . $c['posicion'] . ' · ' . $c['impresiones'] . ' impresiones, 0 clics',
                                   array_slice($mudas, 0, 5))];
        }

        if ($b['sin_indexar'] > 0) {
            $alertas[] = ['peso' => 2, 'titulo' => $b['sin_indexar'] . ' páginas sin indexar',
                          'texto'  => 'Google conoce esas direcciones y decidió no ponerlas en su índice. Mientras sigan así no pueden recibir una sola visita.'];
            $reco[] = ['prioridad' => 1, 'titulo' => 'Pedir indexación de lo que quedó fuera',
                       'texto'  => 'Revisar en Search Console el motivo de cada una y solicitar indexación desde la herramienta de inspección de URL.'];
        }
        if ($b['fotos'] < max(2, (int)($h['periodo']['dias'] / 3))) {
            $alertas[] = ['peso' => 4, 'titulo' => 'Faltan fotos de Search Console',
                          'texto'  => 'En ' . $h['periodo']['dias'] . ' días solo se guardaron ' . $b['fotos'] . '. Sin una foto diaria, la comparación entre quincenas se apoya en muy pocos puntos.'];
            $reco[] = ['prioridad' => 2, 'titulo' => 'Dejar corriendo la sincronización diaria',
                       'texto' => 'El cron de Search Console guarda cada día el estado del sitio. Es lo que permite decir «mejoró» con una fecha detrás.'];
        }
    } else {
        $alertas[] = ['peso' => 4, 'titulo' => 'Sin datos de Search Console en el periodo',
                      'texto'  => 'No se guardó ninguna foto entre estas fechas, así que el bloque de buscador queda sin comparación.'];
    }

    /* ---- posicionamiento en IA ---- */
    if ($ia['lecturas'] > 0) {
        $lista = [];
        foreach ($ia['motores'] as $bot => $n) $lista[] = (REPORTE_MOTORES[$bot] ?? $bot) . ' · ' . number_format($n);
        $logros[] = ['peso' => 2, 'titulo' => number_format($ia['lecturas']) . ' lecturas de motores de IA',
                     'texto'  => count($ia['motores']) . ' motores distintos entraron a leer el sitio en la quincena. '
                                 . 'Cada lectura es una oportunidad de que te citen cuando alguien pregunta por tu sector.',
                     'lista'  => array_slice($lista, 0, 6)];

        $faltan = array_diff_key(REPORTE_MOTORES, $ia['motores']);
        if ($faltan) {
            $reco[] = ['prioridad' => 2, 'titulo' => 'Motores que todavía no te leen',
                       'texto'  => 'No aparece ninguna lectura de ' . implode(', ', array_slice(array_values($faltan), 0, 4))
                                   . '. Suele resolverse con enlaces desde sitios que esos motores sí rastrean y con contenido que responda preguntas completas.'];
        }
        if ($ia['visitas'] === 0) {
            $alertas[] = ['peso' => 2, 'titulo' => 'Te leen, pero todavía no te mandan gente',
                          'texto'  => 'Hubo ' . number_format($ia['lecturas']) . ' lecturas de bots y ninguna visita llegó desde un asistente. '
                                      . 'Ser leído es el primer paso; ser citado con enlace es el segundo.'];
        }
    } else {
        $alertas[] = ['peso' => 1, 'titulo' => 'Ningún motor de IA leyó el sitio',
                      'texto'  => 'Sin lecturas no hay forma de que un asistente te recomiende. Conviene revisar que robots.txt no los esté bloqueando.'];
    }

    /* ---- embudo ---- */
    if ($v['total'] > 50 && $e['acciones'] === 0) {
        $alertas[] = ['peso' => 1, 'titulo' => 'Nadie tocó WhatsApp, el teléfono ni el asistente',
                      'texto'  => number_format($v['total']) . ' páginas vistas y cero acciones registradas. '
                                  . 'O la gente entra y no encuentra el siguiente paso, o llega a leer y no a contratar.'];
        $reco[] = ['prioridad' => 1, 'titulo' => 'Hacer visible el siguiente paso',
                   'texto'  => 'Con visitas y sin una sola acción, el problema no es de tráfico. Revisar que en las páginas más vistas haya un botón claro arriba, sin tener que bajar.'];
    }
    if ($e['leads'] === 0 && $e['acciones'] > 0) {
        $alertas[] = ['peso' => 1, 'titulo' => 'Hubo acciones pero ningún prospecto',
                      'texto'  => $e['acciones'] . ' personas hicieron algo y ninguna dejó sus datos. La fuga está entre el clic y el formulario.'];
    }

    /* ---- contenido ---- */
    if (!empty($h['contenido']['ultimo_articulo'])) {
        $dd = (int)((time() - strtotime((string)$h['contenido']['ultimo_articulo'])) / 86400);
        if ($dd > 30) {
            $reco[] = ['prioridad' => 3, 'titulo' => 'El blog lleva ' . $dd . ' días sin una pieza nueva',
                       'texto'  => 'Los motores de IA citan con más frecuencia lo publicado hace poco. Una pieza por quincena mantiene el sitio vivo para ellos.'];
        }
    }

    /* Por impacto, no por el orden en que se escribieron las reglas: una nota
       de mantenimiento no puede encabezar por encima de «nadie te contacta». */
    $porPeso = fn($x, $y) => ($x['peso'] ?? 3) <=> ($y['peso'] ?? 3);
    usort($logros, $porPeso);
    usort($alertas, $porPeso);
    usort($reco, fn($x, $y) => $x['prioridad'] <=> $y['prioridad']);
    return ['logros' => $logros, 'alertas' => $alertas, 'recomendaciones' => $reco];
}

/* ------------------------------------------------------------------ */
/*  Lo que significa cada bloque                                      */
/* ------------------------------------------------------------------ */

/** «7 de cada 10», que se entiende mejor que «68%». */
function reporte_de_cada_diez(float $parte, float $total): string
{
    if ($total <= 0) return '';
    $n = (int)round($parte / $total * 10);
    $letras = [0=>'Ninguno', 1=>'Uno', 2=>'Dos', 3=>'Tres', 4=>'Cuatro', 5=>'La mitad',
               6=>'Seis', 7=>'Siete', 8=>'Ocho', 9=>'Nueve', 10=>'Todos'];
    return $letras[$n] ?? (string)$n;
}

/**
 * Una o dos frases por sección: qué pasó y qué quiere decir.
 *
 * Van arriba de cada lámina, antes que los números. El orden importa: quien
 * abre el reporte quiere saber si está mejor o peor, y las tablas son para
 * comprobarlo, no para deducirlo.
 */
function reporte_resumenes(array $h, ?array $a = null): array
{
    $v = $h['visitas']; $b = $h['buscador']; $ia = $h['ia']; $e = $h['embudo'];
    $out = [];

    /* --- visitas --- */
    if ($v['total'] === 0) {
        $out['visitas'] = 'No se registró ninguna visita en el periodo.';
    } else {
        $t = number_format($v['personas']) . ' personas entraron y vieron ' . number_format($v['total']) . ' páginas.';
        if ($a && (int)$a['visitas']['personas'] > 0) {
            $d = reporte_delta($v['personas'], $a['visitas']['personas']);
            if ($d['pct'] !== null && abs($d['pct']) >= 5)
                $t .= ' Son ' . abs($d['pct']) . '% ' . ($d['signo'] > 0 ? 'más' : 'menos') . ' que la quincena pasada.';
        }
        $dir = (int)($v['fuentes']['directo'] ?? 0);
        $org = (int)($v['fuentes']['organic'] ?? 0);
        if ($dir / max(1, $v['total']) >= 0.55) {
            $t .= ' ' . reporte_de_cada_diez((float)$dir, (float)$v['total'])
                . ' de cada diez llegaron escribiendo la dirección: gente que ya te conocía.';
        } elseif ($org / max(1, $v['total']) >= 0.35) {
            $t .= ' ' . reporte_de_cada_diez((float)$org, (float)$v['total'])
                . ' de cada diez llegaron desde el buscador, que es tráfico nuevo.';
        }
        $out['visitas'] = $t;
    }

    /* --- buscador --- */
    if (!$b['fecha']) {
        $out['buscador'] = 'No se guardó ninguna foto de Search Console en estas fechas, así que este bloque va sin comparación.';
    } else {
        $t = 'Google te mostró ' . number_format($b['impresiones']) . ' veces y entraron ' . number_format($b['clics']) . '.';
        if ($b['posicion'] > 0) {
            $t .= ' Apareces en el puesto ' . $b['posicion'] . ' de media';
            $t .= $b['posicion'] > 10 ? ', y la primera página termina en el diez.' : ', ya dentro de la primera página.';
        }
        if ($b['impresiones'] >= 200 && $b['ctr'] < 2) {
            $t .= ' El problema no es que no te vean: es que no te eligen.';
        }
        $out['buscador'] = $t;
    }

    /* --- palabras clave --- */
    $pal = $h['palabras'] ?? null;
    if ($pal && $pal['temas']) {
        $conVarias = array_values(array_filter($pal['temas'], fn($x) => $x['n'] >= 2));
        $t = 'El sitio trabaja ' . $pal['declaradas'] . ' palabras clave y ' . $pal['midiendo']
           . ' ya generan apariciones en Google.';
        if (count($conVarias) >= 2) {
            usort($conVarias, fn($x, $y) => $x['posicion'] <=> $y['posicion']);
            $mejor = $conVarias[0]; $peor = end($conVarias);
            $t .= ' Donde estás mejor colocado es en «' . mb_strtolower($mejor['nombre'], 'UTF-8')
                . '», puesto ' . $mejor['posicion'] . ' de media; donde estás más lejos es en «'
                . mb_strtolower($peor['nombre'], 'UTF-8') . '», puesto ' . $peor['posicion'] . '.';
        }
        $out['palabras'] = $t;
    } else {
        $out['palabras'] = 'Todavía no hay consultas medidas para agrupar por tema.';
    }

    /* --- posicionamiento en IA --- */
    if ($ia['lecturas'] === 0) {
        $out['ia'] = 'Ningún motor de IA leyó el sitio en la quincena. Sin lecturas no hay forma de que un asistente te recomiende.';
    } else {
        $t = count($ia['motores']) . ' motores de IA leyeron el sitio ' . number_format($ia['lecturas']) . ' veces.';
        $t .= $ia['visitas'] === 0
            ? ' Te leen; todavía ninguno te ha mandado gente. Ser leído es el primer paso, ser citado con enlace es el segundo.'
            : ' ' . number_format($ia['visitas']) . ' visitas llegaron desde un asistente.';
        $out['ia'] = $t;
    }

    /* --- embudo --- */
    if ($e['acciones'] === 0) {
        $out['embudo'] = $v['personas'] > 0
            ? 'De ' . number_format($v['personas']) . ' personas, ninguna tocó WhatsApp, el teléfono ni el asistente. El sitio informa; todavía no conversa.'
            : 'Sin visitas no hay acciones que contar.';
    } elseif ($e['leads'] === 0) {
        $out['embudo'] = number_format($e['personas']) . ' personas hicieron algo y ninguna dejó sus datos. La fuga está entre el clic y el formulario.';
    } else {
        $out['embudo'] = number_format($e['personas']) . ' personas hicieron algo y ' . number_format($e['leads'])
            . ' dejaron sus datos: ' . round($e['leads'] / max(1, $v['personas']) * 100, 1) . '% de quienes entraron.';
    }

    return $out;
}

/* ------------------------------------------------------------------ */
/*  Dónde está Inédito                                                */
/* ------------------------------------------------------------------ */

/**
 * El cierre del reporte: cuatro cosas que tienen que pasar para que el sitio
 * traiga clientes, y en cuál va cada una.
 *
 * El nivel va de 0 a 3 y no es una nota: es en qué paso de la cadena está
 * cada cosa. Una empresa puede estar en 3 de visibilidad y en 0 de contacto,
 * que es justo el caso más común y el que hay que ver de un golpe.
 */
function reporte_estatus(array $h): array
{
    $v = $h['visitas']; $b = $h['buscador']; $ia = $h['ia']; $e = $h['embudo'];
    $dim = [];

    /* 1. que Google te encuentre */
    if ($b['impresiones'] === 0) {
        $dim[] = ['que'=>'Que Google te encuentre', 'nivel'=>0, 'estado'=>'Sin datos',
                  'texto'=>'No hay medición de Search Console en el periodo.'];
    } elseif ($b['posicion'] > 0 && $b['posicion'] <= 10) {
        $dim[] = ['que'=>'Que Google te encuentre', 'nivel'=>3, 'estado'=>'En primera página',
                  'texto'=>'Posición media ' . $b['posicion'] . ' sobre ' . number_format($b['impresiones']) . ' apariciones.'];
    } elseif ($b['impresiones'] >= 300) {
        $dim[] = ['que'=>'Que Google te encuentre', 'nivel'=>2, 'estado'=>'Visible, todavía lejos',
                  'texto'=>'Apareces ' . number_format($b['impresiones']) . ' veces, pero en el puesto ' . $b['posicion'] . ' de media.'];
    } else {
        $dim[] = ['que'=>'Que Google te encuentre', 'nivel'=>1, 'estado'=>'Empezando',
                  'texto'=>'Todavía pocas apariciones: ' . number_format($b['impresiones']) . ' en la quincena.'];
    }

    /* 2. que te elijan en el resultado */
    $ctr = (float)$b['ctr'];
    if ($b['impresiones'] < 100) {
        $dim[] = ['que'=>'Que te elijan al verte', 'nivel'=>1, 'estado'=>'Sin volumen para juzgar',
                  'texto'=>'Hacen falta más apariciones para que el porcentaje signifique algo.'];
    } elseif ($ctr >= 3) {
        $dim[] = ['que'=>'Que te elijan al verte', 'nivel'=>3, 'estado'=>'Buen porcentaje',
                  'texto'=>'De cada 100 que te ven en Google, ' . $ctr . ' entran.'];
    } elseif ($ctr >= 1.5) {
        $dim[] = ['que'=>'Que te elijan al verte', 'nivel'=>2, 'estado'=>'Mejorable',
                  'texto'=>'Entran ' . $ctr . ' de cada 100. El título y la descripción del resultado son lo que decide.'];
    } else {
        $dim[] = ['que'=>'Que te elijan al verte', 'nivel'=>1, 'estado'=>'Te ven y siguen de largo',
                  'texto'=>'Solo ' . $ctr . ' de cada 100 entran. Es lo más barato de mejorar.'];
    }

    /* 3. que las IA te tomen en cuenta */
    $motores = count($ia['motores']);
    if ($ia['lecturas'] === 0) {
        $dim[] = ['que'=>'Que las IA te tomen en cuenta', 'nivel'=>0, 'estado'=>'Nadie te lee',
                  'texto'=>'Sin lecturas, ningún asistente puede recomendarte.'];
    } elseif ($ia['visitas'] > 0) {
        $dim[] = ['que'=>'Que las IA te tomen en cuenta', 'nivel'=>3, 'estado'=>'Te citan',
                  'texto'=>number_format($ia['visitas']) . ' personas llegaron desde un asistente.'];
    } elseif ($motores >= 5) {
        $dim[] = ['que'=>'Que las IA te tomen en cuenta', 'nivel'=>2, 'estado'=>'Te leen, no te citan',
                  'texto'=>$motores . ' motores entraron ' . number_format($ia['lecturas']) . ' veces; ninguno te mandó gente todavía.'];
    } else {
        $dim[] = ['que'=>'Que las IA te tomen en cuenta', 'nivel'=>1, 'estado'=>'Apenas empiezan',
                  'texto'=>'Solo ' . $motores . ' motor' . ($motores === 1 ? '' : 'es') . ' te ha leído.'];
    }

    /* 4. que te contacten */
    if ($e['leads'] > 0) {
        $dim[] = ['que'=>'Que te contacten', 'nivel'=>3, 'estado'=>'Llegan prospectos',
                  'texto'=>number_format($e['leads']) . ' dejaron sus datos en la quincena.'];
    } elseif ($e['acciones'] > 0) {
        $dim[] = ['que'=>'Que te contacten', 'nivel'=>2, 'estado'=>'Tocan, no escriben',
                  'texto'=>number_format($e['acciones']) . ' acciones y ningún formulario enviado.'];
    } elseif ($v['personas'] > 20) {
        $dim[] = ['que'=>'Que te contacten', 'nivel'=>0, 'estado'=>'Sin señal',
                  'texto'=>'Con ' . number_format($v['personas']) . ' visitantes, ni una sola acción registrada.'];
    } else {
        $dim[] = ['que'=>'Que te contacten', 'nivel'=>1, 'estado'=>'Falta volumen',
                  'texto'=>'Con tan pocas visitas todavía no hay nada que medir aquí.'];
    }

    /* La frase de cierre sale de dónde se corta la cadena: el primer paso
       que falla es el que define el estado del negocio, no el promedio. */
    $niveles = array_column($dim, 'nivel');
    $flojo = array_search(min($niveles), $niveles, true);
    $frase = [
        0 => 'Inédito ya tiene presencia, pero la cadena se corta en «' . mb_strtolower($dim[$flojo]['que'], 'UTF-8')
             . '». Mientras ese paso no se mueva, lo demás no se convierte en clientes.',
        1 => 'Inédito está construyendo la base. Lo que falta es volumen en «' . mb_strtolower($dim[$flojo]['que'], 'UTF-8') . '».',
        2 => 'Inédito ya es visible en buscadores y en asistentes de IA. El siguiente salto está en convertir esa presencia en conversaciones.',
        3 => 'La cadena completa está funcionando: te encuentran, te eligen, las IA te citan y la gente escribe.',
    ][min($niveles)];

    return ['dimensiones' => $dim, 'frase' => $frase, 'nivel_min' => min($niveles), 'paso_flojo' => $dim[$flojo]['que']];
}

/* ------------------------------------------------------------------ */
/*  Guardar y leer                                                    */
/* ------------------------------------------------------------------ */

/** El reporte anterior al que termina en `$hasta`. */
function reporte_anterior(string $hasta): ?array {
    reporte_tabla();
    $st = db()->prepare("SELECT * FROM reportes WHERE hasta < :h ORDER BY hasta DESC LIMIT 1");
    $st->execute([':h' => $hasta]);
    $r = $st->fetch();
    if (!$r) return null;
    $d = json_decode((string)$r['datos'], true);
    return is_array($d) ? $d : null;
}

/**
 * Levanta el reporte de la quincena que termina en `$hasta`.
 *
 * Repetirlo el mismo periodo lo actualiza en vez de duplicarlo, así que se
 * puede correr a mano las veces que haga falta.
 */
function reporte_crear(?string $hasta = null): array {
    reporte_tabla();
    $hasta = $hasta ?: date('Y-m-d');
    $desde = date('Y-m-d', strtotime($hasta . ' -' . (REPORTE_DIAS - 1) . ' days'));

    $datos = reporte_reunir($desde, $hasta);
    $antes = reporte_anterior($hasta);
    $datos['hallazgos'] = reporte_hallazgos($datos, $antes);
    $datos['resumenes']  = reporte_resumenes($datos, $antes);
    $datos['estatus']    = reporte_estatus($datos);
    $datos['anterior']  = $antes ? ['desde' => $antes['periodo']['desde'], 'hasta' => $antes['periodo']['hasta']] : null;
    $datos['comparacion'] = $antes ? [
        'visitas'     => reporte_delta($datos['visitas']['total'], $antes['visitas']['total']),
        'personas'    => reporte_delta($datos['visitas']['personas'], $antes['visitas']['personas']),
        'clics'       => reporte_delta($datos['buscador']['clics'], $antes['buscador']['clics']),
        'impresiones' => reporte_delta($datos['buscador']['impresiones'], $antes['buscador']['impresiones']),
        'posicion'    => reporte_delta($datos['buscador']['posicion'], $antes['buscador']['posicion'], true),
        'ia'          => reporte_delta($datos['ia']['lecturas'], $antes['ia']['lecturas']),
        'acciones'    => reporte_delta($datos['embudo']['acciones'], $antes['embudo']['acciones']),
        'leads'       => reporte_delta($datos['embudo']['leads'], $antes['embudo']['leads']),
    ] : null;

    $json = json_encode($datos, JSON_UNESCAPED_UNICODE);
    db()->prepare("INSERT INTO reportes (desde, hasta, datos) VALUES (:d,:h,:j)
                   ON DUPLICATE KEY UPDATE datos = :j2, creado_at = CURRENT_TIMESTAMP")
        ->execute([':d' => $desde, ':h' => $hasta, ':j' => $json, ':j2' => $json]);

    $st = db()->prepare("SELECT * FROM reportes WHERE desde = :d AND hasta = :h");
    $st->execute([':d' => $desde, ':h' => $hasta]);
    $fila = $st->fetch();
    $datos['id'] = (int)($fila['id'] ?? 0);
    return $datos;
}

function reporte_lista(int $limite = 40): array {
    reporte_tabla();
    return rq("SELECT id, desde, hasta, creado_at FROM reportes ORDER BY hasta DESC LIMIT $limite");
}

function reporte_cargar(int $id): ?array {
    reporte_tabla();
    $st = db()->prepare("SELECT * FROM reportes WHERE id = :id");
    $st->execute([':id' => $id]);
    $r = $st->fetch();
    if (!$r) return null;
    $d = json_decode((string)$r['datos'], true);
    if (!is_array($d)) return null;
    $d['id'] = (int)$r['id'];
    $d['creado_at'] = $r['creado_at'];
    return $d;
}

/** ¿Toca uno nuevo? El cron pregunta esto todos los días. */
function reporte_toca(): bool {
    reporte_tabla();
    $ultimo = rq1("SELECT MAX(hasta) FROM reportes", [], null);
    if (!$ultimo) return true;
    return (int)((strtotime(date('Y-m-d')) - strtotime((string)$ultimo)) / 86400) >= REPORTE_DIAS;
}

/** «19 de agosto», para los títulos. */
function reporte_fecha_larga(string $iso): string {
    $m = ['01'=>'enero','02'=>'febrero','03'=>'marzo','04'=>'abril','05'=>'mayo','06'=>'junio',
          '07'=>'julio','08'=>'agosto','09'=>'septiembre','10'=>'octubre','11'=>'noviembre','12'=>'diciembre'];
    return (int)substr($iso, 8, 2) . ' de ' . ($m[substr($iso, 5, 2)] ?? '') . ' de ' . substr($iso, 0, 4);
}
