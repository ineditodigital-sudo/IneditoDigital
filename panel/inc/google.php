<?php
function g_all(): array { $o=[]; try{ foreach(db()->query("SELECT k,v FROM google_auth") as $r) $o[$r['k']]=$r['v']; }catch(Throwable $e){} return $o; }
function g_get(string $k, string $d=''): string { $a=g_all(); return $a[$k] ?? $d; }
function g_save(array $d): void { $st=db()->prepare("INSERT INTO google_auth (k,v) VALUES (:k,:v) ON DUPLICATE KEY UPDATE v=VALUES(v)"); foreach($d as $k=>$v) $st->execute([':k'=>$k,':v'=>(string)$v]); }
function g_del(string $k): void { db()->prepare("DELETE FROM google_auth WHERE k=:k")->execute([':k'=>$k]); }
function g_redirect_uri(): string { return 'https://www.inedito.digital/panel/google_callback.php'; }
function g_http(string $url, $post=null, array $headers=[]): array {
  $ch=curl_init($url);
  curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>25,CURLOPT_HTTPHEADER=>$headers]);
  if($post!==null){ curl_setopt($ch,CURLOPT_POST,true); curl_setopt($ch,CURLOPT_POSTFIELDS, is_array($post)?http_build_query($post):$post); }
  $res=curl_exec($ch); $code=curl_getinfo($ch,CURLINFO_HTTP_CODE); curl_close($ch);
  return ['code'=>$code,'json'=>json_decode((string)$res,true)];
}
function g_access_token(): ?string {
  $a=g_all();
  if(empty($a['refresh_token'])||empty($a['client_id'])||empty($a['client_secret'])) return null;
  $r=g_http('https://oauth2.googleapis.com/token',['grant_type'=>'refresh_token','refresh_token'=>$a['refresh_token'],'client_id'=>$a['client_id'],'client_secret'=>$a['client_secret']]);
  return $r['json']['access_token'] ?? null;
}

/** Lista las propiedades GA4 accesibles (para auto-detectar el ID). */
function g_ga4_properties(string $token): array {
    $r = g_http('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200', null, ['Authorization: Bearer '.$token]);
    $out = [];
    foreach (($r['json']['accountSummaries'] ?? []) as $acc) {
        foreach (($acc['propertySummaries'] ?? []) as $p) {
            $out[] = ['id'=>$p['property'] ?? '', 'name'=>($p['displayName'] ?? '').' — '.($acc['displayName'] ?? '')];
        }
    }
    return $out;
}
/** Ejecuta varios reportes de GA4 en una sola llamada. */
function g_ga4_batch(string $token, string $property, array $requests): array {
    $r = g_http('https://analyticsdata.googleapis.com/v1beta/'.$property.':batchRunReports',
        json_encode(['requests'=>$requests]), ['Authorization: Bearer '.$token, 'Content-Type: application/json']);
    return $r['json'] ?? [];
}
