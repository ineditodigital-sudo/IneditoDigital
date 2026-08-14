<?php require __DIR__.'/bootstrap.php'; require_login(); require __DIR__.'/inc/google.php';
if(!empty($_GET['error'])){ set_flash('Google devolvió: '.$_GET['error']); redirect('/panel/?p=analiticas'); }
$code=$_GET['code']??''; if($code===''){ set_flash('No se recibió el código de Google.'); redirect('/panel/?p=analiticas'); }
$a=g_all();
$r=g_http('https://oauth2.googleapis.com/token',['grant_type'=>'authorization_code','code'=>$code,'client_id'=>$a['client_id'],'client_secret'=>$a['client_secret'],'redirect_uri'=>g_redirect_uri()]);
if(!empty($r['json']['refresh_token'])){ g_save(['refresh_token'=>$r['json']['refresh_token']]); set_flash('¡Google conectado correctamente!'); }
else { set_flash('No se pudo conectar: '.($r['json']['error_description'] ?? ($r['json']['error'] ?? 'error desconocido'))); }
redirect('/panel/?p=analiticas');
