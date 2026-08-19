<?php
/**
 * ============================================================
 * PÁGINAS DE CONTACTO DEL EQUIPO
 * ============================================================
 *
 * Cada integrante tiene su propia dirección (inedito.digital/su-nombre).
 * Es la página que se abre cuando alguien acerca su tarjeta NFC.
 *
 * Aquí se declara QUÉ se puede llenar. El diseño lo pone el sitio, así que
 * el cliente nunca escribe HTML ni puede descuadrar la página: llena campos
 * y ya. Un campo vacío simplemente no se dibuja, en vez de dejar un hueco.
 */

/** Los campos de una página de contacto, agrupados como se ven en el panel. */
function campos_miembro(): array
{
    return [

        'quien' => [
            'nombre' => 'Quién es',
            'campos' => [
                'nombre'   => ['label' => 'Nombre completo', 'tipo' => 'texto', 'req' => true],
                'puesto'   => ['label' => 'Puesto', 'tipo' => 'texto', 'ayuda' => 'Ej. Director Creativo'],
                'empresa'  => ['label' => 'Empresa', 'tipo' => 'texto', 'def' => 'Inédito Digital'],
                'ciudad'   => ['label' => 'Ciudad', 'tipo' => 'texto', 'def' => 'Aguascalientes'],
                'foto'     => ['label' => 'Foto', 'tipo' => 'imagen',
                               'ayuda' => 'Cuadrada y de buena calidad. Se ve en grande al abrir la página.'],
                'saludo'   => ['label' => 'Texto encima del nombre', 'tipo' => 'texto', 'def' => 'Hola, soy'],
                'frase'    => ['label' => 'Frase corta', 'tipo' => 'parrafo',
                               'ayuda' => 'Dos renglones sobre lo que haces. Se lee debajo de la foto.'],
            ],
        ],

        'contacto' => [
            'nombre' => 'Cómo lo contactan',
            'ayuda'  => 'Lo que dejes vacío no aparece. Los teléfonos van con lada.',
            'campos' => [
                'telefono' => ['label' => 'Teléfono', 'tipo' => 'texto', 'ayuda' => 'Ej. 4495136907'],
                'whatsapp' => ['label' => 'WhatsApp', 'tipo' => 'texto', 'ayuda' => 'Con lada del país, ej. +52 1 449 583 9229'],
                'wa_texto' => ['label' => 'Mensaje con el que abre WhatsApp', 'tipo' => 'texto',
                               'def' => 'Hola, vi tu tarjeta y me gustaría platicar contigo.'],
                'email'    => ['label' => 'Correo', 'tipo' => 'texto'],
                'sitio'    => ['label' => 'Sitio web', 'tipo' => 'enlace', 'def' => 'https://www.inedito.digital'],
                'maps'     => ['label' => 'Ubicación en Google Maps', 'tipo' => 'enlace'],
            ],
        ],

        'redes' => [
            'nombre' => 'Redes sociales',
            'ayuda'  => 'Pega la dirección completa. La que dejes vacía no se muestra.',
            'campos' => [
                'instagram' => ['label' => 'Instagram', 'tipo' => 'enlace'],
                'facebook'  => ['label' => 'Facebook', 'tipo' => 'enlace'],
                'linkedin'  => ['label' => 'LinkedIn', 'tipo' => 'enlace'],
                'tiktok'    => ['label' => 'TikTok', 'tipo' => 'enlace'],
                'youtube'   => ['label' => 'YouTube', 'tipo' => 'enlace'],
                'behance'   => ['label' => 'Behance', 'tipo' => 'enlace'],
            ],
        ],

        'botones' => [
            'nombre' => 'Textos de los botones',
            'campos' => [
                'b_guardar'  => ['label' => 'Guardar contacto', 'tipo' => 'texto', 'def' => 'Guardar contacto'],
                'b_whatsapp' => ['label' => 'WhatsApp', 'tipo' => 'texto', 'def' => 'WhatsApp'],
                'b_llamar'   => ['label' => 'Llamar', 'tipo' => 'texto', 'def' => 'Llamar'],
                'b_email'    => ['label' => 'Correo', 'tipo' => 'texto', 'def' => 'Correo'],
                'b_ubicacion'=> ['label' => 'Ubicación', 'tipo' => 'texto', 'def' => 'Ubicación'],
                't_redes'    => ['label' => 'Título de la sección de redes', 'tipo' => 'texto', 'def' => 'Sígueme'],
                't_agencia'  => ['label' => 'Título de la sección de la agencia', 'tipo' => 'texto', 'def' => 'Lo que hacemos'],
                't_contacto' => ['label' => 'Título de la sección de contacto', 'tipo' => 'texto', 'def' => 'Contáctame'],
            ],
        ],

        'agencia' => [
            'nombre' => 'Enlaces de la agencia',
            'ayuda'  => 'Las tres tarjetas del final que llevan al sitio. Apaga el interruptor para quitar la sección.',
            'campos' => [
                'ver'       => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                'a1_titulo' => ['label' => 'Tarjeta 1 · título', 'tipo' => 'texto', 'def' => 'Tarjetas NFC'],
                'a1_url'    => ['label' => 'Tarjeta 1 · destino', 'tipo' => 'enlace', 'def' => '/servicios/tarjetas-de-presentacion-digital'],
                'a2_titulo' => ['label' => 'Tarjeta 2 · título', 'tipo' => 'texto', 'def' => 'Servicios'],
                'a2_url'    => ['label' => 'Tarjeta 2 · destino', 'tipo' => 'enlace', 'def' => '/servicios'],
                'a3_titulo' => ['label' => 'Tarjeta 3 · título', 'tipo' => 'texto', 'def' => 'Portafolio'],
                'a3_url'    => ['label' => 'Tarjeta 3 · destino', 'tipo' => 'enlace', 'def' => '/portafolio'],
            ],
        ],

        'apariencia' => [
            'nombre' => 'Colores de la página',
            'ayuda'  => 'Por si algún día quieres distinguir a alguien del equipo con otro tono.',
            'campos' => [
                'fondo' => ['label' => 'Color de fondo', 'tipo' => 'color', 'def' => '#B18AFF'],
                'tinta' => ['label' => 'Color del texto y las tarjetas', 'tipo' => 'color', 'def' => '#0D0010'],
            ],
        ],
    ];
}

/** Los valores por defecto declarados arriba, aplanados. */
function miembro_defaults(): array
{
    $out = [];
    foreach (campos_miembro() as $g) {
        foreach ($g['campos'] as $k => $c) $out[$k] = (string)($c['def'] ?? '');
    }
    return $out;
}

/**
 * Deja pasar solo los campos declarados y con el formato correcto.
 *
 * Es la puerta: nada que no esté en el catálogo llega a la base de datos, así
 * que ni un campo inventado ni HTML pegado por error pueden romper la página.
 */
function miembro_limpio(array $datos): array
{
    $out = [];
    foreach (campos_miembro() as $g) {
        foreach ($g['campos'] as $k => $c) {
            $v = trim((string)($datos[$k] ?? ''));
            if ($c['tipo'] === 'switch') {
                $out[$k] = $v === '1' ? '1' : '0';
                continue;
            }
            if ($c['tipo'] === 'color' && $v !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $v)) {
                $v = (string)($c['def'] ?? '');
            }
            // Los enlaces y las imágenes solo aceptan direcciones, no javascript:
            if (($c['tipo'] === 'enlace' || $c['tipo'] === 'imagen') && $v !== '') {
                $ok = str_starts_with($v, '/')
                    || str_starts_with($v, 'https://')
                    || str_starts_with($v, 'http://')
                    || str_starts_with($v, 'mailto:')
                    || str_starts_with($v, 'tel:');
                if (!$ok) $v = '';
            }
            $out[$k] = $v;
        }
    }
    return $out;
}

/** Lo guardado mezclado sobre los valores por defecto. */
function miembro_con_respaldo(array $guardado): array
{
    $out = miembro_defaults();
    foreach ($guardado as $k => $v) {
        if (!array_key_exists($k, $out)) continue;
        if (is_string($v) && trim($v) === '') continue;
        $out[$k] = (string)$v;
    }
    return $out;
}

/** Las direcciones que un integrante no puede ocupar porque ya son del sitio. */
function rutas_reservadas(): array
{
    $reg = function_exists('registro_paginas') ? array_keys(registro_paginas()) : [];
    return array_merge($reg, [
        'servicios', 'servicios-ia', 'portafolio', 'blog', 'contacto', 'nosotros',
        'privacidad', 'terminos', 'admin', 'panel', 'api', 'assets', 'media',
        'favicon', 'robots', 'sitemap', 'index', 'render',
    ]);
}
