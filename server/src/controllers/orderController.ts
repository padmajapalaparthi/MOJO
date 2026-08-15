import { Request, Response } from 'express';
import Order from '../models/Order';
import MenuItem from '../models/MenuItem';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, specialInstructions } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Step 1: Verify all items have enough stock
    for (const item of orderItems) {
      const dbItem = await MenuItem.findById(item._id);
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
      await MenuItem.findByIdAndUpdate(item._id, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    // Step 3: Create order
    const items = orderItems.map((item: any) => ({
      menuItem: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    const order = new Order({
      user: req.user?._id,
      items,
      totalAmount,
      specialInstructions,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.menuItem', 'name image');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id }).populate('items.menuItem', 'name image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').populate('items.menuItem', 'name image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      
      // Emit socket event for real-time updates (to be handled in Phase 4)
      // req.app.get('io').to(order.user.toString()).emit('order-updated', updatedOrder);

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
