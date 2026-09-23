import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';
import { tr } from '../idioma';
import { detectarGlobal, buscarServicios, buscarPregunta, buscarExtra } from './asistente/intenciones';
import { enlaceWhatsApp, construirMensaje, type Requerimiento } from './asistente/mensajeWhatsApp';
import type { Service } from '../data/services';
import { pasosDelMetodo, diagnosticoDelMetodo, otrosServicios } from '../data/metodo';

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
 *   4. Solo pide nombre y un WhatsApp o correo, sin el cual no registra el
 *      lead (desde el 23-sep-2026). El resto es opcional.
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
  /** Respuesta a «¿cómo te llamas?» o «¿a qué WhatsApp…?»: es un dato, no
      una consulta, y no va en la lista de lo que consultó. */
  dato?: boolean;
}

type Fase = 'libre' | 'nombre' | 'contacto' | 'listo';

/*
 * Que se le respondio a cada tipo de pregunta, en una linea.
 *
 * Se deriva volviendo a pasar la pregunta por el detector al construir el
 * mensaje, en vez de anotarlo en los catorce sitios donde el asistente
 * contesta: una sola fuente y ningun sitio que se olvide de anotar.
 */
const RESUMEN: Partial<Record<string, string>> = {
  precio: 'me explicaron que se cotiza por proyecto',
  tiempo: 'me dijeron que depende del alcance',
  garantia: 'me explicaron que miden cada mes',
  ubicacion: 'ya vi la dirección',
  horario: 'ya vi el horario',
  catalogo: 'ya vi la lista de servicios',
  quienes: 'ya leí a qué se dedican',
  niveles: 'ya vi los tres niveles',
  portafolio: 'ya vi el portafolio',
  equipo: 'no estaba publicado, queda pendiente',
  cobertura: 'queda pendiente confirmarlo',
  administrativo: 'queda pendiente confirmarlo',
};

let contador = 0;
const nuevoId = () => `m${++contador}`;

/*
 * El contacto que se pide antes de registrar el lead (23-sep-2026).
 *
 * Hasta entonces el asistente registraba con el nombre y nada más, confiando
 * en que la persona enviaría el WhatsApp: los cuatro leads que llegaron por
 * aquí no traían ni teléfono ni correo, y no había forma de saber si habían
 * escrito. Ahora sin un WhatsApp o un correo válidos no hay registro.
 */

/** Un WhatsApp de México son 10 dígitos; con la lada del país (52 o 521)
    se deja en los 10 que se marcan. Uno de otro país se queda completo. */
function leerTelefono(texto: string): string | null {
  const d = texto.replace(/\D/g, '');
  if (d.length === 10) return d;
  if (d.length === 12 && d.startsWith('52')) return d.slice(2);
  if (d.length === 13 && d.startsWith('521')) return d.slice(3);
  if (d.length >= 11 && d.length <= 15 && !d.startsWith('52')) return `+${d}`;
  return null;
}

/** La misma regla que aplica el servidor (FILTER_VALIDATE_EMAIL de PHP): sin
    acentos, sin puntos dobles y con dominio completo. Si aquí se aceptara uno
    que allá no, el asistente diría «listo» con un lead que no se guardó. Se
    busca dentro del texto, así que «mi correo es ana@x.com» también sirve. */
const CORREO = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?![a-z0-9@.-]*[a-z0-9@-])/i;

function leerCorreo(texto: string): string | null {
  const m = texto.match(CORREO);
  if (!m) return null;
  /* Pegado a una letra con acento, a una coma o a otra arroba ya no es el
     correo completo: mejor volver a pedirlo que registrar la mitad. */
  const antes = texto[(m.index ?? 0) - 1];
  if (antes && /[^\s:;<(\[,"'¿¡]/.test(antes)) return null;
  return m[0].toLowerCase();
}

export default function AIAssistant() {
  const tVen = contenido('asistente', 'ventana');
  const tCon = contenido('asistente', 'conversacion');
  const { addLead, services, settings, isAssistantOpen, preselectedService, initialContext, closeAssistant } = useApp();
  const location = useLocation();

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

  /*
   * El idioma del asistente se resuelve aqui, en el unico punto por donde pasan
   * todos sus mensajes, en vez de envolver ochenta cadenas sueltas una por una.
   * Lo que no este en el diccionario —el titulo de un servicio que viene de la
   * base, lo que escribio el visitante— sale tal cual.
   */
  const traducirMensaje = (texto: string, extra: Partial<Mensaje>): Partial<Mensaje> => ({
    ...extra,
    texto: tr(texto),
    enlace: extra.enlace
      ? { ...extra.enlace, titulo: tr(extra.enlace.titulo), sub: tr(extra.enlace.sub) }
      : undefined,
    opciones: extra.opciones?.map((o) => ({ ...o, etiqueta: tr(o.etiqueta) })),
  });

  /** Añade un mensaje del bot con la pausa de "escribiendo…". */
  const bot = (texto: string, extra: Partial<Mensaje> = {}, espera = 550) => {
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMensajes((m) => [...m, { id: nuevoId(), emisor: 'bot', ...traducirMensaje(texto, extra) } as Mensaje]);
    }, espera);
  };

  /* tr() tambien aqui porque varias respuestas del usuario son la etiqueta del
     boton que pulso, no algo que haya tecleado. */
  const usuario = (texto: string, dato = false) =>
    setMensajes((m) => [...m, { id: nuevoId(), emisor: 'user', texto: tr(texto), dato }]);

  /* ---------------- apertura ---------------- */
  useEffect(() => {
    if (!isAssistantOpen) return;

    const svc = preselectedService ? services.find((s) => s.title === preselectedService) : null;

    /*
     * Si ya habia conversacion y vuelven a abrir desde OTRO servicio, no se
     * reinicia: se retoma reconociendo el cambio. Reiniciar aqui borraria lo
     * que la persona ya conto, que es justo lo que se quiso evitar.
     */
    if (arrancado) {
      if (svc && svc.title !== req.servicio) {
        setReq((r) => ({ ...r, servicio: svc.title }));
        bot(
          `Seguimos. Ahora estás viendo *${svc.title}*.\n\n${svc.shortDescription}`,
          {
            enlace: { titulo: svc.title, sub: 'Ver la página completa', url: `/servicios/${svc.slug}` },
            opciones: [
              { etiqueta: 'Cotizar esto', valor: '__cotizar__' },
              { etiqueta: 'Tengo una duda', valor: '__otra__' },
            ],
          },
          300
        );
      }
      return;
    }

    setArrancado(true);

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
  }, [isAssistantOpen, arrancado, preselectedService, initialContext, services, req.servicio]);

  /*
   * La conversacion NO se borra al cerrar.
   *
   * El componente vive en RootLayout, fuera del <Outlet/>, asi que sobrevive a
   * los cambios de ruta: quien va a la pagina de un servicio y vuelve encuentra
   * lo que ya habia contado. Al recargar de verdad, el componente se monta de
   * cero y el estado nace vacio.
   *
   * Para empezar de nuevo a proposito esta el boton de reiniciar.
   */

  /* Si cambia la pagina, cambia de donde dice que escribe. */
  useEffect(() => {
    const ruta = location.pathname;
    setReq((r) => ({ ...r, paginaOrigen: ruta && ruta !== '/' ? `la página ${ruta}` : 'el sitio' }));
  }, [location.pathname]);

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
      seguirConContacto({ nombre });
      return;
    }

    /* WhatsApp (lo ideal) o correo, y válidos: con uno de los dos se
       registra el lead; si no, se explica qué falta y se vuelve a pedir. */
    if (fase === 'contacto') {
      /* Si deja los dos, se guardan los dos. Los dígitos de un correo
         (ana2024@…) no cuentan como teléfono. */
      const correo = leerCorreo(texto);
      const telefono = leerTelefono(texto.replace(/\S*@\S*/g, ' '));
      if (correo || telefono) {
        const contacto: Partial<Requerimiento> = {};
        if (telefono) contacto.telefono = telefono;
        if (correo) contacto.email = correo;
        cerrar(contacto);
        return;
      }
      bot(errorDeContacto(texto.includes('@')), {}, 350);
      return;
    }

    /* --- fase libre: entender y responder --- */
    const global = detectarGlobal(texto);
    const coincidencias = buscarServicios(texto, services);
    const pregunta = buscarPregunta(texto, services);
    const extra = buscarExtra(texto);

    /*
     * "Que servicios tienen" es una pregunta de catalogo, no la busqueda de un
     * servicio. Sin esto ganaba Servicios QR, por ser el unico cuyo titulo
     * contiene la palabra "servicios".
     *
     * Pero la senal de catalogo incluye "que hacen", y al quitarle las palabras
     * vacias eso se queda en "hacen" a secas: cualquier "hacen paginas web" o
     * "hacen chatbots" caia aqui y contestaba con el menu completo en vez de
     * con la ficha que estaban pidiendo. Si un servicio encaja claramente,
     * gana el servicio.
     */
    const encajaUno = coincidencias.length > 0 && coincidencias[0].puntos >= 10;
    /* El catálogo se cuenta como el menú: el método en tres pasos, con el
       diagnóstico como puerta de entrada (data/metodo.ts). Lo demás sigue a
       mano, en «Otros servicios». */
    if (global === 'catalogo' && !encajaUno) {
      const d = diagnosticoDelMetodo();
      bot(
        tCon('r_catalogo', 'Trabajamos en tres pasos: que te encuentren, que te escriban y que te compren. ¿Por cuál empezamos?'),
        {
          enlace: { titulo: d.titulo, sub: tCon('r_catalogo_sub', 'Empieza por saber qué está mal, con evidencia'), url: d.ruta },
          opciones: [
            ...pasosDelMetodo().map((p) => ({ etiqueta: `${p.numero} · ${p.titulo}`, valor: `__grupo:${p.numero}__` })),
            { etiqueta: tCon('opcion_otros', 'Otros servicios'), valor: '__grupo:otros__' },
          ],
        }
      );
      return;
    }

    /* Al elegir un paso, se listan sus servicios como botones. El botón manda
       el título vigente del servicio (el del panel, ya en el idioma de la
       visita) para que la búsqueda caiga en su ficha. */
    if (texto.startsWith('__grupo:')) {
      const clave = texto.slice(8, -2);
      if (clave === 'otros') {
        bot(tCon('r_otros', 'También hacemos esto, casi siempre como parte de un proyecto:'), {
          opciones: [
            ...otrosServicios(services).map((s) => ({ etiqueta: s.title, valor: s.title })),
            { etiqueta: '← Ver los tres pasos', valor: 'que servicios tienen' },
          ],
        });
        return;
      }
      const paso = pasosDelMetodo().find((p) => p.numero === clave);
      if (paso) {
        bot(`*${paso.titulo}* · ${paso.sub}\n\n${tr('Elige el que te interese y te cuento:')}`, {
          opciones: [
            ...paso.items.map((it) => ({
              etiqueta: it.titulo,
              valor: (it.slug && services.find((s) => s.slug === it.slug)?.title) || it.buscar,
            })),
            { etiqueta: '← Ver los tres pasos', valor: 'que servicios tienen' },
          ],
        });
        return;
      }
    }

    /* Una pagina que no esta en la tabla (posicionamiento en IA, servicios-ia)
       y que coincide con fuerza: gana a cualquier intencion generica. Sin esto,
       "automatizar whatsapp" caia en la intencion de contacto por la palabra
       whatsapp, y "aparecer en chatgpt" no encontraba nada. */
    /* La pagina suelta ganaba con 8 puntos aunque un servicio hubiera
       sacado mas. "Quiero anunciarme en chatgpt" terminaba en la ficha de
       posicionamiento organico en IA en vez de en la de ChatGPT Ads. */
    if (extra && extra.puntos >= 8 && extra.puntos >= (coincidencias[0]?.puntos ?? 0) && global !== 'precio') {
      setReq((r) => ({ ...r, servicio: r.servicio ?? extra.pagina.titulo }));
      bot(`*${extra.pagina.titulo}*
${extra.pagina.desc}`, {
        enlace: { titulo: extra.pagina.titulo, sub: 'Ver la página completa', url: extra.pagina.url },
        opciones: [
          { etiqueta: 'Me interesa, cotizar', valor: '__cotizar__' },
          { etiqueta: 'Ver otros servicios', valor: '__otra__' },
        ],
      });
      return;
    }

    /* Un servicio que encaja con mucha fuerza tambien gana a las intenciones
       genericas: "quiero automatizar whatsapp" es el servicio de chatbots, no
       una peticion de contacto. */
    if (coincidencias.length && coincidencias[0].puntos >= 10 && global !== 'precio' && global !== 'tiempo') {
      responderServicio(coincidencias[0].servicio);
      return;
    }

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
    /* Cuanto tarda: no hay plazos publicados, pero SI hay proceso. */
    if (global === 'tiempo') {
      const svc = coincidencias[0]?.servicio;
      if (svc) setReq((r) => ({ ...r, servicio: r.servicio ?? svc.title }));
      const pasos = svc?.process?.length
        ? `\n\nEn ${svc.title} el trabajo va así:\n` +
          svc.process.map((p) => `${p.step}. ${p.title}`).join('\n')
        : '';
      bot(
        tCon(
          'r_tiempo',
          'Depende del alcance, y no quiero darte una fecha inventada: un sitio de cinco páginas y uno de cincuenta no tardan lo mismo.'
        ) + pasos + '\n\nSi me cuentas de qué tamaño es lo tuyo, en WhatsApp te dan un plazo real.',
        {
          ...(svc
            ? { enlace: { titulo: svc.title, sub: 'Ver el proceso completo', url: `/servicios/${svc.slug}` } }
            : {}),
          opciones: [
            { etiqueta: 'Contarles mi caso', valor: '__cotizar__' },
            { etiqueta: 'Tengo otra duda', valor: '__otra__' },
          ],
        }
      );
      return;
    }

    /* Garantias: la respuesta honesta ES el diferenciador. */
    if (global === 'garantia') {
      bot(
        tCon(
          'r_garantia',
          'No prometemos posiciones ni cifras concretas: nadie que trabaje en serio puede garantizar eso, y quien lo promete te está vendiendo humo.\n\nLo que sí garantizamos es que vas a saber qué está pasando. Medimos cada mes contra el punto de partida y te decimos si funciona o si no. Si no funciona, lo dice el reporte, no nosotros.'
        ),
        {
          enlace: { titulo: 'Auditoría con IA', sub: 'Cómo medimos y qué se entrega', url: '/servicios/auditoria-con-ia' },
          opciones: [
            { etiqueta: 'Me convence, hablemos', valor: '__cotizar__' },
            { etiqueta: 'Tengo otra duda', valor: '__otra__' },
          ],
        }
      );
      return;
    }

    /* Quien soy: honesto. Es un asistente, no una persona. */
    if (global === 'identidad') {
      bot(
        tCon(
          'r_identidad',
          'Soy el asistente del sitio de Inédito Digital 🤖\n\nNo soy una persona: contesto con la información publicada de los servicios. Para lo que necesite criterio —una cotización, tu caso concreto— te paso con el equipo por WhatsApp y te responden ellos.'
        ),
        {
          opciones: [
            { etiqueta: 'Hablar con una persona', valor: '__cotizar__' },
            { etiqueta: 'Sigo contigo', valor: '__otra__' },
          ],
        }
      );
      return;
    }

    /* Cuantos son: no tengo el dato y no me lo invento. */
    if (global === 'equipo') {
      bot(
        tCon(
          'r_equipo',
          'Esa no la tengo publicada, así que prefiero no darte un número inventado. Te lo responden en un momento por WhatsApp.\n\nLo que sí puedo contarte es cómo trabajamos.'
        ),
        {
          enlace: { titulo: 'Nosotros', sub: 'Cómo trabajamos y qué prometemos', url: '/nosotros' },
          opciones: [{ etiqueta: 'Preguntar por WhatsApp', valor: '__cotizar__' }],
        }
      );
      return;
    }

    if (global === 'cobertura') {
      bot(
        tCon(
          'r_cobertura',
          `Nuestra oficina está en ${settings.businessCity}. Buena parte del trabajo —web, posicionamiento, campañas, tableros— se hace igual de bien a distancia.\n\nCuéntame dónde estás y en WhatsApp te confirman cómo lo llevaríamos en tu caso.`
        ),
        { opciones: [{ etiqueta: 'Preguntar por WhatsApp', valor: '__cotizar__' }] }
      );
      return;
    }

    if (global === 'administrativo') {
      bot(
        tCon(
          'r_administrativo',
          'Facturación, formas de pago y condiciones se ven caso por caso, y no quiero darte un dato equivocado.\n\nEn WhatsApp te lo aclaran de una vez y con la información correcta.'
        ),
        { opciones: [{ etiqueta: 'Preguntar por WhatsApp', valor: '__cotizar__' }] }
      );
      return;
    }

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
      seguirConContacto({});
      return;
    }
    setFase('nombre');
    bot(tCon('p_nombre_corto', 'Perfecto. ¿Cómo te llamas?'));
  };

  const errorDeContacto = (esCorreo: boolean) =>
    esCorreo
      ? tCon('e_correo', 'Ese correo no se ve completo. Revísalo, o déjanos mejor tu WhatsApp.')
      : tCon('e_telefono', 'Ese número se ve incompleto: son 10 dígitos, como 449 123 4567. También puedes dejarnos tu correo.');

  /** Sin un WhatsApp o un correo no hay lead que se pueda atender: se pide
      ANTES de registrarlo. Si ya lo dio en esta conversación, se sigue. */
  const seguirConContacto = (extra: Partial<Requerimiento>) => {
    const final = { ...req, ...extra };
    setReq(final);
    if (final.telefono || final.email) {
      cerrar(extra);
      return;
    }
    setFase('contacto');
    bot(tCon('p_contacto', '¿A qué WhatsApp te escribimos? Si lo prefieres, déjanos tu correo.'));
  };

  /** Guarda el lead y deja el boton de WhatsApp listo. */
  const cerrar = (extra: Partial<Requerimiento>) => {
    const final = { ...req, ...extra };
    setReq(final);
    setFase('listo');

    /* El servicio sale de lo que la persona DESCRIBIÓ, no del primer botón
       que tocó.
       El primer lead real llegó marcado como «Google Ads» porque así empezó
       la conversación; después escribió un requerimiento de contenido,
       reels, community manager y Meta Ads, y el campo se quedó con lo
       primero. El equipo leía en la ficha una cosa distinta de la que
       pedía. Un párrafo escrito a mano pesa más que un botón. */
    const descripcion = mensajes
      .filter((m) => m.emisor === 'user' && !m.dato)
      .map((m) => m.texto.trim())
      .filter((t) => t.length > 90)
      .sort((a, b) => b.length - a.length)[0];

    let servicioFinal = final.servicio;
    if (descripcion) {
      /* Solo el primero. Con dos, la segunda coincidencia salia por una
         palabra suelta —«Diseño de posts» activaba «Diseño y Desarrollo
         Web»— y una etiqueta equivocada es peor que una etiqueta corta.
         El requerimiento entero va en el mensaje de todas formas. */
      const hallado = buscarServicios(descripcion, services).filter((c) => c.puntos >= 8)[0];
      if (hallado) servicioFinal = hallado.servicio.title;
    }

    const datos = {
      name: final.nombre || 'Sin nombre',
      email: final.email || '',
      phone: final.telefono || '',
      company: final.empresa,
      service: servicioFinal,
      message: final.detalle,
      source: 'Asistente web',
    };
    addLead(datos);

    /* Y al servidor, que es donde alguien lo va a ver.
     *
     * `addLead` solo guarda en el navegador de quien está visitando: durante
     * meses el asistente juntó nombre, empresa y servicio, se lo entregó a
     * WhatsApp y la copia se perdió al cerrar la pestaña. La tabla de leads
     * estaba en cero mientras llegaban mensajes.
     *
     * Se guarda AQUÍ y no al pulsar el botón de WhatsApp a propósito: así
     * queda registro también de quien armó su consulta y no llegó a enviarla,
     * que es justo la fuga que no se veía.
     *
     * El mensaje lleva lo que preguntó, para que quien atienda no arranque
     * de cero. Si falla la red o el servidor, no se le dice nada a la
     * persona: su camino es WhatsApp y ese sigue abierto.
     *
     * La excepción es el 422: el servidor rechazó el WhatsApp o el correo y
     * el lead NO quedó guardado. Entonces se vuelve a pedir el dato, con más
     * espera que el «Listo» para no llegar antes que él. */
    void fetch('/api/lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...datos,
        message: construirMensaje({ ...final, consultas }),
      }),
    })
      .then((res) => {
        if (res.status !== 422) return;
        setReq((r) => ({ ...r, telefono: undefined, email: undefined }));
        setFase('contacto');
        /* El teléfono se revisa igual aquí que allá; si hubo correo, fue él. */
        bot(errorDeContacto(!!final.email), {}, 900);
      })
      .catch(() => {});

    /* El saludo va aparte del texto del panel: así el texto es literal (se
       puede traducir y comparar con su def) y el nombre no se pierde. */
    const listo = final.nombre ? `${tr('Listo')}, ${final.nombre.split(' ')[0]}.` : `${tr('Listo')}.`;
    bot(
      `${listo} ${tCon('r_listo', 'Te preparé el mensaje con todo lo que consultaste.\n\nDale al botón de abajo y solo tienes que enviarlo. Si no alcanzas, te escribimos nosotros.')}`,
      {},
      450
    );
  };

  /* ---------------- interaccion ---------------- */
  const enviar = (texto?: string) => {
    const t = (texto ?? entrada).trim();
    if (!t) return;
    if (!t.startsWith('__')) usuario(t, fase === 'nombre' || fase === 'contacto');
    setEntrada('');

    if (t === '__otra__') {
      bot(tCon('r_otra', '¿Qué más quieres saber?'), { opciones: opcionesInicio() });
      return;
    }
    responder(t);
  };

  /** Empezar de cero a proposito: es la unica via de borrar la conversacion. */
  const reiniciar = () => {
    setMensajes([]);
    setFase('libre');
    setEntrada('');
    setReq((r) => ({ paginaOrigen: r.paginaOrigen }));
    setArrancado(false);
  };

  /*
   * Lo que consulto la persona, para que el mensaje de WhatsApp lo lleve.
   *
   * Sale de sus propios mensajes en pantalla; la nota de que se le respondio se
   * deriva pasando cada pregunta por el detector. Se descartan las que no son
   * consultas de verdad (el nombre, el WhatsApp o el correo, un saludo suelto).
   */
  const consultas = mensajes
    .filter((m) => m.emisor === 'user' && !m.dato)
    .map((m) => m.texto)
    .filter((t) => t.length > 5 && !/\S+@\S+\.\S+/.test(t) && t !== req.nombre)
    .map((pregunta) => {
      const g = detectarGlobal(pregunta);
      if (g === 'saludo' || g === 'identidad' || g === 'contacto') return null;
      const svc = buscarServicios(pregunta, services)[0]?.servicio;
      const extra = buscarExtra(pregunta);
      const respondido =
        (g && RESUMEN[g] && tr(RESUMEN[g]!)) ||
        (extra && extra.puntos >= 8 ? `me mostró ${extra.pagina.titulo}` : '') ||
        (svc ? `me mostró la ficha de ${svc.title}` : '');
      return { pregunta, respondido: respondido || undefined };
    })
    .filter((c) => c !== null) as { pregunta: string; respondido?: string }[];

  const urlWhatsApp = enlaceWhatsApp(settings.whatsappNumber, { ...req, consultas });

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
          aria-label={tVen('titulo', 'ASISTENTE IA')}
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
                    aria-label={tr('Empezar de nuevo')}
                    title={tr('Empezar de nuevo')}
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
                      {tr('Enviar por WhatsApp')}
                    </Button>
                  </a>
                  <p className="text-center text-[10.5px] text-white/40">
                    {tr('Se abre WhatsApp con el mensaje escrito. Solo tienes que enviarlo.')}
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
                          ? tr('Tu nombre…')
                          : fase === 'contacto'
                          ? tr('Tu WhatsApp o tu correo…')
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
                    {tr('Prefiero escribir por WhatsApp')}
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
