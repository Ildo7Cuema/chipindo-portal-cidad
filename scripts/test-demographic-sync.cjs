const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDemographicSync() {
  console.log('🔄 Testando sincronização de dados demográficos...\n');

  try {
    // 1. Verificar dados da tabela population_history
    console.log('1. Verificando dados da tabela population_history...');
    const { data: populationData, error: populationError } = await supabase
      .from('population_history')
      .select('*')
      .order('year', { ascending: false })
      .limit(3);

    if (populationError) {
      console.error('❌ Erro ao buscar dados populacionais:', populationError.message);
      return;
    }

    console.log('✅ Dados populacionais encontrados:');
    populationData.forEach(data => {
      console.log(`   - ${data.year}: ${data.population_count.toLocaleString('pt-AO')} habitantes`);
    });

    // 2. Verificar dados da tabela municipality_characterization
    console.log('\n2. Verificando dados da tabela municipality_characterization...');
    const { data: characterizationData, error: characterizationError } = await supabase
      .from('municipality_characterization')
      .select('*')
      .limit(1)
      .single();

    if (characterizationError) {
      console.error('❌ Erro ao buscar dados de caracterização:', characterizationError.message);
      return;
    }

    console.log('✅ Dados de caracterização encontrados:');
    console.log(`   - População: ${characterizationData.demography?.population || 'N/A'}`);
    console.log(`   - Densidade: ${characterizationData.demography?.density || 'N/A'}`);
    console.log(`   - Crescimento: ${characterizationData.demography?.growth || 'N/A'}`);

    // 3. Calcular dados sincronizados
    console.log('\n3. Calculando dados sincronizados...');
    const currentYear = new Date().getFullYear();
    const currentPopulation = populationData[0]?.population_count;
    const previousPopulation = populationData[1]?.population_count;

    if (currentPopulation) {
      const areaKm2 = 2100; // Área do município em km²
      const density = (currentPopulation / areaKm2).toFixed(1);
      
      let growthRate = "2.3% ao ano"; // Valor padrão
      if (previousPopulation && previousPopulation > 0) {
        const growth = ((currentPopulation - previousPopulation) / previousPopulation) * 100;
        growthRate = `${growth.toFixed(1)}% ao ano`;
      }

      console.log('✅ Dados calculados:');
      console.log(`   - População atual: ${currentPopulation.toLocaleString('pt-AO')} habitantes`);
      console.log(`   - Densidade: ${density} hab/km²`);
      console.log(`   - Taxa de crescimento: ${growthRate}`);

      // 4. Verificar consistência
      console.log('\n4. Verificando consistência entre as seções...');
      
      const populationFromHistory = `${currentPopulation.toLocaleString('pt-AO')} habitantes`;
      const densityFromHistory = `${density} hab/km²`;
      
      const populationFromCharacterization = characterizationData.demography?.population;
      const densityFromCharacterization = characterizationData.demography?.density;
      
      console.log('📊 Comparação:');
      console.log(`   População:`);
      console.log(`     - Population History: ${populationFromHistory}`);
      console.log(`     - Municipality Characterization: ${populationFromCharacterization}`);
      console.log(`     - Consistente: ${populationFromHistory === populationFromCharacterization ? '✅' : '❌'}`);
      
      console.log(`   Densidade:`);
      console.log(`     - Calculada: ${densityFromHistory}`);
      console.log(`     - Municipality Characterization: ${densityFromCharacterization}`);
      console.log(`     - Consistente: ${densityFromHistory === densityFromCharacterization ? '✅' : '❌'}`);

      // 5. Atualizar dados de caracterização se necessário
      if (populationFromHistory !== populationFromCharacterization || densityFromHistory !== densityFromCharacterization) {
        console.log('\n5. Atualizando dados de caracterização...');
        
        const updatedDemography = {
          ...characterizationData.demography,
          population: populationFromHistory,
          density: densityFromHistory,
          growth: growthRate
        };

        const { error: updateError } = await supabase
          .from('municipality_characterization')
          .update({ demography: updatedDemography })
          .eq('id', characterizationData.id);

        if (updateError) {
          console.error('❌ Erro ao atualizar dados:', updateError.message);
        } else {
          console.log('✅ Dados de caracterização atualizados com sucesso!');
        }
      } else {
        console.log('\n✅ Dados já estão sincronizados!');
      }

    } else {
      console.error('❌ Não foi possível obter dados populacionais atuais');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar o teste
testDemographicSync()
  .then(() => {
    console.log('\n🎉 Teste de sincronização concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }); 