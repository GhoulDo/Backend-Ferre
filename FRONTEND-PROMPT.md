# PROMPT COMPLETO PARA FRONTEND DE FERRETERÍA

## 🎯 OBJETIVO GENERAL

Crear un **frontend web completo y profesional** para el sistema de gestión de ferretería, que se conecte al backend ya desplegado en Render. Debe ser una aplicación moderna, responsive y fácil de usar tanto para administradores como para vendedores.

---

## 🌐 BACKEND YA DESPLEGADO

**URL Base:** `https://backend-ferre.onrender.com`

### Endpoints Disponibles:
```json
{
  "health": "/health",
  "productos": "/api/productos", 
  "categorias": "/api/categorias",
  "clientes": "/api/clientes", 
  "usuarios": "/api/usuarios",
  "ventas": "/api/ventas",
  "sistema": "/api/sistema"
}
```

### Credenciales por Defecto:
- **Email:** `admin@ferreteria.com`
- **Contraseña:** `admin123`

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### **Modelo de Datos Completo:**

#### **Usuario**
```typescript
interface Usuario {
  id: number;              // Primary Key, auto-increment
  nombre: string;          // Requerido
  correo: string;          // Requerido, único, email válido
  contrasena: string;      // Requerido, hash bcrypt (mín. 6 caracteres)
  rol: "admin" | "vendedor"; // Enum, default: "vendedor"
  activo: boolean;         // Default: true
}
```

#### **Categoria**
```typescript
interface Categoria {
  id: number;              // Primary Key, auto-increment
  nombre: string;          // Requerido, único
  productos: Producto[];   // Relación: Una categoría tiene muchos productos
}

// Categorías por defecto en el sistema:
// - Herramientas
// - Tornillos y Clavos  
// - Pintura
// - Electricidad
// - Plomería
// - Ferretería General
```

#### **Producto**
```typescript
interface Producto {
  id: number;              // Primary Key, auto-increment
  nombre: string;          // Requerido
  descripcion?: string;    // Opcional
  precioVenta: number;     // Requerido, > 0 (formato: decimal)
  stockActual: number;     // Requerido, >= 0 (entero)
  stockMinimo: number;     // Requerido, >= 0 (entero)
  activo: boolean;         // Default: true (soft delete)
  createdAt: Date;         // Timestamp automático
  categoriaId?: number;    // Foreign Key opcional a Categoria
  categoria?: Categoria;   // Relación: Producto pertenece a Categoría
  detalleVentas: DetalleVenta[]; // Relación: Producto en muchas ventas
}
```

#### **Cliente**
```typescript
interface Cliente {
  id: number;              // Primary Key, auto-increment
  nombre: string;          // Requerido
  correo: string;          // Requerido, único, email válido
  telefono?: string;       // Opcional
  direccion?: string;      // Opcional
  ventas: Venta[];         // Relación: Cliente tiene muchas ventas
}
```

#### **Venta**
```typescript
interface Venta {
  id: number;              // Primary Key, auto-increment
  fecha: Date;             // Default: now() - Timestamp automático
  clienteId?: number;      // Foreign Key opcional a Cliente
  cliente?: Cliente;       // Relación: Venta pertenece a Cliente (opcional)
  total: number;           // Default: 0, calculado automáticamente
  usuarioId?: number;      // Foreign Key opcional a Usuario (vendedor)
  usuario?: Usuario;       // Relación: Venta realizada por Usuario
  detalles: DetalleVenta[]; // Relación: Venta tiene muchos detalles
}
```

#### **DetalleVenta**
```typescript
interface DetalleVenta {
  id: number;              // Primary Key, auto-increment
  ventaId: number;         // Foreign Key requerida a Venta
  venta: Venta;            // Relación: Detalle pertenece a Venta
  productoId: number;      // Foreign Key requerida a Producto
  producto: Producto;      // Relación: Detalle de un Producto específico
  cantidad: number;        // Requerido, > 0 (entero)
  precioUnitario: number;  // Requerido, > 0 (precio al momento de venta)
}
```

### **Relaciones de Base de Datos:**

```
Usuario (1) ──────── (N) Venta
    │
    └── rol: admin puede CRUD todo
        rol: vendedor puede crear ventas, ver productos/clientes

Categoria (1) ──────── (N) Producto
    │
    └── Una categoría puede tener múltiples productos
        Un producto puede tener una categoría (opcional)

Cliente (1) ──────── (N) Venta
    │
    └── Un cliente puede tener múltiples ventas
        Una venta puede tener un cliente (opcional)

Venta (1) ──────── (N) DetalleVenta
    │
    └── Una venta tiene múltiples detalles
        Un detalle pertenece a una sola venta

Producto (1) ──────── (N) DetalleVenta
    │
    └── Un producto puede estar en múltiples detalles de venta
        Un detalle de venta es de un solo producto
```

### **Validaciones de Negocio:**

- **Stock:** Al crear una venta, se valida que `stockActual >= cantidad` para cada producto
- **Stock Automático:** Al confirmar venta, se reduce automáticamente el `stockActual`
- **Stock Bajo:** Productos donde `stockActual <= stockMinimo` aparecen en alertas
- **Soft Delete:** Productos se marcan como `activo: false` en lugar de eliminarse
- **Total Automático:** El total de venta se calcula como `SUM(cantidad * precioUnitario)`
- **Precios:** Siempre números positivos, formato decimal para dinero
- **Emails Únicos:** Tanto usuarios como clientes deben tener emails únicos

---

## 🏗️ ESPECIFICACIONES TÉCNICAS

### **Stack Tecnológico Requerido:**
- **Framework:** React 18+ con TypeScript
- **Build Tool:** Vite
- **UI Framework:** Tailwind CSS + Shadcn/ui (componentes modernos)
- **Estado Global:** Zustand o Context API
- **HTTP Client:** Axios
- **Routing:** React Router DOM v6
- **Formularios:** React Hook Form + Zod (validación)
- **Tablas:** TanStack Table
- **Gráficos:** Recharts o Chart.js
- **Iconos:** Lucide React
- **Notificaciones:** React Hot Toast
- **Despliegue:** Render.com o Vercel

### **Estructura del Proyecto:**
```
frontend-ferreteria/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── layout/         # Layout, Navbar, Sidebar
│   │   ├── forms/          # Formularios específicos
│   │   └── tables/         # Tablas de datos
│   ├── pages/              # Páginas principales
│   │   ├── auth/           # Login, registro
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── productos/      # Gestión de productos
│   │   ├── categorias/     # Gestión de categorías
│   │   ├── clientes/       # Gestión de clientes
│   │   ├── ventas/         # Gestión de ventas
│   │   └── usuarios/       # Gestión de usuarios (admin)
│   ├── hooks/              # Custom hooks
│   ├── services/           # Servicios API
│   ├── stores/             # Estado global
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Utilidades
│   └── lib/                # Configuraciones
├── public/                 # Archivos estáticos
└── docs/                   # Documentación
```

---

## 📋 ESPECIFICACIONES DETALLADAS POR MÓDULO

### **1. AUTENTICACIÓN**

**Páginas Requeridas:**
- `/login` - Página de inicio de sesión
- Redirección automática al dashboard tras login exitoso
- Logout y limpieza de sesión

**Funcionalidades:**
- Login con email y contraseña
- Validación de formularios en tiempo real
- Manejo de errores de autenticación
- Almacenamiento seguro del JWT en localStorage/sessionStorage
- Protección de rutas según roles (admin/vendedor)

**API Endpoints:**
```typescript
POST /api/usuarios/login
Body: { correo: string, contrasena: string }
Response: { token: string, usuario: { id, nombre, correo, rol } }
```

### **2. DASHBOARD PRINCIPAL**

**Ruta:** `/dashboard`

**Componentes Visuales:**
- **Cards de Estadísticas:**
  - Total de productos activos
  - Productos con stock bajo (`stockActual <= stockMinimo`)
  - Ventas del día (fecha = hoy)
  - Total de ingresos (suma de `total` de todas las ventas)
- **Gráficos:**
  - Ventas por mes (suma de `total` agrupado por mes)
  - Productos más vendidos (suma de `cantidad` en DetalleVenta por producto)
  - Stock bajo (lista de productos donde `stockActual <= stockMinimo`)
- **Actividad Reciente:**
  - Últimas 10 ventas realizadas (ordenado por `fecha` DESC)
  - Últimos 5 productos añadidos (ordenado por `createdAt` DESC)

**API Endpoints:**
```typescript
GET /api/productos/stats          // { totalProductos, productosBajoStock, totalUnidades }
GET /api/ventas/stats            // { totalVentas, totalIngresos, ventasHoy }
GET /api/productos/low-stock     // Productos donde stockActual <= stockMinimo
```

### **3. GESTIÓN DE PRODUCTOS**

**Rutas:**
- `/productos` - Lista de productos
- `/productos/nuevo` - Crear producto
- `/productos/:id/editar` - Editar producto

**Funcionalidades:**
- **Tabla de productos** con:
  - Búsqueda en tiempo real
  - Filtros por categoría
  - Ordenamiento por columnas
  - Paginación
  - Acciones: Ver, Editar, Eliminar
- **Formulario de producto:**
  - Validación completa
  - Selector de categoría
  - Alertas de stock bajo
  - Upload de imagen (opcional)

**Campos del Formulario con Validaciones:**
```typescript
interface ProductoForm {
  nombre: string;           // Requerido, mín. 1 carácter
  descripcion?: string;     // Opcional, máx. 500 caracteres
  precioVenta: number;      // Requerido, > 0, formato: 0.00
  stockActual: number;      // Requerido, >= 0, entero
  stockMinimo: number;      // Requerido, >= 0, entero
  categoriaId?: number;     // Opcional, debe existir en Categoria
}

// Validaciones adicionales:
// - Si stockActual <= stockMinimo, mostrar warning
// - precioVenta debe tener máximo 2 decimales
// - nombre debe ser único (validación en backend)
```

**API Endpoints:**
```typescript
GET /api/productos                    // Listar productos
GET /api/productos/:id               // Obtener producto
POST /api/productos                  // Crear producto (Admin)
PUT /api/productos/:id               // Actualizar producto (Admin)
DELETE /api/productos/:id            // Eliminar producto (Admin)
GET /api/productos/low-stock         // Productos con stock bajo
```

### **4. GESTIÓN DE CATEGORÍAS**

**Rutas:**
- `/categorias` - Lista de categorías
- Modal para crear/editar categorías

**Funcionalidades:**
- CRUD completo de categorías
- Validación de nombres únicos
- Mostrar cantidad de productos por categoría (`productos.length`)
- No permitir eliminar categorías que tienen productos asociados

### **5. GESTIÓN DE CLIENTES**

**Rutas:**
- `/clientes` - Lista de clientes
- `/clientes/nuevo` - Crear cliente
- `/clientes/:id/editar` - Editar cliente

**Funcionalidades:**
- CRUD completo de clientes
- Historial de compras por cliente
- Búsqueda y filtros

**Campos del Cliente con Validaciones:**
```typescript
interface ClienteForm {
  nombre: string;           // Requerido, mín. 2 caracteres
  correo: string;          // Requerido, único, formato email válido
  telefono?: string;       // Opcional, formato telefónico
  direccion?: string;      // Opcional, máx. 200 caracteres
}

// Validaciones adicionales:
// - correo debe ser único (validación en backend)
// - telefono puede incluir formato: +XX XXXX-XXXX
```

**API Endpoints:**
```typescript
GET /api/clientes                    // Listar clientes
POST /api/clientes                   // Crear cliente
PUT /api/clientes/:id                // Actualizar cliente
DELETE /api/clientes/:id             // Eliminar cliente (Admin)
```

### **6. GESTIÓN DE VENTAS**

**Rutas:**
- `/ventas` - Lista de ventas
- `/ventas/nueva` - Crear nueva venta
- `/ventas/:id` - Detalle de venta

**Funcionalidades:**
- **Lista de ventas** con filtros por fecha
- **Formulario de nueva venta:**
  - Selector de cliente (opcional)
  - Buscador de productos
  - Carrito de compras dinámico
  - Cálculo automático de totales
  - Validación de stock disponible
- **Detalle de venta:** Información completa y opción de imprimir

**Estructura Completa de Venta:**
```typescript
interface VentaCompleta {
  id: number;
  fecha: Date;               // Timestamp de creación
  clienteId?: number;        // Opcional
  cliente?: {                // Información del cliente si existe
    id: number;
    nombre: string;
    correo: string;
  };
  total: number;             // Calculado: SUM(cantidad * precioUnitario)
  usuarioId: number;         // Usuario que realizó la venta
  usuario: {                 // Información del vendedor
    id: number;
    nombre: string;
    correo: string;
  };
  detalles: DetalleVentaCompleto[];
}

interface DetalleVentaCompleto {
  id: number;
  ventaId: number;
  productoId: number;
  producto: {                // Información del producto al momento de venta
    id: number;
    nombre: string;
    precioVenta: number;     // Precio actual del producto
  };
  cantidad: number;          // Cantidad vendida
  precioUnitario: number;    // Precio al momento de la venta (puede diferir del actual)
}
```

**Flujo de Nueva Venta con Validaciones:**
1. **Seleccionar cliente** (opcional) - Buscar por nombre o email
2. **Buscar y agregar productos** - Filtrar por nombre, mostrar stock disponible
3. **Especificar cantidades** - Validar que `cantidad <= stockActual`
4. **Verificar stock** en tiempo real antes de confirmar
5. **Calcular total** automáticamente: `SUM(cantidad * precioUnitario)`
6. **Confirmar venta** - Crear registro en BD
7. **Actualizar stock** automáticamente: `stockActual -= cantidad`

**Validaciones Críticas:**
- No permitir cantidades mayores al stock disponible
- Recalcular total en tiempo real al cambiar cantidades
- Validar que al menos un producto esté en el carrito
- Confirmar antes de finalizar venta (modal de confirmación)

**API Endpoints:**
```typescript
GET /api/ventas                      // Listar ventas
GET /api/ventas/:id                  // Obtener venta
POST /api/ventas                     // Crear venta
GET /api/ventas/stats                // Estadísticas (Admin)
GET /api/ventas/range                // Ventas por rango de fechas
```

### **7. GESTIÓN DE USUARIOS** (Solo Admin)

**Rutas:**
- `/usuarios` - Lista de usuarios
- Modal para crear/editar usuarios

**Funcionalidades:**
- CRUD de usuarios
- Asignación de roles
- Activar/desactivar usuarios

**Campos de Usuario con Validaciones:**
```typescript
interface UsuarioForm {
  nombre: string;           // Requerido, mín. 2 caracteres
  correo: string;          // Requerido, único, formato email válido
  contrasena: string;      // Requerido, mín. 6 caracteres
  rol: "admin" | "vendedor"; // Requerido, enum
}

// Validaciones adicionales:
// - correo debe ser único (validación en backend)
// - contrasena se hashea automáticamente en backend
// - rol determina permisos en frontend
```

**API Endpoints:**
```typescript
GET /api/usuarios                    // Listar usuarios (Admin)
POST /api/usuarios                   // Crear usuario (Admin)
PUT /api/usuarios/:id                // Actualizar usuario (Admin)
DELETE /api/usuarios/:id             // Eliminar usuario (Admin)
```

---

## 🔒 PERMISOS POR ROL

### **Admin:**
- ✅ Acceso total a todos los módulos
- ✅ CRUD completo en productos, categorías, clientes, usuarios
- ✅ Puede eliminar/desactivar registros
- ✅ Acceso a estadísticas y reportes
- ✅ Gestión de usuarios del sistema

### **Vendedor:**
- ✅ Dashboard con estadísticas básicas
- ✅ Ver y crear productos (sin eliminar)
- ✅ CRUD completo de clientes
- ✅ CRUD completo de ventas
- ✅ Ver categorías (sin modificar)
- ❌ No puede gestionar usuarios
- ❌ No puede eliminar productos
- ❌ No acceso a configuración del sistema

---

## 📊 DATOS DE EJEMPLO PARA DESARROLLO

### **Productos de Prueba:**
```typescript
const productosEjemplo = [
  {
    nombre: "Martillo de Garra 16oz",
    descripcion: "Martillo profesional con mango de fibra de vidrio",
    precioVenta: 25.99,
    stockActual: 15,
    stockMinimo: 5,
    categoriaId: 1 // Herramientas
  },
  {
    nombre: "Tornillos Autoperforantes 1/2\"",
    descripcion: "Caja x100 unidades, acero galvanizado",
    precioVenta: 8.50,
    stockActual: 3, // Stock bajo!
    stockMinimo: 10,
    categoriaId: 2 // Tornillos y Clavos
  },
  {
    nombre: "Pintura Látex Blanco 1 Galón",
    descripcion: "Pintura interior/exterior, acabado mate",
    precioVenta: 45.00,
    stockActual: 8,
    stockMinimo: 3,
    categoriaId: 3 // Pintura
  }
];
```

### **Clientes de Prueba:**
```typescript
const clientesEjemplo = [
  {
    nombre: "Juan Pérez",
    correo: "juan.perez@email.com",
    telefono: "+1234567890",
    direccion: "Calle Principal 123, Ciudad"
  },
  {
    nombre: "María González",
    correo: "maria.gonzalez@email.com",
    telefono: "+1234567891",
    direccion: "Avenida Central 456, Ciudad"
  }
];
```

---

## 🎨 DISEÑO UI/UX

### **Paleta de Colores:**
```css
:root {
  --primary: #0f172a;      /* Azul oscuro */
  --secondary: #64748b;    /* Gris azulado */
  --accent: #3b82f6;       /* Azul */
  --success: #10b981;      /* Verde */
  --warning: #f59e0b;      /* Amarillo */
  --error: #ef4444;        /* Rojo */
  --background: #f8fafc;   /* Gris muy claro */
  --card: #ffffff;         /* Blanco */
}
```

### **Layout Principal:**
- **Sidebar fijo** con navegación principal
- **Header** con información del usuario y logout
- **Contenido principal** responsive
- **Breadcrumbs** para navegación contextual

### **Componentes Requeridos:**
- Tables con búsqueda, filtros y paginación
- Modals para formularios
- Cards informativos
- Botones con estados (loading, disabled)
- Alerts y notificaciones toast
- Skeleton loaders para carga
- Formularios con validación visual

### **Estados Visuales Importantes:**
- **Stock Bajo:** Productos con `stockActual <= stockMinimo` en color warning/rojo
- **Stock Agotado:** `stockActual = 0` en color rojo con badge "Agotado"
- **Stock Normal:** `stockActual > stockMinimo` en color normal
- **Ventas del Día:** Resaltar ventas con `fecha = hoy`
- **Roles:** Indicadores visuales diferentes para Admin vs Vendedor

---

## 🔐 SEGURIDAD Y VALIDACIONES

### **Autenticación:**
- JWT almacenado de forma segura
- Interceptors de Axios para tokens automáticos
- Renovación automática de tokens
- Logout automático en token expirado

### **Autorización:**
- Rutas protegidas por roles
- Componentes condicionales según permisos
- Admin: Acceso total
- Vendedor: Solo productos, clientes, ventas (sin eliminar)

### **Validaciones Específicas de Negocio:**
- **Stock:** Validar disponibilidad antes de permitir venta
- **Precios:** Solo números positivos con máximo 2 decimales
- **Cantidades:** Solo enteros positivos
- **Emails:** Formato válido y únicos por tabla
- **Roles:** Validar permisos en cada acción
- **Totales:** Recalcular en frontend y validar en backend

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints:**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

### **Adaptaciones:**
- Sidebar colapsable en mobile
- Tablas horizontalmente scrolleables
- Formularios optimizados para touch
- Navegación móvil con hamburger menu

---

## ⚡ OPTIMIZACIONES

### **Performance:**
- Lazy loading de páginas
- Debounce en búsquedas
- Paginación en tablas grandes
- Caché de datos frecuentes
- Optimización de bundle size

### **UX/DX:**
- Loading states en todas las operaciones
- Error boundaries para manejo de errores
- Confirmaciones para acciones destructivas
- Shortcuts de teclado para power users

---

## 🚀 DEPLOYMENT

### **Configuración para Render/Vercel:**
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+
- Environment variables para API URL

### **Variables de Entorno:**
```bash
VITE_API_URL=https://backend-ferre.onrender.com
VITE_APP_NAME=Ferretería Management
VITE_APP_VERSION=1.0.0
```

---

## 📋 ENTREGABLES ESPERADOS

### **Estructura de Archivos:**
1. **Código fuente completo** con TypeScript
2. **Documentación README.md** con instrucciones de instalación
3. **Archivo .env.example** con variables necesarias
4. **Scripts de package.json** optimizados
5. **Configuración de despliegue** lista para Render/Vercel

### **Funcionalidades Críticas:**
✅ Login/logout funcional  
✅ Dashboard con estadísticas reales  
✅ CRUD completo de productos con validaciones  
✅ Sistema de ventas funcional con carrito  
✅ Gestión de stock en tiempo real  
✅ Responsive design completo  
✅ Manejo de errores robusto  
✅ Navegación intuitiva  

### **Características Avanzadas Opcionales:**
- 🔍 Búsqueda avanzada con filtros múltiples
- 📊 Reportes gráficos avanzados
- 📱 PWA (Progressive Web App)
- 🖨️ Generación de facturas PDF
- 📈 Dashboard en tiempo real con websockets
- 🔔 Notificaciones push para stock bajo

---

## 🎯 CRITERIOS DE ÉXITO

El frontend estará completo cuando:
1. **Todos los endpoints del backend** estén integrados correctamente
2. **Las 3 funcionalidades principales** (productos, ventas, dashboard) funcionen perfectamente
3. **El diseño sea profesional** y responsive
4. **La aplicación esté desplegada** y accesible online
5. **Incluya documentación** clara para uso y mantenimiento

---

## 📞 INFORMACIÓN DE CONTACTO CON EL BACKEND

**Base URL:** `https://backend-ferre.onrender.com`
**Health Check:** `https://backend-ferre.onrender.com/health`
**Documentación API:** Todos los endpoints están documentados en este prompt

**Headers Requeridos:**
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // Para rutas protegidas
}
```

**Manejo de Errores:**
- **401:** Token inválido/expirado → Redirigir a login
- **403:** Sin permisos → Mostrar mensaje de error
- **404:** Recurso no encontrado → Página 404
- **500:** Error de servidor → Mensaje genérico

---

¡Con esta especificación completa que incluye toda la estructura de base de datos podrás crear un frontend profesional y funcional que se integre perfectamente con el backend desplegado! 🚀
