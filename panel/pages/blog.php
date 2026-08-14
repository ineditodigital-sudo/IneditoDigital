<?php require __DIR__ . '/../inc/crud.php';
crud('blog', [
  'table'=>'blog_posts','single'=>'Post','plural'=>'Blog','title_field'=>'title','sub_field'=>'category',
  'note'=>'Administrar aquí guarda en la base de datos (MySQL). Reflejar este contenido en el sitio público es una fase posterior.',
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
