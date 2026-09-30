import { supabase } from '../config/supabase.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });
  if (error) return res.status(400).json({ success: false, message: error.message });
  return res.json({ success: true, message: 'Đăng ký thành công! Hãy kiểm tra Email xác nhận.' });
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
  return res.json({ success: true, message: 'Đã gửi Email khôi phục mật khẩu!' });
};

export const logout = (req, res) => {
  res.clearCookie('sb_access_token');
  res.redirect('/');
};