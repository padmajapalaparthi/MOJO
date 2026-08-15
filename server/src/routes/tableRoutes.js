"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tableController_1 = require("../controllers/tableController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, auth_1.adminOnly, tableController_1.getTables)
    .post(auth_1.protect, auth_1.adminOnly, tableController_1.createTable);
router.route('/:id').delete(auth_1.protect, auth_1.adminOnly, tableController_1.deleteTable);
router.post('/available', tableController_1.getAvailableTables);
exports.default = router;
//# sourceMappingURL=tableRoutes.js.map