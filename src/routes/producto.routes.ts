import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { validateNumericParam } from '../middlewares/security.middleware';
import { ProductoSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, ProductoController.getAll);
router.get('/stats', authenticateToken, requireRole(['admin']), ProductoController.getStats);
router.get('/low-stock', authenticateToken, ProductoController.getLowStock);
router.get('/:id', authenticateToken, validateNumericParam('id'), ProductoController.getById);
router.post('/', authenticateToken, requireRole(['admin']), validate(ProductoSchema), ProductoController.create);
router.put('/:id', authenticateToken, requireRole(['admin']), validateNumericParam('id'), validate(ProductoSchema.partial()), ProductoController.update);
router.delete('/:id', authenticateToken, requireRole(['admin']), validateNumericParam('id'), ProductoController.delete);

export default router;
