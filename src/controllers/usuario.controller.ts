import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export class UsuarioController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { correo, contrasena } = req.body;
      
      const usuario = await UsuarioService.getByEmail(correo);
      if (!usuario || !usuario.activo) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      const isValidPassword = await comparePassword(contrasena, usuario.contrasena);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }

      const token = generateToken({
        userId: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      });

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const usuarios = await UsuarioService.getAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const usuario = await UsuarioService.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.update(parseInt(id), req.body);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UsuarioService.delete(parseInt(id));
      res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
}
