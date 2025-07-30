import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixAcervoUrlsFinal() {
  console.log('🔧 Correção final dos URLs do acervo digital...\n');

  try {
    // Buscar todos os itens
    const { data: items, error } = await supabase
      .from('acervo_digital')
      .select('*');

    if (error) {
      console.error('Erro ao buscar itens:', error);
      return;
    }

    console.log(`Total de itens encontrados: ${items.length}\n`);

    // Mapeamento direto dos arquivos conhecidos
    const fileMappings = {
      '4c36cf4b-78c8-435f-8c33-8283df05f895': '1753801630319-htxdgb9sn7k.jpg', // Estudantes Finalistas.jpg
      'bb3bdbfe-ec9e-440a-b334-7286a4c638d4': '1753801633098-ssxsitgyrye.mov', // Chipindo - 29:08:2024.mov
    };

    let fixedCount = 0;

    for (const item of items) {
      console.log(`📁 Verificando: ${item.title}`);
      console.log(`   ID: ${item.id}`);
      console.log(`   URL atual: ${item.file_url || 'NULL'}`);
      console.log(`   Público: ${item.is_public ? '✅' : '❌'}`);

      // Se o item tem URL nulo e está no mapeamento
      if (!item.file_url && fileMappings[item.id]) {
        const fileName = fileMappings[item.id];
        console.log(`   🔧 Corrigindo com arquivo: ${fileName}`);

        // Gerar URL público
        const { data: { publicUrl } } = supabase.storage
          .from('acervo-digital')
          .getPublicUrl(fileName);

        console.log(`   🔗 URL gerado: ${publicUrl}`);

        // Atualizar no banco
        const { error: updateError } = await supabase
          .from('acervo_digital')
          .update({ file_url: publicUrl })
          .eq('id', item.id);

        if (updateError) {
          console.log(`   ❌ Erro ao atualizar: ${updateError.message}`);
        } else {
          console.log(`   ✅ URL corrigido com sucesso!`);
          fixedCount++;
        }
      } else if (item.file_url) {
        console.log(`   ✅ URL já existe`);
      } else {
        console.log(`   ❌ Sem mapeamento disponível`);
      }

      console.log('');
    }

    console.log(`✅ Correção concluída! ${fixedCount} URLs corrigidos.`);

    // Verificar resultado final
    console.log('\n🔍 Verificação final:');
    const { data: finalItems } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('is_public', true);

    if (finalItems) {
      finalItems.forEach(item => {
        console.log(`   ${item.title}: ${item.file_url ? '✅' : '❌'} ${item.file_url || 'NULL'}`);
      });
    }

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

fixAcervoUrlsFinal(); 