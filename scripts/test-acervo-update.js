import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testAcervoUpdate() {
  console.log('🧪 Testando atualização do acervo...\n');

  try {
    // Testar leitura
    console.log('📖 Testando leitura...');
    const { data: readData, error: readError } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('id', '4c36cf4b-78c8-435f-8c33-8283df05f895');

    if (readError) {
      console.error('❌ Erro na leitura:', readError);
      return;
    }

    console.log('✅ Leitura bem-sucedida:', readData[0]);

    // Testar atualização
    console.log('\n✏️ Testando atualização...');
    const testUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801630319-htxdgb9sn7k.jpg';
    
    const { data: updateData, error: updateError } = await supabase
      .from('acervo_digital')
      .update({ 
        file_url: testUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', '4c36cf4b-78c8-435f-8c33-8283df05f895')
      .select();

    if (updateError) {
      console.error('❌ Erro na atualização:', updateError);
      return;
    }

    console.log('✅ Atualização bem-sucedida:', updateData[0]);

    // Verificar se foi atualizado
    console.log('\n🔍 Verificando atualização...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('acervo_digital')
      .select('*')
      .eq('id', '4c36cf4b-78c8-435f-8c33-8283df05f895');

    if (verifyError) {
      console.error('❌ Erro na verificação:', verifyError);
      return;
    }

    console.log('✅ Verificação:', verifyData[0]);

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testAcervoUpdate(); 