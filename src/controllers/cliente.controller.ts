import { Request, Response } from 'express';
import { ClienteService } from '../services/cliente.service';

export class ClienteController {
  static async getAll(req: Request, res: Response) {
    try {
      const clientes = await ClienteService.getAll();
      res.json(clientes);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.getById(parseInt(id));
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const cliente = await ClienteService.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.update(parseInt(id), req.body);
      res.json(cliente);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClienteService.delete(parseInt(id));
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  }
}
