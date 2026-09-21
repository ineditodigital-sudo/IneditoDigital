import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Plus, Sparkles } from 'lucide-react';
import { TopoLineas } from './TopoLineas';
import { RecorridoProceso } from './RecorridoProceso';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

/*
 * LA PÁGINA DE UN SERVICIO — una sola plantilla para todos.
 *
 * Aquí vive el diseño; los datos llegan por `ficha`. La usan las fichas de
 * /servicios/:slug (que salen de la colección «Servicios» del panel) y las
 * cinco páginas de IA (que salen de «Páginas»). Antes esas cinco tenían su
 * propio marcado y, cada vez que las fichas de servicio mejoraban, se
 * quedaban atrás: sin botón para cotizar, con un cierre vacío y con la
 * animación de otro servicio en el proceso. Con una sola plantilla ya no
 * pueden separarse.
 *
 * ESTRUCTURA tomada de la página de tarjetas NFC, que es la que funciona:
 *
 *   0. PORTADA          nombre grande sobre fondo vivo, sin foto de banco
 *      (bloque propio)  solo si el servicio lo trae: el catálogo de
 *                       espectaculares, los motores del de posicionamiento
 *   1. QUÉ INCLUYE      bento asimétrico, no una rejilla uniforme
 *   2. LO QUE GANAS     sobre BLANCO, para no perder el ritmo del sitio
 *   3. EL PROCESO       recorrido pegajoso con la escena de ESE servicio
 *      (bloque propio)  las demos de activaciones para expo
 *   4. IDEAL PARA       oscuro, compacto
 *   5. EL FONDO         el texto largo, plegado
 *   6. FAQ + CIERRE     sobre BLANCO
 *
 * Los datos mandan el diseño: cada sección se adapta a cuántos elementos
 * haya y desaparece si viene vacía, en vez de asumir un número fijo.
 */

/**
 * Un punto de «qué incluye», «lo que ganas» o «el fondo».
 *
 * Las fichas de servicio los escriben como una frase; las páginas de IA y la
 * de posicionamiento, con un título y su explicación. Las dos formas caben en
 * la misma caja: el título va en negritas y la explicación debajo. `nota` es
 * el sello chico que antecede a la explicación («SIN TRABAJO DE GEO»).
 */
export type Punto = string | { titulo: string; texto?: string; nota?: string };

export interface Ficha {
  /** Elige la escena del proceso. */
  slug: string;
  /** El nombre del servicio: el título grande de la página. */
  titulo: string;
  categoria: string;
  bajada: string;
  /** «Qué es». Va después de los botones y plegado en teléfono. */
  definicion?: string;
  volver: { a: string; texto: string };
  incluye: Punto[];
  beneficios: Punto[];
  /** El texto bajo «Lo que ganas». Si no viene, el de la plantilla. */
  beneficiosBajada?: string;
  proceso: { step: number; title: string; description: string }[];
  ideal: string[];
  /** Los párrafos de «El fondo del asunto». */
  fondo: Punto[];
  faq: { question: string; answer: string }[];
  /** Cómo se llama el servicio en el mensaje de WhatsApp y en el asistente. */
  nombre: string;
  /** Lo que el asistente entiende que se quiere al abrirlo. */
  contextoCotizar: string;
  /** El botón principal, arriba y en el cierre. */
  boton: string;
  cierre: { titulo: string; texto: string; boton?: string };
  /** Lo que solo tiene este servicio, justo después de la portada. */
  trasPortada?: ReactNode;
  /** Lo que solo tiene este servicio, justo después del proceso. */
  trasProceso?: ReactNode;
}

const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.6, delay: retraso },
});

const esFrase = (p: Punto): p is string => typeof p === 'string';

/** «Título» se lee como frase en un párrafo: si no trae puntuación, lleva punto. */
const conPunto = (t: string) => (/[.:!?…]$/.test(t.trim()) ? t.trim() : `${t.trim()}.`);

/* ------------------------------------------------------------------ */

export function FichaServicio({ ficha }: { ficha: Ficha }) {
  const { settings, openAssistant } = useApp();
  /* Si la definicion esta desplegada. Solo manda en telefono: de md para
     arriba el texto se ve entero y el boton no existe. */
  const [abierto, setAbierto] = useState(false);
  const tEnc = contenido('servicio-detalle', 'encabezados');

  const cotizar = () => openAssistant(ficha.nombre, ficha.contextoCotizar);
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Hola, me interesa el servicio de ${ficha.nombre}`
  )}`;

  return (
    <>
      <div className="relative bg-[#07060B]">
        {/* Atmosfera: rejilla de puntos con mascara y dos manchas que derivan.
            Es la misma que usa la pagina de tarjetas. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.5) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(ellipse 75% 40% at 50% 12%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 40% at 50% 12%, black, transparent)',
            }}
          />
          <motion.div
            className="absolute -top-1/4 left-1/4 h-[34rem] w-[34rem] rounded-full bg-[#7700CE]/20 blur-[130px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-0 h-[26rem] w-[26rem] rounded-full bg-[#9933FF]/14 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10">
          {/* ---------- ZONA 0 · PORTADA ---------- */}
          <section className="relative overflow-hidden px-4 pt-10 pb-16 md:pt-16 md:pb-24">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <TopoLineas className="h-full w-full" />
            </div>

            <div className="container mx-auto max-w-5xl">
              <div className="mb-9 flex flex-wrap items-center gap-3">
                <Link
                  to={ficha.volver.a}
                  className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.18em] text-white/40 transition-colors hover:text-white"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                  {ficha.volver.texto}
                </Link>
                <span className="text-white/15">/</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#CC66FF]">
                  <Sparkles size={15} />
                  {ficha.categoria}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="heading titulo-servicio max-w-5xl"
              >
                {ficha.titulo}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
              >
                {ficha.bajada}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <button
                  onClick={cotizar}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-transform hover:scale-[1.03]"
                >
                  {ficha.boton}
                  <ArrowRight size={17} />
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:border-[#CC66FF]/50 hover:bg-white/5"
                >
                  WHATSAPP
                </a>
              </motion.div>

              {/*
                La definicion, despues de los botones y plegada en telefono.

                Estaba antes de ellos y empujaba «Cotizar» fuera de la primera
                pantalla: quien ya sabe lo que quiere tenia que leerse un
                parrafo de 400 caracteres para encontrar el boton.

                No se quita —sigue en la pagina y sigue en el HTML— porque es
                lo que responde «que es esto» a quien llega sin saberlo y lo que
                un asistente de IA puede citar. Y porque a los buscadores ya les
                llega por render.php, que les sirve su propio HTML con esta
                definicion como PRIMER parrafo bajo el h1: ahi no la movimos ni
                un milimetro. Dejarla solo ahi seria servir una cosa al robot y
                otra a la persona, que es justo lo que no se hace; aqui esta
                para los dos, solo que sin tapar la puerta.

                En telefono se recorta a tres renglones con un boton que la
                abre. El texto esta en el DOM completo desde el primer momento:
                lo recorta el CSS, no se esconde.
              */}
              {ficha.definicion && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.26 }}
                  className="mt-10 max-w-2xl border-l-2 border-white/12 pl-4"
                >
                  <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[.2em] text-white/30">
                    {tEnc('definicion_sello', 'Qué es')}
                  </p>
                  <p
                    className={`text-[14.5px] leading-relaxed text-white/55 ${
                      abierto ? '' : 'line-clamp-3 md:line-clamp-none'
                    }`}
                  >
                    {ficha.definicion}
                  </p>
                  <button
                    onClick={() => setAbierto((v) => !v)}
                    className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-white/45 transition-colors hover:text-white md:hidden"
                  >
                    {abierto ? tEnc('definicion_menos', 'Leer menos') : tEnc('definicion_mas', 'Leer más')}
                    <Plus
                      size={12}
                      className={`transition-transform duration-300 ${abierto ? 'rotate-45' : ''}`}
                    />
                  </button>
                </motion.div>
              )}
            </div>
          </section>

          {ficha.trasPortada}

          {/* ---------- ZONA 1 · QUÉ INCLUYE (bento asimétrico) ---------- */}
          {ficha.incluye.length > 0 && (
            <section className="px-4 pb-16 md:pb-24">
              <div className="container mx-auto max-w-6xl">
                <motion.h2 {...entra()} className="heading mb-10 text-3xl md:text-5xl">
                  {tEnc('inc_1', 'QUÉ')}{' '}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                  >
                    {tEnc('inc_2', 'INCLUYE')}
                  </span>
                </motion.h2>

                <div className="grid gap-4 md:grid-cols-3">
                  {ficha.incluye.map((f, i) => (
                    <motion.div
                      key={i}
                      {...entra(Math.min(i * 0.06, 0.4))}
                      /* La primera ocupa el doble: rompe la rejilla uniforme
                         que hacia que todo pesara igual. */
                      className={i === 0 ? 'md:col-span-2' : ''}
                    >
                      <div
                        className="group h-full rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CC66FF]/40"
                        style={{
                          background:
                            i === 0
                              ? 'linear-gradient(150deg, rgba(119,0,206,.22), rgba(255,255,255,.02) 60%)'
                              : 'rgba(255,255,255,.035)',
                        }}
                      >
                        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                          <Check size={17} className="text-[#CC66FF]" strokeWidth={2.4} />
                        </span>
                        {esFrase(f) ? (
                          <p
                            className={`leading-relaxed text-white/85 ${
                              i === 0 ? 'text-lg md:text-xl' : 'text-[15px]'
                            }`}
                          >
                            {f}
                          </p>
                        ) : (
                          <>
                            <p
                              className={`font-semibold leading-snug text-white ${
                                i === 0 ? 'text-lg md:text-xl' : 'text-[15.5px]'
                              }`}
                            >
                              {f.titulo}
                            </p>
                            {f.texto && (
                              <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{f.texto}</p>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ---------- LO QUE GANAS, SOBRE BLANCO ----------
          Sube aquí desde el final. Después de ver qué se compra, lo
          siguiente que decide una venta es qué se gana; el corte a blanco
          lo separa del resto sin necesitar un título más grande. */}
      {ficha.beneficios.length > 0 && (
        <section className="bg-white px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-5xl">
            <motion.h2 {...entra()} className="heading mb-3 text-3xl text-[#0A0A0A] md:text-5xl">
              {tEnc('ben_1', 'LO QUE')} <span className="text-[#7700CE]">{tEnc('ben_2', 'GANAS')}</span>
            </motion.h2>
            <motion.p {...entra(0.06)} className="mb-12 max-w-xl text-[#0A0A0A]/60">
              {ficha.beneficiosBajada || tEnc('ben_bajada', 'Para qué sirve, en concreto.')}
            </motion.p>

            <div className="grid gap-5 sm:grid-cols-2">
              {ficha.beneficios.map((b, i) => (
                <motion.div key={i} {...entra(i * 0.08)} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7700CE]/12">
                    <Check size={16} className="text-[#7700CE]" strokeWidth={2.6} />
                  </span>
                  {esFrase(b) ? (
                    <p className="text-[16px] leading-relaxed text-[#0A0A0A]/80">{b}</p>
                  ) : (
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold leading-snug text-[#0A0A0A]">{b.titulo}</p>
                      {b.texto && (
                        <p className="mt-1 text-[15px] leading-relaxed text-[#0A0A0A]/65">
                          {b.nota && (
                            <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[.16em] text-[#0A0A0A]/40">
                              {b.nota}
                            </span>
                          )}
                          {b.texto}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="relative bg-[#07060B]">
        <div className="relative z-10">
          {/* ---------- ZONA 2 · EL PROCESO ---------- */}
          <RecorridoProceso
            slug={ficha.slug}
            pasos={ficha.proceso}
            sello={tEnc('proceso_sello', 'Proceso comprobado')}
            titulo={
              <>
                {tEnc('proceso_1', 'NUESTRO')}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                >
                  {tEnc('proceso_2', 'PROCESO')}
                </span>
              </>
            }
          />
        </div>
      </div>

      <div className="relative bg-[#07060B]">
        {ficha.trasProceso}

        {/* ---------- ZONA 4 · IDEAL PARA ---------- */}
        {ficha.ideal.length > 0 && (
          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-5xl">
              <motion.h2 {...entra()} className="heading mb-10 text-3xl md:text-5xl">
                {tEnc('ideal_1', 'IDEAL')}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
                >
                  {tEnc('ideal_2', 'PARA')}
                </span>
              </motion.h2>
              <div className="flex flex-col gap-3">
                {ficha.ideal.map((item, i) => (
                  <motion.div
                    key={i}
                    {...entra(i * 0.07)}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5 transition-colors hover:border-[#CC66FF]/30"
                  >
                    <span className="heading mt-0.5 shrink-0 text-sm text-[#CC66FF]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[15.5px] leading-relaxed text-white/80">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ---------- EL FONDO DEL ASUNTO, PLEGADO ----------
          Esto abría la página y era un error: nadie lee cuatrocientas
          palabras antes de saber qué le están vendiendo. Baja aquí, donde
          quien llegó ya sabe qué se compra y qué gana, y va cerrado: quien
          quiere el detalle lo abre. En un <details>, que se indexa igual
          porque el contenido está en el DOM. */}
      {ficha.fondo.length > 0 && (
        <section className="px-4 pb-16 md:pb-24">
          <div className="container mx-auto max-w-5xl">
            <details className="group border-t border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 transition-colors duration-200 hover:text-white [&::-webkit-details-marker]:hidden">
                <span className="heading text-xl text-white/85 md:text-2xl">
                  {tEnc('fondo_1', 'EL FONDO')}{' '}
                  <span className="text-[#CC66FF]">{tEnc('fondo_2', 'DEL ASUNTO')}</span>
                </span>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-200 group-open:rotate-45 group-open:border-[#CC66FF]/45 group-open:text-[#CC66FF]">
                  <Plus size={17} />
                </span>
              </summary>
              <div className="grid gap-6 pb-2 md:grid-cols-2 md:gap-10">
                {ficha.fondo.map((p, i) => (
                  <p key={i} className="text-[15px] leading-[1.8] text-white/55">
                    {esFrase(p) ? (
                      p
                    ) : (
                      <>
                        <strong className="font-semibold text-white/80">{conPunto(p.titulo)}</strong>{' '}
                        {p.texto}
                      </>
                    )}
                  </p>
                ))}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* ---------- ZONA 6 · FAQ Y CIERRE, SOBRE BLANCO ---------- */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          {ficha.faq.length > 0 && (
            <>
              <motion.h2 {...entra()} className="heading mb-10 text-center text-3xl text-[#0A0A0A] md:text-5xl">
                {tEnc('faq_1', 'PREGUNTAS')} <span className="text-[#7700CE]">{tEnc('faq_2', 'FRECUENTES')}</span>
              </motion.h2>

              <div className="mb-20 divide-y divide-[#0A0A0A]/10 border-y border-[#0A0A0A]/10">
                {ficha.faq.map((item, i) => (
                  <motion.div key={i} {...entra(Math.min(i * 0.06, 0.35))} className="py-6">
                    <h3 className="heading mb-2.5 text-lg leading-snug text-[#0A0A0A] md:text-xl">{item.question}</h3>
                    <p className="max-w-3xl text-[15.5px] leading-relaxed text-[#0A0A0A]/70">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/*
            El título se mide contra el ancho del recuadro, no contra la
            ventana. «¿LISTO PARA AUTOMATIZAR?» —el cierre de las páginas de
            IA— se salía 58 px a 375 de ancho: «AUTOMATIZAR?» ocupa unos 10.7 px
            por cada px de cuerpo en Hanson, y a 30 px no cabe en un teléfono.
            A 9cqw la palabra más ancha usa como mucho el 96 % del recuadro, y
            el tope de 36 px es el tamaño de siempre en escritorio.
          */}
          <motion.div
            {...entra()}
            className="relative overflow-hidden rounded-3xl p-7 text-center sm:p-10 md:p-14"
            style={{ background: 'linear-gradient(140deg,#7700CE,#9933FF)', containerType: 'inline-size' }}
          >
            <h2
              className="heading mb-4 leading-tight text-white"
              style={{ fontSize: 'clamp(20px, 9cqw, 36px)' }}
            >
              {ficha.cierre.titulo}
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-white/85">{ficha.cierre.texto}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={cotizar}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#7700CE] transition-transform hover:scale-[1.03]"
              >
                {ficha.cierre.boton || ficha.boton}
                <ArrowRight size={17} />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                WHATSAPP
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
