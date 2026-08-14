export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  services: string[];
  description: string;
  challenge: string;
  solution: string;
  results: { metric: string; value: string }[];
  image: string;
  websiteUrl: string;
  logo?: string;
  screenshots?: string[];
  tags: string[];
  year: string;
  highlights: string[];
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    slug: 'ofitodo',
    title: 'OFITODO - Transformación Digital Total',
    client: 'OFITODO',
    category: 'Ecommerce',
    services: ['Diseño Web Premium', 'SEO Avanzado', 'Optimización de Conversión'],
    description: 'Rediseño completo del sitio web para fabricante líder de muebles de oficina, aumentando ventas online y visibilidad en buscadores.',
    challenge: 'OFITODO necesitaba una presencia digital que reflejara la calidad de sus productos y facilitara el proceso de compra para clientes corporativos y minoristas.',
    solution: 'Desarrollamos un sitio web de última generación con catálogo optimizado, visualización 3D de productos, sistema de cotizaciones en línea y arquitectura SEO estratégica para dominar búsquedas de \"muebles de oficina\".',
    results: [
      { metric: 'Mejora en Conversión', value: '+340%' },
      { metric: 'Posicionamiento SEO', value: 'Top 3' },
      { metric: 'Tiempo de Carga', value: '-65%' },
      { metric: 'Leads Mensuales', value: '+280%' }
    ],
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_075337_6219d3b7dd2d.png',
    websiteUrl: 'https://ofitodo.com',
    logo: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_075728_a5af2fc47f9d.png',
    screenshots: [
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_075337_6219d3b7dd2d.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_075421_4b16570a45a2.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_075656_dfda7e9db91b.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_075715_8aec16731a46.png'
    ],
    tags: ['Diseño Web', 'SEO', 'Ecommerce'],
    year: '2024',
    highlights: ['Diseño vanguardista', 'SEO optimizado', 'Funcionalidades de venta avanzadas']
  },
  {
    id: '2',
    slug: 'aldea-digital',
    title: 'ALDEA DIGITAL - Espacios de Trabajo del Futuro',
    client: 'Aldea Digital',
    category: 'Coworking',
    services: ['Diseño Web', 'SEO Nacional', 'Lead Generation'],
    description: 'Plataforma digital robusta para red de espacios coworking con presencia en toda la República Mexicana.',
    challenge: 'ALDEA DIGITAL requería un sitio que comunicara su propuesta de valor premium, facilitara la conversión de visitantes en clientes y se posicionara a nivel nacional.',
    solution: 'Creamos una experiencia web inmersiva con tour virtual de espacios, sistema de reservaciones inteligente, SEO multi-localidad y estrategia de conversión basada en datos que captura leads calificados.',
    results: [
      { metric: 'Leads Calificados/Mes', value: '120+' },
      { metric: 'Posicionamiento Nacional', value: 'Top 5' },
      { metric: 'Tasa de Conversión', value: '4.8%' },
      { metric: 'Tráfico Orgánico', value: '+420%' }
    ],
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_082634_5bc006e92353.png',
    websiteUrl: 'https://aldea.work',
    logo: 'https://aldea.work/wp-content/uploads/2025/04/LOGO-ALDEA-AZUL.svg',
    screenshots: [
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_082634_5bc006e92353.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_082639_633036fbf9ed.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_082703_5e76a5b0345b.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_082744_7ca20e954eda.png'
    ],
    tags: ['Diseño Premium', 'SEO', 'Lead Generation'],
    year: '2024',
    highlights: ['Diseño excepcional', 'Posicionamiento SEO nacional', 'Generación de leads constante']
  },
  {
    id: '3',
    slug: 'early-ties',
    title: 'EARLY TIES - Experiencias Acuáticas para Familias',
    client: 'Early Ties',
    category: 'Educación',
    services: ['Diseño Web', 'UX/UI', 'Marketing de Contenidos'],
    description: 'Sitio web emocional y funcional para academia de natación especializada en bebés y niños.',
    challenge: 'Early Ties necesitaba un sitio que transmitiera confianza a los padres, comunicara su metodología única y facilitara la inscripción de nuevos alumnos.',
    solution: 'Diseñamos una experiencia web cálida y profesional con galerías de momentos especiales, información detallada sobre programas, testimonios de familias y sistema de registro simplificado.',
    results: [
      { metric: 'Inscripciones Digitales', value: '+190%' },
      { metric: 'Tiempo de Permanencia', value: '5.2 min' },
      { metric: 'Bounce Rate', value: '-58%' },
      { metric: 'Satisfacción de Usuario', value: '9.4/10' }
    ],
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_081418_1190a4d55ff6.png',
    websiteUrl: 'https://earlyties.com',
    logo: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_081646_2ebc98157935.png',
    screenshots: [
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_081418_1190a4d55ff6.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_081512_71cb60f6a921.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_081546_af66963b06a8.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_081629_6176dbde9a99.png'
    ],
    tags: ['Diseño Web', 'UX/UI', 'Educación'],
    year: '2024',
    highlights: ['Diseño emocional', 'UX excepcional', 'Información clara para padres']
  },
  {
    id: '4',
    slug: '1828-brasa-carbon',
    title: '1828 BRASA Y CARBÓN - Sabor Digital',
    client: '1828 Brasa y Carbón',
    category: 'Restaurantes',
    services: ['Diseño Web', 'Menú Digital', 'UX Mobile'],
    description: 'Sitio web gourmet para el restaurante más grande de la Feria Nacional de San Marcos en Aguascalientes.',
    challenge: '1828 necesitaba un sitio que reflejara la calidad de su comida, facilitara la navegación del menú y mejorara la experiencia del cliente.',
    solution: 'Desarrollamos un sitio web premium con menú digital interactivo, galería apetitosa de platillos, sistema de reservaciones y optimización mobile-first perfecta para consulta en el restaurante.',
    results: [
      { metric: 'Consultas de Menú Online', value: '+450%' },
      { metric: 'Reservaciones Web', value: '+310%' },
      { metric: 'Engagement Mobile', value: '92%' },
      { metric: 'Tiempo Promedio', value: '6.8 min' }
    ],
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_055447_90280d5d8bfc.png',
    websiteUrl: 'https://1828brasaycarbon.mx',
    logo: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_055916_8382c7966146.png',
    screenshots: [
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_055447_90280d5d8bfc.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_055633_20290b2f6e71.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_055713_e9c612be18e9.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_055822_28ad6bd52c5d.png'
    ],
    tags: ['Diseño Web', 'Restaurantes', 'UX'],
    year: '2024',
    highlights: ['Diseño premium', 'Menú digital optimizado', 'Experiencia mobile perfecta']
  },
  {
    id: '5',
    slug: 'xpo-sedde',
    title: 'XPO SEDDE - Stands que Venden',
    client: 'XPO SEDDE',
    category: 'Diseño y Montaje',
    services: ['Diseño Web', 'Chatbot IA', 'SEO', 'Lead Nurturing'],
    description: 'Sitio web innovador con chatbot inteligente para empresa líder en diseño y montaje de stands y exposiciones.',
    challenge: 'XPO SEDDE requería un sitio que destacara visualmente, capturara leads calificados y optimizara el proceso de cotización.',
    solution: 'Creamos un sitio web refrescante con portafolio visual impactante, chatbot de embudo que califica leads automáticamente, arquitectura SEO robusta y sistema de seguimiento de prospectos.',
    results: [
      { metric: 'Leads Automáticos/Mes', value: '85+' },
      { metric: 'Calificación de Leads', value: '100% Auto' },
      { metric: 'Conversión Chatbot', value: '68%' },
      { metric: 'Posicionamiento SEO', value: 'Top 5' }
    ],
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_085857_ab54e69748ea.png',
    websiteUrl: 'https://xposedde-nuevo.figma.site',
    logo: 'https://imagenes.inedito.digital/XPOSEDDE/LOGOS-PRUEBA/imagen_2026-03-11_154353521.webp',
    screenshots: [
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_085857_ab54e69748ea.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090204_cb9f65c4f574.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_085936_24b75e7708bf.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_085919_cbd445ab6738.png'
    ],
    tags: ['Diseño Web', 'Chatbot IA', 'SEO'],
    year: '2024',
    highlights: ['Diseño refrescante', 'Chatbot de embudo inteligente', 'SEO optimizado']
  },
  {
    id: '6',
    slug: 'evince-kubera',
    title: 'EVINCE / KUBERA - Lujo Dual Digital',
    client: 'Evince World / Kubera',
    category: 'Lujo & Construcción',
    services: ['Diseño Web Vanguardista', 'Dual-Brand Strategy', 'UX Premium'],
    description: 'Sitio web dual ultra-premium para constructora de albercas de lujo (Evince) y desarrolladora de propiedades exclusivas (Kubera).',
    challenge: 'Dos marcas hermanas necesitaban presencia digital unificada que mantuviera identidades únicas y comunicara exclusividad a clientela de alto poder adquisitivo.',
    solution: 'Desarrollamos un sitio vanguardista con arquitectura dual-brand, navegación fluida entre marcas, diseño minimalista de ultra-lujo, galerías de proyectos premium y experiencia inmersiva que transmite exclusividad.',
    results: [
      { metric: 'Consultas Premium/Mes', value: '42+' },
      { metric: 'Ticket Promedio Proyecto', value: '$2.5M MXN' },
      { metric: 'Tiempo de Permanencia', value: '8.4 min' },
      { metric: 'Tasa de Rebote', value: '18%' }
    ],
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090510_9f44928d46cb.png',
    websiteUrl: 'https://evinceworld.com',
    logo: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090643_e7c8c61d43ee.png',
    screenshots: [
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090510_9f44928d46cb.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090621_72ba71eba776.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090556_c421a977213d.png',
      'https://imagenes.inedito.digital/INEDITO%20DIGITAL/PORTAFOLIO/20260109_090531_6a9d4cf8b663.png'
    ],
    tags: ['Diseño Vanguardista', 'Dual-Brand', 'Lujo'],
    year: '2024',
    highlights: ['Diseño vanguardista', 'Arquitectura dual-brand única', 'Experiencia de lujo']
  }
];