<?php
/**
 * Sincroniza el inventario de espectaculares. Pensado para un cron diario.
 *
 * Por la web pide sesión: el inventario de un socio no es algo que deba poder
 * refrescar cualquiera que adivine la URL.
 */
declare(strict_types=1);
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../inc/espectaculares.php';

if (PHP_SAPI !== 'cli') { require_login(); header('Content-Type: text/plain; charset=utf-8'); }

$r = espec_sincronizar();
echo $r['ok']
  ? sprintf("ok · %d recibidos · %d nuevos · %d cambios de estatus · %d sin coordenada · %d ya no vienen\n",
            $r['recibidos'], $r['nuevos'], $r['cambios'], $r['sin_coordenada'], $r['desaparecidos'])
  : "FALLO: {$r['error']}\n";
