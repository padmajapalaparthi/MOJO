import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image, isAvailable, dietary, stockQuantity } = req.body;

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      dietary,
      stockQuantity: stockQuantity !== undefined ? stockQuantity : 0,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image, isAvailable, dietary, stockQuantity } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;
      menuItem.image = image !== undefined ? image : menuItem.image; // Handle empty image
      menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;
      menuItem.dietary = dietary || menuItem.dietary;
      menuItem.stockQuantity = stockQuantity !== undefined ? stockQuantity : menuItem.stockQuantity;

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (menuItem) {
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
