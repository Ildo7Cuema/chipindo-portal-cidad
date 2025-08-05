// Script para testar o filtro por setor na Ouvidoria
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ5NzAsImV4cCI6MjA1MDU1MDk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados mock para teste
const mockManifestacoes = [
  {
    id: '1',
    protocolo: 'OUV-2024-001',
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    telefone: '923456789',
    categoria_id: '1',
    tipo: 'reclamacao',
    assunto: 'Problema na estrada - Infraestrutura',
    descricao: 'Buraco na estrada principal causando acidentes. Necessita intervenção urgente do setor de infraestrutura.',
    status: 'em_analise',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    protocolo: 'OUV-2024-002',
    nome: 'Maria Santos',
    email: 'maria@exemplo.com',
    telefone: '934567890',
    categoria_id: '2',
    tipo: 'sugestao',
    assunto: 'Melhoria na escola municipal - Educação',
    descricao: 'Sugestão para instalar ventiladores nas salas de aula da escola municipal. Setor de educação precisa de melhorias.',
    status: 'pendente',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    protocolo: 'OUV-2024-003',
    nome: 'Pedro Costa',
    email: 'pedro@exemplo.com',
    telefone: '945678901',
    categoria_id: '3',
    tipo: 'elogio',
    assunto: 'Excelente atendimento no hospital - Saúde',
    descricao: 'Quero elogiar o atendimento recebido no hospital municipal. O setor de saúde está funcionando muito bem.',
    status: 'resolvido',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    protocolo: 'OUV-2024-004',
    nome: 'Ana Oliveira',
    email: 'ana@exemplo.com',
    telefone: '956789012',
    categoria_id: '1',
    tipo: 'reclamacao',
    assunto: 'Falta de água no bairro - Energia e Água',
    descricao: 'Há 3 dias sem água no bairro central. O setor de energia e água precisa resolver este problema urgentemente.',
    status: 'em_analise',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    protocolo: 'OUV-2024-005',
    nome: 'Carlos Mendes',
    email: 'carlos@exemplo.com',
    telefone: '967890123',
    categoria_id: '2',
    tipo: 'sugestao',
    assunto: 'Melhoria na agricultura local - Agricultura',
    descricao: 'Sugestão para implementar programa de apoio aos agricultores locais. O setor de agricultura precisa de mais investimento.',
    status: 'pendente',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Função de filtro por setor
function filterBySector(manifestacoes, sectorFilter) {
  if (!sectorFilter || sectorFilter === 'all') {
    return manifestacoes;
  }

  const sectorKeywords = {
    'educação': ['educação', 'escola', 'escolar', 'académico', 'professor', 'aluno'],
    'saúde': ['saúde', 'hospital', 'médico', 'enfermeiro', 'clínica', 'atendimento médico'],
    'agricultura': ['agricultura', 'agricultor', 'fazenda', 'colheita', 'campo'],
    'setor mineiro': ['mina', 'mineiro', 'mineração', 'mineral'],
    'desenvolvimento económico': ['desenvolvimento económico', 'emprego', 'economia', 'negócio'],
    'cultura': ['cultura', 'cultural', 'arte', 'evento cultural', 'teatro'],
    'tecnologia': ['tecnologia', 'tecnológico', 'sistema', 'digital', 'computador'],
    'energia e água': ['energia', 'água', 'eletricidade', 'abastecimento de água']
  };

  const sectorName = sectorFilter.toLowerCase();
  const keywords = sectorKeywords[sectorName] || [sectorName];

  return manifestacoes.filter(manifestacao => {
    const assunto = manifestacao.assunto.toLowerCase();
    const descricao = manifestacao.descricao.toLowerCase();
    
    return keywords.some(keyword => 
      assunto.includes(keyword) || descricao.includes(keyword)
    );
  });
}

// Testar filtros
console.log('=== TESTE DE FILTRO POR SETOR ===\n');

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
  const filtradas = filterBySector(mockManifestacoes, setor);
  console.log(`Setor: ${setor}`);
  console.log(`Manifestações encontradas: ${filtradas.length}`);
  
  if (filtradas.length > 0) {
    filtradas.forEach(m => {
      console.log(`  - ${m.assunto}`);
    });
  } else {
    console.log('  - Nenhuma manifestação encontrada');
  }
  console.log('');
});

console.log('=== TESTE COMPLETO ===');
console.log(`Total de manifestações: ${mockManifestacoes.length}`);
console.log('Todas as manifestações:');
mockManifestacoes.forEach(m => {
  console.log(`  - ${m.assunto}`);
}); 