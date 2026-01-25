create table if not exists public.site_visits (
    id uuid not null default gen_random_uuid(),
    page_path text not null,
    visitor_id text,
    user_agent text,
    created_at timestamp with time zone not null default now(),
    constraint site_visits_pkey primary key (id)
);

alter table public.site_visits enable row level security;

-- Allow public access to insert visits
create policy "Enable insert for all users"
on public.site_visits
as permissive
for insert
to public
with check (true);

-- Allow admins to view visits
create policy "Enable select for admins only"
on public.site_visits
as permissive
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
