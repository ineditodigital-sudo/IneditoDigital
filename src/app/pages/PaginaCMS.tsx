import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { Check, ArrowRight, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import NotFoundPage from './NotFoundPage';
import { paginaDeBloques, Bloque } from '../cms';

/**
 * Dibuja las páginas que el cliente arma desde el panel.
 *
 * El cliente elige bloques y llena sus campos; el diseño lo pone este
 * archivo, con la tipografía, los colores y los redondeos del sitio. Nunca
 * llega HTML del panel, así que no hay forma de romper la maquetación.
 *
 * Los bloques vacíos no se dibujan: si un campo quedó sin llenar,
 * simplemente no aparece, en vez de dejar un hueco raro.
 */

const H2 = ({ children, oscuro = true }: { children: React.ReactNode; oscuro?: boolean }) => (
  <h2 className={`heading text-2xl md:text-4xl mb-6 leading-tight ${oscuro ? 'text-white' : 'text-black'}`}>{children}</h2>
);

function Seccion({ claro, children }: { claro?: boolean; children: React.ReactNode }) {
  return (
    <section className={`px-4 py-14 md:py-20 ${claro ? 'bg-white' : 'bg-[#07060B]'}`}>
      <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

const aparecer = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

function Portada({ d, cta }: { d: Record<string, string>; cta: () => void }) {
  return (
    <section className="relative px-4 pt-16 pb-14 md:pt-24 md:pb-20 bg-[#07060B] overflow-hidden">
      <motion.div
        className="absolute -top-1/4 left-1/4 w-[32rem] h-[32rem] rounded-full bg-[#7700CE]/20 blur-[130px] pointer-events-none"
        animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {d.etiqueta && (
            <span className="inline-block px-4 py-2 rounded-full border border-[#9933FF]/40 bg-[#9933FF]/10 text-[#CC66FF] text-xs font-bold tracking-[0.2em] mb-6">
              {d.etiqueta}
            </span>
          )}
          <h1 className="heading text-white leading-[1.1] mb-5">
            {d.titulo}
            {d.resaltado && (
              <>{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9933FF] to-[#CC66FF]">{d.resaltado}</span></>
            )}
          </h1>
          {d.bajada && <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">{d.bajada}</p>}
          {d.boton && (
            <button
              onClick={cta}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.45)] cursor-pointer"
            >
              <span className="heading text-sm tracking-[0.08em]">{d.boton}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Texto({ d }: { d: Record<string, string> }) {
  const claro = d.fondo === '1';
  if (!d.titulo && !d.texto) return null;
  return (
    <Seccion claro={claro}>
      <motion.div {...aparecer} className="max-w-3xl">
        {d.titulo && <H2 oscuro={!claro}>{d.titulo}</H2>}
        {d.texto && (
          <p className={`text-base md:text-lg leading-relaxed whitespace-pre-line ${claro ? 'text-gray-600' : 'text-white/55'}`}>{d.texto}</p>
        )}
      </motion.div>
    </Seccion>
  );
}

function TextoImagen({ d }: { d: Record<string, string> }) {
  const claro = d.fondo === '1';
  const derecha = d.derecha !== '0';
  if (!d.titulo && !d.texto && !d.imagen) return null;
  return (
    <Seccion claro={claro}>
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div {...aparecer} className={derecha ? '' : 'lg:order-last'}>
          {d.titulo && <H2 oscuro={!claro}>{d.titulo}</H2>}
          {d.texto && (
            <p className={`text-base md:text-lg leading-relaxed whitespace-pre-line ${claro ? 'text-gray-600' : 'text-white/55'}`}>{d.texto}</p>
          )}
        </motion.div>
        {d.imagen && (
          <motion.div {...aparecer} className="rounded-2xl overflow-hidden">
            <img src={d.imagen} alt={d.alt || ''} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        )}
      </div>
    </Seccion>
  );
}

function Puntos({ d }: { d: Record<string, string> }) {
  const items = [1, 2, 3, 4]
    .map((n) => ({ titulo: d[`p${n}_titulo`], texto: d[`p${n}_texto`] }))
    .filter((x) => x.titulo || x.texto);
  if (!items.length && !d.titulo) return null;
  return (
    <Seccion>
      {d.titulo && <motion.div {...aparecer}><H2>{d.titulo}</H2></motion.div>}
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={i}
            {...aparecer}
            transition={{ ...aparecer.transition, delay: i * 0.07 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#9933FF]/40 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center flex-shrink-0">
                <Check className="text-white" size={16} strokeWidth={3} />
              </div>
              <div>
                {it.titulo && <h3 className="heading text-base text-white mb-1.5">{it.titulo}</h3>}
                {it.texto && <p className="text-white/45 text-sm leading-relaxed whitespace-pre-line">{it.texto}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Seccion>
  );
}

function Cifras({ d }: { d: Record<string, string> }) {
  const items = [1, 2, 3].map((n) => ({ cifra: d[`cifra_${n}`], texto: d[`texto_${n}`] })).filter((x) => x.cifra);
  if (!items.length) return null;
  return (
    <Seccion claro>
      {d.titulo && <motion.div {...aparecer} className="text-center"><H2 oscuro={false}>{d.titulo}</H2></motion.div>}
      <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
        {items.map((it, i) => (
          <motion.div key={i} {...aparecer} transition={{ ...aparecer.transition, delay: i * 0.08 }}>
            <div className="heading text-4xl md:text-6xl text-[#7700CE] mb-1">{it.cifra}</div>
            {it.texto && <p className="text-gray-600 text-xs md:text-sm">{it.texto}</p>}
          </motion.div>
        ))}
      </div>
    </Seccion>
  );
}

function Pasos({ d }: { d: Record<string, string> }) {
  const items = [1, 2, 3, 4]
    .map((n) => ({ titulo: d[`paso_${n}_titulo`], texto: d[`paso_${n}_texto`] }))
    .filter((x) => x.titulo || x.texto);
  if (!items.length && !d.titulo) return null;
  return (
    <Seccion>
      {d.titulo && <motion.div {...aparecer}><H2>{d.titulo}</H2></motion.div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={i}
            {...aparecer}
            transition={{ ...aparecer.transition, delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#9933FF]/40 transition-colors"
          >
            <div className="heading text-4xl text-white/[0.08] mb-3">{String(i + 1).padStart(2, '0')}</div>
            {it.titulo && <h3 className="heading text-base text-white mb-2">{it.titulo}</h3>}
            {it.texto && <p className="text-white/45 text-sm leading-relaxed whitespace-pre-line">{it.texto}</p>}
          </motion.div>
        ))}
      </div>
    </Seccion>
  );
}

function Preguntas({ d }: { d: Record<string, string> }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const items = [1, 2, 3, 4].map((n) => ({ q: d[`p${n}`], a: d[`r${n}`] })).filter((x) => x.q);
  if (!items.length) return null;
  return (
    <Seccion claro>
      {d.titulo && <motion.div {...aparecer} className="text-center"><H2 oscuro={false}>{d.titulo}</H2></motion.div>}
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((it, i) => (
          <motion.div key={i} {...aparecer} transition={{ ...aparecer.transition, delay: i * 0.06 }}>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                onClick={() => setAbierta(abierta === i ? null : i)}
                aria-expanded={abierta === i}
                className="w-full flex items-start justify-between gap-4 text-left p-5"
              >
                <h3 className="heading text-sm md:text-base text-black flex-1 pr-4">{it.q}</h3>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7700CE]/10 flex items-center justify-center">
                  {abierta === i ? <Minus className="text-[#7700CE]" size={18} /> : <Plus className="text-[#7700CE]" size={18} />}
                </span>
              </button>
              {abierta === i && it.a && (
                <div className="px-5 pb-5"><p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">{it.a}</p></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Seccion>
  );
}

function Llamado({ d, cta }: { d: Record<string, string>; cta: () => void }) {
  if (!d.titulo && !d.texto) return null;
  return (
    <Seccion>
      <motion.div {...aparecer} className="relative rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] p-8 md:p-14 text-center overflow-hidden shadow-[0_20px_60px_rgba(119,0,206,0.3)]">
        {d.titulo && <h2 className="heading text-2xl md:text-4xl text-white mb-4 leading-tight">{d.titulo}</h2>}
        {d.texto && <p className="text-white/80 text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">{d.texto}</p>}
        {d.boton && (
          <button
            onClick={cta}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#7700CE] hover:bg-white/90 transition-all hover:scale-105 cursor-pointer"
          >
            <span className="heading text-sm tracking-[0.08em]">{d.boton}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </motion.div>
    </Seccion>
  );
}

export default function PaginaCMS() {
  const { slug } = useParams<{ slug: string }>();
  const { openAssistant } = useApp();
  const pagina = paginaDeBloques(slug || '');

  // Si esa dirección no corresponde a ninguna página creada, es un 404 normal.
  if (!pagina) return <NotFoundPage />;

  const cta = () => openAssistant(undefined, `cotizar desde la página ${pagina.nombre}`);
  const visibles = pagina.bloques.filter((b) => b.visible !== '0');

  return (
    <>
      <DynamicSEO title={pagina.seoTitle || pagina.nombre} description={pagina.seoDesc || ''} />
      <div className="bg-[#07060B]">
        {visibles.map((b: Bloque, i: number) => {
          const d = b.datos || {};
          switch (b.tipo) {
            case 'portada':      return <Portada key={i} d={d} cta={cta} />;
            case 'texto':        return <Texto key={i} d={d} />;
            case 'texto_imagen': return <TextoImagen key={i} d={d} />;
            case 'puntos':       return <Puntos key={i} d={d} />;
            case 'cifras':       return <Cifras key={i} d={d} />;
            case 'pasos':        return <Pasos key={i} d={d} />;
            case 'preguntas':    return <Preguntas key={i} d={d} />;
            case 'llamado':      return <Llamado key={i} d={d} cta={cta} />;
            default:             return null;   // tipo desconocido: se ignora
          }
        })}
      </div>
    </>
  );
}
