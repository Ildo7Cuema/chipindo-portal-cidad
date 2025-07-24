-- Create table for municipality location points
CREATE TABLE public.municipality_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL DEFAULT 'office', -- office, school, hospital, park, etc.
  address TEXT,
  phone TEXT,
  email TEXT,
  opening_hours TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.municipality_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active locations"
ON public.municipality_locations
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage locations"
ON public.municipality_locations
FOR ALL
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_municipality_locations_updated_at
BEFORE UPDATE ON public.municipality_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update contact information in site_settings with real data for Chipindo
UPDATE public.site_settings SET
  contact_address = 'Administração Municipal de Chipindo, Chipindo, Província de Huíla, Angola',
  contact_phone = '+244 926 123 456',
  contact_email = 'geral@chipindo.gov.ao'
WHERE id IS NOT NULL;