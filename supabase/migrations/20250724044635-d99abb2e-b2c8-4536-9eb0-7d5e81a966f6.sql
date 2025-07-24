-- Create the user_role enum only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- Drop the existing check constraint that's causing the issue
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profile_role_check;

-- Update all existing role values to ensure they're valid
UPDATE public.profiles SET role = 'user' WHERE role NOT IN ('admin', 'editor', 'user');

-- Remove the default value temporarily
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Convert the role column to use the user_role enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role 
USING role::user_role;

-- Set the new default value
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user'::user_role;