import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface CustomError extends Error {
  code?: string;
  meta?: any;
  statusCode?: number;
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction): void => {
  // Log detallado del error
  logger.error('Request error', {
    message: error.message,
    code: error.code,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    url: req.url,
    method: req.method,
    user: req.user?.userId,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Errores específicos de Prisma
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'campo';
    res.status(409).json({
      error: `Ya existe un registro con ese ${field}`,
      field: error.meta?.target,
      code: 'DUPLICATE_ENTRY'
    });
    return;
  }

  if (error.code === 'P2025') {
    res.status(404).json({
      error: 'Registro no encontrado',
      code: 'NOT_FOUND'
    });
    return;
  }

  if (error.code === 'P2003') {
    res.status(400).json({
      error: 'No se puede eliminar el registro porque está siendo utilizado por otros registros',
      code: 'FOREIGN_KEY_CONSTRAINT'
    });
    return;
  }

  if (error.code === 'P2014') {
    res.status(400).json({
      error: 'La operación viola una restricción de integridad',
      code: 'INTEGRITY_CONSTRAINT'
    });
    return;
  }

  // Errores de validación personalizados
  if (error.message.includes('Stock insuficiente')) {
    res.status(400).json({
      error: error.message,
      code: 'INSUFFICIENT_STOCK'
    });
    return;
  }

  // Errores de autenticación JWT
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expirado',
      code: 'EXPIRED_TOKEN'
    });
    return;
  }

  // Error genérico
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Error interno del servidor' : error.message,
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    code: 'ROUTE_NOT_FOUND'
  });
};
