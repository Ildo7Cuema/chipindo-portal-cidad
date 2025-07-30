-- Add growth rate fields to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS growth_rate TEXT DEFAULT '5.4',
ADD COLUMN IF NOT EXISTS growth_description TEXT DEFAULT 'Taxa anual',
ADD COLUMN IF NOT EXISTS growth_period TEXT DEFAULT '2024';

-- Update existing records with default values
UPDATE public.site_settings 
SET 
  growth_rate = '5.4',
  growth_description = 'Taxa anual',
  growth_period = '2024'
WHERE id IS NOT NULL 
  AND (growth_rate IS NULL OR growth_description IS NULL OR growth_period IS NULL); 