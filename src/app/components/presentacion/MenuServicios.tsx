import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { UI, type Idioma, type Lamina } from './contenido';

/*
 * El índice de servicios.
 *
 * En una junta el cliente pregunta por un servicio concreto —«¿y lo de los
 * espectaculares?»— y avanzar seis láminas con la flecha delante de él se ve
 * mal. Esto salta directo.
 *
 * Detalles que hacen que se sienta bien y que no se ven:
 *
 * El panel crece DESDE el botón que lo abrió (transform-origin arriba a la
 * derecha), no desde el centro de la pantalla. Es la diferencia entre que algo
 * se despliegue y que algo aparezca de la nada.
 *
 * Arranca en 0.96 y no en 0: nada en el mundo real aparece de la nada, y una
 * escala desde cero se lee como un parpadeo.
 *
 * Sale más rápido de lo que entra (150 ms contra 220). Al abrir el usuario
 * está decidiendo y mirando; al cerrar ya decidió y quiere el contenido.
 *
 * Las filas entran escalonadas a 26 ms. Más lento que eso y el menú se siente
 * pesado justo cuando lo que se quiere es ir rápido a un servicio.
 */

const SAL = [0.23, 1, 0.32, 1] as const;

export default function MenuServicios({
  laminas,
  abierto,
  cerrar,
  ir,
  actual,
  idioma,
}: {
  /** Las que se ven, en su orden: las mismas que recorren las flechas. */
  laminas: Lamina[];
  abierto: boolean;
  cerrar: () => void;
  ir: (n: number) => void;
  actual: number;
  idioma: Idioma;
}) {
  const panel = useRef<HTMLDivElement>(null);

  /* Escape cierra, y el foco entra al panel para que el teclado siga sirviendo:
     esto se navega con flechas y sería raro perder el hilo al abrir el índice. */
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        cerrar();
      }
    };
    addEventListener('keydown', alPulsar, true);
    panel.current?.focus();
    return () => removeEventListener('keydown', alPulsar, true);
  }, [abierto, cerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* El velo. Solo opacidad: es lo único que se puede animar sin pintar
              de nuevo una pantalla completa, y aquí cubre todo. */}
          <motion.button
            aria-label={UI.cerrar[idioma]}
            onClick={cerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'linear' }}
            className="fixed inset-0 z-40 cursor-default"
            style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(3px)' }}
          />

          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={UI.indice[idioma]}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6, transition: { duration: 0.15, ease: SAL } }}
            transition={{ duration: 0.22, ease: SAL }}
            style={{
              transformOrigin: 'top right',
              background: 'var(--p-fondo)',
              borderColor: 'var(--p-linea)',
            }}
            className="fixed right-3 top-3 z-50 w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-3xl border shadow-2xl outline-none md:right-6 md:top-6"
          >
            <div
              className="flex items-center justify-between border-b px-5 py-3.5"
              style={{ borderColor: 'var(--p-linea)' }}
            >
              <span
                className="font-mono text-[10.5px] uppercase tracking-[.22em]"
                style={{ color: 'var(--p-mudo)' }}
              >
                {UI.indice[idioma]}
              </span>
              <button
                onClick={cerrar}
                aria-label={UI.cerrar[idioma]}
                className="-mr-1.5 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 active:scale-90"
                style={{ color: 'var(--p-suave)' }}
              >
                <X size={17} />
              </button>
            </div>

            <ul className="max-h-[min(70vh,560px)] overflow-y-auto overscroll-contain py-2">
              {laminas.map((l, n) => {
                const aqui = n === actual;
                return (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.04 + n * 0.026, ease: SAL }}
                  >
                    <button
                      onClick={() => {
                        ir(n);
                        cerrar();
                      }}
                      aria-current={aqui ? 'true' : undefined}
                      className="flex w-full items-center gap-3.5 px-5 py-2.5 text-left transition-colors duration-150 active:scale-[0.99]"
                      style={{ background: aqui ? 'var(--p-moradoSuave)' : 'transparent' }}
                    >
                      <span
                        className="w-6 shrink-0 font-mono text-[11px] tabular-nums"
                        style={{ color: aqui ? 'var(--p-morado)' : 'var(--p-mudo)' }}
                      >
                        {String(n + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="heading flex-1 text-[13.5px] leading-tight"
                        style={{ color: aqui ? 'var(--p-morado)' : 'var(--p-tinta)' }}
                      >
                        {l.nombre[idioma].replace(/\n/g, ' ')}
                      </span>
                      {aqui && (
                        <Check size={14} strokeWidth={3} style={{ color: 'var(--p-morado)' }} />
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
