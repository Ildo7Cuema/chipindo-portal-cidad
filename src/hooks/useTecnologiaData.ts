// Mock implementation for technology data
import { useState, useEffect } from 'react';

export interface TecnologiaInfo {
  title: string;
  subtitle: string;
  description: string;
  vision: string;
  mission: string;
}

export interface EstatisticaTecnologia {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface AreaTecnologica {
  id: string;
  nome: string;
  empresas: string;
  profissionais: string;
  projectos: string;
  estado: string;
}

export interface ServicoDigital {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  usuarios: string;
  disponibilidade: string;
}

export interface ProgramaTecnologia {
  id: string;
  title: string;
  description: string;
  requisitos: string[];
  beneficios: string[];
  contact: string;
}

export interface OportunidadeTecnologia {
  id: string;
  title: string;
  description: string;
  vagas: string;
  prazo: string;
  requisitos: string[];
  beneficios: string[];
}

export interface InfraestruturaTecnologia {
  id: string;
  nome: string;
  localizacao: string;
  capacidade: string;
  equipamentos: string[];
  estado: string;
}

export interface ContactoTecnologia {
  endereco: string;
  telefone: string;
  email: string;
  responsavel: string;
  horario: string;
}

export function useTecnologiaData() {
  const [tecnologiaInfo, setTecnologiaInfo] = useState<TecnologiaInfo>({
    title: "Tecnologia e Inovação",
    subtitle: "Impulsionando a transformação digital do município",
    description: "O setor de tecnologia promove a inovação e digitalização dos serviços municipais, apoiando startups e desenvolvendo soluções tecnológicas.",
    vision: "Ser referência em inovação tecnológica municipal, criando um ecossistema digital inclusivo e sustentável.",
    mission: "Promover a inovação tecnológica, digitalizar serviços e apoiar o desenvolvimento do setor tech local."
  });

  const [estatisticas, setEstatisticas] = useState<EstatisticaTecnologia[]>([
    {
      id: '1',
      label: 'Startups Tech',
      value: '15',
      icon: 'Cpu'
    },
    {
      id: '2',
      label: 'Profissionais IT',
      value: '89',
      icon: 'Users'
    },
    {
      id: '3',
      label: 'Projectos Digitais',
      value: '32',
      icon: 'Code'
    },
    {
      id: '4',
      label: 'Serviços Online',
      value: '12',
      icon: 'Globe'
    }
  ]);

  const [areas, setAreas] = useState<AreaTecnologica[]>([
    {
      id: '1',
      nome: 'Desenvolvimento de Software',
      empresas: '8 empresas',
      profissionais: '35 desenvolvedores',
      projectos: '15 projectos ativos',
      estado: 'Crescimento'
    },
    {
      id: '2',
      nome: 'Infraestrutura Digital',
      empresas: '3 empresas',
      profissionais: '20 técnicos',
      projectos: '8 projectos',
      estado: 'Expansão'
    },
    {
      id: '3',
      nome: 'E-commerce',
      empresas: '2 empresas',
      profissionais: '15 especialistas',
      projectos: '5 projectos',
      estado: 'Crescimento'
    },
    {
      id: '4',
      nome: 'Consultoria IT',
      empresas: '2 empresas',
      profissionais: '19 consultores',
      projectos: '4 projectos',
      estado: 'Estável'
    }
  ]);

  const [servicosDigitais, setServicosDigitais] = useState<ServicoDigital[]>([
    {
      id: '1',
      nome: 'Portal do Cidadão',
      descricao: 'Plataforma online para serviços municipais',
      status: 'Ativo',
      usuarios: '1,200',
      disponibilidade: '99.5%'
    },
    {
      id: '2',
      nome: 'App Municipal',
      descricao: 'Aplicação móvel para serviços do município',
      status: 'Em desenvolvimento',
      usuarios: '0',
      disponibilidade: 'N/A'
    },
    {
      id: '3',
      nome: 'Sistema de Gestão',
      descricao: 'Sistema interno de gestão municipal',
      status: 'Ativo',
      usuarios: '150',
      disponibilidade: '98.8%'
    },
    {
      id: '4',
      nome: 'Centro de Contacto',
      descricao: 'Sistema de atendimento ao cidadão',
      status: 'Ativo',
      usuarios: '800',
      disponibilidade: '99.2%'
    }
  ]);

  const [programas, setProgramas] = useState<ProgramaTecnologia[]>([
    {
      id: '1',
      title: 'Formação em Tecnologia',
      description: 'Programa de capacitação em tecnologias digitais',
      requisitos: ['Idade mínima 16 anos', 'Ensino médio completo', 'Interesse em tecnologia'],
      beneficios: ['Formação gratuita', 'Certificação', 'Oportunidades de emprego'],
      contact: 'formacao.tech@chipindo.gov.ao'
    },
    {
      id: '2',
      title: 'Incubação de Startups',
      description: 'Programa de apoio a startups tecnológicas',
      requisitos: ['Ideia inovadora', 'Equipe definida', 'Plano de negócios'],
      beneficios: ['Espaço físico', 'Mentoria', 'Acesso a investidores'],
      contact: 'incubadora@chipindo.gov.ao'
    }
  ]);

  const [oportunidades, setOportunidades] = useState<OportunidadeTecnologia[]>([
    {
      id: '1',
      title: 'Desenvolvedor Full Stack',
      description: 'Desenvolvimento de sistemas municipais',
      vagas: '2 vagas',
      prazo: '30 de Novembro 2024',
      requisitos: ['Licenciatura em Informática', 'Experiência em React/Node.js'],
      beneficios: ['Salário competitivo', 'Trabalho remoto parcial', 'Formação contínua']
    },
    {
      id: '2',
      title: 'Analista de Dados',
      description: 'Análise de dados municipais e relatórios',
      vagas: '1 vaga',
      prazo: '15 de Dezembro 2024',
      requisitos: ['Formação em Estatística ou TI', 'Conhecimento em Python/R'],
      beneficios: ['Remuneração atrativa', 'Flexibilidade de horários']
    }
  ]);

  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaTecnologia[]>([
    {
      id: '1',
      nome: 'Centro de Inovação Tecnológica',
      localizacao: 'Zona Tecnológica',
      capacidade: '30 startups',
      equipamentos: ['Internet 1Gb', 'Salas de desenvolvimento', 'Laboratório'],
      estado: 'Excelente'
    },
    {
      id: '2',
      nome: 'Centro de Formação IT',
      localizacao: 'Centro da cidade',
      capacidade: '100 formandos',
      equipamentos: ['Computadores', 'Projectores', 'Software licenciado'],
      estado: 'Muito bom'
    },
    {
      id: '3',
      nome: 'Data Center Municipal',
      localizacao: 'Zona Industrial',
      capacidade: '500 servidores',
      equipamentos: ['Servidores', 'Sistema UPS', 'Refrigeração'],
      estado: 'Excelente'
    }
  ]);

  const [contacto, setContacto] = useState<ContactoTecnologia>({
    endereco: 'Rua da Tecnologia, Chipindo',
    telefone: '+244 XXX XXX XXX',
    email: 'tecnologia@chipindo.gov.ao',
    responsavel: 'Eng. João Silva',
    horario: 'Segunda a Sexta: 08:00 - 16:00'
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Technology data loaded (mock data)');
    } catch (error) {
      console.error('Error loading technology data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    tecnologiaInfo,
    estatisticas,
    areas,
    servicosDigitais,
    programas,
    oportunidades,
    infraestruturas,
    contacto,
    loading,
    refetch: fetchData
  };
}