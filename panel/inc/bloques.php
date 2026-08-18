<?php
/**
 * ============================================================
 * CATÁLOGO DE BLOQUES
 * ============================================================
 *
 * Las piezas que el cliente puede combinar para armar una página nueva.
 *
 * Cada bloque corresponde a algo que el sitio YA sabe dibujar, con su
 * diseño y sus animaciones. El cliente elige el bloque y llena sus campos;
 * nunca escribe HTML ni toca el diseño.
 *
 * Menos es más: solo están los bloques que este sitio realmente usa. No hay
 * un constructor infinito ni bloques que nadie sabría para qué sirven.
 */

function catalogo_bloques(): array {
    return [

        'portada' => [
            'nombre' => 'Portada',
            'ayuda'  => 'El encabezado grande de la página, con título y botón. Va siempre al principio.',
            'campos' => [
                'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => ''],
                'titulo'   => ['label' => 'Título principal', 'tipo' => 'texto', 'def' => 'Escribe aquí el título'],
                'resaltado'=> ['label' => 'Parte del título en color', 'tipo' => 'texto', 'def' => '',
                               'ayuda' => 'Se muestra con el degradado morado, después del título.'],
                'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => ''],
                'boton'    => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA',
                               'ayuda' => 'Déjalo vacío si no quieres botón.'],
            ],
        ],

        'texto' => [
            'nombre' => 'Texto',
            'ayuda'  => 'Un título con su párrafo. Para explicar algo sin adornos.',
            'campos' => [
                'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => ''],
                'texto'  => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => ''],
                'fondo'  => ['label' => 'Fondo claro', 'tipo' => 'switch', 'def' => '0',
                             'ayuda' => 'Actívalo para que esta parte se vea sobre blanco.'],
            ],
        ],

        'texto_imagen' => [
            'nombre' => 'Texto con imagen',
            'ayuda'  => 'Un texto a un lado y una imagen al otro.',
            'campos' => [
                'titulo'   => ['label' => 'Título', 'tipo' => 'texto', 'def' => ''],
                'texto'    => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => ''],
                'imagen'   => ['label' => 'Imagen', 'tipo' => 'imagen', 'def' => ''],
                'alt'      => ['label' => 'Descripción de la imagen', 'tipo' => 'texto', 'def' => '',
                               'ayuda' => 'Para quien no puede verla. Ejemplo: «Equipo trabajando en la oficina».'],
                'derecha'  => ['label' => 'Poner la imagen a la derecha', 'tipo' => 'switch', 'def' => '1'],
                'fondo'    => ['label' => 'Fondo claro', 'tipo' => 'switch', 'def' => '0'],
            ],
        ],

        'puntos' => [
            'nombre' => 'Lista de puntos',
            'ayuda'  => 'Hasta cuatro puntos con su título y descripción. Ideal para beneficios o características.',
            'campos' => [
                'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => ''],
                'p1_titulo'=> ['label' => 'Punto 1 · título', 'tipo' => 'texto', 'def' => ''],
                'p1_texto' => ['label' => 'Punto 1 · descripción', 'tipo' => 'parrafo', 'def' => ''],
                'p2_titulo'=> ['label' => 'Punto 2 · título', 'tipo' => 'texto', 'def' => ''],
                'p2_texto' => ['label' => 'Punto 2 · descripción', 'tipo' => 'parrafo', 'def' => ''],
                'p3_titulo'=> ['label' => 'Punto 3 · título', 'tipo' => 'texto', 'def' => ''],
                'p3_texto' => ['label' => 'Punto 3 · descripción', 'tipo' => 'parrafo', 'def' => ''],
                'p4_titulo'=> ['label' => 'Punto 4 · título', 'tipo' => 'texto', 'def' => ''],
                'p4_texto' => ['label' => 'Punto 4 · descripción', 'tipo' => 'parrafo', 'def' => ''],
            ],
        ],

        'cifras' => [
            'nombre' => 'Cifras destacadas',
            'ayuda'  => 'Tres números grandes con su explicación.',
            'campos' => [
                'titulo'  => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => ''],
                'cifra_1' => ['label' => 'Primera cifra', 'tipo' => 'texto', 'def' => ''],
                'texto_1' => ['label' => 'Qué significa', 'tipo' => 'texto', 'def' => ''],
                'cifra_2' => ['label' => 'Segunda cifra', 'tipo' => 'texto', 'def' => ''],
                'texto_2' => ['label' => 'Qué significa', 'tipo' => 'texto', 'def' => ''],
                'cifra_3' => ['label' => 'Tercera cifra', 'tipo' => 'texto', 'def' => ''],
                'texto_3' => ['label' => 'Qué significa', 'tipo' => 'texto', 'def' => ''],
            ],
        ],

        'pasos' => [
            'nombre' => 'Pasos numerados',
            'ayuda'  => 'Hasta cuatro pasos, numerados solos. Para explicar un proceso.',
            'campos' => [
                'titulo'      => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => ''],
                'paso_1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => ''],
                'paso_1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => ''],
                'paso_2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => ''],
                'paso_2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => ''],
                'paso_3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => ''],
                'paso_3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => ''],
                'paso_4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => ''],
                'paso_4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => ''],
            ],
        ],

        'preguntas' => [
            'nombre' => 'Preguntas frecuentes',
            'ayuda'  => 'Hasta cuatro preguntas que se abren al tocarlas.',
            'campos' => [
                'titulo' => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'Preguntas frecuentes'],
                'p1'     => ['label' => 'Pregunta 1', 'tipo' => 'texto', 'def' => ''],
                'r1'     => ['label' => 'Respuesta 1', 'tipo' => 'parrafo', 'def' => ''],
                'p2'     => ['label' => 'Pregunta 2', 'tipo' => 'texto', 'def' => ''],
                'r2'     => ['label' => 'Respuesta 2', 'tipo' => 'parrafo', 'def' => ''],
                'p3'     => ['label' => 'Pregunta 3', 'tipo' => 'texto', 'def' => ''],
                'r3'     => ['label' => 'Respuesta 3', 'tipo' => 'parrafo', 'def' => ''],
                'p4'     => ['label' => 'Pregunta 4', 'tipo' => 'texto', 'def' => ''],
                'r4'     => ['label' => 'Respuesta 4', 'tipo' => 'parrafo', 'def' => ''],
            ],
        ],

        'llamado' => [
            'nombre' => 'Llamado a la acción',
            'ayuda'  => 'El bloque morado que invita a contactar. Suele ir al final.',
            'campos' => [
                'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿Listo para empezar?'],
                'texto'  => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => ''],
                'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
            ],
        ],
    ];
}

/** Un bloque nuevo, con los valores por defecto de su tipo. */
function bloque_nuevo(string $tipo): ?array {
    $cat = catalogo_bloques()[$tipo] ?? null;
    if (!$cat) return null;
    $datos = [];
    foreach ($cat['campos'] as $k => $c) $datos[$k] = $c['def'] ?? '';
    return ['tipo' => $tipo, 'visible' => '1', 'datos' => $datos];
}

/**
 * Limpia lo que llega del formulario: solo pasan tipos de bloque conocidos y
 * campos declarados. Cualquier cosa de fuera se descarta.
 */
function bloques_limpios($crudo): array {
    $cat = catalogo_bloques();
    $out = [];
    if (!is_array($crudo)) return $out;
    foreach ($crudo as $b) {
        $tipo = (string)($b['tipo'] ?? '');
        if (!isset($cat[$tipo])) continue;
        $datos = [];
        foreach ($cat[$tipo]['campos'] as $k => $c) {
            $v = $b['datos'][$k] ?? '';
            $datos[$k] = is_string($v) ? trim($v) : '';
        }
        $out[] = ['tipo' => $tipo, 'visible' => (($b['visible'] ?? '1') === '0' ? '0' : '1'), 'datos' => $datos];
    }
    return $out;
}
