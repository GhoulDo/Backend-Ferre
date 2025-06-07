import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service';

export class CategoriaController {
  static async getAll(req: Request, res: Response) {
    try {
      const categorias = await CategoriaService.getAll();
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaService.getById(parseInt(id));
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      res.json(categoria);
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({ error: 'Error al obtener categoría' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const categoria = await CategoriaService.create(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({ error: 'Error al crear categoría' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaService.update(parseInt(id), req.body);
      res.json(categoria);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({ error: 'Error al actualizar categoría' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CategoriaService.delete(parseInt(id));
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({ error: 'Error al eliminar categoría' });
    }
  }
}
