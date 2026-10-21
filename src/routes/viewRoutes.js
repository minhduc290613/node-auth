import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { isAdmin } from '../config/admin.js';
import { siteConfig } from '../config/site.js';

const router = Router();

router.get('/', (req, res) => {
  if (req.cookies.sb_access_token) return res.redirect('/dashboard');
  res.render('index', { config: siteConfig });
});

router.get('/auth/callback', (req, res) => {
  res.render('oauth-callback');
});

router.get('/reset-password', (req, res) => {
  res.render('reset-password', { config: siteConfig });
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', {
    user: req.user,
    config: siteConfig,
    isAdmin: isAdmin(req.user)
  });
});

router.get('/admin', requireAuth, requireAdmin, (req, res) => {
  res.render('admin', { user: req.user });
});

export default router;