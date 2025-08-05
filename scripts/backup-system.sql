-- =====================================================
-- SISTEMA DE BACKUP AUTOMÁTICO PARA UTILIZADORES
-- =====================================================

-- =====================================================
-- TABELA DE BACKUP DE UTILIZADORES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  backup_type TEXT NOT NULL CHECK (backup_type IN ('FULL', 'INCREMENTAL', 'MANUAL')),
  description TEXT,
  file_path TEXT,
  file_size BIGINT,
  compression_ratio DECIMAL(5,2),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB
);

-- =====================================================
-- TABELA DE DADOS DE BACKUP
-- =====================================================

CREATE TABLE IF NOT EXISTS user_backup_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id UUID REFERENCES user_backups(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  data_hash TEXT NOT NULL,
  backup_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_backups_date ON user_backups(backup_date);
CREATE INDEX IF NOT EXISTS idx_user_backups_type ON user_backups(backup_type);
CREATE INDEX IF NOT EXISTS idx_user_backups_status ON user_backups(status);
CREATE INDEX IF NOT EXISTS idx_user_backup_data_backup_id ON user_backup_data(backup_id);
CREATE INDEX IF NOT EXISTS idx_user_backup_data_table ON user_backup_data(table_name);

-- =====================================================
-- FUNÇÃO PARA CRIAR BACKUP COMPLETO
-- =====================================================

CREATE OR REPLACE FUNCTION create_user_backup(
  p_backup_type TEXT DEFAULT 'MANUAL',
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_backup_id UUID;
  v_profiles_count INTEGER;
  v_audit_logs_count INTEGER;
  v_profiles_data JSONB;
  v_audit_logs_data JSONB;
  v_profiles_hash TEXT;
  v_audit_logs_hash TEXT;
BEGIN
  -- Criar registro de backup
  INSERT INTO user_backups (
    backup_type,
    description,
    status,
    created_by
  ) VALUES (
    p_backup_type,
    p_description,
    'IN_PROGRESS',
    auth.uid()
  ) RETURNING id INTO v_backup_id;

  -- Fazer backup da tabela profiles
  SELECT 
    COUNT(*),
    jsonb_agg(to_jsonb(p.*)),
    encode(sha256(jsonb_agg(to_jsonb(p.*))::text::bytea), 'hex')
  INTO 
    v_profiles_count,
    v_profiles_data,
    v_profiles_hash
  FROM profiles p;

  -- Inserir dados de backup dos profiles
  INSERT INTO user_backup_data (
    backup_id,
    table_name,
    record_count,
    data_hash,
    backup_data
  ) VALUES (
    v_backup_id,
    'profiles',
    v_profiles_count,
    v_profiles_hash,
    v_profiles_data
  );

  -- Fazer backup da tabela user_audit_logs (se existir)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_audit_logs') THEN
    SELECT 
      COUNT(*),
      jsonb_agg(to_jsonb(ual.*)),
      encode(sha256(jsonb_agg(to_jsonb(ual.*))::text::bytea), 'hex')
    INTO 
      v_audit_logs_count,
      v_audit_logs_data,
      v_audit_logs_hash
    FROM user_audit_logs ual;

    -- Inserir dados de backup dos logs de auditoria
    INSERT INTO user_backup_data (
      backup_id,
      table_name,
      record_count,
      data_hash,
      backup_data
    ) VALUES (
      v_backup_id,
      'user_audit_logs',
      v_audit_logs_count,
      v_audit_logs_hash,
      v_audit_logs_data
    );
  END IF;

  -- Atualizar status para completado
  UPDATE user_backups 
  SET status = 'COMPLETED'
  WHERE id = v_backup_id;

  RETURN v_backup_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, atualizar status
    IF v_backup_id IS NOT NULL THEN
      UPDATE user_backups 
      SET 
        status = 'FAILED',
        error_message = SQLERRM
      WHERE id = v_backup_id;
    END IF;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA RESTAURAR BACKUP
-- =====================================================

CREATE OR REPLACE FUNCTION restore_user_backup(p_backup_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_backup_record user_backups%ROWTYPE;
  v_backup_data user_backup_data%ROWTYPE;
  v_success BOOLEAN := TRUE;
BEGIN
  -- Verificar se o backup existe e está completo
  SELECT * INTO v_backup_record
  FROM user_backups
  WHERE id = p_backup_id AND status = 'COMPLETED';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Backup não encontrado ou incompleto';
  END IF;

  -- Iniciar transação
  BEGIN
    -- Restaurar dados dos profiles
    FOR v_backup_data IN 
      SELECT * FROM user_backup_data 
      WHERE backup_id = p_backup_id AND table_name = 'profiles'
    LOOP
      -- Limpar tabela atual
      DELETE FROM profiles;
      
      -- Restaurar dados
      INSERT INTO profiles (
        id, user_id, email, full_name, role, setor_id, created_at, updated_at
      )
      SELECT 
        (data->>'id')::UUID,
        (data->>'user_id')::UUID,
        data->>'email',
        data->>'full_name',
        data->>'role',
        (data->>'setor_id')::UUID,
        (data->>'created_at')::TIMESTAMP WITH TIME ZONE,
        (data->>'updated_at')::TIMESTAMP WITH TIME ZONE
      FROM jsonb_array_elements(v_backup_data.backup_data) AS data;
    END LOOP;

    -- Restaurar dados dos logs de auditoria (se existir)
    FOR v_backup_data IN 
      SELECT * FROM user_backup_data 
      WHERE backup_id = p_backup_id AND table_name = 'user_audit_logs'
    LOOP
      -- Limpar tabela atual
      DELETE FROM user_audit_logs;
      
      -- Restaurar dados
      INSERT INTO user_audit_logs (
        id, user_id, admin_user_id, action, table_name, record_id, 
        old_values, new_values, changed_fields, ip_address, user_agent, 
        created_at, metadata
      )
      SELECT 
        (data->>'id')::UUID,
        (data->>'user_id')::UUID,
        (data->>'admin_user_id')::UUID,
        data->>'action',
        data->>'table_name',
        (data->>'record_id')::UUID,
        data->'old_values',
        data->'new_values',
        (data->>'changed_fields')::TEXT[],
        (data->>'ip_address')::INET,
        data->>'user_agent',
        (data->>'created_at')::TIMESTAMP WITH TIME ZONE,
        data->'metadata'
      FROM jsonb_array_elements(v_backup_data.backup_data) AS data;
    END LOOP;

    -- Registrar log de restauração
    INSERT INTO user_backups (
      backup_type,
      description,
      status,
      created_by,
      metadata
    ) VALUES (
      'RESTORE',
      'Restauração do backup ' || p_backup_id,
      'COMPLETED',
      auth.uid(),
      jsonb_build_object('restored_backup_id', p_backup_id)
    );

  EXCEPTION
    WHEN OTHERS THEN
      v_success := FALSE;
      RAISE;
  END;

  RETURN v_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA LIMPAR BACKUPS ANTIGOS
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_old_backups(p_days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER := 0;
BEGIN
  -- Deletar backups antigos
  DELETE FROM user_backups 
  WHERE backup_date < NOW() - INTERVAL '1 day' * p_days_to_keep
  AND status IN ('COMPLETED', 'FAILED');

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA OBTER ESTATÍSTICAS DE BACKUP
-- =====================================================

CREATE OR REPLACE FUNCTION get_backup_statistics()
RETURNS TABLE (
  total_backups BIGINT,
  successful_backups BIGINT,
  failed_backups BIGINT,
  total_size BIGINT,
  last_backup_date TIMESTAMP WITH TIME ZONE,
  oldest_backup_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_backups,
    COUNT(*) FILTER (WHERE status = 'COMPLETED') as successful_backups,
    COUNT(*) FILTER (WHERE status = 'FAILED') as failed_backups,
    COALESCE(SUM(file_size), 0) as total_size,
    MAX(backup_date) as last_backup_date,
    MIN(backup_date) as oldest_backup_date
  FROM user_backups;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA VERIFICAR INTEGRIDADE DO BACKUP
-- =====================================================

CREATE OR REPLACE FUNCTION verify_backup_integrity(p_backup_id UUID)
RETURNS TABLE (
  table_name TEXT,
  record_count INTEGER,
  data_hash TEXT,
  integrity_check BOOLEAN
) AS $$
DECLARE
  v_backup_data user_backup_data%ROWTYPE;
  v_current_hash TEXT;
  v_current_count INTEGER;
BEGIN
  FOR v_backup_data IN 
    SELECT * FROM user_backup_data WHERE backup_id = p_backup_id
  LOOP
    -- Verificar integridade dos profiles
    IF v_backup_data.table_name = 'profiles' THEN
      SELECT 
        COUNT(*),
        encode(sha256(jsonb_agg(to_jsonb(p.*))::text::bytea), 'hex')
      INTO 
        v_current_count,
        v_current_hash
      FROM profiles p;
    END IF;

    -- Verificar integridade dos logs de auditoria
    IF v_backup_data.table_name = 'user_audit_logs' THEN
      SELECT 
        COUNT(*),
        encode(sha256(jsonb_agg(to_jsonb(ual.*))::text::bytea), 'hex')
      INTO 
        v_current_count,
        v_current_hash
      FROM user_audit_logs ual;
    END IF;

    RETURN QUERY
    SELECT 
      v_backup_data.table_name,
      v_backup_data.record_count,
      v_backup_data.data_hash,
      (v_backup_data.data_hash = v_current_hash AND v_backup_data.record_count = v_current_count) as integrity_check;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER PARA BACKUP AUTOMÁTICO
-- =====================================================

-- Função para trigger de backup automático
CREATE OR REPLACE FUNCTION trigger_automatic_backup()
RETURNS TRIGGER AS $$
DECLARE
  v_backup_id UUID;
BEGIN
  -- Criar backup automático a cada 100 alterações
  IF (SELECT COUNT(*) FROM user_backups WHERE backup_date > NOW() - INTERVAL '1 hour') < 1 THEN
    PERFORM create_user_backup('AUTOMATIC', 'Backup automático por alterações');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para backup automático (executar a cada 100 alterações)
-- CREATE TRIGGER trigger_automatic_user_backup
--   AFTER INSERT OR UPDATE OR DELETE ON profiles
--   FOR EACH STATEMENT
--   EXECUTE FUNCTION trigger_automatic_backup();

-- =====================================================
-- RLS POLICIES PARA BACKUP
-- =====================================================

-- Habilitar RLS nas tabelas de backup
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backup_data ENABLE ROW LEVEL SECURITY;

-- Apenas administradores podem visualizar backups
CREATE POLICY "Admins can view backups" ON user_backups
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Apenas administradores podem criar backups
CREATE POLICY "Admins can create backups" ON user_backups
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Apenas administradores podem visualizar dados de backup
CREATE POLICY "Admins can view backup data" ON user_backup_data
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Apenas administradores podem inserir dados de backup
CREATE POLICY "Admins can insert backup data" ON user_backup_data
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE user_backups IS 'Registros de backup dos utilizadores';
COMMENT ON TABLE user_backup_data IS 'Dados de backup dos utilizadores';
COMMENT ON FUNCTION create_user_backup IS 'Criar backup completo dos dados dos utilizadores';
COMMENT ON FUNCTION restore_user_backup IS 'Restaurar backup dos dados dos utilizadores';
COMMENT ON FUNCTION cleanup_old_backups IS 'Limpar backups antigos';
COMMENT ON FUNCTION get_backup_statistics IS 'Obter estatísticas de backup';
COMMENT ON FUNCTION verify_backup_integrity IS 'Verificar integridade de um backup';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('user_backups', 'user_backup_data')
ORDER BY table_name, ordinal_position;

-- Verificar se as funções foram criadas
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname IN ('create_user_backup', 'restore_user_backup', 'cleanup_old_backups', 'get_backup_statistics', 'verify_backup_integrity')
ORDER BY proname; 