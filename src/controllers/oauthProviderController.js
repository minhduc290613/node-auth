import { setOAuthProviderEnabled } from '../config/oauthProviders.js';

export const updateOAuthProvider = async (req, res, next) => {
  const { provider } = req.params;
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ message: 'The enabled field must be a boolean.' });
  }

  try {
    await setOAuthProviderEnabled(provider, enabled);
    return res.json({ success: true, provider, enabled });
  } catch (error) {
    if (error.message === 'Unsupported OAuth provider.') {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};
