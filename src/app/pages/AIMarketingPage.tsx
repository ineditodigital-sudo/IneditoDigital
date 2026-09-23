import { PaginaServicioIA } from '../components/PaginaServicioIA';

/*
 * IA para Marketing (/servicios-ia/marketing).
 *
 * El diseño y la estructura son los de cualquier servicio: vienen de
 * components/FichaServicio. El contenido se edita en el panel, en
 * Páginas › IA para Marketing; aquí solo quedan los textos de respaldo, lo que
 * se ve si un campo está vacío. Tienen que coincidir con los `def` del
 * registro (panel/inc/contenido.php).
 */
export default function AIMarketingPage() {
  return (
    <PaginaServicioIA
      pagina="servicios-ia-marketing"
      nombre="IA para Marketing"
      seo={{
        title: 'IA para Marketing Digital - Automatización y Optimización - INÉDITO DIGITAL',
        description: 'Sistema de IA que automatiza tu marketing: genera contenido, optimiza campañas y maximiza ROI. Marketing que piensa por ti.',
        keywords: ['ia marketing', 'automatización marketing', 'marketing automation', 'ia contenido', 'optimización campañas', 'roi marketing'],
      }}
      respaldos={{
        etiqueta: 'IA PARA MARKETING DIGITAL',
        bajada: 'Automatiza contenido, optimiza campañas y multiplica resultados con inteligencia artificial.',
        incluye: [
          'Generación de contenido para redes sociales con IA',
          'Optimización automática de campañas de Google y Meta Ads',
          'A/B testing inteligente de creatividades y copy',
          'Análisis de sentimiento y monitoreo de marca',
          'Predicción de tendencias y oportunidades de mercado',
          'Dashboard unificado con métricas de todas las plataformas',
        ],
        beneficios: [
          ['Análisis Predictivo', 'Identifica qué campañas funcionarán antes de gastar presupuesto. Decisiones basadas en datos.'],
          ['Automatización Total', 'Genera contenido, programa publicaciones y optimiza anuncios sin intervención manual.'],
          ['Segmentación Inteligente', 'Crea audiencias hipersegmentadas que realmente convierten basadas en comportamiento real.'],
          ['ROI Optimizado', 'Ajusta presupuestos y pujas en tiempo real para maximizar retorno de inversión.'],
        ],
        pasos: [
          ['Conexión', 'Integramos tus cuentas de ads, redes sociales y analytics.'],
          ['Análisis', 'La IA estudia tu histórico y performance actual.'],
          ['Automatización', 'Genera contenido, optimiza campañas y segmenta audiencias.'],
          ['Mejora Continua', 'Aprende de resultados y ajusta estrategia automáticamente.'],
        ],
        ideal: [
          'Agencias de marketing que manejan múltiples clientes simultáneamente',
          'E-commerce con presupuesto publicitario mensual mayor a $20,000 MXN',
          'Empresas SaaS que necesitan generación constante de leads',
          'Consultores independientes que buscan escalar su negocio',
          'Marcas DTC (Direct to Consumer) enfocadas en crecimiento',
          'Startups en fase de validación de product-market fit',
        ],
      }}
    />
  );
}
