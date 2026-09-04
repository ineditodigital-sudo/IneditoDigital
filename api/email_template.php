<?php
/**
 * El aviso de un prospecto nuevo, por correo.
 *
 * Se lee casi siempre en el teléfono y en treinta segundos, así que responde
 * en este orden: quién escribió, qué dijo con sus palabras, y el botón para
 * contestarle. Los datos de ficha van después, que es cuando ya se decidió
 * atender.
 *
 * Escrito con tablas y estilos en línea porque un correo no es una página:
 * Outlook ignora flex, grid y casi todo lo que no sea una tabla. Y sin
 * tipografía de marca: las fuentes web no cargan en la mayoría de los
 * clientes, así que la identidad la llevan el logotipo, el color y el peso.
 * Poner el titular como imagen sería peor —muchos clientes bloquean las
 * imágenes y el correo llegaría sin encabezado.
 */
declare(strict_types=1);

/** El color de la casa, repetido aquí porque un correo viaja solo. */
const MAIL_FONDO = '#0B0A12';
const MAIL_CARTA = '#13131F';
const MAIL_LINEA = '#26263A';
const MAIL_TXT   = '#F2F0F6';
const MAIL_SUAVE = '#CBC4DA';
const MAIL_MUT   = '#8F8BA4';
const MAIL_PUR   = '#7700CE';
const MAIL_PUR2  = '#9933FF';
const MAIL_PUR3  = '#CC66FF';
const MAIL_VERDE = '#1FAA53';

/** El número, listo para wa.me. Devuelve '' si no hay uno usable. */
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
 * Un botón que aguanta en Outlook: una tabla con fondo, no un <a> con
 * padding, que ahí se pinta como un enlace suelto.
 */
function mail_boton(string $url, string $texto, string $fondo, string $color = '#FFFFFF'): string
{
    $u = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
    $t = htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
      <tr><td align="center" bgcolor="' . $fondo . '" style="border-radius:10px;">
        <a href="' . $u . '" target="_blank"
           style="display:inline-block;padding:14px 26px;font:700 14px/1 Arial,Helvetica,sans-serif;
                  color:' . $color . ';text-decoration:none;border-radius:10px;">' . $t . '</a>
      </td></tr></table>';
}


/**
 * La version en texto plano.
 *
 * El mailer la sacaba quitando etiquetas del HTML, y con una maqueta de
 * tablas eso deja una escalera de espacios sin sentido. Ademas de leerse
 * mejor en los clientes que no pintan HTML, un correo con las dos versiones
 * bien hechas pasa mejor los filtros de spam.
 */
function lead_email_texto(array $lead): string
{
    $nombre  = trim((string)($lead['name'] ?? '')) ?: 'Alguien';
    $mensaje = trim((string)($lead['message'] ?? ''));
    $fecha   = trim((string)($lead['fecha'] ?? '')) ?: date('Y-m-d H:i:s');

    $l = ['NUEVO PROSPECTO', '', $nombre];
    $l[] = (trim((string)($lead['source'] ?? '')) ?: 'Sitio web') . ' · ' . date('d/m/Y H:i', strtotime($fecha));
    $l[] = '';
    if ($mensaje !== '') { $l[] = $mensaje; $l[] = ''; }
    foreach ([
        'Teléfono'    => ($p = trim((string)($lead['phone'] ?? ''))) !== '' ? mail_tel($p) : '',
        'Correo'      => trim((string)($lead['email'] ?? '')),
        'Empresa'     => trim((string)($lead['company'] ?? '')),
        'Le interesa' => trim((string)($lead['service'] ?? '')),
    ] as $rot => $val) {
        if ($val !== '') $l[] = $rot . ': ' . $val;
    }
    $l[] = '';
    $l[] = 'Abrir en el panel: https://www.inedito.digital/panel/?p=leads';
    return implode("\n", $l);
}

/**
 * El correo completo.
 *
 * `$lead` acepta name, email, phone, company, service, message, source y,
 * si quien llama los tiene, `fecha` e `id`.
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

    /* El asistente firma el mensaje con la página desde donde escribieron.
       Se saca a su propio renglón: dice en qué estaba interesado antes de
       escribir, que es la mitad del contexto. */
    $desde = '';
    if (preg_match('~\(Escribo desde (?:la página )?([^)]+)\)~u', $mensaje, $m)) {
        $desde = trim($m[1]);
        $mensaje = trim(preg_replace('~_?\(Escribo desde (?:la página )?[^)]+\)_?~u', '', $mensaje));
    }

    $meses = [1=>'ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    $t = strtotime($fecha);
    $cuando = (int)date('j', $t) . ' ' . $meses[(int)date('n', $t)] . ' ' . date('Y', $t) . ', ' . date('H:i', $t);

    /* --- la ficha, solo con lo que existe --- */
    $filas = [];
    if ($tel !== '')    $filas[] = ['Teléfono', '<a href="tel:+' . $e($wa ?: preg_replace('/\D/', '', $tel)) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e(mail_tel($tel)) . '</a>'];
    if ($correo !== '') $filas[] = ['Correo', '<a href="mailto:' . $e($correo) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e($correo) . '</a>'];
    if (trim((string)($lead['company'] ?? '')) !== '') $filas[] = ['Empresa', $e($lead['company'])];
    if (trim((string)($lead['service'] ?? '')) !== '') $filas[] = ['Le interesa', $e($lead['service'])];
    if ($desde !== '') $filas[] = ['Estaba viendo', '<a href="https://www.inedito.digital' . $e($desde) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e($desde) . '</a>'];
    $filas[] = ['Cómo llegó', $e(trim((string)($lead['source'] ?? '')) ?: 'Sitio web')];
    $filas[] = ['Recibido', $e($cuando)];

    $fichaHtml = '';
    foreach ($filas as $i => [$rot, $val]) {
        $borde = $i < count($filas) - 1 ? 'border-bottom:1px solid ' . MAIL_LINEA . ';' : '';
        $fichaHtml .= '<tr>
          <td style="padding:13px 0;width:120px;' . $borde . 'font:400 13px/1.4 Arial,Helvetica,sans-serif;color:' . MAIL_MUT . ';vertical-align:top;">' . $e($rot) . '</td>
          <td style="padding:13px 0;' . $borde . 'font:400 14px/1.5 Arial,Helvetica,sans-serif;color:' . MAIL_TXT . ';vertical-align:top;">' . $val . '</td>
        </tr>';
    }

    /* --- lo que escribió, entero y con sus saltos de línea --- */
    $mensajeHtml = '';
    if ($mensaje !== '') {
        $mensajeHtml = '
        <tr><td style="padding:0 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-left:18px;border-left:2px solid ' . MAIL_PUR2 . ';
                         font:400 16px/1.7 Arial,Helvetica,sans-serif;color:' . MAIL_TXT . ';">'
                /* Tres saltos seguidos o mas se quedan en uno: quien escribe
                   desde el telefono deja lineas en blanco de sobra, y aqui
                   se convertian en huecos enormes. */
                . nl2br($e(preg_replace('/\n{3,}/', "\n\n", $mensaje))) . '</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="height:28px;line-height:28px;">&nbsp;</td></tr>';
    } else {
        $mensajeHtml = '
        <tr><td style="padding:0 32px;font:400 15px/1.6 Arial,Helvetica,sans-serif;color:' . MAIL_MUT . ';">
          No dejó mensaje. Los datos de contacto están abajo.
        </td></tr>
        <tr><td style="height:28px;line-height:28px;">&nbsp;</td></tr>';
    }

    /* --- los botones --- */
    $acciones = '';
    if ($wa !== '') {
        $txtWa = rawurlencode('Hola ' . explode(' ', $nombre)[0] . ', te escribo de Inédito Digital. Vi tu mensaje desde el sitio.');
        $acciones .= '<td style="padding-right:10px;">' . mail_boton('https://wa.me/' . $wa . '?text=' . $txtWa, 'Escribir por WhatsApp', MAIL_VERDE) . '</td>';
    }
    if ($correo !== '') {
        $acciones .= '<td style="padding-right:10px;">' . mail_boton('mailto:' . $correo, 'Responder por correo', MAIL_PUR) . '</td>';
    }
    if ($acciones === '') {
        $acciones = '<td style="font:400 14px/1.6 Arial,Helvetica,sans-serif;color:' . MAIL_MUT . ';">'
                  . 'No dejó teléfono ni correo. Si te escribió por WhatsApp, guarda su número en el panel.</td>';
    }

    /* El texto que asoma en la bandeja, antes de abrir. */
    $asomo = $mensaje !== ''
        ? mb_substr(preg_replace('/\s+/u', ' ', $mensaje), 0, 110)
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
<body style="margin:0;padding:0;background:' . MAIL_FONDO . ';">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . $e($asomo) . '</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' . MAIL_FONDO . '" style="background:' . MAIL_FONDO . ';">
<tr><td align="center" style="padding:28px 14px 40px;">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
         style="width:600px;max-width:100%;background:' . MAIL_CARTA . ';border:1px solid ' . MAIL_LINEA . ';border-radius:18px;overflow:hidden;">

    <!-- encabezado -->
    <tr><td bgcolor="' . MAIL_PUR . '" background="" style="background:' . MAIL_PUR . ';
        background-image:linear-gradient(120deg,' . MAIL_PUR . ' 0%,' . MAIL_PUR2 . ' 58%,' . MAIL_PUR3 . ' 100%);
        padding:26px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:2.4px;text-transform:uppercase;color:#F3E6FF;">
            Nuevo prospecto
          </td>
          <td align="right">
            <img src="https://www.inedito.digital/media/inedito-logo.png" width="104" alt="Inédito Digital"
                 style="display:block;width:104px;height:auto;border:0;">
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- quien -->
    <tr><td style="padding:30px 32px 6px;">
      <div style="font:700 26px/1.25 Arial,Helvetica,sans-serif;color:' . MAIL_TXT . ';letter-spacing:-.01em;">' . $e($nombre) . '</div>
      <div style="padding-top:7px;font:400 13.5px/1.5 Arial,Helvetica,sans-serif;color:' . MAIL_MUT . ';">
        ' . $e(trim((string)($lead['source'] ?? '')) ?: 'Sitio web') . ' · ' . $e($cuando) . '
      </div>
    </td></tr>
    <tr><td style="height:22px;line-height:22px;">&nbsp;</td></tr>

    <!-- lo que escribio -->
    ' . $mensajeHtml . '

    <!-- acciones -->
    <tr><td style="padding:0 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' . $acciones . '</tr></table>
    </td></tr>
    <tr><td style="height:30px;line-height:30px;">&nbsp;</td></tr>

    <!-- ficha -->
    <tr><td style="padding:0 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="border-top:1px solid ' . MAIL_LINEA . ';">
        ' . $fichaHtml . '
      </table>
    </td></tr>

    <!-- pie -->
    <tr><td style="padding:26px 32px 30px;">
      <a href="https://www.inedito.digital/panel/?p=leads" target="_blank"
         style="font:700 13.5px/1 Arial,Helvetica,sans-serif;color:' . MAIL_PUR3 . ';text-decoration:none;">
        Abrir en el panel &rarr;
      </a>
      <div style="padding-top:16px;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#645F78;">
        Aviso automático de inedito.digital. Responder a este correo contesta a ' . $e($nombre) . '.
      </div>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>';
}
