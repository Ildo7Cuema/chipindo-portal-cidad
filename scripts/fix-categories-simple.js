import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixCategories() {
  console.log('🔧 Corrigindo função de categorias...\n');

  try {
    // Buscar categorias diretamente da tabela
    console.log('📋 Buscando categorias da tabela...');
    const { data: categories, error } = await supabase
      .from('ouvidoria_categorias')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    
    if (error) {
      console.error('❌ Erro ao buscar categorias:', error);
    } else {
      console.log('✅ Categorias encontradas:', categories);
      
      // Formatar categorias para o formato esperado
      const formattedCategories = categories.map(cat => ({
        id: cat.id,
        name: cat.nome,
        description: cat.descricao,
        color: cat.cor,
        bgColor: cat.bg_color
      }));
      
      console.log('✅ Categorias formatadas:', formattedCategories);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

fixCategories(); 