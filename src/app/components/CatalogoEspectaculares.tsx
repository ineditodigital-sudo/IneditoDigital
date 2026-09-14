import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Check, Search, Trash2, ChevronDown, ArrowLeft, Layers, ExternalLink, Lightbulb } from 'lucide-react';
import { tr } from '../idioma';
import { useApp } from '../context/AppContext';

/*
 * El catálogo de espacios publicitarios, con su mapa.
 *
 * Los datos salen de /api/espectaculares.php, que lee NUESTRA copia del
 * inventario de Vía Gráfica —refrescada por el cron— y no su API en vivo: la
 * página no puede quedarse en blanco porque un servidor ajeno tarde.
 *
 * El mismo catálogo va escrito en el HTML que sirve render.php, así que un
 * buscador lo lee sin ejecutar nada. Esto de aquí es la versión con la que se
 * trabaja: buscar, filtrar, ver dónde cae cada uno y pedir el que interesa.
 *
 * La forma es la que espera quien ya compró espectaculares: barra de búsqueda
 * y filtros rápidos arriba, lista de anuncios a un lado y mapa al lado. El mapa
 * va en color normal —no invertido— porque aquí se leen calles y colonias, y un
 * negativo azulado hace perder media hora a quien busca una avenida conocida.
 *
 * Leaflet se carga cuando el mapa entra en pantalla y no antes. Son 42 KB que
 * solo necesita esta página, y se usa OpenStreetMap en vez de Google Maps
 * porque no pide llave, no cobra por vista y no manda a cada visitante a un
 * tercero para ver una calle.
 */

type Espacio = {
  clave: string;
  titulo: string;
  tipo: string;
  colonia: string;
  calle: string;
  zona: string;
  libre: boolean;
  ref: string;
  medidas: string;
  extras?: string;
  altura: number | null;
  lat: number | null;
  lng: number | null;
};

const LEAFLET_JS = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js';
const LEAFLET_CSS = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';

/* Verde y morado sobre teselas claras. Los mismos de la marca subidos de
   contraste: el #00E585 de fondo oscuro desaparece encima de una calle. */
const LIBRE = '#00A860';
const OCUPADO = '#6B4E9B';

/** Título de caja: los datos vienen en mayúsculas de su sistema. */
const caja = (t: string) =>
  t
    .toLocaleLowerCase('es-MX')
    .replace(/(^|[\s.·/-])([a-záéíóúñ])/g, (_, a, b) => a + b.toLocaleUpperCase('es-MX'));

/** Texto ajeno dentro de HTML: el inventario lo escribe otra empresa. */
const esc = (t: string) =>
  String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Para buscar sin acentos ni mayúsculas: «josé maría» encuentra JOSE MARIA. */
const plano = (t: string) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-MX');

/* El nombre del formato tal como se enseña. Los cinco los escribe el sistema
   de Vía Gráfica en español; en inglés se traducen para que se entiendan, pero
   la clave —que es con la que se pide— no se toca. */
const formato = (t: string) => tr(caja(t));

/*
 * La ficha tecnica, desarmada.
 *
 * Su sistema la manda en un solo texto con cinco apartados seguidos:
 *   «PANELES. <x>, ILUMINACION <x>, TIMERS <x>, CIMENTACION <x>, REFLECTORES <x>»
 * Es lo mismo que imprimen ellos en el PDF por sitio. Aqui se parte para
 * poder ensenarlo como datos y no como un parrafo, y para poder callar los
 * apartados que dicen NINGUNO —que son ruido— sin callar la iluminacion, que
 * es justo al reves: que un espacio NO este iluminado es dato de compra.
 */
const APARTADOS = ['PANELES', 'ILUMINACION', 'TIMERS', 'CIMENTACION', 'REFLECTORES'] as const;

/* Su sistema escribe sin acentos. Poner el rotulo a mano en vez de sacarlo del
   dato evita un «Cimentacion» mocho en mitad de una ficha. */
const ETIQUETAS: Record<string, string> = {
  PANELES: 'Paneles',
  ILUMINACION: 'Iluminación',
  TIMERS: 'Temporizadores',
  CIMENTACION: 'Cimentación',
  REFLECTORES: 'Reflectores',
};

function fichaTecnica(extras?: string): { que: string; valor: string; vacio: boolean }[] {
  const t = (extras || '').trim();
  if (!t) return [];
  /* Un apartado empieza de verdad cuando su etiqueta va al principio del texto
     o detras de una coma. Sin esa condicion, un sitio cuya iluminacion es
     «REFLECTORES LED 200 WATTS» parte el valor en la palabra REFLECTORES y
     desordena la ficha entera. Y hay dos sitios con el bloque escrito dos
     veces, asi que cada etiqueta se toma solo la primera vez que aparece. */
  const cortes: { etiqueta: string; d: number }[] = [];
  for (const etiqueta of APARTADOS) {
    let d = t.indexOf(etiqueta);
    while (d >= 0) {
      const antes = t.slice(0, d).replace(/[\s.]+$/, '');
      if (antes === '' || antes.endsWith(',')) cortes.push({ etiqueta, d });
      d = t.indexOf(etiqueta, d + 1);
    }
  }
  cortes.sort((a, b) => a.d - b.d);
  const vistos = new Set<string>();
  const partes: { que: string; valor: string; vacio: boolean }[] = [];
  cortes.forEach((c, i) => {
    if (vistos.has(c.etiqueta)) return;
    vistos.add(c.etiqueta);
    const hasta = i + 1 < cortes.length ? cortes[i + 1].d : t.length;
    const valor = t
      .slice(c.d + c.etiqueta.length, hasta)
      .replace(/^[.\s,]+|[\s,]+$/g, '')
      .trim();
    if (!valor) return;
    partes.push({ que: c.etiqueta, valor, vacio: /^NINGUN[AO]?$/i.test(valor) });
  });
  /* Siempre en el mismo orden, aunque el texto venga desordenado. */
  return partes.sort(
    (a, b) => APARTADOS.indexOf(a.que as any) - APARTADOS.indexOf(b.que as any),
  );
}

/** «12.90 X 7.20 MTS.» son 92.9 m². Es la superficie que se renta. */
function areaDe(medidas: string): string {
  const m = medidas.match(/([\d.]+)\s*[xX]\s*([\d.]+)/);
  if (!m) return '';
  const a = parseFloat(m[1]), b = parseFloat(m[2]);
  if (!a || !b) return '';
  return `${(a * b).toLocaleString('es-MX', { maximumFractionDigits: 1 })} m²`;
}

/* Google Maps abierto en la vista de calle: se ve el anuncio y lo que tiene
   enfrente, que es lo que decide una compra de exterior. Si Google no tiene
   panoramica en ese punto cae solo en el mapa normal. */
const enStreetView = (lat: number, lng: number) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

/** La llave de una ubicación. Hay direcciones con varios anuncios encima. */
const puntoDe = (e: Espacio) => `${(e.lat as number).toFixed(5)}|${(e.lng as number).toFixed(5)}`;

/*
 * Uno de los dos desplegables de la barra.
 *
 * Va aqui fuera y no dentro del componente a proposito. Declarado adentro
 * seria un tipo de componente NUEVO en cada render, y React no lo reconoceria:
 * desmontaria el <select> y montaria otro cada vez que se escribe una letra en
 * el buscador. En la practica eso cierra el desplegable del sistema en plena
 * eleccion y tira el foco.
 */
function Selector({
  valor,
  alCambiar,
  opciones,
  etiqueta,
}: {
  valor: string;
  alCambiar: (v: string) => void;
  opciones: [string, string][];
  etiqueta: string;
}) {
  return (
    <label className="relative flex-shrink-0">
      <span className="sr-only">{etiqueta}</span>
      <select
        value={valor}
        onChange={(ev) => alCambiar(ev.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-xl border border-white/12 bg-white/[.04] py-0 pl-3.5 pr-9 text-[13px] text-white/85 outline-none transition-colors hover:border-white/25 focus:border-[#CC66FF]/60"
      >
        {opciones.map(([v, t]) => (
          <option key={v} value={v} className="bg-[#14141f] text-white">
            {t}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
      />
    </label>
  );
}

export function CatalogoEspectaculares() {
  const { settings, openAssistant } = useApp();

  const [espacios, setEspacios] = useState<Espacio[] | null>(null);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('TODOS');
  const [zona, setZona] = useState('TODAS');
  const [estatus, setEstatus] = useState<'TODOS' | 'LIBRE' | 'OCUPADO'>('TODOS');
  const [activo, setActivo] = useState<string | null>(null);
  const [abiertos, setAbiertos] = useState<string[]>([]);
  /* El mapa monta en asíncrono: sin esta bandera el efecto que decide qué
     marcadores se ven corre cuando todavía no hay capa y no vuelve a correr. */
  const [mapaListo, setMapaListo] = useState(false);

  const caja3d = useRef<HTMLDivElement>(null);
  const mapa = useRef<any>(null);
  const capa = useRef<any>(null);
  const marcas = useRef<Record<string, any>>({});   // por punto, no por clave
  const fichaRef = useRef<HTMLDivElement>(null);
  /* Que filtro estaba puesto la ultima vez que se reencuadro. Sin esto el mapa
     volveria a su encuadre cada vez que el componente se redibuja, y deshacer
     el zoom que acaba de hacer el visitante con la rueda es de lo peor que
     puede hacer un mapa. */
  const ultimoFiltro = useRef<string | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch('/api/espectaculares.php')
      .then((r) => r.json())
      .then((d) => vivo && setEspacios(Array.isArray(d.espacios) ? d.espacios : []))
      .catch(() => vivo && setEspacios([]));
    return () => {
      vivo = false;
    };
  }, []);

  const tipos = useMemo(() => {
    if (!espacios) return [];
    const c: Record<string, number> = {};
    espacios.forEach((e) => (c[e.tipo] = (c[e.tipo] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [espacios]);

  const zonas = useMemo(() => {
    if (!espacios) return [];
    const c: Record<string, number> = {};
    espacios.forEach((e) => (c[e.zona] = (c[e.zona] || 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [espacios]);

  const filtrados = useMemo(() => {
    if (!espacios) return [];
    const q = plano(busca.trim());
    return espacios.filter((e) => {
      if (tipo !== 'TODOS' && e.tipo !== tipo) return false;
      if (zona !== 'TODAS' && e.zona !== zona) return false;
      if (estatus === 'LIBRE' && !e.libre) return false;
      if (estatus === 'OCUPADO' && e.libre) return false;
      if (!q) return true;
      return plano(`${e.clave} ${e.calle} ${e.colonia} ${e.zona} ${e.tipo} ${e.ref}`).includes(q);
    });
  }, [espacios, busca, tipo, zona, estatus]);

  /* La lista de la izquierda va agrupada por formato, como la pide quien
     compra: primero decide si quiere cartelera o unipolar, después dónde. */
  const grupos = useMemo(() => {
    const g: Record<string, Espacio[]> = {};
    filtrados.forEach((e) => (g[e.tipo] = g[e.tipo] || []).push(e));
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length);
  }, [filtrados]);

  /* Con una búsqueda o un formato elegido, los grupos se abren solos: nadie
     escribe una calle para después tener que abrir cinco cajones. */
  const forzarAbierto = busca.trim() !== '' || tipo !== 'TODOS' || grupos.length === 1;

  const seleccionado = useMemo(
    () => (activo ? (espacios || []).find((e) => e.clave === activo) || null : null),
    [activo, espacios],
  );

  /* Los otros anuncios que comparten la misma estructura o esquina. */
  const vecinos = useMemo(() => {
    if (!seleccionado || seleccionado.lat === null) return [];
    const p = puntoDe(seleccionado);
    return (espacios || []).filter(
      (e) => e.lat !== null && e.clave !== seleccionado.clave && puntoDe(e) === p,
    );
  }, [seleccionado, espacios]);

  /* El formato con mas inventario arranca abierto. Cinco renglones cerrados y
     medio panel vacio se leen como un error de carga, no como un indice. */
  useEffect(() => {
    if (tipos.length && !abiertos.length) setAbiertos([tipos[0][0]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipos]);

  const limpio = busca === '' && tipo === 'TODOS' && zona === 'TODAS' && estatus === 'TODOS';

  /*
   * Un boton de formato tiene que entregar ese formato.
   *
   * El buscador y los filtros se combinan, que es lo normal y lo util: buscar
   * «siglo xxi» y despues pulsar Unipolar da los unipolares de esa avenida.
   * Pero cuando lo que hay escrito es UNA ubicacion —una clave, una direccion
   * exacta— la combinacion no deja nada, y entonces pulsar «Unipolar» daba
   * cero resultados con el mapa clavado en la manzana anterior: la pagina
   * parecia no hacer caso. En ese caso manda el boton y el buscador se vacia,
   * que ademas se ve: la caja se queda en blanco y se entiende por que.
   */
  const elegirFormato = (t: string) => {
    setTipo(t);
    if (!busca.trim() || !espacios) return;
    const quedaAlgo = filtrados.some((e) => t === 'TODOS' || e.tipo === t);
    if (!quedaAlgo) setBusca('');
  };

  const limpiar = () => {
    setBusca('');
    setTipo('TODOS');
    setZona('TODAS');
    setEstatus('TODOS');
    setActivo(null);
  };

  /* ── el mapa, solo cuando se ve ──────────────────────────────────────── */
  useEffect(() => {
    if (!espacios || !espacios.length || !caja3d.current || mapa.current) return;
    const nodo = caja3d.current;

    const montar = async () => {
      if (mapa.current) return;
      if (!document.querySelector('link[data-leaflet]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = LEAFLET_CSS;
        l.setAttribute('data-leaflet', '1');
        document.head.appendChild(l);
      }
      const L: any = await import(/* @vite-ignore */ LEAFLET_JS);
      if (mapa.current) return;

      /* El control de zoom se pone a mano para poder nombrarlo: el de Leaflet
         dice «Zoom in» en ingles pase lo que pase. Lo que se ve son los mismos
         mas y menos de siempre, con el tamano suficiente para que se lean como
         botones (el estilo va en .mapa-catalogo, en src/styles/index.css). */
      const m = L.map(nodo, {
        scrollWheelZoom: false,
        attributionControl: true,
        zoomControl: false,
      });
      L.control
        .zoom({ position: 'topleft', zoomInTitle: tr('Acercar'), zoomOutTitle: tr('Alejar') })
        .addTo(m);
      mapa.current = m;
      /* OpenStreetMap tal como viene: libre, sin llave y en su color. Antes iba
         invertido para que casara con el fondo oscuro del sitio y se perdían
         las referencias —el verde de un parque salía morado—. En una página
         donde el visitante busca «la avenida donde está mi taller», el mapa
         tiene que verse como el mapa que ya conoce. */
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(m);
      nodo.classList.add('mapa-catalogo');

      capa.current = L.layerGroup().addTo(m);

      /* Un marcador por UBICACIÓN, no por anuncio: hay puentes con seis caras
         en las mismas coordenadas y encimados no se puede dar clic en ninguno. */
      const puntos: Record<string, Espacio[]> = {};
      espacios
        .filter((e) => e.lat !== null && e.lng !== null)
        .forEach((e) => (puntos[puntoDe(e)] = puntos[puntoDe(e)] || []).push(e));

      Object.entries(puntos).forEach(([llave, lista]) => {
        const marca = L.circleMarker([lista[0].lat as number, lista[0].lng as number], {
          radius: 7,
          weight: 2,
          color: '#ffffff',
          fillOpacity: 0.95,
        });
        /* `todas` nunca cambia; `claves` es lo que queda tras el filtro. Si se
           guardara una sola lista, cada filtro recortaría la anterior y los
           puntos irían desapareciendo sin poder volver. */
        marca.options.todas = lista.map((e) => e.clave);
        marca.options.claves = marca.options.todas;
        marca.on('click', () => {
          const dentro = marca.options.claves as string[];
          setActivo(dentro[0] || lista[0].clave);
        });
        marcas.current[llave] = marca;
      });

      /* El encuadre no se hace aqui. Lo decide el filtro, y el arranque —sin
         filtros— es un filtro mas: los 317. Asi la regla es una sola y el
         zoom siempre quiere decir lo mismo, «esto es todo lo que pediste». */
      setMapaListo(true);
    };

    const io = new IntersectionObserver(
      (e) => {
        if (!e[0].isIntersecting) return;
        io.disconnect();
        montar();
      },
      { rootMargin: '300px' },
    );
    io.observe(nodo);

    /* Dos redes. Si ya se ve al cargar, no hay que esperar a que el navegador
       componga un cuadro. Y si el observador no llegara a disparar nunca, el
       scroll lo comprueba a mano: sin esto el hueco del mapa se queda vacío
       para siempre y sin decir por qué. */
    const cerca = () => {
      const r = nodo.getBoundingClientRect();
      return r.top < innerHeight + 300 && r.bottom > -300;
    };
    const alScroll = () => {
      if (!cerca()) return;
      removeEventListener('scroll', alScroll);
      io.disconnect();
      montar();
    };
    if (cerca()) {
      io.disconnect();
      montar();
    } else {
      addEventListener('scroll', alScroll, { passive: true });
    }

    return () => {
      io.disconnect();
      removeEventListener('scroll', alScroll);
    };
  }, [espacios]);

  /* Al filtrar, el mapa enseña solo lo que queda: los que no pasan el filtro
     se quitan de la capa en vez de atenuarse. Con 317 puntos, atenuar deja el
     mapa igual de lleno y el filtro no se siente. */
  useEffect(() => {
    if (!mapa.current || !capa.current) return;
    const vistos = new Map<string, Espacio>();
    filtrados.forEach((e) => vistos.set(e.clave, e));

    Object.entries(marcas.current).forEach(([llave, marca]) => {
      const claves = ((marca.options.todas as string[]) || []).filter((c) => vistos.has(c));
      marca.options.claves = claves;
      if (!claves.length) {
        capa.current.removeLayer(marca);
        return;
      }
      capa.current.addLayer(marca);
      const hayLibre = claves.some((c) => vistos.get(c)!.libre);
      const esteActivo = activo !== null && claves.includes(activo);
      marca.setStyle({
        color: esteActivo ? '#7700CE' : '#ffffff',
        weight: esteActivo ? 4 : 2,
        fillColor: hayLibre ? LIBRE : OCUPADO,
        fillOpacity: hayLibre ? 0.95 : 0.7,
      });
      marca.setRadius(esteActivo ? 11 : claves.length > 1 ? 9 : 7);
      marca.bindTooltip(
        claves.length > 1
          ? `${claves.length} ${esc(tr('anuncios en esta ubicación'))}`
          : `${esc(formato(vistos.get(claves[0])!.tipo))} · ${esc(vistos.get(claves[0])!.clave)}`,
        { direction: 'top', offset: [0, -6] },
      );
      if (esteActivo) marca.bringToFront();
    });

    /* Y el mapa se acomoda a lo que quedo. Da igual de donde venga el filtro
       —el buscador, los dos selectores o los botones de formato—: si el
       conjunto cambio, el encuadre cambia con el, de modo que lo que se ve
       sea todo lo filtrado y nada mas. Se reencuadra por el FILTRO, no por
       cada redibujado: elegir un anuncio no mueve el encuadre, lo lleva a su
       esquina, que es otra cosa. */
    const firma = JSON.stringify([busca.trim(), tipo, zona, estatus]);
    if (ultimoFiltro.current === firma) return;
    ultimoFiltro.current = firma;

    const puntos = filtrados
      .filter((e) => e.lat !== null && e.lng !== null)
      .map((e) => [e.lat as number, e.lng as number] as [number, number]);
    /* Sin resultados no se toca: dejar el mapa donde estaba dice «no hay nada
       por aqui» mucho mejor que saltar al oceano. */
    if (!puntos.length) return;
    /* SIN animacion, y no por gusto. Leaflet ignora en silencio un setView que
       llega mientras otra animacion de zoom sigue corriendo (_animatingZoom
       devuelve «ya esta» y no hace nada). Quien acaba de tocar un anuncio
       —que mueve el mapa— y enseguida cambia de formato caia justo en esa
       ventana: el filtro cambiaba y el mapa se quedaba clavado en la manzana
       donde estaba. Encuadrar de golpe ademas es lo correcto aqui: no es un
       desplazamiento, es cambiar de pregunta. */
    mapa.current.fitBounds(puntos, {
      padding: [30, 30],
      /* Un solo resultado no justifica la manzana entera. */
      maxZoom: 16,
      animate: false,
    });
  }, [filtrados, activo, mapaListo, busca, tipo, zona, estatus]);

  /* Si el anuncio abierto se sale del filtro, se cierra su ficha. Sin esto,
     cambiar de formato dejaba en pantalla la ficha de un anuncio que ya no
     esta en los resultados, y el panel parecia no haber hecho caso. */
  useEffect(() => {
    if (!activo) return;
    if (!filtrados.some((e) => e.clave === activo)) setActivo(null);
  }, [filtrados, activo]);

  /* Elegir un anuncio lleva el mapa a su esquina. En teléfono la ficha queda
     debajo del mapa, así que además se acerca a la vista. */
  useEffect(() => {
    if (!activo || !mapa.current) return;
    const e = (espacios || []).find((x) => x.clave === activo);
    if (!e || e.lat === null) return;
    mapa.current.setView([e.lat, e.lng as number], Math.max(mapa.current.getZoom(), 16), {
      animate: true,
    });
    if (matchMedia('(max-width: 1023px)').matches) {
      fichaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activo, espacios]);

  if (espacios === null) {
    return <p className="text-sm text-white/40">{tr('Cargando el catálogo de espacios…')}</p>;
  }
  if (!espacios.length) {
    return (
      <p className="text-sm text-white/50">
        {tr('El catálogo no está disponible en este momento. Escríbenos y te pasamos los espacios libres.')}
      </p>
    );
  }

  const libres = espacios.filter((e) => e.libre).length;

  const pedir = (e: Espacio) =>
    `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
      `Hola, me interesa el espacio ${e.clave} (${caja(e.tipo)} en ${caja(e.calle)}). ¿Sigue disponible?`,
    )}`;

  return (
    <div>
      {/* el conteo, que es el argumento de venta antes que el mapa */}
      <p className="mb-5 text-[15px] leading-relaxed text-white/60">
        <strong className="text-white">
          {espacios.length} {tr('espacios')}
        </strong>{' '}
        {tr('en Aguascalientes,')}{' '}
        <strong className="text-[#00E585]">
          {libres} {tr('disponibles')}
        </strong>{' '}
        {tr('hoy. Búscalo por calle o por clave, fíltralo por formato y zona, y pídelo por su clave.')}
      </p>

      {/* ── barra de búsqueda y filtros rápidos ─────────────────────────── */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/[.035] p-3 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[210px] flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={tr('Buscar por clave, calle o colonia…')}
              aria-label={tr('Buscar por clave, calle o colonia…')}
              className="h-10 w-full rounded-xl border border-white/12 bg-white/[.04] pl-10 pr-3 text-[13.5px] text-white placeholder:text-white/35 outline-none transition-colors hover:border-white/25 focus:border-[#CC66FF]/60"
            />
          </div>

          <Selector
            etiqueta={tr('Zona')}
            valor={zona}
            alCambiar={setZona}
            opciones={[
              ['TODAS', tr('Toda la ciudad')],
              ...zonas.map(([z, n]) => [z, `${caja(z)} (${n})`] as [string, string]),
            ]}
          />
          <Selector
            etiqueta={tr('Estatus')}
            valor={estatus}
            alCambiar={(v) => setEstatus(v as typeof estatus)}
            opciones={[
              ['TODOS', tr('Todo estatus')],
              ['LIBRE', tr('Disponible')],
              ['OCUPADO', tr('Ocupado')],
            ]}
          />

          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3.5 text-[12px] uppercase tracking-wider text-white/45">
              {tr('Resultados')}
              <strong className="font-mono text-[14px] tracking-normal text-white">
                {filtrados.length}
              </strong>
            </span>
            <button
              onClick={limpiar}
              disabled={limpio}
              title={tr('Limpiar filtros')}
              aria-label={tr('Limpiar filtros')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 text-white/50 transition-colors hover:border-[#CC66FF]/45 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/12 disabled:hover:text-white/50"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* filtros rápidos por formato */}
        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/8 pt-3">
          {(['TODOS', ...tipos.map((t) => t[0])] as string[]).map((t) => (
            <button
              key={t}
              onClick={() => elegirFormato(t)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] uppercase tracking-wide transition-colors duration-200 ${
                tipo === t
                  ? 'border-[#CC66FF]/50 bg-[#7700CE]/30 text-white'
                  : 'border-white/12 text-white/55 hover:border-white/25 hover:text-white/85'
              }`}
            >
              {t === 'TODOS' ? tr('Todos') : formato(t)}
              {t !== 'TODOS' && (
                <span className="ml-1.5 font-mono text-white/35">
                  {tipos.find((x) => x[0] === t)?.[1]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── lista al lado del mapa ──────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)]">
        {/* la lista de anuncios */}
        <div
          ref={fichaRef}
          className="order-2 flex h-[clamp(280px,68vh,440px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] lg:order-1 lg:h-[clamp(360px,78vh,560px)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {seleccionado ? (
              /* ── la ficha del anuncio elegido ───────────────────────── */
              <motion.div
                key="ficha"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="flex h-full flex-col"
              >
                <button
                  onClick={() => setActivo(null)}
                  className="flex flex-shrink-0 items-center gap-2 border-b border-white/10 px-4 py-3 text-left text-[12.5px] text-white/55 transition-colors hover:text-white"
                >
                  <ArrowLeft size={14} />
                  {tr('Volver a la lista')}
                </button>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-white/12 px-2 py-1 text-[10.5px] uppercase tracking-wider text-white/60">
                      {formato(seleccionado.tipo)}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-[10.5px] uppercase tracking-wider ${
                        seleccionado.libre
                          ? 'bg-[#00E585]/15 text-[#00E585]'
                          : 'bg-white/8 text-white/45'
                      }`}
                    >
                      {seleccionado.libre ? tr('Disponible') : tr('Ocupado')}
                    </span>
                    <span className="ml-auto font-mono text-[11.5px] tracking-wide text-white/40">
                      {seleccionado.clave}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-semibold leading-snug text-white">
                    {caja(seleccionado.calle) || caja(seleccionado.titulo)}
                  </h3>

                  <dl className="mt-4 space-y-2.5 text-[13px]">
                    {[
                      [tr('Colonia'), seleccionado.colonia && caja(seleccionado.colonia)],
                      [tr('Zona'), caja(seleccionado.zona)],
                      [
                        tr('Medidas'),
                        /* La superficie va junto a las medidas porque es lo que
                           se renta y lo que hay que cotizar con el impresor. */
                        [seleccionado.medidas, areaDe(seleccionado.medidas)]
                          .filter(Boolean)
                          .join(' · '),
                      ],
                      [
                        tr('Altura'),
                        seleccionado.altura ? `${seleccionado.altura} m` : '',
                      ],
                      [tr('Referencia'), seleccionado.ref && caja(seleccionado.ref)],
                      [
                        tr('Coordenadas'),
                        seleccionado.lat !== null
                          ? `${seleccionado.lat.toFixed(5)}, ${(seleccionado.lng as number).toFixed(5)}`
                          : '',
                      ],
                    ].map(([k, v]) =>
                      v ? (
                        <div key={k as string} className="flex gap-3">
                          <dt className="w-24 flex-shrink-0 text-white/40">{k}</dt>
                          <dd className="min-w-0 flex-1 text-white/80">{v}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>

                  {/* La liga a Google Maps es un renglon de su propia ficha
                      tecnica. Va en vista de calle: en exterior lo que decide
                      una compra es ver el anuncio y lo que tiene enfrente. */}
                  {seleccionado.lat !== null && (
                    <a
                      href={enStreetView(seleccionado.lat, seleccionado.lng as number)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-[12.5px] font-semibold text-white/85 transition-colors hover:border-[#CC66FF]/50 hover:bg-white/5"
                    >
                      <MapPin size={14} />
                      {tr('Ver en Maps')}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  )}

                  {/* La ficha tecnica del sitio. Lo que dicen NINGUNO se calla
                      —es ruido— salvo la iluminacion: que un espacio no este
                      iluminado no es un hueco, es un dato de compra. */}
                  {(() => {
                    const ficha = fichaTecnica(seleccionado.extras);
                    if (!ficha.length) return null;
                    const luz = ficha.find((f) => f.que === 'ILUMINACION');
                    const resto = ficha.filter((f) => f.que !== 'ILUMINACION' && !f.vacio);
                    return (
                      <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="mb-2.5 text-[11px] uppercase tracking-wider text-white/40">
                          {tr('Ficha técnica')}
                        </p>

                        {luz && (
                          <p
                            className={`mb-3 flex items-start gap-2 text-[12.5px] ${
                              luz.vacio ? 'text-white/45' : 'text-[#00E585]'
                            }`}
                          >
                            <Lightbulb
                              size={14}
                              className={`mt-0.5 flex-shrink-0 ${luz.vacio ? 'opacity-40' : ''}`}
                            />
                            <span>
                              {luz.vacio ? tr('Sin iluminación') : `${tr('Iluminado')} · ${luz.valor}`}
                            </span>
                          </p>
                        )}

                        {resto.map((f) => (
                          <div key={f.que} className="flex gap-3 py-1 text-[12.5px]">
                            <span className="w-24 flex-shrink-0 text-white/40">
                              {tr(ETIQUETAS[f.que] ?? caja(f.que))}
                            </span>
                            {/* Verbatim: son especificaciones. Ponerlas en caja
                                convierte «MOD. FTM 25/25TD» en «Mod. Ftm 25/25td»,
                                que ya no es ningun modelo. */}
                            <span className="min-w-0 flex-1 text-white/70">{f.valor}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {vecinos.length > 0 && (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40">
                        <Layers size={12} />
                        {tr('Otros anuncios en esta ubicación')}
                      </p>
                      {vecinos.map((v) => (
                        <button
                          key={v.clave}
                          onClick={() => setActivo(v.clave)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[.05]"
                        >
                          <span
                            className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                              v.libre ? 'bg-[#00E585]' : 'bg-white/25'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 flex-1 truncate text-[12.5px] text-white/70">
                            {formato(v.tipo)} · {v.medidas}
                          </span>
                          <span className="font-mono text-[10.5px] text-white/35">{v.clave}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-shrink-0 gap-2 border-t border-white/10 p-3">
                  <button
                    onClick={() =>
                      openAssistant(
                        'Anuncios Espectaculares',
                        `cotizar el espacio ${seleccionado.clave} en ${caja(seleccionado.calle)}`,
                      )
                    }
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-4 py-2.5 text-[12.5px] font-bold tracking-wide text-white transition-transform hover:scale-[1.02]"
                  >
                    {tr('COTIZAR ESTE ESPACIO')}
                  </button>
                  <a
                    href={pedir(seleccionado)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/15 px-4 py-2.5 text-[12.5px] font-bold tracking-wide text-white/85 transition-colors hover:border-[#CC66FF]/50 hover:bg-white/5"
                  >
                    WHATSAPP
                  </a>
                </div>
              </motion.div>
            ) : (
              /* ── la lista, agrupada por formato ─────────────────────── */
              <motion.div
                key="lista"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex h-full flex-col"
              >
                <p className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-wider text-white/45">
                  {tr('Lista de anuncios')}
                  <span className="font-mono text-[12px] tracking-normal text-white/70">
                    {filtrados.length}
                  </span>
                </p>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  {grupos.length === 0 && (
                    <p className="px-4 py-6 text-[13px] leading-relaxed text-white/45">
                      {tr('Ningún espacio con esos filtros. Prueba con otra zona, otro formato o limpia la búsqueda.')}
                    </p>
                  )}

                  {grupos.map(([t, lista]) => {
                    const abierto = forzarAbierto || abiertos.includes(t);
                    return (
                      <div key={t} className="border-b border-white/8 last:border-b-0">
                        <button
                          onClick={() =>
                            setAbiertos((a) =>
                              a.includes(t) ? a.filter((x) => x !== t) : [...a, t],
                            )
                          }
                          className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-white/[.04]"
                        >
                          <span className="flex-1 text-[12.5px] uppercase tracking-wide text-white/80">
                            {formato(t)}
                          </span>
                          <span className="rounded-md bg-white/8 px-1.5 py-0.5 font-mono text-[11px] text-white/55">
                            {lista.length}
                          </span>
                          <ChevronDown
                            size={15}
                            className={`text-white/35 transition-transform duration-200 ${
                              abierto ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {abierto &&
                          lista.map((e) => (
                            <button
                              key={e.clave}
                              onClick={() => setActivo(e.clave)}
                              className="flex w-full items-start gap-2.5 border-t border-white/[.06] px-4 py-2.5 text-left transition-colors hover:bg-white/[.05]"
                            >
                              <span
                                className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                                  e.libre ? 'bg-[#00E585]' : 'bg-white/20'
                                }`}
                                aria-hidden="true"
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block text-[13px] leading-snug text-white/85">
                                  {caja(e.calle) || caja(e.titulo)}
                                </span>
                                <span className="mt-0.5 block text-[11.5px] text-white/40">
                                  {e.colonia ? `Col. ${caja(e.colonia)}` : caja(e.zona)}
                                  {e.medidas && ` · ${e.medidas}`}
                                </span>
                              </span>
                              <span className="flex flex-shrink-0 items-center gap-1.5 pt-0.5">
                                <span className="font-mono text-[10.5px] text-white/30">
                                  {e.clave}
                                </span>
                                {e.lat !== null && <MapPin size={12} className="text-white/25" />}
                              </span>
                            </button>
                          ))}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* el mapa */}
        {/* En telefono el mapa va arriba: es lo que hace entender de que va
            esto. En escritorio vuelve a su sitio, a la derecha de la lista.
            La altura cede con la ventana —en un telefono acostado 440 px
            fijos se comen la pantalla entera y el visitante no ve que hay
            algo mas abajo— pero con un piso: es un clamp y no un min porque
            un vh que reporte cero deja la caja sin altura y Leaflet monta
            sobre la nada, sin mapa y sin decir por que. */}
        <div className="relative order-1 h-[clamp(280px,68vh,440px)] overflow-hidden rounded-2xl border border-white/12 bg-[#e8e4dc] lg:order-2 lg:h-[clamp(360px,78vh,560px)]">
          <div
            ref={caja3d}
            className="h-full w-full"
            aria-label={tr('Mapa de los espacios publicitarios en Aguascalientes')}
          />

          {/* la leyenda, sobre el mapa */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-xl border border-black/10 bg-white/92 px-3 py-2 text-[11.5px] text-[#2a2438] shadow-lg backdrop-blur-sm">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full border border-white"
                style={{ background: LIBRE }}
                aria-hidden="true"
              />
              {tr('Disponible')}
            </span>
            <span className="mt-1 flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full border border-white"
                style={{ background: OCUPADO }}
                aria-hidden="true"
              />
              {tr('Ocupado')}
            </span>
          </div>

          {/* el atajo del filtro más pedido, encima del mapa */}
          <button
            onClick={() => setEstatus((v) => (v === 'LIBRE' ? 'TODOS' : 'LIBRE'))}
            className={`absolute right-3 top-3 z-[400] flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] shadow-lg backdrop-blur-sm transition-colors ${
              estatus === 'LIBRE'
                ? 'border-[#00A860] bg-[#00A860] text-white'
                : 'border-black/10 bg-white/92 text-[#2a2438] hover:border-[#00A860]/60'
            }`}
          >
            <Check size={13} strokeWidth={3} className={estatus === 'LIBRE' ? '' : 'opacity-35'} />
            {tr('Solo disponibles')}
          </button>
        </div>
      </div>
    </div>
  );
}
