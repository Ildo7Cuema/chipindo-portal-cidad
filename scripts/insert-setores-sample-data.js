import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados fictícios por sector
const dadosSetores = {
  educacao: {
    estatisticas: [
      { nome: "Escolas Primárias", valor: "12 escolas", icone: "School", ordem: 1 },
      { nome: "Professores", valor: "156 professores", icone: "Users", ordem: 2 },
      { nome: "Estudantes", valor: "2.847 estudantes", icone: "BookOpen", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Bolsas de Estudo",
        descricao: "Programa que oferece bolsas de estudo para estudantes de baixa renda.",
        beneficios: ["Mensalidade gratuita", "Material escolar incluído"],
        requisitos: ["Renda familiar baixa", "Bom desempenho escolar"],
        contacto: "bolsas@educacao-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Professor de Matemática",
        descricao: "Procuramos professor qualificado para lecionar matemática.",
        requisitos: ["Licenciatura em Matemática", "Experiência mínima de 3 anos"],
        beneficios: ["Salário competitivo", "Plano de saúde"],
        prazo: "2024-12-31",
        vagas: 2,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Escola Primária Central",
        localizacao: "Rua Principal, nº 123, Centro",
        capacidade: "500 estudantes",
        estado: "Funcionando",
        equipamentos: ["Computadores", "Projetores", "Biblioteca"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Rua da Educação, nº 789, Centro",
        telefone: "+244 123 456 789",
        email: "educacao@chipindo.ao",
        horario: "Segunda a Sexta, 8h às 17h",
        responsavel: "Dr. Maria Silva"
      }
    ]
  },
  saude: {
    estatisticas: [
      { nome: "Unidades de Saúde", valor: "8 unidades", icone: "Heart", ordem: 1 },
      { nome: "Médicos", valor: "24 médicos", icone: "Stethoscope", ordem: 2 },
      { nome: "Atendimentos Mensais", valor: "3.200 atendimentos", icone: "Activity", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Saúde da Família",
        descricao: "Programa que oferece atendimento médico preventivo e curativo.",
        beneficios: ["Atendimento gratuito", "Visitas domiciliares"],
        requisitos: ["Residir na área de cobertura"],
        contacto: "saudefamilia@saude-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Médico Clínico Geral",
        descricao: "Procuramos médico para atendimento em unidade básica de saúde.",
        requisitos: ["Medicina com registro no conselho"],
        beneficios: ["Salário competitivo", "Plano de saúde"],
        prazo: "2024-12-20",
        vagas: 3,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Centro de Saúde Municipal",
        localizacao: "Avenida da Saúde, nº 100",
        capacidade: "500 atendimentos/dia",
        estado: "Funcionando",
        equipamentos: ["Consultórios", "Sala de Emergência", "Farmácia"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Avenida da Saúde, nº 100, Centro",
        telefone: "+244 987 654 321",
        email: "saude@chipindo.ao",
        horario: "Segunda a Domingo, 24h",
        responsavel: "Dr. João Santos"
      }
    ]
  },
  agricultura: {
    estatisticas: [
      { nome: "Agricultores Registrados", valor: "1.250 agricultores", icone: "Users", ordem: 1 },
      { nome: "Área Cultivada", valor: "15.000 hectares", icone: "Map", ordem: 2 },
      { nome: "Produção Anual", valor: "45.000 toneladas", icone: "TrendingUp", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Apoio ao Pequeno Agricultor",
        descricao: "Programa que oferece apoio técnico, financiamento e insumos para pequenos agricultores.",
        beneficios: ["Apoio técnico gratuito", "Financiamento facilitado", "Insumos subsidiados"],
        requisitos: ["Ser pequeno agricultor", "Ter área de cultivo"],
        contacto: "apoioagricultor@agricultura-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Técnico Agrícola",
        descricao: "Procuramos técnico para prestar assistência técnica aos agricultores.",
        requisitos: ["Técnico em Agricultura", "Experiência em campo"],
        beneficios: ["Salário competitivo", "Vale transporte"],
        prazo: "2024-12-25",
        vagas: 4,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Centro de Apoio ao Agricultor",
        localizacao: "Zona Rural, Km 8",
        capacidade: "200 atendimentos/dia",
        estado: "Funcionando",
        equipamentos: ["Sala de Reuniões", "Laboratório de Análise de Solo", "Depósito de Insumos"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Rua da Agricultura, nº 200, Centro",
        telefone: "+244 555 123 456",
        email: "agricultura@chipindo.ao",
        horario: "Segunda a Sexta, 7h às 18h",
        responsavel: "Eng. Pedro Costa"
      }
    ]
  },
  "sector-mineiro": {
    estatisticas: [
      { nome: "Minas Ativas", valor: "8 minas", icone: "Mountain", ordem: 1 },
      { nome: "Empregos Diretos", valor: "1.200 empregos", icone: "Briefcase", ordem: 2 },
      { nome: "Produção Anual", valor: "85.000 toneladas", icone: "TrendingUp", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Capacitação Mineira",
        descricao: "Programa que oferece formação técnica para trabalhadores do setor mineiro.",
        beneficios: ["Formação técnica gratuita", "Certificação reconhecida", "Oportunidades de emprego"],
        requisitos: ["Idade mínima 18 anos", "Ensino médio completo"],
        contacto: "capacitacao@minas-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Técnico de Mineração",
        descricao: "Procuramos técnico para operação e manutenção de equipamentos mineiros.",
        requisitos: ["Técnico em Mineração", "Experiência em campo"],
        beneficios: ["Salário competitivo", "Equipamentos de segurança"],
        prazo: "2024-12-30",
        vagas: 6,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Centro de Treinamento Mineiro",
        localizacao: "Zona Industrial, Km 12",
        capacidade: "100 alunos por turma",
        estado: "Funcionando",
        equipamentos: ["Sala de Aula", "Laboratório de Simulação", "Equipamentos de Segurança"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Avenida da Mineração, nº 300, Zona Industrial",
        telefone: "+244 777 888 999",
        email: "minas@chipindo.ao",
        horario: "Segunda a Sexta, 6h às 18h",
        responsavel: "Eng. Carlos Silva"
      }
    ]
  },
  "desenvolvimento-economico": {
    estatisticas: [
      { nome: "Empresas Registradas", valor: "450 empresas", icone: "Building", ordem: 1 },
      { nome: "Empregos Criados", valor: "3.200 empregos", icone: "Users", ordem: 2 },
      { nome: "PIB Municipal", valor: "USD 45 milhões", icone: "DollarSign", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Apoio ao Empreendedor",
        descricao: "Programa que oferece apoio financeiro e técnico para novos empreendedores.",
        beneficios: ["Financiamento facilitado", "Mentoria empresarial", "Acesso a mercados"],
        requisitos: ["Plano de negócio viável", "Idade mínima 18 anos"],
        contacto: "empreendedor@economia-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Analista Econômico",
        descricao: "Procuramos analista para estudos econômicos e planejamento estratégico.",
        requisitos: ["Economia ou área afim", "Experiência em análise"],
        beneficios: ["Salário competitivo", "Plano de carreira"],
        prazo: "2024-12-28",
        vagas: 2,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Centro de Negócios",
        localizacao: "Centro Empresarial, Torre A",
        capacidade: "50 empresas",
        estado: "Funcionando",
        equipamentos: ["Escritórios", "Sala de Reuniões", "Auditório"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Centro Empresarial, Torre A, 5º andar",
        telefone: "+244 999 111 222",
        email: "economia@chipindo.ao",
        horario: "Segunda a Sexta, 8h às 18h",
        responsavel: "Dr. Ana Oliveira"
      }
    ]
  },
  cultura: {
    estatisticas: [
      { nome: "Centros Culturais", valor: "5 centros", icone: "Palette", ordem: 1 },
      { nome: "Artistas Registrados", valor: "180 artistas", icone: "Music", ordem: 2 },
      { nome: "Eventos Anuais", valor: "45 eventos", icone: "Calendar", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Fomento às Artes",
        descricao: "Programa que apoia artistas locais com recursos e espaços para exposição.",
        beneficios: ["Recursos financeiros", "Espaços de exposição", "Divulgação"],
        requisitos: ["Ser artista local", "Projeto cultural viável"],
        contacto: "artes@cultura-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Coordenador Cultural",
        descricao: "Procuramos coordenador para organizar eventos e atividades culturais.",
        requisitos: ["Formação em Artes ou Cultura", "Experiência em eventos"],
        beneficios: ["Salário competitivo", "Ambiente criativo"],
        prazo: "2024-12-22",
        vagas: 2,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Centro Cultural Municipal",
        localizacao: "Praça da Cultura, nº 50",
        capacidade: "500 pessoas",
        estado: "Funcionando",
        equipamentos: ["Auditório", "Galeria de Arte", "Sala de Ensaios"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Praça da Cultura, nº 50, Centro",
        telefone: "+244 333 444 555",
        email: "cultura@chipindo.ao",
        horario: "Terça a Domingo, 9h às 18h",
        responsavel: "Prof. Manuel Santos"
      }
    ]
  },
  tecnologia: {
    estatisticas: [
      { nome: "Startups", valor: "25 startups", icone: "Zap", ordem: 1 },
      { nome: "Profissionais de TI", valor: "120 profissionais", icone: "Code", ordem: 2 },
      { nome: "Projetos Desenvolvidos", valor: "85 projetos", icone: "Folder", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Aceleração de Startups",
        descricao: "Programa que acelera startups de tecnologia com mentoria e recursos.",
        beneficios: ["Mentoria especializada", "Recursos financeiros", "Networking"],
        requisitos: ["Startup de tecnologia", "Produto mínimo viável"],
        contacto: "startups@tecnologia-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Desenvolvedor Full Stack",
        descricao: "Procuramos desenvolvedor para criar aplicações web e mobile.",
        requisitos: ["Experiência em React/Node.js", "Conhecimento de banco de dados"],
        beneficios: ["Salário competitivo", "Trabalho remoto"],
        prazo: "2024-12-18",
        vagas: 4,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Centro de Inovação Tecnológica",
        localizacao: "Parque Tecnológico, Bloco A",
        capacidade: "30 empresas",
        estado: "Funcionando",
        equipamentos: ["Escritórios", "Laboratórios", "Sala de Reuniões"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Parque Tecnológico, Bloco A, 3º andar",
        telefone: "+244 666 777 888",
        email: "tecnologia@chipindo.ao",
        horario: "Segunda a Sexta, 8h às 20h",
        responsavel: "Eng. Sofia Costa"
      }
    ]
  },
  "energia-agua": {
    estatisticas: [
      { nome: "Usinas de Energia", valor: "3 usinas", icone: "Zap", ordem: 1 },
      { nome: "Capacidade Instalada", valor: "45 MW", icone: "Battery", ordem: 2 },
      { nome: "Cobertura Elétrica", valor: "95% da população", icone: "Home", ordem: 3 }
    ],
    programas: [
      {
        titulo: "Programa de Energia Renovável",
        descricao: "Programa que promove o uso de energias renováveis e eficiência energética.",
        beneficios: ["Instalação de painéis solares", "Redução na conta de luz", "Sustentabilidade"],
        requisitos: ["Residência própria", "Área adequada"],
        contacto: "renovavel@energia-chipindo.ao",
        ativo: true,
        ordem: 1
      }
    ],
    oportunidades: [
      {
        titulo: "Vaga para Técnico de Energia",
        descricao: "Procuramos técnico para manutenção de sistemas de energia.",
        requisitos: ["Técnico em Eletrotécnica", "Experiência em manutenção"],
        beneficios: ["Salário competitivo", "Equipamentos de segurança"],
        prazo: "2024-12-24",
        vagas: 5,
        ativo: true,
        ordem: 1
      }
    ],
    infraestruturas: [
      {
        nome: "Usina Hidrelétrica Municipal",
        localizacao: "Rio Principal, Km 25",
        capacidade: "25 MW",
        estado: "Funcionando",
        equipamentos: ["Turbinas", "Geradores", "Sistema de Controle"],
        ativo: true,
        ordem: 1
      }
    ],
    contactos: [
      {
        endereco: "Avenida da Energia, nº 400, Zona Industrial",
        telefone: "+244 444 555 666",
        email: "energia@chipindo.ao",
        horario: "Segunda a Domingo, 24h",
        responsavel: "Eng. Roberto Lima"
      }
    ]
  }
};

async function insertSampleData() {
  console.log('🚀 Iniciando inserção de dados fictícios...\n');

  try {
    // Buscar sectores existentes
    const { data: setores, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('id, nome, slug');

    if (setoresError) {
      console.error('❌ Erro ao buscar sectores:', setoresError);
      return;
    }

    console.log(`📋 Encontrados ${setores.length} sectores`);

    // Inserir dados para cada sector
    for (const setor of setores) {
      const dadosSector = dadosSetores[setor.slug];
      
      if (!dadosSector) {
        console.log(`⚠️  Não há dados para: ${setor.nome}`);
        continue;
      }

      console.log(`\n📊 Inserindo dados para: ${setor.nome}`);

      // Inserir estatísticas
      if (dadosSector.estatisticas) {
        const estatisticasData = dadosSector.estatisticas.map(stat => ({
          setor_id: setor.id,
          ...stat
        }));

        const { error: estatisticasError } = await supabase
          .from('setores_estatisticas')
          .insert(estatisticasData);

        if (estatisticasError) {
          console.error(`   ❌ Erro estatísticas:`, estatisticasError);
        } else {
          console.log(`   ✅ ${dadosSector.estatisticas.length} estatísticas inseridas`);
        }
      }

      // Inserir programas
      if (dadosSector.programas) {
        const programasData = dadosSector.programas.map(prog => ({
          setor_id: setor.id,
          ...prog
        }));

        const { error: programasError } = await supabase
          .from('setores_programas')
          .insert(programasData);

        if (programasError) {
          console.error(`   ❌ Erro programas:`, programasError);
        } else {
          console.log(`   ✅ ${dadosSector.programas.length} programas inseridos`);
        }
      }

      // Inserir oportunidades
      if (dadosSector.oportunidades) {
        const oportunidadesData = dadosSector.oportunidades.map(opp => ({
          setor_id: setor.id,
          ...opp
        }));

        const { error: oportunidadesError } = await supabase
          .from('setores_oportunidades')
          .insert(oportunidadesData);

        if (oportunidadesError) {
          console.error(`   ❌ Erro oportunidades:`, oportunidadesError);
        } else {
          console.log(`   ✅ ${dadosSector.oportunidades.length} oportunidades inseridas`);
        }
      }

      // Inserir infraestruturas
      if (dadosSector.infraestruturas) {
        const infraestruturasData = dadosSector.infraestruturas.map(infra => ({
          setor_id: setor.id,
          ...infra
        }));

        const { error: infraestruturasError } = await supabase
          .from('setores_infraestruturas')
          .insert(infraestruturasData);

        if (infraestruturasError) {
          console.error(`   ❌ Erro infraestruturas:`, infraestruturasError);
        } else {
          console.log(`   ✅ ${dadosSector.infraestruturas.length} infraestruturas inseridas`);
        }
      }

      // Inserir contactos
      if (dadosSector.contactos) {
        const contactosData = dadosSector.contactos.map(cont => ({
          setor_id: setor.id,
          ...cont
        }));

        const { error: contactosError } = await supabase
          .from('setores_contactos')
          .insert(contactosData);

        if (contactosError) {
          console.error(`   ❌ Erro contactos:`, contactosError);
        } else {
          console.log(`   ✅ ${dadosSector.contactos.length} contactos inseridos`);
        }
      }
    }

    console.log('\n🎉 Inserção concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Acesse a área administrativa');
    console.log('   2. Navegue para "Gestão de Sectores Estratégicos"');
    console.log('   3. Teste as funcionalidades de gestão');
    console.log('   4. Edite os dados conforme necessário');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

insertSampleData(); 