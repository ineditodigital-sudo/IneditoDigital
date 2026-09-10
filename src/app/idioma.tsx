import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/*
 * El idioma del sitio.
 *
 * La traducción no se hace tocando quinientas llamadas a contenido(). Cada una
 * de esas llamadas ya lleva su texto en español como respaldo, así que la lista
 * de respaldos ES la lista de lo que hay que traducir: el lector resuelve el
 * valor como siempre y, si el idioma es inglés, lo busca en el diccionario.
 *
 * Eso tiene dos consecuencias buenas. Una frase sin traducir se queda en
 * español en vez de romperse o salir en blanco. Y cuando el cliente escriba un
 * campo en inglés desde el panel, ese campo gana sobre el diccionario sin que
 * haya que tocar código.
 *
 * El diccionario NO viene en el paquete principal. Son cientos de miles de
 * caracteres —el sitio entero, dos veces— y el 95% de las visitas son en
 * español: cargarlo siempre sería hacerle pagar a todo Aguascalientes el peso
 * de una versión que no va a leer. Se descarga solo cuando hace falta, antes
 * del primer pintado si la visita ya venía en inglés.
 *
 * El idioma vive también en una variable de módulo porque contenido() se llama
 * dentro del render y no es un hook. El proveedor la mantiene al día y vuelve a
 * montar el árbol al cambiar: cambiar de idioma es raro —una vez por visita— y
 * remontar garantiza que no quede media página en el idioma anterior.
 */

export type Idioma = 'es' | 'en';

const LLAVE = 'inedito_idioma';

let idiomaActual: Idioma = 'es';

/** El diccionario ya descargado. Vacío mientras la visita siga en español. */
let DICC: Record<string, string> = {};
let cargando: Promise<void> | null = null;

/** Lo consulta el lector del CMS, que no puede usar hooks. */
export function idiomaVigente(): Idioma {
  return idiomaActual;
}

/*
 * Sin elección previa, español. A propósito, y aunque el navegador venga en
 * inglés: Googlebot se presenta con navigator.language = "en-US", así que
 * respetar el idioma del navegador significaría servirle a Google la versión
 * inglesa de un sitio que se posiciona en español para Aguascalientes. El
 * interruptor está a la vista en el encabezado; eso basta.
 */
export function idiomaGuardado(): Idioma {
  try {
    const v = localStorage.getItem(LLAVE);
    if (v === 'en' || v === 'es') return v;
  } catch {
    /* Modo privado o almacenamiento bloqueado: se queda en español. */
  }
  return 'es';
}

/**
 * Descarga el diccionario. Se puede llamar de más: la segunda vez devuelve la
 * misma promesa y no vuelve a pedir nada.
 */
export function cargarDiccionario(): Promise<void> {
  if (cargando) return cargando;
  cargando = Promise.all([
    import('./diccionario'),
    import('./diccionario.catalogo'),
  ])
    .then(([base, catalogo]) => {
      /* El catálogo va después: si una frase estuviera en los dos, manda la
         del catálogo, que es la que describe el servicio. */
      DICC = { ...base.DICCIONARIO, ...catalogo.CATALOGO };
    })
    .catch(() => {
      /* Si el trozo no baja —red caída a media sesión— el sitio se queda en
         español y sigue funcionando. Peor sería quedarse en blanco. */
      DICC = {};
    });
  return cargando;
}

/**
 * Traduce un texto en español al idioma vigente.
 * Si no está en el diccionario devuelve el original: una frase sin traducir se
 * lee en español, que es mucho mejor que un hueco o una clave cruda.
 */
export function tr(es: string): string {
  if (idiomaActual === 'es' || !es) return es;
  return DICC[es] ?? es;
}

type Ctx = { idioma: Idioma; cambiar: (i: Idioma) => void; alternar: () => void };
const Contexto = createContext<Ctx>({ idioma: 'es', cambiar: () => {}, alternar: () => {} });

export const useIdioma = () => useContext(Contexto);

export function ProveedorIdioma({ children }: { children: React.ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(() => {
    const i = idiomaGuardado();
    idiomaActual = i;     // antes del primer render, para que el lector ya lo sepa
    return i;
  });

  useEffect(() => {
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es-MX';
  }, [idioma]);

  const cambiar = useCallback((i: Idioma) => {
    const seguir = () => {
      idiomaActual = i;
      try { localStorage.setItem(LLAVE, i); } catch { /* sin almacenamiento, dura la sesión */ }
      /* Arriba de un golpe. Al remontar, el layout hace su scroll suave al inicio;
         si no estuviéramos ya arriba, cambiar de idioma a media página se vería
         como un viaje largo hacia el encabezado. */
      try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch { /* da igual */ }
      setIdioma(i);
    };
    /* Primero el diccionario, luego el cambio: si se cambiara antes, la página
       se remontaría con el mapa vacío y saldría en español un instante. */
    if (i === 'en') cargarDiccionario().then(seguir);
    else seguir();
  }, []);

  const alternar = useCallback(() => cambiar(idiomaActual === 'es' ? 'en' : 'es'), [cambiar]);

  return (
    <Contexto.Provider value={{ idioma, cambiar, alternar }}>
      {/* La llave remonta el árbol al cambiar de idioma. Es una acción de una
          vez por visita, y remontar evita que quede media página en el idioma
          anterior porque un componente no volvió a renderizar. */}
      <div key={idioma} className="contents">
        {children}
      </div>
    </Contexto.Provider>
  );
}
