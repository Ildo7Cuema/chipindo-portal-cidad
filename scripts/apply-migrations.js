const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Function to read migration file
function readMigrationFile(filename) {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
  return fs.readFileSync(migrationPath, 'utf8');
}

// Function to apply migration
async function applyMigration(filename) {
  console.log(`📦 Aplicando migração: ${filename}`);
  
  try {
    const sql = readMigrationFile(filename);
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`   Executando: ${statement.substring(0, 100)}...`);
        
        const { error } = await supabase
          .rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          console.error(`   ❌ Erro: ${error.message}`);
          return false;
        }
      }
    }
    
    console.log(`   ✅ Migração aplicada com sucesso: ${filename}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Erro ao aplicar migração ${filename}:`, error);
    return false;
  }
}

// Function to check if function exists
async function functionExists(functionName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .eq('routine_name', functionName);
    
    if (error) {
      console.error(`Erro ao verificar função ${functionName}:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Erro ao verificar função ${functionName}:`, error);
    return false;
  }
}

// Function to create backup functions manually
async function createBackupFunctions() {
  console.log('🔧 Criando funções de backup...');
  
  const functions = [
    {
      name: 'create_system_backup',
      sql: `
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
      `
    },
    {
      name: 'complete_system_backup',
      sql: `
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
      `
    },
    {
      name: 'get_backup_stats',
      sql: `
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
      `
    }
  ];
  
  for (const func of functions) {
    const exists = await functionExists(func.name);
    
    if (!exists) {
      console.log(`   Criando função: ${func.name}`);
      
      try {
        const { error } = await supabase
          .rpc('exec_sql', { sql: func.sql });
        
        if (error) {
          console.error(`   ❌ Erro ao criar função ${func.name}:`, error);
          return false;
        } else {
          console.log(`   ✅ Função criada: ${func.name}`);
        }
      } catch (error) {
        console.error(`   ❌ Erro ao criar função ${func.name}:`, error);
        return false;
      }
    } else {
      console.log(`   ✅ Função já existe: ${func.name}`);
    }
  }
  
  return true;
}

// Function to create maintenance functions
async function createMaintenanceFunctions() {
  console.log('🔧 Criando funções de manutenção...');
  
  const functions = [
    {
      name: 'optimize_database',
      sql: `
        CREATE OR REPLACE FUNCTION public.optimize_database()
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          start_time TIMESTAMP;
          end_time TIMESTAMP;
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
      `
    },
    {
      name: 'vacuum_database',
      sql: `
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
      `
    },
    {
      name: 'reindex_database',
      sql: `
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
      `
    }
  ];
  
  for (const func of functions) {
    const exists = await functionExists(func.name);
    
    if (!exists) {
      console.log(`   Criando função: ${func.name}`);
      
      try {
        const { error } = await supabase
          .rpc('exec_sql', { sql: func.sql });
        
        if (error) {
          console.error(`   ❌ Erro ao criar função ${func.name}:`, error);
          return false;
        } else {
          console.log(`   ✅ Função criada: ${func.name}`);
        }
      } catch (error) {
        console.error(`   ❌ Erro ao criar função ${func.name}:`, error);
        return false;
      }
    } else {
      console.log(`   ✅ Função já existe: ${func.name}`);
    }
  }
  
  return true;
}

// Main function
async function main() {
  console.log('🚀 Iniciando aplicação de migrações...\n');
  
  try {
    // Create backup functions
    const backupSuccess = await createBackupFunctions();
    if (!backupSuccess) {
      console.error('❌ Falha ao criar funções de backup');
      return;
    }
    
    console.log('');
    
    // Create maintenance functions
    const maintenanceSuccess = await createMaintenanceFunctions();
    if (!maintenanceSuccess) {
      console.error('❌ Falha ao criar funções de manutenção');
      return;
    }
    
    console.log('\n✅ Todas as migrações foram aplicadas com sucesso!');
    console.log('🎯 As funções de backup e manutenção estão agora disponíveis.');
    
  } catch (error) {
    console.error('❌ Erro durante a aplicação de migrações:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  applyMigration,
  createBackupFunctions,
  createMaintenanceFunctions,
  functionExists
}; 