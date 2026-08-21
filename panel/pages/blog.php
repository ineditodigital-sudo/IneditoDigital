<?php require __DIR__ . '/../inc/crud.php';
crud('blog', [
  'table'=>'blog_posts','single'=>'Post','plural'=>'Blog','title_field'=>'title','sub_field'=>'category',
  'note'=>'Lo que publiques aquí sale en el sitio. Dos campos pesan más de lo que parece: la FECHA DE PUBLICACIÓN (sin ella, Google y las IAs no pueden juzgar si el artículo está vigente) y el AUTOR (si escribes el nombre tal como aparece en Equipo, el artículo se firma con esa persona y enlaza a su página, que vale mucho más que firmar como empresa).',
  'fields'=>[
    'title'=>['label'=>'Título','type'=>'text'],
    'slug'=>['label'=>'Slug (URL)','type'=>'text','help'=>'Se genera del título si lo dejas vacío.'],
    'category'=>['label'=>'Categoría','type'=>'text'],
    'author'=>['label'=>'Autor','type'=>'text'],
    'image'=>['label'=>'Imagen principal (URL)','type'=>'text'],
    'read_time'=>['label'=>'Tiempo de lectura','type'=>'text'],
    'publish_date'=>['label'=>'Fecha de publicación','type'=>'date'],
    'excerpt'=>['label'=>'Extracto / resumen','type'=>'textarea','wide'=>true],
    'content'=>['label'=>'Contenido completo','type'=>'textarea','wide'=>true],
    'meta_title'=>['label'=>'Meta Title (SEO)','type'=>'text'],
    'meta_desc'=>['label'=>'Meta Description (SEO)','type'=>'text'],
    'keywords'=>['label'=>'Keywords','type'=>'text','wide'=>true],
    'status'=>['label'=>'Estado','type'=>'select','opts'=>['draft'=>'Borrador','published'=>'Publicado']],
  ],
]);
