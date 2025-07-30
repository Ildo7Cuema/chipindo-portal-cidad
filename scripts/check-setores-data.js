const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSetoresData() {
  console.log('🔍 Verificando dados dos setores estratégicos...\n');

  try {
    // Verificar tabela setores_estrategicos
    console.log('📋 Verificando tabela setores_estrategicos...');
    const { data: setores, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('*');

    if (setoresError) {
      console.error('❌ Erro ao buscar setores estratégicos:', setoresError);
    } else {
      console.log(`✅ Setores estratégicos encontrados: ${setores?.length || 0}`);
      if (setores && setores.length > 0) {
        setores.forEach(setor => {
          console.log(`  - ${setor.nome} (${setor.slug}) - ${setor.ativo ? 'Ativo' : 'Inativo'}`);
        });
      }
    }

    // Verificar tabela setores_estatisticas
    console.log('\n📊 Verificando tabela setores_estatisticas...');
    const { data: estatisticas, error: estatisticasError } = await supabase
      .from('setores_estatisticas')
      .select('*');

    if (estatisticasError) {
      console.error('❌ Erro ao buscar estatísticas:', estatisticasError);
    } else {
      console.log(`✅ Estatísticas encontradas: ${estatisticas?.length || 0}`);
    }

    // Verificar tabela setores_programas
    console.log('\n📚 Verificando tabela setores_programas...');
    const { data: programas, error: programasError } = await supabase
      .from('setores_programas')
      .select('*');

    if (programasError) {
      console.error('❌ Erro ao buscar programas:', programasError);
    } else {
      console.log(`✅ Programas encontrados: ${programas?.length || 0}`);
    }

    // Verificar tabela setores_oportunidades
    console.log('\n💼 Verificando tabela setores_oportunidades...');
    const { data: oportunidades, error: oportunidadesError } = await supabase
      .from('setores_oportunidades')
      .select('*');

    if (oportunidadesError) {
      console.error('❌ Erro ao buscar oportunidades:', oportunidadesError);
    } else {
      console.log(`✅ Oportunidades encontradas: ${oportunidades?.length || 0}`);
    }

    // Verificar tabela setores_infraestruturas
    console.log('\n🏗️ Verificando tabela setores_infraestruturas...');
    const { data: infraestruturas, error: infraestruturasError } = await supabase
      .from('setores_infraestruturas')
      .select('*');

    if (infraestruturasError) {
      console.error('❌ Erro ao buscar infraestruturas:', infraestruturasError);
    } else {
      console.log(`✅ Infraestruturas encontradas: ${infraestruturas?.length || 0}`);
    }

    // Verificar tabela setores_contactos
    console.log('\n📞 Verificando tabela setores_contactos...');
    const { data: contactos, error: contactosError } = await supabase
      .from('setores_contactos')
      .select('*');

    if (contactosError) {
      console.error('❌ Erro ao buscar contactos:', contactosError);
    } else {
      console.log(`✅ Contactos encontrados: ${contactos?.length || 0}`);
    }

    // Verificar tabelas específicas dos setores
    console.log('\n🎭 Verificando tabelas específicas dos setores...');
    
    // Cultura
    const { data: culturaInfo, error: culturaError } = await supabase
      .from('cultura_info')
      .select('*');
    console.log(`✅ Cultura info: ${culturaInfo?.length || 0} registos`);

    // Tecnologia
    const { data: tecnologiaInfo, error: tecnologiaError } = await supabase
      .from('tecnologia_info')
      .select('*');
    console.log(`✅ Tecnologia info: ${tecnologiaInfo?.length || 0} registos`);

    // Económico
    const { data: economicoInfo, error: economicoError } = await supabase
      .from('economico_info')
      .select('*');
    console.log(`✅ Económico info: ${economicoInfo?.length || 0} registos`);

    console.log('\n📋 Resumo:');
    console.log(`- Setores estratégicos: ${setores?.length || 0}`);
    console.log(`- Estatísticas: ${estatisticas?.length || 0}`);
    console.log(`- Programas: ${programas?.length || 0}`);
    console.log(`- Oportunidades: ${oportunidades?.length || 0}`);
    console.log(`- Infraestruturas: ${infraestruturas?.length || 0}`);
    console.log(`- Contactos: ${contactos?.length || 0}`);

    if (!setores || setores.length === 0) {
      console.log('\n⚠️  Nenhum setor estratégico encontrado!');
      console.log('💡 Execute o script de inserção de dados:');
      console.log('   node scripts/insert-setores-data.js');
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

checkSetoresData(); 