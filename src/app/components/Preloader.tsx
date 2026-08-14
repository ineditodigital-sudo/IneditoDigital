import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ocultar preloader cuando el DOM esté listo y las fuentes cargadas
    const hidePreloader = () => {
      // Pequeño delay para transición suave
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Si el documento ya está listo
    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      // Esperar a que todo esté cargado
      window.addEventListener('load', hidePreloader);
    }

    // Timeout de seguridad - nunca mostrar más de 2 segundos
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('load', hidePreloader);
      clearTimeout(timeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300"
      style={{ opacity: isLoading ? 1 : 0 }}
    >
      {/* Orb de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7700CE] rounded-full blur-[120px] opacity-30 animate-pulse" />
      
      {/* Logo animado */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="animate-float">
          <img
            src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/ICONO%20A%20COLOR%20INEDITO.webp"
            alt="INÉDITO"
            className="w-20 h-20 object-contain"
            width="80"
            height="80"
          />
        </div>
        
        {/* Barra de progreso minimalista */}
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
