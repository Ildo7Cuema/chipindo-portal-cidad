-- Add area total fields to site_settings table
-- This script can be executed directly in the Supabase SQL editor

-- Add the new columns
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS area_total_count TEXT DEFAULT '2.100',
ADD COLUMN IF NOT EXISTS area_total_description TEXT DEFAULT 'Quilómetros quadrados';

-- Update existing records with default values
UPDATE public.site_settings 
SET 
  area_total_count = '2.100',
  area_total_description = 'Quilómetros quadrados'
WHERE id IS NOT NULL 
  AND (area_total_count IS NULL OR area_total_description IS NULL);

-- Verify the changes
SELECT 
  id,
  area_total_count,
  area_total_description,
  created_at,
  updated_at
FROM public.site_settings 
LIMIT 5;

-- Adicionar campos de crescimento
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS growth_rate TEXT DEFAULT '5.4',
ADD COLUMN IF NOT EXISTS growth_description TEXT DEFAULT 'Taxa anual',
ADD COLUMN IF NOT EXISTS growth_period TEXT DEFAULT '2024';

-- Atualizar registros existentes com valores padrão
UPDATE public.site_settings 
SET 
  growth_rate = '5.4',
  growth_description = 'Taxa anual',
  growth_period = '2024'
WHERE id IS NOT NULL 
  AND (growth_rate IS NULL OR growth_description IS NULL OR growth_period IS NULL);

-- Verificar todos os campos
SELECT 
  id,
  area_total_count,
  area_total_description,
  growth_rate,
  growth_description,
  growth_period,
  created_at,
  updated_at
FROM public.site_settings 
LIMIT 5; 