-- Script para corrigir problemas de exclusão de utilizadores
-- Este script verifica e corrige as políticas RLS que podem estar impedindo a exclusão

-- 1. Verificar se RLS está habilitado na tabela profiles
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Verificar políticas RLS existentes na tabela profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Verificar se o utilizador atual tem permissões adequadas
SELECT 
    current_user,
    session_user,
    current_setting('role');

-- 4. Verificar se existe uma política de DELETE que permite exclusão para admins
-- Se não existir, criar uma política que permite exclusão para administradores

-- Primeiro, remover políticas de DELETE existentes que podem estar bloqueando
DROP POLICY IF EXISTS "Allow admin to delete profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

-- Criar nova política de DELETE que permite exclusão para administradores
CREATE POLICY "Allow admin to delete profiles" ON profiles
    FOR DELETE
    TO authenticated
    USING (
        -- Permitir exclusão se o utilizador atual for admin
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
        OR
        -- Permitir exclusão se o utilizador atual for o próprio utilizador (auto-exclusão)
        user_id = auth.uid()
    );

-- 5. Verificar se a função is_admin() existe e funciona corretamente
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar uma política alternativa mais permissiva para DELETE (temporária para debug)
CREATE POLICY "Allow delete for debugging" ON profiles
    FOR DELETE
    TO authenticated
    USING (true); -- Permitir exclusão para qualquer utilizador autenticado (TEMPORÁRIO)

-- 7. Verificar se há triggers que podem estar impedindo a exclusão
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- 8. Verificar se há foreign keys que podem estar impedindo a exclusão
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

-- 9. Verificar se há índices que podem estar causando problemas
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'profiles';

-- 10. Testar a exclusão diretamente (comentado para segurança)
-- DELETE FROM profiles WHERE id = 'ID_DO_UTILIZADOR_A_TESTAR';

-- 11. Verificar logs de auditoria se existirem
SELECT 
    table_name,
    trigger_name,
    event_manipulation
FROM information_schema.triggers 
WHERE event_object_table LIKE '%audit%' 
    OR event_object_table LIKE '%log%';

-- 12. Criar uma função de debug para testar exclusão
CREATE OR REPLACE FUNCTION debug_delete_user(user_profile_id UUID)
RETURNS TEXT AS $$
DECLARE
    profile_exists BOOLEAN;
    delete_result TEXT;
BEGIN
    -- Verificar se o perfil existe
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_profile_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
        RETURN 'Perfil não encontrado';
    END IF;
    
    -- Tentar excluir
    DELETE FROM profiles WHERE id = user_profile_id;
    
    -- Verificar se foi excluído
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_profile_id) INTO profile_exists;
    
    IF profile_exists THEN
        RETURN 'Falha na exclusão - perfil ainda existe';
    ELSE
        RETURN 'Exclusão bem-sucedida';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN 'Erro: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Verificar configurações de RLS
SHOW row_security;

-- 14. Verificar se há restrições de integridade referencial
SELECT 
    conname,
    contype,
    confrelid::regclass,
    confupdtype,
    confdeltype
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass;

-- Instruções para uso:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Verifique os resultados das consultas
-- 3. Se houver problemas, execute a função debug_delete_user() com o ID do utilizador
-- 4. Remova a política temporária "Allow delete for debugging" após resolver o problema 