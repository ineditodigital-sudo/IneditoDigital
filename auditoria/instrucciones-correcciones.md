# Instrucciones de corrección · inedito.digital · Agosto 2026

> **Para quién:** un desarrollador o un agente de código con acceso al repo y al FTP. Todo el código es final: copiar, pegar, desplegar. El stack es el descrito en la Fase 0: SPA React servida por `render.php`, `.htaccess` de Apache/LiteSpeed, CMS propio (`panel/inc/contenido.php` declara los campos).
>
> **Orden de ejecución recomendado:** §1 (301) → §2 (robots) → §5 (schema) → §4 (titles) → §3 (llms-full) → §6 (HTML bots) → §7 (imágenes) → §8 (contenido nuevo). Los §1–5 caben en una sola sesión de trabajo.

---

## §1 · Redirecciones 301 de las URLs del WordPress viejo — IDX-01 🔴

**Dónde:** `.htaccess`, dentro del bloque `<IfModule mod_rewrite.c>` existente, DESPUÉS de la regla del sitemap y ANTES de la regla final que manda todo a `/render.php`.

```apache
  # ---- 301: URLs del sitio WordPress anterior (auditoría IDX-01) ----
  RewriteRule ^diseno-y-desarrollo-web/?$ /servicios/diseno-y-desarrollo-web [R=301,L]
  RewriteRule ^paginas-web/?$ /servicios/diseno-y-desarrollo-web [R=301,L]
  RewriteRule ^posicionamiento-organico/?$ /servicios/posicionamiento-organico [R=301,L]
  RewriteRule ^tarjetas-digitales/?$ /servicios/tarjetas-de-presentacion-digital [R=301,L]
  RewriteRule ^ofitodo-posicionamiento-en-ventas-digitales-gracias-a-inedito-digital/?$ /portafolio/ofitodo [R=301,L]
  RewriteRule ^casos-de-exito(/.*)?$ /portafolio [R=301,L]
  RewriteRule ^alaman/?$ /portafolio [R=301,L]
  RewriteRule ^apps/?$ /servicios [R=301,L]
  RewriteRule ^espacios-publicitarios(-.*)?/?$ / [R=301,L]
  # Pendiente decisión de negocio (checklist): si el servicio de logos sigue,
  # crear su ficha y apuntar aquí; mientras tanto, al listado de servicios.
  RewriteRule ^creacion-de-logo/?$ /servicios [R=301,L]
```

**Criterio de aceptación:** `curl -sI https://www.inedito.digital/paginas-web/` devuelve `301` con `Location: https://www.inedito.digital/servicios/diseno-y-desarrollo-web`. Repetir para las 10 rutas. Verificar que `/` y `/servicios` siguen en 200.
**Después:** en Search Console (cuando haya acceso), validar la corrección en el informe de cobertura.

---

## §2 · robots.txt final — GEO-01 🟢

**Dónde:** reemplazar `public/robots.txt` (se despliega con `deploy.sh`).
**Decisión aplicada:** permitir todos los bots que dan visibilidad en respuestas de IA; permitir también los de solo-entrenamiento (la marca gana estando en los corpus; no hay contenido de pago que proteger); mantener bloqueados panel y api para todos.

```
# Inédito Digital — robots.txt
User-agent: *
Allow: /
Disallow: /panel/
Disallow: /api/

# Crawlers de IA (bienvenidos — GEO)
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Amazonbot
Allow: /
User-agent: meta-externalagent
Allow: /
User-agent: Bytespider
Allow: /
User-agent: CCBot
Allow: /

Sitemap: https://www.inedito.digital/sitemap.xml
```

**Criterio de aceptación:** `curl -s https://www.inedito.digital/robots.txt` muestra el archivo nuevo; el validador de robots de Search Console no marca errores.

---

## §3 · llms-full.txt — GEO-03 🟡

**Dónde:** nuevo archivo `llms-full.php` en la raíz del proyecto (junto a `llms.php`), más una regla en `.htaccess` junto a la existente de `llms.txt`:

```apache
  RewriteRule ^llms-full\.txt$ /llms-full.php [L]
```

```php
<?php
/**
 * llms-full.txt — la versión extendida para agentes de IA.
 * Mismo esqueleto que llms.php pero con el contenido completo:
 * cada servicio con sus puntos, las preguntas frecuentes de GEO,
 * los casos del portafolio con sus cifras y los datos de contacto.
 */
declare(strict_types=1);
$cfg = require __DIR__ . '/api/config.php'; require __DIR__ . '/api/db.php';
header('Content-Type: text/plain; charset=utf-8');
$BASE = 'https://www.inedito.digital';
$ss = []; $S = []; $Bl = []; $P = []; $geo = [];
try {
  $pdo = db_connect($cfg);
  foreach ($pdo->query("SELECT k,v FROM site_settings") as $r) $ss[$r['k']] = $r['v'];
  foreach ($pdo->query("SELECT slug,title,short_desc,features,benefits FROM services WHERE status='published' ORDER BY id") as $r) $S[] = $r;
  foreach ($pdo->query("SELECT slug,title,excerpt,content FROM blog_posts WHERE status='published' ORDER BY id") as $r) $Bl[] = $r;
  foreach ($pdo->query("SELECT slug,title,short_desc,data_json FROM portfolio WHERE status='published' ORDER BY id") as $r) $P[] = $r;
  $q = $pdo->query("SELECT contenido FROM pages WHERE slug='posicionamiento-ia' AND status='published'");
  $geo = json_decode((string)$q->fetchColumn(), true) ?: [];
} catch (Throwable $e) {}

$n = $ss['businessName'] ?? 'Inédito Digital';
echo "# $n — información completa\n\n";
echo "> Agencia de marketing digital en Aguascalientes, México (Jardines Eternos 902-Local 2, Panorama, CP 20040). ";
echo "Diseño y desarrollo web, SEO, posicionamiento en inteligencias artificiales (GEO), Google Ads, chatbots y agentes de IA, e-commerce y tarjetas de presentación NFC.\n\n";
echo "Contacto: WhatsApp " . ($ss['whatsappNumber'] ?? '') . " · " . ($ss['businessEmail'] ?? '') . " · Horario: " . ($ss['businessHours'] ?? '') . "\n\n";

echo "## Servicios (detalle)\n\n";
foreach ($S as $s) {
  echo "### " . $s['title'] . "\n";
  echo $BASE . "/servicios/" . $s['slug'] . "\n";
  if ($s['short_desc']) echo $s['short_desc'] . "\n";
  foreach (array_filter(array_map('trim', explode("\n", (string)$s['features']))) as $f) echo "- $f\n";
  echo "\n";
}

echo "## Posicionamiento en IA (GEO) — preguntas frecuentes\n\n";
$faq = $geo['preguntas'] ?? [];
for ($i = 1; $i <= 12; $i++) {
  if (empty($faq["q$i"]) || empty($faq["r$i"])) continue;
  echo "### " . $faq["q$i"] . "\n" . $faq["r$i"] . "\n\n";
}

echo "## Casos de éxito\n\n";
foreach ($P as $p) {
  echo "### " . $p['title'] . "\n" . $BASE . "/portafolio/" . $p['slug'] . "\n";
  if ($p['short_desc']) echo $p['short_desc'] . "\n";
  echo "\n";
}

echo "## Artículos\n\n";
foreach ($Bl as $b) {
  echo "### " . $b['title'] . "\n" . $BASE . "/blog/" . $b['slug'] . "\n";
  if ($b['excerpt']) echo $b['excerpt'] . "\n";
  echo "\n";
}
```

**Además:** en `llms.php`, añadir al final del encabezado: `echo "Versión completa: $BASE/llms-full.txt\n\n";`
**Criterio de aceptación:** `curl -s https://www.inedito.digital/llms-full.txt | head -30` muestra el encabezado y el primer servicio con sus puntos; responde `Content-Type: text/plain`.

---

## §3.5 · Preload de la imagen LCP — TEC-01 🟠

**Dónde:** `render.php`, en el `<head>`, antes de la hoja de estilos. La imagen del hero es la primera del mosaico de la portada (editable en el panel; valor actual):

```php
<?php if ($path === '/'): ?>
<link rel="preload" as="image"
      href="https://imagenes.inedito.digital/INEDITO%20DIGITAL/feature-1-1.webp"
      fetchpriority="high" />
<?php endif; ?>
```

*(Si el cliente cambia la foto 1 del mosaico en el panel, leer el valor desde `$paginas['home']['contenido']['bento']['img_1']` en lugar del literal.)*

Para la segunda parte de TEC-01 (partir el bundle): en `vite.config.ts`, `build.rollupOptions.output.manualChunks` separando `motion` y `react-slick` en un chunk `vendor-anim`. Medir antes y después con PageSpeed.

**Criterio de aceptación:** el HTML de `/` contiene el `<link rel="preload">`; PageSpeed reporta mejora de LCP móvil respecto a la línea base tomada en la checklist.

---

## §4 · Titles y metas finales — ONP-01/02 🟡

Se cambian **desde el panel** (Páginas → sección "Cómo se ve al compartir" de cada página) o en los campos SEO correspondientes. Textos finales:

| URL | Title nuevo (≤60) | Meta description nueva (140–160) |
|---|---|---|
| `/` | `Agencia de Marketing Digital con IA en Aguascalientes` *(54)* | `Diseño web, SEO, Google Ads y soluciones de inteligencia artificial para hacer crecer tu negocio en Aguascalientes. Cotiza gratis por WhatsApp.` *(146)* |
| `/servicios/posicionamiento-en-ia` | `Posicionamiento GEO en Aguascalientes \| Inédito` *(48)* | *(la actual, 155, se queda)* |
| `/blog/como-mejorar-seo-local-aguascalientes` | `SEO Local en Aguascalientes: Guía 2026 \| Inédito` *(48)* | *(la actual, 142, se queda)* |
| `/portafolio/ofitodo` | `OFITODO: +80 % de tráfico orgánico \| Caso de éxito` *(50)* | `Cómo Inédito Digital aumentó 80 % el tráfico orgánico de OFITODO con SEO y desarrollo web. Lee el caso completo con estrategia y resultados.` *(139)* |
| `/blog` | *(el actual, 43, se queda)* | `Guías de marketing digital, SEO, posicionamiento en IA y ventas para negocios de Aguascalientes. Escritas por el equipo de Inédito Digital.` *(138)* |
| `/servicios-ia/whatsapp` | *(el actual, 34, se queda)* | `Un agente de IA que atiende tu WhatsApp 24/7: responde, califica clientes y agenda ventas mientras duermes. Implementación en Aguascalientes.` *(141)* |
| `/armando-trejo` | *(el actual se queda)* | `Contacto directo de Armando Trejo, Director Creativo de Inédito Digital en Aguascalientes: WhatsApp, teléfono, redes y agenda.` *(126)* |

**Criterio de aceptación:** `curl -s <url> | grep -o '<title>[^<]*'` devuelve el texto nuevo con la longitud indicada.

---

## §5 · Schema: geo, horarios y WebSite — LOC-02 🟠

**Dónde:** `render.php`, en el bloque donde se arma el JSON-LD global de `ProfessionalService`. Añadir estas claves al arreglo existente (los datos de dirección ya salen de `site_settings`; las coordenadas son de la dirección Jardines Eternos 902, Panorama — verificar contra el pin real de GBP antes de publicar):

```php
$schemaNegocio['geo'] = [
  '@type' => 'GeoCoordinates',
  // Pin real, extraido del enlace de Maps guardado en Ajustes.
  'latitude'  => 21.8896517,
  'longitude' => -102.3165204,
];
$schemaNegocio['openingHoursSpecification'] = [[
  '@type'     => 'OpeningHoursSpecification',
  'dayOfWeek' => ['Monday','Tuesday','Wednesday','Thursday','Friday'],
  'opens'     => '09:00',
  'closes'    => '18:00',
]];
$schemaNegocio['priceRange'] = '$$';
```

Y en la home, además del bloque anterior, emitir:

```php
$schema[] = [
  '@context' => 'https://schema.org',
  '@type'    => 'WebSite',
  'name'     => 'Inédito Digital',
  'url'      => 'https://www.inedito.digital',
  'inLanguage' => 'es-MX',
];
```

*(No se emite `SearchAction` porque el sitio no tiene buscador interno público: declararlo sin que funcione es peor que omitirlo. No se emite `aggregateRating` hasta tener acceso a GBP: no se inventan calificaciones.)*

**Criterio de aceptación:** la prueba de resultados enriquecidos de Google (search.google.com/test/rich-results) sobre `/` valida sin errores y muestra LocalBusiness con geo y horarios.

---

## §6 · HTML para bots en las 6 plantillas delgadas — GEO-02 🟠

**Dónde:** `render.php`. Cada ruta ya tiene un `$bodyBuilder`; hay que extenderlos leyendo el contenido que **ya está** en `$paginas[<slug>]['contenido']` (el CMS). Especificación por página (el contenido existe, solo hay que volcarlo):

| Ruta | Slug CMS | Qué volcar al HTML (mínimo 150 palabras) |
|---|---|---|
| `/nosotros` | `nosotros` | misión y visión completas, los 4 valores con su texto, las 3 cifras, y el bloque "por qué elegirnos" |
| `/contacto` | `contacto` | dirección completa, teléfono, WhatsApp, correo, horario, y el enlace de Maps como texto |
| `/servicios-ia` | `servicios-ia` | las 4 tarjetas de solución con título+subtítulo+descripción, las 4 cifras y las 3 razones |
| `/servicios-ia/whatsapp` (y ventas, marketing, ecommerce) | `servicios-ia-*` | beneficios (título+descripción), qué incluye (los puntos), cómo funciona (los 4 pasos), ideal para |
| `/privacidad` y `/terminos` | `privacidad`/`terminos` | los apartados completos (título+texto+puntos) que ya viven en la sección `apartados` |

Patrón a seguir: el mismo que ya usa la página GEO (`/servicios/posicionamiento-en-ia`), que entrega 712 palabras y 12 encabezados — ese `$bodyBuilder` sirve de plantilla.

**Criterio de aceptación:** `curl -s -A "GPTBot" <url> | grep -o '<main>.*</main>'` supera 150 palabras en cada una de las 8 rutas (medir con el mismo script de la auditoría).

---

## §7 · Imágenes: sustituir Unsplash — TEC-05 🟡

Las 6 referencias están en los campos `imagenes` de las páginas IA y de la plantilla de servicio (editables desde el panel). Proceso:

1. Descargar cada imagen actual (las URLs están en el panel, sección "Imágenes de la página" de cada página IA).
2. Convertir: WebP, calidad 80, ancho máx 1080 px. Nombrarlas descriptivo: `chatbot-whatsapp-inedito.webp`, `equipo-trabajando-aguascalientes.webp`, etc.
3. Subirlas a `imagenes.inedito.digital` (mismo bucket que el resto).
4. Pegar las URLs nuevas en el panel (Páginas → IA para WhatsApp → Imágenes de la página, etc.).
5. **Mejor aún:** cuando haya fotos reales de oficina/equipo (insumo pedido en checklist), usar esas — una IA que describa la agencia con fotos genéricas de stock aporta menos que una con fotos propias.

**Criterio de aceptación:** `grep -r "images.unsplash.com" src/` devuelve 0 tras re-sembrar los valores por defecto, y las páginas cargan las imágenes nuevas.

---

## §8 · Contenido nuevo: briefs completos

### 8.1 `/blog/como-aparecer-en-chatgpt` — pieza pilar GEO
- **Keyword:** como aparecer en chatgpt · **Intención:** informacional (antesala del servicio)
- **Estructura:** H1 "¿Cómo aparecer en ChatGPT? Guía para negocios (2026)" → respuesta directa en las primeras 50 palabras (sí se puede influir, no se puede "pagar por salir") → H2 "¿De dónde saca ChatGPT sus respuestas?" → H2 "Los 5 factores que deciden si te cita" (datos verificables, consistencia, schema, contenido citable, autoridad) → H2 "¿Qué NO funciona?" (desmontar mitos: no hay reentrenamiento) → H2 en pregunta "¿Cuánto tarda?" → FAQ (3 preguntas) → CTA al diagnóstico gratuito.
- **Brief:** 250 palabras que expliquen el mecanismo real (los asistentes consultan la web y fuentes verificables; ordenar esas fuentes cambia las respuestas), con el diagnóstico gratuito de Inédito como siguiente paso natural. Tono del sitio: directo, sin humo. Enlaza a `/servicios/posicionamiento-en-ia` con ancla "posicionamiento GEO en Aguascalientes".

### 8.2 `/blog/que-es-posicionamiento-geo`
- **Keyword:** que es geo marketing digital · Definicional puro: la definición en las primeras 40 palabras, tabla GEO vs SEO, para quién sirve, cómo se mide. FAQ con "¿GEO reemplaza al SEO?" (no: se suman). Enlaza al servicio y a 8.1.

### 8.3 Landing `/servicios/diseno-web-aguascalientes` — KW-01 🟠
- **Keyword:** diseño de páginas web aguascalientes · **Intención:** transaccional+local
- **Estructura:** H1 "Diseño de Páginas Web en Aguascalientes" → respuesta directa (qué entregan, en cuánto tiempo, desde qué alcance) → H2 "Sitios que venden, no adornos" (3 diferenciales con el enfoque IA/SEO de la casa) → H2 "Casos en Aguascalientes" (Ofitodo +80 %, 2 más del portafolio con cifra) → H2 "¿Cuánto cuesta una página web?" (rangos honestos por alcance — las IAs citan rangos) → H2 "Cómo trabajamos" (4 pasos) → FAQ 5 preguntas locales ("¿trabajan con negocios de todo Aguascalientes?", "¿la puedo editar yo?") → CTA WhatsApp.
- **Nota técnica:** darla de alta como página con FAQPage + Service + areaServed City Aguascalientes, en sitemap con 0.9, enlazada desde el menú de Servicios y desde la ficha genérica de diseño web (ancla exacta: "diseño de páginas web en Aguascalientes").

### 8.4 Landing `/servicios/seo-aguascalientes` — KW-01 🟠
- **Keyword:** agencia seo aguascalientes · misma receta que 8.3. Diferenciador central: "SEO + GEO: te posicionamos en Google y en las respuestas de la IA" — ningún competidor local puede decirlo. Cifras del caso Ofitodo. FAQ con "¿cuánto tarda el SEO?", "¿garantizan primer lugar?" (no, y por qué desconfiar de quien sí). Enlace cruzado con `/servicios/posicionamiento-organico` (la ficha explica el servicio; la landing captura la búsqueda local).

### 8.5 Serie "cuánto cuesta" (4 piezas: página web, chatbot, SEO, marketing digital)
- Formato idéntico: respuesta con rango real en las primeras 50 palabras → tabla de rangos por alcance → qué lo encarece/abarata → 3 señales de presupuesto inflado → FAQ → CTA. Son las piezas que más citan los asistentes al responder precios; quien da el rango se lleva la cita.

### 8.6 Fechas y autores en el blog (CON-01 + CON-02, técnica)
1. En `blog_posts` usar los campos de fecha existentes (o añadir `published_at`/`updated_at` si faltan).
2. `render.php`, en el `BlogPosting`: `datePublished` y `dateModified` en ISO 8601, y `author` → `['@type' => 'Person', 'name' => <integrante>, 'url' => 'https://www.inedito.digital/<slug-del-integrante>']`.
3. Mostrar la fecha visible bajo el título del artículo ("Publicado … · Actualizado …").
4. En la página de cada artículo, firma con enlace a la página del integrante.

**Criterio de aceptación global de §8:** cada pieza nueva responde su pregunta en las primeras 50 palabras (leer el primer párrafo aislado: ¿se entiende sin el resto?), lleva FAQPage, fecha visible y autor Person, y está enlazada desde al menos 2 páginas existentes con ancla descriptiva.

---

## Verificación final de toda la tanda

```bash
# 1. Los 301 responden
for u in paginas-web diseno-y-desarrollo-web posicionamiento-organico tarjetas-digitales creacion-de-logo apps alaman; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://www.inedito.digital/$u/"
done
# 2. llms-full existe
curl -s -o /dev/null -w "%{http_code}\n" https://www.inedito.digital/llms-full.txt
# 3. El schema valida (manual): search.google.com/test/rich-results sobre /
# 4. Contenido para bots (debe superar 150 palabras por página)
for u in /nosotros /contacto /servicios-ia /servicios-ia/whatsapp /privacidad; do
  echo "$u: $(curl -s -A GPTBot https://www.inedito.digital$u | sed 's/<[^>]*>/ /g' | wc -w) palabras aprox"
done
```
