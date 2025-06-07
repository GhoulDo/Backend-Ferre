import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductoService {
  static async getAll() {
    return await prisma.producto.findMany({
      include: { categoria: true },
      where: { activo: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: number) {
    return await prisma.producto.findUnique({
      where: { id, activo: true },
      include: { categoria: true }
    });
  }

  static async create(data: any) {
    return await prisma.producto.create({
      data,
      include: { categoria: true }
    });
  }

  static async update(id: number, data: any) {
    return await prisma.producto.update({
      where: { id },
      data,
      include: { categoria: true }
    });
  }

  static async delete(id: number) {
    return await prisma.producto.update({
      where: { id },
      data: { activo: false }
    });
  }

  // Corregir la consulta de stock bajo
  static async getLowStock() {
    return await prisma.$queryRaw`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM "Producto" p
      LEFT JOIN "Categoria" c ON p."categoriaId" = c.id
      WHERE p.activo = true AND p."stockActual" <= p."stockMinimo"
      ORDER BY p."stockActual" ASC
    `;
  }

  static async checkStock(productoId: number, cantidad: number): Promise<boolean> {
    const producto = await prisma.producto.findUnique({
      where: { id: productoId, activo: true }
    });
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto.stockActual >= cantidad;
  }

  static async updateStock(productoId: number, cantidad: number) {
    return await prisma.producto.update({
      where: { id: productoId },
      data: {
        stockActual: {
          decrement: cantidad
        }
      }
    });
  }

  // Nuevo método para obtener estadísticas de productos
  static async getProductStats() {
    const totalProductos = await prisma.producto.count({
      where: { activo: true }
    });

    const productosBajoStock = await prisma.producto.count({
      where: {
        activo: true,
        stockActual: {
          lte: prisma.producto.fields.stockMinimo
        }
      }
    });

    const valorInventario = await prisma.producto.aggregate({
      where: { activo: true },
      _sum: {
        stockActual: true
      }
    });

    return {
      totalProductos,
      productosBajoStock,
      totalUnidades: valorInventario._sum.stockActual || 0
    };
  }
}
