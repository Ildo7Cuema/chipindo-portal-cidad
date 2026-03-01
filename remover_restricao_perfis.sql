-- ============================================================
-- SCRIPT: Remover Restrição Fixa de Perfis
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- Remover a restrição (constraint) fixa que obriga o 'role' a ser apenas 'admin', 'editor' ou 'user'.
-- Como os perfis de novos setores são gerados dinamicamente com base no slug,
-- precisamos que a coluna 'role' suporte estes novos perfis.

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profile_role_check' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT profile_role_check;
    END IF;
END $$;

-- Opcional: Para garantir que os dados não ficam caóticos se houver erro manual,
-- poderíamos futuramente vincular o 'role' diretamente aos slugs da tabela 'setores_estrategicos',
-- mas remover a restrição já resolve o erro imediato 
-- ("Database error creating new user") que estava a barrar a Edge Function.
