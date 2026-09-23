/*
 * «Arma tu ruta»: qué le conviene a quien está viendo un servicio.
 *
 * No es un carrito ni «otros productos que te pueden interesar»: es orientar.
 * Según cómo está el negocio —empieza de cero o ya funciona—, cada servicio
 * dice qué necesita antes, qué va con él, qué le da más alcance, qué sigue
 * después, y qué otra ruta le queda mejor a quien en realidad busca otra
 * cosa. Así cada quien encuentra su servicio en vez de adivinarlo en el menú.
 *
 * Máximo tres por etapa: con más, la ficha volvería a verse como «hacemos de
 * todo». El orden de la lista es el orden en pantalla.
 *
 * Son datos puros, sin React ni textos del panel, a propósito:
 *   - la ficha los pinta (FichaServicio › RutaServicio) con tr() para el inglés;
 *   - vite.config.ts los deja al compilar en dist/datos/recomendaciones.json,
 *     y render.php los lee de ahí para Google y las IA. Una sola lista.
 *
 * Desde el 23-sep, cada servicio del panel puede tener las suyas (Servicios ›
 * editar › «Arma tu ruta», en su data_json), y esas mandan. Esta lista queda
 * como respaldo: la que se ve mientras un servicio no guarde las propias, la
 * que el panel enseña para empezar a editar, y la única de las páginas de IA
 * y la de posicionamiento en IA, que no son servicios del panel.
 *
 * La clave de cada servicio es el último tramo de su ruta:
 * /servicios/google-ads → 'google-ads', /servicios-ia/whatsapp → 'whatsapp'.
 */

export type Etapa = 'cero' | 'negocio';

/**
 * base:        lo que hace falta antes para que este servicio funcione
 * complemento: lo que va con él, dentro de la misma propuesta
 * alcance:     para llegar a más gente
 * siguiente:   lo que suele venir después
 * ruta:        otra opción que le queda mejor a quien busca otra cosa
 */
export type TipoRecomendacion = 'base' | 'complemento' | 'alcance' | 'siguiente' | 'ruta';

export type Recomendacion = {
  /** A dónde lleva. */
  a: string;
  tipo: TipoRecomendacion;
  /** Solo para esa etapa; sin etapa, para las dos. */
  etapa?: Etapa;
  /** Por qué, en una línea. */
  razon: string;
};

const WEB = '/servicios/diseno-y-desarrollo-web';
const SEO = '/servicios/posicionamiento-organico';
const GEO = '/servicios/posicionamiento-en-ia';
const FICHA = '/servicios/ficha-de-google';
const AGENTE = '/servicios-ia/whatsapp';
const VENTAS = '/servicios-ia/ventas';
const FUNNELS = '/servicios/funnels-de-venta';
const ADS = '/servicios/google-ads';
const GPT = '/servicios/chatgpt-ads';
const CANALES = '/servicios/estrategia-de-canales';
const TABLERO = '/servicios/tablero-de-resultados';
const DIAG = '/servicios/auditoria-con-ia';
const BRANDING = '/servicios/branding';
const QR = '/servicios/servicios-qr';
const LOGO = '/servicios/creacion-de-logo';
const EXPO = '/servicios/activaciones-para-expo';
const NFC = '/servicios/tarjetas-de-presentacion-digital';
const LINKEDIN = '/servicios/linkedin-de-empresa';
const ESPECTACULARES = '/servicios/anuncios-espectaculares';

export const RECOMENDACIONES: Record<string, Recomendacion[]> = {
  /* ---------------- 01 · que te encuentren ---------------- */
  'diseno-y-desarrollo-web': [
    { a: LOGO, tipo: 'base', etapa: 'cero', razon: 'Antes del sitio, un logo que haga ver formal a tu negocio.' },
    { a: DIAG, tipo: 'base', etapa: 'negocio', razon: 'Antes de rehacer tu sitio, saber con evidencia qué está fallando.' },
    { a: FICHA, tipo: 'complemento', etapa: 'cero', razon: 'Que tu negocio aparezca en Google Maps desde el primer día.' },
    { a: SEO, tipo: 'alcance', razon: 'Que el sitio no solo exista: que aparezca cuando te buscan.' },
    { a: FUNNELS, tipo: 'ruta', etapa: 'negocio', razon: 'Si vendes con anuncios, una página hecha solo para convertir.' },
  ],
  'posicionamiento-organico': [
    { a: WEB, tipo: 'base', etapa: 'cero', razon: 'Para aparecer en Google primero hace falta un sitio rápido y bien hecho.' },
    { a: DIAG, tipo: 'base', etapa: 'negocio', razon: 'Saber por qué hoy no apareces antes de invertir en posicionarte.' },
    { a: FICHA, tipo: 'complemento', etapa: 'cero', razon: 'Si atiendes en tu ciudad, la ficha pesa tanto como el sitio.' },
    { a: GEO, tipo: 'alcance', etapa: 'negocio', razon: 'Aparecer también cuando le preguntan a ChatGPT o a Gemini.' },
    { a: ADS, tipo: 'ruta', razon: 'Si necesitas clientes esta semana, los anuncios dan resultados mientras el posicionamiento madura.' },
  ],
  'posicionamiento-en-ia': [
    { a: WEB, tipo: 'base', etapa: 'cero', razon: 'Las IA recomiendan lo que pueden leer: primero, un sitio claro.' },
    { a: DIAG, tipo: 'base', etapa: 'negocio', razon: 'Primero, saber qué dicen hoy las IA de tu negocio.' },
    { a: SEO, tipo: 'complemento', razon: 'Los asistentes se apoyan en lo que Google ya sabe de ti.' },
    { a: FICHA, tipo: 'complemento', etapa: 'cero', razon: 'Tu ficha de Google es de lo primero que leen los asistentes.' },
    { a: GPT, tipo: 'ruta', etapa: 'negocio', razon: 'Si quieres aparecer en ChatGPT desde ya, sin esperar a que te recomiende.' },
  ],
  'ficha-de-google': [
    { a: WEB, tipo: 'base', etapa: 'cero', razon: 'Una ficha que lleva a tu propio sitio convence más que una sin enlace.' },
    { a: DIAG, tipo: 'base', etapa: 'negocio', razon: 'Saber qué ven hoy de ti en Google antes de corregir.' },
    { a: SEO, tipo: 'complemento', razon: 'La ficha te pone en el mapa; el posicionamiento, en los resultados.' },
    { a: AGENTE, tipo: 'alcance', razon: 'Quien te encuentra en Maps te escribe: que nunca se quede sin respuesta.' },
  ],

  /* ---------------- 02 · que te escriban ---------------- */
  whatsapp: [
    { a: FICHA, tipo: 'base', etapa: 'cero', razon: 'Para que te escriban, primero te tienen que encontrar.' },
    { a: VENTAS, tipo: 'complemento', razon: 'El agente contesta; la IA de ventas le da seguimiento a quien no compró.' },
    { a: TABLERO, tipo: 'complemento', etapa: 'negocio', razon: 'Ver cuántos te escriben y de dónde llegan.' },
    { a: ADS, tipo: 'alcance', razon: 'Más conversaciones: anuncios que llevan directo a tu WhatsApp.' },
  ],
  ventas: [
    { a: AGENTE, tipo: 'base', razon: 'Primero, que cada mensaje reciba respuesta; después, el seguimiento.' },
    { a: TABLERO, tipo: 'complemento', etapa: 'negocio', razon: 'Ver cuántos prospectos llegan, de dónde y a qué costo.' },
    { a: FUNNELS, tipo: 'alcance', razon: 'Más prospectos que calificar: un embudo que los trae de tus anuncios.' },
  ],
  'funnels-de-venta': [
    { a: LOGO, tipo: 'base', etapa: 'cero', razon: 'Un funnel convence más cuando la marca se ve formal.' },
    { a: ADS, tipo: 'complemento', razon: 'El funnel convierte; los anuncios le traen gente.' },
    { a: AGENTE, tipo: 'complemento', razon: 'Que cada prospecto del funnel reciba respuesta al momento.' },
    { a: GPT, tipo: 'alcance', etapa: 'negocio', razon: 'Otra fuente de tráfico: donde tu cliente ya está preguntando.' },
  ],

  /* ---------------- 03 · que te compren ---------------- */
  'google-ads': [
    { a: FUNNELS, tipo: 'base', razon: 'Sin una página que convierta, cada clic se pierde.' },
    { a: AGENTE, tipo: 'complemento', etapa: 'cero', razon: 'Que cada persona que escribe por el anuncio reciba respuesta.' },
    { a: TABLERO, tipo: 'complemento', etapa: 'negocio', razon: 'Saber qué campaña te trae prospectos, no solo clics.' },
    { a: GPT, tipo: 'ruta', razon: 'Anunciarte donde tu cliente pregunta, no solo donde busca.' },
  ],
  'chatgpt-ads': [
    { a: FUNNELS, tipo: 'base', etapa: 'cero', razon: 'Un lugar adonde llevar a quien da clic en tu anuncio.' },
    { a: GEO, tipo: 'complemento', razon: 'Aparecer pagado hoy, mientras trabajas para que te recomienden.' },
    { a: TABLERO, tipo: 'complemento', etapa: 'negocio', razon: 'Medir cuántos prospectos te trae ChatGPT, igual que tus otros canales.' },
    { a: ADS, tipo: 'ruta', razon: 'Si tu cliente todavía busca en Google, empieza por ahí.' },
  ],
  'estrategia-de-canales': [
    { a: WEB, tipo: 'base', etapa: 'cero', razon: 'Tu canal propio antes que los marketplaces: un sitio que venda.' },
    { a: DIAG, tipo: 'base', etapa: 'negocio', razon: 'Antes de abrir canales nuevos, saber cómo está hoy tu presencia digital.' },
    { a: TABLERO, tipo: 'complemento', razon: 'Medir cuántos contactos trae cada canal y a qué costo.' },
    { a: ADS, tipo: 'alcance', etapa: 'negocio', razon: 'Invertir en el canal que la estrategia eligió.' },
  ],
  'tablero-de-resultados': [
    { a: WEB, tipo: 'base', etapa: 'cero', razon: 'Algo que medir desde el día uno: un sitio con la analítica bien puesta.' },
    { a: DIAG, tipo: 'base', etapa: 'negocio', razon: 'Qué medir empieza por saber qué está fallando.' },
    { a: ADS, tipo: 'complemento', etapa: 'negocio', razon: 'Campañas que se juzgan por los prospectos que traen.' },
    { a: CANALES, tipo: 'complemento', razon: 'Decidir con datos en qué canal crecer.' },
  ],

  /* ---------------- la puerta de entrada ---------------- */
  /* De cero casi no hay qué diagnosticar: se le manda a lo básico. Con un
     negocio andando, lo que suele seguir según lo que encuentre. */
  'auditoria-con-ia': [
    { a: WEB, tipo: 'ruta', etapa: 'cero', razon: 'Si empiezas de cero, no hay mucho que diagnosticar: empieza por tu sitio.' },
    { a: FICHA, tipo: 'ruta', etapa: 'cero', razon: 'Tu ficha de Google es lo más rápido para empezar a aparecer.' },
    { a: LOGO, tipo: 'ruta', etapa: 'cero', razon: 'Si todavía no tienes marca, empieza por un logo.' },
    { a: SEO, tipo: 'siguiente', etapa: 'negocio', razon: 'Si el diagnóstico dice que no te encuentran: posicionamiento en Google.' },
    { a: AGENTE, tipo: 'siguiente', etapa: 'negocio', razon: 'Si dice que se pierden mensajes: un agente que conteste a toda hora.' },
    { a: TABLERO, tipo: 'siguiente', etapa: 'negocio', razon: 'Si dice que no sabes qué funciona: tus números en un tablero.' },
  ],

  /* ---------------- complementos ---------------- */
  branding: [
    { a: LOGO, tipo: 'complemento', etapa: 'cero', razon: 'El logo es el punto de partida de la identidad.' },
    { a: NFC, tipo: 'complemento', etapa: 'cero', razon: 'Tarjetas que ya llevan tu marca nueva.' },
    { a: LINKEDIN, tipo: 'complemento', etapa: 'negocio', razon: 'Que el perfil de tu empresa refleje la marca.' },
    { a: WEB, tipo: 'alcance', etapa: 'cero', razon: 'Llevar tu marca a un sitio que venda.' },
    { a: WEB, tipo: 'alcance', etapa: 'negocio', razon: 'Renovar tu sitio con la marca nueva.' },
    { a: ESPECTACULARES, tipo: 'alcance', etapa: 'negocio', razon: 'Llevar la marca a la calle, donde la ve más gente.' },
  ],
  'servicios-qr': [
    { a: LOGO, tipo: 'base', etapa: 'cero', razon: 'Antes del QR, un logo que lo acompañe.' },
    { a: NFC, tipo: 'complemento', razon: 'Tu contacto en una tarjeta que se comparte con un toque.' },
    { a: FICHA, tipo: 'complemento', etapa: 'negocio', razon: 'Un QR que lleva a dejarte una opinión en Google.' },
    { a: EXPO, tipo: 'alcance', razon: 'QR en tu stand para no perder a nadie que se acerque.' },
  ],
  'creacion-de-logo': [
    { a: BRANDING, tipo: 'complemento', razon: 'El logo es el inicio; el branding lo vuelve una identidad completa.' },
    { a: NFC, tipo: 'complemento', etapa: 'cero', razon: 'Tarjetas con tu logo que se comparten con un toque.' },
    { a: LINKEDIN, tipo: 'complemento', etapa: 'negocio', razon: 'Actualizar el perfil de tu empresa con el logo nuevo.' },
    { a: WEB, tipo: 'alcance', etapa: 'cero', razon: 'Tu marca nueva, en un sitio donde te encuentren.' },
    { a: WEB, tipo: 'alcance', etapa: 'negocio', razon: 'Renovar el sitio con el logo nuevo.' },
  ],
  'activaciones-para-expo': [
    { a: BRANDING, tipo: 'base', etapa: 'cero', razon: 'Un stand convence más con una marca que se vea formal.' },
    { a: QR, tipo: 'complemento', razon: 'Que cada visitante del stand se lleve tu información.' },
    { a: NFC, tipo: 'complemento', razon: 'Tu contacto en un toque, sin tarjetas de papel.' },
    { a: AGENTE, tipo: 'alcance', etapa: 'negocio', razon: 'Dar seguimiento a todos los contactos que dejó la expo.' },
  ],
  'tarjetas-de-presentacion-digital': [
    { a: LOGO, tipo: 'base', etapa: 'cero', razon: 'Una tarjeta con tu logo, no con uno genérico.' },
    { a: LINKEDIN, tipo: 'complemento', etapa: 'negocio', razon: 'Que el perfil al que llevas esté a la altura.' },
    { a: QR, tipo: 'complemento', razon: 'Para quien no acerca el celular: el mismo contacto en un QR.' },
    { a: EXPO, tipo: 'alcance', etapa: 'negocio', razon: 'En una expo, cada tarjeta que compartes es un prospecto.' },
  ],
  'linkedin-de-empresa': [
    { a: WEB, tipo: 'base', etapa: 'cero', razon: 'El perfil lleva a tu sitio: que esté a la altura.' },
    { a: CANALES, tipo: 'complemento', etapa: 'negocio', razon: 'Si vendes a otras empresas, ordenar LinkedIn junto con tus otros canales.' },
    { a: NFC, tipo: 'complemento', razon: 'Tu contacto y tu perfil en una tarjeta que se comparte con un toque.' },
  ],
  'anuncios-espectaculares': [
    { a: BRANDING, tipo: 'base', etapa: 'cero', razon: 'Antes de un espectacular, una marca que se recuerde.' },
    { a: FICHA, tipo: 'complemento', razon: 'Quien ve tu espectacular te busca en Maps: que te encuentre.' },
    { a: TABLERO, tipo: 'complemento', etapa: 'negocio', razon: 'Ver si suben las búsquedas y los contactos mientras el espectacular está arriba.' },
    { a: ADS, tipo: 'ruta', razon: 'Si prefieres pagar solo cuando alguien da clic, anuncios en Google.' },
  ],

  /* ---------------- páginas que no están en el menú ---------------- */
  'chatbots-y-agentes': [
    { a: AGENTE, tipo: 'ruta', razon: 'La versión para WhatsApp: atiende ahí y le pasa el prospecto a tu equipo.' },
    { a: VENTAS, tipo: 'complemento', razon: 'Que al prospecto que atendió el agente se le dé seguimiento.' },
    { a: FUNNELS, tipo: 'alcance', etapa: 'negocio', razon: 'Más conversaciones: un funnel que te las trae.' },
  ],
  'inteligencia-artificial-aguascalientes': [
    { a: DIAG, tipo: 'base', razon: 'Empieza por saber qué dicen hoy de tu negocio Google y las IA.' },
    { a: GEO, tipo: 'complemento', razon: 'Que ChatGPT y Gemini te recomienden.' },
    { a: AGENTE, tipo: 'complemento', razon: 'Un agente que atienda tu WhatsApp a toda hora.' },
  ],
  marketing: [
    { a: TABLERO, tipo: 'base', razon: 'Para optimizar con IA, primero tus números en un solo lugar.' },
    { a: ADS, tipo: 'complemento', razon: 'Campañas en Google que se ajustan con datos reales.' },
    { a: GPT, tipo: 'alcance', razon: 'Llevar tus anuncios también a ChatGPT.' },
  ],
  ecommerce: [
    { a: CANALES, tipo: 'base', razon: 'Antes de optimizar la tienda, decidir por dónde vender.' },
    { a: FUNNELS, tipo: 'complemento', razon: 'Un embudo para que las visitas terminen en compra.' },
    { a: ADS, tipo: 'alcance', razon: 'Más visitas a tu tienda, con campañas medidas.' },
  ],
};

const TIPOS = new Set<TipoRecomendacion>(['base', 'complemento', 'alcance', 'siguiente', 'ruta']);

/**
 * Hasta tres, en orden, para una etapa.
 *
 * `propias` son las que el servicio guardó en el panel (su data_json): si
 * existen, mandan, aunque vengan vacías (quitarlas todas apaga la sección).
 * Si no, las de este archivo. Vienen de un formulario, así que se revisan:
 * sin destino o sin razón no cuentan, un papel desconocido pasa a «va con
 * este», y nadie se recomienda a sí mismo.
 */
export const recomendacionesPara = (
  clave: string,
  etapa: Etapa,
  propias?: Recomendacion[] | null,
  rutaActual = ''
): Recomendacion[] =>
  (Array.isArray(propias) ? propias : RECOMENDACIONES[clave] ?? [])
    .filter((r) => r && typeof r.a === 'string' && r.a && typeof r.razon === 'string' && r.razon.trim())
    .map((r) => ({ ...r, tipo: TIPOS.has(r.tipo) ? r.tipo : 'complemento' }))
    .filter((r) => r.a !== rutaActual)
    .filter((r) => !r.etapa || r.etapa === etapa)
    .slice(0, 3);

/** La clave de un servicio a partir de su ruta. */
export const claveDeRuta = (ruta: string) => ruta.split('/').filter(Boolean).pop() ?? '';
