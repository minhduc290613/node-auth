import { Router } from 'express';
import { updateOAuthProvider } from '../controllers/oauthProviderController.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/oauth-providers/:provider', requireAuth, requireAdmin, updateOAuthProvider);

export default router;
