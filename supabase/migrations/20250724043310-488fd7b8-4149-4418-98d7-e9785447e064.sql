-- Create the enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- Update the existing user to be admin first
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = 'f59507fa-b7eb-4922-94a0-7195b982cdbb';

-- Remove default temporarily
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Convert role column to use the enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Set the new default
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user'::user_role;