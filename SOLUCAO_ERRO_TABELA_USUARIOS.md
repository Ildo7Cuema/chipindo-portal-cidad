# 🔧 Solução para Erro: "relation 'usuarios' does not exist"

## ❌ Problema
Ao executar o script SQL no Supabase SQL Editor, aparece o erro:
```
ERROR: 42P01: relation "usuarios" does not exist
```

## 🔍 Causa
O erro ocorre porque o script original fazia referência a uma tabela `usuarios` que não existe no seu banco de dados. O Supabase usa `auth.users` como tabela padrão de usuários.

## ✅ Soluções

### Opção 1: Usar o Script Simplificado (Recomendado)

Execute o script simplificado que não depende de tabelas específicas:

```sql
-- Copie e cole este conteúdo no SQL Editor do Supabase
-- Arquivo: scripts/create-ouvidoria-forward-logs-simple.sql

CREATE TABLE IF NOT EXISTS ouvidoria_forward_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manifestacao_id UUID NOT NULL REFERENCES ouvidoria_manifestacoes(id) ON DELETE CASCADE,
  forward_type TEXT NOT NULL CHECK (forward_type IN ('sms', 'whatsapp')),
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  forwarded_by TEXT NOT NULL,
  forwarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_manifestacao_id ON ouvidoria_forward_logs(manifestacao_id);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_forwarded_at ON ouvidoria_forward_logs(forwarded_at);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_forward_logs_forward_type ON ouvidoria_forward_logs(forward_type);

-- Adicionar RLS (Row Level Security)
ALTER TABLE ouvidoria_forward_logs ENABLE ROW LEVEL SECURITY;

-- Política simples: permitir acesso a todos os usuários autenticados
CREATE POLICY "Usuários autenticados podem ver logs de reencaminhamento" ON ouvidoria_forward_logs
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_ouvidoria_forward_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER trigger_update_ouvidoria_forward_logs_updated_at
  BEFORE UPDATE ON ouvidoria_forward_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_ouvidoria_forward_logs_updated_at();
```

### Opção 2: Usar o Script Node.js

Execute o script Node.js que usa a versão simplificada:

```bash
# No terminal, na raiz do projeto
node scripts/apply-forward-logs-migration.js
```

### Opção 3: Verificar Estrutura do Banco

Se você quiser usar políticas mais específicas, primeiro verifique quais tabelas de usuários existem:

```sql
-- Verificar tabelas relacionadas a usuários
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%user%';

-- Verificar se existe tabela auth.users
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth' 
AND table_name = 'users';

-- Verificar estrutura da tabela auth.users
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users';
```

## 🔧 Políticas RLS Personalizadas

### Para Usuários com Role no Metadata

Se seus usuários têm role no `raw_user_meta_data`:

```sql
-- Política para administradores
CREATE POLICY "Administradores podem ver todos os logs" ON ouvidoria_forward_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users u 
      WHERE u.id = auth.uid() 
      AND u.raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### Para Usuários com Tabela Personalizada

Se você tem uma tabela personalizada de usuários:

```sql
-- Substitua 'sua_tabela_usuarios' pelo nome real da sua tabela
CREATE POLICY "Administradores podem ver todos os logs" ON ouvidoria_forward_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sua_tabela_usuarios u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );
```

## 🧪 Teste da Tabela

Após criar a tabela, teste se está funcionando:

```sql
-- Verificar se a tabela foi criada
SELECT * FROM ouvidoria_forward_logs LIMIT 1;

-- Inserir um registro de teste
INSERT INTO ouvidoria_forward_logs (
  manifestacao_id, 
  forward_type, 
  recipient_phone, 
  message, 
  forwarded_by
) VALUES (
  (SELECT id FROM ouvidoria_manifestacoes LIMIT 1),
  'whatsapp',
  '+244123456789',
  'Teste de reencaminhamento',
  'admin'
);

-- Verificar o registro inserido
SELECT * FROM ouvidoria_forward_logs ORDER BY created_at DESC LIMIT 1;
```

## 📋 Checklist de Verificação

- [ ] Script executado sem erros
- [ ] Tabela `ouvidoria_forward_logs` criada
- [ ] Índices criados
- [ ] RLS habilitado
- [ ] Políticas criadas
- [ ] Trigger criado
- [ ] Teste de inserção funcionando

## 🚨 Problemas Comuns

### 1. Erro de Permissão
```
ERROR: permission denied for table ouvidoria_forward_logs
```
**Solução**: Execute como superuser ou verifique as políticas RLS.

### 2. Erro de Referência
```
ERROR: insert or update on table "ouvidoria_forward_logs" violates foreign key constraint
```
**Solução**: Verifique se a tabela `ouvidoria_manifestacoes` existe e tem dados.

### 3. Erro de Função
```
ERROR: function update_ouvidoria_forward_logs_updated_at() does not exist
```
**Solução**: Execute o script completo, incluindo a criação da função.

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique os logs** do Supabase SQL Editor
2. **Execute o script por partes** para identificar onde está o erro
3. **Verifique a estrutura** do seu banco de dados
4. **Consulte a documentação** do Supabase sobre RLS

---

**Status**: ✅ **Resolvido**
**Última atualização**: Dezembro 2024 