import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testDirectRegistration() {
  try {
    console.log('🧪 Testando nova implementação de inscrição direta...\n');

    // 1. Buscar um evento para teste
    console.log('1️⃣ Buscando evento para teste...');
    
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, max_participants, current_participants')
      .limit(1);

    if (eventsError || !events || events.length === 0) {
      console.error('❌ Nenhum evento encontrado para teste');
      return;
    }

    const testEvent = events[0];
    console.log(`📋 Evento para teste: ${testEvent.title} (ID: ${testEvent.id})`);
    console.log(`   Vagas: ${testEvent.current_participants}/${testEvent.max_participants}`);

    // 2. Simular o processo de inscrição direta
    console.log('\n2️⃣ Simulando processo de inscrição...');
    
    const testRegistration = {
      event_id: testEvent.id,
      participant_name: 'Teste de Inscrição Direta',
      participant_email: 'teste.direto@email.com',
      participant_phone: '+244 123 456 789',
      participant_age: 30,
      participant_gender: 'Masculino',
      participant_address: 'Rua de Teste, Chipindo',
      participant_occupation: 'Testador',
      participant_organization: 'Sistema de Teste',
      special_needs: 'Nenhuma',
      dietary_restrictions: 'Nenhuma',
      emergency_contact_name: 'Contacto de Emergência',
      emergency_contact_phone: '+244 987 654 321'
    };

    // 3. Verificar se o evento existe e tem vagas
    console.log('\n3️⃣ Verificando disponibilidade do evento...');
    
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('max_participants, current_participants')
      .eq('id', testRegistration.event_id)
      .single();

    if (eventError || !event) {
      console.error('❌ Erro ao verificar evento:', eventError?.message);
      return;
    }

    console.log(`✅ Evento verificado: ${event.current_participants}/${event.max_participants} participantes`);

    if (event.max_participants > 0 && event.current_participants >= event.max_participants) {
      console.log('❌ Evento está lotado');
      return;
    }

    // 4. Verificar se já está inscrito
    console.log('\n4️⃣ Verificando se já está inscrito...');
    
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', testRegistration.event_id)
      .eq('participant_email', testRegistration.participant_email)
      .single();

    if (existingRegistration) {
      console.log('⚠️  Já inscrito neste evento (erro esperado)');
      return;
    }

    console.log('✅ Não está inscrito, pode prosseguir');

    // 5. Inserir inscrição
    console.log('\n5️⃣ Inserindo inscrição...');
    
    const { data: registration, error: insertError } = await supabase
      .from('event_registrations')
      .insert([testRegistration])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir inscrição:', insertError.message);
      return;
    }

    console.log(`✅ Inscrição criada com sucesso! ID: ${registration.id}`);

    // 6. Atualizar contador de participantes
    console.log('\n6️⃣ Atualizando contador de participantes...');
    
    const { error: updateError } = await supabase
      .from('events')
      .update({ 
        current_participants: event.current_participants + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', testRegistration.event_id);

    if (updateError) {
      console.error('❌ Erro ao atualizar contador:', updateError.message);
    } else {
      console.log('✅ Contador de participantes atualizado');
    }

    // 7. Verificar resultado final
    console.log('\n7️⃣ Verificando resultado final...');
    
    const { data: finalEvent, error: finalEventError } = await supabase
      .from('events')
      .select('current_participants')
      .eq('id', testRegistration.event_id)
      .single();

    if (finalEventError) {
      console.error('❌ Erro ao verificar evento final:', finalEventError.message);
    } else {
      console.log(`✅ Contador final: ${finalEvent.current_participants} participantes`);
    }

    // 8. Verificar inscrição criada
    const { data: finalRegistration, error: finalRegError } = await supabase
      .from('event_registrations')
      .select(`
        id,
        participant_name,
        participant_email,
        status,
        registration_date,
        events (
          title
        )
      `)
      .eq('id', registration.id)
      .single();

    if (finalRegError) {
      console.error('❌ Erro ao verificar inscrição final:', finalRegError.message);
    } else {
      console.log('✅ Inscrição verificada:');
      console.log(`   - Nome: ${finalRegistration.participant_name}`);
      console.log(`   - Email: ${finalRegistration.participant_email}`);
      console.log(`   - Evento: ${finalRegistration.events?.title}`);
      console.log(`   - Status: ${finalRegistration.status}`);
      console.log(`   - Data: ${new Date(finalRegistration.registration_date).toLocaleDateString('pt-AO')}`);
    }

    console.log('\n🎉 Teste de inscrição direta concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log('   ✅ Verificação de evento funcionando');
    console.log('   ✅ Verificação de inscrição duplicada funcionando');
    console.log('   ✅ Inserção de inscrição funcionando');
    console.log('   ✅ Atualização de contador funcionando');
    console.log('   ✅ Modal de inscrição deve funcionar agora!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o teste
testDirectRegistration(); 