const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/',           authenticateToken, saleController.getSales);
router.post('/checkout',  authenticateToken, saleController.checkout);

module.exports = router;
