import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from './ui/utils';
import { marca } from '../cms';

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

  /* ---- los grupos del mega menu, armados desde los datos ---- */
  const grupos = [
    { titulo: m('grupo_pos', 'Posicionamiento'), cats: ['SEO', 'SEO Local', 'Estrategia'] },
    { titulo: m('grupo_mkt', 'Marketing y publicidad'), cats: ['Marketing', 'Publicidad', 'Eventos', 'Email'] },
    { titulo: m('grupo_dis', 'Diseño y desarrollo'), cats: ['Diseño', 'Desarrollo', 'Innovación', 'IA'] },
  ].map((g) => ({
    ...g,
    items: services.filter((s) => g.cats.includes(s.category)),
  }));
  // lo que no cayo en ningun grupo, al ultimo: ningun servicio se queda fuera
  const asignados = new Set(grupos.flatMap((g) => g.items.map((s) => s.slug)));
  grupos[grupos.length - 1].items.push(...services.filter((s) => !asignados.has(s.slug)));

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
    { label: m('glosario', 'Glosario'), path: '/glosario' },
    { label: m('nosotros', 'Nosotros'), path: '/nosotros' },
    { label: m('contacto', 'Contacto'), path: '/contacto' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [megaAbierto, setMegaAbierto] = useState(false);
  const [movilServicios, setMovilServicios] = useState(false);

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
        is404Page
          ? 'bg-transparent py-3 md:py-4'
          : isScrolled || megaAbierto
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 py-2 md:py-3'
          : 'bg-transparent py-3 md:py-4'
      )}
      onMouseLeave={() => setMegaAbierto(false)}
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
            <Enlace to="/" activo={location.pathname === '/'}>{m('inicio', 'Inicio')}</Enlace>

            {/* El disparador del mega menu */}
            <div onMouseEnter={() => setMegaAbierto(true)}>
              <Link
                to="/servicios"
                onFocus={() => setMegaAbierto(true)}
                aria-expanded={megaAbierto}
                aria-haspopup="true"
                className={cn(
                  'text-xs xl:text-sm font-medium tracking-wide transition-colors relative flex items-center gap-1',
                  enServicios ? 'text-[#AA66FF]' : 'text-white/80 hover:text-white'
                )}
              >
                {m('servicios', 'Servicios')}
                <ChevronDown size={14} className={cn('transition-transform', megaAbierto && 'rotate-180')} />
              </Link>
            </div>

            {enlaces.slice(1).map((e) => (
              <Enlace key={e.path} to={e.path} activo={location.pathname === e.path}>
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-0 right-0 top-full hidden lg:block"
            onMouseEnter={() => setMegaAbierto(true)}
          >
            <div className="container mx-auto max-w-6xl px-6 pt-3 pb-6">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-[1fr_1fr_1fr_1.15fr]">
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
                            className="group block rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[.06]"
                          >
                            <div className="text-[12.5px] font-medium text-white/85 transition-colors group-hover:text-white">
                              {s.title}
                            </div>
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
                          className="block rounded-lg px-2 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        >
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

function Enlace({ to, activo, children }: { to: string; activo: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
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
