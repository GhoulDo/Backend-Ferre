# Backend Ferretería

Backend RESTful para gestión de ferretería con TypeScript, Prisma y PostgreSQL, optimizado para despliegue en Render con sistema keep-alive.

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

## 🔄 Sistema Keep-Alive

El proyecto incluye un sistema automático para mantener el servicio activo en Render:

- **Auto-ping cada 14 minutos** para evitar suspensión del servicio gratuito
- **Health checks inteligentes** que verifican la base de datos
- **Monitoreo de recursos** (memoria, uptime)
- **Tareas de mantenimiento** programadas

### Endpoints de monitoreo:
- `GET /health` - Estado de salud del sistema
- `GET /ping` - Ping simple
- `GET /api/sistema/stats` - Estadísticas del sistema (Admin)
- `POST /api/sistema/keep-alive/ping` - Ping manual (Admin)

## 📋 Endpoints de la API

### Autenticación
- `POST /api/usuarios/login` - Iniciar sesión

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/stats` - Estadísticas de productos (Admin)
- `GET /api/productos/low-stock` - Productos con stock bajo
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)

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
- `GET /api/ventas/stats` - Estadísticas de ventas (Admin)
- `GET /api/ventas/range` - Ventas por rango de fechas
- `POST /api/ventas` - Crear venta

### Sistema (Admin)
- `GET /api/sistema/stats` - Estadísticas del servidor
- `GET /api/sistema/keep-alive/status` - Estado del keep-alive
- `POST /api/sistema/keep-alive/ping` - Ping manual

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
- Sistema keep-alive seguro

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
npm run health       # Verificar estado del servidor
npm run prisma:generate   # Generar cliente Prisma
npm run prisma:migrate    # Ejecutar migraciones
```

## 📊 Monitoreo en Producción

- Health checks automáticos cada 14 minutos
- Logs estructurados para debugging
- Monitoreo de memoria y uptime
- Alertas de rendimiento
- Tareas de mantenimiento automáticas

## 🚀 Características del Keep-Alive

- ✅ **Previene suspensión** del servicio gratuito en Render
- ✅ **Verificación de salud** de base de datos en cada ping
- ✅ **Logs inteligentes** que no saturan el sistema
- ✅ **Reintentos automáticos** en caso de fallo
- ✅ **Monitoreo de rendimiento** incluido

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para tu feature
3. Commit tus cambios
4. Push al branch
5. Crear Pull Request

## 📝 Licencia

ISC License
