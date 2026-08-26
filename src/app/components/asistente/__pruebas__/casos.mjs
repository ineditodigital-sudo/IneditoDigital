/*
 * Pruebas del emparejador del asistente.
 *
 * Recorren el MISMO orden de decision que usa AIAssistant.tsx, porque el motor
 * puede acertar la intencion y aun asi contestar mal si el componente no la
 * atiende: asi se descubrio que "cuanto tardan" caia en "no entendi" pese a
 * que detectarGlobal() devolvia 'tiempo' correctamente.
 *
 * Cuando alguien reporte una pregunta que el asistente no entiende, se añade
 * aqui PRIMERO y luego se arregla. Arreglar "me pueden llamar" rompio "como te
 * llamas", y solo se detecto porque esto ya existia.
 *
 * Correr:
 *   bash src/app/components/asistente/__pruebas__/correr.sh
 */
import { detectarGlobal, buscarServicios, buscarExtra, mismaRaiz } from './.compilado/int.mjs';
import { SERVICES } from './.compilado/svc.mjs';

/* ficha-de-google y auditoria-con-ia solo existen en la base, no en
   data/services.ts. Sin anadirlos aqui la prueba da un falso negativo. */
const base = {
  icon: '', benefits: [], ideal: [], process: [], faq: [], relatedServices: [], order: 90,
};
const TODOS = [
  ...SERVICES,
  { ...base, id: 'x1', slug: 'ficha-de-google', title: 'Ficha de Google', category: 'SEO Local',
    shortDescription: 'El perfil que aparece en Google y Maps.', features: ['Reclamación del perfil'] },
  { ...base, id: 'x2', slug: 'auditoria-con-ia', title: 'Auditoría con IA', category: 'Estrategia',
    shortDescription: 'Revisamos tu presencia digital.', features: ['Velocidad real medida'] },
];

/** Reproduce el orden de decision del componente. */
function ruta(t) {
  const g = detectarGlobal(t);
  const c = buscarServicios(t, TODOS);
  const e = buscarExtra(t);
  const encajaUno = c.length > 0 && c[0].puntos >= 10;
  if (g === 'catalogo' && !encajaUno) return 'CATALOGO';
  if (e && e.puntos >= 8 && g !== 'precio') return 'PAGINA: ' + e.pagina.url;
  if (c.length && c[0].puntos >= 10 && g !== 'precio' && g !== 'tiempo') return 'SERVICIO: ' + c[0].servicio.slug;
  if (g) return 'INTENCION: ' + g;
  if (c.length) return 'SERVICIO: ' + c[0].servicio.slug;
  return 'NO ENTENDIDO';
}

let ok = 0, total = 0;
const comprobar = (etiqueta, real, esperado) => {
  total++;
  const bien = real === esperado;
  if (bien) ok++;
  console.log((bien ? '  OK   ' : '  MAL  ') + etiqueta.padEnd(40) + real + (bien ? '' : `\n         esperaba: ${esperado}`));
};

console.log('\n== Rutas completas ==');
[
  // reportadas por Cristian con captura
  ['que empresa es esta?',              'INTENCION: quienes'],
  ['donde se encuentran?',              'INTENCION: ubicacion'],
  ['como te llamas?',                   'INTENCION: identidad'],
  ['cuantos trabajan en la empresa?',   'INTENCION: equipo'],
  ['que servicios tienen?',             'CATALOGO'],
  ['cuanto tardan',                     'INTENCION: tiempo'],
  // paginas que no estan en la tabla de servicios
  ['quiero aparecer en chatgpt',        'PAGINA: /servicios/posicionamiento-en-ia'],
  ['que la ia me recomiende',           'PAGINA: /servicios/posicionamiento-en-ia'],
  ['quiero automatizar whatsapp',       'PAGINA: /servicios-ia/whatsapp'],
  // servicios
  ['como aparezco en google maps',      'SERVICIO: ficha-de-google'],
  ['quiero mejorar mis resenas de google', 'SERVICIO: ficha-de-google'],
  ['quiero salir primero en google',    'SERVICIO: posicionamiento-organico'],
  ['necesito seo',                      'SERVICIO: posicionamiento-organico'],
  ['necesito una pagina web',           'SERVICIO: diseno-y-desarrollo-web'],
  ['necesito un logo',                  'SERVICIO: creacion-de-logo'],
  ['quiero hacer publicidad',           'SERVICIO: google-ads'],
  ['quiero una auditoria',              'SERVICIO: auditoria-con-ia'],
  ['hacen email marketing',            'CATALOGO'],
  ['hacen paginas web',                'SERVICIO: diseno-y-desarrollo-web'],
  ['hacen chatbots',                   'SERVICIO: chatbots-y-agentes'],
  ['mandan newsletters',               'SERVICIO: funnels-de-venta'],
  // intenciones globales
  ['cuanto cuesta una pagina web',      'INTENCION: precio'],
  ['dan factura',                       'INTENCION: administrativo'],
  ['trabajan fuera de aguascalientes',  'INTENCION: cobertura'],
  ['garantizan resultados',             'INTENCION: garantia'],
  ['hola',                              'INTENCION: saludo'],
  // los botones de grupo no deben interpretarse como texto libre
  ['__grupo:Marketing y presencia digital__', 'NO ENTENDIDO'],
].forEach(([t, esp]) => comprobar(t, ruta(t), esp));

console.log('\n== Variantes de la misma pregunta ==');
Object.entries({
  catalogo:   ['que servicios tienen', 'cuales servicios ofrecen', 'que hacen ustedes', 'en que me pueden ayudar', 'lista de servicios'],
  quienes:    ['que empresa es esta', 'a que se dedican', 'quienes son ustedes', 'de que se trata inedito'],
  ubicacion:  ['donde se encuentran', 'donde estan', 'en que ciudad estan', 'cual es su direccion', 'tienen oficina'],
  precio:     ['cuanto cuesta', 'que precios manejan', 'cuanto sale una pagina', 'cual es el costo'],
  equipo:     ['cuantos trabajan ahi', 'cuantas personas son', 'cuantos empleados tienen'],
  identidad:  ['como te llamas', 'quien eres', 'eres un robot'],
  contacto:   ['quiero hablar con alguien', 'me pueden llamar', 'como los contacto'],
  tiempo:     ['cuanto tardan', 'en cuanto tiempo esta listo', 'cual es el plazo'],
  garantia:   ['garantizan resultados', 'y si no funciona'],
  portafolio: ['que trabajos han hecho', 'tienen casos de exito', 'muestrenme ejemplos'],
  niveles:    ['no se que necesito', 'por donde empiezo', 'que me conviene'],
}).forEach(([esp, frases]) => frases.forEach((f) => comprobar(f, String(detectarGlobal(f)), esp)));

console.log('\n== La comparacion por raiz no debe confundir palabras ==');
[
  ['encuentran', 'encuentro', true],
  ['ubicados', 'ubicacion', true],
  ['trabajan', 'trabajo', true],
  ['empresa', 'empresas', true],
  ['costo', 'costoso', true],
  ['precio', 'precisamente', false],
  ['marca', 'marcador', false],
].forEach(([a, b, esp]) => comprobar(`${a} ~ ${b}`, String(mismaRaiz(a, b)), String(esp)));

console.log(`\n  ${ok}/${total} correctos`);
if (ok !== total) process.exitCode = 1;
