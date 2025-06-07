import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoriaService {
  private static cache = new Map();
  private static cacheTimeout = 10 * 60 * 1000; // 10 minutos (categorías cambian menos)

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
    const cacheKey = 'categorias_all';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const categorias = await prisma.categoria.findMany({
      include: {
        productos: {
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            precioVenta: true,
            stockActual: true
          }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    this.setCache(cacheKey, categorias);
    return categorias;
  }

  static async getById(id: number) {
    const cacheKey = `categoria_${id}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: {
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precioVenta: true,
            stockActual: true,
            stockMinimo: true,
            activo: true
          }
        }
      }
    });

    if (categoria) {
      this.setCache(cacheKey, categoria);
    }
    return categoria;
  }

  static async create(data: any) {
    this.cache.clear();
    return await prisma.categoria.create({
      data,
      include: { productos: true }
    });
  }

  static async update(id: number, data: any) {
    this.cache.clear();
    return await prisma.categoria.update({
      where: { id },
      data,
      include: { productos: true }
    });
  }

  static async delete(id: number) {
    // Verificar si tiene productos asociados
    const productCount = await prisma.producto.count({
      where: { categoriaId: id, activo: true }
    });

    if (productCount > 0) {
      throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
    }

    this.cache.clear();
    return await prisma.categoria.delete({
      where: { id }
    });
  }

  // Método optimizado para obtener solo nombres (para dropdowns)
  static async getAllSimple() {
    const cacheKey = 'categorias_simple';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const categorias = await prisma.categoria.findMany({
      select: {
        id: true,
        nombre: true
      },
      orderBy: { nombre: 'asc' }
    });

    this.setCache(cacheKey, categorias);
    return categorias;
  }
}
