import { PaginaServicioIA } from '../components/PaginaServicioIA';

/*
 * IA para E-commerce (/servicios-ia/ecommerce).
 *
 * El diseño y la estructura son los de cualquier servicio: vienen de
 * components/FichaServicio. El contenido se edita en el panel, en
 * Páginas › IA para E-commerce; aquí solo quedan los textos de respaldo, lo que
 * se ve si un campo está vacío. Tienen que coincidir con los `def` del
 * registro (panel/inc/contenido.php).
 */
export default function AIEcommercePage() {
  return (
    <PaginaServicioIA
      pagina="servicios-ia-ecommerce"
      nombre="IA para E-commerce"
      seo={{
        title: 'IA para E-commerce y Retail - INÉDITO DIGITAL',
        description: 'Convierte más visitas en ventas. Asistente inteligente de IA dentro de tu tienda online que recupera carritos, recomienda productos y automatiza soporte 24/7.',
        keywords: ['ia ecommerce', 'chatbot tienda online', 'recuperación carrito', 'shopify ia', 'woocommerce ia', 'automatización ecommerce', 'ventas online ia'],
      }}
      respaldos={{
        etiqueta: 'IA PARA E-COMMERCE',
        bajada: 'Asistente inteligente dentro de tu tienda que recupera carritos, recomienda productos y atiende 24/7.',
        incluye: [
          'Chat inteligente que guía desde duda hasta compra',
          'Upsell y cross-sell automático en momento ideal',
          'Personalización 1:1 basada en comportamiento',
          'Automatización de emails activados por acciones',
          'Análisis predictivo de inventario y tendencias',
          'Integración con Shopify, WooCommerce, Magento y más',
        ],
        beneficios: [
          ['Recuperación de Carrito', 'Identifica compradores que abandonaron y los contacta automáticamente con ofertas personalizadas.'],
          ['Recomendaciones Inteligentes', 'Sugiere productos complementarios en el momento exacto para aumentar el ticket promedio.'],
          ['Soporte Automático 24/7', 'Resuelve dudas de producto, inventario, envíos y devoluciones sin intervención humana.'],
          ['Más Ventas, Menos Fricción', 'Reduce abandono de compra con asistencia en tiempo real durante todo el proceso.'],
        ],
        pasos: [
          ['Instalación', 'Conectamos la IA a tu tienda en minutos, sin código.'],
          ['Entrenamiento', 'La IA aprende tu catálogo, políticas y tono de voz.'],
          ['Automatización', 'Empieza a asistir, recomendar y recuperar carritos.'],
          ['Optimización', 'Mejora continua basada en conversiones reales.'],
        ],
        ideal: [
          'Tiendas online con más de 100 visitas diarias que necesitan vender más',
          'Marcas propias (DTC) enfocadas en reducir costo de adquisición',
          'Shopify Stores con instalación en minutos sin código',
          'WooCommerce optimizado para WordPress con plugin nativo',
          'Vendedores en marketplaces que quieren su propia tienda',
          'Negocios de dropshipping que buscan automatizar atención',
        ],
      }}
    />
  );
}
