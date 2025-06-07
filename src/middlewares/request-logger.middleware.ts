import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  // Solo loggear en producción o si hay errores
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    const logData = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip: ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    };

    if (statusCode >= 400) {
      logger.error(`${method} ${url} - ${statusCode}`, logData);
    } else if (process.env.NODE_ENV === 'production' && duration > 1000) {
      logger.warn(`Slow request: ${method} ${url}`, logData);
    } else if (process.env.NODE_ENV === 'development') {
      logger.info(`${method} ${url} - ${statusCode}`, logData);
    }
  });

  next();
};
