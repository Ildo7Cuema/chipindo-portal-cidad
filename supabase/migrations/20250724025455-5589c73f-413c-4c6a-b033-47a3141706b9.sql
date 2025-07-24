-- Create enum for user roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing data to match enum values before conversion
UPDATE public.profiles SET role = 'user' WHERE role NOT IN ('admin', 'editor', 'user');

-- Convert column to use enum
ALTER TABLE public.profiles ALTER COLUMN role TYPE user_role USING 
  CASE 
    WHEN role = 'admin' THEN 'admin'::user_role
    WHEN role = 'editor' THEN 'editor'::user_role  
    WHEN role = 'moderator' THEN 'editor'::user_role
    ELSE 'user'::user_role
  END;

-- Set default role
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::user_role);
$$;

-- Create function to check if user can manage content (admin or editor)
CREATE OR REPLACE FUNCTION public.can_manage_content(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::user_role) OR public.has_role(_user_id, 'editor'::user_role);
$$;

-- Update news policies for role-based access
DROP POLICY IF EXISTS "Authenticated users can create news" ON public.news;
DROP POLICY IF EXISTS "Authors can update their own news" ON public.news;
DROP POLICY IF EXISTS "Authors can delete their own news" ON public.news;

-- New policies for news management
CREATE POLICY "Content managers can create news" 
ON public.news 
FOR INSERT 
TO authenticated
WITH CHECK (public.can_manage_content(auth.uid()) AND auth.uid() = author_id);

CREATE POLICY "Authors and admins can update news" 
ON public.news 
FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Authors and admins can delete news" 
ON public.news 
FOR DELETE 
TO authenticated
USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

-- Update concursos policies for role-based access
DROP POLICY IF EXISTS "Authenticated users can manage concursos" ON public.concursos;

CREATE POLICY "Content managers can create concursos" 
ON public.concursos 
FOR INSERT 
TO authenticated
WITH CHECK (public.can_manage_content(auth.uid()));

CREATE POLICY "Content managers can update concursos" 
ON public.concursos 
FOR UPDATE 
TO authenticated
USING (public.can_manage_content(auth.uid()));

CREATE POLICY "Content managers can delete concursos" 
ON public.concursos 
FOR DELETE 
TO authenticated
USING (public.can_manage_content(auth.uid()));

-- Update news select policy for better admin access
DROP POLICY IF EXISTS "Anyone can view published news" ON public.news;
CREATE POLICY "Anyone can view published news" 
ON public.news 
FOR SELECT 
USING (published = true OR auth.uid() = author_id OR public.is_admin(auth.uid()));

-- Update profiles policies for admin access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view own profile or admins can view all" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update own profile or admins can update any" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Function to assign first user as admin
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Check if this is the first user
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
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON public.profiles;
CREATE TRIGGER make_first_user_admin_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.make_first_user_admin();