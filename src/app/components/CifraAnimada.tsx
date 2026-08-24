import { useEffect, useRef, useState } from 'react';

/**
 * Una cifra que cuenta hasta su valor la primera vez que se ve.
 *
 * El valor viene del panel, asi que puede ser "100+", "5X" o "3": se separa el
 * numero del sufijo y solo se anima el numero. Si no empieza por digito se
 * muestra tal cual, sin inventar nada.
 */
export function CifraAnimada({
  valor,
  className = '',
  style,
}: {
  valor: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = /^(\d+)(.*)$/.exec(valor.trim());
  const destino = m ? parseInt(m[1], 10) : null;
  const sufijo = m ? m[2] : '';
  const [n, setN] = useState(destino === null ? null : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || destino === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(destino);
      return;
    }
    let anim = 0;
    const ojo = new IntersectionObserver(
      (es, o) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          o.unobserve(e.target);
          let t0: number | null = null;
          const paso = (t: number) => {
            if (t0 === null) t0 = t;
            const p = Math.min((t - t0) / 900, 1);
            setN(Math.round(destino * (1 - Math.pow(1 - p, 3))));
            if (p < 1) anim = requestAnimationFrame(paso);
          };
          anim = requestAnimationFrame(paso);
        });
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    ojo.observe(el);
    return () => {
      if (anim) cancelAnimationFrame(anim);
      ojo.disconnect();
    };
  }, [destino]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {n === null ? valor : n + sufijo}
    </span>
  );
}
