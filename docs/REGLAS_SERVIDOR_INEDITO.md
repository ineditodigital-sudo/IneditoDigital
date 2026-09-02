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

## Cada ficha vive en dos copias: columnas y `data_json`

`services`, `blog_posts` y `portfolio` guardan lo mismo dos veces: unas
columnas de MySQL y un `data_json` con la ficha completa. **El sitio arranca
del `data_json`** (`render.php` hace `jval($r)` y solo deja que unas pocas
columnas lo pisen), así que una columna que `render.php` no copia no llega a
la web por más que el panel diga "guardado".

Eso creaba dos trampas simétricas, resueltas el 02-sep-2026:

- **Campos que se editaban y no salían.** El reto y la solución de un caso,
  el tiempo de lectura de un artículo: el panel escribía la columna y el
  sitio seguía leyendo el `data_json`.
- **Campos que salían y no se podían editar.** El sitio del cliente, el año,
  los servicios aplicados, los logros, el proceso y las preguntas frecuentes
  de un servicio: solo existían dentro del `data_json` y ninguna pantalla los
  ofrecía.

**La regla ahora:** cada campo del panel declara con `json` a qué clave del
`data_json` corresponde, y `crud()` escribe las dos copias en cada guardado.
Un campo sin columna lleva `'col' => false` y vive solo en el `data_json`.

**Al añadir un campo a un módulo de contenido**, comprobar antes que el sitio
lo pinta en alguna parte, y darle su `json`. Un campo sin `json` se guarda
donde nadie lo lee: es pedirle trabajo a alguien para nada.

`scripts/probar_crud.php` (`php scripts/probar_crud.php`, contra SQLite en
memoria, no toca producción) verifica justo eso: que los tres formularios se
pintan y que al guardar las dos copias dicen lo mismo.

_Última actualización: 2026-09-02_
