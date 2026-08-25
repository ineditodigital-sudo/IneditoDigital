import { detectarGlobal, buscarServicios, buscarExtra, mismaRaiz } from './int.mjs';
import { SERVICES } from './svc.mjs';
const TODOS = [...SERVICES,
  { id:'x1', slug:'ficha-de-google', title:'Ficha de Google', shortDescription:'El perfil que aparece en Google y Maps.', icon:'', category:'SEO Local', features:['Reclamación y verificación del perfil'], benefits:[], ideal:[], process:[], faq:[], relatedServices:[], order:90 },
  { id:'x2', slug:'auditoria-con-ia', title:'Auditoría con IA', shortDescription:'Revisamos tu presencia digital.', icon:'', category:'Estrategia', features:['Velocidad real medida'], benefits:[], ideal:[], process:[], faq:[], relatedServices:[], order:90 },
];
function ruta(t) {
  const g = detectarGlobal(t), c = buscarServicios(t, TODOS), e = buscarExtra(t);
  if (e && e.puntos >= 8 && g !== 'precio') return 'PAGINA: ' + e.pagina.url;
  if (c.length && c[0].puntos >= 10 && g !== 'precio' && g !== 'tiempo') return 'SERVICIO: ' + c[0].servicio.slug;
  if (g) return 'INTENCION: ' + g;
  if (c.length) return 'SERVICIO: ' + c[0].servicio.slug;
  return 'NO ENTENDIDO';
}
console.log('  --- las dos que fallaron en la captura ---');
for (const [t, esp] of [['que empresa es esta?','INTENCION: quienes'], ['donde se encuentran?','INTENCION: ubicacion']]) {
  const r = ruta(t); console.log((r===esp?'  OK   ':'  MAL  ')+t.padEnd(34)+r);
}
console.log('\n  --- variantes de la misma pregunta ---');
const grupos = {
  'quienes':   ['que empresa es esta','a que se dedican','quienes son ustedes','que hacen ustedes','de que se trata inedito','cuantos anos llevan'],
  'ubicacion': ['donde se encuentran','donde estan','en que ciudad estan','cual es su direccion','tienen oficina','como llego a su oficina'],
  'precio':    ['cuanto cuesta','que precios manejan','cuanto sale una pagina','cual es el costo'],
  'equipo':    ['cuantos trabajan ahi','cuantas personas son','cuantos empleados tienen'],
  'identidad': ['como te llamas','quien eres','eres un robot'],
  'contacto':  ['quiero hablar con alguien','me pueden llamar','como los contacto'],
  'tiempo':    ['cuanto tardan','en cuanto tiempo esta listo','cual es el plazo'],
  'garantia':  ['garantizan resultados','y si no funciona'],
  'portafolio':['que trabajos han hecho','tienen casos de exito','muestrenme ejemplos'],
};
let ok=0, tot=0;
for (const [esp, frases] of Object.entries(grupos)) {
  for (const f of frases) {
    tot++;
    const r = detectarGlobal(f);
    const b = r === esp; if (b) ok++;
    console.log((b?'  OK   ':'  MAL  ')+f.padEnd(34)+String(r)+(b?'':'   (esperaba '+esp+')'));
  }
}
console.log('\n  --- no debe confundirse ---');
for (const [a,b,esp] of [['precio','precisamente',false],['encuentran','encuentro',true],['ubicados','ubicacion',true],['trabajan','trabajo',true],['empresa','empresas',true],['costo','costoso',true],['marca','marcador',false]]) {
  const r = mismaRaiz(a,b); const bien = r===esp; if(bien) ok++; tot++;
  console.log((bien?'  OK   ':'  MAL  ')+(a+' ~ '+b).padEnd(34)+r);
}
console.log('\n  '+ok+'/'+tot+' correctos');
