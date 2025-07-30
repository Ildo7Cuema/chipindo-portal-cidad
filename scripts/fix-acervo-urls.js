import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixAcervoUrls() {
  console.log('🔧 Corrigindo URLs do acervo digital...\n');

  try {
    // Buscar itens com URLs nulos
    const { data: items, error } = await supabase
      .from('acervo_digital')
      .select('*')
      .is('file_url', null);

    if (error) {
      console.error('Erro ao buscar itens:', error);
      return;
    }

    console.log(`Encontrados ${items.length} itens com URLs nulos\n`);

    for (const item of items) {
      console.log(`🔧 Corrigindo: ${item.title}`);
      console.log(`   Tipo: ${item.type}`);
      console.log(`   ID: ${item.id}`);

      // Tentar encontrar o arquivo no storage
      try {
        // Listar arquivos no bucket
        const { data: files, error: listError } = await supabase.storage
          .from('acervo-digital')
          .list('', {
            limit: 100,
            offset: 0,
            search: item.title.replace(/[^a-zA-Z0-9]/g, '') // Buscar por nome similar
          });

        if (listError) {
          console.log(`   ❌ Erro ao listar arquivos: ${listError.message}`);
          continue;
        }

        console.log(`   📁 Arquivos encontrados no storage: ${files.length}`);

        // Procurar por arquivo que corresponda ao título
        let foundFile = null;
        for (const file of files) {
          if (file.name.toLowerCase().includes(item.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')) ||
              item.title.toLowerCase().includes(file.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))) {
            foundFile = file;
            break;
          }
        }

        if (foundFile) {
          console.log(`   ✅ Arquivo encontrado: ${foundFile.name}`);
          
          // Gerar URL público
          const { data: { publicUrl } } = supabase.storage
            .from('acervo-digital')
            .getPublicUrl(foundFile.name);

          console.log(`   🔗 URL gerado: ${publicUrl}`);

          // Atualizar no banco
          const { error: updateError } = await supabase
            .from('acervo_digital')
            .update({ file_url: publicUrl })
            .eq('id', item.id);

          if (updateError) {
            console.log(`   ❌ Erro ao atualizar: ${updateError.message}`);
          } else {
            console.log(`   ✅ URL atualizado com sucesso!`);
          }
        } else {
          console.log(`   ❌ Arquivo não encontrado no storage`);
        }

      } catch (error) {
        console.log(`   ❌ Erro ao processar: ${error.message}`);
      }

      console.log('');
    }

    console.log('✅ Processo de correção concluído!');

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

fixAcervoUrls(); 