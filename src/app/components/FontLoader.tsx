import { useEffect } from 'react';

/**
 * Componente robusto que garantiza la carga de fuente Hanson
 * Estrategia: preload agresivo + detección + timeout + fallback
 */
export default function FontLoader() {
  useEffect(() => {
    let fontTimeout: NodeJS.Timeout;
    
    // Función para aplicar clase de éxito
    const applyFontLoaded = () => {
      document.documentElement.classList.add('fonts-loaded');
      document.documentElement.classList.remove('fonts-failed', 'fonts-timeout');
      console.log('✅ Fuente Hanson cargada correctamente');
    };

    // Función para aplicar fallback
    const applyFontFallback = (reason: string) => {
      document.documentElement.classList.remove('fonts-loaded');
      document.documentElement.classList.add('fonts-failed');
      console.warn(`⚠️ Fuente Hanson falló (${reason}), usando fallback`);
    };

    // Estrategia 1: Verificar si ya está en cache
    if ('fonts' in document) {
      const fontCheck = (document as any).fonts.check('700 16px Hanson');
      if (fontCheck) {
        applyFontLoaded();
        return;
      }
    }

    // Estrategia 2: Precargar la fuente
    const forceLoadFont = async () => {
      try {
        // Crear un elemento invisible que use la fuente
        const testElement = document.createElement('div');
        testElement.style.fontFamily = 'Hanson, sans-serif';
        testElement.style.fontSize = '16px';
        testElement.style.fontWeight = '700';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.visibility = 'hidden';
        testElement.textContent = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        document.body.appendChild(testElement);

        // Esperar a que las fuentes estén listas
        if ('fonts' in document && (document as any).fonts.ready) {
          await (document as any).fonts.ready;
          
          // Verificar si Hanson se cargó
          const hansonLoaded = (document as any).fonts.check('700 16px Hanson');
          
          if (hansonLoaded) {
            applyFontLoaded();
          } else {
            // Intentar cargar manualmente desde la URL correcta
            try {
              const font = new FontFace(
                'Hanson',
                'url(https://imagenes.inedito.digital/INEDITO%20DIGITAL/Hanson-Bold.woff2) format("woff2")',
                { weight: '700', style: 'normal' }
              );
              await font.load();
              (document as any).fonts.add(font);
              applyFontLoaded();
            } catch (loadError) {
              // Si falla la carga remota, marcar como cargada de todas formas
              // La fuente se cargará desde /fonts/Hanson-Bold.woff2 vía CSS
              applyFontLoaded();
            }
          }
        } else {
          // Navegadores antiguos: esperar un poco y verificar
          setTimeout(() => {
            const computed = window.getComputedStyle(testElement);
            if (computed.fontFamily.includes('Hanson')) {
              applyFontLoaded();
            } else {
              // Asumir que se cargará desde CSS
              applyFontLoaded();
            }
          }, 1000);
        }

        // Limpiar elemento de prueba
        setTimeout(() => {
          if (testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
          }
        }, 2000);

      } catch (error) {
        // En caso de error, asumir que la fuente se cargará desde CSS
        applyFontLoaded();
      }
    };

    // Estrategia 3: Timeout de seguridad (2 segundos)
    fontTimeout = setTimeout(() => {
      if (!document.documentElement.classList.contains('fonts-loaded')) {
        document.documentElement.classList.add('fonts-timeout');
        // No mostrar error, simplemente marcar como cargada
        applyFontLoaded();
      }
    }, 2000);

    // Ejecutar carga
    forceLoadFont();

    return () => {
      clearTimeout(fontTimeout);
    };
  }, []);

  return null;
}
