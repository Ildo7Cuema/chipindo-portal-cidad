-- Insert initial data for Cultura sector
INSERT INTO cultura_info (title, subtitle, description, vision, mission) VALUES (
  'Setor de Cultura',
  'Preservando e promovendo a rica herança cultural de Chipindo',
  'O setor de cultura de Chipindo está comprometido em preservar, promover e desenvolver as expressões culturais locais, criando espaços de valorização da identidade cultural.',
  'Ser referência em preservação e promoção cultural, valorizando a identidade local.',
  'Preservar e promover a diversidade cultural, criando oportunidades de expressão e desenvolvimento artístico.'
);

INSERT INTO cultura_estatisticas (label, value, icon, ordem) VALUES
  ('Grupos Culturais', '25', 'UsersIcon', 1),
  ('Eventos Anuais', '48', 'CalendarIcon', 2),
  ('Artistas Registados', '156', 'PaletteIcon', 3),
  ('Espaços Culturais', '8', 'BuildingIcon', 4),
  ('Festivais', '6', 'MusicIcon', 5),
  ('Projetos Culturais', '18', 'HeartHandshakeIcon', 6);

INSERT INTO cultura_areas (nome, grupos, eventos, participantes, estado, ordem) VALUES
  ('Música Tradicional', '12', '15', '180', 'Ativo', 1),
  ('Dança Tradicional', '8', '12', '120', 'Ativo', 2),
  ('Artes Visuais', '5', '8', '45', 'Crescimento', 3),
  ('Literatura', '3', '6', '35', 'Desenvolvimento', 4);

INSERT INTO cultura_eventos (nome, data, local, tipo, estado, descricao, ordem) VALUES
  ('Festival de Música Tradicional', '15-17 Junho 2025', 'Centro Cultural Municipal', 'Festival', 'Inscrições Abertas', 'Um evento cultural de grande magnitude que celebra a diversidade cultural de Chipindo, com apresentações de música, dança e artes tradicionais.', 1),
  ('Exposição de Artes Visuais', '1-30 Julho 2025', 'Casa da Cultura', 'Exposição', 'Em Preparação', 'Uma mostra de trabalhos artísticos que destaca o talento local e promove a expressão criativa dos artistas da região.', 2),
  ('Encontro de Dança Tradicional', '20-22 Agosto 2025', 'Teatro Municipal', 'Encontro', 'Inscrições Abertas', 'Um espaço de partilha e aprendizagem onde grupos culturais se reúnem para trocar experiências e técnicas tradicionais.', 3),
  ('Feira do Livro', '10-15 Setembro 2025', 'Centro Cultural Municipal', 'Feira', 'Em Organização', 'Uma celebração da literatura e cultura, com apresentações de livros, debates e atividades culturais para todas as idades.', 4);

INSERT INTO cultura_programas (title, description, beneficios, requisitos, contact, ordem) VALUES
  ('Programa de Formação Artística', 'Formação em diversas áreas artísticas para jovens talentos', 
   ARRAY['Formação gratuita', 'Material fornecido', 'Mentoria de artistas', 'Apresentações públicas'],
   ARRAY['Idade 12-25 anos', 'Interesse em artes', 'Disponibilidade'],
   'Centro de Formação Artística', 1),
  ('Programa de Preservação Cultural', 'Iniciativas para preservar tradições e costumes locais',
   ARRAY['Documentação cultural', 'Apoio a grupos tradicionais', 'Festivais culturais', 'Publicações'],
   ARRAY['Conhecimento de tradições', 'Participação ativa', 'Compromisso'],
   'Departamento de Património Cultural', 2),
  ('Programa de Promoção Cultural', 'Apoio à divulgação e promoção de eventos culturais',
   ARRAY['Apoio logístico', 'Divulgação gratuita', 'Espaços para eventos', 'Recursos técnicos'],
   ARRAY['Evento cultural', 'Plano de execução', 'Impacto cultural'],
   'Gabinete de Promoção Cultural', 3);

INSERT INTO cultura_oportunidades (title, description, requisitos, beneficios, prazo, vagas, ordem) VALUES
  ('Coordenador Cultural', 'Vaga para coordenar projetos e eventos culturais',
   ARRAY['Licenciatura em Artes/Cultura', 'Experiência de 3 anos', 'Gestão de projetos culturais'],
   ARRAY['Salário competitivo', 'Plano de carreira', 'Formação contínua', 'Networking cultural'],
   '10 de Março de 2025', '2', 1),
  ('Instrutor de Artes', 'Vagas para instrutores de música, dança e artes visuais',
   ARRAY['Formação em artes', 'Experiência em ensino', 'Paciente e criativo'],
   ARRAY['Salário atrativo', 'Horário flexível', 'Formação pedagógica', 'Plano de saúde'],
   '15 de Março de 2025', '5', 2),
  ('Voluntário Cultural', 'Programa de voluntariado em eventos culturais',
   ARRAY['Maior de 16 anos', 'Interesse em cultura', 'Disponibilidade de 10h semanais'],
   ARRAY['Certificado de voluntariado', 'Experiência cultural', 'Acesso a eventos', 'Formação em gestão cultural'],
   'Aberto permanentemente', 'Ilimitadas', 3);

INSERT INTO cultura_infraestruturas (nome, localizacao, capacidade, equipamentos, estado, ordem) VALUES
  ('Centro Cultural Municipal', 'Centro da Cidade', '500 pessoas', 
   ARRAY['Auditório', 'Sala de Exposições', 'Estúdio de Gravação', 'Biblioteca'], 'Excelente', 1),
  ('Teatro Municipal', 'Bairro Central', '300 lugares',
   ARRAY['Palco Principal', 'Camarins', 'Sistema de Som', 'Iluminação'], 'Bom', 2),
  ('Casa da Cultura', 'Zona Histórica', '150 pessoas',
   ARRAY['Sala Multiusos', 'Galeria de Arte', 'Sala de Ensaios', 'Café Cultural'], 'Excelente', 3);

INSERT INTO cultura_contactos (endereco, telefone, email, horario, responsavel) VALUES (
  'Rua da Cultura, Centro Cultural, Chipindo',
  '+244 XXX XXX XXX',
  'cultura@chipindo.gov.ao',
  'Segunda a Sexta: 08:00 - 16:00',
  'Dr. Maria Santos - Diretora Municipal de Cultura'
);

-- Insert initial data for Tecnologia sector
INSERT INTO tecnologia_info (title, subtitle, description, vision, mission) VALUES (
  'Setor de Tecnologia',
  'Inovação e transformação digital para o futuro de Chipindo',
  'O setor de tecnologia de Chipindo está focado em promover a inovação digital, modernizar os serviços públicos e criar oportunidades na área tecnológica.',
  'Ser referência em inovação tecnológica e transformação digital municipal.',
  'Promover a adoção de tecnologias inovadoras e criar um ecossistema digital sustentável.'
);

INSERT INTO tecnologia_estatisticas (label, value, icon, ordem) VALUES
  ('Startups Tech', '15', 'BuildingIcon', 1),
  ('Profissionais IT', '89', 'UsersIcon', 2),
  ('Projetos Digitais', '32', 'CpuIcon', 3),
  ('Cobertura Internet', '85%', 'WifiIcon', 4),
  ('Serviços Online', '24', 'GlobeIcon', 5),
  ('Investimento Tech', '2.5M USD', 'TrendingUpIcon', 6);

INSERT INTO tecnologia_areas (nome, empresas, profissionais, projetos, estado, ordem) VALUES
  ('Desenvolvimento de Software', '8', '45', '18', 'Crescimento', 1),
  ('Infraestrutura Digital', '5', '25', '12', 'Expansão', 2),
  ('E-commerce', '12', '35', '8', 'Ativo', 3),
  ('Consultoria IT', '6', '28', '15', 'Estável', 4);

INSERT INTO tecnologia_servicos_digitais (nome, descricao, utilizadores, servicos, estado, funcionalidades, url_acesso, ordem) VALUES
  ('Portal do Cidadão', 'Acesso online a serviços municipais', 'Em desenvolvimento', '24', 'Ativo',
   ARRAY['Acesso a documentos municipais', 'Pagamento de taxas e licenças', 'Agendamento de serviços', 'Consulta de processos', 'Comunicação com a autarquia'],
   'https://portal.chipindo.gov.ao', 1),
  ('App Municipal', 'Aplicação móvel para serviços públicos', 'Em desenvolvimento', '18', 'Ativo',
   ARRAY['Notificações em tempo real', 'Localização de serviços', 'Reporte de problemas', 'Acesso móvel a serviços', 'Informações de emergência'],
   'Disponível na App Store e Google Play', 2),
  ('Sistema de Gestão', 'Gestão integrada de processos municipais', '150', '12', 'Implementação',
   ARRAY['Gestão de recursos humanos', 'Controlo financeiro', 'Gestão de projetos', 'Relatórios automáticos', 'Integração de dados'],
   'Acesso interno - contacte o departamento IT', 3),
  ('Centro de Contacto', 'Atendimento digital ao cidadão', 'Em desenvolvimento', '8', 'Ativo',
   ARRAY['Atendimento por chat', 'Suporte por email', 'Base de conhecimento', 'Tickets de suporte', 'FAQ interativo'],
   'https://suporte.chipindo.gov.ao', 4);

INSERT INTO tecnologia_programas (title, description, beneficios, requisitos, contact, ordem) VALUES
  ('Programa de Formação em Tecnologia', 'Formação em áreas tecnológicas para jovens e profissionais',
   ARRAY['Cursos gratuitos', 'Certificação reconhecida', 'Estágios em empresas', 'Apoio na inserção'],
   ARRAY['Idade mínima 16 anos', 'Ensino básico', 'Interesse em tecnologia'],
   'Centro de Formação Tecnológica', 1),
  ('Programa de Incubação de Startups', 'Apoio ao desenvolvimento de startups tecnológicas',
   ARRAY['Espaço de coworking', 'Mentoria técnica', 'Acesso a investidores', 'Recursos tecnológicos'],
   ARRAY['Ideia inovadora', 'Plano de negócio', 'Equipa dedicada'],
   'Incubadora de Startups', 2),
  ('Programa de Digitalização', 'Modernização digital dos serviços públicos',
   ARRAY['Automação de processos', 'Melhoria de eficiência', 'Redução de custos', 'Melhor atendimento'],
   ARRAY['Serviço público', 'Processo definido', 'Recursos disponíveis'],
   'Departamento de Transformação Digital', 3);

INSERT INTO tecnologia_oportunidades (title, description, requisitos, beneficios, prazo, vagas, ordem) VALUES
  ('Desenvolvedor Full Stack', 'Vaga para desenvolvedor com experiência em tecnologias web',
   ARRAY['Licenciatura em Informática', 'Experiência de 3 anos', 'Conhecimentos em React/Node.js'],
   ARRAY['Salário competitivo', 'Trabalho remoto', 'Formação contínua', 'Plano de saúde'],
   '20 de Março de 2025', '4', 1),
  ('Analista de Dados', 'Vaga para analista de dados e business intelligence',
   ARRAY['Formação em Estatística/Informática', 'Experiência de 2 anos', 'Conhecimentos em SQL/Python'],
   ARRAY['Salário atrativo', 'Horário flexível', 'Formação especializada', 'Plano de carreira'],
   '25 de Março de 2025', '3', 2),
  ('Técnico de Suporte IT', 'Vagas para técnicos de suporte técnico',
   ARRAY['Formação técnica em IT', 'Experiência de 1 ano', 'Boa comunicação'],
   ARRAY['Salário base + prémios', 'Formação em produtos', 'Equipamentos fornecidos', 'Plano de carreira'],
   '30 de Março de 2025', '6', 3);

INSERT INTO tecnologia_infraestruturas (nome, localizacao, capacidade, equipamentos, estado, ordem) VALUES
  ('Centro de Inovação Tecnológica', 'Zona Tecnológica', '50 startups',
   ARRAY['Coworking', 'Sala de Reuniões', 'Laboratório', 'Centro de Dados'], 'Excelente', 1),
  ('Centro de Formação IT', 'Centro da Cidade', '100 formandos',
   ARRAY['Salas de Aula', 'Laboratórios', 'Biblioteca Digital', 'Sala de Conferências'], 'Excelente', 2),
  ('Data Center Municipal', 'Zona Industrial', '1000 servidores',
   ARRAY['Servidores', 'Sistema de Refrigeração', 'Backup', 'Segurança 24h'], 'Bom', 3);

INSERT INTO tecnologia_contactos (endereco, telefone, email, horario, responsavel) VALUES (
  'Rua da Tecnologia, Zona de Inovação, Chipindo',
  '+244 XXX XXX XXX',
  'tecnologia@chipindo.gov.ao',
  'Segunda a Sexta: 08:00 - 16:00',
  'Eng. Pedro Costa - Diretor Municipal de Tecnologia'
);

-- Insert initial data for Desenvolvimento Económico sector
INSERT INTO economico_info (title, subtitle, description, vision, mission) VALUES (
  'Desenvolvimento Económico',
  'Impulsionando o crescimento económico e a prosperidade de Chipindo',
  'O setor de desenvolvimento económico de Chipindo está focado em criar um ambiente favorável ao investimento, promover o empreendedorismo e diversificar a economia local.',
  'Ser um centro económico dinâmico e sustentável, atrativo para investimentos e inovação.',
  'Promover o desenvolvimento económico sustentável através do apoio ao empreendedorismo e atração de investimentos.'
);

INSERT INTO economico_estatisticas (label, value, icon, ordem) VALUES
  ('Empresas Registadas', '245', 'BuildingIcon', 1),
  ('Empregos Criados', '1.850', 'UsersIcon', 2),
  ('Investimento Total', '25M USD', 'DollarSignIcon', 3),
  ('Crescimento PIB', '8.5%', 'TrendingUpIcon', 4),
  ('Projetos Ativos', '32', 'BriefcaseIcon', 5),
  ('Exportações', '12M USD', 'GlobeIcon', 6);

INSERT INTO economico_setores (nome, empresas, empregos, contribuicao, estado, ordem) VALUES
  ('Comércio e Serviços', '120', '850', '45%', 'Crescimento', 1),
  ('Indústria Transformadora', '35', '420', '30%', 'Estável', 2),
  ('Agricultura', '45', '380', '15%', 'Crescimento', 3),
  ('Mineração', '8', '200', '10%', 'Expansão', 4);

INSERT INTO economico_programas (title, description, beneficios, requisitos, contact, ordem) VALUES
  ('Programa de Apoio ao Empreendedorismo', 'Iniciativa para apoiar novos empresários e startups',
   ARRAY['Financiamento preferencial', 'Mentoria empresarial', 'Formação em gestão', 'Acesso a mercados'],
   ARRAY['Plano de negócio viável', 'Idade mínima 18 anos', 'Residir no município'],
   'Gabinete de Empreendedorismo', 1),
  ('Programa de Atração de Investimentos', 'Incentivos para atrair investidores nacionais e estrangeiros',
   ARRAY['Incentivos fiscais', 'Simplificação de processos', 'Apoio logístico', 'Infraestruturas'],
   ARRAY['Investimento mínimo estabelecido', 'Criação de empregos', 'Projeto sustentável'],
   'Gabinete de Investimentos', 2),
  ('Programa de Formação Profissional', 'Formação técnica para aumentar a empregabilidade',
   ARRAY['Cursos gratuitos', 'Certificação reconhecida', 'Estágios em empresas', 'Apoio na inserção'],
   ARRAY['Idade mínima 16 anos', 'Ensino básico', 'Disponibilidade'],
   'Centro de Formação Profissional', 3);

INSERT INTO economico_oportunidades (title, description, requisitos, beneficios, prazo, vagas, ordem) VALUES
  ('Gestor de Projetos Económicos', 'Vaga para gestor de projetos de desenvolvimento económico',
   ARRAY['Licenciatura em Economia/Gestão', 'Experiência de 5 anos', 'Conhecimentos em gestão de projetos'],
   ARRAY['Salário competitivo', 'Plano de carreira', 'Formação contínua', 'Benefícios sociais'],
   '15 de Março de 2025', '2', 1),
  ('Analista Económico', 'Vaga para analista de dados económicos',
   ARRAY['Licenciatura em Economia/Estatística', 'Experiência de 3 anos', 'Conhecimentos em análise de dados'],
   ARRAY['Salário atrativo', 'Formação especializada', 'Trabalho remoto possível', 'Plano de saúde'],
   '20 de Março de 2025', '3', 2),
  ('Consultor de Investimentos', 'Vaga para consultor de atração de investimentos',
   ARRAY['Formação em Economia/Negócios', 'Experiência em vendas', 'Boa comunicação'],
   ARRAY['Salário base + comissões', 'Formação em técnicas de vendas', 'Viagens nacionais', 'Plano de carreira'],
   '25 de Março de 2025', '4', 3);

INSERT INTO economico_infraestruturas (nome, localizacao, capacidade, equipamentos, estado, ordem) VALUES
  ('Centro de Negócios', 'Zona Comercial', '50 empresas',
   ARRAY['Escritórios', 'Sala de Reuniões', 'Centro de Conferências', 'Café'], 'Excelente', 1),
  ('Parque Industrial', 'Zona Industrial', '30 fábricas',
   ARRAY['Armazéns', 'Oficinas', 'Centro Logístico', 'Segurança 24h'], 'Bom', 2),
  ('Centro de Formação', 'Centro da Cidade', '200 formandos',
   ARRAY['Salas de Aula', 'Laboratórios', 'Biblioteca', 'Sala de Informática'], 'Excelente', 3);

INSERT INTO economico_contactos (endereco, telefone, email, horario, responsavel) VALUES (
  'Rua do Desenvolvimento, Centro Comercial, Chipindo',
  '+244 XXX XXX XXX',
  'desenvolvimento@chipindo.gov.ao',
  'Segunda a Sexta: 08:00 - 16:00',
  'Dr. Ana Costa - Diretora Municipal de Desenvolvimento Económico'
); 