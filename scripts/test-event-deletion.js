import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testEventDeletion() {
  try {
    console.log('🧪 Testando funcionalidade de eliminação de eventos...\n');

    // 1. Verificar estado inicial
    console.log('1️⃣ Verificando estado inicial...');
    const { data: initialEvents, error: initialError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (initialError) {
      console.error('❌ Erro ao buscar eventos iniciais:', initialError.message);
      return;
    }

    console.log(`📊 Eventos iniciais: ${initialEvents.length}`);

    if (initialEvents.length === 0) {
      console.log('⚠️  Nenhum evento encontrado para testar!');
      return;
    }

    // 2. Selecionar um evento para eliminar (o primeiro da lista)
    const eventToDelete = initialEvents[0];
    console.log(`\n2️⃣ Evento selecionado para eliminação:`);
    console.log(`   ID: ${eventToDelete.id}`);
    console.log(`   Título: ${eventToDelete.title}`);
    console.log(`   Categoria: ${eventToDelete.category}`);

    // 3. Eliminar o evento
    console.log('\n3️⃣ Eliminando evento...');
    const { error: deleteError } = await supabase.rpc('delete_event', {
      p_id: eventToDelete.id
    });

    if (deleteError) {
      console.error('❌ Erro ao eliminar evento:', deleteError.message);
      return;
    }

    console.log('✅ Evento eliminado com sucesso!');

    // 4. Verificar estado após eliminação
    console.log('\n4️⃣ Verificando estado após eliminação...');
    const { data: finalEvents, error: finalError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (finalError) {
      console.error('❌ Erro ao verificar estado final:', finalError.message);
      return;
    }

    console.log(`📊 Eventos restantes: ${finalEvents.length}`);

    // 5. Verificar se o evento foi realmente eliminado
    const eventStillExists = finalEvents.find(e => e.id === eventToDelete.id);
    
    if (eventStillExists) {
      console.log('❌ PROBLEMA: O evento ainda existe após eliminação!');
      console.log('   Isso indica que a eliminação não funcionou corretamente.');
    } else {
      console.log('✅ SUCESSO: O evento foi eliminado corretamente!');
    }

    // 6. Mostrar lista atualizada
    console.log('\n📋 Lista atualizada de eventos:');
    finalEvents.forEach((event, index) => {
      console.log(`${index + 1}. ID: ${event.id} - ${event.title}`);
    });

    // 7. Testar busca específica do evento eliminado
    console.log('\n5️⃣ Testando busca do evento eliminado...');
    const { data: deletedEvent, error: searchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventToDelete.id)
      .single();

    if (searchError && searchError.code === 'PGRST116') {
      console.log('✅ Confirmação: Evento não encontrado (eliminado com sucesso)');
    } else if (deletedEvent) {
      console.log('❌ PROBLEMA: Evento ainda pode ser encontrado!');
    } else {
      console.log('✅ Confirmação: Evento eliminado corretamente');
    }

    console.log('\n🎉 Teste de eliminação concluído!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
testEventDeletion(); 