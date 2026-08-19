import { Fragment, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, Linkedin,
  Youtube, Globe, Share2, Check, ArrowUpRight, UserPlus,
} from 'lucide-react';
import { miembro } from '../cms';
import NotFoundPage from './NotFoundPage';

/**
 * ============================================================
 * PÁGINA DE CONTACTO DE UN INTEGRANTE
 * ============================================================
 *
 * Es lo que se abre al acercar una tarjeta NFC, así que se diseña para un
 * celular y para resolver una sola cosa: que quien la abrió se pueda quedar
 * con el contacto en menos de tres segundos.
 *
 * Todo el contenido sale del panel. Un dato vacío no se dibuja, así que la
 * página se acomoda sola: quien no tenga TikTok simplemente no lo muestra.
 *
 * El sitio no pone su encabezado ni su pie aquí a propósito: la tarjeta es
 * de la persona, no un recorrido por la agencia.
 */

/* ------------------------------------------------------------------ */
/* La unión entre píldoras                                             */
/* ------------------------------------------------------------------ */

/**
 * El nudo que une dos píldoras.
 *
 * Son dos círculos del color del fondo que muerden por arriba y por abajo un
 * puente relleno, y eso deja la cintura cóncava. Solo funciona sobre un fondo
 * liso, que es justo donde se usa.
 *
 * `diametro` es el tamaño de esos círculos: alrededor del 60% del alto de la
 * píldora deja la cintura como en la referencia. Más grande la estrangula.
 */
function Nudo({ fondo, tinta, diametro = 24 }: { fondo: string; tinta: string; diametro?: number }) {
  return (
    <span className="relative self-stretch shrink-0" style={{ width: 12, background: tinta }} aria-hidden>
      <span
        className="absolute left-1/2 top-0 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ width: diametro, height: diametro, background: fondo }}
      />
      <span
        className="absolute left-1/2 bottom-0 rounded-full -translate-x-1/2 translate-y-1/2"
        style={{ width: diametro, height: diametro, background: fondo }}
      />
    </span>
  );
}

function Cadena({
  items, fondo, tinta, className = '', pastilla = 'px-4 py-2 text-sm',
}: {
  items: React.ReactNode[];
  fondo: string;
  tinta: string;
  className?: string;
  pastilla?: string;
}) {
  const visibles = items.filter(Boolean);
  if (visibles.length === 0) return null;
  return (
    <div className={`inline-flex items-stretch ${className}`}>
      {visibles.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <Nudo fondo={fondo} tinta={tinta} />}
          <span
            className={`rounded-full whitespace-nowrap flex items-center ${pastilla}`}
            style={{ background: tinta, color: fondo }}
          >
            {it}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/** Deja el teléfono como lo quiere un enlace: solo dígitos y el signo. */
const soloNumero = (v: string) => v.replace(/[^\d+]/g, '');

/**
 * Arma el archivo de contacto que guarda el celular.
 *
 * Se genera aquí y no en el servidor para que funcione aunque la persona
 * abra la página sin señal, con la tarjeta ya cargada.
 */
function armarVCard(d: Record<string, string>, url: string): string {
  const partes = (d.nombre || '').trim().split(/\s+/);
  const nombre = partes[0] || '';
  const apellidos = partes.slice(1).join(' ');

  const l: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];
  l.push(`N:${apellidos};${nombre};;;`);
  l.push(`FN:${d.nombre || ''}`);
  if (d.empresa) l.push(`ORG:${d.empresa}`);
  if (d.puesto) l.push(`TITLE:${d.puesto}`);
  if (d.telefono) l.push(`TEL;TYPE=CELL:${soloNumero(d.telefono)}`);
  if (d.whatsapp && soloNumero(d.whatsapp) !== soloNumero(d.telefono || '')) {
    l.push(`TEL;TYPE=WORK:${soloNumero(d.whatsapp)}`);
  }
  if (d.email) l.push(`EMAIL;TYPE=INTERNET:${d.email}`);
  if (d.ciudad) l.push(`ADR;TYPE=WORK:;;;${d.ciudad};;;`);
  l.push(`URL:${url}`);
  for (const red of ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'behance']) {
    if (d[red]) l.push(`URL;TYPE=${red.toUpperCase()}:${d[red]}`);
  }
  if (d.frase) l.push(`NOTE:${d.frase.replace(/\n/g, '\\n')}`);
  l.push('END:VCARD');
  return l.join('\r\n');
}

const REDES: { campo: string; nombre: string; Icono: typeof Instagram }[] = [
  { campo: 'instagram', nombre: 'Instagram', Icono: Instagram },
  { campo: 'facebook', nombre: 'Facebook', Icono: Facebook },
  { campo: 'linkedin', nombre: 'LinkedIn', Icono: Linkedin },
  { campo: 'youtube', nombre: 'YouTube', Icono: Youtube },
  { campo: 'tiktok', nombre: 'TikTok', Icono: Globe },
  { campo: 'behance', nombre: 'Behance', Icono: Globe },
];

const entra = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/* ------------------------------------------------------------------ */

export default function MiembroPage() {
  const { slug } = useParams<{ slug: string }>();
  const m = miembro(slug || '');
  const [guardado, setGuardado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const d = m?.datos ?? {};
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const vcard = useMemo(() => (m ? armarVCard(d, url) : ''), [m, d, url]);

  if (!m) return <NotFoundPage />;

  const fondo = /^#[0-9a-fA-F]{6}$/.test(d.fondo || '') ? d.fondo : '#B18AFF';
  const tinta = /^#[0-9a-fA-F]{6}$/.test(d.tinta || '') ? d.tinta : '#0D0010';

  const tel = soloNumero(d.telefono || '');
  const wa = soloNumero(d.whatsapp || '');
  const waUrl = wa
    ? `https://wa.me/${wa.replace(/^\+/, '')}${d.wa_texto ? `?text=${encodeURIComponent(d.wa_texto)}` : ''}`
    : '';

  const redes = REDES.filter((r) => (d[r.campo] || '').trim() !== '');

  const agencia = [
    { titulo: d.a1_titulo, url: d.a1_url },
    { titulo: d.a2_titulo, url: d.a2_url },
    { titulo: d.a3_titulo, url: d.a3_url },
  ].filter((a) => (a.titulo || '').trim() !== '' && (a.url || '').trim() !== '');

  /** Descarga el contacto. El objeto se libera solo para no dejar basura. */
  const guardarContacto = () => {
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `${slug || 'contacto'}.vcf`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    setTimeout(() => URL.revokeObjectURL(enlace.href), 4000);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2600);
  };

  /** Comparte con el menú nativo del celular; en escritorio copia el enlace. */
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

  /* Los accesos redondos de arriba. Solo salen los que tienen dato. */
  const accesos = [
    tel && { etiqueta: d.b_llamar || 'Llamar', Icono: Phone, href: `tel:${tel}` },
    waUrl && { etiqueta: d.b_whatsapp || 'WhatsApp', Icono: MessageCircle, href: waUrl, externo: true },
    d.email && { etiqueta: d.b_email || 'Correo', Icono: Mail, href: `mailto:${d.email}` },
    d.maps && { etiqueta: d.b_ubicacion || 'Ubicación', Icono: MapPin, href: d.maps, externo: true },
  ].filter(Boolean) as { etiqueta: string; Icono: typeof Phone; href: string; externo?: boolean }[];

  return (
    <div className="min-h-screen w-full" style={{ background: fondo, color: tinta }}>
      <div className="mx-auto w-full max-w-[560px] px-5 pt-7 pb-40">

        {/* ---------- barra de arriba ---------- */}
        <motion.div {...entra} className="flex items-center justify-between mb-9">
          <a
            href="/"
            className="text-[11px] tracking-[0.28em] uppercase font-bold opacity-70 hover:opacity-100 transition-opacity"
          >
            {d.empresa || 'Inédito Digital'}
          </a>
          <button
            onClick={compartir}
            aria-label="Compartir esta página"
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center active:scale-90 transition-transform"
            style={{ borderColor: tinta }}
          >
            {copiado ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        </motion.div>

        {/* ---------- nombre ---------- */}
        <motion.div {...entra} transition={{ ...entra.transition, delay: 0.05 }}>
          {d.saludo && <div className="text-base opacity-60 mb-1">{d.saludo}</div>}
          <h1 className="heading text-[42px] leading-[0.95] mb-5 break-words">{d.nombre}</h1>
        </motion.div>

        {/* ---------- las etiquetas encadenadas ---------- */}
        <motion.div
          {...entra}
          transition={{ ...entra.transition, delay: 0.1 }}
          className="-mx-5 px-5 overflow-x-auto mb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Cadena
            fondo={fondo}
            tinta={tinta}
            items={[d.puesto, d.empresa, d.ciudad].filter((v) => (v || '').trim() !== '')}
            pastilla="px-5 py-2.5 text-sm font-medium"
          />
        </motion.div>

        {/* ---------- contacto ---------- */}
        {(accesos.length > 0 || d.foto) && (
          <motion.section {...entra} transition={{ ...entra.transition, delay: 0.15 }} className="mb-11">
            <h2 className="heading text-2xl mb-5">{d.t_contacto || 'Contáctame'}</h2>

            <div className="grid grid-cols-2 gap-3">
              {/* los accesos redondos */}
              {accesos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 content-start">
                  {accesos.map(({ etiqueta, Icono, href, externo }) => (
                    <a
                      key={etiqueta}
                      href={href}
                      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="aspect-square rounded-full flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      style={{ background: tinta, color: fondo }}
                    >
                      <Icono size={22} />
                      <span className="text-[11px] font-medium px-1 text-center leading-tight">{etiqueta}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* la tarjeta con la foto */}
              <div
                className="rounded-[26px] p-3 flex flex-col"
                style={{ background: tinta, color: fondo }}
              >
                {d.foto ? (
                  <img
                    src={d.foto}
                    alt={d.nombre}
                    className="w-full aspect-square object-cover rounded-[18px] mb-3"
                    loading="eager"
                  />
                ) : (
                  <div
                    className="w-full aspect-square rounded-[18px] mb-3 flex items-center justify-center heading text-5xl"
                    style={{ background: fondo, color: tinta }}
                  >
                    {(d.nombre || '?').charAt(0)}
                  </div>
                )}
                <div className="px-1 pb-1">
                  <div className="font-bold leading-tight mb-1">{d.nombre}</div>
                  {d.puesto && <div className="text-xs opacity-60 leading-snug">{d.puesto}</div>}
                </div>
              </div>
            </div>

            {d.frase && (
              <p className="mt-5 text-[15px] leading-relaxed opacity-75">{d.frase}</p>
            )}
          </motion.section>
        )}

        {/* ---------- redes ---------- */}
        {redes.length > 0 && (
          <motion.section {...entra} transition={{ ...entra.transition, delay: 0.2 }} className="mb-11">
            <h2 className="heading text-2xl mb-5">{d.t_redes || 'Sígueme'}</h2>
            <div className="flex flex-col gap-2.5">
              {redes.map(({ campo, nombre, Icono }, i) => (
                <a
                  key={campo}
                  href={d[campo]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[22px] px-5 py-4 flex items-center justify-between active:scale-[0.98] transition-transform"
                  style={
                    i === 0
                      ? { background: tinta, color: fondo }
                      : { border: `2px solid ${tinta}` }
                  }
                >
                  <span className="flex items-center gap-3 font-medium">
                    <Icono size={20} />
                    {nombre}
                  </span>
                  <ArrowUpRight size={18} className="opacity-60" />
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* ---------- la agencia ---------- */}
        {d.ver !== '0' && agencia.length > 0 && (
          <motion.section {...entra} transition={{ ...entra.transition, delay: 0.25 }}>
            <h2 className="heading text-2xl mb-5">{d.t_agencia || 'Lo que hacemos'}</h2>
            <div className="-mx-5 px-5 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {agencia.map((a) => (
                <a
                  key={a.titulo}
                  href={a.url}
                  className="shrink-0 rounded-[22px] px-5 py-4 flex items-center gap-2 font-medium active:scale-[0.98] transition-transform"
                  style={{ border: `2px solid ${tinta}` }}
                >
                  {a.titulo}
                  <ArrowUpRight size={17} className="opacity-60" />
                </a>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ---------- la barra que siempre se ve ---------- */}
      <div className="fixed bottom-0 left-0 right-0 pb-5 px-5 pointer-events-none">
        <div className="mx-auto w-full max-w-[560px] flex justify-center">
          <div className="pointer-events-auto flex items-stretch">
            <button
              onClick={guardarContacto}
              className="rounded-full pl-6 pr-7 py-4 flex items-center gap-2.5 font-bold active:scale-95 transition-transform shadow-[0_10px_40px_rgba(0,0,0,0.28)]"
              style={{ background: tinta, color: fondo }}
            >
              {guardado ? <Check size={20} /> : <UserPlus size={20} />}
              <span className="whitespace-nowrap">
                {guardado ? '¡Listo!' : d.b_guardar || 'Guardar contacto'}
              </span>
            </button>

            {waUrl && (
              <>
                <Nudo fondo={fondo} tinta={tinta} diametro={34} />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={d.b_whatsapp || 'WhatsApp'}
                  className="rounded-full px-5 flex items-center active:scale-95 transition-transform shadow-[0_10px_40px_rgba(0,0,0,0.28)]"
                  style={{ background: tinta, color: fondo }}
                >
                  <MessageCircle size={22} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
