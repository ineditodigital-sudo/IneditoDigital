import { useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, Linkedin,
  Youtube, Globe, Share2, Check, ChevronRight, UserPlus, Link2,
  CalendarDays, Briefcase, ShoppingBag, FileText, Play, Image as ImageIcon,
  Star, Music2,
} from 'lucide-react';
import { miembro } from '../cms';
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

  const d = m?.datos ?? {};
  const url = typeof window !== 'undefined' ? window.location.href : '';

  if (!m) return <NotFoundPage />;

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
