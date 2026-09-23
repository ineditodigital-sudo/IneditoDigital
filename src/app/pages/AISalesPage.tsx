import { PaginaServicioIA } from '../components/PaginaServicioIA';

/*
 * IA de Ventas (/servicios-ia/ventas).
 *
 * El diseño y la estructura son los de cualquier servicio: vienen de
 * components/FichaServicio. El contenido se edita en el panel, en
 * Páginas › IA de Ventas; aquí solo quedan los textos de respaldo, lo que
 * se ve si un campo está vacío. Tienen que coincidir con los `def` del
 * registro (panel/inc/contenido.php).
 */
export default function AISalesPage() {
  return (
    <PaginaServicioIA
      pagina="servicios-ia-ventas"
      nombre="IA de Ventas"
      seo={{
        title: 'IA de Ventas - Automatización Comercial Inteligente - INÉDITO DIGITAL',
        description: 'Sistema de IA que automatiza prospección, califica leads y optimiza tu proceso de ventas. Cierra más negocios con menos esfuerzo.',
        keywords: ['ia ventas', 'automatización ventas', 'lead scoring ia', 'prospección automática', 'crm inteligente', 'sales automation'],
      }}
      respaldos={{
        etiqueta: 'IA DE VENTAS',
        bajada: 'Sistema de IA que automatiza prospección, califica leads y optimiza cada etapa de tu proceso comercial.',
        incluye: [
          'Enriquecimiento automático de datos de prospectos',
          'Integración con LinkedIn, CRM y bases de datos comerciales',
          'Análisis predictivo de comportamiento de compra',
          'Secuencias de email y llamadas automatizadas',
          'Dashboard con métricas de conversión en tiempo real',
          'Alertas inteligentes de oportunidades de venta',
        ],
        beneficios: [
          ['Prospección Inteligente', 'Identifica y prioriza automáticamente leads con mayor probabilidad de conversión.'],
          ['Lead Scoring Automático', 'Califica cada prospecto con criterios personalizados y datos en tiempo real.'],
          ['Seguimiento Predictivo', 'Sabe cuándo y cómo contactar cada lead para maximizar probabilidad de cierre.'],
          ['Optimización de Pipeline', 'Identifica cuellos de botella y sugiere acciones para acelerar el ciclo de ventas.'],
        ],
        pasos: [
          ['Análisis', 'La IA analiza tu histórico de ventas y perfil de cliente ideal.'],
          ['Prospección', 'Busca y califica prospectos automáticamente en múltiples fuentes.'],
          ['Contacto', 'Ejecuta secuencias personalizadas de email, LinkedIn y llamadas.'],
          ['Optimización', 'Aprende de cada interacción para mejorar continuamente los resultados.'],
        ],
        ideal: [
          'Equipos de ventas B2B que necesitan calificar leads rápidamente',
          'Empresas SaaS con ciclos de venta complejos',
          'Consultorías y agencias que prospectan empresas',
          'Distribuidores mayoristas con grandes volúmenes de clientes',
          'Startups tecnológicas en fase de crecimiento',
          'Inmobiliarias comerciales con múltiples desarrollos',
        ],
      }}
    />
  );
}
