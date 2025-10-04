import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testSyncBetweenAdminPublic() {
  try {
    console.log('🔄 Testando sincronização entre área administrativa e pública...\n');

    // 1. Verificar estado inicial
    console.log('1️⃣ Estado inicial dos eventos:');
    const { data: initialEvents, error: initialError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (initialError) {
      console.error('❌ Erro ao buscar eventos iniciais:', initialError.message);
      return;
    }

    console.log(`   📊 Total de eventos: ${initialEvents.length}`);
    initialEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ID: ${event.id} - ${event.title}`);
    });

    // 2. Simular operação administrativa (criar novo evento)
    console.log('\n2️⃣ Simulando criação de evento na área administrativa...');
    
    const newEvent = {
      title: "Teste de Sincronização",
      description: "Evento criado para testar sincronização entre áreas",
      date: "2025-12-31",
      event_time: "14:00:00",
      location: "Local de Teste",
      organizer: "Administração de Teste",
      contact: "+244 999 999 999",
      email: "teste@teste.com",
      price: "Gratuito",
      max_participants: 50,
      current_participants: 0,
      category: "test",
      status: "upcoming",
      featured: false
    };

    const { data: createdEvent, error: createError } = await supabase.rpc('create_event', {
      p_title: newEvent.title,
      p_description: newEvent.description,
      p_date: newEvent.date,
      p_event_time: newEvent.event_time,
      p_location: newEvent.location,
      p_organizer: newEvent.organizer,
      p_contact: newEvent.contact,
      p_email: newEvent.email,
      p_price: newEvent.price,
      p_max_participants: newEvent.max_participants,
      p_category: newEvent.category,
      p_status: newEvent.status,
      p_featured: newEvent.featured
    });

    if (createError) {
      console.error('❌ Erro ao criar evento:', createError.message);
      return;
    }

    console.log(`   ✅ Evento criado com ID: ${createdEvent}`);

    // 3. Verificar se o evento aparece na "área pública" (mesma consulta)
    console.log('\n3️⃣ Verificando se evento aparece na área pública...');
    
    const { data: publicEvents, error: publicError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (publicError) {
      console.error('❌ Erro ao buscar eventos públicos:', publicError.message);
      return;
    }

    console.log(`   📊 Total de eventos na área pública: ${publicEvents.length}`);
    
    const newEventInPublic = publicEvents.find(e => e.id === createdEvent);
    
    if (newEventInPublic) {
      console.log('   ✅ SUCESSO: Evento aparece na área pública!');
      console.log(`   📝 Detalhes: ${newEventInPublic.title} (ID: ${newEventInPublic.id})`);
    } else {
      console.log('   ❌ PROBLEMA: Evento não aparece na área pública!');
    }

    // 4. Simular operação administrativa (eliminar evento)
    console.log('\n4️⃣ Simulando eliminação de evento na área administrativa...');
    
    const { error: deleteError } = await supabase.rpc('delete_event', {
      p_id: createdEvent
    });

    if (deleteError) {
      console.error('❌ Erro ao eliminar evento:', deleteError.message);
      return;
    }

    console.log(`   ✅ Evento ID ${createdEvent} eliminado`);

    // 5. Verificar se o evento foi removido da "área pública"
    console.log('\n5️⃣ Verificando se evento foi removido da área pública...');
    
    const { data: finalEvents, error: finalError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (finalError) {
      console.error('❌ Erro ao buscar eventos finais:', finalError.message);
      return;
    }

    console.log(`   📊 Total de eventos finais: ${finalEvents.length}`);
    
    const deletedEventStillExists = finalEvents.find(e => e.id === createdEvent);
    
    if (deletedEventStillExists) {
      console.log('   ❌ PROBLEMA: Evento ainda aparece na área pública após eliminação!');
    } else {
      console.log('   ✅ SUCESSO: Evento foi removido da área pública!');
    }

    // 6. Resumo final
    console.log('\n📋 Resumo da sincronização:');
    console.log(`   • Eventos iniciais: ${initialEvents.length}`);
    console.log(`   • Eventos após criação: ${publicEvents.length}`);
    console.log(`   • Eventos após eliminação: ${finalEvents.length}`);
    console.log(`   • Sincronização: ${!deletedEventStillExists ? '✅ FUNCIONANDO' : '❌ COM PROBLEMAS'}`);

    console.log('\n🎉 Teste de sincronização concluído!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
testSyncBetweenAdminPublic(); 