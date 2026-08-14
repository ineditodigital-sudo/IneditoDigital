# Análisis del panel de administración — inedito.digital

Fecha: 16 de julio de 2026

## 1. Qué es y qué módulos tiene

El panel (`/admin`) es un dashboard oscuro, con la marca Inédito, organizado en una barra
lateral con 7 módulos:

**Dashboard.** Vista general con 4 tarjetas KPI (Leads totales, Posts de blog, Casos de
portafolio, Servicios) y una lista de "Leads recientes". Es solo lectura.

**SEO Manager** (el módulo más completo, ~1,100 líneas). Gestiona: Google Analytics ID,
Facebook Pixel, verificación de Google y Bing, robots (noindex/nofollow), configuración del
sitemap (frecuencia, prioridad, URLs), schema LocalBusiness (nombre, tipo, dirección, geo
lat/long, horarios, rango de precios), redes sociales, imagen OG por defecto, autor, y trae
vistas previas muy buenas: resultado en Google (SERP), schema JSON‑LD y sitemap XML.

**Servicios.** ABM de servicios: título, slug, descripción corta/completa, categoría, precio,
imagen, características, beneficios, meta title/description, keywords.

**Blog.** ABM de artículos: título, slug, extracto, contenido, categoría, autor, imagen,
tiempo de lectura, fecha, meta title/description, keywords.

**Portafolio.** ABM de casos: cliente, categoría, descripción, imagen principal + galería,
reto, solución, resultados (métricas), testimonial, meta y keywords.

**Leads.** Lista con filtros por estado (new, contacted, qualified, converted, lost) y
exportación a CSV. *(Ya conectado a MySQL en modo lectura.)*

**Ajustes.** Datos del negocio (nombre, WhatsApp, teléfono, email, dirección, ciudad,
horario) y botones de "Limpiar caché" y "Reset completo".

## 2. Diseño (evaluación)

El diseño es un **punto fuerte**: coherente con la marca (morado sobre oscuro), barra
lateral clara, tarjetas KPI legibles, y detalles de UX muy buenos como la vista previa de
Google, del schema y del sitemap. La navegación es intuitiva y el conjunto se ve
profesional. No es aquí donde están los problemas.

## 3. El problema de fondo (lo más importante)

**Casi todo el panel escribe solo en `localStorage`, no en el servidor.** Esto significa
que lo que se edita en el panel **no cambia el sitio publicado ni afecta a Google**; solo
vive en el navegador de quien edita. En concreto, hoy:

- El **SEO Manager** no aplica nada a los visitantes reales: el Analytics, el Pixel, el
  schema y el sitemap que se configuran ahí no llegan ni a los visitantes ni a Google.
- **Servicios, Blog y Portafolio**: crear o editar aquí no publica nada. El contenido real
  del sitio está "horneado" en el código; el panel da una sensación de CMS que no existe.
- **Ajustes** (número de WhatsApp, datos del negocio): igual, solo en el navegador.
- **Leads**: es lo único ya conectado a datos reales (MySQL), en modo lectura.

En resumen: el panel es una **fachada muy bonita sobre `localStorage`**. La buena noticia es
que ya tenemos el backend (PHP + MySQL) para convertirlo en un CMS de verdad, como ya
hicimos con los leads.

## 4. Qué mejorar y qué añadir

### A. Convertir el panel en un CMS real (la base de todo)
Persistir cada módulo en MySQL vía PHP (igual que los leads) y que el sitio público lea esa
configuración. Prioridad por impacto:

1. **SEO real.** Que el Analytics, el Pixel, los meta por página, el schema y el sitemap se
   guarden en el servidor y se apliquen de verdad: inyectarlos en el `<head>` (o generarlos
   con PHP) y producir un `sitemap.xml` y `robots.txt` reales desde la base de datos.
2. **Contenido publicable.** Servicios, Blog y Portafolio guardados en MySQL y servidos al
   sitio; con estados **borrador/publicado** y programación de fecha.
3. **Ajustes con efecto real** (WhatsApp, datos del negocio) leídos por el sitio.

### B. Leads — control comercial (alto valor, ya tenemos la base)
- **Guardar cambios de verdad**: cambiar estado y borrar leads que persista en MySQL.
- **Ficha del lead** con notas, historial y asignación a Armando o Diego.
- **Pipeline tipo kanban** (nuevo → contactado → calificado → convertido) para gestión visual.
- **Responder desde el panel** por correo o WhatsApp con un clic.
- **Métricas de leads**: por día/semana, por origen, por servicio, tasa de conversión.
- **Avisos**: notificación de nuevo lead y resumen semanal por correo.
- **Anti‑duplicados** y búsqueda por nombre/email/empresa.

### C. Posicionamiento (SEO) — para aparecer más en Google
- **Google Analytics 4 + Search Console** reales (requiere el proyecto de Google Cloud que
  mencionaste; te guío cuando lo tengas). Con eso el dashboard puede mostrar tráfico y
  posiciones reales.
- **Meta y Open Graph por página en el servidor** (prerender), para arreglar las vistas
  previas de enlaces y que Google indexe bien cada ruta, no solo la home.
- **Sitemap automático** generado desde el contenido publicado, y envío a Search Console.
- **Datos estructurados por tipo**: Article (blog), Service (servicios), BreadcrumbList y FAQ
  — mejora cómo se ve el sitio en Google.
- **Blog como motor de SEO**: publicar con constancia artículos que respondan búsquedas de
  tus clientes (marketing en Aguascalientes, IA para ventas, etc.).
- **SEO local**: enlazar y optimizar el perfil de Google Business, reseñas, NAP consistente.
- **Rendimiento e imágenes**: Core Web Vitals, imágenes propias en WebP con alt correcto
  (hoy varias son de Unsplash).

### D. Control del sitio y operación
- **Subida de imágenes** desde el panel (hoy se pegan URLs a mano). *Nota: en el repo ya
  existe un uploader PHP (`inedito-portable-media-repo`) que se puede integrar.*
- **Editor de contenido enriquecido** para el blog (negritas, listas, enlaces, imágenes).
- **Roles y usuarios** (más de un admin), **registro de actividad** y **cambio de contraseña**
  desde el panel; opcional 2FA.
- **Respaldos** automáticos de la base de datos.
- **Widget de métricas del sitio** propio (contador de visitas por PHP) por si se quiere algo
  independiente de Google.

## 5. Orden sugerido
1. Leads con guardado real (estado/borrado) + ficha y pipeline — valor comercial inmediato.
2. SEO real (Analytics/Pixel/meta/sitemap servidos por el servidor) — posicionamiento.
3. Contenido publicable (blog/servicios/portafolio en MySQL) — blog como motor SEO.
4. Subida de imágenes, roles y respaldos — operación.

Todo esto es factible **en PHP, sin Node**, con la misma técnica que ya validamos (backend
PHP + puente en el sitio). El diseño actual se conserva; lo que cambia es que el panel pase
de "fachada" a **control real** del sitio.
