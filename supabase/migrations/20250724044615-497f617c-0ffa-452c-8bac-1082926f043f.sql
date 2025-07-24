-- Remove the default value temporarily
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Drop the existing check constraint that's causing the issue
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profile_role_check;

-- Convert the role column to use the user_role enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role 
USING role::user_role;

-- Set the new default value
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user'::user_role;