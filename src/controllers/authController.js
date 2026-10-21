import { supabase } from '../config/supabase.js';

const getAppUrl = () => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV !== 'production') return `http://localhost:${process.env.PORT || 3000}`;
  throw new Error('APP_URL must be configured in production.');
};

const setAuthCookie = (res, accessToken) => {
  res.cookie('sb_access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
};

export const startGithubLogin = async (req, res, next) => {
  let redirectTo;
  try {
    redirectTo = `${getAppUrl()}/auth/callback`;
  } catch (error) {
    return next(error);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo }
  });
  if (error) {
    return res.status(502).render('error', {
      message: error.message,
      error: { status: 502 }
    });
  }
  if (!data.url) {
    return res.status(502).render('error', {
      message: 'Supabase did not provide a GitHub authorization URL.',
      error: { status: 502 }
    });
  }
  return res.redirect(data.url);
};

export const createOAuthSession = async (req, res) => {
  const { access_token: accessToken } = req.body;
  if (typeof accessToken !== 'string' || !accessToken) {
    return res.status(400).json({ success: false, message: 'A valid access token is required.' });
  }

  const { error } = await supabase.auth.getUser(accessToken);
  if (error) return res.status(401).json({ success: false, message: 'GitHub sign-in could not be verified.' });

  setAuthCookie(res, accessToken);
  return res.json({ success: true });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });
  if (error) return res.status(400).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Account created successfully.' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ success: false, message: error.message });

  setAuthCookie(res, data.session.access_token);

  return res.json({ success: true, message: 'Signed in successfully.' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let redirectUrl;
  try {
    redirectUrl = `${getAppUrl()}/reset-password`;
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.json({ 
    success: true, 
    message: 'Password reset email sent. Please check your inbox and spam folder.'
  });
};

export const updatePassword = async (req, res) => {
  const { password, access_token, refresh_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token || ''
  });

  if (sessionError) {
    return res.status(400).json({ success: false, message: sessionError.message });
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  res.clearCookie('sb_access_token');
  return res.json({ success: true, message: 'Password updated successfully. Redirecting...' });
};

export const logout = (req, res) => {
  res.clearCookie('sb_access_token');
  res.redirect('/');
};
