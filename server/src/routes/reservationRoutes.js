"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').post(auth_1.protect, reservationController_1.createReservation).get(auth_1.protect, auth_1.adminOnly, reservationController_1.getReservations);
router.route('/myreservations').get(auth_1.protect, reservationController_1.getMyReservations);
router.route('/:id/status').put(auth_1.protect, auth_1.adminOnly, reservationController_1.updateReservationStatus);
exports.default = router;
//# sourceMappingURL=reservationRoutes.js.map