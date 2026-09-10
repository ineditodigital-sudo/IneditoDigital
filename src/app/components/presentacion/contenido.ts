/*
 * El guion de la presentación, en los dos idiomas.
 *
 * Vive aparte de los componentes por una razón práctica: cuando haya que
 * corregir una frase antes de una junta, se corrige aquí y no dentro de un
 * JSX de trescientas líneas.
 *
 * Cada lámina lleva la escena que le toca. No hay una animación genérica
 * reutilizada: la de sitios web enseña una página armándose, la de publicidad
 * enseña presupuesto moviéndose. Una animación que no explica el servicio es
 * decoración, y en una presentación de venta eso cuesta atención.
 */

export type Idioma = 'es' | 'en';

export type Lamina = {
  id: string;
  escena: string;            // qué animación le toca
  kicker: Record<Idioma, string>;
  titulo: Record<Idioma, string>;
  bajada: Record<Idioma, string>;
  puntos: Record<Idioma, string[]>;
};

export const UI = {
  siguiente: { es: 'Siguiente', en: 'Next' },
  anterior: { es: 'Anterior', en: 'Previous' },
  lamina: { es: 'Lámina', en: 'Slide' },
  de: { es: 'de', en: 'of' },
  idioma: { es: 'English', en: 'Español' },
  tema: { es: 'Cambiar tema', en: 'Switch theme' },
  empezar: { es: 'Empezar', en: 'Start' },
  hablemos: { es: 'Hablemos', en: "Let's talk" },
  escribir: { es: 'Escribir por WhatsApp', en: 'Message us on WhatsApp' },
  correo: { es: 'Enviar un correo', en: 'Send an email' },
  navega: {
    es: 'Usa las flechas del teclado o desliza',
    en: 'Use the arrow keys or swipe',
  },
} as const;

export const LAMINAS: Lamina[] = [
  {
    id: 'portada',
    escena: 'portada',
    kicker: { es: 'Agencia digital · Aguascalientes', en: 'Digital agency · Aguascalientes, MX' },
    titulo: {
      es: 'LO QUE HACEMOS\nY CÓMO SE MIDE',
      en: 'WHAT WE DO\nAND HOW IT IS MEASURED',
    },
    bajada: {
      es: 'Presencia digital que se puede rastrear hasta la venta. Sin promesas que no se puedan enseñar en un tablero.',
      en: 'Digital presence you can trace all the way to a sale. No promises we cannot show you on a dashboard.',
    },
    puntos: { es: [], en: [] },
  },

  {
    id: 'premisa',
    escena: 'premisa',
    kicker: { es: 'La premisa', en: 'The premise' },
    titulo: {
      es: 'CASI NADIE SABE\nQUÉ LE ESTÁ FUNCIONANDO',
      en: 'ALMOST NOBODY KNOWS\nWHAT IS ACTUALLY WORKING',
    },
    bajada: {
      es: 'La mayoría de las empresas invierte en digital y no puede decir qué trajo un cliente y qué solo gastó. Nuestro trabajo empieza ahí: conectar lo que se hace con lo que entra.',
      en: 'Most companies spend on digital and cannot say which part brought a client and which part just spent money. That is where our work starts: connecting what gets done to what comes in.',
    },
    puntos: {
      es: [
        'Se reporta alcance, no clientes',
        'Cada herramienta cuenta una cifra distinta',
        'Se recorta por intuición, no por evidencia',
      ],
      en: [
        'Reach gets reported, clients do not',
        'Every tool reports a different number',
        'Budgets get cut on hunches, not evidence',
      ],
    },
  },

  {
    id: 'web',
    escena: 'web',
    kicker: { es: 'Sitios web', en: 'Websites' },
    titulo: { es: 'UN SITIO QUE\nTIENE UN TRABAJO', en: 'A SITE WITH\nA JOB TO DO' },
    bajada: {
      es: 'No un folleto. El lugar donde alguien que no te conoce decide si te escribe. Se construye por dentro antes que por fuera: si tarda cinco segundos en abrir, el diseño ya no importa.',
      en: 'Not a brochure. The place where someone who does not know you decides whether to reach out. Built from the inside out: if it takes five seconds to load, the design no longer matters.',
    },
    puntos: {
      es: [
        'El texto en el HTML desde el primer momento, no después de un script',
        'Cada página termina en un siguiente paso claro',
        'Panel propio: lo actualizas sin llamarnos',
      ],
      en: [
        'Text in the HTML from the first byte, not after a script runs',
        'Every page ends in one clear next step',
        'Your own admin panel: update it without calling us',
      ],
    },
  },

  {
    id: 'posicionamiento',
    escena: 'posicionamiento',
    kicker: { es: 'Posicionamiento · SEO y GEO', en: 'Search & AI visibility' },
    titulo: { es: 'QUE TE ENCUENTREN\nGOOGLE Y LAS IA', en: 'FOUND BY GOOGLE\nAND BY THE AI MODELS' },
    bajada: {
      es: 'Aparecer en Google sigue importando. Pero cada vez más gente pregunta primero a ChatGPT, Gemini o Perplexity, y ahí la respuesta menciona empresas concretas. Trabajamos las dos puertas.',
      en: 'Ranking on Google still matters. But more people now ask ChatGPT, Gemini or Perplexity first, and those answers name specific companies. We work both doors.',
    },
    puntos: {
      es: [
        'Lo técnico primero: si no te pueden leer, lo demás no sirve',
        'Contenido escrito contra lo que la gente busca de verdad',
        'Medimos qué motores de IA te leen y con qué frecuencia',
      ],
      en: [
        'Technical first: if they cannot read you, nothing else counts',
        'Content written against what people actually search for',
        'We measure which AI engines read you, and how often',
      ],
    },
  },

  {
    id: 'local',
    escena: 'local',
    kicker: { es: 'Presencia local', en: 'Local presence' },
    titulo: { es: 'EL MAPA DECIDE\nANTES QUE TU WEB', en: 'THE MAP DECIDES\nBEFORE YOUR SITE DOES' },
    bajada: {
      es: 'En una búsqueda local Google enseña primero tres negocios en un mapa. Estar sexto en los resultados normales, debajo de ese mapa, equivale a no estar.',
      en: 'On a local search Google shows three businesses on a map first. Sitting sixth in the regular results, below that map, is the same as not being there.',
    },
    puntos: {
      es: [
        'Categorías, datos y fotos propias, no de banco',
        'Rutina de reseñas con clientes reales',
        'Nombre, dirección y teléfono idénticos en todas partes',
      ],
      en: [
        'Categories, data and your own photos, not stock',
        'A review routine with real customers',
        'Name, address and phone identical everywhere',
      ],
    },
  },

  {
    id: 'publicidad',
    escena: 'publicidad',
    kicker: { es: 'Publicidad', en: 'Paid advertising' },
    titulo: { es: 'EL PRESUPUESTO\nSE MUEVE SOLO', en: 'BUDGET THAT\nMOVES ITSELF' },
    bajada: {
      es: 'Google, Meta y ahora ChatGPT Ads. Lo que decide el resultado no es la plataforma: es qué se cuenta como resultado. Una cuenta que optimiza clics es una tienda que mide gente entrando.',
      en: 'Google, Meta and now ChatGPT Ads. What decides the outcome is not the platform: it is what counts as an outcome. An account optimizing for clicks is a store measuring footfall.',
    },
    puntos: {
      es: [
        'Se optimiza a llamada, mensaje o formulario, no a clic',
        'La página de destino se revisa antes que la campaña',
        'Alertas el mismo día, no en el reporte del mes',
      ],
      en: [
        'Optimised for calls, messages and forms, not clicks',
        'We audit the landing page before the campaign',
        'Alerts the same day, not in next month report',
      ],
    },
  },

  {
    id: 'espectaculares',
    escena: 'espectaculares',
    kicker: { es: 'Publicidad exterior', en: 'Out-of-home' },
    titulo: { es: 'EL ÚNICO MEDIO\nQUE NO SE SALTA', en: 'THE ONE MEDIUM\nYOU CANNOT SKIP' },
    bajada: {
      es: 'No hay «omitir anuncio» en una avenida. 317 espacios en Aguascalientes —espectaculares, unipolares, puentes, vallas y pantallas— elegidos por flujo y ángulo de lectura, no por foto de catálogo.',
      en: 'There is no “skip ad” on an avenue. 317 spaces across Aguascalientes — billboards, unipoles, pedestrian bridges, street panels and LED screens — chosen by traffic flow and reading angle, not by a catalog photo.',
    },
    puntos: {
      es: [
        '317 espacios con ficha técnica y coordenadas',
        'Sitios regularizados: sin riesgo de clausura con tu marca puesta',
        'Se mide con número propio y búsquedas de marca',
      ],
      en: [
        '317 spaces with technical sheets and coordinates',
        'Fully permitted sites: no shutdown risk with your brand on them',
        'Measured with a dedicated phone line and brand-search lift',
      ],
    },
  },

  {
    id: 'agentes',
    escena: 'agentes',
    kicker: { es: 'Inteligencia artificial', en: 'Artificial intelligence' },
    titulo: { es: 'QUIEN CONTESTA\nPRIMERO, VENDE', en: 'WHOEVER ANSWERS\nFIRST, SELLS' },
    bajada: {
      es: 'La mayoría de los negocios no pierde ventas por falta de interesados: las pierde por no contestar a tiempo. Un agente lee lo que le escriben con palabras normales y responde con tus datos reales.',
      en: 'Most businesses do not lose sales for lack of interest: they lose them by answering late. An agent reads what people write in plain language and replies with your real data.',
    },
    puntos: {
      es: [
        'Entrenado con tus precios, políticas y preguntas reales',
        'Sabe cuándo callarse y pasar la conversación a una persona',
        'Deja la lista de lo que preguntan, ordenada por frecuencia',
      ],
      en: [
        'Trained on your real prices, policies and questions',
        'Knows when to stop and hand the conversation to a human',
        'Leaves you the list of what people ask, ranked by frequency',
      ],
    },
  },

  {
    id: 'ventas',
    escena: 'ventas',
    kicker: { es: 'IA aplicada a ventas', en: 'AI for sales' },
    titulo: { es: 'LA LISTA SE ORDENA\nPOR PROBABILIDAD', en: 'THE LIST SORTS ITSELF\nBY LIKELIHOOD' },
    bajada: {
      es: 'Un vendedor con doscientos contactos y sin criterio los atiende por orden de llegada, que es el peor orden posible. Con los datos que ya tienes se puede ordenar por probabilidad real de cierre.',
      en: 'A rep with two hundred contacts and no criteria works them in arrival order, which is the worst possible order. With the data you already have, they can be ranked by real likelihood of closing.',
    },
    puntos: {
      es: [
        'Prioridad por comportamiento, no por antigüedad',
        'Primer contacto redactado con el dato de cada empresa',
        'El seguimiento que se abandona al tercer intento, sostenido',
      ],
      en: [
        'Priority by behavior, not by how long they have waited',
        'First outreach drafted with each company’s own details',
        'The follow-up everyone abandons on the third try, sustained',
      ],
    },
  },

  {
    id: 'tablero',
    escena: 'tablero',
    kicker: { es: 'Medición', en: 'Measurement' },
    titulo: { es: 'UNA PANTALLA,\nNO CINCO PESTAÑAS', en: 'ONE SCREEN,\nNOT FIVE TABS' },
    bajada: {
      es: 'Cuánta gente llega y de dónde, qué busca, cuántos dejaron sus datos, cuánto costó cada uno y —cuando el sistema lo permite— cuáles terminaron en venta facturada.',
      en: 'How many people arrive and from where, what they search for, how many left their details, what each one cost and — when your system allows it — which ones ended in invoiced revenue.',
    },
    puntos: {
      es: [
        'Conectado a Search Console, Analytics y las campañas',
        'No es un reporte con capturas: se actualiza solo',
        'La junta discute qué hacer, no de dónde salió el número',
      ],
      en: [
        'Wired into Search Console, Analytics and your ad accounts',
        'Not a slide deck of screenshots: it updates itself',
        'Meetings argue about what to do, not where the number came from',
      ],
    },
  },

  {
    id: 'cierre',
    escena: 'cierre',
    kicker: { es: 'Siguiente paso', en: 'Next step' },
    titulo: { es: 'EMPECEMOS POR\nDÓNDE SE PIERDE', en: 'LET US START WHERE\nTHE MONEY LEAKS' },
    bajada: {
      es: 'No hace falta contratar todo. Se empieza por una revisión de dónde se está perdiendo el dinero, y eso se puede medir antes de firmar nada.',
      en: 'You do not need to buy everything. We start with a review of where the money is leaking, and that can be measured before you sign anything.',
    },
    puntos: { es: [], en: [] },
  },
];

export const CONTACTO = {
  whatsapp: '524491543138',
  correo: 'hola@inedito.digital',
  sitio: 'inedito.digital',
};
