# Troubleshooting - Funções de Backup Não Encontradas

## 🔍 Problema Identificado

O erro `404 (Not Found)` ao tentar chamar `create_system_backup` indica que a função não foi encontrada no banco de dados. Isso acontece porque as migrações que criam essas funções podem não ter sido aplicadas.

## 🛠️ Soluções

### Solução 1: Verificar se as Migrações Foram Aplicadas

Execute o script de teste para verificar o status das funções:

```bash
node scripts/test-backup-functions.js
```

### Solução 2: Aplicar Migrações Manualmente

Se as funções não existem, você pode aplicá-las manualmente:

#### Opção A: Via Supabase Dashboard

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Execute a seguinte migração:

```sql
-- Create system_backups table if not exists
CREATE TABLE IF NOT EXISTS public.system_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id TEXT NOT NULL UNIQUE,
  size BIGINT NOT NULL,
  tables TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  type TEXT NOT NULL DEFAULT 'manual',
  compression_enabled BOOLEAN NOT NULL DEFAULT true,
  encryption_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;

-- Create function to create backup
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
  
  RETURN backup_uuid;
END;
$$;

-- Create function to complete backup
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
  
  RETURN FOUND;
END;
$$;

-- Create function to get backup stats
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
```

#### Opção B: Via Script Node.js

Execute o script de aplicação de migrações:

```bash
node scripts/apply-migrations.js
```

### Solução 3: Verificar Permissões

Certifique-se de que o usuário tem permissões para executar as funções:

```sql
-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_system_backup(TEXT, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_system_backup(UUID, BIGINT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_backup_stats() TO authenticated;
```

## 🔧 Funções de Manutenção

Se as funções de manutenção também não estiverem disponíveis, execute:

```sql
-- Create optimize_database function
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
  RETURN TRUE;
END;
$$;

-- Create vacuum_database function
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

  RETURN TRUE;
END;
$$;

-- Create reindex_database function
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

  RETURN TRUE;
END;
$$;
```

## 🧪 Teste das Funções

Após aplicar as migrações, teste as funções:

```bash
# Testar funções de backup
node scripts/test-backup-functions.js

# Testar funções de manutenção
node scripts/test-maintenance.js
```

## 🔍 Verificação Manual

Para verificar se as funções foram criadas corretamente:

```sql
-- List all functions
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%backup%';

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'system_backups';
```

## 🚨 Problemas Comuns

### Erro: "function does not exist"
- **Causa**: Função não foi criada
- **Solução**: Execute as migrações SQL acima

### Erro: "permission denied"
- **Causa**: Usuário não tem permissões
- **Solução**: Execute os comandos GRANT acima

### Erro: "table does not exist"
- **Causa**: Tabela system_backups não foi criada
- **Solução**: Execute o CREATE TABLE acima

### Erro: "RLS policy violation"
- **Causa**: Política de segurança bloqueando acesso
- **Solução**: Verifique se o usuário é admin

## ✅ Checklist de Verificação

- [ ] Tabela `system_backups` existe
- [ ] Função `create_system_backup` existe
- [ ] Função `complete_system_backup` existe
- [ ] Função `get_backup_stats` existe
- [ ] Função `optimize_database` existe
- [ ] Função `vacuum_database` existe
- [ ] Função `reindex_database` existe
- [ ] Permissões estão configuradas
- [ ] RLS está habilitado
- [ ] Políticas de segurança estão configuradas

## 🎯 Resultado Esperado

Após aplicar as correções, você deve conseguir:

1. **Criar backups** sem erros 404
2. **Otimizar banco de dados** sem erros
3. **Executar vacuum e reindex** sem problemas
4. **Ver estatísticas** de backup e manutenção
5. **Usar todas as funcionalidades** na interface

## 📞 Suporte

Se os problemas persistirem:

1. Verifique os logs do Supabase
2. Execute os scripts de teste
3. Verifique as permissões do usuário
4. Consulte a documentação do Supabase

As funções devem estar funcionando corretamente após aplicar estas correções! 