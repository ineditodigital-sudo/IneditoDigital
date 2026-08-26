import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  ArrowRight, ChevronDown, Clock, FileText, Flag, Sparkles, TrendingUp,
} from 'lucide-react';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { LogoIA } from '../components/LogosIA';
import {
  Anillo, BarraArea, Contador, Etiqueta, MORADO, Rayita, Tarjeta, TituloBloque, Variacion,
} from '../components/tablero/piezas';
import { Reporte } from '../components/tablero/Reporte';
import {
  CANALES, CONSULTAS, DIA_DE_ARRANQUE, EMPRESA, HALLAZGOS, PREGUNTAS_IA, PUNTAJE,
  VISIBILIDAD_IA, miles, pesosLargo, porSemana, resumen, type Periodo,
} from '../components/tablero/datos';

/*
 * ============================================================
 * TABLERO DE DEMOSTRACIÓN
 * ============================================================
 *
 * Vive en /demo/tablero, fuera del RootLayout: sin cabecera negra, sin pie y
 * sin asistente. Es una pantalla de trabajo, no una página del sitio.
 *
 * No se indexa. Lleva noindex desde el SEO del cliente y desde render.php, y
 * robots.txt tiene /demo/ cerrado. Se llega solo por el enlace, que es lo que
 * se pidió para poder enseñarlo en el stand sin publicarlo.
 *
 * Ninguna cifra es real. Están en components/tablero/datos.ts y se generan
 * con semilla fija para que la demostración se vea igual las cincuenta veces
 * que se enseñe en un día de expo.
 */

const PERIODOS: { valor: Periodo; texto: string }[] = [
  { valor: 30, texto: '30 días' },
  { valor: 90, texto: '90 días' },
  { valor: 180, texto: '6 meses' },
];

export default function TableroDemo() {
  const { settings } = useApp();
  const [periodo, setPeriodo] = useState<Periodo>(90);
  const [reporteAbierto, setReporteAbierto] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('reporte')
  );
  const [ocultos, setOcultos] = useState<string[]>([]);
  const [metrica, setMetrica] = useState<'clics' | 'impresiones' | 'posicion'>('clics');
  const [abierto, setAbierto] = useState<string | null>(HALLAZGOS[0].id);

  const d = useMemo(() => resumen(periodo), [periodo]);
  const semanas = useMemo(() => porSemana(d.dias), [d]);

  /* La semana en que arrancó el trabajo, para marcarla en la gráfica. */
  const semanaArranque = useMemo(() => {
    const i = periodo - 1 - DIA_DE_ARRANQUE;
    if (i < 0) return null;
    return semanas[Math.floor(i / 7)]?.etiqueta ?? null;
  }, [periodo, semanas]);

  /* El resto del sitio es negro; aquí el fondo tiene que ser claro también
     detrás del rebote del scroll, no solo dentro del contenedor. */
  useEffect(() => {
    const previo = document.body.style.background;
    document.body.style.background = '#F1F3F9';
    return () => { document.body.style.background = previo; };
  }, []);

  const visibles = CANALES.filter((c) => !ocultos.includes(c.clave));
  const alternarCanal = (clave: string) =>
    setOcultos((o) => (o.includes(clave) ? o.filter((x) => x !== clave) : [...o, clave]));

  const criticos = HALLAZGOS.filter((h) => h.gravedad === 'critico').length;
  const importantes = HALLAZGOS.filter((h) => h.gravedad === 'importante').length;

  return (
    <div className="tablero min-h-screen bg-[#F1F3F9] text-slate-900">
      <SEO
        title="Tablero de demostración"
        description="Ejemplo del tablero que entregamos a cada cliente."
        noindex
        nofollow
      />

      {/* ============================== barra superior ============================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl no-imprimir">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src="/favicon-192.png" alt="Inédito Digital" className="h-7 w-7 shrink-0" />
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold leading-tight tracking-tight">
                Tablero de {EMPRESA.nombre}
              </div>
              <div className="truncate text-[11.5px] leading-tight text-slate-500">{EMPRESA.sector}</div>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-amber-800">
            Demo
          </span>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-0.5">
              {PERIODOS.map((p) => (
                <button
                  key={p.valor}
                  onClick={() => setPeriodo(p.valor)}
                  className={`relative rounded-[10px] px-2.5 py-1.5 text-[12.5px] font-medium transition-colors sm:px-3 ${
                    periodo === p.valor ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {periodo === p.valor && (
                    <motion.span
                      layoutId="periodo"
                      className="absolute inset-0 rounded-[10px] bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{p.texto}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setReporteAbierto(true)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-4"
              style={{ background: `linear-gradient(100deg, ${MORADO}, #9933FF)` }}
            >
              <FileText size={14} />
              <span className="hidden sm:inline">Generar reporte</span>
              <span className="sm:hidden">Reporte</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-7">
        {/* ============================== indicadores ============================== */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Indicador
            titulo="Contactos"
            valor={d.leads}
            cambio={d.cambio.leads}
            pie="personas que dejaron sus datos"
            serie={semanas.map((s) => s.leads)}
            color={MORADO}
            retraso={0}
          />
          <Indicador
            titulo="Costo por contacto"
            valor={d.costoPorLead}
            formato={pesosLargo}
            cambio={d.cambio.costoPorLead}
            invertido
            pie={`sobre ${pesosLargo(d.inversion)} de pauta`}
            serie={semanas.map((s) => Math.round((s.ads * 21.5) / Math.max(1, s.leads)))}
            color="#CC66FF"
            retraso={0.05}
          />
          <Indicador
            titulo="Ventas cerradas"
            valor={d.ventas}
            cambio={d.cambio.ventas}
            pie="cruzadas contra tu sistema"
            serie={semanas.map((s) => s.ventas)}
            color="#16A34A"
            retraso={0.1}
          />
          <Indicador
            titulo="Retorno de la pauta"
            valor={d.retorno}
            formato={(n) => `${n.toFixed(1)}x`}
            cambio={d.cambio.retorno}
            pie={`${pesosLargo(d.ingresos)} de ingreso atribuido`}
            serie={semanas.map((s) => s.ventas * 14)}
            color="#0EA5E9"
            retraso={0.15}
          />
        </div>

        {/* ============================== canales ============================== */}
        <Tarjeta>
          <TituloBloque
            titulo="De dónde llega la gente"
            sub="Sesiones por canal, semana a semana. Toca un canal para aislarlo."
            extra={
              <div className="flex flex-wrap gap-1.5">
                {CANALES.map((c) => {
                  const activo = !ocultos.includes(c.clave);
                  return (
                    <button
                      key={c.clave}
                      onClick={() => alternarCanal(c.clave)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-all ${
                        activo
                          ? 'border-slate-200 bg-white text-slate-700'
                          : 'border-transparent bg-slate-100 text-slate-400'
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full transition-colors"
                        style={{ background: activo ? c.color : '#CBD5E1' }}
                      />
                      {c.nombre}
                    </button>
                  );
                })}
              </div>
            }
          />
          <div className="h-64 px-1 py-4 sm:h-80 sm:px-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={semanas} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
                <defs>
                  {CANALES.map((c) => (
                    <linearGradient key={c.clave} id={`g-${c.clave}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.color} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={c.color} stopOpacity={0.06} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#EEF1F6" vertical={false} />
                <XAxis
                  dataKey="etiqueta"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={26}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                  tickFormatter={corto}
                />
                <Tooltip content={<Globo />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
                {semanaArranque && (
                  <ReferenceLine
                    x={semanaArranque}
                    stroke="#0F172A"
                    strokeDasharray="4 4"
                    strokeOpacity={0.35}
                    label={{ value: 'empezamos', position: 'insideTopLeft', fill: '#64748B', fontSize: 10 }}
                  />
                )}
                {visibles.map((c) => (
                  <Area
                    key={c.clave}
                    type="monotone"
                    dataKey={c.clave}
                    name={c.nombre}
                    stackId="1"
                    stroke={c.color}
                    strokeWidth={1.8}
                    fill={`url(#g-${c.clave})`}
                    animationDuration={900}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Tarjeta>

        {/* ============================== embudo + buscadores ============================== */}
        <div className="grid gap-4 lg:grid-cols-5">
          <Tarjeta className="lg:col-span-2 flex flex-col">
            <TituloBloque titulo="Del clic a la venta" sub="Dónde se cae la gente en el camino" />
            <div className="flex flex-1 flex-col gap-3 px-5 py-5 sm:px-6">
              <Embudo
                pasos={[
                  { nombre: 'Sesiones', valor: d.sesiones },
                  { nombre: 'Contactos', valor: d.leads },
                  { nombre: 'Oportunidades', valor: d.oportunidades },
                  { nombre: 'Ventas', valor: d.ventas },
                ]}
              />
              <div className="mt-auto rounded-xl bg-slate-50 p-3.5 text-[12.5px] leading-relaxed text-slate-600">
                De cada 100 personas que entran, <strong className="text-slate-900">
                  {((d.leads / d.sesiones) * 100).toFixed(1)}
                </strong> dejan sus datos y{' '}
                <strong className="text-slate-900">{((d.ventas / d.sesiones) * 100).toFixed(2)}</strong> terminan
                comprando. Cada punto que se gana aquí vale más que traer más tráfico.
              </div>
            </div>
          </Tarjeta>

          <Tarjeta className="lg:col-span-3">
            <TituloBloque
              titulo="Buscadores"
              sub="Lo que Google registra de ti, cada semana"
              extra={
                <div className="flex rounded-lg bg-slate-100 p-0.5">
                  {([
                    ['clics', 'Clics'],
                    ['impresiones', 'Impresiones'],
                    ['posicion', 'Posición'],
                  ] as const).map(([k, t]) => (
                    <button
                      key={k}
                      onClick={() => setMetrica(k)}
                      className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                        metrica === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="h-52 px-1 py-4 sm:px-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={semanas} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF1F6" vertical={false} />
                  <XAxis
                    dataKey="etiqueta"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={46}
                    tickFormatter={corto}
                    reversed={metrica === 'posicion'}
                    domain={metrica === 'posicion' ? [1, 'dataMax'] : [0, 'auto']}
                  />
                  <Tooltip content={<Globo />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
                  <Line
                    type="monotone"
                    dataKey={metrica}
                    name={metrica === 'posicion' ? 'Posición media' : metrica === 'clics' ? 'Clics' : 'Impresiones'}
                    stroke={MORADO}
                    strokeWidth={2.4}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                    animationDuration={900}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Consultas que ya te traen gente
              </div>
              <div className="-mx-1 overflow-x-auto">
                <table className="w-full min-w-[440px] text-left text-[12.5px]">
                  <thead>
                    <tr className="text-[10.5px] uppercase tracking-wider text-slate-400">
                      <th className="px-1 pb-1.5 font-medium">Consulta</th>
                      <th className="px-1 pb-1.5 text-right font-medium">Clics</th>
                      <th className="px-1 pb-1.5 text-right font-medium">Impresiones</th>
                      <th className="px-1 pb-1.5 text-right font-medium">Posición</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONSULTAS.map((c, i) => (
                      <motion.tr
                        key={c.texto}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="border-t border-slate-100"
                      >
                        <td className="px-1 py-2 text-slate-700">{c.texto}</td>
                        <td className="px-1 py-2 text-right tabular-nums text-slate-900">{c.clics}</td>
                        <td className="px-1 py-2 text-right tabular-nums text-slate-500">{miles(c.impresiones)}</td>
                        <td className="px-1 py-2 text-right tabular-nums">
                          <span className="font-semibold text-slate-900">{c.posicion}</span>
                          <span className="ml-1.5 rounded bg-emerald-50 px-1 text-[10.5px] font-semibold text-emerald-700">
                            ↑ {(c.antes - c.posicion).toFixed(1)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tarjeta>
        </div>

        {/* ============================== visibilidad en IA ============================== */}
        <Tarjeta>
          <TituloBloque
            titulo="Cuando alguien le pregunta a una IA por tu categoría"
            sub={`En cuántas respuestas apareces. Se preguntan ${PREGUNTAS_IA.length} preguntas de compra a cada modelo, cada semana.`}
          />
          <div className="grid gap-4 p-5 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {VISIBILIDAD_IA.map((v, i) => (
                <motion.div
                  key={v.nombre}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl bg-slate-900 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <LogoIA marca={v.marca} alto={16} />
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold text-white/70">
                      lugar {v.lugar}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <Contador
                      valor={v.presencia}
                      formato={(n) => `${Math.round(n)}%`}
                      className="text-2xl font-bold text-white"
                    />
                    <span className="text-[11.5px] text-white/40">antes {v.antes}%</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg,#9933FF,#CC66FF)' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${v.presencia}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <Sparkles size={12} /> Preguntas que se prueban
              </div>
              <ul className="space-y-2">
                {PREGUNTAS_IA.map((p) => (
                  <li key={p} className="rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] leading-snug text-slate-600">
                    “{p}”
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Tarjeta>

        {/* ============================== auditoría ============================== */}
        <Tarjeta>
          <TituloBloque
            titulo="Tu auditoría"
            sub="Qué está frenando el crecimiento, ordenado por lo que cuesta"
            extra={
              <div className="flex items-center gap-2 text-[11.5px] font-medium">
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">{criticos} críticos</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">{importantes} importantes</span>
              </div>
            }
          />
          <div className="grid gap-6 p-5 sm:px-6 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <Anillo valor={PUNTAJE.total} antes={PUNTAJE.antes} />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-slate-900">Calificación general</div>
                <p className="mt-1 text-[12.5px] leading-snug text-slate-500 sm:max-w-[16rem]">
                  Empezamos en {PUNTAJE.antes}. El gris es dónde estabas cuando llegamos.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
                  <TrendingUp size={13} /> +{PUNTAJE.total - PUNTAJE.antes} puntos
                </div>
              </div>
            </div>
            <div className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {PUNTAJE.areas.map((a) => (
                <BarraArea key={a.nombre} nombre={a.nombre} valor={a.valor} antes={a.antes} />
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100">
            {HALLAZGOS.map((h) => {
              const activo = abierto === h.id;
              return (
                <div key={h.id} className="border-b border-slate-100 last:border-0">
                  <button
                    onClick={() => setAbierto(activo ? null : h.id)}
                    className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50/70 sm:px-6"
                  >
                    <Etiqueta gravedad={h.gravedad} />
                    <span className="min-w-0 flex-1 text-[13.5px] font-medium leading-snug text-slate-900">
                      {h.titulo}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        activo ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {activo && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3 sm:px-6">
                          {[
                            ['Qué está pasando', h.que],
                            ['Por qué importa', h.porque],
                            ['Qué hay que hacer', h.hacer],
                          ].map(([t, c]) => (
                            <div key={t} className="rounded-xl bg-slate-50 p-3.5">
                              <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                                {t}
                              </div>
                              <p className="text-[12.5px] leading-relaxed text-slate-600">{c}</p>
                            </div>
                          ))}
                        </div>
                        <div className="px-5 pb-5 sm:px-6">
                          <a
                            href={h.ruta}
                            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-opacity hover:opacity-70"
                            style={{ color: MORADO }}
                          >
                            Lo resuelve: {h.servicio} <ArrowRight size={13} />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Tarjeta>

        {/* ============================== plan ============================== */}
        <Tarjeta>
          <TituloBloque titulo="Qué sigue este mes" sub="En orden, y con la razón por la que va en ese orden" />
          <div className="grid gap-3 p-5 sm:px-6 md:grid-cols-3">
            {HALLAZGOS.slice(0, 3).map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-xl border border-slate-200 p-4"
              >
                <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, ${MORADO}, #CC66FF)` }} />
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: MORADO }}
                  >
                    {i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <Clock size={11} /> semana {i + 1}
                  </span>
                </div>
                <div className="mt-2.5 text-[13.5px] font-medium leading-snug text-slate-900">{h.hacer}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-slate-500">
                  <Flag size={11} /> {h.servicio}
                </div>
              </motion.div>
            ))}
          </div>
        </Tarjeta>

        {/* ============================== cierre ============================== */}
        <Tarjeta className="overflow-hidden">
          <div
            className="flex flex-wrap items-center justify-between gap-4 p-6 text-white sm:p-8"
            style={{ background: `linear-gradient(115deg, ${MORADO}, #4B0082)` }}
          >
            <div className="min-w-0">
              <div className="text-lg font-bold leading-tight sm:text-xl">
                Esto es lo que verías de tu empresa cada mes.
              </div>
              <p className="mt-1.5 max-w-lg text-[13.5px] leading-relaxed text-white/70">
                Mismo tablero, tus datos. Conectamos Search Console, Analytics, tus campañas y —cuando tu
                sistema lo permite— tus ventas cerradas, y la auditoría se actualiza sola.
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                'Hola, vi el tablero de demostración y quiero uno con los datos de mi empresa.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-[13.5px] font-bold transition-transform hover:scale-[1.03]"
              style={{ color: MORADO }}
            >
              Quiero uno para mi empresa <ArrowRight size={15} />
            </a>
          </div>
        </Tarjeta>

        <p className="px-1 pb-6 text-center text-[11.5px] leading-relaxed text-slate-400">
          Tablero de demostración de Inédito Digital. Las cifras son un ejemplo construido para enseñar el
          formato: no corresponden a ninguna empresa real.
        </p>
      </main>

      <AnimatePresence>
        {reporteAbierto && <Reporte periodo={periodo} alCerrar={() => setReporteAbierto(false)} />}
      </AnimatePresence>
    </div>
  );
}

/** Ejes: 1200 -> "1.2k". Con el numero completo no cabia y se cortaba. */
const corto = (v: number) =>
  Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1).replace('.0', '')}k` : String(v);

/* ------------------------------------------------------------ indicador */

function Indicador({
  titulo,
  valor,
  cambio,
  pie,
  serie,
  color,
  formato,
  invertido = false,
  retraso = 0,
}: {
  titulo: string;
  valor: number;
  cambio: number;
  pie: string;
  serie: number[];
  color: string;
  formato?: (n: number) => string;
  invertido?: boolean;
  retraso?: number;
}) {
  return (
    <Tarjeta retraso={retraso} alMontar className="overflow-hidden">
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wider text-slate-400">{titulo}</span>
          <Variacion pct={cambio} invertido={invertido} />
        </div>
        <div className="mt-1.5 text-[28px] font-bold leading-none tracking-tight text-slate-900">
          <Contador valor={valor} formato={formato} />
        </div>
        <p className="mt-1.5 text-[12px] leading-snug text-slate-500">{pie}</p>
      </div>
      <div className="mt-2">
        <Rayita datos={serie} color={color} />
      </div>
    </Tarjeta>
  );
}

/* --------------------------------------------------------------- embudo */

function Embudo({ pasos }: { pasos: { nombre: string; valor: number }[] }) {
  const tope = pasos[0].valor;
  return (
    <div className="space-y-1">
      <p className="pb-1 text-[11px] text-slate-400">
        Las barras van a escala comprimida para que se vean los pasos chicos. Los números son los reales.
      </p>
      {pasos.map((p, i) => {
        const ancho = Math.max(8, Math.pow(p.valor / tope, 0.4) * 100);
        const previo = i ? pasos[i - 1].valor : null;
        return (
          <div key={p.nombre}>
            {previo !== null && (
              <div className="flex items-center gap-2 py-1 pl-[6rem]">
                <span className="h-3 w-px bg-slate-200" />
                <span className="text-[11px] font-medium text-slate-400">
                  {((p.valor / previo) * 100).toFixed(1)}% pasa al siguiente paso
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-[5.5rem] shrink-0 text-[12.5px] font-medium text-slate-600">{p.nombre}</span>
              <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-slate-100">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, ${MORADO}, #CC66FF)`,
                    opacity: 1 - i * 0.15,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${ancho}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-[13px] font-bold tabular-nums text-slate-900">
                <Contador valor={p.valor} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- globo */

function Globo({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((t: number, p: any) => t + (p.value || 0), 0);
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Semana del {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[12.5px]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.stroke }} />
          <span className="text-slate-600">{p.name}</span>
          <span className="ml-auto font-semibold tabular-nums text-slate-900">
            {typeof p.value === 'number' ? p.value.toLocaleString('es-MX') : p.value}
          </span>
        </div>
      ))}
      {payload.length > 1 && (
        <div className="mt-1.5 flex items-center gap-2 border-t border-slate-100 pt-1.5 text-[12.5px]">
          <span className="text-slate-500">Total</span>
          <span className="ml-auto font-bold tabular-nums text-slate-900">{total.toLocaleString('es-MX')}</span>
        </div>
      )}
    </div>
  );
}
