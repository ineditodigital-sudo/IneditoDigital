import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';
import { pasosDelMetodo, diagnosticoDelMetodo, otrosServicios } from '../data/metodo';

/* Entrada estandar del sitio: aparecer subiendo, una sola vez. */
const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay: retraso },
});

/*
 * /servicios cuenta el mismo método que el menú (data/metodo.ts), con espacio
 * para explicarlo.
 *
 * Hasta el 23-sep era un catálogo: «¿En qué punto estás?» con tres niveles y
 * debajo las fichas revueltas, la especialidad junto a los productos sueltos.
 * Se leía como una agencia que hace de todo. Ahora va así:
 *
 *   1. Portada, con los dos botones de siempre.
 *   2. Los tres pasos: qué gana el cliente, con qué se mide y los servicios
 *      de cada uno. Los nombres salen de Marca › Menú de servicios, así que el
 *      menú y la página no pueden contar historias distintas.
 *   3. Empieza aquí: el diagnóstico, que dice por cuál paso empezar (lo que
 *      antes intentaban resolver los niveles).
 *   4. Complementos: lo que sigue publicado pero no es el método.
 *
 * render.php arma lo mismo, en el mismo orden, para quien no ejecuta
 * JavaScript.
 */
export default function ServicesPage() {
  const t = contenido('servicios', 'encabezado');
  const tMet = contenido('servicios', 'metodo');
  const tOtr = contenido('servicios', 'otros');
  const tTar = contenido('servicios', 'tarjeta');
  const { services, settings, openAssistant } = useApp();
  const pasos = pasosDelMetodo();
  const diag = diagnosticoDelMetodo();
  const complementos = otrosServicios(services);
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    'Hola, vi sus servicios y quiero saber cuál me conviene'
  )}`;

  /* Lo que gana el cliente en cada paso y con qué se mide, en el orden de
     pasosDelMetodo(). */
  const detalle = [
    {
      texto: tMet('p1_texto', 'Cuando alguien busca lo que vendes —en Google, en Maps o preguntándole a ChatGPT—, tu negocio aparece, se ve serio y dice lo correcto.'),
      mide: tMet('p1_mide', 'En qué búsquedas apareces, cuántas visitas llegan y si los asistentes de IA te mencionan.'),
    },
    {
      texto: tMet('p2_texto', 'Quien te encuentra tiene por dónde escribirte y nadie se queda esperando: un agente de IA contesta a cualquier hora y le pasa el prospecto a una persona de tu equipo.'),
      mide: tMet('p2_mide', 'Cuántos prospectos llegan, por qué canal y en cuánto tiempo reciben respuesta.'),
    },
    {
      texto: tMet('p3_texto', 'La publicidad se invierte donde se puede medir, y cada campaña se juzga por los prospectos que trae, no por los clics.'),
      mide: tMet('p3_mide', 'Cuánto cuesta cada prospecto y, cuando tu sistema lo permite, qué ventas cerró cada canal, en un solo tablero.'),
    },
  ];
  const palabraPaso = tMet('paso', 'Paso');
  const seMide = tMet('se_mide', 'Se mide');
  const verMas = tTar('ver_mas', 'Ver detalles');

  return (
    <>
      <SEO
        title="Servicios · Agencia de marketing digital y publicidad en Aguascalientes"
        description="Marketing digital y publicidad en Aguascalientes, en tres pasos: que te encuentren, que te escriban y que te compren. Medido hasta la venta."
        keywords={['agencia de publicidad aguascalientes', 'agencia de mercadotecnia', 'servicios marketing digital', 'agencia de contenido digital', 'seo aguascalientes']}
      />

      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-16 max-w-3xl text-center md:mb-20"
          >
            <h1 className="heading mb-6 text-4xl md:text-6xl">
              {t('titulo_1', 'NUESTROS')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#AA66FF)' }}
              >
                {t('titulo_2', 'SERVICIOS')}
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              {t('bajada', 'Marketing digital y publicidad para empresas de Aguascalientes: que te encuentren, que te escriban y que te compren. Todo medido hasta la venta.')}
            </p>

            {/*
              Los botones, dentro de la primera pantalla.

              Esta página no tenía ninguno. Lo primero que se podía tocar era
              una tarjeta de servicio a 920 px: en un teléfono, dos pantallas
              de scroll antes de encontrar una puerta. Y de las tres páginas
              con más visitas, es la única sin salida a WhatsApp.

              Van aquí y no al final a propósito: quien entra a «servicios»
              ya sabe que quiere algo, lo que no sabe es cuál.
            */}
            <p className="mt-8 text-sm text-white/55">
              {t('cta_gancho', '¿No sabes cuál te toca? Te lo decimos en 30 segundos.')}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => openAssistant(undefined, 'elegir el servicio correcto para mi empresa')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-transform hover:scale-[1.03]"
              >
                {t('cta_boton', 'COTIZAR AHORA')}
                <ArrowRight size={17} />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:border-[#CC66FF]/50 hover:bg-white/5"
              >
                {t('cta_wa', 'WHATSAPP')}
              </a>
            </div>
          </motion.div>

          {/* ------------------------------------------------ los tres pasos */}
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
              <motion.h2 {...entra()} className="mb-3 text-2xl md:text-3xl">
                {tMet('titulo', 'UN SISTEMA EN TRES PASOS')}
              </motion.h2>
              <motion.p {...entra(0.06)} className="leading-relaxed text-white/65">
                {tMet('bajada', 'Cada paso prepara el siguiente y se mide antes de dar el que sigue. Así sabes qué funciona antes de invertir más.')}
              </motion.p>
            </div>

            {pasos.map((p, i) => {
              const d = detalle[i];
              return (
                <section
                  key={p.numero}
                  aria-labelledby={`paso-${p.numero}`}
                  className="grid gap-8 border-t border-white/10 py-12 md:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
                >
                  <motion.div {...entra()}>
                    <div className="flex items-end gap-4">
                      {/* El número hueco, como en los niveles de la portada:
                          ordena sin competir con el título. */}
                      <span
                        aria-hidden="true"
                        className="heading text-6xl leading-[.8] text-transparent md:text-7xl"
                        style={{ WebkitTextStroke: '1.5px rgba(170,102,255,.55)' }}
                      >
                        {p.numero}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[.18em] text-white/45">
                        {palabraPaso} {p.numero}
                      </span>
                    </div>
                    <h3 id={`paso-${p.numero}`} className="mt-5 text-3xl leading-[1.05] md:text-4xl">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 font-semibold text-[#AA66FF]">{p.sub}</p>
                    {d?.texto && <p className="mt-4 text-[15.5px] leading-relaxed text-white/75">{d.texto}</p>}
                    {d?.mide && (
                      <div className="mt-6 rounded-xl border border-[#9933FF]/25 bg-[#7700CE]/10 px-4 py-3">
                        <div className="font-mono text-[10px] uppercase tracking-[.18em] text-[#CC66FF]">{seMide}</div>
                        <p className="mt-1 text-sm leading-snug text-white/85">{d.mide}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Los servicios del paso. Con un número impar, el último
                      ocupa las dos columnas en vez de quedar huérfano. */}
                  <div className="grid content-start gap-4 sm:grid-cols-2">
                    {p.items.map((it, j) => (
                      <motion.div
                        key={it.ruta}
                        {...entra(0.05 + j * 0.05)}
                        className={p.items.length % 2 === 1 && j === p.items.length - 1 ? 'sm:col-span-2' : undefined}
                      >
                        {/* En teléfono, flecha al lado y sin «Ver detalles»: la
                            tarjeta entera es el enlace, y con once apiladas esa
                            línea sumaba casi una pantalla de scroll. */}
                        <Link
                          to={it.ruta}
                          className="group flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4 transition-colors duration-200 hover:border-[#AA66FF]/45 hover:bg-white/[.06] sm:flex-col sm:items-stretch sm:gap-0 sm:p-5"
                        >
                          <div className="min-w-0 flex-1 sm:flex-none">
                            <div className="text-[17px] font-semibold leading-snug text-white">{it.titulo}</div>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{it.desc}</p>
                          </div>
                          <ArrowRight size={18} className="mt-0.5 shrink-0 text-[#AA66FF] sm:hidden" aria-hidden="true" />
                          <span className="mt-auto hidden items-center gap-1.5 pt-4 text-sm text-[#AA66FF] sm:inline-flex">
                            {verMas}
                            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* ------------------------------------------------ empieza aquí */}
            <motion.section
              {...entra()}
              className="relative mt-4 overflow-hidden rounded-3xl border border-[#9933FF]/30 px-6 py-10 md:px-12 md:py-14"
              style={{ background: 'linear-gradient(160deg, rgba(119,0,206,.30), rgba(119,0,206,.06) 70%)' }}
            >
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.18em] text-[#CC66FF]">
                <Sparkles size={13} />
                {diag.kicker}
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl">{diag.titulo}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{diag.texto}</p>
              <p className="mt-2 max-w-2xl leading-relaxed text-white/60">
                {tMet('diag_extra', 'No tienes que contratar los tres pasos: con el diagnóstico sabes por cuál empezar.')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={diag.ruta}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-[1.03]"
                >
                  {diag.boton}
                  <ArrowRight size={17} />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:border-[#CC66FF]/50 hover:bg-white/5"
                >
                  {t('cta_wa', 'WHATSAPP')}
                </a>
              </div>
            </motion.section>

            {/* ------------------------------------------------ complementos */}
            {complementos.length > 0 && (
              <section className="mt-20 md:mt-24">
                <motion.h2 {...entra()} className="text-2xl md:text-3xl">
                  {tOtr('titulo', 'COMPLEMENTOS')}
                </motion.h2>
                <motion.p {...entra(0.05)} className="mt-2 max-w-2xl leading-relaxed text-white/65">
                  {tOtr('bajada', 'Piezas que se suman a los tres pasos cuando tu negocio las necesita.')}
                </motion.p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {complementos.map((s, i) => (
                    <motion.div key={s.id} {...entra(Math.min(i * 0.04, 0.3))}>
                      <Link
                        to={`/servicios/${s.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-white/10 p-4 transition-colors duration-200 hover:border-[#AA66FF]/40 hover:bg-white/[.04]"
                      >
                        <div className="font-semibold leading-snug text-white/90 transition-colors group-hover:text-white">
                          {s.title}
                        </div>
                        <p className="mt-1 text-[13px] leading-snug text-white/55">{s.shortDescription}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-white/55">
                  {tOtr('cierre', '¿Buscas algo que no está aquí?')}{' '}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#CC66FF] transition-colors hover:text-white"
                  >
                    {tOtr('cierre_enlace', 'Pregúntanos por WhatsApp')} →
                  </a>
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
