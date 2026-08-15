import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;
