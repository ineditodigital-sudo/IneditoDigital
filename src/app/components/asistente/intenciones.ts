import type { Service } from '../../data/services';

/*
 * El motor que entiende lo que escribe el visitante.
 *
 * No es un modelo de lenguaje: es una busqueda por palabras contra los datos
 * reales de los servicios (titulo, categoria, caracteristicas, preguntas
 * frecuentes) mas un puñado de intenciones globales. Corre en el navegador,
 * sin llamadas ni claves, y responde al instante.
 *
 * La regla que lo gobierna: NUNCA inventar. Si algo no esta en los datos del
 * panel, el asistente lo dice y ofrece WhatsApp. Un chatbot que se inventa un
 * precio cuesta mas caro que uno que no contesta.
 */

/** Quita acentos y baja a minusculas, para comparar sin sorpresas. */
export const limpio = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Palabras que no aportan nada al emparejar. */
const vacias = new Set(
  ('de del la el los las un una unos unas y o para por con sin que en al a mi tu su me te se lo es son ' +
    'quiero necesito busco tengo hacer como cual cuales cuanto cuanta donde cuando porque si no muy mas ' +
    'hola buenas dias tardes noches gracias favor ayuda info informacion sobre acerca').split(' ')
);

export const palabras = (s: string) => limpio(s).split(' ').filter((p) => p.length > 2 && !vacias.has(p));

/**
 * ¿Son la misma palabra en distinta forma? "encuentran" y "encuentro",
 * "ubicados" y "ubicacion", "trabajan" y "trabajo".
 *
 * Sin diccionario ni stemmer: prefijo comun de 5 o mas y longitudes parecidas.
 * La condicion de longitud es la que evita que "precio" empareje con
 * "precisamente", que comparten los mismos cinco caracteres.
 */
export function mismaRaiz(a: string, b: string): boolean {
  if (a === b) return true;
  // Dos caracteres de diferencia como mucho. Con cuatro, "marca" emparejaba
  // con "marcador", que no tienen nada que ver.
  if (Math.abs(a.length - b.length) > 2) return false;
  const n = Math.min(a.length, b.length);
  if (n < 5) return false;
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i >= 5;
}

/** ¿Alguna palabra del texto es la misma que `w`, en cualquier forma? */
const contiene = (tokens: string[], w: string) => tokens.some((t) => mismaRaiz(t, w));

/**
 * Una frase coincide si coinciden sus palabras con contenido, no si aparece
 * literal. Asi "donde se encuentran" empareja con "donde los encuentro": las
 * dos se reducen a la raiz "encuentr".
 */
function coincideFrase(tokens: string[], frase: string): boolean {
  const clave = palabras(frase);
  if (!clave.length) return false;
  const aciertos = clave.filter((c) => contiene(tokens, c)).length;
  return aciertos === clave.length;
}

/* ------------------------------------------------------------------ */
/* Intenciones globales                                                */
/* ------------------------------------------------------------------ */

export type Global =
  | 'precio' | 'tiempo' | 'contacto' | 'ubicacion' | 'horario'
  | 'garantia' | 'portafolio' | 'quienes' | 'niveles' | 'saludo'
  | 'identidad' | 'equipo' | 'cobertura' | 'administrativo' | 'catalogo';

/*
 * Cada intencion tiene frases y palabras sueltas. Las frases pesan mas: son
 * mucho mas especificas.
 *
 * IMPORTANTE: se compara por PALABRA COMPLETA, no por subcadena. Con includes()
 * "cuantos trabajan" caia en precio porque contiene "cuanto", y el asistente
 * contestaba con la tarifa a una pregunta sobre el tamano del equipo.
 */
type Senal = { frases: string[]; sueltas: string[] };

const senales: Record<Global, Senal> = {
  catalogo: {
    frases: ['que servicios', 'cuales servicios', 'que ofrecen', 'que hacen', 'lista de servicios',
             'todos los servicios', 'catalogo de servicios', 'en que me pueden ayudar',
             'que mas hacen', 'que tipo de servicios'],
    sueltas: ['servicios', 'ofrecen', 'catalogo'],
  },
  identidad: {
    frases: ['como te llamas', 'cual es tu nombre', 'quien eres', 'que eres', 'eres un bot', 'eres humano',
             'eres una persona', 'eres real', 'con quien hablo', 'eres una ia'],
    sueltas: ['bot', 'robot', 'asistente'],  // 'llamas' capturaba "me pueden llamar"
  },
  equipo: {
    frases: ['cuantos trabajan', 'cuantas personas', 'cuantos son', 'cuantos empleados', 'tamano del equipo',
             'cuanta gente', 'quienes trabajan'],
    sueltas: ['empleados', 'colaboradores', 'plantilla'],
  },
  precio: {
    frases: ['cuanto cuesta', 'cuanto vale', 'cual es el precio', 'que precio', 'cuanto sale', 'cuanto cobran',
             'lista de precios', 'precio aproximado', 'cuanto es'],
    sueltas: ['precio', 'precios', 'costo', 'costos', 'cuesta', 'tarifa', 'tarifas', 'cotizacion', 'cotizar',
              'presupuesto', 'mensualidad', 'inversion', 'paquete', 'paquetes', 'economico', 'caro'],
  },
  tiempo: {
    frases: ['cuanto tarda', 'cuanto tiempo', 'en cuanto tiempo', 'cuando esta listo', 'plazo de entrega'],
    sueltas: ['tarda', 'demora', 'plazo', 'plazos', 'entrega', 'semanas', 'meses', 'duracion'],
  },
  contacto: {
    frases: ['quiero hablar', 'hablar con alguien', 'con una persona', 'agendar una cita', 'quiero contactar',
             'como los contacto', 'numero de telefono', 'pueden llamar', 'pueden llamarme',
             'quiero que me llamen'],
    sueltas: ['contacto', 'contactar', 'telefono', 'whatsapp', 'correo', 'email', 'llamar', 'asesor',
              'agendar', 'cita', 'reunion', 'llamada'],
  },
  ubicacion: {
    frases: ['donde estan', 'donde se ubican', 'donde se encuentran', 'cual es la direccion',
             'como llego', 'donde los encuentro', 'en que ciudad', 'tienen oficina'],
    sueltas: ['ubicacion', 'direccion', 'oficina', 'domicilio', 'mapa', 'ubicados', 'encuentran', 'localizados'],
  },
  cobertura: {
    frases: ['trabajan fuera', 'atienden fuera', 'otras ciudades', 'otro estado', 'a distancia',
             'trabajan en linea', 'todo mexico', 'fuera de aguascalientes'],
    sueltas: ['remoto', 'foraneos', 'nacional', 'cobertura'],
  },
  horario: {
    frases: ['que horario', 'a que hora', 'estan abiertos', 'hasta que hora'],
    sueltas: ['horario', 'horarios', 'abren', 'cierran', 'atienden'],
  },
  administrativo: {
    frases: ['dan factura', 'facturan', 'formas de pago', 'como se paga', 'aceptan tarjeta',
             'se puede a meses', 'hay contrato', 'firmar contrato'],
    sueltas: ['factura', 'facturacion', 'iva', 'contrato', 'anticipo', 'mensualidades'],
  },
  garantia: {
    frases: ['garantizan resultados', 'hay garantia', 'funciona de verdad', 'si no funciona',
             'puedo confiar', 'y si no resulta'],
    sueltas: ['garantia', 'garantizan', 'aseguran', 'funciona', 'resultados'],
  },
  portafolio: {
    frases: ['casos de exito', 'trabajos anteriores', 'que han hecho', 'con quien han trabajado',
             'muestrame ejemplos'],
    sueltas: ['portafolio', 'casos', 'ejemplos', 'referencias', 'clientes'],
  },
  quienes: {
    frases: ['quienes son', 'que es inedito', 'sobre la empresa', 'cuanto tiempo llevan',
             'cuantos anos', 'de que se trata', 'que empresa', 'a que se dedican', 'que hacen ustedes'],
    sueltas: ['empresa', 'nosotros', 'agencia', 'experiencia', 'trayectoria', 'historia', 'dedican'],
  },
  niveles: {
    frases: ['por donde empiezo', 'por donde empezar', 'que me conviene', 'que necesito',
             'no se que necesito', 'como funciona'],
    sueltas: ['niveles', 'nivel', 'etapas', 'proceso', 'empiezo', 'empezar', 'conviene', 'recomiendan',
              'aconsejan', 'orientar', 'orienten', 'asesoren'],
  },
  saludo: {
    frases: ['buenos dias', 'buenas tardes', 'buenas noches'],
    sueltas: ['hola', 'buenas', 'saludos', 'hey', 'que tal'],
  },
};

/**
 * Devuelve la intencion con mas puntos. Las frases valen 3 y las palabras
 * sueltas 1, asi que "cuanto cuesta" gana a un "cuesta" perdido en la frase.
 */
export function detectarGlobal(texto: string): Global | null {
  const tokens = palabras(texto);
  const crudo = ` ${limpio(texto)} `;
  if (!tokens.length && !crudo.trim()) return null;

  let mejor: Global | null = null;
  let mejorPuntos = 0;

  for (const clave of Object.keys(senales) as Global[]) {
    const { frases, sueltas } = senales[clave];
    let puntos = 0;
    // Cuanto mas larga la frase, mas especifica: "cuantos anos" tiene que
    // ganarle a "cuantos son", que se reduce a una sola palabra util.
    for (const f of frases) {
      const util = palabras(f).length;
      if (util && coincideFrase(tokens, f)) puntos += 2 + util;
    }
    for (const w of sueltas) {
      // los saludos viven en la lista de vacias, asi que no llegan a tokens:
      // esos se buscan en el texto crudo con bordes de palabra
      if (contiene(tokens, w) || crudo.includes(` ${w} `)) puntos += 1;
    }
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = clave;
    }
  }
  if (mejorPuntos > 0) return mejor;

  /*
   * Caso "no se que necesito": la frase entera son palabras de relleno y al
   * filtrarlas no queda nada que emparejar. No es que no se entienda: es
   * alguien pidiendo orientacion, que es exactamente para lo que estan los
   * tres niveles.
   */
  if (!tokens.length && crudo.trim().split(' ').length >= 3) return 'niveles';
  return null;
}


/* ------------------------------------------------------------------ */
/* Emparejar con un servicio real                                      */
/* ------------------------------------------------------------------ */

/** Sinonimos que la gente usa y que no estan en el titulo del servicio. */
const sinonimos: Record<string, string[]> = {
  'posicionamiento-organico': ['seo', 'seo local', 'en google', 'primero en google', 'salir en google',
    'buscador', 'buscadores', 'posicionar', 'posicionarme', 'organico', 'rankear', 'primeros resultados'],
  'google-ads': ['ads', 'anuncios', 'publicidad', 'pauta', 'campana', 'campanas', 'adwords', 'sem', 'pago'],
  'diseno-y-desarrollo-web': ['web', 'pagina', 'sitio', 'website', 'landing', 'ecommerce', 'tienda', 'programar'],
  'chatbots-y-agentes': ['chatbot', 'bot', 'agente', 'automatizar', 'atencion', 'responder', 'whatsapp'],
  branding: ['marca', 'identidad', 'imagen', 'branding', 'rebranding'],
  'creacion-de-logo': ['logo', 'logotipo', 'isotipo', 'imagotipo'],
  'funnels-de-venta': ['embudo', 'funnel', 'conversion', 'captacion', 'leads',
    'correo', 'email', 'mailing', 'newsletter', 'boletin', 'suscriptores'],
  'servicios-qr': ['qr', 'codigo', 'menu digital', 'escanear'],
  'tarjetas-de-presentacion-digital': ['tarjeta', 'nfc', 'presentacion', 'contacto digital'],
  'activaciones-para-expo': ['expo', 'stand', 'feria', 'evento', 'activacion', 'photobooth', 'ruleta'],
  'ficha-de-google': ['google maps', 'en maps', 'business profile', 'my business', 'mi negocio en google',
    'ficha de google', 'ficha', 'resenas', 'reseñas', 'maps', 'mapa'],
  'auditoria-con-ia': ['auditoria', 'diagnostico', 'revision', 'analisis', 'que esta mal'],
};

export type Coincidencia = { servicio: Service; puntos: number };

/** Devuelve los servicios que mejor encajan con lo que escribio la persona. */
export function buscarServicios(texto: string, servicios: Service[], max = 3): Coincidencia[] {
  const p = palabras(texto);
  if (!p.length) return [];
  const crudo = limpio(texto);

  const res = servicios.map((s) => {
    let puntos = 0;
    const titulo = limpio(s.title);

    // el titulo completo dentro del texto: la senal mas fuerte
    if (crudo.includes(titulo)) puntos += 10;

    for (const w of p) {
      if (titulo.includes(w)) puntos += 4;
      if (limpio(s.category).includes(w)) puntos += 2;
      if (limpio(s.shortDescription).includes(w)) puntos += 1;
      if (s.features.some((f) => limpio(f).includes(w))) puntos += 1;
    }

    // sinonimos: lo que la gente escribe de verdad
    for (const sin of sinonimos[s.slug] ?? []) {
      if (crudo.includes(sin)) puntos += 5;
    }

    return { servicio: s, puntos };
  });

  return res.filter((r) => r.puntos >= 4).sort((a, b) => b.puntos - a.puntos).slice(0, max);
}

/** Busca una pregunta frecuente que responda lo que se pregunto. */
export function buscarPregunta(texto: string, servicios: Service[]): { q: string; a: string; servicio: Service } | null {
  const p = palabras(texto);
  if (p.length < 2) return null;

  let mejor: { q: string; a: string; servicio: Service; puntos: number } | null = null;
  for (const s of servicios) {
    for (const f of s.faq ?? []) {
      const q = limpio(f.question);
      let puntos = 0;
      for (const w of p) if (q.includes(w)) puntos += 1;
      // que coincida en buena parte de la pregunta, no en una palabra suelta
      if (puntos >= 2 && (!mejor || puntos > mejor.puntos)) {
        mejor = { q: f.question, a: f.answer, servicio: s, puntos };
      }
    }
  }
  return mejor ? { q: mejor.q, a: mejor.a, servicio: mejor.servicio } : null;
}

/* ------------------------------------------------------------------ */
/* Paginas de servicio que NO estan en la tabla `services`             */
/* ------------------------------------------------------------------ */

/*
 * Posicionamiento en IA y las cuatro de /servicios-ia/ son rutas con
 * componente propio, asi que no salen de la tabla y el buscador no las veia:
 * "quiero aparecer en chatgpt" devolvia posicionamiento organico. Aqui se
 * declaran a mano para que se puedan encontrar igual que las demas.
 */
export type PaginaExtra = { titulo: string; url: string; desc: string; claves: string[] };

export const PAGINAS_EXTRA: PaginaExtra[] = [
  {
    titulo: 'Posicionamiento en IA',
    url: '/servicios/posicionamiento-en-ia',
    desc: 'Que ChatGPT, Claude, Gemini y Perplexity encuentren, entiendan y citen a tu empresa.',
    claves: ['chatgpt', 'chat gpt', 'claude', 'gemini', 'perplexity', 'copilot', 'inteligencia artificial',
             'aparecer en la ia', 'aparecer en las ia', 'geo', 'aeo', 'que la ia me recomiende',
             'me recomiende la ia', 'posicionamiento en ia', 'asistentes de ia'],
  },
  {
    titulo: 'IA para WhatsApp',
    url: '/servicios-ia/whatsapp',
    desc: 'Agente que atiende, califica y cierra ventas por WhatsApp las 24 horas.',
    claves: ['ia para whatsapp', 'automatizar whatsapp', 'bot de whatsapp', 'whatsapp automatico',
             'responder whatsapp', 'atencion por whatsapp'],
  },
  {
    titulo: 'IA de Ventas',
    url: '/servicios-ia/ventas',
    desc: 'Prospección inteligente: encuentra clientes y cierra más ventas.',
    claves: ['ia de ventas', 'prospeccion', 'prospectar', 'vender con ia', 'cerrar mas ventas'],
  },
  {
    titulo: 'IA para Marketing',
    url: '/servicios-ia/marketing',
    desc: 'Optimización automática de campañas con tablero unificado.',
    claves: ['ia para marketing', 'marketing con ia', 'optimizar campanas', 'automatizar marketing'],
  },
  {
    titulo: 'IA para E-commerce',
    url: '/servicios-ia/ecommerce',
    desc: 'Convierte más visitas en tu tienda en línea.',
    claves: ['ia para ecommerce', 'ia para tienda', 'recomendador', 'carrito abandonado'],
  },
];

/** Busca entre las paginas que no estan en la tabla de servicios. */
export function buscarExtra(texto: string): { pagina: PaginaExtra; puntos: number } | null {
  const crudo = ` ${limpio(texto)} `;
  let mejor: { pagina: PaginaExtra; puntos: number } | null = null;
  for (const p of PAGINAS_EXTRA) {
    let puntos = 0;
    for (const c of p.claves) {
      const limpia = limpio(c);
      // Una marca suelta (chatgpt, perplexity) es tan concluyente como una
      // frase: no hay otra pagina del sitio que hable de eso.
      if (crudo.includes(` ${limpia} `)) puntos += limpia.includes(' ') ? 12 : 8;
    }
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) mejor = { pagina: p, puntos };
  }
  return mejor;
}
