-- Drop the function with CASCADE to remove dependent policies
DROP FUNCTION IF EXISTS public.is_current_user_admin() CASCADE;

-- Drop the existing check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profile_role_check;

-- Create the user_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- Remove the default value temporarily
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Convert the role column to use the user_role enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role 
USING CASE 
    WHEN role = 'admin' THEN 'admin'::user_role
    WHEN role = 'editor' THEN 'editor'::user_role
    ELSE 'user'::user_role
END;

-- Set the new default value
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Recreate the function with proper enum handling
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::user_role
  );
$$;

-- Recreate the policies
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR public.is_current_user_admin()
);

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR public.is_current_user_admin()
);