const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSetoresData() {
  console.log('🔍 Verificando dados dos Setores Estratégicos...\n');

  try {
    // Verificar setores principais
    console.log('📋 Verificando setores estratégicos...');
    const { data: setores, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .order('ordem');

    if (setoresError) {
      console.error('❌ Erro ao buscar setores:', setoresError);
      return;
    }

    if (!setores || setores.length === 0) {
      console.log('⚠️  Nenhum setor encontrado no banco de dados');
      console.log('💡 Execute: node scripts/apply-setores-migration-direct.js');
      return;
    }

    console.log(`✅ Encontrados ${setores.length} setores estratégicos:\n`);
    
    for (const setor of setores) {
      console.log(`🏢 ${setor.nome} (${setor.slug})`);
      console.log(`   Status: ${setor.ativo ? '✅ Ativo' : '❌ Inativo'}`);
      console.log(`   Ordem: ${setor.ordem}`);
      console.log(`   Ícone: ${setor.icone}`);
      console.log(`   Cores: ${setor.cor_primaria} / ${setor.cor_secundaria}`);
      console.log('');

      // Verificar estatísticas
      const { data: estatisticas, error: estatError } = await supabase
        .from('setores_estatisticas')
        .select('*')
        .eq('setor_id', setor.id)
        .order('ordem');

      if (estatError) {
        console.error(`   ❌ Erro ao buscar estatísticas:`, estatError);
      } else {
        console.log(`   📊 Estatísticas: ${estatisticas?.length || 0} encontradas`);
      }

      // Verificar programas
      const { data: programas, error: progError } = await supabase
        .from('setores_programas')
        .select('*')
        .eq('setor_id', setor.id)
        .eq('ativo', true)
        .order('ordem');

      if (progError) {
        console.error(`   ❌ Erro ao buscar programas:`, progError);
      } else {
        console.log(`   📚 Programas: ${programas?.length || 0} encontrados`);
      }

      // Verificar oportunidades
      const { data: oportunidades, error: oportError } = await supabase
        .from('setores_oportunidades')
        .select('*')
        .eq('setor_id', setor.id)
        .eq('ativo', true)
        .order('ordem');

      if (oportError) {
        console.error(`   ❌ Erro ao buscar oportunidades:`, oportError);
      } else {
        console.log(`   💼 Oportunidades: ${oportunidades?.length || 0} encontradas`);
      }

      // Verificar infraestruturas
      const { data: infraestruturas, error: infraError } = await supabase
        .from('setores_infraestruturas')
        .select('*')
        .eq('setor_id', setor.id)
        .eq('ativo', true)
        .order('ordem');

      if (infraError) {
        console.error(`   ❌ Erro ao buscar infraestruturas:`, infraError);
      } else {
        console.log(`   🏗️  Infraestruturas: ${infraestruturas?.length || 0} encontradas`);
      }

      // Verificar contactos
      const { data: contactos, error: contError } = await supabase
        .from('setores_contactos')
        .select('*')
        .eq('setor_id', setor.id);

      if (contError) {
        console.error(`   ❌ Erro ao buscar contactos:`, contError);
      } else {
        console.log(`   📞 Contactos: ${contactos?.length || 0} encontrados`);
      }

      console.log('');
    }

    // Verificar se as páginas estão configuradas
    console.log('🌐 Verificando configuração das páginas...');
    const setoresComPaginas = [
      'educacao', 'saude', 'agricultura', 'sector-mineiro', 
      'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua'
    ];

    for (const slug of setoresComPaginas) {
      const setor = setores.find(s => s.slug === slug);
      if (setor) {
        console.log(`   ✅ ${setor.nome}: Página configurada (/${slug})`);
      } else {
        console.log(`   ❌ ${slug}: Setor não encontrado no banco`);
      }
    }

    console.log('\n🎉 Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

checkSetoresData(); 