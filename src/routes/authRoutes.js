import { Router } from 'express';
import {
  login,
  register,
  forgotPassword,
  updatePassword,
  logout,
  startOAuthLogin,
  createOAuthSession
} from '../controllers/authController.js';
import { requireApiAuth } from '../middleware/authMiddleware.js';
import { decideOAuthConsent } from '../controllers/oauthServerController.js';

const router = Router();

router.get('/oauth/:provider', startOAuthLogin);
router.post('/oauth-session', createOAuthSession);
router.post('/oauth-server/consent', requireApiAuth, decideOAuthConsent);
router.post('/login', login);
router.post('/register', register);
router.post('/forgot', forgotPassword);
router.post('/update-password', updatePassword);
router.get('/logout', logout);

export default router;