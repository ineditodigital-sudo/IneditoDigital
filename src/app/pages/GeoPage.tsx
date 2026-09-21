import { motion } from 'motion/react';
import { LogoIA, marcaPorNombre } from '../components/LogosIA';
import DynamicSEO from '../components/DynamicSEO';
import { FichaServicio, type Punto } from '../components/FichaServicio';
import { contenido } from '../cms';

/**
 * ============================================================
 * POSICIONAMIENTO EN INTELIGENCIA ARTIFICIAL (GEO)
 * ============================================================
 *
 * La página que vende el servicio, y que además tiene que ser un buen
 * ejemplo de él: si queremos que las IAs nos citen cuando alguien pregunte
 * por esto en Aguascalientes, esta página tiene que ser justo lo que una IA
 * puede leer, entender y citar.
 *
 * Tiene el diseño y la estructura de cualquier servicio (components/
 * FichaServicio). Su contenido, que se edita en Páginas › Posicionamiento en
 * IA, se acomoda así:
 *
 *   portada       el nombre, la bajada, «Qué es» y el diagnóstico gratuito
 *   motores       su bloque propio tras la portada, como el catálogo de
 *                 espectaculares: los seis asistentes con su logotipo
 *   servicio      qué incluye
 *   comparación   lo que ganas: cada «con Inédito» con su «sin GEO» debajo
 *   proceso       el recorrido, con su escena: la respuesta que te nombra
 *   problema,     el fondo del asunto, plegado
 *   local
 *   preguntas     preguntas frecuentes
 *   cierre        el llamado final
 *
 * Sobre el tono: se promete lo que sí se entrega. No se puede reentrenar un
 * modelo desde fuera, y decirlo sería vender humo que cualquier prospecto
 * técnico desarma en una llamada. Sí se puede influir en lo que citan, y eso
 * es lo que dice la página.
 */

const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.6, delay: retraso },
});

/* El «Qué es». Sale de la primera pregunta frecuente, que ya es la
   definición aprobada, escrita como definición y no como respuesta. */
const DEFINICION =
  'El posicionamiento en inteligencia artificial —GEO, por Generative Engine Optimization— es el trabajo de lograr que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta por lo que vendes. Es el equivalente al SEO, pero para las respuestas de los asistentes en vez de la lista de resultados azules.';

export default function GeoPage() {
  const t = contenido('posicionamiento-ia', 'portada');
  const tPro = contenido('posicionamiento-ia', 'problema');
  const tMot = contenido('posicionamiento-ia', 'motores');
  const tCmp = contenido('posicionamiento-ia', 'comparacion');
  const tSrv = contenido('posicionamiento-ia', 'servicio');
  const tPas = contenido('posicionamiento-ia', 'proceso');
  const tFaq = contenido('posicionamiento-ia', 'preguntas');
  const tLoc = contenido('posicionamiento-ia', 'local');
  const tCie = contenido('posicionamiento-ia', 'cierre');
  const tEnc = contenido('servicio-detalle', 'encabezados');

  const motores = [
    { n: tMot('m1', 'ChatGPT'), d: tMot('m1_d', 'OpenAI') },
    { n: tMot('m2', 'Google Gemini'), d: tMot('m2_d', 'Google') },
    { n: tMot('m3', 'AI Overviews'), d: tMot('m3_d', 'Resúmenes de Google') },
    { n: tMot('m4', 'Perplexity'), d: tMot('m4_d', 'Búsqueda con fuentes') },
    { n: tMot('m5', 'Claude'), d: tMot('m5_d', 'Anthropic') },
    { n: tMot('m6', 'Copilot'), d: tMot('m6_d', 'Microsoft y Bing') },
  ];

  const entregables: Punto[] = [
    {
      titulo: tSrv('s1_t', 'Diagnóstico de lo que dicen hoy'),
      texto: tSrv('s1_d', 'Le preguntamos a cada motor por tu marca, tu giro y tus competidores, y te entregamos las respuestas tal cual salen. Casi siempre hay sorpresas.'),
    },
    {
      titulo: tSrv('s2_t', 'Datos estructurados en tu sitio'),
      texto: tSrv('s2_d', 'Marcado Schema.org bien puesto: quién eres, dónde estás, qué vendes y cómo contactarte. Es la forma en que un rastreador entiende tu negocio sin adivinar.'),
    },
    {
      titulo: tSrv('s3_t', 'Contenido que se puede citar'),
      texto: tSrv('s3_d', 'Preguntas reales con respuestas claras y verificables. Un modelo cita lo que puede extraer sin interpretar; escribimos pensando en eso.'),
    },
    {
      titulo: tSrv('s4_t', 'Consistencia en tus fuentes'),
      texto: tSrv('s4_d', 'Mismo nombre, misma dirección, mismo teléfono y mismo giro en tu ficha de Google, directorios, reseñas y redes. Las contradicciones son lo que más te cuesta.'),
    },
    {
      titulo: tSrv('s5_t', 'Corrección de datos viejos'),
      texto: tSrv('s5_d', 'Rastreamos de dónde salen los datos desactualizados que aparecen sobre ti y trabajamos en la fuente, que es el único lugar donde se arreglan de verdad.'),
    },
    {
      titulo: tSrv('s6_t', 'Medición mes con mes'),
      texto: tSrv('s6_d', 'Un reporte que se entiende: en qué preguntas apareces, en cuáles no, qué cambió y qué sigue. Sin métricas inventadas.'),
    },
  ];

  const pasos = [
    { step: 1, title: tPas('p1_t', 'Escuchamos'), description: tPas('p1_d', 'Corremos las preguntas que haría un cliente tuyo en los seis motores y guardamos las respuestas como punto de partida.') },
    { step: 2, title: tPas('p2_t', 'Ordenamos'), description: tPas('p2_d', 'Dejamos tu sitio legible para las IAs: datos estructurados, fichas de entidad y acceso limpio para sus rastreadores.') },
    { step: 3, title: tPas('p3_t', 'Publicamos'), description: tPas('p3_d', 'Creamos el contenido que faltaba para responder esas preguntas mejor que nadie en tu zona.') },
    { step: 4, title: tPas('p4_t', 'Medimos'), description: tPas('p4_d', 'Volvemos a preguntar cada mes, comparamos contra el punto de partida y ajustamos lo que no movió.') },
  ];

  /* Las siete de siempre, y lugar para cinco más desde el panel. */
  const respaldosFaq: [string, string][] = [
    ['¿Qué es el posicionamiento GEO?', 'GEO significa Generative Engine Optimization: el trabajo de lograr que los asistentes de inteligencia artificial encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta. Es el equivalente al SEO, pero para ChatGPT, Gemini, Perplexity y los resúmenes de Google en vez de la lista de resultados azules.'],
    ['¿En qué se diferencia del SEO de toda la vida?', 'El SEO busca que tu página aparezca en una lista y que la persona haga clic. El GEO busca que la IA use tu información al redactar su respuesta, aunque nadie entre a tu sitio. Comparten mucha base técnica, pero cambia lo que se optimiza: en GEO importa más que tus datos sean verificables, consistentes y fáciles de extraer que la posición en un ranking.'],
    ['¿Se puede modificar lo que ChatGPT dice de mi empresa?', 'No directamente: nadie puede reentrenar un modelo desde fuera, y quien te prometa eso te está vendiendo algo que no existe. Lo que sí se puede es cambiar la materia prima con la que responde. Estos asistentes consultan la web en tiempo real y se apoyan en fuentes verificables, así que ordenar esas fuentes, corregir los datos viejos y publicar información citable sí cambia sus respuestas.'],
    ['¿Cuánto tarda en verse un cambio?', 'Lo que depende de tu sitio, como los datos estructurados, se refleja en días. Lo que depende de fuentes externas, como directorios y reseñas, toma más: entre uno y tres meses según qué tan regada esté la información. Te lo medimos cada mes para que no sea cuestión de fe.'],
    ['¿Sirve para un negocio local de Aguascalientes?', 'Sirve especialmente. Cuando alguien pregunta por un servicio en una ciudad concreta, los asistentes se apoyan mucho en señales locales: la ficha de Google, las reseñas, los directorios de la zona y la coherencia entre todos. Un negocio local bien ordenado compite muy bien en esas respuestas, incluso contra marcas más grandes.'],
    ['¿Necesito rehacer mi sitio web?', 'Casi nunca. Buena parte del trabajo se hace sobre lo que ya tienes. Si tu sitio no se puede editar o los rastreadores no lo pueden leer, te lo decimos en el diagnóstico y lo tratamos aparte, sin meterlo en el mismo paquete.'],
    ['¿Cuánto cuesta?', 'Depende del tamaño de tu marca y de qué tan dispersa esté hoy tu información, así que se cotiza después del diagnóstico. El diagnóstico no tiene costo y no compromete a nada.'],
  ];
  const faq = Array.from({ length: 12 }, (_, i) => ({
    question: tFaq(`q${i + 1}`, respaldosFaq[i]?.[0] ?? ''),
    answer: tFaq(`r${i + 1}`, respaldosFaq[i]?.[1] ?? ''),
  })).filter((f) => f.question && f.answer);

  /* Lo que ganas: cada «con Inédito» con el «sin GEO» que le corresponde.
     Van en pares a propósito: confundirte ↔ nombrarte bien, dato viejo ↔
     dato verificable, no aparecer ↔ aparecer. */
  const antes = [
    tCmp('a1', 'Te confunde con otro negocio de nombre parecido'),
    tCmp('a2', 'Repite un teléfono o un horario que cambiaste hace años'),
    tCmp('a3', 'Dice que no encuentra información y recomienda a tu competencia'),
  ];
  const despues = [
    tCmp('d1', 'Te nombra con tu giro y tu ciudad, sin confundirte'),
    tCmp('d2', 'Usa los datos que tú publicas y que puede verificar'),
    tCmp('d3', 'Te incluye cuando alguien pregunta por tu servicio en tu zona'),
  ];
  const sinGeo = tCmp('antes', 'SIN TRABAJO DE GEO');

  const fondo: Punto[] = [];
  if (tPro.visible()) {
    fondo.push({
      titulo: tPro('titulo', 'El buscador dejó de ser la primera parada'),
      texto: tPro('texto', 'Cada vez más gente le pregunta directamente a un asistente en vez de abrir diez pestañas. La IA responde en una sola frase y nombra dos o tres opciones. Si tu negocio no está entre ellas, no perdiste una posición: no apareciste en la conversación. Y a diferencia del buscador, aquí no hay una segunda página donde te puedan encontrar.'),
    });
  }
  if (tLoc.visible()) {
    fondo.push({
      titulo: tLoc('titulo', 'Posicionamiento GEO en Aguascalientes'),
      texto: tLoc('texto', 'Somos una agencia de marketing digital con base en Aguascalientes, y trabajamos el posicionamiento en inteligencia artificial para negocios de la ciudad y del Bajío. Conocer el mercado local importa: cuando alguien pregunta por un servicio en Aguascalientes, las respuestas se arman con fuentes de aquí, y saber cuáles son es la mitad del trabajo.'),
    });
  }

  /* ---------- MOTORES (solo esta página) ----------
     Va justo después de la portada, igual que el catálogo en la de
     espectaculares: es lo que dice de un vistazo dónde se trabaja. Con su
     logotipo cada uno, que un nombre suelto se lee como texto genérico. */
  const bloqueMotores = tMot.visible() ? (
    <section className="px-4 pb-16 md:pb-24">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 {...entra()} className="heading mb-3 text-3xl md:text-5xl">
          {tMot('titulo_1', 'DÓNDE')} <span className="text-[#CC66FF]">{tMot('titulo_2', 'TE BUSCAMOS')}</span>
        </motion.h2>
        <motion.p {...entra(0.06)} className="mb-10 max-w-2xl text-white/60">
          {tMot('bajada', 'Revisamos los seis asistentes que de verdad usan tus clientes en México, no una lista larga para impresionar.')}
        </motion.p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {motores.map((m, i) => {
            const marca = marcaPorNombre(m.n + ' ' + m.d);
            return (
              <motion.div key={m.n} {...entra(Math.min(i * 0.06, 0.3))}>
                <div
                  className="h-full rounded-2xl border border-white/10 p-5 text-center transition-colors duration-300 hover:border-[#CC66FF]/40"
                  style={{ background: 'rgba(255,255,255,.035)' }}
                >
                  {marca && (
                    <div className="mb-3 flex h-7 items-center justify-center">
                      <LogoIA marca={marca} alto={26} />
                    </div>
                  )}
                  <div className="heading text-base text-white md:text-lg">{m.n}</div>
                  <div className="mt-1 text-[11px] text-white/50 md:text-xs">{m.d}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  ) : null;

  /* El nombre en frase, para WhatsApp y el asistente. */
  const nombre = contenido('marca', 'menu_ia')('geo', 'Posicionamiento en IA');

  return (
    <>
      <DynamicSEO
        title={t('seo_titulo', 'Posicionamiento en IA (GEO) en Aguascalientes')}
        description={t('seo_desc', 'Logramos que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen bien a tu negocio. Diagnóstico gratuito en Aguascalientes.')}
      />

      <FichaServicio
        ficha={{
          slug: 'posicionamiento-en-ia',
          titulo: t('etiqueta', 'POSICIONAMIENTO GEO'),
          categoria: tEnc('categoria_ia', 'IA'),
          bajada: t('bajada', 'Cuando alguien le pregunta a una inteligencia artificial por un servicio como el tuyo en Aguascalientes, la respuesta menciona a unos cuantos negocios. Nuestro trabajo es que estés en esa lista, con tus datos correctos y sin que te confundan con nadie.'),
          definicion: t('definicion', DEFINICION),
          volver: { a: '/servicios-ia', texto: tEnc('volver_ia', 'Volver a Servicios IA') },
          incluye: tSrv.visible() ? entregables : [],
          beneficios: tCmp.visible()
            ? despues.map((d, i) => ({ titulo: d, texto: antes[i], nota: sinGeo })).filter((b) => b.titulo)
            : [],
          beneficiosBajada: tCmp.visible()
            ? tCmp('nota', 'Ejemplos de lo que encontramos con más frecuencia. Lo tuyo lo vemos en el diagnóstico.')
            : undefined,
          proceso: tPas.visible() ? pasos.filter((p) => p.title) : [],
          ideal: [],
          fondo,
          faq: tFaq.visible() ? faq : [],
          nombre,
          contextoCotizar: 'un diagnóstico de posicionamiento en IA',
          boton: t('boton_1', 'DIAGNÓSTICO GRATUITO'),
          cierre: {
            titulo: `${tCie('titulo_1', '¿EMPEZAMOS POR VER')} ${tCie('titulo_2', 'DÓNDE ESTÁS?')}`,
            texto: tCie('texto', 'El diagnóstico no cuesta y te lo entregamos aunque decidas no contratarnos.'),
            boton: tCie('boton', 'QUIERO MI DIAGNÓSTICO'),
          },
          trasPortada: bloqueMotores,
        }}
      />
    </>
  );
}
