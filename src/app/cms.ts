/**
 * ============================================================
 * LECTOR DE CONTENIDO EDITABLE
 * ============================================================
 *
 * El contenido que el cliente edita en el panel llega al navegador por
 * localStorage (lo inyecta render.php) y se lee desde aquí.
 *
 * La regla de oro: SIEMPRE hay respaldo. Cada llamada lleva el texto que
 * hoy tiene el sitio, así que si el campo está vacío, si falla la base de
 * datos o si el cliente borra algo por error, la página se sigue viendo
 * igual que ahora. Es imposible dejarla en blanco desde el panel.
 *
 * Uso:
 *   const t = contenido('home', 'portada');
 *   <h1>{t('titulo_1', 'MARKETING DIGITAL +')}</h1>
 *   {t.visible('visible') && <section>…</section>}
 */

type CamposSeccion = Record<string, string>;
type Pagina = Record<string, CamposSeccion>;

let cache: Record<string, Pagina> | null = null;

function leerTodo(): Record<string, Pagina> {
  if (cache) return cache;
  try {
    const crudo = localStorage.getItem('inedito_paginas');
    const parsed = crudo ? JSON.parse(crudo) : {};
    cache = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    cache = {};
  }
  return cache!;
}

/** Se llama cuando el panel publica cambios, para no exigir recarga dura. */
export function refrescarContenido() {
  cache = null;
  cachePaginas = null;
  cacheMiembros = null;
}

export interface LectorSeccion {
  /** Texto del campo, o el respaldo si está vacío. */
  (campo: string, respaldo: string): string;
  /** ¿La sección está marcada como visible? Por defecto sí. */
  visible: (campo?: string) => boolean;
}

export function contenido(pagina: string, seccion: string): LectorSeccion {
  const campos: CamposSeccion = leerTodo()?.[pagina]?.[seccion] ?? {};

  const lector = ((campo: string, respaldo: string): string => {
    const v = campos[campo];
    if (typeof v !== 'string') return respaldo;
    const limpio = v.trim();
    return limpio === '' ? respaldo : limpio;
  }) as LectorSeccion;

  lector.visible = (campo = 'visible') => {
    const v = campos[campo];
    // Si nunca se tocó el interruptor, la sección se muestra.
    if (typeof v !== 'string' || v === '') return true;
    return v !== '0';
  };

  return lector;
}

/* ------------------------------------------------------------------ */
/* Páginas creadas desde el panel (bloques)                            */
/* ------------------------------------------------------------------ */

export interface Bloque {
  tipo: string;
  visible?: string;
  datos: Record<string, string>;
}

export interface PaginaBloques {
  nombre: string;
  ruta: string;
  bloques: Bloque[];
  seoTitle?: string;
  seoDesc?: string;
}

let cachePaginas: Record<string, PaginaBloques> | null = null;

function leerPaginasBloques(): Record<string, PaginaBloques> {
  if (cachePaginas) return cachePaginas;
  try {
    const crudo = localStorage.getItem('inedito_paginas_nuevas');
    const parsed = crudo ? JSON.parse(crudo) : {};
    cachePaginas = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    cachePaginas = {};
  }
  return cachePaginas!;
}

/** Devuelve la página creada con ese slug, o null si no existe. */
export function paginaDeBloques(slug: string): PaginaBloques | null {
  if (!slug) return null;
  const p = leerPaginasBloques()[slug];
  if (!p || !Array.isArray(p.bloques)) return null;
  return p;
}

/** Las páginas que el cliente marcó para que salgan en el menú. */
export function paginasDelMenu(): { nombre: string; ruta: string }[] {
  const todas = leerPaginasBloques();
  return Object.values(todas)
    .filter((p) => (p as PaginaBloques & { enMenu?: boolean }).enMenu)
    .map((p) => ({ nombre: p.nombre, ruta: p.ruta }));
}

/* ------------------------------------------------------------------ */
/* Páginas de contacto del equipo                                      */
/* ------------------------------------------------------------------ */

export interface Miembro {
  slug: string;
  nombre: string;
  ruta: string;
  datos: Record<string, string>;
}

let cacheMiembros: Record<string, Miembro> | null = null;

function leerMiembros(): Record<string, Miembro> {
  if (cacheMiembros) return cacheMiembros;
  try {
    const crudo = localStorage.getItem('inedito_miembros');
    const parsed = crudo ? JSON.parse(crudo) : {};
    cacheMiembros = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    cacheMiembros = {};
  }
  return cacheMiembros!;
}

/** La página de contacto de ese integrante, o null si esa dirección no es de nadie. */
export function miembro(slug: string): Miembro | null {
  if (!slug) return null;
  const m = leerMiembros()[slug];
  if (!m || typeof m.datos !== 'object' || m.datos === null) return null;
  return m;
}

/** ¿Esta dirección pertenece a un integrante del equipo? */
export function esMiembro(slug: string): boolean {
  return miembro(slug) !== null;
}

/* ------------------------------------------------------------------ */
/* Colores de marca                                                    */
/* ------------------------------------------------------------------ */

const COLORES_BASE = { principal: '#7700CE', claro: '#9933FF', brillo: '#CC66FF' };

/**
 * Aplica los colores que el cliente eligió en el panel.
 *
 * Se escriben como variables CSS sobre :root, así que cambian en todo el
 * sitio sin tocar una sola clase. Si un color no es un código válido, se
 * ignora y queda el de la marca: no hay forma de dejar el sitio ilegible.
 */
export function aplicarColoresDeMarca() {
  const c = contenido('marca', 'colores');
  const raiz = document.documentElement;

  const valido = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

  const principal = c('principal', COLORES_BASE.principal);
  const claro = c('claro', COLORES_BASE.claro);
  const brillo = c('brillo', COLORES_BASE.brillo);

  if (valido(principal)) {
    raiz.style.setProperty('--color-purple', principal);
    raiz.style.setProperty('--primary', principal);
  }
  if (valido(claro)) {
    raiz.style.setProperty('--color-purple-light', claro);
    raiz.style.setProperty('--accent', claro);
  }
  if (valido(brillo)) raiz.style.setProperty('--color-purple-lightest', brillo);
}

/** Menús y textos del encabezado y el pie, con sus respaldos. */
export const marca = {
  menu: () => contenido('marca', 'menu'),
  menuIA: () => contenido('marca', 'menu_ia'),
  pie: () => contenido('marca', 'pie'),
  redes: () => contenido('marca', 'redes'),
  logo: () => contenido('marca', 'logo'),
};
