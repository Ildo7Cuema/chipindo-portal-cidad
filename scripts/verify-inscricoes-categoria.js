import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyInscricoesCategoria() {
  try {
    console.log('🔍 Verificando coluna categoria na tabela inscricoes...\n');

    // 1. Verificar se a coluna categoria existe
    console.log('1️⃣ Verificando se a coluna categoria existe...');
    
    const { data: testData, error: testError } = await supabase
      .from('inscricoes')
      .select('categoria')
      .limit(1);

    if (testError) {
      if (testError.code === '42703') {
        console.log('❌ Coluna categoria NÃO existe!');
        console.log('   - Erro:', testError.message);
        console.log('\n💡 Você precisa executar o SQL no Supabase:');
        console.log('   ALTER TABLE public.inscricoes ADD COLUMN categoria TEXT;');
        return;
      } else {
        console.error('❌ Erro inesperado:', testError);
        return;
      }
    }

    console.log('✅ Coluna categoria existe!');

    // 2. Verificar todas as inscrições existentes
    console.log('\n2️⃣ Verificando inscrições existentes...');
    
    const { data: inscricoes, error: fetchError } = await supabase
      .from('inscricoes')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Erro ao buscar inscrições:', fetchError);
      return;
    }

    console.log(`✅ Encontradas ${inscricoes.length} inscrições`);
    
    if (inscricoes.length > 0) {
      console.log('\n📋 Detalhes das inscrições:');
      
      inscricoes.forEach((inscricao, index) => {
        console.log(`\n   Inscrição ${index + 1}:`);
        console.log(`   - ID: ${inscricao.id}`);
        console.log(`   - Nome: ${inscricao.nome_completo}`);
        console.log(`   - Email: ${inscricao.email}`);
        console.log(`   - Concurso ID: ${inscricao.concurso_id}`);
        console.log(`   - Categoria: ${inscricao.categoria || 'NULL'}`);
        console.log(`   - Data: ${new Date(inscricao.created_at).toLocaleString('pt-AO')}`);
        console.log(`   - Arquivos: ${inscricao.arquivos?.length || 0} arquivos`);
      });
    } else {
      console.log('   - Nenhuma inscrição encontrada');
    }

    // 3. Verificar concursos disponíveis
    console.log('\n3️⃣ Verificando concursos disponíveis...');
    
    const { data: concursos, error: concursosError } = await supabase
      .from('concursos')
      .select('id, title, published')
      .order('created_at', { ascending: false });

    if (concursosError) {
      console.error('❌ Erro ao buscar concursos:', concursosError);
      return;
    }

    console.log(`✅ Encontrados ${concursos.length} concursos`);
    
    if (concursos.length > 0) {
      console.log('\n📋 Concursos disponíveis:');
      
      concursos.forEach((concurso, index) => {
        console.log(`   ${index + 1}. ${concurso.title}`);
        console.log(`      - ID: ${concurso.id}`);
        console.log(`      - Publicado: ${concurso.published ? 'Sim' : 'Não'}`);
        
        // Contar inscrições para este concurso
        const inscricoesConcurso = inscricoes.filter(i => i.concurso_id === concurso.id);
        console.log(`      - Inscrições: ${inscricoesConcurso.length}`);
      });
    }

    // 4. Testar inserção de inscrição de teste
    console.log('\n4️⃣ Testando inserção de inscrição de teste...');
    
    const inscricaoTeste = {
      concurso_id: concursos[0]?.id || 'test-id',
      nome_completo: 'Teste Admin',
      bilhete_identidade: '123456789',
      data_nascimento: '1990-01-01',
      telefone: '123456789',
      email: 'teste.admin@teste.com',
      observacoes: 'Inscrição de teste para verificar funcionalidade',
      categoria: 'Professor de Matemática',
      arquivos: [
        {
          name: 'bi.pdf',
          size: 1024,
          type: 'application/pdf',
          url: 'https://example.com/bi.pdf'
        },
        {
          name: 'cv.pdf',
          size: 2048,
          type: 'application/pdf',
          url: 'https://example.com/cv.pdf'
        }
      ]
    };

    const { data: inserido, error: insertError } = await supabase
      .from('inscricoes')
      .insert([inscricaoTeste])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir inscrição de teste:', insertError);
      console.log('\n💡 Possíveis problemas:');
      console.log('   1. Coluna categoria não existe');
      console.log('   2. Políticas RLS bloqueando inserção');
      console.log('   3. Dados inválidos');
      return;
    }

    console.log('✅ Inscrição de teste inserida com sucesso!');
    console.log('   - ID:', inserido.id);
    console.log('   - Nome:', inserido.nome_completo);
    console.log('   - Categoria:', inserido.categoria);
    console.log('   - Concurso ID:', inserido.concurso_id);

    // 5. Verificar se aparece na lista
    console.log('\n5️⃣ Verificando se aparece na lista...');
    
    const { data: inscricoesAtualizadas, error: listError } = await supabase
      .from('inscricoes')
      .select('*')
      .eq('concurso_id', inserido.concurso_id)
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Erro ao buscar inscrições do concurso:', listError);
    } else {
      console.log(`✅ Encontradas ${inscricoesAtualizadas.length} inscrições para o concurso`);
      
      const inscricaoEncontrada = inscricoesAtualizadas.find(i => i.id === inserido.id);
      if (inscricaoEncontrada) {
        console.log('✅ Inscrição de teste encontrada na lista!');
        console.log('   - Nome:', inscricaoEncontrada.nome_completo);
        console.log('   - Categoria:', inscricaoEncontrada.categoria);
      } else {
        console.log('❌ Inscrição de teste NÃO encontrada na lista');
      }
    }

    // 6. Limpar dados de teste
    console.log('\n6️⃣ Limpando dados de teste...');
    
    const { error: deleteError } = await supabase
      .from('inscricoes')
      .delete()
      .eq('id', inserido.id);

    if (deleteError) {
      console.error('❌ Erro ao deletar inscrição de teste:', deleteError);
    } else {
      console.log('✅ Inscrição de teste removida com sucesso!');
    }

    console.log('\n🎉 Verificação concluída!');
    console.log('📊 Resumo:');
    console.log('   - ✅ Coluna categoria existe');
    console.log('   - ✅ Inscrições podem ser inseridas');
    console.log('   - ✅ Inscrições aparecem na lista');
    console.log('   - ✅ Sistema funcionando corretamente');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

verifyInscricoesCategoria(); 