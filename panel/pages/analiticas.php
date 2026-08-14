<?php
require __DIR__ . '/../inc/google.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $act = $_POST['action'] ?? '';
    if ($act === 'gsave') {
        g_save(['client_id'=>trim($_POST['client_id']??''),'client_secret'=>trim($_POST['client_secret']??''),'sc_site'=>trim($_POST['sc_site']??''),'ga4_property'=>trim($_POST['ga4_property']??'')]);
        set_flash('Credenciales guardadas. Ahora pulsa “Conectar con Google”.'); redirect('/panel/?p=analiticas');
    }
    if ($act === 'ga4save') { g_save(['ga4_property'=>trim($_POST['ga4_property']??'')]); set_flash('Propiedad de GA4 guardada.'); redirect('/panel/?p=analiticas'); }
    if ($act === 'scsave') { g_save(['sc_site'=>trim($_POST['sc_site']??'')]); set_flash('Sitio de Search Console guardado.'); redirect('/panel/?p=analiticas'); }
    if ($act === 'gdisc') { g_del('refresh_token'); set_flash('Google desconectado.'); redirect('/panel/?p=analiticas'); }
}

function q(string $s, array $p=[]): array { try{ $st=db()->prepare($s); $st->execute($p); return $st->fetchAll(); }catch(Throwable $e){ return []; } }
function q1(string $s){ $r=q($s); return $r?array_values($r[0])[0]:0; }

$g = g_all();
$hasCreds = !empty($g['client_id']) && !empty($g['client_secret']);
$connected = !empty($g['refresh_token']);
$token = $connected ? g_access_token() : null;

// auto-detección de propiedad GA4
$ga4props = [];
if ($connected && $token && empty($g['ga4_property'])) {
    $ga4props = g_ga4_properties($token);
    if (count($ga4props) === 1) { g_save(['ga4_property'=>$ga4props[0]['id']]); $g['ga4_property']=$ga4props[0]['id']; $ga4props=[]; }
}

// ---- datos: por defecto analítica propia ----
$source = 'Analítica propia del sitio';
$D = "created_at >= (CURDATE() - INTERVAL 29 DAY)";
$visits30=(int)q1("SELECT COUNT(*) FROM pageviews WHERE $D"); $visitsToday=(int)q1("SELECT COUNT(*) FROM pageviews WHERE created_at>=CURDATE());");
$uniq30=(int)q1("SELECT COUNT(DISTINCT visitor) FROM pageviews WHERE $D"); $sess30=(int)q1("SELECT COUNT(DISTINCT session) FROM pageviews WHERE $D");
$pps=$sess30>0?round($visits30/$sess30,1):0; $bounce=null;
$byDay=[]; foreach(q("SELECT DATE(created_at) d, COUNT(*) c FROM pageviews WHERE $D GROUP BY DATE(created_at)") as $r) $byDay[$r['d']]=(int)$r['c'];
$labels=[];$series=[]; for($i=29;$i>=0;$i--){ $day=date('Y-m-d',strtotime("-$i day")); $labels[]=date('d/m',strtotime($day)); $series[]=$byDay[$day]??0; }
$top=array_map(fn($r)=>['path'=>$r['path'],'c'=>(int)$r['c']], q("SELECT path, COUNT(*) c FROM pageviews WHERE $D GROUP BY path ORDER BY c DESC LIMIT 10"));
$SRCL=['direct'=>'Directo','organic'=>'Búsqueda (SEO)','social'=>'Redes sociales','referral'=>'Referidos','internal'=>'Interno'];
$DEVL=['desktop'=>'Escritorio','mobile'=>'Móvil','tablet'=>'Tablet'];
$sc1=q("SELECT source, COUNT(*) c FROM pageviews WHERE $D GROUP BY source ORDER BY c DESC");
$srcLabels=array_map(fn($r)=>$SRCL[$r['source']]??$r['source'],$sc1); $srcData=array_map(fn($r)=>(int)$r['c'],$sc1);
$dv1=q("SELECT device, COUNT(*) c FROM pageviews WHERE $D GROUP BY device ORDER BY c DESC");
$devLabels=array_map(fn($r)=>$DEVL[$r['device']]??$r['device'],$dv1); $devData=array_map(fn($r)=>(int)$r['c'],$dv1);

// ---- override con GA4 real ----
if ($connected && $token && !empty($g['ga4_property'])) {
    $reqs=[
      ['dateRanges'=>[['startDate'=>'30daysAgo','endDate'=>'today']],'metrics'=>[['name'=>'activeUsers'],['name'=>'sessions'],['name'=>'screenPageViews'],['name'=>'bounceRate']]],
      ['dateRanges'=>[['startDate'=>'29daysAgo','endDate'=>'today']],'dimensions'=>[['name'=>'date']],'metrics'=>[['name'=>'activeUsers']],'orderBys'=>[['dimension'=>['dimensionName'=>'date']]]],
      ['dateRanges'=>[['startDate'=>'30daysAgo','endDate'=>'today']],'dimensions'=>[['name'=>'pagePath']],'metrics'=>[['name'=>'screenPageViews']],'orderBys'=>[['metric'=>['metricName'=>'screenPageViews'],'desc'=>true]],'limit'=>10],
      ['dateRanges'=>[['startDate'=>'30daysAgo','endDate'=>'today']],'dimensions'=>[['name'=>'sessionDefaultChannelGroup']],'metrics'=>[['name'=>'sessions']],'orderBys'=>[['metric'=>['metricName'=>'sessions'],'desc'=>true]]],
      ['dateRanges'=>[['startDate'=>'30daysAgo','endDate'=>'today']],'dimensions'=>[['name'=>'deviceCategory']],'metrics'=>[['name'=>'sessions']]],
    ];
    $res=g_ga4_batch($token,$g['ga4_property'],$reqs); $reps=$res['reports']??[];
    if (count($reps)>=5) {
        $source='Google Analytics (datos reales)';
        $mv=$reps[0]['rows'][0]['metricValues']??[];
        $uniq30=(int)round((float)($mv[0]['value']??0)); $sess30=(int)round((float)($mv[1]['value']??0));
        $visits30=(int)round((float)($mv[2]['value']??0)); $bounce=round((float)($mv[3]['value']??0)*100,1);
        $pps=$sess30>0?round($visits30/$sess30,1):0;
        $bd=[]; foreach(($reps[1]['rows']??[]) as $row) $bd[$row['dimensionValues'][0]['value']??'']=(int)round((float)($row['metricValues'][0]['value']??0));
        $labels=[];$series=[]; for($i=29;$i>=0;$i--){ $d=date('Ymd',strtotime("-$i day")); $labels[]=date('d/m',strtotime("-$i day")); $series[]=$bd[$d]??0; }
        $visitsToday=$series?end($series):0;
        $top=[]; foreach(($reps[2]['rows']??[]) as $row) $top[]=['path'=>$row['dimensionValues'][0]['value']??'','c'=>(int)round((float)($row['metricValues'][0]['value']??0))];
        $srcLabels=[];$srcData=[]; foreach(($reps[3]['rows']??[]) as $row){ $srcLabels[]=$row['dimensionValues'][0]['value']??''; $srcData[]=(int)round((float)($row['metricValues'][0]['value']??0)); }
        $devLabels=[];$devData=[]; foreach(($reps[4]['rows']??[]) as $row){ $dv=$row['dimensionValues'][0]['value']??''; $devLabels[]=$DEVL[$dv]??$dv; $devData[]=(int)round((float)($row['metricValues'][0]['value']??0)); }
    }
}
$maxTop=$top?max(array_map(fn($t)=>$t['c'],$top)):1;

// ---- Search Console ----
$scRows=[]; $scError='';
if ($connected && $token) {
    $site=$g['sc_site'] ?: 'sc-domain:inedito.digital';
    $body=json_encode(['startDate'=>date('Y-m-d',strtotime('-30 days')),'endDate'=>date('Y-m-d',strtotime('-2 days')),'dimensions'=>['query'],'rowLimit'=>20]);
    $r=g_http('https://www.googleapis.com/webmasters/v3/sites/'.rawurlencode($site).'/searchAnalytics/query',$body,['Authorization: Bearer '.$token,'Content-Type: application/json']);
    if(!empty($r['json']['rows'])) $scRows=$r['json']['rows']; elseif(!empty($r['json']['error'])) $scError=$r['json']['error']['message']??'Error';
}
$ct=csrf(); $ruri=g_redirect_uri();
?>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<div class="topbar"><div><h1 class="title">Analíticas</h1><p class="subt">Últimos 30 días · Fuente: <strong style="color:<?= $source[0]==='G'?'#5fe0a0':'#b58bff' ?>"><?= e($source) ?></strong></p></div>
<?php if(!$connected): ?><span class="badge b-draft" style="align-self:center">Google sin conectar</span><?php else: ?><span class="badge b-published" style="align-self:center">Google conectado</span><?php endif; ?></div>

<div class="grid-kpi">
  <div class="kpi"><div class="l"><?= $source[0]==='G'?'Vistas de página':'Visitas' ?> (30d)</div><div class="v"><?= number_format($visits30) ?></div></div>
  <div class="kpi"><div class="l"><?= $source[0]==='G'?'Usuarios':'Visitantes únicos' ?></div><div class="v" style="color:#8ea6ff"><?= number_format($uniq30) ?></div></div>
  <div class="kpi"><div class="l">Sesiones</div><div class="v"><?= number_format($sess30) ?></div></div>
  <div class="kpi"><div class="l">Páginas / sesión</div><div class="v"><?= $pps ?></div></div>
  <?php if($bounce!==null): ?><div class="kpi"><div class="l">Rebote</div><div class="v" style="color:#ffcf7a"><?= $bounce ?>%</div></div>
  <?php else: ?><div class="kpi"><div class="l">Hoy</div><div class="v" style="color:#5fe0a0"><?= number_format($visitsToday) ?></div></div><?php endif; ?>
</div>

<div class="card"><h3 style="margin:0 0 16px">Visitas por día</h3>
  <?php if(array_sum($series)==0): ?><p class="muted" style="padding:20px 0;text-align:center">Sin datos en el rango.</p><?php else: ?><div style="height:300px"><canvas id="chVisits"></canvas></div><?php endif; ?></div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <div class="card"><h3 style="margin:0 0 16px">Adquisición (de dónde llegan)</h3><?php if(!$srcData): ?><p class="muted">Sin datos.</p><?php else: ?><div style="height:260px"><canvas id="chSrc"></canvas></div><?php endif; ?></div>
  <div class="card"><h3 style="margin:0 0 16px">Dispositivos</h3><?php if(!$devData): ?><p class="muted">Sin datos.</p><?php else: ?><div style="height:260px"><canvas id="chDev"></canvas></div><?php endif; ?></div>
</div>

<div class="card"><h3 style="margin:0 0 16px">Páginas más visitadas</h3>
  <?php if(!$top): ?><p class="muted">Sin datos.</p><?php else: foreach($top as $t): $pct=round(100*$t['c']/$maxTop); ?>
    <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:5px"><span><?= e($t['path']) ?></span><span class="muted"><?= number_format($t['c']) ?></span></div>
    <div style="height:8px;background:#17171f;border-radius:6px;overflow:hidden"><div style="height:100%;width:<?= $pct ?>%;background:linear-gradient(90deg,#7700CE,#9933FF)"></div></div></div>
  <?php endforeach; endif; ?></div>

<!-- Search Console -->
<div class="card" style="border-color:#2a2140">
  <h3 style="margin:0 0 6px">Posicionamiento en Google (Search Console)</h3>
  <p class="muted" style="margin:0 0 16px">Palabras clave, posición promedio, clics e impresiones.</p>
  <?php if($connected && !$scError && $scRows): ?>
    <table><thead><tr><th>Palabra clave</th><th>Posición</th><th>Clics</th><th>Impresiones</th><th>CTR</th></tr></thead><tbody>
    <?php foreach($scRows as $row): $pos=round($row['position']??0,1); ?>
      <tr><td><?= e($row['keys'][0]??'') ?></td><td><span class="badge <?= $pos<=3?'b-converted':($pos<=10?'b-qualified':'b-new') ?>">#<?= $pos ?></span></td>
      <td><?= (int)($row['clicks']??0) ?></td><td><?= (int)($row['impressions']??0) ?></td><td class="muted"><?= round(100*($row['ctr']??0),1) ?>%</td></tr>
    <?php endforeach; ?></tbody></table>
  <?php elseif($connected && $scError): ?>
    <div class="mini" style="color:#ffcf7a;margin-bottom:12px">Search Console: “<?= e($scError) ?>”. Ajusta el “Sitio (propiedad)”:</div>
    <form method="post" style="display:flex;gap:10px"><input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="scsave">
      <input type="text" name="sc_site" value="<?= e($g['sc_site'] ?: 'sc-domain:inedito.digital') ?>"><button class="btn small" type="submit">Guardar</button></form>
  <?php elseif($connected): ?><p class="muted">Conectado. Aún sin datos de Search Console (puede tardar unos días si el sitio es nuevo).</p>
  <?php else: ?><p class="muted">Conecta Google abajo para ver tus palabras clave.</p><?php endif; ?>
</div>

<!-- Conexión Google -->
<div class="card">
  <h3 style="margin:0 0 6px">Conexión con Google</h3>
  <?php if($connected): ?>
    <p class="muted" style="margin:0 0 12px">Google conectado <?= $g['ga4_property']?('· propiedad GA4: <code>'.e($g['ga4_property']).'</code>'):'' ?>.</p>
    <?php if(empty($g['ga4_property']) && $ga4props): ?>
      <form method="post" style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="ga4save">
        <label style="margin:0">Elige tu propiedad de GA4:</label>
        <select name="ga4_property" style="width:auto"><?php foreach($ga4props as $p): ?><option value="<?= e($p['id']) ?>"><?= e($p['name']).' ('.e($p['id']).')' ?></option><?php endforeach; ?></select>
        <button class="btn small" type="submit">Usar esta</button></form>
    <?php endif; ?>
    <form method="post" style="display:inline"><input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="gdisc"><button class="btn ghost small" type="submit">Desconectar Google</button></form>
  <?php elseif($hasCreds): ?>
    <p class="muted">Credenciales guardadas. Autoriza el acceso:</p><a class="btn" href="/panel/google_connect.php">Conectar con Google</a>
  <?php else: ?>
    <div class="mini" style="margin-bottom:14px">Pega la credencial de Google (sigue la guía). Al crearla, usa esta <strong>URI de redirección autorizada</strong>:</div>
    <div style="background:#0b0b12;border:1px solid var(--line);border-radius:8px;padding:12px 14px;font-family:monospace;font-size:13px;color:#b58bff;margin-bottom:16px;word-break:break-all"><?= e($ruri) ?></div>
    <form method="post"><input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="gsave">
      <div class="rowf">
        <div><label>Client ID</label><input type="text" name="client_id" placeholder="xxxx.apps.googleusercontent.com"></div>
        <div><label>Client Secret</label><input type="text" name="client_secret" placeholder="GOCSPX-..."></div>
        <div><label>Sitio en Search Console</label><input type="text" name="sc_site" value="sc-domain:inedito.digital"></div>
        <div><label>ID de propiedad GA4 (opcional, se autodetecta)</label><input type="text" name="ga4_property" placeholder="properties/123456789"></div>
      </div>
      <div style="margin-top:18px"><button class="btn" type="submit">Guardar credenciales</button></div>
    </form>
  <?php endif; ?>
</div>

<script>
(function(){ if(typeof Chart==='undefined')return; Chart.defaults.color='#8a8aa0';Chart.defaults.font.family='Arial,Helvetica,sans-serif';var grid='rgba(255,255,255,.06)';
  var v=document.getElementById('chVisits'); if(v){var ctx=v.getContext('2d');var g=ctx.createLinearGradient(0,0,0,300);g.addColorStop(0,'rgba(119,0,206,.45)');g.addColorStop(1,'rgba(119,0,206,0)');
    new Chart(ctx,{type:'line',data:{labels:<?= json_encode($labels) ?>,datasets:[{data:<?= json_encode($series) ?>,borderColor:'#9933FF',backgroundColor:g,fill:true,tension:.35,pointRadius:0,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:grid},ticks:{precision:0}}}}});}
  var donut={type:'doughnut',options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom',labels:{padding:14,usePointStyle:true}}}}};var COL=['#7700CE','#9933FF','#5fe0a0','#8ea6ff','#ffcf7a','#ff8fa6','#59c1ff'];
  var s=document.getElementById('chSrc'); if(s) new Chart(s,Object.assign({},donut,{data:{labels:<?= json_encode($srcLabels) ?>,datasets:[{data:<?= json_encode($srcData) ?>,backgroundColor:COL,borderColor:'#0e0e15',borderWidth:2}]}}));
  var d=document.getElementById('chDev'); if(d) new Chart(d,Object.assign({},donut,{data:{labels:<?= json_encode($devLabels) ?>,datasets:[{data:<?= json_encode($devData) ?>,backgroundColor:COL,borderColor:'#0e0e15',borderWidth:2}]}}));
})();
</script>
