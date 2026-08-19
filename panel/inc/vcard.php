<?php
/**
 * ============================================================
 * LA TARJETA DE CONTACTO (.vcf)
 * ============================================================
 *
 * Es el archivo que se guarda en la agenda del celular cuando alguien toca
 * "Guardar mi contacto". Se arma aquí, en el servidor, por tres razones:
 *
 *  - Hay una sola versión. El panel enseña exactamente lo que se va a
 *    entregar, no una imitación.
 *  - iOS abre mejor una dirección servida como text/vcard que un archivo
 *    fabricado con JavaScript.
 *  - La foto se puede encoger antes de meterla, cosa que en el navegador
 *    saldría cara y a veces ni se puede por permisos de otro dominio.
 *
 * Lo que el cliente deja vacío en el panel se toma de la página. Así no
 * tiene que escribir dos veces lo mismo, y si algún día quiere que en la
 * agenda diga algo distinto, lo escribe y ya.
 */

/** El primer valor que no venga vacío. */
function vcf_o(...$vals): string
{
    foreach ($vals as $v) {
        $v = trim((string)$v);
        if ($v !== '') return $v;
    }
    return '';
}

/** Escapa lo que la vCard trata como separadores. */
function vcf_esc(string $v): string
{
    return str_replace(['\\', ';', ',', "\r\n", "\n"], ['\\\\', '\;', '\,', '\n', '\n'], $v);
}

/**
 * Parte las líneas largas como pide el formato.
 *
 * Sin esto la foto se va en un solo renglón de miles de letras y algunos
 * celulares se niegan a leer el archivo completo.
 */
function vcf_doblar(string $linea): string
{
    if (strlen($linea) <= 75) return $linea;
    $out = substr($linea, 0, 75);
    $resto = substr($linea, 75);
    foreach (str_split($resto, 74) as $trozo) $out .= "\r\n " . $trozo;
    return $out;
}

/**
 * Baja la foto y la deja lista para meterla en el archivo.
 *
 * Se encoge a 400px y se recorta al centro: en la agenda se ve chica y una
 * foto de 2 MB haría el contacto imposible de mandar por WhatsApp.
 * Si algo falla, devuelve null y la tarjeta se entrega sin foto.
 */
function vcf_foto_base64(string $url, int $lado = 400): ?string
{
    if ($url === '' || !function_exists('curl_init') || !extension_loaded('gd')) return null;
    if (str_starts_with($url, '/')) return null; // una ruta del sitio, no una imagen que podamos bajar

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 3,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_USERAGENT      => 'InéditoDigital/1.0 (vCard)',
    ]);
    $bin = curl_exec($ch);
    $codigo = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($bin === false || $codigo !== 200 || strlen($bin) < 64) return null;

    $img = @imagecreatefromstring($bin);
    if (!$img) return null;

    $w = imagesx($img);
    $h = imagesy($img);
    $corte = min($w, $h);
    $x = (int)(($w - $corte) / 2);
    $y = (int)(($h - $corte) / 2);

    $dst = imagecreatetruecolor($lado, $lado);
    imagefill($dst, 0, 0, imagecolorallocate($dst, 13, 0, 16));
    imagecopyresampled($dst, $img, 0, 0, $x, $y, $lado, $lado, $corte, $corte);
    imagedestroy($img);

    ob_start();
    imagejpeg($dst, null, 82);
    $jpg = (string)ob_get_clean();
    imagedestroy($dst);

    return $jpg === '' ? null : base64_encode($jpg);
}

/**
 * Arma la tarjeta.
 *
 * $d son los datos del integrante ya mezclados con sus respaldos.
 * $conFoto se puede apagar cuando solo queremos ver el texto (la vista
 * previa del panel), para no bajar la imagen cada vez.
 */
function vcard_texto(array $d, string $url, bool $conFoto = true): string
{
    $nombre = vcf_o($d['vcf_nombre'] ?? '', $d['nombre'] ?? '');
    $partes = preg_split('/\s+/', trim($nombre)) ?: [];
    $pila   = array_shift($partes) ?? '';
    $resto  = implode(' ', $partes);

    $l = ['BEGIN:VCARD', 'VERSION:3.0'];
    $l[] = 'N:' . vcf_esc($resto) . ';' . vcf_esc($pila) . ';;;';
    $l[] = 'FN:' . vcf_esc($nombre);

    $empresa = vcf_o($d['vcf_empresa'] ?? '', $d['empresa'] ?? '');
    $puesto  = vcf_o($d['vcf_puesto'] ?? '', $d['puesto'] ?? '');
    if ($empresa !== '') $l[] = 'ORG:' . vcf_esc($empresa);
    if ($puesto !== '')  $l[] = 'TITLE:' . vcf_esc($puesto);

    $tel1 = preg_replace('/[^\d+]/', '', vcf_o($d['vcf_tel'] ?? '', $d['telefono'] ?? ''));
    $tel2 = preg_replace('/[^\d+]/', '', vcf_o($d['vcf_tel2'] ?? '', $d['whatsapp'] ?? ''));
    if ($tel1 !== '') $l[] = 'TEL;TYPE=CELL,VOICE:' . $tel1;
    if ($tel2 !== '' && $tel2 !== $tel1) $l[] = 'TEL;TYPE=WORK,VOICE:' . $tel2;

    $email = vcf_o($d['vcf_email'] ?? '', $d['email'] ?? '');
    if ($email !== '') $l[] = 'EMAIL;TYPE=INTERNET,PREF:' . vcf_esc($email);

    // Dirección: calle ; ciudad ; estado ; código postal ; país
    $calle  = trim((string)($d['vcf_calle'] ?? ''));
    $ciudad = vcf_o($d['vcf_ciudad'] ?? '', $d['ciudad'] ?? '');
    $estado = trim((string)($d['vcf_estado'] ?? ''));
    $cp     = trim((string)($d['vcf_cp'] ?? ''));
    $pais   = trim((string)($d['vcf_pais'] ?? ''));
    if ($calle !== '' || $ciudad !== '' || $estado !== '' || $cp !== '') {
        $l[] = 'ADR;TYPE=WORK:;;' . vcf_esc($calle) . ';' . vcf_esc($ciudad) . ';'
             . vcf_esc($estado) . ';' . vcf_esc($cp) . ';' . vcf_esc($pais);
    }

    $sitio = vcf_o($d['vcf_sitio'] ?? '', $url);
    if ($sitio !== '') $l[] = 'URL:' . vcf_esc($sitio);
    if ($sitio !== $url && $url !== '') $l[] = 'URL;TYPE=PERSONAL:' . vcf_esc($url);

    if (($d['vcf_redes'] ?? '1') !== '0') {
        $redes = ['instagram' => 'Instagram', 'facebook' => 'Facebook', 'linkedin' => 'LinkedIn',
                  'tiktok' => 'TikTok', 'youtube' => 'YouTube', 'behance' => 'Behance'];
        foreach ($redes as $k => $etiqueta) {
            $v = trim((string)($d[$k] ?? ''));
            if ($v !== '') $l[] = 'X-SOCIALPROFILE;TYPE=' . $etiqueta . ':' . vcf_esc($v);
        }
    }

    $nota = vcf_o($d['vcf_nota'] ?? '', $d['frase'] ?? '');
    if ($nota !== '') $l[] = 'NOTE:' . vcf_esc($nota);

    if ($conFoto && ($d['vcf_foto'] ?? '1') !== '0') {
        $b64 = vcf_foto_base64(trim((string)($d['foto'] ?? '')));
        if ($b64 !== null) $l[] = 'PHOTO;ENCODING=b;TYPE=JPEG:' . $b64;
    }

    $l[] = 'REV:' . gmdate('Y-m-d\TH:i:s\Z');
    $l[] = 'END:VCARD';

    return implode("\r\n", array_map('vcf_doblar', $l)) . "\r\n";
}

/** Cómo se va a llamar el archivo que baja. */
function vcard_archivo(array $d, string $slug): string
{
    $n = trim((string)($d['vcf_archivo'] ?? ''));
    if ($n === '') $n = $slug;
    $n = preg_replace('/[^A-Za-z0-9._-]/', '-', $n) ?: 'contacto';
    return rtrim($n, '.') . '.vcf';
}
