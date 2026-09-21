import { PaginaServicioIA } from '../components/PaginaServicioIA';

/*
 * IA para WhatsApp (/servicios-ia/whatsapp).
 *
 * El diseño y la estructura son los de cualquier servicio: vienen de
 * components/FichaServicio. El contenido se edita en el panel, en
 * Páginas › IA para WhatsApp; aquí solo quedan los textos de respaldo, lo que
 * se ve si un campo está vacío. Tienen que coincidir con los `def` del
 * registro (panel/inc/contenido.php).
 */
export default function AIWhatsAppPage() {
  return (
    <PaginaServicioIA
      pagina="servicios-ia-whatsapp"
      claveMenu="whatsapp"
      nombre="IA para WhatsApp"
      seo={{
        title: 'IA para WhatsApp - Agente Inteligente 24/7 - INÉDITO DIGITAL',
        description: 'Agente inteligente de IA para WhatsApp que atiende, califica y da seguimiento a tus clientes automáticamente. Aumenta ventas y reduce costos operativos.',
        keywords: ['ia whatsapp', 'chatbot whatsapp', 'agente virtual whatsapp', 'automatización whatsapp', 'whatsapp business ia', 'bot ventas whatsapp'],
      }}
      respaldos={{
        etiqueta: 'IA PARA WHATSAPP',
        bajada: 'Tu mejor vendedor, siempre disponible. Atiende, califica y da seguimiento automático por WhatsApp.',
        incluye: [
          'Conversaciones naturales con IA entrenada en tu negocio',
          'Integración con CRM, calendarios y sistemas de pago',
          'Calificación automática de leads con scoring inteligente',
          'Análisis de sentimiento y priorización de urgencias',
          'Dashboard con métricas en tiempo real',
          'Notificaciones instantáneas de leads calificados',
        ],
        beneficios: [
          ['Respuestas Inmediatas', 'Atiende a tus clientes las 24 horas, los 7 días de la semana, sin perder ninguna oportunidad.'],
          ['Calificación de Prospectos', 'Identifica automáticamente leads de alta calidad y prioriza tu tiempo en lo que realmente importa.'],
          ['Seguimiento Automático', 'Nunca pierdas un prospecto. El agente hace seguimiento inteligente hasta concretar la venta.'],
          ['Agenda de Citas', 'Coordina y agenda reuniones automáticamente, sincronizado con tu calendario.'],
        ],
        pasos: [
          ['Configuración', 'Entrenamos la IA con información de tu negocio y flujos de conversación.'],
          ['Integración', 'Conectamos el agente a tu WhatsApp Business en minutos.'],
          ['Automatización', 'El agente empieza a atender, calificar y dar seguimiento automáticamente.'],
          ['Optimización', 'Mejora continua basada en datos reales y comportamiento de usuarios.'],
        ],
        ideal: [
          'Clínicas y consultorios médicos que necesitan agendar citas 24/7',
          'Inmobiliarias que califican prospectos y coordinan visitas',
          'E-commerce que procesa pedidos y resuelve dudas de productos',
          'Servicios profesionales que cotizan y agenden reuniones',
          'Empresas B2B que califican oportunidades comerciales',
          'Instituciones educativas que gestionan inscripciones',
        ],
      }}
    />
  );
}
