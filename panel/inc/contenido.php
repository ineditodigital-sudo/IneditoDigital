<?php
/**
 * ============================================================
 * REGISTRO DE CONTENIDO EDITABLE
 * ============================================================
 *
 * Aquí se declara QUÉ puede editar el cliente en cada página, con nombres
 * en lenguaje humano. El panel se genera solo a partir de esto: no hay
 * pantallas escritas a mano por página.
 *
 * Reglas de este archivo:
 *
 *  - El cliente NUNCA ve las claves internas ('titulo_1'), solo la etiqueta.
 *  - Todo campo lleva 'def': el texto que hoy tiene el sitio. Si el cliente
 *    vacía un campo, la página usa ese respaldo y NO se rompe ni se queda
 *    en blanco.
 *  - Solo se declara lo que el sitio realmente tiene. Nada especulativo.
 *
 * Tipos de campo disponibles:
 *   texto     una línea
 *   parrafo   varias líneas
 *   imagen    URL de imagen + texto alternativo
 *   enlace    destino + si abre en otra pestaña
 *   boton     texto del botón + destino
 *   color     selector visual
 *   switch    mostrar / ocultar
 *   numero    cifra corta (estadísticas)
 */

function registro_paginas(): array {
    return [

        /* ---------------------------------------------------------- */
        'home' => [
            'nombre' => 'Inicio',
            'ruta'   => '/',
            'ayuda'  => 'La página principal del sitio, la primera que ve la gente.',
            'secciones' => [

                'portada' => [
                    'nombre' => 'Portada',
                    'ayuda'  => 'Lo primero que aparece al entrar. Conviene que sea corto y directo.',
                    'campos' => [
                        'etiqueta'   => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'Agencia #1 en Aguascalientes',
                                         'ayuda' => 'El textito que va sobre el título grande.'],
                        'titulo_1'   => ['label' => 'Título, primera línea', 'tipo' => 'texto', 'def' => 'MARKETING DIGITAL +'],
                        'titulo_2'   => ['label' => 'Título, segunda línea (en color)', 'tipo' => 'texto', 'def' => 'INTELIGENCIA ARTIFICIAL',
                                         'ayuda' => 'Esta línea se muestra con el degradado morado de la marca.'],
                        'descripcion'=> ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                         'def' => 'Para hacer crecer tu negocio con estrategias de marketing digital potenciadas por IA, automatización y creatividad de vanguardia.'],
                        'boton_1'    => ['label' => 'Botón principal', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                        'boton_2'    => ['label' => 'Botón secundario', 'tipo' => 'texto', 'def' => 'VER SERVICIOS'],
                    ],
                ],

                'cifras' => [
                    'nombre' => 'Cifras destacadas',
                    'ayuda'  => 'Los tres números que aparecen en la portada.',
                    'campos' => [
                        'cifra_1'  => ['label' => 'Primera cifra', 'tipo' => 'numero', 'def' => '100+'],
                        'texto_1'  => ['label' => 'Qué significa', 'tipo' => 'texto', 'def' => 'Clientes Activos'],
                        'cifra_2'  => ['label' => 'Segunda cifra', 'tipo' => 'numero', 'def' => '5X'],
                        'texto_2'  => ['label' => 'Qué significa', 'tipo' => 'texto', 'def' => 'ROI Promedio'],
                        'cifra_3'  => ['label' => 'Tercera cifra', 'tipo' => 'numero', 'def' => '200%'],
                        'texto_3'  => ['label' => 'Qué significa', 'tipo' => 'texto', 'def' => 'Crecimiento'],
                    ],
                ],

                'transformacion' => [
                    'nombre' => 'El poder de la transformación digital',
                    'ayuda'  => 'La franja blanca con las cuatro tarjetas.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'EL PODER DE LA'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'TRANSFORMACIÓN DIGITAL'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Combinamos lo mejor del marketing tradicional con IA y automatización de vanguardia'],
                    ],
                ],

                'servicios' => [
                    'nombre' => 'Nuestros servicios',
                    'ayuda'  => 'El encabezado de la lista de servicios. Los servicios en sí se administran en la sección "Servicios" del menú.',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'NUESTROS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'SERVICIOS'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Soluciones digitales que generan resultados reales y medibles'],
                        'boton'    => ['label' => 'Texto del botón del final', 'tipo' => 'texto', 'def' => 'VER TODOS LOS SERVICIOS'],
                    ],
                ],

                'ia' => [
                    'nombre' => 'Servicios de inteligencia artificial',
                    'ayuda'  => 'La sección oscura con las cuatro soluciones de IA.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'POTENCIA TU NEGOCIO CON IA'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'SERVICIOS DE'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en degradado)', 'tipo' => 'texto', 'def' => 'INTELIGENCIA ARTIFICIAL'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Automatiza, optimiza y escala tu negocio 24/7 con nuestras soluciones de IA personalizadas'],
                    ],
                ],

                'proceso' => [
                    'nombre' => 'Nuestro proceso',
                    'ayuda'  => 'Los cuatro pasos de cómo trabajan.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'NUESTRO PROCESO'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Metodología probada que garantiza resultados excepcionales'],
                        'paso_1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'DESCUBRIMIENTO'],
                        'paso_1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'texto', 'def' => 'Analizamos tu negocio y competencia'],
                        'paso_2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'ESTRATEGIA'],
                        'paso_2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'texto', 'def' => 'Diseñamos el plan de acción ganador'],
                        'paso_3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'EJECUCIÓN'],
                        'paso_3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'texto', 'def' => 'Implementamos con excelencia'],
                        'paso_4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => 'OPTIMIZACIÓN'],
                        'paso_4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'texto', 'def' => 'Mejoramos continuamente resultados'],
                    ],
                ],

                'casos' => [
                    'nombre' => 'Casos de éxito',
                    'ayuda'  => 'El encabezado del carrusel de proyectos. Los proyectos se administran en "Portafolio".',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo'  => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'CASOS DE ÉXITO'],
                        'bajada'  => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Marcas que confían en INÉDITO DIGITAL'],
                        'boton'   => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'VER MÁS CASOS'],
                    ],
                ],

                'cierre' => [
                    'nombre' => 'Llamado final',
                    'ayuda'  => 'El bloque del final que invita a contactar.',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿LISTO PARA CRECER?'],
                        'bajada' => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                     'def' => 'Agenda una consulta gratuita y descubre cómo podemos llevar tu negocio al siguiente nivel'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'AGENDAR CONSULTA GRATIS'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'nosotros' => [
            'nombre' => 'Nosotros',
            'ruta'   => '/nosotros',
            'ayuda'  => 'La página que cuenta quiénes son, su misión, visión y valores.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'SOBRE'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'NOSOTROS'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Somos una agencia de marketing digital en Aguascalientes que combina creatividad, tecnología y estrategia para impulsar el crecimiento de negocios.'],
                    ],
                ],
                'mision' => [
                    'nombre' => 'Misión y visión',
                    'campos' => [
                        'mision_titulo' => ['label' => 'Título de la misión', 'tipo' => 'texto', 'def' => 'NUESTRA MISIÓN'],
                        'mision_texto'  => ['label' => 'Texto de la misión', 'tipo' => 'parrafo',
                                            'def' => 'Democratizar el acceso a marketing digital de clase mundial para empresas de todos los tamaños en Aguascalientes y México, utilizando IA y automatización para generar resultados medibles y escalables.'],
                        'vision_titulo' => ['label' => 'Título de la visión', 'tipo' => 'texto', 'def' => 'NUESTRA VISIÓN'],
                        'vision_texto'  => ['label' => 'Texto de la visión', 'tipo' => 'parrafo',
                                            'def' => 'Ser la agencia líder en transformación digital en el Bajío, reconocida por nuestra innovación en IA, automatización y resultados consistentes que superan las expectativas de nuestros clientes.'],
                    ],
                ],
                'valores' => [
                    'nombre' => 'Nuestros valores',
                    'ayuda'  => 'Los tres valores con icono.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'NUESTROS VALORES'],
                        'v1_titulo'=> ['label' => 'Valor 1 · nombre', 'tipo' => 'texto', 'def' => 'TRANSPARENCIA'],
                        'v1_texto' => ['label' => 'Valor 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Reportes claros, sin letra pequeña. Sabes exactamente dónde va tu inversión.'],
                        'v2_titulo'=> ['label' => 'Valor 2 · nombre', 'tipo' => 'texto', 'def' => 'RESULTADOS'],
                        'v2_texto' => ['label' => 'Valor 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Nos medimos por ROI real, no por vanity metrics.'],
                        'v3_titulo'=> ['label' => 'Valor 3 · nombre', 'tipo' => 'texto', 'def' => 'PARTNERSHIP'],
                        'v3_texto' => ['label' => 'Valor 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Tu éxito es nuestro éxito. Somos tu equipo de crecimiento.'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'contacto' => [
            'nombre' => 'Contacto',
            'ruta'   => '/contacto',
            'ayuda'  => 'Tu teléfono, correo y dirección se editan en "Ajustes"; aquí solo los textos de la página.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'CONTACTO'],
                        'info_titulo' => ['label' => 'Título del bloque de datos', 'tipo' => 'texto', 'def' => 'INFORMACIÓN DE CONTACTO'],
                        'bajada' => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                     'def' => 'Agenda una consulta gratuita y descubre cómo podemos ayudarte'],
                    ],
                ],
                'formulario' => [
                    'nombre' => 'Formulario',
                    'campos' => [
                        'titulo'  => ['label' => 'Título del formulario', 'tipo' => 'texto', 'def' => 'ENVÍANOS UN MENSAJE'],
                        'boton'   => ['label' => 'Texto del botón de enviar', 'tipo' => 'texto', 'def' => 'ENVIAR MENSAJE'],
                        'gracias' => ['label' => 'Mensaje al enviar correctamente', 'tipo' => 'texto',
                                      'def' => '¡Mensaje enviado! Te contactaremos muy pronto.'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'tarjetas-de-presentacion-digital' => [
            'nombre' => 'Tarjetas de Presentación NFC',
            'ruta'   => '/servicios/tarjetas-de-presentacion-digital',
            'ayuda'  => 'Los cuatro pasos animados y los textos de la página de tarjetas NFC.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'TU TARJETA DE PRESENTACIÓN,'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en color)', 'tipo' => 'texto', 'def' => 'AHORA DIGITAL'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Comparte tu contacto, redes y portafolio con un solo toque. Sin imprimir, sin apps, siempre al día.'],
                        'boton'    => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR MI TARJETA'],
                    ],
                ],
                'pasos' => [
                    'nombre' => 'Los cuatro pasos',
                    'ayuda'  => 'Cada paso tiene su animación. Puedes cambiar los textos; la animación se mantiene.',
                    'campos' => [
                        'paso_1_titulo'    => ['label' => 'Paso 1 · título', 'tipo' => 'texto', 'def' => 'Diseño personalizado a tu identidad de marca'],
                        'paso_1_texto'     => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Tu logo, tus colores y tu tipografía sobre la tarjeta física. Tú la apruebas antes de que se produzca nada.'],
                        'paso_1_beneficio' => ['label' => 'Paso 1 · beneficio', 'tipo' => 'texto', 'def' => 'Tu marca, no una plantilla genérica'],
                        'paso_2_titulo'    => ['label' => 'Paso 2 · título', 'tipo' => 'texto', 'def' => 'Conexión con tu propia página de contacto'],
                        'paso_2_texto'     => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Creamos tu página de contacto y programamos el chip NFC para que apunte a ella. Tarjeta y página quedan vinculadas.'],
                        'paso_2_beneficio' => ['label' => 'Paso 2 · beneficio', 'tipo' => 'texto', 'def' => 'Tu propia página, no un perfil de terceros'],
                        'paso_3_titulo'    => ['label' => 'Paso 3 · título', 'tipo' => 'texto', 'def' => 'Acércala para compartir'],
                        'paso_3_texto'     => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Acercas la tarjeta a cualquier celular y tu página de contacto se abre al instante. Sin apps y sin escanear códigos.'],
                        'paso_3_beneficio' => ['label' => 'Paso 3 · beneficio', 'tipo' => 'texto', 'def' => 'Compartes en 1 segundo, no en 1 minuto'],
                        'paso_4_titulo'    => ['label' => 'Paso 4 · título', 'tipo' => 'texto', 'def' => 'Personaliza cualquier elemento de tu página'],
                        'paso_4_texto'     => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Cambias colores, botones, enlaces, redes y secciones cuando quieras. La tarjeta física nunca se reimprime.'],
                        'paso_4_beneficio' => ['label' => 'Paso 4 · beneficio', 'tipo' => 'texto', 'def' => 'Editas todo sin reimprimir nada'],
                    ],
                ],
                'equipos' => [
                    'nombre' => 'Una persona o equipos',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1'=> ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'Para una persona o para'],
                        'titulo_2'=> ['label' => 'Título, segunda parte (en color)', 'tipo' => 'texto', 'def' => 'todo tu equipo'],
                        'nota'    => ['label' => 'Mensaje de "nos adaptamos"', 'tipo' => 'parrafo',
                                      'def' => '¿Son 3 personas? ¿Son 80? Nos adaptamos. Dinos cuántas son y armamos la cotización a la medida de tu equipo.'],
                        'boton'   => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR PARA MI EQUIPO'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'servicios' => [
            'nombre' => 'Servicios (listado)',
            'ruta'   => '/servicios',
            'ayuda'  => 'Solo el encabezado. Los servicios en sí se administran en la sección «Servicios» del menú.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'NUESTROS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'SERVICIOS'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Soluciones digitales integrales que impulsan tu crecimiento con estrategias basadas en resultados'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'portafolio' => [
            'nombre' => 'Portafolio (listado)',
            'ruta'   => '/portafolio',
            'ayuda'  => 'Solo el encabezado. Los proyectos se administran en la sección «Portafolio» del menú.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'CASOS DE'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'ÉXITO'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Descubre cómo hemos transformado negocios en Aguascalientes y México con diseño web excepcional, SEO estratégico y resultados medibles.'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'blog' => [
            'nombre' => 'Blog (listado)',
            'ruta'   => '/blog',
            'ayuda'  => 'Solo el encabezado. Los artículos se administran en la sección «Blog» del menú.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'NUESTRO'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'BLOG'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Estrategias, tips y tendencias de marketing digital que funcionan'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'servicios-ia' => [
            'nombre' => 'Servicios de IA',
            'ruta'   => '/servicios-ia',
            'ayuda'  => 'La página que presenta todas las soluciones de inteligencia artificial.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'SERVICIOS DE INTELIGENCIA ARTIFICIAL'],
                        'titulo_1' => ['label' => 'Título, primera línea', 'tipo' => 'texto', 'def' => 'INTELIGENCIA ARTIFICIAL'],
                        'titulo_2' => ['label' => 'Título, segunda línea (en degradado)', 'tipo' => 'texto', 'def' => 'QUE HACE CRECER TU NEGOCIO'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Automatiza ventas, marketing y atención al cliente con agentes inteligentes que trabajan 24/7.'],
                    ],
                ],
                'soluciones' => [
                    'nombre' => 'Soluciones para cada área',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'SOLUCIONES IA'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en degradado)', 'tipo' => 'texto', 'def' => 'PARA CADA ÁREA'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Selecciona el servicio ideal para tu negocio y empieza a automatizar hoy mismo'],
                    ],
                ],
            ],
        ],

        'servicios-ia-whatsapp' => [
            'nombre' => 'IA para WhatsApp',
            'ruta'   => '/servicios-ia/whatsapp',
            'ayuda'  => 'El encabezado de esta página de servicio de IA.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'IA PARA WHATSAPP'],
                        'titulo'   => ['label' => 'Título principal', 'tipo' => 'texto', 'def' => 'AGENTE INTELIGENTE QUE VENDE 24/7'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Tu mejor vendedor, siempre disponible. Atiende, califica y da seguimiento automático por WhatsApp.'],
                    ],
                ],
                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿LISTO PARA AUTOMATIZAR?'],
                        'bajada' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cotiza este servicio y descubre cómo puede transformar tu negocio'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                    ],
                ],
            ],
        ],

        'servicios-ia-ventas' => [
            'nombre' => 'IA de Ventas',
            'ruta'   => '/servicios-ia/ventas',
            'ayuda'  => 'El encabezado de esta página de servicio de IA.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'IA DE VENTAS'],
                        'titulo'   => ['label' => 'Título principal', 'tipo' => 'texto', 'def' => 'VENDE MÁS CON MENOS ESFUERZO'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Sistema de IA que automatiza prospección, califica leads y optimiza cada etapa de tu proceso comercial.'],
                    ],
                ],
                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿LISTO PARA AUTOMATIZAR?'],
                        'bajada' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cotiza este servicio y descubre cómo puede transformar tu negocio'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                    ],
                ],
            ],
        ],

        'servicios-ia-marketing' => [
            'nombre' => 'IA para Marketing',
            'ruta'   => '/servicios-ia/marketing',
            'ayuda'  => 'El encabezado de esta página de servicio de IA.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'IA PARA MARKETING DIGITAL'],
                        'titulo'   => ['label' => 'Título principal', 'tipo' => 'texto', 'def' => 'MARKETING QUE PIENSA POR TI'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Automatiza contenido, optimiza campañas y multiplica resultados con inteligencia artificial.'],
                    ],
                ],
                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿LISTO PARA AUTOMATIZAR?'],
                        'bajada' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cotiza este servicio y descubre cómo puede transformar tu negocio'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                    ],
                ],
            ],
        ],

        'servicios-ia-ecommerce' => [
            'nombre' => 'IA para E-commerce',
            'ruta'   => '/servicios-ia/ecommerce',
            'ayuda'  => 'El encabezado de esta página de servicio de IA.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'IA PARA E-COMMERCE'],
                        'titulo'   => ['label' => 'Título principal', 'tipo' => 'texto', 'def' => 'CONVIERTE MÁS VISITAS EN VENTAS'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Asistente inteligente dentro de tu tienda que recupera carritos, recomienda productos y atiende 24/7.'],
                    ],
                ],
                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿LISTO PARA AUTOMATIZAR?'],
                        'bajada' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cotiza este servicio y descubre cómo puede transformar tu negocio'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'privacidad' => [
            'nombre' => 'Aviso de Privacidad',
            'ruta'   => '/privacidad',
            'ayuda'  => 'El encabezado y la fecha. El texto legal se cambia con nosotros.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'POLÍTICA DE'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PRIVACIDAD'],
                        'fecha'  => ['label' => 'Fecha de última actualización', 'tipo' => 'texto', 'def' => 'Última actualización: Diciembre 16, 2024'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'terminos' => [
            'nombre' => 'Términos y Condiciones',
            'ruta'   => '/terminos',
            'ayuda'  => 'El encabezado y la fecha. El texto legal se cambia con nosotros.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'TÉRMINOS Y'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'CONDICIONES'],
                        'fecha'  => ['label' => 'Fecha de última actualización', 'tipo' => 'texto', 'def' => 'Última actualización: Diciembre 16, 2024'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */
        'marca' => [
            'nombre' => 'Marca y menús',
            'ruta'   => '/',
            'ayuda'  => 'Los colores, el logotipo, el menú de arriba y el pie de página. Cambian en TODO el sitio.',
            'secciones' => [

                'colores' => [
                    'nombre' => 'Colores de marca',
                    'ayuda'  => 'Se aplican en todo el sitio: botones, títulos y detalles. Elige con el selector, no hace falta escribir códigos.',
                    'campos' => [
                        'principal' => ['label' => 'Color principal', 'tipo' => 'color', 'def' => '#7700CE',
                                        'ayuda' => 'El morado de los botones y los títulos destacados.'],
                        'claro'     => ['label' => 'Color claro', 'tipo' => 'color', 'def' => '#9933FF',
                                        'ayuda' => 'El tono con el que se hacen los degradados.'],
                        'brillo'    => ['label' => 'Color de acento', 'tipo' => 'color', 'def' => '#CC66FF',
                                        'ayuda' => 'El tono más claro, para detalles y resaltados.'],
                    ],
                ],

                'logo' => [
                    'nombre' => 'Logotipo',
                    'campos' => [
                        'imagen' => ['label' => 'Logotipo del sitio', 'tipo' => 'imagen',
                                     'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp'],
                        'alt'    => ['label' => 'Descripción del logotipo', 'tipo' => 'texto',
                                     'def' => 'INÉDITO DIGITAL - Agencia de Marketing Digital en Aguascalientes'],
                    ],
                ],

                'menu' => [
                    'nombre' => 'Menú de arriba',
                    'ayuda'  => 'Cómo se llama cada apartado en la barra superior.',
                    'campos' => [
                        'inicio'      => ['label' => 'Nombre de «Inicio»', 'tipo' => 'texto', 'def' => 'Inicio'],
                        'servicios'   => ['label' => 'Nombre de «Servicios»', 'tipo' => 'texto', 'def' => 'Servicios'],
                        'servicios_ia'=> ['label' => 'Nombre de «Servicios IA»', 'tipo' => 'texto', 'def' => 'Servicios IA'],
                        'portafolio'  => ['label' => 'Nombre de «Portafolio»', 'tipo' => 'texto', 'def' => 'Portafolio'],
                        'blog'        => ['label' => 'Nombre de «Blog»', 'tipo' => 'texto', 'def' => 'Blog'],
                        'nosotros'    => ['label' => 'Nombre de «Nosotros»', 'tipo' => 'texto', 'def' => 'Nosotros'],
                        'contacto'    => ['label' => 'Nombre de «Contacto»', 'tipo' => 'texto', 'def' => 'Contacto'],
                        'boton'       => ['label' => 'Texto del botón del menú', 'tipo' => 'texto', 'def' => 'COTIZAR'],
                    ],
                ],

                'menu_ia' => [
                    'nombre' => 'Submenú de Servicios IA',
                    'campos' => [
                        'whatsapp'        => ['label' => 'IA para WhatsApp · nombre', 'tipo' => 'texto', 'def' => 'IA para WhatsApp'],
                        'whatsapp_desc'   => ['label' => 'IA para WhatsApp · descripción', 'tipo' => 'texto', 'def' => 'Ventas y Soporte 24/7'],
                        'ventas'          => ['label' => 'IA de Ventas · nombre', 'tipo' => 'texto', 'def' => 'IA de Ventas'],
                        'ventas_desc'     => ['label' => 'IA de Ventas · descripción', 'tipo' => 'texto', 'def' => 'Prospección Inteligente'],
                        'marketing'       => ['label' => 'IA para Marketing · nombre', 'tipo' => 'texto', 'def' => 'IA para Marketing'],
                        'marketing_desc'  => ['label' => 'IA para Marketing · descripción', 'tipo' => 'texto', 'def' => 'Optimización Automática'],
                        'ecommerce'       => ['label' => 'IA para E-commerce · nombre', 'tipo' => 'texto', 'def' => 'IA para E-commerce'],
                        'ecommerce_desc'  => ['label' => 'IA para E-commerce · descripción', 'tipo' => 'texto', 'def' => 'Convierte Más Visitas'],
                        'ver_todos'       => ['label' => 'Texto de «Ver todos»', 'tipo' => 'texto', 'def' => 'Ver todos los servicios →'],
                    ],
                ],

                'pie' => [
                    'nombre' => 'Pie de página',
                    'campos' => [
                        'descripcion'  => ['label' => 'Texto debajo del logotipo', 'tipo' => 'parrafo',
                                           'def' => 'Agencia de Marketing Digital en Aguascalientes que impulsa tus ventas con IA y estrategias digitales comprobadas.'],
                        'titulo_serv'  => ['label' => 'Título de la columna de servicios', 'tipo' => 'texto', 'def' => 'SERVICIOS'],
                        'titulo_emp'   => ['label' => 'Título de la columna de empresa', 'tipo' => 'texto', 'def' => 'EMPRESA'],
                        'titulo_cont'  => ['label' => 'Título de la columna de contacto', 'tipo' => 'texto', 'def' => 'CONTACTO'],
                        'derechos'     => ['label' => 'Aviso de derechos', 'tipo' => 'texto',
                                           'def' => '© 2026 INÉDITO DIGITAL. Todos los derechos reservados.'],
                    ],
                ],

                'redes' => [
                    'nombre' => 'Redes sociales',
                    'ayuda'  => 'Déjalo vacío si no quieres que aparezca esa red.',
                    'campos' => [
                        'facebook'  => ['label' => 'Facebook', 'tipo' => 'enlace', 'def' => 'https://www.facebook.com/ineditoagenciadigital'],
                        'instagram' => ['label' => 'Instagram', 'tipo' => 'enlace', 'def' => 'https://www.instagram.com/ineditodigital/'],
                        'linkedin'  => ['label' => 'LinkedIn', 'tipo' => 'enlace', 'def' => 'https://www.linkedin.com/company/inedito-digital/'],
                    ],
                ],
            ],
        ],
    ];
}

/** Valores por defecto de una página, tal como está hoy el sitio. */
function contenido_por_defecto(string $slug): array {
    $reg = registro_paginas()[$slug] ?? null;
    if (!$reg) return [];
    $out = [];
    foreach ($reg['secciones'] as $sk => $sec) {
        foreach ($sec['campos'] as $ck => $campo) {
            $out[$sk][$ck] = $campo['def'] ?? '';
        }
    }
    return $out;
}

/** Mezcla lo guardado con los respaldos: ningún campo puede quedar vacío. */
function contenido_con_respaldo(string $slug, ?string $json): array {
    $base = contenido_por_defecto($slug);
    $guardado = json_decode((string)$json, true);
    if (!is_array($guardado)) return $base;
    foreach ($guardado as $sk => $campos) {
        if (!is_array($campos)) continue;
        foreach ($campos as $ck => $v) {
            // Solo pisa el respaldo si de verdad hay contenido
            if (is_string($v) && trim($v) === '') continue;
            if (isset($base[$sk])) $base[$sk][$ck] = $v;
        }
    }
    return $base;
}
