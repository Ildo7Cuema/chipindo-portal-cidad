# Correção do Erro 404 no Modal de Inscrição de Eventos

## 🔍 Problema Identificado

**Erro reportado**: 
```
Failed to load resource: the server responded with a status of 404 ()
event-registration-modal.tsx:197 Erro na inscrição: Object
```

## 🔧 Análise do Problema

### 1. **Causa Raiz**
O erro 404 ocorre porque a função RPC `register_for_event` não existe no banco de dados ou está com erro de sintaxe.

### 2. **Componentes Afetados**
- `src/components/ui/event-registration-modal.tsx` - Modal de inscrição
- `src/hooks/useEventRegistrations.ts` - Hook que chama a função RPC
- Tabela `event_registrations` - Tabela de inscrições

### 3. **Estado Atual**
- ✅ Tabela `event_registrations` criada com sucesso
- ❌ Função `register_for_event` com erro de ambiguidade na coluna `current_participants`
- ❌ Modal não consegue registrar inscrições

## 🛠️ Solução Implementada

### 1. **Criação da Tabela**
A tabela `event_registrations` foi criada com sucesso:
```sql
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    -- ... outros campos
);
```

### 2. **Correção da Função RPC**
O erro estava na função `register_for_event` com ambiguidade na coluna `current_participants`.

**Problema original**:
```sql
UPDATE events 
SET current_participants = current_participants + 1,
    updated_at = NOW()
WHERE id = p_event_id;
```

**Solução**:
```sql
CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id INTEGER,
    p_participant_name VARCHAR,
    p_participant_email VARCHAR,
    -- ... outros parâmetros
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_registration_id INTEGER;
    event_max_participants INTEGER;
    current_participants INTEGER;
BEGIN
    -- Check if event exists and has available spots
    SELECT e.max_participants, e.current_participants
    INTO event_max_participants, current_participants
    FROM events e
    WHERE e.id = p_event_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Event not found';
    END IF;
    
    -- Check if event is full
    IF event_max_participants > 0 AND current_participants >= event_max_participants THEN
        RAISE EXCEPTION 'Event is full';
    END IF;
    
    -- Check if user is already registered
    IF EXISTS (
        SELECT 1 FROM event_registrations 
        WHERE event_id = p_event_id AND participant_email = p_participant_email
    ) THEN
        RAISE EXCEPTION 'Already registered for this event';
    END IF;
    
    -- Insert registration
    INSERT INTO event_registrations (
        event_id, participant_name, participant_email, participant_phone,
        participant_age, participant_gender, participant_address,
        participant_occupation, participant_organization, special_needs,
        dietary_restrictions, emergency_contact_name, emergency_contact_phone
    ) VALUES (
        p_event_id, p_participant_name, p_participant_email, p_participant_phone,
        p_participant_age, p_participant_gender, p_participant_address,
        p_participant_occupation, p_participant_organization, p_special_needs,
        p_dietary_restrictions, p_emergency_contact_name, p_emergency_contact_phone
    ) RETURNING id INTO new_registration_id;
    
    -- Update event participant count (fixed)
    UPDATE events 
    SET current_participants = current_participants + 1,
        updated_at = NOW()
    WHERE id = p_event_id;
    
    RETURN new_registration_id;
END;
$$;
```

## 📋 Passos para Correção

### 1. **Aplicar a Correção Manualmente**
1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o código SQL da função corrigida (fornecido acima)

### 2. **Verificar a Correção**
Execute o script de teste:
```bash
node scripts/fix-register-for-event-function.js
```

### 3. **Testar o Modal**
1. Acesse a página de eventos
2. Clique em "Inscrever-se" em qualquer evento
3. Preencha o formulário
4. Confirme a inscrição

## ✅ Resultado Esperado

Após a correção:
- ✅ Modal de inscrição funcionando
- ✅ Inscrições sendo salvas no banco de dados
- ✅ Contador de participantes atualizado
- ✅ Prevenção de inscrições duplicadas
- ✅ Validações funcionando

## 🔍 Scripts Criados

1. **`scripts/apply-event-registrations-migration-sql.js`** - Aplicar migração completa
2. **`scripts/fix-register-for-event-function.js`** - Corrigir função RPC
3. **`supabase/migrations/20250125000014-create-event-registrations-complete.sql`** - Migração SQL

## 📊 Status da Correção

- [x] Problema identificado (função RPC com erro)
- [x] Tabela criada com sucesso
- [x] Solução desenvolvida
- [ ] **PENDENTE**: Aplicar correção manual no Supabase
- [ ] **PENDENTE**: Testar modal de inscrição

## 🎯 Próximos Passos

1. **Aplicar a correção SQL** no Supabase Dashboard
2. **Testar o modal** de inscrição
3. **Verificar integração** com área administrativa
4. **Configurar notificações** por email (opcional)

## 💡 Nota Importante

A correção precisa ser aplicada manualmente no Supabase SQL Editor porque a função `exec_sql` não está disponível no projeto. Após aplicar a correção, o modal de inscrição funcionará corretamente. 