# 🔧 Guia de Correção - Exclusão de Utilizadores

## 📋 **Problema Identificado**

O botão de exclusão de utilizadores não está funcionando corretamente. O sistema mostra a mensagem:
> "Utilizador anasaude@gmail.com excluído do sistema, mas pode permanecer no sistema de autenticação"

**Isso significa:** O perfil foi excluído da tabela `profiles`, mas o utilizador pode ainda estar no sistema de autenticação (`auth.users`).

## 🛠️ **Solução Implementada**

### **1. Script SQL de Correção**

Execute o script `scripts/apply-rls-fixes.sql` no Supabase SQL Editor para:
- ✅ Corrigir políticas RLS
- ✅ Criar funções de exclusão
- ✅ Permitir exclusão para administradores

### **2. Função de Exclusão Melhorada**

A função de exclusão foi atualizada para:
- ✅ Usar função SQL dedicada
- ✅ Fornecer feedback claro
- ✅ Tratar erros graciosamente

## 📝 **Instruções Passo a Passo**

### **Passo 1: Aplicar Correções no Supabase**

1. **Acesse o Supabase Dashboard**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login na sua conta
   - Selecione o projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New query"**

3. **Execute o Script de Correção**
   - Copie todo o conteúdo do arquivo `scripts/apply-rls-fixes.sql`
   - Cole no SQL Editor
   - Clique em **"Run"**

4. **Verifique os Resultados**
   - O script mostrará informações sobre:
     - Políticas atuais
     - Triggers existentes
     - Foreign keys
     - Configurações RLS

### **Passo 2: Testar a Exclusão**

1. **Abra o Console do Navegador**
   - Pressione **F12** no navegador
   - Vá para a aba **"Console"**

2. **Tente Excluir um Utilizador**
   - Vá para a área administrativa
   - Acesse "Gestão de Utilizadores"
   - Clique no botão de exclusão (🗑️) de um utilizador

3. **Verifique os Logs**
   - No console, você verá logs detalhados:
   ```
   Iniciando exclusão do utilizador: [ID]
   Resultado da exclusão: {success: true, profile_deleted: true, auth_deleted: false, user_email: "anasaude@gmail.com"}
   ```

### **Passo 3: Interpretar os Resultados**

#### **✅ Sucesso Completo:**
```
"Utilizador anasaude@gmail.com excluído completamente do sistema!"
```
**Significa:** Perfil e auth excluídos com sucesso.

#### **⚠️ Sucesso Parcial:**
```
"Utilizador anasaude@gmail.com excluído do sistema, mas pode permanecer no sistema de autenticação"
```
**Significa:** Perfil excluído, mas auth pode ter falhado (normal se não tiver permissões de admin).

#### **❌ Falha:**
```
"Erro: Perfil não foi excluído corretamente. Execute o script de correção RLS."
```
**Significa:** Problema com políticas RLS - execute o script novamente.

## 🔍 **Diagnóstico de Problemas**

### **Se a Exclusão Ainda Falhar:**

1. **Execute a Função de Debug:**
   ```sql
   SELECT debug_delete_user('ID_DO_UTILIZADOR');
   ```

2. **Verifique as Políticas RLS:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. **Teste a Função Completa:**
   ```sql
   SELECT delete_user_complete('ID_DO_UTILIZADOR');
   ```

### **Problemas Comuns:**

#### **1. Políticas RLS Bloqueando**
- **Sintoma:** Erro de permissão
- **Solução:** Execute o script de correção RLS

#### **2. Triggers Interferindo**
- **Sintoma:** Exclusão falha silenciosamente
- **Solução:** Verifique triggers na tabela profiles

#### **3. Foreign Keys**
- **Sintoma:** Erro de integridade referencial
- **Solução:** Verifique dependências antes de excluir

## 📊 **Funções SQL Criadas**

### **1. `debug_delete_user(user_profile_id UUID)`**
- **Propósito:** Testar exclusão de um perfil específico
- **Retorna:** Texto com resultado da operação
- **Uso:** Para diagnóstico de problemas

### **2. `delete_user_complete(user_profile_id UUID)`**
- **Propósito:** Exclusão completa de utilizador
- **Retorna:** JSON com detalhes da operação
- **Uso:** Função principal de exclusão

### **3. `is_admin()`**
- **Propósito:** Verificar se utilizador atual é admin
- **Retorna:** Boolean
- **Uso:** Políticas RLS

## 🎯 **Políticas RLS Implementadas**

### **Política de DELETE:**
```sql
CREATE POLICY "profiles_delete_policy" ON profiles
    FOR DELETE
    TO authenticated
    USING (
        -- Permitir exclusão se o utilizador atual for admin
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
        OR
        -- Permitir exclusão se o utilizador atual for o próprio utilizador
        user_id = auth.uid()
    );
```

## 🔧 **Troubleshooting**

### **Se o Script Falhar:**

1. **Verifique Permissões:**
   - Certifique-se de que está logado como admin
   - Verifique se tem permissões de superuser no Supabase

2. **Execute em Partes:**
   - Execute o script em seções menores
   - Verifique cada parte antes de continuar

3. **Verifique Logs:**
   - No Supabase Dashboard, vá para "Logs"
   - Verifique se há erros relacionados

### **Se a Exclusão Ainda Não Funcionar:**

1. **Teste Manual:**
   ```sql
   -- Teste direto no SQL Editor
   DELETE FROM profiles WHERE id = 'ID_DO_UTILIZADOR';
   ```

2. **Verifique Dependências:**
   ```sql
   -- Verifique se há outras tabelas referenciando o perfil
   SELECT * FROM information_schema.referential_constraints 
   WHERE constraint_name LIKE '%profiles%';
   ```

3. **Reinicie o Supabase:**
   - No Dashboard, vá para "Settings" > "General"
   - Clique em "Restart project"

## 📞 **Suporte**

### **Se Nada Funcionar:**

1. **Colete Informações:**
   - Screenshots dos erros
   - Logs do console
   - Resultados das consultas SQL

2. **Verifique:**
   - Versão do Supabase
   - Configurações do projeto
   - Permissões de usuário

3. **Contato:**
   - Documente todos os passos tentados
   - Inclua informações de erro específicas

## ✅ **Checklist de Verificação**

- [ ] Script SQL executado com sucesso
- [ ] Políticas RLS criadas corretamente
- [ ] Funções SQL criadas
- [ ] Console do navegador aberto
- [ ] Tentativa de exclusão realizada
- [ ] Logs verificados
- [ ] Resultado interpretado corretamente
- [ ] Problema resolvido ou documentado

## 🎉 **Resultado Esperado**

Após seguir todos os passos, a exclusão de utilizadores deve funcionar corretamente com:
- ✅ Feedback claro sobre o resultado
- ✅ Logs detalhados para debug
- ✅ Tratamento gracioso de erros
- ✅ Exclusão completa ou parcial com aviso claro 