import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from './ui/utils';
import { marca } from '../cms';
import { agruparServicios } from '../data/grupos';
import { IconoServicio } from './IconoServicio';

/*
 * Antes habia dos menus desplegables gemelos: "Servicios" (13 filas en una
 * columna) y "Servicios IA" (5 filas). Ahora hay UN mega menu bajo
 * "Servicios": tres grupos por categoria + la columna de IA destacada.
 * Menos entradas arriba, mas mapa al abrirlo.
 *
 * En movil no hay mega menu: el mismo contenido va como acordeon con
 * encabezados de grupo, que en pantalla chica funciona mejor que un panel.
 */

export default function Header() {
  const location = useLocation();
  const { services, openAssistant } = useApp();
  const m = marca.menu();
  const mIA = marca.menuIA();
  const mLogo = marca.logo();

  /*
   * Los grupos del mega menu.
   *
   * Salen de agruparServicios y no de una lista propia: el asistente usa la
   * misma funcion, y si el chat y el menu contestan distinto a "que servicios
   * tienen" la culpa siempre es de dos listas paralelas. Aqui habia una.
   */
  const grupos = agruparServicios(services).map((g, i) => ({
    ...g,
    titulo: m(`grupo_${i + 1}`, g.titulo),
  }));

  const itemsIA = [
    { label: mIA('geo', 'Posicionamiento en IA'), path: '/servicios/posicionamiento-en-ia', description: mIA('geo_desc', 'Que ChatGPT te recomiende') },
    { label: mIA('whatsapp', 'IA para WhatsApp'), path: '/servicios-ia/whatsapp', description: mIA('whatsapp_desc', 'Ventas y Soporte 24/7') },
    { label: mIA('ventas', 'IA de Ventas'), path: '/servicios-ia/ventas', description: mIA('ventas_desc', 'Prospección Inteligente') },
    { label: mIA('marketing', 'IA para Marketing'), path: '/servicios-ia/marketing', description: mIA('marketing_desc', 'Optimización Automática') },
    { label: mIA('ecommerce', 'IA para E-commerce'), path: '/servicios-ia/ecommerce', description: mIA('ecommerce_desc', 'Convierte Más Visitas') },
  ];

  const enlaces = [
    { label: m('inicio', 'Inicio'), path: '/' },
    { label: m('portafolio', 'Portafolio'), path: '/portafolio' },
    { label: m('blog', 'Blog'), path: '/blog' },
    { label: m('nosotros', 'Nosotros'), path: '/nosotros' },
    { label: m('contacto', 'Contacto'), path: '/contacto' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [megaAbierto, setMegaAbierto] = useState(false);
  const [movilServicios, setMovilServicios] = useState(false);

  /*
   * Abrir y cerrar el mega menu.
   *
   * El cierre lleva un respiro de 120 ms: entre el disparador y el panel hay
   * un hueco de unos pixeles, y sin ese margen el menu parpadea justo cuando
   * bajas el raton hacia el.
   */
  const temporizador = useRef<number | undefined>(undefined);
  const abrirMega = () => {
    window.clearTimeout(temporizador.current);
    setMegaAbierto(true);
  };
  const cerrarMega = (retraso = 120) => {
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setMegaAbierto(false), retraso);
  };
  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  /*
   * Dos salidas mas, para cuando no hay raton que pueda "salirse":
   * Escape, y tocar fuera de la cabecera. Sin esto, en tableta el panel se
   * abria de un toque y no habia forma de quitarlo sin navegar.
   */
  useEffect(() => {
    if (!megaAbierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarMega(0);
    };
    const alTocar = (e: PointerEvent) => {
      if (!(e.target as Element)?.closest?.('header')) cerrarMega(0);
    };
    window.addEventListener('keydown', alPulsar);
    document.addEventListener('pointerdown', alTocar);
    return () => {
      window.removeEventListener('keydown', alPulsar);
      document.removeEventListener('pointerdown', alTocar);
    };
  }, [megaAbierto]);

  /* Rutas conocidas, para detectar la 404 (mismo criterio que antes) */
  const rutas = [
    ...enlaces.map((e) => e.path),
    '/servicios',
    '/servicios-ia',
    ...services.map((s) => `/servicios/${s.slug}`),
    ...itemsIA.map((s) => s.path),
  ];
  const is404Page = location.pathname === '/404' || !rutas.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMovilAbierto(false);
    setMegaAbierto(false);
  }, [location]);

  const enServicios = location.pathname.startsWith('/servicios');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        // el relleno NO puede depender de megaAbierto: si la cabecera encoge
        // al abrirse, se mueve bajo el raton y el menu se pone a oscilar
        is404Page ? 'py-3 md:py-4' : isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-4',
        !is404Page && (isScrolled || megaAbierto)
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      )}
      onMouseLeave={() => cerrarMega()}
    >
      <nav className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              src={mLogo('imagen', 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp')}
              alt={mLogo('alt', 'INÉDITO DIGITAL - Agencia de Marketing Digital en Aguascalientes')}
              className="h-8 md:h-10 w-auto object-contain"
              loading="eager"
            />
          </Link>

          {/* Navegacion de escritorio */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Enlace to="/" activo={location.pathname === '/'} onHover={() => cerrarMega(0)}>
              {m('inicio', 'Inicio')}
            </Enlace>

            {/* El disparador del mega menu */}
            <div onMouseEnter={abrirMega} onMouseLeave={() => cerrarMega()}>
              <Link
                to="/servicios"
                onFocus={abrirMega}
                onClick={(e) => {
                  /* En tactil no hay hover: el primer toque abre el panel en
                     vez de navegar a ciegas; el segundo ya entra. */
                  if (window.matchMedia('(hover: none)').matches && !megaAbierto) {
                    e.preventDefault();
                    abrirMega();
                  }
                }}
                aria-expanded={megaAbierto}
                aria-haspopup="true"
                className={cn(
                  'text-xs xl:text-sm font-medium tracking-wide transition-colors relative flex items-center gap-1',
                  enServicios || megaAbierto ? 'text-[#AA66FF]' : 'text-white/80 hover:text-white'
                )}
              >
                {m('servicios', 'Servicios')}
                <ChevronDown size={14} className={cn('transition-transform duration-200', megaAbierto && 'rotate-180')} />
              </Link>
            </div>

            {/* Pasar por otro enlace cierra el panel: antes seguia abierto
                tapando la pagina porque solo se cerraba al salir del header. */}
            {enlaces.slice(1).map((e) => (
              <Enlace
                key={e.path}
                to={e.path}
                activo={location.pathname === e.path}
                onHover={() => cerrarMega(0)}
              >
                {e.label}
              </Enlace>
            ))}
          </div>

          {/* CTA escritorio */}
          <div className="hidden lg:block">
            <button
              onClick={() => openAssistant(undefined, 'cotizar servicios de marketing digital')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.4)] text-xs font-bold tracking-wider cursor-pointer"
            >
              {m('boton', 'COTIZAR')}
            </button>
          </div>

          {/* Boton de menu movil */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMovilAbierto(!movilAbierto)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {movilAbierto ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* ============================ MEGA MENU (escritorio) ============================ */}
      <AnimatePresence>
        {megaAbierto && (
          <motion.div
            /*
             * Mientras se desvanece, el panel sigue en el DOM ~220 ms. El
             * pointerEvents va en las variantes y no en style porque durante
             * la salida React ya no vuelve a pintar este subarbol: si no,
             * queda una franja invisible por delante de la pagina y el primer
             * clic despues de cerrar el menu se lo traga el panel.
             */
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, pointerEvents: 'auto' }}
            exit={{ opacity: 0, y: 8, pointerEvents: 'none' }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-0 right-0 top-full hidden lg:block"
            onMouseEnter={abrirMega}
            onMouseLeave={() => cerrarMega()}
          >
            <div className="container mx-auto max-w-5xl px-6 pt-3 pb-6">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
                <div
                  className="grid"
                  style={{ gridTemplateColumns: `repeat(${grupos.length}, 1fr) 1.15fr` }}
                >
                  {/* Los tres grupos de servicios */}
                  {grupos.map((g) => (
                    <div key={g.titulo} className="border-r border-white/8 p-5">
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-white/40">
                        {g.titulo}
                      </div>
                      <div className="space-y-0.5">
                        {g.items.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/servicios/${s.slug}`}
                            className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[.06]"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[.04] text-white/45 transition-colors group-hover:border-[#CC66FF]/40 group-hover:bg-[#CC66FF]/12 group-hover:text-[#CC66FF]">
                              <IconoServicio nombre={s.icon} size={15} />
                            </span>
                            <span className="text-[12.5px] font-medium text-white/85 transition-colors group-hover:text-white">
                              {s.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* La columna de IA, destacada */}
                  <div
                    className="p-5"
                    style={{ background: 'linear-gradient(160deg, rgba(119,0,206,.22), rgba(119,0,206,.05))' }}
                  >
                    <Link
                      to="/servicios-ia"
                      className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-[#CC66FF] hover:text-white transition-colors"
                    >
                      <Sparkles size={12} />
                      {m('servicios_ia', 'Servicios IA')}
                    </Link>
                    <div className="space-y-0.5">
                      {itemsIA.map((s) => (
                        <Link
                          key={s.path}
                          to={s.path}
                          className="group block rounded-lg px-2.5 py-2 transition-colors hover:bg-[#CC66FF]/10"
                        >
                          <div className="text-[12.5px] font-medium text-white/90 transition-colors group-hover:text-white">
                            {s.label}
                          </div>
                          <div className="mt-0.5 text-[10.5px] text-white/45">{s.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pie del panel */}
                <div className="flex items-center justify-between border-t border-white/8 px-5 py-3">
                  <span className="text-[11px] text-white/40">
                    {m('mega_pie', 'Construir, mejorar o vender: el servicio se adapta a tu punto de partida')}
                  </span>
                  <Link
                    to="/servicios"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC66FF] transition-colors hover:text-white"
                  >
                    {mIA('ver_todos', 'Ver todos los servicios')}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================ MENU MOVIL ============================ */}
      <AnimatePresence>
        {movilAbierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto max-w-7xl space-y-1 px-4 py-4 max-h-[calc(100vh-70px)] overflow-y-auto">
              <MovilEnlace to="/" activo={location.pathname === '/'}>{m('inicio', 'Inicio')}</MovilEnlace>

              {/* Servicios: acordeon con los mismos grupos del mega menu */}
              <button
                onClick={() => setMovilServicios(!movilServicios)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  enServicios ? 'bg-[#7700CE]/10 text-[#AA66FF]' : 'text-white/80 hover:bg-white/5'
                )}
              >
                <span>{m('servicios', 'Servicios')}</span>
                <ChevronDown size={16} className={cn('transition-transform', movilServicios && 'rotate-180')} />
              </button>

              {movilServicios && (
                <div className="ml-2 space-y-3 border-l border-white/10 pl-3 pt-1">
                  {grupos.map((g) => (
                    <div key={g.titulo}>
                      <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[.16em] text-white/35">
                        {g.titulo}
                      </div>
                      {g.items.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/servicios/${s.slug}`}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <IconoServicio nombre={s.icon} size={13} className="shrink-0 text-white/40" />
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div>
                    <div className="mb-1 flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[.16em] text-[#CC66FF]">
                      <Sparkles size={10} />
                      {m('servicios_ia', 'Servicios IA')}
                    </div>
                    {itemsIA.map((s) => (
                      <Link
                        key={s.path}
                        to={s.path}
                        className="block rounded-lg px-2 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                  <Link to="/servicios" className="block px-2 py-1.5 text-xs font-bold text-[#CC66FF]">
                    {mIA('ver_todos', 'Ver todos los servicios')} →
                  </Link>
                </div>
              )}

              {enlaces.slice(1).map((e) => (
                <MovilEnlace key={e.path} to={e.path} activo={location.pathname === e.path}>
                  {e.label}
                </MovilEnlace>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <button
                  onClick={() => {
                    openAssistant(undefined, 'cotizar servicios de marketing digital');
                    setMovilAbierto(false);
                  }}
                  className="mt-3 block w-full cursor-pointer rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-5 py-3 text-center text-xs font-bold tracking-wider text-white"
                >
                  {m('boton', 'COTIZAR')} AHORA
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---- enlaces auxiliares ---- */

function Enlace({
  to,
  activo,
  children,
  onHover,
}: {
  to: string;
  activo: boolean;
  children: React.ReactNode;
  /** Pasar por aqui cierra el mega menu, si estaba abierto. */
  onHover?: () => void;
}) {
  return (
    <Link
      to={to}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        'text-xs xl:text-sm font-medium tracking-wide transition-colors relative group',
        activo ? 'text-[#AA66FF]' : 'text-white/80 hover:text-white'
      )}
    >
      {children}
      <motion.span
        className="absolute -bottom-1 left-0 h-0.5 bg-[#9933FF]"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  );
}

function MovilEnlace({ to, activo, children }: { to: string; activo: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        activo ? 'bg-[#7700CE]/10 text-[#AA66FF]' : 'text-white/80 hover:bg-white/5'
      )}
    >
      {children}
    </Link>
  );
}
