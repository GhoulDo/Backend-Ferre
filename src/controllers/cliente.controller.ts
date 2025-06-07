import { Request, Response } from 'express';
import { ClienteService } from '../services/cliente.service';
import { logger } from '../utils/logger';

export class ClienteController {
  static async getAll(req: Request, res: Response) {
    try {
      const { limit, search, simple } = req.query;
      
      let clientes;
      if (simple === 'true') {
        // Para dropdowns, usar método optimizado
        clientes = await ClienteService.getAllSimple();
      } else if (search) {
        // Búsqueda con término
        clientes = await ClienteService.search(
          search as string, 
          parseInt(limit as string) || 20
        );
      } else {
        // Lista completa
        clientes = await ClienteService.getAll();
      }
      
      res.json(clientes);
    } catch (error) {
      logger.error('Error al obtener clientes', { error, user: req.user?.userId });
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
      logger.error('Error al obtener cliente', { error, clienteId: req.params.id });
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const cliente = await ClienteService.create(req.body);
      logger.info('Cliente creado', { clienteId: cliente.id, user: req.user?.userId });
      res.status(201).json(cliente);
    } catch (error: any) {
      logger.error('Error al crear cliente', { error, data: req.body, user: req.user?.userId });
      
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: 'Ya existe un cliente con ese correo electrónico',
          field: 'correo'
        });
      }
      
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.update(parseInt(id), req.body);
      logger.info('Cliente actualizado', { clienteId: id, user: req.user?.userId });
      res.json(cliente);
    } catch (error: any) {
      logger.error('Error al actualizar cliente', { error, clienteId: req.params.id });
      
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: 'Ya existe un cliente con ese correo electrónico',
          field: 'correo'
        });
      }
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClienteService.delete(parseInt(id));
      logger.info('Cliente eliminado', { clienteId: id, user: req.user?.userId });
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error: any) {
      logger.error('Error al eliminar cliente', { error, clienteId: req.params.id });
      
      if (error.message.includes('ventas asociadas')) {
        return res.status(400).json({ 
          error: error.message,
          code: 'CLIENT_HAS_SALES'
        });
      }
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  }

  // Nuevo endpoint para estadísticas de clientes
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await ClienteService.getClienteStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error al obtener estadísticas de clientes', { error });
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }
}
