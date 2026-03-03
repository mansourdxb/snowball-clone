-- Snowball Analytics Clone - Supabase Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  currency text not null default 'USD',
  locale text not null default 'en-US',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- PORTFOLIOS
-- ============================================
create table public.portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  currency text not null default 'USD',
  benchmark text default 'SPY',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolios enable row level security;

create policy "Users can CRUD own portfolios"
  on public.portfolios for all
  using (auth.uid() = user_id);

create index idx_portfolios_user_id on public.portfolios(user_id);

-- ============================================
-- HOLDINGS
-- ============================================
create table public.holdings (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  symbol text not null,
  name text not null,
  asset_type text not null default 'stock', -- stock, etf, crypto, bond, cash
  shares numeric(18, 8) not null default 0,
  average_cost numeric(18, 4) not null default 0,
  current_price numeric(18, 4) not null default 0,
  currency text not null default 'USD',
  sector text,
  exchange text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(portfolio_id, symbol)
);

alter table public.holdings enable row level security;

create policy "Users can CRUD own holdings"
  on public.holdings for all
  using (
    portfolio_id in (
      select id from public.portfolios where user_id = auth.uid()
    )
  );

create index idx_holdings_portfolio_id on public.holdings(portfolio_id);

-- ============================================
-- TRANSACTIONS
-- ============================================
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  holding_id uuid references public.holdings(id) on delete set null,
  symbol text not null,
  type text not null, -- buy, sell, dividend, split, transfer
  shares numeric(18, 8) not null default 0,
  price_per_share numeric(18, 4) not null default 0,
  total_amount numeric(18, 4) not null default 0,
  fees numeric(18, 4) not null default 0,
  currency text not null default 'USD',
  notes text,
  executed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can CRUD own transactions"
  on public.transactions for all
  using (
    portfolio_id in (
      select id from public.portfolios where user_id = auth.uid()
    )
  );

create index idx_transactions_portfolio_id on public.transactions(portfolio_id);
create index idx_transactions_executed_at on public.transactions(executed_at);

-- ============================================
-- DIVIDENDS
-- ============================================
create table public.dividends (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  holding_id uuid references public.holdings(id) on delete set null,
  symbol text not null,
  amount_per_share numeric(18, 6) not null,
  total_amount numeric(18, 4) not null,
  shares_held numeric(18, 8) not null,
  currency text not null default 'USD',
  ex_date date not null,
  pay_date date,
  is_reinvested boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.dividends enable row level security;

create policy "Users can CRUD own dividends"
  on public.dividends for all
  using (
    portfolio_id in (
      select id from public.portfolios where user_id = auth.uid()
    )
  );

create index idx_dividends_portfolio_id on public.dividends(portfolio_id);
create index idx_dividends_ex_date on public.dividends(ex_date);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.portfolios
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.holdings
  for each row execute function public.handle_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null default 'free', -- free, starter, investor, expert
  status text not null default 'none', -- none, trialing, active, past_due, canceled
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);

create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ============================================
-- WATCHLISTS
-- ============================================
create table public.watchlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  symbol text not null,
  name text not null,
  asset_type text not null default 'stock',
  notes text,
  target_price numeric(18, 4),
  alert_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, symbol)
);

alter table public.watchlists enable row level security;

create policy "Users can CRUD own watchlist"
  on public.watchlists for all
  using (auth.uid() = user_id);

create index idx_watchlists_user_id on public.watchlists(user_id);

-- ============================================
-- CATEGORIES (for target allocation)
-- ============================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  name text not null,
  color text not null default '#3b82f6',
  target_allocation numeric(5, 2) not null default 0, -- percentage 0-100
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Users can CRUD own categories"
  on public.categories for all
  using (
    portfolio_id in (
      select id from public.portfolios where user_id = auth.uid()
    )
  );

-- Link holdings to categories
alter table public.holdings add column category_id uuid references public.categories(id) on delete set null;

create trigger set_updated_at before update on public.categories
  for each row execute function public.handle_updated_at();
