<?php require __DIR__ . '/../inc/settings.php';
if (($_SERVER['REQUEST_METHOD'] ?? '')==='POST') {
    csrf_check();
    $keys=['siteName','defaultImage','author','twitterHandle','googleAnalytics','facebookPixel','googleSiteVerification','bingVerification',
           'orgName','orgType','phone','email','priceRange','address','city','state','zip','latitude','longitude','facebook','instagram','linkedin'];
    $d=[]; foreach($keys as $k) $d[$k]=trim($_POST[$k]??''); settings_save('seo_settings',$d);
    set_flash('Configuración SEO guardada.'); redirect('/panel/?p=seo');
}
$v = settings_all('seo_settings'); $ct=csrf();
?>
<div class="kicker">Posicionamiento</div><h1 class="title">SEO</h1><p class="subt">Configuración de posicionamiento y datos estructurados</p>
<div class="card" style="border-color:#3a2f12;background:#191305"><div class="mini" style="color:#e0c07a">Se guarda en la base de datos. Aplicar estos valores al sitio público (meta, Analytics, sitemap) es la siguiente fase; los datos ya quedan listos para conectarse.</div></div>
<form method="post" class="card">
  <input type="hidden" name="csrf" value="<?= $ct ?>">
  <div class="form-sec"><b>General</b><span>Identidad básica del sitio</span></div>
  <div class="rowf"><?php field('siteName','Nombre del sitio',$v); field('author','Autor por defecto',$v);
    field('defaultImage','Imagen por defecto (OG)',$v); field('twitterHandle','Twitter Handle',$v); ?></div>
  <div class="form-sec"><b>Analítica y seguimiento</b><span>IDs de medición y verificación</span></div>
  <div class="rowf"><?php field('googleAnalytics','Google Analytics ID (G-XXXX)',$v); field('facebookPixel','Facebook Pixel ID',$v);
    field('googleSiteVerification','Google Site Verification',$v); field('bingVerification','Bing Verification',$v); ?></div>
  <div class="form-sec"><b>Negocio local (Schema)</b><span>Lo que Google y las IAs leen de la empresa</span></div>
  <div class="rowf"><?php field('orgName','Nombre de la organización',$v); field('orgType','Tipo (LocalBusiness, etc.)',$v);
    field('phone','Teléfono',$v); field('email','Email',$v); field('priceRange','Rango de precios ($$)',$v);
    field('address','Dirección',$v); field('city','Ciudad',$v); field('state','Estado',$v); field('zip','Código Postal',$v);
    field('latitude','Latitud',$v); field('longitude','Longitud',$v); ?></div>
  <div class="form-sec"><b>Redes sociales</b><span>Perfiles oficiales enlazados</span></div>
  <div class="rowf"><?php field('facebook','Facebook URL',$v); field('instagram','Instagram URL',$v); field('linkedin','LinkedIn URL',$v); ?></div>
  <div style="margin-top:22px"><button class="btn" type="submit">Guardar configuración</button></div>
</form>
