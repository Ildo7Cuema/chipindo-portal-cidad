import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testServiceRequests() {
  console.log('🧪 Testando inserção de service_requests...\n');

  try {
    // Teste 1: Verificar se a tabela existe
    console.log('1. Verificando se a tabela service_requests existe...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('service_requests')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError.message);
      return;
    }
    console.log('✅ Tabela service_requests existe');

    // Teste 2: Tentar inserir uma solicitação de teste
    console.log('\n2. Tentando inserir uma solicitação de teste...');
    const testRequest = {
      service_name: "Teste de Serviço",
      service_direction: "Serviços Municipais",
      requester_name: "Usuário Teste",
      requester_email: "teste@exemplo.com",
      requester_phone: "123456789",
      subject: "Teste de Funcionamento",
      message: "Esta é uma solicitação de teste para verificar se o sistema está funcionando corretamente.",
      priority: 'normal'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('service_requests')
      .insert([testRequest])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir solicitação:', insertError.message);
      console.error('Código do erro:', insertError.code);
      console.error('Detalhes:', insertError.details);
      console.error('Dica:', insertError.hint);
      return;
    }

    console.log('✅ Solicitação inserida com sucesso!');
    console.log('📋 Dados inseridos:', insertData);

    // Teste 3: Verificar se a solicitação foi realmente salva
    console.log('\n3. Verificando se a solicitação foi salva...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', insertData.id)
      .single();

    if (verifyError) {
      console.error('❌ Erro ao verificar dados:', verifyError.message);
      return;
    }

    console.log('✅ Dados verificados com sucesso!');
    console.log('📋 Dados recuperados:', verifyData);

    // Teste 4: Limpar dados de teste
    console.log('\n4. Limpando dados de teste...');
    const { error: deleteError } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      console.error('⚠️  Erro ao limpar dados de teste:', deleteError.message);
    } else {
      console.log('✅ Dados de teste removidos');
    }

    console.log('\n🎉 Todos os testes passaram! O sistema está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testServiceRequests(); 