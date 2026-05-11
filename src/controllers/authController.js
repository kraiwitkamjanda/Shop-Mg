const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
    try {
        const { username, password, role, storeId } = req.body;

        // Validate role
        const validRoles = ['owner', 'manager', 'cashier', 'staff'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided.' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Hash password (salt rounds = 10)
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: { username, passwordHash, role, storeId }
        });

        res.status(201).json({ message: 'User registered successfully.', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid credentials or inactive account.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, storeId: user.storeId },
            process.env.JWT_SECRET,
            { expiresIn: '12h' } // Token expires in 12 hours
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};