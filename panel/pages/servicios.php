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

crud('servicios', [
  'table'=>'services','single'=>'Servicio','plural'=>'Servicios','title_field'=>'title','sub_field'=>'category',
  'notas'=>[
    'Lo esencial'    => 'Encabezado de la ficha y de la tarjeta',
    'La página'      => 'El cuerpo de /servicios/…',
    'El proceso'     => 'El recorrido que se arma al bajar por la página',
    'Preguntas'      => 'Salen en la página y también las leen las IA',
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

    /* «Servicios relacionados» salió el 23-sep: el sitio nunca lo mostró, y
       lo que recomienda cada ficha ahora va por etapa en «Arma tu ruta»
       (src/app/data/recomendaciones.ts). Lo que ya estaba guardado se queda
       en el data_json, sin efecto: crud() parte del que ya existe. */

    'keywords'   => ['label'=>'Palabras clave','type'=>'lista','json'=>'seo.keywords','sep'=>'comas','grupo'=>'Buscadores'],
    'meta_title' => ['label'=>'Título para buscadores','type'=>'texto','json'=>'seo.metaTitle','grupo'=>'Buscadores','help'=>'Vacío es la mejor opción salvo que tengas un motivo: se arma solo como «Servicio en Aguascalientes | INÉDITO DIGITAL», y si no cabe en los 60 caracteres que Google muestra, se cae la marca antes que la ciudad. Si lo escribes, no pases de 60 y nombra la ciudad.'],
    'meta_desc'  => ['label'=>'Descripción para buscadores','type'=>'texto','json'=>'seo.metaDescription','grupo'=>'Buscadores','wide'=>true],
  ],
]);
