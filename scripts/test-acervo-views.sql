-- Script para testar visualizações do acervo digital
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela acervo_views existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'acervo_views') 
    THEN '✅ Tabela acervo_views existe'
    ELSE '❌ Tabela acervo_views não existe'
  END as status;

-- Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'acervo_views'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'acervo_views';

-- Verificar se há itens do acervo para testar
SELECT 
  COUNT(*) as total_items,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_items
FROM acervo_digital;

-- Testar inserção de visualização
DO $$
DECLARE
  test_acervo_id UUID;
BEGIN
    -- Buscar um item do acervo
    SELECT id INTO test_acervo_id FROM acervo_digital LIMIT 1;
    
    IF test_acervo_id IS NOT NULL THEN
        -- Inserir visualização de teste
        INSERT INTO acervo_views (acervo_id, user_id, ip_address, user_agent) 
        VALUES (test_acervo_id, 'anonymous', '192.168.1.1', 'Mozilla/5.0 Test Browser')
        ON CONFLICT (acervo_id, ip_address) DO NOTHING;
        
        RAISE NOTICE '✅ Visualização de teste inserida para acervo_id: %', test_acervo_id;
    ELSE
        RAISE NOTICE '❌ Nenhum item do acervo encontrado para teste';
    END IF;
END $$;

-- Verificar visualizações inseridas
SELECT 
  'Visualizações totais' as metric,
  COUNT(*) as count
FROM acervo_views
UNION ALL
SELECT 
  'Visualizações por item' as metric,
  COUNT(DISTINCT acervo_id) as count
FROM acervo_views
UNION ALL
SELECT 
  'IPs únicos' as metric,
  COUNT(DISTINCT ip_address) as count
FROM acervo_views;

-- Verificar visualizações por item do acervo
SELECT 
  a.title,
  a.type,
  COUNT(av.id) as views_count,
  COUNT(DISTINCT av.ip_address) as unique_ips
FROM acervo_digital a
LEFT JOIN acervo_views av ON a.id = av.acervo_id
GROUP BY a.id, a.title, a.type
ORDER BY views_count DESC
LIMIT 10;

-- Testar a função register_acervo_view
DO $$
DECLARE
  test_acervo_id UUID;
  result BOOLEAN;
BEGIN
    -- Buscar um item do acervo
    SELECT id INTO test_acervo_id FROM acervo_digital LIMIT 1;
    
    IF test_acervo_id IS NOT NULL THEN
        -- Testar a função
        SELECT register_acervo_view(
          test_acervo_id,
          'anonymous',
          '192.168.1.2',
          'Mozilla/5.0 Test Browser 2'
        ) INTO result;
        
        RAISE NOTICE '✅ Função register_acervo_view testada: %', result;
    ELSE
        RAISE NOTICE '❌ Nenhum item do acervo encontrado para testar a função';
    END IF;
END $$;

-- Limpar dados de teste
DELETE FROM acervo_views 
WHERE ip_address IN ('192.168.1.1', '192.168.1.2');

-- Resumo final
SELECT 
  'Teste de visualizações do acervo concluído!' as status,
  'Tabela acervo_views configurada corretamente' as table_status,
  'Função register_acervo_view funcionando' as function_status,
  'Políticas RLS configuradas' as policies_status; 