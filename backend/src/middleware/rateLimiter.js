const rateLimit = require('express-rate-limit');

// Public API rate limiter
const public = () => {
    return rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 100, // 100 requests per minute
        message: {
            success: false,
            message: 'Too many requests, please try again later'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// Protected API rate limiter
const protected = () => {
    return rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 30, // 30 requests per minute
        message: {
            success: false,
            message: 'Too many requests, please try again later'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// Strict rate limiter for auth endpoints
const strict = () => {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // 10 requests per 15 minutes
        message: {
            success: false,
            message: 'Too many attempts, please try again later'
        },
        standardHeaders: true,
        legacyHeaders: false
    });
};

module.exports = { public, protected, strict };