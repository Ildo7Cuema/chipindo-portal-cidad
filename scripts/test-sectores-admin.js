import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSetoresAdmin() {
  console.log('🔍 Testando carregamento dos Setores Estratégicos...\n');

  try {
    // Teste 1: Buscar todos os setores (sem filtro de ativo)
    console.log('📊 Teste 1: Buscando todos os setores (sem filtro ativo)...');
    const { data: allSetores, error: allError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .order('ordem');

    if (allError) {
      console.error('❌ Erro ao buscar todos os setores:', allError);
    } else {
      console.log(`✅ ${allSetores.length} setores encontrados (todos):`);
      allSetores.forEach(setor => {
        console.log(`   - ${setor.nome} (${setor.slug}) - Ativo: ${setor.ativo}`);
      });
    }

    // Teste 2: Buscar apenas setores ativos
    console.log('\n📊 Teste 2: Buscando apenas setores ativos...');
    const { data: activeSetores, error: activeError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .eq('ativo', true)
      .order('ordem');

    if (activeError) {
      console.error('❌ Erro ao buscar setores ativos:', activeError);
    } else {
      console.log(`✅ ${activeSetores.length} setores ativos encontrados:`);
      activeSetores.forEach(setor => {
        console.log(`   - ${setor.nome} (${setor.slug})`);
      });
    }

    // Teste 3: Verificar se há estatísticas
    console.log('\n📊 Teste 3: Verificando estatísticas dos setores...');
    const { data: estatisticas, error: statsError } = await supabase
      .from('setores_estatisticas')
      .select('*')
      .limit(10);

    if (statsError) {
      console.error('❌ Erro ao buscar estatísticas:', statsError);
    } else {
      console.log(`✅ ${estatisticas.length} estatísticas encontradas`);
      if (estatisticas.length > 0) {
        console.log('   Primeiras estatísticas:');
        estatisticas.slice(0, 3).forEach(stat => {
          console.log(`   - ${stat.nome}: ${stat.valor}`);
        });
      }
    }

    // Teste 4: Verificar estrutura da tabela
    console.log('\n📊 Teste 4: Verificando estrutura da tabela...');
    const { data: sampleSetor, error: sampleError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .limit(1)
      .single();

    if (sampleError) {
      console.error('❌ Erro ao buscar amostra:', sampleError);
    } else {
      console.log('✅ Estrutura da tabela verificada:');
      console.log('   Campos disponíveis:', Object.keys(sampleSetor));
    }

    console.log('\n🎉 Testes concluídos!');
    console.log('\n📝 Resumo:');
    console.log(`   - Total de setores: ${allSetores?.length || 0}`);
    console.log(`   - Setores ativos: ${activeSetores?.length || 0}`);
    console.log(`   - Estatísticas: ${estatisticas?.length || 0}`);
    
    if (allSetores && allSetores.length > 0) {
      console.log('\n✅ Os setores estão disponíveis no banco de dados!');
      console.log('   A área administrativa deve mostrar todos os setores.');
    } else {
      console.log('\n❌ Nenhum setor encontrado no banco de dados.');
      console.log('   Execute o script insert-setores-data.js primeiro.');
    }

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testSetoresAdmin(); 