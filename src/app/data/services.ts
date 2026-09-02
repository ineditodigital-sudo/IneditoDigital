export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  /** Responde "que es" en las primeras palabras. Lo edita el panel. */
  definicion?: string;
  icon: string;
  category: string;
  bannerImage?: string;
  features: string[];
  benefits: string[];
  ideal: string[];
  process: { step: number; title: string; description: string }[];
  faq: { question: string; answer: string }[];
  relatedServices: string[];
  order: number;
}

export const SERVICES: Service[] = [
  {
    id: '1',
    slug: 'diseno-y-desarrollo-web',
    title: 'Diseño y Desarrollo Web',
    shortDescription: 'Sitios web profesionales, rápidos y optimizados para convertir visitantes en clientes.',
    icon: 'Code',
    category: 'Desarrollo',
    bannerImage: 'https://images.unsplash.com/photo-1612541122840-bf7071c968a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjU5NzA2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Diseño responsive para todos los dispositivos',
      'Optimización SEO desde el código',
      'Velocidad de carga ultrarrápida',
      'Integración con herramientas de marketing',
      'Panel de administración intuitivo',
      'Seguridad y certificados SSL incluidos'
    ],
    benefits: [
      'Mejora tu presencia digital profesional',
      'Aumenta conversiones hasta 300%',
      'Posiciona tu marca en Google',
      'Ahorra tiempo con automatizaciones'
    ],
    ideal: [
      'Empresas que necesitan actualizar su imagen digital',
      'Negocios sin presencia web o con sitios obsoletos',
      'Marcas que buscan destacar de la competencia',
      'Emprendedores que quieren escalar su negocio'
    ],
    process: [
      { step: 1, title: 'Descubrimiento', description: 'Analizamos tu negocio, objetivos y competencia para crear una estrategia ganadora' },
      { step: 2, title: 'Diseño', description: 'Creamos mockups profesionales alineados a tu identidad de marca' },
      { step: 3, title: 'Desarrollo', description: 'Programamos tu sitio con las mejores tecnologías y optimizaciones' },
      { step: 4, title: 'Lanzamiento', description: 'Publicamos, capacitamos y monitoreamos el rendimiento inicial' }
    ],
    faq: [
      { question: '¿Cuánto tiempo toma desarrollar un sitio web?', answer: 'Dependiendo de la complejidad, entre 2 a 6 semanas. Sitios simples pueden estar listos en 2 semanas, mientras que tiendas online o plataformas complejas requieren 4-6 semanas.' },
      { question: '¿El sitio será responsive?', answer: 'Sí, todos nuestros sitios están optimizados para verse perfectos en móviles, tablets y escritorio.' },
      { question: '¿Incluye hosting y dominio?', answer: 'Te asesoramos en la contratación y podemos gestionar el hosting por ti. El primer año de dominio puede estar incluido según el paquete.' },
      { question: '¿Puedo actualizar el contenido yo mismo?', answer: 'Absolutamente. Incluimos un panel de administración fácil de usar y capacitación completa.' }
    ],
    relatedServices: ['posicionamiento-organico', 'google-ads'],
    order: 1
  },
  {
    id: '2',
    slug: 'chatbots-y-agentes',
    title: 'Chatbots y Agentes',
    shortDescription: 'Automatiza tu atención al cliente 24/7 con inteligencia artificial que vende por ti.',
    icon: 'Bot',
    category: 'IA',
    bannerImage: 'https://images.unsplash.com/photo-1495055154266-57bbdeada43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBhdXRvbWF0aW9uJTIwYWl8ZW58MXx8fHwxNzY1OTk2Mjc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Respuestas automáticas inteligentes 24/7',
      'Integración con WhatsApp, Facebook, Instagram',
      'Calificación automática de leads',
      'Transferencia a humano cuando se necesita',
      'Analítica de conversaciones en tiempo real',
      'Entrenamiento personalizado con tu información'
    ],
    benefits: [
      'Atiende clientes mientras duermes',
      'Reduce costos de personal hasta 70%',
      'Aumenta tasa de respuesta al 100%',
      'Captura leads que perderías fuera de horario'
    ],
    ideal: [
      'Negocios con alto volumen de consultas',
      'Empresas que pierden ventas fuera de horario',
      'Equipos de ventas saturados',
      'Negocios que quieren escalar sin contratar más personal'
    ],
    process: [
      { step: 1, title: 'Análisis', description: 'Estudiamos tus conversaciones actuales y flujos de venta' },
      { step: 2, title: 'Diseño del flujo', description: 'Creamos el árbol de decisiones y respuestas del chatbot' },
      { step: 3, title: 'Entrenamiento', description: 'Programamos y entrenamos la IA con tu base de conocimiento' },
      { step: 4, title: 'Integración', description: 'Conectamos con tus canales y herramientas de CRM' }
    ],
    faq: [
      { question: '¿El chatbot puede vender por mí?', answer: 'Sí, está diseñado para calificar leads, responder objeciones, agendar citas y cerrar ventas automáticamente.' },
      { question: '¿Qué pasa si el bot no sabe responder?', answer: 'El sistema detecta cuando necesita ayuda humana y transfiere la conversación a tu equipo automáticamente.' },
      { question: '¿Se integra con mi CRM actual?', answer: 'Sí, podemos integrarlo con la mayoría de CRMs populares como HubSpot, Salesforce, Zoho, etc.' },
      { question: '¿Cuánto tiempo toma implementarlo?', answer: 'Un chatbot básico puede estar listo en 1-2 semanas. Agentes más complejos requieren 3-4 semanas.' }
    ],
    relatedServices: ['funnels-de-venta', 'diseno-y-desarrollo-web'],
    order: 2
  },
  {
    id: '3',
    slug: 'funnels-de-venta',
    title: 'Funnels de Venta',
    shortDescription: 'Embudos de conversión optimizados que convierten tráfico en clientes pagando.',
    icon: 'TrendingUp',
    category: 'Marketing',
    bannerImage: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMGNoYXJ0fGVufDF8fHx8MTc2NTg2ODQ4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Landing pages de alta conversión',
      'Secuencias de email marketing automatizadas',
      'Páginas de captura optimizadas',
      'Thank you pages con upsells',
      'Seguimiento con píxeles de conversión',
      'A/B testing integrado'
    ],
    benefits: [
      'Convierte más visitantes en clientes',
      'Automatiza tu proceso de ventas',
      'Aumenta el ticket promedio con upsells',
      'Mide cada paso del customer journey'
    ],
    ideal: [
      'Negocios que invierten en publicidad',
      'Empresas con productos/servicios digitales',
      'Marcas que lanzan nuevos productos',
      'Negocios que quieren escalar ventas rápidamente'
    ],
    process: [
      { step: 1, title: 'Estrategia', description: 'Definimos objetivos, avatar del cliente y oferta irresistible' },
      { step: 2, title: 'Diseño del funnel', description: 'Estructuramos cada etapa del embudo de conversión' },
      { step: 3, title: 'Implementación', description: 'Creamos landing pages, emails y automatizaciones' },
      { step: 4, title: 'Optimización', description: 'Analizamos datos y mejoramos continuamente la conversión' }
    ],
    faq: [
      { question: '¿Qué tasa de conversión puedo esperar?', answer: 'Depende de tu industria y tráfico, pero nuestros funnels promedian 15-25% de conversión en landing pages y 3-8% en ventas finales.' },
      { question: '¿Necesito tener tráfico ya?', answer: 'Idealmente sí. El funnel optimiza el tráfico que llega. Podemos ayudarte también con estrategias de generación de tráfico.' },
      { question: '¿Incluye las secuencias de email?', answer: 'Sí, incluimos el diseño y configuración de toda la secuencia de emails automatizados.' },
      { question: '¿Puedo usar mi plataforma de email actual?', answer: 'Sí, trabajamos con las principales plataformas como Mailchimp, ActiveCampaign, ConvertKit, etc.' }
    ],
    relatedServices: ['google-ads', 'chatbots-y-agentes'],
    order: 3
  },
  {
    id: '4',
    slug: 'posicionamiento-organico',
    title: 'Posicionamiento Orgánico',
    shortDescription: 'Domina Google y atrae clientes que buscan activamente tus servicios.',
    icon: 'Search',
    category: 'SEO',
    bannerImage: 'https://images.unsplash.com/photo-1674027326347-37509301f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW8lMjBzZWFyY2glMjBlbmdpbmV8ZW58MXx8fHwxNzY1OTk2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Auditoría SEO completa',
      'Investigación de palabras clave rentables',
      'Optimización on-page y técnica',
      'Estrategia de contenido SEO',
      'Link building de calidad',
      'Reportes mensuales de posicionamiento'
    ],
    benefits: [
      'Aparece en las primeras posiciones de Google',
      'Tráfico calificado y gratuito constante',
      'ROI superior a largo plazo vs ads',
      'Construye autoridad de marca'
    ],
    ideal: [
      'Negocios locales en Aguascalientes',
      'Empresas que buscan reducir costo de adquisición',
      'Marcas que quieren dominar su nicho',
      'Negocios con visión a largo plazo'
    ],
    process: [
      { step: 1, title: 'Auditoría', description: 'Analizamos tu sitio actual y la competencia en profundidad' },
      { step: 2, title: 'Estrategia', description: 'Definimos keywords objetivo y plan de acción trimestral' },
      { step: 3, title: 'Optimización', description: 'Mejoramos aspectos técnicos, contenido y estructura del sitio' },
      { step: 4, title: 'Crecimiento', description: 'Creamos contenido y construimos autoridad mes a mes' }
    ],
    faq: [
      { question: '¿Cuánto tiempo toma ver resultados?', answer: 'Los primeros resultados se ven entre 3-6 meses. El SEO es una estrategia de mediano a largo plazo que genera resultados compuestos.' },
      { question: '¿Garantizan primera posición en Google?', answer: 'Nadie puede garantizar posiciones específicas. Sin embargo, garantizamos mejoras medibles en tráfico y posicionamiento para keywords relevantes.' },
      { question: '¿Trabajan SEO local en Aguascalientes?', answer: 'Sí, somos expertos en SEO local. Optimizamos Google My Business y estrategias específicas para aparecer en búsquedas locales.' },
      { question: '¿Qué incluye el servicio mensual?', answer: 'Optimizaciones técnicas, creación de contenido, link building, monitoreo de posiciones y reporte mensual detallado.' }
    ],
    relatedServices: ['diseno-y-desarrollo-web', 'google-ads'],
    order: 4
  },
  {
    id: '5',
    slug: 'google-ads',
    title: 'Google Ads',
    shortDescription: 'Campañas publicitarias rentables que generan clientes desde el primer día.',
    icon: 'Target',
    category: 'Publicidad',
    bannerImage: 'https://images.unsplash.com/photo-1522798435862-6283b845139c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBhZHMlMjBkaWdpdGFsfGVufDF8fHx8MTc2NTk5NjI3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Campañas de búsqueda optimizadas',
      'Display y remarketing estratégico',
      'Shopping para ecommerce',
      'YouTube Ads para alcance masivo',
      'Optimización de conversiones con IA',
      'Gestión de presupuesto inteligente'
    ],
    benefits: [
      'Resultados inmediatos desde día 1',
      'Solo pagas por clics reales',
      'Alcanza clientes en momento de compra',
      'ROI medible y transparente'
    ],
    ideal: [
      'Negocios que necesitan ventas rápidas',
      'Lanzamientos de productos/servicios',
      'Empresas con presupuesto de publicidad',
      'Negocios altamente competitivos'
    ],
    process: [
      { step: 1, title: 'Setup inicial', description: 'Configuramos tracking, audiencias y estructura de cuenta' },
      { step: 2, title: 'Investigación', description: 'Analizamos keywords, competencia y oportunidades de mercado' },
      { step: 3, title: 'Lanzamiento', description: 'Creamos anuncios persuasivos y lanzamos campañas' },
      { step: 4, title: 'Optimización', description: 'Ajustamos pujas, audiencias y creatividades semanalmente' }
    ],
    faq: [
      { question: '¿Cuánto debo invertir en Google Ads?', answer: 'Recomendamos mínimo $300-500 USD mensuales para tener datos suficientes y optimizar. El presupuesto ideal depende de tu industria y objetivos.' },
      { question: '¿Cuánto cobran por la gestión?', answer: 'Nuestro fee de gestión es del 15-20% del gasto publicitario, con mínimo de $200 USD/mes. Incluye optimización continua y reportes.' },
      { question: '¿Qué ROI puedo esperar?', answer: 'Depende de tu industria y ciclo de venta. Nuestros clientes promedian 3:1 a 8:1 de retorno sobre inversión publicitaria.' },
      { question: '¿Hacen campañas en Facebook/Instagram también?', answer: 'Sí, manejamos todas las plataformas publicitarias principales con estrategias integradas.' }
    ],
    relatedServices: ['funnels-de-venta', 'diseno-y-desarrollo-web'],
    order: 5
  },
  {
    id: '6',
    slug: 'branding',
    title: 'Branding',
    shortDescription: 'Identidad de marca memorable que conecta emocionalmente con tu audiencia.',
    icon: 'Palette',
    category: 'Diseño',
    bannerImage: 'https://images.unsplash.com/photo-1762787863004-767d5d7eac07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGlkZW50aXR5JTIwZGVzaWdufGVufDF8fHx8MTc2NTk4NjI0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Investigación de marca y competencia',
      'Naming y estrategia de marca',
      'Manual de identidad corporativa',
      'Paleta de colores y tipografías',
      'Aplicaciones en diferentes medios',
      'Guía de voz y tono de marca'
    ],
    benefits: [
      'Destaca de la competencia',
      'Genera confianza y profesionalismo',
      'Consistencia en todos tus canales',
      'Aumenta el valor percibido'
    ],
    ideal: [
      'Nuevos negocios y startups',
      'Empresas que necesitan rebranding',
      'Marcas que quieren profesionalizarse',
      'Negocios listos para escalar'
    ],
    process: [
      { step: 1, title: 'Discovery', description: 'Entendemos tu visión, valores y posicionamiento deseado' },
      { step: 2, title: 'Conceptualización', description: 'Generamos múltiples conceptos creativos alineados a tu estrategia' },
      { step: 3, title: 'Refinamiento', description: 'Pulimos el concepto seleccionado hasta la perfección' },
      { step: 4, title: 'Entrega', description: 'Proporcionamos manual de marca completo y todos los archivos' }
    ],
    faq: [
      { question: '¿Cuántas propuestas de logo recibiré?', answer: 'Presentamos 3 conceptos iniciales diferentes. Luego refinamos el concepto seleccionado con hasta 3 rondas de ajustes.' },
      { question: '¿Qué archivos recibo al final?', answer: 'Entregas todos los archivos del logo en formatos vectoriales (AI, EPS, SVG, PDF) y rasterizados (PNG, JPG) en diferentes versiones y colores.' },
      { question: '¿Incluye el registro de marca?', answer: 'No incluye el trámite legal, pero te asesoramos en el proceso y te conectamos con especialistas si lo necesitas.' },
      { question: '¿Hacen aplicaciones como tarjetas, papelería?', answer: 'Sí, podemos incluir diseño de papelería, tarjetas, templates de redes sociales, etc. según el paquete contratado.' }
    ],
    relatedServices: ['creacion-de-logo', 'diseno-y-desarrollo-web'],
    order: 6
  },
  {
    id: '7',
    slug: 'servicios-qr',
    title: 'Servicios QR',
    shortDescription: 'Códigos QR inteligentes que conectan el mundo físico con tu estrategia digital.',
    icon: 'QrCode',
    category: 'Innovación',
    bannerImage: 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NjU5NDkzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'QR dinámicos editables sin reimprimir',
      'Tracking de escaneos en tiempo real',
      'Diseños personalizados con tu marca',
      'Múltiples destinos (web, vCard, WiFi, PDF)',
      'Analítica geográfica y temporal',
      'QR para pagos y propinas'
    ],
    benefits: [
      'Conecta offline con online sin fricción',
      'Mide efectividad de material impreso',
      'Actualiza destinos sin reimprimir',
      'Mejora experiencia del cliente'
    ],
    ideal: [
      'Restaurantes y cafeterías',
      'Retail y tiendas físicas',
      'Eventos y conferencias',
      'Empresas con material impreso'
    ],
    process: [
      { step: 1, title: 'Estrategia', description: 'Definimos objetivos y puntos de contacto óptimos para QR' },
      { step: 2, title: 'Diseño', description: 'Creamos QRs personalizados alineados a tu identidad' },
      { step: 3, title: 'Implementación', description: 'Configuramos tracking y destinos inteligentes' },
      { step: 4, title: 'Análisis', description: 'Monitoreamos escaneos y optimizamos la estrategia' }
    ],
    faq: [
      { question: '¿Qué es un QR dinámico?', answer: 'A diferencia de los estáticos, los QR dinámicos te permiten cambiar el destino/contenido después de imprimirlos, además de trackear estadísticas.' },
      { question: '¿Puedo ver quién escanea mis QR?', answer: 'Puedes ver estadísticas como ubicación, fecha, hora y dispositivo, pero no datos personales específicos por privacidad.' },
      { question: '¿Los QR expiran?', answer: 'No, nuestros QRs dinámicos son permanentes mientras mantengas el servicio activo.' },
      { question: '¿Funcionan para menús de restaurantes?', answer: 'Sí, son perfectos para menús digitales. Puedes actualizar precios y platillos sin reimprimir.' }
    ],
    relatedServices: ['diseno-y-desarrollo-web', 'branding'],
    order: 7
  },
  {
    id: '9',
    slug: 'creacion-de-logo',
    title: 'Creación de Logo',
    shortDescription: 'Logos profesionales que representan la esencia de tu marca de forma memorable.',
    icon: 'Sparkles',
    category: 'Diseño',
    bannerImage: 'https://images.unsplash.com/photo-1574576839798-00b48241d0b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRpb24lMjB2aWRlb3xlbnwxfHx8fDE3NjU5OTYyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Investigación de mercado y competencia',
      'Múltiples conceptos creativos',
      'Revisiones ilimitadas incluidas',
      'Versiones en todos los formatos',
      'Variantes en color y monocromáticas',
      'Guía básica de uso del logo'
    ],
    benefits: [
      'Primera impresión profesional',
      'Identidad visual memorable',
      'Versatilidad en todos los medios',
      'Propiedad 100% tuya'
    ],
    ideal: [
      'Nuevos emprendimientos',
      'Negocios que necesitan renovar imagen',
      'Marcas personales',
      'Proyectos side hustle'
    ],
    process: [
      { step: 1, title: 'Brief', description: 'Comprendemos tu marca, valores y preferencias estéticas' },
      { step: 2, title: 'Conceptos', description: 'Desarrollamos 3 propuestas creativas diferentes' },
      { step: 3, title: 'Refinamiento', description: 'Pulimos el concepto elegido hasta tu satisfacción' },
      { step: 4, title: 'Entrega', description: 'Proporcionamos archivos finales en todos los formatos' }
    ],
    faq: [
      { question: '¿Cuál es la diferencia con el servicio de Branding?', answer: 'La creación de logo es solo el diseño del logotipo. Branding incluye estrategia completa, manual de marca, paletas, tipografías y aplicaciones.' },
      { question: '¿Puedo solicitar cambios después de entregar?', answer: 'Las revisiones ilimitadas son durante el proceso. Después de la entrega final, los cambios tienen costo adicional.' },
      { question: '¿Qué formatos recibo?', answer: 'Recibes archivos vectoriales (AI, EPS, SVG, PDF) y rasterizados (PNG transparente, JPG) en alta resolución.' },
      { question: '¿Cuánto tiempo toma crear un logo?', answer: 'Aproximadamente 1-2 semanas, dependiendo de la cantidad de revisiones y feedback de tu parte.' }
    ],
    relatedServices: ['branding', 'diseno-y-desarrollo-web'],
    order: 9
  },
  {
    id: '10',
    slug: 'activaciones-para-expo',
    title: 'Activaciones para Expo',
    shortDescription: 'Interacciones y activaciones digitales que transforman tu stand en experiencias memorables.',
    icon: 'Sparkles',
    category: 'Eventos',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    features: [
      'Photobooth interactivo con RA',
      'Sistemas de gamificación y trivias',
      'Registro digital y captura de leads',
      'Experiencias de realidad aumentada',
      'Encuestas y votaciones en tiempo real',
      'Pantallas táctiles interactivas'
    ],
    benefits: [
      'Captura la atención de visitantes',
      'Genera engagement genuino y memorable',
      'Captura datos de prospectos calificados',
      'Diferencia tu marca de la competencia'
    ],
    ideal: [
      'Empresas participando en expos y ferias',
      'Marcas que buscan destacar en eventos',
      'Negocios que necesitan capturar leads',
      'Empresas con stands en conferencias'
    ],
    process: [
      { step: 1, title: 'Estrategia', description: 'Definimos objetivos, tipo de activación y experiencia deseada' },
      { step: 2, title: 'Personalización', description: 'Adaptamos la activación a tu marca, colores e identidad' },
      { step: 3, title: 'Instalación', description: 'Montamos y configuramos todo en tu stand antes del evento' },
      { step: 4, title: 'Soporte', description: 'Brindamos soporte técnico durante todo el evento y análisis final' }
    ],
    faq: [
      { question: '¿Cuánto tiempo antes debo contratar?', answer: 'Idealmente 2-3 semanas antes del evento para personalización completa. Podemos atender urgencias con menos tiempo.' },
      { question: '¿Incluye el equipo técnico?', answer: 'Sí, incluimos todo el hardware necesario: tablets, pantallas, cámaras, etc. según la activación contratada.' },
      { question: '¿Qué pasa si hay problemas técnicos durante el evento?', answer: 'Proporcionamos soporte técnico presencial o remoto durante todo el evento para resolver cualquier incidencia.' },
      { question: '¿Puedo ver los datos capturados en tiempo real?', answer: 'Sí, tendrás acceso a un dashboard para ver leads, participaciones y métricas en tiempo real durante el evento.' }
    ],
    relatedServices: ['servicios-qr', 'chatbots-y-agentes'],
    order: 10
  },
  {
    id: '11',
    slug: 'tarjetas-de-presentacion-digital',
    title: 'Tarjetas de Presentación Digital NFC',
    shortDescription: 'Comparte tu contacto, redes y portafolio con un solo toque. Sin apps, sin imprimir, siempre actualizada.',
    icon: 'Nfc',
    category: 'Innovación',
    bannerImage: 'https://images.unsplash.com/photo-1622396481328-9a3e572eb64c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    features: [
      'Un toque con el celular abre tu página de contacto al instante',
      'Funciona con cualquier smartphone moderno, sin descargar ninguna app',
      'Diseño personalizado con tu marca, logo y colores',
      'Actualiza tu información cuando quieras sin reimprimir nada',
      'Incluye tu propia página de contacto, siempre disponible en línea',
      'Para una sola persona o para equipos completos: nos adaptamos'
    ],
    benefits: [
      'Comparte tu contacto en segundos, sin escribir nada a mano',
      'Tu tarjeta física nunca cambia: actualizas el contenido cuando quieras',
      'Cero reimpresiones ni cajas de tarjetas viejas en el cajón',
      'Una primera impresión moderna y memorable en cada reunión'
    ],
    ideal: [
      'Emprendedores y freelancers que hacen networking constantemente',
      'Equipos comerciales que comparten contacto y portafolio al vuelo',
      'Consultores y profesionales que actualizan su información con frecuencia',
      'Empresas que quieren reforzar su imagen de marca en cada interacción',
      'Agentes inmobiliarios, asesores y vendedores en eventos y ferias'
    ],
    process: [
      { step: 1, title: 'Diseño personalizado a tu identidad de marca', description: 'Tu logo, tus colores y tu tipografía sobre la tarjeta física. Tú la apruebas antes de producir nada' },
      { step: 2, title: 'Conexión con tu propia página de contacto', description: 'Creamos tu página de contacto y programamos el chip NFC para que apunte a ella' },
      { step: 3, title: 'Acércala para compartir', description: 'Acercas la tarjeta a cualquier celular y tu página de contacto se abre al instante' },
      { step: 4, title: 'Personaliza cualquier elemento de tu página', description: 'Cambias colores, botones, enlaces, redes y secciones cuando quieras, sin reimprimir la tarjeta' }
    ],
    faq: [
      { question: '¿Necesito instalar una aplicación para usarla?', answer: 'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.' },
      { question: '¿Qué pasa si cambio de número o de trabajo?', answer: 'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.' },
      { question: '¿Qué información puedo compartir?', answer: 'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.' },
      { question: '¿Cuánto tarda la entrega?', answer: 'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.' },
      { question: '¿Puedo pedir tarjetas para todo mi equipo?', answer: 'Sí. Cotizamos desde una sola persona hasta equipos completos, con diseño unificado para toda la empresa y una página de contacto propia para cada integrante. Nos adaptamos al tamaño de tu equipo.' }
    ],
    relatedServices: ['branding', 'servicios-qr'],
    order: 11
  },
  {
    id: 'ficha-de-google',
    slug: 'ficha-de-google',
    title: 'Ficha de Google',
    shortDescription: 'El perfil que aparece en Google y Maps cuando alguien busca tu negocio. Es de los activos más importantes y más descuidados.',
    definicion: 'La ficha de Google —antes Google My Business, hoy Google Business Profile— es el perfil de empresa que aparece a la derecha en Google y dentro de Maps, con dirección, horario, teléfono, fotos y reseñas. Es gratuita y la controla el dueño del negocio.',
    icon: 'MapPin',
    category: 'SEO Local',
    features: [
      'Reclamación y verificación del perfil',
      'Categoría principal y secundarias bien elegidas',
      'Horario, servicios y zona de cobertura completos',
      'Fotos propias del negocio, no de banco',
      'Rutina de reseñas con tus clientes reales',
      'Publicaciones y respuestas a las preguntas que deja la gente'
    ],
    benefits: [
      'Apareces en el bloque de mapas, que sale antes que los resultados normales',
      'Tus datos coinciden en Google, tu web y los directorios',
      'Las reseñas son la señal de confianza local más rápida que existe',
      'Las IA leen la ficha cuando les preguntan por proveedores de tu zona'
    ],
    ideal: [
      'Negocios con local o con zona de servicio definida',
      'Empresas cuya ficha lleva años sin que nadie la toque',
      'Quien aparece en Maps con la dirección o el horario equivocados'
    ],
    process: [
      {
        step: 1,
        title: 'Diagnóstico',
        description: 'Revisamos qué muestra hoy tu ficha y dónde no coincide con tu web y los directorios.'
      },
      {
        step: 2,
        title: 'Corrección',
        description: 'Datos, categorías, horario, zona y fotos. Todo lo que Google usa para decidir si te muestra.'
      },
      {
        step: 3,
        title: 'Reseñas',
        description: 'Montamos la rutina para pedirlas a clientes reales, sin comprarlas ni inventarlas.'
      },
      {
        step: 4,
        title: 'Medición',
        description: 'Cada mes: cuántas veces apareciste, cuántos pidieron indicaciones y cuántos llamaron.'
      }
    ],
    faq: [
      {
        question: '¿Qué es la ficha de Google?',
        answer: 'La ficha de Google (antes Google My Business, hoy Google Business Profile) es el perfil de empresa que aparece a la derecha en Google y dentro de Google Maps, con dirección, horario, teléfono, fotos y reseñas. Es gratuita y la controla el dueño del negocio.'
      },
      {
        question: '¿Cuánto tarda en notarse?',
        answer: 'Las correcciones de datos se reflejan en días. Las reseñas y el aumento de visibilidad tardan semanas y dependen de cuántas consigas y con qué constancia.'
      },
      {
        question: '¿Sirve si no tengo local abierto al público?',
        answer: 'Sí. Google permite perfiles de "zona de servicio" para negocios que van al cliente. Se oculta la dirección y se declara el área que cubres.'
      },
      {
        question: '¿Se pueden comprar reseñas?',
        answer: 'No, y no lo hacemos. Google detecta patrones de reseñas compradas y la sanción puede llegar a la eliminación del perfil. Lo que funciona es pedirlas de forma sistemática a clientes que sí te compraron.'
      },
      {
        question: '¿Qué pasa si mi dirección aparece distinta en varios sitios?',
        answer: 'Google pierde confianza en el dato y te muestra menos. Por eso el trabajo incluye unificar nombre, dirección y teléfono en tu web, tu ficha y los directorios donde ya apareces.'
      }
    ],
    relatedServices: [
      'posicionamiento-organico',
      'posicionamiento-en-ia'
    ],
    order: 90
  },
  {
    id: 'auditoria-con-ia',
    slug: 'auditoria-con-ia',
    title: 'Auditoría con IA',
    shortDescription: 'Revisamos tu presencia digital contra los objetivos que define tu dirección, y te decimos qué está mal con evidencia, no con opiniones.',
    definicion: 'Una auditoría digital es la revisión completa de la presencia de una empresa en internet, con la evidencia de cada hallazgo. Cubre la velocidad del sitio, qué páginas conoce Google, qué responden los asistentes de IA, la ficha de Google y quién la enlaza.',
    icon: 'ScanSearch',
    category: 'Estrategia',
    features: [
      'Velocidad real medida, no estimada',
      'Estado de indexación URL por URL en Search Console',
      'SEO, AEO y GEO revisados por separado',
      'Qué responden hoy ChatGPT, Claude, Gemini y Perplexity sobre tu empresa',
      'Ficha de Google y consistencia de datos entre fuentes',
      'Perfil de enlaces entrantes: cuántos dominios y de qué tipo'
    ],
    benefits: [
      'Sabes qué está roto antes de gastar en arreglarlo',
      'Cada hallazgo trae la evidencia que lo sustenta y cómo comprobarla',
      'Se repite cada mes, así que se ve si mejora o si no',
      'Sale un plan de trabajo priorizado, no un PDF para archivar'
    ],
    ideal: [
      'Empresas que ya invierten en digital y no saben qué está funcionando',
      'Quien tiene web y redes desde hace años sin revisión técnica',
      'Dirección que quiere números antes de aprobar presupuesto'
    ],
    process: [
      {
        step: 1,
        title: 'Objetivos',
        description: 'Primero preguntamos qué quiere lograr la dirección. Sin eso, una auditoría es una lista de opiniones.'
      },
      {
        step: 2,
        title: 'Medición',
        description: 'Conectamos Search Console y Analytics y medimos. Nada de estimaciones donde se puede medir.'
      },
      {
        step: 3,
        title: 'Diagnóstico',
        description: 'Cada hallazgo con su evidencia, su severidad y el esfuerzo que cuesta arreglarlo.'
      },
      {
        step: 4,
        title: 'Seguimiento',
        description: 'Se repite cada mes contra la foto anterior, para saber qué cambió y qué no.'
      }
    ],
    faq: [
      {
        question: '¿Es un reporte automático?',
        answer: 'No. Las herramientas automáticas dan listas de avisos sin contexto. Aquí la IA hace el trabajo pesado de medir y cruzar datos, y el diagnóstico se revisa y se prioriza contra los objetivos de tu negocio.'
      },
      {
        question: '¿Qué se entrega exactamente?',
        answer: 'Un informe técnico con cada hallazgo y su evidencia, un resumen ejecutivo entendible sin conocimientos técnicos, la lista de palabras clave con su situación real y un plan de trabajo ordenado por impacto.'
      },
      {
        question: '¿Pueden auditar sin acceso a mis cuentas?',
        answer: 'En parte. Sin Search Console se puede revisar lo que se ve desde fuera: velocidad, estructura, contenido y qué dicen las IA. Lo que no se puede saber sin acceso es qué busca de verdad la gente para encontrarte ni qué páginas están fuera del índice de Google.'
      },
      {
        question: '¿Pueden garantizar que ChatGPT recomiende mi empresa?',
        answer: 'No, y desconfía de quien lo prometa. Nadie puede reentrenar un modelo desde fuera. Lo que sí se puede es hacer que tu información sea correcta, consistente y fácil de citar, que es lo que estos sistemas usan cuando responden. El resto es la decisión del modelo.'
      },
      {
        question: '¿Cada cuánto conviene repetirla?',
        answer: 'La medición corre a diario de forma automática. La revisión completa tiene sentido cada mes o cada trimestre, según el ritmo de cambios del negocio.'
      }
    ],
    relatedServices: [
      'posicionamiento-en-ia',
      'ficha-de-google'
    ],
    order: 90
  },
  {
    id: 'chatgpt-ads',
    slug: 'chatgpt-ads',
    title: 'ChatGPT Ads',
    shortDescription: 'Publicidad dentro de ChatGPT. Es nuevo, casi nadie lo está trabajando, y por eso todavía se compra barato.',
    definicion: 'ChatGPT Ads es el sistema de publicidad de OpenAI dentro de ChatGPT: espacios pagados que aparecen junto a las respuestas que el asistente le da a millones de personas cada día. Es distinto de aparecer de forma orgánica en esas respuestas —eso es posicionamiento en IA y se trabaja aparte—; aquí se compra el espacio. Lo importante ahora no es el formato, que sigue cambiando mes a mes, sino el momento: cuando un canal publicitario abre, la competencia es baja y el costo por resultado es el más bajo que va a tener nunca. Eso duró alrededor de dos años en Google Ads y unos dieciocho meses en Meta. En Aguascalientes prácticamente ninguna empresa lo está probando todavía.',
    icon: 'Megaphone',
    category: 'Publicidad',
    features: [
      'Alta y configuración de la cuenta publicitaria, con la facturación a nombre de tu empresa',
      'Definición de a quién le hablamos: qué preguntas hace tu comprador cuando busca lo que vendes',
      'Redacción de los anuncios y de la página a la que llegan, que casi siempre es la mitad del resultado',
      'Presupuesto arrancando en pruebas chicas, y se sube solo lo que demuestra que convierte',
      'Medición en el mismo tablero que Google Ads y Meta, para poder compararlos de verdad',
      'Revisión mensual con Claude contra los objetivos que puso dirección, no contra métricas de vanidad'
    ],
    benefits: [
      'Entras cuando el espacio todavía es barato, no cuando ya lo encarecieron los demás',
      'Aparecer donde tu comprador ya está preguntando, en vez de esperar a que teclee en un buscador',
      'El mismo presupuesto rinde más que en un canal saturado',
      'Aprendes el canal antes que tu competencia, que es una ventaja que no se compra después'
    ],
    ideal: [
      'Empresas que ya invierten en Google Ads o Meta y quieren probar un canal nuevo sin apostar el presupuesto',
      'Negocios cuyo comprador investiga antes de decidir: servicios profesionales, industria, B2B',
      'Quien quiere ser el primero de su categoría en la ciudad y no el último en enterarse'
    ],
    process: [
      {
        step: 1,
        title: 'Encaje',
        description: 'Antes de gastar un peso revisamos si tu comprador le pregunta esto a una IA. Si no, te lo decimos y nos vamos a otro canal.'
      },
      {
        step: 2,
        title: 'Montaje',
        description: 'Cuenta, facturación, mensajes y la página de llegada. La página se prepara igual que para una campaña de Google: si llega gente y no convierte, el canal no tuvo la culpa.'
      },
      {
        step: 3,
        title: 'Prueba chica',
        description: 'Presupuesto acotado y varias versiones del mensaje. La meta de las primeras semanas es aprender qué funciona, no vender.'
      },
      {
        step: 4,
        title: 'Escalar lo que sirve',
        description: 'Se sube el presupuesto solo en lo que ya demostró costo por contacto razonable, y se apaga lo demás sin discusión.'
      }
    ],
    faq: [
      {
        question: '¿Ya está disponible para cualquier empresa?',
        answer: 'El acceso ha ido abriéndose por etapas y las condiciones cambian seguido. Lo primero que hacemos es revisar contigo si tu cuenta y tu país ya pueden entrar, y con qué formatos. Si todavía no, te lo decimos y no cobramos por esperar.'
      },
      {
        question: '¿Es lo mismo que salir recomendado en ChatGPT?',
        answer: 'No, y conviene no confundirlo. Salir recomendado dentro de la respuesta es orgánico y se trabaja con contenido y señales: eso es posicionamiento en IA. ChatGPT Ads es espacio comprado. Lo ideal es tener los dos, porque el orgánico sostiene y el pagado acelera.'
      },
      {
        question: '¿Cuánto hay que invertir para saber si sirve?',
        answer: 'Con presupuestos de prueba de unas cuantas semanas ya se ve si el canal trae contactos con costo razonable para tu giro. Definimos juntos el techo antes de empezar y no se toca sin tu autorización.'
      },
      {
        question: '¿Cómo sé que no estoy pagando por nada?',
        answer: 'Cada contacto que llega queda marcado con su origen y aparece en tu tablero junto a los de Google Ads y Meta. Al mes tienes el costo por contacto de cada canal en la misma pantalla, y si este sale caro se apaga.'
      }
    ],
    relatedServices: [
      'posicionamiento-en-ia',
      'google-ads'
    ],
    order: 91
  },
  {
    id: 'tablero-de-resultados',
    slug: 'tablero-de-resultados',
    title: 'Tablero de Resultados',
    shortDescription: 'Una sola pantalla con lo que pasa en tu digital, conectada a datos reales y no a capturas de pantalla.',
    definicion: 'Un tablero de resultados es una pantalla que reúne, en un solo lugar y actualizado solo, lo que hoy está repartido en cinco herramientas distintas: cuánta gente llega y de dónde, qué busca la gente que te encuentra, cuántos contactos dejaron sus datos, cuánto costó cada uno y —cuando el sistema de la empresa lo permite— cuáles de esos contactos terminaron en una venta facturada. No es un reporte que alguien arma a mano cada mes con capturas; es una conexión directa a Search Console, Analytics y las plataformas de campañas. La diferencia práctica es que una junta de dirección deja de discutir de dónde salió cada número y empieza a discutir qué hacer con ellos.',
    icon: 'LayoutDashboard',
    category: 'Estrategia',
    features: [
      'Conectado a Google Search Console: posiciones, consultas que te traen gente y estado de indexación URL por URL',
      'Conectado a Google Analytics: sesiones, canales de origen y qué hace la gente dentro del sitio',
      'Campañas de Google Ads y Meta en la misma pantalla, comparables entre sí',
      'Medición de recomendación por IA: en cuántas respuestas de ChatGPT, Claude, Gemini y Perplexity aparece tu marca',
      'Cruce de prospectos contra ventas cerradas, para clientes con ERP de Maindsoft',
      'Reporte mensual que se genera desde el mismo tablero y llega en PDF a quien tú digas'
    ],
    benefits: [
      'Dirección ve el mismo número que marketing, y se acaba la discusión sobre de dónde salió',
      'El costo por contacto de cada canal, lado a lado, para mover presupuesto con criterio',
      'Se ve dónde se cae la gente en el camino, que casi siempre vale más que traer más tráfico',
      'La auditoría con IA se actualiza sobre estos datos: el diagnóstico deja de ser una foto vieja'
    ],
    ideal: [
      'Empresas que ya invierten en digital y arman el reporte a mano cada mes',
      'Dirección que quiere decidir presupuesto con datos y hoy decide con impresiones',
      'Negocios con ERP que nunca han cruzado sus campañas contra facturación real'
    ],
    process: [
      {
        step: 1,
        title: 'Qué quiere ver dirección',
        description: 'Primero definimos los tres o cuatro números que de verdad se van a usar para decidir. Un tablero con cuarenta métricas no se mira dos veces.'
      },
      {
        step: 2,
        title: 'Conectar las fuentes',
        description: 'Search Console, Analytics, las cuentas de campañas y, cuando aplica, el ERP. Todo con permisos de solo lectura y a nombre de tu empresa.'
      },
      {
        step: 3,
        title: 'Armar la atribución',
        description: 'Marcar cada contacto con su origen para poder seguirlo hasta la venta. Es la parte que casi nadie hace y la que convierte el reporte en una decisión.'
      },
      {
        step: 4,
        title: 'Entrega y revisión',
        description: 'Te entregamos el acceso y el reporte mensual automático. Cada mes, Claude revisa el desempeño contra los objetivos y señala qué cambiar.'
      }
    ],
    faq: [
      {
        question: '¿Se puede ver antes de contratar?',
        answer: 'Sí. Tenemos un tablero de demostración con datos de ejemplo donde se ve exactamente el formato: los indicadores, el origen del tráfico, el embudo, la visibilidad en IA, la auditoría y el reporte que se genera. Pídelo por WhatsApp y te mandamos el enlace.'
      },
      {
        question: '¿Necesito tener ERP?',
        answer: 'No. Sin ERP el tablero llega hasta el contacto: cuántos, de dónde y a qué costo. Con ERP de Maindsoft se puede dar el paso siguiente y cruzar esos contactos contra ventas facturadas, que es donde la conversación cambia de tono.'
      },
      {
        question: '¿Los datos son míos?',
        answer: 'Sí. Las cuentas de Search Console, Analytics y las plataformas de campañas van a nombre de tu empresa y tú eres el propietario. Nosotros trabajamos con permisos, y si un día terminamos, los datos y el histórico se quedan contigo.'
      },
      {
        question: '¿Cada cuánto se actualiza?',
        answer: 'Las fuentes se leen a diario, así que lo que ves es de ayer y no del mes pasado. El reporte formal se arma una vez al mes, que es el ritmo al que se toman decisiones de presupuesto.'
      }
    ],
    relatedServices: [
      'auditoria-con-ia',
      'posicionamiento-organico'
    ],
    order: 92
  },
  {
    id: 'estrategia-de-canales',
    slug: 'estrategia-de-canales',
    title: 'Estrategia de Canales de Venta',
    shortDescription: 'Antes de gastar en publicidad, decidir por dónde vas a vender: B2B directo, marketplaces, o los dos.',
    definicion: 'Una estrategia de canales de venta es la decisión de por dónde va a llegar el dinero antes de gastar en traer gente. Para la mayoría de las empresas mexicanas hoy la disyuntiva es concreta: vender de forma directa a otras empresas —cotización, visita, relación larga y ticket alto— o abrir en marketplaces como Mercado Libre y Amazon, donde hay tráfico enorme pero el margen se comparte y el cliente no es del todo tuyo. Las dos rutas funcionan, pero piden inversiones distintas, equipos distintos y páginas distintas. Elegir mal no se arregla con más presupuesto de publicidad: se arregla volviendo a esta decisión.',
    icon: 'Route',
    category: 'Estrategia',
    features: [
      'Revisión de tu producto, tu margen y tu capacidad de surtido antes de recomendar nada',
      'Cálculo de lo que deja cada canal ya con comisiones, envíos y devoluciones descontados',
      'Análisis de qué está haciendo tu competencia en cada canal y a qué precio',
      'Plan de apertura del canal elegido, con lo que hay que preparar antes del primer peso de pauta',
      'Definición de qué se mide para saber en tres meses si la decisión fue la correcta',
      'Revisión con Claude contra los objetivos de dirección, no contra corazonadas'
    ],
    benefits: [
      'Dejas de gastar publicidad empujando por un canal que tu margen no aguanta',
      'Sabes cuánto te deja de verdad una venta en marketplace, ya con todo descontado',
      'El equipo comercial y la web se preparan para el canal correcto y no para los dos a medias',
      'La decisión queda escrita y con números, así que se puede revisar y no se vuelve a discutir cada junta'
    ],
    ideal: [
      'Fabricantes y distribuidores que se preguntan si abrir Mercado Libre o Amazon',
      'Empresas B2B que quieren dejar de depender de dos o tres clientes grandes',
      'Negocios que ya probaron un canal, no funcionó, y no saben si fue el canal o la ejecución'
    ],
    process: [
      {
        step: 1,
        title: 'Números primero',
        description: 'Margen real por producto, capacidad de surtido y costo de servir a un cliente. Sin esto, cualquier recomendación de canal es una opinión.'
      },
      {
        step: 2,
        title: 'Cómo está el terreno',
        description: 'Qué venden tus competidores en cada canal, a qué precio y con qué reputación. En marketplace eso se puede ver, y dice mucho.'
      },
      {
        step: 3,
        title: 'La decisión, con su cuenta',
        description: 'Se recomienda un camino con el número que lo sostiene: cuánto deja cada venta en cada canal después de comisiones. Si la respuesta es no abrir marketplace, se dice.'
      },
      {
        step: 4,
        title: 'Abrir y medir',
        description: 'Plan de arranque con lo que hay que preparar antes de pautar, y los indicadores que van a decir en tres meses si se sigue o se corrige.'
      }
    ],
    faq: [
      {
        question: '¿Ustedes venden en marketplaces por mí?',
        answer: 'Trabajamos la estrategia, la apertura y la medición del canal. La operación diaria —inventario, empaque, envíos, atención— la lleva tu equipo, porque es parte del negocio y no se puede tercerizar sin perder el control del margen.'
      },
      {
        question: '¿Y si mi producto no da para marketplace?',
        answer: 'Entonces se dice. Hay márgenes que no aguantan la comisión más el envío, y en esos casos abrir el canal es pagar por vender a pérdida. Preferimos perder ese proyecto a que lo descubras en seis meses.'
      },
      {
        question: '¿Cuánto tarda la decisión?',
        answer: 'El análisis toma de dos a tres semanas si tienes los números de margen a la mano. La parte lenta casi nunca somos nosotros: es reunir el costo real por producto, que muchas empresas no tienen desagregado.'
      },
      {
        question: '¿Esto reemplaza la publicidad?',
        answer: 'No, la ordena. La publicidad es el acelerador; el canal es la dirección. Acelerar en la dirección equivocada solo hace que llegues más rápido a un lugar donde no quieres estar.'
      }
    ],
    relatedServices: [
      'tablero-de-resultados',
      'funnels-de-venta'
    ],
    order: 93
  },
  {
    id: 'linkedin-de-empresa',
    slug: 'linkedin-de-empresa',
    title: 'LinkedIn de Empresa',
    shortDescription: 'El perfil que revisa tu comprador B2B antes de contestarte, y que casi siempre está abandonado.',
    definicion: 'El LinkedIn de empresa es la página institucional de un negocio dentro de la red donde están los compradores B2B. Importa por una razón muy concreta: cuando alguien recibe tu cotización o tu correo en frío, lo primero que hace es buscarte, y lo que encuentra decide si te contesta. Un perfil con la portada por defecto, tres publicaciones de hace dos años y catorce seguidores comunica lo mismo que una oficina con las luces apagadas. Trabajarlo no es publicar todos los días: es tener el perfil completo, el equipo vinculado y una cadencia sostenida de contenido que demuestre que la empresa sabe de lo que habla.',
    icon: 'Linkedin',
    category: 'Marketing',
    features: [
      'Perfil completo: portada, descripción, servicios, ubicación y datos que coinciden con los de tu web y tu ficha de Google',
      'Vinculación del equipo, para que quien te busque por una persona llegue a la empresa',
      'Calendario de publicaciones sostenible, pensado para tu ritmo real y no para uno que se abandona en tres semanas',
      'Contenido a partir de lo que ya sabes hacer: proyectos, procesos y respuestas a lo que te preguntan los clientes',
      'Coherencia con el resto de tu presencia, porque los datos disparejos entre perfiles restan en búsqueda local',
      'Medición de crecimiento y de qué publicaciones traen visitas al sitio'
    ],
    benefits: [
      'Cuando el comprador te investiga antes de contestar, encuentra una empresa activa',
      'Los datos consistentes entre web, ficha de Google y LinkedIn refuerzan tu presencia en búsqueda',
      'Tu equipo comercial deja de prospectar desde un perfil que no respalda lo que promete',
      'Es de los pocos lugares donde el contenido técnico llega directo a quien decide la compra'
    ],
    ideal: [
      'Empresas que le venden a otras empresas y prospectan por correo o por teléfono',
      'Negocios industriales y de servicios profesionales con ciclo de venta largo',
      'Quien tiene el perfil creado desde hace años y sin tocar desde entonces'
    ],
    process: [
      {
        step: 1,
        title: 'Revisión',
        description: 'Qué tienes hoy y qué encuentra alguien que te busca: perfil, equipo vinculado, última señal de vida y qué muestran tus competidores.'
      },
      {
        step: 2,
        title: 'Poner la casa en orden',
        description: 'Perfil completo y datos idénticos a los de tu web y tu ficha de Google. Esta parte se hace una vez y rinde siempre.'
      },
      {
        step: 3,
        title: 'Cadencia realista',
        description: 'Definimos cuánto se puede sostener de verdad. Dos publicaciones al mes durante un año valen más que quince en enero y silencio hasta diciembre.'
      },
      {
        step: 4,
        title: 'Publicar y medir',
        description: 'Contenido que sale de tu operación, con revisión mensual de crecimiento y de qué publicaciones trajeron gente al sitio.'
      }
    ],
    faq: [
      {
        question: '¿Sirve si mi empresa es industrial y no vende por internet?',
        answer: 'Sirve justamente ahí. En venta industrial nadie compra desde LinkedIn, pero casi todo comprador revisa el perfil antes de contestar una cotización. No es un canal de venta: es lo que hace que te tomen en serio cuando ya te encontraron.'
      },
      {
        question: '¿Van a publicar por nosotros?',
        answer: 'Sí, con material tuyo. Lo que no hacemos es inventar contenido genérico: las publicaciones salen de tus proyectos, tus procesos y las preguntas que te hacen los clientes, porque eso es lo único que suena a tu empresa y no a una plantilla.'
      },
      {
        question: '¿Cuántos seguidores necesito?',
        answer: 'Menos de los que crees. En B2B el número que importa no es cuánta gente te sigue sino si la persona correcta encontró un perfil serio cuando fue a revisarte. Doscientos seguidores del sector valen más que cinco mil de cualquier lado.'
      },
      {
        question: '¿En cuánto se ve algo?',
        answer: 'El perfil ordenado cambia la impresión desde la primera semana. La cadencia de contenido rinde a partir del tercer o cuarto mes, que es cuando ya hay suficiente publicado para que alguien que llega vea una empresa con actividad y no una racha.'
      }
    ],
    relatedServices: [
      'estrategia-de-canales',
      'funnels-de-venta'
    ],
    order: 94
  }
];
