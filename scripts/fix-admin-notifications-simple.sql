-- Script SIMPLES para resolver o problema de admin_notifications
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar tabela admin_notifications se não existir
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Allow authenticated insert" ON admin_notifications;
DROP POLICY IF EXISTS "Allow authenticated select" ON admin_notifications;
DROP POLICY IF EXISTS "Allow authenticated update" ON admin_notifications;
DROP POLICY IF EXISTS "Allow authenticated delete" ON admin_notifications;
DROP POLICY IF EXISTS "Allow service function insert" ON admin_notifications;
DROP POLICY IF EXISTS "Allow trigger insert" ON admin_notifications;

-- 4. Criar política para usuários autenticados inserirem
CREATE POLICY "Allow authenticated insert" ON admin_notifications
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- 5. Criar política para usuários autenticados verem tudo
CREATE POLICY "Allow authenticated select" ON admin_notifications
  FOR SELECT 
  TO authenticated
  USING (true);

-- 6. Criar política para usuários autenticados editarem
CREATE POLICY "Allow authenticated update" ON admin_notifications
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Criar política para usuários autenticados deletarem
CREATE POLICY "Allow authenticated delete" ON admin_notifications
  FOR DELETE 
  TO authenticated
  USING (true);

-- 8. Criar política para service_role inserir (para triggers)
CREATE POLICY "Allow service function insert" ON admin_notifications
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- 9. Criar política para postgres inserir (para triggers)
CREATE POLICY "Allow trigger insert" ON admin_notifications
  FOR INSERT 
  TO postgres
  WITH CHECK (true);

-- 10. Conceder permissões EXPLÍCITAS
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON admin_notifications TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON admin_notifications TO service_role;
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON admin_notifications TO postgres;

-- 11. Verificar se funcionou
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'admin_notifications';

-- 12. Verificar políticas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'admin_notifications';

-- 13. Verificar permissões da tabela
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'admin_notifications'; 