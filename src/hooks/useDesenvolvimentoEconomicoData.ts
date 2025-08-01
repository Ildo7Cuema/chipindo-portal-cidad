// Mock implementation for economic development data
import { useState, useEffect } from 'react';

export interface EconomicoInfo {
  title: string;
  subtitle: string;
  description: string;
  vision: string;
  mission: string;
}

export interface EstatisticaEconomica {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface SetorEconomico {
  id: string;
  nome: string;
  empresas: string;
  empregos: string;
  contribuicao: string;
  estado: string;
}

export interface ProgramaEconomico {
  id: string;
  title: string;
  description: string;
  requisitos: string[];
  beneficios: string[];
  contact: string;
}

export interface OportunidadeEconomica {
  id: string;
  title: string;
  description: string;
  vagas: string;
  prazo: string;
  requisitos: string[];
  beneficios: string[];
}

export interface InfraestruturaEconomica {
  id: string;
  nome: string;
  localizacao: string;
  capacidade: string;
  equipamentos: string[];
  estado: string;
}

export interface ContactoEconomico {
  endereco: string;
  telefone: string;
  email: string;
  responsavel: string;
  horario: string;
}

export function useDesenvolvimentoEconomicoData() {
  const [economicoInfo, setEconomicoInfo] = useState<EconomicoInfo>({
    title: "Desenvolvimento Econômico de Chipindo",
    subtitle: "Promovendo crescimento sustentável e oportunidades de negócio",
    description: "O setor de desenvolvimento econômico trabalha para criar um ambiente favorável aos negócios, atrair investimentos e promover o empreendedorismo local.",
    vision: "Ser o motor do crescimento econômico sustentável da região, criando oportunidades e prosperidade para todos.",
    mission: "Promover o desenvolvimento econômico através de políticas eficazes, atração de investimentos e apoio ao empreendedorismo local."
  });

  const [estatisticas, setEstatisticas] = useState<EstatisticaEconomica[]>([
    {
      id: '1',
      label: 'Empresas Registadas',
      value: '245',
      icon: 'Building'
    },
    {
      id: '2',
      label: 'Empregos Criados',
      value: '1,850',
      icon: 'Users'
    },
    {
      id: '3',
      label: 'Investimento (USD)',
      value: '25M',
      icon: 'DollarSign'
    },
    {
      id: '4',
      label: 'PIB Municipal',
      value: '45M',
      icon: 'TrendingUp'
    }
  ]);

  const [setores, setSetores] = useState<SetorEconomico[]>([
    {
      id: '1',
      nome: 'Comércio e Serviços',
      empresas: '120 empresas',
      empregos: '850 empregos',
      contribuicao: '40% do PIB',
      estado: 'Crescimento'
    },
    {
      id: '2',
      nome: 'Indústria Transformadora',
      empresas: '35 empresas',
      empregos: '420 empregos',
      contribuicao: '25% do PIB',
      estado: 'Estável'
    },
    {
      id: '3',
      nome: 'Agricultura',
      empresas: '65 empresas',
      empregos: '380 empregos',
      contribuicao: '20% do PIB',
      estado: 'Expansão'
    },
    {
      id: '4',
      nome: 'Mineração',
      empresas: '25 empresas',
      empregos: '200 empregos',
      contribuicao: '15% do PIB',
      estado: 'Crescimento'
    }
  ]);

  const [programas, setProgramas] = useState<ProgramaEconomico[]>([
    {
      id: '1',
      title: 'Apoio ao Empreendedorismo',
      description: 'Programa de apoio financeiro e técnico para novos empreendedores',
      requisitos: ['Idade mínima 18 anos', 'Plano de negócios', 'Residir no município'],
      beneficios: ['Microcrédito', 'Formação empresarial', 'Mentoria'],
      contact: 'empreendedorismo@chipindo.gov.ao'
    },
    {
      id: '2',
      title: 'Atração de Investimentos',
      description: 'Programa para atrair investimentos nacionais e estrangeiros',
      requisitos: ['Projeto viável', 'Impacto econômico', 'Sustentabilidade'],
      beneficios: ['Incentivos fiscais', 'Apoio logístico', 'Facilidades burocráticas'],
      contact: 'investimentos@chipindo.gov.ao'
    }
  ]);

  const [oportunidades, setOportunidades] = useState<OportunidadeEconomica[]>([
    {
      id: '1',
      title: 'Gestor de Projectos Econômicos',
      description: 'Gestão de projectos de desenvolvimento econômico do município',
      vagas: '1 vaga',
      prazo: '31 de Outubro 2024',
      requisitos: ['Licenciatura em Economia', 'Experiência mínima 5 anos'],
      beneficios: ['Salário competitivo', 'Benefícios completos', 'Formação contínua']
    },
    {
      id: '2',
      title: 'Analista Econômico',
      description: 'Análise de dados econômicos e elaboração de relatórios',
      vagas: '2 vagas',
      prazo: '15 de Novembro 2024',
      requisitos: ['Licenciatura em Economia ou Estatística', 'Conhecimentos de Excel'],
      beneficios: ['Remuneração atrativa', 'Horário flexível']
    }
  ]);

  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaEconomica[]>([
    {
      id: '1',
      nome: 'Centro de Negócios',
      localizacao: 'Centro da cidade',
      capacidade: '50 empresas',
      equipamentos: ['Salas de reunião', 'Internet fibra óptica', 'Secretariado'],
      estado: 'Excelente'
    },
    {
      id: '2',
      nome: 'Parque Industrial',
      localizacao: 'Zona Industrial',
      capacidade: '20 indústrias',
      equipamentos: ['Energia trifásica', 'Água industrial', 'Acessos rodoviários'],
      estado: 'Bom'
    }
  ]);

  const [contacto, setContacto] = useState<ContactoEconomico>({
    endereco: 'Rua do Desenvolvimento, Chipindo',
    telefone: '+244 XXX XXX XXX',
    email: 'desenvolvimento@chipindo.gov.ao',
    responsavel: 'Eng. Maria Santos',
    horario: 'Segunda a Sexta: 08:00 - 16:00'
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Economic development data loaded (mock data)');
    } catch (error) {
      console.error('Error loading economic development data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    economicoInfo,
    estatisticas,
    setores,
    programas,
    oportunidades,
    infraestruturas,
    contacto,
    loading,
    refetch: fetchData
  };
}