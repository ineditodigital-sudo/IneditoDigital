import { motion } from 'motion/react';
import { Check, MapPin, Star, TrendingUp, BadgeCheck, Trophy, ScanLine } from 'lucide-react';

/*
 * La escena que se arma junto al proceso de cada servicio.
 *
 * Antes todas las fichas compartian el mismo lienzo abstracto y se notaba:
 * el proceso de Google Ads se veia identico al de branding. Cada escena
 * cuenta EL RESULTADO de ese servicio armandose en cuatro pasos:
 *
 *   busqueda   posicionamiento-organico     tu resultado sube al #1
 *   mapa       ficha-de-google              el pin, la ficha y las resenas
 *   campana    google-ads                   las barras de la campana crecen
 *   chat       chatbots-y-agentes           una conversacion que cierra venta
 *   embudo     funnels-de-venta             el embudo se llena nivel a nivel
 *   marca      branding / creacion-de-logo  el tablero de identidad
 *   qr         servicios-qr                 el codigo se dibuja y se escanea
 *   auditoria  auditoria-con-ia             la lista se palomea y sale la nota
 *   expo       activaciones-para-expo       la ruleta gira y entrega premio
 *   web        diseno-y-desarrollo-web      la pagina se construye (respaldo)
 *
 * Todas comparten el mismo casco y el mismo contrato: `activo` va de 0 a 3 y
 * cada pieza entra cuando su paso llega. Asi el ritmo es identico entre
 * servicios aunque el dibujo cambie.
 */

const suave = [0.22, 1, 0.36, 1] as const;

/** Una pieza que entra cuando el paso `n` esta activo. */
const pieza = (activo: number, n: number, delay = 0) => ({
  initial: { opacity: 0, y: 12, scale: 0.96 },
  animate: activo >= n ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 },
  transition: { duration: 0.5, delay: activo >= n ? delay : 0, ease: suave },
});

/** El distintivo final, comun a todas las escenas. */
function Distintivo({ activo, texto, Icono = Check }: { activo: number; texto: string; Icono?: typeof Check }) {
  return (
    <motion.div
      {...pieza(activo, 3)}
      className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#CC66FF]/40 bg-[#CC66FF]/15 px-3 py-1.5 backdrop-blur"
    >
      <Icono size={13} className="text-[#CC66FF]" strokeWidth={3} />
      <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#CC66FF]">{texto}</span>
    </motion.div>
  );
}

/* ================================================================== */
/* Las escenas                                                         */
/* ================================================================== */

/** Resultados de busqueda: el tuyo entra arriba y gana la posicion. */
function EscenaBusqueda({ activo }: { activo: number }) {
  return (
    <>
      {/* barra de busqueda: siempre */}
      <div className="mb-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-3 py-2">
        <span className="h-3 w-3 rounded-full border-2 border-white/30" />
        <span className="h-1.5 w-2/5 rounded-full bg-white/20" />
      </div>
      {/* paso 2: tu resultado, morado, entra ARRIBA de los grises */}
      <motion.div
        {...pieza(activo, 1)}
        className="mb-2.5 rounded-lg border border-[#CC66FF]/35 bg-[#CC66FF]/12 p-3"
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1/2 rounded-full bg-[#CC66FF]/70" />
          <motion.span
            {...pieza(activo, 2)}
            className="ml-auto rounded-full bg-[#CC66FF]/25 px-2 py-0.5 font-mono text-[9px] text-[#CC66FF]"
          >
            #1
          </motion.span>
        </div>
        <span className="block h-1 w-4/5 rounded-full bg-white/20" />
      </motion.div>
      {/* los competidores, grises */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          {...pieza(activo, 0, i * 0.08)}
          className="mb-2.5 rounded-lg border border-white/8 bg-white/[.03] p-3"
        >
          <span className="mb-1.5 block h-1.5 w-2/5 rounded-full bg-white/15" />
          <span className="block h-1 w-3/4 rounded-full bg-white/10" />
        </motion.div>
      ))}
      <motion.div {...pieza(activo, 2)} className="flex items-center gap-1.5 px-1 text-[#CC66FF]">
        <TrendingUp size={13} />
        <span className="font-mono text-[9px] uppercase tracking-[.12em]">Subiendo posiciones</span>
      </motion.div>
      <Distintivo activo={activo} texto="Posición 1" Icono={TrendingUp} />
    </>
  );
}

/** La ficha de Google: mapa, pin, datos y resenas. */
function EscenaMapa({ activo }: { activo: number }) {
  return (
    <>
      {/* el mapa: rejilla con dos calles */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="absolute left-0 top-1/3 h-[3px] w-full -rotate-6 bg-white/10" />
        <div className="absolute left-2/3 top-0 h-full w-[3px] rotate-3 bg-white/10" />
      </div>
      {/* paso 1: cae el pin */}
      <motion.div
        className="absolute left-[38%] top-[30%]"
        initial={{ opacity: 0, y: -30 }}
        animate={activo >= 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.55, ease: suave }}
      >
        <MapPin size={30} className="text-[#CC66FF] drop-shadow-[0_0_10px_rgba(204,102,255,.8)]" fill="rgba(204,102,255,.3)" />
        <motion.span
          className="absolute -inset-2 rounded-full border border-[#CC66FF]/40"
          animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      </motion.div>
      {/* paso 2: la ficha */}
      <motion.div
        {...pieza(activo, 1)}
        className="absolute right-4 top-5 w-[46%] rounded-xl border border-white/12 bg-[#120018]/95 p-3 backdrop-blur"
      >
        <span className="mb-2 block h-2 w-3/4 rounded-full bg-white/40" />
        <span className="mb-1.5 block h-1.5 w-full rounded-full bg-white/15" />
        <span className="mb-2.5 block h-1.5 w-2/3 rounded-full bg-white/15" />
        {/* paso 3: las estrellas */}
        <motion.div {...pieza(activo, 2)} className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span key={i} {...pieza(activo, 2, i * 0.09)}>
              <Star size={11} className="text-[#FFB84D]" fill="#FFB84D" />
            </motion.span>
          ))}
          <span className="ml-1.5 font-mono text-[9px] text-white/50">5.0</span>
        </motion.div>
      </motion.div>
      <Distintivo activo={activo} texto="Ficha verificada" Icono={BadgeCheck} />
    </>
  );
}

/** La campana de Google Ads: las barras crecen y el CTR sube. */
function EscenaCampana({ activo }: { activo: number }) {
  const barras = [34, 55, 42, 72, 60, 88];
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="h-2 w-1/3 rounded-full bg-white/25" />
        <motion.span
          {...pieza(activo, 2)}
          className="rounded-full bg-[#4ADE80]/15 px-2 py-0.5 font-mono text-[9px] text-[#4ADE80]"
        >
          CTR ↑
        </motion.span>
      </div>
      {/* el eje y las barras */}
      <div className="flex h-[52%] items-end gap-2.5 border-b border-l border-white/12 pb-0 pl-2">
        {barras.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md"
            style={{
              background:
                i >= 3
                  ? 'linear-gradient(180deg, #CC66FF, rgba(204,102,255,.3))'
                  : 'linear-gradient(180deg, rgba(255,255,255,.25), rgba(255,255,255,.06))',
            }}
            initial={{ height: '8%' }}
            animate={{ height: activo >= (i < 3 ? 0 : 1) ? `${h}%` : '8%' }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: suave }}
          />
        ))}
      </div>
      {/* paso 3: la linea de conversion */}
      <motion.svg
        viewBox="0 0 100 26"
        className="mt-3 h-8 w-full"
        {...pieza(activo, 2)}
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,22 C20,20 32,14 48,12 S 80,6 100,3"
          fill="none"
          stroke="#4ADE80"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={activo >= 2 ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.9, ease: suave }}
        />
      </motion.svg>
      <Distintivo activo={activo} texto="Campaña rentable" Icono={TrendingUp} />
    </>
  );
}

/** Un chat que atiende y cierra la venta solo. */
function EscenaChat({ activo }: { activo: number }) {
  return (
    <>
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2.5">
        <span className="h-6 w-6 rounded-full bg-[#CC66FF]/25" />
        <span className="h-1.5 w-1/3 rounded-full bg-white/25" />
        <span className="ml-auto h-2 w-2 rounded-full bg-[#4ADE80]" />
      </div>
      {/* paso 1: entra el cliente */}
      <motion.div {...pieza(activo, 0)} className="mb-2.5 mr-auto w-[62%] rounded-2xl rounded-tl-sm bg-white/[.08] p-2.5">
        <span className="mb-1 block h-1.5 w-5/6 rounded-full bg-white/25" />
        <span className="block h-1.5 w-1/2 rounded-full bg-white/15" />
      </motion.div>
      {/* paso 2: responde el agente */}
      <motion.div
        {...pieza(activo, 1)}
        className="mb-2.5 ml-auto w-[58%] rounded-2xl rounded-tr-sm p-2.5"
        style={{ background: 'linear-gradient(140deg, rgba(119,0,206,.55), rgba(153,51,255,.35))' }}
      >
        <span className="mb-1 block h-1.5 w-full rounded-full bg-white/45" />
        <span className="block h-1.5 w-2/3 rounded-full bg-white/30" />
      </motion.div>
      {/* paso 3: el cliente vuelve + el agente escribe */}
      <motion.div {...pieza(activo, 2)} className="mb-2.5 mr-auto w-[40%] rounded-2xl rounded-tl-sm bg-white/[.08] p-2.5">
        <span className="block h-1.5 w-4/5 rounded-full bg-white/25" />
      </motion.div>
      <motion.div {...pieza(activo, 2, 0.2)} className="ml-auto flex w-14 items-center justify-center gap-1 rounded-2xl bg-[#CC66FF]/20 p-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#CC66FF]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </motion.div>
      <Distintivo activo={activo} texto="Venta cerrada 24/7" />
    </>
  );
}

/** El embudo se llena nivel a nivel hasta la venta. */
function EscenaEmbudo({ activo }: { activo: number }) {
  const niveles = [
    { w: '100%', et: 'Visitas' },
    { w: '72%', et: 'Leads' },
    { w: '46%', et: 'Propuestas' },
    { w: '24%', et: 'Ventas' },
  ];
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center gap-2 pb-8">
        {niveles.map((n, i) => (
          <motion.div
            key={i}
            className="relative h-9 overflow-hidden rounded-md border border-white/10"
            style={{ width: n.w }}
            {...pieza(activo, 0, i * 0.05)}
          >
            {/* el nivel se ENCIENDE cuando su paso llega */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  i === 3
                    ? 'linear-gradient(90deg, #4ADE80aa, #4ADE8055)'
                    : 'linear-gradient(90deg, rgba(153,51,255,.55), rgba(204,102,255,.25))',
              }}
              initial={{ x: '-100%' }}
              animate={activo >= i ? { x: '0%' } : { x: '-100%' }}
              transition={{ duration: 0.55, ease: suave }}
            />
            <span className="absolute inset-y-0 left-3 flex items-center font-mono text-[9px] uppercase tracking-[.12em] text-white/70">
              {n.et}
            </span>
          </motion.div>
        ))}
      </div>
      <Distintivo activo={activo} texto="Embudo convirtiendo" />
    </>
  );
}

/** El tablero de identidad: paleta, simbolo y tipografia. */
function EscenaMarca({ activo }: { activo: number }) {
  return (
    <>
      {/* paso 1: la paleta */}
      <div className="mb-4 flex gap-2">
        {['#7700CE', '#9933FF', '#CC66FF', '#F2F0F6'].map((c, i) => (
          <motion.span
            key={c}
            {...pieza(activo, 0, i * 0.08)}
            className="h-8 flex-1 rounded-lg border border-white/10"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex gap-4">
        {/* paso 2: el simbolo */}
        <motion.div
          {...pieza(activo, 1)}
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-[#CC66FF]/30"
          style={{ background: 'linear-gradient(140deg, rgba(119,0,206,.3), rgba(255,255,255,.03))' }}
        >
          <motion.div
            className="h-10 w-10 rounded-[35%] border-[3px] border-[#CC66FF]"
            animate={activo >= 1 ? { rotate: [0, 90] } : {}}
            transition={{ duration: 0.8, ease: suave }}
          />
        </motion.div>
        {/* paso 3: la tipografia */}
        <div className="flex-1 space-y-2.5 pt-1">
          <motion.span {...pieza(activo, 2)} className="block h-4 w-4/5 rounded bg-white/35" />
          <motion.span {...pieza(activo, 2, 0.1)} className="block h-2 w-full rounded-full bg-white/15" />
          <motion.span {...pieza(activo, 2, 0.18)} className="block h-2 w-2/3 rounded-full bg-white/15" />
        </div>
      </div>
      <Distintivo activo={activo} texto="Identidad lista" />
    </>
  );
}

/** El QR se dibuja modulo a modulo y se escanea. */
function EscenaQR({ activo }: { activo: number }) {
  /* patron fijo (nada de aleatorio: tiene que ser estable entre renders) */
  const modulos = [5, 8, 11, 14, 17, 20, 23, 27, 30, 33, 36, 39, 43, 46, 49, 52, 55, 58, 61, 64];
  return (
    <>
      <div className="flex h-full items-center justify-center pb-8">
        <div className="relative h-40 w-40 rounded-xl border border-white/12 bg-white/[.04] p-3">
          {/* paso 1: las tres esquinas */}
          {[
            'left-3 top-3',
            'right-3 top-3',
            'bottom-3 left-3',
          ].map((pos, i) => (
            <motion.span
              key={pos}
              {...pieza(activo, 0, i * 0.1)}
              className={`absolute ${pos} flex h-8 w-8 items-center justify-center rounded-[4px] border-[3px] border-[#CC66FF]`}
            >
              <span className="h-3 w-3 rounded-[2px] bg-[#CC66FF]" />
            </motion.span>
          ))}
          {/* pasos 2 y 3: los modulos van llenando */}
          <div className="absolute inset-3 grid grid-cols-8 grid-rows-8 gap-[3px] p-0.5">
            {Array.from({ length: 64 }, (_, i) => {
              const enPaso = modulos.indexOf(i) >= 0 ? (modulos.indexOf(i) < 10 ? 1 : 2) : -1;
              if (enPaso < 0) return <span key={i} />;
              return (
                <motion.span
                  key={i}
                  className="rounded-[1px] bg-white/70"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={activo >= enPaso ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3, delay: (modulos.indexOf(i) % 10) * 0.05, ease: suave }}
                />
              );
            })}
          </div>
          {/* paso 4: el barrido de escaneo */}
          <motion.div
            className="absolute inset-x-2 h-1 rounded-full bg-[#4ADE80]/80 shadow-[0_0_14px_rgba(74,222,128,.8)]"
            initial={{ top: '8%', opacity: 0 }}
            animate={activo >= 3 ? { top: ['8%', '88%', '8%'], opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2.2, repeat: activo >= 3 ? Infinity : 0, ease: 'easeInOut' }}
          />
        </div>
      </div>
      <Distintivo activo={activo} texto="Escaneado" Icono={ScanLine} />
    </>
  );
}

/** La auditoria: la lista se palomea y aparece la calificacion. */
function EscenaAuditoria({ activo }: { activo: number }) {
  const filas = [
    { w: '72%', paso: 1 },
    { w: '58%', paso: 1 },
    { w: '80%', paso: 2 },
    { w: '64%', paso: 2 },
  ];
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2/5 rounded-full bg-white/30" />
        {/* paso 3: la calificacion */}
        <motion.span
          {...pieza(activo, 2)}
          className="heading ml-auto text-3xl leading-none text-[#4ADE80]"
        >
          92
        </motion.span>
      </div>
      {filas.map((f, i) => (
        <motion.div
          key={i}
          {...pieza(activo, 0, i * 0.07)}
          className="mb-2.5 flex items-center gap-3 rounded-lg border border-white/8 bg-white/[.03] p-2.5"
        >
          {/* la casilla se palomea cuando llega su paso */}
          <motion.span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
            animate={
              activo >= f.paso
                ? { borderColor: '#4ADE80', backgroundColor: 'rgba(74,222,128,.15)' }
                : { borderColor: 'rgba(255,255,255,.2)', backgroundColor: 'transparent' }
            }
            transition={{ duration: 0.3, delay: i * 0.12 }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={activo >= f.paso ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: i * 0.12, ease: suave }}
            >
              <Check size={13} className="text-[#4ADE80]" strokeWidth={3.5} />
            </motion.span>
          </motion.span>
          <span className="h-1.5 rounded-full bg-white/18" style={{ width: f.w }} />
        </motion.div>
      ))}
      <Distintivo activo={activo} texto="Plan de trabajo listo" />
    </>
  );
}

/** La ruleta de la expo gira y entrega premio. */
function EscenaExpo({ activo }: { activo: number }) {
  return (
    <>
      <div className="flex h-full items-center justify-center pb-8">
        <div className="relative">
          {/* paso 1: la ruleta */}
          <motion.div
            {...pieza(activo, 0)}
            className="relative h-40 w-40 rounded-full border-4 border-white/15"
            style={{
              background:
                'conic-gradient(#7700CE 0 45deg, #2a0a3d 45deg 90deg, #9933FF 90deg 135deg, #1a0526 135deg 180deg, #CC66FF 180deg 225deg, #2a0a3d 225deg 270deg, #7700CE 270deg 315deg, #1a0526 315deg 360deg)',
            }}
          >
            {/* paso 2: gira */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(transparent 0 300deg, rgba(255,255,255,.25) 330deg, transparent 360deg)',
              }}
              animate={activo >= 1 ? { rotate: 360 } : { rotate: 0 }}
              transition={activo >= 1 ? { duration: 2.4, repeat: Infinity, ease: 'linear' } : {}}
            />
            <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 bg-[#120018]" />
          </motion.div>
          {/* la flecha */}
          <motion.div
            {...pieza(activo, 0, 0.15)}
            className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2"
            style={{
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderTop: '14px solid #F2F0F6',
            }}
          />
          {/* paso 3: confeti */}
          {[
            ['-12%', '8%'], ['104%', '14%'], ['-6%', '70%'], ['102%', '64%'], ['48%', '-14%'],
          ].map(([x, y], i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-[2px]"
              style={{ left: x, top: y, background: i % 2 ? '#CC66FF' : '#FFB84D' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                activo >= 2
                  ? { opacity: [0, 1, 0.6], scale: [0, 1.2, 1], rotate: [0, 140] }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.8, delay: i * 0.1, ease: suave }}
            />
          ))}
        </div>
      </div>
      <Distintivo activo={activo} texto="Premio entregado" Icono={Trophy} />
    </>
  );
}

/** La pagina web construyendose (la escena original, ahora solo para web). */
function EscenaWeb({ activo }: { activo: number }) {
  return (
    <>
      <div className="mb-5 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <motion.span
          className="ml-auto h-1.5 rounded-full bg-[#CC66FF]/50"
          animate={{ width: `${20 + activo * 14}%` }}
          transition={{ duration: 0.6, ease: suave }}
        />
      </div>
      <div className="flex gap-4">
        <motion.div {...pieza(activo, 1)} className="h-20 w-14 shrink-0 rounded-lg border border-[#CC66FF]/25 bg-[#CC66FF]/10" />
        <div className="flex-1 space-y-2.5 pt-1">
          {[100, 78, 88].map((w, i) => (
            <motion.div
              key={i}
              {...pieza(activo, 1, i * 0.08)}
              className="h-2 rounded-full bg-white/15"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            {...pieza(activo, 2, i * 0.1)}
            className="h-14 rounded-lg border border-white/10"
            style={{ background: 'linear-gradient(140deg, rgba(119,0,206,.3), rgba(255,255,255,.03))' }}
          />
        ))}
      </div>
      <Distintivo activo={activo} texto="Listo" />
    </>
  );
}

/* ================================================================== */
/* El casco comun y el selector por servicio                           */
/* ================================================================== */

const escenas: Record<string, (p: { activo: number }) => JSX.Element> = {
  'posicionamiento-organico': EscenaBusqueda,
  'ficha-de-google': EscenaMapa,
  'google-ads': EscenaCampana,
  'chatbots-y-agentes': EscenaChat,
  'funnels-de-venta': EscenaEmbudo,
  branding: EscenaMarca,
  'creacion-de-logo': EscenaMarca,
  'servicios-qr': EscenaQR,
  'auditoria-con-ia': EscenaAuditoria,
  'activaciones-para-expo': EscenaExpo,
  'diseno-y-desarrollo-web': EscenaWeb,
};

export function Escena({ slug, activo }: { slug: string; activo: number }) {
  const Cuerpo = escenas[slug] ?? EscenaWeb;
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* halo que crece con el avance */}
      <motion.div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[#7700CE]/25 blur-[60px]"
        animate={{ opacity: 0.25 + activo * 0.2 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/12 p-5"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02))' }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Cuerpo activo={activo} />
      </motion.div>
    </div>
  );
}
