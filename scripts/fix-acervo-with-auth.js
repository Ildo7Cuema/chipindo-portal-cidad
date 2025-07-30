import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixAcervoWithAuth() {
  console.log('🔧 Corrigindo URLs com autenticação...\n');

  try {
    // Primeiro, vamos verificar se conseguimos ler os dados
    console.log('📖 Testando leitura...');
    const { data: readData, error: readError } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('is_public', true);

    if (readError) {
      console.error('❌ Erro na leitura:', readError);
      return;
    }

    console.log(`✅ Leitura bem-sucedida. ${readData.length} itens públicos encontrados.\n`);

    // Mostrar itens com URLs nulos
    const itemsWithNullUrls = readData.filter(item => !item.file_url);
    console.log(`📁 Itens com URLs nulos: ${itemsWithNullUrls.length}`);

    itemsWithNullUrls.forEach(item => {
      console.log(`   - ${item.title} (ID: ${item.id})`);
    });

    console.log('\n🔧 Tentando correção via SQL direto...');

    // Tentar correção via SQL
    const { data: updateResult, error: updateError } = await supabase
      .rpc('fix_acervo_urls', {
        item_id_1: '4c36cf4b-78c8-435f-8c33-8283df05f895',
        file_name_1: '1753801630319-htxdgb9sn7k.jpg',
        item_id_2: 'bb3bdbfe-ec9e-440a-b334-7286a4c638d4',
        file_name_2: '1753801633098-ssxsitgyrye.mov'
      });

    if (updateError) {
      console.log('❌ Erro na função RPC:', updateError);
      console.log('🔧 Tentando correção manual...');
      
      // Tentar correção manual
      for (const item of itemsWithNullUrls) {
        console.log(`\n🔧 Corrigindo: ${item.title}`);
        
        let fileName = null;
        if (item.id === '4c36cf4b-78c8-435f-8c33-8283df05f895') {
          fileName = '1753801630319-htxdgb9sn7k.jpg';
        } else if (item.id === 'bb3bdbfe-ec9e-440a-b334-7286a4c638d4') {
          fileName = '1753801633098-ssxsitgyrye.mov';
        }
        
        if (fileName) {
          const { data: { publicUrl } } = supabase.storage
            .from('acervo-digital')
            .getPublicUrl(fileName);
          
          console.log(`   URL gerado: ${publicUrl}`);
          
          // Tentar atualização
          const { error: singleUpdateError } = await supabase
            .from('acervo_digital')
            .update({ file_url: publicUrl })
            .eq('id', item.id);
          
          if (singleUpdateError) {
            console.log(`   ❌ Erro: ${singleUpdateError.message}`);
          } else {
            console.log(`   ✅ Atualização enviada`);
          }
        }
      }
    } else {
      console.log('✅ Correção via RPC bem-sucedida:', updateResult);
    }

    // Verificar resultado final
    console.log('\n🔍 Verificação final...');
    const { data: finalData } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('is_public', true);

    if (finalData) {
      finalData.forEach(item => {
        const status = item.file_url ? '✅' : '❌';
        console.log(`   ${status} ${item.title}: ${item.file_url || 'NULL'}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

fixAcervoWithAuth(); 