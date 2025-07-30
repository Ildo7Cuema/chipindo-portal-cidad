import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function mapAcervoFiles() {
  console.log('🔗 Mapeando arquivos do acervo...\n');

  try {
    // Buscar todos os itens do acervo
    const { data: items, error: itemsError } = await supabase
      .from('acervo_digital')
      .select('*');

    if (itemsError) {
      console.error('Erro ao buscar itens:', itemsError);
      return;
    }

    // Buscar todos os arquivos do storage
    const { data: files, error: filesError } = await supabase.storage
      .from('acervo-digital')
      .list('', { limit: 1000 });

    if (filesError) {
      console.error('Erro ao listar arquivos:', filesError);
      return;
    }

    console.log(`📊 Itens no banco: ${items.length}`);
    console.log(`📁 Arquivos no storage: ${files.length}\n`);

    // Mapear por data de criação
    const itemsByDate = {};
    items.forEach(item => {
      const date = new Date(item.created_at);
      const dateKey = date.toISOString().split('T')[0];
      if (!itemsByDate[dateKey]) {
        itemsByDate[dateKey] = [];
      }
      itemsByDate[dateKey].push(item);
    });

    // Mapear arquivos por data (baseado no timestamp no nome)
    const filesByDate = {};
    files.forEach(file => {
      if (file.name.match(/^\d{13}-/)) {
        const timestamp = parseInt(file.name.split('-')[0]);
        const date = new Date(timestamp);
        const dateKey = date.toISOString().split('T')[0];
        if (!filesByDate[dateKey]) {
          filesByDate[dateKey] = [];
        }
        filesByDate[dateKey].push(file);
      }
    });

    console.log('📅 Mapeamento por data:');
    Object.keys(itemsByDate).forEach(date => {
      console.log(`\n📅 ${date}:`);
      console.log(`   Itens: ${itemsByDate[date].length}`);
      console.log(`   Arquivos: ${filesByDate[date]?.length || 0}`);
      
      if (filesByDate[date]) {
        itemsByDate[date].forEach((item, index) => {
          const file = filesByDate[date][index];
          if (file) {
            console.log(`   ✅ ${item.title} -> ${file.name}`);
            
            // Gerar URL público
            const { data: { publicUrl } } = supabase.storage
              .from('acervo-digital')
              .getPublicUrl(file.name);

            // Atualizar no banco se necessário
            if (item.file_url !== publicUrl) {
              console.log(`   🔧 Atualizando URL para: ${publicUrl}`);
              
              supabase
                .from('acervo_digital')
                .update({ file_url: publicUrl })
                .eq('id', item.id)
                .then(({ error }) => {
                  if (error) {
                    console.log(`   ❌ Erro ao atualizar: ${error.message}`);
                  } else {
                    console.log(`   ✅ URL atualizado!`);
                  }
                });
            }
          } else {
            console.log(`   ❌ ${item.title} -> Arquivo não encontrado`);
          }
        });
      }
    });

    console.log('\n✅ Mapeamento concluído!');

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

mapAcervoFiles(); 