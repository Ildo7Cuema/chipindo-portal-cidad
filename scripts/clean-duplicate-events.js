import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function cleanDuplicateEvents() {
  try {
    console.log('🧹 Iniciando limpeza de eventos duplicados...\n');

    // 1. Buscar todos os eventos
    const { data: allEvents, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('❌ Erro ao buscar eventos:', fetchError.message);
      return;
    }

    console.log(`📊 Total de eventos encontrados: ${allEvents.length}`);

    // 2. Identificar duplicados por título
    const titleGroups = {};
    allEvents.forEach(event => {
      if (!titleGroups[event.title]) {
        titleGroups[event.title] = [];
      }
      titleGroups[event.title].push(event);
    });

    // 3. Encontrar eventos para manter (o mais recente de cada título)
    const eventsToKeep = [];
    const eventsToDelete = [];

    Object.entries(titleGroups).forEach(([title, events]) => {
      if (events.length > 1) {
        console.log(`\n🔍 Título duplicado: "${title}" (${events.length} eventos)`);
        
        // Ordenar por data de criação (mais recente primeiro)
        events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Manter o mais recente
        const keepEvent = events[0];
        eventsToKeep.push(keepEvent);
        
        console.log(`   ✅ Manter: ID ${keepEvent.id} (criado em ${new Date(keepEvent.created_at).toLocaleString('pt-AO')})`);
        
        // Marcar os outros para eliminação
        events.slice(1).forEach(event => {
          eventsToDelete.push(event.id);
          console.log(`   ❌ Eliminar: ID ${event.id} (criado em ${new Date(event.created_at).toLocaleString('pt-AO')})`);
        });
      } else {
        // Evento único, manter
        eventsToKeep.push(events[0]);
      }
    });

    console.log(`\n📋 Resumo:`);
    console.log(`   • Eventos a manter: ${eventsToKeep.length}`);
    console.log(`   • Eventos a eliminar: ${eventsToDelete.length}`);

    if (eventsToDelete.length === 0) {
      console.log('\n✅ Nenhum evento duplicado encontrado!');
      return;
    }

    // 4. Eliminar eventos duplicados
    console.log('\n🗑️  Eliminando eventos duplicados...');
    
    for (let i = 0; i < eventsToDelete.length; i++) {
      const eventId = eventsToDelete[i];
      try {
        const { error: deleteError } = await supabase.rpc('delete_event', {
          p_id: eventId
        });

        if (deleteError) {
          console.error(`❌ Erro ao eliminar evento ID ${eventId}:`, deleteError.message);
        } else {
          console.log(`✅ Evento ID ${eventId} eliminado com sucesso`);
        }
      } catch (err) {
        console.error(`❌ Erro inesperado ao eliminar evento ID ${eventId}:`, err.message);
      }
    }

    // 5. Verificar resultado final
    console.log('\n🔍 Verificando resultado final...');
    const { data: finalEvents, error: finalError } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (finalError) {
      console.error('❌ Erro ao verificar resultado:', finalError.message);
    } else {
      console.log(`\n✅ Limpeza concluída!`);
      console.log(`📊 Eventos restantes: ${finalEvents.length}`);
      
      console.log('\n📋 Eventos finais:');
      finalEvents.forEach((event, index) => {
        console.log(`${index + 1}. ID: ${event.id} - ${event.title}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
cleanDuplicateEvents(); 