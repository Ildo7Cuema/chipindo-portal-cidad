-- Script de teste para verificar a configuração da tabela news_likes
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT 
  table_name,
  CASE 
    WHEN table_name = 'news_likes' THEN '✅ Tabela existe'
    ELSE '❌ Tabela não existe'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'news_likes';

-- 2. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'news_likes'
ORDER BY ordinal_position;

-- 3. Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS habilitado'
    ELSE '❌ RLS desabilitado'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'news_likes';

-- 4. Verificar políticas RLS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'news_likes';

-- 5. Verificar se há dados na tabela
SELECT 
  COUNT(*) as total_likes,
  COUNT(DISTINCT news_id) as unique_news,
  COUNT(DISTINCT user_id) as unique_users
FROM news_likes;

-- 6. Verificar curtidas por tipo de usuário
SELECT 
  CASE 
    WHEN user_id = 'anonymous' THEN 'Público'
    ELSE 'Autenticado'
  END as user_type,
  COUNT(*) as likes_count
FROM news_likes 
GROUP BY user_type;

-- 7. Testar inserção de curtida pública
INSERT INTO news_likes (news_id, user_id) 
VALUES ('00000000-0000-0000-0000-000000000000', 'anonymous')
ON CONFLICT (news_id, user_id) DO NOTHING;

-- 8. Verificar se a inserção funcionou
SELECT 
  'Teste de inserção' as test,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Inserção funcionou'
    ELSE '❌ Inserção falhou'
  END as status
FROM news_likes 
WHERE news_id = '00000000-0000-0000-0000-000000000000' AND user_id = 'anonymous';

-- 9. Limpar dados de teste
DELETE FROM news_likes 
WHERE news_id = '00000000-0000-0000-0000-000000000000' AND user_id = 'anonymous';

-- 10. Resumo final
SELECT 
  'Configuração da tabela news_likes' as summary,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_likes') THEN '✅ Tabela criada'
    ELSE '❌ Tabela não criada'
  END as table_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_likes') THEN '✅ Políticas configuradas'
    ELSE '❌ Políticas não configuradas'
  END as policies_status; 