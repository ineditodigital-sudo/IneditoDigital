<?php
/** Motor CRUD genérico para módulos de contenido. */
function crud(string $page, array $c): void {
    $table  = $c['table'];
    $fields = $c['fields']; // name => ['label','type'=>text|textarea|select|date, 'opts'=>[], 'help'=>'', 'wide'=>bool]

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        csrf_check();
        $act = $_POST['action'] ?? '';
        if ($act === 'delete') {
            db()->prepare("DELETE FROM `$table` WHERE id=:id")->execute([':id' => (int)($_POST['id'] ?? 0)]);
            set_flash('Elemento borrado.'); redirect("/panel/?p=$page");
        }
        if ($act === 'save') {
            $cols = []; $par = [];
            foreach ($fields as $k => $f) { $cols[] = $k; $val = trim((string)($_POST[$k] ?? '')); if (($f['type'] ?? '')==='date' && $val==='') $val = null; $par[":$k"] = $val; }
            if (isset($par[':slug'])) {
                $par[':slug'] = $par[':slug'] !== '' ? slugify($par[':slug']) : slugify((string)($_POST[$c['title_field'] ?? 'title'] ?? ''));
            }
            $id = (int)($_POST['id'] ?? 0);
            if ($id) {
                $set = implode(',', array_map(fn($col) => "`$col`=:$col", $cols));
                $par[':id'] = $id;
                db()->prepare("UPDATE `$table` SET $set WHERE id=:id")->execute($par);
                set_flash('Cambios guardados.');
            } else {
                $colStr = implode(',', array_map(fn($col) => "`$col`", $cols));
                $valStr = implode(',', array_map(fn($col) => ":$col", $cols));
                db()->prepare("INSERT INTO `$table` ($colStr) VALUES ($valStr)")->execute($par);
                set_flash('Creado correctamente.');
            }
            redirect("/panel/?p=$page");
        }
    }

    $ct = csrf();
    $editId = isset($_GET['edit']) ? (int)$_GET['edit'] : 0;
    $isForm = $editId || isset($_GET['new']);

    if ($isForm) {
        $row = $editId ? (db()->query("SELECT * FROM `$table` WHERE id=".$editId)->fetch() ?: []) : [];
        ?>
        <div class="topbar"><div><div class="kicker">Contenido del sitio</div><h1 class="title"><?= $editId?'Editar':'Nuevo' ?> · <?= e($c['single']) ?></h1>
        <p class="subt"><a href="/panel/?p=contenido&t=<?= $page ?>" style="color:#b58bff">← Volver a Contenido</a></p></div></div>
        <form method="post" class="card">
          <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="save">
          <?php if ($editId): ?><input type="hidden" name="id" value="<?= $editId ?>"><?php endif; ?>
          <div class="rowf">
          <?php $i=0; foreach ($fields as $k=>$f): $val=$row[$k]??''; $wide=!empty($f['wide']); if($wide) echo '</div><div class="rowf" style="grid-template-columns:1fr">'; ?>
            <div>
              <label><?= e($f['label']) ?></label>
              <?php if(($f['type']??'text')==='textarea'): ?>
                <textarea name="<?= $k ?>" <?= $wide?'style="min-height:150px"':'' ?>><?= e($val) ?></textarea>
              <?php elseif(($f['type']??'')==='select'): ?>
                <select name="<?= $k ?>"><?php foreach($f['opts'] as $ov=>$ol): ?><option value="<?= e($ov) ?>" <?= (string)$val===(string)$ov?'selected':'' ?>><?= e($ol) ?></option><?php endforeach; ?></select>
              <?php elseif(($f['type']??'')==='date'): ?>
                <input type="date" name="<?= $k ?>" value="<?= e($val) ?>">
              <?php elseif (stripos($k, 'image') !== false || stripos($k, 'logo') !== false): ?>
                <div style="display:flex;gap:12px;align-items:flex-start">
                  <div data-prev="<?= $k ?>" style="flex:0 0 78px;height:56px;border-radius:10px;border:1px solid var(--line);background:#0b0b12 center/cover no-repeat;<?= $val !== '' ? 'background-image:url(' . e($val) . ');' : '' ?>"></div>
                  <input type="text" name="<?= $k ?>" value="<?= e($val) ?>" style="flex:1"
                         oninput="var c=document.querySelector('[data-prev=&quot;<?= $k ?>&quot;]'); if(c) c.style.backgroundImage=this.value.trim()?'url('+this.value.trim()+')':'';">
                </div>
              <?php else: ?>
                <input type="text" name="<?= $k ?>" value="<?= e($val) ?>">
              <?php endif; ?>
              <?php if(!empty($f['help'])): ?><div class="mini" style="margin-top:4px"><?= e($f['help']) ?></div><?php endif; ?>
            </div>
          <?php $i++; endforeach; ?>
          </div>
          <div style="margin-top:22px"><button class="btn" type="submit">Guardar</button>
          <a class="btn ghost" href="/panel/?p=<?= $page ?>" style="margin-left:8px">Cancelar</a></div>
        </form>
        <?php
        return;
    }

    // LISTA
    $rows = db()->query("SELECT * FROM `$table` ORDER BY id DESC")->fetchAll();
    $tf = $c['title_field'] ?? 'title';
    ?>
    <div class="topbar"><div><div class="kicker">Contenido del sitio</div><h1 class="title"><?= e($c['plural']) ?></h1><p class="subt"><?= count($rows) ?> registrados · se guardan en la base de datos</p></div>
    <a class="btn" href="/panel/?p=<?= $page ?>&new=1">+ Nuevo</a></div>
    <?php if (!empty($c['note'])): ?><div class="card" style="border-color:#3a2f12;background:#191305"><div class="mini" style="color:#e0c07a"><?= e($c['note']) ?></div></div><?php endif; ?>
    <?php if (!$rows): ?><div class="card"><p class="muted" style="text-align:center;padding:30px 0">Aún no hay registros. Crea el primero con "+ Nuevo".</p></div>
    <?php else: ?>
    <div class="pgrid">
    <?php
      $rutas = ['blog' => '/blog/', 'portafolio' => '/portafolio/', 'servicios' => '/servicios/'];
      foreach ($rows as $r):
        $pub = ($r['status'] ?? 'draft') === 'published';
        $slug = trim((string)($r['slug'] ?? ''));
        $ruta = ($slug !== '' && isset($rutas[$page])) ? $rutas[$page] . $slug : '';
        echo pcard([
          'nombre'  => $r[$tf] ?? '—',
          'sub'     => $ruta ?: '—',
          'href'    => "/panel/?p=$page&edit=" . (int)$r['id'],
          'ver'     => $pub ? $ruta : '',
          'ayuda'   => (string)($r['short_desc'] ?? $r['excerpt'] ?? ''),
          'pie'     => (!empty($c['sub_field']) && !empty($r[$c['sub_field']]) ? $r[$c['sub_field']] : $c['single'])
                       . ' · ' . ($pub ? 'en línea' : 'sin publicar'),
          'foto'    => $r['image'] ?? '',
          'semilla' => $page . $r['id'],
          'badge'   => '<span class="badge b-' . ($pub ? 'published' : 'draft') . '">' . ($pub ? 'Publicado' : 'Borrador') . '</span>',
        ]);
      endforeach;
    ?>
    </div>
    <?php endif;
}
