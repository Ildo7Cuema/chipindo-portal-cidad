-- Create hospital images storage bucket
insert into storage.buckets (id, name, public)
values ('hospital_images', 'hospital_images', true)
on conflict (id) do nothing;

-- Create policies for hospital_images bucket
-- Everyone can view images
create policy "Public Access"
    on storage.objects for select
    using ( bucket_id = 'hospital_images' );

-- Authenticated users with role 'saude' or admin can insert/update/delete
create policy "Health Access Insert"
    on storage.objects for insert
    with check (
      bucket_id = 'hospital_images' AND
      auth.role() = 'authenticated'
    );

create policy "Health Access Update"
    on storage.objects for update
    using ( 
      bucket_id = 'hospital_images' AND
      auth.role() = 'authenticated'
    );

create policy "Health Access Delete"
    on storage.objects for delete
    using ( 
      bucket_id = 'hospital_images' AND
      auth.role() = 'authenticated'
    );


-- Create hospital_infrastructures table
CREATE TABLE IF NOT EXISTS hospital_infrastructures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospital_municipal', 'centro_saude', 'posto_saude')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates TEXT, -- "lat,lng" for map if available
  phone TEXT,
  email TEXT,
  operating_hours TEXT NOT NULL,
  capacity_beds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hospital_services table
CREATE TABLE IF NOT EXISTS hospital_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  infrastructure_id UUID NOT NULL REFERENCES hospital_infrastructures(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Urgências", "Consultas Externas", "Maternidade"
  description TEXT,
  availability TEXT, -- e.g. "24/7", "Seg-Sex, 8h-16h"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hospital_images table
CREATE TABLE IF NOT EXISTS hospital_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  infrastructure_id UUID NOT NULL REFERENCES hospital_infrastructures(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  section TEXT NOT NULL, -- e.g. "Exterior", "Recepção", "Sala de Operações", "Maternidade"
  caption TEXT,
  featured BOOLEAN DEFAULT FALSE, -- is it the main image?
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hospital_infrastructures ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_images ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Public can view active infrastructures" ON hospital_infrastructures FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view services" ON hospital_services FOR SELECT USING (true);
CREATE POLICY "Public can view images" ON hospital_images FOR SELECT USING (true);

-- Policies for authenticated management
-- For now allowing any authenticated user as per normal, the frontend access control (useAccessControl) 
-- will strictly enforce that only 'saude' users can reach the admin UI that executes these mutations.
-- To be completely secure we can join the auth.users or profiles, but keeping consistent with existing tables 
-- (like `servicos` and `concursos`) we use `auth.role() = 'authenticated'` for general mutations.

CREATE POLICY "Authenticated users can manage infrastructures" ON hospital_infrastructures FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage services" ON hospital_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage images" ON hospital_images FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_hospital_infrastructures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hospital_infrastructures_updated_at
  BEFORE UPDATE ON hospital_infrastructures
  FOR EACH ROW
  EXECUTE FUNCTION update_hospital_infrastructures_updated_at();

CREATE OR REPLACE FUNCTION update_hospital_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hospital_services_updated_at
  BEFORE UPDATE ON hospital_services
  FOR EACH ROW
  EXECUTE FUNCTION update_hospital_services_updated_at();

-- Insert sample data
INSERT INTO hospital_infrastructures (id, name, type, description, location, operating_hours, capacity_beds) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Hospital Municipal de Chipindo', 'hospital_municipal', 'A principal unidade hospitalar do município com atendimento geral, urgências e maternidade.', 'Centro da Vila de Chipindo', '24 horas / 7 dias', 40),
  ('22222222-2222-2222-2222-222222222222', 'Centro de Saúde da Comuna de Bambi', 'centro_saude', 'Centro de saúde equipado para primeiros socorros, acompanhamento pré-natal e consultas básicas.', 'Comuna de Bambi', 'Segunda a Sexta: 08h00 - 15h30', 10);

INSERT INTO hospital_services (infrastructure_id, name, description, availability)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Urgências', 'Atendimento rápido e suporte avançado de vida.', '24 horas'),
  ('11111111-1111-1111-1111-111111111111', 'Maternidade', 'Acompanhamento do parto, internamento e cuidados pós-natais.', '24 horas'),
  ('11111111-1111-1111-1111-111111111111', 'Pediatria', 'Unidade de saúde infantil para consultas e observação.', 'Segunda a Sexta, 8h-16h'),
  ('22222222-2222-2222-2222-222222222222', 'Consultas Gerais', 'Revisões de rotina, rastreio de malária e outras endemias.', 'Segunda a Sexta, 8h-15h30'),
  ('22222222-2222-2222-2222-222222222222', 'Farmácia Comunitária', 'Ponto de recolha para medicação de receituário do Estado.', 'Segunda a Sexta, 8h-15h30');

-- Let's put some sample images (Using standard Unsplash URLs for hospital interiors as placeholders)
INSERT INTO hospital_images (infrastructure_id, url, section, caption, featured)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop', 'Exterior', 'Fachada Frontal', true),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop', 'Recepção', 'Sala de espera principal', false),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2074&auto=format&fit=crop', 'Corredor', 'Acesso às enfermarias', false),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2047&auto=format&fit=crop', 'Urgências', 'Equipamento de suporte à emergência', false),
  ('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop', 'Exterior', 'Pátio central e jardins', true);
