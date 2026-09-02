import { motion } from 'motion/react';
import { FranjaLogosIA } from '../components/LogosIA';
import SEO from '../components/SEO';
import { contenido } from '../cms';
import { TopoLineas } from '../components/TopoLineas';
import { CifraAnimada } from '../components/CifraAnimada';
import { ShieldCheck, Radar, LineChart, Target, Compass } from 'lucide-react';

/* Entrada estandar del sitio: aparecer subiendo, una sola vez. */
const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: retraso },
});

export default function AboutPage() {
  /* Textos editables. El segundo argumento es el respaldo: lo que hay hoy. */
  const tEnc = contenido('nosotros', 'encabezado');
  const tMis = contenido('nosotros', 'mision');
  const tVal = contenido('nosotros', 'valores');
  const tEle = contenido('nosotros', 'elegirnos');
  const tCif = contenido('nosotros', 'cifras');

  /* Las tres promesas. Cada una con su icono: no son pasos de un proceso,
     asi que no van numeradas. */
  const promesas = [
    {
      Icono: ShieldCheck,
      titulo: tVal('v1_titulo', 'FORMALIDAD Y CONFIANZA'),
      texto: tVal('v1_texto', 'Cuando alguien busca a tu empresa, encuentra un negocio serio: presencia cuidada, datos consistentes en todas partes y soporte real detrás.'),
    },
    {
      Icono: Radar,
      titulo: tVal('v2_titulo', 'VISIBILIDAD COMPLETA'),
      texto: tVal('v2_texto', 'No solo Google. También los motores de IA que cada vez más recomiendan proveedores: ChatGPT, Claude, Gemini y Perplexity.'),
    },
    {
      Icono: LineChart,
      titulo: tVal('v3_titulo', 'MEDICIÓN HASTA LA VENTA'),
      texto: tVal('v3_texto', 'Tableros conectados a datos reales y, cuando tu ERP lo permite, cruce directo entre campañas y ventas cerradas. No clics ni likes.'),
    },
  ];

  const cifras = [
    { valor: tCif('c1_valor', '100+'), texto: tCif('c1_texto', 'Proyectos exitosos') },
    { valor: tCif('c2_valor', '5X'), texto: tCif('c2_texto', 'ROI promedio') },
    { valor: tCif('c3_valor', '3'), texto: tCif('c3_texto', 'Niveles de servicio: construir, mejorar y vender') },
  ];

  return (
    <>
      <SEO
        title="Nosotros · Agencia de marketing digital en Aguascalientes"
        description="Agencia de marketing digital en Aguascalientes que trabaja como dirección comercial asistida por IA. Todo conectado a datos reales y medido hasta la venta."
      />

      {/* ---------------------------------------------------- portada */}
      <section className="relative overflow-hidden border-b border-[#AA66FF]/15">
        <TopoLineas className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 55% at 50% 45%, rgba(10,10,10,.86) 0%, rgba(10,10,10,.55) 55%, transparent 100%)' }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:py-36">
          <motion.p
            {...entra()}
            className="mb-6 font-mono text-[11px] uppercase tracking-[.22em] text-[#AA66FF]"
          >
            Aguascalientes, México
          </motion.p>
          <motion.h1 {...entra(0.08)} className="heading text-4xl leading-[0.95] md:text-7xl">
            {tEnc('titulo_1', 'SOBRE')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#AA66FF)' }}
            >
              {tEnc('titulo_2', 'NOSOTROS')}
            </span>
          </motion.h1>
          <motion.p
            {...entra(0.16)}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            {tEnc('bajada', 'Somos un equipo de Aguascalientes. Trabajamos con empresas que quieren dejar de invertir en digital a ciegas: conectamos objetivos, datos y campañas en un solo lugar, y auditamos con IA si la estrategia está dando resultado.')}
          </motion.p>
        </div>
      </section>

      {/* ---------------------------------------------- mision y vision */}
      {/* Deliberadamente distintas: la mision en panel morado, la vision en
          oscuro. Dos tarjetas gemelas era justo lo que aplanaba la pagina. */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <motion.article
            {...entra()}
            className="relative overflow-hidden rounded-3xl border border-[#9933FF]/25 p-8 md:p-10"
            style={{ background: 'linear-gradient(155deg, rgba(119,0,206,.20), rgba(119,0,206,.04) 65%)' }}
          >
            <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: 'linear-gradient(180deg,#9933FF,transparent)' }} />
            <Target className="mb-5 text-[#AA66FF]" size={30} strokeWidth={1.6} />
            <h2 className="heading mb-4 text-2xl md:text-[1.75rem]">{tMis('mision_titulo', 'NUESTRA MISIÓN')}</h2>
            <p className="text-[15.5px] leading-relaxed text-white/80">
              {tMis('mision_texto', 'Que cada peso que una empresa invierte en digital se pueda medir contra ventas reales. Conectamos los objetivos de dirección con Search Console, Analytics y las campañas en un solo tablero, y revisamos periódicamente si la estrategia está funcionando.')}
            </p>
          </motion.article>

          <motion.article
            {...entra(0.12)}
            className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[.035] p-8 md:p-10"
          >
            <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: 'linear-gradient(180deg,rgba(255,255,255,.35),transparent)' }} />
            <Compass className="mb-5 text-white/85" size={30} strokeWidth={1.6} />
            <h2 className="heading mb-4 text-2xl md:text-[1.75rem]">{tMis('vision_titulo', 'NUESTRA VISIÓN')}</h2>
            <p className="text-[15.5px] leading-relaxed text-white/80">
              {tMis('vision_texto', 'Que las empresas de Aguascalientes no solo aparezcan en Google, sino también en las respuestas que dan ChatGPT, Claude y Gemini cuando alguien pregunta por un proveedor. Casi nadie en el mercado está trabajando eso todavía.')}
            </p>
          </motion.article>
        </div>
      </section>

      {/* ------------------------------------------------- las promesas */}
      {tVal.visible() && (
        <section className="border-y border-[#AA66FF]/12 bg-[#0D0010] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <motion.h2 {...entra()} className="heading mb-3 text-center text-3xl md:text-4xl">
              {tVal('titulo', 'NUESTRAS TRES PROMESAS')}
            </motion.h2>
            <motion.p {...entra(0.06)} className="mx-auto mb-14 max-w-xl text-center text-white/60">
              Lo que sostiene todo lo que hacemos.
            </motion.p>

            <div className="grid gap-5 md:grid-cols-3">
              {promesas.map(({ Icono, titulo, texto }, i) => (
                <motion.article
                  key={i}
                  {...entra(i * 0.12)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-7
                             transition-all duration-300 hover:-translate-y-1 hover:border-[#AA66FF]/40 hover:bg-white/[.06]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg,transparent,#9933FF,transparent)' }}
                  />
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#9933FF]/30"
                    style={{ background: 'rgba(119,0,206,.16)' }}
                  >
                    <Icono className="text-[#AA66FF]" size={22} strokeWidth={1.7} />
                  </div>
                  <h3 className="heading mb-3 text-lg leading-tight">{titulo}</h3>
                  <p className="text-[14.5px] leading-relaxed text-white/70">{texto}</p>
                  {i === 1 && <FranjaLogosIA alto={18} className="mt-5" />}
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ por que elegirnos */}
      <section className="px-4 py-20 md:py-28">
        <motion.div
          {...entra()}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#9933FF]/25 p-9 text-center md:p-14"
          style={{ background: 'radial-gradient(120% 100% at 50% 0%, rgba(119,0,206,.22) 0%, rgba(13,0,16,.6) 60%, rgba(10,10,10,.9) 100%)' }}
        >
          <h2 className="heading mb-5 text-3xl md:text-4xl">{tEle('titulo', '¿POR QUÉ ELEGIRNOS?')}</h2>
          <p className="mx-auto mb-14 max-w-2xl text-[15.5px] leading-relaxed text-white/80">
            {tEle('texto', 'No vendemos campañas sueltas. Conectamos los objetivos de tu dirección con los datos reales del negocio, y una IA audita cada mes si la estrategia está funcionando. Si no funciona, lo dice.')}
          </p>

          <div className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
            {cifras.map((c, i) => (
              <motion.div key={i} {...entra(0.1 + i * 0.1)} className="text-center">
                <CifraAnimada
                  valor={c.valor}
                  className="heading block bg-clip-text text-4xl leading-none text-transparent md:text-5xl"
                  style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#AA66FF)' }}
                />
                <div className="mx-auto mt-4 max-w-[15rem] text-sm leading-snug text-white/65">{c.texto}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
