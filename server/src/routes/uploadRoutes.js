"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const auth_1 = require("../middleware/auth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post('/', auth_1.protect, auth_1.adminOnly, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No image uploaded' });
            return;
        }
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary_1.v2.uploader.upload(dataURI, {
            folder: 'mojito-menu',
        });
        res.json({ url: result.secure_url });
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ message: 'Server Error during upload' });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map