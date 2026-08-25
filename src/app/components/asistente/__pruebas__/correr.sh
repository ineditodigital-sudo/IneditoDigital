#!/bin/bash
# Compila el emparejador y los servicios a ESM y corre los casos.
cd "$(dirname "$0")/../../../../.." || exit 1
D=src/app/components/asistente/__pruebas__
mkdir -p "$D/.compilado"
npx esbuild src/app/components/asistente/intenciones.ts --bundle --format=esm --outfile="$D/.compilado/int.mjs" --log-level=error || exit 1
npx esbuild src/app/data/services.ts --bundle --format=esm --outfile="$D/.compilado/svc.mjs" --log-level=error || exit 1
node "$D/casos.mjs"
