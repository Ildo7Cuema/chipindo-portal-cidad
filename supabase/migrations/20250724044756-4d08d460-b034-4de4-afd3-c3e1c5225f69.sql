-- First, let's simply remove the constraint that's blocking the updates
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profile_role_check;

-- Add a simple check constraint that allows the three role values
ALTER TABLE public.profiles 
ADD CONSTRAINT profile_role_check 
CHECK (role IN ('admin', 'editor', 'user'));