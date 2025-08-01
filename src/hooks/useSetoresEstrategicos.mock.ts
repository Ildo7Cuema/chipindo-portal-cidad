import { useState, useEffect } from 'react';

export interface SetorEstrategico {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  visao: string;
  missao: string;
  cor_primaria: string;
  cor_secundaria: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstatisticaSetor {
  id: string;
  setor_id: string;
  nome: string;
  valor: string;
  icone: string;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramaSetor {
  id: string;
  setor_id: string;
  titulo: string;
  descricao: string;
  beneficios: string[];
  requisitos: string[];
  contacto: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface OportunidadeSetor {
  id: string;
  setor_id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  prazo: string;
  vagas: number;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface InfraestruturaSetor {
  id: string;
  setor_id: string;
  nome: string;
  localizacao: string;
  capacidade: string;
  estado: string;
  equipamentos: string[];
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ContactoSetor {
  id: string;
  setor_id: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export interface SetorCompleto extends SetorEstrategico {
  estatisticas: EstatisticaSetor[];
  programas: ProgramaSetor[];
  oportunidades: OportunidadeSetor[];
  infraestruturas: InfraestruturaSetor[];
  contactos: ContactoSetor[];
}

// Dados mock dos sectores estratégicos
const mockSetores: SetorEstrategico[] = [
  {
    id: '1',
    nome: 'Educação',
    slug: 'educacao',
    descricao: 'Sistema educacional completo do município de Chipindo, focado em proporcionar educação de qualidade para todos os cidadãos.',
    visao: 'Ser referência em educação municipal, garantindo acesso universal à educação de qualidade.',
    missao: 'Proporcionar educação inclusiva, equitativa e de qualidade, promovendo oportunidades de aprendizagem para todos.',
    cor_primaria: '#3B82F6',
    cor_secundaria: '#1E40AF',
    icone: 'GraduationCap',
    ordem: 1,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    nome: 'Saúde',
    slug: 'saude',
    descricao: 'Serviços de saúde integrais e acessíveis para a população de Chipindo.',
    visao: 'Ser referência em saúde municipal, garantindo uma população saudável e com qualidade de vida.',
    missao: 'Proporcionar cuidados de saúde integrais, preventivos e curativos, com foco na promoção da saúde.',
    cor_primaria: '#EF4444',
    cor_secundaria: '#DC2626',
    icone: 'Heart',
    ordem: 2,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    nome: 'Agricultura',
    slug: 'agricultura',
    descricao: 'Desenvolvimento agrícola sustentável e moderno em Chipindo.',
    visao: 'Ser referência em agricultura sustentável e moderna, garantindo a segurança alimentar.',
    missao: 'Promover o desenvolvimento agrícola sustentável e apoiar os agricultores locais.',
    cor_primaria: '#22C55E',
    cor_secundaria: '#16A34A',
    icone: 'Sprout',
    ordem: 3,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    nome: 'Sector Mineiro',
    slug: 'sector-mineiro',
    descricao: 'Exploração e gestão sustentável dos recursos minerais de Chipindo.',
    visao: 'Ser referência em mineração responsável e desenvolvimento comunitário.',
    missao: 'Desenvolver o sector mineiro de forma sustentável, criando empregos e desenvolvimento local.',
    cor_primaria: '#F59E0B',
    cor_secundaria: '#D97706',
    icone: 'Pickaxe',
    ordem: 4,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    nome: 'Desenvolvimento Económico',
    slug: 'desenvolvimento-economico',
    descricao: 'Promoção do desenvolvimento económico sustentável de Chipindo.',
    visao: 'Ser um município economicamente próspero e atrativo para investimentos.',
    missao: 'Promover o desenvolvimento económico sustentável e criar oportunidades de negócio.',
    cor_primaria: '#10B981',
    cor_secundaria: '#059669',
    icone: 'TrendingUp',
    ordem: 5,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    nome: 'Cultura',
    slug: 'cultura',
    descricao: 'Preservação e promoção do património cultural de Chipindo.',
    visao: 'Ser referência em preservação cultural e promoção das artes.',
    missao: 'Preservar e promover o património cultural, fomentando a criatividade e expressão artística.',
    cor_primaria: '#8B5CF6',
    cor_secundaria: '#7C3AED',
    icone: 'Palette',
    ordem: 6,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    nome: 'Tecnologia',
    slug: 'tecnologia',
    descricao: 'Inovação tecnológica e digitalização dos serviços municipais.',
    visao: 'Ser um município tecnologicamente avançado e inovador.',
    missao: 'Promover a inovação tecnológica e digitalizar os serviços municipais.',
    cor_primaria: '#6366F1',
    cor_secundaria: '#4F46E5',
    icone: 'Cpu',
    ordem: 7,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    nome: 'Energia e Água',
    slug: 'energia-agua',
    descricao: 'Gestão eficiente dos recursos energéticos e hídricos de Chipindo.',
    visao: 'Garantir acesso universal a energia e água de qualidade.',
    missao: 'Proporcionar serviços de energia e água eficientes e sustentáveis.',
    cor_primaria: '#06B6D4',
    cor_secundaria: '#0891B2',
    icone: 'Zap',
    ordem: 8,
    ativo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const useSetoresEstrategicos = () => {
  const [setores, setSetores] = useState<SetorEstrategico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSetores();
  }, []);

  const fetchSetores = async () => {
    try {
      setLoading(true);
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      setSetores(mockSetores.filter(setor => setor.ativo));
      setError(null);
    } catch (err) {
      setError('Erro ao carregar sectores');
    } finally {
      setLoading(false);
    }
  };

  const getSetorBySlug = async (slug: string): Promise<SetorCompleto | null> => {
    try {
      const setor = mockSetores.find(s => s.slug === slug && s.ativo);
      if (!setor) return null;

      // Dados mock para o sector completo
      const estatisticas: EstatisticaSetor[] = [
        {
          id: '1',
          setor_id: setor.id,
          nome: 'Escolas',
          valor: '12',
          icone: 'Building',
          ordem: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const programas: ProgramaSetor[] = [
        {
          id: '1',
          setor_id: setor.id,
          titulo: 'Programa de Desenvolvimento',
          descricao: 'Programa para desenvolvimento do sector.',
          beneficios: ['Benefício 1', 'Benefício 2'],
          requisitos: ['Requisito 1', 'Requisito 2'],
          contacto: 'Departamento do Sector',
          ativo: true,
          ordem: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const oportunidades: OportunidadeSetor[] = [
        {
          id: '1',
          setor_id: setor.id,
          titulo: 'Vaga de Emprego',
          descricao: 'Oportunidade de emprego no sector.',
          requisitos: ['Requisito 1', 'Requisito 2'],
          beneficios: ['Benefício 1', 'Benefício 2'],
          prazo: '2024-12-31',
          vagas: 5,
          ativo: true,
          ordem: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const infraestruturas: InfraestruturaSetor[] = [
        {
          id: '1',
          setor_id: setor.id,
          nome: 'Infraestrutura Principal',
          localizacao: 'Chipindo',
          capacidade: '100 pessoas',
          estado: 'Operacional',
          equipamentos: ['Equipamento 1', 'Equipamento 2'],
          ativo: true,
          ordem: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const contactos: ContactoSetor[] = [
        {
          id: '1',
          setor_id: setor.id,
          endereco: 'Rua Principal, Chipindo',
          telefone: '+244 XXX XXX XXX',
          email: `${setor.slug}@chipindo.gov.ao`,
          horario: 'Segunda a Sexta: 08:00 - 16:00',
          responsavel: `Diretor de ${setor.nome}`,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      return {
        ...setor,
        estatisticas,
        programas,
        oportunidades,
        infraestruturas,
        contactos
      };
    } catch (err) {
      console.error('Erro ao buscar sector:', err);
      return null;
    }
  };

  const createSetor = async (setor: Omit<SetorEstrategico, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSetor: SetorEstrategico = {
        ...setor,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockSetores.push(newSetor);
      await fetchSetores();
      return newSetor;
    } catch (err) {
      throw err;
    }
  };

  const updateSetor = async (id: string, updates: Partial<SetorEstrategico>) => {
    try {
      const index = mockSetores.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSetores[index] = {
          ...mockSetores[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
      await fetchSetores();
      return mockSetores[index];
    } catch (err) {
      throw err;
    }
  };

  const deleteSetor = async (id: string) => {
    try {
      const index = mockSetores.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSetores.splice(index, 1);
      }
      await fetchSetores();
    } catch (err) {
      throw err;
    }
  };

  return {
    setores,
    loading,
    error,
    fetchSetores,
    getSetorBySlug,
    createSetor,
    updateSetor,
    deleteSetor
  };
}; 