-- Create a migration to update handle_new_user function
-- This ensures that when a new user is created in auth.users, 
-- dependencies (profiles) are created with the correct role from metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user') -- Extract role from metadata, default to 'user'
  );
  RETURN NEW;
END;
$$;
