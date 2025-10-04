import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testHeroStatsQueries() {
  console.log('🧪 Testando consultas específicas do hook useHeroStats...\n');

  try {
    // 1. Testar consulta de população (exatamente como no hook)
    console.log('📊 Testando consulta de população...');
    const { data: populationData, error: populationError } = await supabase
      .from('population_history')
      .select('*')
      .order('year', { ascending: false })
      .limit(2);

    if (populationError) {
      console.error('❌ Erro na consulta de população:', populationError.message);
    } else {
      console.log('✅ Consulta de população bem-sucedida');
      console.log('📈 Dados retornados:');
      populationData.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.year}: ${record.population_count?.toLocaleString('pt-AO')} habitantes`);
      });

      // Calcular taxa de crescimento como no hook
      if (populationData && populationData.length > 0) {
        const currentRecord = populationData[0];
        const previousRecord = populationData[1];
        const currentPopulation = currentRecord.population_count;
        let growthRate = 0;

        if (previousRecord && previousRecord.population_count > 0) {
          growthRate = ((currentPopulation - previousRecord.population_count) / previousRecord.population_count) * 100;
        }

        console.log(`📊 Cálculos do hook:`);
        console.log(`   População atual: ${currentPopulation.toLocaleString('pt-AO')}`);
        console.log(`   Taxa de crescimento: ${Math.round(growthRate * 100) / 100}%`);
        console.log(`   Período: ${currentRecord.year}`);
      }
    }

    // 2. Testar consulta de setores (exatamente como no hook)
    console.log('\n🏭 Testando consulta de setores estratégicos...');
    const { data: setoresData, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('id', { count: 'exact', head: true })
      .eq('ativo', true);

    if (setoresError) {
      console.error('❌ Erro na consulta de setores:', setoresError.message);
    } else {
      console.log('✅ Consulta de setores bem-sucedida');
      console.log(`📊 Contagem retornada: ${setoresData?.count || 0} setores ativos`);
    }

    // 3. Testar consulta de concursos (exatamente como no hook)
    console.log('\n🎯 Testando consulta de concursos...');
    const { data: concursosData, error: concursosError } = await supabase
      .from('concursos')
      .select('id', { count: 'exact', head: true })
      .eq('published', true);

    if (concursosError) {
      console.error('❌ Erro na consulta de concursos:', concursosError.message);
    } else {
      console.log('✅ Consulta de concursos bem-sucedida');
      console.log(`📊 Contagem retornada: ${concursosData?.count || 0} concursos publicados`);
    }

    // 4. Testar consulta de notícias (exatamente como no hook)
    console.log('\n📰 Testando consulta de notícias...');
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('id', { count: 'exact', head: true })
      .eq('published', true);

    if (newsError) {
      console.error('❌ Erro na consulta de notícias:', newsError.message);
    } else {
      console.log('✅ Consulta de notícias bem-sucedida');
      console.log(`📊 Contagem retornada: ${newsData?.count || 0} notícias publicadas`);
    }

    // 5. Simular o objeto final que o hook retorna
    console.log('\n📋 SIMULAÇÃO DO OBJETO FINAL DO HOOK:');
    console.log('=====================================');
    
    const currentPopulation = populationData?.[0]?.population_count || 0;
    const populationFormatted = currentPopulation > 0 
      ? `${currentPopulation.toLocaleString('pt-AO')}+`
      : "0";
    
    const sectors = setoresData?.count || 0;
    const projects = newsData?.count || 0;
    const opportunities = concursosData?.count || 0;

    const heroStats = {
      population: currentPopulation,
      populationFormatted,
      sectors,
      projects,
      opportunities,
      loading: false,
      error: null
    };

    console.log('📊 Objeto heroStats:');
    console.log(JSON.stringify(heroStats, null, 2));

    // 6. Verificar se os valores estão corretos
    console.log('\n✅ VERIFICAÇÃO FINAL:');
    console.log('=====================');
    console.log(`👥 População: ${heroStats.populationFormatted} (${heroStats.population} habitantes)`);
    console.log(`🏭 Setores: ${heroStats.sectors}+`);
    console.log(`📰 Projetos: ${heroStats.projects}+`);
    console.log(`🎯 Oportunidades: ${heroStats.opportunities}+`);

    if (heroStats.population > 0 && heroStats.sectors > 0) {
      console.log('\n✅ Todas as estatísticas estão sendo carregadas corretamente!');
      console.log('💡 Se o Hero não está exibindo os dados, o problema pode estar no componente React.');
    } else {
      console.log('\n⚠️  Algumas estatísticas estão vazias ou zeradas.');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
testHeroStatsQueries(); 