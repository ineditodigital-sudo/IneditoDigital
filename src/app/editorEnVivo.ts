/*
 * El puente del editor en vivo.
 *
 * El editor del panel carga la página real en un iframe y, mientras el
 * cliente escribe, le manda mensajes; este módulo los recibe y pinta el
 * cambio al instante sobre el DOM ya renderizado. No toca el estado de
 * React ni el contenido guardado: es una vista previa, nada más.
 *
 * Solo despierta dentro de un iframe (o con ?editorVivo=1 para pruebas) y
 * solo obedece mensajes del propio dominio. En una visita normal este
 * archivo ni siquiera se descarga: main.tsx lo importa condicionalmente.
 *
 * Mensajes:
 *  - {tipo:'reemplazar', antes, ahora}  sustituye texto visible
 *  - {tipo:'lote', cambios:[[antes,ahora],…]}  varios de golpe (el borrador)
 *  - {tipo:'resaltar', valor}  enmarca el texto y lo trae a la vista
 */

/* Un texto vacío dejaría el nodo imposible de reencontrar; este caracter
   invisible lo mantiene anclado para el siguiente reemplazo. */
const ANCLA = '​';

function nodosCon(valor: string): Text[] {
  const paseo = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue && n.nodeValue.includes(valor)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });
  const encontrados: Text[] = [];
  let n: Node | null;
  while ((n = paseo.nextNode())) encontrados.push(n as Text);
  return encontrados;
}

function reemplazar(antes: string, ahora: string): void {
  if (!antes) return;
  const destino = ahora === '' ? ANCLA : ahora;
  for (const nodo of nodosCon(antes)) {
    nodo.nodeValue = (nodo.nodeValue || '').split(antes).join(destino);
  }
}

let marcado: HTMLElement | null = null;
let quitarMarca: number | undefined;

function resaltar(valor: string): void {
  if (!valor || valor === ANCLA) return;
  const nodo = nodosCon(valor)[0];
  const el = nodo?.parentElement;
  if (!el) return;
  if (marcado) marcado.style.outline = marcado.style.outlineOffset = '';
  marcado = el;
  el.style.outline = '2px solid #CC66FF';
  el.style.outlineOffset = '4px';
  el.style.borderRadius = el.style.borderRadius || '4px';
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  window.clearTimeout(quitarMarca);
  quitarMarca = window.setTimeout(() => {
    el.style.outline = el.style.outlineOffset = '';
    if (marcado === el) marcado = null;
  }, 1800);
}

window.addEventListener('message', (ev: MessageEvent) => {
  if (ev.origin !== window.location.origin) return;
  const m = ev.data;
  if (!m || typeof m !== 'object') return;
  if (m.tipo === 'reemplazar') reemplazar(String(m.antes ?? ''), String(m.ahora ?? ''));
  else if (m.tipo === 'lote' && Array.isArray(m.cambios)) {
    for (const par of m.cambios) reemplazar(String(par?.[0] ?? ''), String(par?.[1] ?? ''));
  } else if (m.tipo === 'resaltar') resaltar(String(m.valor ?? ''));
});

/* Avisa al editor que ya está listo para recibir. */
try {
  window.parent?.postMessage({ tipo: 'editor-listo' }, window.location.origin);
} catch {
  /* nada */
}

export {};
