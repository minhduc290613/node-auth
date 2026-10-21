import { supabase } from '../config/supabase.js';

const getOAuthAuthorizationUrl = (authorizationId) => {
  const baseUrl = process.env.SUPABASE_URL;
  if (!baseUrl) throw new Error('SUPABASE_URL is required to handle OAuth authorizations.');
  return `${baseUrl.replace(/\/$/, '')}/auth/v1/oauth/authorizations/${encodeURIComponent(authorizationId)}`;
};

const getUserAuthorizationHeaders = (accessToken) => ({
  apikey: process.env.SUPABASE_ANON_KEY,
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
});

const getSafeWebUrl = (value) => {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

const getSafeOAuthRedirect = (value) => {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    if (['http:', 'https:'].includes(url.protocol)) return url.href;
    if (/^[a-z][a-z0-9.+-]*:$/.test(url.protocol) && !['javascript:', 'data:', 'vbscript:'].includes(url.protocol)) {
      return url.href;
    }
    return '';
  } catch {
    return '';
  }
};

export const showOAuthConsent = async (req, res, next) => {
  const authorizationId = req.query.authorization_id;
  if (typeof authorizationId !== 'string' || !authorizationId || authorizationId.length > 256) {
    return res.status(400).render('error', {
      message: 'The OAuth authorization request is invalid.',
      error: { status: 400 }
    });
  }

  try {
    const response = await fetch(getOAuthAuthorizationUrl(authorizationId), {
      headers: getUserAuthorizationHeaders(req.accessToken)
    });
    const result = await response.json();
    if (!response.ok) {
      return res.status(response.status).render('error', {
        message: result.msg || result.message || 'Unable to load the OAuth authorization request.',
        error: { status: response.status }
      });
    }

    if (result.redirect_url) {
      const redirectUrl = getSafeOAuthRedirect(result.redirect_url);
      if (!redirectUrl) {
        return res.status(502).render('error', {
          message: 'Supabase returned an invalid OAuth redirect URL.',
          error: { status: 502 }
        });
      }
      return res.redirect(redirectUrl);
    }
    if (!result.authorization_id || !result.client || typeof result.scope !== 'string') {
      return res.status(502).render('error', {
        message: 'Supabase returned incomplete OAuth authorization details.',
        error: { status: 502 }
      });
    }

    return res.render('oauth-consent', {
      client: {
        name: String(result.client.name || 'An application'),
        uri: getSafeWebUrl(result.client.uri),
        logoUri: getSafeWebUrl(result.client.logo_uri)
      },
      authorizationId: result.authorization_id,
      scopes: result.scope.split(' ').filter(Boolean)
    });
  } catch (error) {
    return next(error);
  }
};

export const decideOAuthConsent = async (req, res, next) => {
  const { authorization_id: authorizationId, action } = req.body;
  if (
    typeof authorizationId !== 'string' ||
    !authorizationId ||
    authorizationId.length > 256 ||
    !['approve', 'deny'].includes(action)
  ) {
    return res.status(400).json({ success: false, message: 'Invalid OAuth consent request.' });
  }

  try {
    const response = await fetch(`${getOAuthAuthorizationUrl(authorizationId)}/consent`, {
      method: 'POST',
      headers: getUserAuthorizationHeaders(req.accessToken),
      body: JSON.stringify({ action })
    });
    const result = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: result.msg || result.message || 'Unable to submit the OAuth consent decision.'
      });
    }

    if (typeof result.redirect_url !== 'string') {
      return res.status(502).json({ success: false, message: 'Supabase did not return an OAuth redirect URL.' });
    }
    const redirectUrl = getSafeOAuthRedirect(result.redirect_url);
    if (!redirectUrl) {
      return res.status(502).json({ success: false, message: 'Supabase returned an invalid OAuth redirect URL.' });
    }
    return res.json({ success: true, redirectUrl });
  } catch (error) {
    return next(error);
  }
};
