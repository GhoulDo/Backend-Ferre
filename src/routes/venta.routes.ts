import { Router } from 'express';
import { VentaController } from '../controllers/venta.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { validateNumericParam } from '../middlewares/security.middleware';
import { VentaSchema } from '../utils/schemas';

const router = Router();

router.get('/', authenticateToken, VentaController.getAll);
router.get('/stats', authenticateToken, requireRole(['admin']), VentaController.getStats);
router.get('/range', authenticateToken, VentaController.getByDateRange);
router.get('/:id', authenticateToken, validateNumericParam('id'), VentaController.getById);
router.post('/', authenticateToken, validate(VentaSchema), VentaController.create);

export default router;
