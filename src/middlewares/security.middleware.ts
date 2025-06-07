import { Request, Response, NextFunction } from 'express';

// Middleware simple para limitar login (sin dependencias externas)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const loginLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxAttempts = 5;

  const attempt = loginAttempts.get(ip);
  
  if (attempt) {
    if (now - attempt.lastAttempt > windowMs) {
      // Reset después del tiempo límite
      loginAttempts.set(ip, { count: 1, lastAttempt: now });
    } else if (attempt.count >= maxAttempts) {
      return res.status(429).json({
        error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.'
      });
    } else {
      attempt.count++;
      attempt.lastAttempt = now;
    }
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  }

  next();
};

// Middleware simple para rate limiting general
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const generalLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 100;

  const requestData = requestCounts.get(ip);
  
  if (requestData) {
    if (now > requestData.resetTime) {
      // Reset después del tiempo límite
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (requestData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Demasiadas peticiones. Intenta de nuevo más tarde.'
      });
    } else {
      requestData.count++;
    }
  } else {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
  }

  next();
};

// Middleware para validar parámetros numéricos
export const validateNumericParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const param = req.params[paramName];
    const numericParam = parseInt(param);
    
    if (isNaN(numericParam) || numericParam <= 0) {
      return res.status(400).json({ 
        error: `El parámetro ${paramName} debe ser un número válido mayor a 0` 
      });
    }
    
    next();
  };
};

// Middleware para limpiar datos de entrada
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (str: string) => {
    return str.toString().trim();
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};
