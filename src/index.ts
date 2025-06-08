import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importar rutas
import productoRoutes from './routes/producto.routes';
import categoriaRoutes from './routes/categoria.routes';
import clienteRoutes from './routes/cliente.routes';
import usuarioRoutes from './routes/usuario.routes';
import ventaRoutes from './routes/venta.routes';
import sistemaRoutes from './routes/sistema.routes';

// Importar middlewares
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { generalLimiter, sanitizeInput } from './middlewares/security.middleware';

// Importar keep-alive y scheduler
import { keepAlive } from './utils/keep-alive';
import { scheduler, scheduleMaintenanceTasks } from './utils/scheduler';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Verificar variables de entorno críticas
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no está configurada');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ Error: JWT_SECRET no está configurada');
  process.exit(1);
}

// Configurar Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

// Configuración de CORS
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [
        'https://backend-ferre.onrender.com',
        'https://frontend-ferre.onrender.com',
        'https://v0-ferreteria-frontend.vercel.app', // ✅ Tu frontend desplegado
        /\.onrender\.com$/,
        /\.vercel\.app$/,
        /\.netlify\.app$/
      ]
    : [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://localhost:8080',
        'http://localhost:4000'
      ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400
};

// Configurar trust proxy
app.set('trust proxy', 1);

// Middlewares básicos
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting solo en producción
if (NODE_ENV === 'production') {
  app.use(generalLimiter);
}

app.use(sanitizeInput);

// Headers de seguridad
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const userAgent = req.get('User-Agent') || '';
    const isAutoPing = userAgent.includes('node') || userAgent.includes('curl');
    
    let dbStatus = 'connected';
    if (!isAutoPing) {
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch {
        dbStatus = 'error';
      }
    }
    
    const healthData = {
      status: 'OK', 
      message: 'Backend Ferretería funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: NODE_ENV,
      database: dbStatus,
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };

    res.json(healthData);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Error de conexión a la base de datos',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    });
  }
});

// Ping ultra-rápido
app.get('/ping', (req, res) => {
  res.json({
    pong: true,
    timestamp: Date.now(),
    uptime: Math.floor(process.uptime())
  });
});

// Endpoint de información optimizado
app.get('/', (req, res) => {
  res.json({
    api: 'Backend Ferretería API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      productos: '/api/productos',
      categorias: '/api/categorias',
      clientes: '/api/clientes',
      usuarios: '/api/usuarios',
      ventas: '/api/ventas'
    }
  });
});

// Rutas de la API con prefijos
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/sistema', sistemaRoutes);

// Middleware de manejo de errores
app.use(errorHandler);
app.use('*', notFoundHandler);

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    
    // Verificar si las tablas existen
    try {
      await prisma.usuario.findFirst();
      console.log('✅ Tablas de base de datos verificadas');
    } catch (error) {
      console.log('⚠️  Las tablas no existen, ejecuta las migraciones de Prisma');
      console.log('   Comando: npx prisma migrate deploy');
    }
    
    // Crear usuario admin por defecto si no existe
    const adminExists = await prisma.usuario.findUnique({
      where: { correo: 'admin@ferreteria.com' }
    });
    
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.usuario.create({
        data: {
          nombre: 'Administrador',
          correo: 'admin@ferreteria.com',
          contrasena: hashedPassword,
          rol: 'admin'
        }
      });
      console.log('✅ Usuario administrador creado: admin@ferreteria.com / admin123');
    }

    // Crear categorías por defecto
    const categoriasCount = await prisma.categoria.count();
    if (categoriasCount === 0) {
      await prisma.categoria.createMany({
        data: [
          { nombre: 'Herramientas' },
          { nombre: 'Tornillos y Clavos' },
          { nombre: 'Pintura' },
          { nombre: 'Electricidad' },
          { nombre: 'Plomería' },
          { nombre: 'Ferretería General' }
        ]
      });
      console.log('✅ Categorías por defecto creadas');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    
    if (NODE_ENV === 'production') {
      console.log('🔄 Reintentando conexión en 5 segundos...');
      setTimeout(initializeDatabase, 5000);
      return;
    }
    
    process.exit(1);
  }
}

// Iniciar servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    // Corregir: usar PORT como número y simplificar la llamada
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Modo: ${NODE_ENV}`);
      console.log(`🌐 URL base: http://localhost:${PORT}`);
      
      if (NODE_ENV === 'production') {
        console.log(`🌐 URL producción: https://backend-ferre.onrender.com`);
        
        // Iniciar servicios de mantenimiento
        setTimeout(() => {
          keepAlive.start();
          scheduleMaintenanceTasks();
          console.log('🔧 Servicios de mantenimiento iniciados');
        }, 30000); // Esperar 30 segundos después del inicio
      }
    });

    // Configurar timeout para requests largos
    server.timeout = 30000; // 30 segundos
    server.keepAliveTimeout = 5000;
    server.headersTimeout = 6000;
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

// Manejo de cierre graceful
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor gracefully...`);
  
  try {
    keepAlive.stop();
    scheduler.cancelAllTasks();
    await prisma.$disconnect();
    console.log('✅ Conexión a base de datos cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el cierre:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  if (NODE_ENV === 'production') {
    gracefulShutdown('unhandledRejection');
  }
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
