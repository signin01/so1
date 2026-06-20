const { promisePool } = require('../config/database');

class DashboardController {
    static async getStats(req, res) {
        try {
            // Total medicines
            const [totalResult] = await promisePool.query('SELECT COUNT(*) as total FROM medicines');
            
            // Low stock (less than 50)
            const [lowStockResult] = await promisePool.query('SELECT COUNT(*) as low FROM medicines WHERE stock_quantity < 50');
            
            // Expiring soon (next 30 days)
            const [expiringResult] = await promisePool.query('SELECT COUNT(*) as expiring FROM medicines WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
            
            // Total value
            const [valueResult] = await promisePool.query('SELECT ROUND(SUM(stock_quantity * unit_price), 2) as value FROM medicines');
            
            // Categories distribution - FIXED: Removed empty column reference
            const [categories] = await promisePool.query('SELECT category, COUNT(*) as count FROM medicines WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC LIMIT 5');

            // Clean response
            const response = {
                success: true,
                totalMedicines: parseInt(totalResult[0]?.total || 0),
                lowStock: parseInt(lowStockResult[0]?.low || 0),
                expiringSoon: parseInt(expiringResult[0]?.expiring || 0),
                totalValue: parseFloat(valueResult[0]?.value || 0),
                categories: categories.map(cat => ({
                    category: cat.category || 'Uncategorized',
                    count: parseInt(cat.count || 0)
                }))
            };

            res.json(response);
            
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch dashboard stats',
                error: error.message
            });
        }
    }
}

module.exports = DashboardController;