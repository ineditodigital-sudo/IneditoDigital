import { useEffect, useRef, memo } from 'react';

function TopographyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const textureRef = useRef<HTMLCanvasElement | OffscreenCanvas | null>(null);
  const runningRef = useRef(false);
  const lastRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --------- Ajustes ultra-ligeros ----------
    const PURPLE_A = 'rgba(168,85,247,0.18)';
    const PURPLE_B = 'rgba(124,58,237,0.12)';
    const CONTOURS = 8;          // menos líneas = más ligero
    const TEX_SIZE = 900;        // textura (px)
    const GRID_STEP = 22;        // más grande = ondas más amplias + menos cómputo
    const WAVE_SCALE = 0.008;    // más pequeño = ondas más amplias
    const DRIFT_X = 10;          // px/seg
    const DRIFT_Y = 6;           // px/seg
    const FPS_CAP = 24;          // cap de fps
    // -----------------------------------------

    // Marching Squares cases
    const cases = [
      [], [[3, 0]], [[0, 1]], [[3, 1]],
      [[1, 2]], [[3, 2], [0, 1]], [[0, 2]], [[3, 2]],
      [[2, 3]], [[0, 2]], [[0, 3], [1, 2]], [[1, 2]],
      [[1, 3]], [[0, 1]], [[3, 0]], []
    ];

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let w = 0, h = 0;
    const frameInterval = 1000 / FPS_CAP;

    // --- textura pre-render (1 sola vez) ---
    const tex = (typeof OffscreenCanvas !== 'undefined')
      ? new OffscreenCanvas(TEX_SIZE, TEX_SIZE)
      : Object.assign(document.createElement('canvas'), { width: TEX_SIZE, height: TEX_SIZE });

    textureRef.current = tex;
    const tctx = tex.getContext('2d', { alpha: true });
    if (!tctx) return;

    function resize() {
      const r = container.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));

      // DPR=1 para rendimiento (clave)
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    // Campo súper barato (ondas grandes)
    function waveField(xx: number, yy: number) {
      const a = Math.sin(xx * 1.0);
      const b = Math.sin(yy * 0.92);
      const c = Math.sin((xx + yy) * 0.62);
      return (0.58 * a + 0.42 * b + 0.26 * c) / 1.26; // ~[-1..1]
    }

    function edgePoint(
      edge: number,
      x: number,
      y: number,
      step: number,
      v0: number,
      v1: number,
      v2: number,
      v3: number,
      thr: number
    ): [number, number] {
      const x1 = x + step, y1 = y + step;
      const interp = (a: number, b: number) => {
        const t = (thr - a) / (b - a || 1e-6);
        return clamp(t, 0, 1);
      };
      switch (edge) {
        case 0: { const t = interp(v0, v1); return [lerp(x, x1, t), y]; }
        case 1: { const t = interp(v1, v2); return [x1, lerp(y, y1, t)]; }
        case 2: { const t = interp(v3, v2); return [lerp(x, x1, t), y1]; }
        case 3: { const t = interp(v0, v3); return [x, lerp(y, y1, t)]; }
        default: return [x, y];
      }
    }

    function buildTexture() {
      tctx.clearRect(0, 0, TEX_SIZE, TEX_SIZE);

      const step = GRID_STEP;
      const cols = Math.ceil(TEX_SIZE / step);
      const rows = Math.ceil(TEX_SIZE / step);
      const field = new Float32Array((cols + 1) * (rows + 1));

      // construir campo 1 vez
      let k = 0;
      for (let j = 0; j <= rows; j++) {
        const yy = (j * step) * WAVE_SCALE;
        for (let i = 0; i <= cols; i++) {
          const xx = (i * step) * WAVE_SCALE;
          field[k++] = waveField(xx, yy);
        }
      }

      // trazar contornos 1 vez
      tctx.save();
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
      tctx.shadowColor = 'rgba(168,85,247,0.12)';
      tctx.shadowBlur = 4;
      tctx.lineWidth = 1;

      const min = -0.78, max = 0.78;

      for (let c = 0; c < CONTOURS; c++) {
        const u = c / (CONTOURS - 1);
        const thr = lerp(min, max, u);

        // alterna ligeramente para dar riqueza visual sin costo extra
        tctx.strokeStyle = (c % 2 === 0) ? PURPLE_A : PURPLE_B;

        tctx.beginPath();
        for (let j = 0; j < rows; j++) {
          const y = j * step;
          const row0 = j * (cols + 1);
          const row1 = (j + 1) * (cols + 1);
          for (let i = 0; i < cols; i++) {
            const x = i * step;
            const v0 = field[row0 + i];
            const v1 = field[row0 + i + 1];
            const v2 = field[row1 + i + 1];
            const v3 = field[row1 + i];

            let idx = 0;
            if (v0 > thr) idx |= 1;
            if (v1 > thr) idx |= 2;
            if (v2 > thr) idx |= 4;
            if (v3 > thr) idx |= 8;

            const segs = cases[idx];
            if (!segs.length) continue;

            for (const [eA, eB] of segs) {
              const a = edgePoint(eA, x, y, step, v0, v1, v2, v3, thr);
              const b = edgePoint(eB, x, y, step, v0, v1, v2, v3, thr);
              tctx.moveTo(a[0], a[1]);
              tctx.lineTo(b[0], b[1]);
            }
          }
        }
        tctx.stroke();
      }

      tctx.restore();
    }

    function draw(ts: number) {
      // fondo negro
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050007';
      ctx.fillRect(0, 0, w, h);

      // glow sutil (barato)
      const g = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, Math.max(w, h) * 0.9);
      g.addColorStop(0, 'rgba(168,85,247,0.12)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // "mover" la textura (solo drawImage) — súper ligero
      const t = ts / 1000;
      const ox = ((t * DRIFT_X) % TEX_SIZE + TEX_SIZE) % TEX_SIZE;
      const oy = ((t * DRIFT_Y) % TEX_SIZE + TEX_SIZE) % TEX_SIZE;

      // tile 2x2 para cubrir
      if (textureRef.current) {
        for (let yy = -oy; yy < h; yy += TEX_SIZE) {
          for (let xx = -ox; xx < w; xx += TEX_SIZE) {
            ctx.drawImage(textureRef.current as CanvasImageSource, xx, yy);
          }
        }
      }
    }

    function loop(ts: number) {
      if (!runningRef.current) return;
      if (ts - lastRef.current > frameInterval) {
        lastRef.current = ts;
        draw(ts);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    // Pausar cuando no está visible (optimiza mucho)
    const io = new IntersectionObserver((entries) => {
      const visible = entries.some(e => e.isIntersecting);
      if (prefersReduced) return;
      runningRef.current = visible && !document.hidden;
      if (runningRef.current && !rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      } else if (!runningRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    }, { threshold: 0.01 });

    resize();
    buildTexture();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    io.observe(container);

    const handleVisibilityChange = () => {
      if (prefersReduced) return;
      runningRef.current = !document.hidden;
      if (runningRef.current && !rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      } else if (!runningRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Si reduce motion, pinta estático
    if (prefersReduced) {
      draw(0);
    } else {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      runningRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ willChange: 'auto' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'auto' }}
      />
    </div>
  );
}

// Memoizar para evitar re-renders innecesarios
export default memo(TopographyCanvas);
