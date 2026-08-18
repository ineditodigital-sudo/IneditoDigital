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


                'tarjetas' => [
                    'nombre' => 'Las cuatro tarjetas de transformación',
                    'ayuda'  => 'Las tarjetas con imagen de la franja blanca.',
                    'campos' => [
                        't1_titulo' => ['label' => 'Tarjeta 1 · título', 'tipo' => 'texto', 'def' => 'IA'],
                        't1_texto'  => ['label' => 'Tarjeta 1 · descripción', 'tipo' => 'texto', 'def' => 'Automatización y chatbots 24/7'],
                        't1_imagen' => ['label' => 'Tarjeta 1 · imagen', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjU4NjYzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080'],
                        't2_titulo' => ['label' => 'Tarjeta 2 · título', 'tipo' => 'texto', 'def' => 'Estrategia'],
                        't2_texto'  => ['label' => 'Tarjeta 2 · descripción', 'tipo' => 'texto', 'def' => 'Diseños que convierten'],
                        't2_imagen' => ['label' => 'Tarjeta 2 · imagen', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NjU4MTg3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
                        't3_titulo' => ['label' => 'Tarjeta 3 · título', 'tipo' => 'texto', 'def' => 'Analítica'],
                        't3_texto'  => ['label' => 'Tarjeta 3 · descripción', 'tipo' => 'texto', 'def' => 'Decisiones basadas en datos'],
                        't3_imagen' => ['label' => 'Tarjeta 3 · imagen', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2NTg5NTQ4N3ww&ixlib=rb-4.1.0&q=80&w=1080'],
                        't4_titulo' => ['label' => 'Tarjeta 4 · título', 'tipo' => 'texto', 'def' => 'Resultados'],
                        't4_texto'  => ['label' => 'Tarjeta 4 · descripción', 'tipo' => 'texto', 'def' => 'ROI comprobado y crecimiento sostenible'],
                        't4_imagen' => ['label' => 'Tarjeta 4 · imagen', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHJlc3VsdHN8ZW58MXx8fHwxNzY1ODk1NDg3fDA&ixlib=rb-4.1.0&q=80&w=1080'],
                    ],
                ],

                'tarjetas_ia' => [
                    'nombre' => 'Las cuatro tarjetas de IA',
                    'ayuda'  => 'Cada tarjeta de la sección oscura de inteligencia artificial.',
                    'campos' => [
                        'etiqueta_top' => ['label' => 'Etiqueta de la primera tarjeta', 'tipo' => 'texto', 'def' => 'BESTSELLER'],
                        'ver_mas'      => ['label' => 'Texto del enlace de cada tarjeta', 'tipo' => 'texto', 'def' => 'Conocer más'],
                        'boton'        => ['label' => 'Texto del botón del final', 'tipo' => 'texto', 'def' => 'VER TODOS LOS SERVICIOS IA'],

                        'w_titulo' => ['label' => 'WhatsApp · título', 'tipo' => 'texto', 'def' => 'IA PARA WHATSAPP'],
                        'w_texto'  => ['label' => 'WhatsApp · descripción', 'tipo' => 'parrafo', 'def' => 'Agente inteligente que atiende, califica y cierra ventas 24/7. Nunca pierdas otro cliente.'],
                        'w_p1'     => ['label' => 'WhatsApp · punto 1', 'tipo' => 'texto', 'def' => 'Respuestas instantáneas 24/7'],
                        'w_p2'     => ['label' => 'WhatsApp · punto 2', 'tipo' => 'texto', 'def' => 'Calificación automática de leads'],
                        'w_p3'     => ['label' => 'WhatsApp · punto 3', 'tipo' => 'texto', 'def' => 'Integración con tu CRM'],

                        'v_titulo' => ['label' => 'Ventas · título', 'tipo' => 'texto', 'def' => 'IA DE VENTAS'],
                        'v_texto'  => ['label' => 'Ventas · descripción', 'tipo' => 'parrafo', 'def' => 'Encuentra clientes perfectos y cierra más ventas con prospección inteligente automatizada.'],
                        'v_p1'     => ['label' => 'Ventas · punto 1', 'tipo' => 'texto', 'def' => 'Prospección automática LinkedIn'],
                        'v_p2'     => ['label' => 'Ventas · punto 2', 'tipo' => 'texto', 'def' => 'Emails personalizados con IA'],
                        'v_p3'     => ['label' => 'Ventas · punto 3', 'tipo' => 'texto', 'def' => 'Seguimiento predictivo'],

                        'm_titulo' => ['label' => 'Marketing · título', 'tipo' => 'texto', 'def' => 'IA PARA MARKETING'],
                        'm_texto'  => ['label' => 'Marketing · descripción', 'tipo' => 'parrafo', 'def' => 'Campañas que se optimizan solas. Contenido generado por IA. Resultados exponenciales.'],
                        'm_p1'     => ['label' => 'Marketing · punto 1', 'tipo' => 'texto', 'def' => 'Optimización automática de ads'],
                        'm_p2'     => ['label' => 'Marketing · punto 2', 'tipo' => 'texto', 'def' => 'Contenido generado por IA'],
                        'm_p3'     => ['label' => 'Marketing · punto 3', 'tipo' => 'texto', 'def' => 'Análisis predictivo de tendencias'],

                        'e_titulo' => ['label' => 'E-commerce · título', 'tipo' => 'texto', 'def' => 'IA PARA E-COMMERCE'],
                        'e_texto'  => ['label' => 'E-commerce · descripción', 'tipo' => 'parrafo', 'def' => 'Convierte más visitas en ventas. Recomendaciones inteligentes y checkout optimizado.'],
                        'e_p1'     => ['label' => 'E-commerce · punto 1', 'tipo' => 'texto', 'def' => 'Recomendaciones personalizadas'],
                        'e_p2'     => ['label' => 'E-commerce · punto 2', 'tipo' => 'texto', 'def' => 'Recuperación carritos abandonados'],
                        'e_p3'     => ['label' => 'E-commerce · punto 3', 'tipo' => 'texto', 'def' => 'Optimización de precios dinámica'],
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

                'comparacion' => [
                    'nombre' => 'Beneficios: impresa contra NFC',
                    'ayuda'  => 'Las dos columnas que se comparan.',
                    'campos' => [
                        'visible'   => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1'  => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'Lo mismo que hacías,'],
                        'titulo_2'  => ['label' => 'Título, segunda parte (en color)', 'tipo' => 'texto', 'def' => 'sin la parte molesta'],
                        'col_1'     => ['label' => 'Nombre de la columna izquierda', 'tipo' => 'texto', 'def' => 'Tarjeta impresa'],
                        'col_1_sub' => ['label' => 'Subtítulo de la izquierda', 'tipo' => 'texto', 'def' => 'Como siempre'],
                        'col_2'     => ['label' => 'Nombre de la columna derecha', 'tipo' => 'texto', 'def' => 'Tarjeta NFC'],
                        'col_2_sub' => ['label' => 'Subtítulo de la derecha', 'tipo' => 'texto', 'def' => 'Con Inédito'],
                        'f1_impresa' => ['label' => 'Fila 1 · tarjeta impresa', 'tipo' => 'texto', 'def' => 'Dictas o tecleas tus datos'],
                        'f1_nfc'     => ['label' => 'Fila 1 · tarjeta NFC', 'tipo' => 'texto', 'def' => 'Un toque y queda guardado'],
                        'f2_impresa' => ['label' => 'Fila 2 · tarjeta impresa', 'tipo' => 'texto', 'def' => 'Los datos quedan congelados'],
                        'f2_nfc'     => ['label' => 'Fila 2 · tarjeta NFC', 'tipo' => 'texto', 'def' => 'La editas cuando quieras'],
                        'f3_impresa' => ['label' => 'Fila 3 · tarjeta impresa', 'tipo' => 'texto', 'def' => 'Reimprimes con cada cambio'],
                        'f3_nfc'     => ['label' => 'Fila 3 · tarjeta NFC', 'tipo' => 'texto', 'def' => 'Cero reimpresiones'],
                        'f4_impresa' => ['label' => 'Fila 4 · tarjeta impresa', 'tipo' => 'texto', 'def' => 'Termina en un cajón'],
                        'f4_nfc'     => ['label' => 'Fila 4 · tarjeta NFC', 'tipo' => 'texto', 'def' => 'Una impresión que se recuerda'],
                    ],
                ],

                'ficha' => [
                    'nombre' => 'Ficha rápida',
                    'campos' => [
                        'e1_label' => ['label' => 'Dato 1 · nombre', 'tipo' => 'texto', 'def' => 'Compartir'],
                        'e1_valor' => ['label' => 'Dato 1 · valor', 'tipo' => 'texto', 'def' => 'Un toque'],
                        'e2_label' => ['label' => 'Dato 2 · nombre', 'tipo' => 'texto', 'def' => 'Apps'],
                        'e2_valor' => ['label' => 'Dato 2 · valor', 'tipo' => 'texto', 'def' => 'Ninguna'],
                        'e3_label' => ['label' => 'Dato 3 · nombre', 'tipo' => 'texto', 'def' => 'Ediciones'],
                        'e3_valor' => ['label' => 'Dato 3 · valor', 'tipo' => 'texto', 'def' => 'Ilimitadas'],
                        'e4_label' => ['label' => 'Dato 4 · nombre', 'tipo' => 'texto', 'def' => 'Entrega'],
                        'e4_valor' => ['label' => 'Dato 4 · valor', 'tipo' => 'texto', 'def' => '3–5 días'],
                        'texto_tarjeta' => ['label' => 'Texto junto a la tarjeta', 'tipo' => 'parrafo',
                                            'def' => 'Acabado premium con chip NFC dentro. El diseño es tuyo; el contenido lo cambias cuando quieras.'],
                    ],
                ],

                'publico' => [
                    'nombre' => 'Ideal para',
                    'campos' => [
                        'titulo' => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'Ideal para'],
                        'p1' => ['label' => 'Público 1', 'tipo' => 'texto', 'def' => 'Emprendedores y freelancers que hacen networking'],
                        'p2' => ['label' => 'Público 2', 'tipo' => 'texto', 'def' => 'Equipos comerciales que comparten contacto al vuelo'],
                        'p3' => ['label' => 'Público 3', 'tipo' => 'texto', 'def' => 'Consultores que actualizan su información seguido'],
                        'p4' => ['label' => 'Público 4', 'tipo' => 'texto', 'def' => 'Empresas que cuidan su imagen en cada interacción'],
                        'p5' => ['label' => 'Público 5', 'tipo' => 'texto', 'def' => 'Agentes inmobiliarios y asesores en ferias y eventos'],
                    ],
                ],

                'preguntas' => [
                    'nombre' => 'Preguntas frecuentes',
                    'campos' => [
                        'titulo' => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'Preguntas frecuentes'],
                        'q1' => ['label' => 'Pregunta 1', 'tipo' => 'texto', 'def' => '¿Necesito instalar una aplicación para usarla?'],
                        'r1' => ['label' => 'Respuesta 1', 'tipo' => 'parrafo', 'def' => 'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.'],
                        'q2' => ['label' => 'Pregunta 2', 'tipo' => 'texto', 'def' => '¿Qué pasa si cambio de número o de trabajo?'],
                        'r2' => ['label' => 'Respuesta 2', 'tipo' => 'parrafo', 'def' => 'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.'],
                        'q3' => ['label' => 'Pregunta 3', 'tipo' => 'texto', 'def' => '¿Qué información puedo compartir?'],
                        'r3' => ['label' => 'Respuesta 3', 'tipo' => 'parrafo', 'def' => 'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.'],
                        'q4' => ['label' => 'Pregunta 4', 'tipo' => 'texto', 'def' => '¿Cuánto tarda la entrega?'],
                        'r4' => ['label' => 'Respuesta 4', 'tipo' => 'parrafo', 'def' => 'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.'],
                        'q5' => ['label' => 'Pregunta 5', 'tipo' => 'texto', 'def' => '¿Puedo pedir tarjetas para todo mi equipo?'],
                        'r5' => ['label' => 'Respuesta 5', 'tipo' => 'parrafo', 'def' => 'Sí. Cotizamos desde una sola persona hasta equipos completos, con diseño unificado para toda la empresa y una página de contacto propia para cada integrante. Nos adaptamos al tamaño de tu equipo.'],
                    ],
                ],

                'telefono' => [
                    'nombre' => 'La página de contacto que se muestra',
                    'ayuda'  => 'Lo que aparece dentro del celular en las animaciones.',
                    'campos' => [
                        'nombre'  => ['label' => 'Nombre de ejemplo', 'tipo' => 'texto', 'def' => 'TU NOMBRE'],
                        'puesto'  => ['label' => 'Puesto de ejemplo', 'tipo' => 'texto', 'def' => 'Tu puesto · Tu empresa'],
                        'a1' => ['label' => 'Botón 1 de la página', 'tipo' => 'texto', 'def' => 'Guardar contacto'],
                        'a2' => ['label' => 'Botón 2 de la página', 'tipo' => 'texto', 'def' => 'WhatsApp'],
                        'a3' => ['label' => 'Botón 3 de la página', 'tipo' => 'texto', 'def' => 'tuempresa.com'],
                        'a4' => ['label' => 'Botón 4 de la página', 'tipo' => 'texto', 'def' => '@tumarca'],
                    ],
                ],

                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿Listo para modernizar tu tarjeta?'],
                        'texto'  => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cotiza tu tarjeta NFC y empieza a compartir tu contacto con un solo toque.'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
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

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'QUÉ'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'INCLUYE'],
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Conversaciones naturales con IA entrenada en tu negocio'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Integración con CRM, calendarios y sistemas de pago'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Calificación automática de leads con scoring inteligente'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Análisis de sentimiento y priorización de urgencias'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Dashboard con métricas en tiempo real'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Notificaciones instantáneas de leads calificados'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Beneficios principales',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'BENEFICIOS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PRINCIPALES'],
                        'b1_titulo' => ['label' => 'Beneficio 1 · título', 'tipo' => 'texto', 'def' => 'Respuestas Inmediatas'],
                        'b1_texto'  => ['label' => 'Beneficio 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Atiende a tus clientes las 24 horas, los 7 días de la semana, sin perder ninguna oportunidad.'],
                        'b2_titulo' => ['label' => 'Beneficio 2 · título', 'tipo' => 'texto', 'def' => 'Calificación de Prospectos'],
                        'b2_texto'  => ['label' => 'Beneficio 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Identifica automáticamente leads de alta calidad y prioriza tu tiempo en lo que realmente importa.'],
                        'b3_titulo' => ['label' => 'Beneficio 3 · título', 'tipo' => 'texto', 'def' => 'Seguimiento Automático'],
                        'b3_texto'  => ['label' => 'Beneficio 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Nunca pierdas un prospecto. El agente hace seguimiento inteligente hasta concretar la venta.'],
                        'b4_titulo' => ['label' => 'Beneficio 4 · título', 'tipo' => 'texto', 'def' => 'Agenda de Citas'],
                        'b4_texto'  => ['label' => 'Beneficio 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Coordina y agenda reuniones automáticamente, sincronizado con tu calendario.'],
                    ],
                ],

                'como_funciona' => [
                    'nombre' => 'Cómo funciona',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'CÓMO'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'FUNCIONA'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Implementación simple en 4 pasos'],
                        'p1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'Configuración'],
                        'p1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Entrenamos la IA con información de tu negocio y flujos de conversación.'],
                        'p2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'Integración'],
                        'p2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Conectamos el agente a tu WhatsApp Business en minutos.'],
                        'p3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'Automatización'],
                        'p3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => 'El agente empieza a atender, calificar y dar seguimiento automáticamente.'],
                        'p4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => 'Optimización'],
                        'p4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Mejora continua basada en datos reales y comportamiento de usuarios.'],
                    ],
                ],

                'ideal_para' => [
                    'nombre' => 'Ideal para',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'IDEAL'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PARA'],
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Clínicas y consultorios médicos que necesitan agendar citas 24/7'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'Inmobiliarias que califican prospectos y coordinan visitas'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'E-commerce que procesa pedidos y resuelve dudas de productos'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'Servicios profesionales que cotizan y agenden reuniones'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Empresas B2B que califican oportunidades comerciales'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Instituciones educativas que gestionan inscripciones'],
                    ],
                ],

                'imagenes' => [
                    'nombre' => 'Imágenes de la página',
                    'ayuda'  => 'Las fotos que acompañan cada sección.',
                    'campos' => [
                        'hero' => ['label' => 'Imagen de hero', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1659355893994-bddb1ba8e3a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlcyUyMHRlYW0lMjBzbWFydHBob25lJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY3NzMxMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'features' => ['label' => 'Imagen de features', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBkaXNjdXNzaW9ufGVufDF8fHx8MTc2NzYxNjIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'support' => ['label' => 'Imagen de support', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc2NzYxNjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'business' => ['label' => 'Imagen de business', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3klMjBkYXRhfGVufDF8fHx8MTc2NzcyODg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'cta' => ['label' => 'Imagen de cta', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
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

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'QUÉ'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'INCLUYE'],
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Enriquecimiento automático de datos de prospectos'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Integración con LinkedIn, CRM y bases de datos comerciales'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Análisis predictivo de comportamiento de compra'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Secuencias de email y llamadas automatizadas'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Dashboard con métricas de conversión en tiempo real'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Alertas inteligentes de oportunidades de venta'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Beneficios principales',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'BENEFICIOS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PRINCIPALES'],
                        'b1_titulo' => ['label' => 'Beneficio 1 · título', 'tipo' => 'texto', 'def' => 'Prospección Inteligente'],
                        'b1_texto'  => ['label' => 'Beneficio 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Identifica y prioriza automáticamente leads con mayor probabilidad de conversión.'],
                        'b2_titulo' => ['label' => 'Beneficio 2 · título', 'tipo' => 'texto', 'def' => 'Lead Scoring Automático'],
                        'b2_texto'  => ['label' => 'Beneficio 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Califica cada prospecto con criterios personalizados y datos en tiempo real.'],
                        'b3_titulo' => ['label' => 'Beneficio 3 · título', 'tipo' => 'texto', 'def' => 'Seguimiento Predictivo'],
                        'b3_texto'  => ['label' => 'Beneficio 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Sabe cuándo y cómo contactar cada lead para maximizar probabilidad de cierre.'],
                        'b4_titulo' => ['label' => 'Beneficio 4 · título', 'tipo' => 'texto', 'def' => 'Optimización de Pipeline'],
                        'b4_texto'  => ['label' => 'Beneficio 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Identifica cuellos de botella y sugiere acciones para acelerar el ciclo de ventas.'],
                    ],
                ],

                'como_funciona' => [
                    'nombre' => 'Cómo funciona',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'CÓMO'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'FUNCIONA'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Implementación simple en 4 pasos'],
                        'p1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'Análisis'],
                        'p1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => 'La IA analiza tu histórico de ventas y perfil de cliente ideal.'],
                        'p2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'Prospección'],
                        'p2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Busca y califica prospectos automáticamente en múltiples fuentes.'],
                        'p3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'Contacto'],
                        'p3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Ejecuta secuencias personalizadas de email, LinkedIn y llamadas.'],
                        'p4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => 'Optimización'],
                        'p4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Aprende de cada interacción para mejorar continuamente los resultados.'],
                    ],
                ],

                'ideal_para' => [
                    'nombre' => 'Ideal para',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'IDEAL'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PARA'],
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Equipos de ventas B2B que necesitan calificar leads rápidamente'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'Empresas SaaS con ciclos de venta complejos'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'Consultorías y agencias que prospectan empresas'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'Distribuidores mayoristas con grandes volúmenes de clientes'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Startups tecnológicas en fase de crecimiento'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Inmobiliarias comerciales con múltiples desarrollos'],
                    ],
                ],

                'imagenes' => [
                    'nombre' => 'Imágenes de la página',
                    'ayuda'  => 'Las fotos que acompañan cada sección.',
                    'campos' => [
                        'hero' => ['label' => 'Imagen de hero', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1545535408-2b4d520cbd88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwc2FsZXN8ZW58MXx8fHwxNzY3NzI4ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'features' => ['label' => 'Imagen de features', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY3Njc3NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'collaboration' => ['label' => 'Imagen de collaboration', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzY3NjI2NDE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'growth' => ['label' => 'Imagen de growth', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'cta' => ['label' => 'Imagen de cta', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1603219950587-b4f3f7ee87e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NzcwOTAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
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

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'QUÉ'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'INCLUYE'],
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Generación de contenido para redes sociales con IA'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Optimización automática de campañas de Google y Meta Ads'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'A/B testing inteligente de creatividades y copy'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Análisis de sentimiento y monitoreo de marca'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Predicción de tendencias y oportunidades de mercado'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Dashboard unificado con métricas de todas las plataformas'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Beneficios principales',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'BENEFICIOS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PRINCIPALES'],
                        'b1_titulo' => ['label' => 'Beneficio 1 · título', 'tipo' => 'texto', 'def' => 'Análisis Predictivo'],
                        'b1_texto'  => ['label' => 'Beneficio 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Identifica qué campañas funcionarán antes de gastar presupuesto. Decisiones basadas en datos.'],
                        'b2_titulo' => ['label' => 'Beneficio 2 · título', 'tipo' => 'texto', 'def' => 'Automatización Total'],
                        'b2_texto'  => ['label' => 'Beneficio 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Genera contenido, programa publicaciones y optimiza anuncios sin intervención manual.'],
                        'b3_titulo' => ['label' => 'Beneficio 3 · título', 'tipo' => 'texto', 'def' => 'Segmentación Inteligente'],
                        'b3_texto'  => ['label' => 'Beneficio 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Crea audiencias hipersegmentadas que realmente convierten basadas en comportamiento real.'],
                        'b4_titulo' => ['label' => 'Beneficio 4 · título', 'tipo' => 'texto', 'def' => 'ROI Optimizado'],
                        'b4_texto'  => ['label' => 'Beneficio 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Ajusta presupuestos y pujas en tiempo real para maximizar retorno de inversión.'],
                    ],
                ],

                'como_funciona' => [
                    'nombre' => 'Cómo funciona',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'CÓMO'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'FUNCIONA'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Implementación simple en 4 pasos'],
                        'p1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'Conexión'],
                        'p1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Integramos tus cuentas de ads, redes sociales y analytics.'],
                        'p2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'Análisis'],
                        'p2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => 'La IA estudia tu histórico y performance actual.'],
                        'p3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'Automatización'],
                        'p3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Genera contenido, optimiza campañas y segmenta audiencias.'],
                        'p4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => 'Mejora Continua'],
                        'p4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Aprende de resultados y ajusta estrategia automáticamente.'],
                    ],
                ],

                'ideal_para' => [
                    'nombre' => 'Ideal para',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'IDEAL'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PARA'],
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Agencias de marketing que manejan múltiples clientes simultáneamente'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'E-commerce con presupuesto publicitario mensual mayor a $20,000 MXN'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'Empresas SaaS que necesitan generación constante de leads'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'Consultores independientes que buscan escalar su negocio'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Marcas DTC (Direct to Consumer) enfocadas en crecimiento'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Startups en fase de validación de product-market fit'],
                    ],
                ],

                'imagenes' => [
                    'nombre' => 'Imágenes de la página',
                    'ayuda'  => 'Las fotos que acompañan cada sección.',
                    'campos' => [
                        'hero' => ['label' => 'Imagen de hero', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1495055154266-57bbdeada43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwYXV0b21hdGlvbnxlbnwxfHx8fDE3Njc2NTEwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'features' => ['label' => 'Imagen de features', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1767355272538-e7177d16f979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2NyZWVuJTIwYXV0b21hdGlvbnxlbnwxfHx8fDE3Njc3Mjk0MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'analytics' => ['label' => 'Imagen de analytics', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3klMjBkYXRhfGVufDF8fHx8MTc2NzcyODg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'team' => ['label' => 'Imagen de team', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3Njc2Nzg4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'cta' => ['label' => 'Imagen de cta', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
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

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'QUÉ'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'INCLUYE'],
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Chat inteligente que guía desde duda hasta compra'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Upsell y cross-sell automático en momento ideal'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Personalización 1:1 basada en comportamiento'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Automatización de emails activados por acciones'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Análisis predictivo de inventario y tendencias'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Integración con Shopify, WooCommerce, Magento y más'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Beneficios principales',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'BENEFICIOS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PRINCIPALES'],
                        'b1_titulo' => ['label' => 'Beneficio 1 · título', 'tipo' => 'texto', 'def' => 'Recuperación de Carrito'],
                        'b1_texto'  => ['label' => 'Beneficio 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Identifica compradores que abandonaron y los contacta automáticamente con ofertas personalizadas.'],
                        'b2_titulo' => ['label' => 'Beneficio 2 · título', 'tipo' => 'texto', 'def' => 'Recomendaciones Inteligentes'],
                        'b2_texto'  => ['label' => 'Beneficio 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Sugiere productos complementarios en el momento exacto para aumentar el ticket promedio.'],
                        'b3_titulo' => ['label' => 'Beneficio 3 · título', 'tipo' => 'texto', 'def' => 'Soporte Automático 24/7'],
                        'b3_texto'  => ['label' => 'Beneficio 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Resuelve dudas de producto, inventario, envíos y devoluciones sin intervención humana.'],
                        'b4_titulo' => ['label' => 'Beneficio 4 · título', 'tipo' => 'texto', 'def' => 'Más Ventas, Menos Fricción'],
                        'b4_texto'  => ['label' => 'Beneficio 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Reduce abandono de compra con asistencia en tiempo real durante todo el proceso.'],
                    ],
                ],

                'como_funciona' => [
                    'nombre' => 'Cómo funciona',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'CÓMO'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'FUNCIONA'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Implementación simple en 4 pasos'],
                        'p1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'Instalación'],
                        'p1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Conectamos la IA a tu tienda en minutos, sin código.'],
                        'p2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'Entrenamiento'],
                        'p2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => 'La IA aprende tu catálogo, políticas y tono de voz.'],
                        'p3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'Automatización'],
                        'p3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Empieza a asistir, recomendar y recuperar carritos.'],
                        'p4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => 'Optimización'],
                        'p4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Mejora continua basada en conversiones reales.'],
                    ],
                ],

                'ideal_para' => [
                    'nombre' => 'Ideal para',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'IDEAL'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'PARA'],
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Tiendas online con más de 100 visitas diarias que necesitan vender más'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'Marcas propias (DTC) enfocadas en reducir costo de adquisición'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'Shopify Stores con instalación en minutos sin código'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'WooCommerce optimizado para WordPress con plugin nativo'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Vendedores en marketplaces que quieren su propia tienda'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Negocios de dropshipping que buscan automatizar atención'],
                    ],
                ],

                'imagenes' => [
                    'nombre' => 'Imágenes de la página',
                    'ayuda'  => 'Las fotos que acompañan cada sección.',
                    'campos' => [
                        'hero' => ['label' => 'Imagen de hero', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBvbmxpbmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3Njc3MjEzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'features' => ['label' => 'Imagen de features', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1648544365218-188e3d07dcac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGJhZ3MlMjByZXRhaWx8ZW58MXx8fHwxNzY3Njc2NDc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'support' => ['label' => 'Imagen de support', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc2NzYxNjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'growth' => ['label' => 'Imagen de growth', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
                        'cta' => ['label' => 'Imagen de cta', 'tipo' => 'imagen', 'def' => 'https://images.unsplash.com/photo-1603219950587-b4f3f7ee87e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NzcwOTAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
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
