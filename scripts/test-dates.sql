-- Script para verificar datas dos registros
-- Execute este script no Supabase SQL Editor

-- 1. Verificar datas dos registros
SELECT 'Datas dos registros:' as info;
SELECT 
    full_name,
    areas_of_interest,
    created_at,
    DATE(created_at) as data_criacao
FROM interest_registrations 
ORDER BY created_at DESC;

-- 2. Verificar registros por período
SELECT 'Registros entre 2025-08-01 e 2025-08-02:' as info;
SELECT 
    full_name,
    areas_of_interest,
    created_at
FROM interest_registrations 
WHERE DATE(created_at) BETWEEN '2025-08-01' AND '2025-08-02'
ORDER BY created_at DESC;

-- 3. Verificar registros com "Saúde" no período
SELECT 'Registros com "Saúde" entre 2025-08-01 e 2025-08-02:' as info;
SELECT 
    full_name,
    areas_of_interest,
    created_at
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Saúde']
  AND DATE(created_at) BETWEEN '2025-08-01' AND '2025-08-02'
ORDER BY created_at DESC;

-- 4. Verificar todos os registros com "Saúde"
SELECT 'Todos os registros com "Saúde":' as info;
SELECT 
    full_name,
    areas_of_interest,
    created_at,
    DATE(created_at) as data_criacao
FROM interest_registrations 
WHERE areas_of_interest @> ARRAY['Saúde']
ORDER BY created_at DESC;

-- 5. Contar registros por data
SELECT 'Contagem por data:' as info;
SELECT 
    DATE(created_at) as data_criacao,
    COUNT(*) as quantidade
FROM interest_registrations 
GROUP BY DATE(created_at)
ORDER BY data_criacao DESC; 