# Como Aplicar as Migrações de Serviços Municipais

## 🚨 Problema Identificado

O erro `401 (Unauthorized)` e `new row violates row-level security policy` indica que:
1. A tabela `service_requests` não existe no banco de dados
2. As políticas de Row Level Security (RLS) não estão configuradas corretamente

## 🔧 Solução

### Passo 1: Acessar o Supabase Dashboard

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto `murdhrdqqnuntfxmwtqx`

### Passo 2: Abrir o SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"** para criar uma nova consulta

### Passo 3: Executar o Script SQL

1. Copie todo o conteúdo do arquivo `scripts/apply-service-requests-sql.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **"Run"** para executar o script

### Passo 4: Verificar a Execução

O script irá:
- ✅ Criar a tabela `servicos` (se não existir)
- ✅ Criar a tabela `service_requests` (se não existir)
- ✅ Configurar todas as políticas de segurança (RLS)
- ✅ Criar índices para performance
- ✅ Inserir dados de exemplo
- ✅ Configurar triggers e funções
- ✅ Criar a view `service_requests_view`

### Passo 5: Verificar as Tabelas

Após executar o script, você pode verificar se as tabelas foram criadas:

```sql
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('servicos', 'service_requests', 'service_requests_view')
ORDER BY table_name;
```

## 📋 O que o Script Faz

### 1. Tabela `servicos`
- Armazena informações dos serviços municipais
- Inclui 6 serviços de exemplo
- Configurada com RLS para acesso público de leitura

### 2. Tabela `service_requests`
- Armazena as solicitações de serviços
- Configurada com RLS para permitir inserção pública
- Apenas administradores podem visualizar/editar

### 3. Políticas de Segurança (RLS)
- **Público**: Pode criar solicitações
- **Administradores**: Acesso completo a todas as funcionalidades

### 4. Triggers e Funções
- Atualização automática de timestamps
- Notificações automáticas para administradores
- Integração com sistema de notificações existente

## 🧪 Teste Após Aplicar

1. **Teste na Página de Serviços**:
   - Acesse a página de Serviços Municipais
   - Clique em "Solicitar serviço" em qualquer categoria
   - Preencha o formulário e envie
   - Deve funcionar sem erros

2. **Teste no Painel Administrativo**:
   - Faça login como administrador
   - Vá para "Solicitações de Serviços"
   - Deve mostrar as solicitações enviadas

## 🔍 Verificação de Erros

Se ainda houver problemas, verifique:

### 1. Tabelas Existentes
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%service%';
```

### 2. Políticas RLS
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('servicos', 'service_requests');
```

### 3. Permissões
```sql
SELECT grantee, table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name IN ('servicos', 'service_requests');
```

## 🚀 Alternativa: Usar Supabase CLI

Se você tiver o Supabase CLI configurado:

```bash
# Aplicar migrações
supabase db push

# Ou aplicar migração específica
supabase migration up
```

## 📞 Suporte

Se ainda houver problemas após aplicar as migrações:

1. Verifique os logs do Supabase
2. Confirme que as tabelas foram criadas
3. Teste as políticas RLS manualmente
4. Verifique se o usuário tem as permissões corretas

## ✅ Resultado Esperado

Após aplicar as migrações:
- ✅ Formulário de solicitação funciona sem erros
- ✅ Solicitações são salvas no banco de dados
- ✅ Administradores recebem notificações
- ✅ Painel administrativo mostra as solicitações
- ✅ Sistema completo de gestão de solicitações funcionando 