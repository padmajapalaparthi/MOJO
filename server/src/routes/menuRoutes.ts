import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Public routes
router.route('/').get(getMenuItems);
router.route('/:id').get(getMenuItemById);

// Admin routes
router.route('/').post(protect, adminOnly, createMenuItem);
router.route('/:id').put(protect, adminOnly, updateMenuItem).delete(protect, adminOnly, deleteMenuItem);

export default router;
