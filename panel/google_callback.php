<?php require __DIR__.'/bootstrap.php'; require_login(); require __DIR__.'/inc/google.php';
$volver = '/panel/?p=' . (($_SESSION['g_volver'] ?? '') === 'resenas' ? 'resenas' : 'analiticas');
unset($_SESSION['g_volver']);
if(!empty($_GET['error'])){ set_flash('Google devolvió: '.$_GET['error']); redirect($volver); }
/* El state es el token CSRF de esta sesión: sin él, un enlace ajeno podría
   colgarle al panel la cuenta de Google de otra persona. */
if(!hash_equals(csrf(), (string)($_GET['state'] ?? ''))){ set_flash('La respuesta de Google no corresponde a esta sesión. Vuelve a conectar.'); redirect($volver); }
$code=$_GET['code']??''; if($code===''){ set_flash('No se recibió el código de Google.'); redirect($volver); }
$a=g_all();
$r=g_http('https://oauth2.googleapis.com/token',['grant_type'=>'authorization_code','code'=>$code,'client_id'=>$a['client_id'],'client_secret'=>$a['client_secret'],'redirect_uri'=>g_redirect_uri()]);
if(!empty($r['json']['refresh_token'])){
  g_save(['refresh_token'=>$r['json']['refresh_token']]);
  /* Con permisos nuevos, el error de la última sincronización ya no aplica. */
  g_save(['resenas_error'=>'']);
  set_flash('¡Google conectado correctamente!');
}
else { set_flash('No se pudo conectar: '.($r['json']['error_description'] ?? ($r['json']['error'] ?? 'error desconocido'))); }
redirect($volver);
