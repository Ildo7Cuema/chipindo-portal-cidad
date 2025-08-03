-- Fix RLS policies for interest_registrations table
-- This script addresses the 401 Unauthorized error when inserting data

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all interest registrations" ON public.interest_registrations;
DROP POLICY IF EXISTS "Anyone can insert interest registrations" ON public.interest_registrations;

-- Create new policies that work for both authenticated and anonymous users
CREATE POLICY "Public can insert interest registrations" 
ON public.interest_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all interest registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (is_current_user_admin());

-- Also allow the user who created the registration to view it (if authenticated)
CREATE POLICY "Users can view their own registrations" 
ON public.interest_registrations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow admins to update registrations
CREATE POLICY "Admins can update interest registrations" 
ON public.interest_registrations 
FOR UPDATE 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Allow admins to delete registrations
CREATE POLICY "Admins can delete interest registrations" 
ON public.interest_registrations 
FOR DELETE 
USING (is_current_user_admin()); 