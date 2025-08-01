import { supabase } from "@/integrations/supabase/client";

export const seedSampleConcursos = async (): Promise<boolean> => {
  try {
    const sampleConcursos = [
      {
        title: 'Concurso Público para Professor de Educação Primária',
        description: 'Abertura de concurso público para preenchimento de 15 vagas de Professor de Educação Primária nas escolas municipais de Chipindo. O concurso visa selecionar profissionais qualificados para o ensino fundamental nas comunidades rurais e urbanas do município.',
        requirements: 'Formação em Magistério ou Licenciatura em Ciências da Educação. Experiência mínima de 2 anos no ensino primário. Domínio das línguas portuguesa e umbundu (preferencial). Conhecimentos básicos de informática.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        contact_info: 'Telefone: +244 261 234 567 | Email: educacao@chipindo.gov.ao | Endereço: Departamento de Educação - Administração Municipal de Chipindo',
        published: true
      },
      {
        title: 'Recrutamento para Técnico de Saúde Especializado',
        description: 'Processo de recrutamento para técnicos de saúde especializados em cuidados primários para o Hospital Municipal de Chipindo e postos de saúde das comunas.',
        requirements: 'Formação técnica em Enfermagem ou Medicina. Certificado profissional válido emitido pelo Ministério da Saúde. Disponibilidade para trabalho em turnos e deslocações. Experiência em saúde comunitária.',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias
        contact_info: 'Centro de Saúde Municipal - Telefone: +244 261 987 654 | Email: saude@chipindo.gov.ao',
        published: true
      },
      {
        title: 'Concurso para Engenheiro Civil Sénior',
        description: 'Abertura de vagas para Engenheiro Civil sénior para supervisão de obras de infraestrutura municipal, incluindo estradas, pontes, edifícios públicos e sistemas de abastecimento de água.',
        requirements: 'Licenciatura em Engenharia Civil. Registro na Ordem dos Engenheiros de Angola. Experiência mínima de 5 anos em obras públicas. Conhecimento em softwares de projecto (AutoCAD, Civil 3D). Carta de condução categoria B.',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 dias
        contact_info: 'Departamento de Obras Públicas - Email: obras@chipindo.gov.ao | Telefone: +244 261 456 789',
        published: true
      },
      {
        title: 'Técnico Administrativo - Múltiplos Departamentos',
        description: 'Recrutamento de técnicos administrativos para diversos departamentos da administração municipal, incluindo atendimento ao público, gestão de documentos e apoio administrativo geral.',
        requirements: 'Ensino médio completo. Conhecimentos avançados de informática (Microsoft Office, sistemas de gestão). Experiência mínima de 1 ano em atendimento ao público. Boa comunicação oral e escrita.',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 dias
        contact_info: 'Recursos Humanos - Telefone: +244 261 555 123 | Email: rh@chipindo.gov.ao',
        published: false
      },
      {
        title: 'Agente de Segurança Municipal',
        description: 'Contratação de agentes de segurança para patrulhamento e proteção dos edifícios públicos municipais, mercados, escolas e outras instalações governamentais.',
        requirements: 'Ensino médio completo. Curso de formação em segurança reconhecido. Aptidão física comprovada por exame médico. Antecedentes criminais limpos. Disponibilidade para trabalho nocturno.',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias
        contact_info: 'Departamento de Segurança Municipal - Telefone: +244 261 777 888 | Email: seguranca@chipindo.gov.ao',
        published: true
      },
      {
        title: 'Contador Público Municipal',
        description: 'Vaga para contador responsável pela gestão financeira e contabilística do município, elaboração de relatórios fiscais e acompanhamento orçamental.',
        requirements: 'Licenciatura em Contabilidade ou Gestão Financeira. Registro na Ordem dos Contabilistas de Angola. Experiência mínima de 3 anos em contabilidade pública. Conhecimento da legislação fiscal angolana.',
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 dias
        contact_info: 'Departamento Financeiro - Email: financas@chipindo.gov.ao | Telefone: +244 261 333 444',
        published: true
      },
      {
        title: 'Veterinário Municipal',
        description: 'Concurso para veterinário responsável pela saúde animal no município, vacinação, controle de zoonoses e apoio à pecuária local.',
        requirements: 'Licenciatura em Medicina Veterinária. Registro no Conselho da Ordem dos Veterinários. Experiência em saúde animal e zoonoses. Disponibilidade para deslocações nas comunas rurais.',
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 dias
        contact_info: 'Departamento de Agricultura e Pecuária - Telefone: +244 261 888 999',
        published: false
      },
      {
        title: 'Assistente Social',
        description: 'Recrutamento de assistente social para programas de apoio às famílias vulneráveis, crianças em situação de risco e idosos do município.',
        requirements: 'Licenciatura em Serviço Social ou Psicologia Social. Experiência em trabalho comunitário. Sensibilidade para questões sociais. Disponibilidade para visitas domiciliares.',
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 dias
        contact_info: 'Departamento de Ação Social - Email: accaosocial@chipindo.gov.ao',
        published: true
      },
      {
        title: 'Técnico em Informática',
        description: 'Vaga para técnico responsável pela manutenção dos sistemas informáticos da administração municipal, suporte técnico e gestão da rede.',
        requirements: 'Formação técnica em Informática ou Engenharia Informática. Experiência em manutenção de computadores e redes. Conhecimento em sistemas Windows e Linux. Capacidade de resolução de problemas.',
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 dias
        contact_info: 'Departamento de Tecnologias de Informação - Telefone: +244 261 111 222',
        published: true
      }
    ];

    // Verificar se já existem concursos para evitar duplicação
    const { data: existingConcursos } = await supabase
      .from('concursos')
      .select('title')
      .limit(1);

    if (existingConcursos && existingConcursos.length > 0) {
      console.log('Concursos já existem na base de dados');
      return true;
    }

    // Inserir os concursos de exemplo
    const { error } = await supabase
      .from('concursos')
      .insert(sampleConcursos);

    if (error) {
      console.error('Erro ao inserir concursos de exemplo:', error);
      return false;
    }

    console.log('Concursos de exemplo criados com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar concursos de exemplo:', error);
    return false;
  }
}; 