import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { ClienteSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, ClienteController.getAll);
router.get('/:id', authenticateToken, ClienteController.getById);
router.post('/', authenticateToken, validate(ClienteSchema), ClienteController.create);
router.put('/:id', authenticateToken, validate(ClienteSchema.partial()), ClienteController.update);
router.delete('/:id', authenticateToken, requireRole(['admin']), ClienteController.delete);

export default router;
