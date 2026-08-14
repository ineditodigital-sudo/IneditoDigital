<?php require __DIR__ . '/../inc/crud.php';
crud('servicios', [
  'table'=>'services','single'=>'Servicio','plural'=>'Servicios','title_field'=>'title','sub_field'=>'category',
  'note'=>'Administrar aquí guarda en la base de datos (MySQL). Reflejar este contenido en el sitio público es una fase posterior.',
  'fields'=>[
    'title'=>['label'=>'Título','type'=>'text'],
    'slug'=>['label'=>'Slug (URL)','type'=>'text','help'=>'Se genera del título si lo dejas vacío.'],
    'category'=>['label'=>'Categoría','type'=>'text'],
    'price'=>['label'=>'Precio','type'=>'text'],
    'image'=>['label'=>'URL de imagen','type'=>'text','wide'=>true],
    'short_desc'=>['label'=>'Descripción corta','type'=>'textarea','wide'=>true],
    'full_desc'=>['label'=>'Descripción completa','type'=>'textarea','wide'=>true],
    'features'=>['label'=>'Características (una por línea)','type'=>'textarea','wide'=>true],
    'benefits'=>['label'=>'Beneficios (una por línea)','type'=>'textarea','wide'=>true],
    'meta_title'=>['label'=>'Meta Title (SEO)','type'=>'text'],
    'meta_desc'=>['label'=>'Meta Description (SEO)','type'=>'text'],
    'keywords'=>['label'=>'Keywords','type'=>'text','wide'=>true],
    'status'=>['label'=>'Estado','type'=>'select','opts'=>['draft'=>'Borrador','published'=>'Publicado']],
  ],
]);
