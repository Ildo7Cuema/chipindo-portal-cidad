-- Create system_settings table
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

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_settings_id ON system_settings(id);

-- Insert default settings
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

-- Function to get system setting
CREATE OR REPLACE FUNCTION get_system_setting(setting_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT to_jsonb(system_settings.*)
  INTO result
  FROM system_settings
  LIMIT 1;
  
  RETURN result->setting_key;
END;
$$;

-- Function to update system setting
CREATE OR REPLACE FUNCTION update_system_setting(setting_key TEXT, setting_value JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE system_settings
  SET 
    (site_name, site_description, contact_email, contact_phone, contact_address,
     maintenance_mode, allow_registration, require_email_verification, session_timeout, max_login_attempts,
     email_notifications, sms_notifications, push_notifications, notification_frequency,
     cache_enabled, compression_enabled, cdn_enabled, auto_backup,
     theme, language, timezone, date_format, updated_at) = (
      COALESCE(setting_value->>'site_name', site_name),
      COALESCE(setting_value->>'site_description', site_description),
      COALESCE(setting_value->>'contact_email', contact_email),
      COALESCE(setting_value->>'contact_phone', contact_phone),
      COALESCE(setting_value->>'contact_address', contact_address),
      COALESCE((setting_value->>'maintenance_mode')::BOOLEAN, maintenance_mode),
      COALESCE((setting_value->>'allow_registration')::BOOLEAN, allow_registration),
      COALESCE((setting_value->>'require_email_verification')::BOOLEAN, require_email_verification),
      COALESCE((setting_value->>'session_timeout')::INTEGER, session_timeout),
      COALESCE((setting_value->>'max_login_attempts')::INTEGER, max_login_attempts),
      COALESCE((setting_value->>'email_notifications')::BOOLEAN, email_notifications),
      COALESCE((setting_value->>'sms_notifications')::BOOLEAN, sms_notifications),
      COALESCE((setting_value->>'push_notifications')::BOOLEAN, push_notifications),
      COALESCE(setting_value->>'notification_frequency', notification_frequency),
      COALESCE((setting_value->>'cache_enabled')::BOOLEAN, cache_enabled),
      COALESCE((setting_value->>'compression_enabled')::BOOLEAN, compression_enabled),
      COALESCE((setting_value->>'cdn_enabled')::BOOLEAN, cdn_enabled),
      COALESCE((setting_value->>'auto_backup')::BOOLEAN, auto_backup),
      COALESCE(setting_value->>'theme', theme),
      COALESCE(setting_value->>'language', language),
      COALESCE(setting_value->>'timezone', timezone),
      COALESCE(setting_value->>'date_format', date_format),
      NOW()
    )
  WHERE id = 1;
  
  RETURN FOUND;
END;
$$;

-- Function to create system backup
CREATE OR REPLACE FUNCTION create_system_backup()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  backup_id TEXT;
BEGIN
  backup_id := 'backup_' || to_char(NOW(), 'YYYYMMDD_HH24MISS');
  
  -- Create backup table
  EXECUTE format('CREATE TABLE IF NOT EXISTS system_backup_%s AS SELECT * FROM system_settings', backup_id);
  
  RETURN backup_id;
END;
$$;

-- Function to optimize database
CREATE OR REPLACE FUNCTION optimize_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Analyze all tables
  ANALYZE;
  
  -- Vacuum tables
  VACUUM ANALYZE;
  
  RETURN TRUE;
END;
$$;

-- Function to check database integrity
CREATE OR REPLACE FUNCTION check_database_integrity()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  issues INTEGER := 0;
  warnings INTEGER := 0;
BEGIN
  -- Check for orphaned records (example)
  SELECT COUNT(*) INTO issues
  FROM news n
  LEFT JOIN users u ON n.author_id = u.id
  WHERE n.author_id IS NOT NULL AND u.id IS NULL;
  
  -- Check for data consistency (example)
  SELECT COUNT(*) INTO warnings
  FROM concursos
  WHERE data_inicio > data_fim;
  
  result := jsonb_build_object(
    'issues', issues,
    'warnings', warnings,
    'status', CASE 
      WHEN issues = 0 AND warnings = 0 THEN 'healthy'
      WHEN issues = 0 THEN 'warning'
      ELSE 'error'
    END,
    'timestamp', NOW()
  );
  
  RETURN result;
END;
$$;

-- Function to vacuum database
CREATE OR REPLACE FUNCTION vacuum_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  VACUUM;
  RETURN TRUE;
END;
$$;

-- Function to reindex database
CREATE OR REPLACE FUNCTION reindex_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REINDEX DATABASE CURRENT_DATABASE();
  RETURN TRUE;
END;
$$;

-- Function to get maintenance stats
CREATE OR REPLACE FUNCTION get_maintenance_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  result := jsonb_build_object(
    'cache_clears', 0,
    'db_optimizations', 0,
    'backups_created', 0,
    'integrity_checks', 0,
    'last_maintenance', NOW(),
    'total_actions', 0
  );
  
  RETURN result;
END;
$$;

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to system settings" ON system_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow admin to update system settings" ON system_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to insert system settings" ON system_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_system_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_updated_at(); 