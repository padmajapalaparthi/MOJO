"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = exports.getMenuItemById = exports.getMenuItems = void 0;
const MenuItem_1 = __importDefault(require("../models/MenuItem"));
// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem_1.default.find({});
        res.json(menuItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getMenuItems = getMenuItems;
// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem_1.default.findById(req.params.id);
        if (menuItem) {
            res.json(menuItem);
        }
        else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getMenuItemById = getMenuItemById;
// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image, isAvailable, dietary, stockQuantity } = req.body;
        const menuItem = new MenuItem_1.default({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.createMenuItem = createMenuItem;
// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image, isAvailable, dietary, stockQuantity } = req.body;
        const menuItem = await MenuItem_1.default.findById(req.params.id);
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
        }
        else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateMenuItem = updateMenuItem;
// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem_1.default.findByIdAndDelete(req.params.id);
        if (menuItem) {
            res.json({ message: 'Menu item removed' });
        }
        else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteMenuItem = deleteMenuItem;
//# sourceMappingURL=menuController.js.map