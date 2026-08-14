# Guía de Troubleshooting de Caché

## Problema Resuelto: Página Solo Aparece en Modo Incógnito

### Síntomas
- Una página específica (ej: activaciones para expo) solo carga en modo incógnito
- En navegación normal la página no aparece o muestra error 404
- El problema persiste después de refrescar el navegador

### Causa Raíz
El problema ocurre cuando el **localStorage del navegador** guarda una versión antigua de los datos que no incluye servicios, páginas o contenido nuevo. Como el modo incógnito tiene localStorage vacío, siempre carga los datos frescos del código.

### Solución Implementada

Se implementó un **sistema de versionado de datos** con las siguientes características:

#### 1. Versionado Automático
```typescript
const DATA_VERSION = '2.0'; // En /src/app/context/AppContext.tsx
```
- Cada vez que se actualiza la estructura de servicios, blog o portafolio, se incrementa esta versión
- Al cargar la app, se valida si la versión en localStorage coincide con la versión del código
- Si hay mismatch, se limpia el caché automáticamente y se usan los datos frescos

#### 2. Validación de Integridad
- Se valida que todos los servicios requeridos existen en localStorage
- Si falta algún servicio, se reemplaza automáticamente con los datos del código
- Se capturan errores de JSON corrupto y se resetea el localStorage

#### 3. Gestión Manual de Caché (Panel Admin)
En `/admin/dashboard/ajustes` se agregaron dos botones:

**Limpiar Caché:**
- Elimina servicios, blog y portafolio cacheados
- Mantiene leads, configuración y sesión de admin
- Útil para problemas de contenido

**Reset Completo:**
- Elimina TODOS los datos del localStorage
- Usar solo en emergencias o para testing
- ⚠️ Elimina leads y configuración

### Cómo Usar

#### Para Usuarios con el Problema
1. **Automático:** Solo recargar la página. El sistema detectará y limpiará el caché antiguo
2. **Manual:** Ir a `/admin/dashboard/ajustes` y usar el botón "Limpiar Caché"

#### Para Desarrolladores
Cuando agregues/modifiques servicios, blog o portafolio:
```typescript
// En /src/app/context/AppContext.tsx
const DATA_VERSION = '2.1'; // Incrementa la versión
```

### Archivos Modificados
- `/src/app/context/AppContext.tsx` - Sistema de versionado y validación
- `/src/app/pages/admin/AdminSettingsPage.tsx` - Herramientas de gestión de caché

### Prevención
Este problema no debería volver a ocurrir porque:
1. ✅ Detección automática de versiones incompatibles
2. ✅ Validación de integridad de datos
3. ✅ Manejo de errores de JSON corrupto
4. ✅ Herramientas de limpieza manual para casos edge

### Testing
Para probar el sistema:
1. Abrir DevTools → Application → Local Storage
2. Modificar manualmente `inedito_services` o `inedito_data_version`
3. Recargar la página
4. Verificar que se detecta el problema y se corrige automáticamente

### Logs
El sistema genera logs en la consola cuando:
- Detecta mismatch de versión: `"Data version mismatch detected. Clearing cached data..."`
- Encuentra servicios faltantes: `"Missing services detected. Using default services..."`
- Encuentra datos corruptos: `"Clearing corrupted localStorage data..."`
