#!/bin/bash
# ============================================================
# Despliegue a produccion — inedito.digital
#
#   npm run build && bash deploy.sh
#
# Respalda, sube en el orden correcto y verifica. Ver docs/DESPLIEGUE.md.
# Credenciales en deploy.env (ignorado por git). Copiar deploy.env.example.
# ============================================================
set -u
cd "$(dirname "$0")"

[ -f deploy.env ] || { echo "ERROR: falta deploy.env (copia deploy.env.example)"; exit 1; }
# shellcheck disable=SC1091
source ./deploy.env
: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASS:?}"
FTP_PORT="${FTP_PORT:-21}"

[ -f dist/index.html ] || { echo "ERROR: no hay dist/. Ejecuta 'npm run build' primero."; exit 1; }

BASE="ftp://$FTP_HOST:$FTP_PORT"
CURL="curl -sS --ssl-reqd --ftp-ssl-control -k --connect-timeout 20 --max-time 120"
SITE="https://www.inedito.digital"

fput() { $CURL -u "$FTP_USER:$FTP_PASS" -T "$1" "$BASE/$2"; }
# Tamano del archivo tal como esta alla. Sirve para distinguir un fallo de
# verdad de un 451: el host acepta el archivo entero y despues corta la sesion
# con error en su propia comprobacion. Si los bytes coinciden, subio bien.
fsize() { $CURL -u "$FTP_USER:$FTP_PASS" -I "$BASE/$1" 2>/dev/null | tr -d '' | awk -F': ' '/^Content-Length/{print $2}'; }
subir() {
  fput "$1" "$2" >/dev/null 2>&1 && return 0
  fput "$1" "$2" >/dev/null 2>&1 && return 0
  [ "$(fsize "$2")" = "$(wc -c < "$1")" ]
}
fget() { $CURL -u "$FTP_USER:$FTP_PASS" "$BASE/$1" -o "$2"; }

ok()   { printf "  \033[32mok\033[0m   %s\n" "$1"; }
bad()  { printf "  \033[31mFALLO\033[0m %s\n" "$1"; }
step() { printf "\n\033[1m%s\033[0m\n" "$1"; }

# ---------- 1. respaldo ----------
step "1/6  Respaldando produccion"
BK="../RESPALDO-PRODUCCION-$(date +%Y%m%d-%H%M)"
mkdir -p "$BK/api" "$BK/panel"
for f in .htaccess index.html render.php sitemap.php llms.php llms-full.php robots.txt tarjeta.php; do
  fget "public_html/$f" "$BK/$f" 2>/dev/null && [ -s "$BK/$f" ] && ok "$f" || rm -f "$BK/$f"
done
fget "public_html/api/.htaccess"      "$BK/api/.htaccess"      2>/dev/null && ok "api/.htaccess"
fget "public_html/panel/bootstrap.php" "$BK/panel/bootstrap.php" 2>/dev/null && ok "panel/bootstrap.php"
echo "  -> $BK"

# ---------- 2. assets ----------
# Van primero: llevan hash, conviven con los anteriores y no rompen nada.
step "2/6  Subiendo assets"
n=0; err=0
for f in dist/assets/*; do
  subir "$f" "public_html/assets/$(basename "$f")" && n=$((n+1)) || { err=$((err+1)); bad "$(basename "$f")"; }
done
echo "  $n subidos, $err fallos"
[ "$err" -gt 0 ] && { bad "abortando: hay assets sin subir"; exit 1; }

# ---------- 3. raiz de dist ----------
# render.php lee de aqui los hashes, asi que index.html va ANTES que render.php.
# Se sube TODO lo que quede en la raiz de dist/ (index.html, robots.txt y lo que
# Vite copia desde public/: favicons, manifiestos, verificaciones de dominio).
step "3/6  Subiendo index.html y los archivos sueltos"
fput dist/index.html public_html/index.html >/dev/null 2>&1 && ok "index.html"
for f in dist/*; do
  [ -f "$f" ] || continue
  b="$(basename "$f")"
  [ "$b" = "index.html" ] && continue
  fput "$f" "public_html/$b" >/dev/null 2>&1 && ok "$b" || bad "$b"
done

# ---------- 3b. carpetas de dist/ ----------
# El bucle de arriba salta directorios. Asi es como dist/fonts/ se quedo en
# tierra y Hanson dio 404 durante meses. Va generico a proposito: cualquier
# carpeta nueva en public/ (fuentes, logos-ia, lo que venga) sube sola.
step "3b/6 Subiendo carpetas de dist/"
for d in dist/*/; do
  b="$(basename "$d")"
  [ "$b" = "assets" ] && continue          # ya subio en el paso 2
  $CURL -u "$FTP_USER:$FTP_PASS" "$BASE/" -Q "MKD /public_html/$b" >/dev/null 2>&1 || true
  for f in "$d"*; do
    [ -f "$f" ] || continue
    fput "$f" "public_html/$b/$(basename "$f")" >/dev/null 2>&1 && ok "$b/$(basename "$f")" || bad "$b/$(basename "$f")"
  done
done

# ---------- 4. PHP ----------
# render.php va junto con el bundle: si se desfasan, se duplican o se pierden
# los leads. Ver la tabla en docs/DESPLIEGUE.md.
step "4/6  Subiendo PHP"
for f in render.php sitemap.php llms.php llms-full.php; do
  fput "$f" "public_html/$f" >/dev/null 2>&1 && ok "$f"
done
fput api/.htaccess       public_html/api/.htaccess        >/dev/null 2>&1 && ok "api/.htaccess"
fput api/hit.php         public_html/api/hit.php          >/dev/null 2>&1 && ok "api/hit.php"
fput api/evento.php      public_html/api/evento.php       >/dev/null 2>&1 && ok "api/evento.php"
fput tarjeta.php         public_html/tarjeta.php          >/dev/null 2>&1 && ok "tarjeta.php"
# El panel entero, en bucle: cualquier modulo nuevo o tocado sube solo.
# setup.php y api/config.php quedan fuera a proposito.
for f in panel/bootstrap.php panel/index.php panel/login.php panel/logout.php \
         panel/gsc_paso.php panel/google_connect.php panel/google_callback.php \
         panel/inc/*.php panel/pages/*.php panel/cron/*.php; do
  [ -f "$f" ] || continue
  fput "$f" "public_html/$f" >/dev/null 2>&1 && ok "$f"
done
echo "  (api/config.php y panel/setup.php NO se suben, a proposito)"

# ---------- 5. .htaccess ----------
step "5/6  Subiendo .htaccess (con reversion automatica)"
fput .htaccess public_html/.htaccess >/dev/null 2>&1
sleep 3
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/")
if [ "$CODE" != "200" ]; then
  bad "la home devolvio $CODE — restaurando el anterior"
  fput "$BK/.htaccess" public_html/.htaccess >/dev/null 2>&1
  sleep 2
  echo "  restaurado: HTTP $(curl -s -o /dev/null -w '%{http_code}' "$SITE/")"
  exit 1
fi
ok "la home responde 200"

# ---------- 6. verificacion ----------
step "6/6  Verificacion"
P() { printf "  %-34s %s\n" "$1" "$2"; }
P "bundle servido"      "$(curl -s "$SITE/" | grep -o 'assets/index-[^\"]*\.js' | head -1)"
P "apex -> www"         "$(curl -sI https://inedito.digital/ | head -1 | tr -d '\r')"
P "404 real"            "$(curl -sI "$SITE/no-existe-xyz" | head -1 | tr -d '\r')"
P "cabeceras en HTML"   "$(curl -sI "$SITE/" | grep -icE 'x-content|x-frame|referrer|permissions|strict')/5"
P "panel pide login"    "$(curl -sI "$SITE/panel/" | head -1 | tr -d '\r')"
P "config.php bloqueado" "$(curl -sI "$SITE/api/config.php" | head -1 | tr -d '\r')"
P "bot ve HTML"         "$(curl -s -A Googlebot "$SITE/servicios" | grep -c '<main>') bloque main"
P "subdominio ajeno"    "$(curl -s -o /dev/null -w '%{http_code}' https://feria.inedito.digital/)"

printf "\n\033[1mFalta una prueba manual:\033[0m enviar el formulario de contacto y\n"
printf "confirmar que llega UN correo y se crea UN registro en leads.\n"
printf "Si llegan dos, el puente de render.php volvio a colarse.\n"
