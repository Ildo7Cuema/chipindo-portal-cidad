import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkEventsStatus() {
  try {
    console.log('🔍 Verificando estado atual dos eventos no banco de dados...\n');

    // Buscar todos os eventos
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar eventos:', error.message);
      return;
    }

    console.log(`📊 Total de eventos encontrados: ${events.length}\n`);

    if (events.length === 0) {
      console.log('⚠️  Nenhum evento encontrado no banco de dados!');
      return;
    }

    // Mostrar detalhes de cada evento
    console.log('📋 Lista de eventos no banco de dados:');
    console.log('─'.repeat(80));
    
    events.forEach((event, index) => {
      console.log(`${index + 1}. ID: ${event.id}`);
      console.log(`   Título: ${event.title}`);
      console.log(`   Categoria: ${event.category}`);
      console.log(`   Data: ${event.date}`);
      console.log(`   Estado: ${event.status}`);
      console.log(`   Destacado: ${event.featured ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${new Date(event.created_at).toLocaleString('pt-AO')}`);
      console.log('─'.repeat(80));
    });

    // Estatísticas
    const featuredEvents = events.filter(e => e.featured).length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const categories = [...new Set(events.map(e => e.category))];

    console.log('\n📈 Estatísticas:');
    console.log(`   • Eventos destacados: ${featuredEvents}`);
    console.log(`   • Eventos próximos: ${upcomingEvents}`);
    console.log(`   • Categorias: ${categories.join(', ')}`);

    // Verificar se há eventos duplicados
    const titles = events.map(e => e.title);
    const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  Eventos duplicados encontrados:');
      duplicates.forEach(title => {
        console.log(`   • ${title}`);
      });
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
checkEventsStatus(); 