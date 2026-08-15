import express from 'express';
import { createTable, getTables, deleteTable, getAvailableTables } from '../controllers/tableController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getTables)
  .post(protect, adminOnly, createTable);

router.route('/:id').delete(protect, adminOnly, deleteTable);

router.post('/available', getAvailableTables);

export default router;
