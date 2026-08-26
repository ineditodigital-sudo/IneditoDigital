import { useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

/*
 * La ventana del tablero.
 *
 * La usan el generador de reporte y cada gráfica ampliada, así que el
 * comportamiento —Escape, clic fuera, bloquear el scroll de atrás— vive en un
 * solo lugar. Antes estaba escrito dentro del reporte y habría terminado
 * duplicado siete veces.
 *
 * El padre decide cuándo montarla, envuelta en AnimatePresence.
 */

export function Modal({
  alCerrar,
  titulo,
  sub,
  children,
  pie,
  ancho = 'max-w-3xl',
  claseCaja = '',
  claseFondo = '',
}: {
  alCerrar: () => void;
  titulo: string;
  sub?: string;
  children: ReactNode;
  pie?: ReactNode;
  ancho?: string;
  /** Para las clases de impresión del reporte. */
  claseCaja?: string;
  claseFondo?: string;
}) {
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => e.key === 'Escape' && alCerrar();
    window.addEventListener('keydown', alPulsar);
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', alPulsar);
      document.body.style.overflow = previo;
    };
  }, [alCerrar]);

  return (
    <div className={`fixed inset-0 z-[100] overflow-y-auto bg-slate-900/45 backdrop-blur-sm ${claseFondo}`}>
      {/* Capa de cierre: va detrás y ocupa todo, así el clic fuera cierra sin
          tener que comparar el objetivo del evento contra el contenido. */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={alCerrar}
        className="fixed inset-0 h-full w-full cursor-default no-imprimir"
        tabIndex={-1}
      />
      <div className="pointer-events-none relative min-h-full px-0 py-0 sm:px-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
          className={`pointer-events-auto mx-auto min-h-screen w-full ${ancho} overflow-hidden bg-[var(--t-tarjeta)] shadow-2xl sm:min-h-0 sm:rounded-2xl ${claseCaja}`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--t-borde-suave)] px-5 py-3.5 no-imprimir">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-[var(--t-txt)]">{titulo}</div>
              {sub && <p className="text-[12.5px] leading-snug text-[var(--t-txt-3)]">{sub}</p>}
            </div>
            <button
              onClick={alCerrar}
              className="shrink-0 rounded-lg p-1.5 text-[var(--t-txt-3)] transition-colors hover:bg-[var(--t-pista)] hover:text-[var(--t-txt-2)]"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>

          {children}

          {pie && (
            <div className="flex flex-wrap gap-2 border-t border-[var(--t-borde-suave)] px-5 py-4 sm:px-6 no-imprimir">{pie}</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/** La tabla con los números de atrás de cada gráfica ampliada. */
export function TablaDatos({
  columnas,
  filas,
}: {
  columnas: string[];
  filas: (string | number)[][];
}) {
  return (
    <>
      {columnas.length > 3 && (
        <p className="mb-1.5 text-[11px] text-[var(--t-txt-3)] sm:hidden">
          Desliza la tabla para ver el resto de las columnas.
        </p>
      )}
      <div className="max-h-64 overflow-auto rounded-xl border border-[var(--t-borde)]">
      <table className="w-full text-left text-[12.5px]">
        <thead className="sticky top-0 bg-[var(--t-suave)]">
          <tr className="text-[10.5px] uppercase tracking-wider text-[var(--t-txt-3)]">
            {columnas.map((c, i) => (
              <th key={c} className={`px-3 py-2 font-medium ${i ? 'text-right' : ''}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i} className="border-t border-[var(--t-borde-suave)]">
              {f.map((v, j) => (
                <td
                  key={j}
                  className={`px-3 py-1.5 tabular-nums ${j ? 'text-right text-[var(--t-txt)]' : 'text-[var(--t-txt-2)]'}`}
                >
                  {typeof v === 'number' ? v.toLocaleString('es-MX') : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
