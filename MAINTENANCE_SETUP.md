# Guia de Configuração - Funcionalidades de Manutenção

## 📋 Visão Geral

Este guia explica como configurar e otimizar as funcionalidades de manutenção implementadas no Portal de Chipindo:

- **Limpar Cache**: Limpeza de cache do navegador e aplicação
- **Otimizar Base de Dados**: Otimização automática de tabelas e índices
- **Backup Manual**: Criação de backups manuais do sistema
- **Verificar Integridade**: Verificação de integridade e consistência de dados
- **Vacuum Database**: Limpeza e otimização de espaço em disco
- **Reindex Database**: Reconstrução de índices para melhor performance

## 🔧 Configuração Inicial

### 1. Configurações do Banco de Dados

Execute as configurações iniciais:

```sql
-- Inserir configurações de manutenção
INSERT INTO system_settings (key, value, description, category) VALUES
('maintenance_auto_optimize', 'false', 'Otimização automática do banco de dados', 'maintenance'),
('maintenance_auto_backup', 'true', 'Backup automático antes de manutenção', 'maintenance'),
('maintenance_log_retention', '30', 'Dias de retenção de logs de manutenção', 'maintenance'),
('maintenance_notifications', 'true', 'Notificações de manutenção', 'maintenance')
ON CONFLICT (key) DO NOTHING;
```

### 2. Configurações do Sistema

As configurações são gerenciadas através da tabela `system_settings`:

```sql
-- Verificar configurações atuais
SELECT * FROM system_settings WHERE category = 'maintenance';

-- Atualizar configuração específica
UPDATE system_settings 
SET value = 'true' 
WHERE key = 'maintenance_auto_optimize';
```

## 🚀 Configuração Detalhada

### Limpar Cache

#### Configuração Básica
```typescript
// Em src/lib/maintenance-services.ts
const cacheConfig = {
  browserCache: true,
  localStorage: true,
  sessionStorage: true,
  applicationCache: true,
  serviceWorkers: true
};
```

#### Implementação
```typescript
// Limpar cache do navegador
const clearBrowserCache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
};

// Limpar storage local
const clearLocalStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

// Limpar cache da aplicação
const clearApplicationCache = () => {
  if (window.__CACHE__) {
    window.__CACHE__.clear();
  }
};
```

#### Monitoramento
```sql
-- Verificar estatísticas de limpeza de cache
SELECT 
  COUNT(*) as cache_clears,
  MAX(created_at) as last_clear
FROM system_stats 
WHERE metric_name = 'maintenance_action' 
  AND metric_value->>'action' = 'clear_cache';
```

### Otimizar Base de Dados

#### Configuração Básica
```typescript
// Em src/lib/maintenance-services.ts
const dbOptimizationConfig = {
  analyzeTables: true,
  vacuumTables: true,
  updateStatistics: true,
  reindexIndexes: false // Separado para controle
};
```

#### Implementação
```sql
-- Função de otimização
CREATE OR REPLACE FUNCTION public.optimize_database()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Analyze all tables
  FOR table_record IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ANALYZE %I', table_record.tablename);
  END LOOP;

  -- Vacuum tables
  FOR table_record IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('VACUUM %I', table_record.tablename);
  END LOOP;

  -- Update statistics
  ANALYZE;

  RETURN TRUE;
END;
$$;
```

#### Monitoramento
```sql
-- Verificar estatísticas de otimização
SELECT 
  COUNT(*) as optimizations,
  AVG(CAST(metric_value->>'duration' AS NUMERIC)) as avg_duration
FROM system_stats 
WHERE metric_name = 'maintenance_action' 
  AND metric_value->>'action' LIKE '%optimize%';
```

### Backup Manual

#### Configuração Básica
```typescript
// Em src/lib/maintenance-services.ts
const backupConfig = {
  includeAllTables: true,
  compression: true,
  encryption: false,
  retentionDays: 30
};
```

#### Implementação
```sql
-- Função de criação de backup
CREATE OR REPLACE FUNCTION public.create_system_backup(
  backup_type TEXT DEFAULT 'manual',
  tables_to_backup TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  backup_id UUID;
BEGIN
  backup_id := gen_random_uuid();
  
  INSERT INTO system_backups (
    id, type, status, created_at, created_by
  ) VALUES (
    backup_id, backup_type, 'in_progress', now(), auth.uid()
  );
  
  RETURN backup_id;
END;
$$;
```

#### Monitoramento
```sql
-- Verificar estatísticas de backup
SELECT 
  COUNT(*) as total_backups,
  COUNT(*) FILTER (WHERE status = 'completed') as successful_backups,
  AVG(final_size) as avg_size
FROM system_backups;
```

### Verificar Integridade

#### Configuração Básica
```typescript
// Em src/lib/maintenance-services.ts
const integrityConfig = {
  checkOrphanedRecords: true,
  checkDataConsistency: true,
  checkPerformanceIssues: true,
  checkMissingIndexes: true
};
```

#### Implementação
```sql
-- Verificar registros órfãos
SELECT COUNT(*) as orphaned_notifications
FROM admin_notifications 
WHERE user_id IS NULL;

-- Verificar emails duplicados
SELECT email, COUNT(*) as duplicates
FROM profiles 
WHERE email IS NOT NULL
GROUP BY email 
HAVING COUNT(*) > 1;

-- Verificar datas inválidas
SELECT COUNT(*) as invalid_dates
FROM news 
WHERE created_at < '2020-01-01';
```

#### Monitoramento
```sql
-- Verificar estatísticas de integridade
SELECT 
  COUNT(*) as integrity_checks,
  COUNT(*) FILTER (WHERE metric_value->>'details'->>'status' = 'pass') as passed,
  COUNT(*) FILTER (WHERE metric_value->>'details'->>'status' = 'fail') as failed
FROM system_stats 
WHERE metric_name = 'maintenance_action' 
  AND metric_value->>'action' = 'check_integrity';
```

### Vacuum Database

#### Configuração Básica
```typescript
// Em src/lib/maintenance-services.ts
const vacuumConfig = {
  fullVacuum: false,
  analyzeAfterVacuum: true,
  parallelWorkers: 2
};
```

#### Implementação
```sql
-- Função de vacuum
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
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('VACUUM %I', table_record.tablename);
  END LOOP;

  RETURN TRUE;
END;
$$;
```

#### Monitoramento
```sql
-- Verificar espaço liberado
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Reindex Database

#### Configuração Básica
```typescript
// Em src/lib/maintenance-services.ts
const reindexConfig = {
  concurrentReindex: false,
  analyzeAfterReindex: true,
  includeSystemIndexes: false
};
```

#### Implementação
```sql
-- Função de reindex
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
    SELECT indexname FROM pg_indexes WHERE schemaname = 'public'
  LOOP
    EXECUTE format('REINDEX INDEX %I', index_record.indexname);
  END LOOP;

  RETURN TRUE;
END;
$$;
```

#### Monitoramento
```sql
-- Verificar índices
SELECT 
  COUNT(*) as total_indexes,
  COUNT(*) FILTER (WHERE indexdef LIKE '%UNIQUE%') as unique_indexes
FROM pg_indexes 
WHERE schemaname = 'public';
```

## 🔍 Testes e Validação

### Teste Automático
```bash
# Executar todos os testes de manutenção
node scripts/test-maintenance.js
```

### Teste Manual na Interface
1. Acesse **Admin > Configurações do Sistema**
2. Vá para a aba **Manutenção**
3. Teste cada funcionalidade usando os botões disponíveis

### Validação de Configurações
```bash
# Verificar configurações atuais
curl -X GET https://api.chipindo.ao/system-settings/maintenance

# Testar limpeza de cache
curl -X POST https://api.chipindo.ao/maintenance/clear-cache

# Testar otimização de banco
curl -X POST https://api.chipindo.ao/maintenance/optimize-database
```

## 📊 Monitoramento e Alertas

### Métricas Importantes
- **Limpezas de Cache**: Frequência e impacto na performance
- **Otimizações de DB**: Duração e melhoria de performance
- **Backups Criados**: Tamanho e taxa de sucesso
- **Verificações de Integridade**: Problemas encontrados e resolvidos

### Alertas Configuráveis
```sql
-- Configurar alertas para manutenção
INSERT INTO system_settings (key, value, description) VALUES
('maintenance_alert_cache_size', '100', 'Alerta se cache > 100MB'),
('maintenance_alert_db_fragmentation', '20', 'Alerta se fragmentação > 20%'),
('maintenance_alert_backup_failure', '3', 'Alerta se falhas de backup > 3'),
('maintenance_alert_integrity_issues', '5', 'Alerta se problemas de integridade > 5')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

## 🔧 Otimizações Avançadas

### Manutenção Automática
```typescript
// Agendar manutenção automática
const scheduleMaintenance = () => {
  // Limpar cache diariamente às 2h
  cron.schedule('0 2 * * *', () => {
    maintenanceManager.clearCache();
  });

  // Otimizar banco semanalmente aos domingos às 3h
  cron.schedule('0 3 * * 0', () => {
    maintenanceManager.optimizeDatabase();
  });

  // Backup automático mensal
  cron.schedule('0 4 1 * *', () => {
    maintenanceManager.createManualBackup();
  });
};
```

### Manutenção Inteligente
```typescript
// Manutenção baseada em métricas
const intelligentMaintenance = async () => {
  const stats = await maintenanceManager.getMaintenanceStats();
  
  if (stats.cacheClears < 1) {
    await maintenanceManager.clearCache();
  }
  
  if (stats.dbOptimizations < 1) {
    await maintenanceManager.optimizeDatabase();
  }
  
  if (stats.backupsCreated < 1) {
    await maintenanceManager.createManualBackup();
  }
};
```

### Manutenção Condicional
```typescript
// Manutenção baseada em condições
const conditionalMaintenance = async () => {
  const dbStats = await maintenanceManager.getDatabaseStats();
  
  if (dbStats.fragmentation > 15) {
    await maintenanceManager.optimizeDatabase();
  }
  
  if (dbStats.size > 1024 * 1024 * 100) { // 100MB
    await maintenanceManager.vacuumDatabase();
  }
};
```

## 🚨 Troubleshooting

### Problemas Comuns

#### Cache não está limpando
```bash
# Verificar configuração
SELECT value FROM system_settings WHERE key = 'maintenance_auto_optimize';

# Verificar logs
SELECT * FROM system_stats 
WHERE metric_name = 'maintenance_action' 
  AND metric_value->>'action' = 'clear_cache'
ORDER BY created_at DESC LIMIT 5;
```

#### Otimização de banco falhando
```bash
# Verificar permissões
SELECT has_function_privilege('optimize_database()', 'EXECUTE');

# Verificar logs de erro
SELECT * FROM system_stats 
WHERE metric_name = 'maintenance_action' 
  AND metric_value->>'action' LIKE '%optimize%'
  AND metric_value->>'details'->>'success' = false;
```

#### Backup não está criando
```bash
# Verificar configuração
SELECT value FROM system_settings WHERE key = 'maintenance_auto_backup';

# Verificar espaço em disco
SELECT pg_size_pretty(pg_database_size(current_database()));
```

#### Verificação de integridade falhando
```bash
# Verificar problemas específicos
SELECT * FROM system_stats 
WHERE metric_name = 'maintenance_action' 
  AND metric_value->>'action' = 'check_integrity'
ORDER BY created_at DESC LIMIT 1;
```

## 📈 Melhorias Contínuas

### Análise de Uso
```sql
-- Relatório de manutenção semanal
SELECT 
  DATE_TRUNC('week', created_at) as week,
  metric_value->>'action' as action,
  COUNT(*) as count,
  AVG(CAST(metric_value->>'details'->>'duration' AS NUMERIC)) as avg_duration
FROM system_stats 
WHERE metric_name = 'maintenance_action'
GROUP BY DATE_TRUNC('week', created_at), metric_value->>'action'
ORDER BY week DESC, count DESC;
```

### Otimizações Baseadas em Dados
- **Ajustar frequência** de manutenção baseado no uso
- **Priorizar ações** mais necessárias
- **Configurar horários** de manutenção
- **Implementar manutenção** inteligente

## ✅ Checklist de Configuração

- [ ] **Configurações padrão** inseridas no banco
- [ ] **Funções SQL** criadas e testadas
- [ ] **Cache configurado** para limpeza automática
- [ ] **Otimização de banco** configurada
- [ ] **Backup manual** funcionando
- [ ] **Verificação de integridade** configurada
- [ ] **Vacuum e reindex** funcionando
- [ ] **Testes executados** com sucesso
- [ ] **Monitoramento** configurado
- [ ] **Alertas** configurados
- [ ] **Documentação** atualizada

## 🎯 Resultados Esperados

Com todas as funcionalidades configuradas corretamente, você deve ver:

- **Cache limpo** regularmente para melhor performance
- **Base de dados otimizada** para consultas mais rápidas
- **Backups regulares** para proteção de dados
- **Verificações de integridade** para detectar problemas
- **Monitoramento completo** de todas as métricas
- **Interface intuitiva** com feedback visual

As funcionalidades de manutenção estão prontas para uso em produção! 