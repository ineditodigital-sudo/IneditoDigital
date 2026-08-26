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
