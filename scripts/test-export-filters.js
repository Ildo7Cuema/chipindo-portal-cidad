// Script para testar filtros de exportação
// Este script ajuda a identificar problemas com os filtros

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.SUPABASE_URL || 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testExportFilters() {
  console.log('🔍 Testando filtros de exportação...\n');

  try {
    // 1. Buscar todos os registros
    const { data: allRegistrations, error: allError } = await supabase
      .from('interest_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Erro ao buscar registros:', allError);
      return;
    }

    console.log(`📊 Total de registros: ${allRegistrations.length}\n`);

    // 2. Testar filtro por área "Saúde"
    console.log('🏥 Testando filtro por "Saúde":');
    
    // Método 1: contains (como estava no código original)
    const { data: containsData, error: containsError } = await supabase
      .from('interest_registrations')
      .select('*')
      .contains('areas_of_interest', ['Saúde']);

    if (containsError) {
      console.error('   ❌ Erro com contains:', containsError);
    } else {
      console.log(`   ✅ Contains encontrou: ${containsData.length} registros`);
    }

    // Método 2: @> (operador de contenção)
    const { data: overlapData, error: overlapError } = await supabase
      .from('interest_registrations')
      .select('*')
      .overlaps('areas_of_interest', ['Saúde']);

    if (overlapError) {
      console.error('   ❌ Erro com overlaps:', overlapError);
    } else {
      console.log(`   ✅ Overlaps encontrou: ${overlapData.length} registros`);
    }

    // Método 3: Filtro no frontend (como corrigimos)
    const frontendFiltered = allRegistrations.filter(registration => {
      return registration.areas_of_interest && 
             registration.areas_of_interest.some(area => 
               area.toLowerCase().includes('saúde'.toLowerCase())
             );
    });

    console.log(`   ✅ Frontend filter encontrou: ${frontendFiltered.length} registros`);

    // 3. Mostrar exemplos de registros com "Saúde"
    if (frontendFiltered.length > 0) {
      console.log('\n📝 Exemplos de registros com "Saúde":');
      frontendFiltered.slice(0, 3).forEach(reg => {
        console.log(`   - ${reg.full_name}: [${reg.areas_of_interest.join(', ')}]`);
      });
    }

    // 4. Analisar todas as áreas existentes
    console.log('\n🏷️  Todas as áreas encontradas:');
    const allAreas = new Set();
    allRegistrations.forEach(reg => {
      if (reg.areas_of_interest && Array.isArray(reg.areas_of_interest)) {
        reg.areas_of_interest.forEach(area => allAreas.add(area));
      }
    });

    Array.from(allAreas).sort().forEach(area => {
      const count = allRegistrations.filter(reg => 
        reg.areas_of_interest && reg.areas_of_interest.includes(area)
      ).length;
      console.log(`   - ${area}: ${count} registros`);
    });

    // 5. Verificar registros problemáticos
    console.log('\n⚠️  Registros problemáticos:');
    const problematic = allRegistrations.filter(reg => 
      !reg.areas_of_interest || 
      !Array.isArray(reg.areas_of_interest) || 
      reg.areas_of_interest.length === 0
    );

    if (problematic.length > 0) {
      console.log(`   ${problematic.length} registros sem áreas válidas`);
      problematic.slice(0, 3).forEach(reg => {
        console.log(`   - ${reg.full_name}: areas_of_interest = ${JSON.stringify(reg.areas_of_interest)}`);
      });
    } else {
      console.log('   ✅ Todos os registros têm áreas válidas');
    }

    // 6. Sugestões
    console.log('\n💡 Sugestões:');
    console.log('   1. Use filtro no frontend para maior compatibilidade');
    console.log('   2. Verifique se os dados estão padronizados');
    console.log('   3. Considere usar busca case-insensitive');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar teste
async function main() {
  console.log('🚀 Iniciando teste de filtros de exportação\n');
  await testExportFilters();
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testExportFilters }; 