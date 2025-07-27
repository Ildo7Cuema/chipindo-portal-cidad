-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    active BOOLEAN DEFAULT true,
    type VARCHAR(50) DEFAULT 'emergency',
    email VARCHAR(255),
    address TEXT,
    department VARCHAR(255),
    availability VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_active ON public.emergency_contacts(active);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_priority ON public.emergency_contacts(priority);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_type ON public.emergency_contacts(type);

-- Enable RLS
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view emergency contacts" ON public.emergency_contacts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert emergency contacts" ON public.emergency_contacts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update emergency contacts" ON public.emergency_contacts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete emergency contacts" ON public.emergency_contacts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO public.emergency_contacts (name, phone, description, priority, type, department, availability) VALUES
('Polícia Municipal', '+244 123 456 789', 'Polícia Municipal de Chipindo', 9, 'police', 'Segurança', '24/7'),
('Bombeiros', '+244 123 456 790', 'Corpo de Bombeiros de Chipindo', 9, 'fire', 'Proteção Civil', '24/7'),
('Hospital Municipal', '+244 123 456 791', 'Hospital Municipal de Chipindo', 8, 'hospital', 'Saúde', '24/7'),
('Ambulância', '+244 123 456 792', 'Serviço de Ambulância Municipal', 8, 'ambulance', 'Saúde', '24/7'),
('Emergência Geral', '+244 123 456 793', 'Número de emergência geral', 7, 'emergency', 'Administração', '24/7'),
('Segurança Municipal', '+244 123 456 794', 'Serviço de Segurança Municipal', 6, 'security', 'Segurança', 'Segunda a Sexta, 8h-18h'); 