-- Criação das tabelas para Setores Estratégicos
-- Portal Cidadão de Chipindo

-- Tabela principal dos setores estratégicos
CREATE TABLE IF NOT EXISTS setores_estrategicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  descricao TEXT,
  visao TEXT,
  missao TEXT,
  cor_primaria VARCHAR(7) DEFAULT '#3B82F6',
  cor_secundaria VARCHAR(7) DEFAULT '#1E40AF',
  icone VARCHAR(50),
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estatísticas dos setores
CREATE TABLE IF NOT EXISTS setores_estatisticas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  valor VARCHAR(50) NOT NULL,
  icone VARCHAR(50),
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de programas dos setores
CREATE TABLE IF NOT EXISTS setores_programas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  beneficios JSONB DEFAULT '[]',
  requisitos JSONB DEFAULT '[]',
  contacto VARCHAR(200),
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de oportunidades dos setores
CREATE TABLE IF NOT EXISTS setores_oportunidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  requisitos JSONB DEFAULT '[]',
  beneficios JSONB DEFAULT '[]',
  prazo DATE,
  vagas INTEGER DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de infraestruturas dos setores
CREATE TABLE IF NOT EXISTS setores_infraestruturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
  nome VARCHAR(200) NOT NULL,
  localizacao VARCHAR(200),
  capacidade VARCHAR(100),
  estado VARCHAR(50) DEFAULT 'Operacional',
  equipamentos JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contactos dos setores
CREATE TABLE IF NOT EXISTS setores_contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
  endereco TEXT,
  telefone VARCHAR(50),
  email VARCHAR(100),
  horario VARCHAR(100),
  responsavel VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_setores_estrategicos_slug ON setores_estrategicos(slug);
CREATE INDEX IF NOT EXISTS idx_setores_estrategicos_ativo ON setores_estrategicos(ativo);
CREATE INDEX IF NOT EXISTS idx_setores_estrategicos_ordem ON setores_estrategicos(ordem);

CREATE INDEX IF NOT EXISTS idx_setores_estatisticas_setor_id ON setores_estatisticas(setor_id);
CREATE INDEX IF NOT EXISTS idx_setores_programas_setor_id ON setores_programas(setor_id);
CREATE INDEX IF NOT EXISTS idx_setores_oportunidades_setor_id ON setores_oportunidades(setor_id);
CREATE INDEX IF NOT EXISTS idx_setores_infraestruturas_setor_id ON setores_infraestruturas(setor_id);
CREATE INDEX IF NOT EXISTS idx_setores_contactos_setor_id ON setores_contactos(setor_id);

-- Função para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_setores_estrategicos_updated_at 
    BEFORE UPDATE ON setores_estrategicos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_estatisticas_updated_at 
    BEFORE UPDATE ON setores_estatisticas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_programas_updated_at 
    BEFORE UPDATE ON setores_programas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_oportunidades_updated_at 
    BEFORE UPDATE ON setores_oportunidades 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_infraestruturas_updated_at 
    BEFORE UPDATE ON setores_infraestruturas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setores_contactos_updated_at 
    BEFORE UPDATE ON setores_contactos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 