import { createClient } from '@supabase/supabase-js';

export const oauthProviders = [
  { id: 'github', name: 'GitHub' },
  { id: 'google', name: 'Google' }
];

const createAdminClient = () => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to manage OAuth providers.');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
};

export const getOAuthProviders = async () => {
  const { data, error } = await createAdminClient()
    .from('oauth_provider_settings')
    .select('provider, enabled');

  if (error) {
    throw new Error(`Unable to load OAuth provider settings: ${error.message}`);
  }

  return oauthProviders.map(provider => ({
    ...provider,
    enabled: (data || []).some(setting => setting.provider === provider.id && setting.enabled)
  }));
};

export const setOAuthProviderEnabled = async (provider, enabled) => {
  if (!oauthProviders.some(item => item.id === provider)) {
    throw new Error('Unsupported OAuth provider.');
  }

  const { error } = await createAdminClient()
    .from('oauth_provider_settings')
    .upsert({ provider, enabled, updated_at: new Date().toISOString() }, { onConflict: 'provider' });

  if (error) {
    throw new Error(`Unable to update OAuth provider setting: ${error.message}`);
  }
};
