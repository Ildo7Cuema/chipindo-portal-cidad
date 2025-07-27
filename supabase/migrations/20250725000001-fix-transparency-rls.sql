-- Fix RLS policies for transparency tables
-- Allow insert/update/delete for authenticated users during development

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage transparency documents" ON public.transparency_documents;
DROP POLICY IF EXISTS "Admins can manage budget execution" ON public.budget_execution;
DROP POLICY IF EXISTS "Admins can manage transparency projects" ON public.transparency_projects;

-- Create new policies that allow authenticated users to manage data
CREATE POLICY "Authenticated users can manage transparency documents" 
ON public.transparency_documents 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage budget execution" 
ON public.budget_execution 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage transparency projects" 
ON public.transparency_projects 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Also allow public access for development (remove in production)
CREATE POLICY "Public can manage transparency documents" 
ON public.transparency_documents 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can manage budget execution" 
ON public.budget_execution 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can manage transparency projects" 
ON public.transparency_projects 
FOR ALL 
USING (true)
WITH CHECK (true); 