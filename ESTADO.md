# Estado del sitio · inedito.digital

> Corte: **21 de septiembre de 2026**. Escrito para retomar en otra sesión.
> Antes de confiar en esto, compáralo con `git log -1` y con el bundle que sirve el sitio. Si no coinciden, algo cambió después de este corte.

## En una mirada

| | |
|---|---|
| Último commit de código | `7509f9c` — Opiniones de Google en la portada y en Nosotros, y las decisiones de contenido |
| En producción | El mismo: `assets/index-XFShmlC5.js` (verificado en vivo el 21-sep, español e inglés) |
| Sin commit | Nada de código. Solo archivos sueltos sin trackear (ver Pendientes) |
| Esperando a Google | La API de Perfil de Empresa, para que las opiniones se actualicen solas (ver Pendientes) |
| Desplegar | `npm run build && bash deploy.sh` (detalle en `docs/DESPLIEGUE.md`) |
| Arquitectura | SPA React + Vite, `render.php` (HTML para bots y puente de datos), panel PHP en `/panel/`, MySQL en cPanel. Ver `README.md` |

## Lo último que se hizo (septiembre)

- **Sitio en inglés**, con interruptor en el encabezado (`12d1427`).
- **Contacto corregido** en el sitio, las páginas legales, la presentación y la base de producción. Había dos números ajenos publicados.
- **Anuncios espectaculares**: servicio nuevo y catálogo de 317 espacios de Vía Gráfica, con mapa (`ac3faa0`, `5296479`).
- **Presentación de servicios** en `/service-presentation` (enlace oculto, noindex):
  - 12 láminas: portada, 10 servicios (incluye Tienda en línea) y cierre. Español e inglés, tema oscuro y claro.
  - Una animación Remotion por servicio (10 escenas), con logos reales de las IA, Google y WhatsApp, y mockups de teléfono en Web, Tienda y Agentes.
  - Logo oficial: los SVG de marca en `public/marca/`.
  - En teléfono: todo centrado y tarjetas que se abren al tocarlas. Acostado o en ventana baja: dos columnas.
  - **Editable desde el panel** (Contenido › Presentación): textos, tarjetas, enlaces, orden, qué láminas se ven y contacto. Tiene borrador, versiones y vista en vivo (`da67a8c`).

## Lo último (14 de septiembre)

- **La página de espacios publicitarios, rehecha** (`servicios/anuncios-espectaculares`). La forma es la de un comercializador de exterior, no la de una sección de sitio:
  - Barra de búsqueda por clave, calle o colonia —sin acentos ni mayúsculas— con selectores de zona y estatus, contador de resultados y botón de limpiar.
  - Filtros rápidos por formato, con su conteo.
  - Lista de anuncios al lado del mapa, agrupada por formato y plegable. Al elegir uno, la lista se vuelve su ficha: medidas, altura, referencia, los otros anuncios en la misma estructura y dos botones —cotizar y WhatsApp con la clave ya escrita—.
  - **El mapa ya no va invertido.** Se quitó el filtro que lo ponía en negativo: en esta página se leen calles. `.mapa-oscuro` salió de `src/styles/index.css` y en su lugar está `.mapa-catalogo`.
  - Un marcador por ubicación y no por anuncio: hay puentes con seis caras en las mismas coordenadas.
  - El encuadre de arranque deja fuera el 3 % de los extremos; si no, los sitios de carretera meten la ciudad entera en un puño de píxeles.
  - Medido sin recortes ni scroll de más en los nueve tamaños y los dos idiomas.
- **Proxy de desarrollo** en `vite.config.ts` para `/api/espectaculares.php`, y solo para ese archivo: en local no hay PHP y el catálogo solo existe en la base de producción. Los demás endpoints se quedan sin proxy a propósito —enviar el formulario desde el escritorio crearía un lead de verdad—.
- **Botones de zoom y reencuadre por filtro** (14-sep, segunda vuelta):
  - Los `+` y `−` del mapa ya se ven: 38 px sobre tarjeta blanca. El selector encadena `.mapa-catalogo` con `.leaflet-container` porque la hoja de Leaflet se inyecta en caliente —después de la nuestra— y sus reglas `.leaflet-touch` pesaban lo mismo: a igualdad de peso ganaba la suya y los botones medían 30 px.
  - **El mapa se reencuadra con el filtro**, venga del buscador, de los dos selectores o de los botones de formato: lo que se ve es todo lo filtrado y nada más. Se quitó el recorte del 3 % del encuadre inicial: ahora la regla es una sola, y el arranque —sin filtros— es un filtro más, los 317.
  - Reencuadra por el FILTRO, no por cada redibujado: elegir un anuncio lleva el mapa a su esquina sin deshacer el zoom que acaba de hacer el visitante.
  - **Defecto corregido de paso:** el desplegable estaba declarado dentro del componente, así que era un tipo nuevo en cada render y React desmontaba el `<select>` con cada letra del buscador. Ahora vive a nivel de módulo.
  - **Reencuadre sin animación** (tercera vuelta). Leaflet ignora en silencio un `setView` que llega mientras otra animación de zoom sigue corriendo: quien tocaba un anuncio —que mueve el mapa— y enseguida cambiaba de formato caía en esa ventana y el mapa se quedaba clavado en la manzana donde estaba. Encuadrar de golpe además es lo correcto aquí: no es un desplazamiento, es cambiar de pregunta.
  - Si el anuncio abierto se sale del filtro, se cierra su ficha. Antes quedaba en pantalla la ficha de un anuncio que ya no estaba en los resultados y el panel parecía no haber hecho caso.
  - El alto del mapa pasó de `min()` a `clamp()`: con `min()`, un `vh` que reporte cero deja la caja sin altura y Leaflet monta sobre la nada, sin mapa y sin decir por qué. Ahora cede con la ventana pero nunca baja de 280 px.
  - Comprobado: buscando una sola clave el mapa llega al nivel 16 —lo más cerrado— y desde ahí el chip Valla lo abre al 14 (4 de 4 visibles) y el de Unipolar al 11 (77 de 77). Ninguna marca queda fuera del mapa en ningún filtro.
  - **Ficha técnica, Maps y el chip que sí entrega la categoría** (cuarta vuelta):
    - Botón **Ver en Maps** en el panel lateral, en vista de calle (`map_action=pano`): en exterior lo que decide la compra es ver el anuncio y lo que tiene enfrente. Su propia ficha técnica trae ese mismo renglón («LIGA GOOGLE MAPS»).
    - El panel ahora trae **superficie en m²** (derivada de las medidas), **coordenadas** y la **ficha técnica** del sitio: paneles, iluminación, temporizadores, cimentación y reflectores.
    - La iluminación va destacada y se dice también cuando NO hay: de 206 sitios con ficha, 99 iluminados y 107 sin iluminación. Los demás apartados en «NINGUNO» se callan, que es ruido.
    - El dato sale del campo `extras` de la API de Vía Gráfica —el mismo del que ellos sacan su PDF—. **Columna nueva en la tabla**: la crea `espec_tabla()` con un ALTER aditivo, y tanto la API como `espec_catalogo()` consultan con la columna y reintentan sin ella, para que una base sin sincronizar no tumbe el catálogo entero por un campo accesorio.
    - **No se pone un PDF por sitio**: todo lo que imprime el suyo —clave, título, tipo, zona, medidas, referencia y la liga a Maps— ya está en el panel. Lo único que no tenemos es la fotografía del espacio (su PDF son 27 MB casi enteros de foto) y la API no la ofrece.
    - **Corregido**: buscar una ubicación exacta y después pulsar un formato daba cero resultados con el mapa clavado, porque el buscador no se vaciaba. Ahora el botón de formato vacía la búsqueda **solo si la combinación no dejaría nada**: «siglo xxi» + Unipolar sigue acotando a 28.
  - **Escena propia del proceso** (quinta vuelta): `anuncios-espectaculares` no tenía escena y caía en la de respaldo —una página web construyéndose—, que en el paso 1 se veía como una tarjeta vacía. Ahora hay `EscenaEspectacular`, que cuenta los cuatro pasos reales del servicio: la avenida con su flujo → tres sitios candidatos y la ficha del elegido → el poste sube y la lona se abre con el arte → la medición. El pin elegido se apaga al levantarse la estructura: se convirtió en ella. Sin cifras inventadas, que la prueba social va sin números sin respaldo.

### La imagen al compartir un enlace (14-sep)

Salía un recuadro blanco en WhatsApp y Telegram. No era un fallo, eran **tres a la vez** en la misma imagen: todas las páginas compartían el logotipo, que es un **WEBP** —formato que esos previsualizadores no pintan— de **2818×653** —cuando esperan 1200×630— y con **fondo transparente**, que sobre la tarjeta del chat se ve como un hueco.

Ahora hay `og.php`: dibuja una tarjeta 1200×630 por página con el logotipo, la categoría, el título en Hanson y el dominio. No se guardaron 30 PNG a mano porque servicios, blog, portafolio y las páginas del CMS se editan desde el panel: un archivo por página se queda viejo al primer cambio de título y no existe para lo que den de alta mañana.

- **No acepta texto libre.** Recibe una ruta, la busca en nuestra base y dibuja lo que encuentre. Con el texto por parámetro, cualquiera podría poner lo que quisiera sobre una tarjeta con nuestra marca servida desde nuestro dominio.
- GD con FreeType ya estaba en producción para el reporte quincenal, así que Hanson y el logotipo ya vivían en el servidor (`panel/inc/reporte/`). No hizo falta subir nada.
- Cae con gracia: sin base de datos devuelve la tarjeta de la marca; si no puede escribir la caché, dibuja y ya.
- Caché en `cache-og/`, con el título en la llave: si el cliente lo cambia en el panel, la imagen se rehace sola.
- Lo explícito sigue mandando: la foto de un integrante o el `seo_image` de una página del CMS ganan a la tarjeta generada. Lo que ya **no** manda es `defaultImage` del panel, porque un ajuste global es menos específico que una tarjeta por página.
- Comprobado en producción: **36 de 36 rutas** con tarjeta propia, ninguna cayó en la genérica. PNG opaco, RGB sin alfa, 1200×630, ~58 KB.

**Ojo al comprobarlo**: WhatsApp y Facebook guardan la vista previa por URL varios días. Un enlace ya compartido seguirá saliendo con la imagen vieja hasta que caduque; para forzarlo, pasar la URL por el depurador de Facebook (developers.facebook.com/tools/debug) y pulsar «Scrape Again».

#### Segunda vuelta: el recorte cuadrado

WhatsApp sí traía la tarjeta nueva, pero la pintaba en su **formato compacto**, que recorta un **cuadrado del centro** (630×630 de los 1200×630). Con el texto pegado al margen izquierdo, lo que se leía era media palabra: «UNCIOS / ECTACULAR».

Eso no se controla desde aquí —lo decide el cliente de WhatsApp—, así que lo que se hizo fue **que el recorte no importe**: toda la composición (logotipo, categoría, título, filete y dominio) vive centrada dentro de ese cuadrado, y lo de fuera es aire y resplandor. En Facebook, LinkedIn o Telegram se ve la tarjeta completa y queda como una composición centrada de toda la vida.

- **Comprobado sobre las 47 tarjetas reales**, escaneando los PNG pixel a pixel y no reimplementando la fórmula: lo claro ocupa de x=323 a x=880, dentro del recorte (285–915), con 38 px de margen a la izquierda y 35 a la derecha.
- Título a un máximo de 4 renglones, con puntos suspensivos si no cabe. Antes encogía hasta caber y un título largo de blog acababa en 6 renglones a 36 px: eso ya no es un título. El completo viaja igual en `og:title`, que es el texto que el chat pinta debajo.
- La ruta pasa a ser `/og/servicios/branding.png` en vez de `og.php?p=…`: Cloudflare trata un `.php` con parámetros como dinámico, lo re-trocea y la respuesta sale **sin `Content-Length`**, que es una de las cosas que mira un rastreador para decidir si se baja la imagen grande.
- `OG_VERSION` va dentro de la llave de la caché: al cambiar el dibujo, las guardadas dejan de servirse solas sin tener que entrar a borrar nada.
- Las 55 tarjetas quedaron precalentadas en producción: 0 fallos, ninguna por encima de 900 ms, 181 ms de media ya en caché.

Lo que **no** se puede comprobar desde aquí es el render de WhatsApp. Si en el teléfono sigue saliendo el formato compacto, la tarjeta ahora se ve entera igual; si sale el grande, también.

### Fichas de servicio: título que no cabe y párrafo que estorba (14-sep)

Dos cosas que afectaban a **las 26 fichas**, no a una:

- **El título se recortaba en silencio.** Hanson es muy ancha: «ESPECTACULARES» mide 12.62 em. Con los saltos fijos de Tailwind se perdían **167 px a 320, 119 a 375, 23 a 768 y 15 px en todo el escritorio** —ahí porque `max-w-4xl` (896) es más estrecho que la palabra a 72 px (911)—. No daba scroll porque la sección lleva `overflow-hidden`: se comía la letra y ya.
  Ahora hay `.titulo-servicio` en `theme.css`: el tamaño sale de lo disponible entre 13, con tope en 4.5rem. Escritorio se queda igual (72 px); teléfono baja a 22-27 px y **cabe**. Guiones y corte de palabra como red, por si desde el panel dan de alta un servicio con una palabra aún más larga.
  Mismo arreglo en `/servicios-ia`, que perdía 12 px.

- **La definición empujaba los botones fuera de la pantalla.** En un teléfono de 667 px, «Cotizar» y «WhatsApp» quedaban en **y=759**: el visitante tenía que leerse 430 caracteres para encontrar la puerta. Ahora los botones van **antes** y la definición después, plegada a tres renglones con «Leer más» en teléfono (entera de `md` para arriba). Medido: los botones pasan de **y=759 a y=477**.
  **No se pierde nada de SEO ni de GEO**: a buscadores y a las IA les llega por `render.php`, que les sirve su propio HTML con la definición como PRIMER párrafo bajo el `h1` —ahí no se movió—. Y sigue visible para la persona: recortarla con CSS no es esconderla, el texto completo está en el DOM. Dejarla sólo en el HTML del robot sería servir dos cosas distintas, y eso no se hace.

- De paso: la tarjeta NFC entraba desde `x:24` y empujaba la página de lado 8 px en teléfono. Corregido con `overflow-hidden` en su sección.

- Desplegado el 14 de septiembre.

### Lo que dijeron las métricas, y lo que se hizo con ellas (14-sep, última vuelta)

Se revisaron dos tableros: el ranking en Google y «Qué páginas estudian las IAs». Salieron dos cosas, y se corrigieron las dos. **Desplegado el 14 de septiembre** (`assets/index-Ce_4nzhM.js`).

- **Dos de cada tres «lecturas de IA» eran ruido.** De 949 lecturas en 30 días, 638 eran rutas que no existen: `/403.shtml` (386), `/404.shtml` (125), `/.env.local`, `/.env.production`, `/fetch`, `/read-document`, `/__vite_rsc_findSourceMapURL`. Ninguna IA pide un archivo `.env`; las IA siguen enlaces. Son escáneres que se ponen el user-agent de GPTBot o ClaudeBot porque muchos sitios los dejan pasar sin filtro. Todas devuelven 404 y no se filtra nada: el problema era de medición, no de seguridad.
  - **La causa:** `render.php` anotaba en `ia_bots` en la línea 90, *antes* de resolver la ruta. Un 404 contaba igual que un artículo. El registro se movió después del bloque `if ($is404)` y se le puso el guardia `!$is404`.
  - **Lo ya guardado** no se borra: `panel/pages/analiticas.php` filtra contra las rutas que existen —las mismas fuentes que arma `sitemap.php`—. Si esa consulta falla, no filtra: mejor un tablero con ruido que un tablero vacío. El KPI «Lecturas de bots de IA» va a **bajar de ~949 a ~311**, y eso es lo correcto: las doce páginas de la tabla pasan a ser doce páginas de verdad, no cinco.
  - Lo que queda al limpiar: `/` (220 lecturas, 12 motores), `/servicios/diseno-y-desarrollo-web` (24), `/servicios/funnels-de-venta` (24), `/servicios` (22), `/blog/como-aparecer-en-chatgpt` (21, **8 motores distintos**).

- **El título de las fichas de servicio gastaba media línea en nada.** Era `Servicio | Servicios · INÉDITO DIGITAL`: 28 de los ~60 caracteres que Google muestra se iban en una migaja de navegación y en una marca que nadie busca. Y la palabra por la que sí nos buscan —la ciudad— no aparecía.
  - **La evidencia:** la portada es la única página con «Aguascalientes» en el título y la única que rankea en primera plana (#5.7). Las fichas, con la plantilla vieja, andaban del #32 al #79. La prueba más barata: `diseño web aguascalientes`, 16 impresiones, posición **#52**, en un dominio que ya sale en página 1 para «agencia de marketing digital aguascalientes».
  - Ahora: `tituloServicio()` en `render.php` arma `Servicio en Aguascalientes | INÉDITO DIGITAL` y **se corta por prioridad** — primero cabe la ciudad, la marca es lo que se cae. Comprobado sobre los 16 títulos del registro: ninguno pasa de 60. Los dos largos (Tarjetas NFC, Estrategia de Canales) pierden la marca y se quedan en 54 y 48.
  - El `metaTitle` del panel **sigue ganando** a todo esto. Hay copia gemela en `src/app/data/services.ts` para la pestaña del navegador; si se cambia una, cambiar la otra. Dos fichas tienen página propia y también se cambiaron: `TarjetasDigitalesPage` (lo tenía escrito a mano) y `GeoPage` (ya seguía el patrón).
  - Detalle sin consecuencia: en el navegador, `DynamicSEO` vuelve a pegar la marca cuando el recorte la quitó, así que la pestaña de Tarjetas NFC mide 72. Da igual —el recorte existe para Google, y a Google le llega el HTML de `render.php`, que sí mide 54—.
  - **Al verificar en producción salió un segundo defecto.** Cuatro fichas seguían con el título viejo después de subir: `chatgpt-ads`, `estrategia-de-canales`, `linkedin-de-empresa` y `tablero-de-resultados`. La causa es la trampa que ya está documentada aquí —los valores por defecto ganan al publicar—: la plantilla vieja se había grabado como `metaTitle` en `data_json`, así que el panel le ganaba al código. Eso **no es la decisión de nadie**, es el automático de antes fosilizado. `render.php` ahora ignora un `metaTitle` que sea exactamente esa forma (`… | Servicios · …`) y deja pasar cualquier otro texto escrito a mano. Las cuatro quedaron corregidas y comprobadas en vivo.
  - **Auditadas las 27 fichas en producción: ninguna pasa de 60 y todas nombran su ciudad.** Los cinco que estaban fuera de norma se corrigieron uno por uno, y no todos vivían en el mismo sitio —vale la pena saberlo antes de buscar el siguiente—:

| Ficha | Dónde vivía | Quedó en |
|---|---|---|
| `anuncios-espectaculares` | `metaTitle` en el panel | `Renta de Anuncios Espectaculares en Aguascalientes` (50) |
| `marketing-educativo` | `metaTitle` en el panel | `Marketing para Escuelas y Academias en Aguascalientes` (53) |
| `inteligencia-artificial-aguascalientes` | `metaTitle` en el panel | `Agencia de IA en Aguascalientes \| Inteligencia Artificial` (57) |
| `tarjetas-de-presentacion-digital` | `metaTitle` en el panel | campo **vaciado**: lo arma `tituloServicio()` (54) |
| `posicionamiento-en-ia` | **no es un servicio**: es una página del CMS | `Posicionamiento en IA (GEO) en Aguascalientes` (45) |

  - La última tenía el título en **tres sitios a la vez**, y hubo que tocar los tres: el respaldo en `render.php`, el `def` en `panel/inc/contenido.php` y el valor ya publicado en la base. Cambiar solo el código no movió nada —otra vez la trampa de que los valores por defecto ganan al publicar—. `GeoPage.tsx` también se alineó; ese entra con el próximo `npm run build`, no se desplegó un bundle nuevo solo por el título de una pestaña.
  - La ayuda del campo en el panel ahora dice cuál es la norma y que **vacío suele ser mejor**, para que el próximo título a mano no repita esto.

- **Lo que NO se tocó, y por qué.** Dos cosas quedaron señaladas sin diagnóstico firme, porque desde aquí no se pueden comprobar:
  - La regla del `.htaccess` que debería devolver **403** a `.sql`, `.env`, `.bak`, `.zip` **no está disparando**: `/copia.sql` y `/algo.env` llegan hasta `render.php` y contestan 404. Hoy da igual porque esos archivos no existen, pero la regla no protegería si alguna vez se sube un volcado a la raíz. Tampoco cubre `.env.local` ni `.env.production`, que son justo los que sondean. Se descartó que fuera una cadena de `ErrorDocument`: `render.php` ve la ruta original.
  - Las 177 impresiones locales en posición #6–9 con 2 clics **no son un problema del sitio**: encima de la 6 hay anuncios y el paquete de mapas. Ese clic se gana en la ficha de Google, no en el `<title>`. Hace falta ver un SERP real desde Aguascalientes.

## Lo último (21 de septiembre)

### Servicios IA: la misma ficha que los demás servicios

Las cinco páginas del menú «Servicios IA» —WhatsApp, Ventas, Marketing, E-commerce y Posicionamiento en IA— tenían cada una su propio diseño. Ahora **todas las fichas salen de una sola plantilla**, `src/app/components/FichaServicio.tsx`, con el mismo orden: portada (nombre, cotizar y WhatsApp) → qué es → qué incluye → lo que ganas → el proceso con su escena → ideal para → el fondo del asunto (plegado) → preguntas → cierre.

| Páginas | Adaptador | De dónde sale el contenido |
|---|---|---|
| Las 26 de `/servicios/…` | `ServiceDetailPage.tsx` | Panel › Servicios. El catálogo de espectaculares y las demos de activaciones entran por `trasPortada` y `trasProceso` |
| Las 4 de `/servicios-ia/…` | `PaginaServicioIA.tsx`; cada página es un envoltorio de 57 líneas con su SEO y sus respaldos | Panel › Contenido › «IA para WhatsApp», etc. |
| `/servicios/posicionamiento-en-ia` | `GeoPage.tsx` | Panel › Contenido › «Posicionamiento en IA (GEO)» |

- **Los títulos de sección** (QUÉ INCLUYE, LO QUE GANAS, NUESTRO PROCESO…) son los mismos para todas y se editan en Panel › Contenido › «Plantilla de página de servicio» › «Títulos de las secciones». Ahí también están «Volver a Servicios IA» y la categoría «IA».
- **Salieron del panel los campos que ya no se ven**: los eslóganes de portada («AGENTE INTELIGENTE QUE VENDE 24/7», «VENDE MÁS CON MENOS ESFUERZO», «MARKETING QUE PIENSA POR TI», «CONVIERTE MÁS VISITAS EN VENTAS» y «Tus clientes ya no buscan. Preguntan.»), los títulos propios de cada sección, imágenes, navegación y el bloque «diagnóstico» de posicionamiento. El diagnóstico sin costo lo siguen ofreciendo el botón de la portada y el cierre. El sitio ya no lee esos campos.
- **Cada una tiene su escena** en el proceso. Antes, las cuatro de IA caían en la de la página web y Posicionamiento no tenía recorrido. Son `EscenaChat`, `EscenaProspectos`, `EscenaPresupuesto`, `EscenaCarrito` y `EscenaRespuestaIA`, en `EscenasProceso.tsx`. `EscenasServicioIA.tsx` se borró porque ya no la usaba nadie.
- **`render.php`** sirve a los robots las cinco en el mismo orden que la página, con el nombre del servicio como H1 y la definición como primer párrafo. El FAQPage lleva hasta 8 preguntas.
- **Tres desbordes corregidos**, los tres por lo ancha que es Hanson. El título ahora se mide contra su caja (`cqw`) con un tope:
  - el cierre de las fichas, que se salía 58 px a 375;
  - el paso «CONCEPTUALIZACIÓN» de branding, 4 px a 375 (ya existía);
  - la demo «PHOTO OPPORTUNITY» de activaciones, 11 px a 768 (ya existía).
- Comprobado:
  - el texto de los 25 servicios de la colección quedó idéntico al de antes;
  - las 5 páginas de IA y los 26 servicios no tienen desbordes en los 9 tamaños ni en los 2 idiomas.
- **Desplegado el 21 de septiembre** (`assets/index-BIf4IOhB.js`). En vivo se comprobó:
  - lo que ven los robots en las cinco: H1 con el nombre, la definición primero y el mismo orden de secciones;
  - la página real a 375, 768 y 1440, sin desbordes, con cada una montando su propia escena.

### Automatizaciones de Claude Code (21-sep)

Todo vive en `.claude/`, que el repo ignora a propósito («configuración de cada máquina»): **existe solo en esta máquina**. Para versionarlo: `git add -f` de los archivos, como ya se hizo con `launch.json`.

| Qué | Dónde | Para qué |
|---|---|---|
| Skill `/barrido` | `.claude/skills/barrido/` | Mide desbordes en 9 tamaños y 2 idiomas con el contenido real (`sembrar.mjs` baja `api/content.php` a `.cache/`, nunca a `public/`). `__fugas` lista el español que se cuela en inglés |
| Skill `/publicar` (solo la invoca el usuario) | `.claude/skills/publicar/` | Revisa (`tipos.mjs`: solo errores de TS nuevos; `defs.mjs`: respaldos contra `def`), compila, sube y verifica en vivo (`verificar_vivo.py`) |
| Hook `php -l` | `.claude/hooks/php-lint.mjs` | Tras cada edición de un `.php`. Local es 8.4 y producción 8.3 |
| Candado de `deploy.sh` | `.claude/hooks/candado-deploy.mjs` | No deja publicar con `public/__*`, cambios sin commit en lo que se sube o `dist/` viejo. Solo se activa si el comando EJECUTA `deploy.sh` |
| Reglas `deny` | `.claude/settings.json` | Claude no puede leer `deploy.env`, `CLAVES*`, `credenciales*`, `client_secret*.json` ni los `config.php`. Aplica también a `cat`, `ls`, `sed` y redirecciones en Bash |
| Agentes | `.claude/agents/revisor-de-marca.md` y `auditor-de-traduccion.md` | Reglas de marca contra el copy nuevo; traducciones que faltan |
| MCP `playwright` (este proyecto) y `context7` (todos) | `~/.claude.json` | Navegador sin ventana que siempre pinta; documentación vigente de librerías |
| Plugin `security-guidance` | `enabledPlugins` en `.claude/settings.json` | Revisión de seguridad. En su primer arranque crea un venv en `~/.claude/security/` e instala el Agent SDK. Usa el modelo al cerrar turnos con cambios y en cada commit. Para apagarlo: `SECURITY_GUIDANCE_DISABLE=1`; solo la revisión por turno: `ENABLE_STOP_REVIEW=0` |

**Hueco de seguridad corregido de paso**: el servidor de desarrollo (`localhost:5173`) servía cualquier archivo de la carpeta, credenciales incluidas (`/deploy.env` daba 200). Ahora `server.fs.deny` en `vite.config.ts` las bloquea con 403. El riesgo era bajo, porque escucha solo en localhost y Vite 6.3.5 no acepta orígenes ajenos por CORS, pero bastaba cualquier proceso local.

Los MCP pueden desconectarse a media sesión; siguen configurados (`claude mcp list`) y vuelven al abrir otra.

### Segunda vuelta: lo que encontraron las herramientas, corregido (21-sep)

Commits `52242c2` y `a4653b3`. Todo ya existía antes; lo destapó la primera pasada completa con las herramientas.

- **Desbordes** (barrido de 61 rutas × 9 tamaños × 2 idiomas):
  - el H1 de 4 artículos del blog y del caso OFITODO empujaba la página de lado en teléfono (hasta 482 px en 375);
  - el título de sección de la portada se recortaba («AGUASCALIENTES,»);
  - los títulos de las tarjetas de `/servicios`, `/servicios-ia` y `/nosotros` se salían en tablet y laptop.

  Clases nuevas `.titulo-seccion`, `.titulo-articulo` y `.titulo-caso` junto a `.titulo-servicio`, más `cqw` por tarjeta. Solo cambia el teléfono.
- **Marca** (revisor-de-marca sobre todo el sitio):
  - Claude como auditor en 3 servicios y en `llms.php` pasó a «IA»;
  - la Feria de San Marcos salió del caso 1828, en los dos idiomas;
  - la visión de Nosotros ya no nombra «ChatGPT, Claude y Gemini» sin logotipos.
- **Textos del panel** (`defs.mjs`, que ahora sigue lectores pasados como parámetro y los atajos `marca.*()`):
  - 10 `def` con `\n` literal pasaron a saltos reales;
  - la clave `saludo` estaba duplicada;
  - la casilla del chat dice «Escribe tu pregunta…»;
  - las demos de activaciones y el `alt` del logotipo se alinearon con lo publicado;
  - 13 campos que el código leía ahora se editan en el panel.

  Queda en 485 comparados y 0 distintos.
- **Inglés:** 50 textos cortos traducidos (auditor-de-traduccion) y el menú de servicios, que en inglés salía revuelto y con las páginas de ciudad. Agrupaba comparando la categoría traducida contra nombres en español; ahora usa `categoriaBase` (ver Trampas).
- **Robots:** las fichas de servicio usan los mismos títulos y el mismo orden que la página.

**Corregido en la base de producción** (script de un solo uso, con modo prueba antes; 21 columnas, cada copia: `contenido` y `borrador`, columna y `data_json`):
- el teléfono ajeno y 10 `\n` literales en Privacidad y Términos, que la página mostraba tal cual;
- Claude en los tres servicios;
- la Feria en el caso 1828 (también sale ya de `llms-full.txt`);
- los párrafos pegados del texto largo en 4 páginas de IA;
- la casilla del chat.

El valor anterior de cada campo quedó en `.claude/respaldos/2026-09-21-base-antes-de-correcciones.txt`, con el script y su lanzador (`correr_en_servidor.sh`, que lee `deploy.env` sin imprimirlo). **La tarjeta de Armando Trejo no se tocó** en esa vuelta (se resolvió en la tercera, abajo).

### Tercera vuelta: opiniones de Google y las decisiones del cliente (21-sep)

**Carrusel de opiniones de Google** en la portada (después de «Casos») y al final de Nosotros. Solo cinco estrellas con texto, las más recientes primero, firmadas con nombre e inicial («Nancy S.»), con fecha relativa y enlace a la ficha. En inglés sale la traducción marcada «Translated from Spanish»; si una opinión no tiene traducción, sale la original con «Review in Spanish».

| Pieza | Dónde |
|---|---|
| Carrusel (Embla, trozo propio de 11 KB) | `src/app/components/SeccionResenas.tsx` |
| Tabla, sincronización y lo que ve el sitio | `panel/inc/resenas.php` (tabla `resenas_google`) |
| Pantalla del panel | Opiniones (`panel/pages/resenas.php`): estado de la conexión, «Sincronizar ahora», agregar a mano, traducción al inglés, ocultar |
| Sincronización diaria | Al final de `panel/cron/gsc_sync.php`, que ya corre en cPanel. También existe `panel/cron/resenas_sync.php` suelto |
| Datos al sitio | `render.php` los deja en `localStorage` como `inedito_resenas` (y en el HTML para robots, con 6 opiniones); `api/content.php` también |
| Textos de la sección | Panel › Contenido › Inicio y Nosotros › «Opiniones de Google (carrusel)» |
| Prueba | `php scripts/probar_resenas.php` (SQLite y Google simulado) |

**Cómo se llenó hoy:** las 21 opiniones de la ficha (5,0; 18 con texto) se copiaron a mano desde Google Maps y se cargaron como `copiada`, con fecha aproximada («hace un mes» → 21-ago) y su traducción. **Cómo se llena después:** con la API de Perfil de Empresa, que **todavía no está aprobada** (ver Pendientes). En cuanto responda, cada copiada se empareja con su original por autor (Google deja una reseña por cuenta y ficha), toma la fecha exacta y conserva la traducción si el texto no cambió. Las nuevas entran solas; las borradas en Google se retiran.

**Contenido en la base** (script de un solo uso con modo prueba; respaldo del «antes» en `.claude/respaldos/2026-09-21-antes-de-resenas.txt`):
- Portada: la bajada de «Casos» ya no dice «números y no nombres»; dice que muchos clientes están satisfechos con el rendimiento y las ventas. La cifra de motores de IA pasó de 4 a **6**.
- **Nosotros** publicado con la versión nueva (las tres promesas, sin «98 % de satisfacción»). La promesa «Visibilidad completa» nombra los seis motores y la franja de logos suma Copilot.
- **Tarjeta de Armando**: WhatsApp 449 583 9229 (el suyo); llamadas 449 513 6907, que ya estaba.

Después, a pedido del cliente: la opinión «Muy buena imaginen» (Alexis G.) quedó apagada en el carrusel (sigue contando en el total: el carrusel muestra 17), y las cuatro etiquetas de las tarjetas de `/servicios-ia` que eran abreviatura o inglés pasaron a «Seguimiento automático», «Prospección automática», «Prioriza leads» y «Análisis automático» (código, `def`, diccionario y base; respaldo en `.claude/respaldos/2026-09-21-antes-de-etiquetas-ia.txt`). Con eso no queda ninguna decisión pendiente del revisor de marca.

De paso: el título «POSICIONAMIENTO ORGÁNICO» de la vitrina de la portada se salía 28 px a 1024 de ancho; ahora se mide contra su tarjeta (`.titulo-tarjeta-icono`). Y el regreso de Google en el panel valida el `state` (antes no lo hacía).

## ⚠️ Revisar primero

**El cierre de la presentación en español está vacío en lo publicado.** Alguien publicó desde el panel con la etiqueta, el título y la descripción del cierre en blanco. En inglés sigue completo. Así, el cierre en español muestra solo el logo y los botones de contacto.

Si no fue a propósito, se arregla en el panel: Contenido › Presentación › lámina 12, o desde «Versiones anteriores». El texto original está en `src/app/components/presentacion/contenido.ts`, lámina `cierre`:

- Etiqueta: `Siguiente paso`
- Título: `EMPECEMOS` / `POR MEDIR` (dos renglones)
- Descripción: la que empieza «No hace falta contratar todo…»

## Pendientes

### Del lado del negocio (necesitan a una persona)

- [ ] Confirmar lo del cierre vacío (arriba).
- [ ] **Probar el formulario de contacto**: enviarlo y confirmar que llega UN correo y se crea UN lead. Si llegan dos, el puente de `render.php` volvió a duplicar.
- [ ] **Que las opiniones de Google se actualicen solas.** El código ya está; falta lo de Google, que solo puede hacer la cuenta dueña de la ficha:
  1. Pedir acceso a la API de Perfil de Empresa con el formulario de Google (developers.google.com/my-business/content/prereqs#request-access), con el número del proyecto de Google Cloud donde vive el Client ID del panel. La cuota empieza en 0 hasta que aprueban; suele tardar de días a un par de semanas.
  2. Ya aprobado, activar en ese proyecto *My Business Account Management API*, *My Business Business Information API* y *Google My Business API*.
  3. Panel › Opiniones › «Reconectar Google» y aceptar el permiso nuevo (`business.manage`). Hasta que se reconecte, la conexión actual no alcanza para leer reseñas; Search Console y Analytics siguen igual.
  4. «Sincronizar ahora». Desde ahí va sola con el cron diario de Search Console.

  Mientras tanto, una opinión nueva se agrega a mano en Panel › Opiniones.
- [ ] **Licencia de Remotion**: es gratis para personas y para empresas de hasta 3 empleados. Si Inédito tiene más, necesita la licencia de empresa (remotion.pro).
- [ ] **Crons en cPanel** (confirmar si ya están puestos). Los tres son diarios: `reporte_quincenal.php`, `gsc_sync.php` y `espectaculares_sync.php`, con el formato `/usr/local/bin/ea-php83 /home/inedito/public_html/panel/cron/<archivo>.php`. Al 21-sep ya hay fotos diarias de Search Console (19, 20 y 21), o sea que `gsc_sync.php` corre; las opiniones de Google van dentro de ese mismo cron. Falta confirmar los otros dos.
- [ ] **Permiso de Vía Gráfica** para publicar su inventario en el sitio. El catálogo se toma cada día de su API (`spvnet.gruposoldi.mx`). Venía abierto de sesiones anteriores.
- [ ] **SEO**: la lista completa está en `auditoria/checklist-proximos-pasos.md` (reenviar el sitemap, indexación manual, ficha de Google, reseñas…). Ojo: el punto OFF-04 (nota de prensa de la Feria de San Marcos) **ya no aplica**. El 31 de agosto se decidió no presumir ese proyecto.

### Técnicos (para la siguiente sesión)

- [ ] `docs/GUIA_DEL_PANEL.md` no menciona la sección Presentación.
- [ ] En inglés solo quedan en español, a propósito, los textos largos de «El fondo del asunto», el blog y lo legal.
- [ ] Errores viejos de TypeScript que no rompen el build: `TopographyCanvas.tsx` (25), `BlogPostPage.tsx` (1), `PortfolioPage.tsx` (1) y `vite.config.ts` (1).
- [ ] Archivos sueltos sin trackear: en la raíz, `LOGO CINE KRISTAL.png`, `Logo-blanco.png`, `logo tachis.png` y `x.png`; en `docs/`, `ASISTENTE_REPLICA.md` y `AUDITORIA_TECNICA_SITIO_2026.md`. No se sabe para qué son y no se subieron.
- [ ] Ideas ofrecidas y no hechas: fotos de producto para el mockup de la tienda (generadas con ChatGPT) y hacer editables desde el panel los remates de las animaciones.
- [ ] Queda 1 px de scroll en la lámina Posicionamiento a 667×375 (iPhone SE acostado, español). No se nota.

## Cómo está armada la presentación

```
contenido.ts (BASE) ──build──▶ /presentacion-base.json ──▶ panel (arranque y «Volver al original»)
                                                              │ publicar
                                                              ▼
deck en el navegador ──▶ api/presentacion.php ──▶ tabla pages (slug y tipo 'presentacion')
                            └─ datos: null si nadie ha publicado → el deck usa BASE
```

| Qué | Dónde |
|---|---|
| Página del deck | `src/app/pages/PresentacionServicios.tsx` |
| Textos de respaldo y tipos | `src/app/components/presentacion/contenido.ts` |
| Carga, limpieza y vista en vivo (postMessage) | `src/app/components/presentacion/datos.ts` |
| La escena en la lámina y su reproductor | `EscenaVideo.tsx` y `EscenaVideoInterna.tsx` |
| Logo oficial | `Logotipo.tsx` y `public/marca/inedito-{blanco,negro}.svg` |
| Escenas de Remotion | `src/remotion/`: `marca.ts` (paleta, `DURACION` 240, `REPOSO` 200, `FUNDIDO` 16), `piezas.tsx`, `logos.tsx`, `escenas/*.tsx` |
| Lista de escenas | `src/remotion/nombres.ts` **y** `presentacion_escenas()` en `panel/inc/presentacion.php`. Van en pareja: al agregar una, se agrega en los dos |
| Editor del panel | `panel/pages/presentacion.php` y `panel/inc/presentacion.php` |
| API pública | `api/presentacion.php` (sin caché) |
| Generador del respaldo | Plugin `presentacionBase` en `vite.config.ts` |
| Modo ventana baja | Variante `apaisado` en `src/styles/tailwind.css`: 640 px o más de ancho y 520 px o menos de alto |

Reglas:

- Como ya se publicó desde el panel, **los textos del deck se cambian en el panel**, no en `contenido.ts`.
- `render.php` y `api/content.php` excluyen a propósito el tipo `presentacion`: no debe viajar en cada visita al sitio.
- El `<Player>` de Remotion con `autoPlay` se queda congelado en el cuadro 0. Por eso se arranca a mano con `seekTo(0)` y `play()`.

## Trampas conocidas

- **Los `def` del panel ganan al publicar.** Si cambias un texto en `HomePage.tsx`, cambia también su `def` en `panel/inc/contenido.php`.
- **Agrupar servicios por la categoría ORIGINAL.** En inglés `service.category` llega traducida; para agrupar o filtrar se usa `categoriaBase` (o `esCobertura()` de `data/grupos.ts`). Comparar contra la traducida revolvió el menú en inglés y metió las páginas de ciudad en `/servicios`.
- **Una plantilla para todas las fichas.** Lo que se cambie en `FichaServicio.tsx` se ve en los 26 servicios, las 4 de IA y posicionamiento. Mide los tres tipos antes de entregar, y en la de espectaculares y la de activaciones, que traen bloques propios.
- **Dos copias** en `services`, `blog_posts` y `portfolio`: el sitio lee `data_json`, y `crud()` escribe las dos. Corre `php scripts/probar_crud.php` antes de desplegar cambios del panel.
- **`render.php` va junto con el bundle.** Se despliegan juntos; si se desfasan, los leads se duplican o se pierden.
- **CLI de Remotion:** la carpeta `auditoria/` lo confunde. Pasa siempre la entrada: `npx remotion still src/remotion/index.ts <escena> out.png --frame=150`.
- **`deploy.sh` se detiene si algún asset no sube** (el FTP a veces corta la sesión) y no toca nada más. Volver a correrlo es seguro.
- **Navegador de Claude:** el usuario deja una pestaña de ChatGPT abierta. Pasa siempre el `tabId` de la pestaña de pruebas.
- **Opiniones de Google: no hay respaldo en el código.** Si `inedito_resenas` no llega (tabla vacía o sin crear), la sección no se pinta. A propósito: una opinión inventada es peor que ninguna. Tampoco va schema de `Review`: Google no acepta reseñas de un negocio sobre sí mismo.
- **Un barrido de teléfonos en la base debe saltarse `armando-trejo`**: su tarjeta lleva sus números personales (WhatsApp 449 583 9229, llamadas 449 513 6907).
- **Credenciales fuera del alcance de Claude:** las reglas `deny` bloquean cualquier comando que *nombre* esos archivos (`cat`, `ls`, `sed`, `>`), aunque sea para borrar un señuelo. `deploy.sh` sigue funcionando porque los lee desde su propio proceso. Un script de un solo uso que necesite `deploy.env` tiene que leerlo desde un archivo `.sh` o `.py`, no desde la línea de comandos.
- **Git Bash convierte rutas**: `/servicios` pasa a `C:/Program Files/Git/servicios` al dárselo a Python o a `claude`. `verificar_vivo.py` ya lo deshace. Con `cmd /c` o rutas que empiezan con `/`, antepón `MSYS_NO_PATHCONV=1`.
- LiteSpeed ignora las cabeceras de `.htaccess` en respuestas PHP (detalle en `docs/DESPLIEGUE.md`).

## Antes de entregar un cambio visual

Revisa todas las láminas o páginas en español **e** inglés, en estos tamaños:

- Vertical y escritorio: 375×667, 390×844, 768×1024, 1024×768, 1274×680, 1274×720, 1366×768, 1440×900 y 1920×1080.
- Acostado: 667×375, 844×390 y 932×430.

Busca scroll de más, texto cortado (`scrollWidth > clientWidth`) y elementos encimados. Hay que medir, no solo mirar: un título se puede salir de su caja aunque la caja se vea bien.

Para eso está la skill `/barrido` (`.claude/skills/barrido/`), que ya descarta los falsos positivos conocidos. Con el panel del navegador oculto la ventana mide 0 px y todo parece desbordar: emula el tamaño o usa el MCP de Playwright.

## Decisiones tomadas (no se rediscuten)

- Contacto único: **+52 1 449 120 4353** (`5214491204353` en `wa.me` y `tel:`) y **contacto@inedito.digital**. Única excepción: la tarjeta NFC de Armando (WhatsApp 449 583 9229, llamadas 449 513 6907).
- «Una IA audita»: nunca Claude como auditor. Los logos de las IA van solo donde se mide presencia.
- Prueba social anónima: sin casos con nombre ni testimonios, solo cifras verificables. Excepción autorizada (21-sep): el carrusel de opiniones de Google, solo cinco estrellas, tal cual y con nombre e inicial.
- Los motores de IA principales son **seis**: ChatGPT, Gemini, AI Overviews, Perplexity, Claude y Copilot.
- Las cifras de `/servicios-ia` (10x, 80 %, 100 %) se quedan: el agente solo toma el lead y lo pasa a una persona real.
- La Feria de San Marcos no se presume como caso propio.
- Hanson solo en mayúsculas; las frases van en mono.
- Copy de venta directo: un título que dice el beneficio y una o dos frases de cómo se cumple.
- Una sola oficina (Aguascalientes). Las otras ciudades son palabras clave, sin domicilios inventados.
- La ficha de Google ya está configurada con las categorías de IA.
- Píxeles de Meta y GA4: omitidos por ahora.
- El secreto de OAuth de Google no se rota por ahora (decisión del cliente).

## Documentos relacionados

`README.md` · `docs/DESPLIEGUE.md` · `docs/GUIA_DEL_PANEL.md` · `docs/REGLAS_SERVIDOR_INEDITO.md` · `auditoria/checklist-proximos-pasos.md`
