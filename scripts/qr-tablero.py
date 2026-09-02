# -*- coding: utf-8 -*-
"""El QR del tablero de demostración, con el isotipo al centro.

Corrección de errores en H (recupera el 30%), que es lo que permite tapar el
centro sin que deje de leerse. El isotipo ocupa el 22% del lado: como el daño
va con el cuadrado, eso es un 4.8% de los módulos, muy por debajo del margen.

Sale en PNG grande para imprimir y en SVG para cualquier tamaño. Al final se
vuelve a leer con un decodificador de verdad, y no solo el archivo limpio:
también chico, desenfocado, con ruido, torcido y en blanco y negro. Si no se
puede decodificar, el archivo no sirve por bonito que se vea.
"""
import base64, io, os
import numpy as np
import segno
import cv2
from PIL import Image, ImageDraw, ImageFilter

URL = 'https://www.inedito.digital/demo/tablero'
MORADO = '#7700CE'
SALIDA = 'marca'
LADO = 2400          # px del PNG, suficiente para imprimir a tamaño cartel
HUECO = 0.22         # parte del lado que ocupa la placa blanca del centro
ISO = 0.70           # parte de la placa que ocupa el isotipo

os.makedirs(SALIDA, exist_ok=True)

qr = segno.make(URL, error='h')
print(f'  version {qr.version}, correccion {qr.error.upper()}')
print(f'  {URL}')

# ---------------------------------------------------------------- PNG
tmp = io.BytesIO()
qr.save(tmp, kind='png', scale=20, border=4, dark=MORADO, light='#FFFFFF')
tmp.seek(0)
base = Image.open(tmp).convert('RGBA').resize((LADO, LADO), Image.NEAREST)

# La placa: cuadrado blanco de esquinas redondeadas con el isotipo dentro.
hueco = int(LADO * HUECO)
placa = Image.new('RGBA', (hueco, hueco), (0, 0, 0, 0))
ImageDraw.Draw(placa).rounded_rectangle(
    [0, 0, hueco - 1, hueco - 1], radius=int(hueco * 0.22), fill=(255, 255, 255, 255)
)
iso = Image.open('public/favicon-192.png').convert('RGBA')
lado_iso = int(hueco * ISO)
iso = iso.resize((lado_iso, lado_iso), Image.LANCZOS)
placa.alpha_composite(iso, ((hueco - lado_iso) // 2, (hueco - lado_iso) // 2))

base.alpha_composite(placa, ((LADO - hueco) // 2, (LADO - hueco) // 2))
png = f'{SALIDA}/qr-tablero-demo.png'
base.convert('RGB').save(png, 'PNG', optimize=True)
print(f'  {png}  {LADO}x{LADO}  {os.path.getsize(png)/1024:.0f} KB')

# ---------------------------------------------------------------- SVG
# Vectorial para imprimir a cualquier tamaño. El isotipo va incrustado en
# base64 para que el archivo viaje solo.
svg = io.BytesIO()
qr.save(svg, kind='svg', scale=1, border=4, dark=MORADO, light='#FFFFFF',
        svgclass=None, lineclass=None, xmldecl=True, svgns=True)
texto = svg.getvalue().decode('utf-8')

lado_svg = qr.symbol_size(scale=1, border=4)[0]
h = lado_svg * HUECO
x = (lado_svg - h) / 2
b64 = base64.b64encode(open('public/favicon-192.png', 'rb').read()).decode()
iso_lado = h * ISO
iso_pos = (lado_svg - iso_lado) / 2
texto = texto.replace('</svg>', (
    f'<rect x="{x:.3f}" y="{x:.3f}" width="{h:.3f}" height="{h:.3f}" '
    f'rx="{h * 0.22:.3f}" fill="#FFFFFF"/>'
    f'<image x="{iso_pos:.3f}" y="{iso_pos:.3f}" width="{iso_lado:.3f}" height="{iso_lado:.3f}" '
    f'href="data:image/png;base64,{b64}"/></svg>'
))
ruta_svg = f'{SALIDA}/qr-tablero-demo.svg'
open(ruta_svg, 'w', encoding='utf-8').write(texto)
print(f'  {ruta_svg}  {os.path.getsize(ruta_svg)/1024:.0f} KB')

# ------------------------------------------------------------ comprobar
det = cv2.QRCodeDetector()


def leer(im):
    arr = cv2.cvtColor(np.array(im.convert('RGB')), cv2.COLOR_RGB2BGR)
    try:
        return det.detectAndDecode(arr)[0]
    except cv2.error:
        return ''


def con_ruido(im, cantidad=18):
    a = np.array(im.convert('RGB')).astype(np.int16)
    a += np.random.default_rng(7).integers(-cantidad, cantidad, a.shape, dtype=np.int16)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


chico = base.resize((300, 300), Image.LANCZOS)
casos = [
    ('archivo completo, 2400 px', base),
    ('impreso chico, 300 px', chico),
    ('camara mala, 150 px', base.resize((150, 150), Image.LANCZOS)),
    ('desenfocado', chico.filter(ImageFilter.GaussianBlur(1.4))),
    ('con ruido de camara', con_ruido(chico)),
    ('torcido 12 grados', chico.rotate(12, resample=Image.BICUBIC, expand=True, fillcolor='white')),
    ('fotocopia en gris', chico.convert('L').convert('RGB')),
]
print('\n  SE LEE:')
todo = True
for etiqueta, im in casos:
    ok = leer(im) == URL
    todo = todo and ok
    print(f'    {etiqueta:<28} {"si" if ok else "NO"}')
print('\n  ' + ('Pasa los siete casos.' if todo else 'HAY CASOS QUE NO SE LEEN.'))
