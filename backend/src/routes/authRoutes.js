const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisePool } = require('../config/database');

// ============================================
// LOGIN
// ============================================

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // For demo - hardcoded admin
        if (email === 'admin@hospital.com' && password === 'admin123') {
            // Check if user exists in database
            const [users] = await promisePool.query(
                'SELECT id, email, full_name, role FROM users WHERE email = ?',
                [email]
            );

            let user;
            if (users.length === 0) {
                // Create user if doesn't exist
                const [result] = await promisePool.query(
                    'INSERT INTO users (email, full_name, role) VALUES (?, ?, ?)',
                    ['admin@hospital.com', 'Admin User', 'admin']
                );
                user = {
                    id: result.insertId,
                    email: 'admin@hospital.com',
                    full_name: 'Admin User',
                    role: 'admin'
                };
            } else {
                user = users[0];
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET || 'your_super_secret_key_here',
                { expiresIn: '7d' }
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name || 'Admin User',
                    role: user.role || 'admin'
                }
            });
        }

        // Check if user exists for other emails
        const [users] = await promisePool.query(
            'SELECT id, email, full_name, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_super_secret_key_here',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name || 'User',
                role: user.role || 'staff'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// ============================================
// GET CURRENT USER
// ============================================

router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');
        const [users] = await promisePool.query(
            'SELECT id, email, full_name, role FROM users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];
        res.json({
            success: true,
            id: user.id,
            email: user.email,
            fullName: user.full_name || 'User',
            role: user.role || 'staff'
        });

    } catch (error) {
        console.error('Get me error:', error);
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
});

// ============================================
// LOGOUT
// ============================================

router.post('/logout', async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;