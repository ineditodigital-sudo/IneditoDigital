import { motion } from 'motion/react';
import { ShoppingCart, TrendingUp, MessageCircle, Package, Zap, ArrowRight, Sparkles, CheckCircle2, ArrowLeft, Heart, DollarSign, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import { TopoLineas } from '../components/TopoLineas';
import { RecorridoProceso } from '../components/RecorridoProceso';
import { EscenaEcommerce } from '../components/EscenasServicioIA';
import FAQAccordion from '../components/FAQAccordion';
import Floating3DElements from '../components/Floating3DElements';
import SectionDivider from '../components/SectionDivider';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

export default function AIEcommercePage() {
  const { openAssistant } = useApp();
  const t = contenido('servicios-ia-ecommerce', 'portada');
  const tC = contenido('servicios-ia-ecommerce', 'cierre');
  const tInc = contenido('servicios-ia-ecommerce', 'incluye');
  const tBen = contenido('servicios-ia-ecommerce', 'beneficios');
  const tHow = contenido('servicios-ia-ecommerce', 'como_funciona');
  const tIde = contenido('servicios-ia-ecommerce', 'ideal_para');
  const tImg = contenido('servicios-ia-ecommerce', 'imagenes');
  const tNav = contenido('servicios-ia-ecommerce', 'navegacion');
  const tCtx = contenido('servicios-ia-ecommerce', 'contexto');
  const tFaq = contenido('servicios-ia-ecommerce', 'faq');

  // Imágenes para las diferentes secciones
  const sectionImages = {
    hero: tImg('hero', 'https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBvbmxpbmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3Njc3MjEzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    features: tImg('features', 'https://images.unsplash.com/photo-1648544365218-188e3d07dcac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGJhZ3MlMjByZXRhaWx8ZW58MXx8fHwxNzY3Njc2NDc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    support: tImg('support', 'https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc2NzYxNjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    growth: tImg('growth', 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    cta: tImg('cta', 'https://images.unsplash.com/photo-1603219950587-b4f3f7ee87e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NzcwOTAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')
  };

  const benefits = [
    { icon: ShoppingCart, title: tBen('b1_titulo', 'Recuperación de Carrito'), description: tBen('b1_texto', 'Identifica compradores que abandonaron y los contacta automáticamente con ofertas personalizadas.') },
    { icon: Heart, title: tBen('b2_titulo', 'Recomendaciones Inteligentes'), description: tBen('b2_texto', 'Sugiere productos complementarios en el momento exacto para aumentar el ticket promedio.') },
    { icon: MessageCircle, title: tBen('b3_titulo', 'Soporte Automático 24/7'), description: tBen('b3_texto', 'Resuelve dudas de producto, inventario, envíos y devoluciones sin intervención humana.') },
    { icon: DollarSign, title: tBen('b4_titulo', 'Más Ventas, Menos Fricción'), description: tBen('b4_texto', 'Reduce abandono de compra con asistencia en tiempo real durante todo el proceso.') },
  ];


  const idealFor = [
    tIde('i1', 'Tiendas online con más de 100 visitas diarias que necesitan vender más'),
    tIde('i2', 'Marcas propias (DTC) enfocadas en reducir costo de adquisición'),
    tIde('i3', 'Shopify Stores con instalación en minutos sin código'),
    tIde('i4', 'WooCommerce optimizado para WordPress con plugin nativo'),
    tIde('i5', 'Vendedores en marketplaces que quieren su propia tienda'),
    tIde('i6', 'Negocios de dropshipping que buscan automatizar atención'),
  ];


  const features = [
    tInc('f1', 'Chat inteligente que guía desde duda hasta compra'),
    tInc('f2', 'Upsell y cross-sell automático en momento ideal'),
    tInc('f3', 'Personalización 1:1 basada en comportamiento'),
    tInc('f4', 'Automatización de emails activados por acciones'),
    tInc('f5', 'Análisis predictivo de inventario y tendencias'),
    tInc('f6', 'Integración con Shopify, WooCommerce, Magento y más'),
  ];


  const howItWorks = [
    { step: 1, title: tHow('p1_titulo', 'Instalación'), description: tHow('p1_texto', 'Conectamos la IA a tu tienda en minutos, sin código.') },
    { step: 2, title: tHow('p2_titulo', 'Entrenamiento'), description: tHow('p2_texto', 'La IA aprende tu catálogo, políticas y tono de voz.') },
    { step: 3, title: tHow('p3_titulo', 'Automatización'), description: tHow('p3_texto', 'Empieza a asistir, recomendar y recuperar carritos.') },
    { step: 4, title: tHow('p4_titulo', 'Optimización'), description: tHow('p4_texto', 'Mejora continua basada en conversiones reales.') },
  ];


  return (
    <>
      <DynamicSEO
        title="IA para E-commerce y Retail - INÉDITO DIGITAL"
        description="Convierte más visitas en ventas. Asistente inteligente de IA dentro de tu tienda online que recupera carritos, recomienda productos y automatiza soporte 24/7."
        keywords={['ia ecommerce', 'chatbot tienda online', 'recuperación carrito', 'shopify ia', 'woocommerce ia', 'automatización ecommerce', 'ventas online ia']}
      />

      {/* Hero Banner con Imagen de Fondo */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* El fondo de la casa, no una foto de archivo. Las paginas de
            servicio ya usan estas lineas; la foto del señor en traje era
            lo unico que delataba que estas cuatro venian de otra
            plantilla. */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <TopoLineas className="h-full w-full" />
          {/* La misma atmósfera de las páginas de servicio: rejilla de puntos
              enmascarada y dos manchas que derivan. Es lo que le daba
              profundidad al encabezado y aquí no estaba. */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.5) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(ellipse 75% 45% at 50% 20%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 45% at 50% 20%, black, transparent)',
            }}
          />
          <motion.div
            className="absolute -top-1/4 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[#7700CE]/20 blur-[130px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-1/4 right-0 h-[24rem] w-[24rem] rounded-full bg-[#9933FF]/14 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-20 px-4 text-center py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#7700CE]/30 border border-[#7700CE]/50 backdrop-blur-xl text-[#CC66FF] font-bold mb-4">
              {t('etiqueta', 'IA PARA E-COMMERCE')}
            </span>
            
            <h1 className="heading mb-3 md:mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
              {t('titulo', 'CONVIERTE MÁS VISITAS EN VENTAS')}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('bajada', 'Asistente inteligente dentro de tu tienda que recupera carritos, recomienda productos y atiende 24/7.')}
            </p>

            <Link 
              to="/servicios-ia" 
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>{tNav('volver', 'Volver a Servicios IA')}</span>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      <div className="bg-black">
        {/* DE QUÉ SE TRATA — la definición al lado de la esfera.
            Aquí había trescientas palabras en dos columnas, que es lo primero
            que veía alguien después del titular. Y la escena es de ESTE
            servicio: el carrito abandonado que vuelve. Una esfera de
            red generica decia «inteligencia artificial» y nada mas. */}
        <section className="px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <span className="mb-6 block h-[3px] w-16 bg-[#9933FF]" />
                <p className="text-[19px] leading-[1.55] text-white/90 md:text-[24px]">
                  {tCtx('definicion', '')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative order-first lg:order-last"
              >
                <EscenaEcommerce />
              </motion.div>
            </div>
          </div>
        </section>

        {/* QUÉ INCLUYE */}
        <section className="px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-6xl">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading mb-8 text-2xl md:text-4xl">
                  {tInc('titulo_1', 'QUÉ')} <span className="text-[#CC66FF]">{tInc('titulo_2', 'INCLUYE')}</span>
                </h2>
                {/* A dos columnas: seis renglones seguidos a todo el ancho
                    dejaban una linea de texto de treinta centimetros. */}
                {/* La rejilla asimétrica de las páginas de servicio: la
                    primera ocupa el doble y rompe que las seis pesen igual. */}
                <div className="grid gap-4 md:grid-cols-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 5) * 0.06 }}
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
                          <CheckCircle2 size={17} className="text-[#CC66FF]" strokeWidth={2.2} />
                        </span>
                        <p className={`leading-relaxed text-white/85 ${i === 0 ? 'text-lg md:text-xl' : 'text-[15px]'}`}>
                          {feature}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        {tBen.visible() && (
        <section className="bg-white px-4 py-14 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading mb-8 text-2xl text-[#0A0A0A] md:text-4xl">
                  {tBen('titulo_1', 'BENEFICIOS')} <span className="text-[#7700CE]">{tBen('titulo_2', 'PRINCIPALES')}</span>
                </h2>
                {/* Sobre blanco, con el icono en un disco y sin caja: es la
                    ZONA 3 de las páginas de servicio, y es el respiro claro
                    que parte la página en dos. */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 5) * 0.07 }}
                      className="flex items-start gap-4"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7700CE]/12">
                        <benefit.icon size={17} className="text-[#7700CE]" strokeWidth={2.2} />
                      </span>
                      <div>
                        <h3 className="heading mb-1 text-base text-[#0A0A0A] md:text-lg">{benefit.title}</h3>
                        <p className="text-[15px] leading-relaxed text-[#0A0A0A]/65">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        )}

        {/* CÓMO FUNCIONA — el mismo recorrido que las páginas de servicio.
            Eran cuatro cajitas quietas; ahora el proceso se arma con el scroll
            y al lado hay un lienzo que gana piezas paso a paso. Es lo que
            hacía que aquellas se sintieran vivas y a estas les faltaba. */}
        {tHow.visible() && (
          <RecorridoProceso
            slug="servicios-ia-ecommerce"
            pasos={howItWorks}
            sello={tHow('bajada', 'Implementación acompañada')}
            titulo={
              <>
                {tHow('titulo_1', 'CÓMO')}{' '}
                <span className="text-[#CC66FF]">{tHow('titulo_2', 'FUNCIONA')}</span>
              </>
            }
          />
        )}

        {/* EL TEXTO LARGO — aquí y no arriba. A esta altura la página ya
            enseñó una esfera, un bento, una sección clara y una animación
            larga, así que una lectura seguida se lee como cambio de ritmo. */}
        <section className="px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              {tCtx('texto_largo', '')
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((parrafo, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.05 }}
                    className="text-[15.5px] leading-[1.8] text-white/60 md:text-[16.5px]"
                  >
                    {parrafo}
                  </motion.p>
                ))}
            </div>
          </div>
        </section>

        {/* IDEAL PARA */}
        {tIde.visible() && (
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2">
                {tIde('titulo_1', 'IDEAL')} <span className="text-[#7700CE]">{tIde('titulo_2', 'PARA')}</span>
              </h2>
            </div>
            
            {/* Renglones y no tarjetas: son frases cortas, y meter cada una
                en su caja con borde redondeado era darles un peso que no
                tienen. El ✓ era un caracter suelto haciendo de icono, con
                lucide importado tres lineas mas arriba. */}
            <div className="grid gap-x-10 md:grid-cols-2">
              {idealFor.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i, 5) * 0.05 }}
                  className="flex items-start gap-3 border-t border-white/10 py-4"
                >
                  <CheckCircle2 className="mt-0.5 flex-shrink-0 text-[#CC66FF]" size={17} />
                  <span className="text-[15px] leading-relaxed text-white/75 md:text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* PREGUNTAS FRECUENTES — se publican tambien como datos
            estructurados desde render.php, asi que conviene que digan algo
            de verdad: son las que un asistente cita como respuesta. */}
        {tFaq('q1', '') !== '' && (
          <section className="px-4 py-10 md:py-16">
            <div className="container mx-auto max-w-5xl">
              <h2 className="heading mb-8 text-2xl md:text-4xl text-white">
                {tFaq('titulo_1', 'PREGUNTAS')}{' '}
                <span className="text-[#CC66FF]">{tFaq('titulo_2', 'FRECUENTES')}</span>
              </h2>
              {/* El acordeón que ya existe, en su variante oscura: trece
                  párrafos abiertos de golpe eran otro muro. */}
              <FAQAccordion
                variant="dark"
                items={[1, 2, 3, 4, 5, 6]
                  .filter((n) => tFaq(`q${n}`, '') !== '')
                  .map((n) => ({ q: tFaq(`q${n}`, ''), a: tFaq(`r${n}`, '') }))}
              />
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
          </div>
        </section>
      </div>
    </>
  );
}