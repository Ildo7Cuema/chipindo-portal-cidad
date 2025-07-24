-- Create site_settings table for homepage and footer configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Hero section settings
  hero_title TEXT DEFAULT 'Bem-vindos ao Portal de Chipindo',
  hero_subtitle TEXT DEFAULT 'Conectando a Administração Municipal aos cidadãos através de informação transparente, serviços digitais e oportunidades de crescimento.',
  hero_location_badge TEXT DEFAULT 'Província de Huíla, Angola',
  
  -- Statistics settings
  population_count TEXT DEFAULT '150.000+',
  population_description TEXT DEFAULT 'Cidadãos servidos',
  departments_count TEXT DEFAULT '12',
  departments_description TEXT DEFAULT 'Áreas de atuação',
  services_count TEXT DEFAULT '24/7',
  services_description TEXT DEFAULT 'Portal sempre ativo',
  
  -- Footer settings
  footer_about_title TEXT DEFAULT 'Portal de Chipindo',
  footer_about_subtitle TEXT DEFAULT 'Administração Municipal',
  footer_about_description TEXT DEFAULT 'Conectando a Administração Municipal aos cidadãos através de informação transparente, serviços digitais e oportunidades de crescimento.',
  
  -- Contact information
  contact_address TEXT DEFAULT 'Rua Principal, Bairro Central, Chipindo, Província de Huíla, Angola',
  contact_phone TEXT DEFAULT '+244 XXX XXX XXX',
  contact_email TEXT DEFAULT 'admin@chipindo.gov.ao',
  
  -- Opening hours
  opening_hours_weekdays TEXT DEFAULT 'Segunda a Sexta: 08:00 - 16:00',
  opening_hours_saturday TEXT DEFAULT 'Sábado: 08:00 - 12:00',
  opening_hours_sunday TEXT DEFAULT 'Domingo: Encerrado',
  
  -- Copyright
  copyright_text TEXT DEFAULT '© 2024 Administração Municipal de Chipindo. Todos os direitos reservados.'
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default settings
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();