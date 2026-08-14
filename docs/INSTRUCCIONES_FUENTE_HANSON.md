# 📝 Instrucciones para instalar la fuente Hanson

## ✅ PASO A PASO - SUPER SIMPLE

### 1️⃣ Descarga la fuente
Abre en tu navegador:
```
https://imagenes.inedito.digital/INEDITO%20DIGITAL/Hanson-Bold.woff2
```
El archivo se descargará automáticamente.

### 2️⃣ Crea la carpeta de fuentes
En la raíz de tu proyecto, navega a:
```
/public/
```
Si no existe la carpeta `fonts`, créala:
```
/public/fonts/
```

### 3️⃣ Copia el archivo
Coloca el archivo descargado (`Hanson-Bold.woff2`) dentro de:
```
/public/fonts/Hanson-Bold.woff2
```

### 4️⃣ ¡Listo! 🎉
Reinicia el servidor de desarrollo y la fuente se cargará correctamente en todos los dispositivos.

---

## 📁 Estructura final esperada:
```
tu-proyecto/
├── public/
│   ├── fonts/
│   │   └── Hanson-Bold.woff2  ← Aquí va el archivo
│   ├── robots.txt
│   └── sitemap.xml
├── src/
└── package.json
```

---

## ✅ Ventajas de alojar la fuente localmente:
- ✅ **Sin errores CORS** - La fuente se sirve desde el mismo dominio
- ✅ **100% confiable** - No depende de servidores externos
- ✅ **Más rápido** - Carga instantánea sin DNS lookup adicional
- ✅ **Funciona offline** - PWA compatible
- ✅ **Cache del navegador** - Los usuarios la descargan solo una vez

---

## 🔧 Si tienes problemas:
1. Verifica que el archivo esté en `/public/fonts/Hanson-Bold.woff2`
2. El nombre debe ser exacto: `Hanson-Bold.woff2` (con mayúsculas)
3. Reinicia el servidor de desarrollo (`npm run dev`)
4. Limpia la caché del navegador (Ctrl + Shift + R)

---

## 🎯 Alternativa: Si no puedes descargar el archivo
Si no puedes acceder a la URL, avísame y usaremos una fuente similar gratuita como:
- **Bebas Neue** (muy similar a Hanson)
- **Oswald Bold** (condensada, mayúsculas)
- **Anton** (bold, impacto)

Todas disponibles en Google Fonts y 100% compatibles.
