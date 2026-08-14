import { useEffect } from 'react';

/**
 * Componente que agrega preload y preconnect hints para optimizar LCP
 * Estos hints ayudan al navegador a cargar recursos críticos más rápido
 */
export default function CriticalResourceHints() {
  useEffect(() => {
    // Viewport meta tag para asegurar renderizado correcto en móviles
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, minimum-scale=1.0';

    // Theme color para la barra de navegación en móviles
    let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    themeColor.content = '#0A0A0A';

    // Preconnect a la CDN de imágenes
    const preconnectCDN = document.createElement('link');
    preconnectCDN.rel = 'preconnect';
    preconnectCDN.href = 'https://imagenes.inedito.digital';
    preconnectCDN.crossOrigin = 'anonymous';
    if (!document.querySelector('link[href="https://imagenes.inedito.digital"]')) {
      document.head.appendChild(preconnectCDN);
    }

    // DNS prefetch como fallback
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://imagenes.inedito.digital';
    if (!document.querySelector('link[rel="dns-prefetch"][href="https://imagenes.inedito.digital"]')) {
      document.head.appendChild(dnsPrefetch);
    }

    // Preload del logo (LCP crítico)
    const preloadLogo = document.createElement('link');
    preloadLogo.rel = 'preload';
    preloadLogo.as = 'image';
    preloadLogo.href = 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp';
    preloadLogo.setAttribute('fetchpriority', 'high');
    preloadLogo.setAttribute('imagesrcset', 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp');
    preloadLogo.setAttribute('imagesizes', '128px');
    if (!document.querySelector('link[href*="LOGO%20INEDITO"]')) {
      document.head.appendChild(preloadLogo);
    }

    // Preload de la fuente Hanson (crítica para el h1) - desde servidor remoto
    const preloadFont = document.createElement('link');
    preloadFont.rel = 'preload';
    preloadFont.as = 'font';
    preloadFont.type = 'font/woff2';
    preloadFont.href = 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Hanson-Bold.woff2';
    preloadFont.crossOrigin = 'anonymous';
    preloadFont.setAttribute('fetchpriority', 'high');
    if (!document.querySelector('link[href*=\"Hanson-Bold\"]')) {
      document.head.appendChild(preloadFont);
    }

    return () => {
      // Cleanup si es necesario
    };
  }, []);

  return null;
}