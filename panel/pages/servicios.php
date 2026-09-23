<?php
/**
 * Los servicios.
 *
 * La ficha de /servicios/… se arma casi entera con campos que hasta ahora
 * solo existían dentro del data_json y no tenían formulario: la definición
 * que abre la página, para quién es, el proceso paso a paso y las preguntas
 * frecuentes. Eran justo los que más cuestan de escribir y los únicos que
 * había que pedirle a un programador.
 *
 * «Precio» y «Descripción completa» ya no se piden: no se pintan en ninguna
 * página. Si algún día el sitio los muestre, vuelven aquí con su `json`.
 */
require_once __DIR__ . '/../inc/crud.php';
require_once __DIR__ . '/../inc/recomendaciones.php';

crud('servicios', [
  'table'=>'services','single'=>'Servicio','plural'=>'Servicios','title_field'=>'title','sub_field'=>'category',
  'notas'=>[
    'Lo esencial'    => 'Encabezado de la ficha y de la tarjeta',
    'La página'      => 'El cuerpo de /servicios/…',
    'El proceso'     => 'El recorrido que se arma al bajar por la página',
    'Preguntas'      => 'Salen en la página y también las leen las IA',
    'Arma tu ruta'   => 'Qué recomienda esta ficha según si el negocio empieza de cero o ya funciona',
    'Buscadores'     => 'Solo para Google y las IA',
  ],
  'fields'=>[
    'title'      => ['label'=>'Nombre del servicio','type'=>'texto','json'=>'title','grupo'=>'Lo esencial'],
    'slug'       => ['label'=>'Slug (URL)','type'=>'texto','json'=>'slug','grupo'=>'Lo esencial','help'=>'Se genera del nombre si lo dejas vacío.'],
    'category'   => ['label'=>'Categoría','type'=>'texto','json'=>'category','grupo'=>'Lo esencial',
                     'help'=>'Agrupa el servicio en el menú y en /servicios. «Cobertura» y «Sectores» quedan fuera del menú a propósito.'],
    'icon'       => ['label'=>'Icono del menú','type'=>'texto','json'=>'icon','col'=>false,'grupo'=>'Lo esencial',
                     'help'=>'Search · Code · Bot · Palette · Sparkles · Mail · TrendingUp · Target · QrCode · Nfc · MapPin · ScanSearch · LayoutDashboard · Linkedin · Megaphone · Route · Signpost'],
    'order'      => ['label'=>'Orden','type'=>'numero','json'=>'order','col'=>false,'grupo'=>'Lo esencial','help'=>'Menor número, más arriba.'],
    'status'     => ['label'=>'Estado','type'=>'select','grupo'=>'Lo esencial','opts'=>['draft'=>'Borrador','published'=>'Publicado']],

    'short_desc' => ['label'=>'Descripción corta','type'=>'area','json'=>'shortDescription','grupo'=>'La página',
                     'help'=>'Una frase. Es lo que se lee en la tarjeta y en el menú.'],
    'full_desc'  => ['label'=>'Definición','type'=>'area','json'=>'definicion','grupo'=>'La página',
                     'help'=>'Abre la página respondiendo «qué es esto». Es de lo primero que citan las IA, así que conviene que empiece nombrando el servicio.'],
    'texto_largo'=> ['label'=>'Texto largo','type'=>'area','json'=>'fullDescription','col'=>false,'grupo'=>'La página','wide'=>true,
                     'help'=>'Varios párrafos separados por un renglón en blanco. Es el cuerpo de la página: explica el servicio de verdad, y es de donde salen las frases que una IA cita. Sin él la página se queda en unas 250 palabras, y Google suele no molestarse en indexarla.'],
    'image'      => ['label'=>'Imagen del encabezado','type'=>'imagen','json'=>'bannerImage','grupo'=>'La página'],
    'features'   => ['label'=>'Qué incluye','type'=>'lista','json'=>'features','grupo'=>'La página'],
    'benefits'   => ['label'=>'Beneficios','type'=>'lista','json'=>'benefits','grupo'=>'La página'],
    'ideal'      => ['label'=>'Para quién es','type'=>'lista','json'=>'ideal','col'=>false,'grupo'=>'La página'],

    'process'    => ['label'=>'Pasos','type'=>'pares','json'=>'process','col'=>false,'grupo'=>'El proceso',
                     'claves'=>['step'=>'#','title'=>'Título del paso','description'=>'Descripción'],'auto'=>'step'],

    'faq'        => ['label'=>'Preguntas frecuentes','type'=>'pares','json'=>'faq','col'=>false,'grupo'=>'Preguntas',
                     'claves'=>['question'=>'Pregunta','answer'=>'Respuesta']],

    /* «Arma tu ruta» (23-sep), en el lugar de «Servicios relacionados», que
       el sitio nunca mostró (lo viejo se queda en el data_json, sin efecto).
       Cada renglón: a dónde lleva, su papel, para quién y por qué. Mientras
       el servicio no guarde las suyas, el formulario enseña las que el sitio
       ya muestra (panel/inc/recomendaciones.php). */
    'recomendaciones' => ['label'=>'Recomendaciones','type'=>'pares','json'=>'recomendaciones','col'=>false,'grupo'=>'Arma tu ruta',
                     'claves'=>['a'=>'Servicio que recomienda','tipo'=>'Papel','etapa'=>'Para quién','razon'=>'Por qué, en una línea'],
                     'opciones'=>['a'=>recomendaciones_destinos(),'tipo'=>RECOMENDACIONES_TIPOS,'etapa'=>RECOMENDACIONES_ETAPAS],
                     'anchos'=>['a'=>2.2,'tipo'=>1.5,'etapa'=>1.4,'razon'=>3],
                     'largos'=>['razon'],
                     'requeridas'=>['a','razon'],
                     'respaldo'=>fn($row, $json) => recomendaciones_de_codigo((string)(($json['slug'] ?? '') ?: ($row['slug'] ?? ''))),
                     'help'=>'Hasta tres para cada etapa: si hay más, la ficha muestra las primeras tres en este orden. «Las dos» sale tanto a quien empieza de cero como a quien ya tiene un negocio. Un renglón sin «Por qué» no se guarda. Si quitas todas, la ficha no muestra la sección. En inglés sale la traducción de las que ya existían; una razón nueva se ve en español hasta que se traduzca.'],


    'keywords'   => ['label'=>'Palabras clave','type'=>'lista','json'=>'seo.keywords','sep'=>'comas','grupo'=>'Buscadores'],
    'meta_title' => ['label'=>'Título para buscadores','type'=>'texto','json'=>'seo.metaTitle','grupo'=>'Buscadores','help'=>'Vacío es la mejor opción salvo que tengas un motivo: se arma solo como «Servicio en Aguascalientes | INÉDITO DIGITAL», y si no cabe en los 60 caracteres que Google muestra, se cae la marca antes que la ciudad. Si lo escribes, no pases de 60 y nombra la ciudad.'],
    'meta_desc'  => ['label'=>'Descripción para buscadores','type'=>'texto','json'=>'seo.metaDescription','grupo'=>'Buscadores','wide'=>true],
  ],
]);
