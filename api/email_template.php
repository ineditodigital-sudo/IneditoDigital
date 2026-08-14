<?php
/** Plantilla de correo HTML (dark, profesional) para un nuevo lead. */
declare(strict_types=1);

function lead_email_html(array $lead): string
{
    $e = fn($v) => htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8');
    $logo = 'https://www.inedito.digital/media/inedito-logo.png';

    $rows = [
        ['Nombre',   $lead['name']    ?? ''],
        ['Empresa',  $lead['company'] ?? ''],
        ['Email',    $lead['email']   ?? ''],
        ['Teléfono', $lead['phone']   ?? ''],
        ['Servicio', $lead['service'] ?? ''],
        ['Origen',   $lead['source']  ?? ''],
    ];

    $rowsHtml = '';
    foreach ($rows as [$label, $value]) {
        if (trim((string)$value) === '') continue;
        $val = $e($value);
        if ($label === 'Email') {
            $val = '<a href="mailto:' . $val . '" style="color:#b58bff;text-decoration:none;">' . $val . '</a>';
        } elseif ($label === 'Teléfono') {
            $tel = preg_replace('/[^0-9+]/', '', (string)$value);
            $val = '<a href="tel:' . $e($tel) . '" style="color:#b58bff;text-decoration:none;">' . $e($value) . '</a>';
        }
        $rowsHtml .= '
        <tr>
          <td style="padding:16px 0 6px;font:600 11px/1.2 Arial,Helvetica,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#6f6f85;">' . $e($label) . '</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;border-bottom:1px solid #23232f;font:400 16px/1.5 Arial,Helvetica,sans-serif;color:#ececf4;">' . $val . '</td>
        </tr>';
    }

    $message = trim((string)($lead['message'] ?? ''));
    $messageHtml = '';
    if ($message !== '') {
        $messageHtml = '
        <tr><td style="height:22px;"></td></tr>
        <tr>
          <td style="font:600 11px/1.2 Arial,Helvetica,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#6f6f85;padding-bottom:10px;">Mensaje</td>
        </tr>
        <tr>
          <td style="font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#dcdce8;background:#17171f;border-left:2px solid #7700CE;border-radius:4px;padding:16px 18px;">' . nl2br($e($message)) . '</td>
        </tr>';
    }

    $fecha = $e(date('d/m/Y · H:i'));
    $replyEmail = $e($lead['email'] ?? '');

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<title>Nuevo lead</title>
</head>
<body style="margin:0;padding:0;background:#08080c;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08080c;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#0e0e15;border:1px solid #21212e;border-radius:18px;overflow:hidden;">
          <!-- Barra superior de acento -->
          <tr><td style="height:3px;background:#7700CE;background:linear-gradient(90deg,#7700CE 0%,#9933FF 100%);"></td></tr>

          <!-- Encabezado -->
          <tr>
            <td style="padding:34px 40px 26px;">
              <img src="{$logo}" alt="INÉDITO DIGITAL" width="184" style="display:block;width:184px;height:auto;border:0;margin-bottom:26px;">
              <div style="font:600 11px/1.2 Arial,Helvetica,sans-serif;letter-spacing:2.5px;text-transform:uppercase;color:#7c7c92;">Notificación · Nuevo prospecto</div>
              <div style="font:700 26px/1.3 Arial,Helvetica,sans-serif;color:#ffffff;margin-top:10px;letter-spacing:-0.3px;">Nuevo lead desde la web</div>
              <div style="font:400 13px/1.4 Arial,Helvetica,sans-serif;color:#61617a;margin-top:8px;">Recibido el {$fecha}</div>
            </td>
          </tr>

          <!-- Datos -->
          <tr>
            <td style="padding:0 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                {$rowsHtml}
                {$messageHtml}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:30px 40px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:999px;background:#7700CE;background:linear-gradient(90deg,#7700CE 0%,#9933FF 100%);">
                    <a href="mailto:{$replyEmail}" style="display:inline-block;padding:15px 34px;font:700 14px/1 Arial,Helvetica,sans-serif;letter-spacing:0.5px;color:#ffffff;text-decoration:none;border-radius:999px;">Responder al prospecto</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:20px 40px 26px;border-top:1px solid #1b1b26;">
              <div style="font:400 11px/1.6 Arial,Helvetica,sans-serif;color:#54546a;">Generado automáticamente desde el formulario de <a href="https://www.inedito.digital" style="color:#8a8aa0;text-decoration:none;">inedito.digital</a>. Responde a este correo para contactar al prospecto.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}
