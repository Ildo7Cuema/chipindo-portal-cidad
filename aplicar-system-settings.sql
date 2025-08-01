-- Script para aplicar a migração da tabela system_settings
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  
  -- Site Settings
  site_name VARCHAR(255) DEFAULT 'Portal de Chipindo',
  site_description TEXT DEFAULT 'Portal oficial da Administração Municipal de Chipindo',
  contact_email VARCHAR(255) DEFAULT 'admin@chipindo.gov.ao',
  contact_phone VARCHAR(50) DEFAULT '+244 XXX XXX XXX',
  contact_address TEXT DEFAULT 'Rua Principal, Chipindo, Huíla, Angola',
  
  -- Security Settings
  maintenance_mode BOOLEAN DEFAULT FALSE,
  allow_registration BOOLEAN DEFAULT TRUE,
  require_email_verification BOOLEAN DEFAULT FALSE,
  session_timeout INTEGER DEFAULT 30,
  max_login_attempts INTEGER DEFAULT 3,
  
  -- Notification Settings
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT FALSE,
  notification_frequency VARCHAR(50) DEFAULT 'instant',
  
  -- Performance Settings
  cache_enabled BOOLEAN DEFAULT TRUE,
  compression_enabled BOOLEAN DEFAULT TRUE,
  cdn_enabled BOOLEAN DEFAULT FALSE,
  auto_backup BOOLEAN DEFAULT TRUE,
  
  -- Appearance Settings
  theme VARCHAR(50) DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'pt',
  timezone VARCHAR(100) DEFAULT 'Africa/Luanda',
  date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índice
CREATE INDEX IF NOT EXISTS idx_system_settings_id ON system_settings(id);

-- 3. Inserir configurações padrão
INSERT INTO system_settings (
  site_name,
  site_description,
  contact_email,
  contact_phone,
  contact_address,
  maintenance_mode,
  allow_registration,
  require_email_verification,
  session_timeout,
  max_login_attempts,
  email_notifications,
  sms_notifications,
  push_notifications,
  notification_frequency,
  cache_enabled,
  compression_enabled,
  cdn_enabled,
  auto_backup,
  theme,
  language,
  timezone,
  date_format
) VALUES (
  'Portal de Chipindo',
  'Portal oficial da Administração Municipal de Chipindo',
  'admin@chipindo.gov.ao',
  '+244 XXX XXX XXX',
  'Rua Principal, Chipindo, Huíla, Angola',
  FALSE,
  TRUE,
  FALSE,
  30,
  3,
  TRUE,
  FALSE,
  FALSE,
  'instant',
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  'system',
  'pt',
  'Africa/Luanda',
  'dd/MM/yyyy'
) ON CONFLICT (id) DO NOTHING;

-- 4. Habilitar RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas
CREATE POLICY "Allow read access to system settings" ON system_settings
FOR SELECT USING (true);

CREATE POLICY "Allow admin to update system settings" ON system_settings
FOR UPDATE USING (true);

CREATE POLICY "Allow admin to insert system settings" ON system_settings
FOR INSERT WITH CHECK (true);

-- 6. Criar função de atualização de timestamp
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger
CREATE TRIGGER trigger_update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_system_settings_updated_at();

-- 8. Verificar se foi criado
SELECT 'Tabela system_settings criada com sucesso!' as resultado;

-- 9. Verificar dados
SELECT 
  id,
  site_name,
  maintenance_mode,
  created_at
FROM system_settings
LIMIT 1; 