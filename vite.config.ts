import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { BASE } from './src/app/components/presentacion/contenido'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/*
 * El respaldo de la presentación, publicado como archivo.
 *
 * El editor del panel (PHP) necesita el texto de base para arrancar la primera
 * vez, antes de que nadie haya publicado nada. En vez de mantener una copia a
 * mano en PHP —que es justo la trampa en la que ya cayeron los textos de la
 * portada—, el build escribe /presentacion-base.json desde el mismo
 * contenido.ts que usa el deck. deploy.sh lo sube con el resto de la raiz de
 * dist/ y el panel lo lee de ahí.
 */
function presentacionBase(): Plugin {
  const json = () => JSON.stringify(BASE)
  return {
    name: 'presentacion-base',
    configureServer(server) {
      server.middlewares.use('/presentacion-base.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(json())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'presentacion-base.json', source: json() })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    presentacionBase(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  /*
   * En local no hay PHP, y el catalogo de espectaculares es lo unico que la
   * pagina no puede dibujar sin el: son 317 registros que solo existen en la
   * base de produccion. Se apunta ESE archivo, y ninguno mas, al sitio
   * publicado. Los demas endpoints se quedan sin proxy a proposito: enviar el
   * formulario desde el escritorio crearia un lead de verdad.
   */
  server: {
    proxy: {
      '/api/espectaculares.php': {
        target: 'https://inedito.digital',
        changeOrigin: true,
      },
    },
    /*
     * El servidor de desarrollo sirve CUALQUIER archivo de la carpeta del
     * proyecto, y en la raiz viven credenciales que git ignora pero que
     * siguen en disco: localhost:5173/deploy.env devolvia la llave del FTP.
     * Las primeras cuatro son las que Vite trae por defecto; declarar la
     * lista la reemplaza entera, asi que van repetidas.
     */
    fs: {
      deny: [
        '.env', '.env.*', '*.{crt,pem}', '**/.git/**',
        'deploy.env', '*CLAVES*', '*claves*', '*credencial*', '*client_secret*',
        '**/api/config.php', '**/panel/config.php',
      ],
    },
  },
})
