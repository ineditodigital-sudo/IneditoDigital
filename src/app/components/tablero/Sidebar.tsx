import { motion } from 'motion/react';
import {
  CalendarCheck, ClipboardList, FileText, Filter, LayoutDashboard,
  Search, Share2, Sparkles, type LucideIcon,
} from 'lucide-react';
import { EMPRESA } from './datos';

/*
 * La navegación del tablero.
 *
 * En escritorio va fija a la izquierda; en teléfono es el mismo componente
 * dentro de un cajón que entra desde el borde. Una sola lista, dos sitios: si
 * se agrega una sección, aparece en los dos sin tocar nada más.
 *
 * Va oscura en los dos temas, y por eso no usa las variables de tema sino sus
 * propios colores: es el marco, y un marco oscuro es lo que hace que el
 * contenido claro se lea como contenido. En el tema oscuro sigue funcionando
 * porque queda un escalón por encima del fondo de la página.
 */

const FONDO = '#10131E';
const ACTIVO = '#AA66FF';

export type Seccion = { id: string; nombre: string; Icono: LucideIcon };

export const SECCIONES: Seccion[] = [
  { id: 'resumen', nombre: 'Resumen', Icono: LayoutDashboard },
  { id: 'canales', nombre: 'Origen del tráfico', Icono: Share2 },
  { id: 'embudo', nombre: 'Del clic a la venta', Icono: Filter },
  { id: 'buscadores', nombre: 'Buscadores', Icono: Search },
  { id: 'ia', nombre: 'Visibilidad en IA', Icono: Sparkles },
  { id: 'auditoria', nombre: 'Auditoría', Icono: ClipboardList },
  { id: 'plan', nombre: 'Plan del mes', Icono: CalendarCheck },
];

export function Sidebar({
  activa,
  alIr,
  alGenerarReporte,
  className = '',
}: {
  activa: string;
  alIr: (id: string) => void;
  alGenerarReporte: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col border-r border-white/[.07] ${className}`}
      style={{ background: FONDO }}
    >
      {/* marca */}
      <div className="flex items-center gap-2.5 border-b border-white/[.07] px-4 py-4">
        <img src="/favicon-192.png" alt="" className="h-7 w-7 shrink-0" />
        <div className="min-w-0 leading-tight">
          <div className="text-[13px] font-bold tracking-tight text-white">INÉDITO</div>
          <div className="text-[10px] uppercase tracking-[.18em] text-white/40">Digital</div>
        </div>
      </div>

      {/* de quién es el tablero */}
      <div className="px-3 pt-3">
        <div className="rounded-xl border border-white/[.08] bg-white/[.04] px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[12.5px] font-semibold text-white">{EMPRESA.nombre}</span>
            <span className="shrink-0 rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-amber-300">
              Demo
            </span>
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-white/45">{EMPRESA.sector}</div>
        </div>
      </div>

      {/* secciones */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[.16em] text-white/30">
          Tu mes
        </div>
        <ul className="space-y-0.5">
          {SECCIONES.map(({ id, nombre, Icono }) => {
            const esta = activa === id;
            return (
              <li key={id}>
                <button
                  onClick={() => alIr(id)}
                  aria-current={esta ? 'true' : undefined}
                  className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                    esta ? 'font-semibold text-white' : 'text-white/55 hover:bg-white/[.05] hover:text-white/85'
                  }`}
                >
                  {esta && (
                    <motion.span
                      layoutId="seccion-activa"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(153,51,255,.16)' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span
                    className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r transition-opacity"
                    style={{ background: ACTIVO, opacity: esta ? 1 : 0 }}
                  />
                  <Icono
                    size={15}
                    strokeWidth={1.9}
                    className="relative shrink-0"
                    style={{ color: esta ? ACTIVO : undefined }}
                  />
                  <span className="relative truncate">{nombre}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* pie */}
      <div className="border-t border-white/[.07] p-3">
        <button
          onClick={alGenerarReporte}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(100deg, #7700CE, #9933FF)' }}
        >
          <FileText size={14} /> Generar reporte
        </button>
        <p className="mt-2.5 px-1 text-[10.5px] leading-snug text-white/30">
          Datos de demostración. No corresponden a ninguna empresa real.
        </p>
      </div>
    </div>
  );
}
