"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const tableRoutes_1 = __importDefault(require("./routes/tableRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
app.use('/api/auth', authRoutes_1.default);
app.use('/api/menu', menuRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/reservations', reservationRoutes_1.default);
app.use('/api/tables', tableRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Mojito API is running...');
});
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map