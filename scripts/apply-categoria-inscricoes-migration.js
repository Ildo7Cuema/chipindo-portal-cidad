import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyCategoriaInscricoesMigration() {
  try {
    console.log('🔧 Aplicando migração: Adicionar coluna categoria à tabela inscricoes...\n');

    // 1. Verificar se a coluna já existe
    console.log('1️⃣ Verificando se a coluna categoria já existe...');
    
    const { data: testData, error: testError } = await supabase
      .from('inscricoes')
      .select('categoria')
      .limit(1);

    if (!testError) {
      console.log('✅ Coluna categoria já existe!');
      console.log('   - Estrutura da coluna:', typeof testData[0]?.categoria);
      return;
    }

    if (testError.code === '42703') {
      console.log('❌ Coluna categoria não existe. Aplicando migração...');
    } else {
      console.error('❌ Erro inesperado:', testError);
      return;
    }

    // 2. Aplicar a migração usando SQL direto
    console.log('\n2️⃣ Aplicando migração...');
    
    // Como não temos acesso direto ao exec_sql, vamos usar uma abordagem diferente
    // Vamos tentar inserir dados sem a coluna categoria primeiro para ver se funciona
    
    const testInsert = {
      concurso_id: '0ea64698-1636-4779-a675-b216c57f884b',
      nome_completo: 'Teste Sem Categoria',
      bilhete_identidade: '123456789',
      data_nascimento: '1990-01-01',
      telefone: '123456789',
      email: 'teste.sem.categoria@teste.com',
      observacoes: 'Teste sem categoria',
      arquivos: [
        {
          name: 'teste.pdf',
          size: 1024,
          type: 'application/pdf',
          url: 'https://example.com/teste.pdf'
        }
      ]
    };

    const { data: inserted, error: insertError } = await supabase
      .from('inscricoes')
      .insert([testInsert])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir dados sem categoria:', insertError);
      return;
    }

    console.log('✅ Inserção sem categoria funcionou!');
    console.log('   - ID:', inserted.id);

    // Limpar dados de teste
    await supabase.from('inscricoes').delete().eq('id', inserted.id);

    console.log('\n💡 Como resolver o problema:');
    console.log('   A coluna "categoria" não existe na tabela inscricoes.');
    console.log('   Para resolver o erro 400, você precisa:');
    console.log('');
    console.log('   1. Acessar o painel do Supabase:');
    console.log('      https://supabase.com/dashboard/project/murdhrdqqnuntfxmwtqx');
    console.log('');
    console.log('   2. Ir para SQL Editor');
    console.log('');
    console.log('   3. Executar o seguinte SQL:');
    console.log('');
    console.log('   ALTER TABLE public.inscricoes ADD COLUMN categoria TEXT;');
    console.log('   COMMENT ON COLUMN public.inscricoes.categoria IS \'Categoria selecionada pelo candidato no concurso\';');
    console.log('   CREATE INDEX IF NOT EXISTS idx_inscricoes_categoria ON public.inscricoes(categoria);');
    console.log('');
    console.log('   4. Clicar em "Run" para executar');
    console.log('');
    console.log('   5. Após executar, o erro 400 no modal de inscrição será resolvido!');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

applyCategoriaInscricoesMigration(); 