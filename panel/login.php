<?php require __DIR__ . '/bootstrap.php';
if (is_logged()) redirect('/panel/');
$err = '';
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $u = trim($_POST['username'] ?? ''); $p = (string)($_POST['password'] ?? '');
    try {
        $st = db()->prepare('SELECT id, username, password_hash FROM admins WHERE username = :u LIMIT 1');
        $st->execute([':u' => $u]); $row = $st->fetch();
        if ($row && password_verify($p, $row['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_id'] = (int)$row['id']; $_SESSION['admin_user'] = $row['username'];
            // Quien entra al panel es equipo: esta cookie hace que hit.php
            // deje de contar sus visitas al sitio en las métricas (2 años).
            setcookie('_nc', '1', ['expires' => time() + 63072000, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
            redirect('/panel/');
        } else { $err = 'Credenciales incorrectas'; usleep(350000); }
    } catch (Throwable $ex) { $err = 'Error del servidor'; }
}
?><!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow"><title>Panel · Inédito Digital</title>
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>
@font-face{font-family:'Hanson';src:url('/fonts/Hanson-Bold.woff2') format('woff2');font-weight:700;font-display:swap}
:root{--bg:#07070b;--card:#10101a;--card2:#161624;--line:#232336;--pur:#7700CE;--pur2:#9933FF;--txt:#F2F0F6;--mut:#9a97ad;}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font-family:'Segoe UI',system-ui,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;position:relative;overflow:hidden}
body::before{content:'';position:fixed;inset:0;opacity:.5;background-image:radial-gradient(rgba(255,255,255,.13) 1px,transparent 1px);background-size:26px 26px;-webkit-mask-image:radial-gradient(70% 70% at 50% 30%,black,transparent);mask-image:radial-gradient(70% 70% at 50% 30%,black,transparent)}
body::after{content:'';position:fixed;top:-30%;left:50%;transform:translateX(-50%);width:720px;height:720px;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,rgba(119,0,206,.28),transparent 70%);filter:blur(40px)}
.box{width:100%;max-width:380px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:38px 36px;position:relative;z-index:1;box-shadow:0 30px 70px -30px rgba(119,0,206,.5)}
.box::before{content:'';position:absolute;inset:0 0 auto;height:1px;border-radius:20px 20px 0 0;background:linear-gradient(90deg,transparent,var(--pur2),transparent)}
.box img{height:34px;width:auto;max-width:100%;object-fit:contain;display:block;margin:0 auto 22px}
h1{font-family:'Hanson',system-ui,sans-serif;text-transform:uppercase;font-size:15px;letter-spacing:.04em;text-align:center;margin:0 0 6px}
p.sub{color:var(--mut);text-align:center;margin:0 0 24px;font-size:12.5px;font-family:ui-monospace,Consolas,monospace;text-transform:uppercase;letter-spacing:.18em}
input{width:100%;background:var(--card2);border:1px solid var(--line);color:var(--txt);border-radius:11px;padding:13px 14px;font-size:14px;margin-bottom:12px;font-family:inherit;transition:border-color .18s,box-shadow .18s}
input:focus{outline:none;border-color:rgba(153,51,255,.55);box-shadow:0 0 0 3px rgba(119,0,206,.18)}
button{width:100%;border:0;cursor:pointer;border-radius:999px;padding:14px;color:#fff;font-weight:700;background:linear-gradient(90deg,var(--pur),var(--pur2));box-shadow:0 10px 30px -12px rgba(119,0,206,.8);transition:transform .18s,filter .18s;font-family:inherit}
button:hover{transform:translateY(-1px);filter:brightness(1.06)}
.err{color:#ff8fa6;font-size:13px;text-align:center;min-height:18px;margin-top:8px}
</style></head><body>
<div class="box">
  <img src="/media/inedito-logo.png" alt="Inédito Digital">
  <h1>Panel de administración</h1><p class="sub">Acceso privado</p>
  <form method="post">
    <input name="username" type="text" placeholder="Usuario" autocomplete="username" autofocus>
    <input name="password" type="password" placeholder="Contraseña" autocomplete="current-password">
    <button type="submit">Iniciar sesión</button>
    <div class="err"><?= e($err) ?></div>
  </form>
</div></body></html>
