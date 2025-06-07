import { PrismaClient } from '@prisma/client';
import { ProductoService } from './producto.service';

const prisma = new PrismaClient();

export class VentaService {
  static async getAll() {
    return await prisma.venta.findMany({
      include: {
        cliente: true,
        usuario: {
          select: { id: true, nombre: true, correo: true }
        },
        detalles: {
          include: { 
            producto: {
              select: { id: true, nombre: true, precioVenta: true }
            }
          }
        }
      },
      orderBy: { fecha: 'desc' }
    });
  }

  static async getById(id: number) {
    return await prisma.venta.findUnique({
      where: { id },
      include: {
        cliente: true,
        usuario: {
          select: { id: true, nombre: true, correo: true }
        },
        detalles: {
          include: { 
            producto: {
              select: { id: true, nombre: true, precioVenta: true }
            }
          }
        }
      }
    });
  }

  static async create(data: any, usuarioId: number) {
    // Validar stock antes de crear la venta
    for (const detalle of data.detalles) {
      const hasStock = await ProductoService.checkStock(detalle.productoId, detalle.cantidad);
      if (!hasStock) {
        const producto = await ProductoService.getById(detalle.productoId);
        throw new Error(`Stock insuficiente para el producto: ${producto?.nombre}`);
      }
    }

    const total = data.detalles.reduce((sum: number, detalle: any) => 
      sum + (detalle.cantidad * detalle.precioUnitario), 0
    );

    return await prisma.$transaction(async (tx) => {
      // Crear la venta
      const venta = await tx.venta.create({
        data: {
          clienteId: data.clienteId,
          usuarioId,
          total
        }
      });

      // Crear detalles y actualizar stock
      for (const detalle of data.detalles) {
        await tx.detalleVenta.create({
          data: {
            ventaId: venta.id,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario
          }
        });

        // Actualizar stock
        await tx.producto.update({
          where: { id: detalle.productoId },
          data: {
            stockActual: {
              decrement: detalle.cantidad
            }
          }
        });
      }

      // Retornar venta completa
      return await tx.venta.findUnique({
        where: { id: venta.id },
        include: {
          cliente: true,
          usuario: {
            select: { id: true, nombre: true, correo: true }
          },
          detalles: {
            include: { 
              producto: {
                select: { id: true, nombre: true, precioVenta: true }
              }
            }
          }
        }
      });
    });
  }

  static async getVentasByDateRange(fechaInicio: Date, fechaFin: Date) {
    return await prisma.venta.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      include: {
        cliente: true,
        usuario: {
          select: { id: true, nombre: true, correo: true }
        },
        detalles: {
          include: { producto: true }
        }
      },
      orderBy: { fecha: 'desc' }
    });
  }

  static async getVentasStats() {
    const totalVentas = await prisma.venta.count();
    const totalIngresos = await prisma.venta.aggregate({
      _sum: { total: true }
    });
    
    const ventasHoy = await prisma.venta.count({
      where: {
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    return {
      totalVentas,
      totalIngresos: totalIngresos._sum.total || 0,
      ventasHoy
    };
  }
}
