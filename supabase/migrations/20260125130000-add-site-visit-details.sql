-- Add new columns for detailed analytics
alter table public.site_visits
add column if not exists ip_address text,
add column if not exists city text,
add column if not exists region text,
add column if not exists country text,
add column if not exists device_type text,
add column if not exists browser text,
add column if not exists os text;
