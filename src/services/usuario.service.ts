import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hash';

const prisma = new PrismaClient();

export class UsuarioService {
  static async getAll() {
    return await prisma.usuario.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        activo: true
      }
    });
  }

  static async getById(id: number) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        activo: true
      }
    });
  }

  static async create(data: any) {
    const hashedPassword = await hashPassword(data.contrasena);
    return await prisma.usuario.create({
      data: {
        ...data,
        contrasena: hashedPassword
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        activo: true
      }
    });
  }

  static async update(id: number, data: any) {
    if (data.contrasena) {
      data.contrasena = await hashPassword(data.contrasena);
    }
    return await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        activo: true
      }
    });
  }

  static async delete(id: number) {
    return await prisma.usuario.update({
      where: { id },
      data: { activo: false }
    });
  }

  static async getByEmail(correo: string) {
    return await prisma.usuario.findUnique({
      where: { correo }
    });
  }
}
