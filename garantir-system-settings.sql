-- Script para garantir que há pelo menos um registro na tabela system_settings
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se há registros
SELECT 
  'Registros existentes' as tipo,
  COUNT(*) as total
FROM system_settings;

-- 2. Se não houver registros, inserir um padrão
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
) 
SELECT 
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
WHERE NOT EXISTS (SELECT 1 FROM system_settings);

-- 3. Verificar se foi inserido
SELECT 
  'Após inserção' as tipo,
  COUNT(*) as total_registros
FROM system_settings;

-- 4. Mostrar o registro
SELECT 
  id,
  site_name,
  maintenance_mode,
  created_at,
  updated_at
FROM system_settings
LIMIT 1;

-- 5. Testar a query que estava falhando
SELECT 
  'Teste final' as tipo,
  maintenance_mode
FROM system_settings
LIMIT 1; 