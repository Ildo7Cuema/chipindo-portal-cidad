-- Remove the incorrect constraint that doesn't allow 'editor'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;