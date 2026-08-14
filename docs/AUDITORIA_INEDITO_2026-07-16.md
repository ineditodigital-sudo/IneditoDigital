# Auditoría del sitio inedito.digital

**Fecha:** 16 de julio de 2026
**Alcance:** sitio principal `https://inedito.digital` (build de Figma Make / React + Vite)
**Base de la auditoría:** código fuente local + sitio en producción + archivos publicados en el servidor

---

## Resumen ejecutivo

El sitio está bien construido a nivel visual y de front-end (React, lazy-loading por página, buen diseño). El problema de fondo es **arquitectónico**: es una aplicación 100% de cliente, sin backend. Toda la lógica de datos —leads, autenticación del admin, contenido editable y hasta el SEO— depende de `localStorage`, que vive **solo en el navegador de cada visitante**. Esto provoca cuatro fallos graves que hoy están activos en producción:

1. **Los mensajes del formulario de contacto no le llegan a nadie.**
2. **El panel /admin es inseguro** (credenciales visibles en el código) y sus cambios **no se publican**.
3. **Analytics y Facebook Pixel no se disparan** para los visitantes reales: no hay medición ni retargeting.
4. **El SEO y las vistas previas de enlaces (WhatsApp, Facebook) están rotas** porque los meta tags se generan por JavaScript y dependen de `localStorage`.

Ninguno se ve "a simple vista" porque el sitio se ve perfecto; el daño es de negocio (prospectos perdidos, cero datos de marketing, mal posicionamiento).

**Prioridad de atención:** primero #1 (leads) y #3/#4 (medición y previews), que son pérdida directa de negocio y de bajo esfuerzo; luego #2 (seguridad/CMS), que requiere decisión de backend.

---

## CRÍTICO

### C1 — El formulario de contacto no entrega los leads
**Dónde:** `src/app/pages/ContactPage.tsx` → `handleSubmit` llama solo a `addLead(...)`, que guarda el lead en `localStorage` (`inedito_leads`) del navegador del visitante. Luego muestra "¡Mensaje enviado! Te contactaremos pronto."

**Qué pasa realmente:** el mensaje se guarda en el navegador de quien lo escribe y **nunca sale de ahí**. El equipo de Inédito jamás lo recibe. El visitante cree que envió su consulta; en la práctica se pierde el 100% de los prospectos que usan el formulario.

**Nota:** el Asistente de IA (`AIAssistant.tsx`) **sí** funciona, porque al final abre WhatsApp con los datos (`window.open(wa.me/...)`). El formulario clásico es el que está roto.

**Impacto:** alto · **Esfuerzo:** bajo. → *Corregido en local (ver sección "Correcciones aplicadas").*

### C2 — Panel /admin inseguro y sin efecto real
**Dónde:** `src/app/context/AppContext.tsx`.

- Usuario y contraseña por defecto están **escritos en el código** (`admin` / `@Inédito%131415`) y el "hash" es solo Base64 (`btoa`), reversible. El propio código lo admite: `// NOT SECURE FOR PRODUCTION`. Cualquiera que abra el JavaScript del sitio puede leer la contraseña y entrar a `/admin`.
- La autenticación es de cliente: no hay servidor que valide nada.
- Todo lo que se edita en el panel (servicios, blog, portafolio, SEO, ajustes) se guarda en el `localStorage` del navegador del editor, así que **esos cambios no los ve ningún visitante** ni se publican. El panel da una falsa sensación de "CMS".

**Impacto:** alto · **Esfuerzo:** alto (requiere backend). → *Requiere decisión (ver Recomendaciones).*

### C3 — Sin analítica ni pixel para visitantes reales
**Dónde:** `src/app/components/DynamicSEO.tsx` / `SEO.tsx`. Google Analytics y Facebook Pixel solo se inyectan **si** existe `globalSEO.googleAnalytics` / `facebookPixel` en `localStorage`. Como ese valor lo pone el admin en su propio navegador, para el visitante real **nunca se cargan**. El `index.html` publicado tampoco trae GA. En el panel el ID de GA está como placeholder `G-XXXXXXXXXX`.

**Consecuencia:** Inédito no tiene datos de tráfico, ni conversiones, ni audiencias para retargeting en Meta. Para una agencia de marketing, es el problema más costoso a mediano plazo.

**Impacto:** alto · **Esfuerzo:** bajo. → *Corregible poniendo GA/Pixel de forma estática en `index.html` (ver Recomendaciones; falta el ID real).*

### C4 — SEO y vistas previas de enlaces rotas
**Dónde:** `index.html` publicado es un cascarón vacío (`<div id="root">`), sin `description` ni Open Graph. Todo el SEO se aplica después por JavaScript (`DynamicSEO`). Los rastreadores de redes sociales (WhatsApp, Facebook, X, LinkedIn) **no ejecutan JavaScript**, así que al compartir un enlace de inedito.digital la vista previa sale **sin descripción y sin imagen correcta**. Google sí puede renderizar JS, pero es más lento y menos fiable que tener el meta en el HTML inicial.

Además, como los meta dependen de `localStorage`, ni siquiera se garantizan igual entre dispositivos.

**Impacto:** alto (imagen de marca + posicionamiento) · **Esfuerzo:** bajo-medio. → *Corregido parcialmente en local: meta estáticos en `index.html` (ver Correcciones).*

---

## IMPORTANTE

### I1 — localStorage como "base de datos" provoca páginas en blanco / caché
El archivo `CACHE_TROUBLESHOOTING.md` del propio proyecto documenta un síntoma real: "la página solo aparecía en modo incógnito". Es consecuencia directa de mezclar el contenido con versiones cacheadas en `localStorage` (`inedito_data_version`). Mientras el contenido viva en `localStorage`, este tipo de fallos volverá a aparecer tras cada cambio de datos.

### I2 — Contenido editable que en realidad es estático
Servicios, blog y portafolio se compilan desde `src/app/data/*.ts` en tiempo de build. Editarlos "en el panel" no cambia el sitio publicado: hay que editar el código y volver a compilar/desplegar. Conviene dejarlo claro al equipo para no perder trabajo editando un panel que no publica.

### I3 — Accesibilidad de formularios
Los campos usan solo `placeholder` como etiqueta, sin `<label>` asociado. Esto afecta a lectores de pantalla y a la usabilidad (el placeholder desaparece al escribir). Recomendado añadir `label`/`aria-label` en Contacto y en el login.

### I4 — Peso del bundle principal
El chunk principal (`index-*.js`) pesa ~654 KB sin comprimir. Arrastra librerías pesadas que quizá no se usen en todas las páginas: MUI, Radix UI, Recharts, react-slick, embla-carousel, react-dnd y motion. Revisar cuáles se usan de verdad y quitar/segmentar las demás reduciría carga y mejoraría Core Web Vitals.

### I5 — Dependencia de imágenes externas (Unsplash)
Varias imágenes se cargan desde `images.unsplash.com`. Son ajenas a la marca, dependen de un tercero y penalizan velocidad/estabilidad. Recomendado alojar imágenes propias optimizadas (WebP) en `imagenes.inedito.digital`, que ya usan.

---

## MENOR / HIGIENE

- **Residuos en el servidor:** en la raíz de `/public_html/` conviven `proyecto_inedito_build.zip`, `proyecto_inedito_build (2).zip`, la carpeta `proyecto_inedito_build/` y restos de WordPress (`wordpress/`, `wp-content/`, `.htaccess_old`, `.wp-cli/`, `test_twilio.php`, `test-formatos-api.php`, `card.html`). No afectan al sitio, pero conviene limpiarlos (previa confirmación, según las reglas del proyecto).
- **Backups mal generados:** existen `php.ini.bak.$(date +%F-%H%M)` y `.user.ini.bak.$(date +%F-%H%M)` con el nombre literal sin expandir → hay un script de backup con un bug.
- **Texto engañoso** en el login: "Credenciales actualizadas - Panel seguro". Mejor quitarlo.
- **Redirección duplicada:** `PATRON-FLEX.pdf` se maneja tanto en `.htaccess` (301) como en una ruta React (`PatronFlexRedirect`). La del `.htaccess` gana; la de React queda muerta. Sin daño, pero es inconsistente.
- **GA ID placeholder** `G-XXXXXXXXXX` sin reemplazar.
- **Sitemap** con `lastmod` fijo en enero 2026.

---

## Recomendaciones (hoja de ruta)

**Rápidas y de alto impacto (sin backend):**
1. Hacer que el formulario entregue el lead de verdad — por WhatsApp/mailto ahora, e idealmente por un servicio de formularios (Web3Forms, Formspree o EmailJS) que envíe correo automático. *(WhatsApp/mailto ya aplicado en local.)*
2. Poner Google Analytics 4 y Facebook Pixel **estáticos** en `index.html` con los IDs reales. *(Falta que me pases los IDs.)*
3. Meta tags y Open Graph estáticos en `index.html` para arreglar previews y SEO base. *(Aplicado en local para la home.)*

**De fondo (requieren decisión):**
4. Backend real para autenticación del admin y para que el CMS publique de verdad (o migrar contenido a archivos y flujo de build controlado). Como mínimo, sacar las credenciales del código.
5. Prerender/SSR (o meta por página en servidor) para SEO por ruta, no solo home.
6. Optimizar bundle (quitar librerías no usadas) y migrar imágenes a activos propios WebP.

**Higiene:**
7. Limpiar residuos y zips del servidor; corregir el script de backup; quitar el texto "Panel seguro".

---

## Correcciones aplicadas en el código local (para revisar antes de desplegar)

> Se editó **solo código local**. No se subió nada al servidor.

- **Formulario de contacto (`ContactPage.tsx`):** ahora, además de guardar el lead, abre WhatsApp con los datos formateados hacia el número de Inédito, de modo que el prospecto **sí llega** (misma vía que ya usa el Asistente de IA). La tarjeta de contacto de la página ya incluye además correo (`mailto`) y teléfono directos.
- **`index.html`:** se añadieron meta `description`, Open Graph y Twitter Card estáticos + `canonical` + `theme-color`, para que las vistas previas de enlaces y el SEO base funcionen desde el primer render.

Pendiente de tu decisión/insumo: IDs reales de GA4 y Pixel, y la vía definitiva de entrega de leads (servicio de formularios o backend).
