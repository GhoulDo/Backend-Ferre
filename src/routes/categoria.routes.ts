import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { validateNumericParam } from '../middlewares/security.middleware';
import { CategoriaSchema } from '../utils/schemas';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas públicas (para vendedores y admins)
router.get('/', CategoriaController.getAll);
router.get('/:id', validateNumericParam('id'), CategoriaController.getById);

// Rutas solo para admins
router.post('/', requireRole(['admin']), validate(CategoriaSchema), CategoriaController.create);
router.put('/:id', requireRole(['admin']), validateNumericParam('id'), validate(CategoriaSchema), CategoriaController.update);
router.delete('/:id', requireRole(['admin']), validateNumericParam('id'), CategoriaController.delete);

export default router;
