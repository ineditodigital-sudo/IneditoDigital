import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Mail, Printer, RotateCcw } from 'lucide-react';
import {
  CONSULTAS, EMPRESA, HALLAZGOS, PUNTAJE, SECCIONES_REPORTE, VISIBILIDAD_IA,
  miles, pesosLargo, porSemana, resumen, type Periodo,
} from './datos';
import { Etiqueta, MORADO } from './piezas';
import { Modal } from './Modal';
import { LogoIA } from '../LogosIA';

/*
 * El generador de reporte.
 *
 * En la expo esta es la parte que se enseña: no basta con decir "te mandamos
 * un reporte", hay que verlo salir. Por eso el armado tiene pasos con nombre
 * y tarda a proposito un momento —es lo que de verdad ocurre por detras— y
 * termina en un documento que se puede imprimir o guardar como PDF ahí mismo.
 */

/** Cuantas preguntas de compra se le hacen a cada modelo por semana. */
const PREGUNTAS = 40;

const PASOS = [
  'Leyendo Search Console y Analytics',
  'Cruzando campañas con ventas cerradas',
  'Revisando la ficha de Google y las reseñas',
  'Preguntando a los modelos de IA por tu categoría',
  'Ordenando hallazgos por lo que cuesta cada uno',
  'Redactando el plan del mes',
];

type Fase = 'ajustes' | 'armando' | 'listo';

export function Reporte({
  periodo,
  alCerrar,
}: {
  periodo: Periodo;
  alCerrar: () => void;
}) {
  const [fase, setFase] = useState<Fase>('ajustes');
  const [paso, setPaso] = useState(0);
  const [elegidas, setElegidas] = useState<string[]>(SECCIONES_REPORTE.map((s) => s.id));
  const [correo, setCorreo] = useState('direccion@tuempresa.mx');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (fase !== 'armando') return;
    const t = window.setInterval(() => {
      setPaso((p) => {
        if (p + 1 >= PASOS.length) {
          window.clearInterval(t);
          window.setTimeout(() => setFase('listo'), 420);
          return p + 1;
        }
        return p + 1;
      });
    }, 480);
    return () => window.clearInterval(t);
  }, [fase]);

  const alternar = (id: string) =>
    setElegidas((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  return (
    <Modal
      alCerrar={alCerrar}
      titulo={fase === 'listo' ? 'Tu reporte está listo' : 'Generar reporte'}
      sub={fase === 'listo' ? 'Así llega cada mes a tu correo' : `Últimos ${periodo} días · ${EMPRESA.nombre}`}
      claseCaja="zona-imprimible"
      claseFondo="no-imprimir-fondo"
    >
      <AnimatePresence mode="wait">
        {fase === 'ajustes' && (
          <motion.div
            key="ajustes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-5 sm:px-6"
          >
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--t-txt-3)]">
              Qué incluir
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SECCIONES_REPORTE.map((s) => {
                const activa = elegidas.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => alternar(s.id)}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                      activa
                        ? 'border-[#7700CE]/35 bg-[#7700CE]/[.05]'
                        : 'border-[var(--t-borde)] bg-[var(--t-tarjeta)] hover:border-[var(--t-borde)]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        activa ? 'border-transparent text-white' : 'border-slate-300'
                      }`}
                      style={{ background: activa ? MORADO : 'transparent', width: 18, height: 18 }}
                    >
                      {activa && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium leading-tight text-[var(--t-txt)]">
                        {s.nombre}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-[var(--t-txt-3)]">{s.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="mt-5 block">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--t-txt-3)]">
                Enviar a
              </span>
              <input
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--t-borde)] px-3.5 py-2.5 text-[14px] text-[var(--t-txt)] outline-none transition-colors focus:border-[#7700CE]"
              />
            </label>

            <button
              onClick={() => { setPaso(0); setFase('armando'); }}
              disabled={!elegidas.length}
              className="mt-5 w-full rounded-xl px-5 py-3 text-[14px] font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: `linear-gradient(100deg, ${MORADO}, #9933FF)` }}
            >
              Generar reporte
            </button>
          </motion.div>
        )}

        {fase === 'armando' && (
          <motion.div
            key="armando"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-8 sm:px-6"
          >
            <div className="mx-auto max-w-md space-y-2.5">
              {PASOS.map((p, i) => {
                const hecho = i < paso;
                const activo = i === paso;
                return (
                  <div
                    key={p}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      activo ? 'bg-[#7700CE]/[.06]' : ''
                    }`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {hecho ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                        >
                          <Check size={12} strokeWidth={3} />
                        </motion.span>
                      ) : activo ? (
                        <Loader2 size={16} className="animate-spin" style={{ color: MORADO }} />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-200" />
                      )}
                    </span>
                    <span
                      className={`text-[13.5px] ${
                        hecho ? 'text-[var(--t-txt-3)]' : activo ? 'font-medium text-[var(--t-txt)]' : 'text-[var(--t-txt-3)]'
                      }`}
                    >
                      {p}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mx-auto mt-6 h-1.5 max-w-md overflow-hidden rounded-full bg-[var(--t-pista)]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${MORADO}, #CC66FF)` }}
                animate={{ width: `${(paso / PASOS.length) * 100}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {fase === 'listo' && (
          <motion.div key="listo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Documento periodo={periodo} elegidas={elegidas} />

            <div className="flex flex-wrap gap-2 border-t border-[var(--t-borde-suave)] px-5 py-4 sm:px-6 no-imprimir">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(100deg, ${MORADO}, #9933FF)` }}
              >
                <Printer size={15} /> Imprimir o guardar en PDF
              </button>
              <button
                onClick={() => setEnviado(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--t-borde)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--t-txt-2)] transition-colors hover:bg-[var(--t-suave)]"
              >
                {enviado ? <Check size={15} className="text-emerald-600" /> : <Mail size={15} />}
                {enviado ? `Enviado a ${correo}` : 'Enviar por correo'}
              </button>
              <button
                onClick={() => { setEnviado(false); setFase('ajustes'); }}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-[var(--t-txt-3)] transition-colors hover:text-[var(--t-txt)]"
              >
                <RotateCcw size={15} /> Cambiar secciones
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

/* ------------------------------------------------------------ documento */

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-slate-100 px-6 py-5 evitar-corte">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">{titulo}</h3>
      {children}
    </section>
  );
}

function Documento({ periodo, elegidas }: { periodo: Periodo; elegidas: string[] }) {
  const d = resumen(periodo);
  const semanas = porSemana(d.dias);
  const hoy = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const tiene = (id: string) => elegidas.includes(id);
  const criticos = HALLAZGOS.filter((h) => h.gravedad === 'critico');

  return (
    <div className="documento bg-white text-slate-900">
      {/* portada */}
      <div className="px-6 py-7 text-white" style={{ background: `linear-gradient(115deg, ${MORADO}, #4B0082)` }}>
        <div className="flex items-center gap-2.5">
          <img src="/favicon-192.png" alt="" className="h-6 w-6" />
          <span className="text-[12px] font-semibold uppercase tracking-[.18em] text-white/75">
            Inédito Digital
          </span>
        </div>
        <div className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">
          Reporte de {EMPRESA.nombre}
        </div>
        <p className="mt-1.5 text-[13.5px] text-white/70">
          Últimos {periodo} días · generado el {hoy}
        </p>
      </div>

      {tiene('resumen') && (
        <Bloque titulo="Resumen ejecutivo">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Contactos', miles(d.leads), d.cambio.leads],
              ['Ventas cerradas', miles(d.ventas), d.cambio.ventas],
              ['Ingreso atribuido', pesosLargo(d.ingresos), d.cambio.ingresos],
              ['Retorno de pauta', `${d.retorno}x`, d.cambio.retorno],
            ].map(([n, v, c]) => (
              <div key={n as string} className="rounded-xl bg-slate-50 p-3">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{n}</div>
                <div className="mt-1 text-[17px] font-bold tabular-nums text-slate-900">{v}</div>
                <div className={`text-[11.5px] font-semibold ${(c as number) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(c as number) >= 0 ? '+' : ''}{c}% vs. periodo anterior
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-[13.5px] leading-relaxed text-slate-600">
            El periodo cierra con <strong className="text-slate-900">{miles(d.leads)} contactos</strong> y{' '}
            <strong className="text-slate-900">{d.ventas} ventas</strong> atribuidas, {pesosLargo(d.ingresos)} de
            ingreso contra {pesosLargo(d.inversion)} invertidos en pauta. El costo por contacto quedó en{' '}
            {pesosLargo(d.costoPorLead)}.
          </p>
        </Bloque>
      )}

      {tiene('canales') && (
        <Bloque titulo="De dónde llegó la gente">
          <div className="flex h-24 items-end gap-1.5">
            {semanas.map((s, i) => {
              const alto = (s.organico + s.ads + s.ia) /
                Math.max(...semanas.map((x) => x.organico + x.ads + x.ia));
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${alto * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  className="flex-1 rounded-t"
                  style={{ background: `linear-gradient(180deg, #AA66FF, ${MORADO})` }}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
            La búsqueda orgánica sigue siendo el canal principal. El tráfico que llega desde respuestas de IA
            pasó de no existir a ser el tercer canal del periodo.
          </p>
        </Bloque>
      )}

      {tiene('embudo') && (
        <Bloque titulo="Del clic a la venta">
          <p className="mb-2 text-[11px] text-slate-400">
            Barras a escala comprimida para que se vean los pasos chicos. Los números son los reales.
          </p>
          <div className="space-y-1.5">
            {[
              ['Sesiones', d.sesiones],
              ['Contactos', d.leads],
              ['Oportunidades', d.oportunidades],
              ['Ventas', d.ventas],
            ].map(([n, v], i, todo) => (
              <div key={n as string} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[12.5px] text-slate-500">{n}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-slate-100">
                  <motion.div
                    className="h-full rounded"
                    style={{ background: `linear-gradient(90deg, ${MORADO}, #CC66FF)`, opacity: 1 - i * 0.16 }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max(8, Math.pow((v as number) / (todo[0][1] as number), 0.4) * 100)}%`,
                    }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-slate-900">
                  {miles(v as number)}
                </span>
              </div>
            ))}
          </div>
        </Bloque>
      )}

      {tiene('buscadores') && (
        <Bloque titulo="Buscadores">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-1.5 font-medium">Consulta</th>
                <th className="pb-1.5 text-right font-medium">Clics</th>
                <th className="pb-1.5 text-right font-medium">Posición</th>
              </tr>
            </thead>
            <tbody>
              {CONSULTAS.slice(0, 5).map((c) => (
                <tr key={c.texto} className="border-t border-slate-100">
                  <td className="py-1.5 pr-3 text-slate-700">{c.texto}</td>
                  <td className="py-1.5 text-right tabular-nums text-slate-900">{c.clics}</td>
                  <td className="py-1.5 text-right tabular-nums">
                    <span className="font-semibold text-slate-900">{c.posicion}</span>
                    <span className="ml-1 text-[11px] text-emerald-600">↑{(c.antes - c.posicion).toFixed(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Bloque>
      )}

      {tiene('ia') && (
        <Bloque titulo="Visibilidad en IA">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {VISIBILIDAD_IA.map((v) => (
              <div key={v.nombre} className="rounded-xl bg-slate-900 p-3 text-center">
                <div className="flex h-5 items-center justify-center">
                  <LogoIA marca={v.marca} alto={14} />
                </div>
                <div className="mt-2 text-[19px] font-bold tabular-nums text-white">{v.presencia}%</div>
                <div className="text-[10.5px] text-white/45">antes {v.antes}%</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
            Porcentaje de respuestas donde la marca aparece, sobre {PREGUNTAS} preguntas de compra hechas a cada
            modelo cada semana.
          </p>
        </Bloque>
      )}

      {tiene('auditoria') && (
        <Bloque titulo="Auditoría">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-slate-900">{PUNTAJE.total}</span>
            <span className="text-[13px] text-slate-500">de 100 · antes {PUNTAJE.antes}</span>
          </div>
          <div className="space-y-2">
            {HALLAZGOS.map((h) => (
              <div key={h.id} className="flex items-start gap-2.5">
                <Etiqueta gravedad={h.gravedad} />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium leading-snug text-slate-900">{h.titulo}</div>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-slate-500">{h.porque}</p>
                </div>
              </div>
            ))}
          </div>
        </Bloque>
      )}

      {tiene('acciones') && (
        <Bloque titulo="Plan del mes">
          <ol className="space-y-2.5">
            {criticos.concat(HALLAZGOS.filter((h) => h.gravedad === 'importante').slice(0, 1)).map((h, i) => (
              <li key={h.id} className="flex gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{ background: MORADO }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-[13.5px] font-medium text-slate-900">{h.hacer}</div>
                  <div className="text-[12px] text-slate-500">{h.servicio}</div>
                </div>
              </li>
            ))}
          </ol>
        </Bloque>
      )}

      <div className="border-t border-slate-100 px-6 py-4 text-[11.5px] leading-relaxed text-slate-400">
        Documento de demostración. Las cifras son un ejemplo construido para mostrar el formato del reporte:
        no corresponden a ninguna empresa real.
      </div>
    </div>
  );
}
