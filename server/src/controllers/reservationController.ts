import { Request, Response } from 'express';
import Reservation from '../models/Reservation';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { table, date, time, partySize, guestName, guestPhone, guestProof, specialRequests } = req.body;

    // Calculate endTime (assume 2 hours duration)
    const [hours, minutes] = time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + 120;
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

    const reservation = new Reservation({
      user: req.user?._id,
      table,
      date,
      time,
      endTime,
      partySize,
      guestName,
      guestPhone,
      guestProof,
      specialRequests,
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/myreservations
// @access  Private
export const getMyReservations = async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await Reservation.find({ user: req.user?._id }).populate('table').sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
// @access  Private/Admin
export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find({}).populate('user', 'id name email').populate('table').sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
      reservation.status = req.body.status || reservation.status;
      const updatedReservation = await reservation.save();
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
