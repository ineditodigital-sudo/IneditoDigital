import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Check } from 'lucide-react';

/*
 * El catálogo de espacios publicitarios, con su mapa.
 *
 * Los datos salen de /api/espectaculares.php, que lee NUESTRA copia del
 * inventario de Vía Gráfica —refrescada por el cron— y no su API en vivo: la
 * página no puede quedarse en blanco porque un servidor ajeno tarde.
 *
 * El mismo catálogo va escrito en el HTML que sirve render.php, así que un
 * buscador lo lee sin ejecutar nada. Esto de aquí es la versión con la que se
 * trabaja: filtrar, ver dónde cae cada uno y pedir el que interesa.
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
  altura: number | null;
  lat: number | null;
  lng: number | null;
};

const LEAFLET_JS = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js';
const LEAFLET_CSS = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';

/** Título de caja: los datos vienen en mayúsculas de su sistema. */
const caja = (t: string) =>
  t
    .toLocaleLowerCase('es-MX')
    .replace(/(^|[\s.·/-])([a-záéíóúñ])/g, (_, a, b) => a + b.toLocaleUpperCase('es-MX'));

export function CatalogoEspectaculares() {
  const [espacios, setEspacios] = useState<Espacio[] | null>(null);
  const [tipo, setTipo] = useState('TODOS');
  const [zona, setZona] = useState('TODAS');
  const [soloLibres, setSoloLibres] = useState(true);
  const [activo, setActivo] = useState<string | null>(null);

  const caja3d = useRef<HTMLDivElement>(null);
  const mapa = useRef<any>(null);
  const marcas = useRef<Record<string, any>>({});

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
    return espacios.filter(
      (e) =>
        (tipo === 'TODOS' || e.tipo === tipo) &&
        (zona === 'TODAS' || e.zona === zona) &&
        (!soloLibres || e.libre),
    );
  }, [espacios, tipo, zona, soloLibres]);

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

      const m = L.map(nodo, { scrollWheelZoom: false, attributionControl: true });
      mapa.current = m;
      /* OpenStreetMap: libre y sin llave. Las de CARTO ahora piden una y
         salían con la marca de agua encima del mapa. Se oscurecen con un
         filtro sobre el panel de teselas —invertir da un negativo azulado y
         rotar el tono 180° le devuelve el verde a los parques—. El filtro no
         puede ir en el mapa entero: invertiría también los marcadores y el
         verde de «disponible» saldría rosa. */
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(m);
      nodo.classList.add('mapa-oscuro');

      const conCoord = espacios.filter((e) => e.lat !== null && e.lng !== null);
      conCoord.forEach((e) => {
        const marca = L.circleMarker([e.lat as number, e.lng as number], {
          radius: 6,
          weight: 2,
          color: e.libre ? '#00E585' : '#8b6bb8',
          fillColor: e.libre ? '#00E585' : '#4a3a63',
          fillOpacity: e.libre ? 0.85 : 0.5,
        });
        marca.bindPopup(
          `<strong>${caja(e.tipo)}</strong><br>${caja(e.calle)}<br>` +
            `<span style="opacity:.7">Col. ${caja(e.colonia)} · ${e.medidas}</span><br>` +
            `<span style="color:${e.libre ? '#00A860' : '#7a5aa0'}">${e.libre ? 'Disponible' : 'Ocupado'}</span>`,
        );
        marca.on('click', () => setActivo(e.clave));
        marca.addTo(m);
        marcas.current[e.clave] = marca;
      });

      if (conCoord.length) {
        m.fitBounds(
          L.latLngBounds(conCoord.map((e) => [e.lat as number, e.lng as number])),
          { padding: [28, 28] },
        );
      }
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

  /* Al filtrar, el mapa enseña solo lo que queda. */
  useEffect(() => {
    if (!mapa.current) return;
    const vistos = new Set(filtrados.map((e) => e.clave));
    Object.entries(marcas.current).forEach(([clave, marca]) => {
      const dentro = vistos.has(clave);
      marca.setStyle({ opacity: dentro ? 1 : 0.12, fillOpacity: dentro ? 0.8 : 0.05 });
    });
  }, [filtrados]);

  const irA = (e: Espacio) => {
    setActivo(e.clave);
    const marca = marcas.current[e.clave];
    if (!marca || !mapa.current) return;
    mapa.current.setView(marca.getLatLng(), 16, { animate: true });
    marca.openPopup();
  };

  if (espacios === null) {
    return (
      <p className="text-sm text-white/40">Cargando el catálogo de espacios…</p>
    );
  }
  if (!espacios.length) {
    return (
      <p className="text-sm text-white/50">
        El catálogo no está disponible en este momento. Escríbenos y te pasamos los espacios libres.
      </p>
    );
  }

  const libres = espacios.filter((e) => e.libre).length;

  return (
    <div>
      {/* el conteo, que es el argumento de venta antes que el mapa */}
      <p className="mb-6 text-[15px] leading-relaxed text-white/60">
        <strong className="text-white">{espacios.length} espacios</strong> en Aguascalientes,{' '}
        <strong className="text-[#00E585]">{libres} disponibles</strong> hoy. Filtra por formato y
        zona, y pide el que te interese por su clave.
      </p>

      {/* filtros */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(['TODOS', ...tipos.map((t) => t[0])] as string[]).map((t) => (
          <button
            key={t}
            onClick={() => setTipo(t)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-200 ${
              tipo === t
                ? 'border-[#CC66FF]/50 bg-[#7700CE]/25 text-white'
                : 'border-white/12 text-white/55 hover:border-white/25 hover:text-white/80'
            }`}
          >
            {t === 'TODOS' ? 'Todos los formatos' : caja(t)}
            {t !== 'TODOS' && (
              <span className="ml-1.5 text-white/35">{tipos.find((x) => x[0] === t)?.[1]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(['TODAS', ...zonas.map((z) => z[0])] as string[]).map((z) => (
          <button
            key={z}
            onClick={() => setZona(z)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-200 ${
              zona === z
                ? 'border-[#CC66FF]/50 bg-[#7700CE]/25 text-white'
                : 'border-white/12 text-white/55 hover:border-white/25 hover:text-white/80'
            }`}
          >
            {z === 'TODAS' ? 'Toda la ciudad' : caja(z)}
          </button>
        ))}

        <button
          onClick={() => setSoloLibres((v) => !v)}
          className={`ml-auto flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-200 ${
            soloLibres
              ? 'border-[#00E585]/45 bg-[#00E585]/12 text-[#00E585]'
              : 'border-white/12 text-white/55 hover:border-white/25'
          }`}
        >
          <Check size={14} strokeWidth={3} className={soloLibres ? '' : 'opacity-30'} />
          Solo disponibles
        </button>
      </div>

      {/* el mapa */}
      <div
        ref={caja3d}
        className="mb-5 h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]"
        aria-label="Mapa de los espacios publicitarios en Aguascalientes"
      />

      <p className="mb-4 text-[13px] text-white/45">
        {filtrados.length === 0
          ? 'Ningún espacio con esos filtros. Prueba con otra zona o quita «solo disponibles».'
          : `${filtrados.length} ${filtrados.length === 1 ? 'espacio' : 'espacios'} con estos filtros.`}
      </p>

      {/* la lista */}
      <div className="max-h-[520px] overflow-y-auto rounded-xl border-t border-white/10">
        {filtrados.map((e, i) => (
          <motion.button
            key={e.clave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.015 }}
            onClick={() => irA(e)}
            className={`flex w-full items-start gap-3 border-b border-white/8 px-3 py-3.5 text-left transition-colors duration-200 ${
              activo === e.clave ? 'bg-[#7700CE]/15' : 'hover:bg-white/[.035]'
            }`}
          >
            <span
              className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                e.libre ? 'bg-[#00E585]' : 'bg-white/20'
              }`}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] leading-snug text-white/90">
                {caja(e.calle) || caja(e.titulo)}
              </span>
              <span className="mt-0.5 block text-[12.5px] text-white/45">
                {caja(e.tipo)}
                {e.colonia && ` · Col. ${caja(e.colonia)}`}
                {e.medidas && ` · ${e.medidas}`}
              </span>
            </span>
            <span className="flex flex-shrink-0 items-center gap-2 pt-0.5">
              <span className="font-mono text-[11px] tracking-wide text-white/30">{e.clave}</span>
              {e.lat !== null && <MapPin size={13} className="text-white/25" />}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
