<?php
$nav = [
  'dashboard'  => ['Dashboard', 'M3 13h8V3H3zM3 21h8v-6H3zM13 21h8V11h-8zM13 3v6h8V3z'],
  'leads'      => ['Leads', 'M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8'],
  'analiticas' => ['Analíticas', 'M3 3v18h18M18 17V9M13 17V5M8 17v-3'],
  'servicios'  => ['Servicios', 'M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z'],
  'blog'       => ['Blog', 'M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z'],
  'portafolio' => ['Portafolio', 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6'],
  'seo'        => ['SEO', 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3'],
  'ajustes'    => ['Ajustes', 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z'],
];
$flash = get_flash();
?><!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow"><title>Panel · Inédito Digital</title>
<style>
:root{--bg:#08080c;--card:#0e0e15;--card2:#14141f;--line:#21212e;--pur:#7700CE;--pur2:#9933FF;--txt:#ececf4;--mut:#8a8aa0;--mut2:#61617a;}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font-family:Arial,Helvetica,sans-serif;display:flex;min-height:100vh}
a{color:inherit;text-decoration:none}
.side{width:250px;flex-shrink:0;background:#0b0b12;border-right:1px solid var(--line);padding:26px 16px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column}
.side .logo{height:30px;width:auto;max-width:100%;object-fit:contain;display:block;margin:0 8px 30px}
.side nav{display:flex;flex-direction:column;gap:4px;flex:1}
.side a.item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;color:var(--mut);font-size:14px}
.side a.item svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.side a.item:hover{background:#15151f;color:var(--txt)}
.side a.item.active{background:linear-gradient(90deg,rgba(119,0,206,.25),rgba(153,51,255,.12));color:#fff}
.side .logout{color:var(--mut2);font-size:13px;padding:12px 14px;border-top:1px solid var(--line);margin-top:10px;display:flex;gap:12px;align-items:center}
.main{flex:1;min-width:0;padding:34px 40px 70px}
h1.title{font-size:30px;margin:0 0 4px;letter-spacing:-.3px}
.subt{color:var(--mut);margin:0 0 26px;font-size:14px}
.flash{background:#132318;border:1px solid #2f7d4f;color:#9be7b4;padding:12px 16px;border-radius:10px;margin-bottom:22px;font-size:14px}
.grid-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:26px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px}
.kpi .l{color:var(--mut);font-size:13px}.kpi .v{font-size:30px;font-weight:800;margin-top:6px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px;margin-bottom:16px}
.btn{display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;border-radius:999px;font-weight:700;font-size:13px;padding:11px 20px;color:#fff;background:linear-gradient(90deg,var(--pur),var(--pur2))}
.btn.small{padding:8px 14px;font-size:12px}
.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--mut)}
.btn.danger{background:transparent;border:1px solid #b3324f;color:#ff7d9c}
.btn.green{background:#25D366}
input,textarea,select{width:100%;background:var(--card2);border:1px solid var(--line);color:var(--txt);border-radius:10px;padding:11px 13px;font-size:14px;font-family:inherit}
textarea{min-height:110px;resize:vertical}
label{display:block;font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.6px;margin:14px 0 6px}
.rowf{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.chip{display:inline-block;border:1px solid var(--line);background:var(--card);color:var(--mut);border-radius:999px;padding:7px 14px;font-size:13px;margin-right:6px;cursor:pointer}
.chip.active{background:var(--pur);color:#fff;border-color:var(--pur)}
.badge{font-size:11px;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.5px}
.b-new{background:rgba(80,120,255,.18);color:#8ea6ff}.b-contacted{background:rgba(255,190,80,.15);color:#ffcf7a}
.b-qualified{background:rgba(150,90,255,.18);color:#c3a0ff}.b-converted{background:rgba(40,200,120,.16);color:#5fe0a0}.b-lost{background:rgba(255,80,110,.14);color:#ff8fa6}
.b-published{background:rgba(40,200,120,.16);color:#5fe0a0}.b-draft{background:rgba(255,190,80,.15);color:#ffcf7a}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--line);font-size:14px;vertical-align:top}
th{color:var(--mut);font-size:11px;text-transform:uppercase;letter-spacing:.6px}
.muted{color:var(--mut);font-size:13px}.mini{color:var(--mut2);font-size:12px}
.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:24px}
@media(max-width:820px){.side{width:64px;padding:20px 8px}.side .logo{display:none}.side a.item span,.side .logout span{display:none}.main{padding:22px 16px}.rowf{grid-template-columns:1fr}}
</style></head><body>
<aside class="side">
  <img class="logo" src="/media/inedito-logo.png" alt="Inédito">
  <nav>
    <?php foreach ($nav as $key => $it): ?>
      <a class="item <?= ($page ?? '')===$key ? 'active':'' ?>" href="/panel/?p=<?= $key ?>">
        <svg viewBox="0 0 24 24"><path d="<?= $it[1] ?>"/></svg><span><?= e($it[0]) ?></span>
      </a>
    <?php endforeach; ?>
  </nav>
  <a class="logout" href="/panel/logout.php">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
    <span>Cerrar sesión</span>
  </a>
</aside>
<main class="main">
<?php if ($flash): ?><div class="flash"><?= e($flash) ?></div><?php endif; ?>
