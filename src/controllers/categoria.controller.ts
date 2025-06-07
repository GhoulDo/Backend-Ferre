import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';
import { logger } from '../utils/logger';

export class CategoriaController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await CategoriaService.getAll();
      res.json(categorias);
    } catch (error) {
      logger.error('Error al obtener categorías', { error, user: req.user?.userId });
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await CategoriaService.getById(parseInt(id));
      
      if (!categoria) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      
      res.json(categoria);
    } catch (error) {
      logger.error('Error al obtener categoría', { error, categoriaId: req.params.id });
      res.status(500).json({ error: 'Error al obtener categoría' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const categoria = await CategoriaService.create(req.body);
      logger.info('Categoría creada', { categoriaId: categoria.id, user: req.user?.userId });
      res.status(201).json(categoria);
    } catch (error: any) {
      logger.error('Error al crear categoría', { error, data: req.body, user: req.user?.userId });
      
      if (error.code === 'P2002') {
        res.status(409).json({ 
          error: 'Ya existe una categoría con ese nombre',
          field: 'nombre'
        });
        return;
      }
      
      res.status(500).json({ error: 'Error al crear categoría' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await CategoriaService.update(parseInt(id), req.body);
      logger.info('Categoría actualizada', { categoriaId: id, user: req.user?.userId });
      res.json(categoria);
    } catch (error: any) {
      logger.error('Error al actualizar categoría', { error, categoriaId: req.params.id });
      
      if (error.code === 'P2002') {
        res.status(409).json({ 
          error: 'Ya existe una categoría con ese nombre',
          field: 'nombre'
        });
        return;
      }
      
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      
      res.status(500).json({ error: 'Error al actualizar categoría' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await CategoriaService.delete(parseInt(id));
      logger.info('Categoría eliminada', { categoriaId: id, user: req.user?.userId });
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error: any) {
      logger.error('Error al eliminar categoría', { error, categoriaId: req.params.id });
      
      if (error.code === 'P2003') {
        res.status(400).json({ 
          error: 'No se puede eliminar la categoría porque tiene productos asociados',
          code: 'CATEGORY_HAS_PRODUCTS'
        });
        return;
      }
      
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
      }
      
      res.status(500).json({ error: 'Error al eliminar categoría' });
    }
  }
}
