import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendManifestacoes() {
  console.log('🧪 Testando carregamento de manifestações para o frontend...\n');

  try {
    // Simular o que o hook faz
    console.log('📋 Buscando manifestações da tabela...');
    let query = supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .order('data_abertura', { ascending: false })
      .range(0, 9);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Erro ao buscar manifestações:', error);
    } else {
      console.log(`✅ Manifestações encontradas: ${data?.length || 0}`);
      
      if (data && data.length > 0) {
        console.log('📋 Exemplos de manifestações:');
        data.slice(0, 5).forEach((man, index) => {
          console.log(`  ${index + 1}. ${man.assunto} (${man.status}) - ${man.protocolo}`);
          console.log(`     Categoria: ${man.categoria} | Prioridade: ${man.prioridade}`);
          console.log(`     Solicitante: ${man.nome} | Data: ${new Date(man.data_abertura).toLocaleDateString()}`);
        });
      }
    }

    // Testar filtros
    console.log('\n🔍 Testando filtros...');
    
    // Filtro por categoria
    const { data: categoriaData, error: categoriaError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .eq('categoria', 'reclamacao')
      .order('data_abertura', { ascending: false });
    
    if (categoriaError) {
      console.error('❌ Erro no filtro por categoria:', categoriaError);
    } else {
      console.log(`✅ Manifestações de reclamação: ${categoriaData?.length || 0}`);
    }
    
    // Filtro por status
    const { data: statusData, error: statusError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .eq('status', 'pendente')
      .order('data_abertura', { ascending: false });
    
    if (statusError) {
      console.error('❌ Erro no filtro por status:', statusError);
    } else {
      console.log(`✅ Manifestações pendentes: ${statusData?.length || 0}`);
    }
    
    // Busca por texto
    const { data: searchData, error: searchError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .or('assunto.ilike.%água%,nome.ilike.%água%,protocolo.ilike.%água%')
      .order('data_abertura', { ascending: false });
    
    if (searchError) {
      console.error('❌ Erro na busca por texto:', searchError);
    } else {
      console.log(`✅ Manifestações com "água": ${searchData?.length || 0}`);
    }

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testFrontendManifestacoes(); 