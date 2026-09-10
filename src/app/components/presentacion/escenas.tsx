import { useRef } from 'react';
import { motion } from 'motion/react';

/*
 * La onda de la casa, que va detrás de todas las láminas.
 *
 * Aquí vivían tambien las nueve escenas de servicio, hechas con motion y un
 * setInterval que iba saltando de paso en paso. Se fueron a src/remotion: una
 * linea de tiempo por cuadros permite solapar gestos y afinar el ritmo, cosa
 * que una maquina de pasos no permite, y de paso las mismas escenas se pueden
 * exportar a video. Esta se queda porque es fondo, no explica ningun servicio
 * y no tiene que exportarse a nada.
 */

const SAL = [0.23, 1, 0.32, 1] as const;

export function EscenaOnda({ activo }: { activo: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const lineas = 11;
  return (
    <div className="relative aspect-[4/3] w-full">
      <svg
        ref={ref}
        viewBox="0 0 400 300"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {Array.from({ length: lineas }).map((_, i) => {
          const y = 40 + i * 22;
          const amp = 14 + Math.sin(i * 0.8) * 8;
          const d = `M -20 ${y} C 80 ${y - amp}, 160 ${y + amp}, 240 ${y - amp * 0.6} S 380 ${y + amp * 0.5}, 420 ${y}`;
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="var(--p-onda)"
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={activo ? { pathLength: 1, opacity: 0.65 - i * 0.03 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.1, delay: i * 0.055, ease: SAL }}
            />
          );
        })}
      </svg>
    </div>
  );
}
