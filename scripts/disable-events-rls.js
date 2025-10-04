import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function disableEventsRLS() {
  try {
    console.log('🔧 Desabilitando RLS da tabela events...');

    // Testar se conseguimos inserir um evento simples
    const testEvent = {
      title: "Teste RLS",
      description: "Evento de teste para verificar RLS",
      date: "2025-12-31",
      event_time: "12:00:00",
      location: "Local de teste",
      organizer: "Teste",
      contact: "+244 000 000 000",
      email: "teste@teste.com",
      price: "Gratuito",
      max_participants: 10,
      current_participants: 0,
      category: "test",
      status: "upcoming",
      featured: false
    };

    console.log('🧪 Testando inserção de evento...');
    const { data, error } = await supabase
      .from('events')
      .insert([testEvent])
      .select();

    if (error) {
      console.error('❌ Erro ao inserir evento de teste:', error.message);
      console.log('🔍 Detalhes do erro:', error);
    } else {
      console.log('✅ Evento de teste inserido com sucesso!');
      console.log('📝 Evento inserido:', data[0]);
      
      // Remover o evento de teste
      console.log('🧹 Removendo evento de teste...');
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', data[0].id);

      if (deleteError) {
        console.log('⚠️  Erro ao remover evento de teste:', deleteError.message);
      } else {
        console.log('✅ Evento de teste removido');
      }
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
disableEventsRLS(); 