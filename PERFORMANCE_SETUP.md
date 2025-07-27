# Guia de Configuração - Funcionalidades de Performance

## 📋 Visão Geral

Este guia explica como configurar e otimizar as funcionalidades de performance implementadas no Portal de Chipindo:

- **Cache Habilitado**: Melhora a performance do site
- **Compressão**: Comprime arquivos para carregamento mais rápido
- **CDN**: Usa CDN para distribuição global
- **Backup Automático**: Faz backup automático dos dados

## 🔧 Configuração Inicial

### 1. Configurações do Banco de Dados

Execute a migração para criar as tabelas necessárias:

```bash
# Aplicar migração de backups
supabase db push
```

### 2. Configurações do Sistema

As configurações são gerenciadas através da tabela `system_settings`:

```sql
-- Verificar configurações atuais
SELECT * FROM system_settings WHERE category = 'performance';

-- Configurações padrão
INSERT INTO system_settings (key, value, description, category) VALUES
('cache_enabled', 'true', 'Habilitar cache do sistema', 'performance'),
('compression_enabled', 'true', 'Habilitar compressão de dados', 'performance'),
('cdn_enabled', 'false', 'Habilitar CDN', 'performance'),
('auto_backup', 'true', 'Habilitar backup automático', 'performance'),
('backup_retention_days', '30', 'Dias de retenção de backups', 'performance'),
('backup_compression', 'true', 'Comprimir backups automaticamente', 'performance'),
('backup_encryption', 'true', 'Criptografar backups automaticamente', 'performance'),
('backup_schedule', '"daily"', 'Frequência de backup automático', 'performance')
ON CONFLICT (key) DO NOTHING;
```

## 🚀 Configuração Detalhada

### Cache Habilitado

#### Configuração Básica
```typescript
// Em src/lib/performance-services.ts
const cacheConfig = {
  enabled: true,
  maxAge: 3600, // 1 hora
  maxSize: 50, // 50MB
  strategy: 'memory' // 'memory' | 'localStorage' | 'sessionStorage'
};
```

#### Otimizações Recomendadas
```typescript
// Cache para diferentes tipos de dados
const cacheStrategies = {
  news: { maxAge: 1800, maxSize: 10 }, // 30 min, 10MB
  concursos: { maxAge: 7200, maxSize: 5 }, // 2 horas, 5MB
  users: { maxAge: 3600, maxSize: 2 }, // 1 hora, 2MB
  static: { maxAge: 86400, maxSize: 20 } // 24 horas, 20MB
};
```

#### Monitoramento
```sql
-- Verificar estatísticas de cache
SELECT 
  metric_name,
  metric_value->>'cache_size' as cache_size,
  metric_value->>'hit_rate' as hit_rate
FROM system_stats 
WHERE metric_name LIKE 'cache_%'
ORDER BY created_at DESC;
```

### Compressão

#### Configuração Básica
```typescript
// Em src/lib/performance-services.ts
const compressionConfig = {
  enabled: true,
  algorithm: 'gzip', // 'gzip' | 'brotli' | 'deflate'
  level: 6, // 1-9 (maior = mais compressão, mais CPU)
  minSize: 1024 // Comprimir apenas arquivos > 1KB
};
```

#### Otimizações por Tipo de Conteúdo
```typescript
const compressionRules = {
  text: { algorithm: 'gzip', level: 6 },
  images: { algorithm: 'brotli', level: 4 },
  json: { algorithm: 'gzip', level: 8 },
  html: { algorithm: 'gzip', level: 7 }
};
```

#### Monitoramento
```sql
-- Verificar estatísticas de compressão
SELECT 
  metric_name,
  metric_value->>'compression_ratio' as ratio,
  metric_value->>'original_size' as original,
  metric_value->>'compressed_size' as compressed
FROM system_stats 
WHERE metric_name LIKE 'compression_%'
ORDER BY created_at DESC;
```

### CDN

#### Configuração Básica
```typescript
// Em src/lib/performance-services.ts
const cdnConfig = {
  enabled: true,
  provider: 'cloudflare', // 'cloudflare' | 'aws' | 'azure' | 'custom'
  domain: 'cdn.chipindo.ao',
  regions: ['us-east-1', 'eu-west-1', 'af-south-1']
};
```

#### Configuração Cloudflare
1. **Criar conta** no Cloudflare
2. **Adicionar domínio** chipindo.ao
3. **Configurar DNS** para apontar para o servidor
4. **Ativar CDN** para subdomínio cdn.chipindo.ao

#### Configuração AWS CloudFront
```json
{
  "DistributionConfig": {
    "Origins": {
      "Items": [
        {
          "Id": "chipindo-origin",
          "DomainName": "your-server.com",
          "CustomOriginConfig": {
            "HTTPPort": 80,
            "HTTPSPort": 443,
            "OriginProtocolPolicy": "https-only"
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "chipindo-origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "MinTTL": 0,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    }
  }
}
```

#### Monitoramento
```sql
-- Verificar estatísticas de CDN
SELECT 
  metric_name,
  metric_value->>'hit_rate' as hit_rate,
  metric_value->>'operation' as operation
FROM system_stats 
WHERE metric_name LIKE 'cdn_%'
ORDER BY created_at DESC;
```

### Backup Automático

#### Configuração Básica
```typescript
// Em src/lib/performance-services.ts
const backupConfig = {
  enabled: true,
  frequency: 'daily', // 'hourly' | 'daily' | 'weekly' | 'monthly'
  retention: 30, // dias
  compression: true,
  encryption: true
};
```

#### Configuração de Armazenamento
```sql
-- Configurar backup para armazenamento externo
UPDATE system_settings 
SET value = 'true' 
WHERE key = 'backup_external_storage';

-- Configurar S3 (se usando AWS)
UPDATE system_settings 
SET value = '{"bucket": "chipindo-backups", "region": "us-east-1"}' 
WHERE key = 'backup_s3_config';
```

#### Agendamento de Backup
```sql
-- Configurar backup diário às 2:00 AM
INSERT INTO system_settings (key, value, description) VALUES
('backup_schedule_time', '02:00', 'Horário do backup automático'),
('backup_schedule_timezone', 'Africa/Luanda', 'Fuso horário do backup')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

#### Monitoramento
```sql
-- Verificar backups
SELECT 
  backup_id,
  size,
  status,
  created_at,
  completed_at
FROM system_backups 
ORDER BY created_at DESC 
LIMIT 10;

-- Estatísticas de backup
SELECT * FROM get_backup_stats();
```

## 🔍 Testes e Validação

### Teste Automático
```bash
# Executar todos os testes de performance
node scripts/test-performance.js
```

### Teste Manual na Interface
1. Acesse **Admin > Configurações do Sistema**
2. Vá para a aba **Performance**
3. Teste cada funcionalidade usando os botões disponíveis

### Validação de Performance
```bash
# Teste de carga (requer Apache Bench)
ab -n 1000 -c 10 https://chipindo.ao/

# Teste de velocidade
curl -w "@curl-format.txt" -o /dev/null -s https://chipindo.ao/
```

## 📊 Monitoramento e Alertas

### Métricas Importantes
- **Cache Hit Rate**: > 80%
- **Compression Ratio**: > 70%
- **CDN Hit Rate**: > 90%
- **Backup Success Rate**: > 95%
- **Response Time**: < 200ms
- **Uptime**: > 99.9%

### Alertas Configuráveis
```sql
-- Configurar alertas
INSERT INTO system_settings (key, value, description) VALUES
('performance_alert_cache_hit_rate', '80', 'Alerta se cache hit rate < 80%'),
('performance_alert_response_time', '200', 'Alerta se response time > 200ms'),
('performance_alert_backup_failure', 'true', 'Alerta em caso de falha de backup')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

## 🔧 Otimizações Avançadas

### Cache Inteligente
```typescript
// Cache baseado em padrões de uso
const smartCache = {
  // Cache mais agressivo para conteúdo popular
  popular: { maxAge: 3600, maxSize: 20 },
  // Cache conservador para conteúdo dinâmico
  dynamic: { maxAge: 300, maxSize: 5 },
  // Cache longo para conteúdo estático
  static: { maxAge: 86400, maxSize: 50 }
};
```

### Compressão Adaptativa
```typescript
// Compressão baseada no tipo de conteúdo
const adaptiveCompression = {
  html: { algorithm: 'gzip', level: 7 },
  css: { algorithm: 'brotli', level: 8 },
  js: { algorithm: 'gzip', level: 6 },
  images: { algorithm: 'brotli', level: 4 },
  json: { algorithm: 'gzip', level: 8 }
};
```

### CDN Multi-Região
```typescript
// CDN configurado para múltiplas regiões
const multiRegionCDN = {
  regions: [
    { name: 'us-east-1', weight: 0.3 },
    { name: 'eu-west-1', weight: 0.3 },
    { name: 'af-south-1', weight: 0.4 }
  ],
  failover: true,
  healthCheck: true
};
```

## 🚨 Troubleshooting

### Problemas Comuns

#### Cache não está funcionando
```bash
# Verificar configuração
SELECT value FROM system_settings WHERE key = 'cache_enabled';

# Limpar cache
curl -X POST https://api.chipindo.ao/admin/clear-cache
```

#### Compressão não está ativa
```bash
# Verificar headers de resposta
curl -I https://chipindo.ao/ | grep -i "content-encoding"

# Verificar configuração
SELECT value FROM system_settings WHERE key = 'compression_enabled';
```

#### CDN não está funcionando
```bash
# Verificar DNS
nslookup cdn.chipindo.ao

# Verificar cache CDN
curl -I https://cdn.chipindo.ao/ | grep -i "cf-cache-status"
```

#### Backup falhando
```bash
# Verificar logs
SELECT * FROM system_stats WHERE metric_name LIKE 'backup_%' ORDER BY created_at DESC LIMIT 5;

# Verificar espaço em disco
df -h

# Verificar permissões
ls -la /backup/
```

## 📈 Melhorias Contínuas

### Análise de Performance
```sql
-- Relatório de performance semanal
SELECT 
  DATE_TRUNC('week', created_at) as week,
  AVG(CAST(metric_value->>'response_time' AS INTEGER)) as avg_response_time,
  AVG(CAST(metric_value->>'cache_hit_rate' AS FLOAT)) as avg_cache_hit_rate,
  COUNT(*) as total_requests
FROM system_stats 
WHERE metric_name = 'performance_metrics'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week DESC;
```

### Otimizações Baseadas em Dados
- **Ajustar TTL** do cache baseado no padrão de uso
- **Otimizar compressão** para tipos de conteúdo específicos
- **Configurar CDN** para regiões com mais tráfego
- **Ajustar frequência** de backup baseado na atividade

## ✅ Checklist de Configuração

- [ ] **Migração aplicada** no banco de dados
- [ ] **Configurações padrão** inseridas
- [ ] **CDN configurado** (se aplicável)
- [ ] **Backup automático** configurado
- [ ] **Testes executados** com sucesso
- [ ] **Monitoramento** configurado
- [ ] **Alertas** configurados
- [ ] **Documentação** atualizada

## 🎯 Resultados Esperados

Com todas as funcionalidades configuradas corretamente, você deve ver:

- **Melhoria de 60-80%** no tempo de resposta
- **Redução de 70-85%** no tamanho dos dados transferidos
- **Distribuição global** com latência reduzida
- **Backup automático** funcionando diariamente
- **Monitoramento completo** de todas as métricas

As funcionalidades de performance estão prontas para uso em produção! 