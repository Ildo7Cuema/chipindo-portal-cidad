-- Update the existing user to be admin
UPDATE public.profiles 
SET role = 'admin'::user_role 
WHERE user_id = '6504ed04-8b1f-4436-a166-00fe47282271';

-- Drop and recreate the trigger to fix any potential issues
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON public.profiles;

-- Recreate the function with better logic
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Check if this is the first user (should be 1 after insert)
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  IF user_count = 1 THEN
    -- Make the first user an admin
    UPDATE public.profiles 
    SET role = 'admin'::user_role 
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to make first user admin
CREATE TRIGGER make_first_user_admin_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.make_first_user_admin();