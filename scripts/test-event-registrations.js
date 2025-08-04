import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('🧪 Testando sistema de inscrições em eventos...\n');

async function testEventRegistrations() {
  try {
    // 1. Verificar se a tabela event_registrations existe
    console.log('1️⃣ Verificando tabela event_registrations...');
    
    const { data: tableExists, error: tableError } = await supabase
      .from('event_registrations')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError.message);
      return;
    }
    
    console.log('✅ Tabela event_registrations existe');

    // 2. Verificar se existem eventos
    console.log('\n2️⃣ Verificando eventos disponíveis...');
    
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, max_participants, current_participants')
      .order('date', { ascending: true });
    
    if (eventsError) {
      console.error('❌ Erro ao buscar eventos:', eventsError.message);
      return;
    }
    
    if (!events || events.length === 0) {
      console.log('⚠️  Nenhum evento encontrado');
      return;
    }
    
    console.log(`✅ ${events.length} eventos encontrados:`);
    events.forEach(event => {
      console.log(`   - ${event.title} (ID: ${event.id})`);
      console.log(`     Vagas: ${event.current_participants}/${event.max_participants || 'Ilimitado'}`);
    });

    // 3. Testar função register_for_event
    console.log('\n3️⃣ Testando função register_for_event...');
    
    const testEvent = events[0];
    const testRegistration = {
      p_event_id: testEvent.id,
      p_participant_name: 'Teste Usuário',
      p_participant_email: 'teste@email.com',
      p_participant_phone: '+244 123 456 789',
      p_participant_age: 25,
      p_participant_gender: 'Masculino',
      p_participant_address: 'Rua Teste, Chipindo',
      p_participant_occupation: 'Testador',
      p_participant_organization: 'Sistema de Teste',
      p_special_needs: 'Nenhuma',
      p_dietary_restrictions: 'Nenhuma',
      p_emergency_contact_name: 'Contacto Teste',
      p_emergency_contact_phone: '+244 987 654 321'
    };
    
    const { data: registrationResult, error: registrationError } = await supabase.rpc('register_for_event', testRegistration);
    
    if (registrationError) {
      console.error('❌ Erro ao registrar:', registrationError.message);
    } else {
      console.log('✅ Inscrição criada com sucesso, ID:', registrationResult);
    }

    // 4. Verificar inscrições existentes
    console.log('\n4️⃣ Verificando inscrições existentes...');
    
    const { data: registrations, error: registrationsError } = await supabase
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
      .order('registration_date', { ascending: false })
      .limit(10);
    
    if (registrationsError) {
      console.error('❌ Erro ao buscar inscrições:', registrationsError.message);
    } else {
      console.log(`✅ ${registrations?.length || 0} inscrições encontradas:`);
      registrations?.forEach(reg => {
        console.log(`   - ${reg.participant_name} (${reg.participant_email})`);
        console.log(`     Evento: ${reg.events?.title}`);
        console.log(`     Status: ${reg.status}`);
        console.log(`     Data: ${new Date(reg.registration_date).toLocaleDateString('pt-AO')}`);
      });
    }

    // 5. Testar estatísticas
    console.log('\n5️⃣ Testando estatísticas...');
    
    const stats = {
      total: registrations?.length || 0,
      confirmed: registrations?.filter(r => r.status === 'confirmed').length || 0,
      pending: registrations?.filter(r => r.status === 'pending').length || 0,
      cancelled: registrations?.filter(r => r.status === 'cancelled').length || 0,
      attended: registrations?.filter(r => r.status === 'attended').length || 0
    };
    
    console.log('📊 Estatísticas das inscrições:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Confirmadas: ${stats.confirmed}`);
    console.log(`   - Pendentes: ${stats.pending}`);
    console.log(`   - Canceladas: ${stats.cancelled}`);
    console.log(`   - Presentes: ${stats.attended}`);

    // 6. Testar atualização de status
    console.log('\n6️⃣ Testando atualização de status...');
    
    if (registrations && registrations.length > 0) {
      const testRegistration = registrations[0];
      
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({ 
          status: 'confirmed',
          notes: 'Teste de atualização de status'
        })
        .eq('id', testRegistration.id);
      
      if (updateError) {
        console.error('❌ Erro ao atualizar status:', updateError.message);
      } else {
        console.log('✅ Status atualizado com sucesso');
      }
    }

    // 7. Verificar contadores de eventos
    console.log('\n7️⃣ Verificando contadores de eventos...');
    
    const { data: updatedEvents, error: updatedEventsError } = await supabase
      .from('events')
      .select('id, title, current_participants, max_participants')
      .order('date', { ascending: true });
    
    if (updatedEventsError) {
      console.error('❌ Erro ao buscar eventos atualizados:', updatedEventsError.message);
    } else {
      console.log('📊 Contadores atualizados:');
      updatedEvents?.forEach(event => {
        console.log(`   - ${event.title}: ${event.current_participants}/${event.max_participants || 'Ilimitado'}`);
      });
    }

    console.log('\n🎉 Teste do sistema de inscrições concluído!');
    console.log('\n📋 Resumo:');
    console.log('   ✅ Tabela event_registrations verificada');
    console.log('   ✅ Eventos carregados');
    console.log('   ✅ Função register_for_event testada');
    console.log('   ✅ Inscrições listadas');
    console.log('   ✅ Estatísticas calculadas');
    console.log('   ✅ Atualização de status testada');
    console.log('   ✅ Contadores verificados');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar teste
testEventRegistrations(); 