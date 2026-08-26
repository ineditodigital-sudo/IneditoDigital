/*
 * Vuelca el glosario a public/glosario.json.
 *
 * render.php necesita los términos para el HTML que ve Google y para el schema
 * DefinedTermSet, pero src/ NO se despliega al servidor: deploy.sh solo sube
 * dist/ y los PHP. Este volcado deja el JSON dentro de public/, que Vite copia
 * a dist/, y deploy.sh sube todo lo que hay en la raíz de dist/.
 *
 * Corre como `prebuild`, así que el JSON no se puede quedar viejo: cualquier
 * cambio en glosario.ts entra en el siguiente build.
 */
import { build } from 'esbuild';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const tmp = join(tmpdir(), `glosario-${process.pid}.mjs`);

await build({
  entryPoints: ['src/app/data/glosario.ts'],
  bundle: true,
  format: 'esm',
  outfile: tmp,
  logLevel: 'error',
});

const { GLOSARIO } = await import(pathToFileURL(tmp).href);

const plano = GLOSARIO.flatMap((g) =>
  g.terminos.map((t) => ({
    grupo: g.titulo,
    termino: t.termino,
    siglas: t.siglas ?? null,
    definicion: t.definicion,
    matiz: t.matiz ?? null,
    enlace: t.enlace ?? null,
  }))
);

mkdirSync('public', { recursive: true });
writeFileSync('public/glosario.json', JSON.stringify(plano, null, 2), 'utf8');
rmSync(tmp, { force: true });

console.log(`  glosario.json: ${plano.length} términos en ${GLOSARIO.length} grupos`);
