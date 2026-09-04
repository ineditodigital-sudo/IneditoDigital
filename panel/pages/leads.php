<?php
$STATUSES = ['new','contacted','qualified','converted','lost'];
$LB = ['new'=>'Nuevo','contacted'=>'Contactado','qualified'=>'Calificado','converted'=>'Convertido','lost'=>'Perdido'];
/**
 * Cuanto lleva esperando.
 *
 * Un lead no se lee por su fecha, se lee por su antiguedad: «hace 20 min» y
 * «hace 6 dias» piden cosas distintas, y «03/09/2026 12:48» no pide nada.
 * Pasada la semana la fecha vuelve a ser lo util.
 */
function espera(string $cuando): array {
    $t = strtotime($cuando);
    $seg = time() - $t;
    if ($seg < 90)      return ['ahora mismo', 'urge'];
    if ($seg < 3600)    return ['hace ' . (int)round($seg / 60) . ' min', 'urge'];
    if ($seg < 86400)   { $h = (int)round($seg / 3600); return ['hace ' . $h . ' h', $h <= 4 ? 'urge' : 'hoy']; }
    if ($seg < 172800)  return ['ayer', 'viejo'];
    if ($seg < 604800)  return ['hace ' . (int)round($seg / 86400) . ' días', 'viejo'];
    return [date('d/m/Y', $t), 'viejo'];
}

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
            /* Tambien avisa: quien captura no suele ser quien da
               seguimiento, y el correo es el registro que le llega al resto
               del equipo. Si el envio falla, el lead ya esta guardado. */
            $aviso = '';
            try {
                $lead = [
                    'name'    => $nombre,
                    'email'   => trim((string)($_POST['email'] ?? '')),
                    'phone'   => trim((string)($_POST['phone'] ?? '')),
                    'company' => trim((string)($_POST['company'] ?? '')),
                    'service' => trim((string)($_POST['service'] ?? '')),
                    'message' => trim((string)($_POST['message'] ?? '')),
                    'source'  => trim((string)($_POST['source'] ?? '')) ?: 'Capturado a mano',
                    'fecha'   => date('Y-m-d H:i:s'),
                ];
                require_once dirname(__DIR__, 2) . '/api/mailer.php';
                require_once dirname(__DIR__, 2) . '/api/email_template.php';
                $r = send_lead_email($GLOBALS['cfg'], $lead, lead_email_html($lead),
                        'Nuevo prospecto: ' . $nombre . ($lead['company'] !== '' ? ' · ' . $lead['company'] : ''),
                        lead_email_texto($lead));
                $aviso = $r['ok'] ? ' El equipo ya recibió el aviso.' : ' (el aviso por correo no salió)';
            } catch (Throwable $e) { /* el lead ya quedó guardado */ }
            set_flash('«' . $nombre . '» quedó registrado.' . $aviso);
        }
        redirect('/panel/?p=leads');
    }
    if ($id > 0) {
        if ($act === 'update_status' && in_array($_POST['status'] ?? '', $STATUSES, true)) {
            db()->prepare('UPDATE leads SET status=:s WHERE id=:id')->execute([':s'=>$_POST['status'], ':id'=>$id]);
            set_flash('Estado actualizado.');
        } elseif ($act === 'contacto') {
            /* Un lead que llego por WhatsApp o por telefono entra sin sus
               datos: hay que poder anotarlos donde se esta mirando. */
            db()->prepare('UPDATE leads SET phone=:t, email=:e WHERE id=:id')
                ->execute([
                    ':t'  => trim((string)($_POST['phone'] ?? '')),
                    ':e'  => trim((string)($_POST['email'] ?? '')),
                    ':id' => $id,
                ]);
            set_flash('Datos de contacto guardados.');
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
<?php
/* Cuantos estan esperando respuesta. Es el unico numero que importa al
   abrir esta pantalla, asi que va en el subtitulo y no en un contador mas. */
$esperando = ($counts['new'] ?? 0) + ($counts['contacted'] ?? 0);
?>
<div class="topbar">
  <div>
    <h1 class="title">Leads</h1>
    <p class="subt">
      <?php if ($counts['all'] === 0): ?>
        Aquí caen las personas que escriben desde el sitio.
      <?php elseif ($esperando > 0): ?>
        <strong style="color:var(--txt)"><?= $esperando ?></strong>
        <?= $esperando === 1 ? 'espera respuesta' : 'esperan respuesta' ?>
        · <?= $counts['all'] ?> en total
      <?php else: ?>
        Nadie esperando · <?= $counts['all'] ?> en total
      <?php endif; ?>
    </p>
  </div>
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
<div class="filtros">
  <?php foreach (['all'=>'Todos']+$LB as $k=>$lab): ?>
    <a class="chip <?= $f===$k?'active':'' ?>" href="/panel/?p=leads&f=<?= $k ?>"><span class="pt-est" style="background:<?= $CEST[$k] ?>"></span><?= e($lab) ?> (<?= $counts[$k]??0 ?>)</a>
  <?php endforeach; ?>
</div>
<script>
  /* Si el filtro activo quedo fuera de la tira, no se ve cual esta puesto.
     Se mueve el scroll del contenedor y no la pagina: scrollIntoView
     arrastraria tambien el vertical. */
  (function () {
    var a = document.querySelector('.filtros .chip.active');
    if (a && a.parentElement.scrollWidth > a.parentElement.clientWidth) {
      a.parentElement.scrollLeft = Math.max(0, a.offsetLeft - 16);
    }
  })();
</script>

<form method="get" class="buscador" style="margin-bottom:20px;display:flex;gap:10px">
  <input type="hidden" name="p" value="leads"><input type="hidden" name="f" value="<?= e($f) ?>">
  <input type="text" name="q" value="<?= e($q) ?>" placeholder="Buscar por nombre, email, empresa, teléfono…">
  <button class="btn ghost" type="submit">Buscar</button>
</form>

<?php if (!$rows): ?>
  <div class="vacio">
    <?php if ($counts['all'] === 0): ?>
      <p>Todavía no ha escrito nadie.</p>
      <p class="mini">Cuando alguien complete el asistente del sitio o envíe el formulario de contacto,
      aparece aquí con lo que pidió y desde qué página. Si te escriben por WhatsApp o te llaman,
      regístralo con «Registrar uno» para que no se quede solo en el teléfono.</p>
    <?php else: ?>
      <p>Ninguno con este filtro.</p>
      <p class="mini"><a href="/panel/?p=leads">Ver todos</a></p>
    <?php endif; ?>
  </div>
<?php endif; ?>

<style>
  /* Una bandeja, no una galeria de tarjetas.
     Sin recuadro por prospecto y sin filete de color por estado: cada uno es
     un renglon de trabajo separado por un pelo, como el resto del panel. */
  .bandeja{border-top:1px solid var(--line)}
  .lead{display:block;padding:20px 4px 20px 0;border-bottom:1px solid var(--line);transition:background .15s}
  .lead:hover{background:rgba(153,51,255,.035)}
  .lead-cab{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
  .lead-nom{font-size:15px;font-weight:600;color:var(--txt);letter-spacing:.005em}
  /* Sin contestar pesa mas, como un correo sin abrir. */
  .lead.sin .lead-nom{font-weight:800}
  .lead-espera{font-size:12.5px;color:var(--mut2)}
  .lead.sin .lead-espera{color:var(--mut)}
  .lead-espera.urge{color:var(--pur3)}
  .lead-via{font-size:12.5px;color:var(--mut2)}
  .lead-est{margin-left:auto;display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--mut)}
  .lead-est i{width:6px;height:6px;border-radius:50%;background:var(--est);flex:none}
  /* El mensaje es lo que se viene a leer: va en el color del texto y con
     medida de lectura, no dentro de una caja. */
  .lead-txt{margin:10px 0 0;max-width:68ch;font-size:14px;line-height:1.65;color:var(--txt);white-space:pre-line}
  .lead-datos{margin-top:9px;font-size:12.5px;color:var(--mut2);display:flex;gap:16px;flex-wrap:wrap}
  .lead-datos a{color:#a982f0;text-decoration:none}
  .lead-datos a:hover{text-decoration:underline}
  .lead-acc{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px}
  .lead-acc select{width:auto;padding:6px 10px;font-size:12.5px}
  .lead-acc .aparte{margin-left:auto}
  .lead-acc .apagado{border-color:var(--line);color:var(--mut2)}
  .lead-acc .apagado:hover{border-color:#b3324f;color:#ff7d9c}
  /* Pedir el dato que falta donde se nota que falta, con la misma forma que
     un boton apagado para que se lea como una accion mas de la fila. */
  .lead-mas{display:inline-block}
  .lead-mas > summary{cursor:pointer;list-style:none;display:inline-flex;align-items:center;gap:7px;
    border:1px solid var(--line2);color:var(--mut);border-radius:999px;padding:7px 14px;font-size:12px;
    transition:border-color .18s,color .18s}
  .lead-mas > summary::-webkit-details-marker{display:none}
  .lead-mas > summary:hover{border-color:rgba(153,51,255,.5);color:var(--txt)}
  .lead-mas[open] > summary{border-color:var(--line);color:var(--mut2)}
  .lead-campos{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}
  .lead-campos input{width:auto;min-width:180px;padding:8px 11px;font-size:13px}
  .lead-nota{margin-top:12px}
  .lead-nota summary{cursor:pointer;font-size:12px;color:var(--mut2);list-style:none;
    display:inline-flex;align-items:center;gap:7px;padding:2px 0}
  .lead-nota summary::-webkit-details-marker{display:none}
  .lead-nota summary::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--line2)}
  .lead-nota.hay summary::before{background:var(--pur3)}
  .lead-nota.hay summary{color:var(--mut)}
  .lead-nota textarea{min-height:76px;margin-top:10px;font-size:13px;max-width:68ch}
  .vacio{padding:56px 0 64px;max-width:56ch}
  .vacio p{margin:0 0 10px;font-size:15px;color:var(--txt)}
  .vacio p.mini{font-size:13px;line-height:1.7;color:var(--mut)}
  .vacio a{color:#a982f0}
  @media(max-width:640px){
    .lead-est{margin-left:0;width:100%}
    /* «Borrar» deja de irse al extremo: pegado al resto en una fila que ya
       se envuelve, quedaba solo y demasiado a mano. */
    .lead-acc{gap:10px}
    /* Se envuelven en fila, no se apilan: tres renglones de controles por
       persona convertian la lista en un formulario. «Borrar» conserva su
       esquina derecha para no quedar a mano. */
    /* Lo que se toca llega a 44px, que es donde un pulgar deja de fallar.
       El padding va repetido aqui a proposito: «.lead-acc select» es mas
       especifico que la regla movil de «select» del panel y la ganaba, asi
       que el desplegable se quedaba en 32px mientras todo lo demas crecia. */
    .lead-acc select{flex:1 1 150px;min-width:0;padding:12px 14px;font-size:15px}
    .lead-mas > summary{padding:12px 16px}
    .lead-nota summary{padding:14px 0}
    .lead-acc .aparte{margin-left:auto}
    .lead-campos input{min-width:0;width:100%}
    .lead-txt{font-size:14.5px}
    /* El buscador ocupa el ancho y el boton se pone debajo: apretados al
       lado, el campo no dejaba leer ni lo que uno escribe. */
    .buscador{flex-wrap:wrap}
    .buscador input{flex:1 1 100%}
    .buscador .btn{margin-left:auto}
  }
</style>

<div class="bandeja">
<?php foreach ($rows as $l): $id = (int)$l['id'];
  $ce = $CEST[$l['status']] ?? '#9a97ad';
  [$hace, $urgencia] = espera((string)$l['created_at']);
  $sinContestar = in_array($l['status'], ['new', 'contacted'], true);
  $tel    = preg_replace('/\D/', '', (string)$l['phone']);
  $hayTel = strlen($tel) >= 10;
  $correo = trim((string)$l['email']);
  $nota   = trim((string)($l['notes'] ?? ''));
  $via    = array_filter([trim((string)$l['source']), trim((string)$l['company'])], fn($x) => $x !== '');
?>
<article class="lead <?= $sinContestar ? 'sin' : '' ?>" style="--est:<?= e($ce) ?>">
  <div class="lead-cab">
    <span class="lead-nom"><?= e($l['name']) ?></span>
    <time class="lead-espera <?= e($urgencia === 'urge' && $sinContestar ? 'urge' : '') ?>"
          datetime="<?= e(date('c', strtotime((string)$l['created_at']))) ?>"
          title="<?= e(date('d/m/Y H:i', strtotime((string)$l['created_at']))) ?>"><?= e($hace) ?></time>
    <?php if ($via): ?><span class="lead-via"><?= e(implode(' · ', $via)) ?></span><?php endif; ?>
    <span class="lead-est"><i></i><?= e($LB[$l['status']] ?? $l['status']) ?></span>
  </div>

  <?php if (trim((string)$l['message']) !== ''): ?>
    <?php /* Entero y con sus saltos de linea: recortado a 190 caracteres se
             perdia justo el final, que es donde la gente pone lo que quiere. */ ?>
    <p class="lead-txt"><?= e(trim((string)$l['message'])) ?></p>
  <?php endif; ?>

  <div class="lead-datos">
    <?php if ($hayTel): ?>
      <a class="tabular" href="tel:+<?= e(strlen($tel) === 10 ? '52' . $tel : $tel) ?>"><?= e(tel_bonito($tel)) ?></a>
    <?php else: ?>
      <span>Sin teléfono</span>
    <?php endif; ?>
    <?php if ($correo !== ''): ?><a href="mailto:<?= e($correo) ?>"><?= e($correo) ?></a><?php endif; ?>
    <?php if (trim((string)$l['service']) !== ''): ?><span>Le interesa: <?= e($l['service']) ?></span><?php endif; ?>
  </div>

  <div class="lead-acc">
    <?php if ($hayTel): ?>
      <a class="btn small green" target="_blank" rel="noopener" href="<?= e(wa_link($l['phone'])) ?>">Escribir por WhatsApp</a>
    <?php endif; ?>
    <?php if ($correo !== ''): ?>
      <a class="btn small ghost" href="mailto:<?= e($correo) ?>">Correo</a>
    <?php endif; ?>
    <?php if (!$hayTel || $correo === ''): ?>
      <details class="lead-mas">
        <summary><?= $hayTel ? 'Añadir correo' : 'Añadir teléfono' ?></summary>
        <form method="post" class="lead-campos">
          <input type="hidden" name="csrf" value="<?= $ct ?>">
          <input type="hidden" name="action" value="contacto">
          <input type="hidden" name="id" value="<?= $id ?>">
          <input type="hidden" name="f" value="<?= e($f) ?>">
          <input type="text" name="phone" value="<?= e($l['phone']) ?>" placeholder="Teléfono"
                 aria-label="Teléfono de <?= e($l['name']) ?>" <?= $hayTel ? '' : 'autofocus' ?>>
          <input type="text" name="email" value="<?= e($correo) ?>" placeholder="Correo"
                 aria-label="Correo de <?= e($l['name']) ?>">
          <button class="btn small" type="submit">Guardar</button>
        </form>
      </details>
    <?php endif; ?>

    <form method="post" style="display:contents">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="action" value="update_status">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="f" value="<?= e($f) ?>">
      <?php /* Cambiar el estado guarda solo: un boton al lado era un paso de
               mas para elegir entre cinco opciones. */ ?>
      <select name="status" aria-label="Estado de <?= e($l['name']) ?>"
              onchange="this.form.requestSubmit ? this.form.requestSubmit() : this.form.submit()">
        <?php foreach ($STATUSES as $st): ?>
          <option value="<?= $st ?>" <?= $l['status'] === $st ? 'selected' : '' ?>><?= e($LB[$st]) ?></option>
        <?php endforeach; ?>
      </select>
    </form>

    <form method="post" class="aparte" onsubmit="return confirm('¿Borrar a <?= e(addslashes($l['name'])) ?>? No se puede deshacer.')">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="action" value="delete">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="f" value="<?= e($f) ?>">
      <button class="btn small danger apagado" type="submit">Borrar</button>
    </form>
  </div>

  <details class="lead-nota <?= $nota !== '' ? 'hay' : '' ?>">
    <summary><?= $nota !== '' ? 'Nota interna' : 'Añadir una nota' ?></summary>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $ct ?>">
      <input type="hidden" name="action" value="note">
      <input type="hidden" name="id" value="<?= $id ?>">
      <input type="hidden" name="f" value="<?= e($f) ?>">
      <textarea name="notes" placeholder="Lo que sepas de esta persona y no esté arriba…"><?= e($nota) ?></textarea>
      <button class="btn small ghost" type="submit" style="margin-top:10px">Guardar nota</button>
    </form>
  </details>
</article>
<?php endforeach; ?>
</div>
