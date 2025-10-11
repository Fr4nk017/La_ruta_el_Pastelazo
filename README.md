# Pastelería 1000 Sabores

Sitio web oficial de Pastelería 1000 Sabores - 50 años endulzando Chile con tradición, calidad y creatividad en repostería.

## 🍰 Características

- **Catálogo completo** de productos con más de 1000 sabores
- **Carrito de compras** con persistencia local
- **Sistema de usuarios** con perfiles personalizados
- **Seguimiento de pedidos** en tiempo real
- **Reseñas y calificaciones** de clientes
- **Diseño responsivo** optimizado para todos los dispositivos
- **Rendimiento optimizado** con React y Vite

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Estilos**: Bootstrap 5 + CSS personalizado
- **Estado**: Context API (carrito y perfil)
- **Build**: Vite
- **Deploy**: Vercel

## 🚀 Instalación y desarrollo

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Build para producción:**
   ```bash
   npm run build
   ```

4. **Preview del build:**
   ```bash
   npm run preview
   ```

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Navbar, Footer
│   └── ui/            # Componentes de UI
├── contexts/           # Context API (Cart, Profile)
├── pages/             # Páginas principales
├── routes/            # Configuración de rutas
├── styles/            # Estilos globales
└── utils/             # Utilidades y datos mock
```

## 🌟 Funcionalidades principales

### Catálogo de productos
- Filtrado por categorías
- Búsqueda por texto
- Productos destacados y nuevos
- Vista detallada de cada producto

### Carrito de compras
- Agregar/quitar productos
- Modificar cantidades
- Persistencia en localStorage
- Contador en navegación

### Gestión de usuarios
- Registro e inicio de sesión
- Perfil personalizado
- Historial de pedidos

### Proceso de compra
- Checkout completo
- Múltiples métodos de pago
- Información de entrega

## 🎨 Diseño

El sitio mantiene la identidad visual de la pastelería con:
- **Colores**: Crema (#FFF9F0), Rosa (#FFC0CB), Chocolate (#8B4513)
- **Tipografía**: Lato (texto) + Pacifico (títulos)
- **Estilo**: Minimalista y acogedor

## 📱 Responsive Design

Optimizado para:
- 📱 Mobile (320px+)
- 📟 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔧 Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting con ESLint

## 📦 Deploy en Vercel

El proyecto está configurado para deploy automático en Vercel. Solo necesitas:

1. Conectar el repositorio a Vercel
2. Configurar el comando de build: `npm run build`
3. Configurar el directorio de output: `dist`

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Pastelería 1000 Sabores.

---

**Pastelería 1000 Sabores** - *50 años endulzando Chile* 🇨🇱