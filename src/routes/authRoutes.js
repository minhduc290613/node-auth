import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  updatePassword,
  logout,
  startGithubLogin,
  createOAuthSession
} from '../controllers/authController.js';

const router = Router();

router.get('/github', startGithubLogin);
router.post('/oauth-session', createOAuthSession);
router.post('/login', login);
router.post('/register', register);
router.post('/forgot', forgotPassword);
router.post('/update-password', updatePassword);
router.get('/logout', logout);

export default router;