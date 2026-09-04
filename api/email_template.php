<?php
/**
 * El aviso de un prospecto nuevo, por correo.
 *
 * Dirección visual
 * ----------------
 * Brutalista: cero esquinas redondeadas, filetes gruesos como estructura en
 * vez de cajas flotando, contraste tipográfico duro —el nombre enorme y
 * apretado contra rótulos diminutos en monoespaciada— y bloques planos de
 * color, sin degradados suaves ni sombras. La versión anterior era una
 * tarjeta redondeada con banda en degradado, centrada en la página: el molde
 * que traen todos los correos de notificación, y por eso no se distinguía de
 * ninguno.
 *
 * La monoespaciada no es disfraz de «técnico»: se usa solo donde hay dato y
 * medida —fecha, teléfono, rótulos de ficha—, que es para lo que sirve.
 *
 * Sin numeración de secciones y sin rótulo pequeño encima del titular: el
 * nombre de quien escribió es el titular y se sostiene solo.
 *
 * Sin tipografía de marca, y no por descuido: Gmail y compañía eliminan
 * @font-face, así que una fuente propia no llegaría a nadie. La voz la
 * llevan el logotipo, el morado y el peso. Poner el titular como imagen
 * sería peor: muchos clientes bloquean imágenes y llegaría un correo mudo.
 *
 * Todo en tablas y estilos en línea porque Outlook ignora flex, grid y casi
 * cualquier cosa moderna.
 */
declare(strict_types=1);

/* --- la paleta, repetida aquí porque un correo viaja solo --- */
const MAIL_NEGRO = '#08080D';
const MAIL_CARTA = '#101018';
const MAIL_LINEA = '#2A2A3D';
const MAIL_TXT   = '#FFFFFF';
const MAIL_SUAVE = '#CFC8DC';
const MAIL_MUT   = '#8B8799';
const MAIL_PUR   = '#7700CE';
const MAIL_PUR2  = '#9933FF';
const MAIL_PUR3  = '#CC66FF';
const MAIL_VERDE = '#00E585';

/** Las dos voces. Sin webfont: en correo no carga y no hay vuelta de hoja. */
const MAIL_SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MAIL_MONO = "'Courier New', Courier, monospace";

/** El número listo para wa.me. Devuelve '' si no hay uno usable. */
function mail_wa(string $tel): string
{
    $d = preg_replace('/\D/', '', $tel);
    if (strlen($d) === 10) $d = '52' . $d;
    return strlen($d) >= 11 ? $d : '';
}

/** «449 120 4353» en vez de «4491204353». */
function mail_tel(string $tel): string
{
    $d = preg_replace('/\D/', '', $tel);
    if (strlen($d) === 12 && str_starts_with($d, '52')) $d = substr($d, 2);
    if (strlen($d) !== 10) return $tel;
    return substr($d, 0, 3) . ' ' . substr($d, 3, 3) . ' ' . substr($d, 6);
}

/**
 * Un botón de bloque: tabla con fondo y esquinas rectas. Un <a> con relleno
 * se pinta como enlace suelto en Outlook, y el radio redondeado rompería la
 * dirección.
 */
function mail_boton(string $url, string $texto, string $fondo, string $color = '#000000'): string
{
    $u = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
    $t = htmlspecialchars(mb_strtoupper($texto, 'UTF-8'), ENT_QUOTES, 'UTF-8');
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="' . $fondo . '" style="background:' . $fondo . ';">
        <a href="' . $u . '" target="_blank"
           style="display:block;padding:17px 30px;font:700 13px/1 ' . MAIL_SANS . ';
                  letter-spacing:1.6px;color:' . $color . ';text-decoration:none;">' . $t . '</a>
      </td></tr></table>';
}

/** El rótulo de una sección: monoespaciada, diminuto, muy espaciado. */
function mail_rotulo(string $txt): string
{
    return '<div style="font:400 10px/1 ' . MAIL_MONO . ';letter-spacing:2.6px;
        text-transform:uppercase;color:' . MAIL_MUT . ';">'
        . htmlspecialchars($txt, ENT_QUOTES, 'UTF-8') . '</div>';
}

/** Un filete. La estructura a la vista, que es de lo que va esto. */
function mail_filete(string $color, int $alto = 3): string
{
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td height="' . $alto . '" bgcolor="' . $color . '"
          style="height:' . $alto . 'px;line-height:' . $alto . 'px;font-size:0;">&nbsp;</td></tr>
    </table>';
}

/**
 * La versión en texto plano.
 *
 * El mailer la sacaba quitando etiquetas del HTML, y con una maqueta de
 * tablas eso deja una escalera de espacios sin sentido. Además de leerse
 * mejor en los clientes que no pintan HTML, un correo con las dos versiones
 * bien hechas pasa mejor los filtros de spam.
 */
function lead_email_texto(array $lead): string
{
    $nombre  = trim((string)($lead['name'] ?? '')) ?: 'Alguien';
    $mensaje = trim((string)($lead['message'] ?? ''));
    $fecha   = trim((string)($lead['fecha'] ?? '')) ?: date('Y-m-d H:i:s');

    $l = ['NUEVO PROSPECTO', str_repeat('=', 44), '', mb_strtoupper($nombre, 'UTF-8')];
    $l[] = (trim((string)($lead['source'] ?? '')) ?: 'Sitio web') . '  /  ' . date('d.m.Y / H:i', strtotime($fecha));
    $l[] = '';
    if ($mensaje !== '') { $l[] = $mensaje; $l[] = ''; }
    $l[] = str_repeat('-', 44);
    foreach ([
        'TELÉFONO'    => ($p = trim((string)($lead['phone'] ?? ''))) !== '' ? mail_tel($p) : '',
        'CORREO'      => trim((string)($lead['email'] ?? '')),
        'EMPRESA'     => trim((string)($lead['company'] ?? '')),
        'LE INTERESA' => trim((string)($lead['service'] ?? '')),
    ] as $rot => $val) {
        if ($val !== '') $l[] = str_pad($rot, 14) . $val;
    }
    $l[] = str_repeat('-', 44);
    $l[] = '';
    $l[] = 'Abrir en el panel: https://www.inedito.digital/panel/?p=leads';
    return implode("\n", $l);
}

/**
 * El correo completo.
 *
 * `$lead` acepta name, email, phone, company, service, message, source y,
 * si quien llama la tiene, `fecha`.
 */
function lead_email_html(array $lead): string
{
    $e = fn($v) => htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8');

    $nombre  = trim((string)($lead['name'] ?? '')) ?: 'Alguien';
    $mensaje = trim((string)($lead['message'] ?? ''));
    $tel     = trim((string)($lead['phone'] ?? ''));
    $correo  = trim((string)($lead['email'] ?? ''));
    $wa      = mail_wa($tel);
    $fecha   = trim((string)($lead['fecha'] ?? '')) ?: date('Y-m-d H:i:s');
    $origen  = trim((string)($lead['source'] ?? '')) ?: 'Sitio web';

    /* El asistente firma con dónde estaba la persona, y vienen dos formas:
       «la página /ruta» si estaba en una interior, «el sitio» si estaba en la
       portada. Tratar la segunda como ruta producía un enlace roto. */
    $desde = ''; $desdeUrl = '';
    if (preg_match('~\(Escribo desde ([^)]+)\)~u', $mensaje, $m)) {
        $bruto = trim($m[1]);
        $mensaje = trim(preg_replace('~_?\(Escribo desde [^)]+\)_?~u', '', $mensaje));
        if (preg_match('~(/[^\s)]*)~u', $bruto, $mp)) {
            $desde = $mp[1];
            $desdeUrl = 'https://www.inedito.digital' . $mp[1];
        } elseif (mb_stripos($bruto, 'el sitio') !== false) {
            /* location.pathname siempre trae al menos «/»: solo la portada. */
            $desde = 'La portada';
            $desdeUrl = 'https://www.inedito.digital/';
        } else {
            $desde = $bruto;
        }
    }

    $t = strtotime($fecha);
    $cuando = date('d.m.Y', $t) . ' / ' . date('H:i', $t);

    /* --- la ficha, solo con lo que existe --- */
    $filas = [];
    if ($tel !== '')    $filas[] = ['Teléfono', '<a href="tel:+' . $e($wa ?: preg_replace('/\D/', '', $tel)) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e(mail_tel($tel)) . '</a>'];
    if ($correo !== '') $filas[] = ['Correo', '<a href="mailto:' . $e($correo) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e($correo) . '</a>'];
    if (trim((string)($lead['company'] ?? '')) !== '') $filas[] = ['Empresa', $e($lead['company'])];
    if (trim((string)($lead['service'] ?? '')) !== '') $filas[] = ['Le interesa', $e($lead['service'])];
    if ($desde !== '') {
        $filas[] = ['Estaba viendo', $desdeUrl !== ''
            ? '<a href="' . $e($desdeUrl) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e($desde) . '</a>'
            : $e($desde)];
    }
    $filas[] = ['Recibido', $e($cuando)];

    $fichaHtml = '';
    foreach ($filas as $i => [$rot, $val]) {
        $sep = $i > 0 ? 'border-top:1px solid ' . MAIL_LINEA . ';' : '';
        $fichaHtml .= '<tr>
          <td width="132" style="width:132px;padding:14px 14px 14px 0;' . $sep . '
              font:400 10px/1.7 ' . MAIL_MONO . ';letter-spacing:1.6px;text-transform:uppercase;
              color:' . MAIL_MUT . ';vertical-align:top;">' . $e($rot) . '</td>
          <td style="padding:14px 0;' . $sep . 'font:400 15px/1.6 ' . MAIL_SANS . ';
              color:' . MAIL_TXT . ';vertical-align:top;">' . $val . '</td>
        </tr>';
    }

    /* --- lo que escribió, entero y con sus saltos --- */
    if ($mensaje !== '') {
        /* Tres saltos seguidos o más se quedan en uno: quien escribe desde el
           teléfono deja líneas en blanco de sobra. */
        $cuerpo = nl2br($e(preg_replace("/\n{3,}/", "\n\n", $mensaje)));
        /* El asistente redacta el mensaje para WhatsApp, donde *asi* es
           negrita. En un correo los asteriscos salen crudos y parecen un
           error de quien escribio. */
        $cuerpo = preg_replace('~\*([^*\n<]{1,80})\*~u',
            '<strong style="font-weight:700;">$1</strong>', $cuerpo);
        $mensajeHtml = '<div style="font:400 17px/1.65 ' . MAIL_SANS . ';color:' . MAIL_TXT . ';">'
                     . $cuerpo . '</div>';
    } else {
        $mensajeHtml = '<div style="font:400 15px/1.6 ' . MAIL_SANS . ';color:' . MAIL_MUT . ';">'
                     . 'No dejó mensaje. Los datos están abajo.</div>';
    }

    /* --- botones --- */
    $acciones = '';
    if ($wa !== '') {
        $txtWa = rawurlencode('Hola ' . explode(' ', $nombre)[0] . ', te escribo de Inédito Digital. Vi tu mensaje desde el sitio.');
        $acciones .= '<td style="padding-right:12px;">' . mail_boton('https://wa.me/' . $wa . '?text=' . $txtWa, 'Escribir por WhatsApp', MAIL_VERDE, '#04240F') . '</td>';
    }
    if ($correo !== '') {
        $acciones .= '<td style="padding-right:12px;">' . mail_boton('mailto:' . $correo, 'Responder por correo', MAIL_PUR2, '#FFFFFF') . '</td>';
    }

    $accionesHtml = $acciones !== ''
        ? '<tr><td style="padding:0 40px 34px;">
             <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' . $acciones . '</tr></table>
           </td></tr>'
        : '<tr><td style="padding:0 40px 34px;">
             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
               <tr><td style="border-left:3px solid ' . MAIL_PUR2 . ';padding:2px 0 2px 16px;
                   font:400 14px/1.6 ' . MAIL_SANS . ';color:' . MAIL_SUAVE . ';">
                 No dejó teléfono ni correo. Si te escribió por WhatsApp, guarda su número en el
                 panel para poder buscarla después.
               </td></tr>
             </table>
           </td></tr>';

    /* Tambien sin los asteriscos: este es el texto que asoma en la bandeja
       antes de abrir, y ahi no hay negritas que valgan. */
    $asomo = $mensaje !== ''
        ? mb_substr(preg_replace(['/\*([^*
]{1,80})\*/u', '/\s+/u'], ['$1', ' '], $mensaje), 0, 110)
        : $nombre . ' dejó sus datos en el sitio.';

    return '<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Nuevo prospecto</title>
</head>
<body style="margin:0;padding:0;background:' . MAIL_NEGRO . ';">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . $e($asomo) . '</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       bgcolor="' . MAIL_NEGRO . '" style="background:' . MAIL_NEGRO . ';">
<tr><td align="center" style="padding:0 0 44px;">

  <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0"
         style="width:620px;max-width:100%;background:' . MAIL_CARTA . ';">

    <!-- franja: morado plano, sin degradado y sin esquinas -->
    <tr><td bgcolor="' . MAIL_PUR . '" style="background:' . MAIL_PUR . ';padding:18px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;">
          <img src="https://www.inedito.digital/media/inedito-logo.png" width="96" alt="Inédito Digital"
               style="display:block;width:96px;height:auto;border:0;">
        </td>
        <td align="right" style="vertical-align:middle;font:400 10px/1 ' . MAIL_MONO . ';
            letter-spacing:2.6px;color:#EAD4FF;">NUEVO PROSPECTO</td>
      </tr></table>
    </td></tr>

    <!-- el nombre manda -->
    <tr><td style="padding:44px 40px 0;">
      <div style="font:900 40px/1.02 ' . MAIL_SANS . ';letter-spacing:-1.4px;
           text-transform:uppercase;color:' . MAIL_TXT . ';">' . $e($nombre) . '</div>
      <div style="padding-top:16px;font:400 11px/1.6 ' . MAIL_MONO . ';letter-spacing:1.8px;
           text-transform:uppercase;color:' . MAIL_MUT . ';">'
           . $e($origen) . ' &nbsp;/&nbsp; ' . $e($cuando) . '</div>
    </td></tr>

    <tr><td style="padding:32px 40px 0;">' . mail_filete(MAIL_PUR2, 3) . '</td></tr>

    <!-- lo que escribió -->
    <tr><td style="padding:26px 40px 0;">' . mail_rotulo('Lo que escribió') . '</td></tr>
    <tr><td style="padding:16px 40px 34px;">' . $mensajeHtml . '</td></tr>

    ' . $accionesHtml . '

    <!-- la ficha -->
    <tr><td style="padding:0 40px;">' . mail_filete(MAIL_LINEA, 1) . '</td></tr>
    <tr><td style="padding:22px 40px 0;">' . mail_rotulo('La ficha') . '</td></tr>
    <tr><td style="padding:10px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $fichaHtml . '</table>
    </td></tr>

    <!-- pie -->
    <tr><td style="padding:34px 40px 0;">' . mail_filete(MAIL_PUR2, 3) . '</td></tr>
    <tr><td style="padding:24px 40px 40px;">
      <a href="https://www.inedito.digital/panel/?p=leads" target="_blank"
         style="font:700 12px/1 ' . MAIL_SANS . ';letter-spacing:1.8px;text-transform:uppercase;
                color:' . MAIL_PUR3 . ';text-decoration:none;">Abrir en el panel &nbsp;&#8599;</a>
      <div style="padding-top:18px;font:400 10px/1.7 ' . MAIL_MONO . ';letter-spacing:1.2px;
           text-transform:uppercase;color:#5C5870;">
        Aviso automático de inedito.digital<br>
        Responder a este correo contesta a ' . $e($nombre) . '
      </div>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>';
}
