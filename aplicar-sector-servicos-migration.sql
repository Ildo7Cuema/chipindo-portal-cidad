-- Script para aplicar migração de setor_id na tabela servicos
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna setor_id
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE SET NULL;

-- 2. Criar índice para setor_id
CREATE INDEX IF NOT EXISTS idx_servicos_setor_id ON servicos(setor_id);

-- 3. Atualizar serviços existentes para vincular com setores
UPDATE servicos 
SET setor_id = (
  SELECT id 
  FROM setores_estrategicos 
  WHERE nome = servicos.categoria
)
WHERE setor_id IS NULL;

-- 4. Adicionar política RLS para setor_id
DROP POLICY IF EXISTS "Users can view services by setor" ON servicos;
CREATE POLICY "Users can view services by setor" ON servicos
  FOR SELECT USING (
    setor_id IN (
      SELECT id FROM setores_estrategicos WHERE ativo = true
    )
  );

-- 5. Verificar resultados
SELECT 
  s.title,
  s.categoria,
  s.setor_id,
  se.nome as setor_nome
FROM servicos s
LEFT JOIN setores_estrategicos se ON s.setor_id = se.id
LIMIT 10;

-- 6. Contar serviços por setor
SELECT 
  se.nome as setor,
  COUNT(s.id) as total_servicos,
  COUNT(CASE WHEN s.ativo = true THEN 1 END) as servicos_ativos
FROM setores_estrategicos se
LEFT JOIN servicos s ON se.id = s.setor_id
GROUP BY se.id, se.nome
ORDER BY se.nome; 