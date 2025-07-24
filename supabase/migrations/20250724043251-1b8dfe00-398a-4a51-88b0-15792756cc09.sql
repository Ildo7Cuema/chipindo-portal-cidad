-- First, create the enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- Update the existing user to be admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = 'f59507fa-b7eb-4922-94a0-7195b982cdbb';

-- Convert role column to use the enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Set default role
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Create function to make first user admin
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Check if there are any admin users
  SELECT COUNT(*) INTO admin_count 
  FROM public.profiles 
  WHERE role = 'admin'::user_role;
  
  -- If no admin exists, make this user an admin
  IF admin_count = 0 THEN
    NEW.role = 'admin'::user_role;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to make first user admin (runs before insert)
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON public.profiles;
CREATE TRIGGER make_first_user_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.make_first_user_admin();