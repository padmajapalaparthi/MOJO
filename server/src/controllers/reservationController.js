"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationStatus = exports.getReservations = exports.getMyReservations = exports.createReservation = void 0;
const Reservation_1 = __importDefault(require("../models/Reservation"));
// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
    try {
        const { table, date, time, partySize, guestName, guestPhone, guestProof, specialRequests } = req.body;
        // Calculate endTime (assume 2 hours duration)
        const [hours, minutes] = time.split(':').map(Number);
        const endMinutes = hours * 60 + minutes + 120;
        const endHours = Math.floor(endMinutes / 60) % 24;
        const endMins = endMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
        const reservation = new Reservation_1.default({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.createReservation = createReservation;
// @desc    Get user's reservations
// @route   GET /api/reservations/myreservations
// @access  Private
const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation_1.default.find({ user: req.user?._id }).populate('table').sort({ date: 1, time: 1 });
        res.json(reservations);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getMyReservations = getMyReservations;
// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
// @access  Private/Admin
const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation_1.default.find({}).populate('user', 'id name email').populate('table').sort({ date: 1, time: 1 });
        res.json(reservations);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getReservations = getReservations;
// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = async (req, res) => {
    try {
        const reservation = await Reservation_1.default.findById(req.params.id);
        if (reservation) {
            reservation.status = req.body.status || reservation.status;
            const updatedReservation = await reservation.save();
            res.json(updatedReservation);
        }
        else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateReservationStatus = updateReservationStatus;
//# sourceMappingURL=reservationController.js.map