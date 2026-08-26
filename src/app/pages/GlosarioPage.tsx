import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, ArrowRight, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { TopoLineas } from '../components/TopoLineas';
import { contenido } from '../cms';
import { GLOSARIO, TERMINOS_PLANOS, type Termino } from '../data/glosario';
import { limpio, palabras } from '../components/asistente/intenciones';

/*
 * El glosario público.
 *
 * Contenido definicional: es lo que un asistente de IA cita cuando le
 * preguntan "qué es AEO". Nadie en Aguascalientes lo tiene publicado y a
 * nosotros nos sale gratis, porque son cosas que ya se explican por WhatsApp
 * todas las semanas.
 *
 * El buscador reutiliza limpio() del asistente para que "que es el ctr"
 * encuentre "CTR" sin que el acento o el artículo estorben.
 */

const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay: retraso },
});

function Ficha({ t }: { t: Termino }) {
  return (
    <article
      id={limpio(t.termino).replace(/\s+/g, '-')}
      className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[.03] p-6 transition-colors hover:border-[#AA66FF]/30"
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-2">
        <h3 className="heading text-xl leading-tight">{t.termino}</h3>
        {t.siglas && <span className="font-mono text-[11px] text-white/40">{t.siglas}</span>}
      </div>
      <p className="text-[15px] leading-relaxed text-white/80">{t.definicion}</p>
      {t.matiz && (
        <p className="mt-3 flex gap-2 text-[13.5px] leading-relaxed text-white/55">
          <Info size={15} className="mt-0.5 shrink-0 text-[#AA66FF]" />
          <span>{t.matiz}</span>
        </p>
      )}
      {t.enlace && (
        <Link
          to={t.enlace.url}
          className="group mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#AA66FF] transition-colors hover:text-white"
        >
          {t.enlace.texto}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </article>
  );
}

export default function GlosarioPage() {
  const t = contenido('glosario', 'encabezado');
  const [busca, setBusca] = useState('');

  /* Se busca por palabras utiles, no por la frase entera: "que es el ctr"
     no encontraba nada porque exigia esa cadena literal. Se reutiliza el
     tokenizador del asistente, que ya descarta el relleno. */
  const utiles = palabras(busca);
  const filtrados = (() => {
    if (!busca.trim()) return null;
    const heno = (x: Termino) => limpio([x.termino, x.siglas ?? '', x.definicion, x.matiz ?? ''].join(' '));
    if (!utiles.length) {
      const q = limpio(busca);
      return TERMINOS_PLANOS.filter((x) => heno(x).includes(q));
    }
    /* Primero se exige que estén TODAS las palabras: da resultados precisos.
       Si no hay ninguno —"como funciona el seo" no tiene "funciona" en el
       texto— se rebaja a las que haya, ordenadas por cuántas coinciden. */
    const todas = TERMINOS_PLANOS.filter((x) => utiles.every((p) => heno(x).includes(p)));
    if (todas.length) return todas;
    return TERMINOS_PLANOS
      .map((x) => ({ x, n: utiles.filter((p) => heno(x).includes(p)).length }))
      .filter((r) => r.n > 0)
      .sort((a, b) => b.n - a.n)
      .map((r) => r.x);
  })();

  return (
    <>
      <SEO
        title={t('seo_titulo', 'Glosario de marketing digital, SEO y posicionamiento en IA')}
        description={t('seo_desc', 'Qué significan SEO, AEO, GEO, indexación, CTR, NAP y el resto de términos que salen cuando hablas de posicionamiento. Explicados en lenguaje normal, sin jerga.')}
        keywords={['que es aeo', 'que es geo', 'diferencia seo aeo geo', 'glosario marketing digital', 'que es indexacion']}
      />

      {/* ---------------------------------------------------- portada */}
      <section className="relative overflow-hidden border-b border-[#AA66FF]/15">
        <TopoLineas className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 60% at 50% 45%, rgba(10,10,10,.88) 0%, rgba(10,10,10,.55) 58%, transparent 100%)' }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <motion.h1 {...entra()} className="heading text-4xl leading-[0.95] md:text-6xl">
            {t('titulo_1', 'GLOSARIO')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#AA66FF)' }}
            >
              {t('titulo_2', 'SIN JERGA')}
            </span>
          </motion.h1>
          <motion.p {...entra(0.1)} className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/80">
            {t('bajada', 'Los términos que aparecen cuando alguien habla de posicionamiento, explicados como se los explicaríamos a un cliente. Sin adornos y diciendo también lo que no son.')}
          </motion.p>

          {/* buscador */}
          <motion.div {...entra(0.18)} className="mx-auto mt-9 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-4 py-2.5">
            <Search size={17} className="shrink-0 text-white/40" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={t('buscador', 'Busca un término…')}
              className="w-full bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
              aria-label="Buscar en el glosario"
            />
            {busca && (
              <button onClick={() => setBusca('')} className="shrink-0 text-xs text-white/40 hover:text-white">
                limpiar
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------- términos */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          {filtrados ? (
            filtrados.length ? (
              <>
                <p className="mb-8 text-sm text-white/50">
                  {filtrados.length} {filtrados.length === 1 ? 'término' : 'términos'} para «{busca}»
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {filtrados.map((x) => (
                    <Ficha key={x.termino} t={x} />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="mb-4 text-white/60">No encontramos «{busca}» en el glosario.</p>
                <Link to="/contacto" className="text-[#AA66FF] hover:text-white">
                  Pregúntanos y lo añadimos →
                </Link>
              </div>
            )
          ) : (
            GLOSARIO.map((g, i) => (
              <div key={g.titulo} className={i ? 'mt-16' : ''}>
                <motion.h2 {...entra()} className="heading mb-8 text-2xl md:text-3xl">
                  {g.titulo}
                </motion.h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {g.terminos.map((x, j) => (
                    <motion.div key={x.termino} {...entra(Math.min(j * 0.05, 0.3))}>
                      <Ficha t={x} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- cierre */}
      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="heading mb-4 text-2xl text-[#0A0A0A] md:text-3xl">
            {t('cierre_titulo', '¿TE FALTÓ ALGUNO?')}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[#0A0A0A]/70">
            {t('cierre_texto', 'Si hay un término que no está y te lo encontraste en una propuesta, escríbenos. Lo explicamos y lo añadimos aquí.')}
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
          >
            {t('cierre_boton', 'PREGUNTAR')}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
