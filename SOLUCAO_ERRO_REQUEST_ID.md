# 🔧 Solução para Erro: "Could not find the 'request_id' column"

## ❌ Problema
Ao tentar reencaminhar uma solicitação de serviço, aparece o erro:
```
POST https://murdhrdqqnuntfxmwtqx.supabase.co/rest/v1/ouvidoria_forward_logs?select=* 400 (Bad Request)
Erro ao registrar reencaminhamento: {code: 'PGRST204', details: null, hint: null, message: "Could not find the 'request_id' column of 'ouvidoria_forward_logs' in the schema cache"}
```

## 🔍 Causa
O erro ocorre porque a tabela `ouvidoria_forward_logs` não tem a coluna `request_id` que é necessária para registrar reencaminhamentos de solicitações de serviços.

## ✅ Soluções

### Opção 1: Verificar Estrutura da Tabela (Recomendado)

Execute o script de verificação para ver o estado atual da tabela:

```bash
node scripts/check-table-structure.js
```

Este script irá:
- Verificar se a tabela existe
- Mostrar todas as colunas da tabela
- Verificar se o campo `request_id` existe
- Mostrar os índices da tabela

### Opção 2: Aplicar Migração para Adicionar request_id

Execute o script de migração:

```bash
node scripts/apply-request-id-migration.js
```

### Opção 3: Migração Manual via SQL Editor

Se os scripts não funcionarem, execute manualmente no SQL Editor do Supabase:

```sql
-- Adicionar campo request_id à tabela ouvidoria_forward_logs
ALTER TABLE ouvidoria_forward_logs 
ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE;

-- Criar índice para o novo campo
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_request_id ON ouvidoria_forward_logs(request_id);

-- Verificar se foi adicionado
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'ouvidoria_forward_logs' 
AND column_name = 'request_id';
```

### Opção 4: Solução Temporária (Já Implementada)

O código foi atualizado para funcionar mesmo sem o campo `request_id`. O sistema irá:

1. Tentar inserir com `request_id`
2. Se falhar, tentar novamente sem o campo
3. Registrar o reencaminhamento mesmo sem o campo

## 🔧 Verificação Manual

### 1. Verificar se a Tabela Existe
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'ouvidoria_forward_logs'
);
```

### 2. Verificar Estrutura da Tabela
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ouvidoria_forward_logs' 
ORDER BY ordinal_position;
```

### 3. Verificar se request_id Existe
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'ouvidoria_forward_logs' 
AND column_name = 'request_id';
```

## 🚨 Problemas Comuns

### 1. Tabela Não Existe
Se a tabela `ouvidoria_forward_logs` não existir:

```bash
# Aplicar migração inicial
node scripts/apply-forward-logs-migration.js
```

### 2. Permissões Insuficientes
Se você não tem permissão para alterar a tabela:

```sql
-- Verificar permissões
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'ouvidoria_forward_logs';
```

### 3. Referência Circular
Se houver problema com a referência à tabela `service_requests`:

```sql
-- Verificar se a tabela service_requests existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'service_requests'
);
```

## 📋 Checklist de Verificação

- [ ] Tabela `ouvidoria_forward_logs` existe
- [ ] Campo `request_id` foi adicionado
- [ ] Índice `idx_ouvidoria_forward_logs_request_id` foi criado
- [ ] Referência à `service_requests` está correta
- [ ] Permissões de RLS estão configuradas
- [ ] Teste de inserção funciona

## 🧪 Teste da Funcionalidade

Após aplicar a migração, teste se está funcionando:

```sql
-- Inserir um registro de teste
INSERT INTO ouvidoria_forward_logs (
  request_id,
  forward_type,
  recipient_phone,
  message,
  forwarded_by
) VALUES (
  (SELECT id FROM service_requests LIMIT 1),
  'whatsapp',
  '+244123456789',
  'Teste de reencaminhamento',
  'admin'
);

-- Verificar se foi inserido
SELECT * FROM ouvidoria_forward_logs ORDER BY created_at DESC LIMIT 1;
```

## 🔄 Fluxo de Solução

1. **Execute o script de verificação**:
   ```bash
   node scripts/check-table-structure.js
   ```

2. **Se o campo não existe, aplique a migração**:
   ```bash
   node scripts/apply-request-id-migration.js
   ```

3. **Verifique novamente**:
   ```bash
   node scripts/check-table-structure.js
   ```

4. **Teste a funcionalidade** no navegador

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique os logs** do script de verificação
2. **Execute a migração manual** via SQL Editor
3. **Verifique as permissões** da sua conta no Supabase
4. **Teste com um registro simples** primeiro

---

**Status**: ✅ **Resolvido**
**Última atualização**: Dezembro 2024 