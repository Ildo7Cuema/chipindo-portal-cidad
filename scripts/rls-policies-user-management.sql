-- =====================================================
-- RLS POLICIES PARA GESTÃO DE UTILIZADORES
-- =====================================================

-- Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES PARA ADMINISTRADORES
-- =====================================================

-- 1. Administradores podem visualizar todos os perfis
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 2. Administradores podem inserir novos perfis
CREATE POLICY "Admins can insert profiles" ON profiles
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 3. Administradores podem atualizar todos os perfis
CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. Administradores podem excluir perfis
CREATE POLICY "Admins can delete profiles" ON profiles
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- =====================================================
-- POLICIES PARA UTILIZADORES NORMAIS
-- =====================================================

-- 5. Utilizadores podem visualizar apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (
  user_id = auth.uid()
);

-- 6. Utilizadores podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (
  user_id = auth.uid()
);

-- =====================================================
-- POLICIES PARA UTILIZADORES DE SETORES ESPECÍFICOS
-- =====================================================

-- 7. Utilizadores de setores podem visualizar apenas seu próprio perfil
CREATE POLICY "Sector users can view own profile" ON profiles
FOR SELECT USING (
  user_id = auth.uid()
);

-- 8. Utilizadores de setores podem atualizar apenas seu próprio perfil
CREATE POLICY "Sector users can update own profile" ON profiles
FOR UPDATE USING (
  user_id = auth.uid()
);

-- =====================================================
-- POLICIES PARA EDITORES
-- =====================================================

-- 9. Editores podem visualizar apenas seu próprio perfil
CREATE POLICY "Editors can view own profile" ON profiles
FOR SELECT USING (
  user_id = auth.uid()
);

-- 10. Editores podem atualizar apenas seu próprio perfil
CREATE POLICY "Editors can update own profile" ON profiles
FOR UPDATE USING (
  user_id = auth.uid()
);

-- =====================================================
-- FUNÇÃO PARA VERIFICAR SE É ADMINISTRADOR
-- =====================================================

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

-- =====================================================
-- FUNÇÃO PARA VERIFICAR SE É EDITOR
-- =====================================================

CREATE OR REPLACE FUNCTION is_editor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'editor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA VERIFICAR SE É UTILIZADOR DE SETOR
-- =====================================================

CREATE OR REPLACE FUNCTION is_sector_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('educacao', 'saude', 'agricultura', 'sector-mineiro', 
                 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA OBTER O SETOR DO UTILIZADOR ATUAL
-- =====================================================

CREATE OR REPLACE FUNCTION get_current_user_sector()
RETURNS UUID AS $$
DECLARE
  user_sector_id UUID;
BEGIN
  SELECT setor_id INTO user_sector_id
  FROM profiles 
  WHERE user_id = auth.uid();
  
  RETURN user_sector_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTÁRIOS NAS FUNÇÕES
-- =====================================================

COMMENT ON FUNCTION is_admin() IS 'Verifica se o utilizador atual é administrador';
COMMENT ON FUNCTION is_editor() IS 'Verifica se o utilizador atual é editor';
COMMENT ON FUNCTION is_sector_user() IS 'Verifica se o utilizador atual é de um setor específico';
COMMENT ON FUNCTION get_current_user_sector() IS 'Retorna o ID do setor do utilizador atual';

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índice para consultas por user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Índice para consultas por role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Índice para consultas por setor_id
CREATE INDEX IF NOT EXISTS idx_profiles_setor_id ON profiles(setor_id);

-- Índice composto para consultas por role e setor_id
CREATE INDEX IF NOT EXISTS idx_profiles_role_setor ON profiles(role, setor_id);

-- =====================================================
-- VERIFICAÇÃO DAS POLICIES
-- =====================================================

-- Verificar se as policies foram criadas corretamente
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
WHERE tablename = 'profiles'
ORDER BY policyname;

-- =====================================================
-- TESTE DAS FUNÇÕES
-- =====================================================

-- Verificar se as funções foram criadas
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname IN ('is_admin', 'is_editor', 'is_sector_user', 'get_current_user_sector')
ORDER BY proname; 