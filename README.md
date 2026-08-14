# Inédito Digital — sitio principal

Sitio de [inedito.digital](https://www.inedito.digital). SPA en React + Vite con
un backend PHP que le da SEO real, panel de administración y entrega de leads.

---

## Cómo está armado

No es solo un SPA. Son cuatro piezas que trabajan juntas:

```
Visitante  ──▶  .htaccess  ──▶  render.php  ──▶  HTML + <div id="root">
                                    │                    │
                                    │                    └─▶ assets/index-*.js  (SPA React)
                                    │
                                    └─▶ MySQL  (contenido, ajustes, SEO)

Bot / crawler ─▶ render.php ─▶ HTML plano ya renderizado (sin JS)

Editor ─▶ /panel/ (PHP) ─▶ MySQL ─▶ se refleja en el sitio sin recompilar
```

| Pieza | Dónde | Qué hace |
|---|---|---|
| **SPA** | `src/` → compila a `dist/` | Toda la interfaz |
| **Renderizador** | `render.php` | Meta tags, JSON-LD y HTML plano para bots. Inyecta el contenido de MySQL en `localStorage` para que el SPA lo lea |
| **API** | `api/` | Leads, login, contenido publicado, beacon de analítica |
| **Panel** | `panel/` | CMS en PHP. Edita contenido, ve leads y analítica |

**El contenido vive en MySQL, no en el código.** `src/app/data/*.ts` solo aporta
los valores por defecto de la primera carga; lo que se publica manda desde la BD.
Por eso se puede cambiar un servicio o un post sin recompilar nada.

---

## Requisitos

- Node.js 20+
- PHP 8.3 (el servidor usa `ea-php83`)
- MySQL / MariaDB 10.11+

## Puesta en marcha

```bash
npm install
```

Luego copia la configuración y rellénala con las credenciales reales:

```bash
cp api/config.example.php api/config.php
```

`api/config.php` está en `.gitignore` y **nunca** debe subirse al repositorio.

Para levantar el entorno de desarrollo:

```bash
npm run dev
```

Ojo: `npm run dev` solo sirve el SPA. Las rutas PHP (`/api/`, `/panel/`,
`render.php`) necesitan un servidor con PHP y acceso a MySQL.

## Compilar

```bash
npm run build
```

Genera `dist/` con `index.html`, `assets/` (nombres con hash) y todo lo que haya
en `public/`.

---

## Base de datos

El esquema completo está en [`api/schema.sql`](api/schema.sql) — las 9 tablas.

```bash
mysql -u USUARIO -p BASE_DE_DATOS < api/schema.sql
```

| Tabla | Contenido |
|---|---|
| `services`, `blog_posts`, `portfolio` | Contenido publicado. La columna `data_json` guarda el detalle completo (features, FAQ, proceso) |
| `site_settings`, `seo_settings` | Ajustes del negocio y de SEO, en formato clave/valor |
| `leads` | Prospectos del formulario de contacto |
| `pageviews` | Analítica propia (la alimenta `api/hit.php`) |
| `admins` | Usuarios del panel, con hash bcrypt |
| `google_auth` | Tokens OAuth de Google |

Los volcados `.sql` están en `.gitignore`: contienen datos personales de
prospectos reales y no deben entrar al repositorio.

---

## Despliegue

Ver [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md). Resumen: `dist/*` va a la raíz de
`public_html/`, y los archivos PHP se suben tal cual.

## Reglas del servidor

`public_html/` es compartido: aloja ~60 subdominios de otros clientes que
**heredan** las cabeceras de nuestro `.htaccess`. Antes de tocar nada ahí, leer
[`docs/REGLAS_SERVIDOR_INEDITO.md`](docs/REGLAS_SERVIDOR_INEDITO.md).
