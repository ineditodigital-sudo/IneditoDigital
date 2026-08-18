import { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Nfc,
  Smartphone,
  Zap,
  RefreshCw,
  Leaf,
  Sparkles as SparklesIcon,
  Check,
  ArrowLeft,
  Share2,
  Wallet,
  Palette,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import FAQAccordion from '../components/FAQAccordion';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';

/*
 * Identidad visual propia, distinta al resto del sitio a proposito:
 *
 *   Resto del sitio            Esta pagina
 *   -----------------------    ---------------------------------
 *   franjas blanco/oscuro      lienzo oscuro continuo
 *   titulos centrados con      eyebrow numerado + titulo grande
 *   una palabra en morado      alineado a la izquierda
 *   GlassCard redondeadas      paneles con hairline, radio corto
 *   CTA en bloque morado       CTA oscuro enmarcado
 *   TopographyCanvas/Floating  grid de puntos + aurora propia
 *
 * Lo que SI se mantiene: la paleta morada de marca, la tipografia Hanson
 * (.heading) y las animaciones.
 */

const SERVICE_NAME = 'Tarjetas de Presentación Digital NFC';

const specs = [
  { label: 'Compartir', value: 'Un toque' },
  { label: 'Apps que instalar', value: 'Ninguna' },
  { label: 'Actualizaciones', value: 'Ilimitadas' },
  { label: 'Entrega', value: '3–5 días' },
];

const includes = [
  { k: 'Chip NFC programado', v: 'Vinculado a tu perfil digital, listo para usar' },
  { k: 'Diseño personalizado', v: 'Tu marca, logo y colores sobre la tarjeta física' },
  { k: 'Perfil digital propio', v: 'Contacto, redes y portafolio siempre en línea' },
  { k: 'Ediciones ilimitadas', v: 'Cambia tu información sin reimprimir nada' },
  { k: 'Compatibilidad total', v: 'Android e iPhone desde el modelo 7, sin apps' },
  { k: 'Wallet', v: 'Se guarda en Apple Wallet y Google Wallet' },
];

const benefits = [
  { icon: Zap, title: 'Comparte en segundos', description: 'Un toque y tu contacto queda guardado en el teléfono de la otra persona, sin escribir nada a mano.' },
  { icon: RefreshCw, title: 'Siempre actualizada', description: 'Cambia tu teléfono, correo o redes cuando quieras: la tarjeta física nunca cambia, el contenido sí.' },
  { icon: Leaf, title: 'Cero reimpresiones', description: 'Olvídate de tirar cajas de tarjetas viejas cada vez que cambia un dato.' },
  { icon: SparklesIcon, title: 'Imagen profesional', description: 'Sorprende en cada reunión y networking con una experiencia moderna y memorable.' },
];

const idealFor = [
  'Emprendedores y freelancers que hacen networking constantemente',
  'Equipos comerciales que comparten contacto y portafolio al vuelo',
  'Consultores y profesionales que actualizan su información con frecuencia',
  'Empresas que quieren reforzar su imagen de marca en cada interacción',
  'Agentes inmobiliarios, asesores y vendedores en eventos y ferias',
];

const howItWorks = [
  { step: 1, icon: Palette, title: 'Diseño', description: 'Creamos tu tarjeta con tu marca, foto, redes y portafolio.' },
  { step: 2, icon: Cpu, title: 'Programación', description: 'Configuramos el chip NFC y lo vinculamos a tu perfil digital.' },
  { step: 3, icon: Nfc, title: 'Un toque', description: 'Acercas la tarjeta al celular y comparte todo al instante.' },
  { step: 4, icon: RefreshCw, title: 'Actualiza', description: 'Cambia tu información desde tu perfil, sin reimprimir.' },
];

const faqItems = [
  { q: '¿Necesito instalar una aplicación para usarla?', a: 'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.' },
  { q: '¿Qué pasa si cambio de número o de trabajo?', a: 'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.' },
  { q: '¿Qué información puedo compartir?', a: 'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.' },
  { q: '¿Cuánto tarda la entrega?', a: 'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.' },
];

/** Etiqueta numerada de sección. Reemplaza el título centrado del resto del sitio. */
function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[#CC66FF] text-[11px] tracking-[0.35em] font-bold">{index}</span>
      <span className="h-px w-8 bg-[#9933FF]/40" />
      <span className="text-white/40 text-[11px] tracking-[0.35em] uppercase">{children}</span>
    </div>
  );
}

/** Fondo propio: grid de puntos + aurora lenta. Sustituye a TopographyCanvas. */
function CanvasBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />
      <motion.div
        className="absolute -top-1/3 left-1/4 w-[36rem] h-[36rem] rounded-full bg-[#7700CE]/20 blur-[130px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/3 right-1/5 w-[30rem] h-[30rem] rounded-full bg-[#9933FF]/15 blur-[130px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/** Animación ambiental: la tarjeta "toca" el teléfono en loop y emite ondas NFC. */
function NfcTapAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            className="absolute rounded-full border border-[#9933FF]/50"
            style={{ width: 90, height: 90 }}
            animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}

        <motion.div
          className="absolute right-2 sm:right-6 w-24 h-44 sm:w-28 sm:h-52 rounded-[1.75rem] bg-white/[0.04] border border-white/15 backdrop-blur-sm flex items-center justify-center"
          animate={{ boxShadow: ['0 0 0px rgba(153,51,255,0)', '0 0 45px rgba(153,51,255,0.45)', '0 0 0px rgba(153,51,255,0)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Smartphone className="text-white/30" size={30} />
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-[#CC66FF] text-[9px] font-bold text-black whitespace-nowrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 6] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.55, 0.65, 0.9, 1] }}
          >
            <Check size={11} strokeWidth={3} />
            CONTACTO GUARDADO
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-2 sm:left-6 w-32 h-20 sm:w-36 sm:h-24 rounded-lg bg-gradient-to-br from-[#7700CE] to-[#9933FF] shadow-[0_10px_40px_rgba(119,0,206,0.45)] flex flex-col justify-between p-3 overflow-hidden"
          animate={{ x: [0, 58, 0], y: [0, -6, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-between">
            <div className="w-4 h-3 rounded-sm bg-white/30" />
            <Nfc className="text-white/80" size={16} />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-16 rounded-full bg-white/50" />
            <div className="h-1.5 w-10 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Tarjeta producto con barrido holográfico: material metálico, propio de una tarjeta NFC. */
function HoloCard() {
  return (
    <motion.div
      initial={{ rotate: -7, opacity: 0, y: 20 }}
      whileInView={{ rotate: -7, opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ rotate: 0, scale: 1.04 }}
      transition={{ duration: 0.6 }}
      className="relative w-[19rem] h-[11.5rem] sm:w-[22rem] sm:h-[13rem] rounded-xl bg-gradient-to-br from-[#5500AA] via-[#7700CE] to-[#9933FF] shadow-[0_25px_70px_rgba(119,0,206,0.45)] p-6 flex flex-col justify-between overflow-hidden"
    >
      {/* Barrido holográfico en loop */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 45%, rgba(204,102,255,0.5) 55%, transparent 70%)',
          mixBlendMode: 'overlay',
        }}
        animate={{ x: ['-120%', '120%'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
      />
      {/* Textura de circuito sutil */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="w-10 h-7 rounded bg-gradient-to-br from-white/50 to-white/20 border border-white/20" />
        <motion.div
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Nfc className="text-white" size={26} />
        </motion.div>
      </div>

      <div className="relative">
        <div className="heading text-white text-xl mb-1 tracking-wide">TU NOMBRE</div>
        <div className="text-white/65 text-[10px] uppercase tracking-[0.22em]">Tu puesto · Tu empresa</div>
      </div>

      <div className="relative flex items-center gap-1.5 text-white/55 text-[10px]">
        <Share2 size={11} />
        <span>Toca para compartir</span>
      </div>
    </motion.div>
  );
}

export default function TarjetasDigitalesPage() {
  const { openAssistant } = useApp();
  const cta = () => openAssistant(SERVICE_NAME, 'cotizar tarjetas de presentación digital NFC');

  return (
    <>
      <DynamicSEO
        title="Tarjetas de Presentación Digital NFC - INÉDITO DIGITAL"
        description="Tarjetas de presentación digitales con tecnología NFC. Comparte tu contacto, redes y portafolio con un solo toque, sin apps y siempre actualizadas."
        keywords={['tarjeta de presentacion digital', 'tarjeta nfc', 'tarjeta de presentacion nfc aguascalientes', 'business card nfc', 'tarjeta digital de contacto']}
      />

      {/* Lienzo oscuro continuo: sin franjas blancas, a diferencia del resto del sitio */}
      <div className="relative bg-[#07060B]">
        <CanvasBackdrop />

        <div className="relative z-10">
          {/* HERO */}
          <section className="px-4 pt-28 pb-16 md:pt-36 md:pb-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] rounded-md border border-[#9933FF]/40 bg-[#9933FF]/10 text-[#CC66FF] font-bold tracking-[0.2em]">
                      <Nfc size={13} />
                      NFC
                    </span>
                    <span className="text-white/30 text-[11px] tracking-[0.3em] uppercase">Soluciones</span>
                  </div>

                  <h1 className="heading mb-6 text-white leading-[1.05]">
                    TU TARJETA DE<br />
                    PRESENTACIÓN,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9933FF] to-[#CC66FF]">AHORA DIGITAL</span>
                  </h1>

                  <p className="text-base md:text-lg text-white/55 max-w-lg mb-10 leading-relaxed">
                    Comparte tu contacto, redes sociales y portafolio con un solo toque. Sin imprimir, sin apps, siempre al día.
                  </p>

                  <div className="flex flex-wrap items-center gap-5">
                    <button
                      onClick={cta}
                      className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-white text-black hover:bg-[#CC66FF] transition-colors cursor-pointer"
                    >
                      <span className="heading text-sm tracking-[0.08em]">COTIZAR MI TARJETA</span>
                      <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link to="/servicios" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
                      <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                      <span>Volver a servicios</span>
                    </Link>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                  <NfcTapAnimation />
                </motion.div>
              </div>
            </div>
          </section>

          {/* FICHA RÁPIDA — tira con hairlines, no franja blanca */}
          <section className="px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-white/10">
                {specs.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={[
                      'py-7 px-5 border-white/10',
                      // movil: rejilla 2x2 -> borde derecho en la columna izquierda,
                      // borde inferior en la fila de arriba
                      i % 2 === 0 ? 'border-r' : '',
                      i < 2 ? 'border-b' : '',
                      // escritorio: una sola fila de 4 -> solo separadores verticales
                      'md:border-b-0',
                      i < 3 ? 'md:border-r' : 'md:border-r-0',
                    ].join(' ')}
                  >
                    <div className="text-white/35 text-[10px] tracking-[0.25em] uppercase mb-2">{s.label}</div>
                    <div className="heading text-xl md:text-2xl text-white">{s.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 01 — CÓMO FUNCIONA */}
          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-7xl">
              <Eyebrow index="01">Cómo funciona</Eyebrow>
              <h2 className="heading text-2xl md:text-4xl text-white mb-12 max-w-2xl leading-tight">
                De la idea a tu primer contacto compartido
              </h2>

              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                {howItWorks.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-[#07060B] p-7 hover:bg-[#0C0A12] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="heading text-4xl text-white/[0.07] group-hover:text-[#9933FF]/25 transition-colors">
                        {step.step.toString().padStart(2, '0')}
                      </span>
                      <step.icon className="text-[#9933FF]" size={20} />
                    </div>
                    <h3 className="heading text-base text-white mb-2">{step.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#9933FF] to-transparent group-hover:w-full transition-all duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 02 — LA TARJETA (momento producto) */}
          <section className="px-4 py-16 md:py-24 border-t border-white/10">
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-14 items-center">
                <div className="flex justify-center order-first lg:order-last py-8">
                  <HoloCard />
                </div>

                <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <Eyebrow index="02">La tarjeta</Eyebrow>
                  <h2 className="heading text-2xl md:text-4xl text-white mb-6 leading-tight">
                    Tu marca, en un objeto que la gente quiere tocar
                  </h2>
                  <p className="text-white/55 text-base leading-relaxed mb-8">
                    Una tarjeta física con acabado premium y un chip NFC dentro. El diseño lo hacemos con tu identidad;
                    el contenido que comparte lo cambias tú, cuando quieras, sin volver a imprimir.
                  </p>
                  <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-md border border-white/10 bg-white/[0.02]">
                    <Wallet className="text-[#CC66FF]" size={17} />
                    <span className="text-white/60 text-sm">Compatible con Apple Wallet y Google Wallet</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* 03 — QUÉ INCLUYE (ficha técnica con hairlines, no tarjetas) */}
          <section className="px-4 py-16 md:py-24 border-t border-white/10">
            <div className="container mx-auto max-w-5xl">
              <Eyebrow index="03">Qué incluye</Eyebrow>
              <h2 className="heading text-2xl md:text-4xl text-white mb-12 leading-tight">Todo lo que viene contigo</h2>

              <div className="divide-y divide-white/10 border-t border-b border-white/10">
                {includes.map((item, i) => (
                  <motion.div
                    key={item.k}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group grid md:grid-cols-[1.5fr_2fr] gap-2 md:gap-8 py-5 hover:bg-white/[0.02] transition-colors px-2"
                  >
                    <div className="flex items-center gap-3">
                      <Check className="text-[#9933FF] flex-shrink-0" size={15} strokeWidth={3} />
                      <span className="heading text-sm md:text-base text-white">{item.k}</span>
                    </div>
                    <span className="text-white/45 text-sm md:text-base pl-[26px] md:pl-0">{item.v}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 04 — BENEFICIOS */}
          <section className="px-4 py-16 md:py-24 border-t border-white/10">
            <div className="container mx-auto max-w-7xl">
              <Eyebrow index="04">Beneficios</Eyebrow>
              <h2 className="heading text-2xl md:text-4xl text-white mb-12 leading-tight max-w-2xl">
                Por qué conviene más que una tarjeta impresa
              </h2>

              <div className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group bg-[#07060B] p-7 md:p-9 hover:bg-[#0C0A12] transition-colors"
                  >
                    <div className="w-11 h-11 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center mb-5 group-hover:border-[#9933FF]/40 transition-colors">
                      <b.icon className="text-[#9933FF]" size={19} />
                    </div>
                    <h3 className="heading text-base md:text-lg text-white mb-2">{b.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{b.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 05 — IDEAL PARA */}
          <section className="px-4 py-16 md:py-24 border-t border-white/10">
            <div className="container mx-auto max-w-5xl">
              <Eyebrow index="05">Ideal para</Eyebrow>
              <h2 className="heading text-2xl md:text-4xl text-white mb-10 leading-tight">Para quién tiene más sentido</h2>

              <div className="space-y-px bg-white/10 border border-white/10">
                {idealFor.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="group flex items-center gap-4 bg-[#07060B] px-5 py-4 hover:bg-[#0C0A12] transition-colors"
                  >
                    <span className="text-[#9933FF]/40 text-[11px] tracking-[0.2em] font-bold w-6 flex-shrink-0">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-white/60 text-sm md:text-base group-hover:text-white/90 transition-colors">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 06 — PREGUNTAS */}
          <section className="px-4 py-16 md:py-24 border-t border-white/10">
            <div className="container mx-auto max-w-4xl">
              <Eyebrow index="06">Preguntas</Eyebrow>
              <h2 className="heading text-2xl md:text-4xl text-white mb-10 leading-tight">Lo que suelen preguntarnos</h2>
              <FAQAccordion items={faqItems} variant="dark" />
            </div>
          </section>

          {/* CTA FINAL — enmarcado oscuro, no bloque morado */}
          <section className="px-4 pb-24 pt-8">
            <div className="container mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <motion.div
                  className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#7700CE]/25 blur-[100px]"
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative z-10 p-8 md:p-14 text-center">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex mb-6"
                  >
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_40px_rgba(119,0,206,0.45)]">
                      <Nfc className="text-white" size={26} />
                    </div>
                  </motion.div>

                  <h2 className="heading text-2xl md:text-4xl mb-4 text-white leading-tight">
                    ¿Listo para modernizar tu tarjeta?
                  </h2>
                  <p className="text-white/50 text-sm md:text-base mb-8 max-w-xl mx-auto">
                    Cotiza tu tarjeta de presentación digital NFC y empieza a compartir tu contacto con un solo toque.
                  </p>
                  <button
                    onClick={cta}
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-md bg-white text-black hover:bg-[#CC66FF] transition-colors cursor-pointer"
                  >
                    <span className="heading text-sm tracking-[0.08em]">COTIZAR AHORA</span>
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
