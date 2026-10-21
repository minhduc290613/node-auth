import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { isAdmin } from '../config/admin.js';
import { getOAuthProviders } from '../config/oauthProviders.js';
import { showOAuthConsent } from '../controllers/oauthServerController.js';
import { siteConfig } from '../config/site.js';

const router = Router();

const getSafeLocalPath = (target) => {
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return null;
  }
  const parsed = new URL(target, 'http://localhost');
  return parsed.origin === 'http://localhost' ? `${parsed.pathname}${parsed.search}${parsed.hash}` : null;
};

router.get('/', async (req, res, next) => {
  try {
    const nextPath = getSafeLocalPath(req.query.next);
    if (req.cookies.sb_access_token) return res.redirect(nextPath || '/dashboard');
    const providers = await getOAuthProviders();
    return res.render('index', { config: siteConfig, providers, nextPath });
  } catch (error) {
    return next(error);
  }
});

router.get('/auth/callback', (req, res) => {
  res.render('oauth-callback');
});

router.get('/oauth/consent', requireAuth, showOAuthConsent);

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

router.get('/admin', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    return res.render('admin', { user: req.user, providers: await getOAuthProviders() });
  } catch (error) {
    return next(error);
  }
});

export default router;