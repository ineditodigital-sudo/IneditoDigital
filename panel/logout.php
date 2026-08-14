<?php require __DIR__ . '/bootstrap.php'; $_SESSION = []; session_destroy(); redirect('/panel/login.php');
