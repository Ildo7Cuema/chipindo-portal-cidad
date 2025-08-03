-- Create servicos table if it doesn't exist
CREATE TABLE IF NOT EXISTS servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  direcao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  icon TEXT DEFAULT 'FileTextIcon',
  requisitos TEXT[] DEFAULT '{}',
  documentos TEXT[] DEFAULT '{}',
  horario TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  contacto TEXT NOT NULL,
  email TEXT NOT NULL,
  prazo TEXT NOT NULL,
  taxa TEXT NOT NULL,
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  digital BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  requests INTEGER DEFAULT 0,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_servicos_direcao ON servicos(direcao);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicos_ativo ON servicos(ativo);
CREATE INDEX IF NOT EXISTS idx_servicos_ordem ON servicos(ordem);

-- Enable Row Level Security
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active services" ON servicos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Admins can manage all services" ON servicos
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_servicos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_servicos_updated_at
  BEFORE UPDATE ON servicos
  FOR EACH ROW
  EXECUTE FUNCTION update_servicos_updated_at();

-- Insert sample services if table is empty
INSERT INTO servicos (title, description, direcao, categoria, icon, requisitos, documentos, horario, localizacao, contacto, email, prazo, taxa, prioridade, digital, ordem) VALUES
(
  'Registo de Nascimento',
  'Registo oficial de nascimento de crianças no município',
  'Departamento Administrativo',
  'Documentação',
  'FileTextIcon',
  ARRAY['Certidão médica de nascimento', 'Bilhete de identidade dos pais', 'Comprovativo de residência'],
  ARRAY['Formulário de registo de nascimento', 'Declaração de paternidade'],
  'Segunda a Sexta: 8h00 - 15h00',
  'Edifício Administrativo Municipal',
  '+244 123 456 789',
  'admin@chipindo.gov.ao',
  '5 dias úteis',
  'Gratuito',
  'alta',
  FALSE,
  1
),
(
  'Bilhete de Identidade',
  'Emissão de bilhete de identidade para cidadãos',
  'Departamento Administrativo',
  'Documentação',
  'UserIcon',
  ARRAY['Certidão de nascimento', 'Fotografia 3x4', 'Comprovativo de residência'],
  ARRAY['Formulário de pedido de BI', 'Declaração de residência'],
  'Segunda a Sexta: 8h00 - 15h00',
  'Edifício Administrativo Municipal',
  '+244 123 456 789',
  'admin@chipindo.gov.ao',
  '15 dias úteis',
  '5.000 Kz',
  'alta',
  FALSE,
  2
),
(
  'Licença de Construção',
  'Autorização para construção de edifícios',
  'Departamento de Obras Públicas',
  'Licenciamento',
  'HammerIcon',
  ARRAY['Plano de construção', 'Comprovativo de propriedade', 'Estudo de impacto ambiental'],
  ARRAY['Formulário de licença', 'Planta do terreno', 'Especificações técnicas'],
  'Segunda a Sexta: 8h00 - 15h00',
  'Departamento de Obras Públicas',
  '+244 123 456 790',
  'obras@chipindo.gov.ao',
  '30 dias úteis',
  '25.000 Kz',
  'media',
  FALSE,
  3
),
(
  'Matrícula Escolar',
  'Inscrição de alunos nas escolas municipais',
  'Departamento de Educação',
  'Educação',
  'GraduationCapIcon',
  ARRAY['Certidão de nascimento', 'Cartão de vacinação', 'Comprovativo de residência'],
  ARRAY['Formulário de matrícula', 'Declaração de responsabilidade'],
  'Segunda a Sexta: 8h00 - 15h00',
  'Departamento de Educação',
  '+244 123 456 791',
  'educacao@chipindo.gov.ao',
  '3 dias úteis',
  'Gratuito',
  'alta',
  FALSE,
  4
),
(
  'Consulta Médica',
  'Agendamento de consultas médicas',
  'Departamento de Saúde',
  'Saúde',
  'HeartIcon',
  ARRAY['Bilhete de identidade', 'Cartão de utente'],
  ARRAY['Formulário de agendamento'],
  'Segunda a Sexta: 8h00 - 16h00',
  'Centro de Saúde Municipal',
  '+244 123 456 792',
  'saude@chipindo.gov.ao',
  '1 dia útil',
  'Gratuito',
  'alta',
  FALSE,
  5
),
(
  'Licença Comercial',
  'Autorização para atividade comercial',
  'Departamento de Finanças',
  'Licenciamento',
  'DollarSignIcon',
  ARRAY['Bilhete de identidade', 'Comprovativo de residência', 'Plano de negócio'],
  ARRAY['Formulário de licença comercial', 'Declaração de responsabilidade'],
  'Segunda a Sexta: 8h00 - 15h00',
  'Departamento de Finanças',
  '+244 123 456 793',
  'financas@chipindo.gov.ao',
  '10 dias úteis',
  '15.000 Kz',
  'media',
  FALSE,
  6
)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT SELECT ON servicos TO anon;
GRANT ALL ON servicos TO authenticated; 