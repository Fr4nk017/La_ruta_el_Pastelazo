# 🚀 GUÍA DE DEPLOYMENT EN VERCEL

## 📋 CONFIGURACIÓN ACTUAL

### ✅ Archivos Configurados:
- `vercel.json` - Configuración de routing SPA
- `public/_redirects` - Fallback para SPA
- `vite.config.js` - Build optimizado
- `src/routes/AppRouter.jsx` - React Router configurado

### 🔧 Configuración Vercel:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🐛 TROUBLESHOOTING

### Si sigue dando 404:

1. **Verificar en Vercel Dashboard:**
   - Functions → Deployments
   - Verificar que el build sea exitoso
   - Verificar que `distDir` sea `dist`

2. **Configuración Manual en Vercel:**
   - Settings → Functions
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variables de Entorno:**
   - Settings → Environment Variables
   - Verificar que no haya variables conflictivas

4. **Redeploy Forzado:**
   - Deployments → Redeploy (sin cache)

## 🔍 DEBUGGING

### URLs para Probar:
- `https://tu-dominio.vercel.app/` ✓ Debe cargar el inicio
- `https://tu-dominio.vercel.app/catalog` ✓ Debe cargar el catálogo
- `https://tu-dominio.vercel.app/cart` ✓ Debe cargar el carrito
- `https://tu-dominio.vercel.app/ruta-inexistente` ✓ Debe mostrar 404 personalizada

### Si da Error:
1. Verificar en Network tab del navegador
2. Revisar Console para errores JavaScript
3. Verificar que los archivos se carguen desde `/dist/`

## 🔄 ALTERNATIVAS

### Opción 1: Configuración Simple
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Opción 2: Configuración Netlify-style
```json
{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

## 📞 CONTACTO DE SOPORTE

Si nada funciona, el problema puede ser:
1. Configuración específica del dominio en Vercel
2. Caché de Vercel que necesita limpiarse
3. Problema con el proyecto específico

**Solución:** Crear un nuevo proyecto en Vercel desde cero puede resolver conflictos de configuración.