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

type Bloque = Record<string, string>;
type Pagina = Record<string, Bloque>;

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
}

export interface LectorSeccion {
  /** Texto del campo, o el respaldo si está vacío. */
  (campo: string, respaldo: string): string;
  /** ¿La sección está marcada como visible? Por defecto sí. */
  visible: (campo?: string) => boolean;
}

export function contenido(pagina: string, seccion: string): LectorSeccion {
  const bloque = leerTodo()?.[pagina]?.[seccion] ?? {};

  const lector = ((campo: string, respaldo: string): string => {
    const v = bloque[campo];
    if (typeof v !== 'string') return respaldo;
    const limpio = v.trim();
    return limpio === '' ? respaldo : limpio;
  }) as LectorSeccion;

  lector.visible = (campo = 'visible') => {
    const v = bloque[campo];
    // Si nunca se tocó el interruptor, la sección se muestra.
    if (typeof v !== 'string' || v === '') return true;
    return v !== '0';
  };

  return lector;
}
