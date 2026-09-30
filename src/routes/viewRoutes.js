import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { siteConfig } from '../config/site.js'; // Import file cấu hình

const router = Router();

router.get('/', (req, res) => {
  if (req.cookies.sb_access_token) return res.redirect('/dashboard');
  res.render('index', { config: siteConfig }); // Truyền config sang View
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.user, config: siteConfig });
});

export default router;