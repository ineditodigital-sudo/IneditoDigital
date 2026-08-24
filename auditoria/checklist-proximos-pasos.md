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

## 🚨 LO PRIMERO DE TODO (21/08, tras ver el informe de cobertura)

> 21 de 38 páginas del sitemap están fuera del índice de Google, y 18 nunca fueron rastreadas. Media web no compite porque Google no la ha visitado.

- [ ] **Reenviar el sitemap** en Search Console → Sitemaps → escribir `sitemap.xml` → Enviar. Se envió en enero y no se ha vuelto a mandar `(Impacto: Alto · Esfuerzo: Bajo · Responsable: Negocio)` — IDX-07
- [ ] **Solicitar indexación manual**, ~10 al día, en este orden: `/nosotros`, `/servicios-ia`, `/servicios/posicionamiento-en-ia`, `/portafolio/ofitodo`, `/servicios/google-ads`, `/servicios-ia/whatsapp`, `/servicios-ia/ventas`, `/servicios/chatbots-y-agentes`, `/blog/como-mejorar-seo-local-aguascalientes`, `/armando-trejo` `(Alto · Bajo · Negocio)` — IDX-07
- [x] ~~**Exportar el detalle de las 404**~~ — **Resuelto sin ti el 21/08.** Search Console no lo da por API, pero sí da la dimensión `page` de rendimiento: pidiéndole las URLs que aún muestra en resultados y comprobando el código real de cada una salieron **44 en 404, con 4.696 impresiones y 41 clics** cayendo en un error. **43 ya redirigen** y están verificadas una por una — IDX-08
- [ ] **Los 2 URLs con 403 siguen pendientes**: no tienen impresiones, así que el método anterior no las ve. Search Console → Indexación → Páginas → "Prohibido (403)" → Exportar. Impacto bajo: sin impresiones, no pierden tráfico `(Bajo · Bajo · Negocio)` — IDX-09
- [ ] **Decidir qué hacer con cuatro servicios que la gente busca y no existen** en el sitio: espacios publicitarios / Feria de San Marcos (1.452 impresiones), producción audiovisual (813 impresiones y **15 clics**, la URL rota con más clics de todas), desarrollo de apps (222) y redes sociales (63). Son 2.734 impresiones y 28 clics: el 9% de todo el tráfico del sitio. Si se ofrecen, merecen ficha propia; si no, mejor saberlo `(Alto · Medio · Negocio)` — SRV-01
- [ ] **Sustituir las fotos de banco.** Hay 73 imágenes de Unsplash en el sitio; 4 de ellas son 546 kB de los 781 kB de la home, el 70% del peso. Se cambian desde el panel sin tocar código, y una agencia de diseño con fotos de catálogo se vende peor `(Medio · Medio · Negocio)` — IMG-04
- [ ] **Avisar a Ofitodo**: su subdominio tiene 9 URLs en 404, una con 598 impresiones. Cuelga de inedito.digital, así que esos errores cuentan como del dominio `(Bajo · Bajo · Negocio)` — SUB-01
- [ ] **Crear una clave de API de PageSpeed** en el proyecto de Google que ya existe: Cloud Console → APIs y servicios → Credenciales → Crear credenciales → Clave de API. Con eso se automatiza la medición de velocidad igual que ya se hace con Search Console `(Medio · Bajo · Negocio)` — TEC-01
- [x] ~~**Exportar el informe de Enlaces**~~ — **Hecho el 24/08.** Resultado: **14 dominios**, de los que ~10 son del propio grupo (feriasanmarcos.mx 41%, maindsoft.net 35%, Play Store 15%). Todos los relevantes son enlaces de plantilla (pies de página y créditos de «hecho por»). **Un solo enlace editorial de un tercero independiente en dos años** — OFF-01
- [ ] **Escribir la nota de prensa de la Feria Nacional de San Marcos** y ofrecerla a medios locales. Inédito hizo el sitio y la app oficial de uno de los eventos más grandes de México y no hay ni una nota que lo cuente. Es la historia más publicable que tiene la agencia, y es gratis `(Alto · Bajo · Negocio)` — OFF-04
- [ ] **Darse de alta en cámaras**: CANACO Aguascalientes, COPARMEX, CANIETI. Las fichas de socio suelen ser páginas indexadas con enlace, y son de las pocas fuentes locales con revisión editorial `(Medio · Bajo · Negocio)` — OFF-05
- [ ] **Pedir a los clientes que publiquen el proyecto como noticia suya.** Hoy los casos de éxito los cuenta solo Inédito. Que los cuente el cliente en su propia sala de prensa sí es un enlace editorial `(Medio · Medio · Negocio)` — OFF-06
- [ ] **No quitar los créditos de pie de los sitios de clientes.** No son tóxicos y no hay riesgo de penalización; simplemente no construyen autoridad. El error sería seguir contando con ellos `(— · — · Nota)` — OFF-01

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
