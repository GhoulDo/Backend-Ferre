import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClienteService {
  static async getAll() {
    return await prisma.cliente.findMany({
      include: { ventas: true }
    });
  }

  static async getById(id: number) {
    return await prisma.cliente.findUnique({
      where: { id },
      include: { ventas: true }
    });
  }

  static async create(data: any) {
    return await prisma.cliente.create({
      data,
      include: { ventas: true }
    });
  }

  static async update(id: number, data: any) {
    return await prisma.cliente.update({
      where: { id },
      data,
      include: { ventas: true }
    });
  }

  static async delete(id: number) {
    return await prisma.cliente.delete({
      where: { id }
    });
  }
}
