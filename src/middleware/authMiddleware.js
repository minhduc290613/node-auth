import { supabase } from '../config/supabase.js';

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