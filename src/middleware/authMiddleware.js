import { supabase } from '../config/supabase.js';
import { isAdmin } from '../config/admin.js';

export const requireAuth = async (req, res, next) => {
  const token = req.cookies.sb_access_token;
  if (!token) return res.redirect('/');

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.clearCookie('sb_access_token');
    return res.redirect('/');
  }
  req.user = user;
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!isAdmin(req.user)) {
    return res.status(403).render('error', {
      message: 'You do not have permission to access this page.',
      error: { status: 403 }
    });
  }

  next();
};