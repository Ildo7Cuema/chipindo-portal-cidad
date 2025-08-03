-- Script final corrigido para filtros por área
-- Execute este script no Supabase SQL Editor

-- 1. Verificar situação atual
SELECT 'Situação atual:' as info;
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN areas_of_interest IS NULL THEN 1 END) as sem_areas,
    COUNT(CASE WHEN areas_of_interest = '{}' THEN 1 END) as array_vazio
FROM interest_registrations;

-- 2. Mostrar áreas existentes (versão corrigida)
SELECT 'Áreas existentes:' as info;
SELECT DISTINCT unnest(areas_of_interest) as area
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}'
ORDER BY area;

-- 3. Contar áreas únicas (versão corrigida)
SELECT 'Contagem de áreas:' as info;
WITH area_counts AS (
    SELECT unnest(areas_of_interest) as area
    FROM interest_registrations 
    WHERE areas_of_interest IS NOT NULL 
      AND areas_of_interest != '{}'
)
SELECT COUNT(DISTINCT area) as total_areas_unicas
FROM area_counts;

-- 4. Corrigir registros NULL
UPDATE interest_registrations 
SET areas_of_interest = ARRAY['Programa'] 
WHERE areas_of_interest IS NULL;

-- 5. Corrigir arrays vazios
UPDATE interest_registrations 
SET areas_of_interest = ARRAY['Programa'] 
WHERE areas_of_interest = '{}';

-- 6. Verificar resultado
SELECT 'Após correção:' as info;
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN areas_of_interest IS NULL THEN 1 END) as sem_areas,
    COUNT(CASE WHEN areas_of_interest = '{}' THEN 1 END) as array_vazio
FROM interest_registrations;

-- 7. Testar filtros
SELECT 'Teste de filtros:' as info;
SELECT 'Agricultura' as area, COUNT(*) as registros
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Agricultura']

UNION ALL

SELECT 'Educação' as area, COUNT(*) as registros
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Educação']

UNION ALL

SELECT 'Saúde' as area, COUNT(*) as registros
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Saúde']

UNION ALL

SELECT 'Tecnologia' as area, COUNT(*) as registros
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Tecnologia']

UNION ALL

SELECT 'Programa' as area, COUNT(*) as registros
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Programa'];

-- 8. Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_interest_registrations_areas 
ON interest_registrations USING GIN (areas_of_interest);

SELECT 'Script concluído com sucesso!' as resultado; 