<?php
/**
 * Los casos del portafolio.
 *
 * Cada campo declara con `json` la clave que el sitio lee de verdad. Antes
 * faltaban aquí siete cosas que sí se ven en /portafolio —el sitio del
 * cliente, el logo, el año, los servicios aplicados, los logros, las
 * capturas— porque no tenían columna en la tabla y el formulario solo
 * mostraba columnas. Ahora viven en el data_json, que es de donde el sitio
 * las toma.
 *
 * Se quitaron a propósito «Descripción completa» y los tres del testimonial:
 * no se pintan en ninguna página, así que pedirlos era pedirle trabajo a
 * alguien para nada. Los testimonios con nombre, además, no van: la prueba
 * social del sitio es anónima para proteger a los clientes.
 */
require_once __DIR__ . '/../inc/crud.php';

crud('portafolio', [
  'table'=>'portfolio','single'=>'Caso','plural'=>'Portafolio','title_field'=>'title','sub_field'=>'client',
  'notas'=>[
    'Lo esencial'  => 'Encabezado de la ficha y de la tarjeta',
    'El caso'      => 'El cuerpo de /portafolio/…',
    'La tarjeta'   => 'Lo que se ve en la rejilla de /portafolio',
    'Buscadores'   => 'Solo para Google y las IA; no se ve en la página',
  ],
  'fields'=>[
    'title'      => ['label'=>'Título del caso','type'=>'texto','json'=>'title','grupo'=>'Lo esencial'],
    'slug'       => ['label'=>'Slug (URL)','type'=>'texto','json'=>'slug','grupo'=>'Lo esencial','help'=>'Se genera del título si lo dejas vacío.'],
    'client'     => ['label'=>'Cliente','type'=>'texto','json'=>'client','grupo'=>'Lo esencial'],
    'category'   => ['label'=>'Categoría','type'=>'texto','json'=>'category','grupo'=>'Lo esencial','help'=>'Ecommerce, Sitio web, Marca…'],
    'year'       => ['label'=>'Año','type'=>'texto','json'=>'year','col'=>false,'grupo'=>'Lo esencial','help'=>'Se muestra junto al nombre del cliente.'],
    'websiteUrl' => ['label'=>'Sitio web del cliente','type'=>'texto','json'=>'websiteUrl','col'=>false,'grupo'=>'Lo esencial','help'=>'El botón «Ver sitio» de la tarjeta. Con https:// al inicio.'],
    'status'     => ['label'=>'Estado','type'=>'select','grupo'=>'Lo esencial','opts'=>['draft'=>'Borrador','published'=>'Publicado']],

    'short_desc' => ['label'=>'Descripción corta','type'=>'area','json'=>'description','grupo'=>'El caso','help'=>'Un párrafo. Es lo que se lee en la tarjeta y bajo el título.'],
    'challenge'  => ['label'=>'El reto','type'=>'area','json'=>'challenge','grupo'=>'El caso','help'=>'Qué problema tenía el cliente cuando llegó.'],
    'solution'   => ['label'=>'La solución','type'=>'area','json'=>'solution','grupo'=>'El caso','help'=>'Qué se hizo.'],
    'results'    => ['label'=>'Resultados','type'=>'pares','json'=>'results','grupo'=>'El caso',
                     'claves'=>['metric'=>'Qué se midió','value'=>'Cuánto']],
    'services'   => ['label'=>'Servicios aplicados','type'=>'lista','json'=>'services','col'=>false,'grupo'=>'El caso',
                     'help'=>'Aparecen como etiquetas en la ficha.'],

    'image'      => ['label'=>'Imagen principal','type'=>'imagen','json'=>'image','grupo'=>'La tarjeta'],
    'logo'       => ['label'=>'Logo del cliente','type'=>'imagen','json'=>'logo','col'=>false,'grupo'=>'La tarjeta',
                     'help'=>'Para el carrusel de la portada, súbelo en Clientes.'],
    'highlights' => ['label'=>'Logros de la tarjeta','type'=>'lista','json'=>'highlights','col'=>false,'grupo'=>'La tarjeta',
                     'help'=>'Se muestran los tres primeros.'],
    'gallery'    => ['label'=>'Capturas del proyecto','type'=>'lista','json'=>'screenshots','grupo'=>'La tarjeta',
                     'help'=>'Una URL por línea. Se pasan solas en la tarjeta.'],

    'keywords'   => ['label'=>'Etiquetas','type'=>'lista','json'=>'tags','sep'=>'comas','grupo'=>'Buscadores'],
    'meta_title' => ['label'=>'Título para buscadores','type'=>'texto','grupo'=>'Buscadores','help'=>'Si lo dejas vacío se usa el título del caso.'],
    'meta_desc'  => ['label'=>'Descripción para buscadores','type'=>'texto','grupo'=>'Buscadores','wide'=>true],
  ],
]);
