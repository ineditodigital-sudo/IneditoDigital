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
require_once __DIR__ . '/titulo.php';

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
function mail_boton(string $url, string $texto, string $fondo, string $color = '#000000', bool $hueco = false): string
{
    $u = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
    $t = htmlspecialchars(mb_strtoupper($texto, 'UTF-8'), ENT_QUOTES, 'UTF-8');
    /* Hueco: el color se va del relleno al filo. La acción secundaria se
       distingue por forma y no por un tono más apagado del mismo relleno, que
       a media pantalla y con brillo bajo no se distingue de nada.
       Van a todo el ancho y apilados: dos botones lado a lado se parten en el
       teléfono, y ahí es donde se leen estos avisos. */
    $bg = $hueco ? MAIL_CARTA : $fondo;
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td align="center" bgcolor="' . $bg . '" style="background:' . $bg . ';'
        . ($hueco ? 'border:1px solid ' . $fondo . ';' : '') . '">
        <a href="' . $u . '" target="_blank"
           style="display:block;padding:18px 24px;font:700 13px/1 ' . MAIL_SANS . ';
                  letter-spacing:1.8px;color:' . $color . ';text-decoration:none;">' . $t . '</a>
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
    /* Tres columnas por renglón: rótulo, valor y si el valor es un dato que
       se mide. La mono va solo en esos —teléfono y fecha—; en el resto sería
       disfraz de técnico sobre texto corriente. */
    $filas = [];
    if ($tel !== '')    $filas[] = ['Teléfono', '<a href="tel:+' . $e($wa ?: preg_replace('/\D/', '', $tel)) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e(mail_tel($tel)) . '</a>', true];
    if ($correo !== '') $filas[] = ['Correo', '<a href="mailto:' . $e($correo) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e($correo) . '</a>', false];
    if (trim((string)($lead['company'] ?? '')) !== '') $filas[] = ['Empresa', $e($lead['company']), false];
    if (trim((string)($lead['service'] ?? '')) !== '') $filas[] = ['Le interesa', $e($lead['service']), false];
    if ($desde !== '') {
        $filas[] = ['Estaba viendo', $desdeUrl !== ''
            ? '<a href="' . $e($desdeUrl) . '" style="color:' . MAIL_PUR3 . ';text-decoration:none;">' . $e($desde) . '</a>'
            : $e($desde), false];
    }
    /* Que no haya dejado forma de contacto es un dato de la ficha, no una
       alerta: iba en un recuadro con borde morado y pesaba más que el mensaje. */
    if ($tel === '' && $correo === '') {
        $filas[] = ['Contacto', '<span style="color:' . MAIL_SUAVE . ';">No dejó teléfono ni correo. '
                  . 'Si te escribió por WhatsApp, guarda su número en el panel para poder buscarla después.</span>', false];
    }
    $filas[] = ['Recibido', $e($cuando), true];

    $fichaHtml = '';
    foreach ($filas as $i => [$rot, $val, $dato]) {
        $sep = $i > 0 ? 'border-top:1px solid ' . MAIL_LINEA . ';' : '';
        $fuente = $dato
            ? "400 14px/1.6 " . MAIL_MONO . ";letter-spacing:.3px"
            : "400 15px/1.6 " . MAIL_SANS;
        $fichaHtml .= '<tr>
          <td class="rot" width="124" style="width:124px;padding:15px 16px 15px 0;' . $sep . '
              font:400 10px/1.8 ' . MAIL_MONO . ';letter-spacing:1.6px;text-transform:uppercase;
              color:' . MAIL_MUT . ';vertical-align:top;">' . $e($rot) . '</td>
          <td class="val" style="padding:15px 0;' . $sep . 'font:' . $fuente . ';
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

    /* --- botones ---
       El panel siempre está. Los otros dos solo si hay a dónde escribir, y
       cuando no hay ninguno el panel deja de ser secundario y se pinta lleno:
       pasa a ser la única acción posible y tiene que verse como tal. */
    $panel = 'https://www.inedito.digital/panel/?p=leads';
    $botones = [];
    if ($wa !== '') {
        $txtWa = rawurlencode('Hola ' . explode(' ', $nombre)[0] . ', te escribo de Inédito Digital. Vi tu mensaje desde el sitio.');
        $botones[] = mail_boton('https://wa.me/' . $wa . '?text=' . $txtWa, 'Escribir por WhatsApp', MAIL_VERDE, '#04240F');
    }
    if ($correo !== '') {
        $botones[] = mail_boton('mailto:' . $correo, 'Responder por correo', MAIL_PUR2, '#FFFFFF');
    }
    $botones[] = $botones
        ? mail_boton($panel, 'Abrir en el panel', MAIL_PUR2, MAIL_PUR3, true)
        : mail_boton($panel, 'Abrir en el panel', MAIL_PUR2, '#FFFFFF');

    $accionesHtml = '';
    foreach ($botones as $k => $btn) {
        $accionesHtml .= '<tr><td style="padding-top:' . ($k ? '10' : '0') . 'px;">' . $btn . '</td></tr>';
    }
    $accionesHtml = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
                  . $accionesHtml . '</table>';

    /* El folio es el mismo número que la fila del panel: sirve para hablar del
       lead sin repetir el nombre entero. */
    $id = (int)($lead['id'] ?? 0);
    $folio = $id > 0 ? 'Nº ' . sprintf('%03d', $id) : 'Nuevo prospecto';

    /* El titular en la Hanson. Si el servidor no pudiera dibujarla, vuelve a
       texto vivo: más vale un titular en otra fuente que un hueco. */
    $tituloHtml = titulo_imagen($nombre, 540);
    if ($tituloHtml === '') {
        $tituloHtml = '<div style="font:900 38px/1.04 ' . MAIL_SANS . ';letter-spacing:-1.2px;
             text-transform:uppercase;color:' . MAIL_TXT . ';">' . $e($nombre) . '</div>';
    }

    /* Solo es cierto cuando hay a quién responderle: en un lead de WhatsApp sin
       correo, responder no llega a ninguna parte. */
    $pieResponder = $correo !== ''
        ? '<br>Responder a este correo contesta a ' . $e($nombre)
        : '';

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
<style>
  /* Lo unico que entienden Gmail, Apple Mail y Outlook.com por igual. Outlook
     de escritorio las ignora y se queda con la version ancha, que ahi es la
     correcta porque la ventana nunca es estrecha. */
  @media only screen and (max-width:480px) {
    .p   { padding-left:22px !important; padding-right:22px !important; }
    /* El rotulo deja de ser columna y se pone encima del valor: a 375px de
       ancho, 124 para la etiqueta dejaban tres palabras por renglon. */
    .rot { display:block !important; width:auto !important;
           padding:16px 0 5px !important; }
    .val { display:block !important; width:auto !important;
           padding:0 0 16px !important; border-top:0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:' . MAIL_NEGRO . ';">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . $e($asomo) . '</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       bgcolor="' . MAIL_NEGRO . '" style="background:' . MAIL_NEGRO . ';">
<tr><td align="center" style="padding:0 0 44px;">

  <!--[if mso]><table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="width:100%;max-width:620px;background:' . MAIL_CARTA . ';">

    <!-- El membrete va sobre el negro de la carta y no sobre una banda morada.
         El isotipo del logo ES ese morado: encima del bloque desaparecía y
         quedaba el logotipo manco. Sin banda, la carta es una sola superficie y
         la estructura la levantan los filetes, que es como se construye el
         resto de la casa. -->
    <tr><td class="p" style="padding:36px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;">
          <img src="https://www.inedito.digital/media/inedito-logo.png" width="104" alt="Inédito Digital"
               style="display:block;width:104px;height:auto;border:0;">
        </td>
        <td align="right" style="vertical-align:middle;font:400 10px/1 ' . MAIL_MONO . ';
            letter-spacing:2.6px;text-transform:uppercase;color:' . MAIL_MUT . ';">' . $e($folio) . '</td>
      </tr></table>
    </td></tr>

    <tr><td class="p" style="padding:30px 40px 0;">' . mail_filete(MAIL_PUR2, 3) . '</td></tr>

    <!-- el nombre, en la Hanson -->
    <tr><td class="p" style="padding:32px 40px 0;">' . $tituloHtml . '</td></tr>
    <tr><td class="p" style="padding:20px 40px 0;font:400 11px/1.6 ' . MAIL_MONO . ';letter-spacing:1.8px;
        text-transform:uppercase;color:' . MAIL_MUT . ';">'
        . $e($origen) . ' &nbsp;/&nbsp; ' . $e($cuando) . '</td></tr>

    <tr><td class="p" style="padding:32px 40px 0;">' . mail_filete(MAIL_LINEA, 1) . '</td></tr>

    <!-- lo que escribió -->
    <tr><td class="p" style="padding:28px 40px 0;">' . mail_rotulo('Lo que escribió') . '</td></tr>
    <tr><td class="p" style="padding:18px 40px 0;">' . $mensajeHtml . '</td></tr>

    <tr><td class="p" style="padding:32px 40px 0;">' . mail_filete(MAIL_LINEA, 1) . '</td></tr>

    <!-- La ficha, sin rótulo encima: cada renglón ya dice lo que es y el
         título solo repetía. -->
    <tr><td class="p" style="padding:4px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $fichaHtml . '</table>
    </td></tr>

    <tr><td class="p" style="padding:36px 40px 0;">' . mail_filete(MAIL_PUR2, 3) . '</td></tr>

    <tr><td class="p" style="padding:30px 40px 0;">' . $accionesHtml . '</td></tr>

    <tr><td class="p" style="padding:32px 40px 40px;font:400 10px/1.9 ' . MAIL_MONO . ';
        letter-spacing:1.2px;text-transform:uppercase;color:#7E7A98;">
      Aviso automático de inedito.digital' . $pieResponder . '
    </td></tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->

</td></tr>
</table>
</body>
</html>';
}
