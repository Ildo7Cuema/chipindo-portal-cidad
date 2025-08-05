// ARQUIVO MOCK DESABILITADO - USANDO DADOS REAIS DO BANCO
// Este arquivo foi substituído por useOuvidoria.ts que se conecta ao Supabase

/*
export interface OuvidoriaCategory {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  bg_color: string;
  ativo: boolean;
  created_at: string;
}

export interface OuvidoriaItem {
  id: string;
  protocolo: string;
  nome: string;
  email: string;
  telefone: string;
  categoria_id: string;
  tipo: string;
  assunto: string;
  descricao: string;
  status: string;
  resposta?: string;
  anexos: string[];
  data_prazo?: string;
  created_at: string;
  updated_at: string;
}

const mockCategories: OuvidoriaCategory[] = [
  {
    id: '1',
    nome: 'Reclamação',
    descricao: 'Manifestações de insatisfação',
    cor: '#ef4444',
    bg_color: '#fef2f2',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Sugestão',
    descricao: 'Propostas de melhoria',
    cor: '#3b82f6',
    bg_color: '#eff6ff',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Elogio',
    descricao: 'Manifestações positivas',
    cor: '#10b981',
    bg_color: '#f0fdf4',
    ativo: true,
    created_at: new Date().toISOString()
  }
];

const mockManifestacoes: OuvidoriaItem[] = [
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
  },
  {
    id: '6',
    protocolo: 'OUV-2024-006',
    nome: 'Lucia Ferreira',
    email: 'lucia@exemplo.com',
    telefone: '978901234',
    categoria_id: '1',
    tipo: 'reclamacao',
    assunto: 'Problema na mina - Setor Mineiro',
    descricao: 'Reclamação sobre condições de segurança na mina local. O setor mineiro precisa de mais fiscalização.',
    status: 'em_analise',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    protocolo: 'OUV-2024-007',
    nome: 'Roberto Alves',
    email: 'roberto@exemplo.com',
    telefone: '989012345',
    categoria_id: '3',
    tipo: 'elogio',
    assunto: 'Evento cultural excelente - Cultura',
    descricao: 'Elogio ao evento cultural realizado no centro da cidade. O setor de cultura está fazendo um excelente trabalho.',
    status: 'resolvido',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    protocolo: 'OUV-2024-008',
    nome: 'Sofia Martins',
    email: 'sofia@exemplo.com',
    telefone: '990123456',
    categoria_id: '2',
    tipo: 'sugestao',
    assunto: 'Melhoria na tecnologia municipal - Tecnologia',
    descricao: 'Sugestão para modernizar os sistemas da prefeitura. O setor de tecnologia precisa de atualizações.',
    status: 'pendente',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    protocolo: 'OUV-2024-009',
    nome: 'Antonio Silva',
    email: 'antonio@exemplo.com',
    telefone: '901234567',
    categoria_id: '1',
    tipo: 'reclamacao',
    assunto: 'Problema no desenvolvimento económico - Desenvolvimento Económico',
    descricao: 'Reclamação sobre falta de oportunidades de emprego. O setor de desenvolvimento económico precisa de mais iniciativas.',
    status: 'em_analise',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useOuvidoria() {
  const [categories, setCategories] = useState<OuvidoriaCategory[]>(mockCategories);
  const [manifestacoes, setManifestacoes] = useState<OuvidoriaItem[]>(mockManifestacoes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setCategories(mockCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const fetchManifestacoes = async (sectorFilter?: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let filteredManifestacoes = mockManifestacoes;
      
      // Filtrar por setor se especificado
      if (sectorFilter && sectorFilter !== 'all') {
        console.log('Ouvidoria - Aplicando filtro para setor:', sectorFilter);
        
        filteredManifestacoes = mockManifestacoes.filter(manifestacao => {
          const assunto = manifestacao.assunto.toLowerCase();
          const descricao = manifestacao.descricao.toLowerCase();
          const sectorName = sectorFilter.toLowerCase();
          
          // Mapeamento de setores para palavras-chave
          const sectorKeywords: Record<string, string[]> = {
            'educação': ['educação', 'escola', 'escolar', 'académico', 'professor', 'aluno'],
            'saúde': ['saúde', 'hospital', 'médico', 'enfermeiro', 'clínica', 'atendimento médico'],
            'agricultura': ['agricultura', 'agricultor', 'fazenda', 'colheita', 'campo'],
            'setor mineiro': ['mina', 'mineiro', 'mineração', 'mineral'],
            'desenvolvimento económico': ['desenvolvimento económico', 'emprego', 'economia', 'negócio'],
            'cultura': ['cultura', 'cultural', 'arte', 'evento cultural', 'teatro'],
            'tecnologia': ['tecnologia', 'tecnológico', 'sistema', 'digital', 'computador'],
            'energia e água': ['energia', 'água', 'eletricidade', 'abastecimento de água']
          };
          
          // Verificar se o setor tem palavras-chave específicas
          const keywords = sectorKeywords[sectorName] || [sectorName];
          
          // Filtrar baseado no conteúdo da manifestação
          return keywords.some(keyword => 
            assunto.includes(keyword) || descricao.includes(keyword)
          );
        });
        
        console.log('Ouvidoria - Total filtrado:', filteredManifestacoes.length);
      }
      
      setManifestacoes(filteredManifestacoes);
      setError(null);
    } catch (err) {
      console.error('Error fetching manifestações:', err);
      setError('Erro ao carregar manifestações');
    } finally {
      setLoading(false);
    }
  };

  const submitManifestacao = async (data: Partial<OuvidoriaItem>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newManifestacao: OuvidoriaItem = {
        id: Date.now().toString(),
        protocolo: `OUV-2024-${String(manifestacoes.length + 1).padStart(3, '0')}`,
        nome: data.nome || '',
        email: data.email || '',
        telefone: data.telefone || '',
        categoria_id: data.categoria_id || '1',
        tipo: data.tipo || 'reclamacao',
        assunto: data.assunto || '',
        descricao: data.descricao || '',
        status: 'pendente',
        anexos: data.anexos || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setManifestacoes(prev => [newManifestacao, ...prev]);
      setError(null);
      return { success: true, data: newManifestacao };
    } catch (err) {
      console.error('Error submitting manifestação:', err);
      setError('Erro ao enviar manifestação');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // Removido fetchManifestacoes() daqui para evitar conflito
    // As manifestações serão carregadas pelo componente
  }, []);

  return {
    categories,
    manifestacoes,
    loading,
    error,
    fetchCategories,
    fetchManifestacoes,
    submitManifestacao
  };
}
*/

// Re-export do hook real
export * from './useOuvidoria';