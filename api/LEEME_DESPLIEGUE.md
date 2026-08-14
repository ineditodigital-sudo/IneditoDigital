# Backend de leads — guía de despliegue

Endpoint: `POST /api/lead.php` (JSON) → guarda el lead en MySQL y envía correo a
Armando y Diego con plantilla HTML responsiva. Sin servicios de terceros.

## Archivos (subir la carpeta `/api` completa a `/public_html/api/`)
- `lead.php` — endpoint principal (validación + anti-spam + insert + correo).
- `config.php` — **credenciales** (rellenar). Acceso HTTP bloqueado por `.htaccess`.
- `db.php` — conexión PDO a MySQL.
- `mailer.php` — envío SMTP con PHPMailer.
- `email_template.php` — plantilla HTML del correo.
- `schema.sql` — tabla `leads` (ejecutar una vez en phpMyAdmin).
- `PHPMailer/` — librería open-source (MIT).
- `.htaccess` — protege config/esquema y desactiva el rewrite del SPA.

## Pasos en cPanel
1. **MySQL Databases:** crear base (ej. `inedito_leads`) + usuario + contraseña, y
   asignar el usuario a la base con **ALL PRIVILEGES**.
2. **phpMyAdmin:** seleccionar la base y ejecutar el contenido de `schema.sql`.
3. **Email Accounts:** crear buzón de envío (ej. `noreply@inedito.digital`) con
   una contraseña fuerte.
4. **Rellenar `config.php`** con: datos de la base (paso 1) y del buzón (paso 3).
   - SMTP host `localhost`, puerto `465` (SSL). Si no envía, probar `587` + `tls`.
5. Subir `/api` a `/public_html/api/`.
6. **Recompilar el front** (`npm install && npm run build`) y subir el `index.html`
   y `assets/` nuevos, para que el formulario haga POST a `/api/lead.php`.

## Prueba
- Enviar el formulario en la web y verificar: (a) llega correo a Armando y Diego,
  (b) aparece la fila en la tabla `leads`.
- Si algo falla, revisar el log de errores de PHP en cPanel (`error_log`).

## Seguridad
- `config.php` no es descargable (bloqueado en `.htaccess` y PHP no expone código).
- Anti-spam por honeypot (campo oculto `website`).
- Consultas con PDO preparado (sin inyección SQL).
