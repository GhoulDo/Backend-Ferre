import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoriaService {
  static async getAll() {
    return await prisma.categoria.findMany({
      include: { productos: true }
    });
  }

  static async getById(id: number) {
    return await prisma.categoria.findUnique({
      where: { id },
      include: { productos: true }
    });
  }

  static async create(data: any) {
    return await prisma.categoria.create({
      data,
      include: { productos: true }
    });
  }

  static async update(id: number, data: any) {
    return await prisma.categoria.update({
      where: { id },
      data,
      include: { productos: true }
    });
  }

  static async delete(id: number) {
    return await prisma.categoria.delete({
      where: { id }
    });
  }
}
