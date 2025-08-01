-- Script completo para aplicar todas as migrações necessárias
-- Execute este script no SQL Editor do Supabase

-- 1. Aplicar migração da tabela system_settings
-- Execute o conteúdo do arquivo: aplicar-system-settings.sql

-- 2. Aplicar migração do setor de Turismo e Meio Ambiente
-- Execute o conteúdo do arquivo: migracao-turismo-final.sql

-- 3. Aplicar migração do carrossel de turismo
-- Execute o conteúdo do arquivo: supabase/migrations/20250725000013-create-turismo-carousel.sql

-- 4. Verificar se todas as tabelas foram criadas
SELECT 'Verificando todas as migrações...' as status;

-- Verificar system_settings
SELECT 
  'system_settings' as tabela,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_settings') 
    THEN 'CRIADA' 
    ELSE 'NÃO CRIADA' 
  END as status
FROM information_schema.tables 
WHERE table_name = 'system_settings';

-- Verificar setores_estrategicos
SELECT 
  'setores_estrategicos' as tabela,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'setores_estrategicos') 
    THEN 'CRIADA' 
    ELSE 'NÃO CRIADA' 
  END as status
FROM information_schema.tables 
WHERE table_name = 'setores_estrategicos';

-- Verificar turismo_ambiente_carousel
SELECT 
  'turismo_ambiente_carousel' as tabela,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'turismo_ambiente_carousel') 
    THEN 'CRIADA' 
    ELSE 'NÃO CRIADA' 
  END as status
FROM information_schema.tables 
WHERE table_name = 'turismo_ambiente_carousel';

-- 5. Verificar dados do setor de turismo
SELECT 
  'Setor Turismo' as tipo,
  nome,
  slug,
  ativo
FROM setores_estrategicos 
WHERE slug = 'turismo-meio-ambiente';

-- 6. Verificar dados do carrossel
SELECT 
  'Carrossel Turismo' as tipo,
  COUNT(*) as total_imagens
FROM turismo_ambiente_carousel;

-- 7. Verificar configurações do sistema
SELECT 
  'System Settings' as tipo,
  site_name,
  maintenance_mode,
  created_at
FROM system_settings
LIMIT 1;

SELECT 'Verificação completa!' as resultado; 