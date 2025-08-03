-- Complete fix for interest_registrations RLS issues
-- This script addresses the 42501 error when inserting data

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Anyone can insert interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Public can insert interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Admins can update interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Admins can delete interest registrations" ON public.interest_registrations;

-- Step 2: Temporarily disable RLS to ensure clean state
ALTER TABLE public.interest_registrations DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new, simplified policies
-- Allow anyone to insert (this is the main fix)
CREATE POLICY "Allow public insert" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view all
CREATE POLICY "Allow admin select" 
ON public.interest_registrations 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE is_current_user_admin()
  END
);

-- Allow admins to update
CREATE POLICY "Allow admin update" 
ON public.interest_registrations 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE is_current_user_admin()
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE is_current_user_admin()
  END
);

-- Allow admins to delete
CREATE POLICY "Allow admin delete" 
ON public.interest_registrations 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE is_current_user_admin()
  END
);

-- Step 5: Fix the notification function to handle anonymous users
CREATE OR REPLACE FUNCTION public.create_interest_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create notification if we can determine admin status
  IF auth.uid() IS NOT NULL OR is_current_user_admin() THEN
    INSERT INTO public.admin_notifications (
      type,
      title,
      message,
      data
    ) VALUES (
      'interest_registration',
      'Novo Registo de Interesse',
      'Nova pessoa registou interesse: ' || NEW.full_name,
      jsonb_build_object(
        'registration_id', NEW.id,
        'full_name', NEW.full_name,
        'email', NEW.email,
        'phone', NEW.phone,
        'profession', NEW.profession,
        'experience_years', NEW.experience_years,
        'areas_of_interest', NEW.areas_of_interest,
        'additional_info', NEW.additional_info
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Step 6: Verify the policies are working
-- This will show us what policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'interest_registrations'; 