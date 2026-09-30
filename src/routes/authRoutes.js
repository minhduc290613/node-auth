import { Router } from 'express';
import { login, register, forgotPassword, logout } from '../controllers/authController.js';

const router = Router();
router.post('/login', login);
router.post('/register', register);
router.post('/forgot', forgotPassword);
router.get('/logout', logout);

export default router;