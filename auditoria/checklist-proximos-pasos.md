# Checklist de próximos pasos · inedito.digital · Agosto 2026

> Cada ítem trae `(Impacto · Esfuerzo · Responsable)` y el ID del hallazgo que resuelve (ver `reporte-auditoria.html`). Los responsables: **Desarrollo** (código/servidor), **Contenido** (redacción en el panel), **Negocio** (decisiones/gestiones), **Cliente** (accesos e insumos).

## ⚡ Quick wins (semana 1–2)

- [ ] Publicar las **redirecciones 301** de las 11 URLs del WordPress viejo (código listo en instrucciones §1) `(Impacto: Alto · Esfuerzo: Bajo · Responsable: Desarrollo)` — IDX-01
- [ ] Definir la **forma canónica del NAP** (¿"Jardines Eternos 902-Loc 2" o "Local 2"?) y corregirla en el sitio si cambia `(Alto · Bajo · Negocio)` — LOC-01
- [ ] Corregir la dirección en la **ficha de Delfos** y en **Google Business Profile** para que coincida letra por letra `(Alto · Bajo · Negocio)` — LOC-01
- [ ] Agregar **geo (coordenadas), horarios y WebSite+SearchAction** al schema (bloque listo en instrucciones §5) `(Alto · Bajo · Desarrollo)` — LOC-02
- [ ] Publicar **llms-full.txt** (código listo en instrucciones §3) `(Medio · Bajo · Desarrollo)` — GEO-03
- [ ] Ajustar los **4 titles y 3 metas** fuera de rango (textos finales en instrucciones §4; se cambian desde el panel) `(Medio · Bajo · Contenido)` — ONP-01/02
- [ ] Completar el **robots.txt** con los bots de IA faltantes (archivo final en instrucciones §2) `(Medio · Bajo · Desarrollo)` — GEO-01
- [ ] Añadir las **páginas del equipo al sitemap** `(Medio · Bajo · Desarrollo)` — IDX-04
- [ ] Correr **PageSpeed Insights** sobre las 6 URLs clave y guardar los números como línea base `(Medio · Bajo · Negocio)` — TEC-01
- [ ] Correr el **guion de 15 preguntas GEO** en ChatGPT, Gemini y Perplexity; guardar capturas como línea base `(Alto · Bajo · Negocio)` — GEO-04

## 🔴 PRIORIDAD REPLANTEADA (21/08, con las 224 consultas reales)

> El sitio ya está en página 1 para las búsquedas locales de dinero y **recibe cero clics**. Esto sube al primer lugar del plan, por encima de las landings.

- [ ] **Google Business Profile a fondo**: categorías correctas, fotos reales, horarios, servicios listados, publicaciones mensuales `(Impacto: Alto · Esfuerzo: Medio · Responsable: Negocio)` — CTR-01
- [ ] **Campaña de reseñas**: pedir reseña a cada cliente al cierre con enlace directo; responder el 100 % de las que hay `(Alto · Bajo · Negocio)` — CTR-01 / LOC-03
- [ ] **Reescribir title y meta de la home** con diferenciador concreto, y medir el CTR a 30 días contra la línea base de hoy (1.3 % en las locales) `(Alto · Bajo · Contenido)` — CTR-01
- [ ] **Agregar "agencia de publicidad" al vocabulario** del sitio: home, listado de servicios y ficha de Google Ads. Son 139 impresiones que te buscan con esa palabra `(Alto · Bajo · Contenido)` — KW-05

## ⚡ Nuevos, tras conectar Search Console (21/08)

- [ ] **Solicitar indexación** de `/servicios/posicionamiento-en-ia` (Search Console → inspeccionar URL → Solicitar indexación). Google todavía no la conoce `(Impacto: Alto · Esfuerzo: Bajo · Responsable: Negocio)` — GEO-07
- [ ] **Reenviar el sitemap** principal (se envió en enero con 35 URLs; hoy tiene 38) `(Medio · Bajo · Negocio)` — IDX-06
- [ ] **Borrar los 2 sitemaps rotos** de `cdn.` e `imagenes.` enviados en enero, que solo generan errores `(Bajo · Bajo · Negocio)` — IDX-06
- [ ] **Consolidar www**: revisar que ningún enlace apunte a `inedito.digital` sin www; solicitar indexación de la versión con www `(Alto · Bajo · Desarrollo)` — IDX-05
- [ ] **Decidir sobre los subdominios de clientes** (`sanasexualidad.`, `crm-dent.`, `hypatiastyle.`): moverlos fuera de la marca o ponerles `noindex` `(Alto · Medio · Negocio)` — GEO-06
- [ ] **Decidir si "marketing de contenidos" es un servicio con nombre propio**: hay 200 impresiones/90d esperando una página `(Medio · Medio · Negocio)` — KW-03
- [ ] **Exportar el informe de Enlaces** a CSV y mandármelo: es lo único que la API no expone `(Alto · Bajo · Negocio)` — OFF-01

## 📅 Primeros 30 días

- [ ] **Fechas en el blog**: publicación y última actualización, visibles y en el schema `(Alto · Bajo · Desarrollo)` — CON-01
- [ ] **Autores reales**: firmar cada artículo con un integrante, enlazando a su página de equipo, y emitir `author` como Person `(Alto · Bajo · Desarrollo + Contenido)` — CON-02
- [ ] **Engordar el HTML para bots** de las 6 plantillas delgadas (nosotros, contacto, servicios-ia, las 3 IA restantes, privacidad) con el contenido que ya está en el CMS (especificación en instrucciones §6) `(Alto · Medio · Desarrollo)` — GEO-02
- [ ] **Preload de la imagen LCP** en render.php `(Alto · Bajo · Desarrollo)` — TEC-01
- [ ] Descargar y **auto-hospedar las 6 imágenes de Unsplash** en WebP con dimensiones (lista en instrucciones §7) `(Medio · Bajo · Desarrollo)` — TEC-05
- [ ] **Rutina de reseñas**: plantilla de solicitud + enlace directo a reseña de GBP, enviada al cierre de cada proyecto; responder el 100 % de las existentes `(Alto · Bajo · Negocio)` — LOC-03
- [ ] Redactar y publicar las **2 primeras piezas del cluster GEO**: "¿Cómo aparecer en ChatGPT?" y "¿Qué es el posicionamiento GEO?" (briefs en instrucciones §8) `(Alto · Medio · Contenido)` — KW/CON-03

## 📅 90 días

- [ ] **Landing "Diseño de páginas web en Aguascalientes"** (brief completo en instrucciones §8.3) `(Alto · Medio · Contenido + Desarrollo)` — KW-01
- [ ] **Landing "Agencia SEO Aguascalientes"** (brief §8.4) `(Alto · Medio · Contenido + Desarrollo)` — KW-01
- [ ] Bloque local en **/servicios/google-ads** `(Medio · Bajo · Contenido)` — KW-01
- [ ] **Partir el bundle JS**: vendor chunk para motion/slick; medir de nuevo con PageSpeed `(Alto · Medio · Desarrollo)` — TEC-01
- [ ] **Ampliar 3 casos del portafolio** con reto → solución → cifras → testimonio (empezar por Ofitodo, que ya tiene el +80 % documentado) `(Alto · Medio · Contenido)` — ARQ-01
- [ ] 4 piezas más del calendario editorial (precios: página web, chatbot, SEO, marketing digital) — son las preguntas de compra que las IAs responden citando rangos `(Alto · Medio · Contenido)` — CON-03
- [ ] **Campaña de enlaces locales, tanda 1**: alta en CANACO Ags, 2 directorios de agencias (Sortlist, Clutch), y propuesta de nota a 2 medios locales `(Alto · Alto · Negocio)` — OFF-01
- [ ] Repetir el **guion GEO** y comparar contra la línea base `(Alto · Bajo · Negocio)` — GEO-04

## 📅 180 días

- [ ] Completar el **calendario editorial** (12 piezas totales del mapa keyword→URL) `(Alto · Alto · Contenido)` — CON-03
- [ ] **Entidad en Wikidata** + unificación de sameAs en todos los perfiles `(Medio · Medio · Negocio + Desarrollo)` — GEO-05
- [ ] **CSP en Report-Only** → activa; HSTS con includeSubDomains cuando los subdominios estén verificados `(Medio · Medio · Desarrollo)` — TEC-04
- [ ] Evaluar **caché de página completa en Cloudflare** para visitantes anónimos `(Medio · Medio · Desarrollo)` — TEC-03
- [ ] Enlaces tanda 2: colaboraciones con cámaras/eventos locales (la experiencia de Expo ya existe como servicio) `(Alto · Alto · Negocio)` — OFF-01
- [ ] Tercera corrida del guion GEO; decidir si el cluster nicho (restaurantes/inmobiliarias) entra al calendario `(Medio · Bajo · Negocio)` — GEO-04

---

## Insumos que debe entregar el cliente

- [ ] Acceso a **Google Search Console** (propiedad inedito.digital) — sin esto no se puede auditar la cobertura real ni pedir la desindexación de las URLs zombis
- [ ] Acceso de lectura a **GA4**
- [ ] Acceso de administrador a **Google Business Profile** — para el NAP y la rutina de reseñas
- [ ] Decisión de negocio: ¿**se sigue ofreciendo creación de logos** como servicio? (define el destino del 301 de `/creacion-de-logo/`)
- [ ] Forma canónica oficial de la **dirección** (¿"Loc 2" o "Local 2"?)
- [ ] **Fotos del equipo** (las páginas de equipo están sin foto) y fotos reales de oficina/trabajo para sustituir Unsplash
- [ ] 10 minutos con quien atiende clientes para recolectar **las preguntas reales que hacen antes de comprar** (alimentan las FAQ de cada servicio)
