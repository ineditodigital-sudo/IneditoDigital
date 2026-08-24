import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, ExternalLink, Gamepad2, Camera, Grid3x3, Sparkles,
} from 'lucide-react';
import { TopoLineas } from '../components/TopoLineas';
import { RecorridoProceso } from '../components/RecorridoProceso';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

/*
 * ESTRUCTURA tomada de la pagina de tarjetas NFC, que es la que funciona:
 *
 *   0. PORTADA          titulo grande sobre fondo vivo, sin foto de banco
 *   1. QUE INCLUYE      bento asimetrico, no una rejilla uniforme
 *   2. EL PROCESO       recorrido pegajoso: se arma con el scroll
 *   3. BENEFICIOS       sobre BLANCO, para no perder el ritmo del sitio
 *   4. DEMOS            solo activaciones para expo (funcionalidad real)
 *   5. IDEAL PARA       oscuro, compacto
 *   6. FAQ + CIERRE     sobre BLANCO
 *
 * El blanco vuelve en las zonas 3 y 6 igual que en tarjetas: mantiene el
 * ritmo del sitio sin recuperar la formula de secciones apiladas iguales.
 *
 * Antes esta pagina eran seis bloques de 50/50 con una foto de Unsplash en
 * cada uno. Los datos mandan el diseno: features, process, benefits, ideal y
 * faq salen del panel, asi que cada seccion se adapta a cuantos elementos
 * haya en vez de asumir un numero fijo.
 */

const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.6, delay: retraso },
});

/* ------------------------------------------------------------------ */

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { services, settings, openAssistant } = useApp();

  const service = services.find((s) => s.slug === slug);
  const tEnc = contenido('servicio-detalle', 'encabezados');
  const tDem = contenido('servicio-detalle', 'demos');
  const tCie = contenido('servicio-detalle', 'cierre');

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white">
          {contenido('servicio-detalle', 'encabezados')('no_encontrado', 'Servicio no encontrado')}
        </p>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Hola, me interesa el servicio de ${service.title}`
  )}`;

  return (
    <>
      <DynamicSEO
        title={`${service.title} - INÉDITO DIGITAL`}
        description={service.shortDescription}
        keywords={[service.title.toLowerCase(), 'marketing digital aguascalientes', service.category.toLowerCase()]}
      />

      <div className="relative bg-[#07060B]">
        {/* Atmosfera: rejilla de puntos con mascara y dos manchas que derivan.
            Es la misma que usa la pagina de tarjetas. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.5) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(ellipse 75% 40% at 50% 12%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 40% at 50% 12%, black, transparent)',
            }}
          />
          <motion.div
            className="absolute -top-1/4 left-1/4 h-[34rem] w-[34rem] rounded-full bg-[#7700CE]/20 blur-[130px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-0 h-[26rem] w-[26rem] rounded-full bg-[#9933FF]/14 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10">
          {/* ---------- ZONA 0 · PORTADA ---------- */}
          <section className="relative overflow-hidden px-4 pt-10 pb-16 md:pt-16 md:pb-24">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <TopoLineas className="h-full w-full" />
            </div>

            <div className="container mx-auto max-w-5xl">
              <div className="mb-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/servicios"
                  className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.18em] text-white/40 transition-colors hover:text-white"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                  {tEnc('volver', 'Volver a servicios')}
                </Link>
                <span className="text-white/15">/</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#CC66FF]">
                  <Sparkles size={15} />
                  {service.category}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="heading max-w-4xl text-4xl leading-[0.95] md:text-6xl lg:text-7xl"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
              >
                {service.shortDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => openAssistant(service.title, `cotizar ${service.title}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-transform hover:scale-[1.03]"
                >
                  {tCie('boton', 'COTIZAR AHORA')}
                  <ArrowRight size={17} />
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:border-[#CC66FF]/50 hover:bg-white/5"
                >
                  WHATSAPP
                </a>
              </motion.div>
            </div>
          </section>

          {/* ---------- ZONA 1 · QUÉ INCLUYE (bento asimétrico) ---------- */}
          {service.features.length > 0 && (
            <section className="px-4 pb-16 md:pb-24">
              <div className="container mx-auto max-w-6xl">
                <motion.h2 {...entra()} className="heading mb-10 text-3xl md:text-5xl">
                  {tEnc('inc_1', 'QUÉ')}{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                  >
                    {tEnc('inc_2', 'INCLUYE')}
                  </span>
                </motion.h2>

                <div className="grid gap-4 md:grid-cols-3">
                  {service.features.map((f, i) => (
                    <motion.div
                      key={i}
                      {...entra(Math.min(i * 0.06, 0.4))}
                      /* La primera ocupa el doble: rompe la rejilla uniforme
                         que hacia que todo pesara igual. */
                      className={i === 0 ? 'md:col-span-2' : ''}
                    >
                      <div
                        className="group h-full rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CC66FF]/40"
                        style={{
                          background:
                            i === 0
                              ? 'linear-gradient(150deg, rgba(119,0,206,.22), rgba(255,255,255,.02) 60%)'
                              : 'rgba(255,255,255,.035)',
                        }}
                      >
                        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                          <Check size={17} className="text-[#CC66FF]" strokeWidth={2.4} />
                        </span>
                        <p
                          className={`leading-relaxed text-white/85 ${
                            i === 0 ? 'text-lg md:text-xl' : 'text-[15px]'
                          }`}
                        >
                          {f}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ---------- ZONA 2 · EL PROCESO ---------- */}
          <RecorridoProceso
            pasos={service.process}
            sello={tEnc('proceso_sello', 'Proceso comprobado')}
            titulo={
              <>
                {tEnc('proceso_1', 'NUESTRO')}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                >
                  {tEnc('proceso_2', 'PROCESO')}
                </span>
              </>
            }
          />
        </div>
      </div>

      {/* ---------- ZONA 3 · BENEFICIOS, SOBRE BLANCO ---------- */}
      {/* El dato ya existia en el panel y no se mostraba en ninguna parte. */}
      {service.benefits.length > 0 && (
        <section className="bg-white px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-5xl">
            <motion.h2 {...entra()} className="heading mb-3 text-3xl text-[#0A0A0A] md:text-5xl">
              {tEnc('ben_1', 'LO QUE')} <span className="text-[#7700CE]">{tEnc('ben_2', 'GANAS')}</span>
            </motion.h2>
            <motion.p {...entra(0.06)} className="mb-12 max-w-xl text-[#0A0A0A]/60">
              {tEnc('ben_bajada', 'Para qué sirve, en concreto.')}
            </motion.p>

            <div className="grid gap-5 sm:grid-cols-2">
              {service.benefits.map((b, i) => (
                <motion.div key={i} {...entra(i * 0.08)} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7700CE]/12">
                    <Check size={16} className="text-[#7700CE]" strokeWidth={2.6} />
                  </span>
                  <p className="text-[16px] leading-relaxed text-[#0A0A0A]/80">{b}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="relative bg-[#07060B]">
        {/* ---------- ZONA 4 · DEMOS (solo activaciones para expo) ---------- */}
        {slug === 'activaciones-para-expo' && tDem.visible() && (
          <section className="relative overflow-hidden px-4 py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#7700CE]/20 blur-[120px]" />
            </div>
            <div className="container mx-auto max-w-6xl">
              <motion.div {...entra()} className="mb-12 text-center">
                <h2 className="heading mb-4 text-3xl md:text-5xl">
                  {tDem('titulo_1', 'PRUEBA NUESTROS')}{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                  >
                    {tDem('titulo_2', 'DEMOS')}
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-white/70">
                  {tDem('bajada', 'Explora en vivo las activaciones interactivas que podemos implementar en tu stand.')}
                </p>
              </motion.div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  { Icono: Gamepad2, t: tDem('d1_titulo', 'RULETA DE PREMIOS'), d: tDem('d1_texto', 'Ruleta interactiva totalmente personalizable.'), u: tDem('d1_url', 'https://ruleta-expo.inedito.digital/demo') },
                  { Icono: Camera, t: tDem('d2_titulo', 'PHOTO OPPORTUNITY'), d: tDem('d2_texto', 'Photobooth con marcos personalizados de tu marca.'), u: tDem('d2_url', 'https://photo-oportunity.inedito.digital/demo') },
                  { Icono: Grid3x3, t: tDem('d3_titulo', 'TIC TAC TOE'), d: tDem('d3_texto', 'Gato interactivo con premios. Juega contra la IA y gana.'), u: tDem('d3_url', 'https://tic-tac-toe.inedito.digital/demo') },
                ].map(({ Icono, t, d, u }, i) => (
                  <motion.div key={i} {...entra(i * 0.1)}>
                    <GlassCard hover className="group flex h-full flex-col">
                      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                        <Icono size={22} className="text-[#CC66FF]" />
                      </span>
                      <h3 className="heading mb-2 text-xl leading-tight">{t}</h3>
                      <p className="mb-5 text-sm leading-relaxed text-white/70">{d}</p>
                      <span className="mb-4 inline-flex w-fit rounded-full bg-[#CC66FF]/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#CC66FF]">
                        {tDem('etiqueta', '✓ DISPONIBLE')}
                      </span>
                      <a
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#CC66FF]/30 bg-[#CC66FF]/12 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#CC66FF]/20"
                      >
                        {tDem('boton', 'VER DEMO')}
                        <ExternalLink size={15} />
                      </a>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              <motion.div {...entra(0.3)} className="mt-12 text-center">
                <p className="mb-5 text-white/70">
                  {tDem('cta_texto', '¿Necesitas una activación personalizada para tu evento?')}
                </p>
                <button
                  onClick={() => openAssistant(service.title, 'activacion personalizada')}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                >
                  {tDem('cta_boton', 'COTIZAR ACTIVACIÓN PERSONALIZADA')}
                  <ArrowRight size={17} />
                </button>
              </motion.div>
            </div>
          </section>
        )}

        {/* ---------- ZONA 5 · IDEAL PARA ---------- */}
        {service.ideal.length > 0 && (
          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-5xl">
              <motion.h2 {...entra()} className="heading mb-10 text-3xl md:text-5xl">
                {tEnc('ideal_1', 'IDEAL')}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                >
                  {tEnc('ideal_2', 'PARA')}
                </span>
              </motion.h2>
              <div className="flex flex-col gap-3">
                {service.ideal.map((item, i) => (
                  <motion.div
                    key={i}
                    {...entra(i * 0.07)}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5 transition-colors hover:border-[#CC66FF]/30"
                  >
                    <span className="heading mt-0.5 shrink-0 text-sm text-[#CC66FF]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[15.5px] leading-relaxed text-white/80">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ---------- ZONA 6 · FAQ Y CIERRE, SOBRE BLANCO ---------- */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          {service.faq.length > 0 && (
            <>
              <motion.h2 {...entra()} className="heading mb-10 text-center text-3xl text-[#0A0A0A] md:text-5xl">
                {tEnc('faq_1', 'PREGUNTAS')} <span className="text-[#7700CE]">{tEnc('faq_2', 'FRECUENTES')}</span>
              </motion.h2>

              <div className="mb-20 divide-y divide-[#0A0A0A]/10 border-y border-[#0A0A0A]/10">
                {service.faq.map((item, i) => (
                  <motion.div key={i} {...entra(Math.min(i * 0.06, 0.35))} className="py-6">
                    <h3 className="heading mb-2.5 text-lg leading-snug text-[#0A0A0A] md:text-xl">{item.question}</h3>
                    <p className="max-w-3xl text-[15.5px] leading-relaxed text-[#0A0A0A]/70">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <motion.div
            {...entra()}
            className="relative overflow-hidden rounded-3xl p-10 text-center md:p-14"
            style={{ background: 'linear-gradient(140deg,#7700CE,#9933FF)' }}
          >
            <h2 className="heading mb-4 text-3xl leading-tight text-white md:text-4xl">
              {tCie('titulo_1', '¿LISTO PARA')} {tCie('titulo_2', 'COMENZAR?')}
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-white/85">{service.shortDescription}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => openAssistant(service.title, `cotizar ${service.title}`)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#7700CE] transition-transform hover:scale-[1.03]"
              >
                {tCie('boton', 'COTIZAR AHORA')}
                <ArrowRight size={17} />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
