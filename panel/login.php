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
:root{--bg:#08080c;--card:#0e0e15;--card2:#14141f;--line:#21212e;--pur:#7700CE;--pur2:#9933FF;--txt:#ececf4;--mut:#8a8aa0;}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font-family:Arial,Helvetica,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;}
.box{width:100%;max-width:380px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:36px;}
.box img{height:34px;width:auto;max-width:100%;object-fit:contain;display:block;margin:0 auto 22px}
h1{font-size:20px;text-align:center;margin:0 0 4px}p.sub{color:var(--mut);text-align:center;margin:0 0 24px;font-size:13px}
input{width:100%;background:var(--card2);border:1px solid var(--line);color:var(--txt);border-radius:10px;padding:13px 14px;font-size:14px;margin-bottom:12px}
button{width:100%;border:0;cursor:pointer;border-radius:999px;padding:14px;color:#fff;font-weight:700;background:linear-gradient(90deg,var(--pur),var(--pur2))}
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
