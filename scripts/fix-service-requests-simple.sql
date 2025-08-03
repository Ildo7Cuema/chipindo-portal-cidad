-- Script SIMPLES para resolver o problema de service_requests
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar tabela service_requests se não existir
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

-- 2. Habilitar RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public can create service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can view all service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can update service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can delete service requests" ON service_requests;
DROP POLICY IF EXISTS "Allow public insert" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated select" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated delete" ON service_requests;

-- 4. Criar política SIMPLES para permitir inserção pública (ANÔNIMA)
CREATE POLICY "Allow anonymous insert" ON service_requests
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 5. Criar política para usuários autenticados inserirem
CREATE POLICY "Allow authenticated insert" ON service_requests
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- 6. Criar política para usuários autenticados verem tudo
CREATE POLICY "Allow authenticated select" ON service_requests
  FOR SELECT 
  TO authenticated
  USING (true);

-- 7. Criar política para usuários autenticados editarem
CREATE POLICY "Allow authenticated update" ON service_requests
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 8. Criar política para usuários autenticados deletarem
CREATE POLICY "Allow authenticated delete" ON service_requests
  FOR DELETE 
  TO authenticated
  USING (true);

-- 9. Conceder permissões EXPLÍCITAS
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON service_requests TO anon;
GRANT ALL ON service_requests TO authenticated;

-- 10. Verificar se funcionou
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'service_requests';

-- 11. Verificar políticas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'service_requests';

-- 12. Verificar permissões da tabela
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'service_requests'; 