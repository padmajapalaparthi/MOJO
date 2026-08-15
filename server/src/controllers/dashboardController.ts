import { Request, Response } from 'express';
import Order from '../models/Order';
import Reservation from '../models/Reservation';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0]; // simple YYYY-MM-DD match if dates are stored as string

    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    // Revenue sum for delivered orders
    const completedOrders = await Order.find({ status: 'Delivered' });
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    const totalReservations = await Reservation.countDocuments({});
    const todayReservations = await Reservation.countDocuments({ date: todayString });
    const pendingReservations = await Reservation.countDocuments({ status: 'Pending' });

    res.json({
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        revenue: totalRevenue,
      },
      reservations: {
        total: totalReservations,
        today: todayReservations,
        pending: pendingReservations,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
