-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system_settings (admin only)
CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create trigger to update timestamps
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category) VALUES
-- Site Settings
('site_name', '"Portal de Chipindo"', 'Nome do site', 'site'),
('site_description', '"Portal oficial do município de Chipindo"', 'Descrição do site', 'site'),
('contact_email', '"contato@chipindo.gov.ao"', 'Email de contacto', 'site'),
('contact_phone', '"+244 123 456 789"', 'Telefone de contacto', 'site'),
('contact_address', '"Chipindo, Huíla, Angola"', 'Endereço de contacto', 'site'),

-- Security Settings
('maintenance_mode', 'false', 'Modo de manutenção', 'security'),
('allow_registration', 'false', 'Permitir registo de novos utilizadores', 'security'),
('require_email_verification', 'true', 'Requer verificação de email', 'security'),
('session_timeout', '30', 'Timeout da sessão em minutos', 'security'),
('max_login_attempts', '5', 'Número máximo de tentativas de login', 'security'),

-- Notification Settings
('email_notifications', 'true', 'Notificações por email', 'notifications'),
('sms_notifications', 'false', 'Notificações por SMS', 'notifications'),
('push_notifications', 'true', 'Notificações push', 'notifications'),
('notification_frequency', '"realtime"', 'Frequência de notificações', 'notifications'),

-- Performance Settings
('cache_enabled', 'true', 'Cache habilitado', 'performance'),
('compression_enabled', 'true', 'Compressão habilitada', 'performance'),
('cdn_enabled', 'false', 'CDN habilitado', 'performance'),
('auto_backup', 'true', 'Backup automático', 'performance'),

-- Appearance Settings
('theme', '"light"', 'Tema do site', 'appearance'),
('language', '"pt"', 'Idioma padrão', 'appearance'),
('timezone', '"Africa/Luanda"', 'Fuso horário', 'appearance'),
('date_format', '"DD/MM/YYYY"', 'Formato de data', 'appearance');

-- Create system_stats table for tracking system metrics
CREATE TABLE public.system_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for system_stats (admin only)
CREATE POLICY "Admins can view system stats" 
ON public.system_stats 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "System can insert stats" 
ON public.system_stats 
FOR INSERT 
WITH CHECK (true);

-- Create function to get current system stats
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'active_users', (SELECT COUNT(*) FROM public.profiles WHERE role IS NOT NULL),
    'storage_used', 2.4, -- Mock value, in real app would calculate from storage
    'storage_total', 10.0,
    'database_size', (SELECT pg_database_size(current_database()) / 1024.0 / 1024.0 / 1024.0),
    'cache_hit_rate', 87.5, -- Mock value
    'uptime', 99.8, -- Mock value
    'last_backup', COALESCE(
      (SELECT MAX(recorded_at)::text FROM public.system_stats WHERE metric_name = 'backup'),
      'Nunca'
    ),
    'total_news', (SELECT COUNT(*) FROM public.news),
    'published_news', (SELECT COUNT(*) FROM public.news WHERE published = true),
    'total_concursos', (SELECT COUNT(*) FROM public.concursos),
    'published_concursos', (SELECT COUNT(*) FROM public.concursos WHERE published = true),
    'total_notifications', (SELECT COUNT(*) FROM public.admin_notifications),
    'unread_notifications', (SELECT COUNT(*) FROM public.admin_notifications WHERE read = false)
  ) INTO stats;
  
  RETURN stats;
END;
$$;

-- Create function to update system settings
CREATE OR REPLACE FUNCTION public.update_system_setting(setting_key TEXT, setting_value JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.system_settings (key, value)
  VALUES (setting_key, setting_value)
  ON CONFLICT (key)
  DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Create function to get system setting
CREATE OR REPLACE FUNCTION public.get_system_setting(setting_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  setting_value JSONB;
BEGIN
  SELECT value INTO setting_value
  FROM public.system_settings
  WHERE key = setting_key;
  
  RETURN setting_value;
END;
$$; 