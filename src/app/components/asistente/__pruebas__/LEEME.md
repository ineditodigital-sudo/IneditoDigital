# Pruebas del emparejador del asistente

`casos.mjs` recorre frases reales contra el mismo orden de decisión que usa
`AIAssistant.tsx`, y comprueba también que `mismaRaiz()` no confunda palabras
que solo comparten el principio ("marca" no es "marcador").

Cada vez que alguien reporte una pregunta que el asistente no entiende, el
sitio correcto para dejarla es aquí: primero se añade el caso, luego se
arregla. Así no se rompe lo que ya funcionaba — que es exactamente lo que pasó
al arreglar "me pueden llamar" y romper "cómo te llamas".

## Correr

```bash
npx esbuild src/app/components/asistente/intenciones.ts --bundle --format=esm --outfile=/tmp/int.mjs
npx esbuild src/app/data/services.ts --bundle --format=esm --outfile=/tmp/svc.mjs
node src/app/components/asistente/__pruebas__/casos.mjs
```

Los dos servicios nuevos (`ficha-de-google`, `auditoria-con-ia`) solo existen en
la base de datos, no en `data/services.ts`. El archivo de pruebas los añade a
mano para que la prueba se parezca a producción; sin eso da un falso negativo.
