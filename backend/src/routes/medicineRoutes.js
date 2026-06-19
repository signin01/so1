const express = require('express');
const router = express.Router();
const MedicineController = require('../controllers/medicineController');

// Public routes
router.get('/', MedicineController.getAll);
router.get('/low-stock', MedicineController.getLowStock);
router.get('/expiring', MedicineController.getExpiring);
router.get('/:id', MedicineController.getById);

// CRUD operations
router.post('/', MedicineController.create);
router.put('/:id', MedicineController.update);
router.delete('/:id', MedicineController.delete);

module.exports = router;