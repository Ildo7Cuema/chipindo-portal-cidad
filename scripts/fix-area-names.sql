-- Script para padronizar nomes das áreas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar áreas atuais
SELECT 'Áreas atuais no banco:' as info;
SELECT DISTINCT unnest(areas_of_interest) as area
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}'
ORDER BY area;

-- 2. Padronizar "Setor de Saúde" para "Saúde"
UPDATE interest_registrations 
SET areas_of_interest = array_replace(areas_of_interest, 'Setor de Saúde', 'Saúde')
WHERE areas_of_interest @> ARRAY['Setor de Saúde'];

-- 3. Padronizar "Administração Pública" para "Administração"
UPDATE interest_registrations 
SET areas_of_interest = array_replace(areas_of_interest, 'Administração Pública', 'Administração')
WHERE areas_of_interest @> ARRAY['Administração Pública'];

-- 4. Padronizar "Tecnologias de Informação" para "Tecnologia"
UPDATE interest_registrations 
SET areas_of_interest = array_replace(areas_of_interest, 'Tecnologias de Informação', 'Tecnologia')
WHERE areas_of_interest @> ARRAY['Tecnologias de Informação'];

-- 5. Verificar resultado
SELECT 'Áreas após padronização:' as info;
SELECT DISTINCT unnest(areas_of_interest) as area
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}'
ORDER BY area;

-- 6. Verificar registros com "Saúde"
SELECT 'Registros com área "Saúde":' as info;
SELECT 
    full_name,
    email,
    areas_of_interest,
    created_at
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Saúde']
ORDER BY created_at DESC;

-- 7. Contar registros por área
SELECT 'Contagem por área:' as info;
SELECT 
    unnest(areas_of_interest) as area,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}'
GROUP BY unnest(areas_of_interest)
ORDER BY quantidade DESC;

SELECT 'Script concluído!' as resultado; 