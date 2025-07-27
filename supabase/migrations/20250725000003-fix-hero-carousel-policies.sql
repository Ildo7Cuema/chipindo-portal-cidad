-- Fix hero carousel policies to allow admin access to all images
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active hero carousel images" ON public.hero_carousel;
DROP POLICY IF EXISTS "Authenticated users can manage hero carousel" ON public.hero_carousel;

-- Create new policies that allow authenticated users to see all images
CREATE POLICY "Authenticated users can view all hero carousel images" 
ON public.hero_carousel 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy for public access to active images only
CREATE POLICY "Public can view active hero carousel images" 
ON public.hero_carousel 
FOR SELECT 
USING (active = true);

-- Create comprehensive policy for authenticated users to manage all images
CREATE POLICY "Authenticated users can manage all hero carousel images" 
ON public.hero_carousel 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated'); 