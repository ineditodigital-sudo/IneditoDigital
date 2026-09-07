import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, TrendingDown, TrendingUp, ShoppingCart } from 'lucide-react';

/*
 * Una escena por servicio de IA.
 *
 * La esfera de red servia para decir «inteligencia artificial» y no decia nada
 * mas: era la misma en las cuatro paginas. Aqui cada una enseña LO QUE HACE su
 * servicio, que es lo unico que justifica una animacion en una pagina de venta.
 *
 *   WhatsApp   la conversacion que se contesta sola a las 23:47
 *   Ventas     la lista de prospectos ordenandose por probabilidad
 *   Marketing  el presupuesto moviendose de la campaña que no rinde a la que si
 *   Ecommerce  el carrito abandonado que vuelve
 *
 * Dos reglas de la casa:
 *  - El texto no se anima. Las etiquetas de cada escena estan completas desde
 *    el primer cuadro; lo que se mueve son las piezas alrededor.
 *  - Con prefers-reduced-motion la escena se queda en su ultimo paso, que es
 *    el que cuenta el resultado. Nadie pierde informacion por no ver el baile.
 *
 * Son graficos, no contenido: van con aria-label y el interior oculto al
 * lector de pantalla.
 */

/**
 * El paso actual de un ciclo, o el ultimo si el sistema pide quietud.
 *
 * La preferencia se ESCUCHA, no se consulta una vez al montar. Consultarla una
 * sola vez deja la escena congelada para siempre si en ese instante estaba
 * activa —le pasa al panel de vista previa, que la enciende mientras carga— y
 * tampoco reacciona si alguien la cambia en el sistema con la pagina abierta.
 */
function usePaso(total: number, ms = 1500) {
  const [paso, setPaso] = useState(0);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let t: ReturnType<typeof setInterval> | undefined;
    let enPantalla = true;

    const aplicar = () => {
      clearInterval(t);
      if (mq.matches) {
        setPaso(total - 1); // el ultimo paso es el que cuenta el resultado
        return;
      }
      /* Igual que la esfera de la portada: el ciclo solo corre si la escena
         esta a la vista y la pestaña visible. Una animacion que nadie mira
         gasta bateria y nada mas. */
      if (!enPantalla || document.hidden) return;
      t = setInterval(() => setPaso((p) => (p + 1) % total), ms);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        enPantalla = e.isIntersecting;
        aplicar();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    if (caja.current) io.observe(caja.current);

    aplicar();
    mq.addEventListener('change', aplicar);
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      clearInterval(t);
      io.disconnect();
      mq.removeEventListener('change', aplicar);
      document.removeEventListener('visibilitychange', aplicar);
    };
  }, [total, ms]);

  return { paso, caja };
}

function Lienzo({
  etiqueta,
  caja,
  children,
}: {
  etiqueta: string;
  caja: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={caja}
      role="img"
      aria-label={etiqueta}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10"
      style={{ background: 'linear-gradient(160deg, rgba(119,0,206,.14), rgba(255,255,255,.02) 62%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.35) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
        }}
      />
      <div aria-hidden="true" className="relative flex h-full flex-col justify-center gap-3 p-5 md:p-7">
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════ WhatsApp
   La conversacion que no espera a mañana. Lo que cuenta la escena es la hora:
   la pregunta y la respuesta llevan la misma. */

export function EscenaWhatsApp() {
  const { paso, caja } = usePaso(4, 1400);

  return (
    <Lienzo etiqueta="Una consulta que llega a las 23:47 y se contesta al momento" caja={caja}>
      <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[.16em] text-white/35">
        <Clock size={13} className="text-[#CC66FF]" />
        23:47
      </div>

      {/* la pregunta del cliente */}
      <motion.div
        initial={false}
        animate={{ opacity: paso >= 0 ? 1 : 0, y: paso >= 0 ? 0 : 10 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white/[.07] px-4 py-3"
      >
        <p className="text-[13px] leading-snug text-white/80">¿Todavía tienen disponible?</p>
      </motion.div>

      {/* escribiendo… */}
      <motion.div
        animate={{ opacity: paso === 1 ? 1 : 0, height: paso === 1 ? 'auto' : 0 }}
        transition={{ duration: 0.25 }}
        className="flex gap-1 self-end overflow-hidden pr-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#CC66FF]"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>

      {/* la respuesta */}
      <motion.div
        animate={{
          opacity: paso >= 2 ? 1 : 0,
          y: paso >= 2 ? 0 : 12,
          scale: paso >= 2 ? 1 : 0.96,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[85%] self-end rounded-2xl rounded-br-sm px-4 py-3"
        style={{ background: 'linear-gradient(120deg,#7700CE,#9933FF)' }}
      >
        <p className="text-[13px] leading-snug text-white">
          Sí, quedan tres. ¿Te aparto uno para mañana?
        </p>
      </motion.div>

      <motion.div
        animate={{ opacity: paso >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-1 flex items-center justify-end gap-1.5 text-[11px] text-[#00E585]"
      >
        <Check size={13} strokeWidth={3} />
        Contestado en 4 segundos
      </motion.div>
    </Lienzo>
  );
}

/* ══════════════════════════════════════════════════ Ventas
   La lista deja de estar por orden de llegada y se ordena por probabilidad
   real. El movimiento ES el servicio. */

const PROSPECTOS = [
  { nombre: 'Constructora del Bajío', pts: 92 },
  { nombre: 'Clínica Santa Fe', pts: 74 },
  { nombre: 'Contacto sin empresa', pts: 21 },
  { nombre: 'Distribuidora Norte', pts: 58 },
];

export function EscenaVentas() {
  const { paso, caja } = usePaso(2, 2200);
  const orden = paso === 0 ? [0, 1, 2, 3] : [0, 1, 3, 2];
  const ordenados = paso === 1;

  return (
    <Lienzo etiqueta="Una lista de prospectos que se ordena por probabilidad de cierre" caja={caja}>
      <div className="mb-1 text-[11px] uppercase tracking-[.16em] text-white/35">
        {ordenados ? 'Por probabilidad de cierre' : 'Por orden de llegada'}
      </div>

      <div className="relative flex flex-col gap-2">
        {PROSPECTOS.map((p, i) => {
          const pos = orden.indexOf(i);
          const primero = ordenados && pos === 0;
          return (
            <motion.div
              key={p.nombre}
              /* El reordenamiento sale de cambiar el `order` del flex; `layout`
                 mide antes y despues y anima el salto. */
              layout
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              style={{ order: pos }}
              className={`rounded-xl border px-3.5 py-2.5 transition-colors duration-500 ${
                primero ? 'border-[#CC66FF]/45 bg-[#7700CE]/20' : 'border-white/10 bg-white/[.04]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[13px] text-white/85">{p.nombre}</span>
                <span
                  className={`shrink-0 text-[12px] tabular-nums ${
                    primero ? 'text-[#CC66FF]' : 'text-white/40'
                  }`}
                >
                  {p.pts}
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.07]">
                <div
                  className="h-full rounded-full transition-[width,background-color] ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{
                    width: ordenados ? `${p.pts}%` : '18%',
                    background: primero ? '#CC66FF' : 'rgba(255,255,255,.28)',
                    transitionDuration: '700ms',
                    transitionDelay: `${i * 50}ms`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Lienzo>
  );
}

/* ══════════════════════════════════════════════════ Marketing
   El presupuesto se va de la campaña que dejo de rendir a la que rinde. Lo que
   se ve moverse es dinero, que es de lo que trata la seccion. */

const CAMPANAS = [
  { nombre: 'Búsqueda · marca', antes: 34, despues: 52 },
  { nombre: 'Display · genérico', antes: 41, despues: 14 },
  { nombre: 'Video · retargeting', antes: 25, despues: 34 },
];

export function EscenaMarketing() {
  const { paso, caja } = usePaso(2, 2400);
  const optimizado = paso === 1;

  return (
    <Lienzo etiqueta="El presupuesto moviéndose hacia la campaña que sí trae clientes" caja={caja}>
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[.16em] text-white/35">
        <span>Reparto del presupuesto</span>
        <motion.span
          animate={{ opacity: optimizado ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1 text-[#00E585]"
        >
          <TrendingUp size={12} strokeWidth={2.6} />
          ajustado
        </motion.span>
      </div>

      <div className="flex flex-col gap-4">
        {CAMPANAS.map((c, i) => {
          const v = optimizado ? c.despues : c.antes;
          const cae = c.despues < c.antes;
          return (
            <div key={c.nombre}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="truncate text-[12.5px] text-white/70">{c.nombre}</span>
                <span className="flex shrink-0 items-center gap-1 text-[12px] tabular-nums text-white/45">
                  {optimizado && cae && <TrendingDown size={11} className="text-white/30" />}
                  {v}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[.06]">
                <div
                  className="h-full rounded-full transition-[width] ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{
                    width: `${v}%`,
                    background:
                      optimizado && cae
                        ? 'rgba(255,255,255,.22)'
                        : 'linear-gradient(90deg,#7700CE,#CC66FF)',
                    transitionDuration: '850ms',
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Lienzo>
  );
}

/* ══════════════════════════════════════════════════ E-commerce
   Un carrito se queda sin pagar y vuelve. Siete de cada diez se quedan, y
   recuperar una parte es de lo que vive esta pagina. */

export function EscenaEcommerce() {
  const { paso, caja } = usePaso(3, 1700);

  return (
    <Lienzo etiqueta="Un carrito abandonado que se recupera" caja={caja}>
      <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[.16em] text-white/35">
        <ShoppingCart size={13} className={paso === 2 ? 'text-[#00E585]' : 'text-[#CC66FF]'} />
        {paso === 0 ? 'Carrito activo' : paso === 1 ? 'Abandonado hace 1 h' : 'Recuperado'}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: paso === 1 ? 0.28 : 1,
              scale: paso === 2 && i === 1 ? 1.04 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            className="aspect-square rounded-xl border border-white/10"
            style={{
              background:
                paso === 2 && i === 1
                  ? 'linear-gradient(140deg,#7700CE,#9933FF)'
                  : 'rgba(255,255,255,.05)',
            }}
          />
        ))}
      </div>

      <div className="mt-3 h-px w-full bg-white/10" />

      {/* el mensaje que lo trae de vuelta */}
      <motion.div
        animate={{
          opacity: paso >= 1 ? 1 : 0,
          y: paso >= 1 ? 0 : 8,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 rounded-xl border border-white/10 bg-white/[.05] px-3.5 py-2.5"
      >
        <p className="text-[12.5px] leading-snug text-white/75">
          Se quedó algo en tu carrito. ¿Te lo apartamos?
        </p>
      </motion.div>

      <motion.div
        animate={{ opacity: paso === 2 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-2 flex items-center gap-1.5 text-[11px] text-[#00E585]"
      >
        <Check size={13} strokeWidth={3} />
        Compra completada
      </motion.div>
    </Lienzo>
  );
}
