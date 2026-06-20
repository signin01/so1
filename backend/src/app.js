const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS - Allow multiple origins
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://hospital-pharmacy-frontend.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Medicine Routes
app.use('/api/medicines', require('./routes/medicineRoutes'));

// Dashboard Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Payment Routes
app.use('/api/payments', require('./routes/paymentRoutes'));

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;