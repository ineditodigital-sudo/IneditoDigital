# Estado del sitio · inedito.digital

> Corte: **11 de septiembre de 2026**. Escrito para retomar en otra sesión.
> Antes de confiar en esto, compáralo con `git log -1` y con el bundle que sirve el sitio. Si no coinciden, algo cambió después de este corte.

## En una mirada

| | |
|---|---|
| Último commit | `40d21c4` — La presentación también cabe en teléfono acostado y ventanas bajas |
| En producción | El mismo: `assets/index-ZrqbvlsA.js` (verificado el 11-sep) |
| Sin commit | Nada de código. Solo 3 PNG sueltos en la raíz (ver Pendientes) |
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
- [ ] **Tarjeta NFC de Armando Trejo** (`pages/armando-trejo`): al corregir el contacto, su WhatsApp quedó con el número de la empresa. Si `449 583 9229` era su celular, hay que devolvérselo.
- [ ] **Licencia de Remotion**: es gratis para personas y para empresas de hasta 3 empleados. Si Inédito tiene más, necesita la licencia de empresa (remotion.pro).
- [ ] **Crons en cPanel** (confirmar si ya están puestos). Los tres son diarios: `reporte_quincenal.php`, `gsc_sync.php` y `espectaculares_sync.php`, con el formato `/usr/local/bin/ea-php83 /home/inedito/public_html/panel/cron/<archivo>.php`.
- [ ] **Permiso de Vía Gráfica** para publicar su inventario en el sitio. El catálogo se toma cada día de su API (`spvnet.gruposoldi.mx`). Venía abierto de sesiones anteriores.
- [ ] **SEO**: la lista completa está en `auditoria/checklist-proximos-pasos.md` (reenviar el sitemap, indexación manual, ficha de Google, reseñas…). Ojo: el punto OFF-04 (nota de prensa de la Feria de San Marcos) **ya no aplica**. El 31 de agosto se decidió no presumir ese proyecto.

### Técnicos (para la siguiente sesión)

- [ ] `docs/GUIA_DEL_PANEL.md` no menciona la sección Presentación.
- [ ] Errores viejos de TypeScript que no rompen el build: `TopographyCanvas.tsx` (25), `BlogPostPage.tsx` (1), `PortfolioPage.tsx` (1) y `vite.config.ts` (1).
- [ ] Tres PNG sueltos sin trackear en la raíz: `LOGO CINE KRISTAL.png`, `Logo-blanco.png` y `logo tachis.png`. No se sabe para qué son y no se subieron.
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
- **Dos copias** en `services`, `blog_posts` y `portfolio`: el sitio lee `data_json`, y `crud()` escribe las dos. Corre `php scripts/probar_crud.php` antes de desplegar cambios del panel.
- **`render.php` va junto con el bundle.** Se despliegan juntos; si se desfasan, los leads se duplican o se pierden.
- **CLI de Remotion:** la carpeta `auditoria/` lo confunde. Pasa siempre la entrada: `npx remotion still src/remotion/index.ts <escena> out.png --frame=150`.
- **`deploy.sh` se detiene si algún asset no sube** (el FTP a veces corta la sesión) y no toca nada más. Volver a correrlo es seguro.
- **Navegador de Claude:** el usuario deja una pestaña de ChatGPT abierta. Pasa siempre el `tabId` de la pestaña de pruebas.
- LiteSpeed ignora las cabeceras de `.htaccess` en respuestas PHP (detalle en `docs/DESPLIEGUE.md`).

## Antes de entregar un cambio visual

Revisa todas las láminas o páginas en español **e** inglés, en estos tamaños:

- Vertical y escritorio: 375×667, 390×844, 768×1024, 1024×768, 1274×680, 1274×720, 1366×768, 1440×900 y 1920×1080.
- Acostado: 667×375, 844×390 y 932×430.

Busca scroll de más, texto cortado (`scrollWidth > clientWidth`) y elementos encimados. Hay que medir, no solo mirar: un título se puede salir de su caja aunque la caja se vea bien.

## Decisiones tomadas (no se rediscuten)

- Contacto único: **+52 1 449 120 4353** (`5214491204353` en `wa.me` y `tel:`) y **contacto@inedito.digital**.
- «Una IA audita»: nunca Claude como auditor. Los logos de las IA van solo donde se mide presencia.
- Prueba social anónima: sin casos con nombre ni testimonios, solo cifras verificables.
- La Feria de San Marcos no se presume como caso propio.
- Hanson solo en mayúsculas; las frases van en mono.
- Copy de venta directo: un título que dice el beneficio y una o dos frases de cómo se cumple.
- Una sola oficina (Aguascalientes). Las otras ciudades son palabras clave, sin domicilios inventados.
- La ficha de Google ya está configurada con las categorías de IA.
- Píxeles de Meta y GA4: omitidos por ahora.
- El secreto de OAuth de Google no se rota por ahora (decisión del cliente).

## Documentos relacionados

`README.md` · `docs/DESPLIEGUE.md` · `docs/GUIA_DEL_PANEL.md` · `docs/REGLAS_SERVIDOR_INEDITO.md` · `auditoria/checklist-proximos-pasos.md`
