import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function verifyAndFixFunction() {
  try {
    console.log('🔍 Verificando e corrigindo função register_for_event...\n');

    // 1. Verificar se a função ainda tem o erro
    console.log('1️⃣ Testando função atual...');
    
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title')
      .limit(1);

    if (eventsError || !events || events.length === 0) {
      console.error('❌ Nenhum evento encontrado para teste');
      return;
    }

    const testEvent = events[0];
    console.log(`📋 Usando evento para teste: ${testEvent.title} (ID: ${testEvent.id})`);

    // Testar a função atual
    const testRegistration = {
      p_event_id: testEvent.id,
      p_participant_name: 'Teste de Verificação',
      p_participant_email: 'teste.verificacao@email.com',
      p_participant_phone: '+244 123 456 789',
      p_participant_age: 30,
      p_participant_gender: 'Masculino',
      p_participant_address: 'Rua de Teste, Chipindo',
      p_participant_occupation: 'Testador',
      p_participant_organization: 'Sistema de Teste',
      p_special_needs: 'Nenhuma',
      p_dietary_restrictions: 'Nenhuma',
      p_emergency_contact_name: 'Contacto de Emergência',
      p_emergency_contact_phone: '+244 987 654 321'
    };

    try {
      const { data: result, error: functionError } = await supabase.rpc('register_for_event', testRegistration);

      if (functionError) {
        if (functionError.message.includes('column reference "current_participants" is ambiguous')) {
          console.log('❌ Erro ainda persiste: ambiguidade na coluna current_participants');
          console.log('💡 A função não foi atualizada no banco de dados');
        } else if (functionError.message.includes('Already registered')) {
          console.log('✅ Função funciona (erro esperado - já inscrito)');
          return;
        } else {
          console.error('❌ Erro diferente:', functionError.message);
          return;
        }
      } else {
        console.log('✅ Função funcionou perfeitamente! ID da inscrição:', result);
        return;
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err.message);
      return;
    }

    // 2. Tentar uma abordagem alternativa - criar uma nova função com nome diferente
    console.log('\n2️⃣ Tentando abordagem alternativa...');
    
    console.log('💡 Como a função não foi atualizada, vou sugerir uma abordagem alternativa:');
    console.log('   1. Criar uma nova função com nome diferente');
    console.log('   2. Atualizar o hook para usar a nova função');
    console.log('   3. Ou usar uma abordagem mais simples sem RPC');

    // 3. Fornecer múltiplas soluções
    console.log('\n3️⃣ Soluções disponíveis:');
    
    console.log('\n📋 **SOLUÇÃO 1: Atualizar função via SQL (Recomendado)**');
    console.log('Execute este código no Supabase SQL Editor:');
    console.log('\n' + '='.repeat(80));
    console.log(`
-- SOLUÇÃO 1: Corrigir a função existente
DROP FUNCTION IF EXISTS register_for_event;

CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id INTEGER,
    p_participant_name VARCHAR,
    p_participant_email VARCHAR,
    p_participant_phone VARCHAR DEFAULT NULL,
    p_participant_age INTEGER DEFAULT NULL,
    p_participant_gender VARCHAR DEFAULT NULL,
    p_participant_address TEXT DEFAULT NULL,
    p_participant_occupation VARCHAR DEFAULT NULL,
    p_participant_organization VARCHAR DEFAULT NULL,
    p_special_needs TEXT DEFAULT NULL,
    p_dietary_restrictions TEXT DEFAULT NULL,
    p_emergency_contact_name VARCHAR DEFAULT NULL,
    p_emergency_contact_phone VARCHAR DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_registration_id INTEGER;
    event_max_participants INTEGER;
    event_current_participants INTEGER;
BEGIN
    -- Check if event exists and has available spots
    SELECT e.max_participants, e.current_participants
    INTO event_max_participants, event_current_participants
    FROM events e
    WHERE e.id = p_event_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Event not found';
    END IF;
    
    -- Check if event is full
    IF event_max_participants > 0 AND event_current_participants >= event_max_participants THEN
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
    
    -- Update event participant count (using explicit table reference)
    UPDATE events 
    SET current_participants = event_current_participants + 1,
        updated_at = NOW()
    WHERE id = p_event_id;
    
    RETURN new_registration_id;
END;
$$;
    `);
    console.log('='.repeat(80));

    console.log('\n📋 **SOLUÇÃO 2: Usar inserção direta (Alternativa)**');
    console.log('Se a função RPC continuar com problemas, podemos modificar o hook para usar inserção direta:');
    console.log('\n' + '='.repeat(80));
    console.log(`
// Modificar o hook useEventRegistrations.ts para usar inserção direta
const registerForEvent = async (formData: RegistrationFormData) => {
  try {
    // 1. Verificar se o evento existe e tem vagas
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('max_participants, current_participants')
      .eq('id', formData.event_id)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    if (event.max_participants > 0 && event.current_participants >= event.max_participants) {
      throw new Error('Event is full');
    }

    // 2. Verificar se já está inscrito
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', formData.event_id)
      .eq('participant_email', formData.participant_email)
      .single();

    if (existingRegistration) {
      throw new Error('Already registered for this event');
    }

    // 3. Inserir inscrição
    const { data: registration, error: insertError } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: formData.event_id,
        participant_name: formData.participant_name,
        participant_email: formData.participant_email,
        participant_phone: formData.participant_phone,
        participant_age: formData.participant_age,
        participant_gender: formData.participant_gender,
        participant_address: formData.participant_address,
        participant_occupation: formData.participant_occupation,
        participant_organization: formData.participant_organization,
        special_needs: formData.special_needs,
        dietary_restrictions: formData.dietary_restrictions,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone
      }])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // 4. Atualizar contador de participantes
    await supabase
      .from('events')
      .update({ 
        current_participants: event.current_participants + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', formData.event_id);

    return registration.id;
  } catch (error) {
    throw error;
  }
};
    `);
    console.log('='.repeat(80));

    console.log('\n🎯 **Recomendação:**');
    console.log('   1. Tente primeiro a SOLUÇÃO 1 (SQL)');
    console.log('   2. Se não funcionar, use a SOLUÇÃO 2 (modificar o hook)');
    console.log('   3. A SOLUÇÃO 2 é mais simples e não depende de funções RPC');

    console.log('\n✅ **Para testar após aplicar qualquer solução:**');
    console.log('   1. Teste o modal de inscrição na página de eventos');
    console.log('   2. Verifique se a inscrição é salva corretamente');
    console.log('   3. Confirme se o contador de participantes é atualizado');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
verifyAndFixFunction(); 