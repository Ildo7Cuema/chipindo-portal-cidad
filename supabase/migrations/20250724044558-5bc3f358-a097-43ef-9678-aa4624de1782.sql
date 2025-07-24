-- Create the user_role enum
CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');

-- Drop the existing check constraint that's causing the issue
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profile_role_check;

-- Convert the role column to use the user_role enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role 
USING role::user_role;