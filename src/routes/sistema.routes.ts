import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { keepAlive } from '../utils/keep-alive';

const router = Router();

// Endpoint para estadísticas del sistema (solo admin)
router.get('/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const stats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas del sistema' });
  }
});

// Endpoint para ping manual del keep-alive (solo admin)
router.post('/keep-alive/ping', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const result = await keepAlive.manualPing();
    res.json({
      message: 'Ping manual ejecutado',
      result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al ejecutar ping manual' });
  }
});

// Endpoint para obtener información del keep-alive
router.get('/keep-alive/status', authenticateToken, requireRole(['admin']), (req, res) => {
  res.json({
    enabled: process.env.NODE_ENV === 'production',
    interval: '14 minutos',
    url: process.env.NODE_ENV === 'production' 
      ? 'https://backend-ferre.onrender.com/health'
      : `http://localhost:${process.env.PORT || 4000}/health`
  });
});

export default router;
