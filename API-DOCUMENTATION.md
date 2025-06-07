# 📚 DOCUMENTACIÓN COMPLETA API FERRETERÍA

**Base URL:** `https://backend-ferre.onrender.com`

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
  "correo": "ana.rodriguez@ferreteria.com",
  "rol": "admin"
}
```

**Response 200:**
```json
{
  "id": 3,
  "nombre": "Ana Rodriguez Martinez",
  "correo": "ana.rodriguez@ferreteria.com",
  "rol": "admin",
  "activo": true
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
  },
  {
    "id": 2,
    "nombre": "Tornillos Autoperforantes 1/2\"",
    "descripcion": "Caja x100 unidades, acero galvanizado",
    "precioVenta": 8.50,
    "stockActual": 3,
    "stockMinimo": 10,
    "activo": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "categoriaId": 2,
    "categoria": {
      "id": 2,
      "nombre": "Tornillos y Clavos"
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
    "descripcion": "Caja x100 unidades, acero galvanizado",
    "precioVenta": 8.50,
    "stockActual": 3,
    "stockMinimo": 10,
    "activo": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
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
      },
      {
        "id": 3,
        "nombre": "Taladro Inalámbrico 12V",
        "precioVenta": 89.99,
        "stockActual": 8
      }
    ]
  },
  {
    "id": 2,
    "nombre": "Tornillos y Clavos",
    "productos": [
      {
        "id": 2,
        "nombre": "Tornillos Autoperforantes 1/2\"",
        "precioVenta": 8.50,
        "stockActual": 3
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

**Response 200:**
```json
{
  "message": "Categoría eliminada correctamente"
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
      },
      {
        "id": 3,
        "fecha": "2024-01-16T10:15:00.000Z",
        "total": 89.99
      }
    ]
  },
  {
    "id": 2,
    "nombre": "María González",
    "correo": "maria.gonzalez@email.com",
    "telefono": "+1234567891",
    "direccion": "Avenida Central 456, Ciudad",
    "ventas": []
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

### Eliminar Cliente (Admin)
**DELETE** `/api/clientes/:id`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Response 200:**
```json
{
  "message": "Cliente eliminado correctamente"
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
      },
      {
        "id": 2,
        "ventaId": 1,
        "productoId": 2,
        "cantidad": 1,
        "precioUnitario": 8.50,
        "producto": {
          "id": 2,
          "nombre": "Tornillos Autoperforantes 1/2\"",
          "precioVenta": 8.50
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
    },
    {
      "id": 2,
      "ventaId": 1,
      "productoId": 2,
      "cantidad": 1,
      "precioUnitario": 8.50,
      "producto": {
        "id": 2,
        "nombre": "Tornillos Autoperforantes 1/2\"",
        "precioVenta": 8.50
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

**Request Body:**
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

**Response 201:**
```json
{
  "id": 4,
  "fecha": "2024-01-16T15:45:00.000Z",
  "total": 141.97,
  "clienteId": 1,
  "cliente": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com"
  },
  "usuarioId": 2,
  "usuario": {
    "id": 2,
    "nombre": "Carlos Vendedor",
    "correo": "carlos.vendedor@ferreteria.com"
  },
  "detalles": [
    {
      "id": 7,
      "ventaId": 4,
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 25.99,
      "producto": {
        "id": 1,
        "nombre": "Martillo de Garra 16oz",
        "precioVenta": 25.99
      }
    },
    {
      "id": 8,
      "ventaId": 4,
      "productoId": 3,
      "cantidad": 1,
      "precioUnitario": 89.99,
      "producto": {
        "id": 3,
        "nombre": "Taladro Inalámbrico 12V",
        "precioVenta": 89.99
      }
    }
  ]
}
```

### Venta sin Cliente (Venta Rápida)
**POST** `/api/ventas`

**Request Body:**
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

**Response 201:**
```json
{
  "id": 5,
  "fecha": "2024-01-16T16:00:00.000Z",
  "total": 42.50,
  "clienteId": null,
  "cliente": null,
  "usuarioId": 2,
  "usuario": {
    "id": 2,
    "nombre": "Carlos Vendedor",
    "correo": "carlos.vendedor@ferreteria.com"
  },
  "detalles": [
    {
      "id": 9,
      "ventaId": 5,
      "productoId": 2,
      "cantidad": 5,
      "precioUnitario": 8.50,
      "producto": {
        "id": 2,
        "nombre": "Tornillos Autoperforantes 1/2\"",
        "precioVenta": 8.50
      }
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

**Response 200:**
```json
[
  {
    "id": 1,
    "fecha": "2024-01-15T14:30:00.000Z",
    "total": 34.49,
    "cliente": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "usuario": {
      "id": 1,
      "nombre": "Administrador"
    }
  },
  {
    "id": 4,
    "fecha": "2024-01-16T15:45:00.000Z",
    "total": 141.97,
    "cliente": {
      "id": 1,
      "nombre": "Juan Pérez"
    },
    "usuario": {
      "id": 2,
      "nombre": "Carlos Vendedor"
    }
  }
]
```

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
  "timestamp": "2024-01-16T10:30:00.000Z",
  "uptime": 86400
}
```

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

1. **Autenticación:** Todas las rutas (excepto `/health`, `/ping` y `/api/usuarios/login`) requieren token JWT
2. **Autorización:** Las rutas marcadas con (Admin) solo son accesibles por usuarios con rol "admin"
3. **Stock:** Al crear ventas, el stock se actualiza automáticamente
4. **Timestamps:** Todas las fechas están en formato ISO 8601 UTC
5. **Precios:** Números decimales con máximo 2 decimales
6. **Soft Delete:** Los productos se marcan como inactivos en lugar de eliminarse
7. **Validaciones:** Todos los campos requeridos se validan en el backend

---

**🚀 ¡API Lista para usar en tu frontend!**
