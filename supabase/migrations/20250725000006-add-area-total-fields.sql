-- Add area total fields to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN area_total_count TEXT DEFAULT '2.100',
ADD COLUMN area_total_description TEXT DEFAULT 'Quilómetros quadrados';

-- Update existing records with default values
UPDATE public.site_settings 
SET 
  area_total_count = '2.100',
  area_total_description = 'Quilómetros quadrados'
WHERE id IS NOT NULL; 