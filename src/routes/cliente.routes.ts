import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { validateNumericParam } from '../middlewares/security.middleware';
import { ClienteSchema } from '../utils/schemas';

const router = Router();

// Rutas accesibles para todos los usuarios autenticados
router.get('/', authenticateToken, ClienteController.getAll);
router.get('/stats', authenticateToken, requireAdmin, ClienteController.getStats);
router.get('/:id', authenticateToken, validateNumericParam('id'), ClienteController.getById);
router.post('/', authenticateToken, validate(ClienteSchema), ClienteController.create);
router.put('/:id', authenticateToken, validateNumericParam('id'), validate(ClienteSchema.partial()), ClienteController.update);

// Solo admin puede eliminar clientes
router.delete('/:id', authenticateToken, requireAdmin, validateNumericParam('id'), ClienteController.delete);

export default router;
