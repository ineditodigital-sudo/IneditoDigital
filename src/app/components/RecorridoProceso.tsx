import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { Search, Layers, Settings2, Rocket, Check } from 'lucide-react';

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
/* El lienzo que se arma. Cada pieza entra cuando su paso llega.       */
/* ------------------------------------------------------------------ */
function Lienzo({ activo }: { activo: number }) {
  const pieza = (n: number) => ({
    initial: { opacity: 0, y: 14, scale: 0.96 },
    animate: activo >= n ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.96 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* halo que crece con el avance */}
      <motion.div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[#7700CE]/25 blur-[60px]"
        animate={{ opacity: 0.25 + activo * 0.2 }}
        transition={{ duration: 0.6 }}
      />

      <motion.div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/12 p-5"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02))' }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* barrido continuo: da sensacion de trabajo en curso */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-24"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(204,102,255,.16), transparent)' }}
          animate={{ y: ['-20%', '420%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* cabecera del lienzo: siempre */}
        <div className="mb-5 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <motion.span
            className="ml-auto h-1.5 w-16 rounded-full bg-[#CC66FF]/50"
            animate={{ width: `${20 + activo * 14}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* paso 2: aparece la estructura */}
        <div className="flex gap-4">
          <motion.div {...pieza(1)} className="h-20 w-14 shrink-0 rounded-lg border border-[#CC66FF]/25 bg-[#CC66FF]/10" />
          <div className="flex-1 space-y-2.5 pt-1">
            {[100, 78, 88].map((w, i) => (
              <motion.div
                key={i}
                {...pieza(1)}
                transition={{ duration: 0.5, delay: activo >= 1 ? i * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
                className="h-2 rounded-full bg-white/15"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>

        {/* paso 3: se llena de contenido */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              {...pieza(2)}
              transition={{ duration: 0.5, delay: activo >= 2 ? i * 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
              className="h-14 rounded-lg border border-white/10"
              style={{ background: 'linear-gradient(140deg, rgba(119,0,206,.3), rgba(255,255,255,.03))' }}
            />
          ))}
        </div>

        {/* paso 4: el resultado */}
        <motion.div
          {...pieza(3)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#CC66FF]/40 bg-[#CC66FF]/15 px-3 py-1.5 backdrop-blur"
        >
          <Check size={13} className="text-[#CC66FF]" strokeWidth={3} />
          <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#CC66FF]">Listo</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function RecorridoProceso({
  pasos,
  titulo,
  sello,
}: {
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

              {/* lo que se va armando */}
              <Lienzo activo={activo} />
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
