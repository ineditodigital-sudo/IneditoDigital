import { useEffect } from 'react';

/**
 * Preloader optimizado para Hanson
 * Carga desde servidor con URL correcta
 */
export default function FontPreloader() {
  useEffect(() => {
    // Preconnect al servidor de fuentes
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://imagenes.inedito.digital';
    preconnect.crossOrigin = 'anonymous';
    
    if (!document.querySelector('link[href="https://imagenes.inedito.digital"]')) {
      document.head.insertBefore(preconnect, document.head.firstChild);
    }

    // Preload de Hanson con URL correcta (con %20DIGITAL)
    const preloadHanson = document.createElement('link');
    preloadHanson.rel = 'preload';
    preloadHanson.as = 'font';
    preloadHanson.type = 'font/woff2';
    preloadHanson.href = 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Hanson-Bold.woff2';
    preloadHanson.crossOrigin = 'anonymous';
    
    if (!document.querySelector('link[href*="Hanson-Bold"]')) {
      document.head.insertBefore(preloadHanson, document.head.firstChild);
    }

    console.log('🎨 FontPreloader: Hanson cargando desde imagenes.inedito.digital');
  }, []);

  return null;
}