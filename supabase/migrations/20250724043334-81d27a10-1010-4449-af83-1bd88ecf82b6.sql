-- Update the existing user to admin manually  
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = 'f59507fa-b7eb-4922-94a0-7195b982cdbb';

-- Create trigger function to make first user admin for future users
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
  WHERE role = 'admin';
  
  -- If no admin exists, make this user an admin
  IF admin_count = 0 THEN
    NEW.role = 'admin';
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