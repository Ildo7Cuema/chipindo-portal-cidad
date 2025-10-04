-- Adicionar campo request_id à tabela ouvidoria_forward_logs
-- Para suportar reencaminhamento de solicitações de serviços

-- Adicionar coluna request_id (opcional, para solicitações de serviços)
ALTER TABLE ouvidoria_forward_logs 
ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE;

-- Criar índice para o novo campo
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_request_id ON ouvidoria_forward_logs(request_id);

-- Atualizar comentário da tabela para refletir o novo propósito
COMMENT ON TABLE ouvidoria_forward_logs IS 'Logs de reencaminhamento para manifestações da ouvidoria e solicitações de serviços';

-- Verificar se a tabela foi atualizada corretamente
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ouvidoria_forward_logs' 
ORDER BY ordinal_position; 