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

const palabras = (s: string) => limpio(s).split(' ').filter((p) => p.length > 2 && !vacias.has(p));

/* ------------------------------------------------------------------ */
/* Intenciones globales                                                */
/* ------------------------------------------------------------------ */

export type Global =
  | 'precio' | 'tiempo' | 'contacto' | 'ubicacion' | 'horario'
  | 'garantia' | 'portafolio' | 'quienes' | 'niveles' | 'saludo';

const senales: Record<Global, string[]> = {
  precio: ['precio', 'costo', 'cuesta', 'cuanto', 'tarifa', 'presupuesto', 'cotizacion', 'cotizar', 'vale', 'pagar', 'inversion', 'mensualidad', 'paquete'],
  tiempo: ['tiempo', 'tarda', 'demora', 'plazo', 'cuando', 'rapido', 'urgente', 'semanas', 'meses', 'entrega'],
  contacto: ['contacto', 'contactar', 'telefono', 'whatsapp', 'correo', 'email', 'llamar', 'hablar', 'asesor', 'humano', 'persona', 'agendar', 'cita', 'reunion'],
  ubicacion: ['donde', 'ubicacion', 'direccion', 'oficina', 'local', 'estan', 'aguascalientes', 'mapa', 'llegar'],
  horario: ['horario', 'abren', 'cierran', 'hora', 'atienden', 'abierto'],
  garantia: ['garantia', 'garantizan', 'aseguran', 'resultados', 'funciona', 'sirve', 'confiar', 'seguro'],
  portafolio: ['portafolio', 'trabajos', 'clientes', 'casos', 'ejemplos', 'proyectos', 'hecho', 'referencias'],
  quienes: ['quienes', 'nosotros', 'empresa', 'agencia', 'equipo', 'experiencia', 'anos', 'historia'],
  niveles: ['niveles', 'empezar', 'empiezo', 'punto', 'partida', 'plan', 'etapa', 'paquetes'],
  saludo: ['hola', 'buenas', 'saludos', 'hey', 'ola', 'buenos'],
};

export function detectarGlobal(texto: string): Global | null {
  const p = new Set(palabras(texto));
  const crudo = limpio(texto);
  // orden a proposito: precio y contacto mandan sobre lo demas
  const orden: Global[] = ['contacto', 'precio', 'tiempo', 'niveles', 'garantia', 'portafolio', 'ubicacion', 'horario', 'quienes', 'saludo'];
  for (const g of orden) {
    if (senales[g].some((s) => p.has(s) || crudo.includes(s))) return g;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Emparejar con un servicio real                                      */
/* ------------------------------------------------------------------ */

/** Sinonimos que la gente usa y que no estan en el titulo del servicio. */
const sinonimos: Record<string, string[]> = {
  'posicionamiento-organico': ['seo', 'google', 'buscador', 'posicionar', 'aparecer', 'primero', 'organico', 'rankear'],
  'google-ads': ['ads', 'anuncios', 'publicidad', 'pauta', 'campana', 'campanas', 'adwords', 'sem', 'pago'],
  'diseno-y-desarrollo-web': ['web', 'pagina', 'sitio', 'website', 'landing', 'ecommerce', 'tienda', 'programar'],
  'chatbots-y-agentes': ['chatbot', 'bot', 'agente', 'automatizar', 'atencion', 'responder', 'whatsapp'],
  branding: ['marca', 'identidad', 'imagen', 'branding', 'rebranding'],
  'creacion-de-logo': ['logo', 'logotipo', 'isotipo', 'imagotipo'],
  'email-marketing': ['correo', 'email', 'mailing', 'newsletter', 'boletin', 'suscriptores'],
  'funnels-de-venta': ['embudo', 'funnel', 'conversion', 'captacion', 'leads'],
  'servicios-qr': ['qr', 'codigo', 'menu digital', 'escanear'],
  'tarjetas-de-presentacion-digital': ['tarjeta', 'nfc', 'presentacion', 'contacto digital'],
  'activaciones-para-expo': ['expo', 'stand', 'feria', 'evento', 'activacion', 'photobooth', 'ruleta'],
  'posicionamiento-en-ia': ['ia', 'chatgpt', 'claude', 'gemini', 'perplexity', 'geo', 'aeo', 'inteligencia artificial', 'asistente'],
  'ficha-de-google': ['ficha', 'maps', 'business profile', 'my business', 'resenas', 'mapa', 'local'],
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
