import { z } from 'zod';

export const ProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  precioVenta: z.number().positive("El precio debe ser positivo"),
  stockActual: z.number().int().min(0, "El stock debe ser mayor o igual a 0"),
  stockMinimo: z.number().int().min(0, "El stock mínimo debe ser mayor o igual a 0"),
  categoriaId: z.number().int().optional()
});

export const CategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido")
});

export const ClienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  correo: z.string().email("Email inválido"),
  telefono: z.string().optional(),
  direccion: z.string().optional()
});

export const UsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  correo: z.string().email("Email inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["admin", "vendedor"]).default("vendedor")
});

export const LoginSchema = z.object({
  correo: z.string().email("Email inválido"),
  contrasena: z.string().min(1, "La contraseña es requerida")
});

export const VentaSchema = z.object({
  clienteId: z.number().int().optional(),
  detalles: z.array(z.object({
    productoId: z.number().int(),
    cantidad: z.number().int().positive("La cantidad debe ser positiva"),
    precioUnitario: z.number().positive("El precio unitario debe ser positivo")
  })).min(1, "Debe incluir al menos un producto")
});
