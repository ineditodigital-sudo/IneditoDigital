import { useEffect, useState } from 'react';
import {
  BASE,
  type Botones,
  type Contacto,
  type DatosPresentacion,
  type Enlace,
  type Idioma,
  type Lamina,
  type Tarjeta,
  type TipoLamina,
} from './contenido';

/*
 * De dónde sale lo que dice la presentación.
 *
 * Lo publicado desde el panel (api/presentacion.php) manda. Si nadie ha
 * publicado todavía, o la base no contesta en tres segundos y medio, se usa
 * el respaldo que trae el código (BASE, en contenido.ts). Nunca se queda en
 * blanco y nunca espera más que eso.
 *
 * Todo lo que llega de fuera pasa por normalizar(): lo que venga raro se
 * descarta en vez de romper el deck delante de un cliente. Y los enlaces solo
 * pueden ser web, correo, teléfono, una ruta del sitio o un ancla: un
 * «javascript:» escrito en el panel no llega nunca a un href.
 *
 * Dentro del editor del panel el deck corre en un iframe, y ahí además
 * obedece al borrador que el panel le manda por postMessage, solo si viene
 * del propio dominio y de la ventana que lo contiene.
 */

const IDIOMAS: Idioma[] = ['es', 'en'];
const TIPOS: TipoLamina[] = ['portada', 'servicio', 'cierre'];

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const txt = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function dos(v: unknown, max: number, respaldo?: Record<Idioma, string>): Record<Idioma, string> {
  const o = obj(v);
  const r = {} as Record<Idioma, string>;
  for (const i of IDIOMAS) r[i] = txt(o[i], max) || respaldo?.[i] || '';
  return r;
}

/** Solo lo que puede ir en un href sin sorpresas. */
export function urlSegura(v: unknown): string {
  const s = typeof v === 'string' ? v.trim() : '';
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(s) ? s.slice(0, 500) : '';
}

function tarjetas(v: unknown): Tarjeta[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, 3)
    .map((c) => ({ t: txt(obj(c).t, 160), d: txt(obj(c).d, 600) }))
    .filter((c) => c.t || c.d);
}

function enlace(v: unknown): Enlace | undefined {
  const o = obj(v);
  const url = urlSegura(o.url);
  const texto = dos(o.texto, 80);
  return url && (texto.es || texto.en) ? { url, texto } : undefined;
}

function lamina(v: unknown, n: number): Lamina | null {
  const o = obj(v);
  if (!Object.keys(o).length) return null;
  const tj = obj(o.tarjetas);
  const id =
    txt(o.id, 60)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') || `lamina-${n + 1}`;
  return {
    id,
    tipo: TIPOS.includes(o.tipo as TipoLamina) ? (o.tipo as TipoLamina) : 'servicio',
    visible: o.visible !== false && o.visible !== '0',
    escena: txt(o.escena, 40),
    kicker: dos(o.kicker, 120),
    nombre: dos(o.nombre, 160),
    descripcion: dos(o.descripcion, 900),
    tarjetas: { es: tarjetas(tj.es), en: tarjetas(tj.en) },
    enlace: enlace(o.enlace),
  };
}

function contacto(v: unknown): Contacto {
  const o = obj(v);
  return {
    whatsapp: txt(o.whatsapp, 20).replace(/\D/g, ''),
    mensaje: dos(o.mensaje, 300),
    telefono: txt(o.telefono, 40),
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt(o.correo, 120)) ? txt(o.correo, 120) : '',
    sitio: txt(o.sitio, 80),
  };
}

/* Un botón sin texto es un botón roto: si lo vacían, vuelve el de respaldo. */
function botones(v: unknown): Botones {
  const o = obj(v);
  return {
    empezar: dos(o.empezar, 60, BASE.botones.empezar),
    escribir: dos(o.escribir, 60, BASE.botones.escribir),
    correo: dos(o.correo, 60, BASE.botones.correo),
  };
}

export function normalizar(crudo: unknown): DatosPresentacion | null {
  const o = obj(crudo);
  if (!Array.isArray(o.laminas)) return null;
  const vistas = new Set<string>();
  const laminas: Lamina[] = [];
  o.laminas.slice(0, 60).forEach((v, n) => {
    const l = lamina(v, n);
    if (!l) return;
    let id = l.id;
    for (let k = 2; vistas.has(id); k++) id = `${l.id}-${k}`;
    vistas.add(id);
    laminas.push({ ...l, id });
  });
  if (!laminas.length) return null;
  return { contacto: contacto(o.contacto), botones: botones(o.botones), laminas };
}

let enCurso: Promise<DatosPresentacion> | null = null;

export function cargarPresentacion(): Promise<DatosPresentacion> {
  if (enCurso) return enCurso;
  const control = new AbortController();
  const plazo = window.setTimeout(() => control.abort(), 3500);
  enCurso = fetch('/api/presentacion.php', {
    cache: 'no-store',
    signal: control.signal,
    headers: { Accept: 'application/json' },
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => normalizar(obj(j).datos) ?? BASE)
    .catch(() => BASE)
    .finally(() => window.clearTimeout(plazo));
  return enCurso;
}

/* En cuanto baja este archivo empieza la petición: corre en paralelo con el
   montaje de React y no después. */
if (typeof window !== 'undefined') void cargarPresentacion();

/** ¿Estamos dentro del editor del panel? */
export const enEditor =
  typeof window !== 'undefined' &&
  (window.self !== window.top || window.location.search.includes('editorVivo'));

/** Un mensaje del editor del panel, y solo del editor del panel. */
export function esDelEditor(ev: MessageEvent): boolean {
  return ev.origin === window.location.origin && ev.source === window.parent && !!ev.data;
}

export function useDatosPresentacion(): DatosPresentacion | null {
  const [datos, setDatos] = useState<DatosPresentacion | null>(null);

  useEffect(() => {
    let vivo = true;
    /* Si el borrador del editor llegó antes que lo publicado, se queda él. */
    void cargarPresentacion().then((d) => vivo && setDatos((prev) => prev ?? d));
    if (!enEditor) return () => void (vivo = false);

    const alMensaje = (ev: MessageEvent) => {
      if (!esDelEditor(ev) || ev.data.tipo !== 'presentacion') return;
      const d = normalizar(ev.data.datos);
      if (d) setDatos(d);
    };
    window.addEventListener('message', alMensaje);
    window.parent?.postMessage({ tipo: 'presentacion-lista' }, window.location.origin);
    return () => {
      vivo = false;
      window.removeEventListener('message', alMensaje);
    };
  }, []);

  return datos;
}
