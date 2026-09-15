<?php
/** Conexión PDO a MySQL. */
declare(strict_types=1);

/*
 * Los dos relojes, puestos en hora.
 *
 * Nadie fijaba la zona: PHP usaba la del servidor y MySQL la suya. Un lead se
 * guardaba con el reloj de MySQL y el panel lo leía con el de PHP, así que la
 * antigüedad salía corrida justo la diferencia entre los dos. Se vio con un
 * lead que el correo fechó a las 17:17 y el panel mostró como «hace 9 h».
 *
 * No es cosmético: la pantalla de leads ordena por antigüedad y solo pinta en
 * rojo lo de 4 horas o menos. Con el reloj corrido, el lead recién entrado
 * pierde el rojo, que es exactamente el que había que atender primero.
 *
 * El desfase se corrige a la vez en los dos sitios o no se corrige.
 * El gemelo de esto vive en panel/bootstrap.php, que abre su propia conexión.
 */
const ZONA_PHP   = 'America/Mexico_City';
/* Por número y no por nombre: los nombres de zona de MySQL viven en unas
   tablas que en hosting compartido casi nunca están cargadas, y entonces el
   SET falla en silencio. Aguascalientes es UTC-6 todo el año desde que México
   dejó el horario de verano en 2022, así que el número no se queda viejo. */
const ZONA_MYSQL = '-06:00';

date_default_timezone_set(ZONA_PHP);

function db_connect(array $cfg): PDO
{
    $d = $cfg['db'];
    $dsn = "mysql:host={$d['host']};dbname={$d['name']};charset={$d['charset']}";
    $pdo = new PDO($dsn, $d['user'], $d['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    /* Si esto falla, se sigue: una web que no abre por la zona horaria es
       peor problema que una hora corrida. */
    try { $pdo->exec("SET time_zone = '" . ZONA_MYSQL . "'"); } catch (Throwable $e) {}
    return $pdo;
}
