import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClienteService {
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
    const cacheKey = 'clientes_all';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const clientes = await prisma.cliente.findMany({
      include: { 
        ventas: {
          select: {
            id: true,
            fecha: true,
            total: true
          },
          orderBy: { fecha: 'desc' },
          take: 5 // Solo las últimas 5 ventas para evitar sobrecarga
        }
      },
      orderBy: { nombre: 'asc' }
    });

    this.setCache(cacheKey, clientes);
    return clientes;
  }

  static async getById(id: number) {
    const cacheKey = `cliente_${id}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { 
        ventas: {
          include: {
            detalles: {
              include: {
                producto: {
                  select: { id: true, nombre: true }
                }
              }
            }
          },
          orderBy: { fecha: 'desc' }
        }
      }
    });

    if (cliente) {
      this.setCache(cacheKey, cliente);
    }
    return cliente;
  }

  static async create(data: any) {
    // Limpiar cache al crear
    this.cache.clear();
    
    return await prisma.cliente.create({
      data,
      include: { ventas: true }
    });
  }

  static async update(id: number, data: any) {
    // Limpiar cache al actualizar
    this.cache.clear();
    
    return await prisma.cliente.update({
      where: { id },
      data,
      include: { 
        ventas: {
          select: {
            id: true,
            fecha: true,
            total: true
          },
          orderBy: { fecha: 'desc' },
          take: 5
        }
      }
    });
  }

  static async delete(id: number) {
    // Verificar si tiene ventas asociadas
    const ventasCount = await prisma.venta.count({
      where: { clienteId: id }
    });

    if (ventasCount > 0) {
      throw new Error('No se puede eliminar el cliente porque tiene ventas asociadas');
    }

    // Limpiar cache al eliminar
    this.cache.clear();
    
    return await prisma.cliente.delete({
      where: { id }
    });
  }

  // Método de búsqueda que estaba faltando
  static async search(term: string, limit: number = 20) {
    return await prisma.cliente.findMany({
      where: {
        OR: [
          { nombre: { contains: term, mode: 'insensitive' } },
          { correo: { contains: term, mode: 'insensitive' } },
          { telefono: { contains: term, mode: 'insensitive' } }
        ]
      },
      include: {
        ventas: {
          select: {
            id: true,
            fecha: true,
            total: true
          },
          orderBy: { fecha: 'desc' },
          take: 3
        }
      },
      take: limit,
      orderBy: { nombre: 'asc' }
    });
  }

  // Método optimizado para obtener solo nombres (para dropdowns)
  static async getAllSimple() {
    const cacheKey = 'clientes_simple';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true
      },
      orderBy: { nombre: 'asc' }
    });

    this.setCache(cacheKey, clientes);
    return clientes;
  }

  // Obtener estadísticas de clientes
  static async getClienteStats() {
    const cacheKey = 'cliente_stats';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const [totalClientes, clientesConVentas] = await Promise.all([
      prisma.cliente.count(),
      prisma.cliente.count({
        where: {
          ventas: {
            some: {}
          }
        }
      })
    ]);

    const stats = {
      totalClientes,
      clientesConVentas,
      clientesSinVentas: totalClientes - clientesConVentas
    };

    this.setCache(cacheKey, stats);
    return stats;
  }
}
