-- Create emergency contacts table for administrator to manage
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for emergency contacts
CREATE POLICY "Anyone can view active emergency contacts" 
ON public.emergency_contacts 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage emergency contacts" 
ON public.emergency_contacts 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_emergency_contacts_updated_at
BEFORE UPDATE ON public.emergency_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default emergency contacts
INSERT INTO public.emergency_contacts (name, phone, description, priority) VALUES
('Bombeiros', '115', 'Serviços de emergência e combate a incêndios', 1),
('Polícia', '113', 'Segurança pública e emergências policiais', 2),
('Hospital Municipal', '+244 923 456 791', 'Emergências médicas e cuidados de saúde', 3);