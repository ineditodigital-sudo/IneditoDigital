<?php require __DIR__ . '/../inc/settings.php';
if (($_SERVER['REQUEST_METHOD'] ?? '')==='POST') {
    csrf_check();
    if (($_POST['action'] ?? '')==='biz') {
        $keys=['businessName','whatsappNumber','businessPhone','businessEmail','businessAddress','businessCity','businessState','businessZip','businessHours','mapsUrl'];
        $d=[]; foreach($keys as $k) $d[$k]=trim($_POST[$k]??''); settings_save('site_settings',$d);
        set_flash('Ajustes del negocio guardados.'); redirect('/panel/?p=ajustes');
    }
    if (($_POST['action'] ?? '')==='password') {
        $np=(string)($_POST['new_password']??''); $cf=(string)($_POST['confirm']??'');
        if (strlen($np)<8) set_flash('La contraseña debe tener al menos 8 caracteres.');
        elseif ($np!==$cf) set_flash('Las contraseñas no coinciden.');
        else { db()->prepare('UPDATE admins SET password_hash=:h WHERE id=:id')->execute([':h'=>password_hash($np,PASSWORD_DEFAULT),':id'=>(int)$_SESSION['admin_id']]); set_flash('Contraseña actualizada.'); }
        redirect('/panel/?p=ajustes');
    }
}
$v = settings_all('site_settings'); $ct=csrf();
?>
<h1 class="title">Ajustes</h1><p class="subt">Datos del negocio y cuenta</p>
<form method="post" class="card">
  <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="biz">
  <h3 style="margin:0 0 6px">Información del negocio</h3>
  <div class="rowf">
    <?php field('businessName','Nombre del negocio',$v); field('whatsappNumber','WhatsApp (con lada, ej. 5214491234567)',$v);
    field('businessPhone','Teléfono',$v); field('businessEmail','Email',$v);
    field('businessAddress','Dirección',$v); field('businessCity','Ciudad',$v);
    field('businessState','Estado',$v); field('businessZip','Código Postal',$v); ?>
  </div>
  <div class="rowf" style="grid-template-columns:1fr"><?php field('businessHours','Horario',$v); ?></div>
  <div class="rowf" style="grid-template-columns:1fr"><?php field('mapsUrl','Enlace de Google Maps (dirección)',$v,'text','Pega el enlace de “Compartir” de tu ubicación en Google Maps (ej. https://maps.app.goo.gl/...).'); ?></div>
  <div style="margin-top:20px"><button class="btn" type="submit">Guardar cambios</button></div>
</form>

<form method="post" class="card">
  <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="password">
  <h3 style="margin:0 0 6px">Cambiar mi contraseña</h3>
  <div class="rowf">
    <div><label>Nueva contraseña</label><input type="password" name="new_password"></div>
    <div><label>Confirmar contraseña</label><input type="password" name="confirm"></div>
  </div>
  <div style="margin-top:20px"><button class="btn" type="submit">Actualizar contraseña</button></div>
</form>
