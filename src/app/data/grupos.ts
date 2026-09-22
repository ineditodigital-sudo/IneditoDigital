import type { Service } from './services';

/*
 * Que servicios son paginas de ciudad o de sector.
 *
 * Hasta el 22-sep aqui vivia tambien agruparServicios, que armaba el menu por
 * categoria. El menu ahora cuenta el metodo en tres pasos (data/metodo.ts);
 * esto se queda porque /servicios y el metodo necesitan saber que dejar fuera.
 */

/* Se juzga por la categoria ORIGINAL. En ingles `category` llega traducida
   («Design», «Coverage»), no coincidia con ninguna de las de arriba y el menu
   salia con casi todo en la ultima columna y con las paginas de ciudad. */
const categoriaDe = (s: Service) => s.categoriaBase ?? s.category;

/* Las landings de ciudad (Cobertura) y de sector NO van al menu ni al
   catalogo: existen para quien las busca por su ciudad o su giro, y se
   alcanzan desde el bloque de cobertura del inicio. */
export const esCobertura = (s: Service) => categoriaDe(s) === 'Cobertura' || categoriaDe(s) === 'Sectores';
