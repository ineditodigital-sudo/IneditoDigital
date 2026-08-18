<?php require __DIR__ . '/bootstrap.php'; require_login();
$allowed = ['dashboard','analiticas','leads','paginas','blog','servicios','portafolio','seo','ajustes'];
$p = preg_replace('/[^a-z]/', '', (string)($_GET['p'] ?? 'dashboard'));
if (!in_array($p, $allowed, true)) $p = 'dashboard';
$page = $p;
require __DIR__ . '/inc/header.php';
require __DIR__ . "/pages/$p.php";
require __DIR__ . '/inc/footer.php';
