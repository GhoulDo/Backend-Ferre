# Backend Ferretería

Backend RESTful para gestión de ferretería con TypeScript, Prisma y PostgreSQL, optimizado para despliegue en Render.

## 🚀 Instalación Local

1. **Clonar repositorio:**
```bash
git clone <tu-repositorio>
cd Backend-Ferre
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Ejecutar migraciones:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Iniciar en desarrollo:**
```bash
npm run dev
```

## 🌐 Despliegue en Render

### Prerrequisitos
1. Cuenta en [Render.com](https://render.com)
2. Base de datos PostgreSQL creada en Render
3. Repositorio en GitHub/GitLab

### Pasos para desplegar:

1. **Crear Web Service en Render:**
   - Conectar tu repositorio
   - Configurar:
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Environment:** `Node`

2. **Variables de entorno en Render:**
```bash
DATABASE_URL=postgresql://admin_ferreteria:PASSWORD@HOST/DB_NAME?sslmode=require
JWT_SECRET=tu_secreto_jwt_super_seguro
NODE_ENV=production
PORT=10000
```

3. **Configurar Auto-Deploy desde Git**

### Build Commands para Render:
```bash
# Comando de build completo
npm install && npm run build && npx prisma migrate deploy && npx prisma generate
```

## 📋 Endpoints de la API

### Autenticación
- `POST /api/usuarios/login` - Iniciar sesión

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)
- `GET /api/productos/low-stock` - Productos con stock bajo

### Categorías
- `GET /api/categorias` - Listar categorías
- `GET /api/categorias/:id` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría (Admin)
- `PUT /api/categorias/:id` - Actualizar categoría (Admin)
- `DELETE /api/categorias/:id` - Eliminar categoría (Admin)

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Obtener cliente por ID
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente (Admin)

### Usuarios
- `GET /api/usuarios` - Listar usuarios (Admin)
- `POST /api/usuarios` - Crear usuario (Admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (Admin)
- `DELETE /api/usuarios/:id` - Eliminar usuario (Admin)

### Ventas
- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/:id` - Obtener venta por ID
- `POST /api/ventas` - Crear venta
- `GET /api/ventas/stats` - Estadísticas de ventas (Admin)
- `GET /api/ventas/range` - Ventas por rango de fechas

## 🔑 Credenciales por defecto
- **Email:** admin@ferreteria.com
- **Contraseña:** admin123

## 🛡️ Seguridad

- Rate limiting en endpoints sensibles
- Validación de datos con Zod
- Headers de seguridad HTTP
- Hash de contraseñas con bcrypt
- JWT para autenticación
- Sanitización de inputs

## 🗄️ Base de datos

El proyecto usa PostgreSQL con Prisma ORM. Las migraciones se ejecutan automáticamente en el despliegue.

### Modelos principales:
- **Usuario** - Gestión de usuarios y roles
- **Producto** - Inventario de productos
- **Categoria** - Categorización de productos
- **Cliente** - Información de clientes
- **Venta** - Registros de ventas
- **DetalleVenta** - Detalles de cada venta

## 🔧 Scripts disponibles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Ejecutar en producción
npm run prisma:generate   # Generar cliente Prisma
npm run prisma:migrate    # Ejecutar migraciones
```

## 📊 Monitoreo

- **Health Check:** `/health`
- **Info de API:** `/`
- Logs estructurados para debugging

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para tu feature
3. Commit tus cambios
4. Push al branch
5. Crear Pull Request

## 📝 Licencia

ISC License
