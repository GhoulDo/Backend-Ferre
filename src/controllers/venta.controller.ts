import { Request, Response } from 'express';
import { VentaService } from '../services/venta.service';

export class VentaController {
  static async getAll(req: Request, res: Response) {
    try {
      const ventas = await VentaService.getAll();
      res.json(ventas);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      res.status(500).json({ error: 'Error al obtener ventas' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const venta = await VentaService.getById(parseInt(id));
      if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      res.json(venta);
    } catch (error) {
      console.error('Error al obtener venta:', error);
      res.status(500).json({ error: 'Error al obtener venta' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.userId;
      const venta = await VentaService.create(req.body, usuarioId);
      res.status(201).json(venta);
    } catch (error: any) {
      console.error('Error al crear venta:', error);
      if (error.message.includes('Stock insuficiente')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al crear venta' });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await VentaService.getVentasStats();
      res.json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  }

  static async getByDateRange(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ 
          error: 'Se requieren fechaInicio y fechaFin como parámetros' 
        });
      }

      const ventas = await VentaService.getVentasByDateRange(
        new Date(fechaInicio as string),
        new Date(fechaFin as string)
      );
      
      res.json(ventas);
    } catch (error) {
      console.error('Error al obtener ventas por rango de fechas:', error);
      res.status(500).json({ error: 'Error al obtener ventas por rango de fechas' });
    }
  }
}
