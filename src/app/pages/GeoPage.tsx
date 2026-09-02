import { motion } from 'motion/react';
import { LogoIA, marcaPorNombre } from '../components/LogosIA';
import { Link } from 'react-router';
import {
  ArrowRight, Check, X, Search, FileCode2, Quote, RefreshCw,
  BarChart3, MapPin, Sparkles, AlertTriangle, ShieldCheck,
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import DynamicSEO from '../components/DynamicSEO';
import { useApp } from '../context/AppContext';
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
 * Por eso está escrita en preguntas y respuestas concretas, dice quiénes
 * somos y dónde estamos sin rodeos, y el servidor entrega su contenido en
 * HTML plano para los rastreadores que no ejecutan JavaScript (render.php).
 *
 * Sobre el tono: se promete lo que sí se entrega. No se puede reentrenar un
 * modelo desde fuera, y decirlo sería vender humo que cualquier prospecto
 * técnico desarma en una llamada. Sí se puede influir en lo que citan, y eso
 * es lo que dice la página.
 */

const aparece = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function GeoPage() {
  const { openAssistant } = useApp();

  const t = contenido('posicionamiento-ia', 'portada');
  const tPro = contenido('posicionamiento-ia', 'problema');
  const tMot = contenido('posicionamiento-ia', 'motores');
  const tCmp = contenido('posicionamiento-ia', 'comparacion');
  const tSrv = contenido('posicionamiento-ia', 'servicio');
  const tPas = contenido('posicionamiento-ia', 'proceso');
  const tDia = contenido('posicionamiento-ia', 'diagnostico');
  const tFaq = contenido('posicionamiento-ia', 'preguntas');
  const tLoc = contenido('posicionamiento-ia', 'local');
  const tCie = contenido('posicionamiento-ia', 'cierre');

  const cotizar = (ctx: string) => openAssistant('Posicionamiento en IA (GEO)', ctx);

  const motores = [
    { n: tMot('m1', 'ChatGPT'), d: tMot('m1_d', 'OpenAI') },
    { n: tMot('m2', 'Google Gemini'), d: tMot('m2_d', 'Google') },
    { n: tMot('m3', 'AI Overviews'), d: tMot('m3_d', 'Resúmenes de Google') },
    { n: tMot('m4', 'Perplexity'), d: tMot('m4_d', 'Búsqueda con fuentes') },
    { n: tMot('m5', 'Claude'), d: tMot('m5_d', 'Anthropic') },
    { n: tMot('m6', 'Copilot'), d: tMot('m6_d', 'Microsoft y Bing') },
  ];

  const entregables = [
    {
      Icono: Search,
      t: tSrv('s1_t', 'Diagnóstico de lo que dicen hoy'),
      d: tSrv('s1_d', 'Le preguntamos a cada motor por tu marca, tu giro y tus competidores, y te entregamos las respuestas tal cual salen. Casi siempre hay sorpresas.'),
    },
    {
      Icono: FileCode2,
      t: tSrv('s2_t', 'Datos estructurados en tu sitio'),
      d: tSrv('s2_d', 'Marcado Schema.org bien puesto: quién eres, dónde estás, qué vendes y cómo contactarte. Es la forma en que un rastreador entiende tu negocio sin adivinar.'),
    },
    {
      Icono: Quote,
      t: tSrv('s3_t', 'Contenido que se puede citar'),
      d: tSrv('s3_d', 'Preguntas reales con respuestas claras y verificables. Un modelo cita lo que puede extraer sin interpretar; escribimos pensando en eso.'),
    },
    {
      Icono: RefreshCw,
      t: tSrv('s4_t', 'Consistencia en tus fuentes'),
      d: tSrv('s4_d', 'Mismo nombre, misma dirección, mismo teléfono y mismo giro en tu ficha de Google, directorios, reseñas y redes. Las contradicciones son lo que más te cuesta.'),
    },
    {
      Icono: ShieldCheck,
      t: tSrv('s5_t', 'Corrección de datos viejos'),
      d: tSrv('s5_d', 'Rastreamos de dónde salen los datos desactualizados que aparecen sobre ti y trabajamos en la fuente, que es el único lugar donde se arreglan de verdad.'),
    },
    {
      Icono: BarChart3,
      t: tSrv('s6_t', 'Medición mes con mes'),
      d: tSrv('s6_d', 'Un reporte que se entiende: en qué preguntas apareces, en cuáles no, qué cambió y qué sigue. Sin métricas inventadas.'),
    },
  ];

  const pasos = [
    { n: '01', t: tPas('p1_t', 'Escuchamos'), d: tPas('p1_d', 'Corremos las preguntas que haría un cliente tuyo en los seis motores y guardamos las respuestas como punto de partida.') },
    { n: '02', t: tPas('p2_t', 'Ordenamos'), d: tPas('p2_d', 'Dejamos tu sitio legible para las IAs: datos estructurados, fichas de entidad y acceso limpio para sus rastreadores.') },
    { n: '03', t: tPas('p3_t', 'Publicamos'), d: tPas('p3_d', 'Creamos el contenido que faltaba para responder esas preguntas mejor que nadie en tu zona.') },
    { n: '04', t: tPas('p4_t', 'Medimos'), d: tPas('p4_d', 'Volvemos a preguntar cada mes, comparamos contra el punto de partida y ajustamos lo que no movió.') },
  ];

  const faq = [
    {
      q: tFaq('q1', '¿Qué es el posicionamiento GEO?'),
      a: tFaq('r1', 'GEO significa Generative Engine Optimization: el trabajo de lograr que los asistentes de inteligencia artificial encuentren, entiendan y citen correctamente a tu negocio cuando alguien les pregunta. Es el equivalente al SEO, pero para ChatGPT, Gemini, Perplexity y los resúmenes de Google en vez de la lista de resultados azules.'),
    },
    {
      q: tFaq('q2', '¿En qué se diferencia del SEO de toda la vida?'),
      a: tFaq('r2', 'El SEO busca que tu página aparezca en una lista y que la persona haga clic. El GEO busca que la IA use tu información al redactar su respuesta, aunque nadie entre a tu sitio. Comparten mucha base técnica, pero cambia lo que se optimiza: en GEO importa más que tus datos sean verificables, consistentes y fáciles de extraer que la posición en un ranking.'),
    },
    {
      q: tFaq('q3', '¿Se puede modificar lo que ChatGPT dice de mi empresa?'),
      a: tFaq('r3', 'No directamente: nadie puede reentrenar un modelo desde fuera, y quien te prometa eso te está vendiendo algo que no existe. Lo que sí se puede es cambiar la materia prima con la que responde. Estos asistentes consultan la web en tiempo real y se apoyan en fuentes verificables, así que ordenar esas fuentes, corregir los datos viejos y publicar información citable sí cambia sus respuestas.'),
    },
    {
      q: tFaq('q4', '¿Cuánto tarda en verse un cambio?'),
      a: tFaq('r4', 'Lo que depende de tu sitio, como los datos estructurados, se refleja en días. Lo que depende de fuentes externas, como directorios y reseñas, toma más: entre uno y tres meses según qué tan regada esté la información. Te lo medimos cada mes para que no sea cuestión de fe.'),
    },
    {
      q: tFaq('q5', '¿Sirve para un negocio local de Aguascalientes?'),
      a: tFaq('r5', 'Sirve especialmente. Cuando alguien pregunta por un servicio en una ciudad concreta, los asistentes se apoyan mucho en señales locales: la ficha de Google, las reseñas, los directorios de la zona y la coherencia entre todos. Un negocio local bien ordenado compite muy bien en esas respuestas, incluso contra marcas más grandes.'),
    },
    {
      q: tFaq('q6', '¿Necesito rehacer mi sitio web?'),
      a: tFaq('r6', 'Casi nunca. Buena parte del trabajo se hace sobre lo que ya tienes. Si tu sitio no se puede editar o los rastreadores no lo pueden leer, te lo decimos en el diagnóstico y lo tratamos aparte, sin meterlo en el mismo paquete.'),
    },
    {
      q: tFaq('q7', '¿Cuánto cuesta?'),
      a: tFaq('r7', 'Depende del tamaño de tu marca y de qué tan dispersa esté hoy tu información, así que se cotiza después del diagnóstico. El diagnóstico no tiene costo y no compromete a nada.'),
    },
  ];

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

  return (
    <>
      <DynamicSEO
        title={t('seo_titulo', 'Posicionamiento en IA (GEO) en Aguascalientes | INÉDITO DIGITAL')}
        description={t('seo_desc', 'Logramos que ChatGPT, Gemini, Perplexity y los resúmenes de Google encuentren, entiendan y citen bien a tu negocio. Diagnóstico gratuito en Aguascalientes.')}
      />

      {/* ---------------- portada ---------------- */}
      <section className="relative overflow-hidden bg-[#0D0010] px-4 pt-14 pb-16 md:pt-20 md:pb-24">
        <TopographyCanvas />
        <div
          className="pointer-events-none absolute -top-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[#7700CE]/30 blur-[130px]"
          aria-hidden
        />

        <div className="container relative z-10 mx-auto max-w-5xl text-center">
          <motion.div {...aparece}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7700CE]/40 bg-[#7700CE]/15 px-4 py-2 text-xs tracking-[0.18em] text-white/85">
              <Sparkles size={14} className="text-[#CC66FF]" />
              {t('etiqueta', 'POSICIONAMIENTO GEO')}
            </span>

            <h1 className="heading mb-6 text-3xl leading-[1.05] md:text-5xl lg:text-6xl">
              {t('titulo_1', 'Tus clientes ya no buscan.')}
              <br />
              <span className="bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent">
                {t('titulo_2', 'Preguntan.')}
              </span>
            </h1>

            <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              {t('bajada', 'Cuando alguien le pregunta a una inteligencia artificial por un servicio como el tuyo en Aguascalientes, la respuesta menciona a unos cuantos negocios. Nuestro trabajo es que estés en esa lista, con tus datos correctos y sin que te confundan con nadie.')}
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => cotizar('un diagnóstico de posicionamiento en IA')}
                className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-8 py-4 text-white shadow-[0_0_35px_rgba(119,0,206,0.45)] transition-all hover:shadow-[0_0_55px_rgba(119,0,206,0.7)] sm:w-auto"
              >
                <span className="heading text-sm tracking-[0.08em]">{t('boton_1', 'DIAGNÓSTICO GRATUITO')}</span>
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#como-funciona"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                <span className="heading text-sm tracking-[0.08em]">{t('boton_2', 'CÓMO FUNCIONA')}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- por qué ahora ---------------- */}
      {tPro.visible() && (
        <section className="bg-white px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div {...aparece}>
              <h2 className="heading mb-5 text-2xl leading-tight text-black md:text-4xl">
                {tPro('titulo', 'El buscador dejó de ser la primera parada')}
              </h2>
              <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
                {tPro('texto', 'Cada vez más gente le pregunta directamente a un asistente en vez de abrir diez pestañas. La IA responde en una sola frase y nombra dos o tres opciones. Si tu negocio no está entre ellas, no perdiste una posición: no apareciste en la conversación. Y a diferencia del buscador, aquí no hay una segunda página donde te puedan encontrar.')}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ---------------- motores ---------------- */}
      {tMot.visible() && (
        <section className="bg-[#0D0010] px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <motion.div {...aparece} className="mb-10 text-center">
              <h2 className="heading mb-3 text-2xl md:text-4xl">
                {tMot('titulo_1', 'DÓNDE')} <span className="text-[#7700CE]">{tMot('titulo_2', 'TE BUSCAMOS')}</span>
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-white/60 md:text-base">
                {tMot('bajada', 'Revisamos los seis asistentes que de verdad usan tus clientes en México, no una lista larga para impresionar.')}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {motores.map((m, i) => (
                <motion.div key={m.n} {...aparece} transition={{ ...aparece.transition, delay: i * 0.06 }}>
                  <GlassCard className="h-full text-center">
                    {(() => {
                      const marca = marcaPorNombre(m.n + ' ' + m.d);
                      return marca ? (
                        <div className="mb-3 flex h-7 items-center justify-center">
                          <LogoIA marca={marca} alto={26} />
                        </div>
                      ) : null;
                    })()}
                    <div className="heading text-base text-white md:text-lg">{m.n}</div>
                    <div className="mt-1 text-[11px] text-white/50 md:text-xs">{m.d}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- antes y después ---------------- */}
      {tCmp.visible() && (
        <section className="bg-[#07060B] px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <motion.div {...aparece} className="mb-10 text-center">
              <h2 className="heading mb-3 text-2xl md:text-4xl">
                {tCmp('titulo_1', 'LO QUE CAMBIA')} <span className="text-[#7700CE]">{tCmp('titulo_2', 'EN LA RESPUESTA')}</span>
              </h2>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <motion.div {...aparece}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:rounded-3xl">
                  <div className="mb-5 flex items-center gap-2.5 text-white/50">
                    <AlertTriangle size={18} />
                    <span className="heading text-sm">{tCmp('antes', 'SIN TRABAJO DE GEO')}</span>
                  </div>
                  <ul className="space-y-3.5">
                    {antes.map((x) => (
                      <li key={x} className="flex gap-3 text-sm leading-relaxed text-white/60">
                        <X size={17} className="mt-0.5 shrink-0 text-white/30" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div {...aparece} transition={{ ...aparece.transition, delay: 0.1 }}>
                <div className="h-full rounded-2xl border border-[#7700CE]/40 bg-gradient-to-br from-[#7700CE]/15 to-[#9933FF]/5 p-6 shadow-[0_0_40px_rgba(119,0,206,0.18)] md:rounded-3xl">
                  <div className="mb-5 flex items-center gap-2.5 text-[#CC66FF]">
                    <ShieldCheck size={18} />
                    <span className="heading text-sm">{tCmp('despues', 'CON INÉDITO')}</span>
                  </div>
                  <ul className="space-y-3.5">
                    {despues.map((x) => (
                      <li key={x} className="flex gap-3 text-sm leading-relaxed text-white/85">
                        <Check size={17} className="mt-0.5 shrink-0 text-[#CC66FF]" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            <p className="mt-6 text-center text-xs text-white/35">
              {tCmp('nota', 'Ejemplos de lo que encontramos con más frecuencia. Lo tuyo lo vemos en el diagnóstico.')}
            </p>
          </div>
        </section>
      )}

      {/* ---------------- qué hacemos ---------------- */}
      {tSrv.visible() && (
        <section id="como-funciona" className="bg-[#0D0010] px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <motion.div {...aparece} className="mb-11 text-center">
              <h2 className="heading mb-3 text-2xl md:text-4xl">
                {tSrv('titulo_1', 'QUÉ')} <span className="text-[#7700CE]">{tSrv('titulo_2', 'HACEMOS')}</span>
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-white/60 md:text-base">
                {tSrv('bajada', 'Seis frentes concretos. Todos se pueden revisar y medir.')}
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entregables.map(({ Icono, t: tt, d }, i) => (
                <motion.div key={tt} {...aparece} transition={{ ...aparece.transition, delay: i * 0.05 }}>
                  <GlassCard className="h-full" hover>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7700CE]/20">
                      <Icono size={21} className="text-[#CC66FF]" />
                    </div>
                    <h3 className="heading mb-2 text-base text-white md:text-lg">{tt}</h3>
                    <p className="text-sm leading-relaxed text-white/60">{d}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- cómo trabajamos ---------------- */}
      {tPas.visible() && (
        <section className="bg-white px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <motion.div {...aparece} className="mb-10 text-center">
              <h2 className="heading mb-3 text-2xl text-black md:text-4xl">
                {tPas('titulo_1', 'CÓMO')} <span className="text-[#7700CE]">{tPas('titulo_2', 'TRABAJAMOS')}</span>
              </h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-4">
              {pasos.map((p, i) => (
                <motion.div key={p.n} {...aparece} transition={{ ...aparece.transition, delay: i * 0.07 }}>
                  <div className="heading mb-2 text-3xl text-[#7700CE]">{p.n}</div>
                  <h3 className="heading mb-2 text-base text-black">{p.t}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{p.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- diagnóstico ---------------- */}
      {tDia.visible() && (
        <section className="relative overflow-hidden bg-[#0D0010] px-4 py-16 md:py-20">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7700CE]/25 blur-[120px]"
            aria-hidden
          />
          <div className="container relative z-10 mx-auto max-w-3xl text-center">
            <motion.div {...aparece}>
              <span className="mb-4 inline-block text-xs tracking-[0.25em] text-[#CC66FF]">
                {tDia('etiqueta', 'SIN COSTO')}
              </span>
              <h2 className="heading mb-4 text-2xl leading-tight md:text-4xl">
                {tDia('titulo', '¿Qué dicen las IAs de tu negocio hoy?')}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                {tDia('texto', 'Le preguntamos por ti a los seis asistentes y te mandamos las respuestas tal cual salen, junto con lo que habría que corregir. Sin compromiso y sin letra chica: si con eso te arreglas solo, qué bueno.')}
              </p>
              <button
                onClick={() => cotizar('mi diagnóstico gratuito de posicionamiento en IA')}
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-8 py-4 text-white shadow-[0_0_35px_rgba(119,0,206,0.45)] transition-all hover:shadow-[0_0_55px_rgba(119,0,206,0.7)]"
              >
                <span className="heading text-sm tracking-[0.08em]">{tDia('boton', 'PEDIR MI DIAGNÓSTICO')}</span>
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ---------------- preguntas ---------------- */}
      {tFaq.visible() && (
        <section className="bg-[#07060B] px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-3xl">
            <motion.div {...aparece} className="mb-10 text-center">
              <h2 className="heading mb-3 text-2xl md:text-4xl">
                {tFaq('titulo_1', 'PREGUNTAS')} <span className="text-[#7700CE]">{tFaq('titulo_2', 'FRECUENTES')}</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faq.map((f, i) => (
                <motion.div key={f.q} {...aparece} transition={{ ...aparece.transition, delay: i * 0.04 }}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                    <h3 className="mb-2.5 text-base font-semibold leading-snug text-white">{f.q}</h3>
                    <p className="text-sm leading-relaxed text-white/65">{f.a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Aguascalientes ---------------- */}
      {tLoc.visible() && (
        <section className="bg-[#0D0010] px-4 py-16 md:py-20">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...aparece}>
              <GlassCard variant="purple" className="text-center">
                <MapPin size={26} className="mx-auto mb-4 text-[#CC66FF]" />
                <h2 className="heading mb-4 text-xl leading-tight md:text-3xl">
                  {tLoc('titulo', 'Posicionamiento GEO en Aguascalientes')}
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                  {tLoc('texto', 'Somos una agencia de marketing digital con base en Aguascalientes, y trabajamos el posicionamiento en inteligencia artificial para negocios de la ciudad y del Bajío. Conocer el mercado local importa: cuando alguien pregunta por un servicio en Aguascalientes, las respuestas se arman con fuentes de aquí, y saber cuáles son es la mitad del trabajo.')}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link
                    to={tLoc('enlace_1_url', '/servicios')}
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80 transition-colors hover:border-[#7700CE] hover:text-white"
                  >
                    {tLoc('enlace_1', 'Todos nuestros servicios')}
                  </Link>
                  <Link
                    to={tLoc('enlace_2_url', '/servicios-ia')}
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80 transition-colors hover:border-[#7700CE] hover:text-white"
                  >
                    {tLoc('enlace_2', 'Soluciones de IA')}
                  </Link>
                  <Link
                    to={tLoc('enlace_3_url', '/contacto')}
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80 transition-colors hover:border-[#7700CE] hover:text-white"
                  >
                    {tLoc('enlace_3', 'Hablar con nosotros')}
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* ---------------- cierre ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7700CE] to-[#4A0080] px-4 py-16 md:py-24">
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <motion.div {...aparece}>
            <h2 className="heading mb-5 text-2xl leading-tight md:text-4xl">
              {tCie('titulo_1', '¿EMPEZAMOS POR VER')}{' '}
              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                {tCie('titulo_2', 'DÓNDE ESTÁS?')}
              </span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              {tCie('texto', 'El diagnóstico no cuesta y te lo entregamos aunque decidas no contratarnos.')}
            </p>
            <button
              onClick={() => cotizar('posicionamiento en IA para mi negocio')}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[#7700CE] transition-transform hover:scale-105"
            >
              <span className="heading text-sm tracking-[0.08em]">{tCie('boton', 'QUIERO MI DIAGNÓSTICO')}</span>
              <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
