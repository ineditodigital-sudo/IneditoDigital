<?php
/**
 * El inventario de espacios de Vía Gráfica, copiado a nuestra base.
 *
 * Se copia y no se consulta en vivo por tres razones. Una, la página no puede
 * depender de que un servidor ajeno conteste: si su API se cae, el catálogo
 * sigue en pie con la última foto buena. Dos, un buscador tiene que encontrar
 * el texto en el HTML, y para eso el dato tiene que estar aquí cuando llega.
 * Tres, así podemos corregir lo que venga sucio sin tocar su sistema.
 *
 * La sincronización nunca borra: marca. Un espacio que deja de aparecer se
 * queda con su última fecha vista y sale del catálogo público, pero no se
 * pierde el registro — si mañana vuelve, se sabe que ya existía.
 */
declare(strict_types=1);

const ESPEC_API = 'https://spvnet.gruposoldi.mx:5300/api/auxiliares/inventario-vistas';

function espec_tabla(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS espectaculares (
      clave       VARCHAR(24)  NOT NULL,
      vistaid     INT          NULL,
      titulo      VARCHAR(255) NOT NULL DEFAULT '',
      tipo        VARCHAR(40)  NOT NULL DEFAULT '',
      colonia     VARCHAR(120) NOT NULL DEFAULT '',
      direccion   VARCHAR(255) NOT NULL DEFAULT '',
      ciudad      VARCHAR(80)  NOT NULL DEFAULT '',
      zona        VARCHAR(40)  NOT NULL DEFAULT '',
      estatus     VARCHAR(24)  NOT NULL DEFAULT '',
      precio      INT          NOT NULL DEFAULT 0,
      referencia  VARCHAR(255) NOT NULL DEFAULT '',
      medidas     VARCHAR(80)  NOT NULL DEFAULT '',
      altura      DECIMAL(8,3) NULL,
      lat         DECIMAL(11,8) NULL,
      lng         DECIMAL(11,8) NULL,
      visto       DATE         NOT NULL,
      PRIMARY KEY (clave),
      KEY k_tipo (tipo), KEY k_zona (zona), KEY k_estatus (estatus)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

/**
 * «UNIPOLAR SUBARRENDADO» es un unipolar. Que la estructura sea propia o
 * subarrendada es contabilidad de ellos, no información para quien compra.
 */
function espec_tipo(string $bruto): string
{
    $t = mb_strtoupper(trim($bruto), 'UTF-8');
    foreach (['PANTALLA', 'UNIPOLAR', 'CARTELERA', 'PUENTE', 'VALLA'] as $base) {
        if (str_starts_with($t, $base)) return $base;
    }
    return $t !== '' ? $t : 'OTRO';
}

/** Una coordenada solo sirve si es un número y no cae en el golfo de Guinea. */
function espec_coord($lat, $lng): ?array
{
    if (!is_numeric($lat) || !is_numeric($lng)) return null;
    $la = (float)$lat; $ln = (float)$lng;
    if (abs($la) < 0.001 && abs($ln) < 0.001) return null;   // el 0,0 de su base
    if ($la < 14 || $la > 33 || $ln < -118 || $ln > -86) return null;  // fuera de México
    return [$la, $ln];
}

/**
 * Trae el inventario y lo guarda. Devuelve el parte: cuántos llegaron, cuántos
 * son nuevos, cuántos cambiaron de estatus y cuántos vienen sin coordenada.
 */
function espec_sincronizar(): array
{
    espec_tabla();
    $p = db();

    $ch = curl_init(ESPEC_API);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 45,
        CURLOPT_USERAGENT      => 'inedito.digital/1.0 (+catalogo espectaculares)',
        /* Su certificado en el 5300 no valida contra el almacén del servidor.
           Es la API de un socio y el dato no es sensible, así que se acepta;
           dejarlo apuntado para que nadie crea que fue un descuido. */
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
    ]);
    $cuerpo = curl_exec($ch);
    $err    = curl_error($ch);
    $codigo = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($codigo !== 200 || $err !== '') {
        return ['ok' => false, 'error' => $err !== '' ? $err : "HTTP $codigo"];
    }
    $filas = json_decode((string)$cuerpo, true);
    if (!is_array($filas) || !$filas) {
        return ['ok' => false, 'error' => 'la respuesta no trae registros'];
    }

    $antes = [];
    foreach ($p->query("SELECT clave, estatus FROM espectaculares")->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $antes[$r['clave']] = $r['estatus'];
    }

    $ins = $p->prepare("INSERT INTO espectaculares
      (clave,vistaid,titulo,tipo,colonia,direccion,ciudad,zona,estatus,precio,referencia,medidas,altura,lat,lng,visto)
      VALUES (:clave,:vistaid,:titulo,:tipo,:colonia,:dir,:ciudad,:zona,:estatus,:precio,:ref,:med,:alt,:lat,:lng,:visto)
      ON DUPLICATE KEY UPDATE
        vistaid=VALUES(vistaid), titulo=VALUES(titulo), tipo=VALUES(tipo), colonia=VALUES(colonia),
        direccion=VALUES(direccion), ciudad=VALUES(ciudad), zona=VALUES(zona), estatus=VALUES(estatus),
        precio=VALUES(precio), referencia=VALUES(referencia), medidas=VALUES(medidas),
        altura=VALUES(altura), lat=VALUES(lat), lng=VALUES(lng), visto=VALUES(visto)");

    $hoy = date('Y-m-d');
    $n = $nuevos = $cambios = $sinCoord = 0;
    $vistas = [];

    foreach ($filas as $f) {
        $clave = trim((string)($f['clave'] ?? $f['id'] ?? ''));
        if ($clave === '') continue;
        $vistas[] = $clave;

        $c = espec_coord($f['lat'] ?? null, $f['lng'] ?? null);
        if ($c === null) $sinCoord++;

        $estatus = mb_strtoupper(trim((string)($f['estatus'] ?? $f['status'] ?? '')), 'UTF-8');
        if (!isset($antes[$clave]))            $nuevos++;
        elseif ($antes[$clave] !== $estatus)   $cambios++;

        $ins->execute([
            ':clave'   => mb_substr($clave, 0, 24),
            ':vistaid' => is_numeric($f['vistaid'] ?? null) ? (int)$f['vistaid'] : null,
            ':titulo'  => mb_substr(trim((string)($f['title'] ?? '')), 0, 255),
            ':tipo'    => espec_tipo((string)($f['type'] ?? '')),
            ':colonia' => mb_substr(trim((string)($f['colonia'] ?? '')), 0, 120),
            ':dir'     => mb_substr(trim((string)($f['address'] ?? '')), 0, 255),
            ':ciudad'  => mb_substr(trim((string)($f['ciudad'] ?? '')), 0, 80),
            ':zona'    => mb_substr(mb_strtoupper(trim((string)($f['zona'] ?? '')), 'UTF-8'), 0, 40),
            ':estatus' => mb_substr($estatus, 0, 24),
            ':precio'  => is_numeric($f['precio'] ?? null) ? (int)$f['precio'] : 0,
            ':ref'     => mb_substr(trim((string)($f['referencia'] ?? '')), 0, 255),
            ':med'     => mb_substr(trim((string)($f['medidas'] ?? '')), 0, 80),
            ':alt'     => is_numeric($f['alturaestructura'] ?? null) ? (float)$f['alturaestructura'] : null,
            ':lat'     => $c ? $c[0] : null,
            ':lng'     => $c ? $c[1] : null,
            ':visto'   => $hoy,
        ]);
        $n++;
    }

    /* Los que ya no vienen no se borran: se quedan con su última fecha vista y
       dejan de salir en el catálogo público por la consulta, no por el borrado. */
    $idos = count(array_diff(array_keys($antes), $vistas));

    return [
        'ok' => true, 'recibidos' => $n, 'nuevos' => $nuevos, 'cambios' => $cambios,
        'sin_coordenada' => $sinCoord, 'desaparecidos' => $idos, 'fecha' => $hoy,
    ];
}

/**
 * Lo que se publica: lo visto en la última sincronización, ordenado.
 *
 * Recibe la conexión porque esto lo llaman tres sitios con tres formas de
 * conectarse —el panel con db(), render.php y la API con su propio PDO— y
 * amarrarlo al ayudante del panel lo dejaba devolviendo vacío en los otros dos
 * sin decir por qué.
 */
function espec_catalogo(?PDO $pdo = null): array
{
    try {
        $c = $pdo ?: (function_exists('db') ? db() : null);
        if (!$c) return [];
        $ult = (string)$c->query("SELECT MAX(visto) FROM espectaculares")->fetchColumn();
        if ($ult === '') return [];
        $st = $c->prepare("SELECT clave,titulo,tipo,colonia,direccion,zona,estatus,precio,
                                  referencia,medidas,altura,lat,lng
                           FROM espectaculares WHERE visto = :v
                           ORDER BY FIELD(estatus,'DISPONIBLE') DESC, zona, tipo, clave");
        $st->execute([':v' => $ult]);
        return $st->fetchAll(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {
        return [];
    }
}
