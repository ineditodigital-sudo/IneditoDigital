import { motion } from 'motion/react';
import { ArrowRight, Check, CheckCircle, Sparkles, TrendingUp, Zap, Target, Star, Bot, MessageCircle, ShoppingCart, Users } from 'lucide-react';
import { Link } from 'react-router';
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { GlassCard } from '../components/GlassCard';
import HeroBento from '../components/HeroBento';
import EsferaIA from '../components/EsferaIA';
import { LogoIA } from '../components/LogosIA';
import SectionDivider from '../components/SectionDivider';
import DynamicSEO from '../components/DynamicSEO';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Floating3DElements = lazy(() => import('../components/Floating3DElements'));

const ProcesoCiclo = lazy(() => import('../components/ProcesoCiclo'));

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
  const tTar    = contenido('home', 'tarjetas');
  const tTarIA  = contenido('home', 'tarjetas_ia');
  const tVal    = contenido('home', 'valores');
  const tEnf    = contenido('home', 'enfoque');
  const tCin    = contenido('home', 'cinta');
  const tNiv    = contenido('home', 'niveles');
  const tTab    = contenido('home', 'tablero');

  const features = [
    { icon: Sparkles,   title: tTar('t1_titulo', 'IA'),          description: tTar('t1_texto', 'Automatización y chatbots 24/7'),  image: tTar('t1_imagen', 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080') },
    { icon: TrendingUp, title: tTar('t2_titulo', 'Estrategia'),  description: tTar('t2_texto', 'Diseños que convierten'),          image: tTar('t2_imagen', 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080') },
    { icon: Zap,        title: tTar('t3_titulo', 'Analítica'),   description: tTar('t3_texto', 'Decisiones basadas en datos'),     image: tTar('t3_imagen', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080') },
  ];


  const process = [
    { step: '01', title: tProc('paso_1_titulo', 'OBJETIVOS'), description: tProc('paso_1_texto', 'Dirección define qué quiere lograr y en qué plazo') },
    { step: '02', title: tProc('paso_2_titulo', 'CONECTAR'),  description: tProc('paso_2_texto', 'Tu presencia, tus campañas y tus ventas quedan en un solo tablero') },
    { step: '03', title: tProc('paso_3_titulo', 'AUDITAR'),   description: tProc('paso_3_texto', 'Cada mes una IA revisa el desempeño contra esos objetivos') },
    { step: '04', title: tProc('paso_4_titulo', 'AJUSTAR'),   description: tProc('paso_4_texto', 'Se corrige con lo que dice el dato, no con la corazonada') }
  ];


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
    sameAs: [
      'https://www.facebook.com/ineditodigital',
      'https://www.instagram.com/ineditodigital',
      'https://www.linkedin.com/company/ineditodigital'
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
                  tCin('f1', 'Dirección comercial asistida por IA'),
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

      <SectionDivider variant="gradient" color="purple" />

      {/* Bento Grid - Value Proposition */}
      {tTrans.visible() && (
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden bg-white">
        {/* Elementos 3D Flotantes */}
        <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
          <Floating3DElements variant="mixed" count={10} />
        </Suspense>
        
        <div className="container mx-auto relative z-10 max-w-7xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              {tTrans('titulo_1', 'EL PODER DE LA')} <span className="text-[#7700CE]">{tTrans('titulo_2', 'TRANSFORMACIÓN DIGITAL')}</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              {tTrans('bajada', 'Combinamos lo mejor del marketing tradicional con IA y automatización de vanguardia')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((feature, index) => {
              return (
                <div
                  key={feature.title}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GlassCard hover glow className="h-full overflow-hidden group bg-white/80 backdrop-blur-sm border-gray-200">
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Contenido */}
                    <div className="relative z-10">
                      <feature.icon className="text-[#7700CE] mb-3" size={28} />
                      <h3 className="heading text-base md:text-lg mb-2 text-black">{feature.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
            
            {/* Resultados Card */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: `${features.length * 0.1}s` }}
            >
              <GlassCard hover glow className="h-full overflow-hidden group bg-white/80 backdrop-blur-sm border-gray-200">
                {/* Imagen de fondo */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <img 
                    src={tTar('t4_imagen', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')}
                    alt="Resultados"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Contenido */}
                <div className="relative z-10">
                  <Target className="text-[#7700CE] mb-3" size={28} />
                  <h3 className="heading text-base md:text-lg mb-2 text-black">{tTar('t4_titulo', 'Resultados')}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{tTar('t4_texto', 'ROI comprobado y crecimiento sostenible')}</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ---- Banda del nuevo enfoque ----
           No toca el titular ni nada de lo que ya posiciona. Su trabajo es de
           rastreo: la portada es la unica pagina que Google visita siempre, y
           un enlace desde aqui es la via mas rapida para que descubra lo nuevo. */}
      {tEnf.visible() && (
        <section className="relative overflow-hidden px-4 py-14 md:px-6 md:py-20 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-3xl border border-[#9933FF]/25"
              style={{ background: 'linear-gradient(155deg, rgba(119,0,206,.16), rgba(13,0,16,.62) 55%, rgba(10,10,10,.92))' }}
            >
              {/* la retícula de puntos y la aurora del fondo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[.13]"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,.65) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  maskImage: 'radial-gradient(75% 75% at 62% 40%, black, transparent)',
                  WebkitMaskImage: 'radial-gradient(75% 75% at 62% 40%, black, transparent)',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-28 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.4), transparent 70%)' }}
              />
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #9933FF, transparent)' }}
              />

              <div className="relative grid items-stretch gap-8 p-7 md:p-10 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
                {/* ---- el texto y el índice ---- */}
                <div>
                  <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-[#AA66FF]">
                    <span aria-hidden className="h-px w-8 bg-[#AA66FF]/60" />
                    {tEnf('etiqueta', 'NUESTRO ENFOQUE')}
                  </span>
                  <h2 className="heading mb-4 text-3xl leading-[1.05] [text-wrap:balance] md:text-[2.6rem]">
                    {tEnf('titulo_1', 'DIRECCIÓN COMERCIAL')}{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                    >
                      {tEnf('titulo_2', 'ASISTIDA POR IA')}
                    </span>
                  </h2>
                  <p className="mb-7 text-[15.5px] leading-relaxed text-white/75">
                    {tEnf('texto', 'Somos una agencia de marketing digital y de inteligencia artificial: estrategia, publicidad y soluciones de IA con todo conectado a datos reales. Dirección define los objetivos y una IA audita cada mes si la estrategia está funcionando. Casi nadie en Aguascalientes trabaja así.')}
                  </p>

                  {/* el puente: estas filas SON el enfoque del título */}
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[.2em] text-white/45">
                    {tEnf('indice_titulo', 'Las cuatro piezas que lo hacen posible')}
                  </div>
                  <div className="border-t border-white/10">
                    {[1, 2, 3, 4].map((i) => {
                      const url = tEnf(`e${i}_url`, '');
                      if (!url) return null;
                      return (
                        <Link
                          key={i}
                          to={url}
                          className="group relative flex items-center gap-4 border-b border-white/10 py-3.5 pl-1 pr-2 transition-colors duration-300 hover:border-[#AA66FF]/40 md:gap-5"
                        >
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-[#7700CE]/25 to-transparent transition-all duration-300 group-hover:w-full"
                          />
                          {/* min-w y no un ancho fijo: con bg-clip-text, el
                              degradado solo pinta dentro de la caja y un ancho
                              corto dejaba los dígitos cortados a la mitad */}
                          <span
                            className="heading relative min-w-[3.4rem] shrink-0 bg-clip-text pr-1 text-2xl leading-none text-transparent md:text-3xl"
                            style={{ backgroundImage: 'linear-gradient(120deg,#9933FF,#CC66FF)' }}
                          >
                            0{i}
                          </span>
                          <span className="relative min-w-0 flex-1">
                            <span className="block font-semibold text-white transition-colors group-hover:text-[#DDBBFF]">
                              {tEnf(`e${i}_titulo`, '')}
                            </span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-white/55">
                              {tEnf(`e${i}_texto`, '')}
                            </span>
                          </span>
                          <ArrowRight
                            size={18}
                            className="relative shrink-0 text-[#AA66FF] transition-transform duration-300 group-hover:translate-x-1.5"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* ---- la esfera con sus órbitas y las IAs como satélites ---- */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[470px]">
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
                      ['openai', 'left-0 top-[10%] -translate-x-1/4', '0s'],
                      ['claude', 'right-0 top-[26%] translate-x-1/4', '1.1s'],
                      ['gemini', 'left-[4%] bottom-[18%]', '2s'],
                      ['perplexity', 'right-[6%] bottom-[6%]', '0.6s'],
                    ] as const).map(([marca, pos, retraso]) => (
                      <span
                        key={marca}
                        className={`animate-flotar absolute ${pos} flex items-center rounded-full border border-white/12 bg-black/50 px-3 py-1.5 shadow-lg backdrop-blur`}
                        style={{ animationDelay: retraso }}
                      >
                        <LogoIA marca={marca} alto={12} />
                      </span>
                    ))}
                  </div>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[.18em] text-white/40">
                    {tEnf('logos_texto', 'Presencia medida en')}
                  </span>
                </div>
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

      {/* Services Grid */}
      <section id="servicios" className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Elementos 3D Flotantes */}
        <Suspense fallback={null}>
          <Floating3DElements variant="cubes" count={8} />
        </Suspense>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              {tServ('titulo_1', 'NUESTROS')} <span className="text-[#7700CE]">{tServ('titulo_2', 'SERVICIOS')}</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
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
            className="mx-auto mb-8 flex max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 pl-5 shadow-[0_14px_44px_-20px_rgba(119,0,206,.45)]"
          >
            <Sparkles size={16} className="shrink-0 text-[#7700CE]" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={tServ('buscador', 'Escribe qué necesita tu empresa…')}
              aria-label="Cuéntale al asistente qué necesita tu empresa"
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-5 py-2.5 text-xs font-bold tracking-wider text-white transition-transform hover:scale-[1.03]"
            >
              PREGUNTAR
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
            {services.slice(0, 9).map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/servicios/${service.slug}`}>
                  <GlassCard hover className="h-full group bg-white/80 backdrop-blur-sm border-gray-200 hover:border-[#7700CE]/40">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#7700CE]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7700CE]/20 transition-colors">
                        <Sparkles className="text-[#7700CE]" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="heading text-base md:text-lg mb-1 md:mb-2 text-black group-hover:text-[#7700CE] transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center text-[#7700CE] text-xs md:text-sm group-hover:gap-2 transition-all font-semibold">
                      <span>{tServ('ver_mas', 'Ver más')}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassCard>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(119,0,206,0.3)]"
            >
              <span className="heading text-sm md:text-base tracking-[0.08em]">{tServ('boton', 'VER TODOS LOS SERVICIOS')}</span>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* AI Services Section */}
      {tIA.visible() && (
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0014] via-[#1a0033] to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7700CE]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9933FF]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Elementos 3D Flotantes */}
        <Suspense fallback={null}>
          <Floating3DElements variant="mixed" count={12} />
        </Suspense>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7700CE]/20 border border-[#7700CE]/40 backdrop-blur-xl mb-4 md:mb-6"
            >
              <Bot className="text-[#7700CE]" size={20} />
              <span className="text-sm text-white font-semibold tracking-wide">{tIA('etiqueta', 'POTENCIA TU NEGOCIO CON IA')}</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6"
            >
              {tIA('titulo_1', 'SERVICIOS DE')} <span className="bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent">{tIA('titulo_2', 'INTELIGENCIA ARTIFICIAL')}</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-sm md:text-base lg:text-lg max-w-3xl mx-auto"
            >
              {tIA('bajada', 'Automatiza, optimiza y escala tu negocio 24/7 con nuestras soluciones de IA personalizadas')}
            </motion.p>
          </div>

          {/* Grid de Servicios IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
            {/* IA para WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link to="/servicios-ia/whatsapp">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono y Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="text-white" size={28} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
                        <span className="text-xs text-green-400 font-bold">{tTarIA('etiqueta_top', 'BESTSELLER')}</span>
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      {tTarIA('w_titulo', 'IA PARA WHATSAPP')}
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      {tTarIA('w_texto', 'Agente inteligente que atiende, califica y cierra ventas 24/7. Nunca pierdas otro cliente.')}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('w_p1', 'Respuestas instantáneas 24/7')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('w_p2', 'Calificación automática de leads')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('w_p3', 'Integración con tu CRM')}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>{tTarIA('ver_mas', 'Conocer más')}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* IA de Ventas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/servicios-ia/ventas">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Target className="text-white" size={28} />
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      {tTarIA('v_titulo', 'IA DE VENTAS')}
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      {tTarIA('v_texto', 'Encuentra clientes perfectos y cierra más ventas con prospección inteligente automatizada.')}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('v_p1', 'Prospección automática LinkedIn')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('v_p2', 'Emails personalizados con IA')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('v_p3', 'Seguimiento predictivo')}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>{tTarIA('ver_mas', 'Conocer más')}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* IA para Marketing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/servicios-ia/marketing">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="text-white" size={28} />
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      {tTarIA('m_titulo', 'IA PARA MARKETING')}
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      {tTarIA('m_texto', 'Campañas que se optimizan solas. Contenido generado por IA. Resultados exponenciales.')}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('m_p1', 'Optimización automática de ads')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('m_p2', 'Contenido generado por IA')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('m_p3', 'Análisis predictivo de tendencias')}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>{tTarIA('ver_mas', 'Conocer más')}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* IA para E-commerce */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/servicios-ia/ecommerce">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="text-white" size={28} />
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      {tTarIA('e_titulo', 'IA PARA E-COMMERCE')}
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      {tTarIA('e_texto', 'Convierte más visitas en ventas. Recomendaciones inteligentes y checkout optimizado.')}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('e_p1', 'Recomendaciones personalizadas')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('e_p2', 'Recuperación carritos abandonados')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>{tTarIA('e_p3', 'Optimización de precios dinámica')}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>{tTarIA('ver_mas', 'Conocer más')}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          </div>

          {/* CTA Final de Servicios IA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Link
              to="/servicios-ia"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 shadow-[0_0_40px_rgba(119,0,206,0.4)] hover:shadow-[0_0_60px_rgba(119,0,206,0.6)] group"
            >
              <Bot className="mr-2" size={20} />
              <span className="heading text-sm md:text-base tracking-[0.08em]">{tTarIA('boton', 'VER TODOS LOS SERVICIOS IA')}</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
      )}

      <SectionDivider variant="gradient" color="purple" />

      {/* Process */}
      {tProc.visible() && (
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              {tProc('titulo', 'CÓMO TRABAJAMOS')}
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
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

      {/* Portfolio Preview */}
      {tCasos.visible() && (
      <section className="py-8 md:py-12 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-white">
              {tCasos('titulo', 'CASOS DE ÉXITO')}
            </h2>
            <p className="text-white/60 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              {tCasos('bajada', 'Marcas que confían en INÉDITO DIGITAL')}
            </p>
          </div>

          {/* Carrusel de logos */}
          <div className="max-w-6xl mx-auto mb-6 md:mb-8 logos-carousel">
            <style>{`
              .logos-carousel .slick-slide {
                display: flex !important;
                justify-content: center;
                align-items: center;
                height: 120px;
              }
              .logos-carousel .slick-track {
                display: flex !important;
                align-items: center;
              }
              .logos-carousel .logo-container {
                width: 180px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
              }
              .logos-carousel .logo-container img {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                filter: brightness(0) invert(1);
                transition: filter 0.3s ease;
              }
              .logos-carousel .logo-container:hover img {
                filter: none;
              }
            `}</style>
            <Slider
              dots={false}
              infinite={true}
              speed={3000}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={0}
              cssEase="linear"
              pauseOnHover={true}
              arrows={false}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  }
                }
              ]}
            >
              {portfolioItems.filter(item => item.logo).map((item) => (
                <div key={item.id}>
                  <div className="logo-container opacity-60 hover:opacity-100 transition-all duration-300">
                    <img 
                      src={item.logo} 
                      alt={`${item.client} logo`}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="text-center">
            <Link
              to="/portafolio"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-all"
            >
              <span className="heading text-sm md:text-base tracking-[0.08em]">{tCasos('boton', 'VER MÁS CASOS')}</span>
            </Link>
          </div>
        </div>
      </section>
      )}

      <SectionDivider variant="gradient" color="purple" />

      {/* Team & Workspace Visual Section */}
      <section className="py-8 md:py-12 px-4 relative overflow-hidden bg-white">
        {/* Elementos 3D flotantes */}
        <Suspense fallback={null}>
          <Floating3DElements variant="spheres" count={6} />
        </Suspense>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              {tVal('titulo_1', 'TRABAJAMOS CON')} <span className="text-[#7700CE]">{tVal('titulo_2', 'PASIÓN')}</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              {tVal('bajada', 'Un equipo dedicado a transformar tu negocio con tecnología de vanguardia')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard className="text-center p-4 md:p-5 bg-white/80 backdrop-blur-sm border-gray-200">
                <Sparkles className="text-[#7700CE] mx-auto mb-3" size={32} />
                <h3 className="heading text-lg md:text-xl mb-2 text-black">{tVal('v1_titulo', 'INNOVACIÓN')}</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {tVal('v1_texto', 'Utilizamos las últimas tecnologías en IA y automatización')}
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassCard className="text-center p-4 md:p-5 bg-white/80 backdrop-blur-sm border-gray-200">
                <Target className="text-[#7700CE] mx-auto mb-3" size={32} />
                <h3 className="heading text-lg md:text-xl mb-2 text-black">{tVal('v2_titulo', 'RESULTADOS')}</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {tVal('v2_texto', 'Nos enfocamos en métricas que realmente importan')}
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard className="text-center p-4 md:p-5 bg-white/80 backdrop-blur-sm border-gray-200">
                <TrendingUp className="text-[#7700CE] mx-auto mb-3" size={32} />
                <h3 className="heading text-lg md:text-xl mb-2 text-black">{tVal('v3_titulo', 'CRECIMIENTO')}</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {tVal('v3_texto', 'Tu éxito es nuestra máxima prioridad')}
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* CTA Final */}
      <section className="py-8 md:py-12 px-4 bg-white/[0.02]">
        <div className="container mx-auto">
          <GlassCard glow className="max-w-4xl mx-auto text-center p-6 md:p-10">
            <h2 className="heading text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6">
              {tCierre('titulo', '¿LISTO PARA CRECER?')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto">
              {tCierre('bajada', 'Agenda una consulta gratuita y descubre cómo podemos llevar tu negocio al siguiente nivel')}
            </p>
            <button
              onClick={() => openAssistant(undefined, 'agendar una consulta gratuita')}
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(119,0,206,0.5)] group cursor-pointer"
            >
              <span className="heading text-sm md:text-base tracking-[0.08em]">{tCierre('boton', 'AGENDAR CONSULTA GRATIS')}</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </GlassCard>
        </div>
      </section>
    </>
  );
}