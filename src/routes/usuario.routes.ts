import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { loginLimiter } from '../middlewares/security.middleware';
import { UsuarioSchema, LoginSchema } from '../utils/schemas';

const router = Router();

router.post('/login', loginLimiter, validate(LoginSchema), UsuarioController.login);
router.get('/', authenticateToken, requireRole(['admin']), UsuarioController.getAll);
router.post('/', authenticateToken, requireRole(['admin']), validate(UsuarioSchema), UsuarioController.create);
router.put('/:id', authenticateToken, requireRole(['admin']), validate(UsuarioSchema.partial()), UsuarioController.update);
router.delete('/:id', authenticateToken, requireRole(['admin']), UsuarioController.delete);

export default router;
