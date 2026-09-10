/*
 * Las escenas que existen, sin cargar ninguna.
 *
 * El deck necesita saber si una lámina tiene animación para decidir cómo se
 * acomoda, pero importar registro.ts arrastraría Remotion y las diez escenas
 * al paquete del deck, que las carga en diferido. Esta lista no pesa nada.
 *
 * registro.ts se tipa contra ella: si se añade una escena allá y no aquí, o al
 * revés, TypeScript no compila. El panel lleva su propia lista con nombres
 * para humanos en panel/inc/presentacion.php; al añadir una escena, también.
 */
export const ESCENAS_DISPONIBLES = [
  'web',
  'ecommerce',
  'posicionamiento',
  'local',
  'publicidad',
  'espectaculares',
  'agentes',
  'ventas',
  'auditoria',
  'tablero',
] as const;

export type NombreEscena = (typeof ESCENAS_DISPONIBLES)[number];

export const hayEscena = (n: string): n is NombreEscena =>
  (ESCENAS_DISPONIBLES as readonly string[]).includes(n);
