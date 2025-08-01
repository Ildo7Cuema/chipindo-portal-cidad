-- Script para limpar dados existentes do setor de Turismo e Meio Ambiente
-- Execute este script apenas se quiser remover dados existentes e recomeçar

-- 1. Verificar se o setor existe
SELECT 'Verificando dados existentes...' as status;

SELECT 
  'Setor existente' as tipo,
  nome,
  slug,
  ativo
FROM setores_estrategicos 
WHERE slug = 'turismo-meio-ambiente';

-- 2. Se quiser limpar, descomente as linhas abaixo:

/*
-- Limpar dados relacionados (descomente se necessário)
DELETE FROM setores_contactos 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

DELETE FROM setores_infraestruturas 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

DELETE FROM setores_oportunidades 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

DELETE FROM setores_programas 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

DELETE FROM setores_estatisticas 
WHERE setor_id = (SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente');

-- Limpar o setor principal
DELETE FROM setores_estrategicos 
WHERE slug = 'turismo-meio-ambiente';

SELECT 'Dados limpos com sucesso!' as resultado;
*/ 