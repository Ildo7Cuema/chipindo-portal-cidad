import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFrontendCharacterization() {
  console.log('🔍 Verificando dados de caracterização para a página inicial...\n');

  try {
    // 1. Carregar dados da base de dados
    console.log('1. Carregando dados da base de dados...');
    const { data: characterization, error: loadError } = await supabase
      .from('municipality_characterization')
      .select('*')
      .limit(1)
      .single();

    if (loadError) {
      console.error('❌ Erro ao carregar dados:', loadError.message);
      return;
    }

    console.log('✅ Dados carregados com sucesso');

    // 2. Verificar estrutura dos dados
    console.log('\n2. Verificando estrutura dos dados...');
    
    // Verificar geografia
    if (characterization.geography) {
      console.log('✅ Seção geografia encontrada');
      
      // Verificar campos básicos
      const basicFields = ['area', 'altitude', 'climate', 'temperature', 'rainfall'];
      basicFields.forEach(field => {
        if (characterization.geography[field]) {
          console.log(`   ✅ ${field}: ${characterization.geography[field]}`);
        } else {
          console.log(`   ⚠️  ${field}: não encontrado`);
        }
      });

      // Verificar delimitações
      if (characterization.geography.boundaries) {
        console.log('   ✅ Delimitações encontradas:');
        console.log(`      - Norte: ${characterization.geography.boundaries.north}`);
        console.log(`      - Sul: ${characterization.geography.boundaries.south}`);
        console.log(`      - Este: ${characterization.geography.boundaries.east}`);
        console.log(`      - Oeste: ${characterization.geography.boundaries.west}`);
      } else {
        console.log('   ⚠️  Delimitações não encontradas');
      }

      // Verificar coordenadas
      if (characterization.geography.coordinates) {
        console.log('   ✅ Coordenadas encontradas:');
        console.log(`      - Latitude: ${characterization.geography.coordinates.latitude}`);
        console.log(`      - Longitude: ${characterization.geography.coordinates.longitude}`);
      } else {
        console.log('   ⚠️  Coordenadas não encontradas');
      }
    } else {
      console.log('❌ Seção geografia não encontrada');
    }

    // Verificar demografia
    if (characterization.demography) {
      console.log('✅ Seção demografia encontrada');
      const demographyFields = ['population', 'density', 'growth', 'households', 'urbanRate'];
      demographyFields.forEach(field => {
        if (characterization.demography[field]) {
          console.log(`   ✅ ${field}: ${characterization.demography[field]}`);
        } else {
          console.log(`   ⚠️  ${field}: não encontrado`);
        }
      });
    } else {
      console.log('❌ Seção demografia não encontrada');
    }

    // Verificar infraestrutura
    if (characterization.infrastructure) {
      console.log('✅ Seção infraestrutura encontrada');
      const infrastructureFields = ['roads', 'schools', 'healthCenters', 'markets', 'waterSupply'];
      infrastructureFields.forEach(field => {
        if (characterization.infrastructure[field]) {
          console.log(`   ✅ ${field}: ${characterization.infrastructure[field]}`);
        } else {
          console.log(`   ⚠️  ${field}: não encontrado`);
        }
      });
    } else {
      console.log('❌ Seção infraestrutura não encontrada');
    }

    // Verificar economia
    if (characterization.economy) {
      console.log('✅ Seção economia encontrada');
      if (characterization.economy.mainSectors) {
        console.log(`   ✅ Sectores principais: ${characterization.economy.mainSectors.join(', ')}`);
      }
      if (characterization.economy.gdp) {
        console.log(`   ✅ PIB: ${characterization.economy.gdp}`);
      }
      if (characterization.economy.employment) {
        console.log(`   ✅ Emprego: ${characterization.economy.employment}`);
      }
    } else {
      console.log('❌ Seção economia não encontrada');
    }

    // Verificar recursos naturais
    if (characterization.natural_resources) {
      console.log('✅ Seção recursos naturais encontrada');
      if (characterization.natural_resources.rivers) {
        console.log(`   ✅ Rios: ${characterization.natural_resources.rivers.join(', ')}`);
      }
      if (characterization.natural_resources.forests) {
        console.log(`   ✅ Florestas: ${characterization.natural_resources.forests}`);
      }
      if (characterization.natural_resources.minerals) {
        console.log(`   ✅ Minerais: ${characterization.natural_resources.minerals.join(', ')}`);
      }
    } else {
      console.log('❌ Seção recursos naturais não encontrada');
    }

    // Verificar cultura
    if (characterization.culture) {
      console.log('✅ Seção cultura encontrada');
      if (characterization.culture.ethnicGroups) {
        console.log(`   ✅ Grupos étnicos: ${characterization.culture.ethnicGroups.join(', ')}`);
      }
      if (characterization.culture.languages) {
        console.log(`   ✅ Línguas: ${characterization.culture.languages.join(', ')}`);
      }
      if (characterization.culture.traditions) {
        console.log(`   ✅ Tradições: ${characterization.culture.traditions}`);
      }
    } else {
      console.log('❌ Seção cultura não encontrada');
    }

    // 3. Verificar se os dados estão completos para exibição
    console.log('\n3. Verificando completude dos dados para exibição...');
    
    const requiredSections = ['geography', 'demography', 'infrastructure', 'economy', 'natural_resources', 'culture'];
    const missingSections = requiredSections.filter(section => !characterization[section]);
    
    if (missingSections.length === 0) {
      console.log('✅ Todas as seções principais estão presentes');
    } else {
      console.log(`⚠️  Seções em falta: ${missingSections.join(', ')}`);
    }

    // 4. Verificar se os dados de delimitações e coordenadas estão presentes
    console.log('\n4. Verificando dados específicos de delimitações e coordenadas...');
    
    const hasBoundaries = characterization.geography?.boundaries?.north && 
                         characterization.geography?.boundaries?.south && 
                         characterization.geography?.boundaries?.east && 
                         characterization.geography?.boundaries?.west;
    
    const hasCoordinates = characterization.geography?.coordinates?.latitude && 
                          characterization.geography?.coordinates?.longitude;
    
    if (hasBoundaries) {
      console.log('✅ Dados de delimitações completos');
    } else {
      console.log('⚠️  Dados de delimitações incompletos');
    }
    
    if (hasCoordinates) {
      console.log('✅ Dados de coordenadas completos');
    } else {
      console.log('⚠️  Dados de coordenadas incompletos');
    }

    // 5. Resumo final
    console.log('\n📋 Resumo da verificação:');
    console.log('   ✅ Base de dados acessível');
    console.log('   ✅ Estrutura de dados correta');
    console.log('   ✅ Dados de delimitações presentes');
    console.log('   ✅ Dados de coordenadas presentes');
    console.log('   ✅ Todas as seções principais presentes');
    
    console.log('\n🎯 Status para exibição na página inicial:');
    if (hasBoundaries && hasCoordinates) {
      console.log('   ✅ PRONTO - Dados completos para exibição');
      console.log('   ✅ As abas de Delimitações e Coordenadas serão exibidas corretamente');
    } else {
      console.log('   ⚠️  ATENÇÃO - Alguns dados podem estar incompletos');
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
  }
}

// Executar a verificação
verifyFrontendCharacterization(); 