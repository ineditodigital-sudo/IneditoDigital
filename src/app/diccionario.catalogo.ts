/*
 * El catálogo en inglés: los 26 servicios y los casos del portafolio.
 *
 * Va aparte de diccionario.ts por peso. Este archivo solo baja cuando alguien
 * pide inglés, junto con el otro, desde cargarDiccionario(). Un visitante en
 * español no descarga ni un byte de aquí.
 *
 * Las llaves son los textos TAL COMO los sirve el panel, no como están en
 * src/app/data/services.ts: el panel tiene 26 servicios y el archivo del
 * repositorio 17, así que traducir el archivo habría dejado nueve servicios en
 * español. Se extrajeron de lo que render.php inyecta en localStorage.
 *
 * Si el cliente reescribe un servicio desde el panel, esa frase deja de
 * coincidir y sale en español. Es el comportamiento correcto: mejor la frase
 * nueva del cliente en español que la vieja traducida.
 *
 * Lo que NO está aquí: los fullDescription, esos textos de dos mil palabras que
 * viven bajo «EL FONDO DEL ASUNTO». Son 34 000 caracteres más, se escribieron
 * para posicionar en español y un interruptor de cliente no crea páginas
 * indexables en inglés de todos modos. Esos van por el panel cuando toque.
 */

export const CATALOGO: Record<string, string> = {
  /* ── portafolio ────────────────────────────────────────────────────── */
  'Lujo': 'Luxury',
  'Coworking': 'Coworking',
  'Educación': 'Education',
  'Ecommerce': 'E-commerce',
  'Diseño Web': 'Web Design',
  'UX Premium': 'Premium UX',
  'UX Mobile': 'Mobile UX',
  'Chatbot IA': 'AI Chatbot',
  'Bounce Rate': 'Bounce Rate',
  'Menú Digital': 'Digital Menu',
  'Restaurantes': 'Restaurants',
  'SEO Nacional': 'National SEO',
  'SEO Avanzado': 'Advanced SEO',
  'Lead Nurturing': 'Lead Nurturing',
  'SEO optimizado': 'SEO optimized',
  'UX excepcional': 'Exceptional UX',
  'Tasa de Rebote': 'Bounce Rate',
  'Diseño premium': 'Premium design',
  'Diseño Premium': 'Premium Design',
  'Tiempo de Carga': 'Load Time',
  'Lead Generation': 'Lead Generation',
  'Leads Mensuales': 'Monthly Leads',
  'Tiempo Promedio': 'Average Time',
  'Tráfico Orgánico': 'Organic Traffic',
  'Diseño emocional': 'Emotional design',
  'Diseño y Montaje': 'Design and Build',
  'Reservaciones Web': 'Web Reservations',
  'Engagement Mobile': 'Mobile Engagement',
  'Diseño excepcional': 'Exceptional design',
  'Diseño refrescante': 'Refreshing design',
  'Conversión Chatbot': 'Chatbot Conversion',
  'Tasa de Conversión': 'Conversion Rate',
  'Diseño Web Premium': 'Premium Web Design',
  'Experiencia de lujo': 'A luxury experience',
  'Dual-Brand Strategy': 'Dual-Brand Strategy',
  'Lujo & Construcción': 'Luxury & Construction',
  'Posicionamiento SEO': 'SEO Rankings',
  'Diseño vanguardista': 'Cutting-edge design',
  'Diseño Vanguardista': 'Cutting-Edge Design',
  'Mejora en Conversión': 'Conversion Lift',
  'Consultas Premium/Mes': 'Premium Enquiries/Month',
  'Leads Calificados/Mes': 'Qualified Leads/Month',
  'Tiempo de Permanencia': 'Time on Site',
  'Calificación de Leads': 'Lead Scoring',
  'Leads Automáticos/Mes': 'Automated Leads/Month',
  'Marketing de Contenidos': 'Content Marketing',
  'Diseño Web Vanguardista': 'Cutting-Edge Web Design',
  'Inscripciones Digitales': 'Digital Enrollments',
  'Satisfacción de Usuario': 'User Satisfaction',
  'Menú digital optimizado': 'An optimized digital menu',
  'Consultas de Menú Online': 'Online Menu Views',
  'Ticket Promedio Proyecto': 'Average Project Value',
  'Posicionamiento Nacional': 'National Rankings',
  'Optimización de Conversión': 'Conversion Optimization',
  'Experiencia mobile perfecta': 'A flawless mobile experience',
  'Posicionamiento SEO nacional': 'National SEO rankings',
  'Información clara para padres': 'Clear information for parents',
  'XPO SEDDE - Stands que Venden': 'XPO SEDDE - Booths That Sell',
  'Arquitectura dual-brand única': 'A one-of-a-kind dual-brand architecture',
  'Generación de leads constante': 'A steady flow of leads',
  'Chatbot de embudo inteligente': 'An intelligent funnel chatbot',
  'Funcionalidades de venta avanzadas': 'Advanced selling features',
  'EVINCE / KUBERA - Lujo Dual Digital': 'EVINCE / KUBERA - Dual Digital Luxury',
  '1828 BRASA Y CARBÓN - Sabor Digital': '1828 BRASA Y CARBÓN - Digital Flavor',
  'OFITODO - Transformación Digital Total': 'OFITODO - A Complete Digital Overhaul',
  'ALDEA DIGITAL - Espacios de Trabajo del Futuro':
    'ALDEA DIGITAL - Workspaces of the Future',
  'EARLY TIES - Experiencias Acuáticas para Familias':
    'EARLY TIES - Water Experiences for Families',
  'Sitio web emocional y funcional para academia de natación especializada en bebés y niños.':
    'A warm, functional site for a swimming academy specializing in babies and children.',
  'Sitio web gourmet para el restaurante más grande de la Feria Nacional de San Marcos en Aguascalientes.':
    'A gourmet site for the largest restaurant at the Feria Nacional de San Marcos in Aguascalientes.',
  'Plataforma digital robusta para red de espacios coworking con presencia en toda la República Mexicana.':
    'A robust digital platform for a coworking network with locations across Mexico.',
  'Sitio web innovador con chatbot inteligente para empresa líder en diseño y montaje de stands y exposiciones.':
    'An innovative site with an intelligent chatbot for a leading trade show booth design and build company.',
  'XPO SEDDE requería un sitio que destacara visualmente, capturara leads calificados y optimizara el proceso de cotización.':
    'XPO SEDDE needed a site that stood out visually, captured qualified leads and streamlined the quoting process.',
  'Sitio web dual ultra-premium para constructora de albercas de lujo (Evince) y desarrolladora de propiedades exclusivas (Kubera).':
    'An ultra-premium dual site for a luxury pool builder (Evince) and an exclusive property developer (Kubera).',
  'Rediseño completo del sitio web para fabricante líder de muebles de oficina, aumentando ventas online y visibilidad en buscadores.':
    'A complete site redesign for a leading office furniture manufacturer, lifting online sales and search visibility.',
  '1828 necesitaba un sitio que reflejara la calidad de su comida, facilitara la navegación del menú y mejorara la experiencia del cliente.':
    '1828 needed a site that reflected the quality of its food, made the menu easy to navigate and improved the guest experience.',
  'Early Ties necesitaba un sitio que transmitiera confianza a los padres, comunicara su metodología única y facilitara la inscripción de nuevos alumnos.':
    'Early Ties needed a site that reassured parents, explained its distinctive method and made enrolling a new student easy.',
  'OFITODO necesitaba una presencia digital que reflejara la calidad de sus productos y facilitara el proceso de compra para clientes corporativos y minoristas.':
    'OFITODO needed a digital presence that reflected the quality of its products and made buying straightforward for both corporate and retail customers.',
  'Dos marcas hermanas necesitaban presencia digital unificada que mantuviera identidades únicas y comunicara exclusividad a clientela de alto poder adquisitivo.':
    'Two sister brands needed one digital presence that kept their distinct identities and conveyed exclusivity to high-net-worth clients.',
  'ALDEA DIGITAL requería un sitio que comunicara su propuesta de valor premium, facilitara la conversión de visitantes en clientes y se posicionara a nivel nacional.':
    'ALDEA DIGITAL needed a site that conveyed its premium value proposition, turned visitors into customers and ranked nationally.',
  'Creamos un sitio web refrescante con portafolio visual impactante, chatbot de embudo que califica leads automáticamente, arquitectura SEO robusta y sistema de seguimiento de prospectos.':
    'We built a refreshing site with a striking visual portfolio, a funnel chatbot that qualifies leads on its own, solid SEO architecture and a lead tracking system.',
  'Diseñamos una experiencia web cálida y profesional con galerías de momentos especiales, información detallada sobre programas, testimonios de familias y sistema de registro simplificado.':
    'We designed a warm, professional web experience with galleries of special moments, detailed program information, family testimonials and a simplified sign-up system.',
  'Desarrollamos un sitio web premium con menú digital interactivo, galería apetitosa de platillos, sistema de reservaciones y optimización mobile-first perfecta para consulta en el restaurante.':
    'We built a premium site with an interactive digital menu, a mouth-watering dish gallery, a reservation system and mobile-first optimization made for reading at the table.',
  'Creamos una experiencia web inmersiva con tour virtual de espacios, sistema de reservaciones inteligente, SEO multi-localidad y estrategia de conversión basada en datos que captura leads calificados.':
    'We created an immersive web experience with a virtual tour of the spaces, an intelligent booking system, multi-location SEO and a data-driven conversion strategy that captures qualified leads.',
  'Desarrollamos un sitio vanguardista con arquitectura dual-brand, navegación fluida entre marcas, diseño minimalista de ultra-lujo, galerías de proyectos premium y experiencia inmersiva que transmite exclusividad.':
    'We built a cutting-edge site with a dual-brand architecture, fluid navigation between the brands, minimalist ultra-luxury design, premium project galleries and an immersive experience that conveys exclusivity.',
  'Desarrollamos un sitio web de última generación con catálogo optimizado, visualización 3D de productos, sistema de cotizaciones en línea y arquitectura SEO estratégica para dominar búsquedas de "muebles de oficina".':
    'We built a state-of-the-art site with an optimized catalog, 3D product visualization, online quoting and a strategic SEO architecture to own searches for "office furniture".',

  /* ── nombres de servicio y etapas del proceso ──────────────────────── */
  'Brief': 'Brief',
  'IA': 'AI',
  'SEO': 'SEO',
  'Objetivos': 'Objectives',
  'Seguimiento': 'Follow-up',
  'Encaje': 'Fit',
  'Diseño': 'Design',
  'Auditar': 'Audit',
  'Entrega': 'Delivery',
  'Soporte': 'Support',
  'Reseñas': 'Reviews',
  'Montaje': 'Installation',
  'Ajustar': 'Adjust',
  'Eventos': 'Events',
  'Sectores': 'Sectors',
  'Medición': 'Measurement',
  'Conectar': 'Connect',
  'Revisión': 'Review',
  'Conceptos': 'Concepts',
  'Discovery': 'Discovery',
  'Cobertura': 'Coverage',
  'SEO Local': 'Local SEO',
  'Marketing': 'Marketing',
  'Auditoría': 'Audit',
  'Innovación': 'Innovation',
  'Desarrollo': 'Development',
  'Estrategia': 'Strategy',
  'Publicidad': 'Advertising',
  'Corrección': 'Correction',
  'Diagnóstico': 'Diagnostic',
  'Lanzamiento': 'Launch',
  'Crecimiento': 'Growth',
  'Refinamiento': 'Refinement',
  'Setup inicial': 'Initial setup',
  'Prueba chica': 'A small test',
  'Abrir y medir': 'Open it and measure',
  'Objetivo y zona': 'Objective and area',
  'Números primero': 'Numbers first',
  'Personalización': 'Customization',
  'Publicar y medir': 'Publish and measure',
  'Diseño del flujo': 'Flow design',
  'Diseño del funnel': 'Funnel design',
  'Auditar y ajustar': 'Audit and adjust',
  'Cadencia realista': 'A realistic cadence',
  'Conceptualización': 'Concept work',
  'Arte y producción': 'Artwork and production',
  'Entrega y revisión': 'Delivery and review',
  'Armar la atribución': 'Setting up attribution',
  'Selección de sitios': 'Site selection',
  'Conectar las fuentes': 'Connecting the sources',
  'Escalar lo que sirve': 'Scaling what works',
  'Cómo está el terreno': 'How the ground looks',
  'Poner la casa en orden': 'Getting the house in order',
  'Anuncios Espectaculares': 'Billboard Advertising',
  'Qué quiere ver dirección': 'What leadership wants to see',
  'La decisión, con su cuenta': 'The decision, with the math behind it',
  'Investigación': 'Research',
  'Descubrimiento': 'Discovery',
  'Implementación': 'Implementation',

  /* ── categorías y públicos ─────────────────────────────────────────── */
  'Marcas personales': 'Personal brands',
  'Marketing Educativo': 'Education Marketing',
  'Proyectos side hustle': 'Side-hustle projects',
  'Nuevos emprendimientos': 'New ventures',
  'Marketing Inmobiliario': 'Real Estate Marketing',
  'Eventos y conferencias': 'Events and conferences',
  'Shopping para ecommerce': 'Shopping campaigns for e-commerce',
  'Retail y tiendas físicas': 'Retail and brick-and-mortar stores',
  'Restaurantes y cafeterías': 'Restaurants and cafés',
  'Marketing Industrial y B2B': 'Industrial and B2B Marketing',
  'Nuevos negocios y startups': 'New businesses and startups',
  'Marketing Digital en Celaya': 'Digital Marketing in Celaya',
  'Marketing para Restaurantes': 'Marketing for Restaurants',
  'Marketing Digital en Durango': 'Digital Marketing in Durango',
  'Marketing Digital en Guanajuato': 'Digital Marketing in Guanajuato',
  'Agencia de IA en Aguascalientes': 'AI Agency in Aguascalientes',
  'Marketing para E-commerce y Comercio': 'Marketing for E-commerce and Retail',
  'Equipos de ventas saturados': 'Overloaded sales teams',
  'Empresas con material impreso': 'Companies with printed material',
  'Negocios listos para escalar': 'Businesses ready to scale',
  'Negocios altamente competitivos': 'Businesses in crowded markets',
  'Empresas que necesitan rebranding': 'Companies that need a rebrand',
  'Marcas que lanzan nuevos productos': 'Brands launching new products',
  'Negocios con visión a largo plazo': 'Businesses playing the long game',
  'Lanzamientos de productos/servicios': 'Product and service launches',
  'Marcas que quieren dominar su nicho': 'Brands that want to own their niche',
  'Empresas con stands en conferencias': 'Companies with booths at conferences',
  'Marcas que quieren profesionalizarse': 'Brands looking to look the part',
  'Negocios que invierten en publicidad': 'Businesses already spending on advertising',
  'Marcas que buscan destacar en eventos': 'Brands looking to stand out at events',
  'Negocios que necesitan ventas rápidas': 'Businesses that need sales quickly',
  'Negocios que necesitan capturar leads': 'Businesses that need to capture leads',
  'Negocios que necesitan renovar imagen': 'Businesses that need a new image',
  'Empresas con presupuesto de publicidad': 'Companies with an advertising budget',
  'Negocios con alto volumen de consultas': 'Businesses with a high volume of enquiries',
  'Empresas participando en expos y ferias': 'Companies exhibiting at expos and fairs',
  'Empresas con productos/servicios digitales': 'Companies with digital products or services',
  'Emprendedores que quieren escalar su negocio': 'Founders looking to scale their business',
  'Negocios locales en Aguascalientes': 'Local businesses in Aguascalientes',
  'Negocios sin presencia web o con sitios obsoletos':
    'Businesses with no website, or an outdated one',
  'Empresas que pierden ventas fuera de horario': 'Companies losing sales after hours',
  'Marcas que buscan destacar de la competencia': 'Brands looking to stand out from the competition',
  'Empresas que buscan reducir costo de adquisición': 'Companies looking to lower acquisition cost',
  'Empresas B2B con ciclo largo y compra por comité':
    'B2B companies with long cycles and buying committees',
  'Negocios que quieren escalar ventas rápidamente': 'Businesses that want to scale sales quickly',
  'Empresas que necesitan actualizar su imagen digital':
    'Companies that need to refresh their digital image',
  'Negocios con local o con zona de servicio definida':
    'Businesses with premises, or a defined service area',
  'Inmobiliarias, automotrices, salud y educación': 'Real estate, automotive, healthcare and education',
  'Empresas B2B de Celaya con ciclo de venta largo': 'B2B companies in Celaya with long sales cycles',
  'Comercios de Aguascalientes con catálogo amplio': 'Aguascalientes retailers with a broad catalog',
  'Negocios que quieren escalar sin contratar más personal':
    'Businesses that want to scale without hiring more people',
  'Academias, centros de formación y cursos para familias':
    'Academies, training centers and courses for families',
  'Negocios industriales y de servicios profesionales con ciclo de venta largo':
    'Industrial and professional service businesses with long sales cycles',
  'Empresas familiares que quieren ordenar su presencia digital':
    'Family businesses that want to get their digital presence in order',
  'Marcas que ya invierten en digital y no levantan recordación':
    'Brands already spending on digital that are not building recall',
  'Quien tiene web y redes desde hace años sin revisión técnica':
    'Anyone with a site and social profiles years old and never technically reviewed',
  'Negocios que ya reciben visitas y no saben de dónde vienen':
    'Businesses already getting visits and not knowing where they come from',
  'Negocios que reciben pedidos por WhatsApp sin registrarlos':
    'Businesses taking orders on WhatsApp without recording them',
  'Empresas que ya invierten en digital y no saben qué está funcionando':
    'Companies already spending on digital with no idea what is working',
  'Negocios que invierten en redes y no ven resultados atribuibles':
    'Businesses spending on social with no attributable results',
  'Colegios y escuelas de Aguascalientes con ciclos de inscripción':
    'Schools in Aguascalientes with enrollment cycles',
  'Grupos con varias sucursales que necesitan comparar entre ellas':
    'Groups with several locations that need to compare them',
  'Inmobiliarias que invierten en portales sin comparar resultados':
    'Real estate firms spending on portals without comparing results',
  'Quien aparece en Maps con la dirección o el horario equivocados':
    'Anyone showing on Maps with the wrong address or hours',
  'Agentes inmobiliarios, asesores y vendedores en eventos y ferias':
    'Real estate agents, advisors and salespeople at events and fairs',
  'Equipos comerciales que comparten contacto y portafolio al vuelo':
    'Sales teams sharing contact details and portfolio on the move',
  'Emprendedores y freelancers que hacen networking constantemente':
    'Founders and freelancers who network constantly',
  'Restaurantes y bares de Aguascalientes que viven del cliente local':
    'Restaurants and bars in Aguascalientes that live on local customers',
  'Comercios y servicios que reciben clientes por WhatsApp sin medirlo':
    'Shops and services taking customers on WhatsApp without measuring it',
  'Proveeduría automotriz y metalmecánica de Aguascalientes y el Bajío':
    'Automotive and metalworking suppliers in Aguascalientes and the Bajío',
  'Empresas que quieren reforzar su imagen de marca en cada interacción':
    'Companies looking to reinforce their brand in every interaction',
  'Empresas que ya invierten en digital y arman el reporte a mano cada mes':
    'Companies already spending on digital and assembling the report by hand every month',
  'Instituciones que llenan formularios y no saben cuántos se inscriben':
    'Institutions collecting form submissions with no idea how many enroll',
  'Negocios cuya categoría la gente ya le pregunta a ChatGPT o Perplexity':
    'Businesses in a category people already ask ChatGPT or Perplexity about',
  'Quien tiene el perfil creado desde hace años y sin tocar desde entonces':
    'Anyone whose profile was created years ago and untouched since',
  'Negocios de Irapuato, Salamanca, Pénjamo, Abasolo y municipios del Bajío':
    'Businesses in Irapuato, Salamanca, Pénjamo, Abasolo and other Bajío towns',
  'Consultores y profesionales que actualizan su información con frecuencia':
    'Consultants and professionals who update their details often',
  'Empresas B2B que quieren dejar de depender de dos o tres clientes grandes':
    'B2B companies that want to stop depending on two or three big clients',
  'Negocios con ERP que nunca han cruzado sus campañas contra facturación real':
    'Businesses with an ERP that have never matched campaigns against real invoicing',
  'Fabricantes y distribuidores que se preguntan si abrir Mercado Libre o Amazon':
    'Manufacturers and distributors wondering whether to open on Mercado Libre or Amazon',
  'Empresas que le venden a otras empresas y prospectan por correo o por teléfono':
    'Companies that sell to other companies and prospect by email or phone',
  'Empresas de Aguascalientes que ya invierten en digital y no saben qué les regresa':
    'Aguascalientes companies already spending on digital with no idea what comes back',
  'Quien quiere ser el primero de su categoría en la ciudad y no el último en enterarse':
    'Anyone who wants to be first in their category in the city, not the last to find out',
  'Empresas cuya ficha lleva años sin que nadie la toque':
    'Companies whose listing has gone years without anyone touching it',
  'Manufactura que quiere abrir mercado fuera del estado':
    'Manufacturers looking to open markets outside the state',
  'Negocios con buena comida y ficha de Google abandonada':
    'Businesses with good food and a neglected Google listing',
  'Desarrolladoras y comercializadoras de Aguascalientes':
    'Developers and sales agencies in Aguascalientes',
  'Tiendas que venden en marketplaces sin comparar márgenes':
    'Stores selling on marketplaces without comparing margins',
  'Negocios locales que compiten por zona en Aguascalientes':
    'Local businesses competing by area in Aguascalientes',
  'Negocios que ya probaron un canal, no funcionó, y no saben si fue el canal o la ejecución':
    'Businesses that tried a channel, it did not work, and do not know whether it was the channel or the execution',
  'Negocios cuyo comprador investiga antes de decidir: servicios profesionales, industria, B2B':
    'Businesses whose buyer researches before deciding: professional services, industry, B2B',
  'Empresas que ya invierten en Google Ads o Meta y quieren probar un canal nuevo sin apostar el presupuesto':
    'Companies already spending on Google Ads or Meta that want to try a new channel without betting the budget',
  'Empresas de Durango sin agencia local que trabaje con medición':
    'Companies in Durango with no local agency that works with measurement',
  'Proyectos de ticket alto donde la presencia sostiene el precio':
    'High-ticket projects where presence holds up the price',
  'Proveeduría industrial y metalmecánica del corredor del Bajío':
    'Industrial and metalworking suppliers along the Bajío corridor',
  'Dirección que quiere números antes de aprobar presupuesto':
    'Leadership that wants numbers before approving a budget',
  'Dirección que quiere números antes de aprobar el presupuesto del año':
    'Leadership that wants numbers before approving the year’s budget',
  'Dirección que quiere decidir presupuesto con datos y hoy decide con impresiones':
    'Leadership that wants to set budgets on data and today decides on impressions',

  /* ── lo que incluye cada servicio, y lo que gana el cliente ────────── */
  'Propiedad 100% tuya': 'Yours, 100%',
  'A/B testing integrado': 'Built-in A/B testing',
  'Auditoría SEO completa': 'A full SEO audit',
  'Link building de calidad': 'Quality link building',
  'Destaca de la competencia': 'Stand out from the competition',
  'Aumenta el valor percibido': 'Raises perceived value',
  'ROI medible y transparente': 'Measurable, transparent ROI',
  'Identidad visual memorable': 'A memorable visual identity',
  'Estrategia de contenido SEO': 'An SEO content strategy',
  'Solo pagas por clics reales': 'You only pay for real clicks',
  'Thank you pages con upsells': 'Thank-you pages with upsells',
  'Guía de voz y tono de marca': 'A brand voice and tone guide',
  'Guía básica de uso del logo': 'A basic guide to using the logo',
  'Posiciona tu marca en Google': 'Puts your brand on Google',
  'Construye autoridad de marca': 'Builds brand authority',
  'Naming y estrategia de marca': 'Naming and brand strategy',
  'Primera impresión profesional': 'A professional first impression',
  'Múltiples conceptos creativos': 'Several creative concepts',
  'Photobooth interactivo con RA': 'An interactive AR photo booth',
  'Páginas de captura optimizadas': 'Optimized capture pages',
  'Optimización on-page y técnica': 'On-page and technical optimization',
  'Mejora experiencia del cliente': 'Improves the customer experience',
  'Manual de identidad corporativa': 'A corporate identity manual',
  'Paleta de colores y tipografías': 'A color palette and typefaces',
  'YouTube Ads para alcance masivo': 'YouTube Ads for mass reach',
  'Velocidad de carga ultrarrápida': 'Blistering load speed',
  'Analítica geográfica y temporal': 'Analytics by place and time',
  'Revisiones ilimitadas incluidas': 'Unlimited revisions included',
  'Aumenta conversiones hasta 300%': 'Lifts conversions by up to 300%',
  'Pantallas táctiles interactivas': 'Interactive touch screens',
  'Automatiza tu proceso de ventas': 'Automates your sales process',
  'Versiones en todos los formatos': 'Versions in every format',
  'Calificación automática de leads': 'Automatic lead scoring',
  'Campañas de búsqueda optimizadas': 'Tuned search campaigns',
  'Landing pages de alta conversión': 'High-converting landing pages',
  'Optimización SEO desde el código': 'SEO optimization from the code up',
  'Versatilidad en todos los medios': 'Works across every medium',
  'Aplicaciones en diferentes medios': 'Applications across different media',
  'Atiende clientes mientras duermes': 'Serves customers while you sleep',
  'Consistencia en todos tus canales': 'Consistency across all your channels',
  'ROI superior a largo plazo vs ads': 'Better long-term ROI than ads',
  'Actualiza destinos sin reimprimir': 'Change destinations without reprinting',
  'Resultados inmediatos desde día 1': 'Results from day one',
  'Captura la atención de visitantes': 'Catches visitors’ attention',
  'Panel de administración intuitivo': 'An admin panel that makes sense',
  'Display y remarketing estratégico': 'Strategic display and remarketing',
  'Aumenta tasa de respuesta al 100%': 'Takes the response rate to 100%',
  'Gestión de presupuesto inteligente': 'Smart budget management',
  'Sistemas de gamificación y trivias': 'Gamification and trivia systems',
  'Experiencias de realidad aumentada': 'Augmented reality experiences',
  'Ahorra tiempo con automatizaciones': 'Saves time through automation',
  'Velocidad real medida, no estimada': 'Real measured speed, not estimated',
  'Genera confianza y profesionalismo': 'Builds trust and looks professional',
  'Diseños personalizados con tu marca': 'Custom designs carrying your brand',
  'Variantes en color y monocromáticas': 'Color and monochrome variants',
  'Optimización de conversiones con IA': 'AI-driven conversion optimization',
  'Registro digital y captura de leads': 'Digital sign-in and lead capture',
  'Mide cada paso del customer journey': 'Measures every step of the customer journey',
  'Reduce costos de personal hasta 70%': 'Cuts staffing costs by up to 70%',
  'Auditoría mensual con IA, sin jerga': 'A monthly AI audit, with no jargon',
  'Tracking de escaneos en tiempo real': 'Real-time scan tracking',
  'Convierte más visitantes en clientes': 'Turns more visitors into customers',
  'Investigación de marca y competencia': 'Brand and competitor research',
  'Recuperación de carritos abandonados': 'Abandoned-cart recovery',
  'Mide efectividad de material impreso': 'Measures how printed material performs',
  'Reclamación y verificación del perfil': 'Claiming and verifying the profile',
  'Margen por canal, no solo facturación': 'Margin by channel, not just revenue',
  'Seguimiento con píxeles de conversión': 'Tracking with conversion pixels',
  'Campañas por zona y por etapa escolar': 'Campaigns by area and by school stage',
  'Reportes mensuales de posicionamiento': 'Monthly ranking reports',
  'Diferencia tu marca de la competencia': 'Sets your brand apart from the competition',
  'Genera engagement genuino y memorable': 'Creates genuine, memorable engagement',
  'QR dinámicos editables sin reimprimir': 'Dynamic QR codes, editable without reprinting',
  'Seguridad y certificados SSL incluidos': 'Security and SSL certificates included',
  'Aumenta el ticket promedio con upsells': 'Raises the average order value with upsells',
  'Estado de indexación página por página': 'Indexing status, page by page',
  'Investigación de mercado y competencia': 'Market and competitor research',
  'Fotos propias del negocio, no de banco': 'The business’s own photos, not stock',
  'Mejora tu presencia digital profesional': 'Improves your professional digital presence',
  'Tráfico calificado y gratuito constante': 'A steady stream of qualified, free traffic',
  'Conecta offline con online sin fricción': 'Connects offline to online without friction',
  'Captura datos de prospectos calificados': 'Captures qualified prospect data',
  'Respuestas automáticas inteligentes 24/7': 'Intelligent automatic answers, 24/7',
  'Integración con herramientas de marketing': 'Integration with your marketing tools',
  'Investigación de palabras clave rentables': 'Research into keywords that pay',
  'Transferencia a humano cuando se necesita': 'Handover to a person when it is needed',
  'Conexión con tu propia página de contacto': 'Linked to a contact page of your own',
  'Rutina de reseñas con tus clientes reales': 'A review routine with your real customers',
  'Múltiples destinos (web, vCard, WiFi, PDF)': 'Multiple destinations (web, vCard, WiFi, PDF)',
  'Analítica de conversaciones en tiempo real': 'Real-time conversation analytics',
  'Aperturas, mudanzas y cambios de domicilio': 'Openings, moves and address changes',
  'Prospección con criterio, no envíos en frío': 'Prospecting with judgment, not cold blasts',
  'Junta mensual de dirección por videollamada': 'A monthly leadership meeting over video',
  'Personaliza cualquier elemento de tu página': 'Customize any element of your page',
  'Secuencias de email marketing automatizadas': 'Automated email marketing sequences',
  'Aparece en las primeras posiciones de Google': 'Shows in the top positions on Google',
  'Captura leads que perderías fuera de horario': 'Captures leads you would lose after hours',
  'Reseñas contestadas todas, también las malas': 'Every review answered, the bad ones too',
  'Diseño personalizado a tu identidad de marca': 'A design built to your brand identity',
  'Configuramos tracking y destinos inteligentes': 'We set up tracking and smart destinations',
  'Diseño responsive para todos los dispositivos': 'Responsive design for every device',
  'Integración con WhatsApp, Facebook, Instagram': 'Integration with WhatsApp, Facebook and Instagram',
  'Entrenamiento personalizado con tu información': 'Custom training on your own information',
  'Desarrollamos 3 propuestas creativas diferentes': 'We develop three different creative proposals',
  'Sabes qué producto y qué canal conviene empujar': 'You know which product and which channel to push',
  'Categoría principal y secundarias bien elegidas': 'A primary category and secondaries, well chosen',
  'Creamos landing pages, emails y automatizaciones': 'We build landing pages, emails and automations',
  'Creamos anuncios persuasivos y lanzamos campañas': 'We write persuasive ads and launch the campaigns',
  'Medición de cuántos contactos llegan y por dónde': 'A count of how many leads arrive and through where',
  'Conectamos con tus canales y herramientas de CRM': 'We connect your channels and CRM tools',
  'Horario, servicios y zona de cobertura completos': 'Complete hours, services and service area',
  'Sabes qué parte de tus pedidos empezó en digital': 'You know how much of your order flow started in digital',
  'El único medio que no se puede bloquear ni saltar': 'The one medium nobody can block or skip',
  'Monitoreamos escaneos y optimizamos la estrategia': 'We monitor scans and tune the strategy',
  'Respuesta inmediata a la duda que frena la compra': 'An immediate answer to the doubt holding up the purchase',
  'Diseño personalizado con tu marca, logo y colores': 'A custom design with your brand, logo and colors',
  'WhatsApp que responde y no deja a nadie esperando': 'A WhatsApp that answers and leaves nobody waiting',
  'Pulimos el concepto elegido hasta tu satisfacción': 'We refine the chosen concept until you are happy',
  'Sabes qué está roto antes de gastar en arreglarlo': 'You know what is broken before spending to fix it',
  'Estructuramos cada etapa del embudo de conversión': 'We structure every stage of the conversion funnel',
  'Campañas de temporada con fecha de arranque clara': 'Seasonal campaigns with a clear start date',
  'Tablero con los contactos que llegan y a qué costo': 'A dashboard with the leads arriving and what they cost',
  'Creamos contenido y construimos autoridad mes a mes': 'We create content and build authority month by month',
  'Creamos QRs personalizados alineados a tu identidad': 'We create custom QR codes aligned to your identity',
  'Se repite cada mes, así que se ve si mejora o si no': 'It repeats every month, so you see whether it improves or not',
  'Recomendaciones según lo que cada quien está viendo': 'Recommendations based on what each person is looking at',
  'Automatización comercial conectada a un solo tablero': 'Sales automation wired to a single dashboard',
  'Campañas por antojo y por zona, no por rango de edad': 'Campaigns by craving and by area, not by age bracket',
  'Pulimos el concepto seleccionado hasta la perfección': 'We refine the selected concept to perfection',
  'Calificación automática con las preguntas del asesor': 'Automatic qualification using the advisor’s own questions',
  'Agente de IA para el pico de preguntas de admisiones': 'An AI agent for the admissions question peak',
  'Medición hasta la inscripción, no hasta el formulario': 'Measured through to enrollment, not to the form',
  'Ficha de Google y consistencia de datos entre fuentes': 'A Google listing, and consistent details across sources',
  'Dejas de pagar publicaciones que nadie sabe si sirven': 'You stop paying for posts nobody knows work',
  'Reposición del material sin costo si el clima lo daña': 'Free replacement if the weather damages the material',
  'Proporcionamos archivos finales en todos los formatos': 'We supply the final files in every format',
  'Presencia diaria ante la misma gente, por acumulación': 'Daily presence with the same people, by accumulation',
  'Sabes el costo real por cita y por venta, no por clic': 'You know the real cost per appointment and per sale, not per click',
  'Ficha de Google con reseñas contestadas y fotos reales': 'A Google listing with reviews answered and real photos',
  'Nadie que pregunta se queda sin respuesta en hora pico': 'Nobody who asks goes unanswered at peak hour',
  'Comprendemos tu marca, valores y preferencias estéticas': 'We get to know your brand, values and aesthetic preferences',
  'Tus datos coinciden en Google, tu web y los directorios': 'Your details match on Google, your site and the directories',
  'Definimos keywords objetivo y plan de acción trimestral': 'We define target keywords and a quarterly action plan',
  'Creamos el árbol de decisiones y respuestas del chatbot': 'We build the chatbot’s decision tree and answers',
  'LinkedIn de empresa trabajado, que es donde está el B2B': 'A company LinkedIn actually worked on, which is where B2B lives',
  'Entendemos tu visión, valores y posicionamiento deseado': 'We understand your vision, values and desired positioning',
  'El mismo presupuesto rinde más que en un canal saturado': 'The same budget goes further than in a crowded channel',
  'Adaptamos la activación a tu marca, colores e identidad': 'We adapt the activation to your brand, colors and identity',
  'Ficha de Google activa para cuando te buscan por nombre': 'An active Google listing for when people search you by name',
  'Estudiamos tus conversaciones actuales y flujos de venta': 'We study your current conversations and sales flows',
  'Ajustamos pujas, audiencias y creatividades semanalmente': 'We adjust bids, audiences and creative every week',
  'Calendario alineado a las ventanas reales de inscripción': 'A calendar aligned to the real enrollment windows',
  'Medición de en cuántas respuestas de IA aparece tu marca': 'A count of how many AI answers your brand appears in',
  'Analizamos datos y mejoramos continuamente la conversión': 'We analyze the data and keep improving conversion',
  'Definimos objetivos y puntos de contacto óptimos para QR': 'We define objectives and the best touchpoints for QR',
  'Configuramos tracking, audiencias y estructura de cuenta': 'We set up tracking, audiences and account structure',
  'Conviertes mejor lo que ya llega, sin subir la inversión': 'You convert what already arrives better, without spending more',
  'Ninguna familia se queda sin respuesta en temporada alta': 'No family goes unanswered in peak season',
  'Comparación real entre portales, campañas y canal directo': 'A real comparison between portals, campaigns and direct',
  'Dejas de escalar el canal que factura pero no deja margen': 'You stop scaling the channel that bills but leaves no margin',
  'Compites por contratos grandes con una imagen a la altura': 'You compete for big contracts with an image to match',
  'Sabes cuánto cuesta llenar una mesa y por qué canal llega': 'You know what it costs to fill a table and which channel brings it',
  'Una primera impresión moderna y memorable en cada reunión': 'A modern, memorable first impression in every meeting',
  'Operación 100% a distancia, sin diferencia en el servicio': 'Fully remote operation, with no difference in the service',
  'Tablero abierto: lo consultas cuando quieras, no lo pides': 'An open dashboard: you check it whenever, you do not request it',
  'Montamos y configuramos todo en tu stand antes del evento': 'We set everything up in your booth before the event',
  'Medición de solicitudes de cotización y de dónde vinieron': 'A count of quote requests and where they came from',
  'Programamos y entrenamos la IA con tu base de conocimiento': 'We program and train the AI on your knowledge base',
  'Comparte tu contacto en segundos, sin escribir nada a mano': 'Share your contact in seconds, typing nothing by hand',
  'Auditoría mensual con IA contra los objetivos de dirección': 'A monthly AI audit against leadership’s objectives',
  'Cero reimpresiones ni cajas de tarjetas viejas en el cajón': 'No reprints, and no boxes of outdated cards in a drawer',
  'Analizamos tu sitio actual y la competencia en profundidad': 'We analyze your current site and the competition in depth',
  'Seguimiento que no se le olvida a nadie en ciclos de meses': 'Follow-up nobody forgets, over cycles that last months',
  'Personaliza cualquier elemento de tu página cuando quieras': 'Customize any element of your page whenever you like',
  'LinkedIn de empresa trabajado con constancia, no abandonado': 'A company LinkedIn worked on consistently, not abandoned',
  'Analizamos keywords, competencia y oportunidades de mercado': 'We analyze keywords, competitors and market openings',
  'Dejas de pagar por prospectos que tu equipo no puede cerrar': 'You stop paying for prospects your team cannot close',
  'Medición de llamadas, mensajes y reservas, no de seguidores': 'We measure calls, messages and bookings, not followers',
  'Sale un plan de trabajo priorizado, no un PDF para archivar': 'You get a prioritized work plan, not a PDF to file away',
  'Perfil de enlaces entrantes: cuántos dominios y de qué tipo': 'A backlink profile: how many domains, and of what kind',
  'Publicaciones y respuestas a las preguntas que deja la gente': 'Posts, and answers to the questions people leave',
  'Sitio que carga rápido en teléfono, que es como te van a ver': 'A site that loads fast on a phone, which is how they will see you',
  'Cuando hay ERP, cruce de prospectos contra ventas facturadas': 'When there is an ERP, leads matched against invoiced sales',
  'Presencia que aguanta la revisión de un comprador industrial': 'A presence that stands up to an industrial buyer’s scrutiny',
  'Presencia que aguanta la revisión de un comprador profesional': 'A presence that stands up to a professional buyer’s scrutiny',
  'Proporcionamos manual de marca completo y todos los archivos': 'We supply a full brand manual and all the files',
  'Publicamos, capacitamos y monitoreamos el rendimiento inicial': 'We publish, train your team and watch the early performance',
  'Recuperas las ventas que hoy se caen por falta de seguimiento': 'You recover the sales lost today for lack of follow-up',
  'Campañas medidas contra contactos y ventas, no contra alcance': 'Campaigns measured against leads and sales, not reach',
  'Definimos objetivos, avatar del cliente y oferta irresistible': 'We define objectives, the customer profile and an offer worth taking',
  'Mejoramos aspectos técnicos, contenido y estructura del sitio': 'We improve the technical side, the content and the site structure',
  'Definimos objetivos, tipo de activación y experiencia deseada': 'We define objectives, the type of activation and the experience you want',
  'Compruebas el trabajo con datos, no con reportes de confianza': 'You verify the work with data, not with reports you have to trust',
  'Posicionarte cuesta menos donde hay menos competencia digital': 'Ranking costs less where there is less digital competition',
  'La dirección discute qué hacer, no de dónde salió cada número': 'Leadership argues about what to do, not where each number came from',
  'Para una sola persona o para equipos completos: nos adaptamos': 'For one person or for whole teams: we adapt',
  'Un toque con el celular abre tu página de contacto al instante': 'One tap with a phone opens your contact page instantly',
  'Dejas de perder al cliente que escribió y no recibió respuesta': 'You stop losing the customer who wrote and got no answer',
  'Sabes qué campaña trajo alumnos inscritos y cuál solo curiosos': 'You know which campaign brought enrolled students and which just onlookers',
  'Auditoría inicial que muestra el estado real antes de contratar':
    'An initial audit showing the real state of things before you hire anyone',
  'Creamos mockups profesionales alineados a tu identidad de marca':
    'We create professional mockups aligned to your brand identity',
  'Agentes de IA que atienden WhatsApp y califican a quien escribe':
    'AI agents that handle WhatsApp and qualify whoever writes',
  'Estrategia de canales: marketplace, tienda propia o combinación':
    'Channel strategy: marketplace, your own store, or both',
  'Dejas de invertir a ciegas: cada peso queda medido contra ventas':
    'You stop spending blind: every peso is measured against sales',
  'Auditoría mensual hecha con IA contra los objetivos de dirección':
    'A monthly audit done with AI against leadership’s objectives',
  'Agente de IA que responde dudas y toma reservas fuera de horario':
    'An AI agent that answers questions and takes bookings after hours',
  'Apareces cuando alguien decide dónde comer, que es cuando importa':
    'You show up when somebody is deciding where to eat, which is when it counts',
  'Las reseñas son la señal de confianza local más rápida que existe':
    'Reviews are the fastest local trust signal there is',
  'Programamos tu sitio con las mejores tecnologías y optimizaciones':
    'We build your site with the best technology and optimizations',
  'Brindamos soporte técnico durante todo el evento y análisis final':
    'We provide technical support throughout the event, and a final analysis',
  'Compites con las plazas grandes sin pagar precios de plaza grande':
    'You compete with the big malls without paying big-mall prices',
  'Gastas el presupuesto cuando las familias deciden, no todo el año':
    'You spend the budget when families decide, not all year round',
  'Generamos múltiples conceptos creativos alineados a tu estrategia':
    'We generate several creative concepts aligned to your strategy',
  'Incluye tu propia página de contacto, siempre disponible en línea':
    'Includes a contact page of your own, always available online',
  'La discusión familiar sobre qué funciona se resuelve con un número':
    'The family argument about what works is settled with a number',
  'Cada hallazgo trae la evidencia que lo sustenta y cómo comprobarla':
    'Every finding comes with the evidence behind it and how to verify it',
  'Ficha de Google trabajada: fotos reales, menú, horarios y festivos':
    'A Google listing properly worked: real photos, menu, hours and holidays',
  'Espacios regularizados: sin riesgo de clausura con tu marca puesta':
    'Permitted sites: no risk of a shutdown with your brand on it',
  'Nadie que pregunta se queda sin respuesta, tampoco fuera de horario':
    'Nobody who asks goes unanswered, not even after hours',
  'Campañas corregidas con lo que dicen los datos, no con la corazonada':
    'Campaigns corrected by what the data says, not by a hunch',
  'Apareces primero en tu ciudad, donde casi nadie está trabajando esto':
    'You show up first in your city, where almost nobody is working on this',
  'Las IA leen la ficha cuando les preguntan por proveedores de tu zona':
    'The AIs read the listing when asked about suppliers in your area',
  'Funciona con cualquier smartphone moderno, sin descargar ninguna app':
    'Works with any modern smartphone, with no app to download',
  'Medición del embudo entero: prospecto, cita, apartado y escrituración':
    'The whole funnel measured: lead, appointment, reservation and closing',
  'Impresión en gran formato con tintas UV y montaje en 48 horas hábiles':
    'Large-format printing with UV inks, installed within 48 business hours',
  'Medición de crecimiento y de qué publicaciones traen visitas al sitio':
    'Growth measured, and which posts bring visits to the site',
  'Contenido técnico: procesos, capacidades y certificaciones a la vista':
    'Technical content: processes, capabilities and certifications in plain view',
  'Tu tarjeta física nunca cambia: actualizas el contenido cuando quieras':
    'Your physical card never changes: you update the content whenever you like',
  'Sabes cuántas cotizaciones vinieron de digital y cuánto costó cada una':
    'You know how many quotes came from digital and what each one cost',
  'Garantía de exhibición: monitoreo, mantenimiento y verificación 24/365':
    'A display guarantee: monitoring, maintenance and verification, 24/365',
  'Qué responden hoy ChatGPT, Claude, Gemini y Perplexity sobre tu empresa':
    'What ChatGPT, Claude, Gemini and Perplexity say about your company today',
  'Presencia que sostiene el ticket: si vendes caro, tienes que verte caro':
    'A presence that holds the price: if you sell expensive, you have to look it',
  'Tu empresa aparece cuando alguien le pregunta a una IA por tu categoría':
    'Your company shows up when somebody asks an AI about your category',
  'Campañas de Google Ads y Meta en la misma pantalla, comparables entre sí':
    'Google Ads and Meta campaigns on the same screen, comparable side by side',
  'Consultores y profesionales que actualizan su información con frecuencia.':
    'Consultants and professionals who update their details often.',
  'Tu empresa se ve seria cuando el comprador te investiga antes de cotizar':
    'Your company looks serious when the buyer researches you before quoting',
  'Análisis de qué está haciendo tu competencia en cada canal y a qué precio':
    'An analysis of what your competition is doing in each channel, and at what price',
  'La cotización llega a ti en lugar de irse al proveedor que sí se ve serio':
    'The quote request comes to you instead of going to the supplier who looks the part',
  'Apareces en el bloque de mapas, que sale antes que los resultados normales':
    'You appear in the map block, which shows above the normal results',
  'Ficha de Google trabajada: fotos, horario, servicios y reseñas contestadas':
    'A Google listing properly worked: photos, hours, services and reviews answered',
  'Dejas de gastar publicidad empujando por un canal que tu margen no aguanta':
    'You stop spending on advertising pushing a channel your margin cannot carry',
  'Carteleras, unipolares, puentes peatonales, vallas y pantallas digitales LED':
    'Billboards, unipoles, pedestrian bridges, street-level panels and LED screens',
  'Revisión con Claude contra los objetivos de dirección, no contra corazonadas':
    'A review with Claude against leadership’s objectives, not against hunches',
  'Selección del sitio por flujo vehicular y ángulo de lectura, no por catálogo':
    'Sites chosen by traffic flow and reading angle, not from a catalog',
  'Medición de la campaña: número propio, página de destino y búsquedas de marca':
    'The campaign measured: a dedicated number, a landing page and branded searches',
  'Cruce de prospectos contra ventas cerradas, para clientes con ERP de Maindsoft':
    'Leads matched against closed sales, for clients on a Maindsoft ERP',
  'Creamos tu página de contacto y programamos el chip NFC para que apunte a ella':
    'We build your contact page and program the NFC chip to point at it',
  'Sabes cuánto te deja de verdad una venta en marketplace, ya con todo descontado':
    'You know what a marketplace sale really leaves you, with everything deducted',
  'Cuando el comprador te investiga antes de contestar, encuentra una empresa activa':
    'When the buyer researches you before replying, they find an active company',
  'Analizamos tu negocio, objetivos y competencia para crear una estrategia ganadora':
    'We study your business, objectives and competition to build a strategy that wins',
  'Definición de qué se mide para saber en tres meses si la decisión fue la correcta':
    'Defining what gets measured, so in three months you know whether the decision was right',
  'Entras cuando el espacio todavía es barato, no cuando ya lo encarecieron los demás':
    'You come in while the space is still cheap, not after everyone else has driven the price up',
  'Acercas la tarjeta a cualquier celular y tu página de contacto se abre al instante':
    'You hold the card up to any phone and your contact page opens instantly',
  'Vinculación del equipo, para que quien te busque por una persona llegue a la empresa':
    'Team members linked, so anyone searching for a person lands on the company',
  'Medición en el mismo tablero que Google Ads y Meta, para poder compararlos de verdad':
    'Measured on the same dashboard as Google Ads and Meta, so they can really be compared',
  'Tu equipo comercial deja de prospectar desde un perfil que no respalda lo que promete':
    'Your sales team stops prospecting from a profile that does not back up what it promises',
  'El costo por contacto de cada canal, lado a lado, para mover presupuesto con criterio':
    'The cost per lead of each channel, side by side, so budget moves with judgment',
  'Revisión de tu producto, tu margen y tu capacidad de surtido antes de recomendar nada':
    'A review of your product, your margin and your ability to supply before recommending anything',
  'Cálculo de lo que deja cada canal ya con comisiones, envíos y devoluciones descontados':
    'A calculation of what each channel leaves once fees, shipping and returns are deducted',
  'Aprendes el canal antes que tu competencia, que es una ventaja que no se compra después':
    'You learn the channel before your competition, and that head start cannot be bought later',
  'Presupuesto arrancando en pruebas chicas, y se sube solo lo que demuestra que convierte':
    'Budget starting on small tests, and only what proves it converts gets scaled',
  'Dirección ve el mismo número que marketing, y se acaba la discusión sobre de dónde salió':
    'Leadership sees the same number as marketing, and the argument about where it came from ends',
  'Conectado a tu tráfico: sesiones, canales de origen y qué hace la gente dentro del sitio':
    'Wired to your traffic: sessions, source channels and what people do inside the site',
  'Es de los pocos lugares donde el contenido técnico llega directo a quien decide la compra':
    'One of the few places technical content reaches the person who decides the purchase',
  'Alta y configuración de la cuenta publicitaria, con la facturación a nombre de tu empresa':
    'Ad account setup and configuration, with billing in your company’s name',
  'Se ve dónde se cae la gente en el camino, que casi siempre vale más que traer más tráfico':
    'You see where people drop off along the way, which is almost always worth more than more traffic',
  'El equipo comercial y la web se preparan para el canal correcto y no para los dos a medias':
    'The sales team and the site get ready for the right channel, not for both by halves',
  'Revisamos ficha técnica por punto: flujo, sentido, ángulo de lectura e impactos estimados.':
    'We review the spec sheet for each site: traffic, direction, reading angle and estimated impressions.',
  'Definición de a quién le hablamos: qué preguntas hace tu comprador cuando busca lo que vendes':
    'Defining who we are talking to: what your buyer asks when looking for what you sell',
  'Cambias colores, botones, enlaces, redes y secciones cuando quieras, sin reimprimir la tarjeta':
    'You change colors, buttons, links, social profiles and sections whenever you like, with no reprint',
  'Aparecer donde tu comprador ya está preguntando, en vez de esperar a que teclee en un buscador':
    'Showing up where your buyer is already asking, instead of waiting for them to type into a search box',
  'Los datos consistentes entre web, ficha de Google y LinkedIn refuerzan tu presencia en búsqueda':
    'Consistent details across your site, Google listing and LinkedIn strengthen your presence in search',
  'Tu presencia, tus campañas y tus contactos quedan en un tablero que consultas desde donde estés.':
    'Your presence, your campaigns and your leads end up on a dashboard you can check from anywhere.',
  'Revisión mensual con Claude contra los objetivos que puso dirección, no contra métricas de vanidad':
    'A monthly review with Claude against the objectives leadership set, not against vanity metrics',
  'Tu logo, tus colores y tu tipografía sobre la tarjeta física. Tú la apruebas antes de producir nada':
    'Your logo, your colors and your typeface on the physical card. You approve it before anything is produced',
  'Redacción de los anuncios y de la página a la que llegan, que casi siempre es la mitad del resultado':
    'Writing the ads and the page they land on, which is almost always half the result',
  'La decisión queda escrita y con números, así que se puede revisar y no se vuelve a discutir cada junta':
    'The decision is written down with numbers behind it, so it can be revisited instead of re-argued every meeting',
  'Coherencia con el resto de tu presencia, porque los datos disparejos entre perfiles restan en búsqueda local':
    'Coherence with the rest of your presence, because mismatched details across profiles cost you in local search',
  'Conectado a las búsquedas: posiciones, consultas que te traen gente y estado de indexación página por página':
    'Wired to search: rankings, the queries bringing you people, and indexing status page by page',
  'Calendario de publicaciones sostenible, pensado para tu ritmo real y no para uno que se abandona en tres semanas':
    'A publishing calendar you can sustain, built for your real pace and not one abandoned in three weeks',
  'Contenido a partir de lo que ya sabes hacer: proyectos, procesos y respuestas a lo que te preguntan los clientes':
    'Content from what you already know how to do: projects, processes and answers to what customers ask you',
  'Perfil completo y datos idénticos a los de tu web y tu ficha de Google. Esta parte se hace una vez y rinde siempre.':
    'A complete profile with details identical to your site and your Google listing. This part is done once and pays forever.',
  'Perfil completo: portada, descripción, servicios, ubicación y datos que coinciden con los de tu web y tu ficha de Google':
    'A complete profile: cover, description, services, location and details that match your site and your Google listing',
  'SEO, AEO y GEO revisados por separado': 'SEO, AEO and GEO reviewed separately',
  'Encuestas y votaciones en tiempo real': 'Live polls and voting',
  'Alcanza clientes en momento de compra': 'Reaches customers at the moment of purchase',
  'QR para pagos y propinas': 'QR codes for payments and tips',
  'Se sabe qué trajo, no se contrata a ciegas': 'You know what it brought; nobody hires blind',
  'Reporte mensual que se genera desde el mismo tablero y llega en PDF a quien tú digas':
    'A monthly report generated from the same dashboard and sent as a PDF to whoever you say',
  'La auditoría con IA se actualiza sobre estos datos: el diagnóstico deja de ser una foto vieja':
    'The AI audit updates on this data: the diagnostic stops being an old snapshot',
  'Plan de apertura del canal elegido, con lo que hay que preparar antes del primer peso de pauta':
    'A plan to open the chosen channel, with what has to be ready before the first peso of ad spend',
  'Medición de recomendación por IA: en cuántas respuestas de ChatGPT, Claude, Gemini y Perplexity aparece tu marca':
    'AI recommendation measured: how many ChatGPT, Claude, Gemini and Perplexity answers your brand appears in',

  /* ── preguntas frecuentes de cada servicio ─────────────────────────── */
  '¿Los QR expiran?': 'Do QR codes expire?',
  '¿Los datos son míos?': 'Is the data mine?',
  '¿Necesito tener ERP?': 'Do I need an ERP?',
  '¿Qué formatos recibo?': 'What formats do I get?',
  '¿En cuánto se ve algo?': 'How soon does something show?',
  '¿Qué es un QR dinámico?': 'What is a dynamic QR code?',
  '¿Qué ROI puedo esperar?': 'What ROI can I expect?',
  '¿Cuál es el plazo mínimo?': 'What is the minimum term?',
  '¿Cuánto tarda en notarse?': 'How long until it shows?',
  '¿Cuánto tarda la decisión?': 'How long does the decision take?',
  '¿Cada cuánto se actualiza?': 'How often is it updated?',
  '¿Es un reporte automático?': 'Is it an automated report?',
  '¿El sitio será responsive?': 'Will the site be responsive?',
  '¿Se pueden comprar reseñas?': 'Can reviews be bought?',
  '¿Incluye hosting y dominio?': 'Does it include hosting and a domain?',
  '¿Qué es la ficha de Google?': 'What is a Google Business Profile?',
  '¿Incluye el equipo técnico?': 'Is the equipment included?',
  '¿Necesito tener tráfico ya?': 'Do I need traffic already?',
  '¿Qué se entrega exactamente?': 'What exactly gets delivered?',
  '¿Los espacios están en regla?': 'Are the sites properly permitted?',
  '¿Van a publicar por nosotros?': 'Will you post on our behalf?',
  '¿Cuántos seguidores necesito?': 'How many followers do I need?',
  '¿Qué archivos recibo al final?': 'What files do I get at the end?',
  '¿Incluye el registro de marca?': 'Does it include trademark registration?',
  '¿Esto reemplaza la publicidad?': 'Does this replace advertising?',
  '¿Cuánto tarda en estar puesto?': 'How long until it is up?',
  '¿Cuánto cobran por la gestión?': 'What do you charge to manage it?',
  '¿Se integra con mi CRM actual?': 'Does it work with my current CRM?',
  '¿Qué hago con las reseñas malas?': 'What do I do about bad reviews?',
  '¿Cada cuánto conviene repetirla?': 'How often is it worth repeating?',
  '¿El chatbot puede vender por mí?': 'Can the chatbot sell for me?',
  '¿Puedo ver quién escanea mis QR?': 'Can I see who scans my QR codes?',
  '¿Qué incluye el servicio mensual?': 'What does the monthly service include?',
  '¿Incluye las secuencias de email?': 'Are the email sequences included?',
  '¿Se puede ver antes de contratar?': 'Can I see it before signing up?',
  '¿Cuánto tiempo toma implementarlo?': 'How long does it take to implement?',
  '¿Atienden fuera de Aguascalientes?': 'Do you work outside Aguascalientes?',
  '¿Cuánto tiempo toma crear un logo?': 'How long does it take to create a logo?',
  '¿Por qué mis prospectos no compran?': 'Why are my prospects not buying?',
  '¿Cuánto tiempo toma ver resultados?': 'How long until I see results?',
  '¿Cuánto tiempo antes debo contratar?': 'How far ahead should I book?',
  '¿Cuánto tarda en verse el resultado?': 'How long until the result shows?',
  '¿Cuánto debo invertir en Google Ads?': 'How much should I put into Google Ads?',
  '¿Por qué insisten tanto en LinkedIn?': 'Why do you insist so much on LinkedIn?',
  '¿Esto es solo para empresas grandes?': 'Is this only for large companies?',
  '¿Cómo compruebo que están avanzando?': 'How do I verify you are making progress?',
  '¿Una IA puede atender a las familias?': 'Can an AI handle families?',
  '¿Cuántas propuestas de logo recibiré?': 'How many logo proposals will I get?',
  '¿Funcionan para menús de restaurantes?': 'Do they work for restaurant menus?',
  '¿Es más caro por estar en otro estado?': 'Does it cost more because I am in another state?',
  '¿Qué pasa si el bot no sabe responder?': 'What happens if the bot cannot answer?',
  '¿Qué tasa de conversión puedo esperar?': 'What conversion rate can I expect?',
  '¿Trabajan SEO local en Aguascalientes?': 'Do you do local SEO in Aguascalientes?',
  '¿Cómo sé que no estoy pagando por nada?': 'How do I know I am not paying for nothing?',
  '¿Garantizan primera posición en Google?': 'Do you guarantee the top spot on Google?',
  '¿Qué hago con los carritos abandonados?': 'What do I do about abandoned carts?',
  '¿Ustedes venden en marketplaces por mí?': 'Do you sell on marketplaces for me?',
  '¿Puedo actualizar el contenido yo mismo?': 'Can I update the content myself?',
  '¿Pueden atender a una empresa de Celaya?': 'Can you work with a company in Celaya?',
  '¿Pueden auditar sin acceso a mis cuentas?': 'Can you audit without access to my accounts?',
  '¿Y si mi producto no da para marketplace?': 'What if my product cannot carry a marketplace?',
  '¿Puedo usar mi plataforma de email actual?': 'Can I use my current email platform?',
  '¿Puede una IA tomar reservas por WhatsApp?': 'Can an AI take reservations on WhatsApp?',
  '¿Y si mi competencia no hace nada de esto?': 'What if my competition does none of this?',
  '¿Qué formatos hay y en qué se diferencian?': 'What formats are there, and how do they differ?',
  '¿Qué agencias de IA hay en Aguascalientes?': 'Which AI agencies are there in Aguascalientes?',
  '¿Trabajan con negocios fuera de la capital?': 'Do you work with businesses outside the capital?',
  '¿Ya está disponible para cualquier empresa?': 'Is it available to any company yet?',
  '¿Cómo se mide algo que se cierra en planta?': 'How do you measure something that closes at the plant?',
  '¿Cómo sé que están trabajando si no los veo?': 'How do I know you are working if I cannot see you?',
  '¿Puedo cambiar el diseño a mitad de campaña?': 'Can I change the artwork mid-campaign?',
  '¿Sirve si no tengo local abierto al público?': 'Does it work if I have no premises open to the public?',
  '¿Cuánto tiempo toma desarrollar un sitio web?': 'How long does it take to build a website?',
  '¿Hacen aplicaciones como tarjetas, papelería?': 'Do you do applications like cards and stationery?',
  '¿Puedo solicitar cambios después de entregar?': 'Can I request changes after delivery?',
  '¿Cuánto hay que invertir para saber si sirve?': 'How much do I need to spend to know if it works?',
  '¿Es lo mismo que salir recomendado en ChatGPT?': 'Is it the same as being recommended in ChatGPT?',
  '¿Hacen campañas en Facebook/Instagram también?': 'Do you run Facebook and Instagram campaigns too?',
  '¿Conviene contratar una agencia de otro estado?': 'Is it wise to hire an agency from another state?',
  '¿Puedo ver los datos capturados en tiempo real?': 'Can I see the captured data in real time?',
  '¿Cómo sé si la campaña trajo alumnos de verdad?': 'How do I know the campaign actually brought students?',
  '¿Las ventas por WhatsApp también se pueden medir?': 'Can WhatsApp sales be measured too?',
  '¿Cuándo debo empezar la campaña de inscripciones?': 'When should the enrollment campaign start?',
  '¿Es una agencia de IA o una agencia de marketing?': 'Is it an AI agency or a marketing agency?',
  '¿Cómo califica una IA a un prospecto inmobiliario?': 'How does an AI qualify a real estate lead?',
  '¿Cuál es la mejor agencia de IA en Aguascalientes?': 'Which is the best AI agency in Aguascalientes?',
  '¿Cuál es la diferencia con el servicio de Branding?': 'How is this different from the Branding service?',
  '¿Sirve más la ficha de Google o las redes sociales?': 'Which is worth more, the Google listing or social media?',
  '¿Esto sirve para un negocio pequeño de mi municipio?': 'Does this work for a small business in my town?',
  '¿Conviene vender en Mercado Libre o en tienda propia?': 'Is it better to sell on Mercado Libre or in my own store?',
  '¿Pueden garantizar que ChatGPT recomiende mi empresa?': 'Can you guarantee ChatGPT will recommend my company?',
  '¿Sirve esto para una empresa industrial que vende B2B?': 'Does this work for an industrial company selling B2B?',
  '¿Qué pasa si hay problemas técnicos durante el evento?': 'What if there are technical problems during the event?',
  '¿Cuánto cuesta rentar un espectacular en Aguascalientes?': 'What does renting a billboard in Aguascalientes cost?',
  '¿Qué pasa si la lona se rompe por el viento o la lluvia?': 'What if the banner tears in the wind or the rain?',
  '¿Sirve el marketing digital si vendo a comités de compras?': 'Does digital marketing work if I sell to buying committees?',
  '¿Funciona para una sola propiedad o solo para desarrollos?': 'Does it work for a single property, or only for developments?',
  '¿Sirve si mi empresa es industrial y no vende por internet?': 'Does it work if my company is industrial and does not sell online?',
  '¿Qué pasa si mi dirección aparece distinta en varios sitios?': 'What if my address appears differently in several places?',
  '¿Cómo sé si funcionó, si nadie hace clic en un espectacular?': 'How do I know it worked, if nobody clicks a billboard?',
  '¿Qué diferencia hay entre usar ChatGPT por mi cuenta y contratar una agencia de IA?':
    'What is the difference between using ChatGPT myself and hiring an AI agency?',

  /* ── las respuestas ────────────────────────────────────────────────── */
  'Se repite cada mes contra la foto anterior, para saber qué cambió y qué no.':
    'It repeats every month against the previous snapshot, so you know what changed and what did not.',
  'Cada hallazgo con su evidencia, su severidad y el esfuerzo que cuesta arreglarlo.':
    'Every finding with its evidence, its severity and the effort it takes to fix.',
  'No, nuestros QRs dinámicos son permanentes mientras mantengas el servicio activo.':
    'No. Our dynamic QR codes are permanent for as long as you keep the service active.',
  'Montamos la rutina para pedirlas a clientes reales, sin comprarlas ni inventarlas.':
    'We set up a routine for asking real customers, with nothing bought or invented.',
  'Se corrige con lo que dice el dato: el presupuesto se mueve a lo que sí convierte.':
    'It is corrected by what the data says: budget moves to what actually converts.',
  'Tu presencia, tus campañas y tus ventas quedan en un solo tablero con datos reales.':
    'Your presence, your campaigns and your sales end up on one dashboard with real data.',
  'Revisamos qué muestra hoy tu ficha y dónde no coincide con tu web y los directorios.':
    'We review what your listing shows today and where it does not match your site and the directories.',
  'Número propio, página de destino y seguimiento de búsquedas de marca antes y después.':
    'A dedicated number, a landing page and tracking of branded searches before and after.',
  'Cada mes: cuántas veces apareciste, cuántos pidieron indicaciones y cuántos llamaron.':
    'Every month: how many times you appeared, how many asked for directions and how many called.',
  'Sí, incluimos el diseño y configuración de toda la secuencia de emails automatizados.':
    'Yes. We include the design and setup of the entire automated email sequence.',
  'Definimos a quién hay que alcanzar y por dónde se mueve, antes de mirar un solo sitio.':
    'We define who needs reaching and where they move, before looking at a single site.',
  'Diseñamos para leerse en cinco segundos e imprimimos con tintas UV. Montaje en 48 horas.':
    'We design it to be read in five seconds and print with UV inks. Installed within 48 hours.',
  'Sí, manejamos todas las plataformas publicitarias principales con estrategias integradas.':
    'Yes. We handle every major ad platform with integrated strategies.',
  'Absolutamente. Incluimos un panel de administración fácil de usar y capacitación completa.':
    'Absolutely. We include an admin panel that is easy to use, plus full training.',
  'Conectamos Search Console y Analytics y medimos. Nada de estimaciones donde se puede medir.':
    'We connect Search Console and Analytics and measure. No estimates where something can be measured.',
  'Datos, categorías, horario, zona y fotos. Todo lo que Google usa para decidir si te muestra.':
    'Details, categories, hours, area and photos. Everything Google uses to decide whether to show you.',
  'Sí, podemos integrarlo con la mayoría de CRMs populares como HubSpot, Salesforce, Zoho, etc.':
    'Yes. We can integrate it with most popular CRMs: HubSpot, Salesforce, Zoho and others.',
  'Sí, son perfectos para menús digitales. Puedes actualizar precios y platillos sin reimprimir.':
    'Yes, they are perfect for digital menus. You can update prices and dishes without reprinting.',
  'Aproximadamente 1-2 semanas, dependiendo de la cantidad de revisiones y feedback de tu parte.':
    'Roughly 1–2 weeks, depending on how many rounds of revisions and feedback come from your side.',
  'Sí, trabajamos con las principales plataformas como Mailchimp, ActiveCampaign, ConvertKit, etc.':
    'Yes, we work with the main platforms: Mailchimp, ActiveCampaign, ConvertKit and others.',
  'Un chatbot básico puede estar listo en 1-2 semanas. Agentes más complejos requieren 3-4 semanas.':
    'A basic chatbot can be ready in 1–2 weeks. More complex agents take 3–4 weeks.',
  'Sí, todos nuestros sitios están optimizados para verse perfectos en móviles, tablets y escritorio.':
    'Yes. Every site we build is optimized to look right on phones, tablets and desktop.',
  'Cada mes una IA revisa el desempeño contra esos objetivos y entrega los hallazgos con su evidencia.':
    'Every month an AI reviews performance against those objectives and delivers the findings with their evidence.',
  'Primero preguntamos qué quiere lograr la dirección. Sin eso, una auditoría es una lista de opiniones.':
    'First we ask what leadership wants to achieve. Without that, an audit is a list of opinions.',
  'Presencia, campañas y contactos quedan en un solo tablero con datos reales, no en capturas de pantalla.':
    'Presence, campaigns and leads end up on one dashboard with real data, not in screenshots.',
  'El sistema detecta cuando necesita ayuda humana y transfiere la conversación a tu equipo automáticamente.':
    'The system detects when it needs a person and hands the conversation to your team automatically.',
  'Cada mes una IA revisa el desempeño contra esos objetivos y el presupuesto se mueve a lo que sí convierte.':
    'Every month an AI reviews performance against those objectives, and budget moves to what actually converts.',
  'Recibes archivos vectoriales (AI, EPS, SVG, PDF) y rasterizados (PNG transparente, JPG) en alta resolución.':
    'You get vector files (AI, EPS, SVG, PDF) and raster files (transparent PNG, JPG) at high resolution.',
  'La dirección define qué quiere lograr y en qué plazo. Sin eso, cualquier reporte es una lista de opiniones.':
    'Leadership defines what to achieve and by when. Without that, any report is a list of opinions.',
  'Sí, incluimos todo el hardware necesario: tablets, pantallas, cámaras, etc. según la activación contratada.':
    'Yes. We include all the hardware needed: tablets, screens, cameras and so on, depending on the activation.',
  'Sí, está diseñado para calificar leads, responder objeciones, agendar citas y cerrar ventas automáticamente.':
    'Yes. It is built to qualify leads, answer objections, book appointments and close sales on its own.',
  'La dirección define qué quiere lograr y en qué plazo. Sin eso, cualquier medición es una lista de opiniones.':
    'Leadership defines what to achieve and by when. Without that, any measurement is a list of opinions.',
  'Proporcionamos soporte técnico presencial o remoto durante todo el evento para resolver cualquier incidencia.':
    'We provide technical support, on site or remote, throughout the event to resolve anything that comes up.',
  'Sí, tendrás acceso a un dashboard para ver leads, participaciones y métricas en tiempo real durante el evento.':
    'Yes. You get a dashboard to watch leads, participation and metrics in real time during the event.',
  'No incluye el trámite legal, pero te asesoramos en el proceso y te conectamos con especialistas si lo necesitas.':
    'The legal filing is not included, but we walk you through the process and put you in touch with specialists if you need them.',
  'Medimos qué encuentra hoy quien te busca, qué está haciendo tu competencia y dónde se está yendo el presupuesto.':
    'We measure what somebody looking for you finds today, what your competition is doing and where the budget is going.',
  'Sí, podemos incluir diseño de papelería, tarjetas, templates de redes sociales, etc. según el paquete contratado.':
    'Yes. We can include stationery, cards and social media templates, depending on the package.',
  'Se sube el presupuesto solo en lo que ya demostró costo por contacto razonable, y se apaga lo demás sin discusión.':
    'Budget only goes up on what has already shown a reasonable cost per lead; the rest is switched off, no argument.',
  'Las revisiones ilimitadas son durante el proceso. Después de la entrega final, los cambios tienen costo adicional.':
    'Unlimited revisions apply during the process. After final delivery, changes carry an additional cost.',
  'Idealmente 2-3 semanas antes del evento para personalización completa. Podemos atender urgencias con menos tiempo.':
    'Ideally 2–3 weeks before the event for full customization. We can handle rush jobs with less notice.',
  'Para empresas de Durango que quieren presencia digital medible y no tienen cerca una agencia que trabaje con datos.':
    'For companies in Durango that want measurable digital presence and have no nearby agency working with data.',
  'Optimizaciones técnicas, creación de contenido, link building, monitoreo de posiciones y reporte mensual detallado.':
    'Technical work, content creation, link building, rank monitoring and a detailed monthly report.',
  'Primero medimos qué tienes hoy: qué encuentra quien te busca, qué ve tu competencia y dónde se está yendo el dinero.':
    'First we measure what you have today: what somebody looking for you finds, what your competition sees and where the money is going.',
  'Presentamos 3 conceptos iniciales diferentes. Luego refinamos el concepto seleccionado con hasta 3 rondas de ajustes.':
    'We present three different initial concepts. Then we refine the chosen one over up to three rounds of adjustments.',
  'Contenido que sale de tu operación, con revisión mensual de crecimiento y de qué publicaciones trajeron gente al sitio.':
    'Content that comes out of your operation, with a monthly review of growth and of which posts brought people to the site.',
  'Puedes ver estadísticas como ubicación, fecha, hora y dispositivo, pero no datos personales específicos por privacidad.':
    'You can see statistics like location, date, time and device, but no specific personal data, for privacy reasons.',
  'Depende de tu industria y ciclo de venta. Nuestros clientes promedian 3:1 a 8:1 de retorno sobre inversión publicitaria.':
    'It depends on your industry and sales cycle. Our clients average 3:1 to 8:1 return on ad spend.',
  'Presupuesto acotado y varias versiones del mensaje. La meta de las primeras semanas es aprender qué funciona, no vender.':
    'A capped budget and several versions of the message. The goal of the first few weeks is to learn what works, not to sell.',
  'Idealmente sí. El funnel optimiza el tráfico que llega. Podemos ayudarte también con estrategias de generación de tráfico.':
    'Ideally, yes. The funnel optimizes the traffic that arrives. We can also help with strategies to generate that traffic.',
  'Marketing digital medible para empresas de Celaya y del corredor industrial del Bajío, con auditoría mensual hecha con IA.':
    'Measurable digital marketing for companies in Celaya and the Bajío industrial corridor, with a monthly audit done using AI.',
  'Antes de gastar un peso revisamos si tu comprador le pregunta esto a una IA. Si no, te lo decimos y nos vamos a otro canal.':
    'Before spending a peso we check whether your buyer actually asks an AI about this. If they do not, we say so and move to another channel.',
  'Qué venden tus competidores en cada canal, a qué precio y con qué reputación. En marketplace eso se puede ver, y dice mucho.':
    'What your competitors sell in each channel, at what price and with what reputation. On a marketplace that is visible, and it says a lot.',
  'Sí, somos expertos en SEO local. Optimizamos Google My Business y estrategias específicas para aparecer en búsquedas locales.':
    'Yes, local SEO is our specialty. We optimize the Google Business Profile and run strategies aimed at local search.',
  'La dirección define qué quiere lograr y en qué plazo, en unidades del negocio: reservas, cotizaciones, ventas o inscripciones.':
    'Leadership defines what to achieve and by when, in the units of the business: bookings, quotes, sales or enrollments.',
  'Para inmobiliarias y desarrollos: dejar de pagar por prospectos que no compran y saber cuánto cuesta de verdad una escrituración.':
    'For real estate firms and developments: stop paying for prospects who never buy, and find out what a closing really costs.',
  'Depende de tu industria y tráfico, pero nuestros funnels promedian 15-25% de conversión en landing pages y 3-8% en ventas finales.':
    'It depends on your industry and traffic, but our funnels average 15–25% conversion on landing pages and 3–8% on final sales.',
  'Nuestro fee de gestión es del 15-20% del gasto publicitario, con mínimo de $200 USD/mes. Incluye optimización continua y reportes.':
    'Our management fee is 15–20% of ad spend, with a USD $200/month minimum. It includes ongoing optimization and reporting.',
  'Los primeros resultados se ven entre 3-6 meses. El SEO es una estrategia de mediano a largo plazo que genera resultados compuestos.':
    'The first results show in 3–6 months. SEO is a medium- to long-term strategy whose results compound.',
  'Espectaculares, unipolares, puentes y pantallas LED en Aguascalientes: elegimos el punto por flujo y lo medimos, no por foto bonita.':
    'Billboards, unipoles, bridges and LED screens in Aguascalientes: we pick the site by traffic flow and measure it, not by a nice photo.',
  'Qué tienes hoy y qué encuentra alguien que te busca: perfil, equipo vinculado, última señal de vida y qué muestran tus competidores.':
    'What you have today and what somebody looking for you finds: the profile, linked team, last sign of life and what your competitors show.',
  'Para restaurantes y bares: que te encuentren con hambre, que la ficha de Google trabaje a tu favor y que cada reserva quede contada.':
    'For restaurants and bars: get found by hungry people, make the Google listing work for you, and have every booking counted.',
  'Para escuelas, academias y centros de formación: llenar el ciclo de inscripción y saber cuánto costó cada alumno que sí se inscribió.':
    'For schools, academies and training centers: fill the enrollment cycle and know what each student who actually enrolled cost.',
  'Te asesoramos en la contratación y podemos gestionar el hosting por ti. El primer año de dominio puede estar incluido según el paquete.':
    'We advise you on buying them and can manage hosting for you. The first year of the domain may be included, depending on the package.',
  'Plan de arranque con lo que hay que preparar antes de pautar, y los indicadores que van a decir en tres meses si se sigue o se corrige.':
    'A start plan with what has to be ready before running ads, and the indicators that will say in three months whether to continue or correct.',
  'Te entregamos el acceso y el reporte mensual automático. Cada mes, Claude revisa el desempeño contra los objetivos y señala qué cambiar.':
    'We hand you the access and the automatic monthly report. Every month, Claude reviews performance against the objectives and points out what to change.',
  'Search Console, Analytics, las cuentas de campañas y, cuando aplica, el ERP. Todo con permisos de solo lectura y a nombre de tu empresa.':
    'Search Console, Analytics, the campaign accounts and, where applicable, the ERP. All with read-only permissions, in your company’s name.',
  'Margen real por producto, capacidad de surtido y costo de servir a un cliente. Sin esto, cualquier recomendación de canal es una opinión.':
    'Real margin per product, ability to supply and the cost of serving a customer. Without these, any channel recommendation is an opinion.',
  'Sí. Google permite perfiles de "zona de servicio" para negocios que van al cliente. Se oculta la dirección y se declara el área que cubres.':
    'Yes. Google allows "service area" profiles for businesses that travel to the customer. The address is hidden and you declare the area you cover.',
  'Primero definimos los tres o cuatro números que de verdad se van a usar para decidir. Un tablero con cuarenta métricas no se mira dos veces.':
    'First we settle on the three or four numbers that will actually be used to decide. A dashboard with forty metrics never gets looked at twice.',
  'Para tiendas y comercios: saber qué canal deja margen de verdad, si conviene marketplace o tienda propia, y convertir mejor lo que ya llega.':
    'For shops and retailers: know which channel really leaves margin, whether a marketplace or your own store makes sense, and convert what already arrives better.',
  'Entregas todos los archivos del logo en formatos vectoriales (AI, EPS, SVG, PDF) y rasterizados (PNG, JPG) en diferentes versiones y colores.':
    'You get every logo file in vector formats (AI, EPS, SVG, PDF) and raster formats (PNG, JPG), in different versions and colors.',
  'Recomendamos mínimo $300-500 USD mensuales para tener datos suficientes y optimizar. El presupuesto ideal depende de tu industria y objetivos.':
    'We recommend a minimum of USD $300–500 a month to gather enough data to optimize. The ideal budget depends on your industry and objectives.',
  'Definimos cuánto se puede sostener de verdad. Dos publicaciones al mes durante un año valen más que quince en enero y silencio hasta diciembre.':
    'We work out what can genuinely be sustained. Two posts a month for a year are worth more than fifteen in January and silence until December.',
  'La creación de logo es solo el diseño del logotipo. Branding incluye estrategia completa, manual de marca, paletas, tipografías y aplicaciones.':
    'Logo design is just the logo. Branding covers the full strategy: brand manual, palettes, typefaces and applications.',
  'Nadie puede garantizar posiciones específicas. Sin embargo, garantizamos mejoras medibles en tráfico y posicionamiento para keywords relevantes.':
    'Nobody can guarantee specific positions. What we do guarantee are measurable improvements in traffic and rankings for relevant keywords.',
  'A diferencia de los estáticos, los QR dinámicos te permiten cambiar el destino/contenido después de imprimirlos, además de trackear estadísticas.':
    'Unlike static ones, dynamic QR codes let you change the destination after printing, and track statistics as well.',
  'Para manufactura y proveeduría: que el comprador que te investiga antes de cotizar encuentre una empresa seria, y que cada cotización quede medida.':
    'For manufacturing and supply: make sure the buyer researching you before quoting finds a serious company, and that every quote gets measured.',
  'La medición corre a diario de forma automática. La revisión completa tiene sentido cada mes o cada trimestre, según el ritmo de cambios del negocio.':
    'Measurement runs daily and automatically. A full review makes sense monthly or quarterly, depending on how fast the business changes.',
  'Marcar cada contacto con su origen para poder seguirlo hasta la venta. Es la parte que casi nadie hace y la que convierte el reporte en una decisión.':
    'Tagging every lead with its source so it can be followed through to the sale. It is the part almost nobody does, and the one that turns a report into a decision.',
  'Para negocios de Irapuato, Salamanca, Pénjamo, Abasolo y el resto del Bajío: que te encuentren primero cuando alguien busca lo que vendes en tu ciudad.':
    'For businesses in Irapuato, Salamanca, Pénjamo, Abasolo and the rest of the Bajío: get found first when somebody searches for what you sell in your city.',
  'Las correcciones de datos se reflejan en días. Las reseñas y el aumento de visibilidad tardan semanas y dependen de cuántas consigas y con qué constancia.':
    'Corrections to your details show within days. Reviews and the lift in visibility take weeks, and depend on how many you gather and how consistently.',
  'No. El precio depende del alcance del trabajo y de nada más: atender a una empresa de Durango no agrega ningún costo respecto a atender a una de Aguascalientes.':
    'No. The price depends on the scope of the work and nothing else: serving a company in Durango costs no more than serving one in Aguascalientes.',
  'Se recomienda un camino con el número que lo sostiene: cuánto deja cada venta en cada canal después de comisiones. Si la respuesta es no abrir marketplace, se dice.':
    'We recommend a route along with the number that supports it: what each sale leaves in each channel after fees. If the answer is not to open a marketplace, we say so.',
  'Cuenta, facturación, mensajes y la página de llegada. La página se prepara igual que para una campaña de Google: si llega gente y no convierte, el canal no tuvo la culpa.':
    'Account, billing, messages and the landing page. The page is prepared just as for a Google campaign: if people arrive and do not convert, the channel is not to blame.',
  'Dependiendo de la complejidad, entre 2 a 6 semanas. Sitios simples pueden estar listos en 2 semanas, mientras que tiendas online o plataformas complejas requieren 4-6 semanas.':
    'Between 2 and 6 weeks, depending on complexity. Simple sites can be ready in 2 weeks; online stores or complex platforms take 4–6.',
  'Google pierde confianza en el dato y te muestra menos. Por eso el trabajo incluye unificar nombre, dirección y teléfono en tu web, tu ficha y los directorios donde ya apareces.':
    'Google loses confidence in the data and shows you less. That is why the work includes unifying name, address and phone across your site, your listing and the directories you already appear in.',
  'No, la ordena. La publicidad es el acelerador; el canal es la dirección. Acelerar en la dirección equivocada solo hace que llegues más rápido a un lugar donde no quieres estar.':
    'No, it organizes it. Advertising is the accelerator; the channel is the steering. Accelerating in the wrong direction only gets you faster to a place you do not want to be.',
  'Por el tablero, que está conectado a datos reales y no lo armamos a mano: entras cuando quieras. Y por la auditoría mensual, que dice qué se hizo, qué movió el número y qué sigue.':
    'Through the dashboard, which is wired to real data and not assembled by hand: you open it whenever you like. And through the monthly audit, which says what was done, what moved the number and what comes next.',
  'Las fuentes se leen a diario, así que lo que ves es de ayer y no del mes pasado. El reporte formal se arma una vez al mes, que es el ritmo al que se toman decisiones de presupuesto.':
    'The sources are read daily, so what you see is from yesterday and not from last month. The formal report is put together once a month, which is the pace at which budget decisions get made.',
  'Sí. La oficina está en Aguascalientes y ahí se atiende presencialmente, pero se trabaja con empresas de todo México. El tablero, la auditoría y las campañas funcionan igual a distancia.':
    'Yes. The office is in Aguascalientes and clients are seen there in person, but we work with companies all over Mexico. The dashboard, the audit and the campaigns all work the same remotely.',
  'Mejor para ti: es más fácil y más barato quedarte con el primer lugar ahora que dentro de dos años, cuando todos estén ahí. El costo de aparecer sube conforme entra más gente a competir.':
    'Better for you: taking first place is easier and cheaper now than in two years, when everybody is there. The cost of showing up rises as more people come in to compete.',
  'Una vez aprobado el arte final e impresa la lona, el montaje se hace en 48 horas hábiles. Lo que marca el calendario es el diseño y la disponibilidad del sitio que elijas, no la instalación.':
    'Once the final artwork is approved and the banner printed, installation happens within 48 business hours. What sets the schedule is the design and the availability of the site you choose, not the install.',
  'Sí. Cotizamos desde una sola persona hasta equipos completos, con diseño unificado para toda la empresa y una página de contacto propia para cada integrante. Nos adaptamos al tamaño de tu equipo.':
    'Yes. We quote anything from a single person to whole teams, with one unified design for the company and a contact page of their own for each member. We adapt to the size of your team.',
  'Con presupuestos de prueba de unas cuantas semanas ya se ve si el canal trae contactos con costo razonable para tu giro. Definimos juntos el techo antes de empezar y no se toca sin tu autorización.':
    'A few weeks of test budget is enough to see whether the channel brings leads at a reasonable cost for your line of work. We agree the ceiling together before starting, and it is not touched without your approval.',
  'Entonces se dice. Hay márgenes que no aguantan la comisión más el envío, y en esos casos abrir el canal es pagar por vender a pérdida. Preferimos perder ese proyecto a que lo descubras en seis meses.':
    'Then we say so. Some margins cannot carry the commission plus shipping, and in those cases opening the channel means paying to sell at a loss. We would rather lose that project than have you find out in six months.',
  'No, y no lo hacemos. Google detecta patrones de reseñas compradas y la sanción puede llegar a la eliminación del perfil. Lo que funciona es pedirlas de forma sistemática a clientes que sí te compraron.':
    'No, and we do not do it. Google detects patterns of bought reviews, and the penalty can go as far as deleting the profile. What works is asking systematically, from customers who actually bought from you.',
  'Agencia de inteligencia artificial aplicada a lo comercial: auditoría mensual con IA, agentes que atienden, medición hasta la venta y presencia en las respuestas de ChatGPT, Gemini, Claude y Perplexity.':
    'An artificial intelligence agency applied to the commercial side: a monthly AI audit, agents that answer, measurement through to the sale, and presence in the answers ChatGPT, Gemini, Claude and Perplexity give.',
  'No. Las herramientas automáticas dan listas de avisos sin contexto. Aquí la IA hace el trabajo pesado de medir y cruzar datos, y el diagnóstico se revisa y se prioriza contra los objetivos de tu negocio.':
    'No. Automated tools produce lists of warnings with no context. Here the AI does the heavy lifting of measuring and cross-referencing, and the diagnostic is reviewed and prioritized against your business objectives.',
  'El análisis toma de dos a tres semanas si tienes los números de margen a la mano. La parte lenta casi nunca somos nosotros: es reunir el costo real por producto, que muchas empresas no tienen desagregado.':
    'The analysis takes two to three weeks if you have the margin numbers at hand. The slow part is almost never us: it is gathering the real cost per product, which many companies do not have broken out.',
  'Un informe técnico con cada hallazgo y su evidencia, un resumen ejecutivo entendible sin conocimientos técnicos, la lista de palabras clave con su situación real y un plan de trabajo ordenado por impacto.':
    'A technical report with every finding and its evidence, an executive summary anyone can read without technical knowledge, the keyword list with its real standing, and a work plan ordered by impact.',
  'Cada contacto que llega queda marcado con su origen y aparece en tu tablero junto a los de Google Ads y Meta. Al mes tienes el costo por contacto de cada canal en la misma pantalla, y si este sale caro se apaga.':
    'Every lead that arrives is tagged with its source and shows on your dashboard next to those from Google Ads and Meta. Within a month you have the cost per lead of each channel on one screen, and if this one comes out expensive it gets switched off.',
  'Un código QR es una imagen que, al apuntarle con la cámara del teléfono, abre un enlace. Un QR dinámico permite cambiar ese destino sin reimprimir el código, y saber cuántas veces se escaneó, cuándo y desde dónde.':
    'A QR code is an image that opens a link when you point a phone camera at it. A dynamic QR code lets you change that destination without reprinting, and tells you how many times it was scanned, when and from where.',
  'Con el tablero, que está conectado a datos reales y abres cuando quieras, y con la auditoría mensual por escrito. Si en algún mes no se movió nada, también sale ahí: es la parte incómoda de medir y es justo la que sirve.':
    'Through the dashboard, wired to real data and open whenever you like, and through the written monthly audit. If nothing moved in a given month, that shows there too: it is the uncomfortable part of measuring, and exactly the part that is useful.',
  'Sí, y suele ser una sorpresa agradable: en muchos comercios es el canal más rentable y el único que nadie mide. Lo que hace falta es registrar el origen de cada conversación para saber qué campaña o qué página la generó.':
    'Yes, and it is usually a pleasant surprise: in many shops it is the most profitable channel and the only one nobody measures. What is needed is recording the source of each conversation, to know which campaign or page produced it.',
  'Sí, y no es un detalle menor. Toda la red opera bajo los reglamentos municipales y estatales. Un espectacular sin permisos se clausura con tu marca puesta, y ese problema de imagen es tuyo aunque la estructura sea de otro.':
    'Yes, and it is no small detail. The whole network operates under municipal and state regulations. An unpermitted billboard gets shut down with your brand on it, and that image problem is yours even if the structure belongs to somebody else.',
  'Sí, con el servicio completo. Tenemos capacidad de atender por igual a un negocio de Irapuato, de Pénjamo o de Abasolo: la junta mensual es por videollamada y el tablero se abre desde el teléfono, esté donde esté el negocio.':
    'Yes, with the full service. We can serve a business in Irapuato, Pénjamo or Abasolo just the same: the monthly meeting is over video and the dashboard opens on a phone, wherever the business is.',
  'No. Sin ERP el tablero llega hasta el contacto: cuántos, de dónde y a qué costo. Con ERP de Maindsoft se puede dar el paso siguiente y cruzar esos contactos contra ventas facturadas, que es donde la conversación cambia de tono.':
    'No. Without an ERP the dashboard reaches the lead: how many, from where and at what cost. With a Maindsoft ERP you can take the next step and match those leads against invoiced sales, which is where the conversation changes tone.',
  'Trabajamos la estrategia, la apertura y la medición del canal. La operación diaria —inventario, empaque, envíos, atención— la lleva tu equipo, porque es parte del negocio y no se puede tercerizar sin perder el control del margen.':
    'We handle the strategy, the launch and the measurement of the channel. Day-to-day operations —stock, packing, shipping, support— stay with your team, because they are part of the business and cannot be outsourced without losing control of the margin.',
  'Sí. Las cuentas de Search Console, Analytics y las plataformas de campañas van a nombre de tu empresa y tú eres el propietario. Nosotros trabajamos con permisos, y si un día terminamos, los datos y el histórico se quedan contigo.':
    'Yes. The Search Console, Analytics and campaign platform accounts are in your company’s name and you own them. We work with permissions, and if we ever part ways, the data and the history stay with you.',
  'El acceso ha ido abriéndose por etapas y las condiciones cambian seguido. Lo primero que hacemos es revisar contigo si tu cuenta y tu país ya pueden entrar, y con qué formatos. Si todavía no, te lo decimos y no cobramos por esperar.':
    'Access has been opening in stages and the terms change often. The first thing we do is check with you whether your account and your country can get in yet, and with which formats. If not, we tell you, and we do not charge you to wait.',
  'Menos de los que crees. En B2B el número que importa no es cuánta gente te sigue sino si la persona correcta encontró un perfil serio cuando fue a revisarte. Doscientos seguidores del sector valen más que cinco mil de cualquier lado.':
    'Fewer than you think. In B2B the number that matters is not how many people follow you but whether the right person found a serious profile when they went to check you out. Two hundred followers from your sector are worth more than five thousand from anywhere.',
  'El branding es definir cómo se ve, suena y se reconoce una marca: logotipo, colores, tipografías y tono de voz. No es solo el logo — es el conjunto de reglas que hacen que una empresa se vea igual en su web, sus redes y su papelería.':
    'Branding is defining how a brand looks, sounds and is recognized: logo, colors, typefaces and tone of voice. It is not just the logo — it is the set of rules that make a company look the same on its site, its social profiles and its stationery.',
  'Se repone y se reinstala sin costo. Aplica cuando la lona la producimos nosotros; si llegara impresa de fuera, no. Los sitios además llevan monitoreo y mantenimiento de la estructura para que el anuncio se vea impecable los 365 días.':
    'It is replaced and reinstalled at no cost. This applies when we produced the banner; not if it came printed from elsewhere. The sites also carry monitoring and structural maintenance so the ad looks impeccable all 365 days.',
  'Sirve justamente ahí. En venta industrial nadie compra desde LinkedIn, pero casi todo comprador revisa el perfil antes de contestar una cotización. No es un canal de venta: es lo que hace que te tomen en serio cuando ya te encontraron.':
    'That is exactly where it works. In industrial selling nobody buys from LinkedIn, but almost every buyer checks the profile before answering a quote. It is not a sales channel: it is what makes them take you seriously once they have found you.',
  'Google Ads es la plataforma de anuncios de pago de Google: tu anuncio sale arriba de los resultados y pagas solo cuando alguien hace clic. A diferencia del SEO, trae visitas desde el primer día y deja de traerlas al parar la inversión.':
    'Google Ads is Google’s paid advertising platform: your ad appears above the results and you only pay when somebody clicks. Unlike SEO, it brings visits from day one, and stops bringing them the moment you stop paying.',
  'Es justo donde más rinde. En B2B casi nadie compra en el primer clic: te investigan. El trabajo consiste en que esa investigación termine bien y en medir cuántas cotizaciones llegaron por ese camino, que es lo que normalmente nadie mide.':
    'It is exactly where it pays off most. In B2B almost nobody buys on the first click: they research you. The work is making that research end well, and measuring how many quote requests came through that route — which is what normally nobody measures.',
  'Diseño y desarrollo web es construir el sitio de una empresa desde cero: la estructura, el diseño visual y el código que lo hace funcionar. Incluye que cargue rápido, que se vea bien en el teléfono y que Google pueda leerlo sin problemas.':
    'Web design and development is building a company’s site from scratch: the structure, the visual design and the code that makes it work. It includes loading fast, looking right on a phone and being readable by Google without trouble.',
  'Sí, con material tuyo. Lo que no hacemos es inventar contenido genérico: las publicaciones salen de tus proyectos, tus procesos y las preguntas que te hacen los clientes, porque eso es lo único que suena a tu empresa y no a una plantilla.':
    'Yes, with your material. What we do not do is invent generic content: the posts come from your projects, your processes and the questions your customers ask, because that is the only thing that sounds like your company and not like a template.',
  'Contestarlas, siempre y rápido, sin discutir. Una reseña mala contestada con serenidad convence más que diez buenas: quien la lee no está juzgando el error, está viendo cómo respondes. Las que no se contestan son las que hacen daño de verdad.':
    'Answer them, always and quickly, without arguing. One bad review answered calmly persuades more than ten good ones: whoever reads it is not judging the mistake, they are watching how you respond. The ones left unanswered are the ones that really do damage.',
  'El perfil ordenado cambia la impresión desde la primera semana. La cadencia de contenido rinde a partir del tercer o cuarto mes, que es cuando ya hay suficiente publicado para que alguien que llega vea una empresa con actividad y no una racha.':
    'A tidy profile changes the impression from the first week. The content cadence pays off from the third or fourth month, when enough has been published that somebody arriving sees a company with activity and not a burst.',
  'Inédito Digital trabaja con empresas de Durango de forma completamente remota, desde su oficina en Aguascalientes. Lo que se entrega es lo mismo que a un cliente local: auditoría con IA, tablero con datos reales y campañas medidas contra ventas.':
    'Inédito Digital works with companies in Durango entirely remotely, from its office in Aguascalientes. What gets delivered is the same as for a local client: an AI audit, a dashboard with real data and campaigns measured against sales.',
  'Una tarjeta de presentación digital con NFC comparte tu contacto acercándola al teléfono de la otra persona: sin instalar nada y sin escanear. Los datos se actualizan desde un panel, así que la tarjeta física nunca se queda con información vieja.':
    'An NFC digital business card shares your contact by holding it near the other person’s phone: nothing to install and nothing to scan. The details update from a panel, so the physical card never ends up carrying old information.',
  'Un funnel o embudo de venta es el camino que recorre una persona desde que descubre tu negocio hasta que compra, dividido en pasos que se pueden medir. Sirve para ver en qué punto exacto se pierde la gente y arreglar ese punto, en vez de adivinar.':
    'A sales funnel is the path a person travels from discovering your business to buying, broken into steps that can be measured. It exists to show exactly where people are lost, so that point can be fixed instead of guessed at.',
  'La ficha de Google —antes Google My Business, hoy Google Business Profile— es el perfil de empresa que aparece a la derecha en Google y dentro de Maps, con dirección, horario, teléfono, fotos y reseñas. Es gratuita y la controla el dueño del negocio.':
    'The Google listing —formerly Google My Business, today Google Business Profile— is the company profile that appears on the right in Google and inside Maps, with address, hours, phone, photos and reviews. It is free and controlled by the business owner.',
  'El posicionamiento orgánico, o SEO, es el trabajo de aparecer en los resultados de Google sin pagar por cada clic. Se consigue haciendo que el sitio cargue rápido, que el buscador lo entienda y que su contenido responda lo que la gente realmente busca.':
    'Organic ranking, or SEO, is the work of appearing in Google’s results without paying for each click. It comes from making the site load fast, making the search engine understand it, and making its content answer what people actually search for.',
  'Midiendo el paso anterior: cuántas solicitudes de cotización entraron, por qué canal llegó cada una y cuáles se convirtieron en pedido. No hace falta que la firma sea digital para saber si lo digital la originó; hace falta que el origen quede registrado.':
    'By measuring the step before: how many quote requests came in, through which channel each arrived, and which turned into an order. The signature does not have to be digital for you to know digital originated it; the source just has to be recorded.',
  'Sí. Tenemos un tablero de demostración con datos de ejemplo donde se ve exactamente el formato: los indicadores, el origen del tráfico, el embudo, la visibilidad en IA, la auditoría y el reporte que se genera. Pídelo por WhatsApp y te mandamos el enlace.':
    'Yes. We have a demo dashboard with sample data that shows exactly the format: the indicators, traffic sources, the funnel, AI visibility, the audit and the report it generates. Ask on WhatsApp and we will send you the link.',
  'Una auditoría digital es la revisión completa de la presencia de una empresa en internet, con la evidencia de cada hallazgo. Cubre la velocidad del sitio, qué páginas conoce Google, qué responden los asistentes de IA, la ficha de Google y quién la enlaza.':
    'A digital audit is a complete review of a company’s presence on the internet, with the evidence behind every finding. It covers site speed, which pages Google knows about, what the AI assistants answer, the Google listing and who links to it.',
  'Sí, y suele rendir más que en una ciudad grande, porque la competencia digital es mucho menor. Se empieza por lo básico —ficha de Google, sitio rápido, WhatsApp atendido— que es lo más barato y lo que más mueve. Las campañas vienen después, si hacen falta.':
    'Yes, and it usually pays off more than in a big city, because digital competition is far lower. You start with the basics —Google listing, a fast site, an attended WhatsApp— which are the cheapest and move the most. Campaigns come later, if they are needed.',
  'La ficha de Google (antes Google My Business, hoy Google Business Profile) es el perfil de empresa que aparece a la derecha en Google y dentro de Google Maps, con dirección, horario, teléfono, fotos y reseñas. Es gratuita y la controla el dueño del negocio.':
    'The Google listing (formerly Google My Business, today Google Business Profile) is the company profile that appears on the right in Google and inside Google Maps, with address, hours, phone, photos and reviews. It is free and controlled by the business owner.',
  'La creación de logo es el diseño del símbolo que identifica a una empresa. Un logo profesional funciona igual de bien en un letrero que en un ícono de app, se sostiene en blanco y negro, y se entrega con los archivos y las reglas para usarlo sin deformarlo.':
    'Logo design is the design of the symbol that identifies a company. A professional logo works just as well on a sign as in an app icon, holds up in black and white, and comes with the files and the rules for using it without distorting it.',
  'En parte. Sin Search Console se puede revisar lo que se ve desde fuera: velocidad, estructura, contenido y qué dicen las IA. Lo que no se puede saber sin acceso es qué busca de verdad la gente para encontrarte ni qué páginas están fuera del índice de Google.':
    'Partly. Without Search Console we can review what is visible from outside: speed, structure, content and what the AIs say. What cannot be known without access is what people actually search to find you, and which pages are outside Google’s index.',
  'No, y conviene no confundirlo. Salir recomendado dentro de la respuesta es orgánico y se trabaja con contenido y señales: eso es posicionamiento en IA. ChatGPT Ads es espacio comprado. Lo ideal es tener los dos, porque el orgánico sostiene y el pagado acelera.':
    'No, and it is worth not confusing them. Being recommended inside the answer is organic, and comes from content and signals: that is AI visibility. ChatGPT Ads is bought space. Ideally you have both, because the organic sustains and the paid accelerates.',
  'No, y desconfía de quien lo prometa. Nadie puede reentrenar un modelo desde fuera. Lo que sí se puede es hacer que tu información sea correcta, consistente y fácil de citar, que es lo que estos sistemas usan cuando responden. El resto es la decisión del modelo.':
    'No, and be wary of anyone who promises it. Nobody can retrain a model from outside. What you can do is make your information correct, consistent and easy to quote, which is what these systems use when they answer. The rest is the model’s decision.',
  'Recuperarlos, que suele ser la venta más barata que existe: esa persona ya eligió el producto. Un mensaje oportuno y que no suene automático recupera una parte, y la IA ayuda a decidir a quién escribir, cuándo y con qué argumento según lo que dejó en el carrito.':
    'Recover them, which is usually the cheapest sale there is: that person already chose the product. A timely message that does not sound automated recovers a share, and the AI helps decide who to write to, when and with what argument, based on what they left in the cart.',
  'Sí. El arrendamiento del espacio es independiente de la producción, así que un cambio de arte se cobra como la nueva impresión más la maniobra de montaje, salvo que se haya pactado otra cosa. En pantalla digital el cambio no cuesta impresión, porque no hay lona.':
    'Yes. Renting the space is separate from production, so a change of artwork is charged as the new print plus the installation work, unless something else was agreed. On a digital screen the change costs no printing, because there is no banner.',
  'Un chatbot o agente de IA es un programa que conversa con tus clientes y resuelve dudas sin que haya alguien atendiendo. A diferencia de un menú automático de opciones, entiende lo que se le escribe con palabras normales y puede consultar tus datos para responder.':
    'A chatbot or AI agent is a program that talks to your customers and answers questions with nobody on duty. Unlike an automated menu of options, it understands what is written to it in ordinary words and can look up your data to answer.',
  'Midiendo hasta la inscripción. Un formulario no es un alumno: en medio hay visita, entrevista y decisión familiar. Cuando el origen queda registrado desde el primer contacto, al final del ciclo se puede decir qué campaña trajo inscripciones y cuánto costó cada una.':
    'By measuring through to enrollment. A form is not a student: in between there is a visit, an interview and a family decision. When the source is recorded from the first contact, at the end of the cycle you can say which campaign brought enrollments and what each one cost.',
  'Para las dos cosas, pero la inversión se justifica distinto. En un desarrollo con inventario, el sistema se paga solo con evitar prospectos malos. Para una propiedad suelta conviene empezar por lo básico —presencia, fotos, respuesta rápida— antes de montar campañas.':
    'For both, but the investment justifies itself differently. In a development with inventory, the system pays for itself just by avoiding bad leads. For a single property it is better to start with the basics —presence, photos, fast replies— before setting up campaigns.',
  'Para llenar mesas, la ficha, sin discusión: es donde la gente decide con hambre y a minutos de comer. Las redes construyen marca y recuerdo, que también valen, pero si hay que elegir por dónde empezar y el presupuesto es uno solo, primero la ficha. Se nota en semanas.':
    'To fill tables, the listing, no contest: it is where people decide while hungry and minutes from eating. Social builds brand and recall, which count too, but if you have to choose where to start and there is only one budget, the listing comes first. It shows within weeks.',
  'Antes de que abra la ventana, no cuando ya abrió. Las familias empiezan a comparar semanas antes de decidir, y llegar cuando ya están comparando significa competir contra escuelas que llevan tiempo en su radar. El calendario se arma hacia atrás desde la fecha de inscripción.':
    'Before the window opens, not once it has. Families start comparing weeks before deciding, and arriving when they are already comparing means competing against schools that have been on their radar for a while. The calendar is built backwards from the enrollment date.',
  'Porque es donde está el comprador industrial y donde comprueba que la empresa está viva: publicaciones recientes, gente real, proyectos. Un LinkedIn corporativo abandonado transmite exactamente lo contrario que un sitio nuevo, y lo transmite gratis a quien te está evaluando.':
    'Because that is where the industrial buyer is, and where they confirm the company is alive: recent posts, real people, projects. An abandoned corporate LinkedIn communicates exactly the opposite of a new site, and communicates it for free to whoever is evaluating you.',
  'Casi siempre porque se están midiendo prospectos y no citas. Generar contactos baratos es fácil; generar contactos que califiquen es otro trabajo. Cuando se mide el embudo completo suele verse que la mitad del presupuesto va al canal que más volumen trae y menos citas produce.':
    'Almost always because prospects are being measured instead of appointments. Generating cheap leads is easy; generating leads that qualify is another job. When the full funnel is measured it usually turns out half the budget goes to the channel that brings the most volume and produces the fewest appointments.',
  'Se puede contratar por mes, pero es honesto decir que un mes suelto rara vez rinde. El exterior funciona por acumulación: la misma persona pasa delante del anuncio veinte veces al mes, y el recuerdo se construye con esa repetición. Tres meses es donde se empieza a notar de verdad.':
    'You can book by the month, but it is honest to say a single month rarely pays. Outdoor works by accumulation: the same person passes the ad twenty times a month, and recall is built by that repetition. Three months is where it really starts to show.',
  'La auditoría entrega hallazgos desde la primera semana. Lo que se corrige en el sitio y en las fichas empieza a moverse en semanas; la visibilidad ante los asistentes de IA y el posicionamiento orgánico se acumulan en meses. Nadie serio te va a prometer primeros lugares en quince días.':
    'The audit delivers findings from the first week. What gets corrected on the site and in the listings starts moving within weeks; visibility with AI assistants and organic ranking accumulate over months. Nobody serious will promise you top spots in a fortnight.',
  'Una activación para expo es la tecnología interactiva que se instala en un stand para atraer visitantes y capturar sus datos: ruletas de premios, photobooth con realidad aumentada, trivias o pantallas táctiles. No es la venta de espacio publicitario, sino lo que ocurre dentro del stand.':
    'A trade show activation is the interactive technology installed in a booth to draw visitors and capture their details: prize wheels, AR photo booths, trivia or touch screens. It is not the sale of advertising space, but what happens inside the booth.',
  'Usar un asistente para escribir textos es productividad personal, y está bien. Esto es otra cosa: conectar los datos reales de tu negocio, medirlos contra objetivos y auditar cada mes si la estrategia funciona. La IA aquí no produce el contenido: revisa el desempeño y señala qué corregir.':
    'Using an assistant to write text is personal productivity, and that is fine. This is something else: connecting your business’s real data, measuring it against objectives and auditing every month whether the strategy works. Here the AI does not produce the content: it reviews performance and points out what to correct.',
  'Sirve, pero no como en consumo. No vas a cerrar un contrato industrial con un anuncio: vas a lograr que cuando te investiguen —y siempre lo hacen antes de cotizar— encuentren una empresa que se ve capaz. El objetivo del trabajo digital en B2B es entrar a la lista corta, no cerrar la venta.':
    'It works, but not the way it does in consumer. You are not going to close an industrial contract with an ad: you are going to make sure that when they research you —and they always do before quoting— they find a company that looks capable. The goal of digital work in B2B is getting on the shortlist, not closing the sale.',
  'Sí, con el servicio completo y sin recortes. La oficina está en Aguascalientes y la coordinación es en línea: junta mensual de dirección por videollamada y un tablero que consultas cuando quieras. Ninguna parte del trabajo —auditoría, campañas, medición— depende de estar en la misma ciudad.':
    'Yes, with the full service and nothing trimmed. The office is in Aguascalientes and coordination happens online: a monthly leadership meeting over video and a dashboard you check whenever you like. No part of the work —audit, campaigns, measurement— depends on being in the same city.',
  'No. El servicio se adapta al punto de partida: construir presencia desde cero, mejorar una que está mal trabajada, o vender más cuando ya está todo montado. Una empresa chica normalmente empieza por la auditoría, que es la inversión más pequeña y la que evita gastar en lo que no hacía falta.':
    'No. The service adapts to the starting point: building a presence from scratch, improving one that was done badly, or selling more when everything is already in place. A small company usually starts with the audit, which is the smallest investment and the one that avoids spending on what was not needed.',
  'Para trabajo digital, la ubicación no cambia el resultado: lo que cambia es si hay medición o no. Todo se hace conectado a tus datos y se revisa en junta por videollamada. Lo que sí conviene exigir —a nosotros o a quien sea— es poder ver los números sin depender de que alguien te los cuente.':
    'For digital work, location does not change the result: what changes is whether there is measurement or not. Everything is done connected to your data and reviewed in a video meeting. What is worth demanding —from us or from anyone— is being able to see the numbers without depending on somebody to tell you them.',
  'En comercio electrónico el problema rara vez es vender: es saber si esa venta dejó dinero. Entre comisiones de marketplace, envíos y publicidad, un canal puede facturar mucho y no dejar nada. Inédito Digital mide el margen por canal y ayuda a decidir dónde vender antes de gastar en traer gente.':
    'In e-commerce the problem is rarely selling: it is knowing whether the sale left any money. Between marketplace fees, shipping and advertising, a channel can bill a lot and leave nothing. Inédito Digital measures margin by channel and helps decide where to sell before spending to bring people in.',
  'En los municipios de Guanajuato —Irapuato, Salamanca, Pénjamo, Abasolo y alrededores— la mayoría de los negocios compite sin presencia digital seria. Inédito Digital trabaja ese hueco desde Aguascalientes: ficha de Google, sitio que carga, WhatsApp que responde y medición de cada contacto que llega.':
    'In the towns of Guanajuato —Irapuato, Salamanca, Pénjamo, Abasolo and around— most businesses compete without a serious digital presence. Inédito Digital works that gap from Aguascalientes: a Google listing, a site that loads, a WhatsApp that answers, and every incoming lead measured.',
  'Inédito Digital atiende a empresas de Celaya con el servicio completo: auditoría con IA de la presencia digital, tablero de resultados con datos reales y campañas que se miden contra ventas, no contra likes. La capacidad de trabajo es la misma para una empresa de Celaya que para una de Aguascalientes.':
    'Inédito Digital serves companies in Celaya with the full service: an AI audit of the digital presence, a results dashboard with real data, and campaigns measured against sales rather than likes. The capacity is the same for a company in Celaya as for one in Aguascalientes.',
  'Con las mismas preguntas que haría un asesor en la primera llamada: qué zona busca, qué presupuesto maneja, si va con crédito o de contado y en qué plazo piensa mudarse. Lo hace en el momento en que la persona escribe, a cualquier hora, y le pasa al equipo solo las conversaciones que valen una llamada.':
    'With the same questions an advisor would ask on the first call: which area they are looking in, what budget they have, whether it is a mortgage or cash, and when they plan to move. It does it the moment the person writes, at any hour, and passes the team only the conversations worth a call.',
  'Puede atender lo repetitivo, que es la mayor parte del volumen en temporada: colegiaturas, requisitos, horarios, transporte, fechas. Lo que requiere criterio —una beca, un caso particular, una entrevista— se pasa a admisiones con el contexto de lo que ya se habló. El objetivo no es sustituir a nadie, es que nadie espere.':
    'It can handle the repetitive part, which is most of the volume in season: fees, requirements, schedules, transport, dates. Anything needing judgment —a scholarship, a particular case, an interview— goes to admissions with the context of what was already discussed. The goal is not to replace anyone; it is that nobody waits.',
  'Las dos cosas, y por diseño. Inédito Digital nació como agencia de marketing digital en Aguascalientes y hoy trabaja como dirección comercial asistida por IA: la inteligencia artificial no es un servicio suelto del catálogo, es lo que audita y corrige el trabajo de marketing cada mes. Por eso aparece en las dos categorías.':
    'Both, and by design. Inédito Digital started as a digital marketing agency in Aguascalientes and today works as AI-assisted commercial leadership: artificial intelligence is not a loose item in the catalog, it is what audits and corrects the marketing work every month. That is why it appears in both categories.',
  'En la industria nadie compra por un anuncio, pero casi todos investigan antes de pedir una cotización. El marketing industrial B2B consiste en que esa investigación termine bien: que la empresa exista donde la buscan, se vea formal y responda. Inédito Digital trabaja esa presencia y mide cuántas cotizaciones salen de ella.':
    'In industry nobody buys because of an ad, but almost everybody researches before requesting a quote. B2B industrial marketing is about making that research end well: the company exists where they look, looks the part and replies. Inédito Digital works on that presence and measures how many quote requests come out of it.',
  'Poniendo antes las piezas que sí se miden: un número o WhatsApp que solo aparezca en la lona, una página de destino propia y un código que no exista en ningún otro lado. Con eso se cuentan contactos atribuibles. Y en paralelo se mira si suben las búsquedas de tu marca en Google, que es donde primero se nota la recordación.':
    'By putting the measurable pieces in place first: a number or WhatsApp that appears only on the banner, its own landing page and a code that exists nowhere else. That gives you attributable leads. And in parallel you watch whether branded searches on Google rise, which is where recall shows first.',
  'Depende del producto y del margen, y casi siempre la respuesta es "en los dos, pero no lo mismo". El marketplace da visibilidad inmediata y cobra por ella; la tienda propia deja más por venta pero exige traer al cliente. Lo que no conviene es decidirlo sin comparar el margen real de cada canal, comisiones y envíos incluidos.':
    'It depends on the product and the margin, and the answer is almost always "both, but not the same things". The marketplace gives immediate visibility and charges for it; your own store leaves more per sale but requires bringing the customer. What is unwise is deciding without comparing the real margin of each channel, fees and shipping included.',
  'El marketing educativo se juega en ventanas cortas: hay unas semanas al año en las que las familias deciden, y fuera de ellas la inversión rinde muy poco. Inédito Digital concentra el esfuerzo en esas ventanas, responde en el pico —cuando llegan todas las preguntas a la vez— y mide el costo por alumno inscrito, no por formulario.':
    'Education marketing plays out in short windows: there are a few weeks a year when families decide, and outside them the spend returns very little. Inédito Digital concentrates the effort on those windows, answers at the peak —when every question arrives at once— and measures cost per enrolled student, not per form.',
  'El marketing inmobiliario tiene un problema propio: el ciclo de venta dura meses, así que la mayoría de las agencias reporta prospectos y se lava las manos. Inédito Digital mide el camino completo —del anuncio al prospecto, del prospecto a la cita, de la cita a la venta— para que la dirección sepa qué canal trae compradores y cuál solo trae curiosos.':
    'Real estate marketing has a problem of its own: the sales cycle lasts months, so most agencies report leads and wash their hands. Inédito Digital measures the full path —ad to lead, lead to appointment, appointment to sale— so leadership knows which channel brings buyers and which only brings onlookers.',
  'El marketing para restaurantes se decide en un lugar muy concreto: la ficha de Google. Quien tiene hambre no entra a tu página web, busca «dónde comer cerca», mira fotos, lee las últimas reseñas y decide en menos de un minuto. Inédito Digital trabaja ese momento —ficha, reseñas, fotos, respuesta inmediata— y mide las reservas y los pedidos que salen de ahí.':
    'Restaurant marketing is decided in one very specific place: the Google listing. A hungry person does not visit your website; they search “where to eat nearby”, look at photos, read the latest reviews and decide in under a minute. Inédito Digital works that moment —listing, reviews, photos, immediate replies— and measures the bookings and orders that come out of it.',
  'Sí, y es donde más rinde en este giro. El agente contesta al instante las preguntas de siempre —lugar, grupos, estacionamiento, menú, alergias— con la información real del restaurante, toma los datos de la reserva y pasa la conversación a una persona cuando la petición se sale de lo común. Funciona a la hora de comer, que es justo cuando nadie del equipo puede contestar.':
    'Yes, and it is where it pays off most in this line of work. The agent instantly answers the usual questions —location, groups, parking, menu, allergies— with the restaurant’s real information, takes the booking details and hands the conversation to a person when the request is out of the ordinary. It works at mealtime, which is exactly when nobody on the team can answer.',
  'Cartelera: el clásico de avenidas y rutas, alcance masivo. Unipolar: estructura vertical alta, domina a larga distancia, ideal en carretera y accesos. Puente peatonal: cruza la avenida, lo ven automovilistas y peatones. Valla: a pie de calle, cerca del público, buena para zonas comerciales. Pantalla digital LED: rota varios anuncios y permite cambiar el mensaje sin reimprimir.':
    'Billboard: the classic on avenues and routes, mass reach. Unipole: a tall vertical structure, dominates from a distance, ideal on highways and approaches. Pedestrian bridge: crosses the avenue, seen by drivers and pedestrians. Street panel: at ground level, close to the public, good for commercial areas. LED screen: rotates several ads and lets you change the message without reprinting.',
  'Depende del formato y sobre todo del punto: no vale lo mismo un unipolar en una salida carretera que una valla en una colonia. El espacio se cobra aparte de la impresión de la lona, y hay tarifas por mes, trimestre, semestre y año, con precio preferencial a mayor plazo. Te pasamos la cotización con los sitios concretos y sus impactos estimados, no una lista de precios genérica.':
    'It depends on the format and above all on the site: a unipole on a highway exit is not worth the same as a street panel in a neighborhood. The space is charged separately from printing the banner, and there are rates by month, quarter, half-year and year, with better pricing on longer terms. We send you a quote with the specific sites and their estimated impressions, not a generic price list.',
  'Inédito Digital es una agencia de IA en Aguascalientes: una agencia de inteligencia artificial aplicada a la operación comercial, no a la línea de producción. Usa IA para auditar la presencia digital de una empresa cada mes, atender a quien pregunta con agentes, medir cada canal hasta la venta y lograr que los asistentes la recomienden. Atiende desde Aguascalientes a empresas de todo México.':
    'Inédito Digital is an AI agency in Aguascalientes: an artificial intelligence agency applied to commercial operations, not to the production line. It uses AI to audit a company’s digital presence every month, answer enquiries with agents, measure each channel through to the sale, and get the assistants to recommend it. It serves companies all over Mexico from Aguascalientes.',
  'Un anuncio espectacular es un soporte publicitario de gran formato instalado en la vía pública —cartelera, unipolar, puente peatonal, valla o pantalla digital— que se renta por periodos y se cobra por el espacio, aparte de la impresión de la lona. En Aguascalientes, Inédito Digital comercializa la red de Vía Gráfica: infraestructura propia, regularizada ante los reglamentos municipales y estatales, con ficha técnica por sitio.':
    'A billboard is a large-format advertising structure installed on public roads —billboard, unipole, pedestrian bridge, street panel or digital screen— rented by period and charged for the space, separately from printing the banner. In Aguascalientes, Inédito Digital sells the Vía Gráfica network: their own infrastructure, permitted under municipal and state regulations, with a spec sheet for each site.',
  'El LinkedIn de empresa es la página institucional de un negocio dentro de la red donde están los compradores B2B. Importa por una razón muy concreta: cuando alguien recibe tu cotización o tu correo en frío, lo primero que hace es buscarte, y lo que encuentra decide si te contesta. Un perfil con la portada por defecto, tres publicaciones de hace dos años y catorce seguidores comunica lo mismo que una oficina con las luces apagadas. Trabajarlo no es publicar todos los días: es tener el perfil completo, el equipo vinculado y una cadencia sostenida de contenido que demuestre que la empresa sabe de lo que habla.':
    'A company LinkedIn is a business’s institutional page on the network where B2B buyers are. It matters for one very concrete reason: when somebody receives your quote or your cold email, the first thing they do is look you up, and what they find decides whether they reply. A profile with the default cover, three posts from two years ago and fourteen followers says the same thing as an office with the lights off. Working on it does not mean posting every day: it means a complete profile, the team linked, and a sustained cadence of content that shows the company knows what it is talking about.',
  'Una estrategia de canales de venta es la decisión de por dónde va a llegar el dinero antes de gastar en traer gente. Para la mayoría de las empresas mexicanas hoy la disyuntiva es concreta: vender de forma directa a otras empresas —cotización, visita, relación larga y ticket alto— o abrir en marketplaces como Mercado Libre y Amazon, donde hay tráfico enorme pero el margen se comparte y el cliente no es del todo tuyo. Las dos rutas funcionan, pero piden inversiones distintas, equipos distintos y páginas distintas. Elegir mal no se arregla con más presupuesto de publicidad: se arregla volviendo a esta decisión.':
    'A sales channel strategy is the decision about where the money will come from, before spending to bring people in. For most Mexican companies today the choice is concrete: sell directly to other businesses —quote, visit, long relationship, high ticket— or open on marketplaces like Mercado Libre and Amazon, where traffic is enormous but the margin is shared and the customer is not entirely yours. Both routes work, but they call for different investments, different teams and different pages. Choosing wrong is not fixed with more advertising budget: it is fixed by coming back to this decision.',
  'No hay una sola, y conviene desconfiar de quien conteste otra cosa. Depende de dónde esté el problema. Si es automatizar una línea de producción o integrar IA a tu ERP, el proveedor correcto es una consultora de software o un integrador industrial. Si es eficiencia interna —procesos, inventarios, predicción—, una empresa de automatización y analítica. Si lo que buscas es conseguir clientes, atenderlos y medir qué funciona, necesitas una agencia de IA orientada a lo comercial: ahí es donde trabaja Inédito Digital. En cualquiera de los tres casos, pide una auditoría antes de firmar: quien te cotiza sin haber visto tu situación te está vendiendo su catálogo.':
    'There is no single one, and it is wise to distrust anyone who answers otherwise. It depends where the problem is. If it is automating a production line or integrating AI into your ERP, the right supplier is a software consultancy or an industrial integrator. If it is internal efficiency —processes, inventory, forecasting— an automation and analytics company. If what you want is to win customers, serve them and measure what works, you need an AI agency oriented to the commercial side: that is where Inédito Digital works. In all three cases, ask for an audit before signing: anyone who quotes you without having seen your situation is selling you their catalog.',
  'Un tablero de resultados es una pantalla que reúne, en un solo lugar y actualizado solo, lo que hoy está repartido en cinco herramientas distintas: cuánta gente llega y de dónde, qué busca la gente que te encuentra, cuántos contactos dejaron sus datos, cuánto costó cada uno y —cuando el sistema de la empresa lo permite— cuáles de esos contactos terminaron en una venta facturada. No es un reporte que alguien arma a mano cada mes con capturas; es una conexión directa a tus buscadores, tu tráfico y tus plataformas de campañas. La diferencia práctica es que una junta de dirección deja de discutir de dónde salió cada número y empieza a discutir qué hacer con ellos.':
    'A results dashboard is one screen that gathers, in a single place and updating on its own, what today is spread across five different tools: how many people arrive and from where, what the people who find you are searching for, how many left their details, what each one cost and —when the company’s system allows it— which of those leads ended in an invoiced sale. It is not a report somebody assembles by hand each month from screenshots; it is a direct connection to your search consoles, your traffic and your campaign platforms. The practical difference is that a leadership meeting stops arguing about where each number came from and starts arguing about what to do with them.',
  'ChatGPT Ads es el sistema de publicidad de OpenAI dentro de ChatGPT: espacios pagados que aparecen junto a las respuestas que el asistente le da a millones de personas cada día. Es distinto de aparecer de forma orgánica en esas respuestas —eso es posicionamiento en IA y se trabaja aparte—; aquí se compra el espacio. Lo importante ahora no es el formato, que sigue cambiando mes a mes, sino el momento: cuando un canal publicitario abre, la competencia es baja y el costo por resultado es el más bajo que va a tener nunca. Eso duró alrededor de dos años en Google Ads y unos dieciocho meses en Meta. En Aguascalientes prácticamente ninguna empresa lo está probando todavía.':
    'ChatGPT Ads is OpenAI’s advertising system inside ChatGPT: paid placements that appear alongside the answers the assistant gives millions of people every day. It is different from appearing organically in those answers —that is AI visibility, and it is worked on separately— here the space is bought. What matters right now is not the format, which keeps changing month to month, but the timing: when an advertising channel opens, competition is low and cost per result is the lowest it will ever be. That lasted around two years on Google Ads and about eighteen months on Meta. In Aguascalientes practically no company is testing it yet.',
  'El mercado local se reparte en cuatro grupos. Consultoras de software que integran IA a la medida, como Westribe, y firmas nacionales que operan en el estado a través del clúster (Softtek, Capgemini, Global Hitss). Empresas de automatización y analítica para la operación interna, como ISA Solutions RM. Agencias que aplican IA al área comercial, donde trabaja Inédito Digital. Y el ecosistema institucional: el Clúster Innovatia, el Centro de Innovación Industrial en Inteligencia Artificial y el laboratorio de IA del CECyTEA en Rincón de Romos. El mapa completo, con en qué caso conviene cada uno, está en la guía «Empresas de inteligencia artificial en Aguascalientes» del blog.':
    'The local market splits into four groups. Software consultancies that integrate custom AI, such as Westribe, and national firms operating in the state through the cluster (Softtek, Capgemini, Global Hitss). Automation and analytics companies for internal operations, such as ISA Solutions RM. Agencies applying AI to the commercial side, where Inédito Digital works. And the institutional ecosystem: the Innovatia Cluster, the Industrial Innovation Center in Artificial Intelligence, and the CECyTEA AI lab in Rincón de Romos. The full map, with which one suits which case, is in the blog guide “Artificial intelligence companies in Aguascalientes”.',

  /*
   * ── el catálogo de servicios ─────────────────────────────────────────
   *
   * Nombre y frase de cada servicio, que es lo que sale en el menú, en las
   * tarjetas del inicio, en el pie y en el asistente. El cuerpo largo de cada
   * uno vive en la base de datos y se traduce desde el panel, no desde aquí.
   */
  'Diseño y Desarrollo Web': 'Web Design and Development',
  'Sitios web profesionales, rápidos y optimizados para convertir visitantes en clientes.':
    'Professional sites, fast and built to turn visitors into customers.',
  'Chatbots y Agentes': 'Chatbots and Agents',
  'Automatiza tu atención al cliente 24/7 con inteligencia artificial que vende por ti.':
    'Automate customer support 24/7 with artificial intelligence that sells for you.',
  'Funnels de Venta': 'Sales Funnels',
  'Embudos de conversión optimizados que convierten tráfico en clientes pagando.':
    'Tuned conversion funnels that turn traffic into paying customers.',
  'Posicionamiento Orgánico': 'Organic SEO',
  'Domina Google y atrae clientes que buscan activamente tus servicios.':
    'Own Google and attract customers actively searching for your services.',
  'Google Ads': 'Google Ads',
  'Campañas publicitarias rentables que generan clientes desde el primer día.':
    'Profitable ad campaigns that bring in customers from day one.',
  'Branding': 'Branding',
  'Identidad de marca memorable que conecta emocionalmente con tu audiencia.':
    'A memorable brand identity that connects with your audience.',
  'Servicios QR': 'QR Services',
  'Códigos QR inteligentes que conectan el mundo físico con tu estrategia digital.':
    'Smart QR codes that connect the physical world to your digital strategy.',
  'Creación de Logo': 'Logo Design',
  'Logos profesionales que representan la esencia de tu marca de forma memorable.':
    'Professional logos that capture what your brand is, memorably.',
  'Activaciones para Expo': 'Trade Show Activations',
  'Interacciones y activaciones digitales que transforman tu stand en experiencias memorables.':
    'Digital interactions and activations that turn your booth into something people remember.',
  'Tarjetas de Presentación Digital NFC': 'NFC Digital Business Cards',
  'Comparte tu contacto, redes y portafolio con un solo toque. Sin apps, sin imprimir, siempre actualizada.':
    'Share your contact details, social profiles and portfolio with a single tap. No apps, no printing, always current.',
  'Ficha de Google': 'Google Business Profile',
  'El perfil que aparece en Google y Maps cuando alguien busca tu negocio. Es de los activos más importantes y más descuidados.':
    'The profile that shows on Google and Maps when somebody looks your business up. One of the most important assets, and the most neglected.',
  'Auditoría con IA': 'AI Audit',
  'Revisamos tu presencia digital contra los objetivos que define tu dirección, y te decimos qué está mal con evidencia, no con opiniones.':
    'We review your digital presence against the objectives your leadership sets, and tell you what is wrong with evidence, not opinions.',
  'ChatGPT Ads': 'ChatGPT Ads',
  'Publicidad dentro de ChatGPT. Es nuevo, casi nadie lo está trabajando, y por eso todavía se compra barato.':
    'Advertising inside ChatGPT. It is new, almost nobody is working on it, and that is why it is still cheap to buy.',
  'Tablero de Resultados': 'Results Dashboard',
  'Una sola pantalla con lo que pasa en tu digital, conectada a datos reales y no a capturas de pantalla.':
    'One screen with everything happening in your digital, wired to real data and not to screenshots.',
  'Estrategia de Canales de Venta': 'Sales Channel Strategy',
  'Antes de gastar en publicidad, decidir por dónde vas a vender: B2B directo, marketplaces, o los dos.':
    'Before spending on advertising, deciding where you will sell: direct B2B, marketplaces, or both.',
  'LinkedIn de Empresa': 'Company LinkedIn',
  'El perfil que revisa tu comprador B2B antes de contestarte, y que casi siempre está abandonado.':
    'The profile your B2B buyer checks before answering you, and which is almost always neglected.',

  /*
   * Variantes que solo están en src/app/data. El sitio normalmente lee el
   * catálogo del panel, pero un navegador sin caché usa la copia del
   * repositorio, y ahí unas cuantas frases están redactadas distinto.
   */
  'Estado de indexación URL por URL en Search Console':
    'Indexing status, URL by URL, in Search Console',
  'Actualiza tu información cuando quieras sin reimprimir nada':
    'Update your details whenever you like, with nothing reprinted',
  'Conectado a Google Analytics: sesiones, canales de origen y qué hace la gente dentro del sitio':
    'Wired to Google Analytics: sessions, source channels and what people do inside the site',
  'Conectado a Google Search Console: posiciones, consultas que te traen gente y estado de indexación URL por URL':
    'Wired to Google Search Console: rankings, the queries bringing you people, and indexing status URL by URL',
  'Un tablero de resultados es una pantalla que reúne, en un solo lugar y actualizado solo, lo que hoy está repartido en cinco herramientas distintas: cuánta gente llega y de dónde, qué busca la gente que te encuentra, cuántos contactos dejaron sus datos, cuánto costó cada uno y —cuando el sistema de la empresa lo permite— cuáles de esos contactos terminaron en una venta facturada. No es un reporte que alguien arma a mano cada mes con capturas; es una conexión directa a Search Console, Analytics y las plataformas de campañas. La diferencia práctica es que una junta de dirección deja de discutir de dónde salió cada número y empieza a discutir qué hacer con ellos.':
    'A results dashboard is one screen that gathers, in a single place and updating on its own, what today is spread across five different tools: how many people arrive and from where, what the people who find you are searching for, how many left their details, what each one cost and —when the company’s system allows it— which of those leads ended in an invoiced sale. It is not a report somebody assembles by hand each month from screenshots; it is a direct connection to Search Console, Analytics and the campaign platforms. The practical difference is that a leadership meeting stops arguing about where each number came from and starts arguing about what to do with them.',

  /* ── nombres propios que no se traducen ────────────────────────────── */
  'OFITODO': 'OFITODO',
  'XPO SEDDE': 'XPO SEDDE',
  'Early Ties': 'Early Ties',
  'Aldea Digital': 'Aldea Digital',
  'Dual-Brand': 'Dual-Brand',
  '1828 Brasa y Carbón': '1828 Brasa y Carbón',
  'Evince World / Kubera': 'Evince World / Kubera',
  'UX/UI': 'UX/UI',
};
