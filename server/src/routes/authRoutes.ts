import express from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

export default router;
