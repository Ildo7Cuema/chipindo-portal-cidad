import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugManifestacoes() {
  console.log('🔍 Debugando manifestações...\n');

  try {
    // Verificar dados diretamente na tabela
    console.log('📋 Verificando dados na tabela...');
    const { data: tableData, error: tableError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .order('data_abertura', { ascending: false })
      .limit(5);
    
    if (tableError) {
      console.error('❌ Erro ao buscar na tabela:', tableError);
    } else {
      console.log(`✅ Dados na tabela: ${tableData?.length || 0} registros`);
      if (tableData && tableData.length > 0) {
        console.log('📋 Exemplos da tabela:');
        tableData.forEach((man, index) => {
          console.log(`  ${index + 1}. ${man.assunto} (${man.status}) - ${man.protocolo}`);
        });
      }
    }

    // Testar função RPC com parâmetros simples
    console.log('\n📝 Testando função RPC...');
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_manifestacoes', {
      p_search: null,
      p_categoria: null,
      p_status: null,
      p_sort_by: 'data_abertura',
      p_sort_order: 'desc',
      p_limit: 5,
      p_offset: 0
    });
    
    if (rpcError) {
      console.error('❌ Erro na função RPC:', rpcError);
    } else {
      console.log(`✅ Dados da função RPC: ${rpcData?.length || 0} registros`);
      console.log('Tipo de dados:', typeof rpcData);
      console.log('É array?', Array.isArray(rpcData));
      if (rpcData && rpcData.length > 0) {
        console.log('📋 Exemplos da função RPC:');
        rpcData.slice(0, 3).forEach((man, index) => {
          console.log(`  ${index + 1}. ${man.assunto} (${man.status}) - ${man.protocolo}`);
        });
      }
    }

    // Testar query SQL direta
    console.log('\n🔍 Testando query SQL direta...');
    const { data: sqlData, error: sqlError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('id, protocolo, nome, email, telefone, categoria, assunto, descricao, status, prioridade, data_abertura, data_resposta, resposta, avaliacao, comentario_avaliacao, anexos, departamento_responsavel, tempo_resposta')
      .order('data_abertura', { ascending: false })
      .limit(5);
    
    if (sqlError) {
      console.error('❌ Erro na query SQL:', sqlError);
    } else {
      console.log(`✅ Dados da query SQL: ${sqlData?.length || 0} registros`);
      if (sqlData && sqlData.length > 0) {
        console.log('📋 Exemplos da query SQL:');
        sqlData.slice(0, 3).forEach((man, index) => {
          console.log(`  ${index + 1}. ${man.assunto} (${man.status}) - ${man.protocolo}`);
        });
      }
    }

    console.log('\n🎉 Debug concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugManifestacoes(); 