import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { validateNumericParam } from '../middlewares/security.middleware';
import { CategoriaSchema } from '../utils/schemas';

const router = Router();

// Rutas públicas (requieren autenticación básica)
router.get('/', authenticateToken, CategoriaController.getAll);
router.get('/:id', authenticateToken, validateNumericParam('id'), CategoriaController.getById);

// Rutas de administrador
router.post('/', authenticateToken, requireAdmin, validate(CategoriaSchema), CategoriaController.create);
router.put('/:id', authenticateToken, requireAdmin, validateNumericParam('id'), validate(CategoriaSchema.partial()), CategoriaController.update);
router.delete('/:id', authenticateToken, requireAdmin, validateNumericParam('id'), CategoriaController.delete);

export default router;
