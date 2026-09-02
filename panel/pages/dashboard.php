<?php
function tcount(string $t): int { try { return (int) db()->query("SELECT COUNT(*) c FROM `$t`")->fetch()['c']; } catch (Throwable $e) { return 0; } }
$leadsTotal = tcount('leads');
$leadsNew   = (int)(db()->query("SELECT COUNT(*) c FROM leads WHERE status='new'")->fetch()['c'] ?? 0);
$blogN = tcount('blog_posts'); $servN = tcount('services'); $portN = tcount('portfolio');
$recent = [];
try { $recent = db()->query("SELECT name,email,status,created_at FROM leads ORDER BY created_at DESC, id DESC LIMIT 6")->fetchAll(); } catch (Throwable $e) {}
$LB = ['new'=>'Nuevo','contacted'=>'Contactado','qualified'=>'Calificado','converted'=>'Convertido','lost'=>'Perdido'];

/* El saludo con la hora de Aguascalientes, no la del servidor. */
$tz = new DateTimeZone('America/Mexico_City');
$ahora = new DateTime('now', $tz);
$h = (int)$ahora->format('G');
$saludo = $h < 12 ? 'Buenos días' : ($h < 19 ? 'Buenas tardes' : 'Buenas noches');
$MESES = [1=>'enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
$DIAS  = ['Monday'=>'lunes','Tuesday'=>'martes','Wednesday'=>'miércoles','Thursday'=>'jueves','Friday'=>'viernes','Saturday'=>'sábado','Sunday'=>'domingo'];
$fecha = $DIAS[$ahora->format('l')] . ' ' . $ahora->format('j') . ' de ' . $MESES[(int)$ahora->format('n')];
?>
<div class="banner">
  <div class="banner-fondo" aria-hidden></div>
  <div class="banner-velo" aria-hidden></div>
  <div class="banner-orbe o1" aria-hidden></div>
  <div class="banner-orbe o2" aria-hidden></div>
  <div class="banner-int">
    <div class="kicker" style="color:rgba(255,255,255,.75)"><?= e($fecha) ?> · Centro de mando</div>
    <h1><?= e($saludo) ?>, <?= e($_SESSION['admin_user'] ?? 'admin') ?></h1>
    <p>
      <?php if ($leadsNew > 0): ?>
        Tienes <strong><?= $leadsNew ?> lead<?= $leadsNew === 1 ? '' : 's' ?> sin atender</strong>. Cada hora que pasa enfría la conversación: ese es el pendiente que más dinero vale hoy.
      <?php else: ?>
        Sin leads pendientes por atender. Buen momento para revisar las analíticas o afinar el contenido del sitio.
      <?php endif; ?>
    </p>
    <div class="acciones">
      <?php if ($leadsNew > 0): ?><a class="btn" href="/panel/?p=leads">Atender leads (<?= $leadsNew ?>)</a><?php endif; ?>
      <a class="btn ghost" href="/panel/?p=paginas&pagina=home">Editar la portada</a>
      <a class="btn ghost" href="/panel/?p=analiticas">Ver analíticas</a>
      <a class="btn ghost" href="https://www.inedito.digital/" target="_blank">Ver el sitio ↗</a>
    </div>
  </div>
</div>

<div class="grid-kpi">
  <div class="kpi"><div class="l">Leads totales</div><div class="v"><?= $leadsTotal ?></div></div>
  <div class="kpi"><div class="l">Leads nuevos</div><div class="v" style="color:#8ea6ff"><?= $leadsNew ?></div></div>
  <div class="kpi"><div class="l">Servicios</div><div class="v"><?= $servN ?></div></div>
  <div class="kpi"><div class="l">Posts de blog</div><div class="v"><?= $blogN ?></div></div>
  <div class="kpi"><div class="l">Casos portafolio</div><div class="v"><?= $portN ?></div></div>
</div>
<div class="card">
  <div class="topbar" style="margin-bottom:14px"><h3 style="margin:0">Leads recientes</h3><a class="btn small" href="/panel/?p=leads">Ver todos</a></div>
  <?php if (!$recent): ?><p class="muted">No hay leads todavía.</p>
  <?php else: ?><table><thead><tr><th>Nombre</th><th>Email</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
    <?php foreach ($recent as $r): ?><tr>
      <td><?= e($r['name']) ?></td><td class="muted"><?= e($r['email']) ?></td>
      <td><span class="badge b-<?= e($r['status']) ?>"><?= e($LB[$r['status']] ?? $r['status']) ?></span></td>
      <td class="mini"><?= e(date('d/m/Y H:i', strtotime((string)$r['created_at']))) ?></td>
    </tr><?php endforeach; ?>
  </tbody></table><?php endif; ?>
</div>
