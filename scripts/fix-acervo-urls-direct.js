import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixAcervoUrlsDirect() {
  console.log('🔧 Corrigindo URLs diretamente...\n');

  try {
    // Mapeamento direto baseado no que vimos
    const fixes = [
      {
        id: '4c36cf4b-78c8-435f-8c33-8283df05f895', // Estudantes Finalistas.jpg
        fileName: '1753801630319-htxdgb9sn7k.jpg'
      },
      {
        id: 'bb3bdbfe-ec9e-440a-b334-7286a4c638d4', // Chipindo - 29:08:2024.mov
        fileName: '1753801633098-ssxsitgyrye.mov'
      }
    ];

    for (const fix of fixes) {
      console.log(`🔧 Corrigindo item ID: ${fix.id}`);
      console.log(`   Arquivo: ${fix.fileName}`);

      // Gerar URL público
      const { data: { publicUrl } } = supabase.storage
        .from('acervo-digital')
        .getPublicUrl(fix.fileName);

      console.log(`   URL gerado: ${publicUrl}`);

      // Atualizar no banco
      const { error } = await supabase
        .from('acervo_digital')
        .update({ file_url: publicUrl })
        .eq('id', fix.id);

      if (error) {
        console.log(`   ❌ Erro: ${error.message}`);
      } else {
        console.log(`   ✅ Atualizado com sucesso!`);
      }

      console.log('');
    }

    console.log('✅ Correção concluída!');

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

fixAcervoUrlsDirect(); 