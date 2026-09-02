<?php
/**
 * El blog.
 *
 * Dos arreglos silenciosos aquí: la fecha y el tiempo de lectura se
 * guardaban en columnas que el sitio no leía —el artículo seguía mostrando
 * la fecha vieja aunque el panel dijera «guardado»— y las etiquetas, que sí
 * se pintan al pie de cada artículo, no tenían formulario.
 */
require_once __DIR__ . '/../inc/crud.php';

crud('blog', [
  'table'=>'blog_posts','single'=>'Post','plural'=>'Blog','title_field'=>'title','sub_field'=>'category',
  'note'=>'Dos campos pesan más de lo que parece: la FECHA DE PUBLICACIÓN (sin ella, Google y las IA no pueden juzgar si el artículo está vigente) y el AUTOR (si escribes el nombre tal como aparece en Equipo, el artículo se firma con esa persona y enlaza a su página, que vale mucho más que firmar como empresa).',
  'notas'=>[
    'Lo esencial' => 'Encabezado del artículo y de la tarjeta',
    'El artículo' => 'El cuerpo de /blog/…',
    'Buscadores'  => 'Solo para Google y las IA',
  ],
  'fields'=>[
    'title'        => ['label'=>'Título','type'=>'texto','json'=>'title','grupo'=>'Lo esencial'],
    'slug'         => ['label'=>'Slug (URL)','type'=>'texto','json'=>'slug','grupo'=>'Lo esencial','help'=>'Se genera del título si lo dejas vacío.'],
    'category'     => ['label'=>'Categoría','type'=>'texto','json'=>'category','grupo'=>'Lo esencial'],
    'author'       => ['label'=>'Autor','type'=>'texto','json'=>'author','grupo'=>'Lo esencial','help'=>'Escríbelo igual que en Equipo para que el artículo enlace a esa persona.'],
    'publish_date' => ['label'=>'Fecha de publicación','type'=>'fecha','json'=>'date','grupo'=>'Lo esencial'],
    'read_time'    => ['label'=>'Tiempo de lectura','type'=>'texto','json'=>'readTime','grupo'=>'Lo esencial','help'=>'Por ejemplo: 8 min'],
    'status'       => ['label'=>'Estado','type'=>'select','grupo'=>'Lo esencial','opts'=>['draft'=>'Borrador','published'=>'Publicado']],

    'image'        => ['label'=>'Imagen principal','type'=>'imagen','json'=>'image','grupo'=>'El artículo'],
    'excerpt'      => ['label'=>'Extracto','type'=>'area','json'=>'excerpt','grupo'=>'El artículo','help'=>'Un párrafo. Se lee en /blog y es lo que Google muestra si no pones descripción.'],
    'content'      => ['label'=>'Contenido','type'=>'area','json'=>'content','grupo'=>'El artículo',
                       'help'=>'Markdown: ## para subtítulos, **negritas**, - para listas.'],

    'keywords'     => ['label'=>'Etiquetas','type'=>'lista','json'=>['tags','seo.keywords'],'sep'=>'comas','grupo'=>'Buscadores',
                       'help'=>'Se pintan al pie del artículo y se usan como keywords.'],
    'meta_title'   => ['label'=>'Título para buscadores','type'=>'texto','json'=>'seo.metaTitle','grupo'=>'Buscadores','help'=>'Si lo dejas vacío se usa el título del artículo.'],
    'meta_desc'    => ['label'=>'Descripción para buscadores','type'=>'texto','json'=>'seo.metaDescription','grupo'=>'Buscadores','wide'=>true],
  ],
]);
