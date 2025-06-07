import { Request, Response, NextFunction } from 'express';

// Middleware simple de rendimiento
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
};

// Utilidad para medir tiempo de ejecución
export const measureTime = async <T>(
  name: string, 
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    if (duration > 500) {
      console.warn(`⏱️  ${name} took ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ ${name} failed after ${duration}ms:`, error);
    throw error;
  }
};
