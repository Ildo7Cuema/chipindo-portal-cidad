-- Script para desabilitar RLS temporariamente (APENAS PARA TESTE)
-- ⚠️ ATENÇÃO: Use apenas para teste, não para produção!

-- 1. Criar tabela se não existir
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_direction TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Desabilitar RLS temporariamente
ALTER TABLE service_requests DISABLE ROW LEVEL SECURITY;

-- 3. Conceder todas as permissões
GRANT ALL ON service_requests TO anon;
GRANT ALL ON service_requests TO authenticated;

-- 4. Verificar
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'service_requests';

-- 5. Verificar se RLS está desabilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'service_requests';

-- ⚠️ LEMBRE-SE: Reabilitar RLS depois do teste com:
-- ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY; 