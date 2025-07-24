-- Update the existing user to be admin since they're the first user
UPDATE public.profiles 
SET role = 'admin'::user_role 
WHERE user_id = 'f59507fa-b7eb-4922-94a0-7195b982cdbb';

-- Drop and recreate the trigger function with better logic
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.make_first_user_admin();

-- Create improved function to make first user admin
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
CREATE TRIGGER make_first_user_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.make_first_user_admin();