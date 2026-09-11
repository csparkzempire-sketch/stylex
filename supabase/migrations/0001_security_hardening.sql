-- STYLEX — security hardening
--
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to run more than once.
--
-- Fixes two audited problems:
--   1. Rate limiting was calling a function that does not exist, so every
--      limiter call failed and fell through to "allowed".
--   2. Anyone could read every user's email, phone and admin flag from
--      profiles, because the anon key is public by design.


-- ---------------------------------------------------------------------------
-- 1. Rate limiting
--
-- lib/rateLimit.js calls bump_rate_limit(). The function was never created,
-- so rateLimit() hit its catch branch and returned { allowed: true } on every
-- request — the limits on nine endpoints were doing nothing at all.
--
-- Counters live in Postgres rather than process memory on purpose: serverless
-- instances do not share memory, so an in-process Map resets on cold start and
-- is trivially bypassed by parallel requests landing on different instances.
-- ---------------------------------------------------------------------------

create table if not exists rate_limits (
  key          text primary key,
  count        integer not null default 0,
  window_start timestamptz not null,
  updated_at   timestamptz not null default now()
);

create index if not exists rate_limits_window_idx on rate_limits (window_start);

-- Atomically increments the counter for a bucket and returns the new value.
-- The insert-on-conflict is what makes it safe under concurrency: two requests
-- arriving together cannot both read 0 and both write 1.
create or replace function bump_rate_limit(p_key text, p_window_start timestamptz)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into rate_limits (key, count, window_start, updated_at)
  values (p_key, 1, p_window_start, now())
  on conflict (key) do update
    set count = rate_limits.count + 1,
        updated_at = now()
  returning count into new_count;

  return new_count;
end;
$$;

-- Only the service role may touch the limiter. If anon could call it, an
-- attacker could inflate their own bucket or, worse, everyone else's.
revoke all on function bump_rate_limit(text, timestamptz) from public, anon, authenticated;
grant execute on function bump_rate_limit(text, timestamptz) to service_role;

alter table rate_limits enable row level security;
revoke all on table rate_limits from anon, authenticated;

-- Housekeeping: old buckets are dead weight. Call occasionally, or from cron.
create or replace function prune_rate_limits()
returns void
language sql
security definer
set search_path = public
as $$
  delete from rate_limits where window_start < now() - interval '1 day';
$$;

revoke all on function prune_rate_limits() from public, anon, authenticated;
grant execute on function prune_rate_limits() to service_role;


-- ---------------------------------------------------------------------------
-- 2. Stop anonymous visitors reading personal data from profiles
--
-- The anon key ships inside the browser bundle of every Supabase app, so it is
-- public by definition — treat it as known to everyone. Verified during the
-- audit: an unauthenticated request to /rest/v1/profiles?select=* returned
-- full rows including email, phone and is_admin.
--
-- RLS is row-level and cannot hide a column, so this uses column-level GRANTs,
-- which apply per role. Anonymous visitors lose these columns; signed-in users
-- keep them, which is what the app needs — every profiles.select("*") in the
-- client is scoped to .eq("id", user.id) and runs authenticated, and the public
-- directory query already lists its columns explicitly.
--
-- is_admin is included deliberately: it let anyone list which accounts to
-- attack. It is only reconnaissance, since the real check happens server-side
-- with the service key, but there is no reason to publish it.
-- ---------------------------------------------------------------------------

revoke select (
  email,
  phone,
  is_admin,
  account_status,
  monthly_revenue_goal,
  referred_by,
  notification_settings
) on public.profiles from anon;

-- Signed-in users keep full access to the table. This does NOT stop one
-- signed-in user reading another's email — see the note below.
grant select on public.profiles to authenticated;


-- ---------------------------------------------------------------------------
-- Remaining exposure, deliberately not changed here
--
-- Any signed-in user can still read other users' email and phone. Closing that
-- properly means either splitting the personal fields into an owner-only table
-- (the pattern already used for payout_accounts) or serving the directory from
-- a view that exposes only public columns. Both change application queries, so
-- they belong in their own change with the app updated alongside — not bolted
-- onto a security patch.
-- ---------------------------------------------------------------------------
