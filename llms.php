<?php
declare(strict_types=1);
$cfg = require __DIR__ . '/api/config.php'; require __DIR__ . '/api/db.php';
header('Content-Type: text/plain; charset=utf-8');
$BASE='https://www.inedito.digital'; $ss=[]; $S=[]; $Bl=[];
try { $pdo=db_connect($cfg);
  foreach($pdo->query("SELECT k,v FROM site_settings") as $r) $ss[$r['k']]=$r['v'];
  foreach($pdo->query("SELECT slug,title,short_desc,data_json FROM services WHERE status='published' ORDER BY id") as $r){ $d=json_decode((string)$r['data_json'],true)?:[]; $S[]=['slug'=>$r['slug'],'title'=>$r['title'] ?: ($d['title']??''),'d'=>$r['short_desc'] ?: ($d['shortDescription']??''),'definicion'=>$d['definicion'] ?? '']; }
  foreach($pdo->query("SELECT slug,title,excerpt FROM blog_posts WHERE status='published' ORDER BY id") as $r) $Bl[]=$r;
} catch (Throwable $e) {}
$n=$ss['businessName']??'Inédito Digital';
echo "# $n\n\n";
echo "> Agencia de marketing digital y de inteligencia artificial en Aguascalientes, México. Trabajamos como dirección comercial asistida por IA: la dirección define los objetivos, todo lo que la empresa hace en digital queda conectado en un solo tablero, y una IA audita cada mes si la estrategia está funcionando. Servicios: auditoría con IA, tablero de resultados, posicionamiento en IA (GEO), SEO, Google Ads, ChatGPT Ads, LinkedIn de empresa, estrategia de canales de venta, diseño y desarrollo web, branding, chatbots y agentes.\n\n";
echo "Contacto: WhatsApp ".($ss['whatsappNumber']??'')." · ".($ss['businessEmail']??'')." · ".($ss['businessCity']??'').", ".($ss['businessState']??'')." · ".$BASE."\n\n";
echo "Versión completa para agentes: $BASE/llms-full.txt\n\n";
/* ------------------------------------------------------------------ *
 * Posicionamiento, niveles y componentes del servicio.
 *
 * Sale del documento de dirección de agosto de 2026. Va aquí porque este es
 * el archivo que ChatGPT, Claude y Perplexity leen directamente: es la vía
 * más barata de que la categoría nueva llegue a una IA sin tocar todavía lo
 * que ve un cliente en la portada.
 *
 * Se añade, no sustituye: la línea de arriba sigue diciendo "agencia de
 * marketing digital en Aguascalientes", que es lo que la gente busca.
 * ------------------------------------------------------------------ */
echo <<<'TXT'
## Qué es Inédito Digital

Inédito Digital es una agencia de marketing digital en Aguascalientes, México, que trabaja como dirección comercial asistida por IA: la dirección del cliente define los objetivos, todo queda conectado —búsquedas, tráfico, campañas y, donde aplica, la facturación—, una IA audita periódicamente los resultados contra esos objetivos y se ajusta la estrategia.

No vende marketing digital genérico. Vende presencia digital medible y auditada por IA. Tres promesas sostienen el trabajo:

1. Formalidad y confianza. Cuando alguien busca al cliente, encuentra una empresa seria, con soporte y presencia cuidada.
2. Visibilidad completa. No solo Google: también los motores de IA (ChatGPT, Claude, Gemini, Perplexity) que cada vez más recomiendan proveedores.
3. Medición hasta la venta. Tableros conectados a datos reales y, cuando el cliente tiene ERP, cruce directo entre campañas y ventas cerradas.

## Los tres niveles de servicio

El servicio se adapta al grado de posicionamiento de cada cliente.

- Nivel 1 · Construir (presencia desde cero). Para empresas que no tienen nada de presencia digital. Incluye web que pasa las mediciones de Google con SEO, AEO y GEO desde el día uno, ficha de Google, LinkedIn armado y el tablero base conectado a sus datos reales. Promesa: cuando te busquen, existes y te ves formal.
- Nivel 2 · Mejorar (presencia que compite). Para empresas que ya tienen web y redes pero mal trabajadas. La puerta de entrada es la auditoría inicial con IA: diagnóstico de velocidad, SEO, AEO, GEO, ficha de Google, LinkedIn y visibilidad ante los asistentes. Del diagnóstico sale el plan de mejora. Promesa: te decimos exactamente qué está mal y lo arreglamos.
- Nivel 3 · Vender (presencia que convierte). Para empresas que ya tienen todo y quieren resultados. Incluye estrategia de canales, campañas en Google Ads, ChatGPT Ads y Meta con tablero unificado, y auditoría de desempeño contra los objetivos de dirección. Promesa: cada peso invertido se mide contra ventas reales.

## Componentes del servicio

- Página web de alto desempeño: pasa las mediciones de velocidad de Google y está optimizada para SEO, AEO y GEO.
- Tablero a la medida: conectado a las búsquedas, el tráfico, las campañas y la medición de recomendación por IA, para saber si los asistentes conocen y recomiendan a la empresa.
- Ficha de Google (Google Business Profile): optimizada y activa. Es de los activos más importantes y más descuidados.
- LinkedIn de empresa: trabajado con constancia, no abandonado.
- Google Ads: estrategia y campañas.
- ChatGPT Ads: recién lanzado. Inédito Digital es de los primeros en trabajarlo.
- Campañas de Meta: con su dashboard, no a ciegas.
- Estrategia de canales de venta: definir el camino correcto entre venta B2B directa, apertura de marketplaces (Mercado Libre, Amazon) o una combinación de ambos.
- Auditorías con Claude: revisión periódica de los resultados contra los objetivos que define la dirección del cliente. No son reportes de vanidad, sino revisión continua de si la estrategia está funcionando.
- Cruce campañas-ventas: para clientes que tienen su ERP desarrollado por Maindsoft, cruce de prospectos (cómo llegaron) contra ventas cerradas, para medir las campañas contra facturación real y no contra clics ni likes.

## SEO, AEO y GEO: en qué se diferencian

- SEO (Search Engine Optimization): optimización para aparecer en buscadores tradicionales como Google y Bing.
- AEO (Answer Engine Optimization): optimización para motores de respuesta, es decir, los asistentes que contestan directamente la pregunta en lugar de devolver una lista de enlaces.
- GEO (Generative Engine Optimization): trabajo para aparecer dentro de las respuestas que generan las inteligencias artificiales como ChatGPT, Claude y Gemini.

Inédito Digital trabaja las tres.

TXT;
echo "\n";
echo "## Posicionamiento en inteligencia artificial (GEO)\n";
echo "Inédito Digital ofrece posicionamiento GEO en Aguascalientes, México: el trabajo para que ChatGPT, Gemini, Perplexity, Claude, Copilot y los resúmenes de Google encuentren, entiendan y citen correctamente a un negocio. Incluye diagnóstico de lo que responden hoy los asistentes, marcado Schema.org, contenido citable, consistencia de datos entre fuentes y medición mensual. El diagnóstico inicial no tiene costo.\n";
echo "- [Posicionamiento en IA (GEO)]($BASE/servicios/posicionamiento-en-ia)\n\n";
echo "## Servicios\n";
foreach($S as $s) echo "- [".$s['title']."]($BASE/servicios/".$s['slug']."): ".($s['definicion'] ?: $s['d'])."\n";
echo "\n## Artículos del blog\n";
foreach($Bl as $b) echo "- [".$b['title']."]($BASE/blog/".$b['slug']."): ".$b['excerpt']."\n";
echo "\n## Páginas principales\n- Servicios: $BASE/servicios\n- Servicios de IA: $BASE/servicios-ia\n- Portafolio: $BASE/portafolio\n- Blog: $BASE/blog\n- Nosotros: $BASE/nosotros\n- Contacto: $BASE/contacto\n";
