const { body, validationResult } = require('express-validator');

const validateMedicine = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    body('generic_name')
        .optional()
        .isLength({ max: 255 }).withMessage('Generic name must be less than 255 characters'),
    body('category')
        .optional()
        .isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
    body('unit_price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
    body('stock_quantity')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer'),
    body('minimum_stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Minimum stock must be a positive integer'),
    body('expiry_date')
        .optional()
        .isISO8601().withMessage('Invalid date format')
];

module.exports = { validateMedicine };