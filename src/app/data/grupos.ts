import type { Service } from './services';

/*
 * Como se agrupan los servicios por categoria.
 *
 * Vive aqui y no dentro del Header porque el asistente necesita exactamente
 * el mismo mapa: si alguien pregunta "que servicios tienen", la respuesta del
 * chat y la del menu tienen que coincidir. Dos listas paralelas se separan al
 * segundo cambio.
 *
 * Las categorias salen del panel, asi que lo que no encaje en ningun grupo cae
 * en el ultimo: ningun servicio se queda sin aparecer.
 */

export type Grupo = { titulo: string; cats: string[]; items: Service[] };

const DEFINICION: { titulo: string; cats: string[] }[] = [
  { titulo: 'Marketing y presencia digital', cats: ['SEO', 'SEO Local', 'Estrategia', 'Marketing', 'Publicidad'] },
  { titulo: 'Diseño y desarrollo', cats: ['Diseño', 'Desarrollo', 'Innovación', 'IA', 'Eventos'] },
];

/* Las landings de ciudad (categoria Cobertura) NO van al menu ni al catalogo:
   existen para quien las busca por su ciudad, y se alcanzan desde el bloque
   de cobertura del inicio. Meterlas al menu solo lo alargaria. */
export const esCobertura = (s: Service) => s.category === 'Cobertura';

export function agruparServicios(todos: Service[]): Grupo[] {
  const servicios = todos.filter((s) => !esCobertura(s));
  const grupos: Grupo[] = DEFINICION.map((g) => ({
    ...g,
    items: servicios
      .filter((s) => g.cats.includes(s.category))
      .sort((a, b) => g.cats.indexOf(a.category) - g.cats.indexOf(b.category)),
  }));
  const asignados = new Set(grupos.flatMap((g) => g.items.map((s) => s.slug)));
  grupos[grupos.length - 1].items.push(...servicios.filter((s) => !asignados.has(s.slug)));
  return grupos.filter((g) => g.items.length > 0);
}
