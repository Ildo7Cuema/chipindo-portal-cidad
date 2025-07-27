import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

// Configuração do Supabase
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTransparencyData() {
  try {
    console.log('🔍 Verificando dados de transparência...');
    
    // Verificar documentos
    console.log('\n📄 Verificando documentos...');
    const { data: documents, error: docsError } = await supabase
      .from('transparency_documents')
      .select('*')
      .limit(10);
    
    if (docsError) {
      console.error('❌ Erro ao buscar documentos:', docsError.message);
    } else {
      console.log(`✅ Encontrados ${documents?.length || 0} documentos`);
      if (documents && documents.length > 0) {
        console.log('📋 Primeiros documentos:');
        documents.forEach((doc, index) => {
          console.log(`   ${index + 1}. ${doc.title} (${doc.status})`);
        });
      }
    }

    // Verificar dados orçamentários
    console.log('\n💰 Verificando dados orçamentários...');
    const { data: budgetData, error: budgetError } = await supabase
      .from('budget_execution')
      .select('*')
      .limit(10);
    
    if (budgetError) {
      console.error('❌ Erro ao buscar dados orçamentários:', budgetError.message);
    } else {
      console.log(`✅ Encontrados ${budgetData?.length || 0} registros orçamentários`);
      if (budgetData && budgetData.length > 0) {
        console.log('📋 Primeiros registros:');
        budgetData.forEach((budget, index) => {
          console.log(`   ${index + 1}. ${budget.year} - ${budget.category} (${budget.percentage}%)`);
        });
      }
    }

    // Verificar projetos
    console.log('\n🏗️  Verificando projetos...');
    const { data: projects, error: projsError } = await supabase
      .from('transparency_projects')
      .select('*')
      .limit(10);
    
    if (projsError) {
      console.error('❌ Erro ao buscar projetos:', projsError.message);
    } else {
      console.log(`✅ Encontrados ${projects?.length || 0} projetos`);
      if (projects && projects.length > 0) {
        console.log('📋 Primeiros projetos:');
        projects.forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.name} (${project.status})`);
        });
      }
    }

    console.log('\n🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error);
    process.exit(1);
  }
}

// Executar a verificação
checkTransparencyData(); 