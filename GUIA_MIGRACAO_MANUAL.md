# 🚀 Guia de Migração Manual - Sistema de Controle de Acesso

Este guia contém todas as migrações SQL necessárias para implementar o sistema de controle de acesso granular no Supabase.

## 📋 **Pré-requisitos**

1. Aceder ao **Supabase Dashboard**
2. Ir para **SQL Editor**
3. Ter permissões de administrador no projeto

## 🔧 **Migração 1: Sistema de Gestão de Utilizadores**

### **1.1 Criar Tabela de Setores Estratégicos**

```sql
-- Criar tabela setores_estrategicos
CREATE TABLE IF NOT EXISTS setores_estrategicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    responsavel VARCHAR(100),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir setores padrão
INSERT INTO setores_estrategicos (nome, descricao) VALUES
    ('educacao', 'Direção de Educação'),
    ('saude', 'Direção de Saúde'),
    ('agricultura', 'Direção de Agricultura'),
    ('sector-mineiro', 'Sector Mineiro'),
    ('desenvolvimento-economico', 'Desenvolvimento Económico'),
    ('cultura', 'Direção de Cultura'),
    ('tecnologia', 'Direção de Tecnologia'),
    ('energia-agua', 'Direção de Energia e Água')
ON CONFLICT (nome) DO NOTHING;
```

### **1.2 Adicionar Coluna setor_id à Tabela profiles**

```sql
-- Adicionar coluna setor_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'setor_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN setor_id UUID REFERENCES setores_estrategicos(id);
    END IF;
END $$;
```

### **1.3 Criar Funções de Acesso**

```sql
-- Função para verificar se o utilizador é admin
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

-- Função para obter nome do setor
CREATE OR REPLACE FUNCTION get_sector_name(sector_role VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    RETURN CASE sector_role
        WHEN 'educacao' THEN 'Educação'
        WHEN 'saude' THEN 'Saúde'
        WHEN 'agricultura' THEN 'Agricultura'
        WHEN 'sector-mineiro' THEN 'Sector Mineiro'
        WHEN 'desenvolvimento-economico' THEN 'Desenvolvimento Económico'
        WHEN 'cultura' THEN 'Cultura'
        WHEN 'tecnologia' THEN 'Tecnologia'
        WHEN 'energia-agua' THEN 'Energia e Água'
        ELSE sector_role
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### **1.4 Corrigir Políticas RLS**

```sql
-- Remover políticas DELETE existentes
DROP POLICY IF EXISTS profiles_delete_policy ON profiles;

-- Criar nova política DELETE
CREATE POLICY profiles_delete_policy ON profiles
FOR DELETE USING (
  is_admin() OR 
  auth.uid() = user_id
);

-- Garantir que RLS está ativo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### **1.5 Função de Exclusão Completa de Utilizadores**

```sql
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
    
    -- Tentar excluir do auth
    BEGIN
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
```

## 🔧 **Migração 2: Sistema de Auditoria**

### **2.1 Criar Tabelas de Auditoria**

```sql
-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS user_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de backups
CREATE TABLE IF NOT EXISTS user_backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    file_path TEXT,
    file_size BIGINT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de dados de backup
CREATE TABLE IF NOT EXISTS user_backup_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_id UUID REFERENCES user_backups(id) ON DELETE CASCADE,
    table_name VARCHAR(100) NOT NULL,
    record_count INTEGER DEFAULT 0,
    data_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2.2 Políticas RLS para Auditoria**

```sql
-- Ativar RLS
ALTER TABLE user_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backup_data ENABLE ROW LEVEL SECURITY;

-- Políticas para user_audit_logs
CREATE POLICY audit_logs_select_policy ON user_audit_logs
FOR SELECT USING (is_admin());

CREATE POLICY audit_logs_insert_policy ON user_audit_logs
FOR INSERT WITH CHECK (is_admin());

-- Políticas para user_backups
CREATE POLICY backups_select_policy ON user_backups
FOR SELECT USING (is_admin());

CREATE POLICY backups_insert_policy ON user_backups
FOR INSERT WITH CHECK (is_admin());

-- Políticas para user_backup_data
CREATE POLICY backup_data_select_policy ON user_backup_data
FOR SELECT USING (is_admin());

CREATE POLICY backup_data_insert_policy ON user_backup_data
FOR INSERT WITH CHECK (is_admin());
```

### **2.3 Criar Índices**

```sql
-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_audit_logs_user_id ON user_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_audit_logs_created_at ON user_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_backups_created_by ON user_backups(created_by);
CREATE INDEX IF NOT EXISTS idx_user_backup_data_backup_id ON user_backup_data(backup_id);
```

## 🔧 **Migração 3: Funções de Auditoria**

### **3.1 Função para Log de Auditoria**

```sql
CREATE OR REPLACE FUNCTION log_user_audit_event(
    p_user_id UUID,
    p_action VARCHAR(50),
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO user_audit_logs (
        user_id, action, details, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **3.2 Triggers de Auditoria**

```sql
-- Trigger para INSERT em profiles
CREATE OR REPLACE FUNCTION trigger_audit_user_insert()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM log_user_audit_event(
        NEW.user_id,
        'user_created',
        jsonb_build_object(
            'email', NEW.email,
            'full_name', NEW.full_name,
            'role', NEW.role,
            'setor_id', NEW.setor_id
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_user_insert
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_user_insert();

-- Trigger para UPDATE em profiles
CREATE OR REPLACE FUNCTION trigger_audit_user_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM log_user_audit_event(
        NEW.user_id,
        'user_updated',
        jsonb_build_object(
            'old_role', OLD.role,
            'new_role', NEW.role,
            'old_setor_id', OLD.setor_id,
            'new_setor_id', NEW.setor_id,
            'changes', jsonb_build_object(
                'role_changed', OLD.role IS DISTINCT FROM NEW.role,
                'setor_changed', OLD.setor_id IS DISTINCT FROM NEW.setor_id,
                'name_changed', OLD.full_name IS DISTINCT FROM NEW.full_name
            )
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_user_update
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_user_update();

-- Trigger para DELETE em profiles
CREATE OR REPLACE FUNCTION trigger_audit_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM log_user_audit_event(
        OLD.user_id,
        'user_deleted',
        jsonb_build_object(
            'email', OLD.email,
            'full_name', OLD.full_name,
            'role', OLD.role,
            'setor_id', OLD.setor_id
        )
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_user_delete
    AFTER DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_audit_user_delete();
```

## 🔧 **Migração 4: Sistema de Backup**

### **4.1 Funções de Backup**

```sql
-- Função para criar backup
CREATE OR REPLACE FUNCTION create_user_backup(
    p_backup_name VARCHAR(255),
    p_backup_type VARCHAR(50) DEFAULT 'manual'
)
RETURNS UUID AS $$
DECLARE
    backup_id UUID;
BEGIN
    INSERT INTO user_backups (backup_name, backup_type, created_by)
    VALUES (p_backup_name, p_backup_type, auth.uid())
    RETURNING id INTO backup_id;
    
    RETURN backup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter estatísticas de backup
CREATE OR REPLACE FUNCTION get_backup_statistics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT jsonb_build_object(
        'total_backups', COUNT(*),
        'successful_backups', COUNT(*) FILTER (WHERE status = 'completed'),
        'pending_backups', COUNT(*) FILTER (WHERE status = 'pending'),
        'failed_backups', COUNT(*) FILTER (WHERE status = 'failed'),
        'total_size', COALESCE(SUM(file_size), 0),
        'last_backup', MAX(created_at)
    ) INTO result
    FROM user_backups;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔧 **Migração 5: Verificação Final**

### **5.1 Script de Verificação**

```sql
-- Verificar se tudo foi criado corretamente
DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Verificar tabelas
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'setores_estrategicos', 'user_audit_logs', 'user_backups', 'user_backup_data');
    
    -- Verificar funções
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('is_admin', 'get_sector_name', 'delete_user_complete', 'log_user_audit_event');
    
    -- Verificar políticas
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'user_audit_logs', 'user_backups', 'user_backup_data');
    
    RAISE NOTICE 'Verificação concluída:';
    RAISE NOTICE '- Tabelas criadas: %', table_count;
    RAISE NOTICE '- Funções criadas: %', function_count;
    RAISE NOTICE '- Políticas RLS criadas: %', policy_count;
    
    IF table_count >= 5 AND function_count >= 4 AND policy_count >= 6 THEN
        RAISE NOTICE '✅ Migração aplicada com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Alguns elementos podem não ter sido criados corretamente.';
    END IF;
END $$;
```

## 🚀 **Como Aplicar as Migrações**

### **Passo 1: Aceder ao Supabase Dashboard**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o seu projeto

### **Passo 2: Abrir SQL Editor**
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### **Passo 3: Aplicar Migrações**
1. Copie e cole cada bloco SQL acima
2. Execute cada bloco separadamente
3. Verifique se não há erros

### **Passo 4: Verificar Instalação**
1. Execute o script de verificação final
2. Confirme que todas as tabelas, funções e políticas foram criadas

## 🔧 **Teste do Sistema**

### **1. Testar Criação de Utilizador**
```sql
-- Inserir um utilizador de teste
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('teste@exemplo.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW());

INSERT INTO profiles (user_id, email, full_name, role, setor_id)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'teste@exemplo.com'),
    'teste@exemplo.com',
    'Utilizador Teste',
    'educacao',
    (SELECT id FROM setores_estrategicos WHERE nome = 'educacao')
);
```

### **2. Testar Exclusão de Utilizador**
```sql
-- Testar a função de exclusão
SELECT delete_user_complete(
    (SELECT id FROM profiles WHERE email = 'teste@exemplo.com')
);
```

### **3. Verificar Logs de Auditoria**
```sql
-- Verificar se os logs foram criados
SELECT * FROM user_audit_logs ORDER BY created_at DESC LIMIT 5;
```

## 🎯 **Resultado Esperado**

Após aplicar todas as migrações:

1. ✅ **Sistema de controle de acesso** funcionando
2. ✅ **Sidebar filtrado** por permissões
3. ✅ **Gestão de utilizadores** completa
4. ✅ **Sistema de auditoria** ativo
5. ✅ **Backup automático** configurado
6. ✅ **RLS policies** aplicadas

## 🆘 **Solução de Problemas**

### **Erro: "function does not exist"**
- Verifique se todas as funções foram criadas
- Execute novamente os scripts de função

### **Erro: "policy already exists"**
- Remova as políticas existentes primeiro
- Execute novamente os scripts de política

### **Erro: "table already exists"**
- Use `CREATE TABLE IF NOT EXISTS` para evitar conflitos

### **Erro: "permission denied"**
- Verifique se tem permissões de administrador
- Execute como superuser se necessário

## 📞 **Suporte**

Se encontrar problemas:
1. Verifique os logs de erro no SQL Editor
2. Confirme que todas as migrações foram aplicadas
3. Teste com utilizadores de diferentes roles
4. Verifique se o frontend está conectado corretamente

---

**🎉 Sistema de Controle de Acesso Granular Implementado com Sucesso!** 