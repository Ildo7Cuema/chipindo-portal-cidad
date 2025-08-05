// Script para testar o filtro melhorado por setor na Ouvidoria
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ5NzAsImV4cCI6MjA1MDU1MDk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados reais melhorados com departamentos específicos
const manifestacoesReais = [
  {
    protocolo: 'OUV-2024-001',
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '+244 912 345 678',
    categoria: 'reclamacao',
    assunto: 'Problema com iluminação pública',
    descricao: 'A iluminação pública na rua principal está com problemas há mais de uma semana. Isso está causando insegurança na comunidade.',
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
    assunto: 'Sugestão para parque infantil',
    descricao: 'Sugiro a construção de um parque infantil no bairro central. Seria muito benéfico para as crianças da comunidade.',
    status: 'em_analise',
    prioridade: 'baixa',
    departamento_responsavel: 'Educação'
  },
  {
    protocolo: 'OUV-2024-003',
    nome: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    telefone: '+244 934 567 890',
    categoria: 'elogio',
    assunto: 'Elogio ao atendimento da prefeitura',
    descricao: 'Gostaria de elogiar o excelente atendimento recebido na prefeitura. O funcionário foi muito atencioso e resolveu meu problema rapidamente.',
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
    assunto: 'Denúncia sobre lixo acumulado',
    descricao: 'Há lixo acumulado há mais de uma semana na esquina da rua das Flores. Isso está causando mau cheiro e pode atrair animais.',
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
    assunto: 'Solicitação de informações sobre projetos',
    descricao: 'Gostaria de obter informações sobre os projetos de infraestrutura previstos para este ano no município.',
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
    assunto: 'Problema na escola municipal',
    descricao: 'A escola municipal está com problemas de manutenção. As salas de aula precisam de reparos urgentes.',
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
    assunto: 'Elogio ao hospital municipal',
    descricao: 'Quero elogiar o excelente atendimento recebido no hospital municipal. Os médicos e enfermeiros foram muito profissionais.',
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
    assunto: 'Sugestão para agricultura local',
    descricao: 'Sugestão para implementar programa de apoio aos agricultores locais. Precisamos de mais investimento e apoio técnico.',
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
    assunto: 'Problema na mina local',
    descricao: 'Reclamação sobre condições de segurança na mina local. Precisamos de mais fiscalização e melhorias nas condições de trabalho.',
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
    assunto: 'Elogio ao evento cultural',
    descricao: 'Elogio ao evento cultural realizado no centro da cidade. Estão fazendo um excelente trabalho promovendo a arte local.',
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
    assunto: 'Sugestão para tecnologia municipal',
    descricao: 'Sugestão para modernizar os sistemas da prefeitura. Precisamos de atualizações e melhorias na infraestrutura digital.',
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
    assunto: 'Falta de água no bairro',
    descricao: 'Há 3 dias sem água no bairro central. Precisamos resolver este problema urgentemente.',
    status: 'em_analise',
    prioridade: 'urgente',
    departamento_responsavel: 'Energia e Água'
  }
];

// Função de filtro melhorada
function filterBySectorImproved(manifestacoes, sectorFilter) {
  if (!sectorFilter || sectorFilter === 'all') {
    return manifestacoes;
  }

  const sectorKeywords = {
    'educação': ['escola', 'escolar', 'académico', 'professor', 'aluno', 'educacional', 'sala de aula', 'parque infantil'],
    'saúde': ['hospital', 'médico', 'enfermeiro', 'clínica', 'atendimento médico', 'sanitário', 'saúde pública'],
    'agricultura': ['agricultura', 'agricultor', 'fazenda', 'colheita', 'campo', 'rural', 'apoio técnico'],
    'setor mineiro': ['mina', 'mineiro', 'mineração', 'mineral', 'extrativo', 'segurança na mina'],
    'desenvolvimento económico': ['desenvolvimento económico', 'emprego', 'economia', 'negócio', 'comercial', 'oportunidades'],
    'cultura': ['cultura', 'cultural', 'arte', 'evento cultural', 'teatro', 'artístico', 'arte local'],
    'tecnologia': ['tecnologia', 'tecnológico', 'sistema', 'digital', 'computador', 'informática', 'modernizar sistemas'],
    'energia e água': ['energia', 'água', 'eletricidade', 'abastecimento de água', 'saneamento', 'iluminação pública']
  };

  const sectorName = sectorFilter.toLowerCase();
  const keywords = sectorKeywords[sectorName] || [sectorName];

  return manifestacoes.filter(manifestacao => {
    const assunto = manifestacao.assunto?.toLowerCase() || '';
    const descricao = manifestacao.descricao?.toLowerCase() || '';
    const departamento = manifestacao.departamento_responsavel?.toLowerCase() || '';
    
    let matches = false;
    
    // Priorizar departamento_responsavel se estiver preenchido
    if (departamento) {
      const departamentoMatch = keywords.some(keyword => 
        departamento.includes(keyword)
      );
      if (departamentoMatch) {
        matches = true;
      }
    }
    
    // Se não encontrou no departamento, verificar assunto e descrição
    if (!matches) {
      const assuntoMatch = keywords.some(keyword => 
        assunto.includes(keyword)
      );
      
      const descricaoMatch = keywords.some(keyword => 
        descricao.includes(keyword)
      );
      
      matches = assuntoMatch || descricaoMatch;
    }
    
    return matches;
  });
}

// Testar filtros
console.log('=== TESTE DE FILTRO MELHORADO POR SETOR ===\n');

const setores = [
  'educação',
  'saúde', 
  'agricultura',
  'setor mineiro',
  'desenvolvimento económico',
  'cultura',
  'tecnologia',
  'energia e água'
];

setores.forEach(setor => {
  const filtradas = filterBySectorImproved(manifestacoesReais, setor);
  console.log(`Setor: ${setor}`);
  console.log(`Manifestações encontradas: ${filtradas.length}`);
  
  if (filtradas.length > 0) {
    filtradas.forEach(m => {
      console.log(`  - ${m.protocolo}: ${m.assunto} (${m.departamento_responsavel})`);
    });
  } else {
    console.log('  - Nenhuma manifestação encontrada');
  }
  console.log('');
});

console.log('=== TESTE COMPLETO ===');
console.log(`Total de manifestações: ${manifestacoesReais.length}`);
console.log('Todas as manifestações:');
manifestacoesReais.forEach(m => {
  console.log(`  - ${m.protocolo}: ${m.assunto} (${m.departamento_responsavel})`);
}); 