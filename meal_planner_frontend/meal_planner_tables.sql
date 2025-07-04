-- SQL to create the "meals" table for meal planner on Supabase.
-- Run this in the Supabase SQL editor to initialize required storage.

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  date date not null,
  ingredients jsonb not null,
  calories numeric not null check (calories >= 0),
  nutrition_info jsonb,
  cuisine text,
  created_at timestamp with time zone not null default now(),
  constraint fk_meal_user foreign key(user_id) references auth.users(id) on delete cascade
);

-- Index for faster lookups by user and date
create index if not exists idx_meals_user_date on public.meals (user_id, date);

-- Example: ingredients and nutrition_info store complex data as JSON (arrays, objects).
-- "auth.users" is assumed as the built-in Supabase authentication user table.
