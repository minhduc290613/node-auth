create table if not exists public.oauth_provider_settings (
  provider text primary key check (provider in ('github', 'google')),
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.oauth_provider_settings enable row level security;

revoke all on table public.oauth_provider_settings from anon, authenticated;
grant all on table public.oauth_provider_settings to service_role;

insert into public.oauth_provider_settings (provider, enabled)
values ('github', false), ('google', false)
on conflict (provider) do nothing;
