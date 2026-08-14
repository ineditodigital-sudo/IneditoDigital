# Optimizaciones de LCP y TBT - PageSpeed Insights

## Problema Identificado
Los errores `NO_LCP` (Largest Contentful Paint) y `NO_LCP` (Total Blocking Time) en PageSpeed Insights indicaban que Google no podía detectar el elemento principal de contenido en la página.

## Causas Principales
1. **Contenido invisible al inicio**: Los elementos críticos (logo, h1) comenzaban con `opacity: 0` debido a animaciones CSS
2. **Falta de preload de recursos críticos**: No se estaban precargando el logo ni la fuente Hanson
3. **Animaciones bloqueantes**: Las animaciones de Framer Motion iniciaban con opacity 0 en elementos LCP

## Soluciones Implementadas

### 1. Nueva clase CSS para elementos LCP (`animate-fadeIn-lcp`)
**Archivo**: `/src/styles/theme.css`

```css
/* Variante de fadeIn para LCP - visible desde el inicio */
.animate-fadeIn-lcp {
  animation: fade-in-lcp 0.6s ease-out forwards;
}

@keyframes fade-in-lcp {
  from {
    transform: translateY(10px);
  }
  to {
    transform: translateY(0);
  }
}
```

**Beneficio**: Los elementos críticos son visibles desde el inicio (no opacity: 0), solo animan la posición.

### 2. Optimización del Logo
**Archivo**: `/src/app/components/HeroBento.tsx`

Cambios en versión móvil:
```tsx
<img 
  src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp"
  alt="INÉDITO DIGITAL - Agencia de Marketing Digital en Aguascalientes"
  className="w-32 h-auto mx-auto"
  width="128"           // ✅ Dimensiones explícitas
  height="40"           // ✅ Dimensiones explícitas
  fetchPriority="high"  // ✅ Prioridad alta para LCP
/>
```

**Beneficios**:
- `width` y `height` explícitos permiten al navegador reservar espacio antes de cargar
- `fetchPriority="high"` prioriza la descarga del logo
- Alt text mejorado con keyword objetivo

### 3. Título h1 visible inmediatamente
**Archivo**: `/src/app/components/HeroBento.tsx`

**Versión móvil**:
```tsx
{/* Título Principal - CRÍTICO PARA LCP */}
<h1 className="heading mb-4">
  {/* Sin clase animate-fadeIn (que tenía opacity: 0) */}
  <span className="block text-white mb-2 text-[28px] leading-tight">
    AGENCIA DE
  </span>
  {/* ... resto del contenido */}
</h1>
```

**Versión desktop**:
```tsx
<motion.div
  initial={{ opacity: 1, x: -20 }}  // ✅ Cambio: opacity 1 desde el inicio
  animate={{ opacity: 1, x: 0 }}     // ✅ Solo anima posición
  transition={{ duration: 0.5 }}      // ✅ Reducido de 0.8s
>
  <h1 className="heading ...">
    {/* Contenido visible inmediatamente */}
  </h1>
</motion.div>
```

### 4. Componente CriticalResourceHints
**Archivo**: `/src/app/components/CriticalResourceHints.tsx` (NUEVO)

Funcionalidades:
- ✅ Viewport meta tag optimizado
- ✅ Theme-color para navegadores móviles
- ✅ Preconnect a CDN de imágenes
- ✅ DNS-prefetch como fallback
- ✅ Preload del logo con `fetchpriority="high"`
- ✅ Preload de la fuente Hanson con `crossorigin`

```tsx
// Preload del logo (LCP crítico)
const preloadLogo = document.createElement('link');
preloadLogo.rel = 'preload';
preloadLogo.as = 'image';
preloadLogo.href = 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp';
preloadLogo.setAttribute('fetchpriority', 'high');

// Preload de la fuente Hanson
const preloadFont = document.createElement('link');
preloadFont.rel = 'preload';
preloadFont.as = 'font';
preloadFont.type = 'font/woff2';
preloadFont.href = 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Hanson-Bold.woff2';
preloadFont.crossOrigin = 'anonymous';
```

### 5. Integración en RootLayout
**Archivo**: `/src/app/layouts/RootLayout.tsx`

```tsx
import CriticalResourceHints from '../components/CriticalResourceHints';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <CriticalResourceHints /> {/* ✅ Carga resource hints al inicio */}
      <Header />
      {/* ... */}
    </div>
  );
}
```

### 6. Optimización de fuente Hanson
**Archivo**: `/src/styles/fonts.css`

```css
@font-face {
  font-family: 'Hanson';
  src: url('https://imagenes.inedito.digital/INEDITO%20DIGITAL/Hanson-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap; /* ✅ Evita bloqueo de renderizado */
}
```

## Métricas Mejoradas

### Antes
- ❌ LCP: NO_LCP (error crítico)
- ❌ TBT: NO_LCP (error crítico)
- ⚠️ Recursos críticos sin priorizar
- ⚠️ Contenido invisible al inicio

### Después
- ✅ Logo visible inmediatamente con dimensiones explícitas
- ✅ H1 visible desde el inicio (sin opacity: 0)
- ✅ Recursos críticos precargados (logo + fuente)
- ✅ Conexiones DNS/preconnect optimizadas
- ✅ Animaciones no bloquean visibilidad
- ✅ Font-display: swap evita FOIT

## Recomendaciones Adicionales

### Para mejorar aún más:
1. **Considerar CDN** para assets estáticos si el servidor responde lento
2. **Optimizar imágenes de Unsplash**: Usar parámetro `&w=` para cargar tamaños específicos
3. **Lazy loading** para imágenes del Bento Grid (no LCP)
4. **Reducir Motion en móviles**: Considerar `prefers-reduced-motion` para usuarios que lo prefieran

### Monitoreo:
- Ejecutar PageSpeed Insights nuevamente en móvil y desktop
- Verificar que LCP sea < 2.5s (verde)
- Verificar que TBT sea < 200ms (verde)
- Confirmar que el h1 sea detectado como elemento LCP

## Cambios en Archivos

### Archivos Modificados:
- ✅ `/src/styles/theme.css` - Nueva clase animate-fadeIn-lcp
- ✅ `/src/app/components/HeroBento.tsx` - Logo optimizado, h1 visible
- ✅ `/src/styles/fonts.css` - font-display: swap
- ✅ `/src/app/layouts/RootLayout.tsx` - Integra CriticalResourceHints

### Archivos Nuevos:
- ✅ `/src/app/components/CriticalResourceHints.tsx` - Preload de recursos críticos

## Testing

### Cómo verificar las mejoras:

1. **PageSpeed Insights**:
   ```
   https://pagespeed.web.dev/
   ```
   - Analizar versión móvil
   - Analizar versión desktop
   - Verificar que LCP y TBT muestren valores verdes

2. **Chrome DevTools**:
   - Abrir DevTools > Performance
   - Grabar carga de página
   - Verificar que LCP sea el h1 o el logo
   - Confirmar tiempo < 2.5s

3. **Lighthouse CLI**:
   ```bash
   npx lighthouse https://tu-sitio.com --view
   ```

## Impacto SEO

Estas optimizaciones mejoran directamente:
- ✅ **Core Web Vitals** (factor de ranking de Google)
- ✅ **Experiencia de usuario** en móviles
- ✅ **Tasa de rebote** (contenido visible más rápido)
- ✅ **Tiempo de carga percibido**
- ✅ **Accesibilidad** (dimensiones explícitas, alt text)

---

**Fecha de optimización**: Diciembre 2024  
**Objetivo**: Resolver errores NO_LCP en PageSpeed Insights  
**Status**: ✅ Completado
