-- Script para aplicar todas as migrações do setor de Turismo e Meio Ambiente
-- Execute este script no SQL Editor do Supabase

-- 1. Aplicar migração do setor de Turismo e Meio Ambiente
-- Execute o conteúdo do arquivo: migracao-turismo-final.sql

-- 2. Aplicar migração do carrossel de turismo
-- Execute o conteúdo do arquivo: supabase/migrations/20250725000013-create-turismo-carousel.sql

-- 3. Verificar se tudo foi criado corretamente
SELECT 'Verificando migrações...' as status;

-- Verificar se o setor foi criado
SELECT 
  'Setor criado' as tipo,
  nome,
  slug,
  ativo
FROM setores_estrategicos 
WHERE slug = 'turismo-meio-ambiente';

-- Verificar se a tabela do carrossel foi criada
SELECT 
  'Tabela carrossel' as tipo,
  table_name
FROM information_schema.tables 
WHERE table_name = 'turismo_ambiente_carousel';

-- Verificar se o bucket foi criado
SELECT 
  'Bucket criado' as tipo,
  id,
  name,
  public
FROM storage.buckets 
WHERE id = 'turismo-ambiente';

-- Verificar dados do carrossel
SELECT 
  'Dados carrossel' as tipo,
  COUNT(*) as total_imagens
FROM turismo_ambiente_carousel;

-- Verificar estatísticas do setor
SELECT 
  'Estatísticas' as tipo,
  COUNT(*) as total_estatisticas
FROM setores_estatisticas 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

-- Verificar programas do setor
SELECT 
  'Programas' as tipo,
  COUNT(*) as total_programas
FROM setores_programas 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

-- Verificar oportunidades do setor
SELECT 
  'Oportunidades' as tipo,
  COUNT(*) as total_oportunidades
FROM setores_oportunidades 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

-- Verificar infraestruturas do setor
SELECT 
  'Infraestruturas' as tipo,
  COUNT(*) as total_infraestruturas
FROM setores_infraestruturas 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

-- Verificar contactos do setor
SELECT 
  'Contactos' as tipo,
  COUNT(*) as total_contactos
FROM setores_contactos 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

SELECT 'Verificação concluída!' as resultado; 