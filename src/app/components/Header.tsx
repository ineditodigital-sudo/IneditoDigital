import { useState, useEffect, useTransition } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from './ui/utils';
import { marca } from '../cms';

interface NavItem {
  label: string;
  path?: string;
  submenu?: { label: string; path: string; description?: string }[];
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { services, openAssistant } = useApp();
  const m = marca.menu();
  const mIA = marca.menuIA();
  const mLogo = marca.logo();

  const navigation: NavItem[] = [
    { label: m('inicio', 'Inicio'), path: '/' },
    {
      label: m('servicios', 'Servicios'),
      path: '/servicios',
      submenu: services.map((service) => ({
        label: service.title,
        path: `/servicios/${service.slug}`,
        description: service.category,
      })),
    },
    {
      label: m('servicios_ia', 'Servicios IA'),
      path: '/servicios-ia',
      submenu: [
        { label: mIA('geo', 'Posicionamiento en IA'), path: '/servicios/posicionamiento-en-ia', description: mIA('geo_desc', 'Que ChatGPT te recomiende') },
        { label: mIA('whatsapp', 'IA para WhatsApp'), path: '/servicios-ia/whatsapp', description: mIA('whatsapp_desc', 'Ventas y Soporte 24/7') },
        { label: mIA('ventas', 'IA de Ventas'), path: '/servicios-ia/ventas', description: mIA('ventas_desc', 'Prospección Inteligente') },
        { label: mIA('marketing', 'IA para Marketing'), path: '/servicios-ia/marketing', description: mIA('marketing_desc', 'Optimización Automática') },
        { label: mIA('ecommerce', 'IA para E-commerce'), path: '/servicios-ia/ecommerce', description: mIA('ecommerce_desc', 'Convierte Más Visitas') },
      ],
    },
    { label: m('portafolio', 'Portafolio'), path: '/portafolio' },
    { label: m('blog', 'Blog'), path: '/blog' },
    { label: m('nosotros', 'Nosotros'), path: '/nosotros' },
    { label: m('contacto', 'Contacto'), path: '/contacto' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAIOpen, setMobileAIOpen] = useState(false);

  // Detectar si estamos en la página 404
  const is404Page = location.pathname === '/404' || !navigation.some(item => 
    item.path === location.pathname || 
    item.submenu?.some(sub => sub.path === location.pathname)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        is404Page
          ? 'bg-transparent py-3 md:py-4'
          : isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-2 md:py-3'
          : 'bg-transparent py-3 md:py-4'
      )}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (item.submenu) {
                    if (item.label === 'Servicios') setIsServicesDropdownOpen(true);
                    if (item.label === 'Servicios IA') setIsAIDropdownOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (item.submenu) {
                    if (item.label === 'Servicios') setIsServicesDropdownOpen(false);
                    if (item.label === 'Servicios IA') setIsAIDropdownOpen(false);
                  }
                }}
              >
                <Link
                  to={item.path || ''}
                  className={cn(
                    'text-xs xl:text-sm font-medium tracking-wide transition-colors relative group flex items-center gap-1',
                    location.pathname === item.path ||
                      (item.label === 'Servicios' && location.pathname.startsWith('/servicios')) ||
                      (item.label === 'Servicios IA' && location.pathname.startsWith('/servicios-ia'))
                      ? 'text-[#7700CE]'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  {item.label}
                  {item.submenu && (
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform',
                        ((item.label === 'Servicios' && isServicesDropdownOpen) ||
                         (item.label === 'Servicios IA' && isAIDropdownOpen)) && 'rotate-180'
                      )}
                    />
                  )}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#7700CE]"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.label === 'Servicios' && isServicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                      <div className="py-2">
                        {item.submenu.map((service) => (
                          <Link
                            key={service.path}
                            to={service.path}
                            className="block px-4 py-2.5 text-xs text-white/80 hover:text-white hover:bg-[#7700CE]/10 transition-colors border-l-2 border-transparent hover:border-[#7700CE]"
                          >
                            <div className="font-medium">{service.label}</div>
                            <div className="text-[10px] text-white/50 mt-0.5">
                              {service.description}
                            </div>
                          </Link>
                        ))}
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <Link
                            to="/servicios"
                            className="block px-4 py-2 text-xs text-[#7700CE] hover:text-[#9933FF] font-bold transition-colors"
                          >
                            {mIA('ver_todos', 'Ver todos los servicios →')}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {item.label === 'Servicios IA' && isAIDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                      <div className="py-2">
                        {item.submenu.map((service) => (
                          <Link
                            key={service.path}
                            to={service.path}
                            className="block px-4 py-2.5 text-xs text-white/80 hover:text-white hover:bg-[#7700CE]/10 transition-colors border-l-2 border-transparent hover:border-[#7700CE]"
                          >
                            <div className="font-medium">{service.label}</div>
                            <div className="text-[10px] text-white/50 mt-0.5">
                              {service.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Desktop */}
          <div className="hidden lg:block">
            <button
              onClick={() => openAssistant(undefined, 'cotizar servicios de marketing digital')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.4)] text-xs font-bold tracking-wider cursor-pointer"
            >
              {m('boton', 'COTIZAR')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2 max-w-7xl">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => {
                          if (item.label === 'Servicios') {
                            setMobileServicesOpen(!mobileServicesOpen);
                            setMobileAIOpen(false);
                          } else if (item.label === 'Servicios IA') {
                            setMobileAIOpen(!mobileAIOpen);
                            setMobileServicesOpen(false);
                          }
                        }}
                        className={cn(
                          'flex items-center justify-between w-full text-sm font-medium py-2.5 px-3 rounded-lg transition-colors',
                          (item.label === 'Servicios' && location.pathname.startsWith('/servicios')) ||
                          (item.label === 'Servicios IA' && location.pathname.startsWith('/servicios-ia'))
                            ? 'text-[#7700CE] bg-[#7700CE]/10'
                            : 'text-white/80 hover:bg-white/5'
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform',
                            ((item.label === 'Servicios' && mobileServicesOpen) ||
                             (item.label === 'Servicios IA' && mobileAIOpen)) && 'rotate-180'
                          )}
                        />
                      </button>
                      
                      {/* Servicios Dropdown */}
                      {item.label === 'Servicios' && mobileServicesOpen && (
                        <div className="mt-2 ml-3 space-y-1">
                          {item.submenu.map((service) => (
                            <Link
                              key={service.path}
                              to={service.path}
                              className="block text-xs text-white/70 hover:text-white py-2 px-3 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              {service.label}
                            </Link>
                          ))}
                          <Link
                            to="/servicios"
                            className="block text-xs text-[#7700CE] py-2 px-3 font-bold"
                          >
                            Ver todos →
                          </Link>
                        </div>
                      )}
                      
                      {/* AI Services Dropdown */}
                      {item.label === 'Servicios IA' && mobileAIOpen && (
                        <div className="mt-2 ml-3 space-y-1">
                          {item.submenu.map((service) => (
                            <Link
                              key={service.path}
                              to={service.path}
                              className="block text-xs text-white/70 hover:text-white py-2 px-3 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path || ''}
                      className={cn(
                        'block text-sm font-medium py-2.5 px-3 rounded-lg transition-colors',
                        location.pathname === item.path
                          ? 'text-[#7700CE] bg-[#7700CE]/10'
                          : 'text-white/80 hover:bg-white/5'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => {
                    openAssistant(undefined, 'cotizar servicios de marketing digital');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-5 py-3 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] text-white text-xs font-bold tracking-wider mt-3 cursor-pointer"
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