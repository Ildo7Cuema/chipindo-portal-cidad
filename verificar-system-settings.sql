-- Script para verificar a tabela system_settings
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT 
  'Tabela existe' as status,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'system_settings';

-- 2. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'system_settings'
ORDER BY ordinal_position;

-- 3. Verificar quantos registros existem
SELECT 
  'Total de registros' as tipo,
  COUNT(*) as total
FROM system_settings;

-- 4. Verificar dados existentes
SELECT 
  id,
  site_name,
  maintenance_mode,
  created_at,
  updated_at
FROM system_settings
LIMIT 5;

-- 5. Verificar se há múltiplos registros (pode causar o erro)
SELECT 
  'Registros duplicados' as tipo,
  COUNT(*) as total_registros
FROM system_settings;

-- 6. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'system_settings';

-- 7. Testar a query que está falhando
SELECT 
  'Teste da query' as tipo,
  maintenance_mode
FROM system_settings
LIMIT 1; 