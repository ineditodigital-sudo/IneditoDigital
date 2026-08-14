# Despliegue — inedito.digital

Servidor: cPanel, PHP 8.3 (`ea-php83`), MariaDB 10.11, detrás de Cloudflare.
Raíz del sitio: `/public_html/`.

---

## ⚠️ Lo primero: el orden importa

`render.php` y el bundle de `assets/` **deben subirse juntos**. Hasta el build de
abril de 2026, el formulario de contacto funcionaba gracias a un "puente" JS que
`render.php` inyectaba para interceptar el submit. El bundle actual ya hace ese
POST desde `ContactPage.tsx`.

| Si subes... | Pasa esto |
|---|---|
| Solo el bundle nuevo (con el `render.php` viejo) | **Dos leads y dos correos** por cada envío |
| Solo `render.php` nuevo (con el bundle viejo) | **Cero leads**: nadie hace el POST |
| Los dos juntos | Correcto |

---

## Qué se sube y a dónde

```
dist/index.html      ──▶  /public_html/index.html
dist/assets/*        ──▶  /public_html/assets/
dist/robots.txt      ──▶  /public_html/robots.txt

render.php           ──▶  /public_html/render.php
sitemap.php          ──▶  /public_html/sitemap.php
llms.php             ──▶  /public_html/llms.php
.htaccess            ──▶  /public_html/.htaccess
api/                 ──▶  /public_html/api/      (menos config.php, ver abajo)
panel/               ──▶  /public_html/panel/
media/               ──▶  /public_html/media/
```

### Lo que NO se sube nunca

| Archivo | Motivo |
|---|---|
| `api/config.php` | Credenciales. Ya está en el servidor; **no lo sobrescribas** |
| `api/schema.sql` | Bloqueado por HTTP, pero no hace falta ahí |
| `panel/setup.php` | Migración de un solo uso y **sin autenticación**. No debe vivir en producción |
| `node_modules/`, `src/`, `docs/` | No son parte del sitio publicado |
| Cualquier `.sql`, `.zip`, `.bak` | Ya han estado expuestos antes; no repetir |

---

## Procedimiento

1. **Compilar**

   ```bash
   npm run build
   ```

2. **Respaldar antes de tocar nada.** En cPanel, comprimir `/public_html/index.html`,
   `/public_html/assets/` y `/public_html/render.php` a un zip **fuera** de
   `public_html` (por ejemplo en `/home/usuario/respaldos/`). Nunca dentro de
   `public_html`: un zip ahí queda descargable por cualquiera.

3. **Subir `dist/assets/`** al servidor. Los nombres llevan hash, así que conviven
   con los anteriores sin pisarlos.

4. **Subir `dist/index.html`, `render.php` y `.htaccess`** — en ese orden, seguidos.
   `render.php` lee los hashes de los assets desde `index.html`, así que index va
   primero.

5. **Verificar** (ver checklist abajo).

6. **Limpiar** los assets viejos de `/public_html/assets/` una vez confirmado que
   todo carga.

---

## Checklist de verificación

Después de cada despliegue:

```bash
# 1. La home responde y trae el bundle nuevo
curl -s https://www.inedito.digital/ | grep -o 'assets/index-[^"]*'

# 2. El apex redirige a www (301)
curl -sI https://inedito.digital/ | head -1

# 3. Una ruta inexistente devuelve 404 real, no 200
curl -sI https://www.inedito.digital/no-existe-xyz | head -1

# 4. Las cabeceras de seguridad están puestas
curl -sI https://www.inedito.digital/ | grep -iE 'x-content-type|x-frame|referrer|strict-transport'

# 5. Los assets se cachean un año
curl -sI https://www.inedito.digital/assets/index-*.js | grep -i cache-control

# 6. Un bot ve HTML ya renderizado
curl -s -A "Googlebot" https://www.inedito.digital/servicios | grep -c '<main>'

# 7. El panel sigue pidiendo login
curl -sI https://www.inedito.digital/panel/ | head -1

# 8. La configuración sigue bloqueada
curl -sI https://www.inedito.digital/api/config.php | head -1   # debe dar 403
```

**Y una prueba manual que ningún curl cubre:** enviar el formulario de contacto
con datos de prueba y confirmar que llega **un** correo y se crea **un** registro
en `leads`. Si llegan dos, el puente de `render.php` sigue puesto.

---

## Reversión

Los assets llevan hash y no se pisan entre versiones. Para volver atrás basta
restaurar el `index.html` anterior y el `render.php` anterior desde el respaldo
del paso 2. El bundle viejo sigue en `/public_html/assets/` mientras no se borre.

---

## Después de desplegar

Cosas que se configuran en la BD, sin recompilar. Se insertan como filas en
`seo_settings` y `render.php` las recoge sola:

| Clave | Para qué |
|---|---|
| `googleAnalytics` | ID de GA4 (`G-XXXXXXXXXX`) |
| `facebookPixel` | ID del pixel de Meta |
| `googleSiteVerification` | Verificación de Search Console |
| `facebook`, `instagram`, `linkedin` | Alimentan `sameAs` del JSON-LD |
| `defaultImage` | Imagen por defecto para Open Graph |

Hoy ninguna de esas filas existe, por eso no hay medición de GA ni pixel.
