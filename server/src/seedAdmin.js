"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const seedAdmin = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mojito');
        console.log('MongoDB Connected');
        const adminEmail = 'admin@mojito.com';
        const adminPassword = 'adminpassword123';
        // Check if admin already exists
        const existingAdmin = await User_1.default.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists:', adminEmail);
            process.exit(0);
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(adminPassword, salt);
        const adminUser = new User_1.default({
            name: 'Mojito Admin',
            email: adminEmail,
            passwordHash: passwordHash,
            role: 'admin',
        });
        await adminUser.save();
        console.log(`Admin user created! \nEmail: ${adminEmail}\nPassword: ${adminPassword}`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map