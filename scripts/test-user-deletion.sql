-- Script para testar a funcionalidade de exclusão de utilizadores
-- Execute este script após aplicar as correções RLS

-- 1. Verificar se as funções foram criadas corretamente
SELECT '=== VERIFICANDO FUNÇÕES ===' as info;

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name IN ('debug_delete_user', 'delete_user_complete', 'is_admin')
ORDER BY routine_name;

-- 2. Verificar se as políticas RLS foram criadas
SELECT '=== VERIFICANDO POLÍTICAS RLS ===' as info;

SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 3. Testar a função is_admin() com utilizador atual
SELECT '=== TESTANDO FUNÇÃO IS_ADMIN ===' as info;

SELECT 
    auth.uid() as current_user_id,
    is_admin() as is_admin_result;

-- 4. Verificar utilizadores existentes para teste
SELECT '=== UTILIZADORES DISPONÍVEIS PARA TESTE ===' as info;

SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Criar utilizador de teste (se necessário)
-- Descomente as linhas abaixo se quiser criar um utilizador de teste
/*
INSERT INTO profiles (user_id, email, full_name, role, setor_id)
VALUES (
    gen_random_uuid(),
    'teste.exclusao@chipindo.gov.ao',
    'Utilizador Teste Exclusão',
    'user',
    NULL
) ON CONFLICT (email) DO NOTHING;

SELECT 'Utilizador de teste criado ou já existia' as resultado;
*/

-- 6. Testar função de debug (substitua o ID pelo ID real de um utilizador)
-- Descomente e substitua o ID para testar
/*
SELECT '=== TESTANDO FUNÇÃO DEBUG_DELETE_USER ===' as info;
SELECT debug_delete_user('ID_DO_UTILIZADOR_A_TESTAR');
*/

-- 7. Testar função completa (substitua o ID pelo ID real de um utilizador)
-- Descomente e substitua o ID para testar
/*
SELECT '=== TESTANDO FUNÇÃO DELETE_USER_COMPLETE ===' as info;
SELECT delete_user_complete('ID_DO_UTILIZADOR_A_TESTAR');
*/

-- 8. Verificar configurações de segurança
SELECT '=== CONFIGURAÇÕES DE SEGURANÇA ===' as info;

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- Verificar configuração de RLS
SHOW row_security;

-- 9. Verificar permissões do utilizador atual
SELECT '=== PERMISSÕES DO UTILIZADOR ATUAL ===' as info;

SELECT 
    current_user,
    session_user,
    current_setting('role') as current_role;

-- 10. Verificar se há triggers que podem interferir
SELECT '=== TRIGGERS NA TABELA PROFILES ===' as info;

SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- 11. Verificar foreign keys
SELECT '=== FOREIGN KEYS ===' as info;

SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='profiles';

-- 12. Instruções para teste manual
SELECT '=== INSTRUÇÕES PARA TESTE MANUAL ===' as info;

-- Para testar manualmente:
-- 1. Copie um ID de utilizador da consulta #4
-- 2. Descomente as linhas #6 ou #7
-- 3. Substitua 'ID_DO_UTILIZADOR_A_TESTAR' pelo ID real
-- 4. Execute a consulta

-- Exemplo:
-- SELECT debug_delete_user('12345678-1234-1234-1234-123456789012');

-- 13. Verificar logs de auditoria (se existirem)
SELECT '=== LOGS DE AUDITORIA ===' as info;

SELECT 
    table_name,
    trigger_name,
    event_manipulation
FROM information_schema.triggers 
WHERE event_object_table LIKE '%audit%' 
    OR event_object_table LIKE '%log%';

-- 14. Resumo do teste
SELECT '=== RESUMO DO TESTE ===' as info;

SELECT 
    'Funções criadas' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'debug_delete_user') 
        AND EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'delete_user_complete')
        AND EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_admin')
        THEN '✅ OK'
        ELSE '❌ FALTANDO'
    END as status
UNION ALL
SELECT 
    'Políticas RLS' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND cmd = 'DELETE')
        THEN '✅ OK'
        ELSE '❌ FALTANDO'
    END as status
UNION ALL
SELECT 
    'RLS habilitado' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true)
        THEN '✅ OK'
        ELSE '❌ FALTANDO'
    END as status;

-- 15. Próximos passos
SELECT '=== PRÓXIMOS PASSOS ===' as info;

SELECT 
    '1. Execute este script para verificar se tudo está configurado corretamente' as passo,
    '2. Se tudo estiver OK, teste a exclusão no frontend' as acao
UNION ALL
SELECT 
    '3. Abra o console do navegador (F12)' as passo,
    '4. Tente excluir um utilizador e verifique os logs' as acao
UNION ALL
SELECT 
    '5. Se houver problemas, execute as funções de debug' as passo,
    '6. Verifique as mensagens de erro e ajuste conforme necessário' as acao; 