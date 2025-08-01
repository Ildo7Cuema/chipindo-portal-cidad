// Teste da Implementação do Setor de Turismo e Meio Ambiente
// Portal do Cidadão de Chipindo

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Substitua pela sua chave

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTurismoMeioAmbiente() {
  console.log('🧪 Testando Implementação do Setor de Turismo e Meio Ambiente\n');

  try {
    // 1. Testar se o setor existe
    console.log('1. Verificando se o setor existe...');
    const { data: setor, error: setorError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .eq('slug', 'turismo-meio-ambiente')
      .single();

    if (setorError) {
      console.error('❌ Erro ao buscar setor:', setorError.message);
      return;
    }

    if (!setor) {
      console.error('❌ Setor não encontrado');
      return;
    }

    console.log('✅ Setor encontrado:', setor.nome);
    console.log('   - Slug:', setor.slug);
    console.log('   - Ativo:', setor.ativo);
    console.log('   - Cor primária:', setor.cor_primaria);

    // 2. Testar estatísticas
    console.log('\n2. Verificando estatísticas...');
    const { data: estatisticas, error: estatisticasError } = await supabase
      .from('setores_estatisticas')
      .select('*')
      .eq('setor_id', setor.id)
      .order('ordem');

    if (estatisticasError) {
      console.error('❌ Erro ao buscar estatísticas:', estatisticasError.message);
    } else {
      console.log(`✅ ${estatisticas.length} estatísticas encontradas:`);
      estatisticas.forEach(stat => {
        console.log(`   - ${stat.nome}: ${stat.valor}`);
      });
    }

    // 3. Testar programas
    console.log('\n3. Verificando programas...');
    const { data: programas, error: programasError } = await supabase
      .from('setores_programas')
      .select('*')
      .eq('setor_id', setor.id)
      .eq('ativo', true)
      .order('ordem');

    if (programasError) {
      console.error('❌ Erro ao buscar programas:', programasError.message);
    } else {
      console.log(`✅ ${programas.length} programas encontrados:`);
      programas.forEach(programa => {
        console.log(`   - ${programa.titulo}`);
      });
    }

    // 4. Testar oportunidades
    console.log('\n4. Verificando oportunidades...');
    const { data: oportunidades, error: oportunidadesError } = await supabase
      .from('setores_oportunidades')
      .select('*')
      .eq('setor_id', setor.id)
      .eq('ativo', true)
      .order('ordem');

    if (oportunidadesError) {
      console.error('❌ Erro ao buscar oportunidades:', oportunidadesError.message);
    } else {
      console.log(`✅ ${oportunidades.length} oportunidades encontradas:`);
      oportunidades.forEach(oportunidade => {
        console.log(`   - ${oportunidade.titulo} (${oportunidade.vagas} vagas)`);
      });
    }

    // 5. Testar infraestruturas
    console.log('\n5. Verificando infraestruturas...');
    const { data: infraestruturas, error: infraestruturasError } = await supabase
      .from('setores_infraestruturas')
      .select('*')
      .eq('setor_id', setor.id)
      .eq('ativo', true)
      .order('ordem');

    if (infraestruturasError) {
      console.error('❌ Erro ao buscar infraestruturas:', infraestruturasError.message);
    } else {
      console.log(`✅ ${infraestruturas.length} infraestruturas encontradas:`);
      infraestruturas.forEach(infra => {
        console.log(`   - ${infra.nome} (${infra.capacidade})`);
      });
    }

    // 6. Testar contactos
    console.log('\n6. Verificando contactos...');
    const { data: contactos, error: contactosError } = await supabase
      .from('setores_contactos')
      .select('*')
      .eq('setor_id', setor.id);

    if (contactosError) {
      console.error('❌ Erro ao buscar contactos:', contactosError.message);
    } else {
      console.log(`✅ ${contactos.length} contactos encontrados:`);
      contactos.forEach(contacto => {
        console.log(`   - Responsável: ${contacto.responsavel}`);
        console.log(`   - Email: ${contacto.email}`);
        console.log(`   - Telefone: ${contacto.telefone}`);
      });
    }

    // 7. Testar carrossel (se a tabela existir)
    console.log('\n7. Verificando carrossel...');
    try {
      const { data: carouselImages, error: carouselError } = await supabase
        .from('turismo_ambiente_carousel')
        .select('*')
        .eq('active', true)
        .order('order_index');

      if (carouselError) {
        console.log('⚠️  Tabela de carrossel não encontrada (migração não aplicada)');
        console.log('   Execute as migrações para criar a tabela');
      } else {
        console.log(`✅ ${carouselImages.length} imagens do carrossel encontradas:`);
        carouselImages.forEach(image => {
          console.log(`   - ${image.title} (${image.category})`);
        });
      }
    } catch (error) {
      console.log('⚠️  Tabela de carrossel não existe ainda');
    }

    // 8. Testar storage bucket
    console.log('\n8. Verificando storage bucket...');
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('❌ Erro ao listar buckets:', bucketsError.message);
      } else {
        const turismoBucket = buckets.find(bucket => bucket.name === 'turismo-ambiente');
        if (turismoBucket) {
          console.log('✅ Bucket turismo-ambiente encontrado');
        } else {
          console.log('⚠️  Bucket turismo-ambiente não encontrado');
        }
      }
    } catch (error) {
      console.log('⚠️  Erro ao verificar storage buckets');
    }

    console.log('\n🎉 Teste concluído!');
    console.log('\n📋 Resumo:');
    console.log(`   - Setor: ${setor ? '✅' : '❌'}`);
    console.log(`   - Estatísticas: ${estatisticas?.length || 0}`);
    console.log(`   - Programas: ${programas?.length || 0}`);
    console.log(`   - Oportunidades: ${oportunidades?.length || 0}`);
    console.log(`   - Infraestruturas: ${infraestruturas?.length || 0}`);
    console.log(`   - Contactos: ${contactos?.length || 0}`);

    console.log('\n📝 Próximos passos:');
    console.log('   1. Aplicar migrações se não aplicadas');
    console.log('   2. Testar a página /turismo-meio-ambiente');
    console.log('   3. Verificar área administrativa');
    console.log('   4. Adicionar imagens reais ao carrossel');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testTurismoMeioAmbiente(); 