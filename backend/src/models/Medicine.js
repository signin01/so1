const { promisePool } = require('../config/database');

class Medicine {
    // Find all medicines with pagination, search, and category filter
    static async find({ page = 1, limit = 20, search = '', category = '' }) {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM medicines WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM medicines WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            query += ' AND (name LIKE ? OR generic_name LIKE ?)';
            countQuery += ' AND (name LIKE ? OR generic_name LIKE ?)';
            const pattern = `%${search}%`;
            params.push(pattern, pattern);
            countParams.push(pattern, pattern);
        }

        if (category) {
            query += ' AND category = ?';
            countQuery += ' AND category = ?';
            params.push(category);
            countParams.push(category);
        }

        query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await promisePool.query(query, params);
        const [countResult] = await promisePool.query(countQuery, countParams);

        return {
            medicines: rows || [],
            total: countResult[0]?.total || 0,
            page: parseInt(page),
            totalPages: Math.ceil((countResult[0]?.total || 0) / limit)
        };
    }

    // Find medicine by ID
    static async findById(id) {
        const [rows] = await promisePool.query('SELECT * FROM medicines WHERE id = ?', [id]);
        return rows[0] || null;
    }

    // Create medicine
    static async create(data) {
        const { 
            name, generic_name, category, strength, 
            unit_price, stock_quantity, minimum_stock = 50, 
            expiry_date, manufacturer, batch_number 
        } = data;

        const [result] = await promisePool.query(
            `INSERT INTO medicines 
            (name, generic_name, category, strength, unit_price, 
             stock_quantity, minimum_stock, expiry_date, manufacturer, batch_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, generic_name, category, strength, unit_price, 
             stock_quantity || 0, minimum_stock, expiry_date, manufacturer, batch_number]
        );
        return result.insertId;
    }

    // Update medicine
    static async update(id, data) {
        const fields = [];
        const values = [];
        const allowedFields = [
            'name', 'generic_name', 'category', 'strength',
            'unit_price', 'stock_quantity', 'minimum_stock',
            'expiry_date', 'manufacturer', 'batch_number'
        ];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await promisePool.query(
            `UPDATE medicines SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    // Delete medicine
    static async delete(id) {
        const [result] = await promisePool.query('DELETE FROM medicines WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Get low stock medicines
    static async getLowStock(limit = 100) {
        const [rows] = await promisePool.query(
            'SELECT * FROM medicines WHERE stock_quantity < 50 ORDER BY stock_quantity ASC LIMIT ?',
            [limit]
        );
        return rows;
    }

    // Get expiring medicines
    static async getExpiring(days = 30, limit = 100) {
        const [rows] = await promisePool.query(
            `SELECT * FROM medicines 
            WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) 
            ORDER BY expiry_date ASC LIMIT ?`,
            [days, limit]
        );
        return rows;
    }

    // Get dashboard statistics
    static async getStats() {
        const [total] = await promisePool.query('SELECT COUNT(*) as total FROM medicines');
        const [low] = await promisePool.query('SELECT COUNT(*) as low FROM medicines WHERE stock_quantity < 50');
        const [expiring] = await promisePool.query('SELECT COUNT(*) as expiring FROM medicines WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
        const [value] = await promisePool.query('SELECT ROUND(SUM(stock_quantity * unit_price), 2) as value FROM medicines');
        const [categories] = await promisePool.query('SELECT category, COUNT(*) as count FROM medicines WHERE category IS NOT NULL AND category != "" GROUP BY category ORDER BY count DESC LIMIT 5');

        return {
            totalMedicines: total[0]?.total || 0,
            lowStock: low[0]?.low || 0,
            expiringSoon: expiring[0]?.expiring || 0,
            totalValue: value[0]?.value || 0,
            categories: categories || []
        };
    }
}

module.exports = Medicine;