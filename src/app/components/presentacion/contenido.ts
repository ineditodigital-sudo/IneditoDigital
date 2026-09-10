/*
 * La carta de servicios, en los dos idiomas.
 *
 * Cómo se escribe aquí, porque es lo que más se nota:
 *
 * MANDA EL NOMBRE. Nada de titulares de autor. Se lee SITIOS WEB, luego qué es
 * y luego qué incluye. Quien abre esto en el teléfono a media junta tiene que
 * saber en dos segundos qué está viendo.
 *
 * LAS TARJETAS VENDEN, NO LUCEN. El titular dice el beneficio en palabras que
 * el cliente usaría, y la línea de abajo explica qué significa para él. Sin
 * frases ingeniosas que hay que descifrar: «cada página termina en algo» no lo
 * entiende nadie; «orientado a objetivos» sí. Y sin encerrarnos: «carga rápido
 * en teléfono» deja fuera la computadora, «veloz en todos los dispositivos» no.
 *
 * TRES TARJETAS POR SERVICIO. Es lo que cabe en una pantalla de teléfono junto
 * al nombre y la escena sin obligar a hacer scroll, y el scroll dentro de una
 * diapositiva es lo que rompe una presentación.
 *
 * Cada lámina lleva la escena que le toca. No hay una animación genérica
 * reutilizada: la de sitios web enseña una página armándose, la de publicidad
 * enseña presupuesto moviéndose. Una animación que no explica el servicio es
 * decoración, y en una presentación de venta eso cuesta atención.
 */

export type Idioma = 'es' | 'en';

/** Una tarjeta: el beneficio y qué significa. */
export type Tarjeta = { t: string; d: string };

/** La portada y el cierre van sin escena ni tarjetas; el resto son servicios. */
export type TipoLamina = 'portada' | 'servicio' | 'cierre';

/** Un enlace opcional bajo la descripción: «Ver el servicio en el sitio». */
export type Enlace = { texto: Record<Idioma, string>; url: string };

export type Lamina = {
  id: string;                            // la dirección: #web, #ecommerce…
  tipo: TipoLamina;
  visible: boolean;                      // se oculta sin borrarla
  escena: string;                        // qué animación le toca ('' = ninguna)
  kicker: Record<Idioma, string>;        // la categoría
  nombre: Record<Idioma, string>;        // EL NOMBRE, en grande
  descripcion: Record<Idioma, string>;   // qué es, en una o dos frases
  tarjetas: Record<Idioma, Tarjeta[]>;   // qué incluye y por qué conviene
  enlace?: Enlace;
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
    tipo: 'portada',
    visible: true,
    escena: '',
    kicker: { es: 'Agencia digital · Aguascalientes', en: 'Digital agency · Aguascalientes, MX' },
    nombre: { es: 'CARTA DE\nSERVICIOS', en: 'SERVICE\nCATALOG' },
    descripcion: {
      es: 'Diez servicios, qué incluye cada uno y cómo se mide. Sin promesas que no se puedan enseñar en un tablero.',
      en: 'Ten services, what each one includes and how it gets measured. No promises we cannot show you on a dashboard.',
    },
    tarjetas: { es: [], en: [] },
  },

  {
    id: 'web',
    tipo: 'servicio',
    visible: true,
    escena: 'web',
    kicker: { es: 'Servicio 01', en: 'Service 01' },
    nombre: { es: 'SITIOS WEB', en: 'WEBSITES' },
    descripcion: {
      es: 'Tu sitio es el vendedor que nunca duerme. Lo construimos para que cargue rápido, se vea bien en cualquier pantalla y lleve a la gente a contactarte.',
      en: 'Your site is the salesperson that never sleeps. We build it to load fast, look right on any screen and get people to contact you.',
    },
    tarjetas: {
      es: [
        {
          t: 'Sitio veloz en todos los dispositivos',
          d: 'Carga en menos de dos segundos en computadora, tablet y teléfono. Google lo mide y lo premia, y tu cliente no se va antes de ver nada.',
        },
        {
          t: 'Completamente administrable para tu equipo',
          d: 'Cambias textos, precios, fotos y secciones sin saber programar y sin pagar por cada ajuste. Te capacitamos y el panel se diseña sobre lo que tú necesitas mover.',
        },
        {
          t: 'Orientado a objetivos',
          d: 'Cada página está armada para que el visitante haga lo que a ti te importa: cotizar, escribir o comprar. Trabaja como tu mejor vendedor, no como un folleto.',
        },
      ],
      en: [
        {
          t: 'Fast on every device',
          d: 'Loads in under two seconds on desktop, tablet and phone. Google measures it and rewards it, and your customer does not leave before seeing anything.',
        },
        {
          t: 'Fully managed by your team',
          d: 'You change text, prices, photos and sections without knowing how to code and without paying per tweak. We train you, and the panel is built around what you actually need to change.',
        },
        {
          t: 'Built around your goals',
          d: 'Every page is built to get the visitor to do what matters to you: request a quote, message you or buy. It works like your best salesperson, not like a brochure.',
        },
      ],
    },
  },

  {
    id: 'ecommerce',
    tipo: 'servicio',
    visible: true,
    escena: 'ecommerce',
    kicker: { es: 'Servicio 02', en: 'Service 02' },
    nombre: { es: 'TIENDA EN LÍNEA', en: 'ONLINE STORE' },
    descripcion: {
      es: 'Tu tienda vendiendo sola: catálogo, pagos, envíos y seguimiento. Y una IA dentro que recupera al cliente que se iba sin comprar.',
      en: 'Your store selling on its own: catalog, payments, shipping and follow-up. With an AI inside that recovers the customer who was leaving without buying.',
    },
    tarjetas: {
      es: [
        {
          t: 'Lista para vender desde el primer día',
          d: 'Catálogo, carrito, pago con tarjeta y meses sin intereses, envíos y facturación. Todo conectado y probado antes de salir.',
        },
        {
          t: 'Recupera las ventas que se caen',
          d: 'Siete de cada diez carritos se abandonan. Un agente le escribe a esa persona en el momento justo y con el argumento correcto, y recupera una parte.',
        },
        {
          t: 'Sabes qué producto te deja dinero',
          d: 'Margen real por producto y por canal, ya con comisiones y envíos descontados. Dejas de empujar lo que factura mucho y deja poco.',
        },
      ],
      en: [
        {
          t: 'Ready to sell from day one',
          d: 'Catalog, cart, card payments and installments, shipping and invoicing. All connected and tested before it goes live.',
        },
        {
          t: 'Recovers the sales you are losing',
          d: 'Seven out of ten carts get abandoned. An agent writes to that person at the right moment with the right argument, and wins a share of them back.',
        },
        {
          t: 'You know which product makes money',
          d: 'Real margin per product and per channel, with fees and shipping already deducted. You stop pushing what bills a lot and leaves little.',
        },
      ],
    },
  },

  {
    id: 'posicionamiento',
    tipo: 'servicio',
    visible: true,
    escena: 'posicionamiento',
    kicker: { es: 'Servicio 03', en: 'Service 03' },
    nombre: { es: 'POSICIONAMIENTO\nEN GOOGLE Y EN IA', en: 'GOOGLE AND\nAI VISIBILITY' },
    descripcion: {
      es: 'Que te encuentren cuando te buscan: en Google y en las IA donde ya preguntan primero.',
      en: 'Get found when people look for you: on Google and in the AIs they now ask first.',
    },
    tarjetas: {
      es: [
        {
          t: 'Primero en Google, sin pagar por clic',
          d: 'Trabajamos lo técnico y el contenido para que aparezcas en las búsquedas que traen clientes. Es tráfico que no se apaga cuando dejas de pagar.',
        },
        {
          t: 'Que las IA te recomienden',
          d: 'Medimos en cuántas respuestas de ChatGPT, Gemini, Claude y Perplexity aparece tu marca, y trabajamos para que estés en esa lista.',
        },
        {
          t: 'Contenido que responde lo que preguntan',
          d: 'Escrito contra las dudas reales de tu comprador, no relleno para llenar un blog. Es lo que un buscador y una IA pueden citar.',
        },
      ],
      en: [
        {
          t: 'Top of Google without paying per click',
          d: 'We work the technical side and the content so you show up in the searches that bring customers. It is traffic that does not switch off when you stop paying.',
        },
        {
          t: 'Get recommended by the AIs',
          d: 'We measure how many ChatGPT, Gemini, Claude and Perplexity answers name your brand, and work to get you onto that list.',
        },
        {
          t: 'Content that answers what they ask',
          d: 'Written against your buyer’s real questions, not filler to fill a blog. It is what a search engine and an AI can actually quote.',
        },
      ],
    },
  },

  {
    id: 'local',
    tipo: 'servicio',
    visible: true,
    escena: 'local',
    kicker: { es: 'Servicio 04', en: 'Service 04' },
    nombre: { es: 'FICHA DE GOOGLE', en: 'GOOGLE BUSINESS\nPROFILE' },
    descripcion: {
      es: 'Cuando alguien busca tu servicio cerca, Google enseña tres negocios en un mapa. Ese bloque decide antes de que nadie entre a tu página.',
      en: 'When somebody searches for your service nearby, Google shows three businesses on a map. That block decides before anyone reaches your site.',
    },
    tarjetas: {
      es: [
        {
          t: 'Apareces en el mapa, no debajo',
          d: 'Categorías, servicios, zona y horarios bien puestos para que Google te muestre a quien te está buscando en tu ciudad.',
        },
        {
          t: 'Reseñas que dan confianza',
          d: 'Montamos la rutina para pedirlas a clientes reales y contestamos todas, también las malas. Es la señal de confianza más rápida que existe.',
        },
        {
          t: 'Te ves serio en todas partes',
          d: 'Mismo nombre, dirección y teléfono en tu web, la ficha y los directorios. Los datos disparejos le quitan confianza a Google y a tu cliente.',
        },
      ],
      en: [
        {
          t: 'You show on the map, not below it',
          d: 'Categories, services, area and hours set up properly so Google shows you to whoever is looking in your city.',
        },
        {
          t: 'Reviews that build trust',
          d: 'We set up the routine to ask real customers, and we answer every one — the bad ones too. It is the fastest trust signal there is.',
        },
        {
          t: 'You look serious everywhere',
          d: 'Same name, address and phone on your site, your listing and the directories. Mismatched details cost you trust with Google and with your customer.',
        },
      ],
    },
  },

  {
    id: 'publicidad',
    tipo: 'servicio',
    visible: true,
    escena: 'publicidad',
    kicker: { es: 'Servicio 05', en: 'Service 05' },
    nombre: { es: 'PUBLICIDAD\nDIGITAL', en: 'PAID\nADVERTISING' },
    descripcion: {
      es: 'Google, Meta y ahora ChatGPT Ads. Tu dinero puesto donde trae clientes, no donde trae clics.',
      en: 'Google, Meta and now ChatGPT Ads. Your money where it brings customers, not where it brings clicks.',
    },
    tarjetas: {
      es: [
        {
          t: 'Pagas por clientes, no por clics',
          d: 'Las campañas se optimizan a llamadas, mensajes y formularios. Un clic no paga nómina y no debería ser lo que se mide.',
        },
        {
          t: 'Sabes cuánto te cuesta cada cliente',
          d: 'El costo por contacto de cada canal, lado a lado en la misma pantalla. Con eso mueves presupuesto con criterio y no por corazonada.',
        },
        {
          t: 'Se corrige cada semana, no cada mes',
          d: 'Revisamos pujas, audiencias y anuncios, y apagamos lo que no rinde sin esperar al reporte de fin de mes.',
        },
      ],
      en: [
        {
          t: 'You pay for customers, not clicks',
          d: 'Campaigns are optimized for calls, messages and forms. A click does not make payroll and should not be what gets measured.',
        },
        {
          t: 'You know what each customer costs',
          d: 'The cost per lead of every channel, side by side on one screen. That is how budget moves on judgment instead of a hunch.',
        },
        {
          t: 'Corrected weekly, not monthly',
          d: 'We review bids, audiences and creative, and switch off what is not working without waiting for the end-of-month report.',
        },
      ],
    },
  },

  {
    id: 'espectaculares',
    tipo: 'servicio',
    visible: true,
    escena: 'espectaculares',
    kicker: { es: 'Servicio 06', en: 'Service 06' },
    nombre: { es: 'ANUNCIOS\nESPECTACULARES', en: 'BILLBOARD\nADVERTISING' },
    descripcion: {
      es: 'El único medio que nadie puede saltarse. 317 espacios en Aguascalientes elegidos por flujo de gente, no por foto de catálogo.',
      en: 'The one medium nobody can skip. 317 spaces across Aguascalientes chosen by how many people pass, not by a catalog photo.',
    },
    tarjetas: {
      es: [
        {
          t: 'El punto correcto, no el que estaba libre',
          d: 'Elegimos por flujo vehicular, sentido y ángulo de lectura. Te entregamos la ficha técnica de cada sitio con sus impactos estimados.',
        },
        {
          t: 'Sin riesgo para tu marca',
          d: 'Todos los espacios están regularizados. Un espectacular sin permisos se clausura con tu logotipo puesto, y ese problema de imagen es tuyo.',
        },
        {
          t: 'Sí se puede medir',
          d: 'Número propio, página de destino y el alza en búsquedas de tu marca. Sabes qué te trajo, no lo contratas a ciegas.',
        },
      ],
      en: [
        {
          t: 'The right site, not the one that was free',
          d: 'We choose by traffic flow, direction and reading angle. You get the spec sheet for each site with its estimated impressions.',
        },
        {
          t: 'No risk to your brand',
          d: 'Every space is fully permitted. An unpermitted billboard gets shut down with your logo on it, and that image problem is yours.',
        },
        {
          t: 'It can be measured',
          d: 'A dedicated number, a landing page and the lift in searches for your brand. You know what it brought; you are not buying blind.',
        },
      ],
    },
  },

  {
    id: 'agentes',
    tipo: 'servicio',
    visible: true,
    escena: 'agentes',
    kicker: { es: 'Servicio 07', en: 'Service 07' },
    nombre: { es: 'AGENTES DE IA\nPARA WHATSAPP', en: 'AI AGENTS\nFOR WHATSAPP' },
    descripcion: {
      es: 'Nadie compra si no le contestan. Un agente atiende con tu información real y le pasa a tu equipo solo las conversaciones que valen una llamada.',
      en: 'Nobody buys if nobody answers. An agent replies with your real information and passes your team only the conversations worth a call.',
    },
    tarjetas: {
      es: [
        {
          t: 'Contesta al instante, todo el día',
          d: 'A cualquier hora y en fin de semana, con tus precios, horarios y políticas. Dejas de perder al que escribió a las once de la noche.',
        },
        {
          t: 'Te pasa solo lo que vale la pena',
          d: 'Pregunta lo que preguntaría tu vendedor, separa al curioso del comprador y entrega la conversación con todo el contexto.',
        },
        {
          t: 'Aprendes qué te están preguntando',
          d: 'La lista de dudas ordenada por frecuencia. Casi siempre enseña algo que nadie del equipo tenía medido.',
        },
      ],
      en: [
        {
          t: 'Answers instantly, all day',
          d: 'At any hour and on weekends, with your prices, hours and policies. You stop losing the person who wrote at eleven at night.',
        },
        {
          t: 'It only passes you what is worth it',
          d: 'It asks what your salesperson would ask, separates the browser from the buyer, and hands over the conversation with the full context.',
        },
        {
          t: 'You learn what people are asking',
          d: 'The list of questions ranked by frequency. It almost always shows something nobody on the team had measured.',
        },
      ],
    },
  },

  {
    id: 'ventas',
    tipo: 'servicio',
    visible: true,
    escena: 'ventas',
    kicker: { es: 'Servicio 08', en: 'Service 08' },
    nombre: { es: 'IA PARA\nVENTAS', en: 'AI FOR\nSALES' },
    descripcion: {
      es: 'Tu equipo dedicando el tiempo a quien sí va a comprar. La lista deja de atenderse por orden de llegada, que es el peor orden posible.',
      en: 'Your team spending its time on whoever is actually going to buy. The list stops being worked in arrival order, which is the worst order there is.',
    },
    tarjetas: {
      es: [
        {
          t: 'Primero el que va a comprar',
          d: 'Cada contacto se ordena por probabilidad real de cierre con los datos que ya tienes. El mejor deja de esperar detrás de tres curiosos.',
        },
        {
          t: 'El primer mensaje, ya escrito',
          d: 'Redactado con el dato concreto de esa empresa y listo para que tu vendedor lo revise y lo mande. Una plantilla se nota en la primera línea.',
        },
        {
          t: 'El seguimiento no se abandona',
          d: 'El que todos dejan al tercer intento se sostiene durante meses. Ahí está buena parte de las ventas que hoy se pierden.',
        },
      ],
      en: [
        {
          t: 'The buyer comes first',
          d: 'Every lead is ranked by real likelihood of closing, using the data you already have. The best one stops waiting behind three browsers.',
        },
        {
          t: 'The first message, already written',
          d: 'Drafted with that company’s own details, ready for your rep to review and send. A template shows in the first line.',
        },
        {
          t: 'The follow-up does not get dropped',
          d: 'The one everybody abandons on the third try runs for months. That is where a good share of today’s lost sales are.',
        },
      ],
    },
  },

  {
    id: 'auditoria',
    tipo: 'servicio',
    visible: true,
    escena: 'auditoria',
    kicker: { es: 'Servicio 09', en: 'Service 09' },
    nombre: { es: 'AUDITORÍA\nCON IA', en: 'AI\nAUDIT' },
    descripcion: {
      es: 'Por dónde empezar. Te decimos qué está mal en tu presencia digital, con la prueba de cada hallazgo y qué cuesta arreglarlo.',
      en: 'Where to start. We tell you what is wrong with your digital presence, with the evidence behind each finding and what it costs to fix.',
    },
    tarjetas: {
      es: [
        {
          t: 'Sabes qué está roto antes de gastar',
          d: 'Revisamos sitio, buscadores, ficha de Google, redes y campañas. Cada hallazgo llega con su prueba, no con una opinión.',
        },
        {
          t: 'Ordenado por lo que más mueve',
          d: 'Sale un plan priorizado por impacto: qué se hace primero, qué puede esperar y qué no vale la pena tocar.',
        },
        {
          t: 'Medido contra tus objetivos',
          d: 'Primero preguntamos qué quiere lograr tu dirección y en qué plazo. Sin eso, una auditoría es una lista de opiniones.',
        },
      ],
      en: [
        {
          t: 'You know what is broken before you spend',
          d: 'We review the site, search, the Google listing, social and campaigns. Every finding comes with its evidence, not an opinion.',
        },
        {
          t: 'Ordered by what moves the most',
          d: 'You get a plan prioritized by impact: what to do first, what can wait and what is not worth touching.',
        },
        {
          t: 'Measured against your objectives',
          d: 'First we ask what your leadership wants to achieve, and by when. Without that, an audit is a list of opinions.',
        },
      ],
    },
  },

  {
    id: 'tablero',
    tipo: 'servicio',
    visible: true,
    escena: 'tablero',
    kicker: { es: 'Servicio 10', en: 'Service 10' },
    nombre: { es: 'TABLERO DE\nRESULTADOS', en: 'RESULTS\nDASHBOARD' },
    descripcion: {
      es: 'Una sola pantalla con lo que hoy vive en cinco herramientas. Conectada a tus datos reales, no a capturas que alguien arma a mano cada mes.',
      en: 'One screen with what today lives in five different tools. Wired to your real data, not to screenshots somebody assembles by hand each month.',
    },
    tarjetas: {
      es: [
        {
          t: 'Todo en un solo lugar',
          d: 'Cuánta gente llega, de dónde, cuántos dejaron sus datos y cuánto costó cada uno. Se actualiza solo y lo abres cuando quieras.',
        },
        {
          t: 'Llega hasta la venta',
          d: 'Cuando tu sistema lo permite, cruzamos los contactos contra ventas facturadas. Ahí la conversación con dirección cambia de tono.',
        },
        {
          t: 'Una IA lo revisa cada mes',
          d: 'Compara el desempeño contra tus objetivos y señala qué corregir. Si un mes no se movió nada, también sale ahí.',
        },
      ],
      en: [
        {
          t: 'Everything in one place',
          d: 'How many people arrive, from where, how many left their details and what each one cost. It updates itself and you open it whenever.',
        },
        {
          t: 'It reaches the sale',
          d: 'When your system allows it, we match leads against invoiced sales. That is where the conversation with leadership changes tone.',
        },
        {
          t: 'An AI reviews it every month',
          d: 'It compares performance against your objectives and points out what to correct. If a month moved nothing, that shows too.',
        },
      ],
    },
  },

  {
    id: 'cierre',
    tipo: 'cierre',
    visible: true,
    escena: '',
    kicker: { es: 'Siguiente paso', en: 'Next step' },
    nombre: { es: 'EMPECEMOS\nPOR MEDIR', en: 'LET US START\nBY MEASURING' },
    descripcion: {
      es: 'No hace falta contratar todo. Se empieza por la auditoría: dónde se está perdiendo el dinero hoy, con la prueba de cada cosa. Eso se ve antes de firmar nada.',
      en: 'You do not need to buy everything. You start with the audit: where the money is leaking today, with the evidence for each item. You see that before signing anything.',
    },
    tarjetas: { es: [], en: [] },
  },
];

export type Contacto = {
  whatsapp: string;                      // solo dígitos, con 521: para wa.me y tel:
  mensaje: Record<Idioma, string>;       // con qué texto se abre el chat ('' = ninguno)
  telefono: string;                      // cómo se escribe, para anotarlo
  correo: string;
  sitio: string;
};

export const CONTACTO: Contacto = {
  whatsapp: '5214491204353',
  mensaje: { es: '', en: '' },
  telefono: '+52 1 449 120 4353',
  correo: 'contacto@inedito.digital',
  sitio: 'inedito.digital',
};

/** Los textos de los botones que llevan a algún lado. */
export type Botones = Record<'empezar' | 'escribir' | 'correo', Record<Idioma, string>>;

export const BOTONES: Botones = {
  empezar: { es: UI.empezar.es, en: UI.empezar.en },
  escribir: { es: UI.escribir.es, en: UI.escribir.en },
  correo: { es: UI.correo.es, en: UI.correo.en },
};

/*
 * Todo lo que se edita desde el panel, junto.
 *
 * Esto es el RESPALDO: lo que se ve mientras nadie haya publicado la
 * presentación desde el panel, o si la base no contesta. En cuanto alguien
 * publica, manda lo publicado. Vite exporta además esto mismo como
 * /presentacion-base.json para que el panel arranque con este texto y no con
 * una copia escrita a mano que se desfase (ver vite.config.ts).
 */
export type DatosPresentacion = { contacto: Contacto; botones: Botones; laminas: Lamina[] };

export const BASE: DatosPresentacion = { contacto: CONTACTO, botones: BOTONES, laminas: LAMINAS };
