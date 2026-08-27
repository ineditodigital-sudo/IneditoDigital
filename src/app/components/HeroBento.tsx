import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';
import EsferaIA from './EsferaIA';
import Floating3DElements from './Floating3DElements';
import TopographyCanvas from './TopographyCanvas';
import { useState, useEffect, memo } from 'react';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

function HeroBento() {
  const { openAssistant } = useApp();
  /* Textos editables desde el panel. El segundo argumento es lo que hay hoy:
     si el campo queda vacío se usa eso, así la portada nunca se ve rota. */
  const t = contenido('home', 'portada');
  const b = contenido('home', 'bento');
  
  // Inicializar con detección más rápida para evitar layout shift
  const [isMobile, setIsMobile] = useState(() => {
    // Inicialización segura que funciona tanto en cliente como en SSR
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  if (isMobile) {
    // VERSIÓN MÓVIL DEDICADA - DISEÑO CENTRADO
    return (
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
        {/* Fondo topográfico animado */}
        <TopographyCanvas />
      {/* El resplandor superior del refresh: un gradiente, cero JS */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[75%]"
        style={{ background: 'radial-gradient(60% 58% at 50% -14%, rgba(153,51,255,.30), rgba(119,0,206,.10) 55%, transparent 78%)' }}
      />
        {/* El resplandor superior del refresh: un gradiente, cero JS */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[75%]"
        style={{ background: 'radial-gradient(60% 58% at 50% -14%, rgba(153,51,255,.30), rgba(119,0,206,.10) 55%, transparent 78%)' }}
      />
        
        {/* Elementos 3D flotantes - reducidos para móvil */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Floating3DElements variant="mixed" count={5} />
        </div>

        <div className="container mx-auto relative z-20 max-w-lg text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7700CE]/20 border border-[#7700CE]/40 backdrop-blur-xl mb-6 shadow-[0_0_30px_rgba(119,0,206,0.3)] animate-fadeIn-lcp" style={{ animationDelay: '0.1s' }}>
            <Sparkles className="text-[#7700CE]" size={16} />
            <span className="text-xs text-white font-semibold tracking-wide">{t('etiqueta', 'Aguascalientes · Medimos hasta la venta')}</span>
          </div>

          {/* Título Principal - Centrado - CRÍTICO PARA LCP */}
          <h1 className="heading mb-4">
            {/* La linea que posiciona va dentro del h1 y no como texto suelto:
                es la frase por la que el sitio sale entre la 4 y la 8. */}
            <span className="mb-3 block font-mono text-[10.5px] font-semibold tracking-[.22em] text-[#AA66FF]">
              {t('titulo_0', 'Agencia de marketing digital en Aguascalientes')}
            </span>
            <span className="block text-white mb-2 text-[28px] leading-tight">
              {t('titulo_1', 'DIRECCIÓN COMERCIAL')}
            </span>
            <span className="block bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent text-[32px] leading-tight [text-wrap:balance]">
              {t('titulo_2', 'ASISTIDA POR IA')}
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-md mx-auto px-2 animate-fadeIn-lcp" style={{ animationDelay: '0.2s' }}>
            {t('descripcion', 'No vendemos campañas sueltas: conectamos los objetivos de tu dirección con todo lo que tu negocio hace en digital, en un solo tablero, y cada mes una IA audita que la estrategia esté funcionando.')}
          </p>

          {/* CTAs - Centrados y apilados */}
          <div className="flex flex-col gap-3 mb-10 animate-fadeIn-lcp" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => openAssistant(undefined, 'cotizar servicios de marketing digital')}
              className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 shadow-[0_0_30px_rgba(119,0,206,0.5)] hover:shadow-[0_0_50px_rgba(119,0,206,0.8)] active:scale-95 group cursor-pointer"
            >
              <span className="font-bold tracking-wider text-base">{t('boton_1', 'COTIZAR AHORA')}</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <a
              href="#servicios"
              className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 border-2 border-white/20 hover:bg-white/10 text-white transition-all duration-300 backdrop-blur-sm active:scale-95"
            >
              <span className="font-bold tracking-wider text-base">{t('boton_2', 'VER SERVICIOS')}</span>
            </a>
          </div>

          {/* La esfera, compacta. El canvas cuida solo su rendimiento. */}
          <div className="animate-fadeIn relative mx-auto mt-2 w-full max-w-[300px]" style={{ animationDelay: '0.45s' }}>
            <EsferaIA className="aspect-square w-full" />
          </div>

        </div>
      </section>
    );
  }

  // VERSIÓN DESKTOP ORIGINAL
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-0 py-12 md:py-16 overflow-hidden">
      {/* Fondo topográfico animado */}
      <TopographyCanvas />
      
      {/* Elementos 3D flotantes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Floating3DElements variant="mixed" count={8} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          
          {/* Columna Izquierda - Contenido */}
          <motion.div
            initial={{ opacity: 1, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 md:space-y-5 lg:pr-8"
          >
            {/* Título Principal - Limitado al 50% en desktop - CRÍTICO PARA LCP */}
            <h1 className="heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight lg:max-w-[90%]">
              <span className="mb-3 block font-mono text-[10.5px] font-semibold tracking-[.22em] text-[#AA66FF] md:text-[11.5px]">
                {t('titulo_0', 'Agencia de marketing digital en Aguascalientes')}
              </span>
              <span className="block text-white mb-1 md:mb-2">{t('titulo_1', 'DIRECCIÓN COMERCIAL')}</span>
              <span className="block bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent [text-wrap:balance]">
                {t('titulo_2', 'ASISTIDA POR IA')}
              </span>
            </h1>

            {/* Descripción */}
            <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
              {t('descripcion', 'No vendemos campañas sueltas: conectamos los objetivos de tu dirección con todo lo que tu negocio hace en digital, en un solo tablero, y cada mes una IA audita que la estrategia esté funcionando.')}
            </p>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => openAssistant(undefined, 'cotizar servicios de marketing digital')}
                className="inline-flex items-center justify-center px-6 md:px-7 py-3 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(119,0,206,0.6)] group cursor-pointer"
              >
                <span className="text-sm md:text-base font-bold tracking-wider">{t('boton_1', 'COTIZAR AHORA')}</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              
              <a
                href="#servicios"
                className="inline-flex items-center justify-center px-6 md:px-7 py-3 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-all duration-300"
              >
                <span className="text-sm md:text-base font-bold tracking-wider">{t('boton_2', 'VER SERVICIOS')}</span>
              </a>
            </div>

          </motion.div>

          {/* Columna derecha: la esfera de red, abstracta e interactiva.
              3D proyectado a mano en canvas: gira sola, se arrastra con el
              cursor y tocar un nodo dispara pulsos por las conexiones. */}
          <div className="relative animate-fadeIn-lcp" style={{ animationDelay: '0.25s' }}>
            <EsferaIA className="mx-auto aspect-square w-full max-w-[520px]" />
            <div className="animate-flotar absolute left-2 top-12" style={{ animationDelay: '1.2s' }}>
              <GlassCard className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#00ff88]" />
                  <span className="text-xs font-medium text-white">{b('chip_1', 'IA auditando')}</span>
                </div>
              </GlassCard>
            </div>
            <div className="animate-flotar absolute bottom-10 right-2" style={{ animationDelay: '0.6s' }}>
              <GlassCard className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#CC66FF]" size={14} />
                  <span className="text-xs font-medium text-white">{b('chip_2', 'Medido hasta la venta')}</span>
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default memo(HeroBento);