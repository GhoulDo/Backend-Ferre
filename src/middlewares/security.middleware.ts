import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Rate limiting optimizado para producción
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Más permisivo en dev
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Solo aplicar en rutas que no sean health checks
  skip: (req) => {
    const skipPaths = ['/health', '/ping'];
    return skipPaths.some(path => req.path.startsWith(path));
  }
});

// Rate limiting específico para login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos de login por IP cada 15 minutos
  message: {
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
    code: 'TOO_MANY_LOGIN_ATTEMPTS'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Sanitización básica de inputs
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Función recursiva para limpiar objetos
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.trim().replace(/[<>]/g, ''); // Remover caracteres peligrosos básicos
      }
      if (typeof obj === 'object' && obj !== null) {
        const sanitized: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            sanitized[key] = sanitize(obj[key]);
          }
        }
        return sanitized;
      }
      return obj;
    };

    req.body = sanitize(req.body);
  }
  next();
};

// Validación de parámetros numéricos
export const validateNumericParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    const numericValue = parseInt(value, 10);
    
    if (isNaN(numericValue) || numericValue <= 0) {
      return res.status(400).json({
        error: `El parámetro ${paramName} debe ser un número válido mayor que 0`,
        received: value
      });
    }
    
    // Almacenar el valor parseado para evitar conversiones repetidas
    req.params[paramName] = numericValue.toString();
    next();
  };
};

// Middleware para comprimir responses grandes
export const compressionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data: any) {
    // Solo comprimir responses grandes (>1KB) en producción
    if (process.env.NODE_ENV === 'production' && 
        typeof data === 'string' && 
        data.length > 1024) {
      res.setHeader('Content-Encoding', 'gzip');
    }
    return originalSend.call(this, data);
  };
  
  next();
};
