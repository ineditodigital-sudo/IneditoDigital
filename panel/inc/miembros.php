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

/** Cuántos enlaces libres puede poner cada integrante. */
const MIEMBRO_ENLACES = 8;

/** Los íconos que puede elegir para cada enlace. */
function iconos_enlace(): array
{
    return [
        'enlace'     => 'Enlace',
        'sitio'      => 'Sitio web',
        'agenda'     => 'Agendar cita',
        'portafolio' => 'Portafolio',
        'catalogo'   => 'Catálogo o tienda',
        'documento'  => 'Documento',
        'video'      => 'Video',
        'foto'       => 'Fotos',
        'mapa'       => 'Ubicación',
        'correo'     => 'Correo',
        'telefono'   => 'Teléfono',
        'whatsapp'   => 'WhatsApp',
        'instagram'  => 'Instagram',
        'facebook'   => 'Facebook',
        'linkedin'   => 'LinkedIn',
        'tiktok'     => 'TikTok',
        'youtube'    => 'YouTube',
        'estrella'   => 'Destacado',
    ];
}

/** Los campos de una página de contacto, agrupados como se ven en el panel. */
function campos_miembro(): array
{
    $enlaces = [];
    for ($i = 1; $i <= MIEMBRO_ENLACES; $i++) {
        $enlaces["e{$i}_ver"] = ['label' => "Enlace $i · mostrar", 'tipo' => 'switch', 'def' => $i === 1 ? '1' : '0'];
        $enlaces["e{$i}_titulo"] = ['label' => "Enlace $i · título", 'tipo' => 'texto'];
        $enlaces["e{$i}_sub"] = ['label' => "Enlace $i · renglón de abajo", 'tipo' => 'texto'];
        $enlaces["e{$i}_url"] = ['label' => "Enlace $i · destino", 'tipo' => 'enlace'];
        $enlaces["e{$i}_icono"] = ['label' => "Enlace $i · ícono", 'tipo' => 'lista', 'opciones' => iconos_enlace(), 'def' => 'enlace'];
        $enlaces["e{$i}_destacado"] = ['label' => "Enlace $i · resaltar en morado", 'tipo' => 'switch', 'def' => '0'];
    }

    return [

        'quien' => [
            'nombre' => 'Quién es',
            'campos' => [
                'nombre'  => ['label' => 'Nombre completo', 'tipo' => 'texto', 'req' => true],
                'puesto'  => ['label' => 'Puesto', 'tipo' => 'texto', 'ayuda' => 'Ej. Director Creativo'],
                'empresa' => ['label' => 'Empresa', 'tipo' => 'texto', 'def' => 'Inédito Digital'],
                'ciudad'  => ['label' => 'Ciudad', 'tipo' => 'texto', 'def' => 'Aguascalientes'],
                'foto'    => ['label' => 'Foto', 'tipo' => 'imagen',
                              'ayuda' => 'Cuadrada, de la cara para arriba. Se ve redonda y en grande hasta arriba.'],
                'frase'   => ['label' => 'Descripción corta', 'tipo' => 'parrafo',
                              'ayuda' => 'Dos o tres renglones. Se lee debajo del nombre.'],
            ],
        ],

        'contacto' => [
            'nombre' => 'Cómo lo contactan',
            'ayuda'  => 'Con esto se arman solos los botones de arriba. Lo que dejes vacío no aparece.',
            'campos' => [
                'telefono' => ['label' => 'Teléfono', 'tipo' => 'texto', 'ayuda' => 'Ej. 4495136907'],
                'whatsapp' => ['label' => 'WhatsApp', 'tipo' => 'texto', 'ayuda' => 'Con lada del país, ej. +52 1 449 583 9229'],
                'wa_texto' => ['label' => 'Mensaje con el que abre WhatsApp', 'tipo' => 'texto',
                               'def' => 'Hola, vi tu tarjeta y me gustaría platicar contigo.'],
                'email'    => ['label' => 'Correo', 'tipo' => 'texto'],
                'maps'     => ['label' => 'Ubicación en Google Maps', 'tipo' => 'enlace'],
            ],
        ],

        'redes' => [
            'nombre' => 'Redes sociales',
            'ayuda'  => 'Salen como los botones redondos debajo de la descripción. La que dejes vacía no se muestra.',
            'campos' => [
                'instagram' => ['label' => 'Instagram', 'tipo' => 'enlace'],
                'facebook'  => ['label' => 'Facebook', 'tipo' => 'enlace'],
                'linkedin'  => ['label' => 'LinkedIn', 'tipo' => 'enlace'],
                'tiktok'    => ['label' => 'TikTok', 'tipo' => 'enlace'],
                'youtube'   => ['label' => 'YouTube', 'tipo' => 'enlace'],
                'behance'   => ['label' => 'Behance', 'tipo' => 'enlace'],
                'sitio'     => ['label' => 'Sitio web', 'tipo' => 'enlace', 'def' => 'https://www.inedito.digital'],
            ],
        ],

        'enlaces' => [
            'nombre' => 'Enlaces de la lista',
            'ayuda'  => 'Los renglones grandes, en orden. Sirven para lo que quieras: agendar una cita, un portafolio, un catálogo. Enciende el interruptor del que quieras usar.',
            'campos' => $enlaces,
        ],

        'botones' => [
            'nombre' => 'Textos de los botones automáticos',
            'ayuda'  => 'Los que se arman con los datos de contacto. Debajo de cada uno se muestra solo el dato.',
            'campos' => [
                'b_guardar'   => ['label' => 'Guardar contacto', 'tipo' => 'texto', 'def' => 'Guardar mi contacto'],
                'b_whatsapp'  => ['label' => 'WhatsApp', 'tipo' => 'texto', 'def' => 'Escríbeme por WhatsApp'],
                'b_llamar'    => ['label' => 'Llamar', 'tipo' => 'texto', 'def' => 'Llámame'],
                'b_email'     => ['label' => 'Correo', 'tipo' => 'texto', 'def' => 'Mándame un correo'],
                'b_ubicacion' => ['label' => 'Ubicación', 'tipo' => 'texto', 'def' => 'Dónde estamos'],
                'b_guardar_sub' => ['label' => 'Renglón bajo “Guardar contacto”', 'tipo' => 'texto',
                                    'def' => 'Se agrega a la agenda de tu celular'],
            ],
        ],

        'tarjeta' => [
            'nombre' => 'La tarjeta de contacto (.vcf)',
            'ayuda'  => 'Lo que se guarda en la agenda del celular cuando alguien toca “Guardar mi contacto”. Lo que dejes vacío se toma de los datos de arriba, así no escribes dos veces lo mismo.',
            'campos' => [
                'vcf_foto'    => ['label' => 'Incluir la foto en el contacto', 'tipo' => 'switch', 'def' => '1',
                                  'ayuda' => 'Así aparece con su cara en la agenda. Se encoge sola para que el contacto pese poco.'],
                'vcf_redes'   => ['label' => 'Incluir las redes sociales', 'tipo' => 'switch', 'def' => '1'],
                'vcf_nombre'  => ['label' => 'Cómo se guarda en la agenda', 'tipo' => 'texto',
                                  'ayuda' => 'Por si prefieres algo como “Armando Trejo · Inédito”. Vacío = su nombre.'],
                'vcf_puesto'  => ['label' => 'Puesto', 'tipo' => 'texto'],
                'vcf_empresa' => ['label' => 'Empresa', 'tipo' => 'texto'],
                'vcf_tel'     => ['label' => 'Teléfono principal', 'tipo' => 'texto'],
                'vcf_tel2'    => ['label' => 'Segundo teléfono', 'tipo' => 'texto'],
                'vcf_email'   => ['label' => 'Correo', 'tipo' => 'texto'],
                'vcf_sitio'   => ['label' => 'Sitio web', 'tipo' => 'enlace',
                                  'ayuda' => 'Vacío = la dirección de esta misma página.'],
                'vcf_calle'   => ['label' => 'Dirección · calle y número', 'tipo' => 'texto'],
                'vcf_ciudad'  => ['label' => 'Dirección · ciudad', 'tipo' => 'texto'],
                'vcf_estado'  => ['label' => 'Dirección · estado', 'tipo' => 'texto'],
                'vcf_cp'      => ['label' => 'Dirección · código postal', 'tipo' => 'texto'],
                'vcf_pais'    => ['label' => 'Dirección · país', 'tipo' => 'texto', 'def' => 'México'],
                'vcf_nota'    => ['label' => 'Nota', 'tipo' => 'parrafo',
                                  'ayuda' => 'El renglón de notas del contacto. Vacío = la descripción corta.'],
                'vcf_archivo' => ['label' => 'Nombre del archivo', 'tipo' => 'texto',
                                  'ayuda' => 'Vacío = la dirección de la página. Se le agrega .vcf solo.'],
            ],
        ],

        'apariencia' => [
            'nombre' => 'Color',
            'ayuda'  => 'El tono del anillo de la foto y de los enlaces resaltados. Por si algún día quieres distinguir a alguien del equipo.',
            'campos' => [
                'acento' => ['label' => 'Color de acento', 'tipo' => 'color', 'def' => '#7700CE'],
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
            if ($c['tipo'] === 'lista') {
                $out[$k] = isset($c['opciones'][$v]) ? $v : (string)($c['def'] ?? '');
                continue;
            }
            if ($c['tipo'] === 'color' && $v !== '' && !preg_match('/^#[0-9a-fA-F]{6}$/', $v)) {
                $v = (string)($c['def'] ?? '');
            }
            // Los enlaces y las imágenes solo aceptan direcciones, nunca javascript:
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
