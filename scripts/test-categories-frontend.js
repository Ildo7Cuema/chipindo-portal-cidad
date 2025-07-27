import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCategoriesFrontend() {
  console.log('🧪 Testando carregamento de categorias para o frontend...\n');

  try {
    // Simular o que o hook faz
    console.log('📋 Buscando categorias da tabela...');
    const { data, error } = await supabase
      .from('ouvidoria_categorias')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    
    if (error) {
      console.error('❌ Erro ao buscar categorias:', error);
    } else {
      console.log('✅ Categorias brutas encontradas:', data);
      
      // Formatar como o hook faz
      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.nome,
        description: cat.descricao,
        color: cat.cor,
        bgColor: cat.bg_color
      }));
      
      console.log('✅ Categorias formatadas para o frontend:', formattedCategories);
      
      // Verificar se há categorias suficientes
      if (formattedCategories.length > 0) {
        console.log('✅ Categorias disponíveis para o dropdown:');
        formattedCategories.forEach((cat, index) => {
          console.log(`  ${index + 1}. ${cat.name} (${cat.id}) - ${cat.color}`);
        });
      } else {
        console.log('⚠️ Nenhuma categoria encontrada');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testCategoriesFrontend(); 