# Logotipos de terceros

Los originales de las marcas de IA, tal como los descargó el cliente. Son
oscuros: están hechos para fondo claro.

`scripts/logos-ia.py` genera desde aquí las versiones en blanco que usa el
sitio, en `public/logos-ia/`. Recorta el margen transparente (si no, cada logo
se ve de un tamaño distinto en la fila), reduce a 96 px de alto y guarda WebP.

```bash
python3 scripts/logos-ia.py
```

Uso referencial: el sitio dice "trabajamos para que ChatGPT te encuentre", y
para eso hay que poder nombrar a ChatGPT. No se usan como si fueran marcas
propias ni sugiriendo asociación.

## QR del tablero de demostración

`qr-tablero-demo.png` (2400 px, para imprimir) y `qr-tablero-demo.svg`
(vectorial, para cualquier tamaño). Los dos apuntan a
`https://www.inedito.digital/demo/tablero`.

Se generan con `scripts/qr-tablero.py`, que además los vuelve a leer con un
decodificador de verdad en siete condiciones —chico, desenfocado, con ruido,
torcido, en gris— antes de darlos por buenos. Si cambia la dirección del
tablero, se corre otra vez y listo.

Al imprimirlo: 2.5 cm de lado como mínimo para que una cámara lo agarre a
medio metro; para un stand, de 8 cm para arriba. Y hay que respetar el marco
blanco que ya trae alrededor, que es parte del código y no un margen de
diseño.
