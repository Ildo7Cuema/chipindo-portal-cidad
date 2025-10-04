-- Criar tabela para registrar logs de reencaminhamento de manifestações
CREATE TABLE IF NOT EXISTS ouvidoria_forward_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manifestacao_id UUID NOT NULL REFERENCES ouvidoria_manifestacoes(id) ON DELETE CASCADE,
  forward_type TEXT NOT NULL CHECK (forward_type IN ('sms', 'whatsapp')),
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  forwarded_by TEXT NOT NULL,
  forwarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_manifestacao_id ON ouvidoria_forward_logs(manifestacao_id);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_forwarded_at ON ouvidoria_forward_logs(forwarded_at);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_forward_type ON ouvidoria_forward_logs(forward_type);

-- Adicionar RLS (Row Level Security)
ALTER TABLE ouvidoria_forward_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir que administradores vejam todos os logs
CREATE POLICY "Administradores podem ver todos os logs de reencaminhamento" ON ouvidoria_forward_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users u 
      WHERE u.id = auth.uid() 
      AND u.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política para permitir que usuários vejam apenas logs de suas manifestações
CREATE POLICY "Usuários podem ver logs de suas manifestações" ON ouvidoria_forward_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ouvidoria_manifestacoes om
      WHERE om.id = ouvidoria_forward_logs.manifestacao_id
      AND om.user_id = auth.uid()
    )
  );

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_ouvidoria_forward_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER trigger_update_ouvidoria_forward_logs_updated_at
  BEFORE UPDATE ON ouvidoria_forward_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_ouvidoria_forward_logs_updated_at(); 