-- Migração para adicionar suporte a acesso por setor
-- Execute este script no seu banco de dados Supabase

-- 1. Adicionar coluna setor_id à tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE SET NULL;

-- 2. Atualizar a constraint de role para incluir os novos roles por setor
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

ALTER TABLE profiles ADD CONSTRAINT profile_role_check 
CHECK (role IS NULL OR role IN ('user', 'editor', 'admin', 'educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua'));

-- 3. Criar índice para melhorar performance de consultas por setor
CREATE INDEX IF NOT EXISTS idx_profiles_setor_id ON profiles(setor_id);

-- 4. Criar função para verificar acesso por setor
CREATE OR REPLACE FUNCTION check_sector_access(user_role TEXT, requested_sector_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Administradores e editores têm acesso a todos os setores
    IF user_role IN ('admin', 'editor') THEN
        RETURN TRUE;
    END IF;
    
    -- Utilizadores de setor específico só têm acesso ao seu setor
    IF user_role IN ('educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua') THEN
        -- Verificar se o setor solicitado corresponde ao role do utilizador
        DECLARE
            user_sector_id UUID;
        BEGIN
            SELECT id INTO user_sector_id
            FROM setores_estrategicos
            WHERE slug = user_role;
            
            RETURN user_sector_id = requested_sector_id;
        END;
    END IF;
    
    -- Utilizadores básicos não têm acesso a setores específicos
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar função para obter o setor do utilizador
CREATE OR REPLACE FUNCTION get_user_sector(user_role TEXT)
RETURNS UUID AS $$
BEGIN
    -- Se o role é de um setor específico, retornar o ID do setor
    IF user_role IN ('educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua') THEN
        RETURN (
            SELECT id
            FROM setores_estrategicos
            WHERE slug = user_role
        );
    END IF;
    
    -- Para outros roles, retornar NULL
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Adicionar comentários às funções
COMMENT ON FUNCTION check_sector_access IS 'Verifica se um utilizador tem acesso a um setor específico';
COMMENT ON FUNCTION get_user_sector IS 'Obtém o ID do setor associado ao role do utilizador';

-- 7. Verificar se a migração foi aplicada com sucesso
SELECT 'Migração aplicada com sucesso!' as status; 