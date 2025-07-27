import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

// Configuração do Supabase
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTransparency() {
  try {
    console.log('🚀 Configurando sistema de transparência...');
    
    // Dados de exemplo para documentos
    const documents = [
      {
        title: 'Relatório Anual 2023',
        category: 'relatorios',
        date: '2023-12-31',
        status: 'published',
        file_size: '2.5 MB',
        downloads: 45,
        views: 120,
        description: 'Relatório anual de atividades do município de Chipindo',
        tags: ['relatório', 'anual', '2023']
      },
      {
        title: 'Orçamento Municipal 2024',
        category: 'orcamento',
        date: '2024-01-15',
        status: 'published',
        file_size: '1.8 MB',
        downloads: 78,
        views: 234,
        description: 'Orçamento municipal para o ano de 2024',
        tags: ['orçamento', '2024', 'municipal']
      },
      {
        title: 'Contrato de Fornecimento de Água',
        category: 'contratos',
        date: '2024-02-01',
        status: 'published',
        file_size: '3.2 MB',
        downloads: 32,
        views: 89,
        description: 'Contrato para fornecimento de água potável',
        tags: ['contrato', 'água', 'fornecimento']
      },
      {
        title: 'Prestação de Contas 2023',
        category: 'prestacao-contas',
        date: '2024-01-30',
        status: 'published',
        file_size: '4.1 MB',
        downloads: 56,
        views: 167,
        description: 'Prestação de contas do exercício de 2023',
        tags: ['prestação', 'contas', '2023']
      },
      {
        title: 'Plano de Desenvolvimento 2024-2027',
        category: 'planos',
        date: '2024-01-10',
        status: 'published',
        file_size: '5.7 MB',
        downloads: 23,
        views: 78,
        description: 'Plano de desenvolvimento municipal 2024-2027',
        tags: ['plano', 'desenvolvimento', '2024-2027']
      },
      {
        title: 'Auditoria Externa 2023',
        category: 'auditorias',
        date: '2024-01-20',
        status: 'published',
        file_size: '2.8 MB',
        downloads: 34,
        views: 95,
        description: 'Relatório de auditoria externa 2023',
        tags: ['auditoria', 'externa', '2023']
      }
    ];

    // Dados de exemplo para orçamento
    const budgetData = [
      {
        year: '2024',
        category: 'Infraestrutura',
        total_budget: 50000000.00,
        executed_budget: 35000000.00,
        percentage: 70.00,
        status: 'on_track'
      },
      {
        year: '2024',
        category: 'Educação',
        total_budget: 30000000.00,
        executed_budget: 28000000.00,
        percentage: 93.33,
        status: 'over_budget'
      },
      {
        year: '2024',
        category: 'Saúde',
        total_budget: 25000000.00,
        executed_budget: 18000000.00,
        percentage: 72.00,
        status: 'on_track'
      },
      {
        year: '2024',
        category: 'Agricultura',
        total_budget: 15000000.00,
        executed_budget: 12000000.00,
        percentage: 80.00,
        status: 'on_track'
      },
      {
        year: '2024',
        category: 'Transportes',
        total_budget: 20000000.00,
        executed_budget: 16000000.00,
        percentage: 80.00,
        status: 'on_track'
      },
      {
        year: '2023',
        category: 'Infraestrutura',
        total_budget: 45000000.00,
        executed_budget: 42000000.00,
        percentage: 93.33,
        status: 'over_budget'
      },
      {
        year: '2023',
        category: 'Educação',
        total_budget: 28000000.00,
        executed_budget: 27500000.00,
        percentage: 98.21,
        status: 'over_budget'
      },
      {
        year: '2023',
        category: 'Saúde',
        total_budget: 22000000.00,
        executed_budget: 20000000.00,
        percentage: 90.91,
        status: 'on_track'
      }
    ];

    // Dados de exemplo para projetos
    const projects = [
      {
        name: 'Pavimentação da Rua Principal',
        description: 'Pavimentação da rua principal do centro da cidade de Chipindo',
        budget: 25000000.00,
        progress: 75.00,
        start_date: '2024-01-01',
        end_date: '2024-06-30',
        status: 'active',
        location: 'Centro da Cidade',
        beneficiaries: 5000
      },
      {
        name: 'Construção da Escola Primária',
        description: 'Construção de uma nova escola primária no bairro novo',
        budget: 40000000.00,
        progress: 100.00,
        start_date: '2023-03-01',
        end_date: '2024-02-28',
        status: 'completed',
        location: 'Bairro Novo',
        beneficiaries: 300
      },
      {
        name: 'Sistema de Abastecimento de Água',
        description: 'Instalação de sistema de abastecimento de água potável',
        budget: 35000000.00,
        progress: 45.00,
        start_date: '2024-02-01',
        end_date: '2024-12-31',
        status: 'active',
        location: 'Zona Rural',
        beneficiaries: 8000
      },
      {
        name: 'Centro de Saúde Municipal',
        description: 'Construção de centro de saúde com equipamentos modernos',
        budget: 50000000.00,
        progress: 0.00,
        start_date: '2024-07-01',
        end_date: '2025-06-30',
        status: 'planned',
        location: 'Centro da Cidade',
        beneficiaries: 15000
      },
      {
        name: 'Rede de Iluminação Pública',
        description: 'Instalação de rede de iluminação pública LED',
        budget: 18000000.00,
        progress: 100.00,
        start_date: '2023-09-01',
        end_date: '2024-01-31',
        status: 'completed',
        location: 'Toda a Cidade',
        beneficiaries: 12000
      },
      {
        name: 'Mercado Municipal',
        description: 'Construção de mercado municipal coberto',
        budget: 30000000.00,
        progress: 60.00,
        start_date: '2024-03-01',
        end_date: '2024-11-30',
        status: 'active',
        location: 'Centro Comercial',
        beneficiaries: 3000
      }
    ];

    console.log('📝 Inserindo dados de exemplo...');

    // Inserir documentos
    console.log('📄 Inserindo documentos...');
    for (const doc of documents) {
      const { error } = await supabase
        .from('transparency_documents')
        .insert(doc);
      
      if (error) {
        console.warn(`⚠️  Erro ao inserir documento "${doc.title}":`, error.message);
      } else {
        console.log(`✅ Documento "${doc.title}" inserido`);
      }
    }

    // Inserir dados orçamentários
    console.log('\n💰 Inserindo dados orçamentários...');
    for (const budget of budgetData) {
      const { error } = await supabase
        .from('budget_execution')
        .insert(budget);
      
      if (error) {
        console.warn(`⚠️  Erro ao inserir dados orçamentários:`, error.message);
      } else {
        console.log(`✅ Dados orçamentários ${budget.year} - ${budget.category} inseridos`);
      }
    }

    // Inserir projetos
    console.log('\n🏗️  Inserindo projetos...');
    for (const project of projects) {
      const { error } = await supabase
        .from('transparency_projects')
        .insert(project);
      
      if (error) {
        console.warn(`⚠️  Erro ao inserir projeto "${project.name}":`, error.message);
      } else {
        console.log(`✅ Projeto "${project.name}" inserido`);
      }
    }

    console.log('\n🎉 Configuração de transparência concluída!');
    console.log('\n📊 Dados inseridos:');
    console.log(`   - ${documents.length} documentos`);
    console.log(`   - ${budgetData.length} registros orçamentários`);
    console.log(`   - ${projects.length} projetos`);
    
  } catch (error) {
    console.error('❌ Erro ao configurar transparência:', error);
    process.exit(1);
  }
}

// Executar a configuração
setupTransparency(); 