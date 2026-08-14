# Actualización del Chatbot: Campo de Empresa

## Cambios Implementados

Se agregó la pregunta sobre la **empresa** en el flujo del chatbot de captura de leads, permitiendo obtener información más completa de los prospectos.

### ✅ Modificaciones Realizadas

#### 1. AIAssistant.tsx
**Archivo:** `/src/app/components/AIAssistant.tsx`

**Cambios:**
- ✅ Agregado nuevo step `'company'` al tipo Step
- ✅ Agregado campo `company: ''` al estado leadData
- ✅ Implementada la pregunta después del teléfono y antes del objetivo
- ✅ Mensaje contextual para freelancers e independientes
- ✅ Actualizado el mensaje de WhatsApp para incluir la empresa
- ✅ Actualizado el mensaje guardado en leads para incluir la empresa

**Flujo de preguntas actualizado:**
1. Servicio de interés
2. Nombre
3. Email
4. Teléfono
5. **🆕 Empresa** (nuevo)
6. Objetivo principal
7. Presupuesto
8. Urgencia

**Texto de la pregunta:**
```
"¿De qué empresa nos contactas?"
"💡 Si eres freelancer o emprendedor independiente, escribe el nombre de tu proyecto o 'Independiente'."
```

#### 2. Mensaje de WhatsApp Actualizado
```
*NUEVO LEAD - INÉDITO DIGITAL* 🚀

👤 *Nombre:* [Nombre]
🏢 *Empresa:* [Empresa]  ← NUEVO

📋 *INFORMACIÓN DEL PROSPECTO*
━━━━━━━━━━━━━━━━━━━━
...
```

#### 3. Datos Guardados en Leads
El mensaje guardado ahora incluye:
```
Empresa: [empresa] | Servicio: [servicio] | Objetivo: [objetivo] | Presupuesto: [presupuesto] | Urgencia: [urgencia]
```

#### 4. Panel de Administración
**Archivo:** `/src/app/pages/admin/AdminLeadsPage.tsx`

**Estado:** ✅ Ya estaba preparado para mostrar el campo de empresa
- Muestra la empresa debajo del email y teléfono
- Incluye la empresa en la exportación CSV

### 🎯 Beneficios

1. **Mejor calificación de leads**: Conocer la empresa ayuda a priorizar y contextualizar
2. **Personalización mejorada**: El equipo de ventas puede investigar la empresa antes de contactar
3. **Datos más completos**: Información completa para análisis y seguimiento
4. **Flexibilidad**: Acepta tanto empresas como proyectos independientes

### 📊 Estructura de Datos

```typescript
interface LeadData {
  name: string;
  email: string;
  phone: string;
  company: string;     // ← NUEVO
  service: string;
  objective: string;
  budget: string;
  urgency: string;
}
```

### 🧪 Testing

Para probar la funcionalidad:

1. Abrir el asistente virtual desde cualquier página
2. Seguir el flujo de preguntas
3. Después del teléfono, verás la pregunta de empresa
4. Completar el flujo hasta el final
5. Verificar en `/admin/dashboard/leads` que la empresa aparece
6. Probar el botón de WhatsApp y verificar que incluye la empresa

### 📝 Notas

- La pregunta es **obligatoria** (el usuario debe responder para continuar)
- Se acepta cualquier texto como respuesta válida
- El campo se muestra en el panel de admin solo si tiene contenido
- Se exporta en el CSV aunque esté vacío (para leads antiguos)

### 🔄 Compatibilidad

- ✅ Compatible con leads antiguos (no tienen empresa, aparece vacío)
- ✅ No afecta el funcionamiento de leads existentes
- ✅ El export CSV maneja correctamente leads con/sin empresa
