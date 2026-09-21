import DynamicSEO from './DynamicSEO';
import { FichaServicio, type Ficha } from './FichaServicio';
import { contenido } from '../cms';

/*
 * Una página de servicio de IA (/servicios-ia/…), con el diseño y la
 * estructura de cualquier servicio.
 *
 * El contenido sigue donde estaba: en el panel, Páginas › IA para WhatsApp,
 * IA de Ventas, etc. Esto solo lo acomoda en la ficha de components/
 * FichaServicio, así que cualquier mejora a las fichas de servicio llega sola
 * a estas cuatro.
 *
 * Los respaldos son lo que se ve si un campo está vacío, y tienen que decir
 * lo mismo que los `def` del registro (panel/inc/contenido.php): al publicar
 * desde el panel ganan los `def`, y si no coinciden la página cambia sola.
 */

export interface RespaldosIA {
  /** El nombre del servicio: el título grande. */
  etiqueta: string;
  bajada: string;
  incluye: string[];
  /** [título, explicación] de cada punto de «Lo que ganas». */
  beneficios: [string, string][];
  /** [nombre, descripción] de cada paso del proceso. */
  pasos: [string, string][];
  ideal: string[];
}

/** El cierre es el mismo en las cuatro. */
const CIERRE = {
  titulo: '¿LISTO PARA AUTOMATIZAR?',
  bajada: 'Cotiza este servicio y descubre cómo puede transformar tu negocio',
  boton: 'COTIZAR AHORA',
};

const rango = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export function PaginaServicioIA({
  pagina,
  claveMenu,
  nombre,
  seo,
  respaldos,
}: {
  /** El slug de la página en el panel, y también el de su escena del proceso. */
  pagina: string;
  /** Su renglón en el submenú de Servicios IA, de donde sale el nombre para WhatsApp. */
  claveMenu: string;
  nombre: string;
  seo: { title: string; description: string; keywords: string[] };
  respaldos: RespaldosIA;
}) {
  const tPor = contenido(pagina, 'portada');
  const tCtx = contenido(pagina, 'contexto');
  const tInc = contenido(pagina, 'incluye');
  const tBen = contenido(pagina, 'beneficios');
  const tHow = contenido(pagina, 'como_funciona');
  const tIde = contenido(pagina, 'ideal_para');
  const tFaq = contenido(pagina, 'faq');
  const tCie = contenido(pagina, 'cierre');
  const tEnc = contenido('servicio-detalle', 'encabezados');

  /* El nombre como se escribe en una frase («IA de Ventas»), no en mayúsculas
     como el título: va en el mensaje de WhatsApp y en el asistente. */
  const nombreServicio = contenido('marca', 'menu_ia')(claveMenu, nombre);

  const ficha: Ficha = {
    slug: pagina,
    titulo: tPor('etiqueta', respaldos.etiqueta),
    categoria: tEnc('categoria_ia', 'IA'),
    bajada: tPor('bajada', respaldos.bajada),
    definicion: tCtx('definicion', '') || undefined,
    volver: { a: '/servicios-ia', texto: tEnc('volver_ia', 'Volver a Servicios IA') },
    incluye: rango(8)
      .map((i) => tInc(`f${i}`, respaldos.incluye[i - 1] ?? ''))
      .filter(Boolean),
    beneficios: tBen.visible()
      ? rango(6)
          .map((i) => ({
            titulo: tBen(`b${i}_titulo`, respaldos.beneficios[i - 1]?.[0] ?? ''),
            texto: tBen(`b${i}_texto`, respaldos.beneficios[i - 1]?.[1] ?? ''),
          }))
          .filter((b) => b.titulo)
      : [],
    proceso: tHow.visible()
      ? rango(4)
          .map((i) => ({
            title: tHow(`p${i}_titulo`, respaldos.pasos[i - 1]?.[0] ?? ''),
            description: tHow(`p${i}_texto`, respaldos.pasos[i - 1]?.[1] ?? ''),
          }))
          .filter((p) => p.title)
          .map((p, i) => ({ step: i + 1, ...p }))
      : [],
    ideal: tIde.visible()
      ? rango(8)
          .map((i) => tIde(`i${i}`, respaldos.ideal[i - 1] ?? ''))
          .filter(Boolean)
      : [],
    fondo: tCtx('texto_largo', '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    faq: rango(8)
      .map((i) => ({ question: tFaq(`q${i}`, ''), answer: tFaq(`r${i}`, '') }))
      .filter((f) => f.question && f.answer),
    nombre: nombreServicio,
    contextoCotizar: `cotizar ${nombreServicio}`,
    boton: tCie('boton', CIERRE.boton),
    cierre: { titulo: tCie('titulo', CIERRE.titulo), texto: tCie('bajada', CIERRE.bajada) },
  };

  return (
    <>
      <DynamicSEO title={seo.title} description={seo.description} keywords={seo.keywords} />
      <FichaServicio ficha={ficha} />
    </>
  );
}
