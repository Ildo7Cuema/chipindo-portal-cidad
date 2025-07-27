import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSatisfactionFormat() {
  console.log('🧪 Testando formatação da satisfação geral...\n');

  try {
    // Buscar estatísticas
    console.log('📊 Buscando estatísticas...');
    const { data: stats, error } = await supabase.rpc('get_ouvidoria_stats');
    
    if (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
    } else {
      console.log('✅ Estatísticas carregadas:', stats);
      
      // Testar formatação
      const satisfacaoOriginal = stats?.satisfacao_geral || 0;
      const satisfacaoFormatada = satisfacaoOriginal.toFixed(2);
      
      console.log('\n📋 Formatação da Satisfação Geral:');
      console.log(`  Valor original: ${satisfacaoOriginal}`);
      console.log(`  Valor formatado: ${satisfacaoFormatada}`);
      console.log(`  Exibição final: ${satisfacaoFormatada}/5`);
      
      // Verificar se a formatação está correta
      if (satisfacaoFormatada.includes('.') && satisfacaoFormatada.split('.')[1].length === 2) {
        console.log('✅ Formatação correta: 2 casas decimais');
      } else {
        console.log('❌ Formatação incorreta');
      }
    }

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testSatisfactionFormat(); 