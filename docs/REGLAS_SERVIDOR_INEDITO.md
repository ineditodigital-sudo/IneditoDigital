# Reglas primordiales — Servidor Inédito (public_html)

Estas reglas son de cumplimiento obligatorio en cualquier tarea sobre el hosting
de Inédito (FTP 184.168.20.11, `/public_html/`). Aplican a Claude y a cualquier
automatización.

## Alcance / contexto (IMPORTANTE)
Las reglas de abajo aplican **cuando el proyecto en curso es el sitio web
principal de Inédito** (`inedito.digital`, servido desde la raíz de `/public_html/`).

El servidor es compartido y aloja muchos otros proyectos, varios en subdominios
`*.inedito.digital`. **Algunos de esos subdominios son proyectos nuestros** en los
que sí trabajaremos y editaremos con normalidad. La clave es:

> Se puede editar libremente la ruta del **proyecto que tengamos activo** en la
> sesión. Lo que NO se toca es cualquier ruta **ajena al proyecto en curso**.

Al iniciar el trabajo, si no está claro cuál es el proyecto/ruta activa, preguntar.

## Regla 1 — No tocar rutas ajenas al proyecto activo
Cuando trabajemos en el sitio principal de Inédito, no se puede modificar, mover,
renombrar ni borrar **nada** de los subdominios ni carpetas de otros clientes o
proyectos (por ejemplo `*.inedito.digital`: feria, tarjetas, imagenes, synergy,
conversor, ruleta, etc.). Sobre ellos, acceso **solo lectura** y solo si es
necesario para la tarea.

(Si en otra sesión el proyecto activo ES uno de esos subdominios, esa ruta pasa a
ser editable y esta protección aplica al resto, no a ella.)

## Regla 2 — No alterar residuos de la raíz sin preguntar
No se puede alterar PDFs, APIs, archivos ni carpetas de WordPress que ya existan
en la raíz de `/public_html/` **siempre que no estorben ni interfieran** con el
proyecto actual.

- Si un archivo/carpeta **no interfiere**: dejarlo intacto.
- Si **sí interfiere o es perjudicial** para el proyecto: **preguntar antes**
  de borrar o modificar. Nunca actuar por cuenta propia.

## Alcance del proyecto principal
El sitio `inedito.digital` (build de Figma Make / Vite) vive en la raíz de
`/public_html/`: `index.html`, `assets/`, `sitemap.xml`, `robots.txt`, `.htaccess`.
El trabajo se limita a estos archivos salvo autorización explícita.

## Operaciones permitidas por defecto
- Listar y descargar copias (solo lectura) para auditar o comparar.
- Subir/modificar/borrar **solo** dentro del alcance del proyecto principal y
  **solo** con confirmación previa del usuario.


## Base de datos: slug único en las tablas de contenido

`services`, `blog_posts` y `portfolio` llevan `UNIQUE(slug)` desde el
31-ago-2026. **No quitarlo.** Antes no existía, y eso rompía en silencio
cualquier script que publicara contenido con
`INSERT ... ON DUPLICATE KEY UPDATE`: en vez de actualizar la ficha,
insertaba una fila más con el mismo slug. Como `render.php` resuelve el slug
tomando la primera coincidencia, el sitio seguía sirviendo la versión vieja
aunque el script reportara "publicado".

Al publicar contenido por script, **verificar siempre contra la página real**
(`curl` con user-agent de bot), no contra lo que imprime el script.

_Última actualización: 2026-08-31_
