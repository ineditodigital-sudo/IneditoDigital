/*
 * El glosario público.
 *
 * Sale del glosario interno que trae el documento de dirección, ampliado con
 * los términos que de verdad aparecen cuando alguien pregunta por qué su sitio
 * no aparece en Google.
 *
 * Por qué existe: contenido definicional es lo que un asistente de IA cita
 * cuando le preguntan "qué es AEO". Nadie en Aguascalientes lo tiene publicado,
 * y a nosotros nos sale gratis porque son cosas que ya explicamos por WhatsApp
 * todas las semanas.
 *
 * REGLA: aquí NO se repiten las definiciones de los servicios. Esas viven en
 * el campo `definicion` de cada ficha y el glosario enlaza a ellas. Duplicar
 * texto es garantizar que dentro de seis meses digan cosas distintas.
 */

export type Termino = {
  termino: string;
  siglas?: string;
  /** La primera frase responde "qué es". Es lo que se puede citar. */
  definicion: string;
  /** Un matiz que evita el malentendido más común. */
  matiz?: string;
  /** A qué página del sitio lleva, si hay una. */
  enlace?: { texto: string; url: string };
};

export type Grupo = { titulo: string; terminos: Termino[] };

export const GLOSARIO: Grupo[] = [
  {
    titulo: 'Aparecer en buscadores y en la IA',
    terminos: [
      {
        termino: 'SEO',
        siglas: 'Search Engine Optimization',
        definicion:
          'Optimización para aparecer en buscadores tradicionales como Google o Bing, en la lista de resultados, sin pagar por cada clic.',
        matiz:
          'No es «pagarle a Google». Eso es Google Ads. El SEO no se compra: se trabaja y tarda meses.',
        enlace: { texto: 'Posicionamiento orgánico', url: '/servicios/posicionamiento-organico' },
      },
      {
        termino: 'AEO',
        siglas: 'Answer Engine Optimization',
        definicion:
          'Optimización para motores de respuesta: los asistentes que contestan la pregunta directamente en vez de devolver una lista de enlaces.',
        matiz:
          'Lo que más ayuda es responder en las primeras cuarenta palabras y publicar preguntas frecuentes con marcado FAQPage. Un asistente toma el primer párrafo.',
      },
      {
        termino: 'GEO',
        siglas: 'Generative Engine Optimization',
        definicion:
          'El trabajo para aparecer dentro de la respuesta que genera una inteligencia artificial como ChatGPT, Claude o Gemini cuando alguien pide una recomendación.',
        matiz:
          'Nadie puede garantizarlo: no se reentrena un modelo desde fuera ni se compra un lugar en su respuesta. Lo que se hace es que tu información sea correcta, consistente y fácil de citar.',
        enlace: { texto: 'Posicionamiento en IA', url: '/servicios/posicionamiento-en-ia' },
      },
      {
        termino: 'Indexación',
        definicion:
          'Que Google haya guardado una página en su índice. Solo lo que está indexado puede aparecer en resultados.',
        matiz:
          'Estar en el sitemap no basta. Google puede conocer una URL y no haberla visitado nunca; entonces no compite por nada.',
      },
      {
        termino: 'Rastreo',
        siglas: 'crawling',
        definicion:
          'La visita que hace el robot de Google a una página para leer su contenido. Sin rastreo no hay indexación.',
        matiz:
          'Google reparte un presupuesto de rastreo según la autoridad del dominio. Un sitio con pocos enlaces entrantes recibe pocas visitas, y por eso sus páginas nuevas tardan meses en entrar.',
      },
      {
        termino: 'llms.txt',
        definicion:
          'Un archivo de texto en la raíz del sitio que resume en lenguaje claro quién es la empresa y qué hace, pensado para que lo lean los modelos de inteligencia artificial.',
        matiz: 'Es la vía más barata y directa de que una IA entienda a qué te dedicas.',
        enlace: { texto: 'Ver el nuestro', url: '/llms.txt' },
      },
    ],
  },
  {
    titulo: 'Medir lo que pasa',
    terminos: [
      {
        termino: 'Search Console',
        siglas: 'GSC',
        definicion:
          'La herramienta gratuita de Google que muestra cómo aparece un sitio en las búsquedas: qué se busca para encontrarlo, en qué posición sale y qué páginas están indexadas.',
        matiz:
          'Es lo único que dice qué escribe la gente de verdad. Sin acceso a ella, cualquier estrategia de posicionamiento es una suposición.',
      },
      {
        termino: 'Google Analytics',
        siglas: 'GA4',
        definicion:
          'La herramienta que mide qué hace la gente una vez dentro del sitio: cuántos entran, de dónde vienen y qué páginas recorren.',
        matiz:
          'Search Console mide lo de fuera —qué se busca—; Analytics mide lo de dentro. Hacen falta las dos.',
      },
      {
        termino: 'Impresiones',
        definicion:
          'Las veces que tu sitio apareció en resultados de búsqueda, lo hayan visto o no.',
        matiz:
          'Muchas impresiones con cero clics suele significar que apareces en una posición baja, o que el título no da razones para entrar.',
      },
      {
        termino: 'CTR',
        siglas: 'Click Through Rate',
        definicion:
          'El porcentaje de gente que hace clic sobre las veces que apareciste. Si sales cien veces y entran dos, el CTR es 2%.',
        matiz:
          'Se mejora con el título y la descripción, no con la posición. Es de lo poco que se puede arreglar en una tarde.',
      },
      {
        termino: 'PageSpeed',
        definicion:
          'La medición de Google sobre la velocidad y el desempeño de una página, con nota de 0 a 100 en móvil y en escritorio.',
        matiz: 'Lo que más pesa suele ser el tamaño de las imágenes, no el código.',
      },
    ],
  },
  {
    titulo: 'Presencia y reputación',
    terminos: [
      {
        termino: 'Ficha de Google',
        siglas: 'Google Business Profile',
        definicion:
          'El perfil de empresa que aparece a la derecha en Google y dentro de Maps, con dirección, horario, teléfono, fotos y reseñas. Es gratuito.',
        matiz:
          'Antes se llamaba Google My Business. Es de los activos más importantes y más descuidados: muchas empresas ni siquiera han reclamado el suyo.',
        enlace: { texto: 'Ficha de Google', url: '/servicios/ficha-de-google' },
      },
      {
        termino: 'Bloque de mapas',
        siglas: 'local pack',
        definicion:
          'El recuadro con tres negocios y un mapa que Google muestra arriba de todo en búsquedas con intención local.',
        matiz:
          'Sale por encima de los resultados normales. Por eso una empresa puede estar en primera posición orgánica y aun así recibir pocos clics.',
      },
      {
        termino: 'NAP',
        siglas: 'Name, Address, Phone',
        definicion:
          'Nombre, dirección y teléfono de un negocio. La consistencia del NAP es que estén escritos exactamente igual en todos lados.',
        matiz:
          'Si tu dirección aparece distinta en tu web, tu ficha y los directorios, Google pierde confianza en el dato y te muestra menos.',
      },
      {
        termino: 'Backlink',
        siglas: 'enlace entrante',
        definicion:
          'Un enlace desde otro sitio hacia el tuyo. Google los lee como recomendaciones: cuantos más dominios distintos y de más calidad, más autoridad.',
        matiz:
          'Lo que cuenta son los dominios distintos, no los enlaces. Doscientas páginas del mismo sitio con el mismo pie de página valen aproximadamente una.',
      },
      {
        termino: 'Enlace de plantilla',
        siglas: 'sitewide',
        definicion:
          'Un enlace que se repite en todas las páginas de un sitio, típicamente en el pie: «Hecho por…».',
        matiz:
          'Google los descuenta casi por completo, y los créditos de desarrollador están entre los que menos valen: los pone quien construyó el sitio, no quien lo recomienda.',
      },
    ],
  },
  {
    titulo: 'Cómo trabajamos',
    terminos: [
      {
        termino: 'Auditoría con IA',
        definicion:
          'La revisión completa de la presencia digital de una empresa, con la evidencia de cada hallazgo y priorizada por impacto.',
        matiz: 'No es un reporte automático. Es un plan de trabajo con números detrás.',
        enlace: { texto: 'Auditoría con IA', url: '/servicios/auditoria-con-ia' },
      },
      {
        termino: 'Dirección comercial asistida por IA',
        definicion:
          'La forma en que trabajamos: la dirección del cliente define los objetivos, todo queda conectado —Search Console, Analytics, campañas y, donde aplica, el ERP— y una IA audita periódicamente si la estrategia está funcionando.',
        matiz: 'La diferencia con una agencia normal es que el reporte puede decir que algo no funcionó.',
        enlace: { texto: 'Cómo trabajamos', url: '/nosotros' },
      },
    ],
  },
];

/** Todos los términos en plano, para el schema y el buscador. */
export const TERMINOS_PLANOS = GLOSARIO.flatMap((g) => g.terminos);
