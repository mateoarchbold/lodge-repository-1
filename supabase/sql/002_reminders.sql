-- Nabu reminders (push notifications)
-- Safe to run more than once.

-- One row per device that turned notifications on
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription jsonb not null,
  tz text not null default 'America/Bogota',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
drop policy if exists "push subs: read own" on public.push_subscriptions;
drop policy if exists "push subs: add own" on public.push_subscriptions;
drop policy if exists "push subs: change own" on public.push_subscriptions;
drop policy if exists "push subs: remove own" on public.push_subscriptions;
create policy "push subs: read own" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy "push subs: add own" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy "push subs: change own" on public.push_subscriptions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "push subs: remove own" on public.push_subscriptions for delete using (auth.uid() = user_id);

-- Which reminders were already sent (so nothing is sent twice). Server only.
create table if not exists public.push_sent (
  user_id uuid not null,
  key text not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.push_sent enable row level security;

-- The server's push keys (created automatically on first use). Server only.
create table if not exists public.push_vapid (
  id int primary key,
  public_key text not null,
  private_key text not null
);
alter table public.push_vapid enable row level security;

-- Check for due reminders every minute
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.unschedule('nabu-reminders') where exists (select 1 from cron.job where jobname = 'nabu-reminders');
select cron.schedule(
  'nabu-reminders',
  '* * * * *',
  $$ select net.http_post(
       url := 'https://icjhcoxjxpwohbnuejnr.supabase.co/functions/v1/nabu-reminders',
       headers := '{"Content-Type": "application/json"}'::jsonb,
       body := '{"action": "tick"}'::jsonb
     ); $$
);
