import { useState, useEffect } from 'react';

export interface CulturaInfo {
  title: string;
  subtitle: string;
  description: string;
  vision: string;
  mission: string;
}

export interface EstatisticaCultura {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface AreaCultural {
  id: string;
  nome: string;
  grupos: string;
  eventos: string;
  participantes: string;
  estado: string;
}

export interface EventoCultural {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  local: string;
  estado: string;
}

export interface ProgramaCultural {
  id: string;
  title: string;
  description: string;
  requisitos: string[];
  beneficios: string[];
  contact: string;
}

export interface OportunidadeCultural {
  id: string;
  title: string;
  description: string;
  vagas: string;
  prazo: string;
  requisitos: string[];
  beneficios: string[];
}

export interface InfraestruturaCultural {
  id: string;
  nome: string;
  localizacao: string;
  capacidade: string;
  equipamentos: string[];
  estado: string;
}

export interface ContactoCultura {
  endereco: string;
  telefone: string;
  email: string;
  responsavel: string;
  horario: string;
}

export function useCulturaData() {
  const [culturaInfo, setCulturaInfo] = useState<CulturaInfo>({
    title: "Setor Cultural de Chipindo",
    subtitle: "Preservando e promovendo a riqueza cultural do nosso município",
    description: "O Setor Cultural de Chipindo dedica-se à preservação e promoção das tradições culturais locais, organizando eventos, apoiando grupos culturais e desenvolvendo infraestruturas que fortalecem a identidade cultural da região.",
    vision: "Ser referência na preservação e promoção da cultura angolana, valorizando as tradições locais e promovendo a criatividade artística da comunidade de Chipindo.",
    mission: "Preservar, promover e desenvolver a cultura local através de programas educativos, eventos culturais e apoio aos artistas e grupos culturais da região."
  });

  const [estatisticas, setEstatisticas] = useState<EstatisticaCultura[]>([
    {
      id: '1',
      label: 'Grupos Culturais',
      value: '25',
      icon: 'Users'
    },
    {
      id: '2',
      label: 'Eventos Anuais',
      value: '48',
      icon: 'Calendar'
    },
    {
      id: '3',
      label: 'Artistas Registados',
      value: '156',
      icon: 'Palette'
    },
    {
      id: '4',
      label: 'Participações Mensais',
      value: '1,200',
      icon: 'TrendingUp'
    }
  ]);

  const [areas, setAreas] = useState<AreaCultural[]>([
    {
      id: '1',
      nome: 'Música Tradicional',
      grupos: '8 grupos ativos',
      eventos: '15 apresentações/ano',
      participantes: '120 músicos',
      estado: 'Ativo'
    },
    {
      id: '2',
      nome: 'Dança Tradicional',
      grupos: '6 grupos ativos',
      eventos: '12 apresentações/ano',
      participantes: '85 dançarinos',
      estado: 'Ativo'
    },
    {
      id: '3',
      nome: 'Artes Visuais',
      grupos: '4 grupos ativos',
      eventos: '8 exposições/ano',
      participantes: '45 artistas',
      estado: 'Ativo'
    },
    {
      id: '4',
      nome: 'Literatura',
      grupos: '3 grupos ativos',
      eventos: '6 eventos/ano',
      participantes: '32 escritores',
      estado: 'Ativo'
    }
  ]);

  const [eventos, setEventos] = useState<EventoCultural[]>([
    {
      id: '1',
      nome: 'Festival de Música Tradicional',
      tipo: 'Festival',
      data: 'Setembro 2024',
      local: 'Centro Cultural Municipal',
      estado: 'Confirmado'
    },
    {
      id: '2',
      nome: 'Exposição de Artes Locais',
      tipo: 'Exposição',
      data: 'Outubro 2024',
      local: 'Galeria Municipal',
      estado: 'Planejado'
    },
    {
      id: '3',
      nome: 'Encontro de Dança Tradicional',
      tipo: 'Encontro',
      data: 'Novembro 2024',
      local: 'Teatro Municipal',
      estado: 'Planejado'
    },
    {
      id: '4',
      nome: 'Feira do Livro Local',
      tipo: 'Feira',
      data: 'Dezembro 2024',
      local: 'Praça Central',
      estado: 'Planejado'
    }
  ]);

  const [programas, setProgramas] = useState<ProgramaCultural[]>([
    {
      id: '1',
      title: 'Formação Artística Juvenil',
      description: 'Programa de formação em artes para jovens entre 14-25 anos',
      requisitos: ['Idade entre 14-25 anos', 'Residir no município', 'Interesse nas artes'],
      beneficios: ['Formação gratuita', 'Certificado', 'Oportunidades de apresentação'],
      contact: 'cultura@chipindo.gov.ao'
    },
    {
      id: '2',
      title: 'Preservação Cultural',
      description: 'Programa de documentação e preservação das tradições locais',
      requisitos: ['Conhecimento das tradições', 'Disponibilidade', 'Compromisso'],
      beneficios: ['Valorização cultural', 'Reconhecimento', 'Documentação histórica'],
      contact: 'preservacao@chipindo.gov.ao'
    }
  ]);

  const [oportunidades, setOportunidades] = useState<OportunidadeCultural[]>([
    {
      id: '1',
      title: 'Coordenador Cultural',
      description: 'Coordenação de atividades culturais do município',
      vagas: '1 vaga',
      prazo: '30 de Setembro 2024',
      requisitos: ['Licenciatura em área cultural', 'Experiência mínima 3 anos'],
      beneficios: ['Salário competitivo', 'Benefícios sociais', 'Formação contínua']
    },
    {
      id: '2',
      title: 'Instrutor de Artes',
      description: 'Ensino de técnicas artísticas tradicionais',
      vagas: '2 vagas',
      prazo: '15 de Outubro 2024',
      requisitos: ['Formação em artes', 'Experiência em ensino'],
      beneficios: ['Remuneração por hora', 'Flexibilidade de horários']
    }
  ]);

  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaCultural[]>([
    {
      id: '1',
      nome: 'Centro Cultural Municipal',
      localizacao: 'Centro da cidade',
      capacidade: '200 pessoas',
      equipamentos: ['Sistema de som', 'Iluminação profissional', 'Palco'],
      estado: 'Excelente'
    },
    {
      id: '2',
      nome: 'Teatro Municipal',
      localizacao: 'Rua Principal',
      capacidade: '150 pessoas',
      equipamentos: ['Sistema audiovisual', 'Camarins', 'Cortinas'],
      estado: 'Bom'
    },
    {
      id: '3',
      nome: 'Casa da Cultura',
      localizacao: 'Bairro Cultural',
      capacidade: '80 pessoas',
      equipamentos: ['Instrumentos musicais', 'Material de artes', 'Biblioteca'],
      estado: 'Bom'
    }
  ]);

  const [contacto, setContacto] = useState<ContactoCultura>({
    endereco: 'Rua da Cultura, Chipindo',
    telefone: '+244 XXX XXX XXX',
    email: 'cultura@chipindo.gov.ao',
    responsavel: 'Dr. António Silva',
    horario: 'Segunda a Sexta: 08:00 - 16:00'
  });

  const [loading, setLoading] = useState(false);

  // Mock fetch function since the tables don't exist
  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Data is already set in state as mock data
      console.log('Cultura data loaded (mock data)');
    } catch (error) {
      console.error('Error loading cultura data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    culturaInfo,
    estatisticas,
    areas,
    eventos,
    programas,
    oportunidades,
    infraestruturas,
    contacto,
    loading,
    refetch: fetchData
  };
}