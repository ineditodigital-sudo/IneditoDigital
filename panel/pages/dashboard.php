<?php
function tcount(string $t): int { try { return (int) db()->query("SELECT COUNT(*) c FROM `$t`")->fetch()['c']; } catch (Throwable $e) { return 0; } }
$leadsTotal = tcount('leads');
$leadsNew   = (int)(db()->query("SELECT COUNT(*) c FROM leads WHERE status='new'")->fetch()['c'] ?? 0);
$blogN = tcount('blog_posts'); $servN = tcount('services'); $portN = tcount('portfolio');
$recent = [];
try { $recent = db()->query("SELECT name,email,status,created_at FROM leads ORDER BY created_at DESC, id DESC LIMIT 6")->fetchAll(); } catch (Throwable $e) {}
$LB = ['new'=>'Nuevo','contacted'=>'Contactado','qualified'=>'Calificado','converted'=>'Convertido','lost'=>'Perdido'];
?>
<h1 class="title">Dashboard</h1>
<p class="subt">Hola, <?= e($_SESSION['admin_user'] ?? 'admin') ?> · resumen general del sitio</p>
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
