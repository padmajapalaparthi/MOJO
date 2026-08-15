import express from 'express';
import {
  createReservation,
  getMyReservations,
  getReservations,
  updateReservationStatus,
} from '../controllers/reservationController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.route('/').post(protect, createReservation).get(protect, adminOnly, getReservations);
router.route('/myreservations').get(protect, getMyReservations);
router.route('/:id/status').put(protect, adminOnly, updateReservationStatus);

export default router;
