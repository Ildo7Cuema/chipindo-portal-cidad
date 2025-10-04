-- Corrigir constraint da coluna manifestacao_id
-- Tornar manifestacao_id opcional e adicionar constraint para garantir integridade

-- Remover constraint NOT NULL da coluna manifestacao_id
ALTER TABLE ouvidoria_forward_logs 
ALTER COLUMN manifestacao_id DROP NOT NULL;

-- Adicionar constraint para garantir que pelo menos uma das colunas seja preenchida
-- (manifestacao_id para ouvidoria OU request_id para solicitações de serviços)
ALTER TABLE ouvidoria_forward_logs 
ADD CONSTRAINT check_manifestacao_or_request 
CHECK (
  (manifestacao_id IS NOT NULL AND request_id IS NULL) OR 
  (manifestacao_id IS NULL AND request_id IS NOT NULL)
);

-- Verificar a estrutura atualizada da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ouvidoria_forward_logs' 
ORDER BY ordinal_position;

-- Verificar as constraints da tabela
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'ouvidoria_forward_logs'::regclass; 