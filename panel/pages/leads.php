<?php
$STATUSES = ['new','contacted','qualified','converted','lost'];
$LB = ['new'=>'Nuevo','contacted'=>'Contactado','qualified'=>'Calificado','converted'=>'Convertido','lost'=>'Perdido'];
/** «4491204353» se lee mal; «449 120 4353» se lee de un vistazo. */
function tel_bonito(string $d): string {
    if (strlen($d) === 12 && str_starts_with($d, '52')) $d = substr($d, 2);
    if (strlen($d) !== 10) return $d;
    return substr($d, 0, 3) . ' ' . substr($d, 3, 3) . ' ' . substr($d, 6);
}
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
    if ($act === 'crear') {
        $nombre = trim((string)($_POST['name'] ?? ''));
        if ($nombre === '') {
            set_flash('Falta el nombre.');
        } else {
            db()->prepare('INSERT INTO leads (name,email,phone,company,service,message,source,status)
                           VALUES (:n,:e,:t,:c,:s,:m,:o,:st)')
                ->execute([
                    ':n' => $nombre,
                    ':e' => trim((string)($_POST['email'] ?? '')),
                    ':t' => trim((string)($_POST['phone'] ?? '')),
                    ':c' => trim((string)($_POST['company'] ?? '')),
                    ':s' => trim((string)($_POST['service'] ?? '')),
                    ':m' => trim((string)($_POST['message'] ?? '')),
                    ':o' => trim((string)($_POST['source'] ?? '')) ?: 'Capturado a mano',
                    ':st'=> in_array($_POST['status'] ?? '', $STATUSES, true) ? $_POST['status'] : 'new',
                ]);
            set_flash('«' . $nombre . '» quedó registrado.');
        }
        redirect('/panel/?p=leads');
    }
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
  <div><div class="kicker">Ventas</div><h1 class="title">Leads</h1><p class="subt"><?= count($rows) ?> mostrados · <?= $counts['all'] ?> en total</p></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <a class="btn ghost" href="/panel/?p=leads&export=csv">Exportar CSV</a>
    <a class="btn" href="/panel/?p=leads&nuevo=1#nuevo">+ Registrar uno</a>
  </div>
</div>

<?php if (isset($_GET['nuevo'])): ?>
<div class="card" id="nuevo">
  <div class="form-sec" style="margin-top:0">
    <b>Registrar un lead a mano</b>
    <span>Para quien escribió por WhatsApp, llamó o te buscó fuera del sitio</span>
  </div>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= $ct ?>">
    <input type="hidden" name="action" value="crear">
    <div class="rowf">
      <div><label>Nombre</label><input type="text" name="name" required autofocus></div>
      <div><label>Teléfono</label><input type="text" name="phone" placeholder="449 120 4353"></div>
    </div>
    <div class="rowf">
      <div><label>Correo</label><input type="text" name="email"></div>
      <div><label>Empresa</label><input type="text" name="company"></div>
    </div>
    <div class="rowf">
      <div><label>Qué le interesa</label><input type="text" name="service" placeholder="IA de Ventas, tablero…"></div>
      <div>
        <label>Cómo llegó</label>
        <select name="source">
          <option>WhatsApp</option>
          <option>Llamada</option>
          <option>Ficha de Google</option>
          <option>Recomendación</option>
          <option>Presencial</option>
          <option>Otro</option>
        </select>
      </div>
    </div>
    <div class="rowf" style="grid-template-columns:1fr">
      <div>
        <label>Qué pidió</label>
        <textarea name="message" placeholder="Lo que te escribió, con sus palabras."></textarea>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;gap:10px">
      <button class="btn" type="submit">Guardar</button>
      <a class="btn ghost" href="/panel/?p=leads">Cancelar</a>
    </div>
  </form>
</div>
<?php endif; ?>

<?php $CEST = ['all'=>'#9a97ad','new'=>'#8ea6ff','contacted'=>'#ffcf7a','qualified'=>'#c3a0ff','converted'=>'#5fe0a0','lost'=>'#ff8fa6']; ?>
<div style="margin-bottom:16px">
  <?php foreach (['all'=>'Todos']+$LB as $k=>$lab): ?>
    <a class="chip <?= $f===$k?'active':'' ?>" href="/panel/?p=leads&f=<?= $k ?>"><span class="pt-est" style="background:<?= $CEST[$k] ?>"></span><?= e($lab) ?> (<?= $counts[$k]??0 ?>)</a>
  <?php endforeach; ?>
</div>
<form method="get" style="margin-bottom:20px;display:flex;gap:10px">
  <input type="hidden" name="p" value="leads"><input type="hidden" name="f" value="<?= e($f) ?>">
  <input type="text" name="q" value="<?= e($q) ?>" placeholder="Buscar por nombre, email, empresa, teléfono…">
  <button class="btn ghost" type="submit">Buscar</button>
</form>

<?php if (!$rows): ?><div class="card"><p class="muted" style="text-align:center;padding:30px 0">No hay leads con este filtro.</p></div><?php endif; ?>

<style>
  /* El color del estado entra por --est y se usa en un filete a la izquierda.
     Antes iba en un circulo con la inicial del nombre: una letra dentro de un
     cuadro no dice nada que el nombre de al lado no diga ya. */
  .lead{background:var(--card);border:1px solid var(--line);border-left:2px solid var(--est);
    border-radius:14px;padding:20px 22px;margin-bottom:14px;transition:border-color .18s}
  .lead:hover{border-color:var(--line2);border-left-color:var(--est)}
  .lead-cab{display:flex;align-items:flex-start;gap:16px;margin-bottom:4px}
  .lead-cab h3{margin:0;font-size:16px;letter-spacing:.01em}
  .lead-est{margin-left:auto;flex:none;font-size:11px;font-weight:700;color:var(--est);
    text-transform:uppercase;letter-spacing:.1em;padding-top:3px}
  .lead-meta{font-size:12px;color:var(--mut2);margin-top:4px}
  /* Cita, no caja rellena: el mensaje es la voz de la persona. */
  /* Sin relleno ni esquinas: el encabezado del panel le pone fondo y radio a
     .lead-msg, y una caja gris dentro de otra caja gris solo suma bordes. */
  .lead-msg{background:none;border-radius:0;border-left:2px solid var(--line2);
    padding:2px 0 2px 16px;margin:16px 0 0;color:var(--txt);
    font-size:13.5px;line-height:1.7;white-space:pre-line}
  .lead-vias{display:flex;gap:18px;flex-wrap:wrap;margin-top:14px;font-size:13px}
  .lead-vias a{color:#b58bff;text-decoration:none}
  .lead-vias a:hover{text-decoration:underline}
  .lead-vias .falta{color:var(--mut2)}
  .lead-pie{display:flex;gap:8px;align-items:center;flex-wrap:wrap;
    margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}
  .lead-pie select{width:auto;padding:7px 11px;font-size:12.5px}
  .lead-pie .aparte{margin-left:auto}
  /* Borrar en voz baja: sin WhatsApp ni correo era el unico boton de la
     tarjeta y se leia como la accion principal. Solo se enciende al pasar. */
  .lead-pie .borrar{border-color:var(--line);color:var(--mut2)}
  .lead-pie .borrar:hover{border-color:#b3324f;color:#ff7d9c}
  .lead-notas{margin-top:14px}
  .lead-notas summary{cursor:pointer;font-size:12px;color:var(--mut2);list-style:none;display:flex;align-items:center;gap:7px}
  .lead-notas summary::-webkit-details-marker{display:none}
  .lead-notas summary::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--line2)}
  /* Un punto morado avisa de que hay nota, sin tener que abrirla. */
  .lead-notas.hay summary::before{background:var(--pur3)}
  .lead-notas.hay summary{color:var(--mut)}
  .lead-notas textarea{min-height:74px;margin-top:10px;font-size:13px}
  @media(max-width:640px){ .lead{padding:16px} .lead-pie .aparte{margin-left:0} }
</style>

<?php foreach ($rows as $l): $id = (int)$l['id'];
  $ce   = $CEST[$l['status']] ?? '#9a97ad';
  /* Se arma solo con lo que existe: pegar campos vacios con « · » dejaba
     puntos sueltos bajo el nombre. */
  $meta = array_filter([
    date('d/m/Y H:i', strtotime((string)$l['created_at'])),
    trim((string)$l['source']),
    trim((string)$l['company']),
  ], fn($x) => $x !== '');
  $tel    = preg_replace('/\D/', '', (string)$l['phone']);
  $hayTel = strlen($tel) >= 10;
  $correo = trim((string)$l['email']);
  $nota   = trim((string)($l['notes'] ?? ''));
?>
<article class="lead" style="--est:<?= e($ce) ?>">
  <div class="lead-cab">
    <div style="min-width:0">
      <h3><?= e($l['name']) ?></h3>
      <div class="lead-meta"><?= e(implode(' · ', $meta)) ?></div>
    </div>
    <span class="lead-est"><?= e($LB[$l['status']] ?? $l['status']) ?></span>
  </div>

  <?php if (trim((string)$l['message']) !== ''): ?>
    <blockquote class="lead-msg"><?= e($l['message']) ?></blockquote>
  <?php endif; ?>

  <div class="lead-vias">
    <?php if ($hayTel): ?>
      <a href="tel:+<?= e(strlen($tel) === 10 ? '52' . $tel : $tel) ?>"><?= e(tel_bonito($tel)) ?></a>
    <?php else: ?>
      <span class="falta">Sin teléfono</span>
    <?php endif; ?>
    <?php if ($correo !== ''): ?>
      <a href="mailto:<?= e($correo) ?>"><?= e($correo) ?></a>
    <?php endif; ?>
    <?php if (trim((string)$l['service']) !== ''): ?>
      <span class="falta">Le interesa: <?= e($l['service']) ?></span>
    <?php endif; ?>
  </div>

  <div class="lead-pie">
    <form method="post" style="display:contents">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="action" value="update_status">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="f" value="<?= e($f) ?>">
      <?php /* Cambiar el estado guarda solo: el boton «Guardar» de al lado
               era un paso de mas para una lista de cinco opciones. */ ?>
      <select name="status" onchange="this.form.requestSubmit ? this.form.requestSubmit() : this.form.submit()">
        <?php foreach ($STATUSES as $st): ?>
          <option value="<?= $st ?>" <?= $l['status'] === $st ? 'selected' : '' ?>><?= e($LB[$st]) ?></option>
        <?php endforeach; ?>
      </select>
    </form>

    <?php /* Una sola accion principal: lo que de verdad se hace con un lead
             es escribirle. Lo demas queda en voz baja. */ ?>
    <?php if ($hayTel): ?>
      <a class="btn small green" target="_blank" rel="noopener" href="<?= e(wa_link($l['phone'])) ?>">Escribir por WhatsApp</a>
    <?php endif; ?>
    <?php if ($correo !== ''): ?>
      <a class="btn small ghost" href="mailto:<?= e($correo) ?>">Correo</a>
    <?php endif; ?>

    <form method="post" class="aparte" onsubmit="return confirm('¿Borrar a <?= e(addslashes($l['name'])) ?>? No se puede deshacer.')">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="action" value="delete">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="f" value="<?= e($f) ?>">
      <button class="btn small danger borrar" type="submit">Borrar</button>
    </form>
  </div>

  <details class="lead-notas <?= $nota !== '' ? 'hay' : '' ?>" <?= $nota !== '' ? 'open' : '' ?>>
    <summary><?= $nota !== '' ? 'Notas internas' : 'Añadir una nota' ?></summary>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="action" value="note">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="f" value="<?= e($f) ?>">
      <textarea name="notes" placeholder="Lo que sepas de este prospecto y no esté arriba…"><?= e($nota) ?></textarea>
      <button class="btn small ghost" type="submit" style="margin-top:10px">Guardar nota</button>
    </form>
  </details>
</article>
<?php endforeach; ?>
