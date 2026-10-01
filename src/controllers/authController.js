import { supabase } from '../config/supabase.js';

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