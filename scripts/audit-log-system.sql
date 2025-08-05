-- =====================================================
-- SISTEMA DE LOGS DE AUDITORIA PARA UTILIZADORES
-- =====================================================

-- =====================================================
-- TABELA DE LOGS DE AUDITORIA
-- =====================================================

CREATE TABLE IF NOT EXISTS user_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'BLOCK', 'UNBLOCK', 'ROLE_CHANGE')),
  table_name TEXT NOT NULL DEFAULT 'profiles',
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_audit_logs_user_id ON user_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_audit_logs_admin_user_id ON user_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_audit_logs_action ON user_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_audit_logs_created_at ON user_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_audit_logs_record_id ON user_audit_logs(record_id);

-- =====================================================
-- FUNÇÃO PARA REGISTRAR LOGS DE AUDITORIA
-- =====================================================

CREATE OR REPLACE FUNCTION log_user_audit_event(
  p_action TEXT,
  p_record_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_changed_fields TEXT[] DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_admin_user_id UUID;
  v_ip_address INET;
  v_user_agent TEXT;
BEGIN
  -- Obter informações do utilizador atual
  v_admin_user_id := auth.uid();
  
  -- Obter IP e User Agent (se disponível)
  v_ip_address := inet_client_addr();
  v_user_agent := current_setting('request.headers', true)::json->>'user-agent';
  
  -- Inserir log de auditoria
  INSERT INTO user_audit_logs (
    user_id,
    admin_user_id,
    action,
    record_id,
    old_values,
    new_values,
    changed_fields,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    CASE 
      WHEN p_action = 'CREATE' THEN p_new_values->>'user_id'
      ELSE p_old_values->>'user_id'
    END::UUID,
    v_admin_user_id,
    p_action,
    p_record_id,
    p_old_values,
    p_new_values,
    p_changed_fields,
    v_ip_address,
    v_user_agent,
    p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS PARA AUDITORIA AUTOMÁTICA
-- =====================================================

-- Trigger para INSERT (criação de utilizadores)
CREATE OR REPLACE FUNCTION audit_user_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_user_audit_event(
    'CREATE',
    NEW.id,
    NULL,
    to_jsonb(NEW),
    NULL,
    jsonb_build_object(
      'admin_email', (SELECT email FROM profiles WHERE user_id = auth.uid()),
      'admin_name', (SELECT full_name FROM profiles WHERE user_id = auth.uid())
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_audit_user_insert
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_user_insert();

-- Trigger para UPDATE (alterações de utilizadores)
CREATE OR REPLACE FUNCTION audit_user_update()
RETURNS TRIGGER AS $$
DECLARE
  v_changed_fields TEXT[] := '{}';
  v_action TEXT := 'UPDATE';
  v_metadata JSONB;
BEGIN
  -- Determinar campos alterados
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    v_changed_fields := array_append(v_changed_fields, 'email');
  END IF;
  
  IF OLD.full_name IS DISTINCT FROM NEW.full_name THEN
    v_changed_fields := array_append(v_changed_fields, 'full_name');
  END IF;
  
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    v_changed_fields := array_append(v_changed_fields, 'role');
    
    -- Determinar ação específica baseada na mudança de role
    IF OLD.role IS NULL AND NEW.role IS NOT NULL THEN
      v_action := 'UNBLOCK';
    ELSIF OLD.role IS NOT NULL AND NEW.role IS NULL THEN
      v_action := 'BLOCK';
    ELSIF OLD.role IS DISTINCT FROM NEW.role THEN
      v_action := 'ROLE_CHANGE';
    END IF;
  END IF;
  
  IF OLD.setor_id IS DISTINCT FROM NEW.setor_id THEN
    v_changed_fields := array_append(v_changed_fields, 'setor_id');
  END IF;
  
  -- Só registrar se houve mudanças
  IF array_length(v_changed_fields, 1) > 0 THEN
    v_metadata := jsonb_build_object(
      'admin_email', (SELECT email FROM profiles WHERE user_id = auth.uid()),
      'admin_name', (SELECT full_name FROM profiles WHERE user_id = auth.uid()),
      'old_role', OLD.role,
      'new_role', NEW.role
    );
    
    PERFORM log_user_audit_event(
      v_action,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      v_changed_fields,
      v_metadata
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_audit_user_update
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_user_update();

-- Trigger para DELETE (exclusão de utilizadores)
CREATE OR REPLACE FUNCTION audit_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_user_audit_event(
    'DELETE',
    OLD.id,
    to_jsonb(OLD),
    NULL,
    NULL,
    jsonb_build_object(
      'admin_email', (SELECT email FROM profiles WHERE user_id = auth.uid()),
      'admin_name', (SELECT full_name FROM profiles WHERE user_id = auth.uid())
    )
  );
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_audit_user_delete
  AFTER DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_user_delete();

-- =====================================================
-- FUNÇÕES PARA CONSULTA DE LOGS
-- =====================================================

-- Função para obter logs de um utilizador específico
CREATE OR REPLACE FUNCTION get_user_audit_logs(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  action TEXT,
  admin_name TEXT,
  admin_email TEXT,
  changed_fields TEXT[],
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  ip_address INET
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ual.id,
    ual.action,
    p.full_name as admin_name,
    p.email as admin_email,
    ual.changed_fields,
    ual.old_values,
    ual.new_values,
    ual.created_at,
    ual.ip_address
  FROM user_audit_logs ual
  LEFT JOIN profiles p ON p.user_id = ual.admin_user_id
  WHERE ual.user_id = p_user_id
  ORDER BY ual.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter logs de auditoria por período
CREATE OR REPLACE FUNCTION get_audit_logs_by_period(
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  id UUID,
  user_name TEXT,
  user_email TEXT,
  action TEXT,
  admin_name TEXT,
  admin_email TEXT,
  changed_fields TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  ip_address INET
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ual.id,
    up.full_name as user_name,
    up.email as user_email,
    ual.action,
    ap.full_name as admin_name,
    ap.email as admin_email,
    ual.changed_fields,
    ual.created_at,
    ual.ip_address
  FROM user_audit_logs ual
  LEFT JOIN profiles up ON up.user_id = ual.user_id
  LEFT JOIN profiles ap ON ap.user_id = ual.admin_user_id
  WHERE ual.created_at BETWEEN p_start_date AND p_end_date
  ORDER BY ual.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter estatísticas de auditoria
CREATE OR REPLACE FUNCTION get_audit_statistics()
RETURNS TABLE (
  total_actions BIGINT,
  create_count BIGINT,
  update_count BIGINT,
  delete_count BIGINT,
  block_count BIGINT,
  unblock_count BIGINT,
  role_change_count BIGINT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_actions,
    COUNT(*) FILTER (WHERE action = 'CREATE') as create_count,
    COUNT(*) FILTER (WHERE action = 'UPDATE') as update_count,
    COUNT(*) FILTER (WHERE action = 'DELETE') as delete_count,
    COUNT(*) FILTER (WHERE action = 'BLOCK') as block_count,
    COUNT(*) FILTER (WHERE action = 'UNBLOCK') as unblock_count,
    COUNT(*) FILTER (WHERE action = 'ROLE_CHANGE') as role_change_count,
    MAX(created_at) as last_activity
  FROM user_audit_logs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES PARA LOGS DE AUDITORIA
-- =====================================================

-- Habilitar RLS na tabela de logs
ALTER TABLE user_audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas administradores podem visualizar logs de auditoria
CREATE POLICY "Admins can view audit logs" ON user_audit_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Apenas administradores podem inserir logs de auditoria
CREATE POLICY "Admins can insert audit logs" ON user_audit_logs
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

COMMENT ON TABLE user_audit_logs IS 'Logs de auditoria para todas as alterações em utilizadores';
COMMENT ON FUNCTION log_user_audit_event IS 'Função para registrar eventos de auditoria';
COMMENT ON FUNCTION get_user_audit_logs IS 'Obter logs de auditoria de um utilizador específico';
COMMENT ON FUNCTION get_audit_logs_by_period IS 'Obter logs de auditoria por período';
COMMENT ON FUNCTION get_audit_statistics IS 'Obter estatísticas de auditoria';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se a tabela foi criada
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_audit_logs'
ORDER BY ordinal_position;

-- Verificar se os triggers foram criados
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'profiles'
AND trigger_name LIKE '%audit%'
ORDER BY trigger_name; 