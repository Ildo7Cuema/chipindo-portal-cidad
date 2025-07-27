-- Update profiles table role constraint to allow specific values
-- First, drop the existing constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profile_role_check' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT profile_role_check;
    END IF;
END $$;

-- Add new constraint that allows specific role values
ALTER TABLE profiles ADD CONSTRAINT profile_role_check 
CHECK (role IS NULL OR role IN ('user', 'editor', 'admin'));

-- Update existing profiles to have valid roles
UPDATE profiles SET role = 'user' WHERE role IS NULL OR role NOT IN ('user', 'editor', 'admin'); 