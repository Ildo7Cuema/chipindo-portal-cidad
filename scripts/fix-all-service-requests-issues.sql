-- Script COMPLETO para resolver todos os problemas de service_requests
-- Execute este script no SQL Editor do Supabase Dashboard

-- ========================================
-- 1. CORRIGIR TABELA service_requests
-- ========================================

-- Criar tabela service_requests se não existir
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

-- ========================================
-- 2. CORRIGIR RLS (Row Level Security)
-- ========================================

-- Habilitar RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Public can create service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can view all service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can update service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins can delete service requests" ON service_requests;
DROP POLICY IF EXISTS "Allow public insert" ON service_requests;
DROP POLICY IF EXISTS "Allow anonymous insert" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated insert" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated select" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON service_requests;
DROP POLICY IF EXISTS "Allow authenticated delete" ON service_requests;

-- Criar políticas CORRETAS
CREATE POLICY "Allow anonymous insert" ON service_requests
  FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON service_requests
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select" ON service_requests
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update" ON service_requests
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON service_requests
  FOR DELETE 
  TO authenticated
  USING (true);

-- ========================================
-- 3. CORRIGIR TRIGGER admin_notifications
-- ========================================

-- Remover trigger e função antigos
DROP TRIGGER IF EXISTS notify_admin_service_request_trigger ON service_requests;
DROP FUNCTION IF EXISTS notify_admin_service_request();

-- Criar função CORRIGIDA (sem coluna priority)
CREATE OR REPLACE FUNCTION notify_admin_service_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir notificação para admin (sem a coluna priority)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_notifications') THEN
    INSERT INTO admin_notifications (
      title,
      message,
      type,
      data
    ) VALUES (
      'Nova Solicitação de Serviço',
      'Nova solicitação recebida para: ' || NEW.service_name,
      'service_request',
      jsonb_build_object(
        'request_id', NEW.id,
        'service_name', NEW.service_name,
        'requester_name', NEW.requester_name,
        'requester_email', NEW.requester_email,
        'subject', NEW.subject,
        'priority', NEW.priority
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar trigger
CREATE TRIGGER notify_admin_service_request_trigger
  AFTER INSERT ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_service_request();

-- ========================================
-- 4. CONCEDER PERMISSÕES
-- ========================================

-- Conceder permissões explícitas
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON service_requests TO anon;
GRANT ALL ON service_requests TO authenticated;

-- ========================================
-- 5. VERIFICAR RESULTADOS
-- ========================================

-- Verificar se a tabela existe
SELECT 
  'Tabela service_requests' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_requests') 
    THEN '✅ Existe' 
    ELSE '❌ Não existe' 
  END as status;

-- Verificar políticas RLS
SELECT 
  'Políticas RLS' as item,
  COUNT(*) || ' políticas criadas' as status
FROM pg_policies 
WHERE tablename = 'service_requests';

-- Verificar trigger
SELECT 
  'Trigger admin_notifications' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'notify_admin_service_request_trigger') 
    THEN '✅ Existe' 
    ELSE '❌ Não existe' 
  END as status;

-- Verificar permissões
SELECT 
  'Permissões anon' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_name = 'service_requests' AND grantee = 'anon') 
    THEN '✅ Concedidas' 
    ELSE '❌ Não concedidas' 
  END as status;

SELECT 
  'Permissões authenticated' as item,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_name = 'service_requests' AND grantee = 'authenticated') 
    THEN '✅ Concedidas' 
    ELSE '❌ Não concedidas' 
  END as status; 