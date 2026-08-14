<?php require __DIR__.'/bootstrap.php'; require_login(); require __DIR__.'/inc/google.php';
$a=g_all();
if(empty($a['client_id'])){ set_flash('Primero guarda el Client ID y Client Secret.'); redirect('/panel/?p=analiticas'); }
$scope='https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/analytics.readonly';
$url='https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query([
  'client_id'=>$a['client_id'],'redirect_uri'=>g_redirect_uri(),'response_type'=>'code',
  'scope'=>$scope,'access_type'=>'offline','prompt'=>'consent','include_granted_scopes'=>'true','state'=>csrf()]);
redirect($url);
