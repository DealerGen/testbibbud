-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table public.users (
  id uuid references auth.users primary key,
  email text,
  stripe_customer_id text,
  subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing')),
  subscription_tier text check (subscription_tier in ('basic', 'pro', 'enterprise')),
  subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create daily_data table
create table public.daily_data (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  data jsonb not null,
  created_at timestamptz default now()
);

-- Create RLS policies
alter table public.users enable row level security;
alter table public.daily_data enable row level security;

-- Users can only read their own data
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

-- Users can only update their own data
create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Users can only access their own daily data
create policy "Users can view own daily data" on public.daily_data
  for select using (auth.uid() = user_id);

create policy "Users can insert own daily data" on public.daily_data
  for insert with check (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();