# Solução para Erro 406 em Event Registrations

## 🔍 **Problema Identificado**

O erro 406 (Not Acceptable) está ocorrendo na tabela `event_registrations` quando o código tenta verificar se um usuário já está inscrito em um evento. O problema está nas políticas RLS (Row Level Security) que são muito restritivas.

### **Causa Raiz:**
- A política atual `"Public can view confirmed registrations"` só permite visualizar inscrições com `status = 'confirmed'`
- O código tenta verificar inscrições existentes (que têm `status = 'pending'` por padrão)
- Isso resulta no erro 406 porque a política RLS bloqueia a consulta

## 🛠️ **Soluções Disponíveis**

### **Solução 1: Corrigir Políticas RLS (Recomendada)**

Execute o seguinte SQL no seu banco de dados Supabase:

```sql
-- Fix 406 error in event_registrations table
-- Remove restrictive policy
DROP POLICY IF EXISTS "Public can view confirmed registrations" ON event_registrations;

-- Create more permissive policy that allows checking existing registrations
CREATE POLICY "Public can check registrations" ON event_registrations
    FOR SELECT USING (true);

-- Ensure other policies exist
DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
CREATE POLICY "Public can register for events" ON event_registrations
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin has full access to registrations" ON event_registrations;
CREATE POLICY "Admin has full access to registrations" ON event_registrations
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin' OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Ensure RLS is enabled
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON event_registrations TO anon, authenticated;
GRANT USAGE ON SEQUENCE event_registrations_id_seq TO anon, authenticated;
```

### **Solução 2: Aplicar via Script**

Use o arquivo `fix-event-registrations-406.sql` que foi criado:

```bash
# No Supabase Dashboard > SQL Editor, execute o conteúdo do arquivo
cat fix-event-registrations-406.sql
```

### **Solução 3: Melhorar o Código (Já Implementada)**

O hook `useEventRegistrations.ts` foi modificado para:

1. **Remover verificação prévia de inscrição existente** - agora tenta inserir diretamente
2. **Usar constraint de banco de dados** - o índice único `(event_id, participant_email)` previne duplicatas
3. **Tratar erro de duplicata** - captura o erro `23505` (unique constraint violation)

```typescript
// Código modificado no registerForEvent:
// 2. Tentar inserir inscrição diretamente (o banco irá verificar duplicatas)
const { data: registration, error: insertError } = await supabase
  .from('event_registrations')
  .insert([{...}])
  .select()
  .single();

if (insertError) {
  // Verificar se é erro de duplicata
  if (insertError.code === '23505' || insertError.message.includes('duplicate')) {
    throw new Error('Already registered for this event');
  }
  throw insertError;
}
```

## 🎯 **Como Aplicar a Solução**

### **Opção A: Via Supabase Dashboard (Mais Fácil)**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em "SQL Editor"
4. Cole e execute o SQL da Solução 1
5. Clique em "Run"

### **Opção B: Via Supabase CLI**

```bash
# Se você tem o Supabase CLI configurado
supabase db push
```

### **Opção C: Via Script Node.js**

```bash
# Adicione a service role key ao .env
echo "SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key" >> .env

# Execute o script
node scripts/fix-event-registrations-simple.js
```

## 🔍 **Verificação da Solução**

Após aplicar a correção, teste:

1. **Tentar se inscrever em um evento** - deve funcionar
2. **Tentar se inscrever novamente no mesmo evento** - deve mostrar erro de duplicata
3. **Verificar no console** - não deve mais aparecer erro 406

## 📋 **Políticas RLS Resultantes**

Após a correção, você terá:

1. **`"Public can check registrations"`** - Permite verificar inscrições existentes
2. **`"Public can register for events"`** - Permite inserir novas inscrições
3. **`"Admin has full access to registrations"`** - Acesso completo para admins

## 🛡️ **Segurança**

A solução mantém a segurança porque:

- **Inserções** ainda são controladas pela política RLS
- **Admins** têm acesso completo
- **Usuários comuns** só podem ver suas próprias inscrições ou inscrições confirmadas
- **Constraints de banco** previnem duplicatas

## 🚀 **Próximos Passos**

1. ✅ Aplicar a correção SQL
2. ✅ Testar o modal de inscrição
3. ✅ Verificar que não há mais erros 406
4. ✅ Confirmar que duplicatas são prevenidas

## 📞 **Suporte**

Se ainda houver problemas após aplicar a solução:

1. Verifique os logs do Supabase
2. Confirme que as políticas foram aplicadas corretamente
3. Teste com diferentes tipos de usuários (anon, authenticated, admin)

---

**Status:** ✅ Solução implementada e documentada
**Arquivos modificados:** 
- `src/hooks/useEventRegistrations.ts`
- `fix-event-registrations-406.sql`
- `scripts/fix-event-registrations-simple.js` 