"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menuController_1 = require("../controllers/menuController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.route('/').get(menuController_1.getMenuItems);
router.route('/:id').get(menuController_1.getMenuItemById);
// Admin routes
router.route('/').post(auth_1.protect, auth_1.adminOnly, menuController_1.createMenuItem);
router.route('/:id').put(auth_1.protect, auth_1.adminOnly, menuController_1.updateMenuItem).delete(auth_1.protect, auth_1.adminOnly, menuController_1.deleteMenuItem);
exports.default = router;
//# sourceMappingURL=menuRoutes.js.map