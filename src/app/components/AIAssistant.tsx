import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';
import { detectarGlobal, buscarServicios, buscarPregunta } from './asistente/intenciones';
import { enlaceWhatsApp, type Requerimiento } from './asistente/mensajeWhatsApp';
import type { Service } from '../data/services';

/*
 * ASISTENTE — reescrito el 24/08/2026.
 *
 * El anterior hacia ocho preguntas seguidas (servicio, nombre, correo,
 * telefono, empresa, objetivo, presupuesto, urgencia) ANTES de dar nada a
 * cambio, no respondia ninguna duda, obligaba a teclear "1" o "2" en vez de
 * tocar un boton, y solo ofrecia 6 de los 13 servicios.
 *
 * Este responde primero y pregunta despues:
 *
 *   1. Entiende lo que escriben contra los datos reales del panel
 *      (titulos, categorias, caracteristicas y preguntas frecuentes).
 *   2. Contesta con esa informacion y ENLAZA a la pagina que lo explica.
 *   3. Ofrece WhatsApp en todo momento, no solo al final.
 *   4. Solo pide nombre y, si acaso, correo. El resto es opcional.
 *
 * Regla dura: no inventa. Si no hay dato (precios, plazos exactos), lo dice y
 * pasa a WhatsApp. Un asistente que se inventa un precio sale caro.
 */

interface Mensaje {
  id: string;
  emisor: 'bot' | 'user';
  texto: string;
  enlace?: { titulo: string; sub: string; url: string };
  opciones?: { etiqueta: string; valor: string }[];
}

type Fase = 'libre' | 'nombre' | 'contacto' | 'listo';

let contador = 0;
const nuevoId = () => `m${++contador}`;

export default function AIAssistant() {
  const tVen = contenido('asistente', 'ventana');
  const tCon = contenido('asistente', 'conversacion');
  const { addLead, services, settings, isAssistantOpen, preselectedService, initialContext, closeAssistant } = useApp();

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [entrada, setEntrada] = useState('');
  const [fase, setFase] = useState<Fase>('libre');
  const [escribiendo, setEscribiendo] = useState(false);
  const [req, setReq] = useState<Requerimiento>({});
  const [arrancado, setArrancado] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  /** Añade un mensaje del bot con la pausa de "escribiendo…". */
  const bot = (texto: string, extra: Partial<Mensaje> = {}, espera = 550) => {
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMensajes((m) => [...m, { id: nuevoId(), emisor: 'bot', texto, ...extra }]);
    }, espera);
  };

  const usuario = (texto: string) =>
    setMensajes((m) => [...m, { id: nuevoId(), emisor: 'user', texto }]);

  /* ---------------- apertura ---------------- */
  useEffect(() => {
    if (!isAssistantOpen || arrancado) return;
    setArrancado(true);

    const pagina = typeof window !== 'undefined' ? window.location.pathname : '';
    setReq((r) => ({ ...r, paginaOrigen: pagina && pagina !== '/' ? `la página ${pagina}` : 'el sitio' }));

    const svc = preselectedService ? services.find((s) => s.title === preselectedService) : null;

    if (svc) {
      setReq((r) => ({ ...r, servicio: svc.title }));
      bot(
        `Hola 👋 Veo que estás en *${svc.title}*.\n\n${svc.shortDescription}`,
        {
          enlace: { titulo: svc.title, sub: 'Ver la página completa', url: `/servicios/${svc.slug}` },
          opciones: [
            { etiqueta: '¿Qué incluye?', valor: `qué incluye ${svc.title}` },
            { etiqueta: '¿Cuánto cuesta?', valor: `cuánto cuesta ${svc.title}` },
            { etiqueta: 'Quiero cotizarlo', valor: '__cotizar__' },
          ],
        },
        300
      );
    } else if (initialContext) {
      bot(
        tCon('saludo_ctx', 'Hola 👋 Con gusto te ayudo a cotizar.\n\n¿Qué necesitas? Escríbelo con tus palabras, o elige una opción.'),
        { opciones: opcionesInicio() },
        300
      );
    } else {
      bot(
        tCon('saludo', 'Hola 👋 Soy el asistente de Inédito.\n\nPregúntame lo que quieras sobre nuestros servicios, o dime qué necesitas para tu negocio.'),
        { opciones: opcionesInicio() },
        300
      );
    }
  }, [isAssistantOpen, arrancado, preselectedService, initialContext, services]);

  /** Al cerrar, se olvida todo: la siguiente visita empieza limpia. */
  useEffect(() => {
    if (isAssistantOpen) return;
    const t = setTimeout(() => {
      setMensajes([]);
      setFase('libre');
      setReq({});
      setEntrada('');
      setArrancado(false);
    }, 400);
    return () => clearTimeout(t);
  }, [isAssistantOpen]);

  function opcionesInicio() {
    return [
      { etiqueta: '🔎 Aparecer en Google', valor: 'quiero posicionarme en google' },
      { etiqueta: '🤖 Aparecer en las IA', valor: 'quiero aparecer en chatgpt' },
      { etiqueta: '🌐 Página web', valor: 'necesito una pagina web' },
      { etiqueta: '📣 Publicidad', valor: 'quiero hacer publicidad' },
      { etiqueta: '💬 Hablar con alguien', valor: '__cotizar__' },
    ];
  }

  /* ---------------- el cerebro ---------------- */
  const responder = (texto: string) => {
    /* atajo: quiere hablar ya */
    if (texto === '__cotizar__') {
      pedirNombre();
      return;
    }

    if (fase === 'nombre') {
      const nombre = texto.trim().replace(/^(soy|me llamo|mi nombre es)\s+/i, '');
      setReq((r) => ({ ...r, nombre }));
      setFase('contacto');
      bot(
        `Mucho gusto, ${nombre.split(' ')[0]}. ¿Me dejas un correo o teléfono para darte seguimiento?\n\nSi prefieres, saltamos este paso y seguimos directo en WhatsApp.`,
        { opciones: [{ etiqueta: 'Saltar e ir a WhatsApp', valor: '__saltar__' }] }
      );
      return;
    }

    if (fase === 'contacto') {
      if (texto !== '__saltar__') {
        const esCorreo = /\S+@\S+\.\S+/.test(texto);
        setReq((r) => (esCorreo ? { ...r, email: texto.trim() } : { ...r, telefono: texto.trim() }));
      }
      cerrar(texto === '__saltar__' ? {} : { [/\S+@\S+\.\S+/.test(texto) ? 'email' : 'telefono']: texto.trim() });
      return;
    }

    /* --- fase libre: entender y responder --- */
    const global = detectarGlobal(texto);
    const coincidencias = buscarServicios(texto, services);
    const pregunta = buscarPregunta(texto, services);

    // guardar lo que escribio con sus palabras, para el mensaje de WhatsApp
    if (texto.length > 12 && !texto.startsWith('__')) {
      setReq((r) => ({ ...r, detalle: r.detalle ? r.detalle : texto.trim() }));
    }

    /* 1. una pregunta frecuente lo responde mejor que nada que yo improvise */
    if (pregunta && (!coincidencias.length || global === 'garantia' || global === 'tiempo')) {
      setReq((r) => ({ ...r, servicio: r.servicio ?? pregunta.servicio.title }));
      bot(pregunta.a, {
        enlace: {
          titulo: pregunta.servicio.title,
          sub: 'Ver la página completa',
          url: `/servicios/${pregunta.servicio.slug}`,
        },
        opciones: [
          { etiqueta: 'Me interesa, hablemos', valor: '__cotizar__' },
          { etiqueta: 'Tengo otra duda', valor: '__otra__' },
        ],
      });
      return;
    }

    /* 2. intenciones globales que no dependen de un servicio */
    if (global === 'precio') {
      const svc = coincidencias[0]?.servicio;
      if (svc) setReq((r) => ({ ...r, servicio: svc.title }));
      bot(
        tCon(
          'r_precio',
          'Cada proyecto se cotiza según lo que necesita, así que no manejo precios de lista: no sería honesto darte una cifra sin saber de qué tamaño es tu negocio.\n\nLo que sí: la primera revisión no tiene costo. Pásame tu caso por WhatsApp y te damos un número real.'
        ),
        {
          opciones: [
            { etiqueta: 'Va, cotizar por WhatsApp', valor: '__cotizar__' },
            { etiqueta: 'Antes tengo otra duda', valor: '__otra__' },
          ],
        }
      );
      return;
    }

    if (global === 'contacto') {
      bot(
        `Claro. Puedes escribirnos directo:\n\n📱 WhatsApp: ${settings.whatsappNumber}\n📧 ${settings.businessEmail}`,
        {
          enlace: { titulo: 'Página de contacto', sub: 'Formulario y ubicación', url: '/contacto' },
          opciones: [{ etiqueta: 'Abrir WhatsApp ahora', valor: '__cotizar__' }],
        }
      );
      return;
    }

    if (global === 'ubicacion' || global === 'horario') {
      bot(
        `Estamos en ${settings.businessAddress}, ${settings.businessCity}.` +
          (settings.businessHours ? `\n\n🕐 ${settings.businessHours}` : ''),
        {
          enlace: { titulo: 'Cómo llegar', sub: 'Dirección y mapa', url: '/contacto' },
          opciones: [{ etiqueta: 'Escribir por WhatsApp', valor: '__cotizar__' }],
        }
      );
      return;
    }

    if (global === 'portafolio') {
      bot(tCon('r_portafolio', 'Tenemos los casos publicados con lo que hicimos en cada uno.'), {
        enlace: { titulo: 'Portafolio', sub: 'Casos de éxito con resultados', url: '/portafolio' },
        opciones: [{ etiqueta: 'Quiero algo así', valor: '__cotizar__' }],
      });
      return;
    }

    if (global === 'quienes') {
      bot(
        tCon(
          'r_quienes',
          'Somos una agencia de Aguascalientes que trabaja como dirección comercial asistida por IA: conectamos tus objetivos con datos reales y auditamos cada mes si la estrategia funciona.'
        ),
        {
          enlace: { titulo: 'Nosotros', sub: 'Cómo trabajamos y qué prometemos', url: '/nosotros' },
          opciones: [{ etiqueta: 'Hablemos de mi caso', valor: '__cotizar__' }],
        }
      );
      return;
    }

    if (global === 'niveles') {
      bot(
        tCon(
          'r_niveles',
          'Trabajamos en tres niveles según tu punto de partida:\n\n*1. Construir* — no tienes presencia digital todavía.\n*2. Mejorar* — ya tienes web y redes, pero no rinden.\n*3. Vender* — ya tienes todo y quieres resultados medidos.'
        ),
        {
          enlace: { titulo: 'Los tres niveles', sub: 'Elige por dónde entrar', url: '/servicios' },
          opciones: [{ etiqueta: '¿Cuál me toca? Pregúntame', valor: '__cotizar__' }],
        }
      );
      return;
    }

    /* 3. un servicio concreto */
    if (coincidencias.length === 1 || (coincidencias.length > 1 && coincidencias[0].puntos >= coincidencias[1].puntos + 5)) {
      responderServicio(coincidencias[0].servicio);
      return;
    }

    /* 4. varios candidatos: que elija */
    if (coincidencias.length > 1) {
      bot(tCon('r_varios', 'Puede ser cualquiera de estos. ¿Cuál te interesa?'), {
        opciones: coincidencias.map((c) => ({ etiqueta: c.servicio.title, valor: c.servicio.title })),
      });
      return;
    }

    /* 5. saludo suelto */
    if (global === 'saludo') {
      bot(tCon('r_saludo', '¡Hola! ¿Qué necesitas para tu negocio?'), { opciones: opcionesInicio() });
      return;
    }

    /* 6. no lo entendi: lo digo y ofrezco salida, no me lo invento */
    bot(
      tCon(
        'r_nada',
        'No estoy seguro de haber entendido bien 🤔\n\n¿Me lo dices de otra forma? O si prefieres, te paso con alguien del equipo que te responde al momento.'
      ),
      { opciones: [...opcionesInicio().slice(0, 4), { etiqueta: '💬 Mejor hablo con alguien', valor: '__cotizar__' }] }
    );
  };

  /** Ficha resumida de un servicio + enlace a su pagina. */
  const responderServicio = (s: Service) => {
    setReq((r) => ({ ...r, servicio: s.title }));
    const incluye = s.features.slice(0, 3).map((f) => `• ${f}`).join('\n');
    bot(
      `*${s.title}*\n${s.shortDescription}\n\nIncluye:\n${incluye}${s.features.length > 3 ? `\n…y ${s.features.length - 3} cosas más.` : ''}`,
      {
        enlace: { titulo: s.title, sub: 'Ver todo el detalle y el proceso', url: `/servicios/${s.slug}` },
        opciones: [
          { etiqueta: 'Me interesa, cotizar', valor: '__cotizar__' },
          ...(s.faq?.length ? [{ etiqueta: `¿${s.faq[0].question}`.replace('¿¿', '¿'), valor: s.faq[0].question }] : []),
          { etiqueta: 'Ver otros servicios', valor: '__otra__' },
        ],
      }
    );
  };

  const pedirNombre = () => {
    if (req.nombre) {
      cerrar({});
      return;
    }
    setFase('nombre');
    bot(tCon('p_nombre_corto', 'Perfecto. ¿Cómo te llamas?'));
  };

  /** Guarda el lead y deja el boton de WhatsApp listo. */
  const cerrar = (extra: Partial<Requerimiento>) => {
    const final = { ...req, ...extra };
    setReq(final);
    setFase('listo');

    addLead({
      name: final.nombre || 'Sin nombre',
      email: final.email || '',
      phone: final.telefono || '',
      company: final.empresa,
      service: final.servicio,
      message: final.detalle,
      source: 'Asistente web',
    });

    bot(
      `Listo${final.nombre ? `, ${final.nombre.split(' ')[0]}` : ''}. Te preparé el mensaje con todo lo que me contaste.\n\nDale al botón y solo tienes que enviarlo: nos llega completo y te contestamos en cuanto lo veamos.`,
      {},
      600
    );
  };

  /* ---------------- interaccion ---------------- */
  const enviar = (texto?: string) => {
    const t = (texto ?? entrada).trim();
    if (!t) return;
    if (!t.startsWith('__')) usuario(t);
    setEntrada('');

    if (t === '__otra__') {
      bot(tCon('r_otra', '¿Qué más quieres saber?'), { opciones: opcionesInicio() });
      return;
    }
    responder(t);
  };

  const reiniciar = () => {
    setMensajes([]);
    setFase('libre');
    setReq((r) => ({ paginaOrigen: r.paginaOrigen }));
    setArrancado(false);
  };

  const urlWhatsApp = enlaceWhatsApp(settings.whatsappNumber, req);

  return (
    <AnimatePresence>
      {isAssistantOpen && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] md:bottom-6 md:right-6 md:w-[420px]"
          role="dialog"
          aria-label={tVen('titulo', 'Asistente de Inédito')}
        >
          <div className="flex max-h-[min(78vh,620px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0A0A0A]/97 shadow-[0_0_60px_rgba(119,0,206,.35)] backdrop-blur-2xl md:rounded-3xl">
            {/* cabecera */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-4 py-3 md:px-5 md:py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm md:h-10 md:w-10">
                  <img
                    src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/robot-asistente.webp"
                    alt=""
                    className="h-5 w-5 object-contain md:h-6 md:w-6"
                  />
                </span>
                <div>
                  <div className="heading text-sm text-white md:text-base">{tVen('titulo', 'ASISTENTE IA')}</div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                    <span className="text-[10px] text-white/85 md:text-xs">{tVen('estado', 'En línea')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {mensajes.length > 2 && (
                  <button
                    onClick={reiniciar}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Empezar de nuevo"
                    title="Empezar de nuevo"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={closeAssistant}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:h-9 md:w-9"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* conversacion */}
            <div className="flex-1 space-y-3 overflow-y-auto p-3 md:p-4">
              {mensajes.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.emisor === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-lg ${
                      m.emisor === 'user'
                        ? 'bg-gradient-to-r from-[#7700CE] to-[#9933FF] text-white'
                        : 'border border-white/10 bg-white/[.07] text-white/90'
                    }`}
                  >
                    <p className="whitespace-pre-line text-[13px] leading-relaxed md:text-sm">{formatear(m.texto)}</p>
                  </div>

                  {/* tarjeta de enlace: lleva a la pagina real */}
                  {m.enlace && (
                    <Link
                      to={m.enlace.url}
                      onClick={closeAssistant}
                      className="group mt-2 flex w-[88%] items-center gap-3 rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/10 px-3.5 py-2.5 transition-colors hover:bg-[#CC66FF]/18"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-white">{m.enlace.titulo}</div>
                        <div className="truncate text-[11px] text-white/55">{m.enlace.sub}</div>
                      </div>
                      <ArrowRight size={15} className="shrink-0 text-[#CC66FF] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}

                  {/* respuestas rapidas: tocar, no teclear */}
                  {m.opciones && idx === mensajes.length - 1 && fase !== 'listo' && (
                    <div className="mt-2 flex w-[92%] flex-wrap gap-1.5">
                      {m.opciones.map((o) => (
                        <button
                          key={o.valor + o.etiqueta}
                          onClick={() => enviar(o.valor)}
                          className="rounded-full border border-white/15 bg-white/[.05] px-3 py-1.5 text-[12px] text-white/85 transition-all hover:border-[#CC66FF]/50 hover:bg-[#CC66FF]/12 hover:text-white"
                        >
                          {o.etiqueta}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {escribiendo && (
                <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[.07] px-3.5 py-3 w-fit">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#CC66FF]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              )}
              <div ref={finRef} />
            </div>

            {/* pie */}
            <div className="shrink-0 border-t border-white/10 bg-black/40 p-3 md:p-4">
              {fase === 'listo' ? (
                <div className="space-y-2">
                  <a href={urlWhatsApp} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white hover:bg-green-700">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Enviar por WhatsApp
                    </Button>
                  </a>
                  <p className="text-center text-[10.5px] text-white/40">
                    Se abre WhatsApp con el mensaje escrito. Solo tienes que enviarlo.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      value={entrada}
                      onChange={(e) => setEntrada(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && enviar()}
                      placeholder={
                        fase === 'nombre'
                          ? 'Tu nombre…'
                          : fase === 'contacto'
                          ? 'Correo o teléfono…'
                          : tVen('placeholder', 'Escribe tu pregunta…')
                      }
                      className="border-white/10 bg-white/5 text-sm text-white placeholder:text-white/40 focus:border-[#9933FF]"
                    />
                    <Button
                      onClick={() => enviar()}
                      size="icon"
                      className="h-11 w-11 shrink-0 rounded-xl bg-[#7700CE] hover:bg-[#9933FF]"
                      aria-label="Enviar"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  {/* La salida a WhatsApp esta SIEMPRE disponible, no solo al final */}
                  <a
                    href={urlWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1.5 text-[11.5px] text-white/45 transition-colors hover:text-green-400"
                  >
                    <MessageCircle size={13} />
                    Prefiero escribir por WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Convierte *negrita* de WhatsApp en algo legible dentro de la burbuja. */
function formatear(t: string) {
  return t.split(/(\*[^*]+\*)/g).map((p, i) =>
    p.startsWith('*') && p.endsWith('*') && p.length > 2 ? (
      <strong key={i} className="font-semibold text-white">
        {p.slice(1, -1)}
      </strong>
    ) : (
      p
    )
  );
}
