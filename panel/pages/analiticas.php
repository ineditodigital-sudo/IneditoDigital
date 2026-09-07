<?php
require __DIR__ . '/../inc/google.php';
require_once __DIR__ . '/../inc/gsc.php';   // gsc_es_indexada, para el medidor

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
$SRCL=['direct'=>'Directo','organic'=>'Búsqueda (SEO)','ia'=>'Desde IAs (GEO)','social'=>'Redes sociales','referral'=>'Referidos','internal'=>'Interno'];
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

// ---- Cómo te ve Google: las fotos que guarda la sincronización ----
// Nada de llamadas a la API al abrir la pantalla: se lee lo guardado y la
// página carga al instante. El botón de sincronizar trabaja por lotes vía
// gsc_paso.php, así que ya no choca con el corte de 100 s de Cloudflare.
function gsc_tabla_existe(string $t): bool { try { db()->query("SELECT 1 FROM $t LIMIT 1"); return true; } catch (Throwable $e) { return false; } }
function gsc_delta($a, $b, bool $inv = false): string {
    if ($b === null) return '<span class="igual">primera medición</span>';
    $d = $a - $b;
    if (abs($d) < 0.01) return '<span class="igual">igual que la foto anterior</span>';
    $bueno = $inv ? $d < 0 : $d > 0;
    return '<span class="' . ($bueno ? 'sube' : 'baja') . '">' . ($d > 0 ? '+' : '') . round($d, 2) . ' vs. anterior</span>';
}
$gscHoy = $gscAyer = null; $gscSerie = []; $gscConsultas = []; $gscGrupos = [];
if (gsc_tabla_existe('gsc_totales')) {
    $gscHoy  = db()->query("SELECT * FROM gsc_totales ORDER BY fecha DESC LIMIT 1")->fetch() ?: null;
    $gscAyer = db()->query("SELECT * FROM gsc_totales ORDER BY fecha DESC LIMIT 1 OFFSET 1")->fetch() ?: null;
    $gscSerie = array_reverse(db()->query("SELECT fecha, indexadas, sin_indexar, impresiones, clics FROM gsc_totales ORDER BY fecha DESC LIMIT 30")->fetchAll());
    if ($gscHoy) {
        $st = db()->prepare("SELECT consulta, clics, impresiones, posicion FROM gsc_consultas WHERE fecha = :f ORDER BY impresiones DESC LIMIT 25");
        $st->execute([':f' => $gscHoy['fecha']]);
        $gscConsultas = $st->fetchAll();
        $st = db()->prepare("SELECT url, estado, ultimo_rastreo FROM gsc_indexacion WHERE fecha = :f ORDER BY estado, url");
        $st->execute([':f' => $gscHoy['fecha']]);
        foreach ($st->fetchAll() as $u) $gscGrupos[$u['estado']][] = $u;
    }
}
$gscBuenos = ['Enviada e indexada', 'Indexada'];

// ---- Posicionamiento en IA (GEO): dos medidores, ambos automáticos ----
// 1) visitas que llegan con referencia de una IA (hit.php las clasifica 'ia')
// 2) lecturas de bots de IA sobre el sitio (render.php las cuenta en ia_bots)
$IA_NOMBRES = [
    'gptbot' => 'OpenAI · GPTBot', 'oai-searchbot' => 'OpenAI · SearchBot', 'chatgpt-user' => 'ChatGPT · visita en vivo',
    'claudebot' => 'Anthropic · ClaudeBot', 'claude-user' => 'Claude · visita en vivo', 'claude-web' => 'Claude · web', 'anthropic-ai' => 'Anthropic',
    'perplexitybot' => 'Perplexity · índice', 'perplexity-user' => 'Perplexity · visita en vivo',
    'google-extended' => 'Google · Gemini', 'meta-externalagent' => 'Meta IA', 'bytespider' => 'ByteDance (TikTok)',
    'ccbot' => 'Common Crawl (alimenta varias IA)', 'amazonbot' => 'Amazon (Rufus/Alexa)', 'applebot-extended' => 'Apple IA',
    'duckassistbot' => 'DuckDuckGo IA', 'mistralai' => 'Mistral', 'cohere' => 'Cohere',
];
if (!gsc_tabla_existe('ia_bots')) {
    try {
        db()->exec("CREATE TABLE IF NOT EXISTS ia_bots (
          fecha DATE NOT NULL, bot VARCHAR(40) NOT NULL, url VARCHAR(255) NOT NULL,
          hits INT NOT NULL DEFAULT 1, PRIMARY KEY (fecha, bot, url)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    } catch (Throwable $e) {}
}
$iaVisDia = q("SELECT DATE(created_at) f, COUNT(*) c FROM pageviews WHERE $D AND source='ia' GROUP BY 1 ORDER BY 1");
$iaVis30 = array_sum(array_map(fn($r) => (int)$r['c'], $iaVisDia));
$iaLect30 = 0; $iaBotsDia = []; $iaBotsMotor = []; $iaUrlsLeidas = [];
if (gsc_tabla_existe('ia_bots')) {
    $iaBotsDia = q("SELECT fecha f, SUM(hits) c FROM ia_bots WHERE fecha >= (CURDATE() - INTERVAL 29 DAY) GROUP BY 1 ORDER BY 1");
    $iaBotsMotor = q("SELECT bot, SUM(hits) c FROM ia_bots WHERE fecha >= (CURDATE() - INTERVAL 29 DAY) GROUP BY 1 ORDER BY 2 DESC");
    $iaUrlsLeidas = q("SELECT url, SUM(hits) c, COUNT(DISTINCT bot) motores FROM ia_bots WHERE fecha >= (CURDATE() - INTERVAL 29 DAY) GROUP BY 1 ORDER BY 2 DESC LIMIT 12");
    $iaLect30 = array_sum(array_map(fn($r) => (int)$r['c'], $iaBotsMotor));
}
// ---- El embudo: visitantes → acciones → leads ----
// Las acciones las manda el sitio a api/evento.php (asistente, WhatsApp,
// teléfono); los leads son los del formulario, sin las pruebas.
if (!gsc_tabla_existe('events')) {
    try {
        db()->exec("CREATE TABLE IF NOT EXISTS events (
          id INT AUTO_INCREMENT PRIMARY KEY,
          evento VARCHAR(40) NOT NULL,
          detalle VARCHAR(160) NOT NULL DEFAULT '',
          path VARCHAR(255) NOT NULL DEFAULT '',
          visitor CHAR(32) NOT NULL DEFAULT '',
          session CHAR(32) NOT NULL DEFAULT '',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          KEY idx_ev (evento, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    } catch (Throwable $e) {}
}
$EVL = ['asistente' => 'Asistente abierto', 'whatsapp' => 'Clic a WhatsApp', 'llamada' => 'Toque al teléfono'];
$accPorTipo = q("SELECT evento, COUNT(*) c, COUNT(DISTINCT NULLIF(visitor,'')) u FROM events WHERE $D GROUP BY 1 ORDER BY 2 DESC");
$accTotal = array_sum(array_map(fn($r) => (int)$r['c'], $accPorTipo));
$accPersonas = (int)q1("SELECT COUNT(DISTINCT NULLIF(visitor,'')) FROM events WHERE $D");
$leads30 = (int)q1("SELECT COUNT(*) FROM leads WHERE $D AND source <> 'Prueba de integracion'");
$asistentePide = q("SELECT detalle, COUNT(*) c FROM events WHERE $D AND evento='asistente' AND detalle <> '' GROUP BY 1 ORDER BY 2 DESC LIMIT 8");
$ct=csrf(); $ruri=g_redirect_uri();
?>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<div class="topbar"><div><div class="kicker">Datos para decidir</div><h1 class="title">Analíticas</h1><p class="subt">Últimos 30 días · Fuente: <strong style="color:<?= $source[0]==='G'?'#5fe0a0':'#b58bff' ?>"><?= e($source) ?></strong></p></div>
<?php if(!$connected): ?><span class="badge b-draft" style="align-self:center">Google sin conectar</span><?php else: ?><span class="badge b-published" style="align-self:center">Google conectado</span><?php endif; ?></div>

<div class="grid-kpi">
  <div class="kpi hero"><div class="l"><?= $source[0]==='G'?'Vistas de página':'Visitas' ?> (30d)</div><div class="v"><?= number_format($visits30) ?></div></div>
  <div class="kpi hero"><div class="l"><?= $source[0]==='G'?'Usuarios':'Visitantes únicos' ?></div><div class="v" style="color:#8ea6ff"><?= number_format($uniq30) ?></div></div>
  <div class="kpi hero"><div class="l">Sesiones</div><div class="v"><?= number_format($sess30) ?></div></div>
  <div class="kpi hero"><div class="l">Páginas / sesión</div><div class="v"><?= $pps ?></div></div>
  <?php if($bounce!==null): ?><div class="kpi hero"><div class="l">Rebote</div><div class="v" style="color:#ffcf7a"><?= $bounce ?>%</div></div>
  <?php else: ?><div class="kpi hero"><div class="l">Hoy</div><div class="v" style="color:#5fe0a0"><?= number_format($visitsToday) ?></div></div><?php endif; ?>
</div>

<!-- El embudo: lo primero que hay que mirar para decidir -->
<div id="tablero">

<div class="card" data-mod="embudo" style="border-color:#2a2140">
  <h3 style="margin:0 0 4px">El embudo · visitar → actuar → dejar datos</h3>
  <p class="muted" style="margin:0 0 18px">Últimos 30 días. Las acciones (asistente, WhatsApp, teléfono) se miden desde el <strong>28 de agosto de 2026</strong>; antes de esa fecha solo existían las vistas.</p>

  <?php
    $base = max($uniq30, 1);
    /* Cada paso lleva su propia trama además de su color: tres barras seguidas
       distinguidas solo por tono se leen como una sola cosa degradada. */
    $filasEmbudo = [
      ['Visitantes', $uniq30, '#7700CE', '#9933FF', 'trama-rayas'],
      ['Hicieron algo (asistente, WhatsApp o teléfono)', $accPersonas, '#8ea6ff', '#59c1ff', 'trama-puntos'],
      ['Dejaron sus datos (lead)', $leads30, '#2f7d4f', '#5fe0a0', 'trama-red'],
    ];
  ?>
  <?php foreach ($filasEmbudo as [$rot, $n, $c1, $c2, $trama]): $pct = min(100, round(100 * $n / $base, 1)); ?>
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:5px">
        <span><?= e($rot) ?></span>
        <span><strong><?= number_format($n) ?></strong> <span class="mini">(<?= $pct ?>%)</span></span>
      </div>
      <div class="embudo-barra">
        <span class="<?= $trama ?>" style="width:100%;transform:scaleX(<?= round(max($pct, $n > 0 ? 2 : 0) / 100, 4) ?>);background-color:<?= $c2 ?>"></span>
      </div>
    </div>
  <?php endforeach; ?>

  <div class="grid-kpi" style="margin:18px 0 0">
    <?php foreach ($EVL as $ev => $rot):
      $fila = null; foreach ($accPorTipo as $r) if ($r['evento'] === $ev) { $fila = $r; break; } ?>
      <div class="kpi hero"><div class="l"><?= e($rot) ?> · 30d</div>
        <div class="v"><?= number_format((int)($fila['c'] ?? 0)) ?></div>
        <div class="mini" style="margin-top:5px"><?= (int)($fila['u'] ?? 0) ?> personas distintas</div></div>
    <?php endforeach; ?>
    <div class="kpi hero"><div class="l">Leads del formulario · 30d</div>
      <div class="v" style="color:#5fe0a0"><?= number_format($leads30) ?></div>
      <div class="mini" style="margin-top:5px">sin contar pruebas</div></div>
  </div>

  <?php if ($asistentePide): ?>
    <h4 style="margin:18px 0 8px;font-size:14px">Qué le piden al asistente</h4>
    <table><thead><tr><th>Petición</th><th>Veces</th></tr></thead><tbody>
      <?php foreach ($asistentePide as $r): ?>
        <tr><td><?= e($r['detalle']) ?></td><td><?= (int)$r['c'] ?></td></tr>
      <?php endforeach; ?>
    </tbody></table>
  <?php endif; ?>
</div>

<div class="card" data-mod="visitas"><h3 style="margin:0 0 16px">Visitas por día</h3>
  <?php if(array_sum($series)==0): ?><p class="muted" style="padding:20px 0;text-align:center">Sin datos en el rango.</p><?php else: ?><div style="height:300px"><canvas id="chVisits"></canvas></div><?php endif; ?></div>

<div data-mod="fuentes" style="position:relative;display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <div class="card"><h3 style="margin:0 0 16px">Adquisición (de dónde llegan)</h3><?php if(!$srcData): ?><p class="muted">Sin datos.</p><?php else: ?><div class="dona3d"><canvas id="chSrc"></canvas></div><ul class="leyenda" id="leySrc"></ul><?php endif; ?></div>
  <div class="card"><h3 style="margin:0 0 16px">Dispositivos</h3><?php if(!$devData): ?><p class="muted">Sin datos.</p><?php else: ?><div class="dona3d"><canvas id="chDev"></canvas></div><ul class="leyenda" id="leyDev"></ul><?php endif; ?></div>
</div>

<div class="card" data-mod="paginas"><h3 style="margin:0 0 16px">Páginas más visitadas</h3>
  <?php if(!$top): ?><p class="muted">Sin datos.</p><?php else: foreach($top as $t): $pct=round(100*$t['c']/$maxTop); ?>
    <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:5px"><span><?= e($t['path']) ?></span><span class="muted"><?= number_format($t['c']) ?></span></div>
    <div style="height:8px;background:#17171f;border-radius:6px;overflow:hidden"><div style="height:100%;width:<?= $pct ?>%;background:linear-gradient(90deg,#7700CE,#9933FF)"></div></div></div>
  <?php endforeach; endif; ?></div>

<!-- Cómo te ve Google (antes era su propia pantalla) -->
<style>
  .sube{color:#5ad18c}.baja{color:#e07b7b}.igual{color:var(--mut2)}
  .kpi .d{font-size:12px;margin-top:6px}
  .gsc-prog{display:none;margin:14px 0 4px}
  .gsc-prog .pista{height:8px;background:#17171f;border-radius:6px;overflow:hidden}
  .gsc-prog .relleno{height:100%;width:0%;background:linear-gradient(90deg,#7700CE,#9933FF);transition:width .4s}
  .gsc-prog .estado{font-size:12.5px;color:var(--mut);margin-top:7px}
  /* ═══════════════════════ Curvas ═══════════════════════
     Las de CSS son flojas. Estas son las que tienen pegada, y hay una sola
     fuente para todo el panel: si mañana cambia el caracter del movimiento,
     cambia aquí. */
  /* Una sola fuente para el carácter del movimiento de todo el panel. */
  .main{ --sal:cubic-bezier(.23,1,.32,1); --entra-sal:cubic-bezier(.77,0,.175,1) }

  /* ═══════════════════════ Donas en 3D ═══════════════════════ */
  .dona3d{position:relative;width:100%;height:230px}
  .dona3d canvas{width:100%;height:100%;display:block;cursor:pointer}
  .leyenda{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:14px;padding:0 4px}
  .leyenda li{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--mut);
    list-style:none;transition:color 160ms var(--sal)}
  .leyenda li b{color:var(--txt);font-variant-numeric:tabular-nums;font-weight:600}
  @media (hover:hover) and (pointer:fine){
    .leyenda li:hover{color:var(--txt)}
  }
  .leyenda .punto{width:11px;height:11px;border-radius:3px;flex-shrink:0;
    transition:transform 160ms var(--sal)}
  .leyenda li:hover .punto{transform:scale(1.25)}

  /* ═══════════════════════ Repaso de lo que ya habia ═══════════════════════
     Todo lo de abajo son correcciones a mis propias animaciones de la tanda
     anterior, contra el criterio de la skill. */

  /* El agarre: aparece al pasar el cursor, pero solo donde hay cursor de
     verdad. En un táctil el hover se dispara al tocar y salía solo. */
  [data-mod] .agarre{position:absolute;top:14px;right:14px;display:flex;gap:3px;
    padding:6px;border-radius:8px;cursor:grab;background:transparent;z-index:3;opacity:0;
    transition:opacity 160ms var(--sal),background-color 160ms var(--sal),transform 120ms var(--sal)}
  @media (hover:hover) and (pointer:fine){
    [data-mod] .agarre:hover{background:rgba(153,51,255,.12)}
  }
  @media (hover:hover) and (pointer:fine){
    [data-mod]:hover .agarre{opacity:.45}
    [data-mod] .agarre:hover{opacity:1}
  }
  /* Se hunde al presionarlo: sin esto no hay forma de saber que el gesto
     empezó, y agarrar algo es justo cuando más falta hace saberlo. */
  [data-mod] .agarre:active{transform:scale(.94)}

  /* Las marcas del medidor barrían en 616 ms —44 marcas por 14— y se sentía
     lento. A 7 ms el barrido entero cabe en 300, que es el techo. */
  .medidor .marca{transition:stroke 220ms var(--sal),opacity 220ms var(--sal)}

  /* La barra del embudo animaba `width` durante un segundo: `width` rehace el
     layout en cada cuadro, y un segundo es tres veces el techo de una
     animación de interfaz. Con scaleX va por GPU y en 260 ms. */
  .embudo-barra > span{transform-origin:left center;
    transition:transform 260ms var(--sal)}

  /* Los indicadores también responden al toque, no solo al hover. */
  @media (hover:hover) and (pointer:fine){
    }

  @media (prefers-reduced-motion: reduce){
    /* Menos movimiento, no cero: el color y la opacidad siguen explicando
       cosas. Lo que se va es el desplazamiento. */
    .medidor .marca,.embudo-barra > span,[data-mod] .agarre{transition-duration:1ms}
    .kpi:hover{transform:none}
    .leyenda li:hover .punto{transform:none}
  }

  /* ══════════════════════════════ Tablero: mover los módulos ══════════════
     Un panel donde no puedes cambiar el orden es un reporte impreso. El orden
     se guarda por navegador: cada quien mira primero lo suyo. */
  .card[draggable]{cursor:default}
  [data-mod] .agarre:active{cursor:grabbing}
  [data-mod] .agarre i{width:3px;height:3px;border-radius:50%;background:var(--mut);
    box-shadow:0 6px 0 var(--mut),0 12px 0 var(--mut)}
  [data-mod].arrastrando{opacity:.35;border-color:var(--pur2)}
  [data-mod].destino{box-shadow:0 -3px 0 0 var(--pur2)}
  @media(max-width:760px){ [data-mod] .agarre{display:none} }

  /* ══════════════════════════════ Cifras ═════════════════════════════════
     La cifra manda: Hanson, grande, con su resplandor propio. El rótulo se
     retira a monoespaciada diminuta, que es donde debe estar. */
  .kpi.hero{padding:22px 22px 20px}
  .kpi.hero .l{font-family:var(--f-mono);font-size:10px;letter-spacing:.16em;
    text-transform:uppercase;color:var(--mut2)}
  .kpi.hero .v{font-family:var(--f-display);font-size:44px;line-height:1;margin-top:12px;
    letter-spacing:-.02em;position:relative}
  .kpi.hero .v::after{content:'';position:absolute;left:0;bottom:6px;width:58%;height:22px;
    background:radial-gradient(ellipse at left center,rgba(153,51,255,.5),transparent 72%);
    filter:blur(14px);z-index:-1;pointer-events:none}
  .kpi.hero{position:relative;isolation:isolate}

  /* ══════════════════════════════ Tramas ═════════════════════════════════
     Rayas y puntos en vez de relleno plano. Además de verse trabajado,
     distingue las series sin depender solo del color. */
  .trama-rayas{background-image:repeating-linear-gradient(-45deg,
    rgba(255,255,255,.22) 0 1.5px, transparent 1.5px 6px)}
  .trama-puntos{background-image:radial-gradient(rgba(255,255,255,.3) 1.2px, transparent 1.2px);
    background-size:7px 7px}
  .trama-red{background-image:linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px);background-size:8px 8px}

  /* El embudo estrena trama: cada paso se distingue por textura y no solo por
     tono, que es lo que pedía tener tres barras moradas seguidas. */
  .embudo-barra{position:relative;height:16px;border-radius:8px;overflow:hidden;background:#16161f}
  .embudo-barra > span{position:absolute;inset:0 auto 0 0;border-radius:8px}
  .embudo-barra > span::after{content:'';position:absolute;inset:0;border-radius:8px}

  /* ══════════════════════════════ Medidor ════════════════════════════════
     El semicírculo de marcas de las referencias. Cada marca es un grado real
     del dato, no una decoración: se encienden las que corresponden. */
  .medidor{position:relative;width:100%;max-width:260px;aspect-ratio:2/1;margin:0 auto}
  .medidor svg{width:100%;height:100%;overflow:visible}
  .medidor .cifra{position:absolute;left:0;right:0;bottom:2px;text-align:center;
    font-family:var(--f-display);font-size:32px;line-height:1;letter-spacing:-.02em}
  .medidor .pie{position:absolute;left:0;right:0;bottom:-18px;text-align:center;
    font-family:var(--f-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut2)}

  /* Motores de IA: un orden, no un reparto. Reusa el vocabulario de barra que
     ya existe arriba (pista + relleno) para que no haya dos maneras de dibujar
     lo mismo en la misma pagina. */
  .motores{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));
           gap:0 30px;margin-top:4px}
  .motor{padding:11px 0;border-top:1px solid var(--line)}
  .motor .fila{display:flex;align-items:baseline;justify-content:space-between;
               gap:12px;margin-bottom:8px}
  .motor .nom{font-size:13px;color:var(--txt);line-height:1.35}
  .motor .cif{font-size:12px;color:var(--mut);white-space:nowrap;flex-shrink:0}
  .motor .cif b{color:var(--txt);font-weight:600}
  .motor .pista{height:8px;background:#17171f;border-radius:6px;overflow:hidden}
  .motor .relleno{height:100%;background:var(--pur2);border-radius:6px}
  .motor.lider .relleno{background:linear-gradient(90deg,#7700CE,#9933FF)}
  .motor.vivo  .relleno{background:var(--verde)}
  .motores-tot{float:right;font-size:12px;color:var(--mut);font-weight:400}
  @media(max-width:760px){ .motores{gap:0} }
  details.est-urls{border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin-bottom:10px}
  details.est-urls summary{cursor:pointer;font-size:13.5px;display:flex;align-items:center;gap:8px}
  details.est-urls[open] summary{margin-bottom:8px}
  .pt{width:9px;height:9px;border-radius:50%;display:inline-block;flex-shrink:0}
  .lista-urls{font-size:12.5px;color:var(--mut);line-height:1.9}
</style>
<div class="card" id="google" data-mod="google" style="border-color:#2a2140">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:6px">
    <div>
      <h3 style="margin:0 0 4px">Cómo te ve Google</h3>
      <p class="muted" style="margin:0">
        Datos reales de Search Console<?php if ($gscHoy): ?> · foto del <?= e($gscHoy['fecha']) ?><?php endif; ?>.
      </p>
    </div>
    <?php if ($connected): ?>
      <button class="btn ghost small" id="gscBtn" type="button">Actualizar ahora</button>
    <?php endif; ?>
  </div>
  <div class="gsc-prog" id="gscProg">
    <div class="pista"><div class="relleno" id="gscRelleno"></div></div>
    <div class="estado" id="gscEstado">Preparando…</div>
  </div>

  <?php if (!$connected): ?>
    <p class="muted" style="margin:14px 0 0">Conecta Google abajo para ver indexación y palabras clave.</p>
  <?php elseif (!$gscHoy): ?>
    <p class="muted" style="margin:14px 0 0">Todavía no hay ninguna foto guardada. Pulsa <em>Actualizar ahora</em>: tarda un par de minutos y aquí mismo verás el avance.</p>
  <?php else: ?>
    <?php
      /* El último estado conocido de cada URL, no la foto de un día suelto: la
         foto se cierra en ceros si ese día no alcanzó a correr la inspección, y
         el panel enseñaba «0 de 1» teniendo 31 de 50 en la base. */
      $gIx = $gFu = 0;
      try {
        $estado = db()->query("SELECT g.estado FROM gsc_indexacion g
          JOIN (SELECT url, MAX(fecha) f FROM gsc_indexacion GROUP BY url) m
            ON m.url = g.url AND m.f = g.fecha")->fetchAll(PDO::FETCH_COLUMN);
        foreach ($estado as $e) { gsc_es_indexada((string)$e) ? $gIx++ : $gFu++; }
      } catch (Throwable $e) {}
      if ($gIx + $gFu === 0) { $gIx = (int)$gscHoy['indexadas']; $gFu = (int)$gscHoy['sin_indexar']; }
      $gTt = max($gIx + $gFu, 1);
    ?>

    <div class="grid-kpi" style="margin:16px 0 10px">
      <div class="kpi"><div class="l">Páginas indexadas</div><div class="v"><?= $gIx ?> <span style="font-size:15px;color:var(--mut)">de <?= $gTt ?></span></div>
        <div class="d"><?= gsc_delta($gIx, $gscAyer !== null ? (int)$gscAyer['indexadas'] : null) ?></div></div>
      <div class="kpi"><div class="l">Impresiones (28 días)</div><div class="v"><?= number_format((int)$gscHoy['impresiones']) ?></div>
        <div class="d"><?= gsc_delta((int)$gscHoy['impresiones'], $gscAyer !== null ? (int)$gscAyer['impresiones'] : null) ?></div></div>
      <div class="kpi"><div class="l">Clics (28 días)</div><div class="v" style="color:#8ea6ff"><?= (int)$gscHoy['clics'] ?></div>
        <div class="d"><?= gsc_delta((int)$gscHoy['clics'], $gscAyer !== null ? (int)$gscAyer['clics'] : null) ?></div></div>
      <div class="kpi"><div class="l">CTR</div><div class="v" style="color:#ffcf7a"><?= rtrim(rtrim(number_format((float)$gscHoy['ctr'], 2), '0'), '.') ?>%</div>
        <div class="d"><?= gsc_delta((float)$gscHoy['ctr'], $gscAyer !== null ? (float)$gscAyer['ctr'] : null) ?></div></div>
      <div class="kpi"><div class="l">Posición media</div><div class="v" style="color:#5fe0a0"><?= $gscHoy['posicion'] ?></div>
        <div class="d"><?= gsc_delta((float)$gscHoy['posicion'], $gscAyer !== null ? (float)$gscAyer['posicion'] : null, true) ?></div></div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:16px">
      <div>
        <h4 style="margin:0 0 12px;font-size:14px">Evolución (una línea por foto guardada)</h4>
        <?php if (count($gscSerie) > 1): ?><div style="height:250px"><canvas id="chGscEvo"></canvas></div>
        <?php else: ?><p class="mini" style="padding:16px 0">Con la segunda foto aparece la evolución: cada sincronización dibuja un punto.</p><?php endif; ?>
      </div>
      <div>
        <h4 style="margin:0 0 12px;font-size:14px">El índice de Google</h4>
        <?php
          /* Un porcentaje se lee en una escala, no en dos gajos. Cada marca es
             un grado del dato: se encienden las que le corresponden. */
          $pctIdx = round(100 * $gIx / $gTt);
          $marcas = 44;
          $encendidas = (int)round($marcas * $pctIdx / 100);
        ?>
        <div style="height:250px;display:flex;align-items:center;justify-content:center">
          <div class="medidor">
            <svg viewBox="0 0 200 104" aria-label="<?= $pctIdx ?>% de las páginas conocidas están indexadas">
              <?php for ($i = 0; $i < $marcas; $i++):
                $ang = M_PI * ($i / ($marcas - 1));          // de izquierda a derecha
                $x1 = 100 - cos($ang) * 78; $y1 = 100 - sin($ang) * 78;
                $x2 = 100 - cos($ang) * 94; $y2 = 100 - sin($ang) * 94;
                $on = $i < $encendidas; ?>
                <line class="marca" x1="<?= round($x1,2) ?>" y1="<?= round($y1,2) ?>"
                      x2="<?= round($x2,2) ?>" y2="<?= round($y2,2) ?>"
                      stroke="<?= $on ? '#9933FF' : '#2a2a3d' ?>" stroke-width="2.4" stroke-linecap="round"
                      opacity="<?= $on ? (0.45 + 0.55 * $i / max($encendidas,1)) : 1 ?>"
                      style="transition-delay:<?= $i * 6 ?>ms"></line>
              <?php endfor; ?>
              <?php /* la marca del valor, encendida y con halo */
                $angV = M_PI * (max($encendidas - 1, 0) / ($marcas - 1)); ?>
              <line x1="<?= round(100 - cos($angV) * 74, 2) ?>" y1="<?= round(100 - sin($angV) * 74, 2) ?>"
                    x2="<?= round(100 - cos($angV) * 98, 2) ?>" y2="<?= round(100 - sin($angV) * 98, 2) ?>"
                    stroke="#fff" stroke-width="2.6" stroke-linecap="round"
                    style="filter:drop-shadow(0 0 6px rgba(204,102,255,.95))"></line>
            </svg>
            <div class="cifra"><?= $pctIdx ?>%</div>
            <div class="pie"><?= $gIx ?> de <?= $gTt ?> indexadas</div>
          </div>
        </div>
      </div>
    </div>

    <?php if ($gscConsultas): ?>
      <h4 style="margin:18px 0 12px;font-size:14px">Con qué te encuentran (top 10 por impresiones)</h4>
      <div style="height:<?= 40 * min(count($gscConsultas), 10) + 60 ?>px"><canvas id="chGscQ"></canvas></div>

      <details style="margin-top:14px">
        <summary class="muted" style="cursor:pointer">Ver la tabla completa (25 búsquedas)</summary>
        <table style="margin-top:10px"><thead><tr><th>Búsqueda</th><th>Posición</th><th>Impresiones</th><th>Clics</th></tr></thead><tbody>
        <?php foreach ($gscConsultas as $c): $pos = round((float)$c['posicion'], 1);
          $sinClic = (int)$c['clics'] === 0 && $pos <= 10; ?>
          <tr>
            <td><?= e($c['consulta']) ?><?php if ($sinClic): ?>
              <span class="mini" style="color:#e0b07b"> · sale en página 1 y nadie entra</span><?php endif; ?></td>
            <td><span class="badge <?= $pos <= 3 ? 'b-converted' : ($pos <= 10 ? 'b-qualified' : 'b-new') ?>">#<?= $pos ?></span></td>
            <td><?= (int)$c['impresiones'] ?></td>
            <td><?= (int)$c['clics'] ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody></table>
      </details>
    <?php endif; ?>

    <?php if ($gscGrupos): ?>
      <h4 style="margin:20px 0 12px;font-size:14px">Qué páginas conoce Google, una por una</h4>
      <?php foreach ($gscGrupos as $estado => $lista):
        $ok = in_array($estado, $gscBuenos, true); ?>
        <details class="est-urls"<?= $ok ? '' : ' open' ?>>
          <summary><span class="pt" style="background:<?= $ok ? '#5ad18c' : '#e07b7b' ?>"></span>
            <?= e($estado) ?> <span class="mini">(<?= count($lista) ?>)</span></summary>
          <div class="lista-urls">
            <?php foreach ($lista as $u): ?>
              <code><?= e(str_replace('https://www.inedito.digital', '', $u['url']) ?: '/') ?></code><?php
                if ($u['ultimo_rastreo']) echo ' <span class="mini">· visitada ' . e($u['ultimo_rastreo']) . '</span>';
              ?><br>
            <?php endforeach; ?>
          </div>
          <?php if (!$ok): ?>
            <div class="mini" style="margin-top:8px">
              <?php if (stripos($estado, 'Descubierta') !== false): ?>
                Google sabe que existen pero <strong>nunca las ha visitado</strong>. No es problema del contenido: es que al sitio le falta autoridad y Google le dedica poco tiempo. Se acelera pidiendo la indexación a mano y consiguiendo enlaces de otros sitios.
              <?php elseif (stripos($estado, 'no reconoce') !== false): ?>
                Google ni siquiera sabe que existen. Pide la indexación a mano desde Search Console.
              <?php elseif (stripos($estado, 'Rastreada') !== false): ?>
                Las visitó y decidió no incluirlas. Suele ser contenido muy nuevo o que necesita más sustancia.
              <?php endif; ?>
            </div>
          <?php endif; ?>
        </details>
      <?php endforeach; ?>
    <?php endif; ?>
  <?php endif; ?>
</div>

<!-- Posicionamiento en IA (GEO): la métrica que no existía -->
<div class="card" id="geo" data-mod="geo" style="border-color:#1c3326">
  <h3 style="margin:0 0 4px">Posicionamiento en IA (GEO)</h3>
  <p class="muted" style="margin:0 0 16px">Dos medidores automáticos: cuánta gente llega al sitio <strong>desde una IA</strong> (ChatGPT, Perplexity, Gemini, Claude, Copilot) y cuánto <strong>leen el sitio los robots de las IAs</strong> — la materia prima para que te recomienden.</p>

  <div class="grid-kpi">
    <div class="kpi"><div class="l">Visitas llegadas desde una IA (30d)</div><div class="v" style="color:#5fe0a0"><?= number_format($iaVis30) ?></div></div>
    <div class="kpi"><div class="l">Lecturas de bots de IA (30d)</div><div class="v" style="color:#8ea6ff"><?= number_format($iaLect30) ?></div></div>
    <div class="kpi"><div class="l">Motores de IA leyéndote</div><div class="v" style="color:#c3a0ff"><?= count($iaBotsMotor) ?></div></div>
  </div>

  <?php if ($iaLect30 === 0 && $iaVis30 === 0): ?>
    <div class="mini" style="line-height:1.8">
      La medición se instaló el <strong>28 de agosto de 2026</strong>; desde hoy cada lectura y cada visita quedan contadas, así que estos números empiezan en cero y de aquí solo acumulan.<br>
      · Una <strong>lectura de bot</strong> significa que un motor (GPTBot de OpenAI, ClaudeBot, PerplexityBot, Gemini…) entró a estudiar una página del sitio: es el paso previo a que su IA pueda recomendarte.<br>
      · Una <strong>visita desde IA</strong> es una persona que llegó porque una IA le enlazó el sitio. Ojo: muchas IAs abren enlaces sin decir de dónde vienen, así que este número siempre subestima — el complemento es el guion de 15 preguntas a ChatGPT, Gemini y Perplexity de la auditoría, que se repite cada trimestre a mano.
    </div>
  <?php else: ?>
    <h4 style="margin:0 0 12px;font-size:14px">Actividad por día</h4>
    <div style="height:240px;margin-bottom:26px"><canvas id="chIaDia"></canvas></div>

    <?php
      /* Los tres que terminan en «-user» no son rastreadores: los dispara una
         persona preguntando, y la IA abre la página en ese momento para
         contestarle. Es la lectura que más se parece a un prospecto, así que
         va en verde y no revuelta con las demás. */
      $iaEnVivo = ['chatgpt-user', 'claude-user', 'perplexity-user'];
      $iaTope   = max(array_map(fn($r) => (int)$r['c'], $iaBotsMotor));
      $iaVivo30 = array_sum(array_map(fn($r) => in_array($r['bot'], $iaEnVivo, true) ? (int)$r['c'] : 0, $iaBotsMotor));
    ?>
    <h4 style="margin:0 0 4px;font-size:14px">Qué motores te leen
      <span class="motores-tot"><?= number_format($iaLect30) ?> lecturas · <?= count($iaBotsMotor) ?> motores</span></h4>
    <div class="motores">
      <?php foreach ($iaBotsMotor as $i => $r): $c = (int)$r['c']; $vivo = in_array($r['bot'], $iaEnVivo, true); ?>
        <div class="motor<?= $i === 0 ? ' lider' : '' ?><?= $vivo ? ' vivo' : '' ?>">
          <div class="fila">
            <span class="nom"><?= e($IA_NOMBRES[$r['bot']] ?? $r['bot']) ?></span>
            <span class="cif tabular"><b><?= number_format($c) ?></b> · <?= round(100 * $c / max(1, $iaLect30)) ?>%</span>
          </div>
          <div class="pista"><div class="relleno" style="width:<?= max(2, round(100 * $c / max(1, $iaTope))) ?>%"></div></div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="muted" style="margin:16px 0 0;line-height:1.75;font-size:12.5px">
      En <strong style="color:var(--verde)">verde</strong>, las lecturas que disparó una persona: preguntó algo y la IA
      abrió la página en ese momento para contestarle — <?= number_format($iaVivo30) ?> de <?= number_format($iaLect30) ?>.
      El resto son bots que indexan por su cuenta, y ahí el primer lugar mide frecuencia, no preferencia:
      el que más aparece es el que vuelve a repasar el sitio más seguido.
    </p>
    <?php if ($iaUrlsLeidas): ?>
      <h4 style="margin:14px 0 8px;font-size:14px">Qué páginas estudian las IAs</h4>
      <table><thead><tr><th>Página</th><th>Lecturas (30d)</th><th>Motores distintos</th></tr></thead><tbody>
        <?php foreach ($iaUrlsLeidas as $u): ?>
          <tr><td><code style="font-size:12.5px"><?= e($u['url']) ?></code></td><td><?= (int)$u['c'] ?></td><td><?= (int)$u['motores'] ?></td></tr>
        <?php endforeach; ?>
      </tbody></table>
    <?php endif; ?>
    <p class="mini" style="margin:12px 0 0">Las visitas desde IA subestiman (muchas IAs no avisan de dónde vienen); las lecturas de bots son el termómetro duro. El complemento trimestral: el guion de 15 preguntas a ChatGPT, Gemini y Perplexity de la auditoría.</p>
  <?php endif; ?>
</div>

<!-- Conexión Google -->
<div class="card" data-mod="conexion">
  <h3 style="margin:0 0 6px">Conexión con Google</h3>
  <?php if($connected): ?>
    <p class="muted" style="margin:0 0 12px">Google conectado <?= ($g['ga4_property'] ?? '') !== '' ? ('· propiedad GA4: <code>'.e($g['ga4_property']).'</code>') : '' ?>.</p>
    <?php if(empty($g['ga4_property']) && $ga4props): ?>
      <form method="post" style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="ga4save">
        <label style="margin:0">Elige tu propiedad de GA4:</label>
        <select name="ga4_property" style="width:auto"><?php foreach($ga4props as $p): ?><option value="<?= e($p['id']) ?>"><?= e($p['name']).' ('.e($p['id']).')' ?></option><?php endforeach; ?></select>
        <button class="btn small" type="submit">Usar esta</button></form>
    <?php endif; ?>
    <form method="post" style="display:flex;gap:10px;align-items:center;margin-bottom:12px;max-width:520px">
      <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="scsave">
      <label style="margin:0;flex-shrink:0">Sitio en Search Console</label>
      <input type="text" name="sc_site" value="<?= e($g['sc_site'] ?: 'sc-domain:inedito.digital') ?>">
      <button class="btn small" type="submit">Guardar</button>
    </form>
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

</div>

<script>
/* ═══════════════════════════════════════════════ Una dona en 3D
   El circulo se proyecta como elipse (ry menor que rx), la profundidad sale de
   repetir la cara oscurecida hacia abajo, y encima va la cara superior con su
   brillo. Se dibuja de atras hacia adelante para que la extrusion no tape lo
   que deberia estar delante.

   La perspectiva miente sobre el tamaño de los gajos —el de adelante se ve
   mayor aunque valga menos—, asi que el porcentaje va escrito en la leyenda.
   El grafico da la forma; el numero da el dato. */
function dona3d(lienzo, datos, colores, alDestacar){
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var destacado = -1, entrada = 0;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var total = datos.reduce(function(a,b){ return a + b; }, 0) || 1;

  function tinta(hex, f){
    var n = parseInt(hex.slice(1), 16);
    var r = (n>>16)&255, g = (n>>8)&255, b = n&255;
    if (f < 1){ r*=f; g*=f; b*=f; }
    else { r += (255-r)*(f-1); g += (255-g)*(f-1); b += (255-b)*(f-1); }
    return 'rgb(' + (r|0) + ',' + (g|0) + ',' + (b|0) + ')';
  }

  function medir(){
    var r = lienzo.getBoundingClientRect();
    lienzo.width = Math.max(1, Math.round(r.width * dpr));
    lienzo.height = Math.max(1, Math.round(r.height * dpr));
    return r;
  }

  function pintar(){
    var caja = medir(), c = lienzo.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, caja.width, caja.height);

    var prof = Math.max(12, caja.height * 0.09);
    var rx = Math.min(caja.width * 0.42, (caja.height - prof) * 0.86);
    var ry = rx * 0.46;                       // el aplastado de la perspectiva
    var cx = caja.width / 2, cy = (caja.height - prof) / 2 + ry * 0.42;
    var hueco = 0.55;

    /* Los gajos, con su arranque desplazado para que el corte no caiga justo
       al frente, que es donde peor se lee. */
    var ang = -Math.PI * 0.5, gajos = [];
    datos.forEach(function(v, i){
      var barre = (v / total) * Math.PI * 2;
      gajos.push({i:i, a:ang, b:ang + barre, v:v});
      ang += barre;
    });

    function trazar(g, y, r1, r2){
      c.beginPath();
      c.ellipse(cx, y, r1, r1 * (ry/rx), 0, g.a, g.b);
      c.ellipse(cx, y, r2, r2 * (ry/rx), 0, g.b, g.a, true);
      c.closePath();
    }

    var pasos = Math.round(prof);
    gajos.forEach(function(g){
      var sube = (destacado === g.i) ? -7 : 0;
      var col = colores[g.i % colores.length];
      /* la pared: la misma cara repetida hacia abajo y oscurecida */
      for (var k = pasos; k >= 1; k--){
        trazar(g, cy + k + sube, rx, rx * hueco);
        c.fillStyle = tinta(col, 0.34 + 0.16 * (1 - k / pasos));
        c.fill();
      }
      /* la cara de arriba, con brillo de un lado */
      trazar(g, cy + sube, rx, rx * hueco);
      var deg = c.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
      deg.addColorStop(0, tinta(col, 1.28));
      deg.addColorStop(0.55, col);
      deg.addColorStop(1, tinta(col, 0.78));
      c.fillStyle = deg;
      c.fill();
      c.strokeStyle = 'rgba(8,8,14,.85)'; c.lineWidth = 1.5; c.stroke();
    });

    /* La entrada: un telon que descubre la dona de abajo hacia arriba. Con
       movimiento reducido no hay telon, se pinta entera. */
    if (!reducido && entrada < 1){
      c.globalCompositeOperation = 'destination-in';
      c.fillStyle = '#000';
      c.fillRect(0, caja.height - caja.height * entrada, caja.width, caja.height * entrada);
      c.globalCompositeOperation = 'source-over';
    }
  }

  function golpe(e){
    var caja = lienzo.getBoundingClientRect();
    var x = e.clientX - caja.left - caja.width / 2;
    var prof = Math.max(12, caja.height * 0.09);
    var ry0 = Math.min(caja.width * 0.42, (caja.height - prof) * 0.86);
    var cy = (caja.height - prof) / 2 + ry0 * 0.46 * 0.42;
    var y = (e.clientY - caja.top - cy) / 0.46;     // se deshace el aplastado
    var d = Math.sqrt(x*x + y*y) / ry0;
    if (d < 0.55 || d > 1.02) return -1;
    var a = Math.atan2(y, x); if (a < -Math.PI/2) a += Math.PI * 2;
    var acum = -Math.PI/2, cual = -1;
    datos.forEach(function(v, i){
      var b = acum + (v/total) * Math.PI * 2;
      if (a >= acum && a < b) cual = i;
      acum = b;
    });
    return cual;
  }

  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    lienzo.addEventListener('mousemove', function(e){
      var n = golpe(e);
      if (n === destacado) return;
      destacado = n; pintar();
      if (alDestacar) alDestacar(n);
    });
    lienzo.addEventListener('mouseleave', function(){
      if (destacado === -1) return;
      destacado = -1; pintar();
      if (alDestacar) alDestacar(-1);
    });
  }

  /* Se dibuja la primera vez que se ve, no al cargar: media pagina de graficas
     animandose a la vez fuera de pantalla no la ve nadie. */
  var io = new IntersectionObserver(function(en){
    if (!en[0].isIntersecting) return;
    io.disconnect();
    if (reducido){ entrada = 1; pintar(); return; }
    var t0 = null;
    (function paso(t){
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 620, 1);
      entrada = 1 - Math.pow(1 - p, 3);          // ease-out
      pintar();
      if (p < 1) requestAnimationFrame(paso);
    })(performance.now());
  }, {threshold:.25});
  io.observe(lienzo);

  pintar();
  var t; window.addEventListener('resize', function(){
    clearTimeout(t); t = setTimeout(pintar, 120);
  });
}

/* La leyenda, en HTML: seleccionable, escalable y con el porcentaje escrito,
   que es lo que la perspectiva no deja juzgar a ojo. */
function leyendaDona(cont, etiquetas, datos, colores){
  var total = datos.reduce(function(a,b){ return a+b; }, 0) || 1;
  cont.innerHTML = etiquetas.map(function(t, i){
    return '<li data-g="' + i + '"><span class="punto" style="background:' + colores[i % colores.length] + '"></span>'
         + t + ' <b>' + Math.round(100 * datos[i] / total) + '%</b></li>';
  }).join('');
}

/* ════════════════════════════════════════════════ Tramas para Chart.js
   Un patrón de canvas: rayas diagonales sobre el color de la serie. Chart.js
   acepta un CanvasPattern donde acepta un color, así que entra sin tocar el
   resto de la configuración. */
function tramaRayas(color, fondo, paso){
  paso = paso || 7;
  var c = document.createElement('canvas'); c.width = c.height = paso;
  var x = c.getContext('2d');
  x.fillStyle = fondo || 'rgba(255,255,255,.04)'; x.fillRect(0,0,paso,paso);
  x.strokeStyle = color; x.lineWidth = 2.2; x.lineCap = 'round';
  x.beginPath(); x.moveTo(-1, paso+1); x.lineTo(paso+1, -1); x.stroke();
  x.beginPath(); x.moveTo(paso-1, paso+1); x.lineTo(paso+1, paso-1); x.stroke();
  return x.createPattern(c, 'repeat');
}
function tramaPuntos(color, fondo, paso){
  paso = paso || 8;
  var c = document.createElement('canvas'); c.width = c.height = paso;
  var x = c.getContext('2d');
  x.fillStyle = fondo || 'rgba(255,255,255,.04)'; x.fillRect(0,0,paso,paso);
  x.fillStyle = color;
  x.beginPath(); x.arc(paso/2, paso/2, 1.5, 0, Math.PI*2); x.fill();
  return x.createPattern(c, 'repeat');
}

/* ════════════════════════════════════════════════ Cifras que cuentan
   Solo la primera vez que se ven. El valor puede traer separadores de miles o
   un sufijo (%); se anima el número y el resto se respeta tal cual. */
(function(){
  var objetivo = document.querySelectorAll('.kpi.hero .v');
  if (!objetivo.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function(entradas){
    entradas.forEach(function(en){
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      var el = en.target, texto = el.textContent.trim();
      var m = texto.match(/^([\d,.]+)(.*)$/); if (!m) return;
      var fin = parseFloat(m[1].replace(/,/g,'')); if (!isFinite(fin) || fin === 0) return;
      var sufijo = m[2], dec = (m[1].split('.')[1] || '').length, t0 = null, dur = 900;
      function paso(t){
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var v = fin * (1 - Math.pow(1 - p, 3));
        el.textContent = (dec ? v.toFixed(dec) : Math.round(v)).toLocaleString('es-MX') + sufijo;
        if (p < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    });
  }, {threshold:.4});
  objetivo.forEach(function(el){ io.observe(el); });
})();

/* ════════════════════════════════════════════════ Mover los módulos
   El orden vive en el navegador de quien mira. Un panel donde no puedes subir
   lo que te importa es un reporte impreso. */
(function(){
  var cont = document.getElementById('tablero'); if (!cont) return;
  var LLAVE = 'panel_orden_analiticas';

  var tarjetas = [].slice.call(cont.querySelectorAll(':scope > [data-mod]'));
  if (tarjetas.length < 2) return;

  /* Se restaura antes de nada: si el guardado trae un módulo que ya no existe
     se ignora, y los que no estén en el guardado se quedan donde estaban. */
  try {
    var guardado = JSON.parse(localStorage.getItem(LLAVE) || '[]');
    guardado.forEach(function(id){
      var el = cont.querySelector(':scope > [data-mod="' + id + '"]');
      if (el) cont.appendChild(el);
    });
  } catch(e){}

  function guardar(){
    var ids = [].slice.call(cont.querySelectorAll(':scope > [data-mod]'))
      .map(function(el){ return el.getAttribute('data-mod'); });
    try { localStorage.setItem(LLAVE, JSON.stringify(ids)); } catch(e){}
  }

  var arrastrada = null;
  tarjetas.forEach(function(card){
    var agarre = document.createElement('div');
    agarre.className = 'agarre';
    agarre.title = 'Arrastra para mover este módulo';
    agarre.setAttribute('aria-hidden','true');
    agarre.innerHTML = '<i></i><i></i>';
    card.appendChild(agarre);

    /* draggable solo mientras se toca el agarre: si no, seleccionar texto
       dentro de una tarjeta empezaría a arrastrarla. */
    agarre.addEventListener('mousedown', function(){ card.setAttribute('draggable','true'); });
    document.addEventListener('mouseup', function(){ card.removeAttribute('draggable'); });

    card.addEventListener('dragstart', function(e){
      arrastrada = card; card.classList.add('arrastrando');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.getAttribute('data-mod')); } catch(err){}
    });
    card.addEventListener('dragend', function(){
      card.classList.remove('arrastrando');
      cont.querySelectorAll('.destino').forEach(function(x){ x.classList.remove('destino'); });
      card.removeAttribute('draggable');
      arrastrada = null;
      guardar();
    });
    card.addEventListener('dragover', function(e){
      if (!arrastrada || arrastrada === card) return;
      e.preventDefault();
      var r = card.getBoundingClientRect();
      var antes = (e.clientY - r.top) < r.height / 2;
      card.classList.add('destino');
      cont.insertBefore(arrastrada, antes ? card : card.nextSibling);
    });
    card.addEventListener('dragleave', function(){ card.classList.remove('destino'); });
  });
})();

(function(){ if(typeof Chart==='undefined')return; Chart.defaults.color='#8a8aa0';Chart.defaults.font.family='Arial,Helvetica,sans-serif';var grid='rgba(255,255,255,.06)';
  /* El trazo lleva su propio resplandor: se pinta dos veces, la primera con
     sombra ancha y la segunda limpia encima. Una sombra de caja alrededor del
     lienzo no ilumina la linea, ilumina el rectangulo. */
  var brillo = {
    id:'brillo',
    beforeDatasetDraw: function(ch, args){
      if (args.index !== 0) return;
      var c = ch.ctx; c.save();
      c.shadowColor = 'rgba(153,51,255,.75)'; c.shadowBlur = 18;
    },
    afterDatasetDraw: function(ch, args){ if (args.index === 0) ch.ctx.restore(); }
  };
  var v=document.getElementById('chVisits'); if(v){var ctx=v.getContext('2d');var g=ctx.createLinearGradient(0,0,0,300);g.addColorStop(0,'rgba(153,51,255,.38)');g.addColorStop(1,'rgba(119,0,206,0)');
    var datos=<?= json_encode($series) ?>;
    new Chart(ctx,{type:'line',plugins:[brillo],data:{labels:<?= json_encode($labels) ?>,datasets:[{
        data:datos,borderColor:'#CC66FF',backgroundColor:g,fill:true,tension:.38,borderWidth:2.5,
        /* solo el ultimo dato lleva punto: es el de hoy, el que se mira */
        pointRadius:datos.map(function(_,i){return i===datos.length-1?5:0}),
        pointBackgroundColor:'#fff',pointBorderColor:'#CC66FF',pointBorderWidth:2.5,pointHoverRadius:5
      }]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutCubic'},
      plugins:{legend:{display:false},tooltip:{backgroundColor:'#12121c',borderColor:'#2f2f49',borderWidth:1,padding:10,displayColors:false}},
      scales:{x:{grid:{display:false},ticks:{maxRotation:0}},y:{beginAtZero:true,grid:{color:grid,drawTicks:false},border:{display:false},ticks:{precision:0,padding:8}}}}});}
  var donut={type:'doughnut',options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom',labels:{padding:14,usePointStyle:true}}}}};var COL=['#7700CE','#9933FF','#5fe0a0','#8ea6ff','#ffcf7a','#ff8fa6','#59c1ff'];
  /* Cada gajo con su trama ademas de su color: se distinguen tambien sin
     color, que es como se ven en una captura o para quien no distingue tonos. */
  var TRAMAS = COL.map(function(c,i){
    return i % 3 === 0 ? tramaRayas(c, 'rgba(255,255,255,.05)')
         : i % 3 === 1 ? tramaPuntos(c, 'rgba(255,255,255,.05)')
         : c;
  });
  /* Las dos donas ya no son de Chart.js: son 3D dibujadas a mano, y su leyenda
     vive en HTML. Al destacar un gajo se destaca su renglon, que es lo que
     conecta el grafico con la cifra. */
  (function(){
    var l = document.getElementById('chSrc'); if(!l) return;
    var d = <?= json_encode($srcData) ?>, e = <?= json_encode($srcLabels) ?>, ley = document.getElementById('leySrc');
    leyendaDona(ley, e, d, COL);
    dona3d(l, d, COL, function(n){
      [].forEach.call(ley.children, function(li, i){
        li.style.color = (n === -1) ? '' : (i === n ? 'var(--txt)' : 'var(--mut2)');
      });
    });
  })();
  (function(){
    var l = document.getElementById('chDev'); if(!l) return;
    var d = <?= json_encode($devData) ?>, e = <?= json_encode($devLabels) ?>, ley = document.getElementById('leyDev');
    leyendaDona(ley, e, d, COL);
    dona3d(l, d, COL, function(n){
      [].forEach.call(ley.children, function(li, i){
        li.style.color = (n === -1) ? '' : (i === n ? 'var(--txt)' : 'var(--mut2)');
      });
    });
  })();

<?php if ($gscHoy): ?>
  /* ---- Cómo te ve Google ---- */
  var evo=document.getElementById('chGscEvo');
  if(evo){
    var ctx2=evo.getContext('2d');var g2=ctx2.createLinearGradient(0,0,0,250);g2.addColorStop(0,'rgba(119,0,206,.4)');g2.addColorStop(1,'rgba(119,0,206,0)');
    new Chart(ctx2,{type:'line',data:{
      labels:<?= json_encode(array_map(fn($s) => date('d/m', strtotime($s['fecha'])), $gscSerie)) ?>,
      datasets:[
        {label:'Impresiones (28d)',data:<?= json_encode(array_map(fn($s) => (int)$s['impresiones'], $gscSerie)) ?>,borderColor:'#9933FF',backgroundColor:g2,fill:true,tension:.35,pointRadius:3,borderWidth:2,yAxisID:'y'},
        {label:'Páginas indexadas',data:<?= json_encode(array_map(fn($s) => (int)$s['indexadas'], $gscSerie)) ?>,borderColor:'#5fe0a0',tension:.35,pointRadius:3,borderWidth:2,yAxisID:'y1'}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:14}}},
        scales:{x:{grid:{display:false}},
          y:{beginAtZero:true,grid:{color:grid},ticks:{precision:0}},
          y1:{beginAtZero:true,position:'right',grid:{drawOnChartArea:false},ticks:{precision:0,color:'#5fe0a0'}}}}});
  }
  var cq=document.getElementById('chGscQ');
  if(cq){
    <?php $q10 = array_slice($gscConsultas, 0, 10); ?>
    new Chart(cq,{type:'bar',data:{
      labels:<?= json_encode(array_map(fn($c) => mb_strlen($c['consulta']) > 34 ? mb_substr($c['consulta'], 0, 33) . '…' : $c['consulta'], $q10)) ?>,
      datasets:[
        {label:'Impresiones',data:<?= json_encode(array_map(fn($c) => (int)$c['impresiones'], $q10)) ?>,backgroundColor:'rgba(153,51,255,.75)',borderRadius:5},
        {label:'Clics',data:<?= json_encode(array_map(fn($c) => (int)$c['clics'], $q10)) ?>,backgroundColor:'rgba(95,224,160,.85)',borderRadius:5}
      ]},
      options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:14}}},
        scales:{x:{beginAtZero:true,grid:{color:grid},ticks:{precision:0}},y:{grid:{display:false}}}}});
  }
<?php endif; ?>

<?php if ($iaLect30 > 0 || $iaVis30 > 0): ?>
  /* ---- Posicionamiento en IA (GEO) ---- */
  var iaD=document.getElementById('chIaDia');
  if(iaD){
    <?php
      // un eje de fechas común para lecturas y visitas
      $iaFechas = [];
      foreach ($iaBotsDia as $r) $iaFechas[$r['f']] = true;
      foreach ($iaVisDia as $r) $iaFechas[$r['f']] = true;
      $iaFechas = array_keys($iaFechas); sort($iaFechas);
      $mapaLect = array_column($iaBotsDia, 'c', 'f');
      $mapaVis  = array_column($iaVisDia, 'c', 'f');
    ?>
    new Chart(iaD,{type:'bar',data:{
      labels:<?= json_encode(array_map(fn($f) => date('d/m', strtotime($f)), $iaFechas)) ?>,
      datasets:[
        {label:'Lecturas de bots de IA',data:<?= json_encode(array_map(fn($f) => (int)($mapaLect[$f] ?? 0), $iaFechas)) ?>,backgroundColor:'rgba(142,166,255,.75)',borderRadius:4},
        {label:'Visitas desde IA',data:<?= json_encode(array_map(fn($f) => (int)($mapaVis[$f] ?? 0), $iaFechas)) ?>,backgroundColor:'rgba(95,224,160,.85)',borderRadius:4}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:14}}},
        scales:{x:{grid:{display:false},stacked:false},y:{beginAtZero:true,grid:{color:grid},ticks:{precision:0}}}}});
  }
<?php endif; ?>
})();

/* ---- Sincronizar con Google por lotes: cada viaje contesta en segundos,
   así que el corte de 100 s de Cloudflare ya no alcanza a nadie. ---- */
(function(){
  var btn=document.getElementById('gscBtn'); if(!btn) return;
  var prog=document.getElementById('gscProg'), rel=document.getElementById('gscRelleno'), est=document.getElementById('gscEstado');
  btn.addEventListener('click', async function(){
    btn.disabled=true; btn.textContent='Sincronizando…'; prog.style.display='block';
    var fase='inicio', offset=0, total=0;
    try{
      est.textContent='Leyendo rendimiento y búsquedas…'; rel.style.width='4%';
      while(fase!=='fin'){
        var fd=new FormData(); fd.append('csrf','<?= $ct ?>'); fd.append('fase',fase); fd.append('offset',offset);
        var r=await fetch('/panel/gsc_paso.php',{method:'POST',body:fd});
        var j=await r.json();
        if(j.error) throw new Error(j.error);
        fase=j.fase; offset=j.offset||0; if(j.total) total=j.total;
        if(j.msg) est.textContent=j.msg;
        if(fase==='urls' && total) rel.style.width=(5+Math.round(90*(j.hecho||0)/total))+'%';
        if(fase==='cierre') rel.style.width='97%';
      }
      rel.style.width='100%'; est.textContent='Listo. Recargando…';
      location.reload();
    }catch(e){
      est.textContent='No se pudo: '+e.message;
      rel.style.background='#e07b7b';
      btn.disabled=false; btn.textContent='Reintentar';
    }
  });
})();
</script>
