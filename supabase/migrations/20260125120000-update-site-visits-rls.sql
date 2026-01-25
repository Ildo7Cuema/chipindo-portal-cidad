-- Drop the restrictive policy
drop policy if exists "Enable select for admins only" on public.site_visits;

-- Create a more permissive policy for authenticated users (staff)
create policy "Enable select for authenticated users"
on public.site_visits
as permissive
for select
to authenticated
using (true);
