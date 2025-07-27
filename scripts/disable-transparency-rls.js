import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function disableTransparencyRLS() {
  console.log('🔧 Desabilitando RLS para tabelas de transparência...\n');

  try {
    // Testar inserção de documento
    console.log('🧪 Testando inserção de documento...');
    const testDoc = {
      title: 'Documento de Teste - Sem RLS',
      category: 'relatorios',
      date: '2024-01-01',
      status: 'published',
      file_size: '1.0 MB',
      description: 'Documento de teste sem RLS',
      tags: ['teste', 'sem-rls'],
      file_url: 'https://exemplo.com/teste.pdf'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('transparency_documents')
      .insert([testDoc])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir documento:', insertError);
      console.log('\n💡 Solução: As políticas RLS precisam ser ajustadas manualmente no painel do Supabase');
      console.log('   Acesse: https://supabase.com/dashboard/project/murdhrdqqnuntfxmwtqx');
      console.log('   Vá para: Database > Policies');
      console.log('   Para cada tabela (transparency_documents, budget_execution, transparency_projects):');
      console.log('   1. Delete as políticas existentes que restringem inserção');
      console.log('   2. Crie novas políticas que permitam INSERT/UPDATE/DELETE para todos');
      console.log('   3. Ou desabilite temporariamente o RLS para desenvolvimento');
    } else {
      console.log('✅ Inserção funcionando');
      console.log('   ID do documento inserido:', insertData?.[0]?.id);

      // Limpar documento de teste
      if (insertData?.[0]?.id) {
        await supabase
          .from('transparency_documents')
          .delete()
          .eq('id', insertData[0].id);
        console.log('   Documento de teste removido');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

disableTransparencyRLS(); 