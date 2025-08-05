-- Script para corrigir políticas RLS e permitir exclusão de utilizadores
-- Execute este script no Supabase SQL Editor

-- 1. Verificar estado atual das políticas
SELECT '=== POLÍTICAS ATUAIS ===' as info;
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 2. Remover políticas de DELETE existentes que podem estar bloqueando
DROP POLICY IF EXISTS "Allow admin to delete profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "Allow delete for debugging" ON profiles;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON profiles;

-- 3. Criar política de DELETE que permite exclusão para administradores
CREATE POLICY "profiles_delete_policy" ON profiles
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

-- 4. Verificar se a função is_admin() existe e funciona corretamente
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

-- 5. Criar função de debug para testar exclusão
CREATE OR REPLACE FUNCTION debug_delete_user(user_profile_id UUID)
RETURNS TEXT AS $$
DECLARE
    profile_exists BOOLEAN;
    current_user_role TEXT;
    delete_result TEXT;
BEGIN
    -- Verificar se o perfil existe
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_profile_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
        RETURN 'Perfil não encontrado';
    END IF;
    
    -- Verificar role do utilizador atual
    SELECT role INTO current_user_role FROM profiles WHERE user_id = auth.uid();
    
    -- Tentar excluir
    DELETE FROM profiles WHERE id = user_profile_id;
    
    -- Verificar se foi excluído
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = user_profile_id) INTO profile_exists;
    
    IF profile_exists THEN
        RETURN 'Falha na exclusão - perfil ainda existe. Role atual: ' || COALESCE(current_user_role, 'null');
    ELSE
        RETURN 'Exclusão bem-sucedida';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN 'Erro: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar função para excluir utilizador com verificação completa
CREATE OR REPLACE FUNCTION delete_user_complete(user_profile_id UUID)
RETURNS JSON AS $$
DECLARE
    profile_data RECORD;
    auth_deleted BOOLEAN := false;
    profile_deleted BOOLEAN := false;
    result JSON;
BEGIN
    -- Buscar dados do perfil
    SELECT user_id, email, full_name INTO profile_data 
    FROM profiles 
    WHERE id = user_profile_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Perfil não encontrado'
        );
    END IF;
    
    -- Excluir perfil
    DELETE FROM profiles WHERE id = user_profile_id;
    
    IF FOUND THEN
        profile_deleted := true;
    END IF;
    
    -- Tentar excluir do auth (pode falhar por permissões)
    BEGIN
        -- Nota: Esta função requer permissões de admin no Supabase
        -- Se falhar, o utilizador permanecerá no auth mas sem perfil
        PERFORM auth.admin.delete_user(profile_data.user_id);
        auth_deleted := true;
    EXCEPTION WHEN OTHERS THEN
        auth_deleted := false;
    END;
    
    -- Retornar resultado
    result := json_build_object(
        'success', profile_deleted,
        'profile_deleted', profile_deleted,
        'auth_deleted', auth_deleted,
        'user_email', profile_data.email,
        'message', CASE 
            WHEN profile_deleted AND auth_deleted THEN 'Utilizador excluído completamente'
            WHEN profile_deleted AND NOT auth_deleted THEN 'Perfil excluído, mas utilizador pode permanecer no auth'
            ELSE 'Falha na exclusão'
        END
    );
    
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'message', 'Erro: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Verificar se há triggers que podem estar interferindo
SELECT '=== TRIGGERS NA TABELA PROFILES ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- 8. Verificar foreign keys
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

-- 9. Verificar políticas após correção
SELECT '=== POLÍTICAS APÓS CORREÇÃO ===' as info;
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 10. Testar função de debug (comentado - descomente para testar)
-- SELECT debug_delete_user('ID_DO_UTILIZADOR_A_TESTAR');

-- 11. Verificar configurações de RLS
SELECT '=== CONFIGURAÇÕES RLS ===' as info;
SHOW row_security;

-- Instruções de uso:
-- 1. Execute este script completo no Supabase SQL Editor
-- 2. Verifique os resultados das consultas
-- 3. Se houver problemas, use a função debug_delete_user() para testar
-- 4. Para exclusão completa, use a função delete_user_complete()
-- 5. Teste a exclusão no frontend após aplicar as correções 