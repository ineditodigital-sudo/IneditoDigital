# -*- coding: utf-8 -*-
"""Prepara los logotipos de las IA para el sitio.

Los cinco originales son oscuros: están hechos para fondo claro y sobre el
negro del sitio no se verían. Se genera la versión en blanco conservando el
canal alfa, que es el tratamiento que las propias marcas prevén para fondos
oscuros ("reverse logo").

De paso se reducen: el de Gemini venía a 10240 px y 1,2 MB, que es absurdo para
mostrarlo a 28 px de alto.
"""
import io, os
from PIL import Image

ORIG = {
    'openai':     'marca/LOGO CHATGPTpng.png',
    'claude':     'marca/LOGO CLAUDEwebp.webp',
    'gemini':     'marca/LOGO GEMINI.png',
    'perplexity': 'marca/LOPGO PERPLEXITY.webp',
    'copilot':    'marca/LOGO COPILOR.png',
}

SALIDA = 'public/logos-ia'
ALTO = 96          # se muestran a ~28-32 px: 96 cubre pantallas a 3x
os.makedirs(SALIDA, exist_ok=True)

print('  %-12s %-16s %-16s %s' % ('MARCA', 'ORIGINAL', 'RESULTADO', 'PESO'))
for clave, archivo in ORIG.items():
    if not os.path.exists(archivo):
        print('  %-12s FALTA: %s' % (clave, archivo))
        continue
    im = Image.open(archivo).convert('RGBA')
    orig = f'{im.width}x{im.height}'

    # recortar el margen transparente: los originales traen aire alrededor y
    # sin quitarlo cada logo se ve de un tamano distinto en la fila
    caja = im.getchannel('A').getbbox()
    if caja:
        im = im.crop(caja)

    ancho = max(1, round(im.width * ALTO / im.height))
    im = im.resize((ancho, ALTO), Image.LANCZOS)

    # blanco puro conservando el alfa: el trazado se mantiene, el color no
    alfa = im.getchannel('A')
    blanco = Image.new('RGBA', im.size, (255, 255, 255, 0))
    blanco.putalpha(alfa)

    destino = f'{SALIDA}/{clave}.webp'
    blanco.save(destino, 'WEBP', lossless=True, quality=90)
    peso = os.path.getsize(destino)
    print('  %-12s %-16s %-16s %5.1f KB' % (clave, orig, f'{ancho}x{ALTO}', peso / 1024))

# el ancho relativo hace falta en el componente para no deformarlos
print('\n  Proporciones (ancho/alto), para el componente:')
for clave in ORIG:
    d = f'{SALIDA}/{clave}.webp'
    if os.path.exists(d):
        im = Image.open(d)
        print('    %-12s %.3f' % (clave, im.width / im.height))
