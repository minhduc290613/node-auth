export const isAdmin = (user) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));
};
