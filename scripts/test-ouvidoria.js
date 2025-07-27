import { createClient } from '@supabase/supabase-js';

// Usar as credenciais corretas do projeto
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOuvidoriaFunctions() {
  console.log('🧪 Testando funcionalidades da Ouvidoria...\n');

  try {
    // Teste 1: Buscar estatísticas
    console.log('📊 Testando busca de estatísticas...');
    const { data: stats, error: statsError } = await supabase.rpc('get_ouvidoria_stats');
    
    if (statsError) {
      console.error('❌ Erro ao buscar estatísticas:', statsError);
    } else {
      console.log('✅ Estatísticas carregadas:', stats);
    }

    // Teste 2: Buscar categorias
    console.log('\n📂 Testando busca de categorias...');
    const { data: categorias, error: categoriasError } = await supabase.rpc('get_ouvidoria_categorias');
    
    if (categoriasError) {
      console.error('❌ Erro ao buscar categorias:', categoriasError);
    } else {
      console.log('✅ Categorias carregadas:', categorias);
    }

    // Teste 3: Buscar manifestações
    console.log('\n📝 Testando busca de manifestações...');
    const { data: manifestacoes, error: manifestacoesError } = await supabase.rpc('get_manifestacoes', {
      p_search: null,
      p_categoria: null,
      p_status: null,
      p_sort_by: 'data_abertura',
      p_sort_order: 'desc',
      p_limit: 10,
      p_offset: 0
    });
    
    if (manifestacoesError) {
      console.error('❌ Erro ao buscar manifestações:', manifestacoesError);
    } else {
      console.log('✅ Manifestações carregadas:', manifestacoes?.length || 0, 'itens');
      console.log('Tipo de dados:', typeof manifestacoes);
      console.log('É array?', Array.isArray(manifestacoes));
      if (manifestacoes && manifestacoes.length > 0) {
        console.log('Primeira manifestação:', manifestacoes[0]);
      }
    }

    // Teste 4: Criar nova manifestação
    console.log('\n➕ Testando criação de manifestação...');
    const { data: novaManifestacao, error: createError } = await supabase.rpc('create_manifestacao', {
      p_nome: 'Teste Automático',
      p_email: 'teste@exemplo.com',
      p_telefone: '+244 999 999 999',
      p_categoria: 'sugestao',
      p_assunto: 'Teste de Funcionalidade',
      p_descricao: 'Esta é uma manifestação de teste para verificar se a funcionalidade está funcionando corretamente.'
    });
    
    if (createError) {
      console.error('❌ Erro ao criar manifestação:', createError);
    } else {
      console.log('✅ Manifestação criada:', novaManifestacao);
      
      // Teste 5: Atualizar status da manifestação criada
      if (novaManifestacao?.id) {
        console.log('\n🔄 Testando atualização de status...');
        const { data: updateResult, error: updateError } = await supabase.rpc('update_manifestacao_status', {
          p_id: novaManifestacao.id,
          p_status: 'em_analise',
          p_resposta: 'Manifestação recebida e está sendo analisada pela equipe responsável.'
        });
        
        if (updateError) {
          console.error('❌ Erro ao atualizar status:', updateError);
        } else {
          console.log('✅ Status atualizado:', updateResult);
        }
      }
    }

    // Teste 6: Avaliar manifestação
    console.log('\n⭐ Testando avaliação de manifestação...');
    if (novaManifestacao?.id) {
      const { data: rateResult, error: rateError } = await supabase.rpc('rate_manifestacao', {
        p_id: novaManifestacao.id,
        p_avaliacao: 5,
        p_comentario: 'Excelente atendimento!'
      });
      
      if (rateError) {
        console.error('❌ Erro ao avaliar manifestação:', rateError);
      } else {
        console.log('✅ Avaliação registrada:', rateResult);
      }
    }

    // Teste 7: Verificar dados nas tabelas
    console.log('\n📋 Verificando dados nas tabelas...');
    
    const { data: manifestacoesTable, error: tableError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .limit(5);
    
    if (tableError) {
      console.error('❌ Erro ao consultar tabela:', tableError);
    } else {
      console.log('✅ Dados na tabela manifestações:', manifestacoesTable?.length || 0, 'registros');
    }

    const { data: statsTable, error: statsTableError } = await supabase
      .from('ouvidoria_stats')
      .select('*');
    
    if (statsTableError) {
      console.error('❌ Erro ao consultar tabela de estatísticas:', statsTableError);
    } else {
      console.log('✅ Dados na tabela de estatísticas:', statsTable?.length || 0, 'registros');
    }

    const { data: categoriasTable, error: categoriasTableError } = await supabase
      .from('ouvidoria_categorias')
      .select('*');
    
    if (categoriasTableError) {
      console.error('❌ Erro ao consultar tabela de categorias:', categoriasTableError);
    } else {
      console.log('✅ Dados na tabela de categorias:', categoriasTable?.length || 0, 'registros');
    }

    console.log('\n🎉 Todos os testes concluídos!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar testes
testOuvidoriaFunctions(); 