<?php
/**
 * ============================================================
 * LA PRESENTACIÓN DE SERVICIOS, DESDE EL PANEL
 * ============================================================
 *
 * De dónde sale el texto de base, qué animaciones existen y cómo se limpia
 * lo que llega del editor antes de tocar la base.
 *
 * Se guarda en `pages` (slug y tipo 'presentacion'), con el mismo borrador,
 * publicado y versiones que las páginas del sitio: no hizo falta ninguna
 * tabla nueva. render.php y api/content.php la dejan fuera a propósito: no
 * es una página del sitio y no debe viajar incrustada en cada visita. El deck
 * la pide aparte, en api/presentacion.php.
 *
 * El respaldo NO se escribe aquí a mano. Es /presentacion-base.json, que el
 * build genera desde el mismo contenido.ts que usa el deck. Una copia a mano
 * en PHP es justo la trampa que ya revirtió los textos de la portada (ver el
 * aviso en inc/contenido.php).
 */

const PRESENTACION_SLUG = 'presentacion';

/**
 * Las animaciones que existen, con un nombre que se entienda. Las llaves son
 * las de src/remotion/nombres.ts: al añadir una escena, se añade en los dos.
 */
function presentacion_escenas(): array {
    return [
        'web'             => 'Sitio web armándose (navegador y teléfono)',
        'ecommerce'       => 'Tienda: el carrito abandonado que se recupera',
        'posicionamiento' => 'Una IA que recomienda tu marca',
        'local'           => 'Mapa y ranking de Google',
        'publicidad'      => 'Reparto del presupuesto de anuncios',
        'espectaculares'  => 'Espectacular en la avenida',
        'agentes'         => 'Chat de WhatsApp contestado de noche',
        'ventas'          => 'Prospectos por probabilidad de cierre',
        'auditoria'       => 'Plan de auditoría ordenado por impacto',
        'tablero'         => 'Tablero con cifras y gráfica',
    ];
}

function presentacion_tipos(): array {
    return ['portada' => 'Portada', 'servicio' => 'Servicio', 'cierre' => 'Cierre'];
}

/** El respaldo que generó el build; null si falta (un despliegue a medias). */
function presentacion_base(): ?array {
    $f = __DIR__ . '/../../presentacion-base.json';
    if (!is_file($f)) return null;
    $d = json_decode((string)file_get_contents($f), true);
    return is_array($d) ? presentacion_limpia($d) : null;
}

function pres_txt($v, int $max): string {
    return is_string($v) ? mb_substr(trim($v), 0, $max) : '';
}

function pres_dos($v, int $max): array {
    $v = is_array($v) ? $v : [];
    return ['es' => pres_txt($v['es'] ?? '', $max), 'en' => pres_txt($v['en'] ?? '', $max)];
}

/** Solo lo que puede ir en un href sin sorpresas: lo mismo que urlSegura() en el deck. */
function pres_url($v): string {
    $s = is_string($v) ? trim($v) : '';
    return preg_match('~^(https?://|mailto:|tel:|/(?!/)|#)~i', $s) ? mb_substr($s, 0, 500) : '';
}

function pres_id($v): string {
    $s = iconv('UTF-8', 'ASCII//TRANSLIT', (string)$v);
    $s = strtolower((string)preg_replace('/[^a-zA-Z0-9]+/', '-', (string)$s));
    return substr(trim($s, '-'), 0, 60);
}

/**
 * Deja pasar solo lo que el deck sabe dibujar, con topes de largo. El deck lo
 * vuelve a limpiar al leerlo: esta es la primera puerta, no la única.
 */
function presentacion_limpia($crudo): array {
    $c = is_array($crudo) ? $crudo : [];
    $escenas = presentacion_escenas();
    $tipos = presentacion_tipos();

    $laminas = [];
    $vistos = [];
    $lista = is_array($c['laminas'] ?? null) ? array_slice($c['laminas'], 0, 60) : [];
    foreach ($lista as $n => $l) {
        if (!is_array($l)) continue;
        $tipo = isset($tipos[(string)($l['tipo'] ?? '')]) ? (string)$l['tipo'] : 'servicio';
        $nombre = pres_dos($l['nombre'] ?? [], 160);

        // La dirección de la lámina (#web). Única: si se repite, lleva sufijo.
        $id = pres_id($l['id'] ?? '');
        if ($id === '') $id = pres_id($nombre['es']);
        if ($id === '') $id = 'lamina-' . ($n + 1);
        $raiz = $id;
        for ($k = 2; isset($vistos[$id]); $k++) $id = $raiz . '-' . $k;
        $vistos[$id] = true;

        $tarjetas = ['es' => [], 'en' => []];
        if ($tipo === 'servicio') {
            foreach (['es', 'en'] as $i) {
                $tj = is_array($l['tarjetas'][$i] ?? null) ? array_slice($l['tarjetas'][$i], 0, 3) : [];
                foreach ($tj as $t) {
                    $tt = pres_txt($t['t'] ?? '', 160);
                    $td = pres_txt($t['d'] ?? '', 600);
                    if ($tt !== '' || $td !== '') $tarjetas[$i][] = ['t' => $tt, 'd' => $td];
                }
            }
        }

        $escena = (string)($l['escena'] ?? '');
        $visible = $l['visible'] ?? true;
        $lam = [
            'id'          => $id,
            'tipo'        => $tipo,
            'visible'     => !($visible === false || $visible === '0' || $visible === 0),
            'escena'      => ($tipo === 'servicio' && isset($escenas[$escena])) ? $escena : '',
            'kicker'      => pres_dos($l['kicker'] ?? [], 120),
            'nombre'      => $nombre,
            'descripcion' => pres_dos($l['descripcion'] ?? [], 900),
            'tarjetas'    => $tarjetas,
        ];
        $url = pres_url($l['enlace']['url'] ?? '');
        $tx = pres_dos($l['enlace']['texto'] ?? [], 80);
        if ($url !== '' && ($tx['es'] !== '' || $tx['en'] !== '')) $lam['enlace'] = ['url' => $url, 'texto' => $tx];
        $laminas[] = $lam;
    }

    $ct = is_array($c['contacto'] ?? null) ? $c['contacto'] : [];
    $correo = pres_txt($ct['correo'] ?? '', 120);
    $b = is_array($c['botones'] ?? null) ? $c['botones'] : [];

    return [
        'contacto' => [
            'whatsapp' => substr((string)preg_replace('/\D/', '', (string)($ct['whatsapp'] ?? '')), 0, 20),
            'mensaje'  => pres_dos($ct['mensaje'] ?? [], 300),
            'telefono' => pres_txt($ct['telefono'] ?? '', 40),
            'correo'   => filter_var($correo, FILTER_VALIDATE_EMAIL) ? $correo : '',
            'sitio'    => pres_txt($ct['sitio'] ?? '', 80),
        ],
        'botones' => [
            'empezar'  => pres_dos($b['empezar'] ?? [], 60),
            'escribir' => pres_dos($b['escribir'] ?? [], 60),
            'correo'   => pres_dos($b['correo'] ?? [], 60),
        ],
        'laminas' => $laminas,
    ];
}

function presentacion_json(array $d): string {
    return (string)json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
