-- Criar tabela de manifestações da ouvidoria
CREATE TABLE IF NOT EXISTS ouvidoria_manifestacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  protocolo VARCHAR(20) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  categoria VARCHAR(50) NOT NULL,
  assunto VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'respondido', 'resolvido', 'arquivado')),
  prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_resposta TIMESTAMP WITH TIME ZONE,
  resposta TEXT,
  avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5),
  comentario_avaliacao TEXT,
  anexos TEXT[],
  departamento_responsavel VARCHAR(100),
  tempo_resposta INTEGER, -- em horas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de estatísticas da ouvidoria
CREATE TABLE IF NOT EXISTS ouvidoria_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_manifestacoes INTEGER DEFAULT 0,
  pendentes INTEGER DEFAULT 0,
  respondidas INTEGER DEFAULT 0,
  resolvidas INTEGER DEFAULT 0,
  tempo_medio_resposta DECIMAL(5,2) DEFAULT 0,
  satisfacao_geral DECIMAL(3,2) DEFAULT 0,
  categorias_mais_comuns JSONB DEFAULT '[]',
  ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias da ouvidoria
CREATE TABLE IF NOT EXISTS ouvidoria_categorias (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  cor VARCHAR(20) DEFAULT 'bg-blue-500',
  bg_color VARCHAR(100) DEFAULT 'bg-blue-50 text-blue-700 border-blue-200',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO ouvidoria_categorias (id, nome, descricao, cor, bg_color) VALUES
  ('reclamacao', 'Reclamação', 'Reclamações sobre serviços ou atendimento', 'bg-red-500', 'bg-red-50 text-red-700 border-red-200'),
  ('sugestao', 'Sugestão', 'Sugestões para melhorias', 'bg-green-500', 'bg-green-50 text-green-700 border-green-200'),
  ('elogio', 'Elogio', 'Elogios sobre serviços', 'bg-blue-500', 'bg-blue-50 text-blue-700 border-blue-200'),
  ('denuncia', 'Denúncia', 'Denúncias sobre irregularidades', 'bg-orange-500', 'bg-orange-50 text-orange-700 border-orange-200'),
  ('solicitacao', 'Solicitação', 'Solicitações de informações', 'bg-purple-500', 'bg-purple-50 text-purple-700 border-purple-200')
ON CONFLICT (id) DO NOTHING;

-- Inserir dados iniciais de estatísticas
INSERT INTO ouvidoria_stats (total_manifestacoes, pendentes, respondidas, resolvidas, tempo_medio_resposta, satisfacao_geral, categorias_mais_comuns) VALUES
  (156, 23, 89, 44, 2.5, 4.2, '["reclamacao", "sugestao", "solicitacao"]')
ON CONFLICT DO NOTHING;

-- Inserir manifestações de exemplo
INSERT INTO ouvidoria_manifestacoes (protocolo, nome, email, telefone, categoria, assunto, descricao, status, prioridade, departamento_responsavel) VALUES
  ('OUV-2024-001', 'João Silva', 'joao.silva@email.com', '+244 912 345 678', 'reclamacao', 'Problema com iluminação pública', 'A iluminação pública na rua principal está com problemas há mais de uma semana. Isso está causando insegurança na comunidade.', 'pendente', 'media', 'Obras Públicas'),
  ('OUV-2024-002', 'Maria Santos', 'maria.santos@email.com', '+244 923 456 789', 'sugestao', 'Sugestão para parque infantil', 'Sugiro a construção de um parque infantil no bairro central. Seria muito benéfico para as crianças da comunidade.', 'em_analise', 'baixa', 'Urbanismo'),
  ('OUV-2024-003', 'Pedro Costa', 'pedro.costa@email.com', '+244 934 567 890', 'elogio', 'Elogio ao atendimento da prefeitura', 'Gostaria de elogiar o excelente atendimento recebido na prefeitura. O funcionário foi muito atencioso e resolveu meu problema rapidamente.', 'resolvido', 'baixa', 'Atendimento'),
  ('OUV-2024-004', 'Ana Oliveira', 'ana.oliveira@email.com', '+244 945 678 901', 'denuncia', 'Denúncia sobre lixo acumulado', 'Há lixo acumulado há mais de uma semana na esquina da rua das Flores. Isso está causando mau cheiro e pode atrair animais.', 'respondido', 'alta', 'Serviços Urbanos'),
  ('OUV-2024-005', 'Carlos Ferreira', 'carlos.ferreira@email.com', '+244 956 789 012', 'solicitacao', 'Solicitação de informações sobre projetos', 'Gostaria de obter informações sobre os projetos de infraestrutura previstos para este ano no município.', 'resolvido', 'media', 'Planejamento')
ON CONFLICT (protocolo) DO NOTHING;

-- Atualizar algumas manifestações com respostas e avaliações
UPDATE ouvidoria_manifestacoes SET 
  data_resposta = NOW() - INTERVAL '1 day',
  resposta = 'Obrigado pelo elogio! Ficamos felizes em saber que nosso atendimento foi satisfatório.',
  avaliacao = 5,
  comentario_avaliacao = 'Excelente atendimento!',
  tempo_resposta = 24
WHERE protocolo = 'OUV-2024-003';

UPDATE ouvidoria_manifestacoes SET 
  data_resposta = NOW() - INTERVAL '2 days',
  resposta = 'Sua denúncia foi registrada e nossa equipe de limpeza urbana será enviada para resolver o problema.',
  tempo_resposta = 48
WHERE protocolo = 'OUV-2024-004';

UPDATE ouvidoria_manifestacoes SET 
  data_resposta = NOW() - INTERVAL '3 days',
  resposta = 'Informações enviadas por email. Os projetos incluem melhoria da rede de água, pavimentação de vias e construção de escolas.',
  avaliacao = 4,
  comentario_avaliacao = 'Resposta rápida e completa',
  tempo_resposta = 72
WHERE protocolo = 'OUV-2024-005';

-- Criar funções para gerenciar manifestações
CREATE OR REPLACE FUNCTION create_manifestacao(
  p_nome VARCHAR,
  p_email VARCHAR,
  p_telefone VARCHAR,
  p_categoria VARCHAR,
  p_assunto VARCHAR,
  p_descricao TEXT
) RETURNS JSONB AS $$
DECLARE
  v_protocolo VARCHAR;
  v_manifestacao_id UUID;
  v_result JSONB;
BEGIN
  -- Gerar protocolo único
  SELECT 'OUV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(COUNT(*)::TEXT, 3, '0')
  INTO v_protocolo
  FROM ouvidoria_manifestacoes
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  -- Inserir manifestação
  INSERT INTO ouvidoria_manifestacoes (
    protocolo, nome, email, telefone, categoria, assunto, descricao
  ) VALUES (
    v_protocolo, p_nome, p_email, p_telefone, p_categoria, p_assunto, p_descricao
  ) RETURNING id INTO v_manifestacao_id;
  
  -- Retornar resultado
  SELECT jsonb_build_object(
    'success', true,
    'protocolo', v_protocolo,
    'id', v_manifestacao_id,
    'message', 'Manifestação criada com sucesso'
  ) INTO v_result;
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para listar manifestações
CREATE OR REPLACE FUNCTION get_manifestacoes(
  p_search VARCHAR DEFAULT NULL,
  p_categoria VARCHAR DEFAULT NULL,
  p_status VARCHAR DEFAULT NULL,
  p_sort_by VARCHAR DEFAULT 'data_abertura',
  p_sort_order VARCHAR DEFAULT 'desc',
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_where TEXT := 'WHERE 1=1';
  v_order TEXT;
BEGIN
  -- Construir WHERE clause
  IF p_search IS NOT NULL AND p_search != '' THEN
    v_where := v_where || ' AND (assunto ILIKE ''%' || p_search || '%'' OR nome ILIKE ''%' || p_search || '%'' OR protocolo ILIKE ''%' || p_search || '%'')';
  END IF;
  
  IF p_categoria IS NOT NULL AND p_categoria != 'all' THEN
    v_where := v_where || ' AND categoria = ''' || p_categoria || '''';
  END IF;
  
  IF p_status IS NOT NULL AND p_status != 'all' THEN
    v_where := v_where || ' AND status = ''' || p_status || '''';
  END IF;
  
  -- Construir ORDER BY
  v_order := 'ORDER BY ' || p_sort_by || ' ' || p_sort_order;
  
  -- Executar query
  EXECUTE 'SELECT jsonb_agg(
    jsonb_build_object(
      ''id'', id,
      ''protocolo'', protocolo,
      ''nome'', nome,
      ''email'', email,
      ''telefone'', telefone,
      ''categoria'', categoria,
      ''assunto'', assunto,
      ''descricao'', descricao,
      ''status'', status,
      ''prioridade'', prioridade,
      ''data_abertura'', data_abertura,
      ''data_resposta'', data_resposta,
      ''resposta'', resposta,
      ''avaliacao'', avaliacao,
      ''comentario_avaliacao'', comentario_avaliacao,
      ''anexos'', anexos,
      ''departamento_responsavel'', departamento_responsavel,
      ''tempo_resposta'', tempo_resposta
    )
  ) FROM ouvidoria_manifestacoes ' || v_where || ' ' || v_order || ' LIMIT ' || p_limit || ' OFFSET ' || p_offset
  INTO v_result;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar status de manifestação
CREATE OR REPLACE FUNCTION update_manifestacao_status(
  p_id UUID,
  p_status VARCHAR,
  p_resposta TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  UPDATE ouvidoria_manifestacoes SET 
    status = p_status,
    data_resposta = CASE WHEN p_resposta IS NOT NULL THEN NOW() ELSE data_resposta END,
    resposta = COALESCE(p_resposta, resposta),
    updated_at = NOW()
  WHERE id = p_id;
  
  IF FOUND THEN
    SELECT jsonb_build_object(
      'success', true,
      'message', 'Status atualizado com sucesso'
    ) INTO v_result;
  ELSE
    SELECT jsonb_build_object(
      'success', false,
      'error', 'Manifestação não encontrada'
    ) INTO v_result;
  END IF;
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para avaliar manifestação
CREATE OR REPLACE FUNCTION rate_manifestacao(
  p_id UUID,
  p_avaliacao INTEGER,
  p_comentario TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  UPDATE ouvidoria_manifestacoes SET 
    avaliacao = p_avaliacao,
    comentario_avaliacao = p_comentario,
    updated_at = NOW()
  WHERE id = p_id;
  
  IF FOUND THEN
    SELECT jsonb_build_object(
      'success', true,
      'message', 'Avaliação registrada com sucesso'
    ) INTO v_result;
  ELSE
    SELECT jsonb_build_object(
      'success', false,
      'error', 'Manifestação não encontrada'
    ) INTO v_result;
  END IF;
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter estatísticas da ouvidoria
CREATE OR REPLACE FUNCTION get_ouvidoria_stats() RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_total INTEGER;
  v_pendentes INTEGER;
  v_respondidas INTEGER;
  v_resolvidas INTEGER;
  v_tempo_medio DECIMAL;
  v_satisfacao DECIMAL;
  v_categorias JSONB;
BEGIN
  -- Calcular estatísticas
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'pendente'),
    COUNT(*) FILTER (WHERE status IN ('respondido', 'resolvido')),
    COUNT(*) FILTER (WHERE status = 'resolvido'),
    AVG(tempo_resposta) FILTER (WHERE tempo_resposta IS NOT NULL),
    AVG(avaliacao) FILTER (WHERE avaliacao IS NOT NULL)
  INTO v_total, v_pendentes, v_respondidas, v_resolvidas, v_tempo_medio, v_satisfacao
  FROM ouvidoria_manifestacoes;
  
  -- Obter categorias mais comuns
  SELECT jsonb_agg(categoria ORDER BY count DESC)
  INTO v_categorias
  FROM (
    SELECT categoria, COUNT(*) as count
    FROM ouvidoria_manifestacoes
    GROUP BY categoria
    ORDER BY count DESC
    LIMIT 5
  ) subq;
  
  -- Construir resultado
  SELECT jsonb_build_object(
    'total_manifestacoes', COALESCE(v_total, 0),
    'pendentes', COALESCE(v_pendentes, 0),
    'respondidas', COALESCE(v_respondidas, 0),
    'resolvidas', COALESCE(v_resolvidas, 0),
    'tempo_medio_resposta', COALESCE(v_tempo_medio, 0),
    'satisfacao_geral', COALESCE(v_satisfacao, 0),
    'categorias_mais_comuns', COALESCE(v_categorias, '[]'::JSONB)
  ) INTO v_result;
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter categorias
CREATE OR REPLACE FUNCTION get_ouvidoria_categorias() RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', nome,
      'description', descricao,
      'color', cor,
      'bgColor', bg_color
    )
  )
  INTO v_result
  FROM ouvidoria_categorias
  WHERE ativo = true
  ORDER BY nome;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar RLS policies
ALTER TABLE ouvidoria_manifestacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ouvidoria_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ouvidoria_categorias ENABLE ROW LEVEL SECURITY;

-- Policies para ouvidoria_manifestacoes
CREATE POLICY "Permitir leitura pública de manifestações" ON ouvidoria_manifestacoes
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de manifestações" ON ouvidoria_manifestacoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização por admins" ON ouvidoria_manifestacoes
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Policies para ouvidoria_stats
CREATE POLICY "Permitir leitura pública de estatísticas" ON ouvidoria_stats
  FOR SELECT USING (true);

CREATE POLICY "Permitir atualização por admins" ON ouvidoria_stats
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Policies para ouvidoria_categorias
CREATE POLICY "Permitir leitura pública de categorias" ON ouvidoria_categorias
  FOR SELECT USING (true);

CREATE POLICY "Permitir atualização por admins" ON ouvidoria_categorias
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ouvidoria_manifestacoes_status ON ouvidoria_manifestacoes(status);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_manifestacoes_categoria ON ouvidoria_manifestacoes(categoria);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_manifestacoes_data_abertura ON ouvidoria_manifestacoes(data_abertura);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_manifestacoes_protocolo ON ouvidoria_manifestacoes(protocolo);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_manifestacoes_search ON ouvidoria_manifestacoes USING gin(to_tsvector('portuguese', assunto || ' ' || nome || ' ' || protocolo)); 