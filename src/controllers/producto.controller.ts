import { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { logger } from '../utils/logger';

export class ProductoController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productos = await ProductoService.getAll();
      res.json(productos);
    } catch (error) {
      logger.error('Error al obtener productos', { error, user: req.user?.userId });
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const producto = await ProductoService.getById(parseInt(id));
      if (!producto) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json(producto);
    } catch (error) {
      logger.error('Error al obtener producto', { error, productId: req.params.id });
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const producto = await ProductoService.create(req.body);
      logger.info('Producto creado', { productoId: producto.id, user: req.user?.userId });
      res.status(201).json(producto);
    } catch (error) {
      logger.error('Error al crear producto', { error, data: req.body, user: req.user?.userId });
      res.status(500).json({ error: 'Error al crear producto' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const producto = await ProductoService.update(parseInt(id), req.body);
      logger.info('Producto actualizado', { productoId: id, user: req.user?.userId });
      res.json(producto);
    } catch (error) {
      logger.error('Error al actualizar producto', { error, productId: req.params.id });
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ProductoService.delete(parseInt(id));
      logger.info('Producto eliminado', { productoId: id, user: req.user?.userId });
      res.json({ message: 'Producto desactivado correctamente' });
    } catch (error) {
      logger.error('Error al eliminar producto', { error, productId: req.params.id });
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }

  static async getLowStock(req: Request, res: Response): Promise<void> {
    try {
      const productos = await ProductoService.getLowStock();
      res.json(productos);
    } catch (error) {
      logger.error('Error al obtener productos con stock bajo', { error });
      res.status(500).json({ error: 'Error al obtener productos con stock bajo' });
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await ProductoService.getProductStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error al obtener estadísticas de productos', { error });
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
}
