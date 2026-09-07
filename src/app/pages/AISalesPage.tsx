import { motion } from 'motion/react';
import { Target, TrendingUp, Users, Zap, BarChart3, CheckCircle2, ArrowRight, Sparkles, ArrowLeft, Brain, DollarSign } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import { TopoLineas } from '../components/TopoLineas';
import Floating3DElements from '../components/Floating3DElements';
import SectionDivider from '../components/SectionDivider';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

export default function AISalesPage() {
  const { openAssistant } = useApp();
  const t = contenido('servicios-ia-ventas', 'portada');
  const tC = contenido('servicios-ia-ventas', 'cierre');
  const tInc = contenido('servicios-ia-ventas', 'incluye');
  const tBen = contenido('servicios-ia-ventas', 'beneficios');
  const tHow = contenido('servicios-ia-ventas', 'como_funciona');
  const tIde = contenido('servicios-ia-ventas', 'ideal_para');
  const tImg = contenido('servicios-ia-ventas', 'imagenes');
  const tNav = contenido('servicios-ia-ventas', 'navegacion');
  const tCtx = contenido('servicios-ia-ventas', 'contexto');
  const tFaq = contenido('servicios-ia-ventas', 'faq');

  // Imágenes para las diferentes secciones
  const sectionImages = {
    hero: tImg('hero', 'https://images.unsplash.com/photo-1545535408-2b4d520cbd88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwc2FsZXN8ZW58MXx8fHwxNzY3NzI4ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    features: tImg('features', 'https://images.unsplash.com/photo-1759752394755-1241472b589d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzY3Njc3NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    collaboration: tImg('collaboration', 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzY3NjI2NDE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    growth: tImg('growth', 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    cta: tImg('cta', 'https://images.unsplash.com/photo-1603219950587-b4f3f7ee87e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NzcwOTAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')
  };

  const benefits = [
    { icon: Brain, title: tBen('b1_titulo', 'Prospección Inteligente'), description: tBen('b1_texto', 'Identifica y prioriza automáticamente leads con mayor probabilidad de conversión.') },
    { icon: Target, title: tBen('b2_titulo', 'Lead Scoring Automático'), description: tBen('b2_texto', 'Califica cada prospecto con criterios personalizados y datos en tiempo real.') },
    { icon: Zap, title: tBen('b3_titulo', 'Seguimiento Predictivo'), description: tBen('b3_texto', 'Sabe cuándo y cómo contactar cada lead para maximizar probabilidad de cierre.') },
    { icon: DollarSign, title: tBen('b4_titulo', 'Optimización de Pipeline'), description: tBen('b4_texto', 'Identifica cuellos de botella y sugiere acciones para acelerar el ciclo de ventas.') },
  ];


  const idealFor = [
    tIde('i1', 'Equipos de ventas B2B que necesitan calificar leads rápidamente'),
    tIde('i2', 'Empresas SaaS con ciclos de venta complejos'),
    tIde('i3', 'Consultorías y agencias que prospectan empresas'),
    tIde('i4', 'Distribuidores mayoristas con grandes volúmenes de clientes'),
    tIde('i5', 'Startups tecnológicas en fase de crecimiento'),
    tIde('i6', 'Inmobiliarias comerciales con múltiples desarrollos'),
  ];


  const features = [
    tInc('f1', 'Enriquecimiento automático de datos de prospectos'),
    tInc('f2', 'Integración con LinkedIn, CRM y bases de datos comerciales'),
    tInc('f3', 'Análisis predictivo de comportamiento de compra'),
    tInc('f4', 'Secuencias de email y llamadas automatizadas'),
    tInc('f5', 'Dashboard con métricas de conversión en tiempo real'),
    tInc('f6', 'Alertas inteligentes de oportunidades de venta'),
  ];


  const howItWorks = [
    { step: 1, title: tHow('p1_titulo', 'Análisis'), description: tHow('p1_texto', 'La IA analiza tu histórico de ventas y perfil de cliente ideal.') },
    { step: 2, title: tHow('p2_titulo', 'Prospección'), description: tHow('p2_texto', 'Busca y califica prospectos automáticamente en múltiples fuentes.') },
    { step: 3, title: tHow('p3_titulo', 'Contacto'), description: tHow('p3_texto', 'Ejecuta secuencias personalizadas de email, LinkedIn y llamadas.') },
    { step: 4, title: tHow('p4_titulo', 'Optimización'), description: tHow('p4_texto', 'Aprende de cada interacción para mejorar continuamente los resultados.') },
  ];


  return (
    <>
      <DynamicSEO
        title="IA de Ventas - Automatización Comercial Inteligente - INÉDITO DIGITAL"
        description="Sistema de IA que automatiza prospección, califica leads y optimiza tu proceso de ventas. Cierra más negocios con menos esfuerzo."
        keywords={['ia ventas', 'automatización ventas', 'lead scoring ia', 'prospección automática', 'crm inteligente', 'sales automation']}
      />

      {/* Hero Banner con Imagen de Fondo */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* El fondo de la casa, no una foto de archivo. Las paginas de
            servicio ya usan estas lineas; la foto del señor en traje era
            lo unico que delataba que estas cuatro venian de otra
            plantilla. */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <TopoLineas className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-20 px-4 text-center py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#7700CE]/30 border border-[#7700CE]/50 backdrop-blur-xl text-[#CC66FF] font-bold mb-4">
              {t('etiqueta', 'IA DE VENTAS')}
            </span>
            
            <h1 className="heading mb-3 md:mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
              {t('titulo', 'VENDE MÁS CON MENOS ESFUERZO')}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('bajada', 'Sistema de IA que automatiza prospección, califica leads y optimiza cada etapa de tu proceso comercial.')}
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
        {/* DE QUE SE TRATA — la definicion primero, que es lo que cita un
            asistente, y despues el texto largo. Antes esta pagina servia
            poco mas de doscientas palabras y Google no la habia visitado
            nunca. */}
        <section className="px-4 pt-10 pb-6 md:pt-14 md:pb-10">
          <div className="container mx-auto max-w-5xl">
            {/* Dos columnas y no una: la definición sostiene la izquierda
                —se queda fija mientras se lee el resto— y el desarrollo corre
                por la derecha. En una sola columna esto eran trescientas
                palabras seguidas, que es un muro y no una página. */}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <div className="lg:sticky lg:top-28">
                  <span className="mb-5 block h-[3px] w-14 bg-[#9933FF]" />
                  <p className="text-[18px] md:text-[21px] leading-[1.6] text-white/90">
                    {tCtx('definicion', '')}
                  </p>
                </div>
              </motion.div>

              <div className="space-y-5 lg:col-span-7">
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
                      transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.06 }}
                      className="text-[15.5px] leading-[1.8] text-white/60 md:text-[16.5px]"
                    >
                      {parrafo}
                    </motion.p>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* QUÉ INCLUYE */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5 text-black">
                  {tInc('titulo_1', 'QUÉ')} <span className="text-[#7700CE]">{tInc('titulo_2', 'INCLUYE')}</span>
                </h2>
                {/* A dos columnas: seis renglones seguidos a todo el ancho
                    dejaban una linea de texto de treinta centimetros. */}
                <div className="grid gap-x-10 md:grid-cols-2">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 5) * 0.05 }}
                      className="flex items-start gap-3 border-t border-gray-200 py-4"
                    >
                      <CheckCircle2 className="mt-0.5 flex-shrink-0 text-[#7700CE]" size={18} />
                      <span className="text-[15px] leading-relaxed text-gray-700 md:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        {tBen.visible() && (
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-5xl">
            <div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5">
                  {tBen('titulo_1', 'BENEFICIOS')} <span className="text-[#7700CE]">{tBen('titulo_2', 'PRINCIPALES')}</span>
                </h2>
                {/* El primero ocupa el doble. Seis tarjetas del mismo tamano
                    apiladas hacen que todo pese igual, que es justo lo que
                    delata una plantilla. */}
                <div className="grid gap-4 md:grid-cols-3">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 5) * 0.06 }}
                      className={i === 0 ? 'md:col-span-2' : ''}
                    >
                      <div
                        className="h-full rounded-2xl border border-white/10 p-5 transition-colors duration-300 hover:border-[#CC66FF]/40 md:p-6"
                        style={{
                          background:
                            i === 0
                              ? 'linear-gradient(150deg, rgba(119,0,206,.22), rgba(255,255,255,.02) 60%)'
                              : 'rgba(255,255,255,.035)',
                        }}
                      >
                        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                          <benefit.icon className="text-[#CC66FF]" size={18} />
                        </span>
                        <h3 className={`heading mb-1.5 text-white ${i === 0 ? 'text-lg md:text-xl' : 'text-base'}`}>
                          {benefit.title}
                        </h3>
                        <p className={`leading-relaxed text-white/65 ${i === 0 ? 'text-[15px]' : 'text-sm'}`}>
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        )}

        {/* CÓMO FUNCIONA */}
        {tHow.visible() && (
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-black">
                {tHow('titulo_1', 'CÓMO')} <span className="text-[#7700CE]">{tHow('titulo_2', 'FUNCIONA')}</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Proceso inteligente de automatización comercial
              </p>
            </div>

            <div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {howItWorks.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-full p-4 rounded-xl bg-white/80 border border-gray-200 hover:border-[#7700CE]/40 transition-colors backdrop-blur-sm">
                      <div className="heading text-3xl md:text-4xl text-[#7700CE] mb-2">{step.step.toString().padStart(2, '0')}</div>
                      <h3 className="heading text-base md:text-lg mb-1.5 text-black">{step.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

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
              <div className="grid gap-x-12 border-t border-white/10 lg:grid-cols-2">
                {[1, 2, 3, 4, 5, 6]
                  .filter((n) => tFaq(`q${n}`, '') !== '')
                  .map((n) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-white/10 py-6"
                    >
                      <h3 className="mb-2.5 text-[16px] md:text-[17px] font-bold text-white">
                        {tFaq(`q${n}`, '')}
                      </h3>
                      <p className="text-[15px] leading-[1.75] text-white/60">
                        {tFaq(`r${n}`, '')}
                      </p>
                    </motion.div>
                  ))}
              </div>
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