import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { siteConfig } from '../config/site.js';

const router = Router();

router.get('/', (req, res) => {
  if (req.cookies.sb_access_token) return res.redirect('/dashboard');
  res.render('index', { config: siteConfig });
});

router.get('/reset-password', (req, res) => {
  res.render('reset-password', { config: siteConfig });
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.user, config: siteConfig });
});

export default router;