import { useEffect, useRef } from 'react';

/*
 * La esfera de red del hero: la pieza abstracta e interactiva de la portada.
 *
 * Es 3D de verdad —una esfera de nodos con proyección de perspectiva y
 * conexiones entre vecinos— dibujada en canvas 2D a mano. Se decidió así y no
 * con three.js a propósito: la librería costaría ~150 KB en la página más
 * crítica del sitio y esto pesa unos pocos KB dentro del bundle que ya existe.
 *
 * Interacción: gira sola; arrastrar (o mover el dedo) la gira con inercia;
 * tocar o hacer clic dispara pulsos que viajan por las conexiones. Con
 * prefers-reduced-motion se dibuja un solo cuadro y se queda quieta.
 *
 * Rendimiento: el bucle solo corre cuando la esfera está en pantalla y la
 * pestaña visible; el primer cuadro se dibuja síncrono al montar para que
 * nunca haya un hueco negro (ni en lectores que no corren animaciones).
 */

const N = 130;               // nodos
const VECINOS = 3;           // conexiones por nodo
const MORADO_OSCURO = [119, 0, 206] as const;
const MORADO_CLARO = [204, 102, 255] as const;

type Punto = { x: number; y: number; z: number };
type Pulso = { a: number; b: number; t: number };

function esferaFibonacci(n: number): Punto[] {
  const puntos: Punto[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    puntos.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return puntos;
}

/** Los pares de vecinos se calculan una vez: la malla no cambia, solo gira. */
function vecinosDe(puntos: Punto[]): [number, number][] {
  const pares = new Set<string>();
  puntos.forEach((p, i) => {
    const dist = puntos
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, VECINOS);
    dist.forEach((x) => pares.add(i < x.j ? `${i}-${x.j}` : `${x.j}-${i}`));
  });
  return [...pares].map((s) => s.split('-').map(Number) as [number, number]);
}

const mezcla = (t: number) =>
  `rgba(${Math.round(MORADO_OSCURO[0] + (MORADO_CLARO[0] - MORADO_OSCURO[0]) * t)},${Math.round(
    MORADO_OSCURO[1] + (MORADO_CLARO[1] - MORADO_OSCURO[1]) * t
  )},${Math.round(MORADO_OSCURO[2] + (MORADO_CLARO[2] - MORADO_OSCURO[2]) * t)}`;

export default function EsferaIA({ className = '' }: { className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const puntos = esferaFibonacci(N);
    const aristas = vecinosDe(puntos);
    const pulsos: Pulso[] = [];

    let ancho = 0;
    let alto = 0;
    let dpr = 1;
    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = canvas.clientWidth;
      alto = canvas.clientHeight;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();

    /* rotación: gira sola y el arrastre le suma velocidad con inercia */
    let rotY = 0.6;
    let rotX = -0.35;
    let velY = 0.0028;
    let velX = 0;
    let arrastrando = false;
    let ultX = 0;
    let ultY = 0;

    const proyectados: { x: number; y: number; z: number }[] = puntos.map(() => ({ x: 0, y: 0, z: 0 }));

    const dibujar = () => {
      ctx.clearRect(0, 0, ancho, alto);
      const cx = ancho / 2;
      const cy = alto / 2;
      const R = Math.min(ancho, alto) * 0.36;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      for (let i = 0; i < N; i++) {
        const p = puntos[i];
        // rotar en Y y luego en X
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        // perspectiva
        const persp = 2.2 / (2.2 + z2);
        proyectados[i].x = cx + x1 * R * persp;
        proyectados[i].y = cy + y2 * R * persp;
        proyectados[i].z = z2; // -1 (frente) … 1 (fondo)
      }

      // aristas, de atrás hacia adelante para que el frente pinte encima
      ctx.lineWidth = 1;
      for (const [a, b] of aristas) {
        const pa = proyectados[a];
        const pb = proyectados[b];
        const prof = (2 - (pa.z + pb.z)) / 4;        // 0 fondo … 1 frente
        ctx.strokeStyle = `${mezcla(prof)},${(0.06 + prof * 0.2).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // nodos
      for (let i = 0; i < N; i++) {
        const p = proyectados[i];
        const prof = (1 - p.z) / 2;
        ctx.fillStyle = `${mezcla(prof)},${(0.25 + prof * 0.75).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1 + prof * 2.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulsos viajando por las aristas
      for (let i = pulsos.length - 1; i >= 0; i--) {
        const pl = pulsos[i];
        pl.t += 0.03;
        if (pl.t >= 1) { pulsos.splice(i, 1); continue; }
        const pa = proyectados[pl.a];
        const pb = proyectados[pl.b];
        const x = pa.x + (pb.x - pa.x) * pl.t;
        const y = pa.y + (pb.y - pa.y) * pl.t;
        const brillo = Math.sin(pl.t * Math.PI);
        ctx.fillStyle = `rgba(240,225,255,${(0.85 * brillo).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.6 + brillo * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* primer cuadro síncrono: sin hueco negro aunque nada más corra */
    dibujar();

    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let corriendo = false;
    let cuadro = 0;
    const paso = () => {
      rotY += velY;
      rotX += velX;
      // la inercia del arrastre decae hacia el giro propio
      velY += (0.0028 - velY) * 0.02;
      velX += (0 - velX) * 0.04;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      // un pulso nuevo de vez en cuando, para que siempre viva algo
      if (Math.random() < 0.02 && pulsos.length < 6) {
        const [a, b] = aristas[(Math.random() * aristas.length) | 0];
        pulsos.push({ a, b, t: 0 });
      }
      dibujar();
      cuadro = requestAnimationFrame(paso);
    };
    const arrancar = () => {
      if (!corriendo && !quieto) {
        corriendo = true;
        cuadro = requestAnimationFrame(paso);
      }
    };
    const frenar = () => {
      corriendo = false;
      cancelAnimationFrame(cuadro);
    };

    /* solo corre a la vista y con la pestaña activa */
    const ojo = new IntersectionObserver(
      (es) => (es.some((e) => e.isIntersecting) ? arrancar() : frenar()),
      { threshold: 0.1 }
    );
    ojo.observe(canvas);
    const alCambiarVisibilidad = () => (document.hidden ? frenar() : arrancar());
    document.addEventListener('visibilitychange', alCambiarVisibilidad);

    /* interacción: arrastrar gira, tocar dispara pulsos */
    const desde = (e: PointerEvent) => {
      arrastrando = true;
      ultX = e.clientX;
      ultY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      // ráfaga desde el nodo más cercano al toque
      const caja = canvas.getBoundingClientRect();
      const mx = e.clientX - caja.left;
      const my = e.clientY - caja.top;
      let cercano = 0;
      let mejor = Infinity;
      proyectados.forEach((p, i) => {
        const d = (p.x - mx) ** 2 + (p.y - my) ** 2;
        if (d < mejor) { mejor = d; cercano = i; }
      });
      aristas
        .filter(([a, b]) => a === cercano || b === cercano)
        .slice(0, 3)
        .forEach(([a, b]) => pulsos.push({ a: a === cercano ? a : b, b: a === cercano ? b : a, t: 0 }));
      if (quieto) dibujar();
    };
    const mover = (e: PointerEvent) => {
      if (!arrastrando) return;
      velY = (e.clientX - ultX) * 0.0016;
      velX = (e.clientY - ultY) * 0.0012;
      ultX = e.clientX;
      ultY = e.clientY;
      if (quieto) { rotY += velY * 8; rotX += velX * 8; dibujar(); }
    };
    const soltar = () => { arrastrando = false; };
    canvas.addEventListener('pointerdown', desde);
    canvas.addEventListener('pointermove', mover);
    canvas.addEventListener('pointerup', soltar);
    canvas.addEventListener('pointercancel', soltar);

    const alMedir = () => { medir(); dibujar(); };
    window.addEventListener('resize', alMedir);

    return () => {
      frenar();
      ojo.disconnect();
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      window.removeEventListener('resize', alMedir);
      canvas.removeEventListener('pointerdown', desde);
      canvas.removeEventListener('pointermove', mover);
      canvas.removeEventListener('pointerup', soltar);
      canvas.removeEventListener('pointercancel', soltar);
    };
  }, []);

  return (
    <div className={`relative ${className}`} role="img" aria-label="Red de inteligencia artificial de Inédito Digital">
      {/* el resplandor de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[6%] rounded-full opacity-80 blur-3xl"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(119,0,206,.42), rgba(119,0,206,.10) 60%, transparent 75%)' }}
      />
      <canvas ref={lienzo} className="relative h-full w-full cursor-grab touch-none active:cursor-grabbing" />
      {/* el isotipo, en el corazón de la red */}
      <img
        src="/favicon-192.png"
        alt=""
        aria-hidden
        width={56}
        height={56}
        className="animate-flotar pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_24px_rgba(153,51,255,.8)] md:h-14 md:w-14"
      />
    </div>
  );
}
