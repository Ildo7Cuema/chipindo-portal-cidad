// Script para inserir dados reais na tabela da Ouvidoria
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ5NzAsImV4cCI6MjA1MDU1MDk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados reais para inserir na tabela ouvidoria_manifestacoes
const manifestacoesReais = [
  {
    protocolo: 'OUV-2024-001',
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '+244 912 345 678',
    categoria: 'reclamacao',
    assunto: 'Problema com iluminação pública - Infraestrutura',
    descricao: 'A iluminação pública na rua principal está com problemas há mais de uma semana. Isso está causando insegurança na comunidade. Necessita intervenção urgente do setor de infraestrutura.',
    status: 'pendente',
    prioridade: 'media',
    departamento_responsavel: 'Obras Públicas'
  },
  {
    protocolo: 'OUV-2024-002',
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '+244 923 456 789',
    categoria: 'sugestao',
    assunto: 'Sugestão para parque infantil - Educação',
    descricao: 'Sugiro a construção de um parque infantil no bairro central. Seria muito benéfico para as crianças da comunidade. O setor de educação precisa de mais investimento em espaços recreativos.',
    status: 'em_analise',
    prioridade: 'baixa',
    departamento_responsavel: 'Urbanismo'
  },
  {
    protocolo: 'OUV-2024-003',
    nome: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    telefone: '+244 934 567 890',
    categoria: 'elogio',
    assunto: 'Elogio ao atendimento da prefeitura - Saúde',
    descricao: 'Gostaria de elogiar o excelente atendimento recebido na prefeitura. O funcionário foi muito atencioso e resolveu meu problema rapidamente. O setor de saúde está funcionando muito bem.',
    status: 'resolvido',
    prioridade: 'baixa',
    departamento_responsavel: 'Atendimento'
  },
  {
    protocolo: 'OUV-2024-004',
    nome: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    telefone: '+244 945 678 901',
    categoria: 'denuncia',
    assunto: 'Denúncia sobre lixo acumulado - Serviços Urbanos',
    descricao: 'Há lixo acumulado há mais de uma semana na esquina da rua das Flores. Isso está causando mau cheiro e pode atrair animais. O setor de serviços urbanos precisa resolver este problema urgentemente.',
    status: 'respondido',
    prioridade: 'alta',
    departamento_responsavel: 'Serviços Urbanos'
  },
  {
    protocolo: 'OUV-2024-005',
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    telefone: '+244 956 789 012',
    categoria: 'solicitacao',
    assunto: 'Solicitação de informações sobre projetos - Desenvolvimento Económico',
    descricao: 'Gostaria de obter informações sobre os projetos de infraestrutura previstos para este ano no município. O setor de desenvolvimento económico precisa de mais transparência.',
    status: 'resolvido',
    prioridade: 'media',
    departamento_responsavel: 'Planejamento'
  },
  {
    protocolo: 'OUV-2024-006',
    nome: 'Lucia Mendes',
    email: 'lucia.mendes@email.com',
    telefone: '+244 967 890 123',
    categoria: 'reclamacao',
    assunto: 'Problema na escola municipal - Educação',
    descricao: 'A escola municipal está com problemas de manutenção. As salas de aula precisam de reparos urgentes. O setor de educação precisa de mais investimento.',
    status: 'em_analise',
    prioridade: 'alta',
    departamento_responsavel: 'Educação'
  },
  {
    protocolo: 'OUV-2024-007',
    nome: 'Roberto Alves',
    email: 'roberto.alves@email.com',
    telefone: '+244 978 901 234',
    categoria: 'elogio',
    assunto: 'Elogio ao hospital municipal - Saúde',
    descricao: 'Quero elogiar o excelente atendimento recebido no hospital municipal. Os médicos e enfermeiros foram muito profissionais. O setor de saúde está funcionando muito bem.',
    status: 'resolvido',
    prioridade: 'baixa',
    departamento_responsavel: 'Saúde'
  },
  {
    protocolo: 'OUV-2024-008',
    nome: 'Sofia Martins',
    email: 'sofia.martins@email.com',
    telefone: '+244 989 012 345',
    categoria: 'sugestao',
    assunto: 'Sugestão para agricultura local - Agricultura',
    descricao: 'Sugestão para implementar programa de apoio aos agricultores locais. O setor de agricultura precisa de mais investimento e apoio técnico.',
    status: 'pendente',
    prioridade: 'media',
    departamento_responsavel: 'Agricultura'
  },
  {
    protocolo: 'OUV-2024-009',
    nome: 'Antonio Silva',
    email: 'antonio.silva@email.com',
    telefone: '+244 990 123 456',
    categoria: 'reclamacao',
    assunto: 'Problema na mina local - Setor Mineiro',
    descricao: 'Reclamação sobre condições de segurança na mina local. O setor mineiro precisa de mais fiscalização e melhorias nas condições de trabalho.',
    status: 'em_analise',
    prioridade: 'urgente',
    departamento_responsavel: 'Setor Mineiro'
  },
  {
    protocolo: 'OUV-2024-010',
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@email.com',
    telefone: '+244 901 234 567',
    categoria: 'elogio',
    assunto: 'Elogio ao evento cultural - Cultura',
    descricao: 'Elogio ao evento cultural realizado no centro da cidade. O setor de cultura está fazendo um excelente trabalho promovendo a arte local.',
    status: 'resolvido',
    prioridade: 'baixa',
    departamento_responsavel: 'Cultura'
  },
  {
    protocolo: 'OUV-2024-011',
    nome: 'Miguel Santos',
    email: 'miguel.santos@email.com',
    telefone: '+244 912 345 678',
    categoria: 'sugestao',
    assunto: 'Sugestão para tecnologia municipal - Tecnologia',
    descricao: 'Sugestão para modernizar os sistemas da prefeitura. O setor de tecnologia precisa de atualizações e melhorias na infraestrutura digital.',
    status: 'pendente',
    prioridade: 'media',
    departamento_responsavel: 'Tecnologia'
  },
  {
    protocolo: 'OUV-2024-012',
    nome: 'Isabel Ferreira',
    email: 'isabel.ferreira@email.com',
    telefone: '+244 923 456 789',
    categoria: 'reclamacao',
    assunto: 'Falta de água no bairro - Energia e Água',
    descricao: 'Há 3 dias sem água no bairro central. O setor de energia e água precisa resolver este problema urgentemente.',
    status: 'em_analise',
    prioridade: 'urgente',
    departamento_responsavel: 'Energia e Água'
  }
];

async function insertManifestacoes() {
  console.log('Inserindo manifestações reais na tabela ouvidoria_manifestacoes...');
  
  try {
    // Inserir manifestações
    const { data, error } = await supabase
      .from('ouvidoria_manifestacoes')
      .insert(manifestacoesReais)
      .select();

    if (error) {
      console.error('Erro ao inserir manifestações:', error);
      return;
    }

    console.log('✅ Manifestações inseridas com sucesso!');
    console.log(`Total inserido: ${data?.length || 0} manifestações`);
    
    // Listar algumas manifestações inseridas
    console.log('\nManifestações inseridas:');
    data?.forEach((manifestacao, index) => {
      console.log(`${index + 1}. ${manifestacao.protocolo} - ${manifestacao.assunto}`);
    });

  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executar o script
insertManifestacoes(); 