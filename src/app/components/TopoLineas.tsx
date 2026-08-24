import { useEffect, useRef } from 'react';

/**
 * Las lineas topograficas de la marca, dibujadas en vivo.
 *
 * Es el mismo motivo que usan las tarjetas de contacto del equipo, pero ahi se
 * sirve como video de 0,5 MB. Para una pagina de contenido no compensa: el
 * canvas lo dibuja igual sin descargar nada.
 *
 * Se apagan hacia el centro para que el texto siempre gane el contraste, y se
 * detienen solas cuando la seccion sale de pantalla o si el sistema pide menos
 * animacion.
 */
export function TopoLineas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = lienzo.getContext('2d');
    if (!ctx) return;

    let anim = 0;
    let ancho = 0;
    let alto = 0;

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = lienzo.getBoundingClientRect();
      ancho = r.width;
      alto = r.height;
      lienzo.width = Math.round(ancho * dpr);
      lienzo.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pintar = (t: number) => {
      ctx.clearRect(0, 0, ancho, alto);
      const lineas = 26;
      const paso = alto / (lineas - 1);
      const fase = t / 9000;
      for (let i = 0; i < lineas; i++) {
        const base = i * paso;
        // 0 en el centro vertical, 1 en los bordes: el texto vive en el centro.
        const lejos = Math.abs(i / (lineas - 1) - 0.5) * 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(153, 51, 255, ${(0.06 + lejos * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1;
        for (let x = 0; x <= ancho; x += 7) {
          const u = x / Math.max(ancho, 1);
          const y =
            base +
            Math.sin(u * 5.1 + fase + i * 0.21) * 20 +
            Math.sin(u * 11.3 - fase * 1.6 + i * 0.13) * 8 +
            Math.sin(u * 2.2 + fase * 0.6) * 13;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      anim = requestAnimationFrame(pintar);
    };

    medir();
    anim = requestAnimationFrame(pintar);

    let espera: number;
    const alRedimensionar = () => {
      window.clearTimeout(espera);
      espera = window.setTimeout(medir, 150);
    };
    window.addEventListener('resize', alRedimensionar);

    // No gastar bateria mientras la seccion no se ve
    const ojo = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !anim) anim = requestAnimationFrame(pintar);
        else if (!e.isIntersecting && anim) {
          cancelAnimationFrame(anim);
          anim = 0;
        }
      });
    });
    ojo.observe(lienzo);

    return () => {
      if (anim) cancelAnimationFrame(anim);
      window.clearTimeout(espera);
      window.removeEventListener('resize', alRedimensionar);
      ojo.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
