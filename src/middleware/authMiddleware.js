import { supabase } from '../config/supabase.js';
import { isAdmin } from '../config/admin.js';

const getAuthenticatedUser = async (req, res) => {
  const accessToken = req.cookies.sb_access_token;
  if (accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!error && user) return { user, accessToken };
  }

  const refreshToken = req.cookies.sb_refresh_token;
  if (!refreshToken || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return null;
  }

  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  if (!response.ok) return null;

  const session = await response.json();
  if (typeof session.access_token !== 'string' || typeof session.refresh_token !== 'string') {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
  if (error || !user) return null;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  };
  res.cookie('sb_access_token', session.access_token, cookieOptions);
  res.cookie('sb_refresh_token', session.refresh_token, cookieOptions);
  return { user, accessToken: session.access_token };
};

const clearAuthCookies = (res) => {
  res.clearCookie('sb_access_token');
  res.clearCookie('sb_refresh_token');
};

export const requireAuth = async (req, res, next) => {
  try {
    const session = await getAuthenticatedUser(req, res);
    if (!session) {
      clearAuthCookies(res);
      if (req.path === '/oauth/consent') {
        return res.redirect(`/?next=${encodeURIComponent(req.originalUrl)}`);
      }
      return res.redirect('/');
    }
    req.user = session.user;
    req.accessToken = session.accessToken;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireApiAuth = async (req, res, next) => {
  try {
    const session = await getAuthenticatedUser(req, res);
    if (!session) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
    }
    req.user = session.user;
    req.accessToken = session.accessToken;
    return next();
  } catch (error) {
    return next(error);
  }
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