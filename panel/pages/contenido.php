<?php
/**
 * Contenido · una sola puerta para todo lo editable del sitio.
 *
 * Detrás siguen viviendo dos motores distintos, porque son dos cosas
 * distintas de verdad:
 *   - PÁGINAS (y equipo, y las que tú creas) son piezas únicas con
 *     secciones fijas: se editan textos en su lugar, con borrador,
 *     versiones y vista en vivo.
 *   - SERVICIOS, BLOG y PORTAFOLIO son colecciones: muchos registros
 *     iguales que comparten una plantilla y se listan solos en el sitio.
 * Lo que se unifica aquí es la entrada: una pantalla, pestañas, y las
 * mismas tarjetas para todo. Cada "Editar" abre el motor que toca.
 */
require __DIR__ . '/../inc/contenido.php';
require_once __DIR__ . '/../inc/miembros.php';

$t = preg_replace('/[^a-z]/', '', (string)($_GET['t'] ?? 'paginas'));

function cn(string $tabla, string $where = ''): int {
    try { return (int)db()->query("SELECT COUNT(*) c FROM `$tabla`" . ($where ? " WHERE $where" : ''))->fetch()['c']; }
    catch (Throwable $e) { return 0; }
}
function hace_txt(?string $fecha): string {
    if (!$fecha) return 'sin ediciones aún';
    $s = time() - strtotime($fecha);
    if ($s < 3600)  return 'hace ' . max(1, (int)($s / 60)) . ' min';
    if ($s < 86400) return 'hace ' . (int)($s / 3600) . ' h';
    $d = (int)($s / 86400);
    return $d === 1 ? 'ayer' : "hace $d días";
}

$registro = registro_paginas();
$TABS = [
    'paginas'    => ['Páginas del sitio', count($registro)],
    'servicios'  => ['Servicios',  cn('services')],
    'blog'       => ['Blog',       cn('blog_posts')],
    'portafolio' => ['Portafolio', cn('portfolio')],
    'equipo'     => ['Equipo',     cn('pages', "tipo='miembro'")],
    'mias'       => ['Mis páginas', cn('pages', "tipo='bloques'")],
];
if (!isset($TABS[$t])) $t = 'paginas';

/* El botón de crear, según la pestaña */
$CREAR = [
    'servicios'  => ['/panel/?p=servicios&new=1',  '+ Nuevo servicio'],
    'blog'       => ['/panel/?p=blog&new=1',       '+ Nuevo artículo'],
    'portafolio' => ['/panel/?p=portafolio&new=1', '+ Nuevo caso'],
    'equipo'     => ['/panel/?p=miembros',         '+ Agregar a alguien'],
    'mias'       => ['/panel/?p=nueva',            '+ Crear página'],
];
?>
<div class="topbar">
  <div>
    <div class="kicker">Todo lo editable, en un lugar</div>
    <h1 class="title">Contenido</h1>
    <p class="subt" style="margin-bottom:0">Las páginas se editan en vivo; los servicios, artículos y casos son listas que el sitio arma solo.</p>
  </div>
  <?php if (isset($CREAR[$t])): ?>
    <a class="btn" href="<?= e($CREAR[$t][0]) ?>" style="align-self:center"><?= e($CREAR[$t][1]) ?></a>
  <?php endif; ?>
</div>

<div class="tabs">
  <?php foreach ($TABS as $k => [$lab, $n]): ?>
    <a class="<?= $t === $k ? 'on' : '' ?>" href="/panel/?p=contenido&t=<?= $k ?>"><?= e($lab) ?> <i><?= $n ?></i></a>
  <?php endforeach; ?>
</div>

<?php
/* ---------------------------------------------------------------- */
/* Páginas del sitio                                                 */
/* ---------------------------------------------------------------- */
if ($t === 'paginas') {
    $estado = [];
    foreach (db()->query('SELECT slug, contenido, borrador, seo_image, updated_at FROM pages') as $r) $estado[$r['slug']] = $r;
    echo '<div class="pgrid">';
    foreach ($registro as $sk => $reg) {
        $e = $estado[$sk] ?? null;
        $hayBorrador = $e && !empty($e['borrador']) && $e['borrador'] !== ($e['contenido'] ?? null);
        echo pcard([
            'nombre'  => $reg['nombre'],
            'sub'     => $reg['ruta'],
            'href'    => '/panel/?p=paginas&pagina=' . rawurlencode($sk),
            'ver'     => $reg['ruta'],
            'ayuda'   => $reg['ayuda'] ?? '',
            'pie'     => count($reg['secciones']) . ' secciones · ' . hace_txt($e['updated_at'] ?? null),
            'foto'    => $e['seo_image'] ?? '',
            'semilla' => $sk,
            'badge'   => $hayBorrador ? '<span class="badge b-draft">Borrador</span>' : '',
        ]);
    }
    echo '</div>';
    return;
}

/* ---------------------------------------------------------------- */
/* Colecciones: servicios · blog · portafolio                        */
/* ---------------------------------------------------------------- */
$COL = [
    'servicios'  => ['services',   'servicios',  'category', 'Servicio'],
    'blog'       => ['blog_posts', 'blog',       'category', 'Artículo'],
    'portafolio' => ['portfolio',  'portafolio', 'client',   'Caso'],
];
if (isset($COL[$t])) {
    [$tabla, $modulo, $subCampo, $singular] = $COL[$t];
    $rows = db()->query("SELECT * FROM `$tabla` ORDER BY id DESC")->fetchAll();
    if (!$rows) {
        echo '<div class="card"><p class="muted" style="text-align:center;padding:30px 0">Aún no hay ' . e(mb_strtolower($singular)) . 's. Crea el primero con el botón de arriba.</p></div>';
        return;
    }
    echo '<div class="pgrid">';
    foreach ($rows as $r) {
        $pub = ($r['status'] ?? 'draft') === 'published';
        $slug = trim((string)($r['slug'] ?? ''));
        $ruta = $slug !== '' ? ($t === 'blog' ? "/blog/$slug" : ($t === 'portafolio' ? "/portafolio/$slug" : "/servicios/$slug")) : '';
        echo pcard([
            'nombre'  => $r['title'] ?? '—',
            'sub'     => $ruta ?: '—',
            'href'    => "/panel/?p=$modulo&edit=" . (int)$r['id'],
            'ver'     => $pub ? $ruta : '',
            'ayuda'   => (string)($r['short_desc'] ?? $r['excerpt'] ?? ''),
            'pie'     => ($r[$subCampo] ?? $singular) . ' · ' . ($pub ? 'en línea' : 'sin publicar'),
            'foto'    => $r['image'] ?? '',
            'semilla' => $modulo . $r['id'],
            'badge'   => '<span class="badge b-' . ($pub ? 'published' : 'draft') . '">' . ($pub ? 'Publicado' : 'Borrador') . '</span>',
        ]);
    }
    echo '</div>';
    return;
}

/* ---------------------------------------------------------------- */
/* Equipo y páginas propias                                          */
/* ---------------------------------------------------------------- */
$tipo = $t === 'equipo' ? 'miembro' : 'bloques';
$rows = db()->query("SELECT * FROM pages WHERE tipo='$tipo' ORDER BY " . ($tipo === 'miembro' ? 'nombre ASC' : 'id DESC'))->fetchAll();
if (!$rows) {
    echo '<div class="card"><p class="muted" style="text-align:center;padding:30px 0">'
       . ($tipo === 'miembro' ? 'Todavía no hay nadie del equipo.' : 'Todavía no has creado ninguna página.')
       . ' Usa el botón de arriba.</p></div>';
    return;
}
echo '<div class="pgrid">';
foreach ($rows as $r) {
    $pub = ($r['status'] ?? '') === 'published';
    $datos = json_decode((string)$r['contenido'], true) ?: [];
    if ($tipo === 'miembro') {
        $d = miembro_con_respaldo($datos);
        echo pcard([
            'nombre'  => $r['nombre'],
            'sub'     => $r['ruta'],
            'href'    => '/panel/?p=miembros&id=' . (int)$r['id'],
            'ver'     => $pub ? $r['ruta'] : '',
            'ayuda'   => (string)($d['puesto'] ?? ''),
            'pie'     => 'Tarjeta digital · ' . ($pub ? 'en línea' : 'sin publicar'),
            'foto'    => (string)($d['foto'] ?? ''),
            'semilla' => $r['nombre'],
            'badge'   => '<span class="badge b-' . ($pub ? 'published' : 'draft') . '">' . ($pub ? 'En línea' : 'Borrador') . '</span>',
        ]);
    } else {
        $nb = count(json_decode((string)$r['borrador'], true) ?: []);
        $pendiente = ($r['borrador'] ?? '') !== ($r['contenido'] ?? '');
        echo pcard([
            'nombre'  => $r['nombre'],
            'sub'     => $r['ruta'],
            'href'    => '/panel/?p=nueva&id=' . (int)$r['id'],
            'ver'     => $pub ? $r['ruta'] : '',
            'ayuda'   => $pendiente && $pub ? 'Tiene cambios guardados que todavía no se ven en el sitio.' : '',
            'pie'     => $nb . ' bloque(s) · ' . ($pub ? 'en línea' : 'sin publicar'),
            'foto'    => (string)($r['seo_image'] ?? ''),
            'semilla' => 'nueva' . $r['slug'],
            'badge'   => '<span class="badge b-' . ($pub ? 'published' : 'draft') . '">' . ($pub ? 'En línea' : 'Borrador') . '</span>',
        ]);
    }
}
echo '</div>';
