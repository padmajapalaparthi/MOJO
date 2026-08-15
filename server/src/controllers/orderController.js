"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.getOrderById = exports.addOrderItems = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const MenuItem_1 = __importDefault(require("../models/MenuItem"));
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, specialInstructions } = req.body;
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        // Step 1: Verify all items have enough stock
        for (const item of orderItems) {
            const dbItem = await MenuItem_1.default.findById(item._id);
            if (!dbItem) {
                return res.status(404).json({ message: `Menu item not found: ${item.name}` });
            }
            if (dbItem.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.name}. Only ${dbItem.stockQuantity} left.`
                });
            }
        }
        // Step 2: Deduct stock
        for (const item of orderItems) {
            await MenuItem_1.default.findByIdAndUpdate(item._id, {
                $inc: { stockQuantity: -item.quantity }
            });
        }
        // Step 3: Create order
        const items = orderItems.map((item) => ({
            menuItem: item._id,
            quantity: item.quantity,
            price: item.price,
        }));
        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const order = new Order_1.default({
            user: req.user?._id,
            items,
            totalAmount,
            specialInstructions,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.addOrderItems = addOrderItems;
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id).populate('user', 'name email').populate('items.menuItem', 'name image');
        if (order) {
            res.json(order);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getOrderById = getOrderById;
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ user: req.user?._id }).populate('items.menuItem', 'name image');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getMyOrders = getMyOrders;
// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({}).populate('user', 'id name').populate('items.menuItem', 'name image');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            // Emit socket event for real-time updates (to be handled in Phase 4)
            // req.app.get('io').to(order.user.toString()).emit('order-updated', updatedOrder);
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map