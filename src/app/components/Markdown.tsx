import { Fragment, ReactNode } from 'react';
import { Link } from 'react-router';

/*
 * Renderiza el Markdown que el panel guarda en los articulos.
 *
 * Hasta el 26/08/2026 la pagina del blog pintaba `{post.content}` tal cual con
 * whitespace-pre-line: quien leia un articulo veia "## Subtitulo", los
 * asteriscos de las negritas y las tablas como filas de barras verticales.
 * Googlebot si veia HTML correcto, porque render.php pasa el texto por
 * md_html(); los ocho articulos se veian mal solo para las personas.
 *
 * Este componente hace lo mismo que md_html() en PHP: titulos, listas
 * (con viñeta y numeradas), tablas, negritas, codigo y enlaces. Se mantienen
 * a la par a proposito — si uno entiende algo que el otro no, el articulo se
 * ve distinto segun quien lo lea.
 */

/** Negritas, codigo y enlaces dentro de una linea. */
function enLinea(texto: string, clave: string): ReactNode[] {
  const trozos: ReactNode[] = [];
  // se parte por los tres a la vez para no anidar pasadas
  const partes = texto.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

  partes.forEach((p, i) => {
    const k = `${clave}-${i}`;
    if (!p) return;

    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      trozos.push(<strong key={k} className="font-semibold text-white">{p.slice(2, -2)}</strong>);
      return;
    }
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2) {
      trozos.push(
        <code key={k} className="rounded bg-[#9933FF]/15 px-1.5 py-0.5 text-[0.9em] text-[#CC66FF]">
          {p.slice(1, -1)}
        </code>
      );
      return;
    }
    const enlace = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
    if (enlace) {
      const [, rotulo, destino] = enlace;
      // los internos con Link, para no recargar toda la aplicacion
      if (destino.startsWith('/')) {
        trozos.push(
          <Link key={k} to={destino} className="font-medium text-[#CC66FF] underline underline-offset-2 hover:text-white">
            {rotulo}
          </Link>
        );
      } else {
        trozos.push(
          <a key={k} href={destino} target="_blank" rel="noopener noreferrer"
             className="font-medium text-[#CC66FF] underline underline-offset-2 hover:text-white">
            {rotulo}
          </a>
        );
      }
      return;
    }
    trozos.push(<Fragment key={k}>{p}</Fragment>);
  });

  return trozos;
}

export function Markdown({ texto }: { texto: string }) {
  const lineas = texto.split(/\r?\n/);
  const salida: ReactNode[] = [];
  let i = 0;
  let n = 0;

  const clave = () => `md-${n++}`;

  while (i < lineas.length) {
    const l = lineas[i];
    const t = l.trim();

    if (t === '') { i++; continue; }

    /* separador */
    if (/^---+$/.test(t)) {
      salida.push(<hr key={clave()} className="my-8 border-white/10" />);
      i++;
      continue;
    }

    /* tabla: una fila con barras seguida del separador |---|---| */
    if (t.startsWith('|') && i + 1 < lineas.length && /^\s*\|[\s:|-]+\|\s*$/.test(lineas[i + 1])) {
      const celdas = (f: string) => f.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const cabecera = celdas(t);
      const filas: string[][] = [];
      i += 2;
      while (i < lineas.length && lineas[i].trim().startsWith('|')) {
        filas.push(celdas(lineas[i]));
        i++;
      }
      salida.push(
        <div key={clave()} className="my-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[32rem] border-collapse text-[14.5px]">
            <thead>
              <tr>
                {cabecera.map((c, j) => (
                  <th key={j} className="border-b border-white/10 bg-[#9933FF]/10 px-4 py-3 text-left font-semibold text-white">
                    {enLinea(c, `th${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((f, j) => (
                <tr key={j}>
                  {f.map((c, k) => (
                    <td key={k} className="border-b border-white/[.06] px-4 py-3 align-top text-white/75">
                      {enLinea(c, `td${j}-${k}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    /* titulos */
    const h = /^(#{1,3})\s+(.*)$/.exec(t);
    if (h) {
      const nivel = h[1].length;
      const contenido = enLinea(h[2], clave());
      if (nivel === 1) {
        // el H1 ya lo pinta la pagina con el titulo del articulo
        salida.push(<h2 key={clave()} className="heading mb-4 mt-10 text-2xl md:text-3xl">{contenido}</h2>);
      } else if (nivel === 2) {
        salida.push(<h2 key={clave()} className="heading mb-4 mt-10 text-xl md:text-2xl">{contenido}</h2>);
      } else {
        salida.push(<h3 key={clave()} className="heading mb-3 mt-8 text-lg">{contenido}</h3>);
      }
      i++;
      continue;
    }

    /* listas: con viñeta o numeradas */
    const esVinieta = /^[-*]\s+/.test(t);
    const esNumero = /^\d+\.\s+/.test(t);
    if (esVinieta || esNumero) {
      const items: string[] = [];
      while (i < lineas.length) {
        const c = lineas[i].trim();
        const v = /^[-*]\s+(.*)$/.exec(c);
        const nu = /^\d+\.\s+(.*)$/.exec(c);
        if (esVinieta && v) items.push(v[1]);
        else if (esNumero && nu) items.push(nu[1]);
        else break;
        i++;
      }
      const Lista = esNumero ? 'ol' : 'ul';
      salida.push(
        <Lista key={clave()} className={`mb-5 space-y-2 ${esNumero ? 'list-decimal' : 'list-disc'} pl-5 marker:text-[#CC66FF]`}>
          {items.map((it, j) => (
            <li key={j} className="leading-relaxed text-white/80">{enLinea(it, `li${j}`)}</li>
          ))}
        </Lista>
      );
      continue;
    }

    /* parrafo: se juntan las lineas seguidas */
    const parrafo: string[] = [];
    while (i < lineas.length) {
      const c = lineas[i].trim();
      if (c === '' || /^(#{1,3}\s|[-*]\s|\d+\.\s|\||---+$)/.test(c)) break;
      parrafo.push(c);
      i++;
    }
    salida.push(
      <p key={clave()} className="mb-5 leading-relaxed text-white/80">{enLinea(parrafo.join(' '), clave())}</p>
    );
  }

  return <>{salida}</>;
}
