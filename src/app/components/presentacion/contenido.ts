/*
 * La carta de servicios, en los dos idiomas.
 *
 * Antes esto era un ensayo: cada lámina abría con un titular de autor —«EL MAPA
 * DECIDE ANTES QUE TU WEB»— y el cliente tenía que leer un párrafo para saber
 * de qué servicio le estaban hablando. Ahora manda el nombre: SITIOS WEB, una
 * frase de qué es, y tres tarjetas de qué incluye. Quien abre esto en el
 * teléfono a media junta necesita saber en dos segundos qué está viendo.
 *
 * Tres tarjetas por servicio, no cuatro. Es lo que cabe en una pantalla de
 * teléfono junto al nombre y la escena sin obligar a hacer scroll, y el scroll
 * dentro de una diapositiva es lo que rompe una presentación.
 *
 * Cada lámina lleva la escena que le toca. No hay una animación genérica
 * reutilizada: la de sitios web enseña una página armándose, la de publicidad
 * enseña presupuesto moviéndose. Una animación que no explica el servicio es
 * decoración, y en una presentación de venta eso cuesta atención.
 */

export type Idioma = 'es' | 'en';

/** Una tarjeta: un titular corto y una línea que lo sostiene. */
export type Tarjeta = { t: string; d: string };

export type Lamina = {
  id: string;
  escena: string;                        // qué animación le toca
  kicker: Record<Idioma, string>;        // la categoría, en mono y pequeño
  nombre: Record<Idioma, string>;        // EL NOMBRE, en grande
  descripcion: Record<Idioma, string>;   // qué es, en una o dos frases
  tarjetas: Record<Idioma, Tarjeta[]>;   // qué incluye
};

export const UI = {
  siguiente: { es: 'Siguiente', en: 'Next' },
  anterior: { es: 'Anterior', en: 'Previous' },
  lamina: { es: 'Lámina', en: 'Slide' },
  de: { es: 'de', en: 'of' },
  idioma: { es: 'English', en: 'Español' },
  tema: { es: 'Cambiar tema', en: 'Switch theme' },
  menu: { es: 'Ver los servicios', en: 'See the services' },
  cerrar: { es: 'Cerrar', en: 'Close' },
  indice: { es: 'Servicios', en: 'Services' },
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
    nombre: { es: 'CARTA DE\nSERVICIOS', en: 'SERVICE\nCATALOG' },
    descripcion: {
      es: 'Nueve servicios, lo que incluye cada uno y cómo se mide. Sin promesas que no se puedan enseñar en un tablero.',
      en: 'Nine services, what each one includes and how it gets measured. No promises we cannot show you on a dashboard.',
    },
    tarjetas: { es: [], en: [] },
  },

  {
    id: 'web',
    escena: 'web',
    kicker: { es: 'Servicio 01', en: 'Service 01' },
    nombre: { es: 'SITIOS WEB', en: 'WEBSITES' },
    descripcion: {
      es: 'El lugar donde alguien que no te conoce decide si te escribe. Se construye por dentro antes que por fuera: si tarda cinco segundos en abrir, el diseño ya no importa.',
      en: 'The place where someone who does not know you decides whether to reach out. Built from the inside out: if it takes five seconds to load, the design no longer matters.',
    },
    tarjetas: {
      es: [
        { t: 'Carga rápido en teléfono', d: 'Que es como te van a ver. Pasa las mediciones de Google, medidas y no estimadas.' },
        { t: 'Panel para editarlo tú', d: 'Textos, fotos, precios y secciones. Sin llamarnos y sin costo por cambio.' },
        { t: 'Cada página termina en algo', d: 'Cotizar, escribir o llamar. Una página que no pide nada no vende nada.' },
      ],
      en: [
        { t: 'Fast on a phone', d: 'Which is how they will see you. Passes Google’s measurements — measured, not estimated.' },
        { t: 'A panel you edit yourself', d: 'Text, photos, prices and sections. No calling us, no charge per change.' },
        { t: 'Every page ends in an action', d: 'Quote, message or call. A page that asks for nothing sells nothing.' },
      ],
    },
  },

  {
    id: 'posicionamiento',
    escena: 'posicionamiento',
    kicker: { es: 'Servicio 02', en: 'Service 02' },
    nombre: { es: 'POSICIONAMIENTO\nEN GOOGLE Y EN IA', en: 'GOOGLE AND\nAI VISIBILITY' },
    descripcion: {
      es: 'Aparecer en Google sigue importando, pero cada vez más gente le pregunta primero a ChatGPT o Perplexity, y esa respuesta nombra empresas concretas. Trabajamos las dos puertas.',
      en: 'Ranking on Google still matters, but more people now ask ChatGPT or Perplexity first, and those answers name specific companies. We work both doors.',
    },
    tarjetas: {
      es: [
        { t: 'Lo técnico primero', d: 'Si los buscadores no te pueden leer, el contenido no sirve de nada.' },
        { t: 'Contenido que responde', d: 'Escrito contra lo que tu cliente busca de verdad, no contra lo que suena bien.' },
        { t: 'Presencia en las IA', d: 'Medimos en cuántas respuestas de ChatGPT, Gemini y Perplexity aparece tu marca.' },
      ],
      en: [
        { t: 'Technical work first', d: 'If search engines cannot read you, no amount of content helps.' },
        { t: 'Content that answers', d: 'Written against what your customer actually searches, not what sounds good.' },
        { t: 'Presence in the AIs', d: 'We measure how many ChatGPT, Gemini and Perplexity answers name your brand.' },
      ],
    },
  },

  {
    id: 'local',
    escena: 'local',
    kicker: { es: 'Servicio 03', en: 'Service 03' },
    nombre: { es: 'FICHA DE GOOGLE', en: 'GOOGLE BUSINESS\nPROFILE' },
    descripcion: {
      es: 'En una búsqueda local Google enseña primero tres negocios en un mapa. Estar sexto en los resultados normales, debajo de ese mapa, equivale a no estar.',
      en: 'On a local search Google shows three businesses on a map first. Sitting sixth in the regular results, below that map, is the same as not being there.',
    },
    tarjetas: {
      es: [
        { t: 'Perfil completo', d: 'Categorías, horarios, servicios, zona y fotos propias del negocio, no de banco.' },
        { t: 'Rutina de reseñas', d: 'Se piden a clientes reales y se contestan todas, también las malas.' },
        { t: 'Datos que coinciden', d: 'Mismo nombre, dirección y teléfono en tu web, la ficha y los directorios.' },
      ],
      en: [
        { t: 'A complete profile', d: 'Categories, hours, services, area and the business’s own photos, not stock.' },
        { t: 'A review routine', d: 'Asked of real customers, and every one answered — the bad ones too.' },
        { t: 'Details that match', d: 'Same name, address and phone on your site, the listing and the directories.' },
      ],
    },
  },

  {
    id: 'publicidad',
    escena: 'publicidad',
    kicker: { es: 'Servicio 04', en: 'Service 04' },
    nombre: { es: 'PUBLICIDAD\nDIGITAL', en: 'PAID\nADVERTISING' },
    descripcion: {
      es: 'Google, Meta y ahora ChatGPT Ads. Lo que decide el resultado no es la plataforma: es qué se cuenta como resultado. Una cuenta que optimiza clics es una tienda que mide gente entrando.',
      en: 'Google, Meta and now ChatGPT Ads. What decides the outcome is not the platform: it is what counts as an outcome. An account optimizing for clicks is a store measuring footfall.',
    },
    tarjetas: {
      es: [
        { t: 'Se optimiza a contacto', d: 'A llamada, mensaje o formulario. Nunca a clics, que no pagan nómina.' },
        { t: 'La página, antes que el anuncio', d: 'Si llega gente y no convierte, el canal no tuvo la culpa.' },
        { t: 'Costo por contacto a la vista', d: 'Cada canal lado a lado, para mover presupuesto con criterio y no por corazonada.' },
      ],
      en: [
        { t: 'Optimized for contact', d: 'Calls, messages and forms. Never clicks — clicks do not make payroll.' },
        { t: 'The page before the ad', d: 'If people arrive and do not convert, the channel was not to blame.' },
        { t: 'Cost per lead in plain sight', d: 'Every channel side by side, so budget moves on judgment and not on a hunch.' },
      ],
    },
  },

  {
    id: 'espectaculares',
    escena: 'espectaculares',
    kicker: { es: 'Servicio 05', en: 'Service 05' },
    nombre: { es: 'ANUNCIOS\nESPECTACULARES', en: 'BILLBOARD\nADVERTISING' },
    descripcion: {
      es: 'No hay «omitir anuncio» en una avenida. 317 espacios en Aguascalientes —espectaculares, unipolares, puentes, vallas y pantallas LED— elegidos por flujo y ángulo de lectura.',
      en: 'There is no “skip ad” on an avenue. 317 spaces across Aguascalientes — billboards, unipoles, pedestrian bridges, street panels and LED screens — chosen by traffic flow and reading angle.',
    },
    tarjetas: {
      es: [
        { t: '317 espacios con ficha', d: 'Flujo vehicular, sentido, ángulo de lectura e impactos estimados por punto.' },
        { t: 'Sitios en regla', d: 'Permisos al día. Un espectacular clausurado se clausura con tu marca puesta.' },
        { t: 'Sí se puede medir', d: 'Número propio, página de destino y el alza en búsquedas de tu marca.' },
      ],
      en: [
        { t: '317 spaces with spec sheets', d: 'Traffic flow, direction, reading angle and estimated impressions for each site.' },
        { t: 'Permitted sites', d: 'Paperwork current. A billboard that gets shut down gets shut down with your brand on it.' },
        { t: 'It can be measured', d: 'A dedicated number, a landing page and the lift in searches for your brand.' },
      ],
    },
  },

  {
    id: 'agentes',
    escena: 'agentes',
    kicker: { es: 'Servicio 06', en: 'Service 06' },
    nombre: { es: 'AGENTES DE IA\nPARA WHATSAPP', en: 'AI AGENTS\nFOR WHATSAPP' },
    descripcion: {
      es: 'La mayoría de los negocios no pierde ventas por falta de interesados: las pierde por no contestar a tiempo. Un agente lee lo que le escriben con palabras normales y responde con tus datos reales.',
      en: 'Most businesses do not lose sales for lack of interest: they lose them by answering late. An agent reads what people write in plain language and replies with your real data.',
    },
    tarjetas: {
      es: [
        { t: 'Contesta en segundos, 24/7', d: 'Con tus precios, horarios y políticas. No con respuestas genéricas.' },
        { t: 'Califica y pasa la mano', d: 'Sabe cuándo callarse y entregarle la conversación a una persona, con contexto.' },
        { t: 'Todo queda registrado', d: 'La lista de lo que te preguntan, ordenada por frecuencia. Casi siempre hay sorpresas.' },
      ],
      en: [
        { t: 'Answers in seconds, 24/7', d: 'With your prices, hours and policies. Not with generic replies.' },
        { t: 'Qualifies, then hands over', d: 'It knows when to stop and give the conversation to a person, with the context.' },
        { t: 'Everything is recorded', d: 'The list of what people ask you, ranked by frequency. There are usually surprises.' },
      ],
    },
  },

  {
    id: 'ventas',
    escena: 'ventas',
    kicker: { es: 'Servicio 07', en: 'Service 07' },
    nombre: { es: 'IA PARA\nVENTAS', en: 'AI FOR\nSALES' },
    descripcion: {
      es: 'Un vendedor con doscientos contactos y sin criterio los atiende por orden de llegada, que es el peor orden posible. Con los datos que ya tienes se pueden ordenar por probabilidad real de cierre.',
      en: 'A rep with two hundred contacts and no criteria works them in arrival order, which is the worst possible order. With the data you already have, they can be ranked by real likelihood of closing.',
    },
    tarjetas: {
      es: [
        { t: 'Ordenados por cierre', d: 'Prioridad por comportamiento y encaje, no por quién lleva más tiempo esperando.' },
        { t: 'Primer contacto escrito', d: 'Con el dato concreto de cada empresa. Una plantilla se nota a la primera línea.' },
        { t: 'El seguimiento que nadie hace', d: 'El que todos abandonan al tercer intento, sostenido durante meses.' },
      ],
      en: [
        { t: 'Ranked by likelihood', d: 'Priority by behavior and fit, not by who has been waiting longest.' },
        { t: 'First outreach drafted', d: 'With each company’s own details. A template shows in the first line.' },
        { t: 'The follow-up nobody does', d: 'The one everyone abandons on the third try, sustained for months.' },
      ],
    },
  },

  {
    id: 'auditoria',
    escena: 'auditoria',
    kicker: { es: 'Servicio 08', en: 'Service 08' },
    nombre: { es: 'AUDITORÍA\nCON IA', en: 'AI\nAUDIT' },
    descripcion: {
      es: 'Por dónde se empieza. Una revisión de tu presencia digital contra los objetivos que pone tu dirección, con la evidencia de cada hallazgo. Se puede medir antes de firmar nada.',
      en: 'Where you start. A review of your digital presence against the objectives your leadership sets, with the evidence behind every finding. It can be measured before you sign anything.',
    },
    tarjetas: {
      es: [
        { t: 'Cada hallazgo con evidencia', d: 'Su severidad y lo que cuesta arreglarlo. No una lista de opiniones.' },
        { t: 'Contra tus objetivos', d: 'Primero preguntamos qué quiere lograr dirección. Sin eso no hay contra qué medir.' },
        { t: 'Sale un plan, no un PDF', d: 'Ordenado por impacto, para saber qué se hace primero y qué puede esperar.' },
      ],
      en: [
        { t: 'Every finding with evidence', d: 'Its severity and what it costs to fix. Not a list of opinions.' },
        { t: 'Against your objectives', d: 'First we ask what leadership wants. Without that there is nothing to measure against.' },
        { t: 'You get a plan, not a PDF', d: 'Ordered by impact, so you know what to do first and what can wait.' },
      ],
    },
  },

  {
    id: 'tablero',
    escena: 'tablero',
    kicker: { es: 'Servicio 09', en: 'Service 09' },
    nombre: { es: 'TABLERO DE\nRESULTADOS', en: 'RESULTS\nDASHBOARD' },
    descripcion: {
      es: 'Una pantalla con lo que hoy está repartido en cinco herramientas: cuánta gente llega y de dónde, cuántos dejaron sus datos, cuánto costó cada uno y cuáles terminaron en venta.',
      en: 'One screen with what today sits in five different tools: how many people arrive and from where, how many left their details, what each one cost and which ones ended in a sale.',
    },
    tarjetas: {
      es: [
        { t: 'Se actualiza solo', d: 'Conectado a Search Console, Analytics y las campañas. No son capturas de pantalla.' },
        { t: 'Llega hasta la venta', d: 'Cuando tu sistema lo permite, cruza contactos contra ventas facturadas.' },
        { t: 'Auditoría cada mes', d: 'Una IA revisa el desempeño contra los objetivos y dice qué corregir.' },
      ],
      en: [
        { t: 'It updates itself', d: 'Wired to Search Console, Analytics and the ad accounts. These are not screenshots.' },
        { t: 'It reaches the sale', d: 'When your system allows it, leads get matched against invoiced sales.' },
        { t: 'A monthly audit', d: 'An AI reviews performance against the objectives and says what to correct.' },
      ],
    },
  },

  {
    id: 'cierre',
    escena: 'cierre',
    kicker: { es: 'Siguiente paso', en: 'Next step' },
    nombre: { es: 'EMPECEMOS\nPOR MEDIR', en: 'LET US START\nBY MEASURING' },
    descripcion: {
      es: 'No hace falta contratar todo. Se empieza por la auditoría: dónde se está perdiendo el dinero hoy, con evidencia. Eso se puede ver antes de firmar nada.',
      en: 'You do not need to buy everything. You start with the audit: where the money is leaking today, with the evidence. You can see that before signing anything.',
    },
    tarjetas: { es: [], en: [] },
  },
];

export const CONTACTO = {
  whatsapp: '5214491204353',
  telefono: '+52 1 449 120 4353',
  correo: 'contacto@inedito.digital',
  sitio: 'inedito.digital',
};
