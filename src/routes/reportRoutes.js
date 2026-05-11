const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/dashboard-stats', authenticateToken, requireRole(['owner', 'manager']), reportController.getDashboardStats);
router.get('/top-products', authenticateToken, reportController.getTopProducts);

module.exports = router;