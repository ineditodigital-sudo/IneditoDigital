import type { Service } from './services';
import { marca } from '../cms';
import { esCobertura } from './grupos';

/*
 * El sistema de la agencia, en tres pasos.
 *
 * Antes el menú de servicios era un catálogo: 23 enlaces en tres columnas por
 * categoría, con la especialidad (web, IA, medición) revuelta con productos
 * sueltos (QR, logo, tarjetas, expo, espectaculares) y hasta una página de SEO
 * local listada como si fuera un servicio. Se leía como «hacemos de todo».
 *
 * Ahora es una sola secuencia, dicha como lo que gana el cliente: que te
 * encuentren, que te escriban, que te compren. La IA va dentro de cada paso,
 * no como un departamento aparte, y el diagnóstico es la puerta de entrada.
 *
 * Es la fuente única del menú y del asistente: si alguien pregunta «¿qué
 * hacen?», el chat y el menú tienen que contar la misma historia. Lo que no
 * está aquí sigue publicado y posicionando; se llega desde /servicios y desde
 * el buscador del asistente.
 */

export type ItemMetodo = {
  titulo: string;
  desc: string;
  ruta: string;
  /** El servicio del panel, cuando lo es: el asistente usa su título vigente. */
  slug?: string;
  /** Lo que el asistente busca cuando no es un servicio del panel. */
  buscar: string;
};
export type PasoMetodo = { numero: string; titulo: string; sub: string; items: ItemMetodo[] };

/** Los tres pasos, con sus textos del panel (Marca › Menú de servicios). */
export function pasosDelMetodo(): PasoMetodo[] {
  const m = marca.menuServicios();
  return [
    {
      numero: '01',
      titulo: m('paso_1', 'Que te encuentren'),
      sub: m('paso_1_sub', 'En Google y en los asistentes de IA'),
      items: [
        { titulo: m('web', 'Sitio web'), desc: m('web_desc', 'Rápido, administrable y medido desde el primer día'),
          ruta: '/servicios/diseno-y-desarrollo-web', slug: 'diseno-y-desarrollo-web', buscar: 'Diseño y desarrollo web' },
        { titulo: m('seo', 'Posicionamiento en Google'), desc: m('seo_desc', 'Aparecer cuando te buscan'),
          ruta: '/servicios/posicionamiento-organico', slug: 'posicionamiento-organico', buscar: 'Posicionamiento orgánico' },
        { titulo: m('geo', 'Posicionamiento en IA'), desc: m('geo_desc', 'Que ChatGPT y Gemini te recomienden'),
          ruta: '/servicios/posicionamiento-en-ia', buscar: 'Posicionamiento en IA' },
        { titulo: m('ficha', 'Ficha de Google'), desc: m('ficha_desc', 'Tu negocio completo en el mapa'),
          ruta: '/servicios/ficha-de-google', slug: 'ficha-de-google', buscar: 'Ficha de Google' },
      ],
    },
    {
      numero: '02',
      titulo: m('paso_2', 'Que te escriban'),
      sub: m('paso_2_sub', 'Y que cada mensaje se conteste'),
      items: [
        { titulo: m('agente', 'Agente de IA para WhatsApp'), desc: m('agente_desc', 'Atiende a toda hora y le pasa el prospecto a tu equipo'),
          ruta: '/servicios-ia/whatsapp', buscar: 'IA para WhatsApp' },
        { titulo: m('ventas', 'IA de ventas'), desc: m('ventas_desc', 'Califica prospectos y les da seguimiento'),
          ruta: '/servicios-ia/ventas', buscar: 'IA de ventas' },
        { titulo: m('funnels', 'Funnels de venta'), desc: m('funnels_desc', 'Del anuncio a la conversación, sin fugas'),
          ruta: '/servicios/funnels-de-venta', slug: 'funnels-de-venta', buscar: 'Funnels de venta' },
      ],
    },
    {
      numero: '03',
      titulo: m('paso_3', 'Que te compren'),
      sub: m('paso_3_sub', 'Y que sepas qué canal vendió'),
      items: [
        { titulo: m('ads', 'Google Ads'), desc: m('ads_desc', 'Campañas medidas contra ventas reales'),
          ruta: '/servicios/google-ads', slug: 'google-ads', buscar: 'Google Ads' },
        { titulo: m('chatgpt', 'ChatGPT Ads'), desc: m('chatgpt_desc', 'Anúnciate donde tu cliente ya pregunta'),
          ruta: '/servicios/chatgpt-ads', slug: 'chatgpt-ads', buscar: 'ChatGPT Ads' },
        { titulo: m('canales', 'Estrategia de canales'), desc: m('canales_desc', 'Venta directa y marketplaces, en orden'),
          ruta: '/servicios/estrategia-de-canales', slug: 'estrategia-de-canales', buscar: 'Estrategia de canales' },
        { titulo: m('tablero', 'Tablero de resultados'), desc: m('tablero_desc', 'Todo tu digital en una sola pantalla'),
          ruta: '/servicios/tablero-de-resultados', slug: 'tablero-de-resultados', buscar: 'Tablero de resultados' },
      ],
    },
  ];
}

/** La puerta de entrada: el diagnóstico, antes de cualquier paso. */
export function diagnosticoDelMetodo() {
  const m = marca.menuServicios();
  return {
    kicker: m('empieza', 'Empieza aquí'),
    titulo: m('diag_titulo', 'Diagnóstico con IA'),
    texto: m('diag_texto', 'Te decimos qué ven de ti Google y los asistentes de IA, qué está mal y qué arreglar primero. Con evidencia.'),
    boton: m('diag_boton', 'Pedir diagnóstico'),
    ruta: '/servicios/auditoria-con-ia',
    slug: 'auditoria-con-ia',
  };
}

/* Servicios del panel que el método ya cuenta con otro nombre: el agente de
   IA para WhatsApp del paso 2 es lo mismo que «Chatbots y Agentes». Listarlo
   además como complemento lo repetía dos bloques más abajo en /servicios. */
const YA_CONTADOS = new Set(['chatbots-y-agentes']);

/* Páginas que el panel guarda como servicio pero existen para una búsqueda
   («agencia de IA en Aguascalientes»), no para venderse como servicio. */
const NO_ES_SERVICIO = new Set(['inteligencia-artificial-aguascalientes']);

/** Lo que queda fuera del método: sigue publicado, pero no va en el menú y
    en /servicios sale como complemento. Lo que ya está en un paso, o es el
    diagnóstico, se deduce de los pasos mismos; así no hay una segunda lista
    que actualizar. render.php hace la misma cuenta. */
export const otrosServicios = (todos: Service[]) => {
  const enElMetodo = new Set<string>([diagnosticoDelMetodo().slug]);
  for (const p of pasosDelMetodo()) for (const it of p.items) if (it.slug) enElMetodo.add(it.slug);
  return todos.filter(
    (s) => !esCobertura(s) && !enElMetodo.has(s.slug) && !YA_CONTADOS.has(s.slug) && !NO_ES_SERVICIO.has(s.slug)
  );
};
