import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkAllAcervo() {
  console.log('🔍 Verificando todos os itens do acervo...\n');

  try {
    const { data: items, error } = await supabase
      .from('acervo_digital')
      .select('*');

    if (error) {
      console.error('Erro:', error);
      return;
    }

    console.log(`Total de itens: ${items.length}\n`);

    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Tipo: ${item.type}`);
      console.log(`   Público: ${item.is_public ? '✅' : '❌'}`);
      console.log(`   URL: ${item.file_url || 'NULL'}`);
      console.log(`   Thumbnail: ${item.thumbnail_url || 'NULL'}`);
      console.log(`   Departamento: ${item.department}`);
      console.log(`   Criado em: ${item.created_at}`);
      console.log('');
    });

  } catch (error) {
    console.error('Erro:', error);
  }
}

checkAllAcervo(); 