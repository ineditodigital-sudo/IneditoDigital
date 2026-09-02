import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  ArrowRight, ChevronDown, Clock, FileText, Flag, Maximize2, Menu, Moon, Sparkles, Sun,
  TrendingUp, X,
} from 'lucide-react';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { LogoIA } from '../components/LogosIA';
import {
  Anillo, BarraArea, Contador, Etiqueta, MORADO, Rayita, Tarjeta, TituloBloque, Variacion,
} from '../components/tablero/piezas';
import { Modal, TablaDatos } from '../components/tablero/Modal';
import { SECCIONES, Sidebar } from '../components/tablero/Sidebar';
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
 * sin asistente. Es una pantalla de trabajo, no una página del sitio, y por eso
 * tiene su propia navegación lateral.
 *
 * No se indexa. Lleva noindex desde el SEO del cliente y desde render.php, y
 * robots.txt tiene /demo/ cerrado. Se llega solo por el enlace, que es lo que
 * se pidió para poder enseñarlo en el stand sin publicarlo.
 *
 * Ninguna cifra es real. Están en components/tablero/datos.ts y se generan
 * con semilla fija para que la demostración se vea igual las cincuenta veces
 * que se enseñe en un día de expo.
 */

const PERIODOS: { valor: Periodo; texto: string; corto: string }[] = [
  { valor: 30, texto: '30 días', corto: '30d' },
  { valor: 90, texto: '90 días', corto: '90d' },
  { valor: 180, texto: '6 meses', corto: '6m' },
];

/** Qué gráfica está abierta en grande. */
type Ampliada =
  | 'contactos' | 'costo' | 'ventas' | 'retorno'
  | 'canales' | 'embudo' | 'buscadores' | 'ia' | 'auditoria';

type Metrica = 'clics' | 'impresiones' | 'posicion';
type Grano = 'semana' | 'dia';

export default function TableroDemo() {
  const { settings } = useApp();
  const [periodo, setPeriodo] = useState<Periodo>(90);
  const [reporteAbierto, setReporteAbierto] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('reporte')
  );
  const [ocultos, setOcultos] = useState<string[]>([]);
  const [metrica, setMetrica] = useState<Metrica>('clics');
  const [abierto, setAbierto] = useState<string | null>(HALLAZGOS[0].id);
  const [ampliada, setAmpliada] = useState<Ampliada | null>(null);
  const [grano, setGrano] = useState<Grano>('semana');
  const [cajonAbierto, setCajonAbierto] = useState(false);
  const [activa, setActiva] = useState('resumen');
  /*
   * Claro u oscuro. Se recuerda en el navegador de quien lo abre: en un stand
   * la pantalla se queda encendida todo el día y nadie quiere volver a
   * elegirlo cada vez que alguien recarga.
   */
  const [oscuro, setOscuro] = useState(() => {
    try {
      return localStorage.getItem('inedito_tablero_tema') === 'oscuro';
    } catch {
      return false;
    }
  });
  /* Mientras dura el desplazamiento suave manda el clic, no el scroll: si no,
     la marca va saltando por las secciones intermedias hasta llegar. */
  const yendoA = useRef(0);

  const d = useMemo(() => resumen(periodo), [periodo]);
  const semanas = useMemo(() => porSemana(d.dias), [d]);
  /* En grande se puede ver día por día; en la tarjeta siempre por semana, que
     con seis meses son 26 puntos en vez de 180. */
  const serie: Cubo[] = grano === 'dia' ? d.dias : semanas;

  /* La semana en que arrancó el trabajo, para marcarla en la gráfica. */
  const semanaArranque = useMemo(() => {
    const i = periodo - 1 - DIA_DE_ARRANQUE;
    if (i < 0) return null;
    return semanas[Math.floor(i / 7)]?.etiqueta ?? null;
  }, [periodo, semanas]);

  /* El fondo va también en el body y no solo en el contenedor: si no, el
     rebote del scroll enseña el negro del resto del sitio. */
  useEffect(() => {
    const previo = document.body.style.background;
    document.body.style.background = oscuro ? '#0A0C12' : '#F1F3F9';
    try {
      localStorage.setItem('inedito_tablero_tema', oscuro ? 'oscuro' : 'claro');
    } catch {
      /* modo privado: se queda sin recordar, y ya */
    }
    return () => { document.body.style.background = previo; };
  }, [oscuro]);

  /*
   * Qué sección se está viendo, para marcarla en la navegación.
   *
   * Va con scroll y no con IntersectionObserver a propósito: aquí importa cuál
   * está más cerca del borde de arriba, no cuál asoma. Con el observador se
   * marcaban dos a la vez en las secciones cortas.
   */
  useEffect(() => {
    let pendiente = 0;
    const revisar = () => {
      pendiente = 0;
      let mejor = SECCIONES[0].id;
      for (const s of SECCIONES) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) mejor = s.id;
      }
      // Al final de la página gana la última, aunque no haya llegado al corte.
      // Solo si de verdad hay algo que recorrer: en una pantalla muy alta cabe
      // todo y entonces marcaba la última desde el principio.
      const hayScroll = document.body.scrollHeight > window.innerHeight + 40;
      if (hayScroll && window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        mejor = SECCIONES[SECCIONES.length - 1].id;
      }
      if (Date.now() > yendoA.current) setActiva(mejor);
    };
    const alRodar = () => {
      if (!pendiente) pendiente = window.setTimeout(revisar, 80);
    };
    revisar();
    window.addEventListener('scroll', alRodar, { passive: true });
    window.addEventListener('resize', alRodar);
    return () => {
      window.removeEventListener('scroll', alRodar);
      window.removeEventListener('resize', alRodar);
      if (pendiente) window.clearTimeout(pendiente);
    };
  }, []);

  const ir = useCallback((id: string) => {
    setCajonAbierto(false);
    setActiva(id);
    yendoA.current = Date.now() + 800;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const visibles = CANALES.filter((c) => !ocultos.includes(c.clave));
  const alternarCanal = (clave: string) =>
    setOcultos((o) => (o.includes(clave) ? o.filter((x) => x !== clave) : [...o, clave]));

  const criticos = HALLAZGOS.filter((h) => h.gravedad === 'critico').length;
  const importantes = HALLAZGOS.filter((h) => h.gravedad === 'importante').length;

  /* ---- los cuatro indicadores, definidos en un solo sitio ---- */
  const INDICADORES: Indicador[] = [
    {
      id: 'contactos', titulo: 'Contactos', valor: d.leads, cambio: d.cambio.leads,
      pie: 'personas que dejaron sus datos', color: MORADO, de: (b) => b.leads,
      explica: 'Cada persona que llenó un formulario, escribió por WhatsApp o llamó desde la web. Es el primer número que mueve todo lo demás.',
    },
    {
      id: 'costo', titulo: 'Costo por contacto', valor: d.costoPorLead, cambio: d.cambio.costoPorLead,
      invertido: true, formato: pesosLargo, pie: `sobre ${pesosLargo(d.inversion)} de pauta`,
      color: '#CC66FF', de: (b) => (b.leads ? Math.round((b.ads * 21.5) / b.leads) : 0),
      explica: 'Lo invertido en pauta dividido entre todos los contactos del periodo. Baja cuando crece lo que no se paga: orgánico y respuestas de IA.',
    },
    {
      id: 'ventas', titulo: 'Ventas cerradas', valor: d.ventas, cambio: d.cambio.ventas,
      pie: 'cruzadas contra tu sistema', color: '#16A34A', de: (b) => b.ventas,
      explica: 'Ventas que se pudieron amarrar a un contacto llegado por la web. Es el cruce que casi nadie hace y el que convierte un reporte en una decisión.',
    },
    {
      id: 'retorno', titulo: 'Retorno de la pauta', valor: d.retorno, cambio: d.cambio.retorno,
      formato: (n) => `${n.toFixed(1)}x`, pie: `${pesosLargo(d.ingresoDePauta)} de ingreso atribuido`,
      color: '#0EA5E9',
      de: (b) => (b.ads && b.sesiones ? +((b.ingresos * (b.ads / b.sesiones)) / (b.ads * 21.5)).toFixed(1) : 0),
      explica: 'Se mide contra lo que la pauta trajo, no contra todo el ingreso: acreditarle a Google Ads lo que cerró el orgánico da números preciosos y falsos.',
    },
  ];

  const seccionActiva = SECCIONES.find((s) => s.id === activa)?.nombre ?? 'Resumen';
  const p = PALETAS[oscuro ? 'oscuro' : 'claro'];
  const movil = useEsMovil();

  return (
    <div className={`tablero ${oscuro ? 'oscuro' : ''} min-h-screen bg-[var(--t-fondo)] text-[var(--t-txt)]`}>
      <SEO
        title="Tablero de demostración"
        description="Ejemplo del tablero que entregamos a cada cliente."
        noindex
        nofollow
      />

      {/* ============================== navegación ============================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block no-imprimir">
        <Sidebar activa={activa} alIr={ir} alGenerarReporte={() => setReporteAbierto(true)} />
      </aside>

      <AnimatePresence>
        {cajonAbierto && (
          <div className="fixed inset-0 z-50 lg:hidden no-imprimir">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCajonAbierto(false)}
              aria-label="Cerrar menú"
              className="absolute inset-0 h-full w-full bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-2xl"
            >
              <Sidebar
                activa={activa}
                alIr={ir}
                alGenerarReporte={() => { setCajonAbierto(false); setReporteAbierto(true); }}
              />
              <button
                onClick={() => setCajonAbierto(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-[var(--t-txt-3)] transition-colors hover:bg-[var(--t-pista)]"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-60">
        {/* ============================== barra superior ============================== */}
        <header className="sticky top-0 z-30 border-b border-[var(--t-borde)] bg-[var(--t-cabecera)] backdrop-blur-xl no-imprimir">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
            <button
              onClick={() => setCajonAbierto(true)}
              className="-ml-1 rounded-lg p-1.5 text-[var(--t-txt-3)] transition-colors hover:bg-[var(--t-pista)] lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold leading-tight tracking-tight">{seccionActiva}</div>
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <div className="flex rounded-xl bg-[var(--t-pista)] p-0.5">
                {PERIODOS.map((p) => (
                  <button
                    key={p.valor}
                    onClick={() => setPeriodo(p.valor)}
                    className={`relative rounded-[10px] px-2 py-1.5 text-[12.5px] font-medium transition-colors sm:px-3 ${
                      periodo === p.valor ? 'text-[var(--t-txt)]' : 'text-[var(--t-txt-3)] hover:text-[var(--t-txt-2)]'
                    }`}
                  >
                    {periodo === p.valor && (
                      <motion.span
                        layoutId="periodo"
                        className="absolute inset-0 rounded-[10px] bg-[var(--t-elevado)] shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative sm:hidden">{p.corto}</span>
                    <span className="relative hidden sm:inline">{p.texto}</span>
                  </button>
                ))}
              </div>
              <BotonTema oscuro={oscuro} alCambiar={() => setOscuro((o) => !o)} />
              <button
                onClick={() => setReporteAbierto(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 lg:hidden"
                style={{ background: `linear-gradient(100deg, ${MORADO}, #9933FF)` }}
                aria-label="Generar reporte"
              >
                <FileText size={14} />
                <span className="hidden sm:inline">Reporte</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-7">
          {/* ============================== indicadores ============================== */}
          <section id="resumen" className="grid grid-cols-2 scroll-mt-[6.5rem] sm:scroll-mt-24 gap-3 sm:gap-4 xl:grid-cols-4">
            {INDICADORES.map((ind, i) => (
              <TarjetaIndicador
                key={ind.id}
                ind={ind}
                serie={semanas.map(ind.de)}
                retraso={i * 0.05}
                alAmpliar={() => setAmpliada(ind.id)}
              />
            ))}
          </section>

          {/* ============================== canales ============================== */}
          <div id="canales" className="scroll-mt-[6.5rem] sm:scroll-mt-24">
            <Tarjeta>
              <TituloBloque
                titulo="De dónde llega la gente"
                sub="Sesiones por canal, semana a semana. Toca un canal para aislarlo."
                extra={<Leyenda ocultos={ocultos} alAlternar={alternarCanal} />}
                alAmpliar={() => setAmpliada('canales')}
              />
              <div className="h-64 px-1 py-4 sm:h-80 sm:px-3">
                <GraficaCanales datos={semanas} visibles={visibles} marca={semanaArranque} p={p} movil={movil} />
              </div>
            </Tarjeta>
          </div>

          {/* ============================== embudo + buscadores ============================== */}
          <div className="grid gap-4 lg:grid-cols-5">
            <div id="embudo" className="min-w-0 scroll-mt-[6.5rem] sm:scroll-mt-24 lg:col-span-2">
              <Tarjeta className="flex h-full flex-col">
                <TituloBloque
                  titulo="Del clic a la venta"
                  sub="Dónde se cae la gente en el camino"
                  alAmpliar={() => setAmpliada('embudo')}
                />
                <div className="flex flex-1 flex-col gap-3 px-5 py-5 sm:px-6">
                  <Embudo pasos={pasosEmbudo(d)} />
                  <div className="mt-auto rounded-xl bg-[var(--t-suave)] p-3.5 text-[12.5px] leading-relaxed text-[var(--t-txt-2)]">
                    De cada 100 personas que entran,{' '}
                    <strong className="text-[var(--t-txt)]">{((d.leads / d.sesiones) * 100).toFixed(1)}</strong> dejan
                    sus datos y{' '}
                    <strong className="text-[var(--t-txt)]">{((d.ventas / d.sesiones) * 100).toFixed(2)}</strong>{' '}
                    terminan comprando. Cada punto que se gana aquí vale más que traer más tráfico.
                  </div>
                </div>
              </Tarjeta>
            </div>

            <div id="buscadores" className="min-w-0 scroll-mt-[6.5rem] sm:scroll-mt-24 lg:col-span-3">
              <Tarjeta className="flex h-full flex-col">
                <TituloBloque
                  titulo="Buscadores"
                  sub="Lo que Google registra de ti, cada semana"
                  extra={<Selector valor={metrica} alCambiar={setMetrica} />}
                  alAmpliar={() => setAmpliada('buscadores')}
                />
                <div className="h-52 px-1 py-4 sm:px-3">
                  <GraficaBuscadores datos={semanas} metrica={metrica} p={p} movil={movil} />
                </div>
                <div className="border-t border-[var(--t-borde-suave)] px-5 py-4 sm:px-6">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--t-txt-3)]">
                    Consultas que ya te traen gente
                  </div>
                  <TablaConsultas />
                </div>
              </Tarjeta>
            </div>
          </div>

          {/* ============================== visibilidad en IA ============================== */}
          <div id="ia" className="scroll-mt-[6.5rem] sm:scroll-mt-24">
            <Tarjeta>
              <TituloBloque
                titulo="Cuando alguien le pregunta a una IA por tu categoría"
                sub={`En cuántas respuestas apareces. Se preguntan ${PREGUNTAS_IA.length} preguntas de compra a cada modelo, cada semana.`}
                alAmpliar={() => setAmpliada('ia')}
              />
              <div className="grid gap-4 p-5 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {VISIBILIDAD_IA.map((v, i) => (
                    <TarjetaIA key={v.nombre} v={v} retraso={i * 0.08} />
                  ))}
                </div>
                <div className="rounded-xl border border-[var(--t-borde)] p-4">
                  <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--t-txt-3)]">
                    <Sparkles size={12} /> Preguntas que se prueban
                  </div>
                  <ul className="space-y-2">
                    {PREGUNTAS_IA.map((p) => (
                      <li key={p} className="rounded-lg bg-[var(--t-suave)] px-3 py-2 text-[12.5px] leading-snug text-[var(--t-txt-2)]">
                        “{p}”
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tarjeta>
          </div>

          {/* ============================== auditoría ============================== */}
          <div id="auditoria" className="scroll-mt-[6.5rem] sm:scroll-mt-24">
            <Tarjeta>
              <TituloBloque
                titulo="Tu auditoría"
                sub="Qué está frenando el crecimiento, ordenado por lo que cuesta"
                extra={
                  <div className="flex items-center gap-2 text-[11.5px] font-medium">
                    <span className="rounded-full bg-[var(--t-mal-bg)] px-2 py-0.5 text-[var(--t-mal-tx)]">{criticos} críticos</span>
                    <span className="rounded-full bg-[var(--t-aviso-bg)] px-2 py-0.5 text-[var(--t-aviso-tx)]">{importantes} importantes</span>
                  </div>
                }
                alAmpliar={() => setAmpliada('auditoria')}
              />
              <div className="grid gap-6 p-5 sm:px-6 lg:grid-cols-[auto_1fr]">
                <div className="flex items-center gap-4 sm:gap-5">
                  <Anillo valor={PUNTAJE.total} antes={PUNTAJE.antes} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--t-txt)]">Calificación general</div>
                    <p className="mt-1 text-[12.5px] leading-snug text-[var(--t-txt-3)] sm:max-w-[16rem]">
                      Empezamos en {PUNTAJE.antes}. El anillo gris de adentro es dónde estabas cuando llegamos.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--t-ok-bg)] px-2.5 py-1 text-[12px] font-semibold text-[var(--t-ok-tx)]">
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

              <div className="border-t border-[var(--t-borde-suave)]">
                {HALLAZGOS.map((h) => {
                  const activo = abierto === h.id;
                  return (
                    <div key={h.id} className="border-b border-[var(--t-borde-suave)] last:border-0">
                      <button
                        onClick={() => setAbierto(activo ? null : h.id)}
                        className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--t-suave)] sm:px-6"
                      >
                        <Etiqueta gravedad={h.gravedad} />
                        <span className="min-w-0 flex-1 text-[13.5px] font-medium leading-snug text-[var(--t-txt)]">
                          {h.titulo}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`mt-0.5 shrink-0 text-[var(--t-txt-3)] transition-transform duration-200 ${
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
                                <div key={t} className="rounded-xl bg-[var(--t-suave)] p-3.5">
                                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-[var(--t-txt-3)]">
                                    {t}
                                  </div>
                                  <p className="text-[12.5px] leading-relaxed text-[var(--t-txt-2)]">{c}</p>
                                </div>
                              ))}
                            </div>
                            <div className="px-4 pb-5 sm:px-6">
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
          </div>

          {/* ============================== plan ============================== */}
          <div id="plan" className="scroll-mt-[6.5rem] sm:scroll-mt-24">
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
                    className="relative overflow-hidden rounded-xl border border-[var(--t-borde)] p-4"
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-0.5"
                      style={{ background: `linear-gradient(90deg, ${MORADO}, #CC66FF)` }}
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{ background: MORADO }}
                      >
                        {i + 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--t-txt-3)]">
                        <Clock size={11} /> semana {i + 1}
                      </span>
                    </div>
                    <div className="mt-2.5 text-[13.5px] font-medium leading-snug text-[var(--t-txt)]">{h.hacer}</div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-[var(--t-txt-3)]">
                      <Flag size={11} /> {h.servicio}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Tarjeta>
          </div>

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
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--t-tarjeta)] px-5 py-3 text-[13.5px] font-bold transition-transform hover:scale-[1.03]"
                style={{ color: MORADO }}
              >
                Quiero uno para mi empresa <ArrowRight size={15} />
              </a>
            </div>
          </Tarjeta>

          <p className="px-1 pb-6 text-center text-[11.5px] leading-relaxed text-[var(--t-txt-3)]">
            Tablero de demostración de Inédito Digital. Las cifras son un ejemplo construido para enseñar el
            formato: no corresponden a ninguna empresa real.
          </p>
        </main>
      </div>

      {/* ============================== ventanas ============================== */}
      <AnimatePresence>
        {ampliada && (
          <VentanaGrafica
            cual={ampliada}
            alCerrar={() => setAmpliada(null)}
            indicadores={INDICADORES}
            d={d}
            serie={serie}
            grano={grano}
            alCambiarGrano={setGrano}
            visibles={visibles}
            ocultos={ocultos}
            alAlternarCanal={alternarCanal}
            metrica={metrica}
            alCambiarMetrica={setMetrica}
            marca={grano === 'semana' ? semanaArranque : null}
            periodo={periodo}
            p={p}
            movil={movil}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reporteAbierto && <Reporte periodo={periodo} alCerrar={() => setReporteAbierto(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ tipos */

/** Lo que necesita una gráfica, venga de un día suelto o de un cubo semanal. */
type Cubo = {
  etiqueta: string;
  organico: number; ads: number; ia: number; directo: number; redes: number;
  sesiones: number; leads: number; oportunidades: number; ventas: number; ingresos: number;
  clics: number; impresiones: number; posicion: number;
};

type Indicador = {
  id: Ampliada;
  titulo: string;
  valor: number;
  cambio: number;
  pie: string;
  color: string;
  de: (b: Cubo) => number;
  explica: string;
  formato?: (n: number) => string;
  invertido?: boolean;
};

const pasosEmbudo = (d: ReturnType<typeof resumen>) => [
  { nombre: 'Sesiones', valor: d.sesiones },
  { nombre: 'Contactos', valor: d.leads },
  { nombre: 'Oportunidades', valor: d.oportunidades },
  { nombre: 'Ventas', valor: d.ventas },
];

/*
 * Recharts pinta con atributos y no con clases, así que estos colores no
 * pueden salir de las variables CSS: van aquí y se eligen con el tema.
 */
type Paleta = { rejilla: string; eje: string; cursor: string; antes: string };
const PALETAS: Record<'claro' | 'oscuro', Paleta> = {
  claro:  { rejilla: '#EEF1F6', eje: '#94A3B8', cursor: '#CBD5E1', antes: '#CBD5E1' },
  oscuro: { rejilla: '#232838', eje: '#6E7891', cursor: '#3E465C', antes: '#3E465C' },
};

/**
 * Si estamos en ancho de teléfono.
 *
 * Hace falta en JS y no solo en CSS porque recharts recibe números —el ancho
 * del eje, la altura del área— y esos no se pueden poner con una clase.
 */
function useEsMovil() {
  const [movil, setMovil] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const alCambiar = () => setMovil(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);
  return movil;
}

/** Ejes: 1200 -> "1.2k". Con el número completo no cabía y se cortaba. */
const corto = (v: number) =>
  Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1).replace('.0', '')}k` : String(v);

/* -------------------------------------------------------- tema claro/oscuro */

function BotonTema({ oscuro, alCambiar }: { oscuro: boolean; alCambiar: () => void }) {
  return (
    <button
      onClick={alCambiar}
      title={oscuro ? 'Cambiar a claro' : 'Cambiar a oscuro'}
      aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={oscuro}
      className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl border border-[var(--t-borde)] text-[var(--t-txt-2)] transition-colors hover:bg-[var(--t-pista)]"
    >
      {/* El icono anuncia a dónde vas, no dónde estás: en claro se ve la luna.
          Los dos viven siempre montados y se cruzan girando; entrando y
          saliendo del DOM, el botón parpadeaba en cada cambio. */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: oscuro ? 1 : 0, rotate: oscuro ? 0 : -90, scale: oscuro ? 1 : 0.6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Sun size={15} />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: oscuro ? 0 : 1, rotate: oscuro ? 90 : 0, scale: oscuro ? 0.6 : 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Moon size={15} />
      </motion.span>
    </button>
  );
}

/* ------------------------------------------------------------ indicador */

function TarjetaIndicador({
  ind,
  serie,
  retraso,
  alAmpliar,
}: {
  ind: Indicador;
  serie: number[];
  retraso: number;
  alAmpliar: () => void;
}) {
  return (
    <Tarjeta retraso={retraso} alMontar className="group flex flex-col overflow-hidden">
      {/* La tarjeta entera abre la gráfica: en una pantalla táctil de expo,
          apuntarle a un botón de 28 px no es razonable. */}
      <button onClick={alAmpliar} className="flex w-full flex-1 cursor-pointer flex-col text-left">
        <div className="px-3.5 pt-3.5 sm:px-5 sm:pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10.5px] font-medium uppercase tracking-wide text-[var(--t-txt-3)] sm:text-[11px]">
              {ind.titulo}
            </span>
            <Maximize2
              size={13}
              className="hidden shrink-0 text-[var(--t-txt-3)] opacity-0 transition-opacity group-hover:opacity-100 sm:block"
            />
          </div>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[23px] font-bold leading-none tracking-tight text-[var(--t-txt)] sm:text-[28px]">
              <Contador valor={ind.valor} formato={ind.formato} />
            </span>
            <Variacion pct={ind.cambio} invertido={ind.invertido} />
          </div>
          <p className="mt-1.5 min-h-[2.4em] text-[11.5px] leading-snug text-[var(--t-txt-3)] sm:text-[12px]">
            {ind.pie}
          </p>
        </div>
        <div className="mt-auto pt-2">
          <Rayita datos={serie} color={ind.color} />
        </div>
      </button>
    </Tarjeta>
  );
}

/* ------------------------------------------------------------- gráficas */

function GraficaCanales({
  datos,
  visibles,
  marca,
  p,
  movil,
}: {
  datos: Cubo[];
  visibles: typeof CANALES;
  marca: string | null;
  p: Paleta;
  movil: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={datos} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
        <defs>
          {CANALES.map((c) => (
            <linearGradient key={c.clave} id={`g-${c.clave}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={c.color} stopOpacity={0.06} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={p.rejilla} vertical={false} />
        <XAxis dataKey="etiqueta" tick={{ fill: p.eje, fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={26} />
        <YAxis
          tick={{ fill: p.eje, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={movil ? 32 : 46}
          tickFormatter={corto}
        />
        <Tooltip content={<Globo />} cursor={{ stroke: p.cursor, strokeDasharray: '4 4' }} />
        {marca && (
          <ReferenceLine
            x={marca}
            stroke={p.eje}
            strokeDasharray="4 4"
            strokeOpacity={0.7}
            label={{ value: 'empezamos', position: 'insideTopLeft', fill: p.eje, fontSize: 10 }}
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
  );
}

function GraficaBuscadores({ datos, metrica, p, movil }: { datos: Cubo[]; metrica: Metrica; p: Paleta; movil: boolean }) {
  const nombre = metrica === 'posicion' ? 'Posición media' : metrica === 'clics' ? 'Clics' : 'Impresiones';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={datos} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={p.rejilla} vertical={false} />
        <XAxis dataKey="etiqueta" tick={{ fill: p.eje, fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={30} />
        <YAxis
          tick={{ fill: p.eje, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={movil ? 32 : 46}
          tickFormatter={corto}
          reversed={metrica === 'posicion'}
          domain={metrica === 'posicion' ? [1, 'dataMax'] : [0, 'auto']}
        />
        <Tooltip content={<Globo />} cursor={{ stroke: p.cursor, strokeDasharray: '4 4' }} />
        <Line
          type="monotone"
          dataKey={metrica}
          name={nombre}
          stroke={MORADO}
          strokeWidth={2.4}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          animationDuration={900}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** La serie de un solo indicador, para cuando se abre en grande. */
function GraficaIndicador({ ind, datos, p, movil }: { ind: Indicador; datos: Cubo[]; p: Paleta; movil: boolean }) {
  const puntos = datos.map((b) => ({ etiqueta: b.etiqueta, valor: ind.de(b) }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={puntos} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="g-ind" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ind.color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={ind.color} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={p.rejilla} vertical={false} />
        <XAxis dataKey="etiqueta" tick={{ fill: p.eje, fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={26} />
        <YAxis
          tick={{ fill: p.eje, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={movil ? 38 : 52}
          tickFormatter={corto}
        />
        <Tooltip content={<Globo />} cursor={{ stroke: p.cursor, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="valor"
          name={ind.titulo}
          stroke={ind.color}
          strokeWidth={2.4}
          fill="url(#g-ind)"
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* --------------------------------------------------------------- embudo */

function Embudo({ pasos, alto = 36 }: { pasos: { nombre: string; valor: number }[]; alto?: number }) {
  const tope = pasos[0].valor;
  return (
    <div className="space-y-1">
      <p className="pb-1 text-[11px] text-[var(--t-txt-3)]">
        Las barras van a escala comprimida para que se vean los pasos chicos. Los números son los reales.
      </p>
      {pasos.map((p, i) => {
        const ancho = Math.max(8, Math.pow(p.valor / tope, 0.4) * 100);
        const previo = i ? pasos[i - 1].valor : null;
        return (
          <div key={p.nombre}>
            {previo !== null && (
              <div className="flex items-center gap-2 py-1 pl-[5.1rem] sm:pl-[6rem]">
                <span className="h-3 w-px bg-[var(--t-borde)]" />
                <span className="text-[11px] font-medium text-[var(--t-txt-3)]">
                  {((p.valor / previo) * 100).toFixed(1)}% pasa al siguiente paso
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-[4.6rem] shrink-0 text-[11.5px] font-medium text-[var(--t-txt-2)] sm:w-[5.5rem] sm:text-[12.5px]">
                {p.nombre}
              </span>
              <div className="relative flex-1 overflow-hidden rounded-lg bg-[var(--t-pista)]" style={{ height: alto }}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ background: `linear-gradient(90deg, ${MORADO}, #CC66FF)`, opacity: 1 - i * 0.15 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${ancho}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-[12.5px] font-bold tabular-nums text-[var(--t-txt)] sm:w-14 sm:text-[13px]">
                <Contador valor={p.valor} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- piezas UI */

function Leyenda({ ocultos, alAlternar }: { ocultos: string[]; alAlternar: (c: string) => void }) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {CANALES.map((c) => {
        const activo = !ocultos.includes(c.clave);
        return (
          <button
            key={c.clave}
            onClick={() => alAlternar(c.clave)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-all ${
              activo ? 'border-[var(--t-borde)] bg-[var(--t-tarjeta)] text-[var(--t-txt-2)]' : 'border-transparent bg-[var(--t-pista)] text-[var(--t-txt-3)]'
            }`}
          >
            <span className="h-2 w-2 rounded-full transition-colors" style={{ background: activo ? c.color : '#CBD5E1' }} />
            {c.nombre}
          </button>
        );
      })}
    </div>
  );
}

function Selector({ valor, alCambiar }: { valor: Metrica; alCambiar: (m: Metrica) => void }) {
  return (
    <div className="flex rounded-lg bg-[var(--t-pista)] p-0.5">
      {([['clics', 'Clics'], ['impresiones', 'Impresiones'], ['posicion', 'Posición']] as const).map(([k, t]) => (
        <button
          key={k}
          onClick={() => alCambiar(k)}
          className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
            valor === k ? 'bg-[var(--t-elevado)] text-[var(--t-txt)] shadow-sm' : 'text-[var(--t-txt-3)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function SelectorGrano({ valor, alCambiar }: { valor: Grano; alCambiar: (g: Grano) => void }) {
  return (
    <div className="flex rounded-lg bg-[var(--t-pista)] p-0.5">
      {([['semana', 'Por semana'], ['dia', 'Día por día']] as const).map(([k, t]) => (
        <button
          key={k}
          onClick={() => alCambiar(k)}
          className={`rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
            valor === k ? 'bg-[var(--t-elevado)] text-[var(--t-txt)] shadow-sm' : 'text-[var(--t-txt-3)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function TablaConsultas() {
  return (
    <>
      {/* En telefono la tabla se salia por la derecha y lo primero que se
          perdia era la posicion, que es justo la columna que importa. Cada
          consulta va como ficha. */}
      <ul className="space-y-2.5 sm:hidden">
        {CONSULTAS.map((c) => (
          <li key={c.texto} className="border-t border-[var(--t-borde-suave)] pt-2.5 first:border-0 first:pt-0">
            <div className="text-[12.5px] leading-snug text-[var(--t-txt-2)]">{c.texto}</div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] tabular-nums text-[var(--t-txt-3)]">
              <span>
                <strong className="font-semibold text-[var(--t-txt)]">{c.clics}</strong> clics
              </span>
              <span>
                <strong className="font-semibold text-[var(--t-txt)]">{miles(c.impresiones)}</strong> impresiones
              </span>
              <span className="inline-flex items-center gap-1">
                posición <strong className="font-semibold text-[var(--t-txt)]">{c.posicion}</strong>
                <span className="rounded bg-[var(--t-ok-bg)] px-1 text-[10.5px] font-semibold text-[var(--t-ok-tx)]">
                  ↑ {(c.antes - c.posicion).toFixed(1)}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>

    <div className="-mx-1 hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[440px] text-left text-[12.5px]">
        <thead>
          <tr className="text-[10.5px] uppercase tracking-wider text-[var(--t-txt-3)]">
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
              className="border-t border-[var(--t-borde-suave)]"
            >
              <td className="px-1 py-2 text-[var(--t-txt-2)]">{c.texto}</td>
              <td className="px-1 py-2 text-right tabular-nums text-[var(--t-txt)]">{c.clics}</td>
              <td className="px-1 py-2 text-right tabular-nums text-[var(--t-txt-3)]">{miles(c.impresiones)}</td>
              <td className="px-1 py-2 text-right tabular-nums">
                <span className="font-semibold text-[var(--t-txt)]">{c.posicion}</span>
                <span className="ml-1.5 rounded bg-[var(--t-ok-bg)] px-1 text-[10.5px] font-semibold text-[var(--t-ok-tx)]">
                  ↑ {(c.antes - c.posicion).toFixed(1)}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

function TarjetaIA({ v, retraso }: { v: (typeof VISIBILIDAD_IA)[number]; retraso: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: retraso }}
      className="rounded-xl bg-[var(--t-ia)] p-3.5 ring-1 ring-white/[.06] sm:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <LogoIA marca={v.marca} alto={15} />
        <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold text-white/70 sm:inline">
          lugar {v.lugar}
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:mt-3">
        <Contador valor={v.presencia} formato={(n) => `${Math.round(n)}%`} className="text-2xl font-bold text-white" />
        <span className="text-[11.5px] text-white/40">antes {v.antes}%</span>
        <span className="w-full text-[11px] text-white/40 sm:hidden">lugar {v.lugar}</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#9933FF,#CC66FF)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${v.presencia}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 + retraso }}
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------- ventanas */

function VentanaGrafica({
  cual,
  alCerrar,
  indicadores,
  d,
  serie,
  grano,
  alCambiarGrano,
  visibles,
  ocultos,
  alAlternarCanal,
  metrica,
  alCambiarMetrica,
  marca,
  periodo,
  p,
  movil,
}: {
  cual: Ampliada;
  alCerrar: () => void;
  indicadores: Indicador[];
  d: ReturnType<typeof resumen>;
  serie: Cubo[];
  grano: Grano;
  alCambiarGrano: (g: Grano) => void;
  visibles: typeof CANALES;
  ocultos: string[];
  alAlternarCanal: (c: string) => void;
  metrica: Metrica;
  alCambiarMetrica: (m: Metrica) => void;
  marca: string | null;
  periodo: Periodo;
  p: Paleta;
  movil: boolean;
}) {
  const desde = `Últimos ${periodo} días · ${EMPRESA.nombre}`;
  const columnaTiempo = grano === 'dia' ? 'Día' : 'Semana del';
  const ind = indicadores.find((x) => x.id === cual);

  /* --- un indicador suelto --- */
  if (ind) {
    return (
      <Modal alCerrar={alCerrar} titulo={ind.titulo} sub={desde} ancho="max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-[var(--t-txt)]">
              {ind.formato ? ind.formato(ind.valor) : miles(ind.valor)}
            </span>
            <Variacion pct={ind.cambio} invertido={ind.invertido} />
          </div>
          <SelectorGrano valor={grano} alCambiar={alCambiarGrano} />
        </div>
        <div className="h-[38vh] min-h-[220px] px-1 py-4 sm:h-[42vh] sm:min-h-[240px] sm:px-4">
          <GraficaIndicador ind={ind} datos={serie} p={p} movil={movil} />
        </div>
        <div className="space-y-3 px-4 pb-5 sm:px-6">
          <p className="rounded-xl bg-[var(--t-suave)] p-3.5 text-[12.5px] leading-relaxed text-[var(--t-txt-2)]">{ind.explica}</p>
          <TablaDatos
            columnas={[columnaTiempo, ind.titulo]}
            filas={serie.map((b) => [b.etiqueta, ind.formato ? ind.formato(ind.de(b)) : ind.de(b)])}
          />
        </div>
      </Modal>
    );
  }

  if (cual === 'canales') {
    return (
      <Modal alCerrar={alCerrar} titulo="De dónde llega la gente" sub={desde} ancho="max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
          <Leyenda ocultos={ocultos} alAlternar={alAlternarCanal} />
          <SelectorGrano valor={grano} alCambiar={alCambiarGrano} />
        </div>
        <div className="h-[40vh] min-h-[240px] px-1 py-4 sm:h-[46vh] sm:min-h-[260px] sm:px-4">
          <GraficaCanales datos={serie} visibles={visibles} marca={marca} p={p} movil={movil} />
        </div>
        <div className="px-4 pb-5 sm:px-6">
          <TablaDatos
            columnas={[columnaTiempo, ...CANALES.map((c) => c.nombre), 'Total']}
            filas={serie.map((b) => [
              b.etiqueta,
              ...CANALES.map((c) => b[c.clave]),
              CANALES.reduce((t, c) => t + b[c.clave], 0),
            ])}
          />
        </div>
      </Modal>
    );
  }

  if (cual === 'embudo') {
    const pasos = pasosEmbudo(d);
    return (
      <Modal alCerrar={alCerrar} titulo="Del clic a la venta" sub={desde} ancho="max-w-3xl">
        <div className="px-4 py-5 sm:px-6">
          <Embudo pasos={pasos} alto={52} />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {pasos.slice(1).map((p, i) => (
              <div key={p.nombre} className="rounded-xl bg-[var(--t-suave)] p-3.5">
                <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--t-txt-3)]">
                  {pasos[i].nombre} → {p.nombre}
                </div>
                <div className="mt-1 text-[19px] font-bold tabular-nums text-[var(--t-txt)]">
                  {((p.valor / pasos[i].valor) * 100).toFixed(1)}%
                </div>
                <div className="text-[11.5px] text-[var(--t-txt-3)]">se quedan {miles(pasos[i].valor - p.valor)} en el camino</div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-[var(--t-suave)] p-3.5 text-[12.5px] leading-relaxed text-[var(--t-txt-2)]">
            Subir un punto la conversión de sesiones a contactos daría{' '}
            <strong className="text-[var(--t-txt)]">{Math.round(d.sesiones * 0.01)}</strong> contactos más en el mismo
            periodo, sin gastar un peso más en traer gente. Por eso el trabajo empieza aquí y no en la pauta.
          </p>
        </div>
      </Modal>
    );
  }

  if (cual === 'buscadores') {
    return (
      <Modal alCerrar={alCerrar} titulo="Buscadores" sub={desde} ancho="max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
          <Selector valor={metrica} alCambiar={alCambiarMetrica} />
          <SelectorGrano valor={grano} alCambiar={alCambiarGrano} />
        </div>
        <div className="h-[36vh] min-h-[220px] px-1 py-4 sm:h-[40vh] sm:min-h-[240px] sm:px-4">
          <GraficaBuscadores datos={serie} metrica={metrica} p={p} movil={movil} />
        </div>
        <div className="px-4 pb-5 sm:px-6">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--t-txt-3)]">
            Consultas del periodo
          </div>
          <TablaDatos
            columnas={['Consulta', 'Clics', 'Impresiones', 'Posición', 'Antes']}
            filas={CONSULTAS.map((c) => [c.texto, c.clics, c.impresiones, c.posicion, c.antes])}
          />
        </div>
      </Modal>
    );
  }

  if (cual === 'ia') {
    const datos = VISIBILIDAD_IA.map((v) => ({ nombre: v.nombre, hoy: v.presencia, antes: v.antes }));
    return (
      <Modal alCerrar={alCerrar} titulo="Visibilidad en IA" sub={desde} ancho="max-w-4xl">
        <div className="h-[34vh] min-h-[200px] px-1 py-5 sm:h-[36vh] sm:min-h-[220px] sm:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datos} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={p.rejilla} vertical={false} />
              <XAxis dataKey="nombre" tick={{ fill: p.eje, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: p.eje, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={46}
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<Globo sufijo="%" />} cursor={{ fill: p.rejilla }} />
              <Bar dataKey="antes" name="Cuando llegamos" fill={p.antes} radius={[5, 5, 0, 0]} animationDuration={700} />
              <Bar dataKey="hoy" name="Hoy" radius={[5, 5, 0, 0]} animationDuration={900}>
                {datos.map((_, i) => (
                  <Cell key={i} fill={i % 2 ? '#9933FF' : MORADO} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 px-4 pb-5 sm:px-6">
          <p className="rounded-xl bg-[var(--t-suave)] p-3.5 text-[12.5px] leading-relaxed text-[var(--t-txt-2)]">
            Cada semana se les hacen a los cuatro modelos las mismas preguntas de compra y se registra si la
            marca aparece y en qué lugar de la respuesta. Es la única forma de medir algo que Search Console no
            reporta.
          </p>
          <TablaDatos
            columnas={['Modelo', 'Hoy', 'Cuando llegamos', 'Lugar en la respuesta']}
            filas={VISIBILIDAD_IA.map((v) => [v.nombre, `${v.presencia}%`, `${v.antes}%`, v.lugar])}
          />
        </div>
      </Modal>
    );
  }

  /* --- auditoría --- */
  return (
    <Modal alCerrar={alCerrar} titulo="Auditoría por área" sub={desde} ancho="max-w-4xl">
      <div className="h-[42vh] min-h-[280px] px-1 py-5 sm:h-[40vh] sm:min-h-[260px] sm:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={PUNTAJE.areas.map((a) => ({ nombre: a.nombre, hoy: a.valor, antes: a.antes }))}
            layout="vertical"
            margin={{ top: 6, right: 20, left: 8, bottom: 0 }}
          >
            <CartesianGrid stroke={p.rejilla} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: p.eje, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="nombre"
              tick={{ fill: p.eje, fontSize: movil ? 10 : 11.5 }}
              axisLine={false}
              tickLine={false}
              width={movil ? 104 : 148}
            />
            <Tooltip content={<Globo />} cursor={{ fill: p.rejilla }} />
            <Bar dataKey="antes" name="Cuando llegamos" fill={p.antes} radius={[0, 4, 4, 0]} animationDuration={700} />
            <Bar dataKey="hoy" name="Hoy" fill={MORADO} radius={[0, 4, 4, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 px-4 pb-5 sm:px-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums text-[var(--t-txt)]">{PUNTAJE.total}</span>
          <span className="text-[13px] text-[var(--t-txt-3)]">de 100 · empezamos en {PUNTAJE.antes}</span>
        </div>
        <TablaDatos
          columnas={['Área', 'Hoy', 'Cuando llegamos', 'Ganancia']}
          filas={PUNTAJE.areas.map((a) => [a.nombre, a.valor, a.antes, `+${a.valor - a.antes}`])}
        />
      </div>
    </Modal>
  );
}

/* --------------------------------------------------------------- globo */

function Globo({ active, payload, label, sufijo = '' }: any) {
  if (!active || !payload?.length) return null;
  // Solo el área apilada tiene un total que signifique algo; en las barras de
  // hoy contra antes, sumarlas seria inventar un numero.
  const apilado = payload.length > 1 && payload[0]?.dataKey !== 'antes';
  const total = payload.reduce((t: number, p: any) => t + (p.value || 0), 0);
  return (
    <div className="rounded-xl border border-[var(--t-borde)] bg-[var(--t-tarjeta)] px-3 py-2.5 shadow-lg">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--t-txt-3)]">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[12.5px]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill || p.stroke }} />
          <span className="text-[var(--t-txt-2)]">{p.name}</span>
          <span className="ml-auto font-semibold tabular-nums text-[var(--t-txt)]">
            {typeof p.value === 'number' ? p.value.toLocaleString('es-MX') : p.value}
            {sufijo}
          </span>
        </div>
      ))}
      {apilado && (
        <div className="mt-1.5 flex items-center gap-2 border-t border-[var(--t-borde-suave)] pt-1.5 text-[12.5px]">
          <span className="text-[var(--t-txt-3)]">Total</span>
          <span className="ml-auto font-bold tabular-nums text-[var(--t-txt)]">{total.toLocaleString('es-MX')}</span>
        </div>
      )}
    </div>
  );
}
