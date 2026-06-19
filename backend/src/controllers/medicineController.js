const Medicine = require('../models/Medicine');

class MedicineController {
    // Get all medicines with pagination
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 20, search = '', category = '' } = req.query;
            const result = await Medicine.find({
                page: parseInt(page),
                limit: parseInt(limit),
                search: search,
                category: category
            });
            res.json({ success: true, ...result });
        } catch (error) {
            console.error('Get all medicines error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to fetch medicines',
                error: error.message 
            });
        }
    }

    // Get medicine by ID
    static async getById(req, res) {
        try {
            const medicine = await Medicine.findById(req.params.id);
            if (!medicine) {
                return res.status(404).json({ success: false, message: 'Medicine not found' });
            }
            res.json({ success: true, medicine });
        } catch (error) {
            console.error('Get medicine error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch medicine' });
        }
    }

    // Create medicine
    static async create(req, res) {
        try {
            const id = await Medicine.create(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Medicine added successfully', 
                id 
            });
        } catch (error) {
            console.error('Create medicine error:', error);
            res.status(500).json({ success: false, message: 'Failed to add medicine' });
        }
    }

    // Update medicine
    static async update(req, res) {
        try {
            const updated = await Medicine.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Medicine not found or no changes' });
            }
            res.json({ success: true, message: 'Medicine updated successfully' });
        } catch (error) {
            console.error('Update medicine error:', error);
            res.status(500).json({ success: false, message: 'Failed to update medicine' });
        }
    }

    // Delete medicine
    static async delete(req, res) {
        try {
            const deleted = await Medicine.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Medicine not found' });
            }
            res.json({ success: true, message: 'Medicine deleted successfully' });
        } catch (error) {
            console.error('Delete medicine error:', error);
            res.status(500).json({ success: false, message: 'Failed to delete medicine' });
        }
    }

    // Get low stock
    static async getLowStock(req, res) {
        try {
            const medicines = await Medicine.getLowStock(parseInt(req.query.limit) || 100);
            res.json({ success: true, medicines });
        } catch (error) {
            console.error('Get low stock error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch low stock' });
        }
    }

    // Get expiring
    static async getExpiring(req, res) {
        try {
            const days = parseInt(req.query.days) || 30;
            const medicines = await Medicine.getExpiring(days);
            res.json({ success: true, medicines });
        } catch (error) {
            console.error('Get expiring error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch expiring medicines' });
        }
    }
}

module.exports = MedicineController;