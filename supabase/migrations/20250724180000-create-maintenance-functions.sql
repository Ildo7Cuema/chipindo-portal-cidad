-- Create maintenance functions for database optimization and integrity checks

-- Function to optimize database
CREATE OR REPLACE FUNCTION public.optimize_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
  table_name TEXT;
  table_record RECORD;
BEGIN
  start_time := now();
  
  -- Log optimization start
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'maintenance_action',
    jsonb_build_object(
      'action', 'optimize_database_start',
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );

  -- Analyze all tables
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ANALYZE %I', table_record.tablename);
  END LOOP;

  -- Vacuum tables
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('VACUUM %I', table_record.tablename);
  END LOOP;

  -- Update statistics
  ANALYZE;

  end_time := now();

  -- Log optimization completion
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'maintenance_action',
    jsonb_build_object(
      'action', 'optimize_database_complete',
      'duration', EXTRACT(EPOCH FROM (end_time - start_time)),
      'success', true,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error
    INSERT INTO public.system_stats (metric_name, metric_value)
    VALUES (
      'maintenance_action',
      jsonb_build_object(
        'action', 'optimize_database_error',
        'error', SQLERRM,
        'success', false,
        'timestamp', now(),
        'user_id', auth.uid()
      )
    );
    
    RETURN FALSE;
END;
$$;

-- Function to get database statistics
CREATE OR REPLACE FUNCTION public.get_database_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
  total_size BIGINT;
  table_count INTEGER;
  index_count INTEGER;
  fragmentation_estimate NUMERIC;
BEGIN
  -- Calculate total database size
  SELECT COALESCE(SUM(pg_total_relation_size(schemaname||'.'||tablename)), 0)
  INTO total_size
  FROM pg_tables 
  WHERE schemaname = 'public';

  -- Count tables
  SELECT COUNT(*) INTO table_count
  FROM pg_tables 
  WHERE schemaname = 'public';

  -- Count indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'public';

  -- Estimate fragmentation (simplified)
  SELECT COALESCE(AVG(100 - (heap_blks_hit::float / (heap_blks_hit + heap_blks_read)) * 100), 0)
  INTO fragmentation_estimate
  FROM pg_statio_user_tables;

  stats := jsonb_build_object(
    'size', total_size,
    'tables', table_count,
    'indexes', index_count,
    'fragmentation', fragmentation_estimate,
    'last_optimized', now()
  );

  RETURN stats;
END;
$$;

-- Function to vacuum database
CREATE OR REPLACE FUNCTION public.vacuum_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_record RECORD;
BEGIN
  -- Vacuum all tables
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('VACUUM %I', table_record.tablename);
  END LOOP;

  -- Log vacuum completion
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'maintenance_action',
    jsonb_build_object(
      'action', 'vacuum_database',
      'success', true,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error
    INSERT INTO public.system_stats (metric_name, metric_value)
    VALUES (
      'maintenance_action',
      jsonb_build_object(
        'action', 'vacuum_database_error',
        'error', SQLERRM,
        'success', false,
        'timestamp', now(),
        'user_id', auth.uid()
      )
    );
    
    RETURN FALSE;
END;
$$;

-- Function to reindex database
CREATE OR REPLACE FUNCTION public.reindex_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  index_record RECORD;
BEGIN
  -- Reindex all indexes
  FOR index_record IN 
    SELECT indexname 
    FROM pg_indexes 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('REINDEX INDEX %I', index_record.indexname);
  END LOOP;

  -- Log reindex completion
  INSERT INTO public.system_stats (metric_name, metric_value)
  VALUES (
    'maintenance_action',
    jsonb_build_object(
      'action', 'reindex_database',
      'success', true,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  );

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error
    INSERT INTO public.system_stats (metric_name, metric_value)
    VALUES (
      'maintenance_action',
      jsonb_build_object(
        'action', 'reindex_database_error',
        'error', SQLERRM,
        'success', false,
        'timestamp', now(),
        'user_id', auth.uid()
      )
    );
    
    RETURN FALSE;
END;
$$;

-- Function to get table sizes
CREATE OR REPLACE FUNCTION public.get_table_sizes()
RETURNS TABLE (
  table_name TEXT,
  size BIGINT,
  row_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::TEXT,
    pg_total_relation_size(schemaname||'.'||tablename) as size,
    (SELECT reltuples FROM pg_class WHERE relname = t.tablename) as row_count
  FROM pg_tables t
  WHERE schemaname = 'public'
  ORDER BY size DESC;
END;
$$;

-- Function to check missing indexes
CREATE OR REPLACE FUNCTION public.check_missing_indexes()
RETURNS TABLE (
  table_name TEXT,
  column_name TEXT,
  recommendation TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::TEXT,
    c.column_name::TEXT,
    'Consider adding index on ' || c.column_name || ' for table ' || t.table_name as recommendation
  FROM information_schema.tables t
  JOIN information_schema.columns c ON t.table_name = c.table_name
  WHERE t.table_schema = 'public'
    AND c.column_name IN ('user_id', 'created_at', 'updated_at', 'status')
    AND NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = t.table_name 
        AND indexdef LIKE '%' || c.column_name || '%'
    )
  LIMIT 10;
END;
$$;

-- Function to get maintenance statistics
CREATE OR REPLACE FUNCTION public.get_maintenance_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
  cache_clears INTEGER;
  db_optimizations INTEGER;
  backups_created INTEGER;
  integrity_checks INTEGER;
  last_maintenance TIMESTAMP;
BEGIN
  -- Count maintenance actions
  SELECT COUNT(*) INTO cache_clears
  FROM system_stats 
  WHERE metric_name = 'maintenance_action' 
    AND metric_value->>'action' LIKE '%cache%';

  SELECT COUNT(*) INTO db_optimizations
  FROM system_stats 
  WHERE metric_name = 'maintenance_action' 
    AND metric_value->>'action' LIKE '%database%';

  SELECT COUNT(*) INTO backups_created
  FROM system_stats 
  WHERE metric_name = 'maintenance_action' 
    AND metric_value->>'action' LIKE '%backup%';

  SELECT COUNT(*) INTO integrity_checks
  FROM system_stats 
  WHERE metric_name = 'maintenance_action' 
    AND metric_value->>'action' LIKE '%integrity%';

  -- Get last maintenance
  SELECT MAX(created_at) INTO last_maintenance
  FROM system_stats 
  WHERE metric_name = 'maintenance_action';

  stats := jsonb_build_object(
    'cache_clears', cache_clears,
    'db_optimizations', db_optimizations,
    'backups_created', backups_created,
    'integrity_checks', integrity_checks,
    'last_maintenance', last_maintenance,
    'total_actions', cache_clears + db_optimizations + backups_created + integrity_checks
  );

  RETURN stats;
END;
$$;

-- Insert maintenance settings into system_settings
INSERT INTO public.system_settings (key, value, description, category) VALUES
('maintenance_auto_optimize', 'false', 'Otimização automática do banco de dados', 'maintenance'),
('maintenance_auto_backup', 'true', 'Backup automático antes de manutenção', 'maintenance'),
('maintenance_log_retention', '30', 'Dias de retenção de logs de manutenção', 'maintenance'),
('maintenance_notifications', 'true', 'Notificações de manutenção', 'maintenance')
ON CONFLICT (key) DO NOTHING; 