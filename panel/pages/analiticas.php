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

<!-- Cómo te ve Google (antes era su propia pantalla) -->
<style>
  .sube{color:#5ad18c}.baja{color:#e07b7b}.igual{color:var(--mut2)}
  .kpi .d{font-size:12px;margin-top:6px}
  .gsc-prog{display:none;margin:14px 0 4px}
  .gsc-prog .pista{height:8px;background:#17171f;border-radius:6px;overflow:hidden}
  .gsc-prog .relleno{height:100%;width:0%;background:linear-gradient(90deg,#7700CE,#9933FF);transition:width .4s}
  .gsc-prog .estado{font-size:12.5px;color:var(--mut);margin-top:7px}
  details.est-urls{border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin-bottom:10px}
  details.est-urls summary{cursor:pointer;font-size:13.5px;display:flex;align-items:center;gap:8px}
  details.est-urls[open] summary{margin-bottom:8px}
  .pt{width:9px;height:9px;border-radius:50%;display:inline-block;flex-shrink:0}
  .lista-urls{font-size:12.5px;color:var(--mut);line-height:1.9}
</style>
<div class="card" id="google" style="border-color:#2a2140">
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
    <?php $gIx = (int)$gscHoy['indexadas']; $gFu = (int)$gscHoy['sin_indexar']; $gTt = max($gIx + $gFu, 1); ?>

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
        <div style="height:250px"><canvas id="chGscIdx"></canvas></div>
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
<div class="card" id="geo" style="border-color:#1c3326">
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
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:6px">
      <div>
        <h4 style="margin:0 0 12px;font-size:14px">Actividad por día</h4>
        <div style="height:240px"><canvas id="chIaDia"></canvas></div>
      </div>
      <div>
        <h4 style="margin:0 0 12px;font-size:14px">Qué motores te leen</h4>
        <div style="height:240px"><canvas id="chIaMotor"></canvas></div>
      </div>
    </div>
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

<script>
(function(){ if(typeof Chart==='undefined')return; Chart.defaults.color='#8a8aa0';Chart.defaults.font.family='Arial,Helvetica,sans-serif';var grid='rgba(255,255,255,.06)';
  var v=document.getElementById('chVisits'); if(v){var ctx=v.getContext('2d');var g=ctx.createLinearGradient(0,0,0,300);g.addColorStop(0,'rgba(119,0,206,.45)');g.addColorStop(1,'rgba(119,0,206,0)');
    new Chart(ctx,{type:'line',data:{labels:<?= json_encode($labels) ?>,datasets:[{data:<?= json_encode($series) ?>,borderColor:'#9933FF',backgroundColor:g,fill:true,tension:.35,pointRadius:0,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:grid},ticks:{precision:0}}}}});}
  var donut={type:'doughnut',options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom',labels:{padding:14,usePointStyle:true}}}}};var COL=['#7700CE','#9933FF','#5fe0a0','#8ea6ff','#ffcf7a','#ff8fa6','#59c1ff'];
  var s=document.getElementById('chSrc'); if(s) new Chart(s,Object.assign({},donut,{data:{labels:<?= json_encode($srcLabels) ?>,datasets:[{data:<?= json_encode($srcData) ?>,backgroundColor:COL,borderColor:'#0e0e15',borderWidth:2}]}}));
  var d=document.getElementById('chDev'); if(d) new Chart(d,Object.assign({},donut,{data:{labels:<?= json_encode($devLabels) ?>,datasets:[{data:<?= json_encode($devData) ?>,backgroundColor:COL,borderColor:'#0e0e15',borderWidth:2}]}}));

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
  var idx=document.getElementById('chGscIdx');
  if(idx) new Chart(idx,Object.assign({},donut,{data:{labels:['Dentro del índice','Fuera del índice'],
    datasets:[{data:[<?= (int)$gscHoy['indexadas'] ?>,<?= (int)$gscHoy['sin_indexar'] ?>],backgroundColor:['#5fe0a0','#e07b7b'],borderColor:'#0e0e15',borderWidth:2}]}}));
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
  var iaM=document.getElementById('chIaMotor');
  if(iaM) new Chart(iaM,Object.assign({},donut,{data:{
    labels:<?= json_encode(array_map(fn($r) => $IA_NOMBRES[$r['bot']] ?? $r['bot'], $iaBotsMotor)) ?>,
    datasets:[{data:<?= json_encode(array_map(fn($r) => (int)$r['c'], $iaBotsMotor)) ?>,backgroundColor:COL,borderColor:'#0e0e15',borderWidth:2}]}}));
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
