<?php
/**
 * Motor CRUD de los módulos de contenido (Portafolio, Servicios, Blog).
 *
 * Por qué guarda en dos sitios a la vez
 * ------------------------------------
 * Cada ficha vive repartida: unas columnas de MySQL (`title`, `short_desc`…)
 * y un `data_json` con el detalle completo. El sitio arranca del `data_json`
 * y solo deja que unas pocas columnas lo pisen. El panel, en cambio, escribía
 * únicamente columnas.
 *
 * El resultado era una trampa silenciosa: editabas «Reto / problema», el panel
 * decía «Cambios guardados», y el sitio seguía mostrando el texto viejo —
 * porque leía el del `data_json`, que nadie había tocado. Y al revés: campos
 * que el sitio sí muestra (el sitio web del cliente, el año, los servicios
 * aplicados) no aparecían en ningún formulario porque no tenían columna.
 *
 * Ahora cada campo declara con `json` a qué clave del `data_json` corresponde,
 * y al guardar se escriben las dos copias. Deja de existir un lado que gane:
 * siempre coinciden. Un campo sin columna (`'col' => false`) vive solo en el
 * `data_json`, que es justo lo que el sitio lee.
 *
 * Definición de un campo
 * ----------------------
 *   'label'  texto de la etiqueta
 *   'type'   texto | area | select | fecha | lista | pares | imagen | numero
 *   'json'   clave del data_json; admite ruta con punto ('seo.metaTitle')
 *   'col'    false si el campo no tiene columna en la tabla
 *   'grupo'  título del bloque del formulario donde se agrupa
 *   'help'   nota bajo el campo
 *   'wide'   ocupa el ancho completo
 *   'sep'    en 'lista': 'lineas' (por defecto) o 'comas', para la columna
 *   'claves' en 'pares': ['clave' => 'Etiqueta', …] de cada renglón
 *   'auto'   en 'pares': clave que se numera sola (1, 2, 3…)
 *   'opciones'   en 'pares': ['clave' => ['valor' => 'Etiqueta', …]]: esa
 *                clave se elige de un menú en vez de escribirse
 *   'anchos'     en 'pares': ['clave' => 2, …] lo que ocupa cada una en su
 *                renglón (1 si no se dice)
 *   'largos'     en 'pares': claves que van en un cuadro de varias líneas
 *   'requeridas' en 'pares': claves sin las que el renglón no se guarda
 *   'respaldo'   function ($row, $json): lo que enseña el formulario cuando
 *                el data_json todavía no tiene esa clave. Una lista vaciada
 *                a propósito se queda vacía: solo cuenta si la clave falta.
 */

require_once __DIR__ . '/indexnow.php';

/** Un texto por línea → arreglo. */
function crud_lineas($s): array {
    $s = trim((string)$s);
    if ($s === '') return [];
    return array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $s)), fn($x) => $x !== ''));
}

/** Lee una ruta con puntos dentro de un arreglo anidado. */
function crud_leer(array $a, string $ruta) {
    foreach (explode('.', $ruta) as $p) {
        if (!is_array($a) || !array_key_exists($p, $a)) return null;
        $a = $a[$p];
    }
    return $a;
}

/** Escribe una ruta con puntos dentro de un arreglo anidado. */
function crud_poner(array &$a, string $ruta, $val): void {
    $p = explode('.', $ruta);
    $ult = array_pop($p);
    $ref = &$a;
    foreach ($p as $k) {
        if (!isset($ref[$k]) || !is_array($ref[$k])) $ref[$k] = [];
        $ref = &$ref[$k];
    }
    $ref[$ult] = $val;
}

/** El valor de un campo tal como lo va a ver el formulario. */
function crud_valor(array $f, array $row, array $json) {
    $tipo = $f['type'] ?? 'texto';
    /* El data_json manda porque es de donde arranca el sitio. La columna
       solo entra si el data_json no tiene nada que decir. */
    foreach ((array)($f['json'] ?? []) as $ruta) {
        $v = crud_leer($json, $ruta);
        if ($v !== null && $v !== '' && $v !== []) return $v;
    }
    if (isset($f['respaldo']) && is_callable($f['respaldo'])) {
        $existe = false;
        foreach ((array)($f['json'] ?? []) as $ruta) if (crud_leer($json, $ruta) !== null) $existe = true;
        if (!$existe) return ($f['respaldo'])($row, $json);
    }
    if (($f['col'] ?? true) === false) return $tipo === 'lista' || $tipo === 'pares' ? [] : '';
    $col = $row[$f['nombre']] ?? '';
    if ($tipo === 'lista') return ($f['sep'] ?? 'lineas') === 'comas'
        ? array_values(array_filter(array_map('trim', explode(',', (string)$col)), fn($x) => $x !== ''))
        : crud_lineas($col);
    if ($tipo === 'pares') {
        $out = []; $claves = array_keys($f['claves'] ?? []);
        foreach (crud_lineas($col) as $ln) {
            $t = explode(':', $ln, 2);
            $fila = [];
            foreach ($claves as $i => $c) $fila[$c] = trim($t[$i] ?? '');
            $out[] = $fila;
        }
        return $out;
    }
    return $col;
}

/** Cómo se guarda un valor en su columna de texto. */
function crud_a_columna(array $f, $val): string {
    $tipo = $f['type'] ?? 'texto';
    if ($tipo === 'lista') {
        return ($f['sep'] ?? 'lineas') === 'comas' ? implode(', ', $val) : implode("\n", $val);
    }
    if ($tipo === 'pares') {
        $claves = array_keys($f['claves'] ?? []);
        $ls = [];
        foreach ($val as $fila) {
            $partes = [];
            foreach ($claves as $c) if (($f['auto'] ?? '') !== $c) $partes[] = (string)($fila[$c] ?? '');
            $ls[] = implode(': ', $partes);
        }
        return implode("\n", $ls);
    }
    return (string)$val;
}


/**
 * Avisa a los buscadores de la ficha recién guardada, si está publicada.
 *
 * Devuelve el texto que se añade al mensaje del panel, para que quien guarda
 * vea que el aviso salió —o por qué no—. Nunca interrumpe el guardado: el
 * contenido ya está en la base cuando esto corre.
 */
function crud_avisar(string $page, array $par, array $json): string
{
    if (($par[':status'] ?? '') !== 'published') return '';
    $ruta = indexnow_ruta($page, (string)($par[':slug'] ?? $json['slug'] ?? ''));
    if ($ruta === '') return '';
    try {
        $r = indexnow_avisar([$ruta, '/']);
        return $r['ok'] ? ' Se avisó a los buscadores.' : ' (el aviso a buscadores no salió: ' . $r['mensaje'] . ')';
    } catch (Throwable $e) {
        return '';
    }
}

function crud(string $page, array $c): void {
    $table  = $c['table'];
    $fields = $c['fields'];
    /* Los nombres de tipo en inglés son los de la primera versión del panel.
       Se siguen aceptando para que un módulo viejo no se rompa en silencio. */
    $viejos = ['text' => 'texto', 'textarea' => 'area', 'date' => 'fecha', 'number' => 'numero', 'image' => 'imagen'];
    foreach ($fields as $k => $f) {
        $fields[$k]['nombre'] = $k;
        $t = $f['type'] ?? 'texto';
        $fields[$k]['type'] = $viejos[$t] ?? $t;
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        csrf_check();
        $act = $_POST['action'] ?? '';
        if ($act === 'delete') {
            db()->prepare("DELETE FROM `$table` WHERE id=:id")->execute([':id' => (int)($_POST['id'] ?? 0)]);
            set_flash('Elemento borrado.'); redirect("/panel/?p=$page");
        }
        if ($act === 'save') {
            $id = (int)($_POST['id'] ?? 0);
            /* Se parte del data_json que ya existe: así no se pierden las
               claves que todavía no tienen campo en el formulario. */
            $json = [];
            if ($id) {
                $q = db()->prepare("SELECT data_json FROM `$table` WHERE id = :id");
                $q->execute([':id' => $id]);
                $prev = json_decode((string)($q->fetchColumn() ?: ''), true);
                if (is_array($prev)) $json = $prev;
            }

            $cols = []; $par = [];
            foreach ($fields as $k => $f) {
                $tipo = $f['type'] ?? 'texto';
                $crudo = $_POST[$k] ?? '';
                if ($tipo === 'lista') {
                    /* Las etiquetas se pegan con comas por costumbre, aunque
                       el recuadro pida una por renglón. Se aceptan las dos
                       formas: en un campo de comas, una coma nunca es parte
                       del texto. En las demás listas sí puede serlo, así que
                       ahí solo se parte por renglón. */
                    $val = ($f['sep'] ?? 'lineas') === 'comas'
                        ? array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', (string)$crudo)), fn($x) => $x !== ''))
                        : crud_lineas($crudo);
                } elseif ($tipo === 'pares') {
                    $d = json_decode((string)$crudo, true);
                    $val = [];
                    if (is_array($d)) {
                        $n = 1;
                        foreach ($d as $fila) {
                            if (!is_array($fila)) continue;
                            $limpia = []; $vacia = true;
                            foreach (array_keys($f['claves'] ?? []) as $cl) {
                                if (($f['auto'] ?? '') === $cl) { $limpia[$cl] = $n; continue; }
                                $limpia[$cl] = trim((string)($fila[$cl] ?? ''));
                                if ($limpia[$cl] !== '') $vacia = false;
                            }
                            if ($vacia) continue;
                            foreach ((array)($f['requeridas'] ?? []) as $cl) {
                                if (($limpia[$cl] ?? '') === '') continue 2;
                            }
                            $val[] = $limpia; $n++;
                        }
                    }
                } else {
                    $val = trim((string)$crudo);
                }

                /* `json` admite varias rutas: las etiquetas del blog, por
                   ejemplo, son a la vez `tags` (se pintan al pie) y
                   `seo.keywords` (las lee el buscador). */
                foreach ((array)($f['json'] ?? []) as $ruta) crud_poner($json, $ruta, $val);

                if (($f['col'] ?? true) !== false) {
                    $cv = crud_a_columna($f, $val);
                    if ($tipo === 'fecha' && $cv === '') $cv = null;
                    $cols[] = $k; $par[":$k"] = $cv;
                }
            }

            if (isset($par[':slug'])) {
                $par[':slug'] = $par[':slug'] !== '' ? slugify($par[':slug']) : slugify((string)($_POST[$c['title_field'] ?? 'title'] ?? ''));
                crud_poner($json, 'slug', $par[':slug']);
            }

            if ($id) {
                $json['id'] = (string)($json['id'] ?? $id);
                $set = implode(',', array_map(fn($col) => "`$col`=:$col", $cols));
                $par[':id'] = $id;
                $par[':data_json'] = json_encode($json, JSON_UNESCAPED_UNICODE);
                db()->prepare("UPDATE `$table` SET $set, `data_json`=:data_json WHERE id=:id")->execute($par);
                set_flash('Cambios guardados. Ya están en el sitio.' . crud_avisar($page, $par, $json));
            } else {
                $colStr = implode(',', array_map(fn($col) => "`$col`", $cols));
                $valStr = implode(',', array_map(fn($col) => ":$col", $cols));
                $par[':data_json'] = json_encode($json, JSON_UNESCAPED_UNICODE);
                db()->prepare("INSERT INTO `$table` ($colStr,`data_json`) VALUES ($valStr,:data_json)")->execute($par);
                /* El sitio usa el id como clave de cada tarjeta: sin él,
                   React repinta la lista entera en cada carga. */
                $nuevo = (int)db()->lastInsertId();
                $json['id'] = (string)$nuevo;
                db()->prepare("UPDATE `$table` SET `data_json`=:d WHERE id=:i")
                    ->execute([':d' => json_encode($json, JSON_UNESCAPED_UNICODE), ':i' => $nuevo]);
                set_flash('Creado correctamente.' . crud_avisar($page, $par, $json));
            }
            redirect("/panel/?p=$page");
        }
    }

    $ct = csrf();
    $editId = isset($_GET['edit']) ? (int)$_GET['edit'] : 0;
    $isForm = $editId || isset($_GET['new']);

    if ($isForm) {
        $row = $editId ? (db()->query("SELECT * FROM `$table` WHERE id=".$editId)->fetch() ?: []) : [];
        $json = json_decode((string)($row['data_json'] ?? ''), true);
        if (!is_array($json)) $json = [];
        $rutas = ['blog' => '/blog/', 'portafolio' => '/portafolio/', 'servicios' => '/servicios/'];
        $verUrl = ($editId && ($row['status'] ?? '') === 'published' && !empty($row['slug']) && isset($rutas[$page]))
                  ? $rutas[$page] . $row['slug'] : '';
        ?>
        <div class="topbar">
          <div>
            <div class="kicker">Contenido del sitio</div>
            <h1 class="title"><?= $editId?'Editar':'Nuevo' ?> · <?= e($c['single']) ?></h1>
            <p class="subt" style="margin-bottom:0"><a href="/panel/?p=contenido&t=<?= $page ?>" style="color:#b58bff">← Volver a Contenido</a></p>
          </div>
          <?php if ($verUrl): ?><a class="btn ghost" href="<?= e($verUrl) ?>" target="_blank" rel="noopener">Ver en el sitio ↗</a><?php endif; ?>
        </div>

        <form method="post" class="card" id="fCrud">
          <input type="hidden" name="csrf" value="<?= $ct ?>"><input type="hidden" name="action" value="save">
          <?php if ($editId): ?><input type="hidden" name="id" value="<?= $editId ?>"><?php endif; ?>
          <?php
          /* Los campos se agrupan por bloque para que el formulario se lea
             como una ficha y no como una lista interminable. */
          $porGrupo = [];
          foreach ($fields as $k => $f) $porGrupo[$f['grupo'] ?? 'Contenido'][$k] = $f;
          foreach ($porGrupo as $grupo => $campos):
            $nota = $c['notas'][$grupo] ?? '';
          ?>
            <div class="form-sec"><b><?= e($grupo) ?></b><?php if($nota): ?><span><?= e($nota) ?></span><?php endif; ?></div>
            <div class="rowf">
            <?php foreach ($campos as $k => $f):
              $val  = crud_valor($f, $row, $json);
              $tipo = $f['type'] ?? 'texto';
              $wide = !empty($f['wide']) || in_array($tipo, ['area','lista','pares'], true);
              if ($wide) echo '</div><div class="rowf" style="grid-template-columns:1fr">';
            ?>
              <div>
                <label><?= e($f['label']) ?></label>
                <?php if ($tipo === 'area'): ?>
                  <textarea name="<?= $k ?>" style="min-height:150px"><?= e($val) ?></textarea>

                <?php elseif ($tipo === 'select'): ?>
                  <select name="<?= $k ?>"><?php foreach($f['opts'] as $ov=>$ol): ?><option value="<?= e($ov) ?>" <?= (string)$val===(string)$ov?'selected':'' ?>><?= e($ol) ?></option><?php endforeach; ?></select>

                <?php elseif ($tipo === 'fecha'): ?>
                  <input type="date" name="<?= $k ?>" value="<?= e(substr((string)$val, 0, 10)) ?>">

                <?php elseif ($tipo === 'numero'): ?>
                  <input type="number" name="<?= $k ?>" value="<?= e($val) ?>">

                <?php elseif ($tipo === 'lista' && ($f['sep'] ?? '') === 'comas'): ?>
                  <?php /* Las etiquetas caben en un renglón y así se escriben. */ ?>
                  <input type="text" name="<?= $k ?>" value="<?= e(implode(', ', (array)$val)) ?>">
                  <div class="mini" style="margin-top:4px">Sepáralas con comas.<?= !empty($f['help']) ? ' ' . e($f['help']) : '' ?></div>

                <?php elseif ($tipo === 'lista'): ?>
                  <textarea name="<?= $k ?>" style="min-height:120px"><?= e(implode("\n", (array)$val)) ?></textarea>
                  <div class="mini" style="margin-top:4px">Una por línea.<?= !empty($f['help']) ? ' ' . e($f['help']) : '' ?></div>

                <?php elseif ($tipo === 'pares'): ?>
                  <div class="rep" data-claves='<?= e(json_encode($f['claves'], JSON_UNESCAPED_UNICODE)) ?>' data-auto="<?= e($f['auto'] ?? '') ?>"
                       data-opciones='<?= e(json_encode($f['opciones'] ?? new stdClass, JSON_UNESCAPED_UNICODE)) ?>'
                       data-anchos='<?= e(json_encode($f['anchos'] ?? new stdClass)) ?>'
                       data-largos='<?= e(json_encode(array_values($f['largos'] ?? []))) ?>'>
                    <div class="rep-filas"></div>
                    <button type="button" class="btn small ghost rep-mas" style="margin-top:10px">+ Agregar</button>
                    <input type="hidden" name="<?= $k ?>" value='<?= e(json_encode(array_values((array)$val), JSON_UNESCAPED_UNICODE)) ?>'>
                  </div>

                <?php elseif ($tipo === 'imagen'): ?>
                  <div style="display:flex;gap:12px;align-items:flex-start">
                    <div data-prev="<?= $k ?>" style="flex:0 0 78px;height:56px;border-radius:10px;border:1px solid var(--line);background:#0b0b12 center/cover no-repeat;<?= $val !== '' ? 'background-image:url(' . e($val) . ');' : '' ?>"></div>
                    <input type="text" name="<?= $k ?>" value="<?= e($val) ?>" placeholder="https://…" style="flex:1"
                           oninput="var c=document.querySelector('[data-prev=&quot;<?= $k ?>&quot;]'); if(c) c.style.backgroundImage=this.value.trim()?'url('+this.value.trim()+')':'';">
                  </div>

                <?php else: ?>
                  <input type="text" name="<?= $k ?>" value="<?= e($val) ?>">
                <?php endif; ?>
                <?php if (!empty($f['help']) && $tipo !== 'lista'): ?><div class="mini" style="margin-top:4px"><?= e($f['help']) ?></div><?php endif; ?>
              </div>
            <?php endforeach; ?>
            </div>
          <?php endforeach; ?>

          <div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn" type="submit">Guardar</button>
            <a class="btn ghost" href="/panel/?p=contenido&t=<?= $page ?>">Cancelar</a>
            <?php if ($editId): ?>
              <button class="btn small danger" type="submit" name="action" value="delete" style="margin-left:auto"
                      onclick="return confirm('¿Borrar definitivamente? No se puede deshacer.')">Borrar</button>
            <?php endif; ?>
          </div>
        </form>

        <style>
          .rep-fila{display:grid;gap:8px;align-items:start;margin-bottom:8px;
            grid-template-columns:1fr auto;background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:10px}
          .rep-campos{display:grid;gap:8px}
          .rep-fila label{font-size:11px;color:var(--mut2);margin-bottom:3px}
          .rep-quitar{border:1px solid var(--line);background:transparent;color:var(--mut);border-radius:8px;
            width:30px;height:30px;cursor:pointer;font-size:15px;line-height:1;align-self:center}
          .rep-quitar:hover{border-color:#b3324f;color:#ff7d9c}
          @media(min-width:700px){ .rep-campos{grid-template-columns:var(--cols)} }
        </style>
        <script>
        (function () {
          document.querySelectorAll('.rep').forEach(function (rep) {
            var claves = JSON.parse(rep.dataset.claves || '{}');
            var auto   = rep.dataset.auto || '';
            var oculto = rep.querySelector('input[type=hidden]');
            var cajon  = rep.querySelector('.rep-filas');
            var visibles = Object.keys(claves).filter(function (k) { return k !== auto; });
            var opciones = JSON.parse(rep.dataset.opciones || '{}');
            var anchos   = JSON.parse(rep.dataset.anchos || '{}');
            var largos   = JSON.parse(rep.dataset.largos || '[]');

            function leer() { try { var d = JSON.parse(oculto.value || '[]'); return Array.isArray(d) ? d : []; } catch (e) { return []; } }
            function guardar() {
              var out = [];
              cajon.querySelectorAll('.rep-fila').forEach(function (f) {
                var o = {};
                f.querySelectorAll('[data-clave]').forEach(function (i) { o[i.dataset.clave] = i.value; });
                out.push(o);
              });
              oculto.value = JSON.stringify(out);
            }
            function fila(datos) {
              var d = document.createElement('div');
              d.className = 'rep-fila';
              var campos = document.createElement('div');
              campos.className = 'rep-campos';
              campos.style.setProperty('--cols', visibles.map(function (k) { return (anchos[k] || 1) + 'fr'; }).join(' '));
              visibles.forEach(function (k) {
                var w = document.createElement('div');
                var l = document.createElement('label'); l.textContent = claves[k]; w.appendChild(l);
                var i;
                if (opciones[k]) {
                  /* Se elige de un menú: así nadie escribe un valor que no
                     existe. Uno guardado que ya salió de la lista se
                     conserva, marcado, en vez de cambiarse sin avisar. */
                  i = document.createElement('select');
                  Object.keys(opciones[k]).forEach(function (v) {
                    var o = document.createElement('option'); o.value = v; o.textContent = opciones[k][v]; i.appendChild(o);
                  });
                  var actual = (datos && datos[k] != null) ? String(datos[k]) : Object.keys(opciones[k])[0];
                  if (!Object.prototype.hasOwnProperty.call(opciones[k], actual)) {
                    var o = document.createElement('option'); o.value = actual; o.textContent = actual + ' (ya no está en la lista)'; i.appendChild(o);
                  }
                  i.value = actual;
                  i.addEventListener('change', guardar);
                } else {
                  /* Los de 'largos' son frases cortas que pueden partirse en
                     dos renglones; las respuestas y descripciones, párrafos. */
                  var corto = largos.indexOf(k) >= 0;
                  var largo = corto || /respuesta|descripci|texto/i.test(claves[k]);
                  i = document.createElement(largo ? 'textarea' : 'input');
                  if (!largo) i.type = 'text';
                  else i.style.minHeight = corto ? '52px' : '78px';
                  i.value = (datos && datos[k] != null) ? datos[k] : '';
                  i.addEventListener('input', guardar);
                }
                i.dataset.clave = k;
                w.appendChild(i);
                campos.appendChild(w);
              });
              d.appendChild(campos);
              var x = document.createElement('button');
              x.type = 'button'; x.className = 'rep-quitar'; x.title = 'Quitar'; x.textContent = '×';
              x.addEventListener('click', function () { d.remove(); guardar(); });
              d.appendChild(x);
              return d;
            }
            leer().forEach(function (d) { cajon.appendChild(fila(d)); });
            rep.querySelector('.rep-mas').addEventListener('click', function () { cajon.appendChild(fila(null)); guardar(); });
          });
        })();
        </script>
        <?php
        return;
    }

    // LISTA
    $rows = db()->query("SELECT * FROM `$table` ORDER BY id DESC")->fetchAll();
    $tf = $c['title_field'] ?? 'title';
    ?>
    <div class="topbar"><div><div class="kicker">Contenido del sitio</div><h1 class="title"><?= e($c['plural']) ?></h1><p class="subt"><?= count($rows) ?> registrados · lo que guardes aquí sale en el sitio</p></div>
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
        $dj = json_decode((string)($r['data_json'] ?? ''), true); if (!is_array($dj)) $dj = [];
        echo pcard([
          'nombre'  => $r[$tf] ?? '—',
          'sub'     => $ruta ?: '—',
          'href'    => "/panel/?p=$page&edit=" . (int)$r['id'],
          'ver'     => $pub ? $ruta : '',
          'ayuda'   => (string)($r['short_desc'] ?? $r['excerpt'] ?? $dj['description'] ?? $dj['shortDescription'] ?? ''),
          'pie'     => (!empty($c['sub_field']) && !empty($r[$c['sub_field']]) ? $r[$c['sub_field']] : $c['single'])
                       . ' · ' . ($pub ? 'en línea' : 'sin publicar'),
          'foto'    => $r['image'] ?: (string)($dj['image'] ?? $dj['bannerImage'] ?? ''),
          'semilla' => $page . $r['id'],
          'badge'   => '<span class="badge b-' . ($pub ? 'published' : 'draft') . '">' . ($pub ? 'Publicado' : 'Borrador') . '</span>',
        ]);
      endforeach;
    ?>
    </div>
    <?php endif;
}
