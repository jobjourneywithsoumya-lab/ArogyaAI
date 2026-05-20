import express from 'express';
import { getAllMedicines, getMedicineById, createMedicine, getMedicinesByCategory } from '../controllers/medicineController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllMedicines);
router.get('/:id', getMedicineById);
router.get('/category/:category', getMedicinesByCategory);

router.post('/', protect, authorize('admin'), createMedicine);

export default router;
