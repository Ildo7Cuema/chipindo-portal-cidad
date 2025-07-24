-- Drop the policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Create security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Allow admins to view all profiles using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR public.is_current_user_admin()
);

-- Allow admins to update any profile using the security definer function
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR public.is_current_user_admin()
);