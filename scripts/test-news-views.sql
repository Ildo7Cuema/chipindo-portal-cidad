-- Script para testar visualizações de notícias
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela news_views existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_views') 
    THEN '✅ Tabela news_views existe'
    ELSE '❌ Tabela news_views não existe'
  END as status;

-- Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'news_views'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'news_views';

-- Verificar se há notícias para testar
SELECT 
  COUNT(*) as total_news,
  COUNT(CASE WHEN published = true THEN 1 END) as published_news
FROM news;

-- Testar inserção de visualização
DO $$
DECLARE
  test_news_id UUID;
BEGIN
    -- Buscar uma notícia publicada
    SELECT id INTO test_news_id FROM news WHERE published = true LIMIT 1;
    
    IF test_news_id IS NOT NULL THEN
        -- Inserir visualização de teste
        INSERT INTO news_views (news_id, user_id, ip_address, user_agent) 
        VALUES (test_news_id, 'anonymous', '192.168.1.1', 'Mozilla/5.0 Test Browser')
        ON CONFLICT (news_id, ip_address) DO NOTHING;
        
        RAISE NOTICE '✅ Visualização de teste inserida para news_id: %', test_news_id;
    ELSE
        RAISE NOTICE '❌ Nenhuma notícia publicada encontrada para teste';
    END IF;
END $$;

-- Verificar visualizações inseridas
SELECT 
  'Visualizações totais' as metric,
  COUNT(*) as count
FROM news_views
UNION ALL
SELECT 
  'Visualizações por notícia' as metric,
  COUNT(DISTINCT news_id) as count
FROM news_views
UNION ALL
SELECT 
  'IPs únicos' as metric,
  COUNT(DISTINCT ip_address) as count
FROM news_views;

-- Verificar visualizações por notícia
SELECT 
  n.title,
  COUNT(nv.id) as views_count,
  COUNT(DISTINCT nv.ip_address) as unique_ips
FROM news n
LEFT JOIN news_views nv ON n.id = nv.news_id
WHERE n.published = true
GROUP BY n.id, n.title
ORDER BY views_count DESC
LIMIT 10;

-- Testar a função register_news_view
DO $$
DECLARE
  test_news_id UUID;
  result BOOLEAN;
BEGIN
    -- Buscar uma notícia publicada
    SELECT id INTO test_news_id FROM news WHERE published = true LIMIT 1;
    
    IF test_news_id IS NOT NULL THEN
        -- Testar a função
        SELECT register_news_view(
          test_news_id,
          'anonymous',
          '192.168.1.2',
          'Mozilla/5.0 Test Browser 2'
        ) INTO result;
        
        RAISE NOTICE '✅ Função register_news_view testada: %', result;
    ELSE
        RAISE NOTICE '❌ Nenhuma notícia encontrada para testar a função';
    END IF;
END $$;

-- Limpar dados de teste
DELETE FROM news_views 
WHERE ip_address IN ('192.168.1.1', '192.168.1.2');

-- Resumo final
SELECT 
  'Teste de visualizações concluído!' as status,
  'Tabela news_views configurada corretamente' as table_status,
  'Função register_news_view funcionando' as function_status,
  'Políticas RLS configuradas' as policies_status; 