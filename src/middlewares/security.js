const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const securityMiddleware = (app) => {
    // 1. Basic Security Headers
    app.use(helmet());

    // 2. CORS - Restrict to your domain
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS.split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // 3. Rate Limiting: 100 requests per 15 mins per IP
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.'
    });
    app.use('/api/', limiter);
};

module.exports = securityMiddleware;