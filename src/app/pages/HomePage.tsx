import { motion } from 'motion/react';
import { ArrowRight, Check, CheckCircle, Sparkles, TrendingUp, Target, Bot, MessageCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import HeroBento from '../components/HeroBento';
import EsferaIA from '../components/EsferaIA';
import { LogoIA } from '../components/LogosIA';
import DynamicSEO from '../components/DynamicSEO';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

const ProcesoCiclo = lazy(() => import('../components/ProcesoCiclo'));

/* Los adornos que la portada repite en varias secciones, en un solo lugar. */

/** La retícula de puntos con su máscara radial. */
function Reticula({ foco = '60% 45%' }: { foco?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[.12]"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,.65) 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        maskImage: `radial-gradient(70% 80% at ${foco}, black, transparent)`,
        WebkitMaskImage: `radial-gradient(70% 80% at ${foco}, black, transparent)`,
      }}
    />
  );
}

/** El kicker de la casa: línea corta y rótulo en mono. */
function Kicker({ children, centrado = false }: { children: ReactNode; centrado?: boolean }) {
  return (
    <span className={`mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-[#AA66FF] ${centrado ? 'justify-center' : ''}`}>
      <span aria-hidden className="h-px w-8 bg-[#AA66FF]/60" />
      {children}
      {centrado && <span aria-hidden className="h-px w-8 bg-[#AA66FF]/60" />}
    </span>
  );
}

/**
 * Monta a sus hijos hasta que el lector se acerca.
 *
 * El chunk de la escena ni siquiera se descarga si nadie baja hasta ahi:
 * es la condicion de "sin sacrificar rendimiento del index".
 */
function Diferido({ children, alto }: { children: ReactNode; alto: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ojo = new IntersectionObserver(
      (es, o) => {
        if (es.some((e) => e.isIntersecting)) {
          setListo(true);
          o.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    ojo.observe(el);
    /* Respaldo: si el observador no dispara —hay contextos donde no corre—,
       el chunk (5.6 KB) se trae solo unos segundos después de cargar. La
       sección nunca se queda hueca. */
    const respaldo = window.setTimeout(() => setListo(true), 4000);
    return () => {
      ojo.disconnect();
      window.clearTimeout(respaldo);
    };
  }, []);
  return <div ref={ref}>{listo ? children : <div style={{ minHeight: alto }} />}</div>;
}

export default function HomePage() {
  const { services, portfolioItems, blogPosts, settings, openAssistant } = useApp();
  /* Lo que la persona escribe en el buscador que conversa. */
  const [busqueda, setBusqueda] = useState('');
  /* Textos editables desde el panel. El segundo argumento de cada llamada es
     lo que hay hoy: si el campo se vacía, se usa eso y la página no se rompe. */
  const tTrans  = contenido('home', 'transformacion');
  const tServ   = contenido('home', 'servicios');
  const tIA     = contenido('home', 'ia');
  const tProc   = contenido('home', 'proceso');
  const tCasos  = contenido('home', 'casos');
  const tCierre = contenido('home', 'cierre');
  const tTarIA  = contenido('home', 'tarjetas_ia');
  const tVal    = contenido('home', 'valores');
  const tEnf    = contenido('home', 'enfoque');
  const tCin    = contenido('home', 'cinta');
  const tNiv    = contenido('home', 'niveles');
  const tTab    = contenido('home', 'tablero');

  const process = [
    { step: '01', title: tProc('paso_1_titulo', 'OBJETIVOS'), description: tProc('paso_1_texto', 'Dirección define qué quiere lograr y en qué plazo') },
    { step: '02', title: tProc('paso_2_titulo', 'CONECTAR'),  description: tProc('paso_2_texto', 'Tu presencia, tus campañas y tus ventas quedan en un solo tablero') },
    { step: '03', title: tProc('paso_3_titulo', 'AUDITAR'),   description: tProc('paso_3_texto', 'Cada mes una IA revisa el desempeño contra esos objetivos') },
    { step: '04', title: tProc('paso_4_titulo', 'AJUSTAR'),   description: tProc('paso_4_texto', 'Se corrige con lo que dice el dato, no con la corazonada') }
  ];


  /* La vitrina cuenta la nueva dirección: estos nueve van primero y en este
     orden; cualquier otro servicio conserva su orden del panel detrás. Las
     fichas, el menú y /servicios no cambian. */
  const DESTACADOS = [
    'auditoria-con-ia',
    'tablero-de-resultados',
    'chatgpt-ads',
    'estrategia-de-canales',
    'linkedin-de-empresa',
    'google-ads',
    'diseno-y-desarrollo-web',
    'chatbots-y-agentes',
    'posicionamiento-organico',
  ];
  const vitrina = [...services].sort((a, b) => {
    const ia = DESTACADOS.indexOf(a.slug);
    const ib = DESTACADOS.indexOf(b.slug);
    return (ia === -1 ? DESTACADOS.length : ia) - (ib === -1 ? DESTACADOS.length : ib);
  });

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hola, quiero información sobre sus servicios de marketing digital')}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp',
    '@id': 'https://www.inedito.digital',
    url: 'https://www.inedito.digital',
    telephone: settings.businessPhone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.businessAddress,
      addressLocality: settings.businessCity,
      addressRegion: settings.businessState,
      postalCode: settings.businessZip,
      addressCountry: 'MX'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.8853,
      longitude: -102.2916
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    /* Solo perfiles comprobados: un sameAs que lleva a un 404 le dice a un
       buscador que no sabemos quiénes somos. El resto se declara desde el
       panel (SEO → Redes sociales) en cuanto se confirmen las direcciones. */
    sameAs: [
      'https://www.facebook.com/ineditoagenciadigital',
      'https://www.instagram.com/ineditodigital/',
      'https://www.linkedin.com/company/inedito-digital/',
      'https://maps.app.goo.gl/BTCS2Ma71gFEfixW7'
    ],
    areaServed: [
      { '@type': 'State', name: 'Aguascalientes' },
      { '@type': 'Country', name: 'México' }
    ]
  };

  return (
    <>
      <DynamicSEO
        title="Agencia de Marketing Digital en Aguascalientes que impulsa tus ventas con IA"
        description="Agencia de marketing digital en Aguascalientes. Conectamos tus campañas con tus ventas reales y cada mes una IA audita si la estrategia está funcionando."
        keywords={[
          'agencia de marketing digital en aguascalientes',
          'marketing digital aguascalientes',
          'seo aguascalientes',
          'google ads aguascalientes',
          'chatbots ia',
          'desarrollo web aguascalientes'
        ]}
        schema={schema}
      />

      {/* Hero Section - Bento Grid Style */}
      <HeroBento />

      {/* La cinta de posicionamiento: la postura, corriendo en bucle */}
      {tCin.visible() && (
        <div aria-hidden className="relative overflow-hidden border-y border-white/8 bg-black/40 py-3">
          <div className="animate-cinta flex w-max items-center whitespace-nowrap">
            {[0, 1].map((vuelta) => (
              <span key={vuelta} className="flex items-center">
                {[
                  tCin('f1', 'Estrategia dirigida por objetivos'),
                  tCin('f2', 'Medimos hasta la venta'),
                  tCin('f3', 'Formalidad y confianza'),
                  tCin('f4', 'Visibilidad completa, también ante la IA'),
                ].map((f) => (
                  <span key={f} className="heading mx-5 flex items-center gap-5 text-sm text-white/50 md:mx-6 md:text-base">
                    {f} <span aria-hidden className="text-[#AA66FF]">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ---- El problema ----
           Antes era la franja blanca de "transformación digital" con fotos de
           stock. Ahora es el interludio que plantea el problema que la banda
           de abajo resuelve: se invierte en digital sin saber qué regresa. */}
      {tTrans.visible() && (
        <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-14%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.30), transparent 70%)' }}
          />
          <Reticula foco="50% 40%" />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="container relative mx-auto max-w-4xl text-center"
          >
            <Kicker centrado>{tTrans('etiqueta', 'EL PUNTO DE PARTIDA')}</Kicker>
            <h2 className="heading mb-6 text-3xl leading-[1.06] [text-wrap:balance] md:text-6xl">
              {tTrans('postura_1', 'EL MARKETING QUE NO SE MIDE')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
              >
                {tTrans('postura_2', 'ES UN GASTO')}
              </span>
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-[15.5px] leading-relaxed text-white/75 md:text-lg">
              {tTrans('texto', 'Página, redes, campañas: muchas empresas ya invierten en digital sin poder decir qué les regresa cada peso. La transformación digital de verdad empieza cuando todo lo que haces se mide contra ventas.')}
            </p>

            {/* las tres negativas, como sellos */}
            <div className="mb-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
              {[1, 2, 3].map((i) => (
                <span key={i} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.16em] text-white/55 md:text-[12px]">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-[#AA66FF]" />
                  {tTrans(`s${i}`, ['Sin reportes maquillados', 'Sin promesas de humo', 'Sin gastar por gastar'][i - 1])}
                </span>
              ))}
            </div>

            <a
              href="#enfoque"
              className="group inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[.2em] text-[#CC66FF] transition-colors hover:text-white"
            >
              {tTrans('enlace', 'ASÍ LO RESOLVEMOS')}
              <ArrowRight size={14} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </section>
      )}

      {/* ---- Banda del nuevo enfoque ----
           No toca el titular ni nada de lo que ya posiciona. Su trabajo es de
           rastreo: la portada es la unica pagina que Google visita siempre, y
           un enlace desde aqui es la via mas rapida para que descubra lo nuevo. */}
      {tEnf.visible() && (
        <section id="enfoque" className="relative scroll-mt-16 overflow-hidden border-y border-[#AA66FF]/15 bg-[#0D0010] px-4 py-16 md:px-6 md:py-24 lg:px-8">
          {/* la seccion ES la banda: la reticula, la aurora y el filo van a
              todo lo ancho, sin panel de por medio */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[.12]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,.65) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
              maskImage: 'radial-gradient(70% 80% at 60% 45%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(70% 80% at 60% 45%, black, transparent)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/2 h-[720px] w-[720px] -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.38), transparent 70%)' }}
          />
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #9933FF, transparent)' }}
          />

          <div className="container relative mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
            >
              {/* ---- el texto y el índice ---- */}
              <div>
                <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-[#AA66FF]">
                  <span aria-hidden className="h-px w-8 bg-[#AA66FF]/60" />
                  {tEnf('etiqueta', 'NUESTRO ENFOQUE')}
                </span>
                <h2 className="heading mb-5 text-3xl leading-[1.05] [text-wrap:balance] md:text-5xl">
                  {tEnf('titulo_1', 'NO ES UNA PROMESA,')}{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                  >
                    {tEnf('titulo_2', 'ES UN SISTEMA')}
                  </span>
                </h2>
                <p className="mb-8 max-w-2xl text-[15.5px] leading-relaxed text-white/75 md:text-base">
                  {tEnf('texto', 'Somos una agencia de marketing digital y de inteligencia artificial, y nuestra forma de trabajar es un sistema: dirección pone el objetivo, todo lo que tu negocio hace en digital queda conectado, y una IA lo revisa cada mes contra ese objetivo. Casi nadie en Aguascalientes trabaja así.')}
                </p>

                {/* el puente: estas filas SON el enfoque del título */}
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[.2em] text-white/45">
                  {tEnf('indice_titulo', 'Las cuatro piezas del sistema')}
                </div>
                <div className="border-t border-white/10">
                  {[1, 2, 3, 4].map((i) => {
                    const url = tEnf(`e${i}_url`, '');
                    if (!url) return null;
                    return (
                      <Link
                        key={i}
                        to={url}
                        className="group relative flex items-center gap-4 border-b border-white/10 py-4 pl-1 pr-2 transition-colors duration-300 hover:border-[#AA66FF]/40 md:gap-6"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-[#7700CE]/25 to-transparent transition-all duration-300 group-hover:w-full"
                        />
                        {/* min-w y no un ancho fijo: con bg-clip-text el
                            degradado solo pinta dentro de la caja y un ancho
                            corto dejaba los dígitos cortados a la mitad */}
                        <span
                          className="heading relative min-w-[3.4rem] shrink-0 bg-clip-text pr-1 text-2xl leading-none text-transparent md:min-w-[4rem] md:text-4xl"
                          style={{ backgroundImage: 'linear-gradient(120deg,#9933FF,#CC66FF)' }}
                        >
                          0{i}
                        </span>
                        <span className="relative min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-white transition-colors group-hover:text-[#DDBBFF] md:text-base">
                            {tEnf(`e${i}_titulo`, '')}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-white/55">
                            {tEnf(`e${i}_texto`, '')}
                          </span>
                        </span>
                        <ArrowRight
                          size={19}
                          className="relative shrink-0 text-[#AA66FF] transition-transform duration-300 group-hover:translate-x-1.5"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ---- la esfera con sus órbitas y las IAs como satélites ---- */}
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[560px]">
                  <div aria-hidden className="pointer-events-none absolute inset-[-6%]" style={{ transform: 'rotateX(68deg)' }}>
                    <div className="animate-orbita h-full w-full rounded-full border border-dashed border-[#AA66FF]/35" />
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-[-12%] rounded-full border border-white/[.07]"
                    style={{ transform: 'rotateX(68deg) rotateZ(24deg)' }}
                  />
                  <EsferaIA className="aspect-square w-full" />

                  {/* las IAs donde medimos presencia, orbitando la esfera */}
                  {([
                    ['openai', 'left-0 top-[8%] -translate-x-1/4', '0s'],
                    ['claude', 'right-0 top-[24%] translate-x-1/4', '1.1s'],
                    ['gemini', 'left-[2%] bottom-[16%]', '2s'],
                    ['perplexity', 'right-[4%] bottom-[4%]', '0.6s'],
                  ] as const).map(([marca, pos, retraso]) => (
                    <span
                      key={marca}
                      className={`animate-flotar absolute ${pos} flex items-center rounded-full border border-white/12 bg-black/55 px-4 py-2.5 shadow-[0_10px_30px_-8px_rgba(119,0,206,.5)] backdrop-blur md:px-5 md:py-3`}
                      style={{ animationDelay: retraso }}
                    >
                      <LogoIA marca={marca} alto={17} className="md:hidden" />
                      <LogoIA marca={marca} alto={21} className="hidden md:block" />
                    </span>
                  ))}
                </div>
                <span className="mt-2 font-mono text-[10.5px] uppercase tracking-[.18em] text-white/40">
                  {tEnf('logos_texto', 'Presencia medida en')}
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ============ Los tres niveles ============ */}
      {tNiv.visible() && (
        <section className="relative overflow-hidden px-4 py-14 md:px-6 md:py-20 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center"
            >
              <h2 className="heading mb-3 text-2xl md:text-4xl">
                {tNiv('titulo_1', 'EL SERVICIO SE ADAPTA')}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                >
                  {tNiv('titulo_2', 'A DÓNDE ESTÁS')}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-[15.5px] leading-relaxed text-white/70">
                {tNiv('bajada', 'No es el mismo trabajo para una empresa que no tiene nada que para una que ya invierte y quiere vender más. Estos son los tres puntos de partida.')}
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (i - 1) * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-6
                             transition-all duration-300 hover:-translate-y-1 hover:border-[#AA66FF]/40 hover:bg-white/[.06]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg,transparent,#9933FF,transparent)' }}
                  />
                  <div className="mb-3 flex items-end justify-between">
                    <span
                      className="heading text-[2.6rem] leading-none bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(120deg,#9933FF,#CC66FF)' }}
                    >
                      0{i}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">
                      Nivel {i}
                    </span>
                  </div>
                  <h3 className="heading mb-2 text-lg leading-tight">
                    {tNiv(`n${i}_titulo`, ['CONSTRUIR', 'MEJORAR', 'VENDER'][i - 1])}
                  </h3>
                  <p className="mb-4 text-[14.5px] leading-relaxed text-white/70">
                    {tNiv(`n${i}_texto`, [
                      'Para empresas sin presencia digital. Web veloz que pasa las mediciones de Google, con SEO, AEO y GEO desde el primer día, ficha de Google, LinkedIn y el tablero base.',
                      'Para empresas con web y redes mal trabajadas. Empieza con una auditoría que dice exactamente qué está mal, con la evidencia de cada hallazgo.',
                      'Para empresas que ya tienen todo. Estrategia de canales, campañas medidas en un solo tablero y —con ERP— el cruce de prospectos contra ventas cerradas.',
                    ][i - 1])}
                  </p>
                  <div className="rounded-xl bg-[#7700CE]/10 px-3.5 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#AA66FF]">Promesa</span>
                    <p className="mt-1 text-[13.5px] leading-snug text-white/85">
                      {tNiv(`n${i}_promesa`, [
                        'Cuando te busquen, existes y te ves formal.',
                        'Te decimos exactamente qué está mal y lo arreglamos.',
                        'Cada peso invertido se mide contra ventas reales.',
                      ][i - 1])}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/servicios"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold tracking-wider text-white transition-all duration-300 hover:border-[#AA66FF]/50 hover:bg-white/5"
              >
                {tNiv('boton', 'VER LOS SERVICIOS')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ El tablero ============ */}
      {tTab.visible() && (
        <section className="relative overflow-hidden border-y border-[#AA66FF]/12 bg-[#0D0010] px-4 py-14 md:px-6 md:py-20 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.25fr]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55 }}
              >
                <span className="mb-4 inline-block rounded-full bg-[#9933FF]/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[.18em] text-[#AA66FF]">
                  {tTab('etiqueta', 'Lo que recibes')}
                </span>
                <h2 className="heading mb-4 text-2xl leading-tight md:text-4xl">
                  {tTab('titulo_1', 'UN TABLERO,')}{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                  >
                    {tTab('titulo_2', 'NO UN REPORTE EN PDF')}
                  </span>
                </h2>
                <p className="mb-6 text-[15.5px] leading-relaxed text-white/75">
                  {tTab('texto', 'Cada cliente tiene una pantalla conectada a sus datos reales, con el costo por contacto de cada canal lado a lado. Cuando el sistema de la empresa lo permite, llega hasta la venta facturada.')}
                </p>
                <ul className="space-y-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={15} className="mt-1 shrink-0 text-[#AA66FF]" strokeWidth={2.6} />
                      <span className="text-[14.5px] leading-snug text-white/80">
                        {tTab(`p${i}`, [
                          'Cuántos contactos llegaron y a qué costo cada uno',
                          'De dónde llegan: buscador, campañas, redes y respuestas de IA',
                          'Dónde se cae la gente entre la visita y la venta',
                          'Una auditoría con IA cada mes contra los objetivos de dirección',
                        ][i - 1])}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-60 blur-2xl"
                  style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(119,0,206,.45), transparent 70%)' }}
                />
                <div className="relative overflow-hidden rounded-2xl border border-white/12 shadow-2xl">
                  <img
                    src="/tablero-vista.webp"
                    alt={tTab('imagen_alt', 'Tablero de resultados de Inédito Digital con contactos, costo por contacto, ventas y el embudo hasta la venta')}
                    width={1440}
                    height={930}
                    loading="lazy"
                    decoding="async"
                    className="w-full"
                  />
                </div>
                <p className="mt-3 text-center text-[12px] text-white/40">
                  {tTab('pie', 'Vista del tablero con datos de demostración')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ---- Los servicios, en el idioma nuevo de la casa ---- */}
      <section id="servicios" className="relative scroll-mt-16 overflow-hidden px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.22), transparent 70%)' }}
        />

        <div className="container relative mx-auto max-w-7xl">
          <div className="mb-8 text-center md:mb-10">
            <Kicker centrado>{tServ('etiqueta', 'LO QUE HACEMOS')}</Kicker>
            <h2 className="heading mb-4 text-2xl md:text-4xl">
              {tServ('titulo_1', 'NUESTROS')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
              >
                {tServ('titulo_2', 'SERVICIOS')}
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-[14.5px] leading-relaxed text-white/70 md:text-base">
              {tServ('bajada', 'Soluciones digitales que generan resultados reales y medibles')}
            </p>
          </div>

          {/* El buscador que conversa: escribes lo que necesitas y contesta
              el asistente, no una lista de resultados. */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              openAssistant(undefined, busqueda.trim() || 'ayúdame a elegir el servicio correcto para mi empresa');
            }}
            className="mx-auto mb-9 flex max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/[.05] p-1.5 pl-5 backdrop-blur transition-colors focus-within:border-[#AA66FF]/50"
          >
            <Sparkles size={16} className="shrink-0 text-[#CC66FF]" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={tServ('buscador', 'Escribe qué necesita tu empresa…')}
              aria-label="Cuéntale al asistente qué necesita tu empresa"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-5 py-2.5 text-xs font-bold tracking-wider text-white transition-transform hover:scale-[1.03]"
            >
              PREGUNTAR
            </button>
          </form>

          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {vitrina.slice(0, 9).map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link
                  to={`/servicios/${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-5
                             transition-all duration-300 hover:-translate-y-1 hover:border-[#AA66FF]/40 hover:bg-white/[.06] md:p-6"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg,transparent,#9933FF,transparent)' }}
                  />
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7700CE]/15 transition-colors group-hover:bg-[#7700CE]/30">
                      <Sparkles className="text-[#CC66FF]" size={18} />
                    </div>
                    <h3 className="heading flex-1 text-base leading-snug transition-colors group-hover:text-[#DDBBFF] md:text-lg">
                      {service.title}
                    </h3>
                  </div>
                  <p className="mb-4 flex-1 text-[13px] leading-relaxed text-white/60 md:text-sm">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#AA66FF] transition-all group-hover:gap-2 md:text-sm">
                    <span>{tServ('ver_mas', 'Ver más')}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center rounded-full bg-[#7700CE] px-6 py-3 text-white shadow-[0_0_30px_rgba(119,0,206,0.3)] transition-all hover:scale-105 hover:bg-[#9933FF] md:px-8 md:py-3.5"
            >
              <span className="heading text-sm tracking-[0.08em] md:text-base">{tServ('boton', 'VER TODOS LOS SERVICIOS')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Soluciones de IA: mismas cuatro cartas, idioma de la casa ---- */}
      {tIA.visible() && (
      <section className="relative overflow-hidden border-y border-[#AA66FF]/12 bg-[#0D0010] px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <Reticula foco="50% 25%" />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.28), transparent 70%)' }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #9933FF, transparent)' }}
        />

        <div className="container relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="mb-9 text-center md:mb-12"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7700CE]/40 bg-[#7700CE]/15 px-4 py-1.5 font-mono text-[10.5px] uppercase tracking-[.18em] text-[#CC99FF]">
              <Bot size={14} />
              {tIA('etiqueta', 'IA APLICADA AL NEGOCIO')}
            </span>
            <h2 className="heading mb-4 text-2xl md:text-4xl lg:text-5xl">
              {tIA('titulo_1', 'SERVICIOS DE')}{' '}
              <span className="bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent">
                {tIA('titulo_2', 'INTELIGENCIA ARTIFICIAL')}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-[14.5px] leading-relaxed text-white/70 md:text-base">
              {tIA('bajada', 'Inteligencia artificial puesta a trabajar donde se nota: atención, prospección, campañas y venta en línea. Todo conectado al mismo tablero.')}
            </p>
          </motion.div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:mb-10 md:grid-cols-2 md:gap-5">
            {[
              { p: 'w', ruta: '/servicios-ia/whatsapp', Icono: MessageCircle, titulo: 'IA PARA WHATSAPP', texto: 'Un agente que contesta en segundos, pregunta lo que preguntaría tu equipo y pasa la conversación cuando hay intención real de compra.', puntos: ['Contesta también fuera de horario', 'Separa a quien pregunta de quien quiere comprar', 'Cada conversación queda en tu tablero'] },
              { p: 'v', ruta: '/servicios-ia/ventas', Icono: Target, titulo: 'IA DE VENTAS', texto: 'Prospección y seguimiento con criterio: la IA prepara la lista y el contexto, tu equipo entra a cerrar y no a buscar.', puntos: ['Prospección en LinkedIn con criterio, no en frío', 'Mensajes escritos con el contexto de cada cuenta', 'Seguimiento que no se le olvida a nadie'] },
              { p: 'm', ruta: '/servicios-ia/marketing', Icono: TrendingUp, titulo: 'IA PARA MARKETING', texto: 'Campañas que se corrigen con lo que dicen los datos y contenido producido a ritmo, sin perder el tono de tu marca.', puntos: ['El presupuesto se mueve a lo que sí convierte', 'Contenido a ritmo, con tu tono', 'Aviso cuando algo se sale de lo normal'] },
              { p: 'e', ruta: '/servicios-ia/ecommerce', Icono: ShoppingCart, titulo: 'IA PARA E-COMMERCE', texto: 'Convertir mejor lo que ya llega a tu tienda: recomendaciones que sí aplican y carritos que no se pierden.', puntos: ['Recomendaciones según lo que cada quien ve', 'Recuperación de carritos abandonados', 'Precios que responden a la demanda'] },
            ].map(({ p, ruta, Icono, titulo, texto, puntos }, idx) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Link
                  to={ruta}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-6
                             transition-all duration-300 hover:-translate-y-1 hover:border-[#AA66FF]/40 hover:bg-white/[.06] md:p-7"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg,transparent,#9933FF,transparent)' }}
                  />
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] transition-transform duration-300 group-hover:scale-110">
                      <Icono className="text-white" size={24} />
                    </div>
                    {p === 'w' && (
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                        {tTarIA('etiqueta_top', 'EL MÁS PEDIDO')}
                      </span>
                    )}
                  </div>

                  <h3 className="heading mb-2.5 text-xl transition-colors group-hover:text-[#DDBBFF] md:text-2xl">
                    {tTarIA(`${p}_titulo`, titulo)}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/65 md:text-[15px]">
                    {tTarIA(`${p}_texto`, texto)}
                  </p>

                  <div className="mb-5 flex-1 space-y-2">
                    {puntos.map((punto, n) => (
                      <div key={punto} className="flex items-center gap-2 text-[13px] text-white/75 md:text-sm">
                        <CheckCircle size={15} className="shrink-0 text-[#AA66FF]" />
                        <span>{tTarIA(`${p}_p${n + 1}`, punto)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-bold text-[#AA66FF] transition-all group-hover:gap-2.5">
                    <span>{tTarIA('ver_mas', 'Conocer más')}</span>
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/servicios-ia"
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-8 py-4 text-white shadow-[0_0_40px_rgba(119,0,206,0.4)] transition-all hover:scale-105 hover:from-[#9933FF] hover:to-[#7700CE] hover:shadow-[0_0_60px_rgba(119,0,206,0.6)]"
            >
              <Bot className="mr-2" size={20} />
              <span className="heading text-sm tracking-[0.08em] md:text-base">{tTarIA('boton', 'VER TODOS LOS SERVICIOS IA')}</span>
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ---- El proceso, con el monitor sobre fondo oscuro ---- */}
      {tProc.visible() && (
      <section className="relative overflow-hidden px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 text-center md:mb-10">
            <Kicker centrado>{tProc('etiqueta', 'EL CICLO COMPLETO')}</Kicker>
            <h2 className="heading mb-4 text-2xl md:text-4xl">
              {tProc('titulo', 'CÓMO TRABAJAMOS')}
            </h2>
            <p className="mx-auto max-w-2xl text-[14.5px] leading-relaxed text-white/70 md:text-base">
              {tProc('bajada', 'Dirección define, todo se conecta, la IA audita y se ajusta. Así se ve el ciclo completo.')}
            </p>
          </div>

          {/* La escena del ciclo: se explica sola y se puede tocar.
              Va en su propio chunk y no arranca hasta estar en pantalla,
              asi que el indice no paga nada por tenerla. */}
          <Suspense fallback={<div className="min-h-[440px]" />}>
            <Diferido alto={440}>
              <ProcesoCiclo pasos={process} />
            </Diferido>
          </Suspense>
        </div>
      </section>
      )}

      {/* ---- Casos: los logos corren con la misma cinta CSS de arriba;
           la portada ya no monta el carrusel de react-slick ---- */}
      {tCasos.visible() && (
      <section className="relative overflow-hidden border-y border-[#AA66FF]/12 bg-[#0D0010] px-4 py-14 md:py-20">
        <div className="container mx-auto">
          <div className="mb-8 text-center md:mb-10">
            <Kicker centrado>{tCasos('etiqueta', 'PORTAFOLIO')}</Kicker>
            <h2 className="heading mb-4 text-2xl md:text-4xl">
              {tCasos('titulo', 'MARCAS QUE YA CONFÍAN')}
            </h2>
            <p className="mx-auto max-w-2xl text-[14.5px] leading-relaxed text-white/70 md:text-base">
              {tCasos('bajada', 'Trabajamos con empresas de Aguascalientes y de todo México. Por respeto a lo que cada una nos comparte, los resultados se cuentan en números y no en nombres.')}
            </p>
          </div>

          {/* la numeralia: cifras que benefician sin exponer a nadie.
              Los clientes no se nombran; si una cifra se vacía en el panel,
              su columna desaparece. */}
          <div className="mx-auto mb-9 grid max-w-4xl grid-cols-1 gap-7 sm:grid-cols-3 md:mb-12">
            {[1, 2, 3].map((i) => {
              const cifra = tCasos(`n${i}_cifra`, ['+80%', '4', '100%'][i - 1]);
              if (!cifra) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (i - 1) * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="heading bg-clip-text text-4xl leading-none text-transparent md:text-5xl"
                    style={{ backgroundImage: 'linear-gradient(120deg,#9933FF,#CC66FF)' }}
                  >
                    {cifra}
                  </div>
                  <p className="mx-auto mt-2.5 max-w-[250px] text-[13px] leading-snug text-white/60">
                    {tCasos(`n${i}_texto`, [
                      'de tráfico orgánico logrado para un cliente en un año',
                      'motores de IA donde medimos la presencia de cada cliente',
                      'de nuestros clientes con tablero conectado a datos reales',
                    ][i - 1])}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div
            className="relative mx-auto mb-8 max-w-6xl overflow-hidden md:mb-10"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div
              className="animate-cinta flex w-max items-center hover:[animation-play-state:paused]"
              style={{ animationDuration: '46s' }}
            >
              {[0, 1].map((vuelta) => (
                <div key={vuelta} aria-hidden={vuelta === 1} className="flex items-center">
                  {portfolioItems.filter((item) => item.logo).map((item) => (
                    <img
                      key={`${vuelta}-${item.id}`}
                      src={item.logo}
                      alt={vuelta === 0 ? `${item.client} logo` : ''}
                      loading="lazy"
                      decoding="async"
                      className="mx-8 h-10 w-auto max-w-[150px] object-contain opacity-55 brightness-0 invert transition-opacity duration-300 hover:opacity-100 md:mx-10 md:h-12"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/portafolio"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-white transition-all hover:border-[#AA66FF]/50 hover:bg-white/10 md:px-8 md:py-3.5"
            >
              <span className="heading text-sm tracking-[0.08em] md:text-base">{tCasos('boton', 'VER EL PORTAFOLIO')}</span>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ---- La casa: de dónde somos y cómo se siente trabajar aquí ----
           Antes era "TRABAJAMOS CON PASIÓN" con tres tarjetas genéricas. */}
      {tVal.visible() && (
      <section className="relative overflow-hidden px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-12%] top-0 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.24), transparent 70%)' }}
        />
        <div className="container relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="mb-10 max-w-3xl"
          >
            <Kicker>{tVal('etiqueta', 'QUIÉN ESTÁ DETRÁS')}</Kicker>
            <h2 className="heading mb-5 text-3xl leading-[1.05] [text-wrap:balance] md:text-5xl">
              {tVal('postura_1', 'DE AGUASCALIENTES,')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
              >
                {tVal('postura_2', 'PARA EMPRESAS QUE VAN EN SERIO')}
              </span>
            </h2>
            <p className="max-w-2xl text-[15.5px] leading-relaxed text-white/75 md:text-base">
              {tVal('texto', 'Estamos en Aguascalientes y trabajamos con empresas de todo México. Lo que se promete queda por escrito, lo que se hace queda medido, y siempre hay una persona que da la cara.')}
            </p>
          </motion.div>

          {/* las tres promesas del documento de dirección, como bloque:
              son las mismas que la cinta del inicio corea en corto */}
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[.2em] text-white/45">
            {tVal('promesas_titulo', 'Las tres promesas que sostienen todo')}
          </div>
          <div className="grid md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i - 1) * 0.1 }}
                className="border-t border-white/10 py-6 transition-colors hover:border-[#AA66FF]/40 md:border-l md:border-t-0 md:px-6 md:first:border-l-0 md:first:pl-0"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[.2em] text-[#AA66FF]">0{i}</span>
                <h3 className="heading mb-2 mt-2 text-lg md:text-xl">
                  {tVal(`c${i}_titulo`, ['FORMALIDAD Y CONFIANZA', 'VISIBILIDAD COMPLETA', 'MEDICIÓN HASTA LA VENTA'][i - 1])}
                </h3>
                <p className="text-[14px] leading-relaxed text-white/65">
                  {tVal(`c${i}_texto`, [
                    'Cuando alguien te busca, encuentra una empresa seria: presencia cuidada, soporte y todo en orden, por escrito.',
                    'No solo Google: también los motores de IA que ya recomiendan proveedores. Casi nadie trabaja esto.',
                    'Tablero conectado a datos reales y, cuando tu sistema lo permite, el cruce directo entre campañas y ventas cerradas.',
                  ][i - 1])}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ---- El cierre ---- */}
      <section className="relative overflow-hidden border-t border-[#AA66FF]/12 bg-[#0D0010] px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <Reticula foco="50% 55%" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.30), transparent 70%)' }}
        />
        <div className="container relative mx-auto max-w-3xl text-center">
          <Kicker centrado>{tCierre('etiqueta', 'EL SIGUIENTE PASO')}</Kicker>
          <h2 className="heading mb-5 text-3xl [text-wrap:balance] md:text-6xl">
            {tCierre('titulo', 'EMPIEZA POR SABER DÓNDE ESTÁS')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-[15.5px] leading-relaxed text-white/75 md:text-lg">
            {tCierre('bajada', 'Pide la auditoría de tu presencia digital: qué está bien, qué está mal y qué conviene hacer primero, con la evidencia de cada hallazgo.')}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => openAssistant(undefined, 'quiero una auditoría de mi presencia digital')}
              className="group inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-8 py-4 text-white shadow-[0_0_30px_rgba(119,0,206,0.5)] transition-all duration-300 hover:from-[#9933FF] hover:to-[#7700CE] hover:shadow-[0_0_50px_rgba(119,0,206,0.8)] active:scale-95 sm:w-auto"
            >
              <span className="heading text-sm tracking-[0.08em] md:text-base">{tCierre('boton', 'QUIERO MI AUDITORÍA')}</span>
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#25D366]/50 hover:bg-white/10 active:scale-95 sm:w-auto"
            >
              <MessageCircle size={17} className="text-[#25D366]" />
              <span className="heading text-sm tracking-[0.08em] md:text-base">{tCierre('boton_wa', 'ESCRÍBENOS POR WHATSAPP')}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
