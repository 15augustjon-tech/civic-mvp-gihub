-- Civic Forum Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  state text, -- User's state for localized content
  party_preference text check (party_preference in ('R', 'D', 'I')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- WATCHLISTS TABLE
-- ============================================
-- Stores politicians that users are tracking
create table if not exists public.watchlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  politician_id text not null,
  politician_name text not null,
  politician_party text check (politician_party in ('R', 'D', 'I')) not null,
  politician_state text not null,
  politician_chamber text check (politician_chamber in ('senate', 'house')) not null,
  alerts_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Prevent duplicate entries
  unique(user_id, politician_id)
);

-- Enable Row Level Security
alter table public.watchlists enable row level security;

-- Watchlist policies
create policy "Users can view their own watchlist"
  on public.watchlists for select
  using (auth.uid() = user_id);

create policy "Users can add to their watchlist"
  on public.watchlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their watchlist items"
  on public.watchlists for update
  using (auth.uid() = user_id);

create policy "Users can delete from their watchlist"
  on public.watchlists for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists watchlists_user_id_idx on public.watchlists(user_id);
create index if not exists watchlists_politician_id_idx on public.watchlists(politician_id);

-- ============================================
-- TRADE ALERTS TABLE
-- ============================================
-- Stores notifications about new trades for watched politicians
create table if not exists public.trade_alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  watchlist_id uuid references public.watchlists(id) on delete cascade not null,
  politician_name text not null,
  ticker text not null,
  trade_type text not null,
  amount text not null,
  trade_date text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.trade_alerts enable row level security;

-- Trade alerts policies
create policy "Users can view their own alerts"
  on public.trade_alerts for select
  using (auth.uid() = user_id);

create policy "Users can update their alerts (mark as read)"
  on public.trade_alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their alerts"
  on public.trade_alerts for delete
  using (auth.uid() = user_id);

-- System can insert alerts
create policy "System can insert alerts"
  on public.trade_alerts for insert
  with check (true);

-- Index for faster queries
create index if not exists trade_alerts_user_id_idx on public.trade_alerts(user_id);
create index if not exists trade_alerts_read_idx on public.trade_alerts(user_id, read);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- ============================================
-- GRANTS
-- ============================================
-- Grant access to authenticated users
grant usage on schema public to authenticated;
grant all on public.profiles to authenticated;
grant all on public.watchlists to authenticated;
grant all on public.trade_alerts to authenticated;
