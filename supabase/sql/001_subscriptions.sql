-- Nabu: who has Pro.
-- One row per account. Only the paddle-webhook function (server side)
-- can write here; each logged-in user can only READ their own row.
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null,                 -- active, trialing, past_due, paused, canceled
  plan text,                            -- monthly / yearly
  paddle_subscription_id text,
  paddle_customer_id text,
  current_period_end timestamptz,       -- when the paid period ends / renews
  last_event_at timestamptz,            -- time of the last Paddle event applied (ignores late, older events)
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can read their own subscription" on public.subscriptions;
create policy "Users can read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);
