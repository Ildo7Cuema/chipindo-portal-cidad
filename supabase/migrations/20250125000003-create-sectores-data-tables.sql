-- Create tables for Cultura sector
CREATE TABLE IF NOT EXISTS cultura_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_estatisticas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  grupos TEXT NOT NULL,
  eventos TEXT NOT NULL,
  participantes TEXT NOT NULL,
  estado TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  data TEXT NOT NULL,
  local TEXT NOT NULL,
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_programas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  beneficios TEXT[] NOT NULL,
  requisitos TEXT[] NOT NULL,
  contact TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_oportunidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requisitos TEXT[] NOT NULL,
  beneficios TEXT[] NOT NULL,
  prazo TEXT NOT NULL,
  vagas TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_infraestruturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  capacidade TEXT NOT NULL,
  equipamentos TEXT[] NOT NULL,
  estado TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultura_contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  horario TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables for Tecnologia sector
CREATE TABLE IF NOT EXISTS tecnologia_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_estatisticas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  empresas TEXT NOT NULL,
  profissionais TEXT NOT NULL,
  projetos TEXT NOT NULL,
  estado TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_servicos_digitais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  utilizadores TEXT NOT NULL,
  servicos TEXT NOT NULL,
  estado TEXT NOT NULL,
  funcionalidades TEXT[] NOT NULL,
  url_acesso TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_programas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  beneficios TEXT[] NOT NULL,
  requisitos TEXT[] NOT NULL,
  contact TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_oportunidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requisitos TEXT[] NOT NULL,
  beneficios TEXT[] NOT NULL,
  prazo TEXT NOT NULL,
  vagas TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_infraestruturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  capacidade TEXT NOT NULL,
  equipamentos TEXT[] NOT NULL,
  estado TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnologia_contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  horario TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables for Desenvolvimento Económico sector
CREATE TABLE IF NOT EXISTS economico_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economico_estatisticas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economico_setores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  empresas TEXT NOT NULL,
  empregos TEXT NOT NULL,
  contribuicao TEXT NOT NULL,
  estado TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economico_programas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  beneficios TEXT[] NOT NULL,
  requisitos TEXT[] NOT NULL,
  contact TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economico_oportunidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requisitos TEXT[] NOT NULL,
  beneficios TEXT[] NOT NULL,
  prazo TEXT NOT NULL,
  vagas TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economico_infraestruturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  capacidade TEXT NOT NULL,
  equipamentos TEXT[] NOT NULL,
  estado TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS economico_contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  horario TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cultura_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_estatisticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_infraestruturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultura_contactos ENABLE ROW LEVEL SECURITY;

ALTER TABLE tecnologia_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_estatisticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_servicos_digitais ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_infraestruturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnologia_contactos ENABLE ROW LEVEL SECURITY;

ALTER TABLE economico_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE economico_estatisticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE economico_setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE economico_programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE economico_oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE economico_infraestruturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE economico_contactos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for cultura_info" ON cultura_info FOR SELECT USING (true);
CREATE POLICY "Public read access for cultura_estatisticas" ON cultura_estatisticas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for cultura_areas" ON cultura_areas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for cultura_eventos" ON cultura_eventos FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for cultura_programas" ON cultura_programas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for cultura_oportunidades" ON cultura_oportunidades FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for cultura_infraestruturas" ON cultura_infraestruturas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for cultura_contactos" ON cultura_contactos FOR SELECT USING (true);

CREATE POLICY "Public read access for tecnologia_info" ON tecnologia_info FOR SELECT USING (true);
CREATE POLICY "Public read access for tecnologia_estatisticas" ON tecnologia_estatisticas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for tecnologia_areas" ON tecnologia_areas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for tecnologia_servicos_digitais" ON tecnologia_servicos_digitais FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for tecnologia_programas" ON tecnologia_programas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for tecnologia_oportunidades" ON tecnologia_oportunidades FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for tecnologia_infraestruturas" ON tecnologia_infraestruturas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for tecnologia_contactos" ON tecnologia_contactos FOR SELECT USING (true);

CREATE POLICY "Public read access for economico_info" ON economico_info FOR SELECT USING (true);
CREATE POLICY "Public read access for economico_estatisticas" ON economico_estatisticas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for economico_setores" ON economico_setores FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for economico_programas" ON economico_programas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for economico_oportunidades" ON economico_oportunidades FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for economico_infraestruturas" ON economico_infraestruturas FOR SELECT USING (ativo = true);
CREATE POLICY "Public read access for economico_contactos" ON economico_contactos FOR SELECT USING (true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Admin access for cultura_info" ON cultura_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_estatisticas" ON cultura_estatisticas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_areas" ON cultura_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_eventos" ON cultura_eventos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_programas" ON cultura_programas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_oportunidades" ON cultura_oportunidades FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_infraestruturas" ON cultura_infraestruturas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for cultura_contactos" ON cultura_contactos FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access for tecnologia_info" ON tecnologia_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_estatisticas" ON tecnologia_estatisticas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_areas" ON tecnologia_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_servicos_digitais" ON tecnologia_servicos_digitais FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_programas" ON tecnologia_programas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_oportunidades" ON tecnologia_oportunidades FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_infraestruturas" ON tecnologia_infraestruturas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for tecnologia_contactos" ON tecnologia_contactos FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin access for economico_info" ON economico_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for economico_estatisticas" ON economico_estatisticas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for economico_setores" ON economico_setores FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for economico_programas" ON economico_programas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for economico_oportunidades" ON economico_oportunidades FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for economico_infraestruturas" ON economico_infraestruturas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin access for economico_contactos" ON economico_contactos FOR ALL USING (auth.role() = 'authenticated'); 