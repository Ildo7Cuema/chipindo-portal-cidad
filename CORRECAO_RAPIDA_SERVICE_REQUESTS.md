# 🚨 Correção Rápida - Erro de Service Requests

## ❌ Problema Atual
```
Error: new row violates row-level security policy for table "service_requests"
```

## ✅ Solução Imediata

### Passo 1: Acessar Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login
3. Selecione o projeto: `murdhrdqqnuntfxmwtqx`

### Passo 2: Abrir SQL Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### Passo 3: Executar Script de Correção
1. **Copie** todo o conteúdo do arquivo `scripts/fix-service-requests-simple.sql`
2. **Cole** no SQL Editor
3. **Clique em "Run"**

### Passo 4: Verificar Resultado
Após executar, você deve ver:
- ✅ Tabela `service_requests` criada
- ✅ Políticas RLS configuradas corretamente
- ✅ Permissões concedidas

## 🔧 O que o Script Faz

1. **Cria a tabela** `service_requests` (se não existir)
2. **Habilita RLS** na tabela
3. **Remove políticas antigas** que podem estar causando conflito
4. **Cria políticas simples**:
   - Público pode inserir (criar solicitações)
   - Administradores podem ver, editar e deletar
5. **Concede permissões** para `anon` e `authenticated`
6. **Verifica** se tudo foi criado corretamente

## 🧪 Teste Após Aplicar

1. **Volte para a aplicação**
2. **Acesse a página de Serviços**
3. **Clique em "Solicitar serviço"**
4. **Preencha o formulário**
5. **Clique em "Enviar Solicitação"**

**Deve funcionar sem erros!** ✅

## 📋 Verificação Manual

Se quiser verificar se funcionou, execute no SQL Editor:

```sql
-- Verificar se a tabela existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'service_requests';

-- Verificar políticas
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'service_requests';
```

## 🚀 Resultado Esperado

Após aplicar a correção:
- ✅ Formulário de solicitação funciona
- ✅ Dados são salvos no banco
- ✅ Administradores podem ver as solicitações
- ✅ Sistema completo funcionando

## 📞 Se Ainda Houver Problemas

1. **Verifique os logs** do Supabase
2. **Confirme** que o script foi executado com sucesso
3. **Teste** com uma solicitação simples
4. **Verifique** se há erros no console do navegador

---

**Execute o script e o problema será resolvido!** 🎯 