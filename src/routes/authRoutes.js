const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', authController.login);

// Protected routes (Only an owner can register new users for now)
router.post('/register', authenticateToken, requireRole(['owner']), authController.register);

// Example of a protected test route
router.get('/me', authenticateToken, (req, res) => {
    res.json({ message: 'Token is valid', user: req.user });
});

module.exports = router;