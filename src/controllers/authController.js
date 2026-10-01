import { supabase } from '../config/supabase.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });
  if (error) return res.status(400).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Đăng ký thành công!' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ success: false, message: error.message });

  res.cookie('sb_access_token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400000
  });

  return res.json({ success: true, message: 'Đăng nhập thành công!' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${req.protocol}://${req.get('host')}/reset-password`
  });
  if (error) return res.status(400).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Đã gửi Email khôi phục! Vui lòng kiểm tra hộp thư.' });
};

export const updatePassword = async (req, res) => {
  const { password, access_token, refresh_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ success: false, message: 'Link khôi phục không hợp lệ hoặc đã hết hạn.' });
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
  return res.json({ success: true, message: 'Đặt lại mật khẩu thành công! Đang chuyển hướng...' });
};

export const logout = (req, res) => {
  res.clearCookie('sb_access_token');
  res.redirect('/');
};
