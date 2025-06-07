import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductoService {
  // Cache simple en memoria para consultas frecuentes
  private static cache = new Map();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutos

  private static setCache(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private static getCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  static async getAll() {
    const cacheKey = 'productos_all';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const productos = await prisma.producto.findMany({
      where: { activo: true },
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    this.setCache(cacheKey, productos);
    return productos;
  }

  static async getById(id: number) {
    const cacheKey = `producto_${id}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const producto = await prisma.producto.findUnique({
      where: { id, activo: true },
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      }
    });

    if (producto) {
      this.setCache(cacheKey, producto);
    }
    return producto;
  }

  static async create(data: any) {
    // Limpiar cache al crear
    this.cache.clear();
    
    return await prisma.producto.create({
      data,
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      }
    });
  }

  static async update(id: number, data: any) {
    // Limpiar cache al actualizar
    this.cache.clear();
    
    return await prisma.producto.update({
      where: { id },
      data,
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      }
    });
  }

  static async delete(id: number) {
    // Limpiar cache al eliminar
    this.cache.clear();
    
    return await prisma.producto.update({
      where: { id },
      data: { activo: false }
    });
  }

  static async getLowStock() {
    const cacheKey = 'productos_low_stock';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const productos = await prisma.$queryRaw`
      SELECT p.*, c.nombre as categoria_nombre
      FROM "Producto" p
      LEFT JOIN "Categoria" c ON p."categoriaId" = c.id
      WHERE p.activo = true AND p."stockActual" <= p."stockMinimo"
      ORDER BY (p."stockActual"::float / NULLIF(p."stockMinimo", 0)) ASC
    `;

    this.setCache(cacheKey, productos);
    return productos;
  }

  static async getProductStats() {
    const cacheKey = 'producto_stats';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const [totalProductos, productosBajoStock, totalUnidades] = await Promise.all([
      prisma.producto.count({ where: { activo: true } }),
      prisma.producto.count({
        where: {
          activo: true,
          stockActual: { lte: prisma.producto.fields.stockMinimo }
        }
      }),
      prisma.producto.aggregate({
        where: { activo: true },
        _sum: { stockActual: true }
      })
    ]);

    const stats = {
      totalProductos,
      productosBajoStock,
      totalUnidades: totalUnidades._sum.stockActual || 0
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  static async checkStock(id: number, cantidad: number): Promise<boolean> {
    const producto = await prisma.producto.findUnique({
      where: { id, activo: true },
      select: { stockActual: true }
    });
    
    return producto ? producto.stockActual >= cantidad : false;
  }

  // Método para búsqueda optimizada
  static async search(term: string, limit: number = 20) {
    return await prisma.producto.findMany({
      where: {
        activo: true,
        OR: [
          { nombre: { contains: term, mode: 'insensitive' } },
          { descripcion: { contains: term, mode: 'insensitive' } }
        ]
      },
      include: {
        categoria: {
          select: { id: true, nombre: true }
        }
      },
      take: limit,
      orderBy: { nombre: 'asc' }
    });
  }
}
