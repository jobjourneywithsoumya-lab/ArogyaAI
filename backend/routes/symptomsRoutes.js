import express from 'express';
import { analyzeSymptoms, getSymptomsHistory } from '../controllers/symptomsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeSymptoms);
router.get('/history', getSymptomsHistory);

export default router;
