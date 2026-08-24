import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { Search, Layers, Settings2, Rocket } from 'lucide-react';
import { Escena } from './EscenasProceso';

/*
 * El proceso de un servicio, armandose con el scroll.
 *
 * Copiado en estructura de la pagina de tarjetas NFC, incluido lo que hacia
 * que aquella se sintiera viva y a esta le faltaba: al lado del texto hay algo
 * que SE VA ARMANDO paso a paso. Sin eso solo cambia un parrafo y la pantalla
 * parece congelada, por muy bien que funcione el sticky.
 *
 * Aqui el visual no puede ser el producto (cada servicio es distinto), asi que
 * es un lienzo abstracto que gana piezas: marco, luego estructura, luego
 * contenido, luego el resultado. La metafora sirve para cualquier servicio.
 */

const iconos = [Search, Layers, Settings2, Rocket];

/* ------------------------------------------------------------------ */

export function RecorridoProceso({
  slug,
  pasos,
  titulo,
  sello,
}: {
  slug: string;
  pasos: { step: number; title: string; description: string }[];
  titulo: ReactNode;
  sello: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  /* La barra de avance va por motion value: cambia en cada frame del scroll y
     con useState forzaria un re-render por frame. */
  const avance = useMotionValue(0);

  useEffect(() => {
    if (!pasos.length) return;
    const alScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(Math.max(-r.top / total, 0), 1);
      avance.set(p);
      const i = Math.min(Math.floor(p * pasos.length), pasos.length - 1);
      setActivo((prev) => (prev === i ? prev : i));
    };
    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alScroll);
    alScroll();
    return () => {
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
    };
  }, [pasos.length, avance]);

  if (!pasos.length) return null;

  const actual = pasos[activo];
  const Icono = iconos[activo % iconos.length];

  const cabecera = (
    <div className="mb-10 text-center">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[.3em] text-[#CC66FF]">{sello}</div>
      <h2 className="heading text-3xl md:text-5xl">{titulo}</h2>
    </div>
  );

  return (
    <>
      {/* ---- pantallas grandes: recorrido pegajoso ---- */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${pasos.length * 90}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container mx-auto w-full max-w-6xl px-4">
            {cabecera}
            <div className="mb-10 text-center text-xs text-white/30">
              Paso {activo + 1} de {pasos.length}
            </div>

            <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-8 xl:gap-14">
              {/* riel con numeros, pegado al texto */}
              <div className="relative h-56 w-px self-center bg-white/10">
                <motion.div
                  className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-[#9933FF] to-[#CC66FF]"
                  style={{ scaleY: avance }}
                />
                {pasos.map((p, i) => (
                  <div
                    key={p.step}
                    className="absolute -left-[7px] flex items-center gap-3"
                    style={{ top: `${(i / Math.max(pasos.length - 1, 1)) * 100}%`, transform: 'translateY(-50%)' }}
                  >
                    <span
                      className={`block h-[15px] w-[15px] rounded-full border transition-all duration-300 ${
                        i <= activo
                          ? 'border-[#CC66FF] bg-[#CC66FF]'
                          : 'border-white/20 bg-white/[.04]'
                      } ${i === activo ? 'scale-125 shadow-[0_0_12px_rgba(204,102,255,.7)]' : 'scale-100'}`}
                    />
                    <span
                      className={`heading text-[11px] tracking-[.2em] transition-colors duration-300 ${
                        i === activo ? 'text-[#CC66FF]' : 'text-white/25'
                      }`}
                    >
                      {String(p.step).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>

              {/* el texto: se remonta en cada paso, con desenfoque de entrada */}
              <div className="min-h-[16rem]">
                <motion.div
                  key={actual.step}
                  initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                      <Icono size={22} className="text-[#CC66FF]" />
                    </span>
                    <span
                      className="heading text-6xl leading-none text-transparent"
                      style={{ WebkitTextStroke: '1px rgba(204,102,255,.35)' }}
                    >
                      {String(actual.step).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="heading mb-4 text-3xl leading-tight xl:text-4xl">{actual.title}</h3>
                  <p className="max-w-md text-lg leading-relaxed text-white/75">{actual.description}</p>
                </motion.div>
              </div>

              {/* lo que se va armando: la escena propia de este servicio */}
              <Escena slug={slug} activo={activo} />
            </div>
          </div>
        </div>
      </div>

      {/* ---- movil: los mismos pasos, apilados ---- */}
      <div className="px-4 py-16 lg:hidden">
        <div className="container mx-auto max-w-2xl">
          {cabecera}
          <div className="space-y-8">
            {pasos.map((p, i) => {
              const Ic = iconos[i % iconos.length];
              return (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ duration: 0.55, delay: i * 0.06 }}
                  className="flex gap-5"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CC66FF]/35 bg-[#CC66FF]/12">
                      <Ic size={19} className="text-[#CC66FF]" />
                    </span>
                    {i < pasos.length - 1 && <span className="mt-2 w-px flex-1 bg-white/10" />}
                  </div>
                  <div className="pb-2">
                    <span className="heading mb-1 block text-xs tracking-[.2em] text-[#CC66FF]">
                      {String(p.step).padStart(2, '0')}
                    </span>
                    <h3 className="heading mb-2 text-xl leading-tight">{p.title}</h3>
                    <p className="text-[15px] leading-relaxed text-white/75">{p.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
