import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixRegisterForEventFunction() {
  try {
    console.log('🔧 Corrigindo função register_for_event...\n');

    // 1. Verificar se a tabela existe
    console.log('1️⃣ Verificando tabela event_registrations...');
    
    const { data: tableExists, error: tableError } = await supabase
      .from('event_registrations')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Tabela event_registrations não existe:', tableError.message);
      return;
    }

    console.log('✅ Tabela event_registrations existe');

    // 2. Testar a função atual
    console.log('\n2️⃣ Testando função atual...');
    
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
      p_participant_name: 'Teste de Correção',
      p_participant_email: 'teste.correcao@email.com',
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
        if (functionError.message.includes('Already registered')) {
          console.log('✅ Função funciona (erro esperado - já inscrito)');
          return;
        } else if (functionError.message.includes('column reference "current_participants" is ambiguous')) {
          console.log('⚠️  Erro de ambiguidade detectado, corrigindo...');
        } else {
          console.error('❌ Erro ao testar função:', functionError.message);
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

    // 3. Corrigir a função
    console.log('\n3️⃣ Corrigindo função register_for_event...');
    
    // Como não podemos usar exec_sql, vamos tentar uma abordagem alternativa
    // Vamos criar uma versão simplificada da função que funciona
    
    console.log('💡 A função precisa ser corrigida via migração SQL');
    console.log('📝 Execute manualmente no Supabase SQL Editor:');
    console.log(`
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
    `);

    console.log('\n🎉 Instruções para correção fornecidas!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
fixRegisterForEventFunction(); 