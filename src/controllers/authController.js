import { supabase } from '../config/supabase.js';
import { getOAuthProviders, oauthProviders } from '../config/oauthProviders.js';

const getAppUrl = () => {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV !== 'production') return `http://localhost:${process.env.PORT || 3000}`;
  throw new Error('APP_URL must be configured in production.');
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  };
  res.cookie('sb_access_token', accessToken, options);
  res.cookie('sb_refresh_token', refreshToken, options);
};

export const startOAuthLogin = async (req, res, next) => {
  const provider = req.params.provider;
  if (!oauthProviders.some(item => item.id === provider)) {
    return res.status(404).render('error', {
      message: 'This OAuth provider is not supported.',
      error: { status: 404 }
    });
  }

  let providers;
  let redirectTo;
  try {
    providers = await getOAuthProviders();
    redirectTo = `${getAppUrl()}/auth/callback`;
  } catch (error) {
    return next(error);
  }

  const providerSetting = providers.find(item => item.id === provider);
  if (!providerSetting?.enabled) {
    return res.status(403).render('error', {
      message: `${providerSetting?.name || provider} sign-in is currently disabled.`,
      error: { status: 403 }
    });
  }

  let data;
  let error;
  try {
    ({ data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo }
    }));
  } catch (requestError) {
    return next(requestError);
  }
  if (error) {
    return res.status(502).render('error', {
      message: error.message,
      error: { status: 502 }
    });
  }
  if (!data.url) {
    return res.status(502).render('error', {
      message: `Supabase did not provide a ${providerSetting.name} authorization URL.`,
      error: { status: 502 }
    });
  }
  return res.redirect(data.url);
};

export const createOAuthSession = async (req, res, next) => {
  const { access_token: accessToken, refresh_token: refreshToken } = req.body;
  if (
    typeof accessToken !== 'string' ||
    !accessToken ||
    typeof refreshToken !== 'string' ||
    !refreshToken
  ) {
    return res.status(400).json({ success: false, message: 'Valid access and refresh tokens are required.' });
  }

  try {
    const { error } = await supabase.auth.getUser(accessToken);
    if (error) return res.status(401).json({ success: false, message: 'OAuth sign-in could not be verified.' });
  } catch (error) {
    return next(error);
  }

  setAuthCookies(res, accessToken, refreshToken);
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

  setAuthCookies(res, data.session.access_token, data.session.refresh_token);

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
  res.clearCookie('sb_refresh_token');
  return res.json({ success: true, message: 'Password updated successfully. Redirecting...' });
};

export const logout = (req, res) => {
  res.clearCookie('sb_access_token');
  res.clearCookie('sb_refresh_token');
  res.redirect('/');
};
