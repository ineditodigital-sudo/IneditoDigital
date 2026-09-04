<?php
/** Envío de correo vía SMTP del dominio usando PHPMailer (open-source, MIT). */
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

/**
 * Envía el correo del lead a todos los destinatarios configurados.
 * Devuelve ['ok'=>bool, 'error'=>string|null].
 */
function send_lead_email(array $cfg, array $lead, string $html, string $subject, string $texto = ''): array
{
    $s = $cfg['smtp'];
    $mail = new PHPMailer(true);
    try {
        // Entrega por el MTA local del servidor (Exim en cPanel) vía sendmail.
        // Es la vía fiable en este hosting: los destinatarios son buzones del
        // mismo servidor y evita el fallo de conexión a localhost:465.
        // Sigue siendo el correo propio del dominio, sin terceros.
        $mail->isSendmail();
        $mail->CharSet = 'UTF-8';

        /* Alineacion con el dominio, que es lo que mira Gmail.
         *
         * Sin esto, sendmail pone como remitente del SOBRE al usuario del
         * sistema —algo@host.secureserver.net— y Gmail comprueba SPF contra
         * ESE dominio, no contra inedito.digital: la alineacion de DMARC
         * falla y el correo acaba en spam o se descarta. Los buzones del
         * propio servidor no lo notan porque se entregan sin salir.
         *
         * Hostname manda ademas en el Message-ID y en el saludo HELO: por
         * omision PHPMailer usa el nombre de la maquina, que tampoco se
         * parece al dominio del remitente. */
        $mail->Sender   = $s['from_email'];
        $mail->Hostname = 'inedito.digital';

        $mail->setFrom($s['from_email'], $s['from_name']);
        // Responder va directo al prospecto
        if (!empty($lead['email'])) {
            $mail->addReplyTo($lead['email'], $lead['name'] ?? '');
        }
        foreach ($cfg['recipients'] as $r) {
            $mail->addAddress($r);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $html;
        /* Si quien llama trae una version en texto, se usa esa: quitarle las
           etiquetas a una maqueta de tablas deja una escalera de espacios. */
        $mail->AltBody = $texto !== '' ? $texto : trim(preg_replace('/\s*\n\s*\n\s*/', "\n", strip_tags(
            str_replace(['<br>', '<br/>', '<br />', '</tr>', '</div>'], "\n", $html)
        )));

        $mail->send();
        return ['ok' => true, 'error' => null];
    } catch (Exception $e) {
        return ['ok' => false, 'error' => $mail->ErrorInfo];
    }
}
