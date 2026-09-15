<?php require __DIR__ . '/../inc/settings.php';
if (($_SERVER['REQUEST_METHOD'] ?? '')==='POST') {
    csrf_check();
    $keys=['siteName','defaultImage','author','twitterHandle','googleAnalytics','facebookPixel','googleSiteVerification','bingVerification',
           'orgName','orgType','phone','email','priceRange','address','city','state','zip','latitude','longitude','facebook','instagram','linkedin'];
    /* Solo se guarda lo que el formulario mandó.
       Antes era `$_POST[$k] ?? ''`, y esa línea borraba en silencio cualquier
       clave que no viniera en el envío: basta con que un campo se quite de la
       pantalla, se renombre o llegue deshabilitado para que su valor se vaya a
       vacío en el siguiente guardado, sin que nadie lo tocara. Con 22 claves
       ahí dentro —entre ellas la etiqueta de Analytics y las verificaciones de
       dominio— eso es una forma silenciosa de quedarse sin medición.
       Vaciar un campo a propósito sigue funcionando: un input vacío SÍ viaja
       en el POST, como cadena vacía. */
    $d=[]; foreach($keys as $k) if (array_key_exists($k, $_POST)) $d[$k]=trim((string)$_POST[$k]);
    settings_save('seo_settings',$d);
    set_flash('Configuración SEO guardada.'); redirect('/panel/?p=seo');
}
$v = settings_all('seo_settings'); $ct=csrf();
?>
<div class="kicker">Posicionamiento</div><h1 class="title">SEO</h1><p class="subt">Configuración de posicionamiento y datos estructurados</p>
<?php /*
  El aviso decía que estos campos «todavía no se aplican al sitio». Dejó de
  ser cierto hace tiempo: render.php lee las 22 claves de esta pantalla en
  cada visita. El aviso viejo es, con toda probabilidad, la razón de que el
  campo de Analytics llevara vacío desde siempre —decía que llenarlo no
  servía de nada—.
*/ ?>
<div class="card" style="border-color:#12331f;background:#07160d"><div class="mini" style="color:#7fe0a8">Esto ya está en vivo. Lo que guardes aquí sale en el sitio en la siguiente visita, sin desplegar nada: las etiquetas de Analytics y del píxel, las verificaciones de dominio, y los datos de la empresa que leen Google y las IA. Si borras un campo, deja de salir.</div></div>
<form method="post" class="card">
  <input type="hidden" name="csrf" value="<?= $ct ?>">
  <div class="form-sec"><b>General</b><span>Identidad básica del sitio</span></div>
  <div class="rowf"><?php field('siteName','Nombre del sitio',$v); field('author','Autor por defecto',$v);
    field('defaultImage','Imagen por defecto (OG)',$v); field('twitterHandle','Twitter Handle',$v); ?></div>
  <div class="form-sec"><b>Analítica y seguimiento</b><span>IDs de medición y verificación</span></div>
  <?php /* Si la etiqueta se cae, el sitio deja de medir y nadie se entera:
           no hay pantalla en blanco ni error, simplemente dejan de llegar
           datos. Por eso el aviso está aquí, junto al campo. */ ?>
  <?php if (trim((string)($v['googleAnalytics'] ?? '')) === ''): ?>
    <div class="card" style="margin:0 0 12px;border-color:#3d1616;background:#190808"><div class="mini" style="color:#ff9b9b"><b>El sitio no está midiendo con Google Analytics.</b> Sin un ID aquí, la etiqueta no sale en ninguna página. Si esto no fue a propósito, pega el ID de la propiedad (empieza con <code>G-</code>).</div></div>
  <?php endif; ?>
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
