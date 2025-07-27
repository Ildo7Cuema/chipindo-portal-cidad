import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testTransparencyTables() {
  console.log('🔍 Testando tabelas de transparência...\n');

  try {
    // Testar tabela transparency_documents
    console.log('📄 Testando tabela transparency_documents...');
    const { data: docs, error: docsError } = await supabase
      .from('transparency_documents')
      .select('*')
      .limit(1);

    if (docsError) {
      console.error('❌ Erro ao acessar transparency_documents:', docsError);
    } else {
      console.log('✅ Tabela transparency_documents acessível');
      console.log(`   Documentos encontrados: ${docs?.length || 0}`);
    }

    // Testar tabela budget_execution
    console.log('\n💰 Testando tabela budget_execution...');
    const { data: budget, error: budgetError } = await supabase
      .from('budget_execution')
      .select('*')
      .limit(1);

    if (budgetError) {
      console.error('❌ Erro ao acessar budget_execution:', budgetError);
    } else {
      console.log('✅ Tabela budget_execution acessível');
      console.log(`   Registros encontrados: ${budget?.length || 0}`);
    }

    // Testar tabela transparency_projects
    console.log('\n🏗️ Testando tabela transparency_projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('transparency_projects')
      .select('*')
      .limit(1);

    if (projectsError) {
      console.error('❌ Erro ao acessar transparency_projects:', projectsError);
    } else {
      console.log('✅ Tabela transparency_projects acessível');
      console.log(`   Projetos encontrados: ${projects?.length || 0}`);
    }

    // Testar inserção de documento
    console.log('\n📝 Testando inserção de documento...');
    const testDoc = {
      title: 'Documento de Teste',
      category: 'relatorios',
      date: '2024-01-01',
      status: 'published',
      file_size: '1.0 MB',
      description: 'Documento de teste para verificar funcionamento',
      tags: ['teste'],
      file_url: 'https://exemplo.com/teste.pdf'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('transparency_documents')
      .insert([testDoc])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir documento:', insertError);
    } else {
      console.log('✅ Inserção de documento funcionando');
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

testTransparencyTables(); 