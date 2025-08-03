-- Script robusto para corrigir problemas com filtros por área
-- Esta versão trata melhor os diferentes tipos de arrays vazios

-- 1. Verificar registros sem áreas de interesse (versão robusta)
SELECT 
    'Registros sem áreas' as tipo,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NULL 
   OR areas_of_interest = '{}' 
   OR array_length(areas_of_interest, 1) IS NULL
   OR array_length(areas_of_interest, 1) = 0;

-- 2. Verificar áreas únicas existentes
SELECT 
    'Áreas únicas' as tipo,
    COUNT(DISTINCT unnest(areas_of_interest)) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0;

-- 3. Mostrar todas as áreas únicas
SELECT DISTINCT unnest(areas_of_interest) as area
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0
ORDER BY area;

-- 4. Corrigir registros sem áreas (versão robusta)
UPDATE interest_registrations 
SET areas_of_interest = ARRAY['Programa'] 
WHERE areas_of_interest IS NULL 
   OR areas_of_interest = '{}' 
   OR array_length(areas_of_interest, 1) IS NULL
   OR array_length(areas_of_interest, 1) = 0;

-- 5. Padronizar nomes das áreas (corrigir maiúsculas/minúsculas)
UPDATE interest_registrations 
SET areas_of_interest = ARRAY(
    SELECT CASE 
        WHEN unnest(areas_of_interest) ILIKE 'agricultura' THEN 'Agricultura'
        WHEN unnest(areas_of_interest) ILIKE 'educação' OR unnest(areas_of_interest) ILIKE 'educacao' THEN 'Educação'
        WHEN unnest(areas_of_interest) ILIKE 'saúde' OR unnest(areas_of_interest) ILIKE 'saude' THEN 'Saúde'
        WHEN unnest(areas_of_interest) ILIKE 'tecnologia' THEN 'Tecnologia'
        WHEN unnest(areas_of_interest) ILIKE 'cultura' THEN 'Cultura'
        WHEN unnest(areas_of_interest) ILIKE 'turismo' THEN 'Turismo'
        WHEN unnest(areas_of_interest) ILIKE 'meio ambiente' THEN 'Meio Ambiente'
        WHEN unnest(areas_of_interest) ILIKE 'desenvolvimento económico' OR unnest(areas_of_interest) ILIKE 'desenvolvimento economico' THEN 'Desenvolvimento Económico'
        WHEN unnest(areas_of_interest) ILIKE 'energia e água' OR unnest(areas_of_interest) ILIKE 'energia e agua' THEN 'Energia e Água'
        WHEN unnest(areas_of_interest) ILIKE 'sector mineiro' THEN 'Sector Mineiro'
        WHEN unnest(areas_of_interest) ILIKE 'programa' THEN 'Programa'
        ELSE unnest(areas_of_interest)
    END
)
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0;

-- 6. Remover duplicatas dentro do mesmo array
UPDATE interest_registrations 
SET areas_of_interest = ARRAY(
    SELECT DISTINCT unnest(areas_of_interest)
    ORDER BY unnest(areas_of_interest)
)
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0;

-- 7. Verificar resultado final
SELECT 
    'Registros corrigidos' as tipo,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0

UNION ALL

SELECT 
    'Áreas finais' as tipo,
    COUNT(DISTINCT unnest(areas_of_interest)) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0;

-- 8. Mostrar áreas finais
SELECT DISTINCT unnest(areas_of_interest) as area
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND array_length(areas_of_interest, 1) > 0
ORDER BY area;

-- 9. Testar filtros por área específica
-- Agricultura
SELECT 
    'Agricultura' as area_teste,
    COUNT(*) as registros_encontrados
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Agricultura']

UNION ALL

-- Educação
SELECT 
    'Educação' as area_teste,
    COUNT(*) as registros_encontrados
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Educação']

UNION ALL

-- Saúde
SELECT 
    'Saúde' as area_teste,
    COUNT(*) as registros_encontrados
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Saúde']

UNION ALL

-- Tecnologia
SELECT 
    'Tecnologia' as area_teste,
    COUNT(*) as registros_encontrados
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Tecnologia']

UNION ALL

-- Programa
SELECT 
    'Programa' as area_teste,
    COUNT(*) as registros_encontrados
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Programa'];

-- 10. Criar índices para melhorar performance dos filtros
CREATE INDEX IF NOT EXISTS idx_interest_registrations_areas 
ON interest_registrations USING GIN (areas_of_interest);

CREATE INDEX IF NOT EXISTS idx_interest_registrations_created_at 
ON interest_registrations (created_at DESC);

-- 11. Verificar índices criados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'interest_registrations'; 