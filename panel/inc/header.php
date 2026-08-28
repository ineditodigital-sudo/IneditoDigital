<?php
/** Un degradado de la casa, estable por semilla: cada tarjeta el suyo. */
function grad_casa(string $s): string {
    $g = [
        'linear-gradient(140deg,#3B0083 0%,#9933FF 52%,#D98CFF 100%)',
        'linear-gradient(140deg,#1B0B4F 0%,#4C46E8 52%,#9BB0FF 100%)',
        'linear-gradient(140deg,#5E0A72 0%,#C13BD9 50%,#FF9BE0 100%)',
        'linear-gradient(140deg,#2A0060 0%,#7700CE 48%,#CC66FF 100%)',
        'linear-gradient(140deg,#120C3A 0%,#6A3BF5 55%,#C0A6FF 100%)',
        'linear-gradient(140deg,#04352A 0%,#00B56A 55%,#7BEFBB 100%)',
    ];
    return $g[crc32($s) % count($g)];
}

/**
 * Las hojas que asoman en la tarjeta de contenido.
 * Van dentro del lienzo con degradado y el rótulo las tapa a medias:
 * el gesto de "carpeta con documentos" de un vistazo.
 */
function ilu_hojas(): string {
    return '<svg class="pcard-hojas" viewBox="0 0 220 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      . '<g transform="rotate(-8 52 72)"><rect x="8" y="18" width="88" height="114" rx="9" fill="#fff" opacity=".72"/>'
      . '<g stroke="#a9a9c4" stroke-width="3.4" stroke-linecap="round" opacity=".5"><path d="M24 42h56M24 56h42M24 70h52"/></g></g>'
      . '<g transform="rotate(3 110 68)"><rect x="66" y="12" width="88" height="120" rx="9" fill="#fff" opacity=".94"/>'
      . '<g stroke="#a9a9c4" stroke-width="3.4" stroke-linecap="round" opacity=".55"><path d="M82 38h56M82 52h42M82 66h52M82 80h36"/></g></g>'
      . '<g transform="rotate(10 168 74)"><rect x="124" y="20" width="88" height="112" rx="9" fill="#fff" opacity=".78"/>'
      . '<g stroke="#a9a9c4" stroke-width="3.4" stroke-linecap="round" opacity=".5"><path d="M140 44h56M140 58h42M140 72h50"/></g></g>'
      . '</svg>';
}

/**
 * La tarjeta de contenido. Todos los módulos pintan lo mismo con esto:
 *   nombre, sub, href (a dónde se edita), ayuda, pie, ver (enlace público),
 *   foto (si existe manda sobre el degradado), badge, semilla (degradado).
 */
function pcard(array $o): string {
    $foto = trim((string)($o['foto'] ?? ''));
    $fondo = $foto !== ''
        ? 'background-image:url(' . e($foto) . ')'
        : 'background:' . grad_casa((string)($o['semilla'] ?? $o['nombre'] ?? ''));
    $h  = '<div class="pcard">';
    $h .= '<a class="pcard-link" href="' . e($o['href']) . '" aria-label="' . e($o['nombre']) . '"></a>';
    $h .= '<div class="pcard-lienzo' . ($foto !== '' ? ' con-foto' : '') . '" style="' . $fondo . '">';
    if ($foto === '') $h .= ilu_hojas();
    if (!empty($o['badge'])) $h .= '<span class="pcard-estado">' . $o['badge'] . '</span>';
    $h .= '</div>';
    $h .= '<div class="pcard-tab"><div class="pcard-n">' . e($o['nombre']) . '</div></div>';
    $h .= '<div class="pcard-cuerpo"><div class="pcard-fila">';
    $h .= '<span class="pcard-s">' . e($o['sub'] ?? '') . '</span>';
    if (!empty($o['ver'])) {
        $h .= '<a class="pcard-ir" href="' . e($o['ver']) . '" target="_blank" rel="noopener" title="Ver en el sitio">&#8599;</a>';
    }
    $h .= '</div>';
    if (!empty($o['ayuda'])) $h .= '<div class="pcard-a">' . e($o['ayuda']) . '</div>';
    $h .= '</div>';
    $h .= '<div class="pcard-pie"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
        . '<path d="M15 2H8a2 2 0 00-2 2v14a2 2 0 002 2h9a2 2 0 002-2V6zM15 2v4h4"/></svg>'
        . '<span>' . e($o['pie'] ?? '') . '</span></div>';
    $h .= '</div>';
    return $h;
}

$nav = [
  'dashboard'  => ['Dashboard', 'M3 13h8V3H3zM3 21h8v-6H3zM13 21h8V11h-8zM13 3v6h8V3z'],
  'leads'      => ['Leads', 'M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8'],
  'analiticas' => ['Analíticas', 'M3 3v18h18M18 17V9M13 17V5M8 17v-3'],
  'contenido'  => ['Contenido', 'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5'],
  'seo'        => ['SEO', 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3'],
  'ajustes'    => ['Ajustes', 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z'],
];
$flash = get_flash();
?><!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow"><title>Panel · Inédito Digital</title>
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>
/* ============ El panel habla el idioma de la casa ============ */
@font-face{font-family:'Hanson';src:url('/fonts/Hanson-Bold.woff2') format('woff2');font-weight:700;font-display:swap}
:root{
  --bg:#07070b;--panel:#0b0b13;--card:#10101a;--card2:#161624;--line:#232336;--line2:#2f2f49;
  --pur:#7700CE;--pur2:#9933FF;--pur3:#CC66FF;--verde:#00E585;
  --txt:#F2F0F6;--mut:#9a97ad;--mut2:#6b6884;
  --f-display:'Hanson',system-ui,sans-serif;
  --f-mono:ui-monospace,'Cascadia Mono',Consolas,monospace;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--txt);font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;font-size:14.5px;display:flex;min-height:100vh}
a{color:inherit;text-decoration:none}

/* el fondo de la casa: retícula de puntos y aurora, fijas y silenciosas */
.fondo{position:fixed;inset:0;z-index:0;pointer-events:none}
.fondo::before{content:'';position:absolute;inset:0;opacity:.5;
  background-image:radial-gradient(rgba(255,255,255,.14) 1px,transparent 1px);background-size:26px 26px;
  -webkit-mask-image:radial-gradient(75% 65% at 60% 0%,black,transparent);mask-image:radial-gradient(75% 65% at 60% 0%,black,transparent)}
.fondo::after{content:'';position:absolute;top:-28%;right:-14%;width:760px;height:760px;border-radius:50%;
  background:radial-gradient(50% 50% at 50% 50%,rgba(119,0,206,.20),transparent 70%);filter:blur(40px)}

/* ---------------- sidebar ---------------- */
.side{width:252px;flex-shrink:0;background:rgba(9,9,15,.82);backdrop-filter:blur(14px);border-right:1px solid var(--line);
  padding:26px 14px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;z-index:2}
.side .logo{height:30px;width:auto;max-width:100%;object-fit:contain;display:block;margin:0 10px 8px}
.side .rotulo{font-family:var(--f-mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--mut2);margin:0 10px 26px}
.side nav{display:flex;flex-direction:column;gap:3px;flex:1}
.side a.item{display:flex;align-items:center;gap:12px;padding:10.5px 14px;border-radius:11px;color:var(--mut);font-size:13.5px;
  position:relative;transition:color .18s,background .18s}
.side a.item svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.side a.item:hover{background:rgba(255,255,255,.04);color:var(--txt)}
.side a.item.active{background:linear-gradient(90deg,rgba(119,0,206,.30),rgba(153,51,255,.08));color:#fff}
.side a.item.active::before{content:'';position:absolute;left:0;top:22%;bottom:22%;width:2.5px;border-radius:4px;
  background:linear-gradient(180deg,var(--pur2),var(--pur3))}
.side .logout{color:var(--mut2);font-size:13px;padding:12px 14px;border-top:1px solid var(--line);margin-top:10px;display:flex;gap:12px;align-items:center;border-radius:11px}
.side .logout:hover{color:var(--txt)}

/* ---------------- lienzo ---------------- */
.main{flex:1;min-width:0;padding:34px 40px 70px;position:relative;z-index:1}
h1.title{font-family:var(--f-display);text-transform:uppercase;font-size:24px;letter-spacing:.02em;margin:0 0 6px;line-height:1.15}
.subt{color:var(--mut);margin:0 0 26px;font-size:13.5px}
.kicker{font-family:var(--f-mono);font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--pur3);display:inline-flex;align-items:center;gap:10px;margin-bottom:10px}
.kicker::before{content:'';width:26px;height:1px;background:linear-gradient(90deg,var(--pur2),transparent)}
.flash{background:#0d2317;border:1px solid #1f5c3d;color:#8fe7b0;padding:12px 16px;border-radius:12px;margin-bottom:22px;font-size:13.5px}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:24px}

/* ---------------- piezas ---------------- */
.grid-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;position:relative;overflow:hidden;
  transition:border-color .25s,transform .25s}
.kpi::before{content:'';position:absolute;inset:0 0 auto;height:1px;opacity:0;transition:opacity .25s;
  background:linear-gradient(90deg,transparent,var(--pur2),transparent)}
.kpi:hover{border-color:rgba(153,51,255,.35);transform:translateY(-1px)}
.kpi:hover::before{opacity:.8}
.kpi .l{color:var(--mut);font-size:12.5px}
.kpi .v{font-size:29px;font-weight:800;margin-top:7px;letter-spacing:-.01em}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;margin-bottom:16px;position:relative}
.btn{display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;border-radius:999px;font-weight:700;font-size:13px;padding:11px 20px;color:#fff;
  background:linear-gradient(90deg,var(--pur),var(--pur2));box-shadow:0 8px 26px -12px rgba(119,0,206,.8);
  transition:transform .18s,box-shadow .18s,filter .18s;font-family:inherit}
.btn:hover{transform:translateY(-1px);box-shadow:0 12px 32px -12px rgba(153,51,255,.9);filter:brightness(1.06)}
.btn.small{padding:8px 14px;font-size:12px}
.btn.ghost{background:transparent;border:1px solid var(--line2);color:var(--mut);box-shadow:none}
.btn.ghost:hover{border-color:rgba(153,51,255,.5);color:var(--txt)}
.btn.danger{background:transparent;border:1px solid #b3324f;color:#ff7d9c;box-shadow:none}
.btn.green{background:#1faa53;box-shadow:0 8px 26px -12px rgba(0,229,133,.55)}
input,textarea,select{width:100%;background:var(--card2);border:1px solid var(--line);color:var(--txt);border-radius:11px;padding:11px 13px;font-size:14px;font-family:inherit;
  transition:border-color .18s,box-shadow .18s}
input:focus,textarea:focus,select:focus{outline:none;border-color:rgba(153,51,255,.55);box-shadow:0 0 0 3px rgba(119,0,206,.18)}
textarea{min-height:110px;resize:vertical}
label{display:block;font-size:11.5px;color:var(--mut);text-transform:uppercase;letter-spacing:.6px;margin:14px 0 6px;font-family:var(--f-mono)}
.rowf{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.chip{display:inline-block;border:1px solid var(--line);background:var(--card);color:var(--mut);border-radius:999px;padding:7px 14px;font-size:13px;margin-right:6px;cursor:pointer;transition:border-color .18s,color .18s}
.chip:hover{border-color:rgba(153,51,255,.4);color:var(--txt)}
.chip.active{background:var(--pur);color:#fff;border-color:var(--pur)}
.badge{font-size:10.5px;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.6px;font-family:var(--f-mono)}
.b-new{background:rgba(80,120,255,.18);color:#8ea6ff}.b-contacted{background:rgba(255,190,80,.15);color:#ffcf7a}
.b-qualified{background:rgba(150,90,255,.18);color:#c3a0ff}.b-converted{background:rgba(40,200,120,.16);color:#5fe0a0}.b-lost{background:rgba(255,80,110,.14);color:#ff8fa6}
.b-published{background:rgba(40,200,120,.16);color:#5fe0a0}.b-draft{background:rgba(255,190,80,.15);color:#ffcf7a}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--line);font-size:13.5px;vertical-align:top}
th{color:var(--mut2);font-size:10.5px;text-transform:uppercase;letter-spacing:.7px;font-family:var(--f-mono)}
.muted{color:var(--mut);font-size:13px}.mini{color:var(--mut2);font-size:12px}
.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* ---------------- banner de bienvenida ---------------- */
.banner{position:relative;overflow:hidden;border-radius:20px;border:1px solid rgba(153,51,255,.25);padding:34px 34px 30px;margin-bottom:24px}
.banner-fondo{position:absolute;inset:0;background:linear-gradient(115deg,#12001c,#7700CE,#9933FF,#CC66FF,#3d0068,#12001c);
  background-size:320% 320%;animation:degradado-panel 16s ease infinite}
.banner-velo{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,7,11,.30),rgba(7,7,11,.72))}
.banner-orbe{position:absolute;border-radius:50%;filter:blur(34px);opacity:.5;animation:orbe-flota 9s ease-in-out infinite}
.banner-orbe.o1{width:230px;height:230px;right:-40px;top:-90px;background:radial-gradient(circle,rgba(204,102,255,.7),transparent 70%)}
.banner-orbe.o2{width:170px;height:170px;right:180px;bottom:-100px;background:radial-gradient(circle,rgba(0,229,133,.35),transparent 70%);animation-delay:-4s}
.banner-int{position:relative;z-index:1}
.banner h1{font-family:var(--f-display);text-transform:uppercase;font-size:clamp(22px,3.4vw,34px);margin:0 0 8px;letter-spacing:.02em;line-height:1.12}
.banner p{margin:0;color:rgba(242,240,246,.82);font-size:14px;max-width:620px}
.banner .acciones{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
.banner .btn.ghost{border-color:rgba(255,255,255,.28);color:#fff;background:rgba(255,255,255,.06);backdrop-filter:blur(6px)}
@keyframes degradado-panel{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes orbe-flota{0%,100%{transform:translateY(0)}50%{transform:translateY(16px)}}

/* ---------------- la tarjeta de contenido ----------------
   Marco oscuro, lienzo de color dentro, hojas asomando y el rotulo
   montado en una pestana que muerde el lienzo. La misma pieza sirve
   para paginas, servicios, blog, portafolio y bloques. */
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:18px}
.pcard{position:relative;background:#0F0F19;border:1px solid var(--line);border-radius:26px;padding:9px 9px 2px;
  transition:transform .28s,border-color .28s,box-shadow .28s}
.pcard:hover{transform:translateY(-5px);border-color:rgba(153,51,255,.42);box-shadow:0 26px 52px -26px rgba(119,0,206,.65)}
.pcard-link{position:absolute;inset:0;z-index:1;border-radius:26px}
.pcard-lienzo{position:relative;height:126px;border-radius:19px;overflow:hidden;background-size:cover;background-position:center}
.pcard-lienzo::after{content:'';position:absolute;inset:0;background:radial-gradient(120% 95% at 12% -10%,rgba(255,255,255,.26),transparent 62%)}
.pcard-lienzo.con-foto::after{background:linear-gradient(180deg,rgba(7,7,11,.05),rgba(7,7,11,.45))}
.pcard-hojas{position:absolute;left:15%;top:38px;width:72%;filter:drop-shadow(0 12px 20px rgba(0,0,0,.4));transition:transform .35s}
.pcard:hover .pcard-hojas{transform:translateY(-4px)}
.pcard-estado{position:absolute;z-index:2;top:9px;right:9px}
.pcard-tab{position:relative;z-index:2;margin-top:-33px;width:max-content;max-width:calc(100% - 30px);
  background:#0F0F19;border-radius:0 17px 0 0;padding:10px 16px 2px 7px}
.pcard-tab::after{content:'';position:absolute;left:100%;bottom:0;width:17px;height:17px;
  background:radial-gradient(circle at 100% 0,transparent 16.5px,#0F0F19 17px)}
.pcard-n{font-family:var(--f-display);text-transform:uppercase;font-size:12.5px;letter-spacing:.03em;line-height:1.25;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pcard-cuerpo{position:relative;z-index:2;padding:1px 9px 0}
.pcard-fila{display:flex;align-items:center;justify-content:space-between;gap:10px}
.pcard-s{font-family:var(--f-mono);font-size:10.5px;color:var(--mut2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.pcard-ir{position:relative;z-index:3;flex-shrink:0;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  color:var(--mut);font-size:13px;border:1px solid transparent;transition:color .2s,border-color .2s,background .2s}
.pcard-ir:hover{color:#fff;border-color:var(--line2);background:rgba(255,255,255,.05)}
.pcard-a{font-size:12px;color:var(--mut);line-height:1.5;margin-top:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px}
.pcard-pie{position:relative;z-index:2;display:flex;align-items:center;gap:7px;padding:10px 9px 11px;color:var(--mut);font-size:11.5px}
.pcard-pie svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:1.9;flex-shrink:0}
.pcard-pie .sep{color:var(--mut2)}

/* ---------------- pestanas del modulo de contenido ---------------- */
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;border-bottom:1px solid var(--line);padding-bottom:12px}
.tabs a{display:inline-flex;align-items:center;gap:8px;padding:8px 15px;border-radius:999px;font-size:13px;color:var(--mut);
  border:1px solid transparent;transition:color .18s,background .18s,border-color .18s}
.tabs a:hover{color:var(--txt);background:rgba(255,255,255,.04)}
.tabs a.on{color:#fff;background:linear-gradient(90deg,rgba(119,0,206,.35),rgba(153,51,255,.16));border-color:rgba(153,51,255,.4)}
.tabs a i{font-style:normal;font-family:var(--f-mono);font-size:10px;color:var(--mut2);background:rgba(255,255,255,.06);border-radius:999px;padding:2px 7px}
.tabs a.on i{color:#DDBBFF;background:rgba(255,255,255,.10)}

/* ---------------- leads ---------------- */
.avatar{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;
  color:#fff;flex-shrink:0;letter-spacing:.02em;box-shadow:0 8px 20px -10px rgba(0,0,0,.8)}
.chip .pt-est{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:7px;vertical-align:1px}
.lead-msg{margin-top:12px;background:var(--card2);border-left:2px solid var(--pur);border-radius:8px;padding:12px 14px;font-size:13.5px;line-height:1.6;white-space:pre-wrap}

/* ---------------- equipo ---------------- */
.mie-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:14px}
.mie-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px 16px 16px;text-align:center;
  transition:transform .25s,border-color .25s,box-shadow .25s;display:flex;flex-direction:column;align-items:center}
.mie-card:hover{transform:translateY(-4px);border-color:rgba(153,51,255,.45);box-shadow:0 22px 44px -22px rgba(119,0,206,.5)}
.mie-foto{width:74px;height:74px;border-radius:50%;background-size:cover;background-position:center;margin-bottom:12px;
  display:flex;align-items:center;justify-content:center;font-family:var(--f-display);font-size:22px;color:#fff;
  box-shadow:0 0 0 2px var(--bg),0 0 0 4px rgba(153,51,255,.55),0 12px 26px -12px rgba(119,0,206,.8)}
.mie-n{font-weight:700;font-size:14.5px;line-height:1.3}
.mie-p{font-size:11.5px;color:var(--mut);margin-top:4px}
.mie-r{font-family:var(--f-mono);font-size:10.5px;color:var(--mut2);margin-top:7px}
.mie-acc{display:flex;gap:6px;justify-content:center;margin-top:13px;flex-wrap:wrap}

/* ---------------- secciones de formulario (ajustes · seo) ---------------- */
.form-sec{display:flex;align-items:baseline;gap:10px;border-bottom:1px solid var(--line);padding-bottom:10px;margin:26px 0 4px}
.form-sec:first-of-type{margin-top:2px}
.form-sec b{font-size:14.5px}
.form-sec span{font-size:12px;color:var(--mut2)}

/* ---------------- editor en vivo ---------------- */
.edt{display:grid;grid-template-columns:minmax(0,1fr) 470px;gap:18px;align-items:start}
.edt-vista{position:sticky;top:16px;height:calc(100vh - 32px);display:flex;flex-direction:column;
  background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.edt-vista-top{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line);background:rgba(9,9,15,.6)}
.edt-vivo-pill{display:inline-flex;align-items:center;gap:7px;font-family:var(--f-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--verde)}
.edt-vivo-pill::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--verde);box-shadow:0 0 10px var(--verde);animation:late 2.2s ease infinite}
@keyframes late{0%,100%{opacity:1}50%{opacity:.35}}
.edt-vista-top .ruta{flex:1;font-family:var(--f-mono);font-size:11.5px;color:var(--mut2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.edt-btn{border:1px solid var(--line);background:transparent;color:var(--mut);border-radius:8px;padding:6px 10px;font-size:11.5px;cursor:pointer;font-family:inherit;transition:color .18s,border-color .18s}
.edt-btn:hover{color:var(--txt);border-color:var(--line2)}
.edt-btn.on{color:var(--pur3);border-color:rgba(153,51,255,.5)}
.edt-marco{flex:1;background:#000;display:flex;justify-content:center;overflow:hidden}
.edt-marco iframe{border:0;width:100%;height:100%;background:#0a0a10;transition:width .35s ease}
.edt-marco.movil iframe{width:375px}
.edt-campos{min-width:0}
details.sec{background:var(--card);border:1px solid var(--line);border-radius:16px;margin-bottom:12px;overflow:hidden}
details.sec>summary{list-style:none;cursor:pointer;padding:15px 20px;display:flex;align-items:center;gap:12px;user-select:none}
details.sec>summary::-webkit-details-marker{display:none}
details.sec>summary .flecha{margin-left:auto;transition:transform .25s;color:var(--mut2)}
details.sec[open]>summary .flecha{transform:rotate(90deg)}
details.sec>summary .nom{font-weight:700;font-size:14.5px}
details.sec>summary .cnt{font-family:var(--f-mono);font-size:10px;color:var(--mut2);background:rgba(255,255,255,.05);border-radius:999px;padding:3px 9px}
details.sec .cuerpo{padding:2px 20px 20px;border-top:1px solid var(--line)}
.edt-acciones{position:sticky;bottom:0;background:linear-gradient(180deg,transparent,var(--bg) 26%);padding:18px 0 6px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;z-index:2}
/* la tarjeta de Google: cómo se vería el resultado */
.snippet{background:#191b20;border:1px solid #2a2d35;border-radius:12px;padding:14px 16px;margin-bottom:14px}
.snippet .u{font-size:12px;color:#bdc1c6;display:flex;align-items:center;gap:8px}
.snippet .u b{color:#dadce0;font-weight:400}
.snippet .t{color:#8ab4f8;font-size:17px;margin:5px 0 3px;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}
.snippet .d{color:#bdc1c6;font-size:13px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

@media(max-width:1120px){
  .edt{grid-template-columns:1fr}
  .edt-vista{position:relative;top:0;height:52vh;order:-1}
}
@media(max-width:820px){
  .side{width:64px;padding:20px 8px}.side .logo{display:none}.side .rotulo{display:none}
  .side a.item span,.side .logout span{display:none}
  .main{padding:22px 16px}.rowf{grid-template-columns:1fr}
  .banner{padding:24px 20px}
}

/* ---------------- teléfono: el panel como app ----------------
   La sidebar se vuelve barra inferior con iconos y rótulos chicos,
   las tablas ruedan de lado y las cuadrículas anchas se apilan. */
@media(max-width:640px){
  body{flex-direction:column}
  .side{position:fixed;left:0;right:0;bottom:0;top:auto;width:100%;height:auto;z-index:40;
    flex-direction:row;align-items:center;padding:4px 6px calc(4px + env(safe-area-inset-bottom));
    border-right:0;border-top:1px solid var(--line);background:rgba(8,8,13,.92)}
  .side .logo,.side .rotulo{display:none}
  .side nav{flex-direction:row;overflow-x:auto;-webkit-overflow-scrolling:touch;gap:0;flex:1;scrollbar-width:none}
  .side nav::-webkit-scrollbar{display:none}
  .side a.item{flex-direction:column;gap:4px;padding:8px 11px;font-size:8.5px;flex:0 0 auto;border-radius:10px}
  .side a.item span{display:block;font-family:var(--f-mono);letter-spacing:.04em;text-transform:uppercase}
  .side a.item svg{width:19px;height:19px}
  .side a.item.active::before{left:22%;right:22%;top:auto;bottom:1px;width:auto;height:2.5px;
    background:linear-gradient(90deg,var(--pur2),var(--pur3))}
  .side .logout{border-top:0;margin:0;padding:8px 11px;flex-direction:column;gap:4px}
  .side .logout span{display:none}
  .main{padding:18px 14px calc(88px + env(safe-area-inset-bottom))}
  h1.title{font-size:19px}
  .banner{padding:22px 18px}
  .banner .acciones .btn{padding:10px 15px;font-size:12px}
  .grid-kpi{grid-template-columns:repeat(2,1fr);gap:10px}
  .kpi{padding:14px 15px}.kpi .v{font-size:23px}
  .card{padding:16px;border-radius:14px}
  .topbar input[type=search]{width:100% !important}
  /* tablas: ruedan de lado en vez de aplastarse */
  .card table{display:block;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}
  /* las cuadrículas anchas declaradas en línea se apilan */
  .main div[style*="grid-template-columns:2fr 1fr"],
  .main div[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr !important}
  /* el editor: vista arriba, acciones flotando sobre la barra inferior */
  .edt-vista{height:44vh}
  .edt-marco.movil iframe{width:100%}
  .edt-vista-top{flex-wrap:wrap;row-gap:6px}
  .edt-acciones{bottom:calc(64px + env(safe-area-inset-bottom));background:linear-gradient(180deg,transparent,var(--bg) 40%)}
  .pgrid{grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:12px}
  .pcard{border-radius:22px;padding:7px 7px 2px}
  .pcard-lienzo{height:96px;border-radius:16px}
  .pcard-hojas{top:22px}
  .pcard-tab{margin-top:-28px;padding:8px 13px 2px 6px}
  .pcard-a{display:none}
}
@media(prefers-reduced-motion:reduce){
  .banner-fondo,.banner-orbe,.edt-vivo-pill::before{animation:none}
}
</style></head><body>
<div class="fondo" aria-hidden></div>
<aside class="side">
  <img class="logo" src="/media/inedito-logo.png" alt="Inédito">
  <div class="rotulo">Centro de mando</div>
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
