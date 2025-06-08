# 📚 DOCUMENTACIÓN COMPLETA API FERRETERÍA

**Base URL:** `https://backend-ferre.onrender.com`
**Frontend URL:** `https://v0-ferreteria-frontend.vercel.app`

---

## 🔐 AUTENTICACIÓN

### Login
**POST** `/api/usuarios/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "correo": "admin@ferreteria.com",
  "contrasena": "admin123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImNvcnJlbyI6ImFkbWluQGZlcnJldGVyaWEuY29tIiwicm9sIjoiYWRtaW4iLCJpYXQiOjE3MDI5MjM0NTYsImV4cCI6MTcwMzAwOTg1Nn0.xyz",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "correo": "admin@ferreteria.com",
    "rol": "admin"
  }
}
```

**Response 401:**
```json
{
  "error": "Credenciales inválidas"
}
```

---

## 👤 USUARIOS (Solo Admin)

### Listar Usuarios
**GET** `/api/usuarios`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
[
  {
    "id": 1,
    "nombre": "Administrador",
    "correo": "admin@ferreteria.com",
    "rol": "admin",
    "activo": true
  },
  {
    "id": 2,
    "nombre": "Carlos Vendedor",
    "correo": "carlos.vendedor@ferreteria.com",
    "rol": "vendedor",
    "activo": true
  }
]
```

### Crear Usuario
**POST** `/api/usuarios`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Ana Rodriguez",
  "correo": "ana.rodriguez@ferreteria.com",
  "contrasena": "vendedora456",
  "rol": "vendedor"
}
```

**Response 201:**
```json
{
  "id": 3,
  "nombre": "Ana Rodriguez",
  "correo": "ana.rodriguez@ferreteria.com",
  "rol": "vendedor",
  "activo": true
}
```

### Actualizar Usuario
**PUT** `/api/usuarios/:id`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Ana Rodriguez Martinez",
  "rol": "admin"
}
```

### Eliminar Usuario (Desactivar)
**DELETE** `/api/usuarios/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "message": "Usuario desactivado correctamente"
}
```

---

## 📦 PRODUCTOS

### Listar Productos
**GET** `/api/productos`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
[
  {
    "id": 1,
    "nombre": "Martillo de Garra 16oz",
    "descripcion": "Martillo profesional con mango de fibra de vidrio",
    "precioVenta": 25.99,
    "stockActual": 15,
    "stockMinimo": 5,
    "activo": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "categoriaId": 1,
    "categoria": {
      "id": 1,
      "nombre": "Herramientas"
    }
  }
]
```

### Obtener Producto por ID
**GET** `/api/productos/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Martillo de Garra 16oz",
  "descripcion": "Martillo profesional con mango de fibra de vidrio",
  "precioVenta": 25.99,
  "stockActual": 15,
  "stockMinimo": 5,
  "activo": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nombre": "Herramientas"
  }
}
```

### Crear Producto (Admin)
**POST** `/api/productos`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Taladro Inalámbrico 12V",
  "descripcion": "Taladro con batería de litio, incluye cargador",
  "precioVenta": 89.99,
  "stockActual": 8,
  "stockMinimo": 3,
  "categoriaId": 1
}
```

**Response 201:**
```json
{
  "id": 3,
  "nombre": "Taladro Inalámbrico 12V",
  "descripcion": "Taladro con batería de litio, incluye cargador",
  "precioVenta": 89.99,
  "stockActual": 8,
  "stockMinimo": 3,
  "activo": true,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nombre": "Herramientas"
  }
}
```

### Actualizar Producto (Admin)
**PUT** `/api/productos/:id`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Taladro Inalámbrico 12V Pro",
  "precioVenta": 94.99,
  "stockActual": 12
}
```

**Response 200:**
```json
{
  "id": 3,
  "nombre": "Taladro Inalámbrico 12V Pro",
  "descripcion": "Taladro con batería de litio, incluye cargador",
  "precioVenta": 94.99,
  "stockActual": 12,
  "stockMinimo": 3,
  "activo": true,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "categoriaId": 1,
  "categoria": {
    "id": 1,
    "nombre": "Herramientas"
  }
}
```

### Productos con Stock Bajo
**GET** `/api/productos/low-stock`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
[
  {
    "id": 2,
    "nombre": "Tornillos Autoperforantes 1/2\"",
    "precioVenta": 8.50,
    "stockActual": 3,
    "stockMinimo": 10,
    "categoria_nombre": "Tornillos y Clavos"
  }
]
```

### Estadísticas de Productos (Admin)
**GET** `/api/productos/stats`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "totalProductos": 25,
  "productosBajoStock": 3,
  "totalUnidades": 456
}
```

### Eliminar Producto (Admin)
**DELETE** `/api/productos/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "message": "Producto desactivado correctamente"
}
```

---

## 🏷️ CATEGORÍAS

### Listar Categorías
**GET** `/api/categorias`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
[
  {
    "id": 1,
    "nombre": "Herramientas",
    "productos": [
      {
        "id": 1,
        "nombre": "Martillo de Garra 16oz",
        "precioVenta": 25.99,
        "stockActual": 15
      }
    ]
  }
]
```

### Obtener Categoría por ID
**GET** `/api/categorias/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Herramientas",
  "productos": [
    {
      "id": 1,
      "nombre": "Martillo de Garra 16oz",
      "descripcion": "Martillo profesional con mango de fibra de vidrio",
      "precioVenta": 25.99,
      "stockActual": 15,
      "stockMinimo": 5,
      "activo": true
    }
  ]
}
```

### Crear Categoría (Admin)
**POST** `/api/categorias`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Jardinería"
}
```

**Response 201:**
```json
{
  "id": 7,
  "nombre": "Jardinería",
  "productos": []
}
```

### Actualizar Categoría (Admin)
**PUT** `/api/categorias/:id`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Jardinería y Paisajismo"
}
```

**Response 200:**
```json
{
  "id": 7,
  "nombre": "Jardinería y Paisajismo",
  "productos": []
}
```

### Eliminar Categoría (Admin)
**DELETE** `/api/categorias/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

---

## 👥 CLIENTES

### Listar Clientes
**GET** `/api/clientes`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Query Parameters:**
- `search` - Buscar por nombre, correo o teléfono
- `limit` - Límite de resultados (default: 20)
- `simple` - Si es "true", retorna solo id, nombre y correo

**Response 200:**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com",
    "telefono": "+1234567890",
    "direccion": "Calle Principal 123, Ciudad",
    "ventas": [
      {
        "id": 1,
        "fecha": "2024-01-15T14:30:00.000Z",
        "total": 34.49
      }
    ]
  }
]
```

### Obtener Cliente por ID
**GET** `/api/clientes/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "telefono": "+1234567890",
  "direccion": "Calle Principal 123, Ciudad",
  "ventas": [
    {
      "id": 1,
      "fecha": "2024-01-15T14:30:00.000Z",
      "total": 34.49,
      "detalles": [
        {
          "id": 1,
          "cantidad": 1,
          "precioUnitario": 25.99,
          "producto": {
            "id": 1,
            "nombre": "Martillo de Garra 16oz"
          }
        },
        {
          "id": 2,
          "cantidad": 1,
          "precioUnitario": 8.50,
          "producto": {
            "id": 2,
            "nombre": "Tornillos Autoperforantes 1/2\""
          }
        }
      ]
    }
  ]
}
```

### Crear Cliente
**POST** `/api/clientes`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Pedro Ramirez",
  "correo": "pedro.ramirez@email.com",
  "telefono": "+1234567892",
  "direccion": "Boulevard Norte 789, Ciudad"
}
```

**Response 201:**
```json
{
  "id": 3,
  "nombre": "Pedro Ramirez",
  "correo": "pedro.ramirez@email.com",
  "telefono": "+1234567892",
  "direccion": "Boulevard Norte 789, Ciudad",
  "ventas": []
}
```

### Actualizar Cliente
**PUT** `/api/clientes/:id`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "nombre": "Pedro Ramirez Silva",
  "telefono": "+1234567893",
  "direccion": "Boulevard Norte 789, Apartamento 2B, Ciudad"
}
```

**Response 200:**
```json
{
  "id": 3,
  "nombre": "Pedro Ramirez Silva",
  "correo": "pedro.ramirez@email.com",
  "telefono": "+1234567893",
  "direccion": "Boulevard Norte 789, Apartamento 2B, Ciudad",
  "ventas": []
}
```

### Estadísticas de Clientes (Admin)
**GET** `/api/clientes/stats`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "totalClientes": 50,
  "clientesConVentas": 35,
  "clientesSinVentas": 15
}
```

### Eliminar Cliente (Admin)
**DELETE** `/api/clientes/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

---

## 🛒 VENTAS

### Listar Ventas
**GET** `/api/ventas`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
[
  {
    "id": 1,
    "fecha": "2024-01-15T14:30:00.000Z",
    "total": 34.49,
    "clienteId": 1,
    "cliente": {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@email.com"
    },
    "usuarioId": 1,
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "correo": "admin@ferreteria.com"
    },
    "detalles": [
      {
        "id": 1,
        "ventaId": 1,
        "productoId": 1,
        "cantidad": 1,
        "precioUnitario": 25.99,
        "producto": {
          "id": 1,
          "nombre": "Martillo de Garra 16oz",
          "precioVenta": 25.99
        }
      }
    ]
  }
]
```

### Obtener Venta por ID
**GET** `/api/ventas/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "id": 1,
  "fecha": "2024-01-15T14:30:00.000Z",
  "total": 34.49,
  "clienteId": 1,
  "cliente": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com",
    "telefono": "+1234567890",
    "direccion": "Calle Principal 123, Ciudad"
  },
  "usuarioId": 1,
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "correo": "admin@ferreteria.com"
  },
  "detalles": [
    {
      "id": 1,
      "ventaId": 1,
      "productoId": 1,
      "cantidad": 1,
      "precioUnitario": 25.99,
      "producto": {
        "id": 1,
        "nombre": "Martillo de Garra 16oz",
        "precioVenta": 25.99
      }
    }
  ]
}
```

### Crear Venta
**POST** `/api/ventas`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body con Cliente:**
```json
{
  "clienteId": 1,
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 25.99
    },
    {
      "productoId": 3,
      "cantidad": 1,
      "precioUnitario": 89.99
    }
  ]
}
```

**Request Body sin Cliente (Venta Rápida):**
```json
{
  "detalles": [
    {
      "productoId": 2,
      "cantidad": 5,
      "precioUnitario": 8.50
    }
  ]
}
```

### Estadísticas de Ventas (Admin)
**GET** `/api/ventas/stats`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "totalVentas": 15,
  "totalIngresos": 1250.45,
  "ventasHoy": 3
}
```

### Ventas por Rango de Fechas
**GET** `/api/ventas/range?fechaInicio=2024-01-15&fechaFin=2024-01-16`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Query Parameters:**
- `fechaInicio` - Fecha de inicio (formato: YYYY-MM-DD)
- `fechaFin` - Fecha de fin (formato: YYYY-MM-DD)

---

## 🔧 SISTEMA (Solo Admin)

### Estadísticas del Sistema
**GET** `/api/sistema/stats`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "uptime": 86400,
  "memory": {
    "rss": 45678912,
    "heapTotal": 34567890,
    "heapUsed": 23456789,
    "external": 1234567,
    "arrayBuffers": 123456
  },
  "platform": "linux",
  "nodeVersion": "v18.17.0",
  "environment": "production",
  "timestamp": "2024-01-16T10:30:00.000Z"
}
```

### Estado del Keep-Alive
**GET** `/api/sistema/keep-alive/status`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "enabled": true,
  "interval": "14 minutos",
  "url": "https://backend-ferre.onrender.com/health"
}
```

### Ping Manual del Keep-Alive
**POST** `/api/sistema/keep-alive/ping`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "message": "Ping manual ejecutado",
  "result": {
    "success": true,
    "duration": 245,
    "status": 200
  }
}
```

---

## 🏥 SALUD DEL SISTEMA

### Health Check
**GET** `/health`

**Response 200:**
```json
{
  "status": "OK",
  "message": "Backend Ferretería funcionando correctamente",
  "timestamp": "2024-01-16T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "database": "connected",
  "uptime": 86400,
  "memory": {
    "used": 23,
    "total": 34
  }
}
```

### Ping Simple
**GET** `/ping`

**Response 200:**
```json
{
  "pong": true,
  "timestamp": 1705394400000,
  "uptime": 86400
}
```

### Información de la API
**GET** `/`

**Response 200:**
```json
{
  "api": "Backend Ferretería API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/health",
    "productos": "/api/productos",
    "categorias": "/api/categorias",
    "clientes": "/api/clientes",
    "usuarios": "/api/usuarios",
    "ventas": "/api/ventas",
    "sistema": "/api/sistema"
  }
}
```

---

## 🔒 RESUMEN DE RUTAS POR MÓDULO

### **Productos** (`/api/productos`)
- `GET /` - Listar productos
- `GET /stats` - Estadísticas (Admin)
- `GET /low-stock` - Productos con stock bajo
- `GET /:id` - Obtener por ID
- `POST /` - Crear (Admin)
- `PUT /:id` - Actualizar (Admin)
- `DELETE /:id` - Eliminar (Admin)

### **Categorías** (`/api/categorias`)
- `GET /` - Listar categorías
- `GET /:id` - Obtener por ID
- `POST /` - Crear (Admin)
- `PUT /:id` - Actualizar (Admin)
- `DELETE /:id` - Eliminar (Admin)

### **Clientes** (`/api/clientes`)
- `GET /` - Listar clientes (con filtros)
- `GET /stats` - Estadísticas (Admin)
- `GET /:id` - Obtener por ID
- `POST /` - Crear cliente
- `PUT /:id` - Actualizar cliente
- `DELETE /:id` - Eliminar cliente (Admin)

### **Usuarios** (`/api/usuarios`)
- `POST /login` - Iniciar sesión
- `GET /` - Listar usuarios (Admin)
- `POST /` - Crear usuario (Admin)
- `PUT /:id` - Actualizar usuario (Admin)
- `DELETE /:id` - Eliminar usuario (Admin)

### **Ventas** (`/api/ventas`)
- `GET /` - Listar ventas
- `GET /stats` - Estadísticas (Admin)
- `GET /range` - Ventas por rango de fechas
- `GET /:id` - Obtener por ID
- `POST /` - Crear venta

### **Sistema** (`/api/sistema`)
- `GET /stats` - Estadísticas del servidor (Admin)
- `GET /keep-alive/status` - Estado keep-alive (Admin)
- `POST /keep-alive/ping` - Ping manual (Admin)

---

## ❌ CÓDIGOS DE ERROR COMUNES

### 400 - Bad Request
```json
{
  "error": "Datos de entrada inválidos",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["precioVenta"],
      "message": "Expected number, received string"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "error": "Token de acceso requerido"
}
```

### 403 - Forbidden
```json
{
  "error": "No tienes permisos para esta acción"
}
```

### 404 - Not Found
```json
{
  "error": "Producto no encontrado"
}
```

### 409 - Conflict
```json
{
  "error": "Ya existe un registro con ese correo",
  "field": ["correo"],
  "code": "DUPLICATE_ENTRY"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Error interno del servidor",
  "code": "INTERNAL_ERROR"
}
```

---

## 📝 NOTAS IMPORTANTES

1. **Autenticación:** Todas las rutas (excepto `/health`, `/ping`, `/` y `/api/usuarios/login`) requieren token JWT
2. **Autorización:** Las rutas marcadas con (Admin) solo son accesibles por usuarios con rol "admin"
3. **Stock:** Al crear ventas, el stock se actualiza automáticamente
4. **Timestamps:** Todas las fechas están en formato ISO 8601 UTC
5. **Precios:** Números decimales con máximo 2 decimales
6. **Soft Delete:** Los productos se marcan como inactivos en lugar de eliminarse
7. **Validaciones:** Todos los campos requeridos se validan en el backend
8. **Rate Limiting:** En producción hay limitaciones de velocidad para prevenir spam
9. **CORS:** Configurado para permitir requests desde dominios autorizados
10. **Keep-Alive:** Sistema automático para mantener el servicio activo en Render

---

**🚀 ¡API Lista para usar en tu frontend!**

**URL de Producción:** `https://backend-ferre.onrender.com`
**Frontend Desplegado:** `https://v0-ferreteria-frontend.vercel.app`
**Credenciales de Prueba:** `admin@ferreteria.com` / `admin123`

## 🔗 INTEGRACIÓN FRONTEND-BACKEND

### **Configuración para tu Frontend:**

```typescript
// En tu frontend, configurar la URL base de la API:
const API_BASE_URL = 'https://backend-ferre.onrender.com';

// Ejemplo de configuración de Axios:
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-ferre.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Ejemplo de Login desde tu Frontend:**

```typescript
// Función de login para tu frontend
const login = async (correo: string, contrasena: string) => {
  try {
    const response = await fetch('https://backend-ferre.onrender.com/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      return data;
    } else {
      throw new Error(data.error || 'Error de autenticación');
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```

### **CORS Configurado para:**
✅ `https://v0-ferreteria-frontend.vercel.app` (tu frontend)
✅ Todos los dominios `*.vercel.app`
✅ Credenciales habilitadas (`credentials: true`)
✅ Métodos: GET, POST, PUT, DELETE, OPTIONS
✅ Headers: Content-Type, Authorization, X-Requested-With
