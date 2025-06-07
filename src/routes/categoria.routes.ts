import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CategoriaSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, CategoriaController.getAll);
router.get('/:id', authenticateToken, CategoriaController.getById);
router.post('/', authenticateToken, requireRole(['admin']), validate(CategoriaSchema), CategoriaController.create);
router.put('/:id', authenticateToken, requireRole(['admin']), validate(CategoriaSchema.partial()), CategoriaController.update);
router.delete('/:id', authenticateToken, requireRole(['admin']), CategoriaController.delete);

export default router;
