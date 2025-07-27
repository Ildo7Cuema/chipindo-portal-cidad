-- Ensure backup functions are available
-- This migration ensures that all backup-related functions are properly created

-- Create function to create backup (if not exists)
CREATE OR REPLACE FUNCTION public.create_system_backup(
  backup_type TEXT DEFAULT 'manual',
  tables_to_backup TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  backup_uuid UUID;
  backup_id TEXT;
  tables_list TEXT[];
  backup_size BIGINT;
BEGIN
  -- Generate backup ID
  backup_id := 'backup_' || to_char(now(), 'YYYYMMDD_HH24MISS');
  
  -- If no tables specified, backup all tables
  IF tables_to_backup IS NULL THEN
    SELECT array_agg(tablename::TEXT) INTO tables_list
    FROM pg_tables 
    WHERE schemaname = 'public';
  ELSE
    tables_list := tables_to_backup;
  END IF;
  
  -- Calculate approximate backup size
  SELECT COALESCE(SUM(pg_total_relation_size(schemaname||'.'||tablename)), 0) INTO backup_size
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename = ANY(tables_list);
  
  -- Insert backup record
  INSERT INTO public.system_backups (
    backup_id,
    size,
    tables,
    type,
    status,
    metadata
  ) VALUES (
    backup_id,
    backup_size,
    tables_list,
    backup_type,
    'pending',
    jsonb_build_object(
      'created_by', auth.uid(),
      'tables_count', array_length(tables_list, 1),
      'compression_enabled', true,
      'encryption_enabled', true
    )
  ) RETURNING id INTO backup_uuid;
  
  -- Log the backup creation
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'backup_created',
    jsonb_build_object(
      'backup_id', backup_id,
      'size', backup_size,
      'tables', tables_list,
      'type', backup_type,
      'user_id', auth.uid(),
      'timestamp', now()
    )
  );
  
  RETURN backup_uuid;
END;
$$;

-- Create function to complete backup (if not exists)
CREATE OR REPLACE FUNCTION public.complete_system_backup(
  backup_uuid UUID,
  final_size BIGINT,
  success BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.system_backups 
  SET 
    size = final_size,
    status = CASE WHEN success THEN 'completed' ELSE 'failed' END,
    completed_at = now(),
    metadata = metadata || jsonb_build_object(
      'final_size', final_size,
      'success', success,
      'completion_time', now()
    )
  WHERE id = backup_uuid;
  
  -- Log the backup completion
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'backup_completed',
    jsonb_build_object(
      'backup_id', backup_uuid,
      'final_size', final_size,
      'success', success,
      'timestamp', now()
    )
  );
  
  RETURN FOUND;
END;
$$;

-- Create function to list backups (if not exists)
CREATE OR REPLACE FUNCTION public.list_system_backups(
  limit_count INTEGER DEFAULT 10,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  backup_id TEXT,
  size BIGINT,
  tables TEXT[],
  status TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sb.id,
    sb.backup_id,
    sb.size,
    sb.tables,
    sb.status,
    sb.type,
    sb.created_at,
    sb.completed_at,
    sb.metadata
  FROM public.system_backups sb
  ORDER BY sb.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Create function to get backup statistics (if not exists)
CREATE OR REPLACE FUNCTION public.get_backup_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_backups', COUNT(*),
    'successful_backups', COUNT(*) FILTER (WHERE status = 'completed'),
    'failed_backups', COUNT(*) FILTER (WHERE status = 'failed'),
    'pending_backups', COUNT(*) FILTER (WHERE status = 'pending'),
    'total_size', COALESCE(SUM(size), 0),
    'average_size', COALESCE(AVG(size), 0),
    'latest_backup', MAX(created_at),
    'oldest_backup', MIN(created_at)
  ) INTO stats
  FROM public.system_backups;
  
  RETURN stats;
END;
$$;

-- Ensure system_backups table exists
CREATE TABLE IF NOT EXISTS public.system_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id TEXT NOT NULL UNIQUE,
  size BIGINT NOT NULL, -- Size in bytes
  tables TEXT[] NOT NULL, -- Array of table names
  status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  type TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'automatic', 'scheduled'
  compression_enabled BOOLEAN NOT NULL DEFAULT true,
  encryption_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB -- Additional backup metadata
);

-- Enable RLS if not already enabled
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;

-- Create policies for system_backups (admin only) if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'system_backups' 
    AND policyname = 'Admins can manage system backups'
  ) THEN
    CREATE POLICY "Admins can manage system backups" 
    ON public.system_backups 
    FOR ALL 
    USING (is_current_user_admin())
    WITH CHECK (is_current_user_admin());
  END IF;
END $$;

-- Insert backup settings if not exists
INSERT INTO public.system_settings (key, value, description, category) VALUES
('backup_retention_days', '30', 'Dias de retenção de backups', 'performance'),
('backup_compression', 'true', 'Comprimir backups automaticamente', 'performance'),
('backup_encryption', 'true', 'Criptografar backups automaticamente', 'performance'),
('backup_schedule', '"daily"', 'Frequência de backup automático', 'performance')
ON CONFLICT (key) DO NOTHING; 