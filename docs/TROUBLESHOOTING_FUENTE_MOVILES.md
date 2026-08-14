# 🔧 Troubleshooting: Fuente Hanson en Móviles

## ✅ SOLUCIÓN IMPLEMENTADA

He implementado un sistema robusto de 5 capas para garantizar que la fuente Hanson se cargue en todos los dispositivos móviles:

### 1️⃣ **FontPreloader.tsx**
- Inyecta `<link preload>` al inicio del `<head>` (máxima prioridad)
- Añade `preconnect` y `dns-prefetch` a `imagenes.inedito.digital`
- Se ejecuta ANTES que cualquier otro componente

### 2️⃣ **fonts.css**
- Usa `font-display: block` para forzar la espera de la fuente
- Doble declaración `@font-face` con `@supports` para máxima compatibilidad
- Configuración optimizada para móviles (Android + iPhone)

### 3️⃣ **FontLoader.tsx**
- Detecta si la fuente ya está en caché (iOS)
- Crea elemento invisible de prueba para forzar la carga
- Usa Font Loading API + FontFace API como fallback
- Timeout de 3 segundos para aplicar fallback si falla

### 4️⃣ **theme.css**
- Fallback a `'Inter', 'Arial Black'` si Hanson no carga
- Clases `.fonts-loaded`, `.fonts-failed`, `.fonts-timeout` para control

### 5️⃣ **FontDebugger.tsx** (NUEVO)
- Muestra en pantalla el estado de carga de la fuente
- Útil para diagnosticar problemas en móvil real
- Solo visible en desarrollo o con `?debug=1` en la URL

---

## 🧪 CÓMO PROBAR EN TU MÓVIL

### Paso 1: Abre el sitio en tu móvil
```
https://tu-sitio.com
```

### Paso 2: Añade el parámetro debug
```
https://tu-sitio.com?debug=1
```

### Paso 3: Verás una caja flotante en la esquina inferior derecha

La caja mostrará:
- ✅ **Verde** = Fuente cargada correctamente
- ⚠️ **Amarillo** = Verificando o usando fallback
- ❌ **Rojo** = Error de carga

También verás:
```
HANSON TEST
```
Si este texto se ve en **MAYÚSCULAS BOLD**, la fuente funciona. ✅

---

## 🚨 SI LA FUENTE NO SE MUESTRA

### Problema 1: Error de CORS
**Síntoma**: En DevTools (Chrome móvil) ves:
```
Access to font at 'https://imagenes.inedito.digital/Hanson-Bold.woff2' 
has been blocked by CORS policy
```

**Solución**: El servidor `imagenes.inedito.digital` debe responder con estos headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

**Cómo verificar**:
1. Abre Chrome en móvil
2. Ve a `chrome://inspect`
3. Inspecciona la página
4. Pestaña Network → busca `Hanson-Bold.woff2`
5. Si status es 200 pero hay error CORS → el servidor necesita configuración

### Problema 2: URL inaccesible
**Síntoma**: El archivo no se descarga o da 404

**Solución A - Verificar URL**:
Abre directamente en el navegador del móvil:
```
https://imagenes.inedito.digital/Hanson-Bold.woff2
```

Si se descarga → La URL funciona ✅
Si da error 404 → La URL está mal ❌

**Solución B - Alojar localmente**:
Si la URL no funciona, descarga el archivo y colócalo en:
```
/public/fonts/Hanson-Bold.woff2
```

Luego actualiza estos archivos:

**`/src/styles/fonts.css`**:
```css
@font-face {
  font-family: 'Hanson';
  src: url('/fonts/Hanson-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: block;
}
```

**`/src/app/components/FontPreloader.tsx`**:
```typescript
preloadLink.href = '/fonts/Hanson-Bold.woff2';
```

**`/src/app/components/FontLoader.tsx`** (línea 66):
```typescript
'url(/fonts/Hanson-Bold.woff2) format("woff2")',
```

### Problema 3: Formato incompatible
**Síntoma**: Android o iPhone no soportan WOFF2

**Solución**: WOFF2 es soportado por:
- ✅ iOS Safari 10+ (iPhone 5 en adelante)
- ✅ Android Chrome 36+ (Android 5.0 en adelante)
- ✅ 98% de navegadores móviles

Si tu dispositivo es muy antiguo, necesitas formato TTF/OTF adicional.

### Problema 4: Caché del navegador
**Síntoma**: La fuente funcionaba antes pero ahora no

**Solución**:
1. Abre el sitio en móvil
2. Menú → Configuración
3. Borrar datos de navegación → Caché
4. Recarga la página (pull to refresh)

---

## 📊 DATOS DEL DEBUGGER

El `FontDebugger` mostrará info como:

```
✅ Font Loading API disponible
⚠️ Fuente Hanson NO detectada inicialmente
✅ Fuente Hanson lista después de fonts.ready
✅ <link preload> encontrado en <head>
📊 Font-family computada: Hanson, sans-serif
📱 Device: Móvil
```

Si ves `❌` en varios checks, hay un problema de red o CORS.

---

## 🎯 ALTERNATIVA: Usar fuente similar gratuita

Si después de todo esto la fuente Hanson no funciona, puedo implementar una fuente similar de Google Fonts que SÍ funciona 100%:

### Bebas Neue (muy similar a Hanson)
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
```

### Oswald Bold (condensada, mayúsculas)
```css
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
```

### Anton (bold, impacto)
```css
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
```

Todas tienen estética similar a Hanson y funcionan en el 100% de dispositivos.

---

## 📞 PRÓXIMOS PASOS

1. **Abre el sitio en tu móvil con `?debug=1`**
2. **Toma captura de pantalla** del debugger
3. **Comparte la captura** para que pueda ver exactamente qué está fallando
4. **Verifica si la URL funciona** abriéndola directamente en el navegador móvil

Con esa info, puedo darte la solución exacta. 🚀
