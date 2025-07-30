import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function executeSqlFix() {
  console.log('🔧 Executando correção SQL direta...\n');

  try {
    // Executar SQL para corrigir URLs
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        UPDATE acervo_digital 
        SET file_url = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801630319-htxdgb9sn7k.jpg'
        WHERE id = '4c36cf4b-78c8-435f-8c33-8283df05f895' AND file_url IS NULL;
        
        UPDATE acervo_digital 
        SET file_url = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801633098-ssxsitgyrye.mov'
        WHERE id = 'bb3bdbfe-ec9e-440a-b334-7286a4c638d4' AND file_url IS NULL;
        
        UPDATE acervo_digital 
        SET file_url = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801656710-3h9p1jrs2yh.jpg'
        WHERE id = 'edb6a77e-1e52-48ee-acc0-2587b8dabb2d' AND file_url IS NULL;
      `
    });

    if (error) {
      console.log('❌ Erro na execução SQL:', error);
      console.log('🔧 Tentando método alternativo...');
      
      // Método alternativo: atualizações individuais
      const updates = [
        {
          id: '4c36cf4b-78c8-435f-8c33-8283df05f895',
          url: 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801630319-htxdgb9sn7k.jpg'
        },
        {
          id: 'bb3bdbfe-ec9e-440a-b334-7286a4c638d4',
          url: 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801633098-ssxsitgyrye.mov'
        },
        {
          id: 'edb6a77e-1e52-48ee-acc0-2587b8dabb2d',
          url: 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801656710-3h9p1jrs2yh.jpg'
        }
      ];

      for (const update of updates) {
        console.log(`🔧 Atualizando ${update.id}...`);
        
        const { error: updateError } = await supabase
          .from('acervo_digital')
          .update({ file_url: update.url })
          .eq('id', update.id)
          .is('file_url', null);

        if (updateError) {
          console.log(`   ❌ Erro: ${updateError.message}`);
        } else {
          console.log(`   ✅ Atualização enviada`);
        }
      }
    } else {
      console.log('✅ Correção SQL executada com sucesso:', data);
    }

    // Verificar resultado
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

executeSqlFix(); 