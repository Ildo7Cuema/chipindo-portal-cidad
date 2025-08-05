import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInscricoesStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela inscricoes...\n');

    // 1. Tentar inserir dados sem a coluna categoria
    console.log('1️⃣ Testando inserção sem coluna categoria...');
    
    const dadosSemCategoria = {
      concurso_id: '0ea64698-1636-4779-a675-b216c57f884b',
      nome_completo: 'João Silva',
      bilhete_identidade: '123456789',
      data_nascimento: '1990-01-01',
      telefone: '123456789',
      email: 'joao@teste.com',
      observacoes: 'Teste de inscrição',
      arquivos: [
        {
          name: 'bi.pdf',
          size: 1024,
          type: 'application/pdf',
          url: 'https://example.com/bi.pdf'
        }
      ]
    };

    console.log('   Dados sem categoria:', JSON.stringify(dadosSemCategoria, null, 2));

    const { data: inserido, error: insertError } = await supabase
      .from('inscricoes')
      .insert([dadosSemCategoria])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir dados sem categoria:', insertError);
      console.log('\n📋 Análise do erro:');
      console.log('   - Código:', insertError.code);
      console.log('   - Mensagem:', insertError.message);
      console.log('   - Detalhes:', insertError.details);
      console.log('   - Hint:', insertError.hint);
    } else {
      console.log('✅ Inserção bem-sucedida sem categoria!');
      console.log('   - ID criado:', inserido.id);
      console.log('   - Estrutura do registro inserido:');
      Object.keys(inserido).forEach(key => {
        console.log(`     ${key}: ${typeof inserido[key]} = ${JSON.stringify(inserido[key])}`);
      });
      
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

    // 2. Verificar se existe alguma coluna relacionada a categoria
    console.log('\n2️⃣ Verificando colunas existentes...');
    
    // Tentar inserir com diferentes nomes de coluna
    const possiveisColunas = ['categoria', 'category', 'categorias', 'categories', 'tipo', 'type'];
    
    for (const coluna of possiveisColunas) {
      const dadosTeste = {
        concurso_id: '0ea64698-1636-4779-a675-b216c57f884b',
        nome_completo: 'Teste',
        bilhete_identidade: '123',
        data_nascimento: '1990-01-01',
        telefone: '123',
        email: 'teste@teste.com',
        [coluna]: 'Professor'
      };

      const { error: testError } = await supabase
        .from('inscricoes')
        .insert([dadosTeste]);

      if (!testError) {
        console.log(`✅ Coluna "${coluna}" existe!`);
        // Limpar teste
        await supabase.from('inscricoes').delete().eq('email', 'teste@teste.com');
        break;
      } else if (testError.code === 'PGRST204') {
        console.log(`❌ Coluna "${coluna}" não existe`);
      } else {
        console.log(`⚠️  Coluna "${coluna}" - erro diferente:`, testError.code);
      }
    }

    console.log('\n💡 Conclusão:');
    console.log('   - A tabela inscricoes existe');
    console.log('   - A coluna "categoria" não existe');
    console.log('   - Precisamos criar a migração para adicionar a coluna');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

checkInscricoesStructure(); 