-- Remover a restrição (constraint) fixa que obriga o 'role' a ser apenas 'admin', 'editor' ou 'user'.
-- Agora as roles de gestão dos novos setores são dinâmicas baseadas no slug (por exemplo: 'aniesa', 'infraestrutura').
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
