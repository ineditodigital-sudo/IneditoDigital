/**
 * ============================================================
 * DATOS DE DEMOSTRACIÓN DEL TABLERO
 * ============================================================
 *
 * Todo lo que se ve en /demo/tablero sale de aquí. No hay una sola cifra
 * real de ningún cliente: se generan con una semilla fija, así que el
 * tablero se ve igual cada vez que se abre —importante para una expo, donde
 * la misma pantalla se enseña cincuenta veces— pero las cifras se mueven
 * como se moverían de verdad: fin de semana bajo, entre semana alto, y una
 * curva que despega cuando arranca el trabajo.
 *
 * La historia que cuentan los datos es deliberada: la empresa llevaba meses
 * plana, empezó hace cuatro meses y desde entonces sube. Es lo que se le
 * quiere mostrar a alguien parado frente al stand.
 */

/** Generador reproducible. Misma semilla, misma serie, siempre. */
function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Dia = {
  fecha: Date;
  etiqueta: string;
  organico: number;
  ads: number;
  ia: number;
  directo: number;
  redes: number;
  sesiones: number;
  leads: number;
  oportunidades: number;
  ventas: number;
  ingresos: number;
  clics: number;
  impresiones: number;
  posicion: number;
};

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Hace cuántos días arrancó el trabajo. Antes de esto, la línea va plana. */
export const DIA_DE_ARRANQUE = 120;

/*
 * Tiene que haber al menos el doble del periodo mas largo: la vista de seis
 * meses se compara contra los seis anteriores, y con 190 dias esa comparacion
 * se hacia contra diez, que daba variaciones de +2252%.
 */
const TOTAL = 380;

function construir(): Dia[] {
  const r = azar(20260826);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias: Dia[] = [];

  for (let i = TOTAL - 1; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i);
    const diaSemana = fecha.getDay();

    // Sábado y domingo caen: es una empresa que le vende a otras empresas.
    const semana = diaSemana === 0 ? 0.42 : diaSemana === 6 ? 0.55 : 1;

    // Antes del arranque, plano. Después, una curva que acelera despacio.
    const desdeArranque = Math.max(0, DIA_DE_ARRANQUE - i);
    const avance = desdeArranque / DIA_DE_ARRANQUE;
    // La curva es deliberadamente moderada. Con una mas agresiva salian
    // variaciones de +2800% y eso, frente a un director, no vende: espanta.
    const empuje = desdeArranque === 0 ? 1 : 1 + 0.45 * Math.pow(avance, 1.2);

    const ruido = () => 0.85 + r() * 0.3;

    const organico = Math.round(38 * empuje * semana * ruido());
    const ads = Math.round(26 * (desdeArranque ? 1 + 0.15 * avance : 0.85) * semana * ruido());
    // El canal de IA no existía antes de empezar: nace del trabajo de GEO.
    const ia = Math.round((desdeArranque > 45 ? 14 * Math.pow(avance, 1.9) : 0) * semana * ruido());
    const directo = Math.round(17 * (1 + 0.45 * avance) * semana * ruido());
    const redes = Math.round(11 * (1 + 0.3 * avance) * semana * ruido());
    const sesiones = organico + ads + ia + directo + redes;

    /*
     * Contactos, oportunidades y ventas se guardan con decimales y se
     * redondean al sumar, no dia por dia. Redondeando a diario el embudo se
     * derrumbaba: con una oportunidad al dia y 26% de cierre, cada dia daba
     * cero ventas y el periodo entero terminaba con cero.
     */
    const tasa = 0.030 + 0.010 * avance;
    const leads = sesiones * tasa * ruido();
    const oportunidades = leads * (0.45 + 0.05 * avance);
    const ventas = oportunidades * (0.26 + 0.02 * avance) * (r() > 0.35 ? 1 : 0.6);
    const ingresos = ventas * Math.round(11800 + r() * 9000);

    const impresiones = Math.round(sesiones * (17 + 9 * avance) * ruido());
    const clics = organico + ia;
    const posicion = +(21.4 - 13.1 * Math.pow(avance, 0.85) + (r() - 0.5) * 1.1).toFixed(1);

    dias.push({
      fecha,
      etiqueta: `${fecha.getDate()} ${MESES[fecha.getMonth()]}`,
      organico, ads, ia, directo, redes, sesiones,
      leads, oportunidades, ventas, ingresos,
      clics, impresiones, posicion,
    });
  }
  return dias;
}

export const DIAS = construir();

/* ------------------------------------------------------------------ */

export type Periodo = 30 | 90 | 180;

export type Resumen = {
  dias: Dia[];
  sesiones: number;
  leads: number;
  oportunidades: number;
  ventas: number;
  ingresos: number;
  ingresoDePauta: number;
  costoPorLead: number;
  inversion: number;
  retorno: number;
  posicion: number;
  clics: number;
  impresiones: number;
  /** Variación contra el periodo anterior del mismo largo, en porcentaje. */
  cambio: Record<string, number>;
};

const suma = (d: Dia[], k: keyof Dia) => d.reduce((t, x) => t + (x[k] as number), 0);

/** Lo invertido en pauta: se calcula desde los clics de anuncios. */
const inversionDe = (d: Dia[]) => Math.round(suma(d, 'ads') * 21.5);

function bloque(d: Dia[]) {
  const leads = suma(d, 'leads');
  const inversion = inversionDe(d);
  const ingresos = suma(d, 'ingresos');
  const sesiones = suma(d, 'sesiones');
  /*
   * El retorno se mide contra lo que la pauta trajo, no contra todo el
   * ingreso. Dividir el total entre el gasto en anuncios da numeros preciosos
   * y falsos: le acredita a Google Ads lo que cerro el trafico organico.
   */
  const ingresoDePauta = sesiones ? (ingresos * suma(d, 'ads')) / sesiones : 0;
  return {
    sesiones,
    leads: Math.round(leads),
    oportunidades: Math.round(suma(d, 'oportunidades')),
    ventas: Math.round(suma(d, 'ventas')),
    ingresos: Math.round(ingresos),
    ingresoDePauta: Math.round(ingresoDePauta),
    inversion,
    costoPorLead: leads ? Math.round(inversion / leads) : 0,
    retorno: inversion ? +(ingresoDePauta / inversion).toFixed(1) : 0,
    clics: suma(d, 'clics'),
    impresiones: suma(d, 'impresiones'),
    posicion: d.length ? +(suma(d, 'posicion') / d.length).toFixed(1) : 0,
  };
}

export function resumen(periodo: Periodo): Resumen {
  const actual = DIAS.slice(-periodo);
  const previo = DIAS.slice(-periodo * 2, -periodo);
  const a = bloque(actual);
  const p = bloque(previo);

  const cambio: Record<string, number> = {};
  for (const k of Object.keys(a) as (keyof typeof a)[]) {
    const antes = p[k] as number;
    const ahora = a[k] as number;
    cambio[k] = antes ? +(((ahora - antes) / antes) * 100).toFixed(1) : 0;
  }
  // En posición, bajar es mejorar: se invierte para que el verde signifique
  // lo mismo en todas las tarjetas.
  cambio.posicion = -cambio.posicion;

  return { dias: actual, ...a, cambio };
}

/** Agrupa por semana, que es como se lee una gráfica de seis meses. */
export function porSemana(d: Dia[]) {
  const cubos: Dia[][] = [];
  for (let i = 0; i < d.length; i += 7) cubos.push(d.slice(i, i + 7));
  return cubos
    .filter((c) => c.length)
    .map((c) => ({
      etiqueta: c[0].etiqueta,
      organico: suma(c, 'organico'),
      ads: suma(c, 'ads'),
      ia: suma(c, 'ia'),
      directo: suma(c, 'directo'),
      redes: suma(c, 'redes'),
      sesiones: suma(c, 'sesiones'),
      leads: Math.round(suma(c, 'leads')),
      oportunidades: Math.round(suma(c, 'oportunidades')),
      ventas: Math.round(suma(c, 'ventas')),
      ingresos: Math.round(suma(c, 'ingresos')),
      clics: suma(c, 'clics'),
      impresiones: suma(c, 'impresiones'),
      posicion: +(suma(c, 'posicion') / c.length).toFixed(1),
    }));
}

/* ------------------------------------------------- lo que no es serie */

export const EMPRESA = {
  nombre: 'TU EMPRESA',
  sector: 'Industria y servicios B2B · Aguascalientes',
  desde: 'Trabajando juntos desde hace 4 meses',
};

export const CANALES = [
  { clave: 'organico' as const, nombre: 'Búsqueda orgánica', color: '#7700CE' },
  { clave: 'ads' as const, nombre: 'Google Ads', color: '#CC66FF' },
  { clave: 'ia' as const, nombre: 'Respuestas de IA', color: '#22C55E' },
  { clave: 'directo' as const, nombre: 'Directo', color: '#64748B' },
  { clave: 'redes' as const, nombre: 'Redes sociales', color: '#F59E0B' },
];

export const CONSULTAS = [
  { texto: 'proveedor industrial en aguascalientes', clics: 412, impresiones: 8940, posicion: 3.2, antes: 14.8 },
  { texto: 'mantenimiento industrial aguascalientes', clics: 288, impresiones: 6120, posicion: 4.1, antes: 19.3 },
  { texto: 'refacciones industriales cerca de mi', clics: 197, impresiones: 5480, posicion: 5.6, antes: 22.1 },
  { texto: 'automatización de procesos aguascalientes', clics: 154, impresiones: 3910, posicion: 6.8, antes: 27.4 },
  { texto: 'cotizar servicio de mantenimiento', clics: 131, impresiones: 3240, posicion: 7.2, antes: 16.9 },
  { texto: 'empresas industriales en aguascalientes', clics: 118, impresiones: 4760, posicion: 8.9, antes: 24.5 },
  { texto: 'proveedor certificado iso aguascalientes', clics: 96, impresiones: 2180, posicion: 5.4, antes: 31.0 },
];

/** Presencia en respuestas de los modelos, que es el trabajo de GEO. */
export const VISIBILIDAD_IA = [
  { marca: 'openai' as const, nombre: 'ChatGPT', presencia: 68, antes: 12, lugar: 2 },
  { marca: 'claude' as const, nombre: 'Claude', presencia: 74, antes: 8, lugar: 1 },
  { marca: 'gemini' as const, nombre: 'Gemini', presencia: 41, antes: 0, lugar: 4 },
  { marca: 'perplexity' as const, nombre: 'Perplexity', presencia: 57, antes: 15, lugar: 3 },
];

export const PREGUNTAS_IA = [
  '¿Quién ofrece mantenimiento industrial en Aguascalientes?',
  'Recomiéndame un proveedor industrial confiable en Aguascalientes',
  '¿Qué empresas de automatización hay en Aguascalientes?',
  'Necesito un proveedor certificado ISO en el Bajío',
];

export type Hallazgo = {
  id: string;
  gravedad: 'critico' | 'importante' | 'menor';
  titulo: string;
  que: string;
  porque: string;
  hacer: string;
  servicio: string;
  ruta: string;
};

export const HALLAZGOS: Hallazgo[] = [
  {
    id: 'h1',
    gravedad: 'critico',
    titulo: '6 de tus 14 páginas no están en Google',
    que: 'Google descubrió esas páginas pero decidió no indexarlas. No aparecen en ningún resultado, por más que se las busque textualmente.',
    porque: 'Son páginas de servicio: cada una es una puerta de entrada que hoy está tapiada. Con el tráfico de las que sí están indexadas, esas seis valdrían unas 190 visitas al mes.',
    hacer: 'Darles contenido propio y enlazarlas desde artículos que Google ya visita seguido. Es lo que hicimos con las dos que subieron el mes pasado.',
    servicio: 'Posicionamiento orgánico',
    ruta: '/servicios/posicionamiento-organico',
  },
  {
    id: 'h2',
    gravedad: 'critico',
    titulo: 'Tu ficha de Google está a medias',
    que: 'Sin horarios, con dos fotos de hace tres años y sin responder ninguna de las 11 reseñas. La categoría principal tampoco es la que te conviene.',
    porque: 'La ficha es lo primero que ve quien te busca por tu nombre, y es el factor que más pesa para salir en el mapa de las búsquedas locales.',
    hacer: 'Completar los datos, subir fotos del mes, fijar la categoría correcta y contestar todas las reseñas. Se hace en una semana.',
    servicio: 'Ficha de Google',
    ruta: '/servicios/ficha-de-google',
  },
  {
    id: 'h3',
    gravedad: 'importante',
    titulo: 'Dos de cada cinco leads esperan más de una hora',
    que: 'El 38% de los contactos que llegan por la web no recibe respuesta dentro de la primera hora. De noche y en fin de semana, ninguno.',
    porque: 'La probabilidad de cerrar cae fuerte después de los primeros minutos. En el periodo son 34 contactos que se enfriaron solos.',
    hacer: 'Un agente en WhatsApp que responda, califique y agende mientras tu equipo duerme, y que pase la conversación completa a quien le toque.',
    servicio: 'Chatbots y agentes',
    ruta: '/servicios/chatbots-y-agentes',
  },
  {
    id: 'h4',
    gravedad: 'importante',
    titulo: 'Dos modelos de IA todavía no te nombran',
    que: 'Gemini te menciona en 4 de cada 10 respuestas y va subiendo, pero en las preguntas de compra directa aún recomienda a tres competidores antes que a ti.',
    porque: 'Cada vez más compradores B2B preguntan primero a un modelo y llegan con la lista corta hecha. Si no estás en esa lista, no compites.',
    hacer: 'Publicar definiciones y datos verificables que los modelos puedan citar, y sostener las señales fuera del sitio.',
    servicio: 'Posicionamiento en IA',
    ruta: '/servicios/posicionamiento-en-ia',
  },
  {
    id: 'h5',
    gravedad: 'importante',
    titulo: 'La web tarda 4.8 segundos en celular',
    que: 'Las imágenes se sirven en tamaño de escritorio y la portada carga tres tipografías que no se usan.',
    porque: 'El 71% de tus visitas son de celular. Cada segundo de más se lleva alrededor del 7% de quienes iban a contactarte.',
    hacer: 'Comprimir y servir imágenes por tamaño, dejar una sola tipografía y cargar lo pesado después de lo que se ve.',
    servicio: 'Diseño y desarrollo web',
    ruta: '/servicios/diseno-y-desarrollo-web',
  },
  {
    id: 'h6',
    gravedad: 'menor',
    titulo: 'Nadie da seguimiento después de la cotización',
    que: 'Se manda la cotización y ahí termina. No hay un segundo contacto salvo que el vendedor se acuerde.',
    porque: 'De las oportunidades del periodo, 61 quedaron sin respuesta del cliente y sin ningún seguimiento registrado.',
    hacer: 'Una secuencia corta de seguimiento automática, con salida a una persona en cuanto el cliente conteste.',
    servicio: 'Funnels de venta',
    ruta: '/servicios/funnels-de-venta',
  },
  {
    id: 'h7',
    gravedad: 'menor',
    titulo: 'Las campañas y las ventas no se hablan',
    que: 'Google Ads reporta conversiones y el sistema de la empresa reporta ventas, pero nada cruza una cosa con la otra.',
    porque: 'Sin ese cruce no se sabe qué campaña trae clientes y cuál trae curiosos, y se termina decidiendo por el costo por clic.',
    hacer: 'Conectar el origen de cada lead con su resultado final. Es lo que hace que este tablero muestre pesos y no clics.',
    servicio: 'Auditoría con IA',
    ruta: '/servicios/auditoria-con-ia',
  },
];

export const PUNTAJE = {
  total: 62,
  antes: 41,
  areas: [
    { nombre: 'Visibilidad en buscadores', valor: 71, antes: 38 },
    { nombre: 'Visibilidad en IA', valor: 60, antes: 9 },
    { nombre: 'Sitio web y velocidad', valor: 54, antes: 47 },
    { nombre: 'Presencia local', valor: 43, antes: 35 },
    { nombre: 'Atención y seguimiento', valor: 58, antes: 44 },
    { nombre: 'Medición y datos', valor: 76, antes: 22 },
  ],
};

export const SECCIONES_REPORTE = [
  { id: 'resumen', nombre: 'Resumen ejecutivo', sub: 'Las cifras del periodo y su variación' },
  { id: 'canales', nombre: 'Origen del tráfico', sub: 'De dónde llega la gente, semana a semana' },
  { id: 'embudo', nombre: 'Del clic a la venta', sub: 'Cuánto se pierde en cada paso' },
  { id: 'buscadores', nombre: 'Buscadores', sub: 'Consultas, posiciones e indexación' },
  { id: 'ia', nombre: 'Visibilidad en IA', sub: 'Qué responden ChatGPT, Claude, Gemini y Perplexity' },
  { id: 'auditoria', nombre: 'Auditoría', sub: 'Hallazgos ordenados por gravedad' },
  { id: 'acciones', nombre: 'Plan del mes', sub: 'Qué se hace, en qué orden y por qué' },
];

/* ------------------------------------------------------------ formatos */

export const pesos = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1000
    ? `$${Math.round(n / 1000)}k`
    : `$${n}`;

export const pesosLargo = (n: number) => '$' + n.toLocaleString('es-MX');
export const miles = (n: number) => n.toLocaleString('es-MX');
