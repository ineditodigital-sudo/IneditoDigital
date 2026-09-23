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

/**
 * OJO al tocar los "def" de este registro:
 *
 * Son el respaldo que el panel escribe en la base cuando alguien pulsa
 * Publicar, y por lo tanto GANAN sobre el respaldo que trae el codigo de
 * la SPA. Si aqui dice "NUESTRO PROCESO" y HomePage.tsx dice "COMO
 * TRABAJAMOS", basta con que alguien publique la portada para que el
 * sitio retroceda al texto viejo (ya paso el 28-ago-2026: se revirtieron
 * el titulo del proceso, sus cuatro pasos, el enfoque y el cierre).
 *
 * Regla: cada vez que cambie un texto en HomePage.tsx, el "def" de aqui
 * cambia igual.
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
                        'etiqueta'   => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'Aguascalientes · Medimos hasta la venta',
                                         'ayuda' => 'El textito que va sobre el título grande.'],
                        'titulo_0'   => ['label' => 'Línea superior (la frase que posiciona en Google)', 'tipo' => 'texto', 'def' => 'Agencia de marketing digital en Aguascalientes'],
                        'titulo_1'   => ['label' => 'Título, primera línea', 'tipo' => 'texto', 'def' => 'DIRECCIÓN COMERCIAL'],
                        'titulo_2'   => ['label' => 'Título, segunda línea (en color)', 'tipo' => 'texto', 'def' => 'ASISTIDA POR IA',
                                         'ayuda' => 'Esta línea se muestra con el degradado morado de la marca.'],
                        'descripcion'=> ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                         'def' => 'No vendemos campañas sueltas: conectamos los objetivos de tu dirección con todo lo que tu negocio hace en digital, en un solo tablero, y cada mes una IA audita que la estrategia esté funcionando.'],
                        'boton_1'    => ['label' => 'Botón principal', 'tipo' => 'texto', 'def' => 'QUIERO UNA AUDITORÍA'],
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
                        'etiqueta_top' => ['label' => 'Etiqueta de la primera tarjeta', 'tipo' => 'texto', 'def' => 'EL MÁS PEDIDO'],
                        'ver_mas'      => ['label' => 'Texto del enlace de cada tarjeta', 'tipo' => 'texto', 'def' => 'Conocer más'],
                        'boton'        => ['label' => 'Texto del botón del final', 'tipo' => 'texto', 'def' => 'VER TODOS LOS SERVICIOS IA'],

                        'w_titulo' => ['label' => 'WhatsApp · título', 'tipo' => 'texto', 'def' => 'IA PARA WHATSAPP'],
                        'w_texto'  => ['label' => 'WhatsApp · descripción', 'tipo' => 'parrafo', 'def' => 'Un agente que contesta en segundos, pregunta lo que preguntaría tu equipo y pasa la conversación cuando hay intención real de compra.'],
                        'w_p1'     => ['label' => 'WhatsApp · punto 1', 'tipo' => 'texto', 'def' => 'Contesta también fuera de horario'],
                        'w_p2'     => ['label' => 'WhatsApp · punto 2', 'tipo' => 'texto', 'def' => 'Separa a quien pregunta de quien quiere comprar'],
                        'w_p3'     => ['label' => 'WhatsApp · punto 3', 'tipo' => 'texto', 'def' => 'Cada conversación queda en tu tablero'],

                        'v_titulo' => ['label' => 'Ventas · título', 'tipo' => 'texto', 'def' => 'IA DE VENTAS'],
                        'v_texto'  => ['label' => 'Ventas · descripción', 'tipo' => 'parrafo', 'def' => 'Prospección y seguimiento con criterio: la IA prepara la lista y el contexto, tu equipo entra a cerrar y no a buscar.'],
                        'v_p1'     => ['label' => 'Ventas · punto 1', 'tipo' => 'texto', 'def' => 'Prospección en LinkedIn con criterio, no en frío'],
                        'v_p2'     => ['label' => 'Ventas · punto 2', 'tipo' => 'texto', 'def' => 'Mensajes escritos con el contexto de cada cuenta'],
                        'v_p3'     => ['label' => 'Ventas · punto 3', 'tipo' => 'texto', 'def' => 'Seguimiento que no se le olvida a nadie'],

                        'm_titulo' => ['label' => 'Marketing · título', 'tipo' => 'texto', 'def' => 'IA PARA MARKETING'],
                        'm_texto'  => ['label' => 'Marketing · descripción', 'tipo' => 'parrafo', 'def' => 'Campañas que se corrigen con lo que dicen los datos y contenido producido a ritmo, sin perder el tono de tu marca.'],
                        'm_p1'     => ['label' => 'Marketing · punto 1', 'tipo' => 'texto', 'def' => 'El presupuesto se mueve a lo que sí convierte'],
                        'm_p2'     => ['label' => 'Marketing · punto 2', 'tipo' => 'texto', 'def' => 'Contenido a ritmo, con tu tono'],
                        'm_p3'     => ['label' => 'Marketing · punto 3', 'tipo' => 'texto', 'def' => 'Aviso cuando algo se sale de lo normal'],

                        'e_titulo' => ['label' => 'E-commerce · título', 'tipo' => 'texto', 'def' => 'IA PARA E-COMMERCE'],
                        'e_texto'  => ['label' => 'E-commerce · descripción', 'tipo' => 'parrafo', 'def' => 'Convertir mejor lo que ya llega a tu tienda: recomendaciones que sí aplican y carritos que no se pierden.'],
                        'e_p1'     => ['label' => 'E-commerce · punto 1', 'tipo' => 'texto', 'def' => 'Recomendaciones según lo que cada quien ve'],
                        'e_p2'     => ['label' => 'E-commerce · punto 2', 'tipo' => 'texto', 'def' => 'Recuperación de carritos abandonados'],
                        'e_p3'     => ['label' => 'E-commerce · punto 3', 'tipo' => 'texto', 'def' => 'Precios que responden a la demanda'],
                    ],
                ],

                'enfoque' => [
                    'nombre' => 'Banda del nuevo enfoque',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta', 'tipo' => 'texto', 'def' => 'NUESTRO ENFOQUE'],
                        'titulo_1' => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'NO ES UNA PROMESA,'],
                        'titulo_2' => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'ES UN SISTEMA'],
                        'logos_texto' => ['label' => 'Texto sobre los logos de IA', 'tipo' => 'texto', 'def' => 'Presencia medida en'],
                        'indice_titulo' => ['label' => 'Rótulo sobre la lista de piezas', 'tipo' => 'texto', 'def' => 'Las cuatro piezas del sistema'],
                        'texto'    => ['label' => 'Texto', 'tipo' => 'area', 'def' => 'Somos una agencia de marketing digital y de inteligencia artificial, y nuestra forma de trabajar es un sistema: dirección pone el objetivo, todo lo que tu negocio hace en digital queda conectado, y una IA lo revisa cada mes contra ese objetivo. Casi nadie en Aguascalientes trabaja así.'],
                        'e1_titulo'=> ['label' => 'Enlace 1 · título', 'tipo' => 'texto', 'def' => 'Los tres pasos'],
                        'e1_texto' => ['label' => 'Enlace 1 · texto', 'tipo' => 'texto', 'def' => 'Que te encuentren, que te escriban y que te compren'],
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

                /* Los tres pasos (23-sep). Reemplazan a «Los tres niveles»:
                   la portada cuenta el mismo método que el menú y /servicios.
                   Los nombres de los pasos y de sus servicios viven en Marca ›
                   menu_servicios; el botón morado es el del diagnóstico. */
                'pasos' => [
                    'nombre' => 'Los tres pasos',
                    'ayuda'  => 'El nombre de cada paso, su frase y sus servicios se cambian en Marca › «Menú de servicios (los tres pasos)», igual que el botón del diagnóstico.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo_1' => ['label' => 'Título · parte blanca', 'tipo' => 'texto', 'def' => 'TRES PASOS'],
                        'titulo_2' => ['label' => 'Título · parte morada', 'tipo' => 'texto', 'def' => 'HASTA LA VENTA'],
                        'bajada'   => ['label' => 'Bajada', 'tipo' => 'area', 'def' => 'Cada paso se mide antes de dar el siguiente. No tienes que contratar los tres: el diagnóstico te dice por cuál empezar.'],
                        'boton'    => ['label' => 'Botón a /servicios', 'tipo' => 'texto', 'def' => 'VER LOS TRES PASOS'],
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
                        'imagen_alt' => ['label' => 'Texto alternativo de la imagen', 'tipo' => 'texto', 'def' => 'Tablero de resultados de Inédito Digital con contactos, costo por contacto, ventas y el embudo hasta la venta'],
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
                        'etiqueta' => ['label' => 'Etiqueta pequeña de arriba', 'tipo' => 'texto', 'def' => 'IA APLICADA AL NEGOCIO'],
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'SERVICIOS DE'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en degradado)', 'tipo' => 'texto', 'def' => 'INTELIGENCIA ARTIFICIAL'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Inteligencia artificial puesta a trabajar donde se nota: atención, prospección, campañas y venta en línea. Todo conectado al mismo tablero.'],
                    ],
                ],

                'proceso' => [
                    'nombre' => 'Nuestro proceso',
                    'ayuda'  => 'Los cuatro pasos de cómo trabajan.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'EL CICLO COMPLETO'],
                        'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'CÓMO TRABAJAMOS'],
                        'bajada'   => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo',
                                       'def' => 'Dirección define, todo se conecta, la IA audita y se ajusta. Así se ve el ciclo completo.'],
                        'paso_1_titulo' => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'OBJETIVOS'],
                        'paso_1_texto'  => ['label' => 'Paso 1 · descripción', 'tipo' => 'texto', 'def' => 'Dirección define qué quiere lograr y en qué plazo'],
                        'paso_2_titulo' => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'CONECTAR'],
                        'paso_2_texto'  => ['label' => 'Paso 2 · descripción', 'tipo' => 'texto', 'def' => 'Tu presencia, tus campañas y tus ventas quedan en un solo tablero'],
                        'paso_3_titulo' => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'AUDITAR'],
                        'paso_3_texto'  => ['label' => 'Paso 3 · descripción', 'tipo' => 'texto', 'def' => 'Cada mes una IA revisa el desempeño contra esos objetivos'],
                        'paso_4_titulo' => ['label' => 'Paso 4 · nombre', 'tipo' => 'texto', 'def' => 'AJUSTAR'],
                        'paso_4_texto'  => ['label' => 'Paso 4 · descripción', 'tipo' => 'texto', 'def' => 'Se corrige con lo que dice el dato, no con la corazonada'],
                    ],
                ],

                'casos' => [
                    'nombre' => 'Casos de éxito',
                    'ayuda'  => 'El encabezado del carrusel de proyectos. Los proyectos se administran en "Portafolio".',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta'=> ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'PORTAFOLIO'],
                        'titulo'  => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'MARCAS QUE YA CONFÍAN'],
                        'bajada'  => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Trabajamos con empresas de Aguascalientes y de todo México, y muchas ya están satisfechas con el rendimiento y las ventas que lograron después de trabajar con Inédito.'],
                        'n1_cifra' => ['label' => 'Cifra 1 (vacía = se oculta)', 'tipo' => 'texto', 'def' => '+80%'],
                        'n1_texto' => ['label' => 'Cifra 1 · qué significa', 'tipo' => 'texto', 'def' => 'de tráfico orgánico logrado para un cliente en un año'],
                        'n2_cifra' => ['label' => 'Cifra 2 (vacía = se oculta)', 'tipo' => 'texto', 'def' => '6'],
                        'n2_texto' => ['label' => 'Cifra 2 · qué significa', 'tipo' => 'texto', 'def' => 'motores de IA donde medimos la presencia de cada cliente'],
                        'n3_cifra' => ['label' => 'Cifra 3 (vacía = se oculta)', 'tipo' => 'texto', 'def' => '100%'],
                        'n3_texto' => ['label' => 'Cifra 3 · qué significa', 'tipo' => 'texto', 'def' => 'de nuestros clientes con tablero conectado a datos reales'],
                        'boton'   => ['label' => 'Texto del botón', 'tipo' => 'texto', 'def' => 'VER EL PORTAFOLIO'],
                    ],
                ],

                'resenas' => [
                    'nombre' => 'Opiniones de Google (carrusel)',
                    'ayuda'  => 'Las opiniones se administran en «Opiniones»: llegan solas de la ficha de Google. Aquí solo van los textos de la sección.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'OPINIONES EN GOOGLE'],
                        'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'LO QUE DICEN NUESTROS CLIENTES'],
                        'enlace'   => ['label' => 'Texto del enlace a la ficha', 'tipo' => 'texto', 'def' => 'Ver todas en Google'],
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
                                            'def' => 'Que las empresas de Aguascalientes no solo aparezcan en Google, sino también en las respuestas que dan los asistentes de inteligencia artificial cuando alguien pregunta por un proveedor. Casi nadie en el mercado está trabajando eso todavía.'],
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
                        'v2_texto' => ['label' => 'Valor 2 · descripción', 'tipo' => 'parrafo', 'def' => 'No solo el buscador de Google. También los seis motores de IA que ya recomiendan proveedores: ChatGPT, Gemini, AI Overviews de Google, Perplexity, Claude y Copilot.'],
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

                'resenas' => [
                    'nombre' => 'Opiniones de Google (carrusel)',
                    'ayuda'  => 'Las opiniones se administran en «Opiniones»: llegan solas de la ficha de Google. Aquí solo van los textos de la sección.',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'etiqueta' => ['label' => 'Etiqueta pequeña', 'tipo' => 'texto', 'def' => 'OPINIONES EN GOOGLE'],
                        'titulo'   => ['label' => 'Título de la sección', 'tipo' => 'texto', 'def' => 'LO QUE DICEN NUESTROS CLIENTES'],
                        'enlace'   => ['label' => 'Texto del enlace a la ficha', 'tipo' => 'texto', 'def' => 'Ver todas en Google'],
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
            'ayuda'  => 'El encabezado, los tres pasos y los complementos. El nombre de cada paso y de sus servicios, y el recuadro del diagnóstico, se cambian en Marca › «Menú de servicios (los tres pasos)», para que el menú y esta página digan lo mismo. Los servicios en sí se administran en la sección «Servicios» del menú.',
            'secciones' => [
                'encabezado' => [
                    'nombre' => 'Encabezado',
                    'campos' => [
                        'titulo_1' => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'NUESTROS'],
                        'titulo_2' => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'SERVICIOS'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo',
                                       'def' => 'Marketing digital y publicidad para empresas de Aguascalientes: que te encuentren, que te escriban y que te compren. Todo medido hasta la venta.'],
                        /* Los dos botones de arriba. Esta página no tenía ninguno:
                           lo primero que se podía tocar estaba a 920 px, o sea
                           debajo de la primera pantalla de un teléfono. */
                        'cta_gancho' => ['label' => 'Frase encima de los botones', 'tipo' => 'texto',
                                         'def' => '¿No sabes cuál te toca? Te lo decimos en 30 segundos.'],
                        'cta_boton'  => ['label' => 'Botón principal', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                        'cta_wa'     => ['label' => 'Botón de WhatsApp', 'tipo' => 'texto', 'def' => 'WHATSAPP'],
                    ],
                ],

                /* Los tres pasos del método (23-sep). Reemplazan a «Los tres
                   niveles». Los nombres de los pasos y de sus servicios viven en
                   Marca › menu_servicios, compartidos con el menú; aquí va solo
                   lo que explica la página. */
                'metodo' => [
                    'nombre' => 'Los tres pasos',
                    'ayuda'  => 'Lo que gana el cliente en cada paso y con qué se mide. El nombre de cada paso y de sus servicios se cambia en Marca › «Menú de servicios (los tres pasos)».',
                    'campos' => [
                        'titulo'     => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'UN SISTEMA EN TRES PASOS'],
                        'bajada'     => ['label' => 'Bajada', 'tipo' => 'area', 'def' => 'Cada paso prepara el siguiente y se mide antes de dar el que sigue. Así sabes qué funciona antes de invertir más.'],
                        'paso'       => ['label' => 'Palabra junto al número («Paso 01»)', 'tipo' => 'texto', 'def' => 'Paso'],
                        'se_mide'    => ['label' => 'Etiqueta del recuadro de medición', 'tipo' => 'texto', 'def' => 'Se mide'],
                        'p1_texto'   => ['label' => 'Paso 1 · qué gana el cliente', 'tipo' => 'area', 'def' => 'Cuando alguien busca lo que vendes —en Google, en Maps o preguntándole a ChatGPT—, tu negocio aparece, se ve serio y dice lo correcto.'],
                        'p1_mide'    => ['label' => 'Paso 1 · con qué se mide', 'tipo' => 'area', 'def' => 'En qué búsquedas apareces, cuántas visitas llegan y si los asistentes de IA te mencionan.'],
                        'p2_texto'   => ['label' => 'Paso 2 · qué gana el cliente', 'tipo' => 'area', 'def' => 'Quien te encuentra tiene por dónde escribirte y nadie se queda esperando: un agente de IA contesta a cualquier hora y le pasa el prospecto a una persona de tu equipo.'],
                        'p2_mide'    => ['label' => 'Paso 2 · con qué se mide', 'tipo' => 'area', 'def' => 'Cuántos prospectos llegan, por qué canal y en cuánto tiempo reciben respuesta.'],
                        'p3_texto'   => ['label' => 'Paso 3 · qué gana el cliente', 'tipo' => 'area', 'def' => 'La publicidad se invierte donde se puede medir, y cada campaña se juzga por los prospectos que trae, no por los clics.'],
                        'p3_mide'    => ['label' => 'Paso 3 · con qué se mide', 'tipo' => 'area', 'def' => 'Cuánto cuesta cada prospecto y, cuando tu sistema lo permite, qué ventas cerró cada canal, en un solo tablero.'],
                        'diag_extra' => ['label' => 'Recuadro del diagnóstico · frase de abajo', 'tipo' => 'area', 'def' => 'No tienes que contratar los tres pasos: con el diagnóstico sabes por cuál empezar.'],
                    ],
                ],

                'otros' => [
                    'nombre' => 'Complementos',
                    'ayuda'  => 'Los servicios publicados que no están en ningún paso (branding, logo, QR, tarjetas NFC, expo, espectaculares, LinkedIn). Salen solos de la sección «Servicios».',
                    'campos' => [
                        'titulo'        => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'COMPLEMENTOS'],
                        'bajada'        => ['label' => 'Bajada', 'tipo' => 'area', 'def' => 'Piezas que se suman a los tres pasos cuando tu negocio las necesita.'],
                        'cierre'        => ['label' => 'Frase de abajo', 'tipo' => 'texto', 'def' => '¿Buscas algo que no está aquí?'],
                        'cierre_enlace' => ['label' => 'Enlace a WhatsApp de la frase de abajo', 'tipo' => 'texto', 'def' => 'Pregúntanos por WhatsApp'],
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
            'ayuda'     => 'La página que vende el posicionamiento en inteligencias artificiales, con el diseño de cualquier servicio. Sus preguntas frecuentes son lo que más citan los asistentes, así que conviene mantenerlas claras y verificables.',
            'secciones' => [

                'portada' => [
                    'nombre' => 'Portada',
                    'ayuda'  => 'Lo primero que se ve al entrar.',
                    'campos' => [
                        /* Sin la marca: con ella eran 63 caracteres y Google corta en ~60.
                           Lo que se queda es la ciudad y «(GEO)», que es término de búsqueda. */
                        'seo_titulo' => ['label' => 'Título para buscadores', 'tipo' => 'texto', 'def' => 'Posicionamiento en IA (GEO) en Aguascalientes'],
                        'seo_desc' => ['label' => 'Descripción para buscadores', 'tipo' => 'parrafo', 'def' => 'Logramos que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen bien a tu negocio. Diagnóstico gratuito en Aguascalientes.'],
                        'etiqueta' => ['label' => 'Nombre del servicio (el título grande)', 'tipo' => 'texto', 'def' => 'POSICIONAMIENTO GEO'],
                        'nombre_frase' => ['label' => 'Nombre en una frase (va en el mensaje de WhatsApp y en el asistente)', 'tipo' => 'texto', 'def' => 'Posicionamiento en IA'],
                        'bajada' => ['label' => 'Texto debajo del título', 'tipo' => 'parrafo', 'def' => 'Cuando alguien le pregunta a una inteligencia artificial por un servicio como el tuyo en Aguascalientes, la respuesta menciona a unos cuantos negocios. Nuestro trabajo es que estés en esa lista, con tus datos correctos y sin que te confundan con nadie.'],
                        'boton_1' => ['label' => 'Botón principal', 'tipo' => 'texto', 'def' => 'DIAGNÓSTICO GRATUITO'],
                        'definicion' => ['label' => 'Qué es (la definición bajo los botones)', 'tipo' => 'parrafo', 'def' => 'El posicionamiento en inteligencia artificial —GEO, por Generative Engine Optimization— es el trabajo de lograr que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta por lo que vendes. Es el equivalente al SEO, pero para las respuestas de los asistentes en vez de la lista de resultados azules.'],
                    ],
                ],

                'problema' => [
                    'nombre' => 'El fondo del asunto · por qué ahora',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'El buscador dejó de ser la primera parada'],
                        'texto' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Cada vez más gente le pregunta directamente a un asistente en vez de abrir diez pestañas. La IA responde en una sola frase y nombra dos o tres opciones. Si tu negocio no está entre ellas, no perdiste una posición: no apareciste en la conversación. Y a diferencia del buscador, aquí no hay una segunda página donde te puedan encontrar.'],
                    ],
                ],

                'motores' => [
                    'nombre' => 'Los seis asistentes (bloque bajo la portada)',
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
                    'nombre' => 'Lo que ganas (antes y después)',
                    'ayuda'  => 'Las dos columnas que comparan cómo responde la IA.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'a1' => ['label' => 'Sin GEO · punto 1', 'tipo' => 'texto', 'def' => 'Te confunde con otro negocio de nombre parecido'],
                        'a2' => ['label' => 'Sin GEO · punto 2', 'tipo' => 'texto', 'def' => 'Repite un teléfono o un horario que cambiaste hace años'],
                        'a3' => ['label' => 'Sin GEO · punto 3', 'tipo' => 'texto', 'def' => 'Dice que no encuentra información y recomienda a tu competencia'],
                        'd1' => ['label' => 'Con Inédito · punto 1', 'tipo' => 'texto', 'def' => 'Te nombra con tu giro y tu ciudad, sin confundirte'],
                        'd2' => ['label' => 'Con Inédito · punto 2', 'tipo' => 'texto', 'def' => 'Usa los datos que tú publicas y que puede verificar'],
                        'd3' => ['label' => 'Con Inédito · punto 3', 'tipo' => 'texto', 'def' => 'Te incluye cuando alguien pregunta por tu servicio en tu zona'],
                        'antes' => ['label' => 'Encabezado de la columna izquierda', 'tipo' => 'texto', 'def' => 'SIN TRABAJO DE GEO'],
                        'nota' => ['label' => 'Nota al pie', 'tipo' => 'texto', 'def' => 'Ejemplos de lo que encontramos con más frecuencia. Lo tuyo lo vemos en el diagnóstico.'],
                    ],
                ],

                'servicio' => [
                    'nombre' => 'Qué incluye',
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
                    ],
                ],

                'proceso' => [
                    'nombre' => 'El proceso',
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
                    ],
                ],

                'local' => [
                    'nombre' => 'El fondo del asunto · Aguascalientes',
                    'ayuda'  => 'El bloque que ancla el servicio a la ciudad.',
                    'campos' => [
                        'visible' => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
                        'titulo' => ['label' => 'Título', 'tipo' => 'texto', 'def' => 'Posicionamiento GEO en Aguascalientes'],
                        'texto' => ['label' => 'Texto', 'tipo' => 'parrafo', 'def' => 'Somos una agencia de marketing digital con base en Aguascalientes, y trabajamos el posicionamiento en inteligencia artificial para negocios de la ciudad y del Bajío. Conocer el mercado local importa: cuando alguien pregunta por un servicio en Aguascalientes, las respuestas se arman con fuentes de aquí, y saber cuáles son es la mitad del trabajo.'],
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
                        'volver_ia'     => ['label' => 'Enlace de regreso en las páginas de IA', 'tipo' => 'texto', 'def' => 'Volver a Servicios IA'],
                        'categoria_ia'  => ['label' => 'Categoría en las páginas de IA', 'tipo' => 'texto', 'def' => 'IA'],
                        // Los leia el codigo y el panel no los ofrecia (21-sep): no se podian editar.
                        'definicion_sello' => ['label' => 'Etiqueta de la definición', 'tipo' => 'texto', 'def' => 'Qué es'],
                        'definicion_mas'   => ['label' => 'Botón para desplegar la definición (teléfono)', 'tipo' => 'texto', 'def' => 'Leer más'],
                        'definicion_menos' => ['label' => 'Botón para plegar la definición (teléfono)', 'tipo' => 'texto', 'def' => 'Leer menos'],
                        'fondo_1'       => ['label' => 'El fondo del asunto, primera parte', 'tipo' => 'texto', 'def' => 'EL FONDO'],
                        'fondo_2'       => ['label' => 'El fondo del asunto, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'DEL ASUNTO'],
                        'cat_1'         => ['label' => 'Catálogo de espectaculares, primera parte', 'tipo' => 'texto', 'def' => 'EL'],
                        'cat_2'         => ['label' => 'Catálogo de espectaculares, segunda parte (resaltada)', 'tipo' => 'texto', 'def' => 'CATÁLOGO'],
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

                /* «Arma tu ruta» (23-sep): según si el negocio empieza de cero
                   o ya funciona, qué va antes, junto o en lugar de cada
                   servicio. Qué recomienda a qué vive en el código
                   (src/app/data/recomendaciones.ts); aquí, los textos. */
                'ruta' => [
                    'nombre' => 'Arma tu ruta (recomendaciones)',
                    'ayuda'  => 'La sección que, según si el negocio empieza de cero o ya funciona, recomienda qué va antes, junto o en lugar de cada servicio. Qué servicio recomienda a cuál, y por qué, no se edita aquí: pídeselo al equipo técnico.',
                    'campos' => [
                        'kicker'            => ['label' => 'Etiqueta de arriba', 'tipo' => 'texto', 'def' => 'Según tu punto de partida'],
                        'titulo_1'          => ['label' => 'Título, primera parte', 'tipo' => 'texto', 'def' => 'ARMA'],
                        'titulo_2'          => ['label' => 'Título, segunda parte (en morado)', 'tipo' => 'texto', 'def' => 'TU RUTA'],
                        'bajada'            => ['label' => 'Bajada', 'tipo' => 'area', 'def' => 'Lo que conviene antes, junto o en lugar de este servicio, según cómo está tu negocio hoy.'],
                        'pregunta'          => ['label' => 'Pregunta sobre los botones', 'tipo' => 'texto', 'def' => '¿Cómo está tu negocio hoy?'],
                        'etapa_cero'        => ['label' => 'Botón · negocio nuevo', 'tipo' => 'texto', 'def' => 'Empiezo de cero'],
                        'etapa_negocio'     => ['label' => 'Botón · negocio que ya funciona', 'tipo' => 'texto', 'def' => 'Ya tengo un negocio'],
                        'tipo_base'         => ['label' => 'Etiqueta · lo que va antes', 'tipo' => 'texto', 'def' => 'Primero'],
                        'tipo_complemento'  => ['label' => 'Etiqueta · lo que va junto', 'tipo' => 'texto', 'def' => 'Va con este'],
                        'tipo_alcance'      => ['label' => 'Etiqueta · para llegar a más gente', 'tipo' => 'texto', 'def' => 'Más alcance'],
                        'tipo_siguiente'    => ['label' => 'Etiqueta · lo que sigue', 'tipo' => 'texto', 'def' => 'Después'],
                        'tipo_ruta'         => ['label' => 'Etiqueta · otra opción', 'tipo' => 'texto', 'def' => 'Otra ruta'],
                        'ver'               => ['label' => 'Enlace de cada tarjeta', 'tipo' => 'texto', 'def' => 'Ver el servicio'],
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

                'contexto' => [
                    'nombre' => 'De qué se trata',
                    'campos' => [
                        'definicion'  => ['label' => 'Definición', 'tipo' => 'parrafo', 'def' => 'Los servicios de inteligencia artificial aplicada son sistemas que se conectan a la operación real de una empresa —su chat, su catálogo, su lista de prospectos, sus campañas— y se hacen cargo de una parte concreta del trabajo. No son una herramienta que alguien tiene que aprender a usar: son procesos que quedan corriendo.'],
                        'texto_largo' => ['label' => 'Texto largo', 'tipo' => 'area', 'def' => 'Casi todas las empresas que preguntan por inteligencia artificial llegan con la pregunta al revés. Preguntan qué herramienta comprar, cuando lo que hay que decidir primero es qué parte del negocio está costando dinero.

En la práctica los cuellos de botella se repiten. Uno: llegan mensajes y no hay quien conteste a tiempo, así que la venta se va con quien respondió primero. Dos: hay prospectos de sobra pero nadie sabe cuáles valen, y el equipo los atiende por orden de llegada. Tres: se gasta en campañas sin poder decir cuál trajo clientes. Cuatro: entra gente a la tienda y compra una fracción mínima. Cada uno de esos problemas tiene una solución distinta, y por eso están separados en cuatro servicios y no vendidos como un paquete único.

Lo que tienen en común es que no son demostraciones. Se conectan a lo que ya usas —tu número de WhatsApp, tu CRM, tu catálogo, tus cuentas de campañas— y trabajan con tus datos reales. Un agente entrenado con información genérica contesta como un folleto y la gente lo nota en dos mensajes; la diferencia entre uno que sirve y uno que estorba está casi toda en el entrenamiento, no en el modelo.

También conviene decir lo que la IA no arregla. No arregla un producto que no se vende, ni un precio fuera de mercado, ni un proceso interno roto — lo que hace es que ese problema se note más rápido y a mayor escala. Antes de automatizar algo hay que confirmar que ese algo funciona cuando lo hace una persona.

Trabajamos desde Aguascalientes con empresas de aquí y de otras ciudades del país. Si no tienes claro cuál de los cuatro frentes es el tuyo, se empieza por una revisión de dónde se está perdiendo el dinero, y eso se puede medir antes de contratar nada.'],
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
                        'w_e3'     => ['label' => 'Tarjeta 1 · etiqueta 3', 'tipo' => 'texto', 'def' => 'Seguimiento automático'],
                        'v_titulo' => ['label' => 'Tarjeta 2 · nombre', 'tipo' => 'texto', 'def' => 'IA de Ventas'],
                        'v_sub'    => ['label' => 'Tarjeta 2 · subtítulo', 'tipo' => 'texto', 'def' => 'Prospección Inteligente'],
                        'v_texto'  => ['label' => 'Tarjeta 2 · descripción', 'tipo' => 'parrafo', 'def' => 'Automatiza prospección, califica leads y optimiza tu proceso comercial con inteligencia artificial.'],
                        'v_url'    => ['label' => 'Tarjeta 2 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia/ventas'],
                        'v_e1'     => ['label' => 'Tarjeta 2 · etiqueta 1', 'tipo' => 'texto', 'def' => 'Prospección automática'],
                        'v_e2'     => ['label' => 'Tarjeta 2 · etiqueta 2', 'tipo' => 'texto', 'def' => 'Prioriza leads'],
                        'v_e3'     => ['label' => 'Tarjeta 2 · etiqueta 3', 'tipo' => 'texto', 'def' => 'Optimización'],
                        'm_titulo' => ['label' => 'Tarjeta 3 · nombre', 'tipo' => 'texto', 'def' => 'IA para Marketing'],
                        'm_sub'    => ['label' => 'Tarjeta 3 · subtítulo', 'tipo' => 'texto', 'def' => 'Optimización Automática'],
                        'm_texto'  => ['label' => 'Tarjeta 3 · descripción', 'tipo' => 'parrafo', 'def' => 'Marketing que piensa por ti. Analiza campañas, genera contenido y optimiza resultados automáticamente.'],
                        'm_url'    => ['label' => 'Tarjeta 3 · destino', 'tipo' => 'enlace', 'def' => '/servicios-ia/marketing'],
                        'm_e1'     => ['label' => 'Tarjeta 3 · etiqueta 1', 'tipo' => 'texto', 'def' => 'Análisis automático'],
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
            'ayuda'  => 'Se ve igual que cualquier página de servicio: portada, qué incluye, lo que ganas, el proceso, ideal para, el fondo del asunto, preguntas y cierre. Los títulos de las secciones son los de la plantilla de servicio.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Nombre del servicio (el título grande)', 'tipo' => 'texto', 'def' => 'IA PARA WHATSAPP'],
                        'nombre_frase' => ['label' => 'Nombre en una frase (va en el mensaje de WhatsApp y en el asistente)', 'tipo' => 'texto', 'def' => 'IA para WhatsApp'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Tu mejor vendedor, siempre disponible. Atiende, califica y da seguimiento automático por WhatsApp.'],
                    ],
                ],

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Conversaciones naturales con IA entrenada en tu negocio'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Integración con CRM, calendarios y sistemas de pago'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Calificación automática de leads con scoring inteligente'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Análisis de sentimiento y priorización de urgencias'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Dashboard con métricas en tiempo real'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Notificaciones instantáneas de leads calificados'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Lo que ganas',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                    'nombre' => 'El proceso',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Clínicas y consultorios médicos que necesitan agendar citas 24/7'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'Inmobiliarias que califican prospectos y coordinan visitas'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'E-commerce que procesa pedidos y resuelve dudas de productos'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'Servicios profesionales que cotizan y agenden reuniones'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Empresas B2B que califican oportunidades comerciales'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Instituciones educativas que gestionan inscripciones'],
                    ],
                ],

                'contexto' => [
                    'nombre' => 'De qué se trata',
                    'ayuda'  => 'El texto que explica el servicio de verdad. De aquí salen las frases que cita un asistente de IA, y sin esto la página se queda demasiado corta para que Google se moleste en indexarla.',
                    'campos' => [
                        'definicion'  => ['label' => 'Definición', 'tipo' => 'parrafo', 'def' => 'Un agente de IA en WhatsApp es un programa que atiende el chat de tu negocio con lenguaje normal: lee lo que te escriben, responde con la información real de tu empresa —precios, horarios, disponibilidad— y pasa la conversación a una persona cuando hace falta. Vive en tu número de siempre, así que el cliente no nota ningún cambio.'],
                        'texto_largo' => ['label' => 'Texto largo (va plegado en «El fondo del asunto»)', 'tipo' => 'area', 'def' => 'En México, WhatsApp no es un canal de atención más: es el canal. La gente no llama, no manda correo y muchas veces ni siquiera entra al sitio — busca el número y escribe. Ahí es donde se decide la venta, y ahí es donde se pierde: alguien pregunta a las diez de la noche, un domingo, o justo cuando el equipo está atendiendo a otro cliente.

Lo que más sorprende al medirlo es que el problema casi nunca es el precio ni el producto. Es el tiempo. Quien contesta primero se lleva la venta, y contestar «primero» significa minutos, no horas. Un negocio que responde al día siguiente está compitiendo contra dos que ya cotizaron.

El agente cubre exactamente ese hueco, y conviene entender en qué se diferencia de los bots de menú que todos conocemos. Un menú te obliga a elegir entre opciones que alguien programó; si tu pregunta no está en la lista, no hay salida y la persona escribe «quiero hablar con un humano». Un agente lee lo que le escribieron con sus propias palabras, lo entiende aunque venga con faltas o a medias, y consulta tus datos reales para responder.

Lo que lo hace funcionar no es la tecnología, es el entrenamiento. Lo alimentamos con tus precios, tus políticas, tus tiempos de entrega y las preguntas que de verdad te hacen — que casi siempre son las mismas quince. Y le definimos el punto exacto donde suelta la conversación: cuando alguien negocia, se molesta, pide algo raro o ya está listo para comprar. Un agente que insiste en atender lo que no sabe hace más daño que no tener ninguno.

Todo queda registrado, y de ahí sale algo que casi ningún negocio tiene: la lista de lo que preguntan tus clientes, ordenada por frecuencia. Esa lista suele decir más sobre qué falta explicar en tu sitio y en tu material de venta que cualquier encuesta.'],
                    ],
                ],


                'faq' => [
                    'nombre' => 'Preguntas frecuentes',
                    'ayuda'  => 'Estas preguntas se publican también como datos estructurados, así que Google y los asistentes de IA pueden citarlas directas. Conviene que respondan de verdad, no que vendan.',
                    'campos' => [
                        'q1' => ['label' => 'Pregunta 1', 'tipo' => 'texto', 'def' => '¿Mis clientes se van a dar cuenta de que hablan con una IA?'],
                        'r1' => ['label' => 'Respuesta 1', 'tipo' => 'parrafo', 'def' => 'Se lo decimos desde el primer mensaje, y es lo correcto: engañar a alguien sobre eso se nota y molesta. Lo que sí notan es que les contestan al instante y con información correcta, que es lo que buscaban. La molestia con los bots viene de los que no resuelven nada, no de saber que es un bot.'],
                        'q2' => ['label' => 'Pregunta 2', 'tipo' => 'texto', 'def' => '¿Qué pasa si el agente no sabe responder?'],
                        'r2' => ['label' => 'Respuesta 2', 'tipo' => 'parrafo', 'def' => 'Avisa que lo va a pasar con alguien del equipo y guarda la conversación completa, para que quien llegue no haga repetir todo desde el principio. Definimos contigo los casos en los que debe soltar siempre: reclamos, negociación de precio, o cuando la persona ya quiere comprar.'],
                        'q3' => ['label' => 'Pregunta 3', 'tipo' => 'texto', 'def' => '¿Se puede usar mi número actual de WhatsApp?'],
                        'r3' => ['label' => 'Respuesta 3', 'tipo' => 'parrafo', 'def' => 'Sí, y es lo recomendable — cambiar de número es tirar años de conversaciones y de contactos guardados. Se migra a WhatsApp Business API conservando el mismo número. Durante ese trámite el número queda inactivo unas horas, así que se agenda en horario de baja actividad.'],
                        'q4' => ['label' => 'Pregunta 4', 'tipo' => 'texto', 'def' => '¿Cuánto tarda en estar funcionando?'],
                        'r4' => ['label' => 'Respuesta 4', 'tipo' => 'parrafo', 'def' => 'La conexión técnica toma pocos días. Lo que marca el ritmo es reunir tu información: precios vigentes, políticas y las preguntas reales de tus clientes. Con eso a la mano, entre dos y tres semanas está contestando; sin eso, el agente responde en genérico y no vale la pena encenderlo.'],
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
            'ayuda'  => 'Se ve igual que cualquier página de servicio: portada, qué incluye, lo que ganas, el proceso, ideal para, el fondo del asunto, preguntas y cierre. Los títulos de las secciones son los de la plantilla de servicio.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Nombre del servicio (el título grande)', 'tipo' => 'texto', 'def' => 'IA DE VENTAS'],
                        'nombre_frase' => ['label' => 'Nombre en una frase (va en el mensaje de WhatsApp y en el asistente)', 'tipo' => 'texto', 'def' => 'IA de Ventas'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Sistema de IA que automatiza prospección, califica leads y optimiza cada etapa de tu proceso comercial.'],
                    ],
                ],

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Enriquecimiento automático de datos de prospectos'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Integración con LinkedIn, CRM y bases de datos comerciales'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Análisis predictivo de comportamiento de compra'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Secuencias de email y llamadas automatizadas'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Dashboard con métricas de conversión en tiempo real'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Alertas inteligentes de oportunidades de venta'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Lo que ganas',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                    'nombre' => 'El proceso',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Equipos de ventas B2B que necesitan calificar leads rápidamente'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'Empresas SaaS con ciclos de venta complejos'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'Consultorías y agencias que prospectan empresas'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'Distribuidores mayoristas con grandes volúmenes de clientes'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Startups tecnológicas en fase de crecimiento'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Inmobiliarias comerciales con múltiples desarrollos'],
                    ],
                ],

                'contexto' => [
                    'nombre' => 'De qué se trata',
                    'ayuda'  => 'El texto que explica el servicio de verdad. De aquí salen las frases que cita un asistente de IA, y sin esto la página se queda demasiado corta para que Google se moleste en indexarla.',
                    'campos' => [
                        'definicion'  => ['label' => 'Definición', 'tipo' => 'parrafo', 'def' => 'La IA de ventas es el uso de inteligencia artificial para que un equipo comercial deje de gastar su tiempo en prospectos que nunca iban a comprar. Ordena la lista por probabilidad real, escribe el primer contacto con el dato de cada empresa y sostiene el seguimiento que normalmente se abandona al tercer intento.'],
                        'texto_largo' => ['label' => 'Texto largo (va plegado en «El fondo del asunto»)', 'tipo' => 'area', 'def' => 'En casi todos los equipos comerciales pasa lo mismo, y rara vez se dice en voz alta: la mayor parte del tiempo del vendedor no se va vendiendo. Se va buscando datos, escribiendo correos que nadie abre, llenando el CRM y persiguiendo prospectos que jamás iban a comprar. La parte que de verdad genera ingresos —hablar con alguien que sí tiene el problema, el presupuesto y la urgencia— ocupa una fracción de la semana.

El primer frente es a quién llamar. Un vendedor con doscientos contactos y sin criterio los atiende por orden de llegada, que es el peor orden posible. Con los datos que ya tienes —de dónde llegó, qué páginas vio, cuánto tardó en contestar, qué tan grande es la empresa— se puede ordenar esa lista por probabilidad real de cierre. El equipo empieza por arriba y la misma semana rinde distinto.

El segundo es el primer contacto. El correo en frío genérico tiene una tasa de respuesta miserable y todos lo sabemos, pero personalizar doscientos a mano es imposible. La IA lee la información pública de cada empresa y redacta un primer mensaje que menciona algo concreto de ellos. No sustituye al vendedor: le entrega el borrador para que lo revise y lo mande, que es la diferencia entre veinte contactos al día y ciento cincuenta.

El tercero es el seguimiento, que es donde se pierde más dinero. La mayoría de las ventas se cierra después del cuarto o quinto contacto, y la mayoría de los vendedores se detiene en el segundo. No por flojera: porque nadie lleva la cuenta y la agenda se llena. El sistema recuerda, avisa y propone el siguiente mensaje en el momento adecuado.

Y algo que conviene decir antes de empezar: esto ordena y acelera un proceso de venta que ya funciona. Si el problema es que el producto no se está vendiendo, automatizar el contacto solo hace que más gente diga que no, más rápido. En ese caso hay que revisar la oferta primero, y lo decimos.'],
                    ],
                ],


                'faq' => [
                    'nombre' => 'Preguntas frecuentes',
                    'ayuda'  => 'Estas preguntas se publican también como datos estructurados, así que Google y los asistentes de IA pueden citarlas directas. Conviene que respondan de verdad, no que vendan.',
                    'campos' => [
                        'q1' => ['label' => 'Pregunta 1', 'tipo' => 'texto', 'def' => '¿Esto reemplaza a mi equipo de ventas?'],
                        'r1' => ['label' => 'Respuesta 1', 'tipo' => 'parrafo', 'def' => 'No, y quien lo prometa está exagerando. La venta la cierra una persona, sobre todo con ticket alto. Lo que se automatiza es lo que rodea a la venta: buscar datos, redactar el primer contacto, recordar el seguimiento, llenar el CRM. Un vendedor gasta ahí buena parte de su semana.'],
                        'q2' => ['label' => 'Pregunta 2', 'tipo' => 'texto', 'def' => '¿Necesito tener un CRM antes de empezar?'],
                        'r2' => ['label' => 'Respuesta 2', 'tipo' => 'parrafo', 'def' => 'Ayuda mucho, pero no es obligatorio para arrancar. Se puede empezar con lo que tengas, incluso una hoja de cálculo, y montar el CRM en paralelo. Lo que sí hace falta es que alguien registre lo que pasó con cada prospecto: sin ese dato el sistema no tiene de qué aprender.'],
                        'q3' => ['label' => 'Pregunta 3', 'tipo' => 'texto', 'def' => '¿Cómo sabe la IA cuáles prospectos son buenos?'],
                        'r3' => ['label' => 'Respuesta 3', 'tipo' => 'parrafo', 'def' => 'Al principio con reglas que definimos contigo: tamaño de la empresa, giro, comportamiento en el sitio, rapidez de respuesta. Después con tus cierres reales — cuando ya hay unas decenas de ventas y de pérdidas registradas, el criterio deja de ser una suposición y pasa a ser tu historial.'],
                        'q4' => ['label' => 'Pregunta 4', 'tipo' => 'texto', 'def' => '¿Los correos automáticos no suenan a robot?'],
                        'r4' => ['label' => 'Respuesta 4', 'tipo' => 'parrafo', 'def' => 'Los genéricos sí, y por eso no funcionan. El planteamiento aquí es otro: la IA prepara un borrador que menciona algo concreto de esa empresa y el vendedor lo revisa antes de mandarlo. Nadie manda nada sin leerlo. Lo que se gana es velocidad, no permiso para escribir mal.'],
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
            'ayuda'  => 'Se ve igual que cualquier página de servicio: portada, qué incluye, lo que ganas, el proceso, ideal para, el fondo del asunto, preguntas y cierre. Los títulos de las secciones son los de la plantilla de servicio.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Nombre del servicio (el título grande)', 'tipo' => 'texto', 'def' => 'IA PARA MARKETING DIGITAL'],
                        'nombre_frase' => ['label' => 'Nombre en una frase (va en el mensaje de WhatsApp y en el asistente)', 'tipo' => 'texto', 'def' => 'IA para Marketing'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Automatiza contenido, optimiza campañas y multiplica resultados con inteligencia artificial.'],
                    ],
                ],

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Generación de contenido para redes sociales con IA'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Optimización automática de campañas de Google y Meta Ads'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'A/B testing inteligente de creatividades y copy'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Análisis de sentimiento y monitoreo de marca'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Predicción de tendencias y oportunidades de mercado'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Dashboard unificado con métricas de todas las plataformas'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Lo que ganas',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                    'nombre' => 'El proceso',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Agencias de marketing que manejan múltiples clientes simultáneamente'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'E-commerce con presupuesto publicitario mensual mayor a $20,000 MXN'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'Empresas SaaS que necesitan generación constante de leads'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'Consultores independientes que buscan escalar su negocio'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Marcas DTC (Direct to Consumer) enfocadas en crecimiento'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Startups en fase de validación de product-market fit'],
                    ],
                ],

                'contexto' => [
                    'nombre' => 'De qué se trata',
                    'ayuda'  => 'El texto que explica el servicio de verdad. De aquí salen las frases que cita un asistente de IA, y sin esto la página se queda demasiado corta para que Google se moleste en indexarla.',
                    'campos' => [
                        'definicion'  => ['label' => 'Definición', 'tipo' => 'parrafo', 'def' => 'La IA aplicada a marketing es usar inteligencia artificial para decidir dónde poner el presupuesto, producir el contenido que hace falta y detectar lo que no está funcionando antes de que se gaste el mes. No es publicar más rápido: es dejar de gastar en lo que no devuelve nada.'],
                        'texto_largo' => ['label' => 'Texto largo (va plegado en «El fondo del asunto»)', 'tipo' => 'area', 'def' => 'La mayoría de las áreas de marketing no tiene un problema de ideas: tiene un problema de evidencia. Se publica, se pauta y se reporta alcance, pero nadie puede decir con certeza qué campaña trajo clientes y cuál solo gastó. Cuando llega el momento de recortar, se recorta por intuición o por lo que menos defienda alguien en la junta.

El primer uso serio de la IA aquí es de lectura, no de creación. Una cuenta de campañas genera más datos de los que un humano alcanza a revisar cada semana: combinaciones de anuncio, público, horario, dispositivo y ubicación. Un sistema los recorre completos y encuentra los patrones que se pierden a ojo — que el anuncio que peor rinde en general es el mejor los fines de semana, o que un público chico y aburrido está trayendo la mitad de los clientes reales.

El segundo es de producción, y aquí conviene ser claro sobre el alcance. La IA genera muchas versiones de un mismo mensaje en el tiempo que tomaba escribir una, y eso importa porque la publicidad se agota: el mismo anuncio que funcionó dos meses deja de funcionar cuando la gente ya lo vio. Tener variantes listas mantiene la campaña viva. Lo que no hace la IA es decidir qué tiene que decir tu marca — eso sigue siendo una decisión humana, y delegarla es lo que produce esas campañas que podrían ser de cualquiera.

El tercero es la alerta temprana. Una campaña que se descompone un martes y se revisa el lunes siguiente ya quemó una semana de presupuesto. Configuramos avisos sobre lo que de verdad importa —costo por cliente, no por clic— para que el problema se vea el mismo día.

Y un cuarto frente que hace dos años no existía: qué dicen de tu marca ChatGPT, Gemini y Perplexity cuando alguien pregunta por tu categoría. Cada vez más gente decide ahí antes de llegar a Google, y es medible.'],
                    ],
                ],


                'faq' => [
                    'nombre' => 'Preguntas frecuentes',
                    'ayuda'  => 'Estas preguntas se publican también como datos estructurados, así que Google y los asistentes de IA pueden citarlas directas. Conviene que respondan de verdad, no que vendan.',
                    'campos' => [
                        'q1' => ['label' => 'Pregunta 1', 'tipo' => 'texto', 'def' => '¿La IA va a escribir todo mi contenido?'],
                        'r1' => ['label' => 'Respuesta 1', 'tipo' => 'parrafo', 'def' => 'Puede, y no lo recomendamos. El contenido escrito completo por una IA suena a contenido escrito por una IA, y la gente lo distingue cada vez mejor. Sirve muy bien para producir variantes de un mensaje que ya decidiste, para adaptar un texto a cada canal y para salir del renglón en blanco.'],
                        'q2' => ['label' => 'Pregunta 2', 'tipo' => 'texto', 'def' => '¿Sirve si mi presupuesto de publicidad es chico?'],
                        'r2' => ['label' => 'Respuesta 2', 'tipo' => 'parrafo', 'def' => 'Con presupuestos pequeños la automatización de pujas rinde poco, porque el sistema no junta datos suficientes para aprender. Lo que sí rinde desde el primer mes es medir bien y producir más variantes. Preferimos decirlo antes que vender una optimización que no va a tener de qué alimentarse.'],
                        'q3' => ['label' => 'Pregunta 3', 'tipo' => 'texto', 'def' => '¿Cómo sé si de verdad está funcionando?'],
                        'r3' => ['label' => 'Respuesta 3', 'tipo' => 'parrafo', 'def' => 'Porque la conversación cambia de tema. Se deja de discutir alcance e impresiones y se empieza a discutir cuánto costó cada cliente y de qué campaña salió. Si a los tres meses el reporte sigue hablando de seguidores, algo se hizo mal.'],
                        'q4' => ['label' => 'Pregunta 4', 'tipo' => 'texto', 'def' => '¿Qué es eso de aparecer en las respuestas de ChatGPT?'],
                        'r4' => ['label' => 'Respuesta 4', 'tipo' => 'parrafo', 'def' => 'Cuando alguien le pregunta a un asistente por proveedores de tu categoría, la respuesta menciona empresas concretas. Estar o no estar ahí ya mueve clientes, y depende de cosas que se trabajan: que tu sitio sea legible para esos sistemas y que existan menciones tuyas fuera de tu propia página.'],
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
            'ayuda'  => 'Se ve igual que cualquier página de servicio: portada, qué incluye, lo que ganas, el proceso, ideal para, el fondo del asunto, preguntas y cierre. Los títulos de las secciones son los de la plantilla de servicio.',
            'secciones' => [
                'portada' => [
                    'nombre' => 'Portada',
                    'campos' => [
                        'etiqueta' => ['label' => 'Nombre del servicio (el título grande)', 'tipo' => 'texto', 'def' => 'IA PARA E-COMMERCE'],
                        'nombre_frase' => ['label' => 'Nombre en una frase (va en el mensaje de WhatsApp y en el asistente)', 'tipo' => 'texto', 'def' => 'IA para E-commerce'],
                        'bajada'   => ['label' => 'Texto de presentación', 'tipo' => 'parrafo', 'def' => 'Asistente inteligente dentro de tu tienda que recupera carritos, recomienda productos y atiende 24/7.'],
                    ],
                ],

                'incluye' => [
                    'nombre' => 'Qué incluye',
                    'campos' => [
                        'f1' => ['label' => 'Punto 1', 'tipo' => 'texto', 'def' => 'Chat inteligente que guía desde duda hasta compra'],
                        'f2' => ['label' => 'Punto 2', 'tipo' => 'texto', 'def' => 'Upsell y cross-sell automático en momento ideal'],
                        'f3' => ['label' => 'Punto 3', 'tipo' => 'texto', 'def' => 'Personalización 1:1 basada en comportamiento'],
                        'f4' => ['label' => 'Punto 4', 'tipo' => 'texto', 'def' => 'Automatización de emails activados por acciones'],
                        'f5' => ['label' => 'Punto 5', 'tipo' => 'texto', 'def' => 'Análisis predictivo de inventario y tendencias'],
                        'f6' => ['label' => 'Punto 6', 'tipo' => 'texto', 'def' => 'Integración con Shopify, WooCommerce, Magento y más'],
                    ],
                ],

                'beneficios' => [
                    'nombre' => 'Lo que ganas',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                    'nombre' => 'El proceso',
                    'campos' => [
                        'visible'  => ['label' => 'Mostrar esta sección', 'tipo' => 'switch', 'def' => '1'],
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
                        'i1' => ['label' => 'Caso 1', 'tipo' => 'texto', 'def' => 'Tiendas online con más de 100 visitas diarias que necesitan vender más'],
                        'i2' => ['label' => 'Caso 2', 'tipo' => 'texto', 'def' => 'Marcas propias (DTC) enfocadas en reducir costo de adquisición'],
                        'i3' => ['label' => 'Caso 3', 'tipo' => 'texto', 'def' => 'Shopify Stores con instalación en minutos sin código'],
                        'i4' => ['label' => 'Caso 4', 'tipo' => 'texto', 'def' => 'WooCommerce optimizado para WordPress con plugin nativo'],
                        'i5' => ['label' => 'Caso 5', 'tipo' => 'texto', 'def' => 'Vendedores en marketplaces que quieren su propia tienda'],
                        'i6' => ['label' => 'Caso 6', 'tipo' => 'texto', 'def' => 'Negocios de dropshipping que buscan automatizar atención'],
                    ],
                ],

                'contexto' => [
                    'nombre' => 'De qué se trata',
                    'ayuda'  => 'El texto que explica el servicio de verdad. De aquí salen las frases que cita un asistente de IA, y sin esto la página se queda demasiado corta para que Google se moleste en indexarla.',
                    'campos' => [
                        'definicion'  => ['label' => 'Definición', 'tipo' => 'parrafo', 'def' => 'La IA para e-commerce es el conjunto de sistemas que trabajan sobre las visitas que tu tienda ya recibe: recomiendan el producto correcto, responden las dudas que frenan la compra y recuperan los carritos abandonados. No traen más gente — hacen que compre más de la que ya está entrando.'],
                        'texto_largo' => ['label' => 'Texto largo (va plegado en «El fondo del asunto»)', 'tipo' => 'area', 'def' => 'En una tienda en línea la cuenta que casi nadie mira es esta: de cada cien personas que entran, entre una y tres compran. Todo el esfuerzo suele irse en traer más gente, cuando el margen más barato está en las noventa y siete que ya llegaron y se fueron.

El primer frente es la búsqueda dentro de la tienda, que es donde se pierde la venta más fácil de todas. Quien usa el buscador ya decidió comprar y solo quiere encontrar. Un buscador que exige la palabra exacta —que no entiende «tenis para correr» si el producto se llama «calzado deportivo»— devuelve cero resultados y esa persona se va. Un buscador con IA entiende la intención, tolera las faltas de ortografía y encuentra lo que había.

El segundo son las dudas que frenan justo antes de pagar, y casi siempre son las mismas cuatro: si le queda, cuándo llega, cuánto cuesta el envío y qué pasa si quiere devolverlo. Sin respuesta, la persona pospone la compra — y posponer una compra en línea equivale a cancelarla. Un agente contesta eso al instante y con el dato real de tu inventario y tu paquetería.

El tercero es el carrito abandonado, que es dinero ya casi cobrado. Siete de cada diez carritos se quedan sin pagar, y una secuencia de recuperación bien armada rescata una parte. La diferencia entre una que funciona y una que molesta está en el tiempo y en el tono: el primer recordatorio a la hora, no a los tres días, y sin descuento inmediato — regalar margen a quien iba a comprar de todos modos es tirar dinero.

Y el cuarto es la recomendación. No la de «también te puede interesar» puesta al azar, sino la que se apoya en lo que esa persona vio y en lo que compraron juntos otros clientes. Bien hecha sube el ticket promedio sin gastar un peso más en publicidad, que es la definición de margen.'],
                    ],
                ],


                'faq' => [
                    'nombre' => 'Preguntas frecuentes',
                    'ayuda'  => 'Estas preguntas se publican también como datos estructurados, así que Google y los asistentes de IA pueden citarlas directas. Conviene que respondan de verdad, no que vendan.',
                    'campos' => [
                        'q1' => ['label' => 'Pregunta 1', 'tipo' => 'texto', 'def' => '¿Funciona con mi plataforma actual?'],
                        'r1' => ['label' => 'Respuesta 1', 'tipo' => 'parrafo', 'def' => 'Con las más usadas —Shopify, WooCommerce, Tiendanube, Magento— la conexión es directa. Con desarrollos a la medida depende de si la tienda permite consultar catálogo e inventario desde fuera; casi siempre se puede, y lo revisamos antes de proponer nada.'],
                        'q2' => ['label' => 'Pregunta 2', 'tipo' => 'texto', 'def' => '¿Cuánto puede subir la conversión?'],
                        'r2' => ['label' => 'Respuesta 2', 'tipo' => 'parrafo', 'def' => 'Depende demasiado del punto de partida como para prometer un número, y desconfía de quien te dé uno sin ver tu tienda. Lo que sí se puede decir es dónde suele estar el margen: en el buscador interno, en las dudas de envío y devolución, y en la recuperación de carritos.'],
                        'q3' => ['label' => 'Pregunta 3', 'tipo' => 'texto', 'def' => '¿Necesito mucho tráfico para que valga la pena?'],
                        'r3' => ['label' => 'Respuesta 3', 'tipo' => 'parrafo', 'def' => 'Para que las recomendaciones aprendan sí hace falta cierto volumen de visitas y de compras. Pero la atención automática en el chat y la recuperación de carritos rinden desde el primer mes, incluso en tiendas chicas, porque no dependen de aprender: dependen de contestar a tiempo.'],
                        'q4' => ['label' => 'Pregunta 4', 'tipo' => 'texto', 'def' => '¿El agente puede procesar pedidos completos?'],
                        'r4' => ['label' => 'Respuesta 4', 'tipo' => 'parrafo', 'def' => 'Puede tomar el pedido, resolver dudas y llevar a la persona hasta el pago. El cobro se hace en tu pasarela de siempre, no dentro del chat: es más seguro y evita problemas con la conciliación y con las devoluciones.'],
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
                        'a2_lista'  => ['label' => 'Apartado 2 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => 'Proporcionar y mejorar nuestros servicios' . "\n" . 'Comunicarnos contigo sobre nuestros servicios' . "\n" . 'Enviar información relevante de marketing (con tu consentimiento)' . "\n" . 'Analizar el uso de nuestro sitio web'],
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
                        'a6_texto'  => ['label' => 'Apartado 6 · texto', 'tipo' => 'parrafo', 'def' => 'Si tienes preguntas sobre esta política de privacidad, contáctanos:' . "\n" . 'Email: contacto@inedito.digital' . "\n" . 'Teléfono: +52 1 449 120 4353'],
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
                        'a3_lista'  => ['label' => 'Apartado 3 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => '50% de anticipo para iniciar el proyecto' . "\n" . '50% restante contra entrega' . "\n" . 'Servicios recurrentes: pago mensual anticipado'],
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
                        'a6_lista'  => ['label' => 'Apartado 6 · puntos (uno por línea)', 'tipo' => 'parrafo', 'def' => 'Proyectos: El anticipo no es reembolsable' . "\n" . 'Servicios mensuales: Aviso de 30 días'],
                        'a7_ver'    => ['label' => 'Apartado 7 · mostrar', 'tipo' => 'switch', 'def' => '1'],
                        'a7_titulo' => ['label' => 'Apartado 7 · título', 'tipo' => 'texto', 'def' => '7. Contacto'],
                        'a7_texto'  => ['label' => 'Apartado 7 · texto', 'tipo' => 'parrafo', 'def' => 'Para preguntas sobre estos términos:' . "\n" . 'Email: contacto@inedito.digital' . "\n" . 'Teléfono: +52 1 449 120 4353'],
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
                        'placeholder' => ['label' => 'Texto de la casilla de escritura', 'tipo' => 'texto', 'def' => 'Escribe tu pregunta…'],
                    ],
                ],

                'conversacion' => [
                    'nombre' => 'Lo que dice el asistente',
                    'campos' => [
                        // 'saludo' estaba dos veces en esta seccion: PHP se quedaba con la
                        // segunda. Queda una sola, en el lugar de la primera y con la
                        // segunda (la vigente), con saltos de linea reales.
                        'saludo'        => ['label' => 'Saludo inicial', 'tipo' => 'area', 'def' => 'Hola 👋 Soy el asistente de Inédito.' . "\n\n" . 'Pregúntame lo que quieras sobre nuestros servicios, o dime qué necesitas para tu negocio.'],
                        'que_servicio'  => ['label' => 'Pregunta por el servicio', 'tipo' => 'texto', 'def' => '¿Qué servicio te interesa más?'],
                        'entiendo'      => ['label' => 'Respuesta cuando describe su necesidad', 'tipo' => 'texto', 'def' => '¡Entiendo perfectamente! Esto es justo lo que hacemos. 🎯'],
                        'pedir_datos'   => ['label' => 'Aviso antes de pedir los datos', 'tipo' => 'parrafo', 'def' => 'Déjame capturar tus datos para prepararte una cotización personalizada.'],
                        'pedir_datos_2' => ['label' => 'Aviso antes de pedir los datos (tras describir el proyecto)', 'tipo' => 'parrafo', 'def' => 'Déjame capturar tus datos para que un especialista revise tu proyecto a detalle y te prepare una propuesta personalizada.'],
                        'saludo_ctx' => ['label' => 'Saludo al pulsar Cotizar', 'tipo' => 'area', 'def' => 'Hola 👋 Con gusto te ayudo a cotizar.' . "\n" . '' . "\n" . '¿Qué necesitas? Escríbelo con tus palabras, o elige una opción.'],
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
                        'r_catalogo' => ['label' => 'Respuesta · qué servicios tienen', 'tipo' => 'texto', 'def' => 'Trabajamos en tres pasos: que te encuentren, que te escriban y que te compren. ¿Por cuál empezamos?'],
                        'r_catalogo_sub' => ['label' => 'Respuesta · qué servicios tienen, línea bajo el diagnóstico', 'tipo' => 'texto', 'def' => 'Empieza por saber qué está mal, con evidencia'],
                        'opcion_otros' => ['label' => 'Botón · otros servicios', 'tipo' => 'texto', 'def' => 'Otros servicios'],
                        'r_otros' => ['label' => 'Respuesta · otros servicios', 'tipo' => 'texto', 'def' => 'También hacemos esto, casi siempre como parte de un proyecto:'],
                        // Se pide ANTES de registrar el lead: sin WhatsApp o correo no hay registro (23-sep).
                        'p_contacto' => ['label' => 'Pregunta · WhatsApp o correo', 'tipo' => 'texto', 'def' => '¿A qué WhatsApp te escribimos? Si lo prefieres, déjanos tu correo.'],
                        'e_telefono' => ['label' => 'Aviso · número incompleto', 'tipo' => 'texto', 'def' => 'Ese número se ve incompleto: son 10 dígitos, como 449 123 4567. También puedes dejarnos tu correo.'],
                        'e_correo' => ['label' => 'Aviso · correo incompleto', 'tipo' => 'texto', 'def' => 'Ese correo no se ve completo. Revísalo, o déjanos mejor tu WhatsApp.'],
                        // Va después de «Listo, <nombre>.», que el asistente pone solo.
                        'r_listo' => ['label' => 'Mensaje final antes de WhatsApp', 'tipo' => 'area', 'def' => 'Te preparé el mensaje con todo lo que consultaste.' . "\n" . '' . "\n" . 'Dale al botón de abajo y solo tienes que enviarlo. Si no alcanzas, te escribimos nosotros.'],
                        'r_precio' => ['label' => 'Respuesta · precios', 'tipo' => 'area', 'def' => 'Cada proyecto se cotiza según lo que necesita, así que no manejo precios de lista: no sería honesto darte una cifra sin saber de qué tamaño es tu negocio.' . "\n" . '' . "\n" . 'Lo que sí: la primera revisión no tiene costo. Pásame tu caso por WhatsApp y te damos un número real.'],
                        'r_portafolio' => ['label' => 'Respuesta · portafolio', 'tipo' => 'area', 'def' => 'Tenemos los casos publicados con lo que hicimos en cada uno.'],
                        'r_quienes' => ['label' => 'Respuesta · quiénes somos', 'tipo' => 'area', 'def' => 'Somos una agencia de Aguascalientes que trabaja como dirección comercial asistida por IA: conectamos tus objetivos con datos reales y auditamos cada mes si la estrategia funciona.'],
                        'r_niveles' => ['label' => 'Respuesta · por dónde empezar (los tres pasos)', 'tipo' => 'area', 'def' => 'No tienes que contratar todo. Trabajamos en tres pasos —que te encuentren, que te escriban y que te compren— y el diagnóstico con IA te dice por cuál empezar, con evidencia.'],
                        'r_varios' => ['label' => 'Respuesta · varios servicios posibles', 'tipo' => 'texto', 'def' => 'Puede ser cualquiera de estos. ¿Cuál te interesa?'],
                        'r_saludo' => ['label' => 'Respuesta · a un saludo suelto', 'tipo' => 'texto', 'def' => '¡Hola! ¿Qué necesitas para tu negocio?'],
                        'r_otra' => ['label' => 'Respuesta · tengo otra duda', 'tipo' => 'texto', 'def' => '¿Qué más quieres saber?'],
                        'r_nada' => ['label' => 'Respuesta · no entendí', 'tipo' => 'area', 'def' => 'No estoy seguro de haber entendido bien 🤔' . "\n" . '' . "\n" . '¿Me lo dices de otra forma? O si prefieres, te paso con alguien del equipo que te responde al momento.'],
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
                        'portafolio'  => ['label' => 'Nombre de «Portafolio»', 'tipo' => 'texto', 'def' => 'Portafolio'],
                        'blog'        => ['label' => 'Nombre de «Blog»', 'tipo' => 'texto', 'def' => 'Blog'],
                        'nosotros'    => ['label' => 'Nombre de «Nosotros»', 'tipo' => 'texto', 'def' => 'Nosotros'],
                        'contacto'    => ['label' => 'Nombre de «Contacto»', 'tipo' => 'texto', 'def' => 'Contacto'],
                        'boton'       => ['label' => 'Texto del botón del menú', 'tipo' => 'texto', 'def' => 'COTIZAR'],
                        // El contenido del desplegable de servicios vive en «Menú de servicios».
                        'wa_boton'    => ['label' => 'Botón de WhatsApp de la barra', 'tipo' => 'texto', 'def' => 'WHATSAPP'],
                        'wa_mensaje'  => ['label' => 'Mensaje que abre ese botón de WhatsApp', 'tipo' => 'texto', 'def' => 'Hola, quiero el diagnóstico gratuito de mi presencia digital'],
                        'boton_movil' => ['label' => 'Botón de cotizar en el menú del teléfono', 'tipo' => 'texto', 'def' => 'COTIZAR AHORA'],
                    ],
                ],

                'menu_servicios' => [
                    'nombre' => 'Menú de servicios (los tres pasos)',
                    'ayuda'  => 'El desplegable de «Servicios» y la respuesta del asistente a «¿qué hacen?». Cuenta el método en tres pasos; los demás servicios siguen publicados, se llega a ellos desde «Ver todos los servicios».',
                    'campos' => [
                        'paso_1'       => ['label' => 'Paso 1 · nombre', 'tipo' => 'texto', 'def' => 'Que te encuentren'],
                        'paso_1_sub'   => ['label' => 'Paso 1 · qué significa', 'tipo' => 'texto', 'def' => 'En Google y en los asistentes de IA'],
                        'web'          => ['label' => 'Paso 1 · sitio web', 'tipo' => 'texto', 'def' => 'Sitio web'],
                        'web_desc'     => ['label' => 'Paso 1 · sitio web, descripción', 'tipo' => 'texto', 'def' => 'Rápido, administrable y medido desde el primer día'],
                        'seo'          => ['label' => 'Paso 1 · posicionamiento en Google', 'tipo' => 'texto', 'def' => 'Posicionamiento en Google'],
                        'seo_desc'     => ['label' => 'Paso 1 · posicionamiento en Google, descripción', 'tipo' => 'texto', 'def' => 'Aparecer cuando te buscan'],
                        'geo'          => ['label' => 'Paso 1 · posicionamiento en IA', 'tipo' => 'texto', 'def' => 'Posicionamiento en IA'],
                        'geo_desc'     => ['label' => 'Paso 1 · posicionamiento en IA, descripción', 'tipo' => 'texto', 'def' => 'Que ChatGPT y Gemini te recomienden'],
                        'ficha'        => ['label' => 'Paso 1 · ficha de Google', 'tipo' => 'texto', 'def' => 'Ficha de Google'],
                        'ficha_desc'   => ['label' => 'Paso 1 · ficha de Google, descripción', 'tipo' => 'texto', 'def' => 'Tu negocio completo en el mapa'],
                        'paso_2'       => ['label' => 'Paso 2 · nombre', 'tipo' => 'texto', 'def' => 'Que te escriban'],
                        'paso_2_sub'   => ['label' => 'Paso 2 · qué significa', 'tipo' => 'texto', 'def' => 'Y que cada mensaje se conteste'],
                        'agente'       => ['label' => 'Paso 2 · agente de WhatsApp', 'tipo' => 'texto', 'def' => 'Agente de IA para WhatsApp'],
                        'agente_desc'  => ['label' => 'Paso 2 · agente de WhatsApp, descripción', 'tipo' => 'texto', 'def' => 'Atiende a toda hora y le pasa el prospecto a tu equipo'],
                        'ventas'       => ['label' => 'Paso 2 · IA de ventas', 'tipo' => 'texto', 'def' => 'IA de ventas'],
                        'ventas_desc'  => ['label' => 'Paso 2 · IA de ventas, descripción', 'tipo' => 'texto', 'def' => 'Califica prospectos y les da seguimiento'],
                        'funnels'      => ['label' => 'Paso 2 · funnels', 'tipo' => 'texto', 'def' => 'Funnels de venta'],
                        'funnels_desc' => ['label' => 'Paso 2 · funnels, descripción', 'tipo' => 'texto', 'def' => 'Del anuncio a la conversación, sin fugas'],
                        'paso_3'       => ['label' => 'Paso 3 · nombre', 'tipo' => 'texto', 'def' => 'Que te compren'],
                        'paso_3_sub'   => ['label' => 'Paso 3 · qué significa', 'tipo' => 'texto', 'def' => 'Y que sepas qué canal vendió'],
                        'ads'          => ['label' => 'Paso 3 · Google Ads', 'tipo' => 'texto', 'def' => 'Google Ads'],
                        'ads_desc'     => ['label' => 'Paso 3 · Google Ads, descripción', 'tipo' => 'texto', 'def' => 'Campañas medidas contra ventas reales'],
                        'chatgpt'      => ['label' => 'Paso 3 · ChatGPT Ads', 'tipo' => 'texto', 'def' => 'ChatGPT Ads'],
                        'chatgpt_desc' => ['label' => 'Paso 3 · ChatGPT Ads, descripción', 'tipo' => 'texto', 'def' => 'Anúnciate donde tu cliente ya pregunta'],
                        'canales'      => ['label' => 'Paso 3 · estrategia de canales', 'tipo' => 'texto', 'def' => 'Estrategia de canales'],
                        'canales_desc' => ['label' => 'Paso 3 · estrategia de canales, descripción', 'tipo' => 'texto', 'def' => 'Venta directa y marketplaces, en orden'],
                        'tablero'      => ['label' => 'Paso 3 · tablero', 'tipo' => 'texto', 'def' => 'Tablero de resultados'],
                        'tablero_desc' => ['label' => 'Paso 3 · tablero, descripción', 'tipo' => 'texto', 'def' => 'Todo tu digital en una sola pantalla'],
                        'empieza'      => ['label' => 'Columna morada · etiqueta', 'tipo' => 'texto', 'def' => 'Empieza aquí'],
                        'diag_titulo'  => ['label' => 'Columna morada · título', 'tipo' => 'texto', 'def' => 'Diagnóstico con IA'],
                        'diag_texto'   => ['label' => 'Columna morada · texto', 'tipo' => 'parrafo', 'def' => 'Te decimos qué ven de ti Google y los asistentes de IA, qué está mal y qué arreglar primero. Con evidencia.'],
                        'diag_boton'   => ['label' => 'Columna morada · botón', 'tipo' => 'texto', 'def' => 'Pedir diagnóstico'],
                        'pie'          => ['label' => 'Frase de abajo', 'tipo' => 'texto', 'def' => 'Un solo sistema en tres pasos: cada paso se mide antes de dar el siguiente.'],
                        'ver_todos'    => ['label' => 'Enlace a todos los servicios', 'tipo' => 'texto', 'def' => 'Ver todos los servicios'],
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
                        /* El gancho de WhatsApp. El 79 % de las visitas llega directo
                           —gente que ya conoce la marca—; para esa gente el paso más
                           barato no es leer una página más, es escribir un mensaje. */
                        'wa_gancho'    => ['label' => 'Gancho de WhatsApp (pie)', 'tipo' => 'texto',
                                           'def' => 'Diagnóstico gratis por WhatsApp'],
                        'wa_mensaje'   => ['label' => 'Mensaje con el que abre WhatsApp', 'tipo' => 'texto',
                                           'def' => 'Hola, quiero el diagnóstico gratuito de mi presencia digital'],
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
