<?php
$STATUSES = ['new','contacted','qualified','converted','lost'];
$LB = ['new'=>'Nuevo','contacted'=>'Contactado','qualified'=>'Calificado','converted'=>'Convertido','lost'=>'Perdido'];
function wa_link(?string $p): string { $n=preg_replace('/\D/','',(string)$p); if(strlen($n)===10)$n='52'.$n; return 'https://wa.me/'.$n; }

// Exportar CSV (limpia el buffer del layout y envía el archivo)
if (($_GET['export'] ?? '') === 'csv') {
    while (ob_get_level() > 0) ob_end_clean();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="leads-'.date('Y-m-d').'.csv"');
    $out = fopen('php://output','w');
    fputcsv($out, ['Nombre','Email','Telefono','Empresa','Servicio','Mensaje','Estado','Origen','Fecha','Notas']);
    foreach (db()->query("SELECT * FROM leads ORDER BY created_at DESC, id DESC") as $r) {
        fputcsv($out, [$r['name'],$r['email'],$r['phone'],$r['company'],$r['service'],$r['message'],$r['status'],$r['source'],$r['created_at'],$r['notes'] ?? '']);
    }
    fclose($out); exit;
}

// Acciones
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check();
    $act = $_POST['action'] ?? ''; $id = (int)($_POST['id'] ?? 0);
    if ($id > 0) {
        if ($act === 'update_status' && in_array($_POST['status'] ?? '', $STATUSES, true)) {
            db()->prepare('UPDATE leads SET status=:s WHERE id=:id')->execute([':s'=>$_POST['status'], ':id'=>$id]);
            set_flash('Estado actualizado.');
        } elseif ($act === 'note') {
            db()->prepare('UPDATE leads SET notes=:n WHERE id=:id')->execute([':n'=>trim($_POST['notes'] ?? ''), ':id'=>$id]);
            set_flash('Nota guardada.');
        } elseif ($act === 'delete') {
            db()->prepare('DELETE FROM leads WHERE id=:id')->execute([':id'=>$id]);
            set_flash('Lead borrado.');
        }
    }
    redirect('/panel/?p=leads' . (!empty($_POST['f']) ? '&f='.urlencode($_POST['f']) : ''));
}

$f = preg_replace('/[^a-z]/','', (string)($_GET['f'] ?? 'all'));
$q = trim((string)($_GET['q'] ?? ''));
$sql = "SELECT * FROM leads"; $cond=[]; $par=[];
if (in_array($f,$STATUSES,true)) { $cond[]="status=:st"; $par[':st']=$f; }
if ($q!=='') { $cond[]="(name LIKE :q OR email LIKE :q OR company LIKE :q OR phone LIKE :q)"; $par[':q']='%'.$q.'%'; }
if ($cond) $sql.=" WHERE ".implode(' AND ',$cond);
$sql.=" ORDER BY created_at DESC, id DESC";
$st=db()->prepare($sql); $st->execute($par); $rows=$st->fetchAll();
$counts=['all'=>(int)db()->query("SELECT COUNT(*) c FROM leads")->fetch()['c']];
foreach ($STATUSES as $s) $counts[$s]=(int)db()->query("SELECT COUNT(*) c FROM leads WHERE status=".db()->quote($s))->fetch()['c'];
$ct = csrf();
?>
<div class="topbar">
  <div><h1 class="title">Leads</h1><p class="subt"><?= count($rows) ?> mostrados · <?= $counts['all'] ?> en total</p></div>
  <a class="btn" href="/panel/?p=leads&export=csv">Exportar CSV</a>
</div>

<div style="margin-bottom:16px">
  <?php foreach (['all'=>'Todos']+$LB as $k=>$lab): ?>
    <a class="chip <?= $f===$k?'active':'' ?>" href="/panel/?p=leads&f=<?= $k ?>"><?= e($lab) ?> (<?= $counts[$k]??0 ?>)</a>
  <?php endforeach; ?>
</div>
<form method="get" style="margin-bottom:20px;display:flex;gap:10px">
  <input type="hidden" name="p" value="leads"><input type="hidden" name="f" value="<?= e($f) ?>">
  <input type="text" name="q" value="<?= e($q) ?>" placeholder="Buscar por nombre, email, empresa, teléfono…">
  <button class="btn ghost" type="submit">Buscar</button>
</form>

<?php if (!$rows): ?><div class="card"><p class="muted" style="text-align:center;padding:30px 0">No hay leads con este filtro.</p></div><?php endif; ?>

<?php foreach ($rows as $l): $id=(int)$l['id']; ?>
<div class="card">
  <div class="topbar" style="margin-bottom:10px">
    <div style="flex:1;min-width:0">
      <h3 style="margin:0 0 4px"><?= e($l['name']) ?></h3>
      <div class="muted"><a href="mailto:<?= e($l['email']) ?>" style="color:#b58bff"><?= e($l['email']) ?></a> · <?= e($l['phone']) ?><?= $l['company']?' · '.e($l['company']):'' ?></div>
      <?php if($l['message']): ?><div style="margin-top:10px;background:var(--card2);border-left:2px solid var(--pur);border-radius:6px;padding:12px 14px;font-size:14px;line-height:1.6;white-space:pre-wrap"><?= e($l['message']) ?></div><?php endif; ?>
      <div class="mini" style="margin-top:8px"><?= e(date('d/m/Y H:i', strtotime((string)$l['created_at']))) ?> · <?= e($l['source']) ?></div>
    </div>
    <span class="badge b-<?= e($l['status']) ?>"><?= e($LB[$l['status']]??$l['status']) ?></span>
  </div>
  <div class="actions">
    <form method="post" style="display:flex;gap:6px;align-items:center">
      <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="update_status">
      <input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="f" value="<?= e($f) ?>">
      <select name="status" style="width:auto"><?php foreach($STATUSES as $s): ?><option value="<?= $s ?>" <?= $l['status']===$s?'selected':'' ?>><?= e($LB[$s]) ?></option><?php endforeach; ?></select>
      <button class="btn small" type="submit">Guardar</button>
    </form>
    <a class="btn small" href="mailto:<?= e($l['email']) ?>">Correo</a>
    <a class="btn small green" target="_blank" rel="noopener" href="<?= e(wa_link($l['phone'])) ?>">WhatsApp</a>
    <form method="post" onsubmit="return confirm('¿Borrar este lead? No se puede deshacer.')" style="display:inline">
      <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="delete">
      <input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="f" value="<?= e($f) ?>">
      <button class="btn small danger" type="submit">Borrar</button>
    </form>
  </div>
  <details style="margin-top:12px"><summary class="mini" style="cursor:pointer">Notas internas</summary>
    <form method="post" style="margin-top:8px">
      <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="note">
      <input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="f" value="<?= e($f) ?>">
      <textarea name="notes" style="min-height:70px" placeholder="Notas sobre este prospecto…"><?= e($l['notes'] ?? '') ?></textarea>
      <button class="btn small ghost" type="submit" style="margin-top:8px">Guardar nota</button>
    </form>
  </details>
</div>
<?php endforeach; ?>
