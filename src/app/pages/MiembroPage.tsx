import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, Linkedin,
  Youtube, Globe, Share2, Check, ChevronRight, UserPlus, Link2,
  CalendarDays, Briefcase, ShoppingBag, FileText, Play, Image as ImageIcon,
  Star, Music2, Copy, HelpCircle,
} from 'lucide-react';
import { miembro } from '../cms';
import TopographyCanvas from '../components/TopographyCanvas';
import NotFoundPage from './NotFoundPage';

/**
 * ============================================================
 * PÁGINA DE CONTACTO DE UN INTEGRANTE
 * ============================================================
 *
 * Es lo que se abre al acercar una tarjeta NFC, así que está pensada para un
 * celular y para resolver una sola cosa: que quien la abrió se quede con el
 * contacto en menos de tres segundos.
 *
 * La forma es una lista de enlaces, de arriba abajo, con el fondo oscuro y el
 * morado del sitio. Los dos primeros renglones son los que más se tocan
 * (guardar el contacto y WhatsApp), por eso van resaltados.
 *
 * Todo sale del panel. Un dato vacío no se dibuja, así que la página se
 * acomoda sola: quien no tenga TikTok simplemente no lo muestra.
 *
 * No lleva el encabezado ni el pie del sitio a propósito: la tarjeta es de la
 * persona, no un recorrido por la agencia.
 */

/* ------------------------------------------------------------------ */
/* Piezas                                                              */
/* ------------------------------------------------------------------ */

const ICONOS = {
  enlace: Link2, sitio: Globe, agenda: CalendarDays, portafolio: Briefcase,
  catalogo: ShoppingBag, documento: FileText, video: Play, foto: ImageIcon,
  mapa: MapPin, correo: Mail, telefono: Phone, whatsapp: MessageCircle,
  instagram: Instagram, facebook: Facebook, linkedin: Linkedin,
  tiktok: Music2, youtube: Youtube, estrella: Star,
} as const;

type Fila = {
  clave: string;
  titulo: string;
  sub?: string;
  href?: string;
  onClick?: () => void;
  Icono: typeof Link2;
  destacado?: boolean;
  externo?: boolean;
  /** El renglón entrega un archivo en vez de navegar. */
  descarga?: boolean;
};

/**
 * Un renglón de la lista.
 *
 * El destacado va con el degradado de la marca; el resto en vidrio oscuro,
 * como las tarjetas del sitio. Se hunde un poco al tocarlo para que en un
 * celular se sienta que respondió.
 */
function Renglon({ f, acento, i }: { f: Fila; acento: string; i: number }) {
  const { Icono } = f;

  const contenido = (
    <>
      <span
        className="w-11 h-11 rounded-xl grid place-items-center shrink-0 transition-colors"
        style={
          f.destacado
            ? { background: 'rgba(255,255,255,0.18)' }
            : { background: `${acento}22`, color: '#CC66FF' }
        }
      >
        <Icono size={20} className={f.destacado ? 'text-white' : ''} />
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-semibold text-white leading-snug truncate">{f.titulo}</span>
        {f.sub && <span className="block text-xs text-white/50 leading-snug truncate mt-0.5">{f.sub}</span>}
      </span>

      <ChevronRight size={20} className={f.destacado ? 'text-white/70' : 'text-white/25'} />
    </>
  );

  const clases =
    'w-full flex items-center gap-3.5 rounded-2xl p-3 pr-4 text-left transition-all duration-200 active:scale-[0.98]';

  const estilo = f.destacado
    ? {
        background: `linear-gradient(100deg, ${acento}, #9933FF)`,
        boxShadow: `0 0 30px ${acento}59`,
      }
    : undefined;

  const cuerpo = f.destacado ? (
    <div className={clases} style={estilo}>{contenido}</div>
  ) : (
    <div className={`${clases} bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-white/20`}>
      {contenido}
    </div>
  );

  const anim = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.22 + i * 0.045, ease: [0.22, 1, 0.36, 1] as const },
  };

  // Si hay dirección va como enlace, aunque además tenga algo que hacer al
  // tocarlo: así "Guardar mi contacto" descarga de verdad y de paso avisa.
  if (f.href) {
    return (
      <motion.a
        {...anim}
        href={f.href}
        onClick={f.onClick}
        {...(f.descarga ? { download: '' } : {})}
        {...(f.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="block"
      >
        {cuerpo}
      </motion.a>
    );
  }
  return (
    <motion.button {...anim} onClick={f.onClick} className="block w-full">
      {cuerpo}
    </motion.button>
  );
}

/** El morado con el que está grabada la animación: #7800CF, tono 275°. */
const TONO_BASE = 275;

/** El tono de un color #RRGGBB, de 0 a 360. */
function tonoDe(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return TONO_BASE;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/** Deja el teléfono como lo quiere un enlace: solo dígitos y el signo. */
const soloNumero = (v: string) => v.replace(/[^\d+]/g, '');

const REDES: { campo: string; nombre: string; Icono: typeof Instagram }[] = [
  { campo: 'instagram', nombre: 'Instagram', Icono: Instagram },
  { campo: 'tiktok', nombre: 'TikTok', Icono: Music2 },
  { campo: 'youtube', nombre: 'YouTube', Icono: Youtube },
  { campo: 'facebook', nombre: 'Facebook', Icono: Facebook },
  { campo: 'linkedin', nombre: 'LinkedIn', Icono: Linkedin },
  { campo: 'behance', nombre: 'Behance', Icono: Globe },
  { campo: 'sitio', nombre: 'Sitio web', Icono: Globe },
];

/* ------------------------------------------------------------------ */

export default function MiembroPage() {
  const { slug } = useParams<{ slug: string }>();
  const m = miembro(slug || '');
  const [guardado, setGuardado] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [ayuda, setAyuda] = useState(false);
  const [copiadoCampo, setCopiadoCampo] = useState('');
  const [previa, setPrevia] = useState<Record<string, string> | null>(null);

  /* Vista previa dentro del panel.
     Cuando esta página se abre en el recuadro del editor, el panel le va
     mandando lo que el cliente escribe y aquí se dibuja al momento. Solo se
     aceptan mensajes del propio sitio, y solo cuando estamos dentro de un
     recuadro: en una visita normal esto no hace nada. */
  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return;
    const alRecibir = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;
      const m = ev.data;
      if (m && m.tipo === 'inedito:previa' && m.datos && typeof m.datos === 'object') {
        setPrevia(m.datos as Record<string, string>);
      }
    };
    window.addEventListener('message', alRecibir);
    // Avisar que ya estamos listos, para que el panel mande el primer estado
    window.parent.postMessage({ tipo: 'inedito:previa-lista' }, window.location.origin);
    return () => window.removeEventListener('message', alRecibir);
  }, []);

  const d = previa ?? m?.datos ?? {};
  const url = typeof window !== 'undefined' ? window.location.href : '';

  // Sin datos guardados y sin vista previa no hay nada que enseñar. Con vista
  // previa sí: así se puede ver a alguien que todavía está en borrador.
  if (!m && !previa) return <NotFoundPage />;

  const acento = /^#[0-9a-fA-F]{6}$/.test(d.acento || '') ? d.acento : '#7700CE';

  const tel = soloNumero(d.telefono || '');
  const wa = soloNumero(d.whatsapp || '');
  const waUrl = wa
    ? `https://wa.me/${wa.replace(/^\+/, '')}${d.wa_texto ? `?text=${encodeURIComponent(d.wa_texto)}` : ''}`
    : '';

  const redes = REDES.filter((r) => (d[r.campo] || '').trim() !== '');

  /* El archivo lo arma el servidor: es el mismo que se ve en el panel, lleva
     la foto adentro y en iPhone abre la ficha de contacto en vez de bajar un
     archivo suelto que el usuario tenga que buscar. */
  const urlTarjeta = `/${slug}.vcf`;

  /** Comparte con el menú del celular; en escritorio copia el enlace. */
  const compartir = async () => {
    const datos = { title: `${d.nombre} · ${d.puesto || d.empresa || ''}`.trim(), url };
    if (navigator.share) {
      try { await navigator.share(datos); return; } catch { /* lo cerró, no pasa nada */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch { /* sin permiso de portapapeles: no hacemos ruido */ }
  };

  /* Los renglones automáticos, armados con los datos de contacto. */
  const filas: Fila[] = [
    {
      clave: 'guardar',
      titulo: guardado ? '¡Guardado!' : d.b_guardar || 'Guardar mi contacto',
      sub: d.b_guardar_sub || 'Se agrega a la agenda de tu celular',
      Icono: guardado ? Check : UserPlus,
      destacado: true,
      href: urlTarjeta,
      descarga: true,
      onClick: () => {
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2600);
      },
    },
    waUrl && {
      clave: 'whatsapp',
      titulo: d.b_whatsapp || 'Escríbeme por WhatsApp',
      sub: d.whatsapp,
      Icono: MessageCircle,
      href: waUrl,
      externo: true,
    },
    tel && {
      clave: 'tel',
      titulo: d.b_llamar || 'Llámame',
      sub: d.telefono,
      Icono: Phone,
      href: `tel:${tel}`,
    },
    d.email && {
      clave: 'mail',
      titulo: d.b_email || 'Mándame un correo',
      sub: d.email,
      Icono: Mail,
      href: `mailto:${d.email}`,
    },
    d.maps && {
      clave: 'maps',
      titulo: d.b_ubicacion || 'Dónde estamos',
      sub: d.ciudad,
      Icono: MapPin,
      href: d.maps,
      externo: true,
    },
  ].filter(Boolean) as Fila[];

  /* Y los que el integrante agregó a mano desde el panel. */
  for (let i = 1; i <= 8; i++) {
    const titulo = (d[`e${i}_titulo`] || '').trim();
    const href = (d[`e${i}_url`] || '').trim();
    if (d[`e${i}_ver`] === '0' || titulo === '' || href === '') continue;
    const icono = (d[`e${i}_icono`] || 'enlace') as keyof typeof ICONOS;
    filas.push({
      clave: `e${i}`,
      titulo,
      sub: (d[`e${i}_sub`] || '').trim() || undefined,
      href,
      Icono: ICONOS[icono] ?? Link2,
      destacado: d[`e${i}_destacado`] === '1',
      externo: /^https?:\/\//i.test(href),
    });
  }

  const sinMovimiento = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

  /* Android sabe abrir su propia pantalla de contacto nuevo con los datos ya
     escritos. No lleva foto, pero no depende de bajar ni de abrir un archivo,
     así que funciona incluso donde la descarga está bloqueada. Si el celular
     no entiende la instrucción, se va al archivo de siempre. */
  const intentAndroid = (() => {
    const extras: string[] = [];
    const meter = (k: string, v?: string) => { if (v && v.trim()) extras.push(`S.${k}=${encodeURIComponent(v.trim())}`); };
    meter('name', d.nombre);
    meter('phone', d.telefono || d.whatsapp);
    meter('email', d.email);
    meter('company', d.empresa);
    meter('job_title', d.puesto);
    meter('notes', d.frase);
    // Chrome solo acepta una dirección completa aquí; con una relativa la ignora
    const respaldo = typeof window !== 'undefined' ? window.location.origin + urlTarjeta : urlTarjeta;
    extras.push(`S.browser_fallback_url=${encodeURIComponent(respaldo)}`);
    return `intent://contacto#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;${extras.join(';')};end`;
  })();

  const datosSueltos = [
    { etiqueta: 'Nombre', valor: [d.nombre, d.puesto].filter(Boolean).join(' · ') },
    d.telefono && { etiqueta: 'Teléfono', valor: d.telefono },
    d.whatsapp && d.whatsapp !== d.telefono && { etiqueta: 'WhatsApp', valor: d.whatsapp },
    d.email && { etiqueta: 'Correo', valor: d.email },
  ].filter(Boolean) as { etiqueta: string; valor: string }[];

  const copiar = async (etiqueta: string, valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiadoCampo(etiqueta);
      setTimeout(() => setCopiadoCampo(''), 2000);
    } catch { /* sin permiso de portapapeles: el dato igual se ve y se puede seleccionar */ }
  };

  const anio = new Date().getFullYear();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D0010]">
      {/* Los halos de la marca, los mismos que la portada del sitio */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] rounded-full blur-[130px] opacity-40"
        style={{ background: acento }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-32 w-[26rem] h-[26rem] rounded-full blur-[130px] opacity-20 bg-[#9933FF]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 -right-32 w-[26rem] h-[26rem] rounded-full blur-[130px] opacity-15 bg-[#CC66FF]"
        aria-hidden
      />

      {/* Las curvas de nivel, encima de los halos y debajo del contenido.

          Dos formas de hacerlo, a elección desde el panel:
          - el video, que es la animación original ya optimizada;
          - o dibujarlas al vuelo, que no gasta un solo byte de datos.

          El video va grabado en morado sobre negro; con la mezcla "screen" el
          negro desaparece y solo quedan las líneas, y el giro de tono las
          lleva al color de cada integrante sin necesidad de otro archivo. */}
      {d.topo_ver !== '0' && (
        d.topo_estilo === 'canvas' ? (
          <TopographyCanvas
            colorA={d.topo_a || '#9933FF'}
            colorB={d.topo_b || '#7700CE'}
            intensidad={Number(d.topo_fuerza) || 1}
            curvas={Number(d.topo_densidad) || 8}
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="mx-auto h-full max-w-[560px]">
              <video
                className="w-full h-full object-cover mix-blend-screen"
                style={{
                  filter: `hue-rotate(${Math.round(tonoDe(d.topo_a || '#9933FF') - TONO_BASE)}deg)`,
                  opacity: 0.55 * (Number(d.topo_fuerza) || 1),
                }}
                src="/topo-lineas.mp4"
                autoPlay={!sinMovimiento}
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        )
      )}

      <div className="relative mx-auto w-full max-w-[440px] px-5 pt-6 pb-14">

        {/* ---------- compartir ---------- */}
        <div className="flex justify-end mb-2">
          <button
            onClick={compartir}
            aria-label="Compartir esta página"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-white hover:border-white/25 active:scale-90 transition-all"
          >
            {copiado ? <Check size={17} /> : <Share2 size={17} />}
          </button>
        </div>

        {/* ---------- quién es ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-7"
        >
          <div
            className="mx-auto w-[124px] h-[124px] rounded-full p-[3px] mb-4"
            style={{ background: `linear-gradient(140deg, ${acento}, #9933FF 55%, #CC66FF)` }}
          >
            {d.foto ? (
              <img
                src={d.foto}
                alt={d.nombre}
                className="w-full h-full rounded-full object-cover bg-[#0D0010]"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0D0010] grid place-items-center heading text-4xl text-white/85">
                {(d.nombre || '?').charAt(0)}
              </div>
            )}
          </div>

          <h1 className="heading text-[26px] leading-tight text-white mb-1.5">{d.nombre}</h1>

          {d.puesto && (
            <p
              className="text-[15px] font-semibold mb-3 bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, #CC66FF, ${acento})` }}
            >
              {d.puesto}
              {d.empresa && <span className="text-white/45 font-normal"> · {d.empresa}</span>}
            </p>
          )}

          {d.frase && (
            <p className="text-sm text-white/65 leading-relaxed max-w-[19rem] mx-auto whitespace-pre-line">
              {d.frase}
            </p>
          )}
        </motion.div>

        {/* ---------- redes ---------- */}
        {redes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center flex-wrap gap-2.5 mb-7"
          >
            {redes.map(({ campo, nombre, Icono }) => (
              <a
                key={campo}
                href={d[campo]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nombre}
                title={nombre}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/75 hover:text-white active:scale-90 transition-all"
                style={{ transitionProperty: 'transform, color, border-color' }}
                onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = acento; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = ''; }}
              >
                <Icono size={19} />
              </a>
            ))}
          </motion.div>
        )}

        {/* ---------- la lista ---------- */}
        <div className="flex flex-col gap-2.5">
          {filas.map((f, i) => (
            <Renglon key={f.clave} f={f} acento={acento} i={i} />
          ))}
        </div>

        {/* ---------- plan B ----------
            En iPhone el archivo abre solo la ficha de contacto. En Android
            baja a la carpeta de descargas y hay que tocar el aviso, y dentro
            de los navegadores de Instagram o Facebook a veces ni eso: esos
            navegadores bloquean las descargas. Por eso aquí hay una salida
            que no depende de ningún archivo. */}
        <div className="mt-6">
          {!ayuda ? (
            <button
              onClick={() => setAyuda(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <HelpCircle size={14} />
              ¿No se guardó el contacto?
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 overflow-hidden"
            >
              <p className="text-xs text-white/55 leading-relaxed mb-3">
                Algunos celulares no abren el archivo solos, sobre todo si llegaste
                desde Instagram o Facebook. Con esto lo agregas igual.
              </p>

              {esAndroid && (
                <a
                  href={intentAndroid}
                  className="flex items-center gap-2.5 rounded-xl p-3 mb-3 text-[13px] font-semibold text-white"
                  style={{ background: `linear-gradient(100deg, ${acento}, #9933FF)` }}
                >
                  <UserPlus size={17} />
                  Abrir Contactos con los datos ya puestos
                </a>
              )}

              <div className="flex flex-col gap-1.5">
                {datosSueltos.map(({ etiqueta, valor }) => (
                  <button
                    key={etiqueta}
                    onClick={() => copiar(etiqueta, valor)}
                    className="flex items-center gap-2.5 text-left rounded-xl px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block text-[10px] uppercase tracking-wider text-white/35">{etiqueta}</span>
                      <span className="block text-[13px] text-white/85 truncate">{valor}</span>
                    </span>
                    {copiadoCampo === etiqueta
                      ? <Check size={15} className="text-white/70 shrink-0" />
                      : <Copy size={15} className="text-white/30 shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ---------- pie ---------- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="/"
            className="text-[11px] tracking-[0.22em] uppercase text-white/35 hover:text-white/70 transition-colors"
          >
            {d.empresa || 'Inédito Digital'}
          </a>
          <p className="text-[11px] text-white/20 mt-1.5">© {anio}</p>
        </motion.div>
      </div>
    </div>
  );
}
