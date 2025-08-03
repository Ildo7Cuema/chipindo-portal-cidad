-- Script para verificar dados de exportação
-- Execute este script no Supabase SQL Editor

-- 1. Verificar total de registros
SELECT 'Total de registros:' as info, COUNT(*) as quantidade
FROM interest_registrations;

-- 2. Verificar registros por área
SELECT 'Registros por área:' as info;
SELECT 
    unnest(areas_of_interest) as area,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}'
GROUP BY unnest(areas_of_interest)
ORDER BY quantidade DESC;

-- 3. Verificar registros com "Saúde"
SELECT 'Registros com "Saúde":' as info;
SELECT 
    full_name,
    email,
    areas_of_interest,
    created_at
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Saúde']
ORDER BY created_at DESC;

-- 4. Verificar registros com "saúde" (minúsculo)
SELECT 'Registros com "saúde" (minúsculo):' as info;
SELECT 
    full_name,
    email,
    areas_of_interest,
    created_at
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['saúde']
ORDER BY created_at DESC;

-- 5. Verificar registros que contêm "saúde" em qualquer variação
SELECT 'Registros que contêm "saúde" (qualquer variação):' as info;
SELECT 
    full_name,
    email,
    areas_of_interest,
    created_at
FROM interest_registrations 
WHERE EXISTS (
    SELECT 1 
    FROM unnest(areas_of_interest) AS area 
    WHERE area ILIKE '%saúde%'
)
ORDER BY created_at DESC;

-- 6. Verificar estrutura dos dados
SELECT 'Estrutura dos dados:' as info;
SELECT 
    'Registros com areas_of_interest NULL' as tipo,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NULL

UNION ALL

SELECT 
    'Registros com areas_of_interest vazio' as tipo,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest = '{}'

UNION ALL

SELECT 
    'Registros com areas_of_interest válido' as tipo,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}';

-- 7. Mostrar exemplos de registros
SELECT 'Exemplos de registros:' as info;
SELECT 
    full_name,
    email,
    areas_of_interest,
    phone,
    profession,
    terms_accepted,
    created_at
FROM interest_registrations 
ORDER BY created_at DESC
LIMIT 5;

-- 8. Verificar se há problemas com caracteres especiais
SELECT 'Verificando caracteres especiais:' as info;
SELECT 
    unnest(areas_of_interest) as area,
    COUNT(*) as quantidade
FROM interest_registrations 
WHERE areas_of_interest IS NOT NULL 
  AND areas_of_interest != '{}'
  AND (unnest(areas_of_interest) LIKE '%ã%' 
       OR unnest(areas_of_interest) LIKE '%ç%' 
       OR unnest(areas_of_interest) LIKE '%é%')
GROUP BY unnest(areas_of_interest)
ORDER BY area; 