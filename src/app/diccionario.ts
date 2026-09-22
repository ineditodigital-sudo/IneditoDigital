/*
 * El sitio en inglés.
 *
 * La llave es el texto en español TAL COMO está en el código, porque cada
 * llamada a contenido() ya lo lleva como respaldo. Así no hubo que tocar
 * quinientas llamadas ni inventar claves: la lista de respaldos era la lista
 * de lo que había que traducir.
 *
 * Lo que no esté aquí se lee en español. Es a propósito: una frase sin traducir
 * se entiende, y un hueco o una clave cruda —«header.nav.home»— no.
 *
 * Cuidado con los titulares partidos en dos. Varias secciones se arman como
 * {t('titulo_1','CÓMO')} {t('titulo_2','FUNCIONA')}, y la misma primera mitad
 * sirve para «CÓMO FUNCIONA» y para «CÓMO TRABAJAMOS». Por eso los fragmentos
 * se traducen de modo que cualquier combinación real siga siendo gramatical:
 * CÓMO→HOW, FUNCIONA→IT WORKS, TRABAJAMOS→WE WORK.
 *
 * Ortografía estadounidense (optimization, behavior, catalog): el inglés de
 * este sitio es para clientes de Estados Unidos, no de Londres.
 *
 * No están las URLs, las rutas ni las cifras (24/7, 10x, 100%, 5X): traducirlas
 * no significa nada y meterlas solo daría ocasión de romperlas.
 *
 * Ojo con el alcance: esto traduce lo que vive en el código. El cuerpo de los
 * servicios y los artículos del blog viven en la base de datos y necesitan su
 * propia pasada de contenido.
 */

export const DICCIONARIO: Record<string, string> = {
  /* ── menú y navegación ─────────────────────────────────────────────── */
  'Inicio': 'Home',
  'Portafolio': 'Portfolio',
  'Nosotros': 'About',
  'Contacto': 'Contact',
  'Servicios': 'Services',
  'Servicios IA': 'AI Services',
  'COTIZAR': 'GET A QUOTE',
  'COTIZAR AHORA': 'GET A QUOTE',
  'INÉDITO DIGITAL - Agencia de Marketing Digital en Aguascalientes':
    'INÉDITO DIGITAL - Digital Marketing Agency in Aguascalientes',
  'Ver todos los servicios': 'See all services',
  'Ver más detalles': 'See details',
  'Ver detalles': 'See details',
  'Ver más': 'See more',
  'Conocer más': 'Learn more',
  'Leer más': 'Read more',
  'Volver al blog': 'Back to the blog',
  'Volver a servicios': 'Back to services',
  'Volver a Servicios IA': 'Back to AI Services',
  'Volver al portafolio': 'Back to the portfolio',
  'Construir, mejorar o vender: el servicio se adapta a tu punto de partida':
    'Build, improve or sell: the service adapts to where you are starting from',
  'Niveles de servicio: construir, mejorar y vender':
    'Service levels: build, improve and sell',

  /*
   * Fragmentos de titular. Se combinan entre sí, así que cada uno tiene que
   * funcionar con todos los que le pueden tocar al lado.
   */
  'QUÉ': 'WHAT',
  'INCLUYE': 'YOU GET',           // QUÉ + INCLUYE  → WHAT YOU GET
  'HACEMOS': 'WE DO',             // QUÉ + HACEMOS  → WHAT WE DO
  'CÓMO': 'HOW',
  'FUNCIONA': 'IT WORKS',         // CÓMO + FUNCIONA    → HOW IT WORKS
  'TRABAJAMOS': 'WE WORK',        // CÓMO + TRABAJAMOS  → HOW WE WORK
  'CÓMO FUNCIONA': 'HOW IT WORKS',
  'CÓMO TRABAJAMOS': 'HOW WE WORK',
  'BENEFICIOS': 'KEY',
  'PRINCIPALES': 'BENEFITS',      // BENEFICIOS + PRINCIPALES → KEY BENEFITS
  'IDEAL': 'BUILT',
  'PARA': 'FOR',                  // IDEAL + PARA → BUILT FOR
  'PREGUNTAS': 'COMMON',
  'FRECUENTES': 'QUESTIONS',      // PREGUNTAS + FRECUENTES → COMMON QUESTIONS
  'LO QUE': 'WHAT YOU',
  'GANAS': 'GAIN',
  'EL': 'THE',
  'CATÁLOGO': 'CATALOG',
  'EL FONDO': 'THE FULL',
  'DEL ASUNTO': 'STORY',
  'NUESTRO': 'OUR',
  'PROCESO': 'PROCESS',
  'NUESTROS': 'OUR',
  'SERVICIOS': 'SERVICES',
  'SOBRE': 'ABOUT',
  'NOSOTROS': 'US',
  'CASOS DE': 'CASE',
  'ÉXITO': 'STUDIES',
  'DÓNDE': 'WHERE',
  'TE BUSCAMOS': 'WE LOOK FOR YOU',
  'LO QUE CAMBIA': 'WHAT CHANGES',
  'EN LA RESPUESTA': 'IN THE ANSWER',
  'Para qué sirve, en concreto.': 'What it is for, concretely.',
  'Proceso comprobado': 'Proven process',
  'Implementación acompañada': 'Guided implementation',
  '¿LISTO PARA': 'READY TO',
  'COMENZAR?': 'START?',
  '¿LISTO PARA AUTOMATIZAR?': 'READY TO AUTOMATE?',
  '¿LISTO PARA TU': 'READY FOR YOUR',
  'CASO DE ÉXITO?': 'OWN CASE STUDY?',
  'Cotiza este servicio y descubre cómo puede transformar tu negocio':
    'Get a quote and see what this can do for your business',
  'AGENDAR CONSULTORÍA': 'BOOK A CONSULTATION',
  'AGENDAR CONSULTA GRATIS': 'BOOK A FREE CONSULTATION',
  'CONSULTORÍA GRATUITA': 'FREE CONSULTATION',

  /* ── menú de IA ────────────────────────────────────────────────────── */
  'Posicionamiento en IA': 'AI Visibility',
  'Que ChatGPT te recomiende': 'Get recommended by ChatGPT',
  'IA para WhatsApp': 'AI for WhatsApp',
  'Ventas y Soporte 24/7': 'Sales and support, 24/7',
  'IA de Ventas': 'AI for Sales',
  'Prospección Inteligente': 'Smarter prospecting',
  'IA para Marketing': 'AI for Marketing',
  'Optimización Automática': 'Automatic optimization',
  'IA para E-commerce': 'AI for E-commerce',
  'Convierte Más Visitas': 'Convert more visits',

  /* ── portada de servicios de IA ────────────────────────────────────── */
  'SERVICIOS DE INTELIGENCIA ARTIFICIAL': 'ARTIFICIAL INTELLIGENCE SERVICES',
  'INTELIGENCIA ARTIFICIAL': 'ARTIFICIAL INTELLIGENCE',
  'SERVICIOS DE': 'SERVICES POWERED BY',   // + INTELIGENCIA ARTIFICIAL
  'QUE HACE CRECER TU NEGOCIO': 'THAT GROWS YOUR BUSINESS',
  'Disponibilidad': 'Availability',
  'Más Eficiencia': 'More efficiency',
  'Ahorro en Costos': 'Cost savings',
  'Automatizado': 'Automated',
  'SOLUCIONES IA': 'AI SOLUTIONS',
  'PARA CADA ÁREA': 'FOR EVERY AREA',
  'Selecciona el servicio ideal para tu negocio y empieza a automatizar hoy mismo':
    'Pick the right service for your business and start automating today',
  '¿POR QUÉ': 'WHY',
  'INTELIGENCIA ARTIFICIAL?': 'ARTIFICIAL INTELLIGENCE?',
  'Velocidad': 'Speed',
  'Respuestas instantáneas, 24/7. Sin esperas, sin horarios, sin días festivos.':
    'Instant answers, 24/7. No queues, no office hours, no holidays.',
  'Escalabilidad': 'Scale',
  'Atiende a 1 o 10,000 clientes simultáneamente sin aumentar tu equipo.':
    'Handle 1 or 10,000 customers at once without growing your team.',
  'Precisión': 'Precision',
  'Análisis de datos en tiempo real y toma de decisiones basadas en métricas.':
    'Real-time data analysis and decisions made on metrics, not hunches.',
  'EMPIEZA A AUTOMATIZAR': 'START AUTOMATING',
  'TU NEGOCIO HOY': 'YOUR BUSINESS TODAY',
  'Agenda una consultoría gratuita y descubre cómo la IA puede transformar tu forma de vender, hacer marketing y atender clientes.':
    'Book a free consultation and see how AI can change the way you sell, market and serve your customers.',
  'agendar una consultoría de IA': 'book an AI consultation',
  'Atiende 24/7': 'Answers 24/7',
  'Califica leads': 'Qualifies leads',
  'Seguimiento automático': 'Automatic follow-up',
  'Prospección automática': 'Automated prospecting',
  'Prioriza leads': 'Prioritizes leads',
  'Análisis automático': 'Automated analysis',
  'Contenido IA': 'AI content',
  'ROI optimizado': 'Optimized ROI',
  'Recupera carritos': 'Recovers carts',
  'Recomendaciones': 'Recommendations',
  'Soporte 24/7': 'Support 24/7',

  /* ── IA para WhatsApp ──────────────────────────────────────────────── */
  'IA PARA WHATSAPP': 'AI FOR WHATSAPP',
  'AGENTE INTELIGENTE QUE VENDE 24/7': 'AN INTELLIGENT AGENT THAT SELLS 24/7',
  'Tu mejor vendedor, siempre disponible. Atiende, califica y da seguimiento automático por WhatsApp.':
    'Your best salesperson, always on. It answers, qualifies and follows up automatically on WhatsApp.',
  'Tu mejor vendedor, disponible siempre. Agente inteligente que atiende, califica y da seguimiento automático.':
    'Your best salesperson, always on. An intelligent agent that answers, qualifies and follows up automatically.',
  'Respuestas Inmediatas': 'Immediate answers',
  'Atiende a tus clientes las 24 horas, los 7 días de la semana, sin perder ninguna oportunidad.':
    'Answers your customers 24 hours a day, seven days a week, without missing an opportunity.',
  'Calificación de Prospectos': 'Lead qualification',
  'Identifica automáticamente leads de alta calidad y prioriza tu tiempo en lo que realmente importa.':
    'Automatically spots high-quality leads so your time goes where it matters.',
  'Seguimiento Automático': 'Automatic follow-up',
  'Nunca pierdas un prospecto. El agente hace seguimiento inteligente hasta concretar la venta.':
    'Never drop a prospect. The agent follows up intelligently until the sale closes.',
  'Agenda de Citas': 'Appointment booking',
  'Coordina y agenda reuniones automáticamente, sincronizado con tu calendario.':
    'Coordinates and books meetings automatically, synced with your calendar.',
  'Clínicas y consultorios médicos que necesitan agendar citas 24/7':
    'Clinics and medical practices that need 24/7 appointment booking',
  'Inmobiliarias que califican prospectos y coordinan visitas':
    'Real estate firms qualifying leads and coordinating viewings',
  'E-commerce que procesa pedidos y resuelve dudas de productos':
    'E-commerce processing orders and answering product questions',
  'Servicios profesionales que cotizan y agenden reuniones':
    'Professional services that quote and book meetings',
  'Empresas B2B que califican oportunidades comerciales':
    'B2B companies qualifying commercial opportunities',
  'Instituciones educativas que gestionan inscripciones':
    'Schools and academies managing enrollment',
  'Conversaciones naturales con IA entrenada en tu negocio':
    'Natural conversations with AI trained on your business',
  'Integración con CRM, calendarios y sistemas de pago':
    'Integration with your CRM, calendars and payment systems',
  'Calificación automática de leads con scoring inteligente':
    'Automatic lead qualification with intelligent scoring',
  'Análisis de sentimiento y priorización de urgencias':
    'Sentiment analysis and urgency prioritization',
  'Dashboard con métricas en tiempo real': 'Dashboard with real-time metrics',
  'Notificaciones instantáneas de leads calificados':
    'Instant alerts for qualified leads',
  'Configuración': 'Setup',
  'Entrenamos la IA con información de tu negocio y flujos de conversación.':
    'We train the AI on your business information and conversation flows.',
  'Integración': 'Integration',
  'Conectamos el agente a tu WhatsApp Business en minutos.':
    'We connect the agent to your WhatsApp Business in minutes.',
  'El agente empieza a atender, calificar y dar seguimiento automáticamente.':
    'The agent starts answering, qualifying and following up on its own.',
  'Mejora continua basada en datos reales y comportamiento de usuarios.':
    'Continuous improvement based on real data and user behavior.',

  /* ── IA de ventas ──────────────────────────────────────────────────── */
  'IA DE VENTAS': 'AI FOR SALES',
  'VENDE MÁS CON MENOS ESFUERZO': 'SELL MORE WITH LESS EFFORT',
  'Sistema de IA que automatiza prospección, califica leads y optimiza cada etapa de tu proceso comercial.':
    'An AI system that automates prospecting, qualifies leads and improves every stage of your sales process.',
  'Automatiza prospección, califica leads y optimiza tu proceso comercial con inteligencia artificial.':
    'Automate prospecting, qualify leads and improve your sales process with artificial intelligence.',
  'Identifica y prioriza automáticamente leads con mayor probabilidad de conversión.':
    'Automatically finds and prioritizes the leads most likely to convert.',
  'Lead Scoring Automático': 'Automatic lead scoring',
  'Califica cada prospecto con criterios personalizados y datos en tiempo real.':
    'Scores every prospect against your own criteria with real-time data.',
  'Seguimiento Predictivo': 'Predictive follow-up',
  'Sabe cuándo y cómo contactar cada lead para maximizar probabilidad de cierre.':
    'Knows when and how to reach each lead to maximize the chance of closing.',
  'Optimización de Pipeline': 'Pipeline optimization',
  'Identifica cuellos de botella y sugiere acciones para acelerar el ciclo de ventas.':
    'Finds the bottlenecks and suggests what to do to shorten the sales cycle.',
  'Equipos de ventas B2B que necesitan calificar leads rápidamente':
    'B2B sales teams that need to qualify leads quickly',
  'Empresas SaaS con ciclos de venta complejos': 'SaaS companies with complex sales cycles',
  'Consultorías y agencias que prospectan empresas':
    'Consultancies and agencies prospecting companies',
  'Distribuidores mayoristas con grandes volúmenes de clientes':
    'Wholesale distributors with large customer volumes',
  'Startups tecnológicas en fase de crecimiento': 'Tech startups in a growth phase',
  'Inmobiliarias comerciales con múltiples desarrollos':
    'Commercial real estate with multiple developments',
  'Enriquecimiento automático de datos de prospectos':
    'Automatic enrichment of prospect data',
  'Integración con LinkedIn, CRM y bases de datos comerciales':
    'Integration with LinkedIn, your CRM and commercial databases',
  'Análisis predictivo de comportamiento de compra':
    'Predictive analysis of buying behavior',
  'Secuencias de email y llamadas automatizadas':
    'Automated email and call sequences',
  'Dashboard con métricas de conversión en tiempo real':
    'Dashboard with real-time conversion metrics',
  'Alertas inteligentes de oportunidades de venta':
    'Intelligent alerts for sales opportunities',
  'La IA analiza tu histórico de ventas y perfil de cliente ideal.':
    'The AI studies your sales history and your ideal customer profile.',
  'Prospección': 'Prospecting',
  'Busca y califica prospectos automáticamente en múltiples fuentes.':
    'Finds and qualifies prospects automatically across multiple sources.',
  'Ejecuta secuencias personalizadas de email, LinkedIn y llamadas.':
    'Runs personalized sequences over email, LinkedIn and calls.',
  'Aprende de cada interacción para mejorar continuamente los resultados.':
    'Learns from every interaction to keep improving the results.',

  /* ── IA para marketing ─────────────────────────────────────────────── */
  'IA PARA MARKETING DIGITAL': 'AI FOR DIGITAL MARKETING',
  'IA PARA MARKETING': 'AI FOR MARKETING',
  'MARKETING QUE PIENSA POR TI': 'MARKETING THAT THINKS FOR YOU',
  'Automatiza contenido, optimiza campañas y multiplica resultados con inteligencia artificial.':
    'Automate content, optimize campaigns and multiply results with artificial intelligence.',
  'Marketing que piensa por ti. Analiza campañas, genera contenido y optimiza resultados automáticamente.':
    'Marketing that thinks for you. It analyzes campaigns, produces content and optimizes results on its own.',
  'Análisis Predictivo': 'Predictive analysis',
  'Identifica qué campañas funcionarán antes de gastar presupuesto. Decisiones basadas en datos.':
    'Spots which campaigns will work before you spend the budget. Decisions on data.',
  'Automatización Total': 'Full automation',
  'Genera contenido, programa publicaciones y optimiza anuncios sin intervención manual.':
    'Produces content, schedules posts and optimizes ads without manual work.',
  'Segmentación Inteligente': 'Intelligent segmentation',
  'Crea audiencias hipersegmentadas que realmente convierten basadas en comportamiento real.':
    'Builds tightly targeted audiences that actually convert, based on real behavior.',
  'ROI Optimizado': 'Optimized ROI',
  'Ajusta presupuestos y pujas en tiempo real para maximizar retorno de inversión.':
    'Adjusts budgets and bids in real time to maximize return on investment.',
  'Agencias de marketing que manejan múltiples clientes simultáneamente':
    'Marketing agencies handling several clients at once',
  'E-commerce con presupuesto publicitario mensual mayor a $20,000 MXN':
    'E-commerce with a monthly ad budget above MXN $20,000',
  'Empresas SaaS que necesitan generación constante de leads':
    'SaaS companies that need a constant flow of leads',
  'Consultores independientes que buscan escalar su negocio':
    'Independent consultants looking to scale',
  'Marcas DTC (Direct to Consumer) enfocadas en crecimiento':
    'Direct-to-consumer brands focused on growth',
  'Startups en fase de validación de product-market fit':
    'Startups validating product-market fit',
  'Generación de contenido para redes sociales con IA':
    'AI-generated content for social media',
  'Optimización automática de campañas de Google y Meta Ads':
    'Automatic optimization of Google and Meta Ads campaigns',
  'A/B testing inteligente de creatividades y copy':
    'Intelligent A/B testing of creative and copy',
  'Análisis de sentimiento y monitoreo de marca':
    'Sentiment analysis and brand monitoring',
  'Predicción de tendencias y oportunidades de mercado':
    'Forecasting of trends and market openings',
  'Dashboard unificado con métricas de todas las plataformas':
    'One dashboard with the metrics from every platform',
  'Conexión': 'Connection',
  'Integramos tus cuentas de ads, redes sociales y analytics.':
    'We connect your ad accounts, social profiles and analytics.',
  'Análisis': 'Analysis',
  'La IA estudia tu histórico y performance actual.':
    'The AI studies your history and current performance.',
  'Genera contenido, optimiza campañas y segmenta audiencias.':
    'It produces content, optimizes campaigns and segments audiences.',
  'Mejora Continua': 'Continuous improvement',
  'Aprende de resultados y ajusta estrategia automáticamente.':
    'It learns from results and adjusts the strategy on its own.',

  /* ── IA para e-commerce ────────────────────────────────────────────── */
  'IA PARA E-COMMERCE': 'AI FOR E-COMMERCE',
  'CONVIERTE MÁS VISITAS EN VENTAS': 'TURN MORE VISITS INTO SALES',
  'Asistente inteligente dentro de tu tienda que recupera carritos, recomienda productos y atiende 24/7.':
    'An intelligent assistant inside your store that recovers carts, recommends products and answers 24/7.',
  'Asistente inteligente en tu tienda online que recupera carritos, recomienda productos y atiende 24/7.':
    'An intelligent assistant in your online store that recovers carts, recommends products and answers 24/7.',
  'Recuperación de Carrito': 'Cart recovery',
  'Identifica compradores que abandonaron y los contacta automáticamente con ofertas personalizadas.':
    'Spots shoppers who left and reaches out automatically with a tailored offer.',
  'Recomendaciones Inteligentes': 'Intelligent recommendations',
  'Sugiere productos complementarios en el momento exacto para aumentar el ticket promedio.':
    'Suggests complementary products at the right moment to lift the average basket.',
  'Soporte Automático 24/7': 'Automatic support 24/7',
  'Resuelve dudas de producto, inventario, envíos y devoluciones sin intervención humana.':
    'Answers questions on products, stock, shipping and returns with no human involved.',
  'Más Ventas, Menos Fricción': 'More sales, less friction',
  'Reduce abandono de compra con asistencia en tiempo real durante todo el proceso.':
    'Cuts checkout abandonment with real-time help through the whole process.',
  'Tiendas online con más de 100 visitas diarias que necesitan vender más':
    'Online stores with 100+ daily visits that need to sell more',
  'Marcas propias (DTC) enfocadas en reducir costo de adquisición':
    'Direct-to-consumer brands focused on lowering acquisition cost',
  'Shopify Stores con instalación en minutos sin código':
    'Shopify stores, installed in minutes with no code',
  'WooCommerce optimizado para WordPress con plugin nativo':
    'WooCommerce, optimized for WordPress with a native plugin',
  'Vendedores en marketplaces que quieren su propia tienda':
    'Marketplace sellers who want a store of their own',
  'Negocios de dropshipping que buscan automatizar atención':
    'Dropshipping businesses looking to automate support',
  'Chat inteligente que guía desde duda hasta compra':
    'Intelligent chat that guides from question to purchase',
  'Upsell y cross-sell automático en momento ideal':
    'Automatic upsell and cross-sell at the right moment',
  'Personalización 1:1 basada en comportamiento':
    'One-to-one personalization based on behavior',
  'Automatización de emails activados por acciones':
    'Email automation triggered by real actions',
  'Análisis predictivo de inventario y tendencias':
    'Predictive analysis of stock and trends',
  'Integración con Shopify, WooCommerce, Magento y más':
    'Integration with Shopify, WooCommerce, Magento and more',
  'Instalación': 'Installation',
  'Conectamos la IA a tu tienda en minutos, sin código.':
    'We connect the AI to your store in minutes, with no code.',
  'Entrenamiento': 'Training',
  'La IA aprende tu catálogo, políticas y tono de voz.':
    'The AI learns your catalog, your policies and your tone of voice.',
  'Automatización': 'Automation',
  'Empieza a asistir, recomendar y recuperar carritos.':
    'It starts assisting, recommending and recovering carts.',
  'Optimización': 'Optimization',
  'Mejora continua basada en conversiones reales.':
    'Continuous improvement based on real conversions.',

  /* ── posicionamiento en IA (GEO) ───────────────────────────────────── */
  'POSICIONAMIENTO GEO': 'AI VISIBILITY',
  'Posicionamiento GEO en Aguascalientes': 'AI visibility (GEO) in Aguascalientes',
  'Tus clientes ya no buscan.': 'Your customers no longer search.',
  'Preguntan.': 'They ask.',
  'El buscador dejó de ser la primera parada': 'The search box is no longer the first stop',
  'Cuando alguien le pregunta a una inteligencia artificial por un servicio como el tuyo en Aguascalientes, la respuesta menciona a unos cuantos negocios. Nuestro trabajo es que estés en esa lista, con tus datos correctos y sin que te confundan con nadie.':
    'When somebody asks an artificial intelligence for a service like yours in Aguascalientes, the answer names a handful of businesses. Our job is to get you onto that list, with your details right and nobody mistaking you for someone else.',
  'DIAGNÓSTICO GRATUITO': 'FREE DIAGNOSTIC',
  'SIN COSTO': 'NO CHARGE',
  'PEDIR MI DIAGNÓSTICO': 'REQUEST MY DIAGNOSTIC',
  'Hablar con nosotros': 'Talk to us',
  'Todos nuestros servicios': 'All our services',
  'Soluciones de IA': 'AI solutions',
  '¿EMPEZAMOS POR VER': 'SHALL WE START BY SEEING',
  'DÓNDE ESTÁS?': 'WHERE YOU STAND?',
  'El diagnóstico no cuesta y te lo entregamos aunque decidas no contratarnos.':
    'The diagnostic is free, and it is yours even if you decide not to hire us.',
  'QUIERO MI DIAGNÓSTICO': 'GET MY DIAGNOSTIC',
  '¿Qué dicen las IAs de tu negocio hoy?': 'What do the AIs say about your business today?',
  'Microsoft y Bing': 'Microsoft and Bing',
  'Resúmenes de Google': 'Google’s AI summaries',
  'Búsqueda con fuentes': 'Search with sources',
  'Revisamos los seis asistentes que de verdad usan tus clientes en México, no una lista larga para impresionar.':
    'We check the six assistants your customers in Mexico actually use, not a long list meant to impress.',
  'Te confunde con otro negocio de nombre parecido': 'Confuses you with a business of a similar name',
  'Repite un teléfono o un horario que cambiaste hace años':
    'Repeats a phone number or opening hours you changed years ago',
  'Dice que no encuentra información y recomienda a tu competencia':
    'Says it cannot find information about you and recommends a competitor',
  'Te nombra con tu giro y tu ciudad, sin confundirte':
    'Names you with your line of work and your city, with no mix-ups',
  'Usa los datos que tú publicas y que puede verificar':
    'Uses the details you publish and can verify',
  'Te incluye cuando alguien pregunta por tu servicio en tu zona':
    'Includes you when somebody asks for your service in your area',
  'Ejemplos de lo que encontramos con más frecuencia. Lo tuyo lo vemos en el diagnóstico.':
    'Examples of what we run into most often. Yours we look at in the diagnostic.',
  'Seis frentes concretos. Todos se pueden revisar y medir.':
    'Six concrete fronts. Every one of them can be checked and measured.',
  'Diagnóstico de lo que dicen hoy': 'A diagnostic of what they say today',
  'Le preguntamos a cada motor por tu marca, tu giro y tus competidores, y te entregamos las respuestas tal cual salen. Casi siempre hay sorpresas.':
    'We ask every engine about your brand, your line of work and your competitors, and hand you the answers exactly as they come out. There are almost always surprises.',
  'Datos estructurados en tu sitio': 'Structured data on your site',
  'Marcado Schema.org bien puesto: quién eres, dónde estás, qué vendes y cómo contactarte. Es la forma en que un rastreador entiende tu negocio sin adivinar.':
    'Schema.org markup done properly: who you are, where you are, what you sell and how to reach you. It is how a crawler understands your business without guessing.',
  'Contenido que se puede citar': 'Content that can be quoted',
  'Preguntas reales con respuestas claras y verificables. Un modelo cita lo que puede extraer sin interpretar; escribimos pensando en eso.':
    'Real questions with clear, verifiable answers. A model quotes what it can lift without interpreting, and we write with that in mind.',
  'Consistencia en tus fuentes': 'Consistency across your sources',
  'Mismo nombre, misma dirección, mismo teléfono y mismo giro en tu ficha de Google, directorios, reseñas y redes. Las contradicciones son lo que más te cuesta.':
    'Same name, same address, same phone and same line of work on your Google listing, directories, reviews and social profiles. Contradictions are what cost you most.',
  'Corrección de datos viejos': 'Fixing outdated information',
  'Rastreamos de dónde salen los datos desactualizados que aparecen sobre ti y trabajamos en la fuente, que es el único lugar donde se arreglan de verdad.':
    'We track down where the outdated information about you comes from and work on the source, which is the only place it really gets fixed.',
  'Medición mes con mes': 'Month-by-month measurement',
  'Un reporte que se entiende: en qué preguntas apareces, en cuáles no, qué cambió y qué sigue. Sin métricas inventadas.':
    'A report you can actually read: which questions you show up in, which you do not, what changed and what is next. No invented metrics.',
  'Escuchamos': 'We listen',
  'Corremos las preguntas que haría un cliente tuyo en los seis motores y guardamos las respuestas como punto de partida.':
    'We run the questions one of your customers would ask through all six engines and keep the answers as a baseline.',
  'Ordenamos': 'We tidy up',
  'Dejamos tu sitio legible para las IAs: datos estructurados, fichas de entidad y acceso limpio para sus rastreadores.':
    'We make your site legible to the AIs: structured data, entity records and clean access for their crawlers.',
  'Publicamos': 'We publish',
  'Creamos el contenido que faltaba para responder esas preguntas mejor que nadie en tu zona.':
    'We create the content that was missing to answer those questions better than anyone in your area.',
  'Medimos': 'We measure',
  'Volvemos a preguntar cada mes, comparamos contra el punto de partida y ajustamos lo que no movió.':
    'We ask again every month, compare against the baseline and adjust whatever did not move.',
  'SIN TRABAJO DE GEO': 'WITHOUT GEO WORK',
  'CON INÉDITO': 'WITH INÉDITO',
  '¿Qué es el posicionamiento GEO?': 'What is AI visibility (GEO)?',
  '¿En qué se diferencia del SEO de toda la vida?':
    'How is it different from ordinary SEO?',
  '¿Se puede modificar lo que ChatGPT dice de mi empresa?':
    'Can what ChatGPT says about my company be changed?',
  '¿Cuánto tarda en verse un cambio?': 'How long until a change shows?',
  'Lo que depende de tu sitio, como los datos estructurados, se refleja en días. Lo que depende de fuentes externas, como directorios y reseñas, toma más: entre uno y tres meses según qué tan regada esté la información. Te lo medimos cada mes para que no sea cuestión de fe.':
    'What depends on your own site, like structured data, shows within days. What depends on outside sources, like directories and reviews, takes longer: one to three months, depending on how scattered the information is. We measure it every month so none of it is a matter of faith.',
  '¿Sirve para un negocio local de Aguascalientes?':
    'Does it work for a local business in Aguascalientes?',
  '¿Necesito rehacer mi sitio web?': 'Do I need to rebuild my website?',
  'Casi nunca. Buena parte del trabajo se hace sobre lo que ya tienes. Si tu sitio no se puede editar o los rastreadores no lo pueden leer, te lo decimos en el diagnóstico y lo tratamos aparte, sin meterlo en el mismo paquete.':
    'Almost never. Most of the work happens on what you already have. If your site cannot be edited, or crawlers cannot read it, we say so in the diagnostic and handle it separately instead of bundling it in.',
  '¿Cuánto cuesta?': 'How much does it cost?',
  'Depende del tamaño de tu marca y de qué tan dispersa esté hoy tu información, así que se cotiza después del diagnóstico. El diagnóstico no tiene costo y no compromete a nada.':
    'It depends on the size of your brand and how scattered your information is today, so it is quoted after the diagnostic. The diagnostic is free and commits you to nothing.',
  'Le preguntamos por ti a los seis asistentes y te mandamos las respuestas tal cual salen, junto con lo que habría que corregir. Sin compromiso y sin letra chica: si con eso te arreglas solo, qué bueno.':
    'We ask all six assistants about you and send you the answers exactly as they come out, along with what would need fixing. No commitment and no fine print: if that is enough for you to sort it out yourself, good.',
  'Logramos que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen bien a tu negocio. Diagnóstico gratuito en Aguascalientes.':
    'We get ChatGPT, Gemini, Perplexity and Google’s AI summaries to find, understand and quote your business correctly. Free diagnostic in Aguascalientes.',
  'Posicionamiento en IA (GEO) en Aguascalientes | INÉDITO DIGITAL':
    'AI Visibility (GEO) in Aguascalientes | INÉDITO DIGITAL',

  /* ── inicio ────────────────────────────────────────────────────────── */
  'EL MARKETING QUE NO SE MIDE': 'MARKETING YOU CANNOT MEASURE',
  'ES UN GASTO': 'IS AN EXPENSE',
  'Página, redes, campañas: muchas empresas ya invierten en digital sin poder decir qué les regresa cada peso. La transformación digital de verdad empieza cuando todo lo que haces se mide contra ventas.':
    'Website, social, campaigns: plenty of companies already spend on digital without being able to say what each peso brings back. Real digital transformation starts when everything you do is measured against sales.',
  'EL PUNTO DE PARTIDA': 'THE STARTING POINT',
  'ASÍ LO RESOLVEMOS': 'HOW WE SOLVE IT',
  'NO ES UNA PROMESA,': 'IT IS NOT A PROMISE,',
  'ES UN SISTEMA': 'IT IS A SYSTEM',
  'Somos una agencia de marketing digital y de inteligencia artificial, y nuestra forma de trabajar es un sistema: dirección pone el objetivo, todo lo que tu negocio hace en digital queda conectado, y una IA lo revisa cada mes contra ese objetivo. Casi nadie en Aguascalientes trabaja así.':
    'We are a digital marketing and artificial intelligence agency, and the way we work is a system: leadership sets the objective, everything your business does in digital gets connected, and an AI reviews it every month against that objective. Almost nobody in Aguascalientes works this way.',
  'EL CICLO COMPLETO': 'THE FULL CYCLE',
  'Las cuatro piezas del sistema': 'The four pieces of the system',
  'Dirección define, todo se conecta, la IA audita y se ajusta. Así se ve el ciclo completo.':
    'Leadership defines, everything connects, the AI audits and things get adjusted. That is the full cycle.',
  'OBJETIVOS': 'OBJECTIVES',
  'Dirección define qué quiere lograr y en qué plazo':
    'Leadership defines what to achieve, and by when',
  'CONECTAR': 'CONNECT',
  'Tu presencia, tus campañas y tus ventas quedan en un solo tablero':
    'Your presence, your campaigns and your sales end up on one dashboard',
  'AUDITAR': 'AUDIT',
  'Cada mes una IA revisa el desempeño contra esos objetivos':
    'Every month an AI reviews performance against those objectives',
  'AJUSTAR': 'ADJUST',
  'Se corrige con lo que dice el dato, no con la corazonada':
    'Corrections follow the data, not a hunch',
  'NUESTRO ENFOQUE': 'OUR APPROACH',
  'Estrategia dirigida por objetivos': 'Strategy driven by objectives',
  'No vendemos campañas sueltas. Conectamos los objetivos de tu dirección con los datos reales del negocio, y una IA audita cada mes si la estrategia está funcionando. Si no funciona, lo dice.':
    'We do not sell one-off campaigns. We connect your leadership’s objectives to the real numbers of the business, and an AI audits every month whether the strategy is working. If it is not, it says so.',
  'Presencia medida en': 'Presence measured across',
  'EL SERVICIO SE ADAPTA': 'THE SERVICE ADAPTS',
  'A DÓNDE ESTÁS': 'TO WHERE YOU ARE',
  'No es el mismo trabajo para una empresa que no tiene nada que para una que ya invierte y quiere vender más. Estos son los tres puntos de partida.':
    'It is not the same work for a company with nothing as for one already spending and wanting to sell more. These are the three starting points.',
  'UN TABLERO,': 'ONE DASHBOARD,',
  'NO UN REPORTE EN PDF': 'NOT A PDF REPORT',
  'Cada cliente tiene una pantalla conectada a sus datos reales, con el costo por contacto de cada canal lado a lado. Cuando el sistema de la empresa lo permite, llega hasta la venta facturada.':
    'Every client gets a screen wired to their own numbers, with the cost per lead of each channel side by side. When the company’s system allows it, it reaches all the way to invoiced sales.',
  'Vista del tablero con datos de demostración': 'Dashboard view with demo data',
  'Tablero de resultados de Inédito Digital con contactos, costo por contacto, ventas y el embudo hasta la venta':
    'Inédito Digital results dashboard with leads, cost per lead, sales and the funnel through to the sale',
  'LO QUE HACEMOS': 'WHAT WE DO',
  'Soluciones digitales que generan resultados reales y medibles':
    'Digital work that produces real, measurable results',
  'VER TODOS LOS SERVICIOS': 'SEE ALL SERVICES',
  'VER LOS SERVICIOS': 'SEE THE SERVICES',
  'IA APLICADA AL NEGOCIO': 'AI PUT TO WORK IN THE BUSINESS',
  'Inteligencia artificial puesta a trabajar donde se nota: atención, prospección, campañas y venta en línea. Todo conectado al mismo tablero.':
    'Artificial intelligence put to work where it shows: support, prospecting, campaigns and online sales. All of it wired to the same dashboard.',
  'EL MÁS PEDIDO': 'MOST REQUESTED',
  'Lo que recibes': 'What you get',
  'VER TODOS LOS SERVICIOS IA': 'SEE ALL AI SERVICES',
  'PORTAFOLIO': 'PORTFOLIO',
  'VER EL PORTAFOLIO': 'SEE THE PORTFOLIO',
  'MARCAS QUE YA CONFÍAN': 'BRANDS THAT ALREADY TRUST US',
  'Trabajamos con empresas de Aguascalientes y de todo México, y muchas ya están satisfechas con el rendimiento y las ventas que lograron después de trabajar con Inédito.':
    'We work with companies in Aguascalientes and across Mexico, and many are already happy with the performance and sales they achieved after working with Inédito.',
  'QUIÉN ESTÁ DETRÁS': 'WHO IS BEHIND IT',
  'DE AGUASCALIENTES,': 'FROM AGUASCALIENTES,',
  'PARA EMPRESAS QUE VAN EN SERIO': 'FOR COMPANIES THAT MEAN BUSINESS',
  'Estamos en Aguascalientes y trabajamos con empresas de todo México. Lo que se promete queda por escrito, lo que se hace queda medido, y siempre hay una persona que da la cara.':
    'We are based in Aguascalientes and work with companies all over Mexico. What is promised goes in writing, what is done gets measured, and there is always a person who answers for it.',
  'Las tres promesas que sostienen todo': 'The three promises everything rests on',
  'Medimos hasta la venta': 'We measure all the way to the sale',
  'Visibilidad completa, también ante la IA': 'Full visibility, in front of AI too',
  'Formalidad y confianza': 'Credibility and trust',
  'EL SIGUIENTE PASO': 'THE NEXT STEP',
  'EMPIEZA POR SABER DÓNDE ESTÁS': 'START BY KNOWING WHERE YOU STAND',
  'Pide la auditoría de tu presencia digital: qué está bien, qué está mal y qué conviene hacer primero, con la evidencia de cada hallazgo.':
    'Ask for the audit of your digital presence: what is working, what is not and what to do first, with the evidence behind every finding.',
  'QUIERO MI AUDITORÍA': 'I WANT MY AUDIT',
  'ESCRÍBENOS POR WHATSAPP': 'MESSAGE US ON WHATSAPP',
  'Escribe qué necesita tu empresa…': 'Tell us what your company needs…',

  /* ── nosotros ──────────────────────────────────────────────────────── */
  'NUESTRA MISIÓN': 'OUR MISSION',
  'NUESTRA VISIÓN': 'OUR VISION',
  '¿POR QUÉ ELEGIRNOS?': 'WHY CHOOSE US?',
  'NUESTRAS TRES PROMESAS': 'OUR THREE PROMISES',
  'MEDICIÓN HASTA LA VENTA': 'MEASURED THROUGH TO THE SALE',
  'VISIBILIDAD COMPLETA': 'FULL VISIBILITY',
  'FORMALIDAD Y CONFIANZA': 'CREDIBILITY AND TRUST',
  'Somos un equipo de Aguascalientes. Trabajamos con empresas que quieren dejar de invertir en digital a ciegas: conectamos objetivos, datos y campañas en un solo lugar, y auditamos con IA si la estrategia está dando resultado.':
    'We are a team from Aguascalientes. We work with companies that want to stop spending on digital blind: we connect objectives, data and campaigns in one place, and audit with AI whether the strategy is paying off.',
  'Que cada peso que una empresa invierte en digital se pueda medir contra ventas reales. Conectamos los objetivos de dirección con Search Console, Analytics y las campañas en un solo tablero, y revisamos periódicamente si la estrategia está funcionando.':
    'That every peso a company puts into digital can be measured against real sales. We connect leadership’s objectives with Search Console, Analytics and the campaigns on one dashboard, and check regularly whether the strategy is working.',
  'Que las empresas de Aguascalientes no solo aparezcan en Google, sino también en las respuestas que dan los asistentes de inteligencia artificial cuando alguien pregunta por un proveedor. Casi nadie en el mercado está trabajando eso todavía.':
    'That companies in Aguascalientes show up not only on Google, but in the answers AI assistants give when somebody asks for a supplier. Almost nobody in this market is working on that yet.',
  'Tableros conectados a datos reales y, cuando tu ERP lo permite, cruce directo entre campañas y ventas cerradas. No clics ni likes.':
    'Dashboards wired to real data and, when your ERP allows it, a direct match between campaigns and closed sales. Not clicks or likes.',
  'No solo el buscador de Google. También los seis motores de IA que ya recomiendan proveedores: ChatGPT, Gemini, AI Overviews de Google, Perplexity, Claude y Copilot.':
    'Not just Google search. Also the six AI engines that already recommend providers: ChatGPT, Gemini, Google\'s AI Overviews, Perplexity, Claude and Copilot.',
  'Cuando alguien busca a tu empresa, encuentra un negocio serio: presencia cuidada, datos consistentes en todas partes y soporte real detrás.':
    'When somebody looks your company up, they find a serious business: a presence that has been looked after, consistent details everywhere and real support behind it.',
  'Proyectos exitosos': 'Successful projects',
  'ROI promedio': 'Average ROI',

  /* ── servicios ─────────────────────────────────────────────────────── */
  '¿EN QUÉ PUNTO ESTÁS?': 'WHERE ARE YOU RIGHT NOW?',
  'El servicio se adapta al grado de posicionamiento de cada empresa. Elige por dónde entrar.':
    'The service adapts to how far along each company already is. Choose where to come in.',
  'CONSTRUIR': 'BUILD',
  'Presencia desde cero': 'A presence from scratch',
  'Cuando te busquen, existes y te ves formal.': 'When they look you up, you exist and you look the part.',
  'Para empresas que no tienen nada de presencia digital. Web que pasa PageSpeed con SEO, AEO y GEO desde el día uno, ficha de Google, LinkedIn armado y tablero base.':
    'For companies with no digital presence at all. A site that passes PageSpeed with SEO, AEO and GEO from day one, a Google listing, LinkedIn set up and a starter dashboard.',
  'MEJORAR': 'IMPROVE',
  'Presencia que compite': 'A presence that competes',
  'Te decimos exactamente qué está mal y lo arreglamos.': 'We tell you exactly what is wrong, and we fix it.',
  'Para empresas con web y redes mal trabajadas. Se entra por la auditoría con IA: del diagnóstico sale el plan de mejora.':
    'For companies whose site and social profiles were done badly. You come in through the AI audit: the diagnostic produces the improvement plan.',
  'VENDER': 'SELL',
  'Presencia que convierte': 'A presence that converts',
  'Cada peso invertido se mide contra ventas reales.': 'Every peso spent is measured against real sales.',
  'Para empresas que ya tienen todo y quieren resultados. Canales de venta, campañas con tablero unificado y, cuando hay ERP, cruce de prospectos contra ventas cerradas.':
    'For companies that already have everything and want results. Sales channels, campaigns on a unified dashboard and, when there is an ERP, leads matched against closed sales.',
  'Marketing digital, publicidad, mercadotecnia y contenido para empresas de Aguascalientes. Todo conectado a datos reales y medido hasta la venta.':
    'Digital marketing, advertising and content for companies in Aguascalientes. All of it wired to real data and measured through to the sale.',

  /* ── demos interactivos (páginas de servicio) ──────────────────────── */
  'PRUEBA NUESTROS': 'TRY OUR',
  'DEMOS': 'DEMOS',
  'Explora en vivo las activaciones interactivas que podemos implementar en tu stand.':
    'Try the interactive activations we can put in your booth, live.',
  'VER DEMO': 'VIEW DEMO',
  '✓ DISPONIBLE': '✓ AVAILABLE',
  'RULETA DE PREMIOS': 'PRIZE WHEEL',
  'Ruleta interactiva totalmente personalizable.': 'A fully customizable interactive prize wheel.',
  'Gato interactivo con premios. Juega contra la IA y gana.':
    'Interactive tic-tac-toe with prizes. Play the AI and win.',
  'Photobooth con marcos personalizados de tu marca.': 'A photo booth with frames branded as yours.',
  '¿Necesitas una activación personalizada para tu evento?':
    'Need a custom activation for your event?',
  'COTIZAR ACTIVACIÓN PERSONALIZADA': 'GET A QUOTE FOR A CUSTOM ACTIVATION',

  /* ── portafolio ────────────────────────────────────────────────────── */
  'PROYECTOS DESTACADOS': 'FEATURED PROJECTS',
  'TODOS LOS PROYECTOS': 'ALL PROJECTS',
  'Descubre cómo hemos transformado negocios en Aguascalientes y México con diseño web excepcional, SEO estratégico y resultados medibles.':
    'See how we have changed businesses in Aguascalientes and across Mexico with exceptional web design, strategic SEO and measurable results.',
  'EL DESAFÍO': 'THE CHALLENGE',
  'LA SOLUCIÓN': 'THE SOLUTION',
  'RESULTADOS': 'RESULTS',
  'SERVICIOS UTILIZADOS': 'SERVICES USED',
  'Proyecto no encontrado': 'Project not found',

  /* ── contacto ──────────────────────────────────────────────────────── */
  'CONTACTO': 'CONTACT',
  'Agenda una consulta gratuita y descubre cómo podemos ayudarte':
    'Book a free consultation and find out how we can help',
  'INFORMACIÓN DE CONTACTO': 'CONTACT DETAILS',
  'Dirección': 'Address',
  'Teléfono': 'Phone',
  'Email': 'Email',
  'HORARIO': 'HOURS',
  '¿PREFIERES WHATSAPP?': 'PREFER WHATSAPP?',
  'Respuesta inmediata por WhatsApp': 'Immediate reply on WhatsApp',
  'CHATEAR AHORA': 'CHAT NOW',
  'ENVÍANOS UN MENSAJE': 'SEND US A MESSAGE',
  'Nombre completo *': 'Full name *',
  'Email *': 'Email *',
  'Teléfono *': 'Phone *',
  'Empresa': 'Company',
  '¿En qué podemos ayudarte? *': 'How can we help? *',
  'ENVIAR MENSAJE': 'SEND MESSAGE',
  'ENVIANDO…': 'SENDING…',
  '¡Mensaje enviado! Te contactaremos muy pronto.': 'Message sent. We will get back to you shortly.',
  'No se pudo enviar. Escríbenos por WhatsApp, por favor.':
    'It could not be sent. Please message us on WhatsApp.',
  'Error de conexión. Intenta de nuevo o escríbenos por WhatsApp.':
    'Connection error. Try again, or message us on WhatsApp.',

  /* ── blog ──────────────────────────────────────────────────────────── */
  'Estrategias, tips y tendencias de marketing digital que funcionan':
    'Digital marketing strategy, tips and trends that actually work',

  /* ── pie de página ─────────────────────────────────────────────────── */
  'EMPRESA': 'COMPANY',
  'Agencia de Marketing Digital en Aguascalientes que impulsa tus ventas con IA y estrategias digitales comprobadas.':
    'A digital marketing agency in Aguascalientes that drives your sales with AI and proven digital strategy.',
  'Diseño y Desarrollo Web': 'Web Design and Development',
  'Posicionamiento Orgánico': 'Organic SEO',
  'Google ADS': 'Google Ads',
  'Funnels de Venta': 'Sales Funnels',
  'Chatbots y Agentes IA': 'Chatbots and AI Agents',
  'Política de Privacidad': 'Privacy Policy',
  'Términos y Condiciones': 'Terms and Conditions',
  '© 2026 INÉDITO DIGITAL. Todos los derechos reservados.':
    '© 2026 INÉDITO DIGITAL. All rights reserved.',

  /* ── legales y 404 ─────────────────────────────────────────────────── */
  'POLÍTICA DE': 'PRIVACY',
  'PRIVACIDAD': 'POLICY',
  'TÉRMINOS Y': 'TERMS AND',
  'CONDICIONES': 'CONDITIONS',
  'Última actualización: Diciembre 16, 2024': 'Last updated: December 16, 2024',

  /*
   * Los apartados legales. Se traducen para que se puedan leer, pero la versión
   * en español es la que vale: eso lo dice el aviso de AvisoIdiomaLegal, y es la
   * práctica normal en documentos legales traducidos.
   */
  '1. Información que Recopilamos': '1. Information We Collect',
  'Recopilamos información que nos proporcionas directamente al usar nuestros servicios: nombre, correo electrónico, teléfono, empresa, y cualquier otra información que decidas compartir.':
    'We collect information you give us directly when using our services: name, email, phone, company, and any other information you choose to share.',
  '2. Uso de la Información': '2. Use of the Information',
  'Utilizamos la información recopilada para:': 'We use the information we collect to:',
  'Proporcionar y mejorar nuestros servicios\nComunicarnos contigo sobre nuestros servicios\nEnviar información relevante de marketing (con tu consentimiento)\nAnalizar el uso de nuestro sitio web':
    'Provide and improve our services\nContact you about our services\nSend relevant marketing information (with your consent)\nAnalyze how our website is used',
  '3. Protección de Datos': '3. Data Protection',
  'Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.':
    'We put security measures in place designed to protect your personal information against unauthorized access, alteration, disclosure or destruction.',
  '4. Cookies': '4. Cookies',
  'Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio, analizar el tráfico y personalizar contenido.':
    'We use cookies and similar technologies to improve your experience on the site, analyze traffic and personalize content.',
  '5. Tus Derechos': '5. Your Rights',
  'Tienes derecho a acceder, corregir o eliminar tu información personal. Para ejercer estos derechos, contáctanos en contacto@inedito.digital':
    'You have the right to access, correct or delete your personal information. To exercise these rights, contact us at contacto@inedito.digital',
  '6. Contacto': '6. Contact',
  'Si tienes preguntas sobre esta política de privacidad, contáctanos:\nEmail: contacto@inedito.digital\nTeléfono: +52 1 449 120 4353':
    'If you have questions about this privacy policy, contact us:\nEmail: contacto@inedito.digital\nPhone: +52 1 449 120 4353',

  '1. Aceptación de Términos': '1. Acceptance of Terms',
  'Al acceder y usar los servicios de INÉDITO DIGITAL, aceptas estar sujeto a estos términos y condiciones.':
    'By accessing and using INÉDITO DIGITAL’s services, you agree to be bound by these terms and conditions.',
  '2. Servicios': '2. Services',
  'Ofrecemos servicios de marketing digital, desarrollo web, SEO, publicidad digital y consultoría. Los detalles específicos de cada servicio se acordarán en contratos individuales.':
    'We offer digital marketing, web development, SEO, digital advertising and consulting services. The specific details of each service are agreed in individual contracts.',
  '3. Pagos y Facturación': '3. Payment and Invoicing',
  'Los términos de pago se especificarán en cada propuesta comercial. Generalmente requerimos:':
    'Payment terms are set out in each commercial proposal. We generally require:',
  '50% de anticipo para iniciar el proyecto\n50% restante contra entrega\nServicios recurrentes: pago mensual anticipado':
    '50% deposit to start the project\nThe remaining 50% on delivery\nRecurring services: monthly payment in advance',
  '4. Garantías y Resultados': '4. Guarantees and Results',
  'Garantizamos esfuerzo máximo y entregas en tiempo. Sin embargo, resultados específicos (rankings, ventas, leads) dependen de múltiples factores externos y no pueden garantizarse.':
    'We guarantee our best effort and on-time delivery. Specific results (rankings, sales, leads), however, depend on many external factors and cannot be guaranteed.',
  '5. Propiedad Intelectual': '5. Intellectual Property',
  'Una vez pagado en su totalidad, el cliente recibe derechos completos sobre el trabajo entregado. Nos reservamos el derecho de mostrar el trabajo en nuestro portafolio.':
    'Once paid in full, the client receives full rights over the delivered work. We reserve the right to show the work in our portfolio.',
  '6. Cancelación': '6. Cancellation',
  'Los términos de cancelación se especifican en cada contrato. Generalmente:':
    'Cancellation terms are set out in each contract. Generally:',
  'Proyectos: El anticipo no es reembolsable\nServicios mensuales: Aviso de 30 días':
    'Projects: the deposit is non-refundable\nMonthly services: 30 days’ notice',
  '7. Contacto': '7. Contact',
  'Para preguntas sobre estos términos:\nEmail: contacto@inedito.digital\nTeléfono: +52 1 449 120 4353':
    'For questions about these terms:\nEmail: contacto@inedito.digital\nPhone: +52 1 449 120 4353',
  'Página no encontrada - 404 | INÉDITO DIGITAL': 'Page not found - 404 | INÉDITO DIGITAL',
  'La página que buscas no existe o ha sido movida.':
    'The page you are looking for does not exist or has moved.',

  /* ── tarjetas de presentación digital ──────────────────────────────── */
  'TU TARJETA DE PRESENTACIÓN,': 'YOUR BUSINESS CARD,',
  'AHORA DIGITAL': 'NOW DIGITAL',
  'Comparte tu contacto, redes y portafolio con un solo toque. Sin imprimir, sin apps, siempre al día.':
    'Share your contact details, social profiles and portfolio with a single tap. No printing, no apps, always current.',
  'Desliza para verla armarse desde cero': 'Scroll to watch it built from scratch',
  'Sigue bajando para armarla': 'Keep scrolling to build it',
  'Así se arma tu tarjeta': 'How your card comes together',
  'Editando': 'Editing',
  'TU NOMBRE': 'YOUR NAME',
  'Tu puesto · Tu empresa': 'Your role · Your company',
  'Guardar contacto': 'Save contact',
  'Tu página': 'Your website',
  'tuempresa.com': 'yourcompany.com',
  '@tumarca': '@yourbrand',
  'Dictas o tecleas tus datos': 'You dictate or type your details',
  'Un toque y queda guardado': 'One tap and it is saved',
  'Los datos quedan congelados': 'The details are frozen in place',
  'La editas cuando quieras': 'You edit it whenever you like',
  'Reimprimes con cada cambio': 'Reprint with every change',
  'Cero reimpresiones': 'Zero reprints',
  'Termina en un cajón': 'Ends up in a drawer',
  'Una impresión que se recuerda': 'An impression people remember',
  'Compartir': 'Sharing',
  'Un toque': 'One tap',
  'Apps': 'Apps',
  'Ninguna': 'None',
  'Ediciones': 'Edits',
  'Ilimitadas': 'Unlimited',
  'Entrega': 'Delivery',
  '3–5 días': '3–5 days',
  'Beneficios': 'Benefits',
  'Lo mismo que hacías,': 'The same thing you did,',
  'sin la parte molesta': 'without the annoying part',
  'Tarjeta impresa': 'Printed card',
  'Como siempre': 'As always',
  'Tarjeta NFC': 'NFC card',
  'Con Inédito': 'With Inédito',
  'Acabado premium con chip NFC dentro. El diseño es tuyo; el contenido lo cambias cuando quieras.':
    'A premium finish with an NFC chip inside. The design is yours; the content you change whenever you like.',
  'Ideal para': 'Perfect for',
  'Emprendedores y freelancers que hacen networking':
    'Founders and freelancers who network',
  'Equipos comerciales que comparten contacto al vuelo':
    'Sales teams sharing contact details on the move',
  'Consultores que actualizan su información seguido':
    'Consultants who update their details often',
  'Empresas que cuidan su imagen en cada interacción':
    'Companies that care about their image in every interaction',
  'Agentes inmobiliarios y asesores en ferias y eventos':
    'Real estate agents and advisors at fairs and events',
  'Cómo se cotiza': 'How pricing works',
  'Para una persona o para': 'For one person or for',
  'todo tu equipo': 'your whole team',
  '¿Son 3 personas? ¿Son 80? Nos adaptamos. Dinos cuántas son y armamos la cotización a la medida de tu equipo.':
    'Three people? Eighty? We adapt. Tell us how many you are and we put together a quote that fits your team.',
  'COTIZAR MI TARJETA': 'GET A QUOTE FOR MY CARD',
  'COTIZAR PARA MI EQUIPO': 'GET A QUOTE FOR MY TEAM',
  'Preguntas frecuentes': 'Common questions',
  '¿Necesito instalar una aplicación para usarla?':
    'Do I need to install an app to use it?',
  'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.':
    'No. It uses the NFC technology modern smartphones already have, both Android and iPhone from the 7 onward. You just hold the card up to it.',
  '¿Qué pasa si cambio de número o de trabajo?':
    'What if I change my number or my job?',
  'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.':
    'You update your digital profile online and the change shows on your card instantly, with nothing reprinted.',
  '¿Qué información puedo compartir?': 'What information can I share?',
  'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.':
    'Contact details, social profiles, website, portfolio, location and even an intro video, all from a single tap.',
  '¿Cuánto tarda la entrega?': 'How long does delivery take?',
  'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.':
    'Design and programming take three to five business days once you approve the card design.',
  '¿Puedo pedir tarjetas para todo mi equipo?': 'Can I order cards for my whole team?',
  'Sí. Cotizamos desde una sola persona hasta equipos completos, con diseño unificado para toda la empresa y una página de contacto propia para cada integrante. Nos adaptamos al tamaño de tu equipo.':
    'Yes. We quote anything from a single person to whole teams, with one unified design for the company and a contact page of their own for each member. We adapt to the size of your team.',
  '¿Listo para modernizar tu tarjeta?': 'Ready to modernize your card?',
  'Cotiza tu tarjeta NFC y empieza a compartir tu contacto con un solo toque.':
    'Get a quote for your NFC card and start sharing your contact with a single tap.',

  /* ── portada: el hero ──────────────────────────────────────────────── */
  'Aguascalientes · Medimos hasta la venta': 'Aguascalientes · We measure through to the sale',
  'Agencia de marketing digital en Aguascalientes': 'Digital marketing agency in Aguascalientes',
  'DIRECCIÓN COMERCIAL': 'COMMERCIAL LEADERSHIP',
  'ASISTIDA POR IA': 'ASSISTED BY AI',
  'IA auditando': 'AI auditing',
  'Medido hasta la venta': 'Measured through to the sale',
  'Visible ante la IA': 'Visible to AI',
  'No vendemos campañas sueltas: conectamos los objetivos de tu dirección con todo lo que tu negocio hace en digital, en un solo tablero, y cada mes una IA audita que la estrategia esté funcionando.':
    'We do not sell one-off campaigns: we connect your leadership’s objectives to everything your business does in digital, on one dashboard, and every month an AI audits whether the strategy is working.',
  'QUIERO UNA AUDITORÍA': 'I WANT AN AUDIT',
  'VER SERVICIOS': 'SEE SERVICES',

  /* ── GEO: las respuestas largas de preguntas frecuentes ────────────── */
  'GEO significa Generative Engine Optimization: el trabajo de lograr que los asistentes de inteligencia artificial encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta. Es el equivalente al SEO, pero para ChatGPT, Gemini, Perplexity y los resúmenes de Google en vez de la lista de resultados azules.':
    'GEO stands for Generative Engine Optimization: the work of getting artificial intelligence assistants to find, understand and correctly quote your business when somebody asks them. It is the equivalent of SEO, but for ChatGPT, Gemini, Perplexity and Google’s AI summaries instead of the list of blue links.',
  'El SEO busca que tu página aparezca en una lista y que la persona haga clic. El GEO busca que la IA use tu información al redactar su respuesta, aunque nadie entre a tu sitio. Comparten mucha base técnica, pero cambia lo que se optimiza: en GEO importa más que tus datos sean verificables, consistentes y fáciles de extraer que la posición en un ranking.':
    'SEO tries to get your page onto a list so a person clicks it. GEO tries to get the AI to use your information while writing its answer, even if nobody visits your site. They share a lot of technical ground, but what gets optimized changes: in GEO it matters more that your details are verifiable, consistent and easy to lift than where you sit in a ranking.',
  'No directamente: nadie puede reentrenar un modelo desde fuera, y quien te prometa eso te está vendiendo algo que no existe. Lo que sí se puede es cambiar la materia prima con la que responde. Estos asistentes consultan la web en tiempo real y se apoyan en fuentes verificables, así que ordenar esas fuentes, corregir los datos viejos y publicar información citable sí cambia sus respuestas.':
    'Not directly: nobody can retrain a model from the outside, and anyone promising you that is selling something that does not exist. What you can change is the raw material it answers with. These assistants read the web in real time and lean on verifiable sources, so tidying up those sources, correcting old information and publishing quotable material does change their answers.',
  'Sirve especialmente. Cuando alguien pregunta por un servicio en una ciudad concreta, los asistentes se apoyan mucho en señales locales: la ficha de Google, las reseñas, los directorios de la zona y la coherencia entre todos. Un negocio local bien ordenado compite muy bien en esas respuestas, incluso contra marcas más grandes.':
    'It works especially well. When somebody asks for a service in a specific city, the assistants lean heavily on local signals: the Google listing, the reviews, the directories in that area and how consistent they all are. A local business with its house in order competes very well in those answers, even against bigger brands.',
  'Cada vez más gente le pregunta directamente a un asistente en vez de abrir diez pestañas. La IA responde en una sola frase y nombra dos o tres opciones. Si tu negocio no está entre ellas, no perdiste una posición: no apareciste en la conversación. Y a diferencia del buscador, aquí no hay una segunda página donde te puedan encontrar.':
    'More and more people ask an assistant directly instead of opening ten tabs. The AI answers in a single sentence and names two or three options. If your business is not among them, you did not lose a position: you were not in the conversation at all. And unlike a search engine, there is no second page here where they might still find you.',
  'Somos una agencia de marketing digital con base en Aguascalientes, y trabajamos el posicionamiento en inteligencia artificial para negocios de la ciudad y del Bajío. Conocer el mercado local importa: cuando alguien pregunta por un servicio en Aguascalientes, las respuestas se arman con fuentes de aquí, y saber cuáles son es la mitad del trabajo.':
    'We are a digital marketing agency based in Aguascalientes, and we work on artificial intelligence visibility for businesses in the city and the Bajío region. Knowing the local market matters: when somebody asks for a service in Aguascalientes, the answers are assembled from sources here, and knowing which ones is half the job.',

  /* ── el asistente del sitio ────────────────────────────────────────── */
  'ASISTENTE IA': 'AI ASSISTANT',
  'Asistente de Inédito': 'Inédito assistant',
  'En línea': 'Online',
  'Escribe tu pregunta…': 'Type your question…',
  'Tu nombre…': 'Your name…',
  'Correo o teléfono…': 'Email or phone…',
  'Enviar por WhatsApp': 'Send on WhatsApp',
  'Prefiero escribir por WhatsApp': 'I would rather write on WhatsApp',
  'Se abre WhatsApp con el mensaje escrito. Solo tienes que enviarlo.':
    'WhatsApp opens with the message already written. All you do is send it.',
  'Anotado. El mensaje ya lo lleva.': 'Noted. The message already has it.',
  'Claro, escríbelo aquí.': 'Of course, write it here.',
  'Abrir asistente virtual': 'Open the virtual assistant',
  'Hola 👋 Soy el asistente de Inédito.\n\nPregúntame lo que quieras sobre nuestros servicios, o dime qué necesitas para tu negocio.':
    'Hi 👋 I am Inédito’s assistant.\n\nAsk me anything about our services, or tell me what your business needs.',
  'Hola 👋 Con gusto te ayudo a cotizar.\n\n¿Qué necesitas? Escríbelo con tus palabras, o elige una opción.':
    'Hi 👋 Happy to help you get a quote.\n\nWhat do you need? Say it in your own words, or pick an option.',
  '¡Hola! ¿Qué necesitas para tu negocio?': 'Hello. What does your business need?',
  '¿Qué más quieres saber?': 'What else would you like to know?',
  'Perfecto. ¿Cómo te llamas?': 'Great. What is your name?',
  'Puede ser cualquiera de estos. ¿Cuál te interesa?': 'It could be any of these. Which one interests you?',
  'Esto es lo que hacemos con inteligencia artificial:': 'This is what we do with artificial intelligence:',
  'Tenemos los casos publicados con lo que hicimos en cada uno.':
    'We have the cases published, with what we did in each one.',
  'Estos son los frentes en los que trabajamos, más todo lo de inteligencia artificial. ¿Cuál te interesa?':
    'These are the fronts we work on, plus everything on artificial intelligence. Which one interests you?',
  'Depende del alcance, y no quiero darte una fecha inventada: un sitio de cinco páginas y uno de cincuenta no tardan lo mismo.':
    'It depends on the scope, and I would rather not invent a date: a five-page site and a fifty-page site do not take the same time.',
  'No estoy seguro de haber entendido bien 🤔\n\n¿Me lo dices de otra forma? O si prefieres, te paso con alguien del equipo que te responde al momento.':
    'I am not sure I understood that 🤔\n\nCould you put it another way? Or if you prefer, I can pass you to someone on the team who will answer right away.',
  'Esa no la tengo publicada, así que prefiero no darte un número inventado. Te lo responden en un momento por WhatsApp.\n\nLo que sí puedo contarte es cómo trabajamos.':
    'I do not have that one published, so I would rather not give you an invented number. They will answer it in a moment on WhatsApp.\n\nWhat I can tell you is how we work.',
  'Facturación, formas de pago y condiciones se ven caso por caso, y no quiero darte un dato equivocado.\n\nEn WhatsApp te lo aclaran de una vez y con la información correcta.':
    'Invoicing, payment methods and terms are handled case by case, and I do not want to give you the wrong information.\n\nOn WhatsApp they will clear it up right away, with the correct details.',
  'Somos una agencia de Aguascalientes que trabaja como dirección comercial asistida por IA: conectamos tus objetivos con datos reales y auditamos cada mes si la estrategia funciona.':
    'We are an agency from Aguascalientes working as AI-assisted commercial leadership: we connect your objectives to real data and audit every month whether the strategy is working.',
  'Trabajamos en tres niveles según tu punto de partida:\n\n*1. Construir* — no tienes presencia digital todavía.\n*2. Mejorar* — ya tienes web y redes, pero no rinden.\n*3. Vender* — ya tienes todo y quieres resultados medidos.':
    'We work at three levels depending on where you start:\n\n*1. Build* — you have no digital presence yet.\n*2. Improve* — you have a site and social profiles, but they do not perform.\n*3. Sell* — you have everything and want measured results.',
  'Soy el asistente del sitio de Inédito Digital 🤖\n\nNo soy una persona: contesto con la información publicada de los servicios. Para lo que necesite criterio —una cotización, tu caso concreto— te paso con el equipo por WhatsApp y te responden ellos.':
    'I am the assistant on Inédito Digital’s site 🤖\n\nI am not a person: I answer from the published information about the services. For anything that needs judgment —a quote, your particular case— I pass you to the team on WhatsApp and they answer.',
  'Cada proyecto se cotiza según lo que necesita, así que no manejo precios de lista: no sería honesto darte una cifra sin saber de qué tamaño es tu negocio.\n\nLo que sí: la primera revisión no tiene costo. Pásame tu caso por WhatsApp y te damos un número real.':
    'Every project is quoted on what it needs, so I do not carry list prices: it would not be honest to give you a figure without knowing the size of your business.\n\nWhat I can say: the first review is free. Send me your case on WhatsApp and we will give you a real number.',
  'No prometemos posiciones ni cifras concretas: nadie que trabaje en serio puede garantizar eso, y quien lo promete te está vendiendo humo.\n\nLo que sí garantizamos es que vas a saber qué está pasando. Medimos cada mes contra el punto de partida y te decimos si funciona o si no. Si no funciona, lo dice el reporte, no nosotros.':
    'We do not promise rankings or specific figures: nobody working seriously can guarantee that, and anyone who promises it is selling you smoke.\n\nWhat we do guarantee is that you will know what is happening. We measure every month against the starting point and tell you whether it is working or not. If it is not, the report says so, not us.',

  /* los botones y enlaces del asistente */
  'Cotizar esto': 'Get a quote for this',
  'Quiero cotizarlo': 'I want a quote',
  'Me interesa, cotizar': 'I am interested, quote it',
  'Me interesa, hablemos': 'I am interested, let us talk',
  'Me convence, hablemos': 'Sounds good, let us talk',
  'Hablemos de mi caso': 'Let us talk about my case',
  'Quiero algo así': 'I want something like that',
  'Contarles mi caso': 'Tell them my case',
  'Hablar con una persona': 'Talk to a person',
  'Escribir por WhatsApp': 'Message on WhatsApp',
  'Preguntar por WhatsApp': 'Ask on WhatsApp',
  'Abrir WhatsApp ahora': 'Open WhatsApp now',
  'Va, cotizar por WhatsApp': 'Alright, quote it on WhatsApp',
  'Sigo contigo': 'Stay with you',
  'Tengo otra duda': 'I have another question',
  'Tengo una duda': 'I have a question',
  'Antes tengo otra duda': 'First I have another question',
  'Ver otros servicios': 'See other services',
  'Ver la página completa': 'See the full page',
  'Ver el proceso completo': 'See the full process',
  'Ver todo el detalle y el proceso': 'See the full detail and the process',
  'Ver todo el bloque': 'See the whole section',
  'Todos los servicios': 'All services',
  'Servicios de IA': 'AI services',
  'Los tres niveles': 'The three levels',
  'Y los tres niveles según tu punto de partida': 'And the three levels, depending on where you start',
  'Elige por dónde entrar': 'Choose where to come in',
  'Auditoría con IA': 'AI audit',
  'Cómo medimos y qué se entrega': 'How we measure and what gets delivered',
  'Cómo trabajamos y qué prometemos': 'How we work and what we promise',
  'Casos de éxito con resultados': 'Case studies with results',
  'Página de contacto': 'Contact page',
  'Formulario y ubicación': 'Form and location',
  'Dirección y mapa': 'Address and map',
  'Cómo llegar': 'How to get there',
  '¿Cuál me toca? Pregúntame': 'Which one is for me? Ask me',
  '¿Qué incluye?': 'What is included?',
  '← Ver otros grupos': '← See other groups',
  '＋ Añadir mi correo': '＋ Add my email',
  '🌐 Página web': '🌐 Website',
  '🔎 Aparecer en Google': '🔎 Show up on Google',
  '🤖 Aparecer en las IA': '🤖 Show up in the AIs',
  '🤖 Servicios de IA': '🤖 AI services',
  '📣 Publicidad': '📣 Advertising',
  '💬 Hablar con alguien': '💬 Talk to someone',
  '💬 Mejor hablo con alguien': '💬 I would rather talk to someone',

  /* el resumen que el visitante le manda al equipo por WhatsApp */
  'me explicaron que se cotiza por proyecto': 'they explained it is quoted per project',
  'me dijeron que depende del alcance': 'they told me it depends on the scope',
  'me explicaron que miden cada mes': 'they explained they measure every month',
  'ya vi la dirección': 'I already saw the address',
  'ya vi el horario': 'I already saw the hours',
  'ya vi la lista de servicios': 'I already saw the list of services',
  'ya leí a qué se dedican': 'I already read what they do',
  'ya vi los tres niveles': 'I already saw the three levels',
  'ya vi el portafolio': 'I already saw the portfolio',
  'no estaba publicado, queda pendiente': 'it was not published, still pending',
  'queda pendiente confirmarlo': 'still pending confirmation',

  /* ── inicio: listas y escenas ──────────────────────────────────────── */
  'Sin reportes maquillados': 'No dressed-up reports',
  'Sin promesas de humo': 'No smoke and mirrors',
  'Sin gastar por gastar': 'No spending for the sake of it',
  'Cuántos contactos llegaron y a qué costo cada uno':
    'How many leads came in, and what each one cost',
  'De dónde llegan: buscador, campañas, redes y respuestas de IA':
    'Where they come from: search, campaigns, social and AI answers',
  'Dónde se cae la gente entre la visita y la venta':
    'Where people drop off between the visit and the sale',
  'Una auditoría con IA cada mes contra los objetivos de dirección':
    'An AI audit every month against leadership’s objectives',
  'de tráfico orgánico logrado para un cliente en un año':
    'of organic traffic gained for one client in a year',
  'motores de IA donde medimos la presencia de cada cliente':
    'AI engines where we measure every client’s presence',
  'de nuestros clientes con tablero conectado a datos reales':
    'of our clients with a dashboard wired to real data',
  'Cuando alguien te busca, encuentra una empresa seria: presencia cuidada, soporte y todo en orden, por escrito.':
    'When somebody looks you up, they find a serious company: a presence that has been looked after, support, and everything in order, in writing.',
  'No solo Google: también los motores de IA que ya recomiendan proveedores. Casi nadie trabaja esto.':
    'Not just Google: also the AI engines that already recommend suppliers. Almost nobody works on this.',
  'Tablero conectado a datos reales y, cuando tu sistema lo permite, el cruce directo entre campañas y ventas cerradas.':
    'A dashboard wired to real data and, when your system allows it, a direct match between campaigns and closed sales.',
  'Para empresas sin presencia digital. Web veloz que pasa las mediciones de Google, con SEO, AEO y GEO desde el primer día, ficha de Google, LinkedIn y el tablero base.':
    'For companies with no digital presence. A fast site that passes Google’s measurements, with SEO, AEO and GEO from day one, a Google listing, LinkedIn and the starter dashboard.',
  'Para empresas con web y redes mal trabajadas. Empieza con una auditoría que dice exactamente qué está mal, con la evidencia de cada hallazgo.':
    'For companies whose site and social profiles were done badly. It starts with an audit that says exactly what is wrong, with the evidence behind every finding.',
  'Para empresas que ya tienen todo. Estrategia de canales, campañas medidas en un solo tablero y —con ERP— el cruce de prospectos contra ventas cerradas.':
    'For companies that already have everything. Channel strategy, campaigns measured on one dashboard and —with an ERP— leads matched against closed sales.',
  'Un agente que contesta en segundos, pregunta lo que preguntaría tu equipo y pasa la conversación cuando hay intención real de compra.':
    'An agent that answers in seconds, asks what your team would ask and hands the conversation over when there is real intent to buy.',
  'Contesta también fuera de horario': 'Answers outside office hours too',
  'Separa a quien pregunta de quien quiere comprar': 'Separates browsers from buyers',
  'Cada conversación queda en tu tablero': 'Every conversation lands on your dashboard',
  'Prospección y seguimiento con criterio: la IA prepara la lista y el contexto, tu equipo entra a cerrar y no a buscar.':
    'Prospecting and follow-up with judgment: the AI prepares the list and the context, your team comes in to close rather than to search.',
  'Prospección en LinkedIn con criterio, no en frío': 'LinkedIn prospecting with judgment, not cold',
  'Mensajes escritos con el contexto de cada cuenta': 'Messages written with each account’s context',
  'Seguimiento que no se le olvida a nadie': 'Follow-up nobody forgets',
  'Campañas que se corrigen con lo que dicen los datos y contenido producido a ritmo, sin perder el tono de tu marca.':
    'Campaigns corrected by what the data says, and content produced at a steady pace without losing your brand’s tone.',
  'El presupuesto se mueve a lo que sí convierte': 'Budget moves to what actually converts',
  'Contenido a ritmo, con tu tono': 'Content at a steady pace, in your tone',
  'Aviso cuando algo se sale de lo normal': 'An alert when something goes off the rails',
  'Convertir mejor lo que ya llega a tu tienda: recomendaciones que sí aplican y carritos que no se pierden.':
    'Converting what already reaches your store better: recommendations that actually apply, and carts that do not get lost.',
  'Recomendaciones según lo que cada quien ve': 'Recommendations based on what each person looks at',
  'Recuperación de carritos abandonados': 'Abandoned-cart recovery',
  'Precios que responden a la demanda': 'Pricing that responds to demand',
  'Aguascalientes, México': 'Aguascalientes, Mexico',
  'México': 'Mexico',
  'Lo que sostiene todo lo que hacemos.': 'What everything we do rests on.',
  'Agenda una consultoría gratuita y descubre cómo podemos transformar tu negocio con resultados medibles':
    'Book a free consultation and see what we can do for your business, with results you can measure',
  'Automatiza ventas, marketing y atención al cliente con agentes inteligentes que trabajan 24/7. Sin contratar personal, sin aumentar costos. Solo resultados medibles.':
    'Automate sales, marketing and customer support with intelligent agents that work 24/7. No extra hires, no extra cost. Just measurable results.',

  /* ── las escenas animadas ──────────────────────────────────────────── */
  'Posición 1': 'Position 1',
  'Campaña rentable': 'A profitable campaign',
  'Plan de trabajo listo': 'Work plan ready',
  'Antes que tu competencia': 'Ahead of your competition',
  'Un solo número': 'A single number',
  'Con la cuenta hecha': 'With the math done',
  'Te toman en serio': 'They take you seriously',
  'Tu producto': 'Your product',
  'Campañas': 'Campaigns',
  'Ventas': 'Sales',
  'Contactos': 'Leads',
  'Costo por contacto': 'Cost per lead',
  'Retorno': 'Return',
  'Objetivo de dirección: +20% de ventas': 'Leadership objective: +20% in sales',
  'Presupuesto movido a lo que sí convierte': 'Budget moved to what actually converts',
  'Tu reporte del mes está listo': 'Your monthly report is ready',
  'tu tablero': 'your dashboard',
  'Una consulta que llega a las 23:47 y se contesta al momento':
    'An enquiry arriving at 23:47 and answered on the spot',
  'Sí, quedan tres. ¿Te aparto uno para mañana?': 'Yes, three left. Shall I hold one for you for tomorrow?',
  'Contestado en 4 segundos': 'Answered in 4 seconds',
  'Una lista de prospectos que se ordena por probabilidad de cierre':
    'A list of prospects sorting itself by likelihood of closing',
  'Por orden de llegada': 'In order of arrival',
  'Por probabilidad de cierre': 'By likelihood of closing',
  'Constructora del Bajío': 'Bajío Construction',
  'Clínica Santa Fe': 'Santa Fe Clinic',
  'Contacto sin empresa': 'Lead with no company',
  'El presupuesto moviéndose hacia la campaña que sí trae clientes':
    'Budget moving toward the campaign that actually brings customers',
  'Búsqueda · marca': 'Search · brand',
  'Display · genérico': 'Display · generic',
  'Un carrito abandonado que se recupera': 'An abandoned cart being recovered',
  'Se quedó algo en tu carrito. ¿Te lo apartamos?': 'You left something in your cart. Shall we hold it for you?',

  /* ── catálogo de espectaculares ────────────────────────────────────── */
  'espacios': 'spaces',
  'en Aguascalientes,': 'in Aguascalientes,',
  'disponibles': 'available',
  'hoy. Búscalo por calle o por clave, fíltralo por formato y zona, y pídelo por su clave.':
    'today. Search it by street or code, filter it by format and area, and ask for it by its code.',
  'Todos los formatos': 'All formats',
  'Toda la ciudad': 'The whole city',
  'El catálogo no está disponible en este momento. Escríbenos y te pasamos los espacios libres.':
    'The catalog is not available right now. Write to us and we will send you the free spaces.',

  /* la barra de búsqueda y la lista de anuncios */
  'Buscar por clave, calle o colonia…': 'Search by code, street or neighborhood…',
  'Zona': 'Area',
  'Estatus': 'Status',
  'Todo estatus': 'Any status',
  'Todos': 'All',
  'Disponible': 'Available',
  'Ocupado': 'Taken',
  'Resultados': 'Results',
  'Limpiar filtros': 'Clear filters',
  'Solo disponibles': 'Available only',
  'Lista de anuncios': 'Billboard list',
  'Volver a la lista': 'Back to the list',
  'Ningún espacio con esos filtros. Prueba con otra zona, otro formato o limpia la búsqueda.':
    'No space matches those filters. Try another area, another format, or clear the search.',
  'anuncios en esta ubicación': 'billboards at this location',
  'Otros anuncios en esta ubicación': 'Other billboards at this location',
  'Colonia': 'Neighborhood',
  'Medidas': 'Size',
  'Altura': 'Height',
  'Referencia': 'Landmark',
  'COTIZAR ESTE ESPACIO': 'GET A QUOTE FOR THIS SPACE',
  /* Los cinco formatos, como los nombra el inventario. La clave con la que se
     pide el espacio no cambia; esto es solo la etiqueta que se lee. */
  'Cartelera': 'Billboard',
  'Unipolar': 'Unipole',
  'Puente': 'Footbridge',
  'Valla': 'Hoarding',
  'Pantalla': 'LED screen',
  'Acercar': 'Zoom in',
  'Alejar': 'Zoom out',
  'Coordenadas': 'Coordinates',
  'Ver en Maps': 'View on Maps',
  /* el bloque de definicion del encabezado de cada servicio.
     «Leer más» ya estaba mas arriba, no se repite. */
  'Qué es': 'What it is',
  'Leer menos': 'Read less',
  /* la escena del proceso de espectaculares */
  'Zona y flujo': 'Area and traffic',
  'Ficha del sitio': 'Site sheet',
  'Búsquedas de marca': 'Brand searches',
  'Campaña medida': 'Campaign measured',
  /* La ficha tecnica del sitio, como la manda el sistema del proveedor */
  'Ficha técnica': 'Technical sheet',
  'Iluminado': 'Lit',
  'Sin iluminación': 'Not lit',
  'Paneles': 'Panels',
  'Temporizadores': 'Timers',
  'Cimentación': 'Foundation',
  'Reflectores': 'Floodlights',

  /* ── tarjetas NFC: el armado y los planes ──────────────────────────── */
  'Diseño personalizado a tu identidad de marca': 'A design built to your brand identity',
  'Tu logo, tus colores y tu tipografía sobre la tarjeta física. Tú la apruebas antes de que se produzca nada.':
    'Your logo, your colors and your typeface on the physical card. You approve it before anything is produced.',
  'Tu marca, no una plantilla genérica': 'Your brand, not a generic template',
  'Se aplica tu identidad': 'Your identity goes on',
  'Conexión con tu propia página de contacto': 'Linked to a contact page of your own',
  'Creamos tu página de contacto y programamos el chip NFC para que apunte a ella. Tarjeta y página quedan vinculadas.':
    'We build your contact page and program the NFC chip to point at it. Card and page end up linked.',
  'Tu propia página, no un perfil de terceros': 'Your own page, not somebody else’s profile',
  'Tarjeta y página vinculadas': 'Card and page linked',
  'Acércala para compartir': 'Hold it close to share',
  'Acercas la tarjeta a cualquier celular y tu página de contacto se abre al instante. Sin apps y sin escanear códigos.':
    'You hold the card up to any phone and your contact page opens instantly. No apps and no scanning codes.',
  'Compartes en 1 segundo, no en 1 minuto': 'You share in 1 second, not 1 minute',
  'Tu página se abre en su celular': 'Your page opens on their phone',
  'Personaliza cualquier elemento de tu página': 'Customize any part of your page',
  'Cambias colores, botones, enlaces, redes y secciones cuando quieras. La tarjeta física nunca se reimprime.':
    'You change colors, buttons, links, social profiles and sections whenever you like. The physical card is never reprinted.',
  'Editas todo sin reimprimir nada': 'You edit everything without reprinting anything',
  'Se edita en vivo': 'Edited live',
  'Una persona': 'One person',
  'Tu tarjeta, tu página': 'Your card, your page',
  'Tu tarjeta con tu identidad de marca': 'Your card with your brand identity',
  'Tu propia página de contacto editable': 'Your own editable contact page',
  'Ideal para freelancers, consultores y vendedores': 'Ideal for freelancers, consultants and salespeople',
  'Equipos completos': 'Whole teams',
  'Una por cada integrante': 'One for each member',
  'Una tarjeta y una página por persona': 'One card and one page per person',
  'Diseño unificado para toda la empresa': 'A unified design for the whole company',
  'Das de alta o cambias integrantes cuando quieras': 'You add or change members whenever you like',

  /* ── la tarjeta de contacto de cada integrante ─────────────────────── */
  'Guardar mi contacto': 'Save my contact',
  'Se agrega a la agenda de tu celular': 'It goes into your phone’s contacts',
  '¡Guardado!': 'Saved.',
  'Escríbeme por WhatsApp': 'Message me on WhatsApp',
  'Llámame': 'Call me',
  'Mándame un correo': 'Send me an email',
  'Dónde estamos': 'Where we are',
  '¿No se guardó el contacto?': 'Contact did not save?',
  'Algunos celulares no abren el archivo solos, sobre todo si llegaste desde Instagram o Facebook. Con esto lo agregas igual.':
    'Some phones do not open the file on their own, especially if you arrived from Instagram or Facebook. This adds it anyway.',
  'Abrir Contactos con los datos ya puestos': 'Open Contacts with the details filled in',

  /* ── avisos del sistema ────────────────────────────────────────────── */
  'Algo salió mal. Por favor recarga la página.': 'Something went wrong. Please reload the page.',
  'Recargar página': 'Reload page',
  'Tu navegador no soporta videos HTML5.': 'Your browser does not support HTML5 video.',
  'Redirigiendo al menú...': 'Redirecting to the menu…',
  'Redirigiendo al documento...': 'Redirecting to the document…',
  'TODO LO QUE HACEMOS': 'EVERYTHING WE DO',

  /* ── texto suelto del JSX (envuelto en tr(), no viene del panel) ────── */
  'Empezar de nuevo': 'Start over',
  'Empezar por aquí': 'Start here',
  'Cuéntale al asistente qué necesita tu empresa': 'Tell the assistant what your company needs',
  'Compartir esta página': 'Share this page',
  'Cargando el catálogo de espacios…': 'Loading the space catalog…',
  'Mapa de los espacios publicitarios en Aguascalientes':
    'Map of the billboard spaces in Aguascalientes',
  '¿Quién me puede hacer esto en Aguascalientes?': 'Who can do this for me in Aguascalientes?',
  '¿Todavía tienen disponible?': 'Do you still have it available?',
  'Reparto del presupuesto': 'Budget split',
  'Red de inteligencia artificial de Inédito Digital':
    'Inédito Digital artificial intelligence network',
  'ChatGPT, Claude, Gemini, Perplexity y Copilot': 'ChatGPT, Claude, Gemini, Perplexity and Copilot',
  'El tablero en un teléfono': 'The dashboard on a phone',
  'Lun-Vie: 9:00-18:00': 'Mon–Fri: 9:00–18:00',

  /*
   * Iguales en los dos idiomas. Van escritas para que se vea que se revisaron
   * y se decidió dejarlas, no que se olvidaron.
   */
  'Blog': 'Blog',
  'INÉDITO DIGITAL': 'INÉDITO DIGITAL',
  'BLOG': 'BLOG',
  'WhatsApp': 'WhatsApp',
  'TIC TAC TOE': 'TIC TAC TOE',
  'PHOTO OPPORTUNITY': 'PHOTO OPPORTUNITY',
  'ChatGPT': 'ChatGPT',
  'Claude': 'Claude',
  'Google': 'Google',
  'Google Gemini': 'Google Gemini',
  'OpenAI': 'OpenAI',
  'Anthropic': 'Anthropic',
  'Perplexity': 'Perplexity',
  'Copilot': 'Copilot',
  'AI Overviews': 'AI Overviews',

  /* ── páginas de IA con la plantilla de servicio (21-sep-2026) ──────── */
  'El posicionamiento en inteligencia artificial —GEO, por Generative Engine Optimization— es el trabajo de lograr que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta por lo que vendes. Es el equivalente al SEO, pero para las respuestas de los asistentes en vez de la lista de resultados azules.':
    'Generative engine optimization (GEO) is the work of getting ChatGPT, Gemini, Perplexity and Google’s AI summaries to find, understand and correctly quote your business when somebody asks them about what you sell. It is the equivalent of SEO, but for the assistants’ answers instead of the list of blue links.',
  /* las escenas del proceso */
  'Prioridad clara': 'Clear priorities',
  'Presupuesto que rinde': 'Budget that pays off',
  'Abandonado': 'Abandoned',
  'Te guardé tu carrito. ¿Te lo envío hoy?': 'I saved your cart. Want it shipped today?',
  'Venta recuperada': 'Sale recovered',
  '¿A quién me recomiendas en Aguascalientes?': 'Who do you recommend in Aguascalientes?',
  'Tu negocio': 'Your business',
  'Te recomiendan': 'You get recommended',
  /* las columnas del menu de servicios, y su enlace de abajo tal como esta
     publicado (con la flecha; el menu la quita y pinta la suya) */
  'Marketing y presencia digital': 'Marketing and digital presence',
  'Diseño y desarrollo': 'Design and development',
  'Ver todos los servicios →': 'See all services →',
  /* 21-sep: textos cortos que salian en español en la version en ingles
     (lo encontro el barrido con __fugas). Las llaves son el texto publicado. */
  /* / */
  'Los tres niveles de servicio': 'The three service levels',
  'Construir, mejorar o vender: según en qué punto estés':
    'Build, improve or sell: depending on where you stand',
  'Qué está mal en tu presencia digital, con evidencia':
    'What is wrong with your digital presence, backed by evidence',
  'El activo más importante y más descuidado': 'The most important asset, and the most neglected one',
  'SEO, AEO y GEO': 'SEO, AEO and GEO',
  'En qué se diferencian y por qué ya no basta el primero':
    'How they differ, and why the first one is no longer enough',
  /* /servicios */
  'Soluciones digitales integrales que impulsan tu crecimiento con estrategias basadas en resultados':
    'Comprehensive digital solutions that drive your growth with results-driven strategies',
  '¿No sabes cuál te toca? Te lo decimos en 30 segundos.':
    'Not sure which one you need? We will tell you in 30 seconds.',
  /* /servicios-ia */
  'Los servicios de inteligencia artificial aplicada son sistemas que se conectan a la operación real de una empresa —su chat, su catálogo, su lista de prospectos, sus campañas— y se hacen cargo de una parte concreta del trabajo. No son una herramienta que alguien tiene que aprender a usar: son procesos que quedan corriendo.':
    'Applied artificial intelligence services are systems that connect to the real operation of a business —its chat, its catalog, its list of prospects, its campaigns— and take over a specific part of the work. They are not a tool somebody has to learn to use: they are processes that keep running.',
  /* /servicios-ia/whatsapp */
  'Un agente de IA en WhatsApp es un programa que atiende el chat de tu negocio con lenguaje normal: lee lo que te escriben, responde con la información real de tu empresa —precios, horarios, disponibilidad— y pasa la conversación a una persona cuando hace falta. Vive en tu número de siempre, así que el cliente no nota ningún cambio.':
    'An AI agent on WhatsApp is a program that handles your business chat in plain language: it reads what people write to you, answers with your company’s real information —prices, hours, availability— and hands the conversation to a person when needed. It lives on your usual number, so the customer does not notice any change.',
  '¿Mis clientes se van a dar cuenta de que hablan con una IA?':
    'Will my customers realize they are talking to an AI?',
  'Se lo decimos desde el primer mensaje, y es lo correcto: engañar a alguien sobre eso se nota y molesta. Lo que sí notan es que les contestan al instante y con información correcta, que es lo que buscaban. La molestia con los bots viene de los que no resuelven nada, no de saber que es un bot.':
    'We tell them from the first message, and that is the right way to do it: misleading someone about that shows, and it annoys people. What they do notice is getting an instant reply with correct information, which is what they were after. The annoyance with bots comes from the ones that do not solve anything, not from knowing it is a bot.',
  '¿Qué pasa si el agente no sabe responder?': 'What happens if the agent does not know how to answer?',
  'Avisa que lo va a pasar con alguien del equipo y guarda la conversación completa, para que quien llegue no haga repetir todo desde el principio. Definimos contigo los casos en los que debe soltar siempre: reclamos, negociación de precio, o cuando la persona ya quiere comprar.':
    'It lets the customer know it is handing them off to someone on the team and saves the full conversation, so whoever picks it up does not need to make them repeat everything from the start. We define with you the cases where it should always hand off: complaints, price negotiations, or when the person already wants to buy.',
  '¿Se puede usar mi número actual de WhatsApp?': 'Can I use my current WhatsApp number?',
  'Sí, y es lo recomendable — cambiar de número es tirar años de conversaciones y de contactos guardados. Se migra a WhatsApp Business API conservando el mismo número. Durante ese trámite el número queda inactivo unas horas, así que se agenda en horario de baja actividad.':
    'Yes, and it is the recommended path — changing numbers throws away years of conversations and saved contacts. You migrate to the WhatsApp Business API keeping the same number. During that process the number stays inactive for a few hours, so it gets scheduled for a low-traffic time.',
  '¿Cuánto tarda en estar funcionando?': 'How long until it is up and running?',
  'La conexión técnica toma pocos días. Lo que marca el ritmo es reunir tu información: precios vigentes, políticas y las preguntas reales de tus clientes. Con eso a la mano, entre dos y tres semanas está contestando; sin eso, el agente responde en genérico y no vale la pena encenderlo.':
    'The technical connection takes a few days. What sets the pace is gathering your information: current prices, policies and the real questions your customers ask. With that in hand, it is answering within two to three weeks; without it, the agent answers in generic terms and is not worth turning on.',
  /* /servicios-ia/ventas */
  'La IA de ventas es el uso de inteligencia artificial para que un equipo comercial deje de gastar su tiempo en prospectos que nunca iban a comprar. Ordena la lista por probabilidad real, escribe el primer contacto con el dato de cada empresa y sostiene el seguimiento que normalmente se abandona al tercer intento.':
    'AI for sales means using artificial intelligence so a sales team stops spending its time on prospects who were never going to buy. It ranks the list by real probability, drafts the first outreach with the specific data of each company, and keeps up the follow-up that normally gets dropped after the third attempt.',
  '¿Esto reemplaza a mi equipo de ventas?': 'Does this replace my sales team?',
  'No, y quien lo prometa está exagerando. La venta la cierra una persona, sobre todo con ticket alto. Lo que se automatiza es lo que rodea a la venta: buscar datos, redactar el primer contacto, recordar el seguimiento, llenar el CRM. Un vendedor gasta ahí buena parte de su semana.':
    'No, and anyone who promises that is overselling it. A person closes the sale, especially on big-ticket deals. What gets automated is everything around the sale: finding data, drafting the first outreach, remembering to follow up, filling in the CRM. A salesperson spends a good part of their week on exactly that.',
  '¿Necesito tener un CRM antes de empezar?': 'Do I need a CRM before I start?',
  'Ayuda mucho, pero no es obligatorio para arrancar. Se puede empezar con lo que tengas, incluso una hoja de cálculo, y montar el CRM en paralelo. Lo que sí hace falta es que alguien registre lo que pasó con cada prospecto: sin ese dato el sistema no tiene de qué aprender.':
    'It helps a lot, but it is not required to get started. You can begin with whatever you have, even a spreadsheet, and build the CRM in parallel. What you do need is somebody logging what happened with each prospect: without that data, the system has nothing to learn from.',
  '¿Cómo sabe la IA cuáles prospectos son buenos?': 'How does the AI know which prospects are good?',
  'Al principio con reglas que definimos contigo: tamaño de la empresa, giro, comportamiento en el sitio, rapidez de respuesta. Después con tus cierres reales — cuando ya hay unas decenas de ventas y de pérdidas registradas, el criterio deja de ser una suposición y pasa a ser tu historial.':
    'At first with rules we define with you: company size, line of work, on-site behavior, how fast they respond. Later with your actual closed deals — once there are a few dozen recorded wins and losses, the criteria stop being a guess and become your own track record.',
  '¿Los correos automáticos no suenan a robot?': 'Will automated emails sound like a robot?',
  'Los genéricos sí, y por eso no funcionan. El planteamiento aquí es otro: la IA prepara un borrador que menciona algo concreto de esa empresa y el vendedor lo revisa antes de mandarlo. Nadie manda nada sin leerlo. Lo que se gana es velocidad, no permiso para escribir mal.':
    'Generic ones do, and that is why they do not work. The approach here is different: the AI prepares a draft that mentions something specific about that company, and the salesperson reviews it before sending. Nothing goes out unread. What you gain is speed, not a license to write badly.',
  /* /servicios-ia/marketing */
  'La IA aplicada a marketing es usar inteligencia artificial para decidir dónde poner el presupuesto, producir el contenido que hace falta y detectar lo que no está funcionando antes de que se gaste el mes. No es publicar más rápido: es dejar de gastar en lo que no devuelve nada.':
    'AI applied to marketing means using artificial intelligence to decide where to put the budget, produce the content you need and catch what is not working before the month’s budget is gone. It is not about publishing faster: it is about no longer spending on what brings nothing back.',
  '¿La IA va a escribir todo mi contenido?': 'Will AI write all my content?',
  'Puede, y no lo recomendamos. El contenido escrito completo por una IA suena a contenido escrito por una IA, y la gente lo distingue cada vez mejor. Sirve muy bien para producir variantes de un mensaje que ya decidiste, para adaptar un texto a cada canal y para salir del renglón en blanco.':
    'It can, and we do not recommend it. Content written entirely by AI sounds like content written by AI, and people are getting better at spotting it. It works very well for producing variations on a message you already decided on, adapting a text to each channel and getting past a blank page.',
  '¿Sirve si mi presupuesto de publicidad es chico?': 'Does this work if my ad budget is small?',
  'Con presupuestos pequeños la automatización de pujas rinde poco, porque el sistema no junta datos suficientes para aprender. Lo que sí rinde desde el primer mes es medir bien y producir más variantes. Preferimos decirlo antes que vender una optimización que no va a tener de qué alimentarse.':
    'With small budgets, bid automation does not pay off much, because the system does not gather enough data to learn. What does pay off from month one is measuring accurately and producing more variations. We would rather say so upfront than sell you an optimization that will have nothing to run on.',
  '¿Cómo sé si de verdad está funcionando?': 'How do I know it is actually working?',
  'Porque la conversación cambia de tema. Se deja de discutir alcance e impresiones y se empieza a discutir cuánto costó cada cliente y de qué campaña salió. Si a los tres meses el reporte sigue hablando de seguidores, algo se hizo mal.':
    'Because the conversation changes topic. You stop discussing reach and impressions and start discussing what each customer cost and which campaign they came from. If the report is still talking about followers three months in, something went wrong.',
  '¿Qué es eso de aparecer en las respuestas de ChatGPT?':
    'What does it mean to show up in ChatGPT’s answers?',
  'Cuando alguien le pregunta a un asistente por proveedores de tu categoría, la respuesta menciona empresas concretas. Estar o no estar ahí ya mueve clientes, y depende de cosas que se trabajan: que tu sitio sea legible para esos sistemas y que existan menciones tuyas fuera de tu propia página.':
    'When somebody asks an assistant for suppliers in your category, the answer names specific companies. Whether you are on that list or not already moves customers, and it depends on things you can work on: making your site legible to those systems and having mentions of you outside your own page.',
  /* /servicios-ia/ecommerce */
  'La IA para e-commerce es el conjunto de sistemas que trabajan sobre las visitas que tu tienda ya recibe: recomiendan el producto correcto, responden las dudas que frenan la compra y recuperan los carritos abandonados. No traen más gente — hacen que compre más de la que ya está entrando.':
    'AI for e-commerce is the set of systems that work on the visits your store is already getting: they recommend the right product, answer the questions holding back the purchase and recover abandoned carts. They do not bring in more people — they get the people already coming in to buy more.',
  '¿Funciona con mi plataforma actual?': 'Does it work with my current platform?',
  'Con las más usadas —Shopify, WooCommerce, Tiendanube, Magento— la conexión es directa. Con desarrollos a la medida depende de si la tienda permite consultar catálogo e inventario desde fuera; casi siempre se puede, y lo revisamos antes de proponer nada.':
    'With the most popular ones —Shopify, WooCommerce, Tiendanube, Magento— the connection is direct. With custom-built stores, it depends on whether the platform allows outside access to catalog and inventory; it almost always does, and we check before proposing anything.',
  '¿Cuánto puede subir la conversión?': 'How much can this lift conversion?',
  'Depende demasiado del punto de partida como para prometer un número, y desconfía de quien te dé uno sin ver tu tienda. Lo que sí se puede decir es dónde suele estar el margen: en el buscador interno, en las dudas de envío y devolución, y en la recuperación de carritos.':
    'It depends too much on your starting point to promise a number, and you should be wary of anyone who gives you one without seeing your store. What we can say is where the upside usually is: on-site search, shipping and return questions, and cart recovery.',
  '¿Necesito mucho tráfico para que valga la pena?': 'Do I need a lot of traffic for this to be worth it?',
  'Para que las recomendaciones aprendan sí hace falta cierto volumen de visitas y de compras. Pero la atención automática en el chat y la recuperación de carritos rinden desde el primer mes, incluso en tiendas chicas, porque no dependen de aprender: dependen de contestar a tiempo.':
    'For the recommendations to learn, you do need a certain volume of visits and purchases. But automatic chat support and cart recovery pay off from the first month, even in small stores, because they do not depend on learning: they depend on answering on time.',
  '¿El agente puede procesar pedidos completos?': 'Can the agent process complete orders?',
  'Puede tomar el pedido, resolver dudas y llevar a la persona hasta el pago. El cobro se hace en tu pasarela de siempre, no dentro del chat: es más seguro y evita problemas con la conciliación y con las devoluciones.':
    'It can take the order, answer questions and walk the person through to checkout. Payment happens on your usual payment gateway, not inside the chat: it is safer and avoids problems with reconciliation and returns.',
  /* /servicios/activaciones-para-expo */
  'Explora en vivo las activaciones interactivas que podemos implementar en tu stand':
    'Try the interactive activations we can put in your booth, live',
  'Ruleta interactiva totalmente personalizable. Perfecta para sorteos, rifas y dinámicas de gamificación en tu stand.':
    'A fully customizable interactive prize wheel. Perfect for giveaways, raffles and gamification at your booth.',
  'Photobooth con marcos personalizados de tu marca. Captura fotos, compártelas y genera engagement viral en redes sociales.':
    'A photo booth with frames branded as yours. Snap photos, share them and spark viral engagement on social media.',
  'Gato interactivo con premios. Juega contra la IA y gana. Diversión garantizada para atraer visitantes a tu stand.':
    'Interactive tic-tac-toe with prizes. Play the AI and win. Guaranteed fun that pulls visitors into your booth.',
  /* /servicios/linkedin-de-empresa */
  '240 seguidores del sector': '240 industry followers',
  /* El carrusel de opiniones de Google (SeccionResenas) */
  'OPINIONES EN GOOGLE': 'GOOGLE REVIEWS',
  'LO QUE DICEN NUESTROS CLIENTES': 'WHAT OUR CLIENTS SAY',
  'Ver todas en Google': 'See all on Google',
  'opiniones en Google': 'reviews on Google',
  'Cinco estrellas': 'Five stars',
  'Leer completa': 'Read more',
  'Ver menos': 'Show less',
  'Traducida del español': 'Translated from Spanish',
  'Reseña en español': 'Review in Spanish',
  'carrusel': 'carousel',
  'opinión': 'review',
  'Opinión anterior': 'Previous review',
  'Siguiente opinión': 'Next review',
  /* El menú de servicios: el método en tres pasos (data/metodo.ts) */
  'Que te encuentren': 'Get found',
  'En Google y en los asistentes de IA': 'On Google and in AI assistants',
  'Sitio web': 'Website',
  'Rápido, administrable y medido desde el primer día': 'Fast, easy to manage and measured from day one',
  'Posicionamiento en Google': 'Google rankings',
  'Aparecer cuando te buscan': 'Show up when people search for you',
  'Que ChatGPT y Gemini te recomienden': 'Get recommended by ChatGPT and Gemini',
  'Ficha de Google': 'Google Business Profile',
  'Tu negocio completo en el mapa': 'Your whole business on the map',
  'Que te escriban': 'Get contacted',
  'Y que cada mensaje se conteste': 'And have every message answered',
  'Agente de IA para WhatsApp': 'AI agent for WhatsApp',
  'Atiende a toda hora y le pasa el prospecto a tu equipo': 'Answers around the clock and hands the lead to your team',
  'IA de ventas': 'AI for sales',
  'Califica prospectos y les da seguimiento': 'Qualifies leads and follows up',
  'Funnels de venta': 'Sales funnels',
  'Del anuncio a la conversación, sin fugas': 'From ad to conversation, with no leaks',
  'Que te compren': 'Get sales',
  'Y que sepas qué canal vendió': 'And know which channel sold',
  'Google Ads': 'Google Ads',
  'Campañas medidas contra ventas reales': 'Campaigns measured against real sales',
  'ChatGPT Ads': 'ChatGPT Ads',
  'Anúnciate donde tu cliente ya pregunta': 'Advertise where your customer is already asking',
  'Estrategia de canales': 'Channel strategy',
  'Venta directa y marketplaces, en orden': 'Direct sales and marketplaces, in the right order',
  'Tablero de resultados': 'Results dashboard',
  'Todo tu digital en una sola pantalla': 'All your digital on one screen',
  'Empieza aquí': 'Start here',
  'Diagnóstico con IA': 'AI diagnosis',
  'Te decimos qué ven de ti Google y los asistentes de IA, qué está mal y qué arreglar primero. Con evidencia.': 'We tell you what Google and AI assistants see about you, what is wrong and what to fix first. With evidence.',
  'Pedir diagnóstico': 'Request a diagnosis',
  'Un solo sistema en tres pasos: cada paso se mide antes de dar el siguiente.': 'One system in three steps: each step is measured before taking the next.',
  'Trabajamos en tres pasos: que te encuentren, que te escriban y que te compren. ¿Por cuál empezamos?': 'We work in three steps: getting you found, getting you contacted and getting you sales. Where shall we start?',
  'Empieza por saber qué está mal, con evidencia': 'Start by knowing what is wrong, with evidence',
  'Otros servicios': 'Other services',
  'También hacemos esto, casi siempre como parte de un proyecto:': 'We also do this, usually as part of a project:',
  'Elige el que te interese y te cuento:': 'Pick one and I\'ll tell you more:',
  '← Ver los tres pasos': '← See the three steps',
};
