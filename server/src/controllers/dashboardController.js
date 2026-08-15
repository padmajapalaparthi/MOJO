"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toISOString().split('T')[0]; // simple YYYY-MM-DD match if dates are stored as string
        const totalOrders = await Order_1.default.countDocuments({});
        const pendingOrders = await Order_1.default.countDocuments({ status: 'Pending' });
        // Revenue sum for delivered orders
        const completedOrders = await Order_1.default.find({ status: 'Delivered' });
        const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalReservations = await Reservation_1.default.countDocuments({});
        const todayReservations = await Reservation_1.default.countDocuments({ date: todayString });
        const pendingReservations = await Reservation_1.default.countDocuments({ status: 'Pending' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboardController.js.map