# -*- coding: utf-8 -*-
"""Pone src/app/data/services.ts al dia con la base de datos.

Ese archivo es el respaldo: lo que se ve mientras render.php no ha inyectado
nada, lo que usa el desarrollo local y lo que compilan las pruebas del
asistente. Se habia quedado en 10 servicios mientras la base iba en 16, y por
eso el asistente no encontraba las fichas nuevas en las pruebas aunque en
produccion si funcionan.
"""
import io, json, re, urllib.request

API = 'https://www.inedito.digital/api/content.php?tipo=services'
RUTA = 'src/app/data/services.ts'

peticion = urllib.request.Request(API, headers={'User-Agent': 'Mozilla/5.0 (sincronizar-servicios)'})
with urllib.request.urlopen(peticion, timeout=60) as r:
    servicios = json.load(r)['services']

s = io.open(RUTA, encoding='utf-8').read()
existentes = set(re.findall(r"slug: '([^']+)'", s))
faltan = [x for x in servicios if x['slug'] not in existentes]
print(f'  en la base {len(servicios)} · en el archivo {len(existentes)} · faltan {len(faltan)}')


def ts(v, sangria=4):
    """Serializa a TypeScript con comillas simples, como el resto del archivo."""
    p = ' ' * sangria
    if isinstance(v, str):
        return "'" + v.replace('\\', '\\\\').replace("'", "\\'") + "'"
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        if not v:
            return '[]'
        cuerpo = (',\n' + p + '  ').join(ts(x, sangria + 2) for x in v)
        return '[\n' + p + '  ' + cuerpo + '\n' + p + ']'
    if isinstance(v, dict):
        cuerpo = (',\n' + p + '  ').join(f'{k}: {ts(x, sangria + 2)}' for k, x in v.items())
        return '{\n' + p + '  ' + cuerpo + '\n' + p + '}'
    return 'undefined'


CLAVES = ['id', 'slug', 'title', 'shortDescription', 'definicion', 'icon', 'category',
          'bannerImage', 'features', 'benefits', 'ideal', 'process', 'faq',
          'relatedServices', 'order']

bloques = []
for x in faltan:
    campos = [f'    {k}: {ts(x[k])}' for k in CLAVES if x.get(k) not in (None, '', [])]
    bloques.append('  {\n' + ',\n'.join(campos) + '\n  }')

if bloques:
    cierre = '\n];'
    assert s.rstrip().endswith('];'), s[-40:]
    s = s.rstrip()[:-2].rstrip().rstrip(',') + ',\n' + ',\n'.join(bloques) + '\n];\n'
    io.open(RUTA, 'w', encoding='utf-8', newline='').write(s)
    for x in faltan:
        print(f'    + {x["slug"]}')
print('  listo')
