export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
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
    title: 'CHATBOTS y AGENTES',
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
    title: 'FUNNELS de VENTA',
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
    relatedServices: ['google-ads', 'email-marketing'],
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
    title: 'Google ADS',
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
    category: 'Marketing',
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
    id: '8',
    slug: 'email-marketing',
    title: 'Email MKT',
    shortDescription: 'Campañas de email que nutren leads y convierten suscriptores en clientes fieles.',
    icon: 'Mail',
    category: 'Marketing',
    bannerImage: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWFpbCUyMG1hcmtldGluZyUyMGNhbXBhaWdufGVufDF8fHx8MTc2NTk2NDQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    features: [
      'Diseño de templates responsive',
      'Secuencias automatizadas inteligentes',
      'Segmentación avanzada de audiencia',
      'A/B testing de subject lines',
      'Automatizaciones de carritos abandonados',
      'Analítica detallada de aperturas y clics'
    ],
    benefits: [
      'ROI de $42 por cada $1 invertido',
      'Nutre leads automáticamente',
      'Recupera ventas perdidas',
      'Construye relación duradera con clientes'
    ],
    ideal: [
      'Ecommerce y tiendas online',
      'Negocios con base de suscriptores',
      'Empresas con ciclos de venta largos',
      'Marcas que venden productos recurrentes'
    ],
    process: [
      { step: 1, title: 'Estrategia', description: 'Definimos objetivos, segmentos y customer journey' },
      { step: 2, title: 'Creación', description: 'Diseñamos templates y redactamos copy persuasivo' },
      { step: 3, title: 'Automatización', description: 'Configuramos secuencias y triggers inteligentes' },
      { step: 4, title: 'Optimización', description: 'Analizamos métricas y mejoramos tasas de conversión' }
    ],
    faq: [
      { question: '¿Qué tasa de apertura es buena?', answer: 'El promedio de la industria es 15-25%. Nuestras campañas bien segmentadas logran 25-40% de apertura.' },
      { question: '¿Necesito tener una lista de emails?', answer: 'Idealmente sí. Si no tienes lista, podemos ayudarte a construirla con lead magnets y estrategias de captura.' },
      { question: '¿Qué plataforma de email usan?', answer: 'Trabajamos con las principales: Mailchimp, ActiveCampaign, ConvertKit, etc. O la que tú prefieras.' },
      { question: '¿Cuántos emails debo enviar al mes?', answer: 'Depende de tu industria. Generalmente 2-4 emails por mes funciona bien sin saturar a tu audiencia.' }
    ],
    relatedServices: ['funnels-de-venta', 'chatbots-y-agentes'],
    order: 8
  },
  {
    id: '9',
    slug: 'creacion-de-logo',
    title: 'Creación de logo',
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
  }
];