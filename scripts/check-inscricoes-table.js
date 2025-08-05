import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInscricoesTable() {
  try {
    console.log('🔍 Verificando tabela inscricoes...\n');

    // 1. Tentar buscar dados da tabela inscricoes
    console.log('1️⃣ Tentando buscar dados da tabela inscricoes...');
    const { data: inscricoes, error: fetchError } = await supabase
      .from('inscricoes')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.error('❌ Erro ao buscar inscrições:', fetchError);
      console.log('\n📋 Análise do erro:');
      console.log('   - Código:', fetchError.code);
      console.log('   - Mensagem:', fetchError.message);
      console.log('   - Detalhes:', fetchError.details);
      
      if (fetchError.code === '42P01') {
        console.log('\n💡 A tabela "inscricoes" não existe!');
        console.log('   Precisamos criar a tabela primeiro.');
      }
      return;
    }

    console.log('✅ Tabela inscricoes existe!');
    console.log(`   - Encontrados ${inscricoes.length} registros`);
    
    if (inscricoes.length > 0) {
      console.log('   - Estrutura do primeiro registro:');
      const primeiro = inscricoes[0];
      Object.keys(primeiro).forEach(key => {
        console.log(`     ${key}: ${typeof primeiro[key]} = ${JSON.stringify(primeiro[key])}`);
      });
    }

    // 2. Verificar estrutura da tabela concursos
    console.log('\n2️⃣ Verificando tabela concursos...');
    const { data: concursos, error: concursosError } = await supabase
      .from('concursos')
      .select('*')
      .limit(1);

    if (concursosError) {
      console.error('❌ Erro ao buscar concursos:', concursosError);
      return;
    }

    console.log('✅ Tabela concursos existe!');
    if (concursos.length > 0) {
      console.log('   - Estrutura do primeiro concurso:');
      const primeiro = concursos[0];
      Object.keys(primeiro).forEach(key => {
        console.log(`     ${key}: ${typeof primeiro[key]} = ${JSON.stringify(primeiro[key])}`);
      });
    }

    // 3. Testar inserção de dados de exemplo
    console.log('\n3️⃣ Testando inserção de dados de exemplo...');
    
    const dadosExemplo = {
      concurso_id: concursos[0]?.id || 'test-id',
      nome_completo: 'João Silva',
      bilhete_identidade: '123456789',
      data_nascimento: '1990-01-01',
      telefone: '123456789',
      email: 'joao@teste.com',
      observacoes: 'Teste de inscrição',
      categoria: 'Professor',
      arquivos: [
        {
          name: 'bi.pdf',
          size: 1024,
          type: 'application/pdf',
          url: 'https://example.com/bi.pdf'
        }
      ]
    };

    console.log('   Dados de exemplo:', JSON.stringify(dadosExemplo, null, 2));

    const { data: inserido, error: insertError } = await supabase
      .from('inscricoes')
      .insert([dadosExemplo])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir dados de exemplo:', insertError);
      console.log('\n📋 Análise do erro de inserção:');
      console.log('   - Código:', insertError.code);
      console.log('   - Mensagem:', insertError.message);
      console.log('   - Detalhes:', insertError.details);
      console.log('   - Hint:', insertError.hint);
    } else {
      console.log('✅ Inserção bem-sucedida!');
      console.log('   - ID criado:', inserido.id);
      console.log('   - Dados inseridos:', JSON.stringify(inserido, null, 2));
      
      // Limpar dados de teste
      const { error: deleteError } = await supabase
        .from('inscricoes')
        .delete()
        .eq('id', inserido.id);
      
      if (deleteError) {
        console.error('❌ Erro ao deletar dados de teste:', deleteError);
      } else {
        console.log('✅ Dados de teste removidos com sucesso!');
      }
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

checkInscricoesTable(); 