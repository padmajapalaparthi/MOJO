"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, orderController_1.addOrderItems).get(auth_1.protect, auth_1.adminOnly, orderController_1.getOrders);
router.route('/myorders').get(auth_1.protect, orderController_1.getMyOrders);
router.route('/:id').get(auth_1.protect, orderController_1.getOrderById);
router.route('/:id/status').put(auth_1.protect, auth_1.adminOnly, orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map