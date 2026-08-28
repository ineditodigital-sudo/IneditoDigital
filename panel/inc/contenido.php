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
                        'titulo_0'   => ['label' => 'Línea superior (la frase que posiciona en Google)', 'tipo' => 'texto', 'def' => 'Agencia de marketing digital en Aguascalientes'],
                        'titulo_1'   => ['label' => 'Título, primera línea', 'tipo' => 'texto', 'def' => 'DIRECCIÓN COMERCIAL'],
                        'titulo_2'   => ['label' => 'Título, segunda línea (en color)', 'tipo' => 'texto', 'def' => 'ASISTIDA POR IA',
                                         'ayuda' => 'Esta línea se muestra con el degradado morado de la marca.'],
                        'descripcion'=> ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                         'def' => 'Para hacer crecer tu negocio con estrategias de marketing digital potenciadas por IA, automatización y creatividad de vanguardia.'],
                        'boton_1'    => ['label' => 'Botón principal', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                        'boton_2'    => ['label' => 'Botón secundario', 'tipo' => 'texto', 'def' => 'VER SERVICIOS'],
                    ],
                ],


                'bento' => [
                    'nombre' => 'Portada · fotos y etiquetas',
                    'ayuda'  => 'El mosaico de fotos de la portada y las dos etiquetas que flotan encima.',
                    'campos' => [
                        'img_1'     => ['label' => 'Foto 1', 'tipo' => 'imagen', 'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/feature-1-1.webp'],
                        'img_1_alt' => ['label' => 'Foto 1 · descripción para buscadores', 'tipo' => 'texto', 'def' => 'Marketing Digital Profesional'],
                        'img_2'     => ['label' => 'Foto 2', 'tipo' => 'imagen', 'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/helping-left-bg.webp'],
                        'img_2_alt' => ['label' => 'Foto 2 · descripción para buscadores', 'tipo' => 'texto', 'def' => 'Experto en Marketing'],
                        'img_3'     => ['label' => 'Foto 3', 'tipo' => 'imagen', 'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/pexels-mikhail-nilov-7681676-scaled.webp'],
                        'img_3_alt' => ['label' => 'Foto 3 · descripción para buscadores', 'tipo' => 'texto', 'def' => 'Tecnología y IA'],
                        'img_4'     => ['label' => 'Foto 4', 'tipo' => 'imagen', 'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/imagen_2024-11-20_172844415.webp'],
                        'img_4_alt' => ['label' => 'Foto 4 · descripción para buscadores', 'tipo' => 'texto', 'def' => 'Equipo Colaborativo'],
                        'chip_1' => ['label' => 'Chip flotante 1', 'tipo' => 'texto', 'def' => 'IA auditando'],
                        'chip_2' => ['label' => 'Chip flotante 2', 'tipo' => 'texto', 'def' => 'Medido hasta la venta'],
                        'chip_3' => ['label' => 'Chip flotante 3', 'tipo' => 'texto', 'def' => 'Visible ante la IA'],
                        'etiqueta_1' => ['label' => 'Etiqueta sobre la primera foto', 'tipo' => 'texto', 'def' => 'Estrategia Digital'],
                        'etiqueta_2' => ['label' => 'Etiqueta sobre la última foto', 'tipo' => 'texto', 'def' => 'Equipo Experto'],
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
                    'nombre' => 'El punto de partida',
                    'ayuda'  => 'El interludio oscuro que plantea el problema: invertir sin medir.',
                    'campos' => [
                        'visible'   => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta'  => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'EL PUNTO DE PARTIDA'],
                        'postura_1' => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'EL MARKETING QUE NO SE MIDE'],
                        'postura_2' => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'ES UN GASTO'],
                        'texto'     => ['label' => 'Texto', 'tipo' => 'area',
                                        'def' => 'Página, redes, campañas: muchas empresas ya invierten en digital sin poder decir qué les regresa cada peso. La transformación digital de verdad empieza cuando todo lo que haces se mide contra ventas.'],
                        's1'        => ['label' => 'Sello 1', 'tipo' => 'texto', 'def' => 'Sin reportes maquillados'],
                        's2'        => ['label' => 'Sello 2', 'tipo' => 'texto', 'def' => 'Sin promesas de humo'],
                        's3'        => ['label' => 'Sello 3', 'tipo' => 'texto', 'def' => 'Sin gastar por gastar'],
                        'enlace'    => ['label' => 'Texto del enlace que baja al enfoque', 'tipo' => 'texto', 'def' => 'ASÍ LO RESOLVEMOS'],
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

                'enfoque' => [
                    'nombre' => 'Banda del nuevo enfoque',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta', 'tipo' => 'texto', 'def' => 'NUEVO'],
                        'titulo_1' => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'NO ES UNA PROMESA,'],
                        'titulo_2' => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'ES UN SISTEMA'],
                        'logos_texto' => ['label' => 'Texto sobre los logos de IA', 'tipo' => 'texto', 'def' => 'Presencia medida en'],
                        'indice_titulo' => ['label' => 'Rótulo sobre la lista de piezas', 'tipo' => 'texto', 'def' => 'Las cuatro piezas del sistema'],
                        'texto'    => ['label' => 'Texto', 'tipo' => 'area', 'def' => 'Marketing digital, publicidad y contenido con todo conectado a datos reales: dirección define los objetivos, y una IA audita cada mes si la estrategia está funcionando.'],
                        'e1_titulo'=> ['label' => 'Enlace 1 · título', 'tipo' => 'texto', 'def' => 'Los tres niveles de servicio'],
                        'e1_texto' => ['label' => 'Enlace 1 · texto', 'tipo' => 'texto', 'def' => 'Construir, mejorar o vender: según en qué punto estés'],
                        'e1_url'   => ['label' => 'Enlace 1 · URL', 'tipo' => 'texto', 'def' => '/servicios'],
                        'e2_titulo'=> ['label' => 'Enlace 2 · título', 'tipo' => 'texto', 'def' => 'Auditoría con IA'],
                        'e2_texto' => ['label' => 'Enlace 2 · texto', 'tipo' => 'texto', 'def' => 'Qué está mal en tu presencia digital, con evidencia'],
                        'e2_url'   => ['label' => 'Enlace 2 · URL', 'tipo' => 'texto', 'def' => '/servicios/auditoria-con-ia'],
                        'e3_titulo'=> ['label' => 'Enlace 3 · título', 'tipo' => 'texto', 'def' => 'Ficha de Google'],
                        'e3_texto' => ['label' => 'Enlace 3 · texto', 'tipo' => 'texto', 'def' => 'El activo más importante y más descuidado'],
                        'e3_url'   => ['label' => 'Enlace 3 · URL', 'tipo' => 'texto', 'def' => '/servicios/ficha-de-google'],
                        'e4_titulo'=> ['label' => 'Enlace 4 · título', 'tipo' => 'texto', 'def' => 'SEO, AEO y GEO'],
                        'e4_texto' => ['label' => 'Enlace 4 · texto', 'tipo' => 'texto', 'def' => 'En qué se diferencian y por qué ya no basta el primero'],
                        'e4_url'   => ['label' => 'Enlace 4 · URL', 'tipo' => 'texto', 'def' => '/blog/seo-aeo-geo-diferencias'],
                    ],
                ],

                'cinta' => [
                    'nombre' => 'Cinta corrediza',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar la cinta', 'tipo' => 'switch', 'def' => '1'],
                        'f1' => ['label' => 'Frase 1', 'tipo' => 'texto', 'def' => 'Estrategia dirigida por objetivos'],
                        'f2' => ['label' => 'Frase 2', 'tipo' => 'texto', 'def' => 'Medimos hasta la venta'],
                        'f3' => ['label' => 'Frase 3', 'tipo' => 'texto', 'def' => 'Formalidad y confianza'],
                        'f4' => ['label' => 'Frase 4', 'tipo' => 'texto', 'def' => 'Visibilidad completa, también ante la IA'],
                    ],
                ],

                'niveles' => [
                    'nombre' => 'Los tres niveles',
                    'campos' => [
                        'visible'    => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1'   => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'EL SERVICIO SE ADAPTA'],
                        'titulo_2'   => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'A DÓNDE ESTÁS'],
                        'bajada'     => ['label' => 'Bajada', 'tipo' => 'area', 'def' => 'No es el mismo trabajo para una empresa que no tiene nada que para una que ya invierte y quiere vender más. Estos son los tres puntos de partida.'],
                        'n1_titulo'  => ['label' => 'Nivel 1 · título', 'tipo' => 'texto', 'def' => 'CONSTRUIR'],
                        'n1_texto'   => ['label' => 'Nivel 1 · texto', 'tipo' => 'area', 'def' => 'Para empresas sin presencia digital. Web veloz que pasa las mediciones de Google, con SEO, AEO y GEO desde el primer día, ficha de Google, LinkedIn y el tablero base.'],
                        'n1_promesa' => ['label' => 'Nivel 1 · promesa', 'tipo' => 'texto', 'def' => 'Cuando te busquen, existes y te ves formal.'],
                        'n2_titulo'  => ['label' => 'Nivel 2 · título', 'tipo' => 'texto', 'def' => 'MEJORAR'],
                        'n2_texto'   => ['label' => 'Nivel 2 · texto', 'tipo' => 'area', 'def' => 'Para empresas con web y redes mal trabajadas. Empieza con una auditoría que dice exactamente qué está mal, con la evidencia de cada hallazgo.'],
                        'n2_promesa' => ['label' => 'Nivel 2 · promesa', 'tipo' => 'texto', 'def' => 'Te decimos exactamente qué está mal y lo arreglamos.'],
                        'n3_titulo'  => ['label' => 'Nivel 3 · título', 'tipo' => 'texto', 'def' => 'VENDER'],
                        'n3_texto'   => ['label' => 'Nivel 3 · texto', 'tipo' => 'area', 'def' => 'Para empresas que ya tienen todo. Estrategia de canales, campañas medidas en un solo tablero y —con ERP— el cruce de prospectos contra ventas cerradas.'],
                        'n3_promesa' => ['label' => 'Nivel 3 · promesa', 'tipo' => 'texto', 'def' => 'Cada peso invertido se mide contra ventas reales.'],
                        'boton'      => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'VER LOS SERVICIOS'],
                    ],
                ],

                'tablero' => [
                    'nombre' => 'El tablero de resultados',
                    'campos' => [
                        'visible'    => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta'   => ['label' => 'Etiqueta', 'tipo' => 'texto', 'def' => 'Lo que recibes'],
                        'titulo_1'   => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'UN TABLERO,'],
                        'titulo_2'   => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'NO UN REPORTE EN PDF'],
                        'texto'      => ['label' => 'Texto', 'tipo' => 'area', 'def' => 'Cada cliente tiene una pantalla conectada a sus datos reales, con el costo por contacto de cada canal lado a lado. Cuando el sistema de la empresa lo permite, llega hasta la venta facturada.'],
                        'p1'         => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Cuántos contactos llegaron y a qué costo cada uno'],
                        'p2'         => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'De dónde llegan: buscador, campañas, redes y respuestas de IA'],
                        'p3'         => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Dónde se cae la gente entre la visita y la venta'],
                        'p4'         => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Una auditoría con IA cada mes contra los objetivos de dirección'],
                        'imagen_alt' => ['label' => 'Texto alternativo de la imagen', 'tipo' => 'texto', 'def' => 'Tablero de resultados de Inédito Digital'],
                        'pie'        => ['label' => 'Pie de la imagen', 'tipo' => 'texto', 'def' => 'Vista del tablero con datos de demostración'],
                    ],
                ],

                'servicios' => [
                    'nombre' => 'Nuestros servicios',
                    'ayuda'  => 'El encabezado de la lista de servicios. Los servicios en sí se administran en la sección "Servicios" del menú.',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'NUESTROS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'SERVICIOS'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'LO QUE HACEMOS'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Soluciones digitales que generan resultados reales y medibles'],
                        'buscador' => ['label' => 'Texto guía del buscador', 'tipo' => 'texto', 'def' => 'Escribe qué necesita tu empresa…'],
                        'ver_mas'  => ['label' => 'Texto del enlace de cada tarjeta', 'tipo' => 'texto', 'def' => 'Ver más'],
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
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'EL CICLO COMPLETO'],
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
                        'etiqueta'=> ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'PORTAFOLIO'],
                        'titulo'  => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'CASOS DE ÉXITO'],
                        'bajada'  => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Marcas que confían en INÉDITO DIGITAL'],
                        'n1_cifra' => ['label' => 'Cifra 1 (vacía = se oculta)', 'tipo' => 'texto', 'def' => '+80%'],
                        'n1_texto' => ['label' => 'Cifra 1 · qué significa', 'tipo' => 'texto', 'def' => 'de tráfico orgánico logrado para un cliente en un año'],
                        'n2_cifra' => ['label' => 'Cifra 2 (vacía = se oculta)', 'tipo' => 'texto', 'def' => '4'],
                        'n2_texto' => ['label' => 'Cifra 2 · qué significa', 'tipo' => 'texto', 'def' => 'motores de IA donde medimos la presencia de cada cliente'],
                        'n3_cifra' => ['label' => 'Cifra 3 (vacía = se oculta)', 'tipo' => 'texto', 'def' => '100%'],
                        'n3_texto' => ['label' => 'Cifra 3 · qué significa', 'tipo' => 'texto', 'def' => 'de nuestros clientes con tablero conectado a datos reales'],
                        'boton'   => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'VER MÁS CASOS'],
                    ],
                ],

                'cierre' => [
                    'nombre' => 'Llamado final',
                    'ayuda'  => 'El bloque del final que invita a contactar.',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'EL SIGUIENTE PASO'],
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'EMPIEZA POR SABER DÓNDE ESTÁS'],
                        'bajada' => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                     'def' => 'Pide la auditoría de tu presencia digital: qué está bien, qué está mal y qué conviene hacer primero, con la evidencia de cada hallazgo.'],
                        'boton'  => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'QUIERO MI AUDITORÍA'],
                        'boton_wa' => ['label' => 'Texto del botón de WhatsApp', 'tipo' => 'texto', 'def' => 'ESCRÍBENOS POR WHATSAPP'],
                    ],
                ],

                'valores' => [
                    'nombre' => 'La casa',
                    'ayuda'  => 'Antes «Trabajamos con pasión»: de dónde somos y cómo se trabaja con nosotros.',
                    'campos' => [
                        'visible'   => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta'  => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'QUIÉN ESTÁ DETRÁS'],
                        'postura_1' => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'DE AGUASCALIENTES,'],
                        'postura_2' => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'PARA EMPRESAS QUE VAN EN SERIO'],
                        'texto'     => ['label' => 'Texto', 'tipo' => 'area',
                                        'def' => 'Estamos en Aguascalientes y trabajamos con empresas de todo México. Lo que se promete queda por escrito, lo que se hace queda medido, y siempre hay una persona que da la cara.'],
                        'promesas_titulo' => ['label' => 'Rótulo sobre las columnas', 'tipo' => 'texto', 'def' => 'Las tres promesas que sostienen todo'],
                        'c1_titulo' => ['label' => 'Promesa 1 · título', 'tipo' => 'texto', 'def' => 'FORMALIDAD Y CONFIANZA'],
                        'c1_texto'  => ['label' => 'Promesa 1 · texto', 'tipo' => 'texto', 'def' => 'Cuando alguien te busca, encuentra una empresa seria: presencia cuidada, soporte y todo en orden, por escrito.'],
                        'c2_titulo' => ['label' => 'Promesa 2 · título', 'tipo' => 'texto', 'def' => 'VISIBILIDAD COMPLETA'],
                        'c2_texto'  => ['label' => 'Promesa 2 · texto', 'tipo' => 'texto', 'def' => 'No solo Google: también los motores de IA que ya recomiendan proveedores. Casi nadie trabaja esto.'],
                        'c3_titulo' => ['label' => 'Promesa 3 · título', 'tipo' => 'texto', 'def' => 'MEDICIÓN HASTA LA VENTA'],
                        'c3_texto'  => ['label' => 'Promesa 3 · texto', 'tipo' => 'texto', 'def' => 'Tablero conectado a datos reales y, cuando tu sistema lo permite, el cruce directo entre campañas y ventas cerradas.'],
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
                                       'def' => 'Somos un equipo de Aguascalientes. Trabajamos con empresas que quieren dejar de invertir en digital a ciegas: conectamos objetivos, datos y campañas en un solo lugar, y auditamos con IA si la estrategia está dando resultado.'],
                    ],
                ],
                'mision' => [
                    'nombre' => 'Misión y visión',
                    'campos' => [
                        'mision_titulo' => ['label' => 'Título de la misión', 'tipo' => 'texto', 'def' => 'NUESTRA MISIÓN'],
                        'mision_texto'  => ['label' => 'Texto de la misión', 'tipo' => 'parrafo',
                                            'def' => 'Que cada peso que una empresa invierte en digital se pueda medir contra ventas reales. Conectamos los objetivos de dirección con Search Console, Analytics y las campañas en un solo tablero, y revisamos periódicamente si la estrategia está funcionando.'],
                        'vision_titulo' => ['label' => 'Título de la visión', 'tipo' => 'texto', 'def' => 'NUESTRA VISIÓN'],
                        'vision_texto'  => ['label' => 'Texto de la visión', 'tipo' => 'parrafo',
                                            'def' => 'Que las empresas de Aguascalientes no solo aparezcan en Google, sino también en las respuestas que dan ChatGPT, Claude y Gemini cuando alguien pregunta por un proveedor. Casi nadie en el mercado está trabajando eso todavía.'],
                    ],
                ],
                'valores' => [
                    'nombre' => 'Nuestros valores',
                    'ayuda'  => 'Los tres valores con icono.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'NUESTRAS TRES PROMESAS'],
                        'v1_titulo'=> ['label' => 'Valor 1 · nombre', 'tipo' => 'texto', 'def' => 'FORMALIDAD Y CONFIANZA'],
                        'v1_texto' => ['label' => 'Valor 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Cuando alguien busca a tu empresa, encuentra un negocio serio: presencia cuidada, datos consistentes en todas partes y soporte real detrás.'],
                        'v2_titulo'=> ['label' => 'Valor 2 · nombre', 'tipo' => 'texto', 'def' => 'VISIBILIDAD COMPLETA'],
                        'v2_texto' => ['label' => 'Valor 2 · descripción', 'tipo' => 'parrafo', 'def' => 'No solo Google. También los motores de IA que cada vez más recomiendan proveedores: ChatGPT, Claude, Gemini y Perplexity.'],
                        'v3_titulo'=> ['label' => 'Valor 3 · nombre', 'tipo' => 'texto', 'def' => 'MEDICIÓN HASTA LA VENTA'],
                        'v3_texto' => ['label' => 'Valor 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Tableros conectados a datos reales y, cuando tu ERP lo permite, cruce directo entre campañas y ventas cerradas. No clics ni likes.'],
                    ],
                ],

                'elegirnos' => [
                    'nombre' => '¿Por qué elegirnos?',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo'  => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿POR QUÉ ELEGIRNOS?'],
                        'texto'   => ['label' => 'Párrafo', 'tipo' => 'area', 'def' => 'No vendemos campañas sueltas. Conectamos los objetivos de tu dirección con los datos reales del negocio, y una IA audita cada mes si la estrategia está funcionando. Si no funciona, lo dice.'],
                    ],
                ],

                'cifras' => [
                    'nombre' => 'Las tres cifras',
                    'campos' => [
                        'c1_valor' => ['label' => 'Cifra 1 · número', 'tipo' => 'texto', 'def' => '100+'],
                        'c1_texto' => ['label' => 'Cifra 1 · texto', 'tipo' => 'texto', 'def' => 'Proyectos exitosos'],
                        'c2_valor' => ['label' => 'Cifra 2 · número', 'tipo' => 'texto', 'def' => '5X'],
                        'c2_texto' => ['label' => 'Cifra 2 · texto', 'tipo' => 'texto', 'def' => 'ROI promedio'],
                        'c3_valor' => ['label' => 'Cifra 3 · número', 'tipo' => 'texto', 'def' => '3'],
                        'c3_texto' => ['label' => 'Cifra 3 · texto', 'tipo' => 'texto', 'def' => 'Niveles de servicio: construir, mejorar y vender'],
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

                'tarjetas' => [
                    'nombre' => 'Tarjetas de la columna derecha',
                    'campos' => [
                        'dir_titulo'  => ['label' => 'Nombre del dato de dirección', 'tipo' => 'texto', 'def' => 'Dirección'],
                        'tel_titulo'  => ['label' => 'Nombre del dato de teléfono', 'tipo' => 'texto', 'def' => 'Teléfono'],
                        'mail_titulo' => ['label' => 'Nombre del dato de email', 'tipo' => 'texto', 'def' => 'Email'],
                        'wa_titulo'   => ['label' => 'Tarjeta de WhatsApp · título', 'tipo' => 'texto', 'def' => '¿PREFIERES WHATSAPP?'],
                        'wa_texto'    => ['label' => 'Tarjeta de WhatsApp · texto', 'tipo' => 'texto', 'def' => 'Respuesta inmediata por WhatsApp'],
                        'wa_boton'    => ['label' => 'Tarjeta de WhatsApp · botón', 'tipo' => 'texto', 'def' => 'CHATEAR AHORA'],
                        'hor_titulo'  => ['label' => 'Tarjeta de horario · título', 'tipo' => 'texto', 'def' => 'HORARIO'],
                    ],
                ],

                'campos_formulario' => [
                    'nombre' => 'Textos dentro del formulario',
                    'ayuda'  => 'Lo que se ve en gris dentro de cada casilla antes de escribir.',
                    'campos' => [
                        'ph_nombre'  => ['label' => 'Casilla de nombre', 'tipo' => 'texto', 'def' => 'Nombre completo *'],
                        'ph_email'   => ['label' => 'Casilla de email', 'tipo' => 'texto', 'def' => 'Email *'],
                        'ph_tel'     => ['label' => 'Casilla de teléfono', 'tipo' => 'texto', 'def' => 'Teléfono *'],
                        'ph_empresa' => ['label' => 'Casilla de empresa', 'tipo' => 'texto', 'def' => 'Empresa'],
                        'ph_mensaje' => ['label' => 'Casilla de mensaje', 'tipo' => 'texto', 'def' => '¿En qué podemos ayudarte? *'],
                        'enviando'   => ['label' => 'Texto del botón mientras envía', 'tipo' => 'texto', 'def' => 'ENVIANDO…'],
                        'error'      => ['label' => 'Aviso si no se pudo enviar', 'tipo' => 'texto', 'def' => 'No se pudo enviar. Escríbenos por WhatsApp, por favor.'],
                        'sin_red'    => ['label' => 'Aviso si no hay conexión', 'tipo' => 'texto', 'def' => 'Error de conexión. Intenta de nuevo o escríbenos por WhatsApp.'],
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
                        'etiqueta'  => ['label' => 'Etiqueta de arriba', 'tipo' => 'texto', 'def' => 'Beneficios'],
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

                'armado' => [
                    'nombre' => 'La animación que arma la tarjeta',
                    'ayuda'  => 'Los textos pequeños alrededor de la tarjeta que se construye sola.',
                    'campos' => [
                        'etiqueta'   => ['label' => 'Etiqueta de la sección', 'tipo' => 'texto', 'def' => 'Así se arma tu tarjeta'],
                        'desliza'        => ['label' => 'Aviso para deslizar la tarjeta', 'tipo' => 'texto', 'def' => 'Desliza para verla armarse desde cero'],
                        'cotiza'         => ['label' => 'Etiqueta de cómo se cotiza', 'tipo' => 'texto', 'def' => 'Cómo se cotiza'],
                        'scroll'     => ['label' => 'Aviso para seguir bajando', 'tipo' => 'texto', 'def' => 'Sigue bajando para armarla'],
                        'tu_pagina'  => ['label' => 'Etiqueta sobre el celular', 'tipo' => 'texto', 'def' => 'Tu página'],
                        'editando'   => ['label' => 'Etiqueta de edición en vivo', 'tipo' => 'texto', 'def' => 'Editando'],
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
                                       'def' => 'Marketing digital, publicidad, mercadotecnia y contenido para empresas de Aguascalientes. Todo conectado a datos reales y medido hasta la venta.'],
                    ],
                ],

                'niveles' => [
                    'nombre' => 'Los tres niveles',
                    'campos' => [
                        'visible'   => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo'    => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿EN QUÉ PUNTO ESTÁS?'],
                        'bajada'    => ['label' => 'Bajada', 'tipo' => 'area', 'def' => 'El servicio se adapta al grado de posicionamiento de cada empresa. Elige por dónde entrar.'],
                        'n1_verbo'  => ['label' => 'Nivel 1 · verbo', 'tipo' => 'texto', 'def' => 'CONSTRUIR'],
                        'n1_lema'   => ['label' => 'Nivel 1 · lema', 'tipo' => 'texto', 'def' => 'Presencia desde cero'],
                        'n1_texto'  => ['label' => 'Nivel 1 · texto', 'tipo' => 'area', 'def' => 'Para empresas que no tienen nada de presencia digital. Web que pasa PageSpeed con SEO, AEO y GEO desde el día uno, ficha de Google, LinkedIn armado y tablero base.'],
                        'n1_promesa'=> ['label' => 'Nivel 1 · promesa', 'tipo' => 'texto', 'def' => 'Cuando te busquen, existes y te ves formal.'],
                        'n2_verbo'  => ['label' => 'Nivel 2 · verbo', 'tipo' => 'texto', 'def' => 'MEJORAR'],
                        'n2_lema'   => ['label' => 'Nivel 2 · lema', 'tipo' => 'texto', 'def' => 'Presencia que compite'],
                        'n2_texto'  => ['label' => 'Nivel 2 · texto', 'tipo' => 'area', 'def' => 'Para empresas con web y redes mal trabajadas. Se entra por la auditoría con IA: del diagnóstico sale el plan de mejora.'],
                        'n2_promesa'=> ['label' => 'Nivel 2 · promesa', 'tipo' => 'texto', 'def' => 'Te decimos exactamente qué está mal y lo arreglamos.'],
                        'n2_enlace' => ['label' => 'Nivel 2 · a dónde lleva', 'tipo' => 'texto', 'def' => '/servicios/auditoria-con-ia'],
                        'n3_verbo'  => ['label' => 'Nivel 3 · verbo', 'tipo' => 'texto', 'def' => 'VENDER'],
                        'n3_lema'   => ['label' => 'Nivel 3 · lema', 'tipo' => 'texto', 'def' => 'Presencia que convierte'],
                        'n3_texto'  => ['label' => 'Nivel 3 · texto', 'tipo' => 'area', 'def' => 'Para empresas que ya tienen todo y quieren resultados. Canales de venta, campañas con tablero unificado y, cuando hay ERP, cruce de prospectos contra ventas cerradas.'],
                        'n3_promesa'=> ['label' => 'Nivel 3 · promesa', 'tipo' => 'texto', 'def' => 'Cada peso invertido se mide contra ventas reales.'],
                    ],
                ],

                'tarjeta' => [
                    'nombre' => 'Enlace de cada tarjeta',
                    'campos' => [
                        'ver_mas' => ['label' => 'Texto del enlace', 'tipo' => 'texto', 'def' => 'Ver detalles'],
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

                'filtros' => [
                    'nombre' => 'Filtros del listado',
                    'campos' => [
                        'todos'  => ['label' => 'Botón de “ver todo”', 'tipo' => 'texto', 'def' => 'TODOS LOS PROYECTOS'],
                        'volver' => ['label' => 'Enlace de regreso en cada proyecto', 'tipo' => 'texto', 'def' => 'Volver al portafolio'],
                    ],
                ],

                'proyecto' => [
                    'nombre' => 'Dentro de cada proyecto',
                    'ayuda'  => 'Los títulos que se repiten en todos los casos de éxito.',
                    'campos' => [
                        'desafio'       => ['label' => 'Título del desafío', 'tipo' => 'texto', 'def' => 'EL DESAFÍO'],
                        'solucion'      => ['label' => 'Título de la solución', 'tipo' => 'texto', 'def' => 'LA SOLUCIÓN'],
                        'resultados'    => ['label' => 'Título de resultados', 'tipo' => 'texto', 'def' => 'RESULTADOS'],
                        'servicios'     => ['label' => 'Título de servicios usados', 'tipo' => 'texto', 'def' => 'SERVICIOS UTILIZADOS'],
                        'no_encontrado' => ['label' => 'Aviso si el proyecto no existe', 'tipo' => 'texto', 'def' => 'Proyecto no encontrado'],
                    ],
                ],

                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'etiqueta' => ['label' => 'Etiqueta de arriba', 'tipo' => 'texto', 'def' => 'PROYECTOS DESTACADOS'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => '¿LISTO PARA TU'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'CASO DE ÉXITO?'],
                        'boton'    => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'AGENDAR CONSULTA GRATIS'],
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

                'navegacion' => [
                    'nombre' => 'Navegación',
                    'campos' => [
                        'volver' => ['label' => 'Enlace de regreso en cada artículo', 'tipo' => 'texto', 'def' => 'Volver al blog'],
                        'no_encontrado' => ['label' => 'Aviso si el artículo no existe', 'tipo' => 'texto', 'def' => 'Post no encontrado'],
                    ],
                ],

                'tarjeta' => [
                    'nombre' => 'Enlace de cada tarjeta',
                    'campos' => [
                        'ver_mas' => ['label' => 'Texto del enlace', 'tipo' => 'texto', 'def' => 'Leer más'],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */

        'posicionamiento-ia' => [
            'nombre'    => 'Posicionamiento en IA (GEO)',
            'ruta'      => '/servicios/posicionamiento-en-ia',
            'ayuda'     => 'La página que vende el posicionamiento en inteligencias artificiales. Sus preguntas frecuentes son lo que más citan los asistentes, así que conviene mantenerlas claras y verificables.',
            'secciones' => [

                'portada' => [
                    'nombre' => 'Portada',
                    'ayuda'  => 'Lo primero que se ve al entrar.',
                    'campos' => [
                        'seo_titulo' => ['label' => 'Título para buscadores', 'tipo' => 'texto', 'def' => 'Posicionamiento en IA (GEO) en Aguascalientes | INÉDITO DIGITAL'],
                        'seo_desc' => ['label' => 'Descripción para buscadores', 'tipo' => 'parrafo', 'def' => 'Logramos que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen bien a tu negocio. Diagnóstico gratuito en Aguascalientes.'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'POSICIONAMIENTO GEO'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'Tus clientes ya no buscan.'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'Preguntan.'],
                        'bajada' => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Cuando alguien le pregunta a una inteligencia artificial por un servicio como el tuyo en Aguascalientes, la respuesta menciona a unos cuantos negocios. Nuestro trabajo es que estés en esa lista, con tus datos correctos y sin que te confundan con nadie.'],
                        'boton_1' => ['label' => 'Botón principal', 'tipo' => 'texto', 'def' => 'DIAGNÓSTICO GRATUITO'],
                        'boton_2' => ['label' => 'Botón secundario', 'tipo' => 'texto', 'def' => 'CÓMO FUNCIONA'],
                    ],
                ],

                'problema' => [
                    'nombre' => 'Por qué ahora',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'El buscador dejó de ser la primera parada'],
                        'texto' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cada vez más gente le pregunta directamente a un asistente en vez de abrir diez pestañas. La IA responde en una sola frase y nombra dos o tres opciones. Si tu negocio no está entre ellas, no perdiste una posición: no apareciste en la conversación. Y a diferencia del buscador, aquí no hay una segunda página donde te puedan encontrar.'],
                    ],
                ],

                'motores' => [
                    'nombre' => 'Los seis asistentes',
                    'ayuda'  => 'Dónde se revisa la marca. Cambia los nombres si algún día conviene otra lista.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'm1' => ['label' => 'Asistente 1 · nombre', 'tipo' => 'texto', 'def' => 'ChatGPT'],
                        'm1_d' => ['label' => 'Asistente 1 · descripción', 'tipo' => 'texto', 'def' => 'OpenAI'],
                        'm2' => ['label' => 'Asistente 2 · nombre', 'tipo' => 'texto', 'def' => 'Google Gemini'],
                        'm2_d' => ['label' => 'Asistente 2 · descripción', 'tipo' => 'texto', 'def' => 'Google'],
                        'm3' => ['label' => 'Asistente 3 · nombre', 'tipo' => 'texto', 'def' => 'AI Overviews'],
                        'm3_d' => ['label' => 'Asistente 3 · descripción', 'tipo' => 'texto', 'def' => 'Resúmenes de Google'],
                        'm4' => ['label' => 'Asistente 4 · nombre', 'tipo' => 'texto', 'def' => 'Perplexity'],
                        'm4_d' => ['label' => 'Asistente 4 · descripción', 'tipo' => 'texto', 'def' => 'Búsqueda con fuentes'],
                        'm5' => ['label' => 'Asistente 5 · nombre', 'tipo' => 'texto', 'def' => 'Claude'],
                        'm5_d' => ['label' => 'Asistente 5 · descripción', 'tipo' => 'texto', 'def' => 'Anthropic'],
                        'm6' => ['label' => 'Asistente 6 · nombre', 'tipo' => 'texto', 'def' => 'Copilot'],
                        'm6_d' => ['label' => 'Asistente 6 · descripción', 'tipo' => 'texto', 'def' => 'Microsoft y Bing'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'DÓNDE'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'TE BUSCAMOS'],
                        'bajada' => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Revisamos los seis asistentes que de verdad usan tus clientes en México, no una lista larga para impresionar.'],
                    ],
                ],

                'comparacion' => [
                    'nombre' => 'Antes y después',
                    'ayuda'  => 'Las dos columnas que comparan cómo responde la IA.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'a1' => ['label' => 'Sin GEO · punto 1', 'tipo' => 'texto', 'def' => 'Te confunde con otro negocio de nombre parecido'],
                        'a2' => ['label' => 'Sin GEO · punto 2', 'tipo' => 'texto', 'def' => 'Repite un teléfono o un horario que cambiaste hace años'],
                        'a3' => ['label' => 'Sin GEO · punto 3', 'tipo' => 'texto', 'def' => 'Dice que no encuentra información y recomienda a tu competencia'],
                        'd1' => ['label' => 'Con Inédito · punto 1', 'tipo' => 'texto', 'def' => 'Te nombra con tu giro y tu ciudad, sin confundirte'],
                        'd2' => ['label' => 'Con Inédito · punto 2', 'tipo' => 'texto', 'def' => 'Usa los datos que tú publicas y que puede verificar'],
                        'd3' => ['label' => 'Con Inédito · punto 3', 'tipo' => 'texto', 'def' => 'Te incluye cuando alguien pregunta por tu servicio en tu zona'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'LO QUE CAMBIA'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'EN LA RESPUESTA'],
                        'antes' => ['label' => 'Encabezado de la columna izquierda', 'tipo' => 'texto', 'def' => 'SIN TRABAJO DE GEO'],
                        'despues' => ['label' => 'Encabezado de la columna derecha', 'tipo' => 'texto', 'def' => 'CON INÉDITO'],
                        'nota' => ['label' => 'Nota al pie', 'tipo' => 'texto', 'def' => 'Ejemplos de lo que encontramos con más frecuencia. Lo tuyo lo vemos en el diagnóstico.'],
                    ],
                ],

                'servicio' => [
                    'nombre' => 'Qué hacemos',
                    'ayuda'  => 'Los seis frentes del servicio.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        's1_t' => ['label' => 'Frente 1 · título', 'tipo' => 'texto', 'def' => 'Diagnóstico de lo que dicen hoy'],
                        's1_d' => ['label' => 'Frente 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Le preguntamos a cada motor por tu marca, tu giro y tus competidores, y te entregamos las respuestas tal cual salen. Casi siempre hay sorpresas.'],
                        's2_t' => ['label' => 'Frente 2 · título', 'tipo' => 'texto', 'def' => 'Datos estructurados en tu sitio'],
                        's2_d' => ['label' => 'Frente 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Marcado Schema.org bien puesto: quién eres, dónde estás, qué vendes y cómo contactarte. Es la forma en que un rastreador entiende tu negocio sin adivinar.'],
                        's3_t' => ['label' => 'Frente 3 · título', 'tipo' => 'texto', 'def' => 'Contenido que se puede citar'],
                        's3_d' => ['label' => 'Frente 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Preguntas reales con respuestas claras y verificables. Un modelo cita lo que puede extraer sin interpretar; escribimos pensando en eso.'],
                        's4_t' => ['label' => 'Frente 4 · título', 'tipo' => 'texto', 'def' => 'Consistencia en tus fuentes'],
                        's4_d' => ['label' => 'Frente 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Mismo nombre, misma dirección, mismo teléfono y mismo giro en tu ficha de Google, directorios, reseñas y redes. Las contradicciones son lo que más te cuesta.'],
                        's5_t' => ['label' => 'Frente 5 · título', 'tipo' => 'texto', 'def' => 'Corrección de datos viejos'],
                        's5_d' => ['label' => 'Frente 5 · descripción', 'tipo' => 'parrafo', 'def' => 'Rastreamos de dónde salen los datos desactualizados que aparecen sobre ti y trabajamos en la fuente, que es el único lugar donde se arreglan de verdad.'],
                        's6_t' => ['label' => 'Frente 6 · título', 'tipo' => 'texto', 'def' => 'Medición mes con mes'],
                        's6_d' => ['label' => 'Frente 6 · descripción', 'tipo' => 'parrafo', 'def' => 'Un reporte que se entiende: en qué preguntas apareces, en cuáles no, qué cambió y qué sigue. Sin métricas inventadas.'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'QUÉ'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'HACEMOS'],
                        'bajada' => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Seis frentes concretos. Todos se pueden revisar y medir.'],
                    ],
                ],

                'proceso' => [
                    'nombre' => 'Cómo trabajamos',
                    'ayuda'  => 'Los cuatro pasos.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'p1_t' => ['label' => 'Paso 1 · título', 'tipo' => 'texto', 'def' => 'Escuchamos'],
                        'p1_d' => ['label' => 'Paso 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Corremos las preguntas que haría un cliente tuyo en los seis motores y guardamos las respuestas como punto de partida.'],
                        'p2_t' => ['label' => 'Paso 2 · título', 'tipo' => 'texto', 'def' => 'Ordenamos'],
                        'p2_d' => ['label' => 'Paso 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Dejamos tu sitio legible para las IAs: datos estructurados, fichas de entidad y acceso limpio para sus rastreadores.'],
                        'p3_t' => ['label' => 'Paso 3 · título', 'tipo' => 'texto', 'def' => 'Publicamos'],
                        'p3_d' => ['label' => 'Paso 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Creamos el contenido que faltaba para responder esas preguntas mejor que nadie en tu zona.'],
                        'p4_t' => ['label' => 'Paso 4 · título', 'tipo' => 'texto', 'def' => 'Medimos'],
                        'p4_d' => ['label' => 'Paso 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Volvemos a preguntar cada mes, comparamos contra el punto de partida y ajustamos lo que no movió.'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'CÓMO'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'TRABAJAMOS'],
                    ],
                ],

                'diagnostico' => [
                    'nombre' => 'Diagnóstico gratuito',
                    'ayuda'  => 'El bloque que pide el diagnóstico.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'SIN COSTO'],
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => '¿Qué dicen las IAs de tu negocio hoy?'],
                        'texto' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Le preguntamos por ti a los seis asistentes y te mandamos las respuestas tal cual salen, junto con lo que habría que corregir. Sin compromiso y sin letra chica: si con eso te arreglas solo, qué bueno.'],
                        'boton' => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'PEDIR MI DIAGNÓSTICO'],
                    ],
                ],

                'preguntas' => [
                    'nombre' => 'Preguntas frecuentes',
                    'ayuda'  => 'Esta sección es la que más citan las inteligencias artificiales. Entre más claras y verificables sean las respuestas, mejor.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'q1' => ['label' => 'Pregunta 1 · pregunta', 'tipo' => 'texto', 'def' => '¿Qué es el posicionamiento GEO?'],
                        'r1' => ['label' => 'Pregunta 1 · respuesta', 'tipo' => 'parrafo', 'def' => 'GEO significa Generative Engine Optimization: el trabajo de lograr que los asistentes de inteligencia artificial encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta. Es el equivalente al SEO, pero para ChatGPT, Gemini, Perplexity y los resúmenes de Google en vez de la lista de resultados azules.'],
                        'q2' => ['label' => 'Pregunta 2 · pregunta', 'tipo' => 'texto', 'def' => '¿En qué se diferencia del SEO de toda la vida?'],
                        'r2' => ['label' => 'Pregunta 2 · respuesta', 'tipo' => 'parrafo', 'def' => 'El SEO busca que tu página aparezca en una lista y que la persona haga clic. El GEO busca que la IA use tu información al redactar su respuesta, aunque nadie entre a tu sitio. Comparten mucha base técnica, pero cambia lo que se optimiza: en GEO importa más que tus datos sean verificables, consistentes y fáciles de extraer que la posición en un ranking.'],
                        'q3' => ['label' => 'Pregunta 3 · pregunta', 'tipo' => 'texto', 'def' => '¿Se puede modificar lo que ChatGPT dice de mi empresa?'],
                        'r3' => ['label' => 'Pregunta 3 · respuesta', 'tipo' => 'parrafo', 'def' => 'No directamente: nadie puede reentrenar un modelo desde fuera, y quien te prometa eso te está vendiendo algo que no existe. Lo que sí se puede es cambiar la materia prima con la que responde. Estos asistentes consultan la web en tiempo real y se apoyan en fuentes verificables, así que ordenar esas fuentes, corregir los datos viejos y publicar información citable sí cambia sus respuestas.'],
                        'q4' => ['label' => 'Pregunta 4 · pregunta', 'tipo' => 'texto', 'def' => '¿Cuánto tarda en verse un cambio?'],
                        'r4' => ['label' => 'Pregunta 4 · respuesta', 'tipo' => 'parrafo', 'def' => 'Lo que depende de tu sitio, como los datos estructurados, se refleja en días. Lo que depende de fuentes externas, como directorios y reseñas, toma más: entre uno y tres meses según qué tan regada esté la información. Te lo medimos cada mes para que no sea cuestión de fe.'],
                        'q5' => ['label' => 'Pregunta 5 · pregunta', 'tipo' => 'texto', 'def' => '¿Sirve para un negocio local de Aguascalientes?'],
                        'r5' => ['label' => 'Pregunta 5 · respuesta', 'tipo' => 'parrafo', 'def' => 'Sirve especialmente. Cuando alguien pregunta por un servicio en una ciudad concreta, los asistentes se apoyan mucho en señales locales: la ficha de Google, las reseñas, los directorios de la zona y la coherencia entre todos. Un negocio local bien ordenado compite muy bien en esas respuestas, incluso contra marcas más grandes.'],
                        'q6' => ['label' => 'Pregunta 6 · pregunta', 'tipo' => 'texto', 'def' => '¿Necesito rehacer mi sitio web?'],
                        'r6' => ['label' => 'Pregunta 6 · respuesta', 'tipo' => 'parrafo', 'def' => 'Casi nunca. Buena parte del trabajo se hace sobre lo que ya tienes. Si tu sitio no se puede editar o los rastreadores no lo pueden leer, te lo decimos en el diagnóstico y lo tratamos aparte, sin meterlo en el mismo paquete.'],
                        'q7' => ['label' => 'Pregunta 7 · pregunta', 'tipo' => 'texto', 'def' => '¿Cuánto cuesta?'],
                        'r7' => ['label' => 'Pregunta 7 · respuesta', 'tipo' => 'parrafo', 'def' => 'Depende del tamaño de tu marca y de qué tan dispersa esté hoy tu información, así que se cotiza después del diagnóstico. El diagnóstico no tiene costo y no compromete a nada.'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'PREGUNTAS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'FRECUENTES'],
                    ],
                ],

                'local' => [
                    'nombre' => 'Aguascalientes',
                    'ayuda'  => 'El bloque que ancla el servicio a la ciudad.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'Posicionamiento GEO en Aguascalientes'],
                        'texto' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Somos una agencia de marketing digital con base en Aguascalientes, y trabajamos el posicionamiento en inteligencia artificial para negocios de la ciudad y del Bajío. Conocer el mercado local importa: cuando alguien pregunta por un servicio en Aguascalientes, las respuestas se arman con fuentes de aquí, y saber cuáles son es la mitad del trabajo.'],
                        'enlace_1_url' => ['label' => 'Enlace 1 · destino', 'tipo' => 'enlace', 'def' => '/servicios'],
                        'enlace_1' => ['label' => 'Enlace 1 · texto', 'tipo' => 'texto', 'def' => 'Todos nuestros servicios'],
                        'enlace_2_url' => ['label' => 'Enlace 2 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia'],
                        'enlace_2' => ['label' => 'Enlace 2 · texto', 'tipo' => 'texto', 'def' => 'Soluciones de IA'],
                        'enlace_3_url' => ['label' => 'Enlace 3 · destino', 'tipo' => 'enlace', 'def' => '/contacto'],
                        'enlace_3' => ['label' => 'Enlace 3 · texto', 'tipo' => 'texto', 'def' => 'Hablar con nosotros'],
                    ],
                ],

                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => '¿EMPEZAMOS POR VER'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'DÓNDE ESTÁS?'],
                        'texto' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'El diagnóstico no cuesta y te lo entregamos aunque decidas no contratarnos.'],
                        'boton' => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'QUIERO MI DIAGNÓSTICO'],
                    ],
                ],
            ],
        ],

        'servicio-detalle' => [
            'nombre'    => 'Plantilla de página de servicio',
            'ruta'      => '/servicios/…',
            'ayuda'     => 'Lo que se repite en TODAS las páginas de servicio. El nombre, la descripción y los puntos de cada servicio se editan en la sección “Servicios”.',
            'secciones' => [

                'encabezados' => [
                    'nombre' => 'Títulos de las secciones',
                    'campos' => [
                        'volver'        => ['label' => 'Enlace de regreso', 'tipo' => 'texto', 'def' => 'Volver a servicios'],
                        'no_encontrado' => ['label' => 'Aviso si el servicio no existe', 'tipo' => 'texto', 'def' => 'Servicio no encontrado'],
                        'inc_1'         => ['label' => 'Qué incluye · primera palabra', 'tipo' => 'texto', 'def' => 'QUÉ'],
                        'inc_2'         => ['label' => 'Qué incluye · segunda palabra (en morado)', 'tipo' => 'texto', 'def' => 'INCLUYE'],
                        'ideal_1'       => ['label' => 'Ideal para · primera palabra', 'tipo' => 'texto', 'def' => 'IDEAL'],
                        'ideal_2'       => ['label' => 'Ideal para · segunda palabra (en morado)', 'tipo' => 'texto', 'def' => 'PARA'],
                        'proceso_1'     => ['label' => 'Proceso · primera palabra', 'tipo' => 'texto', 'def' => 'NUESTRO'],
                        'proceso_2'     => ['label' => 'Proceso · segunda palabra (en morado)', 'tipo' => 'texto', 'def' => 'PROCESO'],
                        'proceso_sello' => ['label' => 'Sello sobre la foto del proceso', 'tipo' => 'texto', 'def' => 'Proceso comprobado'],
                        'ben_1'   => ['label' => 'Beneficios · palabra 1', 'tipo' => 'texto', 'def' => 'LO QUE'],
                        'ben_2'   => ['label' => 'Beneficios · palabra 2', 'tipo' => 'texto', 'def' => 'GANAS'],
                        'ben_bajada' => ['label' => 'Beneficios · bajada', 'tipo' => 'texto', 'def' => 'Para qué sirve, en concreto.'],
                        'faq_1'         => ['label' => 'Preguntas · primera palabra', 'tipo' => 'texto', 'def' => 'PREGUNTAS'],
                        'faq_2'         => ['label' => 'Preguntas · segunda palabra (en morado)', 'tipo' => 'texto', 'def' => 'FRECUENTES'],
                    ],
                ],

                'demos' => [
                    'nombre' => 'Demos interactivas',
                    'ayuda'  => 'Solo aparecen en el servicio de Activaciones para Expo.',
                    'campos' => [
                        'visible'   => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1'  => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'PRUEBA NUESTROS'],
                        'titulo_2'  => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'DEMOS'],
                        'bajada'    => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Explora en vivo las activaciones interactivas que podemos implementar en tu stand'],
                        'etiqueta'  => ['label' => 'Etiqueta verde de cada demo', 'tipo' => 'texto', 'def' => '✓ DISPONIBLE'],
                        'boton'     => ['label' => 'Texto del botón de cada demo', 'tipo' => 'texto', 'def' => 'VER DEMO'],
                    'd1_titulo' => ['label' => 'Demo 1 · nombre', 'tipo' => 'texto', 'def' => 'RULETA DE PREMIOS'],
                    'd1_texto'  => ['label' => 'Demo 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Ruleta interactiva totalmente personalizable. Perfecta para sorteos, rifas y dinámicas de gamificación en tu stand.'],
                    'd1_url'    => ['label' => 'Demo 1 · enlace de la demo', 'tipo' => 'enlace', 'def' => 'https://ruleta-expo.inedito.digital/demo'],
                    'd2_titulo' => ['label' => 'Demo 2 · nombre', 'tipo' => 'texto', 'def' => 'PHOTO OPPORTUNITY'],
                    'd2_texto'  => ['label' => 'Demo 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Photobooth con marcos personalizados de tu marca. Captura fotos, compártelas y genera engagement viral en redes sociales.'],
                    'd2_url'    => ['label' => 'Demo 2 · enlace de la demo', 'tipo' => 'enlace', 'def' => 'https://photo-oportunity.inedito.digital/demo'],
                    'd3_titulo' => ['label' => 'Demo 3 · nombre', 'tipo' => 'texto', 'def' => 'TIC TAC TOE'],
                    'd3_texto'  => ['label' => 'Demo 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Gato interactivo con premios. Juega contra la IA y gana. Diversión garantizada para atraer visitantes a tu stand.'],
                    'd3_url'    => ['label' => 'Demo 3 · enlace de la demo', 'tipo' => 'enlace', 'def' => 'https://tic-tac-toe.inedito.digital/demo'],
                        'cta_texto' => ['label' => 'Pregunta del final', 'tipo' => 'texto', 'def' => '¿Necesitas una activación personalizada para tu evento?'],
                        'cta_boton' => ['label' => 'Botón del final', 'tipo' => 'texto', 'def' => 'COTIZAR ACTIVACIÓN PERSONALIZADA'],
                    ],
                ],


                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => '¿LISTO PARA'],
                        'titulo_2' => ['label' => 'Título, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'COMENZAR?'],
                        'boton'    => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                    ],
                ],
            ],
        ],

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

                'cifras' => [
                    'nombre' => 'Cifras de la portada',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'c1_valor' => ['label' => 'Cifra 1 · número', 'tipo' => 'texto', 'def' => '24/7'],
                        'c1_texto' => ['label' => 'Cifra 1 · texto', 'tipo' => 'texto', 'def' => 'Disponibilidad'],
                        'c2_valor' => ['label' => 'Cifra 2 · número', 'tipo' => 'texto', 'def' => '10x'],
                        'c2_texto' => ['label' => 'Cifra 2 · texto', 'tipo' => 'texto', 'def' => 'Más Eficiencia'],
                        'c3_valor' => ['label' => 'Cifra 3 · número', 'tipo' => 'texto', 'def' => '80%'],
                        'c3_texto' => ['label' => 'Cifra 3 · texto', 'tipo' => 'texto', 'def' => 'Ahorro en Costos'],
                        'c4_valor' => ['label' => 'Cifra 4 · número', 'tipo' => 'texto', 'def' => '100%'],
                        'c4_texto' => ['label' => 'Cifra 4 · texto', 'tipo' => 'texto', 'def' => 'Automatizado'],
                    ],
                ],

                'tarjetas' => [
                    'nombre' => 'Las cuatro soluciones',
                    'ayuda'  => 'Cada tarjeta del listado de soluciones de IA.',
                    'campos' => [
                        'ver_mas' => ['label' => 'Texto del enlace de cada tarjeta', 'tipo' => 'texto', 'def' => 'Ver más detalles'],
                        'boton_portada' => ['label' => 'Botón de la portada', 'tipo' => 'texto', 'def' => 'CONSULTORÍA GRATUITA'],
                        'boton_cierre'  => ['label' => 'Botón del final', 'tipo' => 'texto', 'def' => 'AGENDAR CONSULTORÍA'],
                        'w_titulo' => ['label' => 'Tarjeta 1 · nombre', 'tipo' => 'texto', 'def' => 'IA para WhatsApp'],
                        'w_sub'    => ['label' => 'Tarjeta 1 · subtítulo', 'tipo' => 'texto', 'def' => 'Ventas y Soporte 24/7'],
                        'w_texto'  => ['label' => 'Tarjeta 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Tu mejor vendedor, disponible siempre. Agente inteligente que atiende, califica y da seguimiento automático.'],
                        'w_url'    => ['label' => 'Tarjeta 1 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia/whatsapp'],
                        'w_e1'     => ['label' => 'Tarjeta 1 · etiqueta 1', 'tipo' => 'texto', 'def' => 'Atiende 24/7'],
                        'w_e2'     => ['label' => 'Tarjeta 1 · etiqueta 2', 'tipo' => 'texto', 'def' => 'Califica leads'],
                        'w_e3'     => ['label' => 'Tarjeta 1 · etiqueta 3', 'tipo' => 'texto', 'def' => 'Seguimiento auto'],
                        'v_titulo' => ['label' => 'Tarjeta 2 · nombre', 'tipo' => 'texto', 'def' => 'IA de Ventas'],
                        'v_sub'    => ['label' => 'Tarjeta 2 · subtítulo', 'tipo' => 'texto', 'def' => 'Prospección Inteligente'],
                        'v_texto'  => ['label' => 'Tarjeta 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Automatiza prospección, califica leads y optimiza tu proceso comercial con inteligencia artificial.'],
                        'v_url'    => ['label' => 'Tarjeta 2 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia/ventas'],
                        'v_e1'     => ['label' => 'Tarjeta 2 · etiqueta 1', 'tipo' => 'texto', 'def' => 'Prospección auto'],
                        'v_e2'     => ['label' => 'Tarjeta 2 · etiqueta 2', 'tipo' => 'texto', 'def' => 'Lead scoring'],
                        'v_e3'     => ['label' => 'Tarjeta 2 · etiqueta 3', 'tipo' => 'texto', 'def' => 'Optimización'],
                        'm_titulo' => ['label' => 'Tarjeta 3 · nombre', 'tipo' => 'texto', 'def' => 'IA para Marketing'],
                        'm_sub'    => ['label' => 'Tarjeta 3 · subtítulo', 'tipo' => 'texto', 'def' => 'Optimización Automática'],
                        'm_texto'  => ['label' => 'Tarjeta 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Marketing que piensa por ti. Analiza campañas, genera contenido y optimiza resultados automáticamente.'],
                        'm_url'    => ['label' => 'Tarjeta 3 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia/marketing'],
                        'm_e1'     => ['label' => 'Tarjeta 3 · etiqueta 1', 'tipo' => 'texto', 'def' => 'Análisis auto'],
                        'm_e2'     => ['label' => 'Tarjeta 3 · etiqueta 2', 'tipo' => 'texto', 'def' => 'Contenido IA'],
                        'm_e3'     => ['label' => 'Tarjeta 3 · etiqueta 3', 'tipo' => 'texto', 'def' => 'ROI optimizado'],
                        'e_titulo' => ['label' => 'Tarjeta 4 · nombre', 'tipo' => 'texto', 'def' => 'IA para E-commerce'],
                        'e_sub'    => ['label' => 'Tarjeta 4 · subtítulo', 'tipo' => 'texto', 'def' => 'Convierte Más Visitas'],
                        'e_texto'  => ['label' => 'Tarjeta 4 · descripción', 'tipo' => 'parrafo', 'def' => 'Asistente inteligente en tu tienda online que recupera carritos, recomienda productos y atiende 24/7.'],
                        'e_url'    => ['label' => 'Tarjeta 4 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia/ecommerce'],
                        'e_e1'     => ['label' => 'Tarjeta 4 · etiqueta 1', 'tipo' => 'texto', 'def' => 'Recupera carritos'],
                        'e_e2'     => ['label' => 'Tarjeta 4 · etiqueta 2', 'tipo' => 'texto', 'def' => 'Recomendaciones'],
                        'e_e3'     => ['label' => 'Tarjeta 4 · etiqueta 3', 'tipo' => 'texto', 'def' => 'Soporte 24/7'],
                    ],
                ],

                'por_que' => [
                    'nombre' => '¿Por qué inteligencia artificial?',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título, primera línea', 'tipo' => 'texto', 'def' => '¿POR QUÉ'],
                        'titulo_2' => ['label' => 'Título, segunda línea (en degradado)', 'tipo' => 'texto', 'def' => 'INTELIGENCIA ARTIFICIAL?'],
                        'r1_titulo' => ['label' => 'Razón 1 · título', 'tipo' => 'texto', 'def' => 'Velocidad'],
                        'r1_texto'  => ['label' => 'Razón 1 · descripción', 'tipo' => 'parrafo', 'def' => 'Respuestas instantáneas, 24/7. Sin esperas, sin horarios, sin días festivos.'],
                        'r2_titulo' => ['label' => 'Razón 2 · título', 'tipo' => 'texto', 'def' => 'Escalabilidad'],
                        'r2_texto'  => ['label' => 'Razón 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Atiende a 1 o 10,000 clientes simultáneamente sin aumentar tu equipo.'],
                        'r3_titulo' => ['label' => 'Razón 3 · título', 'tipo' => 'texto', 'def' => 'Precisión'],
                        'r3_texto'  => ['label' => 'Razón 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Análisis de datos en tiempo real y toma de decisiones basadas en métricas.'],
                    ],
                ],

                'cierre' => [
                    'nombre' => 'Llamado final',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera línea', 'tipo' => 'texto', 'def' => 'EMPIEZA A AUTOMATIZAR'],
                        'titulo_2' => ['label' => 'Título, segunda línea (en degradado)', 'tipo' => 'texto', 'def' => 'TU NEGOCIO HOY'],
                        'texto'    => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Agenda una consultoría gratuita y descubre cómo la IA puede transformar tu forma de vender, hacer marketing y atender clientes.'],
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

                'navegacion' => [
                    'nombre' => 'Navegación y sellos',
                    'campos' => [
                        'volver' => ['label' => 'Enlace de regreso', 'tipo' => 'texto', 'def' => 'Volver a Servicios IA'],
                        'sello'  => ['label' => 'Sello sobre la foto del proceso', 'tipo' => 'texto', 'def' => 'Implementación rápida'],
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

                'navegacion' => [
                    'nombre' => 'Navegación y sellos',
                    'campos' => [
                        'volver' => ['label' => 'Enlace de regreso', 'tipo' => 'texto', 'def' => 'Volver a Servicios IA'],
                        'sello'  => ['label' => 'Sello sobre la foto del proceso', 'tipo' => 'texto', 'def' => 'Sistema probado'],
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

                'navegacion' => [
                    'nombre' => 'Navegación y sellos',
                    'campos' => [
                        'volver' => ['label' => 'Enlace de regreso', 'tipo' => 'texto', 'def' => 'Volver a Servicios IA'],
                        'sello'  => ['label' => 'Sello sobre la foto del proceso', 'tipo' => 'texto', 'def' => 'Integración completa'],
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

                'navegacion' => [
                    'nombre' => 'Navegación y sellos',
                    'campos' => [
                        'volver' => ['label' => 'Enlace de regreso', 'tipo' => 'texto', 'def' => 'Volver a Servicios IA'],
                        'sello'  => ['label' => 'Sello sobre la foto del proceso', 'tipo' => 'texto', 'def' => 'Instalación rápida'],
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

                'apartados' => [
                    'nombre' => 'Apartados del aviso',
                    'ayuda'  => 'Cada apartado del texto legal. Apaga el interruptor para quitar un apartado. Los tres últimos están libres para que agregues los tuyos.',
                    'campos' => [
                        'a1_ver'    => ['label' => 'Apartado 1 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a1_titulo' => ['label' => 'Apartado 1 · título', 'tipo' => 'texto', 'def' => '1. Información que Recopilamos'],
                        'a1_texto'  => ['label' => 'Apartado 1 · texto', 'tipo' => 'parrafo', 'def' => 'Recopilamos información que nos proporcionas directamente al usar nuestros servicios: nombre, correo electrónico, teléfono, empresa, y cualquier otra información que decidas compartir.'],
                        'a1_lista'  => ['label' => 'Apartado 1 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a2_ver'    => ['label' => 'Apartado 2 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a2_titulo' => ['label' => 'Apartado 2 · título', 'tipo' => 'texto', 'def' => '2. Uso de la Información'],
                        'a2_texto'  => ['label' => 'Apartado 2 · texto', 'tipo' => 'parrafo', 'def' => 'Utilizamos la información recopilada para:'],
                        'a2_lista'  => ['label' => 'Apartado 2 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => 'Proporcionar y mejorar nuestros servicios\nComunicarnos contigo sobre nuestros servicios\nEnviar información relevante de marketing (con tu consentimiento)\nAnalizar el uso de nuestro sitio web'],
                        'a3_ver'    => ['label' => 'Apartado 3 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a3_titulo' => ['label' => 'Apartado 3 · título', 'tipo' => 'texto', 'def' => '3. Protección de Datos'],
                        'a3_texto'  => ['label' => 'Apartado 3 · texto', 'tipo' => 'parrafo', 'def' => 'Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.'],
                        'a3_lista'  => ['label' => 'Apartado 3 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a4_ver'    => ['label' => 'Apartado 4 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a4_titulo' => ['label' => 'Apartado 4 · título', 'tipo' => 'texto', 'def' => '4. Cookies'],
                        'a4_texto'  => ['label' => 'Apartado 4 · texto', 'tipo' => 'parrafo', 'def' => 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio, analizar el tráfico y personalizar contenido.'],
                        'a4_lista'  => ['label' => 'Apartado 4 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a5_ver'    => ['label' => 'Apartado 5 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a5_titulo' => ['label' => 'Apartado 5 · título', 'tipo' => 'texto', 'def' => '5. Tus Derechos'],
                        'a5_texto'  => ['label' => 'Apartado 5 · texto', 'tipo' => 'parrafo', 'def' => 'Tienes derecho a acceder, corregir o eliminar tu información personal. Para ejercer estos derechos, contáctanos en contacto@inedito.digital'],
                        'a5_lista'  => ['label' => 'Apartado 5 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a6_ver'    => ['label' => 'Apartado 6 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a6_titulo' => ['label' => 'Apartado 6 · título', 'tipo' => 'texto', 'def' => '6. Contacto'],
                        'a6_texto'  => ['label' => 'Apartado 6 · texto', 'tipo' => 'parrafo', 'def' => 'Si tienes preguntas sobre esta política de privacidad, contáctanos:\nEmail: contacto@inedito.digital\nTeléfono: +52 1 449 583 9229'],
                        'a6_lista'  => ['label' => 'Apartado 6 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a7_ver'    => ['label' => 'Apartado 7 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a7_titulo' => ['label' => 'Apartado 7 · título (libre)', 'tipo' => 'texto', 'def' => ''],
                        'a7_texto'  => ['label' => 'Apartado 7 · texto', 'tipo' => 'parrafo', 'def' => ''],
                        'a7_lista'  => ['label' => 'Apartado 7 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a8_ver'    => ['label' => 'Apartado 8 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a8_titulo' => ['label' => 'Apartado 8 · título (libre)', 'tipo' => 'texto', 'def' => ''],
                        'a8_texto'  => ['label' => 'Apartado 8 · texto', 'tipo' => 'parrafo', 'def' => ''],
                        'a8_lista'  => ['label' => 'Apartado 8 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a9_ver'    => ['label' => 'Apartado 9 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a9_titulo' => ['label' => 'Apartado 9 · título (libre)', 'tipo' => 'texto', 'def' => ''],
                        'a9_texto'  => ['label' => 'Apartado 9 · texto', 'tipo' => 'parrafo', 'def' => ''],
                        'a9_lista'  => ['label' => 'Apartado 9 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
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

                'apartados' => [
                    'nombre' => 'Apartados de los términos',
                    'ayuda'  => 'Cada apartado del texto legal. Apaga el interruptor para quitar un apartado. Los tres últimos están libres para que agregues los tuyos.',
                    'campos' => [
                        'a1_ver'    => ['label' => 'Apartado 1 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a1_titulo' => ['label' => 'Apartado 1 · título', 'tipo' => 'texto', 'def' => '1. Aceptación de Términos'],
                        'a1_texto'  => ['label' => 'Apartado 1 · texto', 'tipo' => 'parrafo', 'def' => 'Al acceder y usar los servicios de INÉDITO DIGITAL, aceptas estar sujeto a estos términos y condiciones.'],
                        'a1_lista'  => ['label' => 'Apartado 1 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a2_ver'    => ['label' => 'Apartado 2 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a2_titulo' => ['label' => 'Apartado 2 · título', 'tipo' => 'texto', 'def' => '2. Servicios'],
                        'a2_texto'  => ['label' => 'Apartado 2 · texto', 'tipo' => 'parrafo', 'def' => 'Ofrecemos servicios de marketing digital, desarrollo web, SEO, publicidad digital y consultoría. Los detalles específicos de cada servicio se acordarán en contratos individuales.'],
                        'a2_lista'  => ['label' => 'Apartado 2 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a3_ver'    => ['label' => 'Apartado 3 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a3_titulo' => ['label' => 'Apartado 3 · título', 'tipo' => 'texto', 'def' => '3. Pagos y Facturación'],
                        'a3_texto'  => ['label' => 'Apartado 3 · texto', 'tipo' => 'parrafo', 'def' => 'Los términos de pago se especificarán en cada propuesta comercial. Generalmente requerimos:'],
                        'a3_lista'  => ['label' => 'Apartado 3 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => '50% de anticipo para iniciar el proyecto\n50% restante contra entrega\nServicios recurrentes: pago mensual anticipado'],
                        'a4_ver'    => ['label' => 'Apartado 4 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a4_titulo' => ['label' => 'Apartado 4 · título', 'tipo' => 'texto', 'def' => '4. Garantías y Resultados'],
                        'a4_texto'  => ['label' => 'Apartado 4 · texto', 'tipo' => 'parrafo', 'def' => 'Garantizamos esfuerzo máximo y entregas en tiempo. Sin embargo, resultados específicos (rankings, ventas, leads) dependen de múltiples factores externos y no pueden garantizarse.'],
                        'a4_lista'  => ['label' => 'Apartado 4 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a5_ver'    => ['label' => 'Apartado 5 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a5_titulo' => ['label' => 'Apartado 5 · título', 'tipo' => 'texto', 'def' => '5. Propiedad Intelectual'],
                        'a5_texto'  => ['label' => 'Apartado 5 · texto', 'tipo' => 'parrafo', 'def' => 'Una vez pagado en su totalidad, el cliente recibe derechos completos sobre el trabajo entregado. Nos reservamos el derecho de mostrar el trabajo en nuestro portafolio.'],
                        'a5_lista'  => ['label' => 'Apartado 5 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a6_ver'    => ['label' => 'Apartado 6 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a6_titulo' => ['label' => 'Apartado 6 · título', 'tipo' => 'texto', 'def' => '6. Cancelación'],
                        'a6_texto'  => ['label' => 'Apartado 6 · texto', 'tipo' => 'parrafo', 'def' => 'Los términos de cancelación se especifican en cada contrato. Generalmente:'],
                        'a6_lista'  => ['label' => 'Apartado 6 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => 'Proyectos: El anticipo no es reembolsable\nServicios mensuales: Aviso de 30 días'],
                        'a7_ver'    => ['label' => 'Apartado 7 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a7_titulo' => ['label' => 'Apartado 7 · título', 'tipo' => 'texto', 'def' => '7. Contacto'],
                        'a7_texto'  => ['label' => 'Apartado 7 · texto', 'tipo' => 'parrafo', 'def' => 'Para preguntas sobre estos términos:\nEmail: contacto@inedito.digital\nTeléfono: +52 1 449 583 9229'],
                        'a7_lista'  => ['label' => 'Apartado 7 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a8_ver'    => ['label' => 'Apartado 8 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a8_titulo' => ['label' => 'Apartado 8 · título (libre)', 'tipo' => 'texto', 'def' => ''],
                        'a8_texto'  => ['label' => 'Apartado 8 · texto', 'tipo' => 'parrafo', 'def' => ''],
                        'a8_lista'  => ['label' => 'Apartado 8 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a9_ver'    => ['label' => 'Apartado 9 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a9_titulo' => ['label' => 'Apartado 9 · título (libre)', 'tipo' => 'texto', 'def' => ''],
                        'a9_texto'  => ['label' => 'Apartado 9 · texto', 'tipo' => 'parrafo', 'def' => ''],
                        'a9_lista'  => ['label' => 'Apartado 9 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                        'a10_ver'    => ['label' => 'Apartado 10 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a10_titulo' => ['label' => 'Apartado 10 · título (libre)', 'tipo' => 'texto', 'def' => ''],
                        'a10_texto'  => ['label' => 'Apartado 10 · texto', 'tipo' => 'parrafo', 'def' => ''],
                        'a10_lista'  => ['label' => 'Apartado 10 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => ''],
                    ],
                ],
            ],
        ],

        /* ---------------------------------------------------------- */

        'asistente' => [
            'nombre'    => 'Asistente virtual',
            'ruta'      => 'La ventana de chat que abre el botón flotante',
            'ayuda'     => 'Todo lo que dice el asistente. Escríbelo como si hablaras con un cliente.',
            'secciones' => [

                'ventana' => [
                    'nombre' => 'La ventana',
                    'campos' => [
                        'titulo'      => ['label' => 'Nombre en la barra', 'tipo' => 'texto', 'def' => 'ASISTENTE IA'],
                        'estado'      => ['label' => 'Texto del punto verde', 'tipo' => 'texto', 'def' => 'En línea'],
                        'placeholder' => ['label' => 'Texto de la casilla de escritura', 'tipo' => 'texto', 'def' => 'Escribe tu respuesta...'],
                    ],
                ],

                'conversacion' => [
                    'nombre' => 'Lo que dice el asistente',
                    'campos' => [
                        'saludo'        => ['label' => 'Saludo inicial', 'tipo' => 'parrafo', 'def' => '¡Hola! 👋 Soy el asistente virtual de INÉDITO DIGITAL. Estoy aquí para ayudarte a encontrar la solución perfecta para hacer crecer tu negocio.'],
                        'que_servicio'  => ['label' => 'Pregunta por el servicio', 'tipo' => 'texto', 'def' => '¿Qué servicio te interesa más?'],
                        'entiendo'      => ['label' => 'Respuesta cuando describe su necesidad', 'tipo' => 'texto', 'def' => '¡Entiendo perfectamente! Esto es justo lo que hacemos. 🎯'],
                        'pedir_datos'   => ['label' => 'Aviso antes de pedir los datos', 'tipo' => 'parrafo', 'def' => 'Déjame capturar tus datos para prepararte una cotización personalizada.'],
                        'pedir_datos_2' => ['label' => 'Aviso antes de pedir los datos (tras describir el proyecto)', 'tipo' => 'parrafo', 'def' => 'Déjame capturar tus datos para que un especialista revise tu proyecto a detalle y te prepare una propuesta personalizada.'],
                        'saludo' => ['label' => 'Saludo inicial', 'tipo' => 'area', 'def' => 'Hola 👋 Soy el asistente de Inédito.\n\nPregúntame lo que quieras sobre nuestros servicios, o dime qué necesitas para tu negocio.'],
                        'saludo_ctx' => ['label' => 'Saludo al pulsar Cotizar', 'tipo' => 'area', 'def' => 'Hola 👋 Con gusto te ayudo a cotizar.\n\n¿Qué necesitas? Escríbelo con tus palabras, o elige una opción.'],
                        'p_nombre_corto' => ['label' => 'Pedir el nombre', 'tipo' => 'texto', 'def' => 'Perfecto. ¿Cómo te llamas?'],
                        'r_identidad' => ['label' => 'Respuesta · quién eres', 'tipo' => 'area', 'def' => 'Soy el asistente del sitio de Inédito Digital 🤖

No soy una persona: contesto con la información publicada de los servicios. Para lo que necesite criterio —una cotización, tu caso concreto— te paso con el equipo por WhatsApp y te responden ellos.'],
                        'r_equipo' => ['label' => 'Respuesta · tamaño del equipo', 'tipo' => 'area', 'def' => 'Esa no la tengo publicada, así que prefiero no darte un número inventado. Te lo responden en un momento por WhatsApp.

Lo que sí puedo contarte es cómo trabajamos.'],
                        'r_cobertura' => ['label' => 'Respuesta · trabajan fuera de Ags', 'tipo' => 'area', 'def' => 'Buena parte del trabajo se hace igual de bien a distancia. Cuéntame dónde estás y en WhatsApp te confirman cómo lo llevaríamos en tu caso.'],
                        'r_administrativo' => ['label' => 'Respuesta · facturación y pagos', 'tipo' => 'area', 'def' => 'Facturación, formas de pago y condiciones se ven caso por caso, y no quiero darte un dato equivocado.

En WhatsApp te lo aclaran de una vez y con la información correcta.'],
                        'r_tiempo' => ['label' => 'Respuesta · cuánto tarda', 'tipo' => 'area', 'def' => 'Depende del alcance, y no quiero darte una fecha inventada: un sitio de cinco páginas y uno de cincuenta no tardan lo mismo.'],
                        'r_garantia' => ['label' => 'Respuesta · garantías', 'tipo' => 'area', 'def' => 'No prometemos posiciones ni cifras concretas: nadie que trabaje en serio puede garantizar eso, y quien lo promete te está vendiendo humo.

Lo que sí garantizamos es que vas a saber qué está pasando. Medimos cada mes contra el punto de partida y te decimos si funciona o si no. Si no funciona, lo dice el reporte, no nosotros.'],
                        'r_catalogo' => ['label' => 'Respuesta · qué servicios tienen', 'tipo' => 'texto', 'def' => 'Estos son los frentes en los que trabajamos, más todo lo de inteligencia artificial. ¿Cuál te interesa?'],
                        'r_grupo_ia' => ['label' => 'Respuesta · bloque de IA', 'tipo' => 'texto', 'def' => 'Esto es lo que hacemos con inteligencia artificial:'],
                        'r_listo' => ['label' => 'Mensaje final antes de WhatsApp', 'tipo' => 'area', 'def' => 'Listo. Te preparé el mensaje con todo lo que consultaste.

Dale al botón de abajo y solo tienes que enviarlo.'],
                        'r_precio' => ['label' => 'Respuesta · precios', 'tipo' => 'area', 'def' => 'Cada proyecto se cotiza según lo que necesita, así que no manejo precios de lista: no sería honesto darte una cifra sin saber de qué tamaño es tu negocio.\n\nLo que sí: la primera revisión no tiene costo. Pásame tu caso por WhatsApp y te damos un número real.'],
                        'r_portafolio' => ['label' => 'Respuesta · portafolio', 'tipo' => 'area', 'def' => 'Tenemos los casos publicados con lo que hicimos en cada uno.'],
                        'r_quienes' => ['label' => 'Respuesta · quiénes somos', 'tipo' => 'area', 'def' => 'Somos una agencia de Aguascalientes que trabaja como dirección comercial asistida por IA: conectamos tus objetivos con datos reales y auditamos cada mes si la estrategia funciona.'],
                        'r_niveles' => ['label' => 'Respuesta · los tres niveles', 'tipo' => 'area', 'def' => 'Trabajamos en tres niveles según tu punto de partida:\n\n*1. Construir* — no tienes presencia digital todavía.\n*2. Mejorar* — ya tienes web y redes, pero no rinden.\n*3. Vender* — ya tienes todo y quieres resultados medidos.'],
                        'r_varios' => ['label' => 'Respuesta · varios servicios posibles', 'tipo' => 'texto', 'def' => 'Puede ser cualquiera de estos. ¿Cuál te interesa?'],
                        'r_saludo' => ['label' => 'Respuesta · a un saludo suelto', 'tipo' => 'texto', 'def' => '¡Hola! ¿Qué necesitas para tu negocio?'],
                        'r_otra' => ['label' => 'Respuesta · tengo otra duda', 'tipo' => 'texto', 'def' => '¿Qué más quieres saber?'],
                        'r_nada' => ['label' => 'Respuesta · no entendí', 'tipo' => 'area', 'def' => 'No estoy seguro de haber entendido bien 🤔\n\n¿Me lo dices de otra forma? O si prefieres, te paso con alguien del equipo que te responde al momento.'],
                        'p_nombre'      => ['label' => 'Pregunta el nombre', 'tipo' => 'texto', 'def' => '¿Cuál es tu nombre?'],
                        'p_email_mal'   => ['label' => 'Aviso si el correo está mal escrito', 'tipo' => 'texto', 'def' => 'Por favor ingresa un correo electrónico válido.'],
                        'p_whatsapp'    => ['label' => 'Pregunta el WhatsApp', 'tipo' => 'texto', 'def' => 'Excelente. ¿Cuál es tu número de WhatsApp?'],
                        'p_empresa'     => ['label' => 'Pregunta la empresa', 'tipo' => 'texto', 'def' => '¿De qué empresa nos contactas?'],
                        'p_objetivo'    => ['label' => 'Pregunta el objetivo', 'tipo' => 'texto', 'def' => 'Perfecto. Ahora, ¿cuál es tu objetivo principal?'],
                        'p_presupuesto' => ['label' => 'Pregunta el presupuesto', 'tipo' => 'texto', 'def' => '¿Cuál es tu presupuesto mensual aproximado?'],
                        'p_cuando'      => ['label' => 'Pregunta cuándo empezar', 'tipo' => 'texto', 'def' => '¿Cuándo te gustaría comenzar?'],
                    ],
                ],

                'opciones' => [
                    'nombre' => 'Las opciones que ofrece',
                    'ayuda'  => 'Las listas numeradas que el asistente muestra para elegir.',
                    'campos' => [
                        'obj_1' => ['label' => 'Objetivo 1', 'tipo' => 'texto', 'def' => 'Vender más'],
                        'obj_2' => ['label' => 'Objetivo 2', 'tipo' => 'texto', 'def' => 'Generar leads'],
                        'obj_3' => ['label' => 'Objetivo 3', 'tipo' => 'texto', 'def' => 'Posicionamiento de marca'],
                        'obj_4' => ['label' => 'Objetivo 4', 'tipo' => 'texto', 'def' => 'Mejorar presencia digital'],
                        'pre_1' => ['label' => 'Presupuesto 1', 'tipo' => 'texto', 'def' => '$5,000 - $15,000'],
                        'pre_2' => ['label' => 'Presupuesto 2', 'tipo' => 'texto', 'def' => '$15,000 - $30,000'],
                        'pre_3' => ['label' => 'Presupuesto 3', 'tipo' => 'texto', 'def' => '$30,000 - $50,000'],
                        'pre_4' => ['label' => 'Presupuesto 4', 'tipo' => 'texto', 'def' => 'Más de $50,000'],
                    ],
                ],
            ],
        ],

        'error-404' => [
            'nombre'    => 'Página no encontrada (404)',
            'ruta'      => 'Lo que ve alguien que llega a una dirección que no existe',
            'secciones' => [
                'contenido' => [
                    'nombre' => 'Video y textos',
                    'campos' => [
                        'video'  => ['label' => 'Video de fondo', 'tipo' => 'imagen',
                                     'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Video-Pagina-404-Inedito-Web.mp4'],
                        'poster' => ['label' => 'Imagen mientras carga el video', 'tipo' => 'imagen',
                                     'def' => 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp'],
                        'titulo' => ['label' => 'Título en el buscador', 'tipo' => 'texto', 'def' => 'Página no encontrada - 404 | INÉDITO DIGITAL'],
                        'texto'  => ['label' => 'Descripción en el buscador', 'tipo' => 'parrafo', 'def' => 'La página que buscas no existe o ha sido movida.'],
                    ],
                ],
            ],
        ],


        'sistema' => [
            'nombre'    => 'Avisos del sistema',
            'ruta'      => 'Mensajes que solo se ven un instante',
            'ayuda'     => 'Lo que aparece mientras el sitio carga o si algo falla.',
            'secciones' => [
                'avisos' => [
                    'nombre' => 'Mensajes',
                    'campos' => [
                        'cargando'      => ['label' => 'Mientras carga la página', 'tipo' => 'texto', 'def' => 'Cargando...'],
                        'error_titulo'  => ['label' => 'Si algo falla · título', 'tipo' => 'texto', 'def' => 'ERROR'],
                        'redir_menu'    => ['label' => 'Redirección al menú', 'tipo' => 'texto', 'def' => 'Redirigiendo al menú...'],
                        'redir_doc'     => ['label' => 'Redirección a un documento', 'tipo' => 'texto', 'def' => 'Redirigiendo al documento...'],
                    ],
                ],
            ],
        ],

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
                            'favicon' => ['label' => 'Ícono de la pestaña del navegador', 'tipo' => 'imagen',
                                      'ayuda' => 'Tiene que ser CUADRADO (256x256 o más). El logo horizontal no sirve: en la pestaña se ve de 16 píxeles y queda ilegible. Si lo dejas vacío usamos el isotipo de Inédito.',
                                      'def' => '/favicon.ico'],
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
                        'geo'             => ['label' => 'Posicionamiento en IA · nombre', 'tipo' => 'texto', 'def' => 'Posicionamiento en IA'],
                        'geo_desc'        => ['label' => 'Posicionamiento en IA · descripción', 'tipo' => 'texto', 'def' => 'Que ChatGPT te recomiende'],
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


                'pie_servicios' => [
                    'nombre' => 'Pie · columna Servicios',
                    'ayuda'  => 'Los enlaces de la primera columna. Apaga el interruptor para quitar uno.',
                    'campos' => [
                        's1_ver'    => ['label' => 'Enlace 1 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        's1_nombre' => ['label' => 'Enlace 1 · texto', 'tipo' => 'texto', 'def' => 'Diseño y Desarrollo Web'],
                        's1_url'    => ['label' => 'Enlace 1 · destino', 'tipo' => 'enlace', 'def' => '/servicios/diseno-y-desarrollo-web'],
                        's2_ver'    => ['label' => 'Enlace 2 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        's2_nombre' => ['label' => 'Enlace 2 · texto', 'tipo' => 'texto', 'def' => 'Chatbots y Agentes IA'],
                        's2_url'    => ['label' => 'Enlace 2 · destino', 'tipo' => 'enlace', 'def' => '/servicios/chatbots-y-agentes'],
                        's3_ver'    => ['label' => 'Enlace 3 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        's3_nombre' => ['label' => 'Enlace 3 · texto', 'tipo' => 'texto', 'def' => 'Funnels de Venta'],
                        's3_url'    => ['label' => 'Enlace 3 · destino', 'tipo' => 'enlace', 'def' => '/servicios/funnels-de-venta'],
                        's4_ver'    => ['label' => 'Enlace 4 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        's4_nombre' => ['label' => 'Enlace 4 · texto', 'tipo' => 'texto', 'def' => 'Posicionamiento Orgánico'],
                        's4_url'    => ['label' => 'Enlace 4 · destino', 'tipo' => 'enlace', 'def' => '/servicios/posicionamiento-organico'],
                        's5_ver'    => ['label' => 'Enlace 5 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        's5_nombre' => ['label' => 'Enlace 5 · texto', 'tipo' => 'texto', 'def' => 'Google ADS'],
                        's5_url'    => ['label' => 'Enlace 5 · destino', 'tipo' => 'enlace', 'def' => '/servicios/google-ads'],
                    ],
                ],

                'pie_empresa' => [
                    'nombre' => 'Pie · columna Empresa',
                    'ayuda'  => 'Los enlaces de la segunda columna.',
                    'campos' => [
                        'e1_ver'    => ['label' => 'Enlace 1 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'e1_nombre' => ['label' => 'Enlace 1 · texto', 'tipo' => 'texto', 'def' => 'Nosotros'],
                        'e1_url'    => ['label' => 'Enlace 1 · destino', 'tipo' => 'enlace', 'def' => '/nosotros'],
                        'e2_ver'    => ['label' => 'Enlace 2 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'e2_nombre' => ['label' => 'Enlace 2 · texto', 'tipo' => 'texto', 'def' => 'Portafolio'],
                        'e2_url'    => ['label' => 'Enlace 2 · destino', 'tipo' => 'enlace', 'def' => '/portafolio'],
                        'e3_ver'    => ['label' => 'Enlace 3 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'e3_nombre' => ['label' => 'Enlace 3 · texto', 'tipo' => 'texto', 'def' => 'Blog'],
                        'e3_url'    => ['label' => 'Enlace 3 · destino', 'tipo' => 'enlace', 'def' => '/blog'],
                        'e4_ver'    => ['label' => 'Enlace 4 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'e4_nombre' => ['label' => 'Enlace 4 · texto', 'tipo' => 'texto', 'def' => 'Contacto'],
                        'e4_url'    => ['label' => 'Enlace 4 · destino', 'tipo' => 'enlace', 'def' => '/contacto'],
                    ],
                ],

                'pie_legal' => [
                    'nombre' => 'Pie · enlaces legales',
                    'ayuda'  => 'Los enlaces pequeños de hasta abajo.',
                    'campos' => [
                        'l1_ver'    => ['label' => 'Enlace 1 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'l1_nombre' => ['label' => 'Enlace 1 · texto', 'tipo' => 'texto', 'def' => 'Política de Privacidad'],
                        'l1_url'    => ['label' => 'Enlace 1 · destino', 'tipo' => 'enlace', 'def' => '/privacidad'],
                        'l2_ver'    => ['label' => 'Enlace 2 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'l2_nombre' => ['label' => 'Enlace 2 · texto', 'tipo' => 'texto', 'def' => 'Términos y Condiciones'],
                        'l2_url'    => ['label' => 'Enlace 2 · destino', 'tipo' => 'enlace', 'def' => '/terminos'],
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
