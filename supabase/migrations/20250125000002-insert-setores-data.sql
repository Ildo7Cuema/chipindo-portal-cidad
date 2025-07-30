-- Inserção de dados iniciais para Setores Estratégicos
-- Portal Cidadão de Chipindo

-- Inserir setores estratégicos principais
INSERT INTO setores_estrategicos (nome, slug, descricao, visao, missao, cor_primaria, cor_secundaria, icone, ordem, ativo) VALUES
('Educação', 'educacao', 'Sistema educacional completo do município de Chipindo, focado em proporcionar educação de qualidade para todos os cidadãos.', 'Ser referência em educação municipal, garantindo acesso universal à educação de qualidade.', 'Proporcionar educação inclusiva, equitativa e de qualidade, promovendo oportunidades de aprendizagem para todos.', '#3B82F6', '#1E40AF', 'GraduationCap', 1, true),
('Saúde', 'saude', 'Serviços de saúde integrais e acessíveis para a população de Chipindo.', 'Ser referência em saúde municipal, garantindo uma população saudável e com qualidade de vida.', 'Proporcionar cuidados de saúde integrais, preventivos e curativos, com foco na promoção da saúde.', '#EF4444', '#DC2626', 'Heart', 2, true),
('Agricultura', 'agricultura', 'Desenvolvimento agrícola sustentável e moderno em Chipindo.', 'Ser referência em agricultura sustentável e moderna, garantindo a segurança alimentar.', 'Promover o desenvolvimento agrícola sustentável e apoiar os agricultores locais.', '#22C55E', '#16A34A', 'Sprout', 3, true),
('Setor Mineiro', 'sector-mineiro', 'Exploração e gestão sustentável dos recursos minerais de Chipindo.', 'Ser referência em mineração responsável e desenvolvimento comunitário.', 'Desenvolver o setor mineiro de forma sustentável, criando empregos e desenvolvimento local.', '#F59E0B', '#D97706', 'Pickaxe', 4, true),
('Desenvolvimento Económico', 'desenvolvimento-economico', 'Promoção do desenvolvimento económico sustentável de Chipindo.', 'Ser um município economicamente próspero e atrativo para investimentos.', 'Promover o desenvolvimento económico sustentável e criar oportunidades de negócio.', '#10B981', '#059669', 'TrendingUp', 5, true),
('Cultura', 'cultura', 'Preservação e promoção do património cultural de Chipindo.', 'Ser referência em preservação cultural e promoção das artes.', 'Preservar e promover o património cultural, fomentando a criatividade e expressão artística.', '#8B5CF6', '#7C3AED', 'Palette', 6, true),
('Tecnologia', 'tecnologia', 'Inovação tecnológica e digitalização dos serviços municipais.', 'Ser um município tecnologicamente avançado e inovador.', 'Promover a inovação tecnológica e digitalizar os serviços municipais.', '#6366F1', '#4F46E5', 'Cpu', 7, true),
('Energia e Água', 'energia-agua', 'Gestão eficiente dos recursos energéticos e hídricos de Chipindo.', 'Garantir acesso universal a energia e água de qualidade.', 'Proporcionar serviços de energia e água eficientes e sustentáveis.', '#06B6D4', '#0891B2', 'Zap', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Inserir estatísticas para Educação
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Escolas Primárias', '12', 'Building', 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Escolas Secundárias', '3', 'GraduationCap', 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Professores', '156', 'Users', 3 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Estudantes', '2.847', 'BookOpen', 4 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Taxa de Alfabetização', '78%', 'TrendingUp', 5 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Programas de Bolsas', '45', 'HeartHandshake', 6 FROM setores_estrategicos WHERE slug = 'educacao';

-- Inserir estatísticas para Saúde
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Unidades de Saúde', '8', 'Building', 1 FROM setores_estrategicos WHERE slug = 'saude'
UNION ALL
SELECT id, 'Profissionais', '89', 'Users', 2 FROM setores_estrategicos WHERE slug = 'saude'
UNION ALL
SELECT id, 'Consultas Mensais', '3.245', 'Activity', 3 FROM setores_estrategicos WHERE slug = 'saude'
UNION ALL
SELECT id, 'Cobertura Vacinal', '92%', 'Shield', 4 FROM setores_estrategicos WHERE slug = 'saude'
UNION ALL
SELECT id, 'Programas Ativos', '12', 'HeartHandshake', 5 FROM setores_estrategicos WHERE slug = 'saude'
UNION ALL
SELECT id, 'Emergências Atendidas', '156/mês', 'AlertTriangle', 6 FROM setores_estrategicos WHERE slug = 'saude';

-- Inserir estatísticas para Agricultura
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Agricultores', '1.245', 'Users', 1 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Área Cultivada', '8.750 ha', 'MapPin', 2 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Produção Anual', '12.500 ton', 'Building', 3 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Projetos Ativos', '18', 'Sprout', 4 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Crescimento', '15%', 'TrendingUp', 5 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Cooperativas', '6', 'HeartHandshake', 6 FROM setores_estrategicos WHERE slug = 'agricultura';

-- Inserir estatísticas para Setor Mineiro
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Minas Ativas', '8', 'Pickaxe', 1 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Empregos Diretos', '450', 'Users', 2 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Produção Anual', '25.000 ton', 'TrendingUp', 3 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Recursos Minerais', '4', 'Diamond', 4 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Investimento Total', '15M USD', 'DollarSign', 5 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Programas de Formação', '12', 'GraduationCap', 6 FROM setores_estrategicos WHERE slug = 'sector-mineiro';

-- Inserir estatísticas para Desenvolvimento Económico
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Empresas Registadas', '245', 'Building', 1 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Empregos Criados', '1.850', 'Users', 2 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Investimento Total', '25M USD', 'DollarSign', 3 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Projetos Ativos', '32', 'TrendingUp', 4 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Crescimento PIB', '8.5%', 'BarChart3', 5 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Startups Apoiadas', '15', 'Zap', 6 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico';

-- Inserir estatísticas para Cultura
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Grupos Culturais', '25', 'Users', 1 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Eventos Anuais', '48', 'Calendar', 2 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Artistas Registados', '156', 'Palette', 3 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Centros Culturais', '4', 'Building', 4 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Festivais Realizados', '12', 'Music', 5 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Programas de Formação', '8', 'GraduationCap', 6 FROM setores_estrategicos WHERE slug = 'cultura';

-- Inserir estatísticas para Tecnologia
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Startups Tech', '15', 'Zap', 1 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Profissionais IT', '89', 'Users', 2 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Projetos Digitais', '32', 'Cpu', 3 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Serviços Online', '8', 'Globe', 4 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Cobertura Internet', '75%', 'Wifi', 5 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Centros de Inovação', '3', 'Lightbulb', 6 FROM setores_estrategicos WHERE slug = 'tecnologia';

-- Inserir estatísticas para Energia e Água
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Cobertura Elétrica', '78%', 'Zap', 1 FROM setores_estrategicos WHERE slug = 'energia-agua'
UNION ALL
SELECT id, 'Cobertura de Água', '65%', 'Droplets', 2 FROM setores_estrategicos WHERE slug = 'energia-agua'
UNION ALL
SELECT id, 'Consumidores', '12.450', 'Users', 3 FROM setores_estrategicos WHERE slug = 'energia-agua'
UNION ALL
SELECT id, 'Centrais Elétricas', '3', 'Building', 4 FROM setores_estrategicos WHERE slug = 'energia-agua'
UNION ALL
SELECT id, 'Estações de Água', '8', 'Droplets', 5 FROM setores_estrategicos WHERE slug = 'energia-agua'
UNION ALL
SELECT id, 'Programas de Eficiência', '6', 'TrendingUp', 6 FROM setores_estrategicos WHERE slug = 'energia-agua';

-- Inserir programas para Educação
INSERT INTO setores_programas (setor_id, titulo, descricao, beneficios, requisitos, contacto, ativo, ordem) 
SELECT id, 'Programa de Alfabetização de Adultos', 'Iniciativa para reduzir o analfabetismo na população adulta', '["Aulas gratuitas em horário flexível", "Material didático fornecido", "Certificação oficial", "Apoio psicopedagógico"]', '["Idade mínima 18 anos", "Residir no município", "Interesse em aprender"]', 'Coordenação de Educação Básica', true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Bolsa de Estudo Municipal', 'Programa de apoio financeiro para estudantes carenciados', '["Subsídio mensal para material escolar", "Apoio para uniformes", "Transporte escolar gratuito", "Acompanhamento pedagógico"]', '["Rendimento familiar baixo", "Bom aproveitamento escolar", "Frequência regular"]', 'Gabinete de Ação Social', true, 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Formação Profissional', 'Programa de capacitação profissional para jovens', '["Formação gratuita", "Certificação reconhecida", "Apoio na inserção no mercado", "Material de formação"]', '["Idade entre 16 e 25 anos", "Ensino básico completo", "Disponibilidade para formação"]', 'Centro de Formação Profissional', true, 3 FROM setores_estrategicos WHERE slug = 'educacao';

-- Inserir oportunidades para Educação
INSERT INTO setores_oportunidades (setor_id, titulo, descricao, requisitos, beneficios, prazo, vagas, ativo, ordem) 
SELECT id, 'Concurso para Professores', 'Abertura de vagas para professores do ensino primário e secundário', '["Licenciatura em Educação", "Experiência mínima de 2 anos", "Disponibilidade para residir no município"]', '["Salário competitivo", "Plano de carreira", "Formação contínua", "Apoio habitacional"]', '2025-03-15', 8, true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Estágio em Gestão Educacional', 'Oportunidade de estágio na área de gestão educacional', '["Estudante de Pedagogia ou Administração", "Bom domínio de informática", "Disponibilidade para estágio"]', '["Bolsa de estágio", "Experiência profissional", "Possibilidade de contratação"]', '2025-02-28', 3, true, 2 FROM setores_estrategicos WHERE slug = 'educacao';

-- Inserir infraestruturas para Educação
INSERT INTO setores_infraestruturas (setor_id, nome, localizacao, capacidade, estado, equipamentos, ativo, ordem) 
SELECT id, 'Escola Primária Central', 'Bairro Central', '450 alunos', 'Operacional', '["Biblioteca", "Laboratório de Informática", "Sala Multimédia", "Ginásio"]', true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Escola Secundária Municipal', 'Bairro da Administração', '600 alunos', 'Operacional', '["Biblioteca", "Laboratórios de Ciências", "Sala de Informática", "Auditório"]', true, 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Centro de Formação', 'Bairro Industrial', '200 formandos', 'Operacional', '["Salas de Formação", "Laboratórios", "Sala de Conferências", "Cantina"]', true, 3 FROM setores_estrategicos WHERE slug = 'educacao';

-- Inserir contactos para Educação
INSERT INTO setores_contactos (setor_id, endereco, telefone, email, horario, responsavel) 
SELECT id, 'Rua da Educação, Bairro Central, Chipindo', '+244 XXX XXX XXX', 'educacao@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Dr. João Silva - Diretor Municipal de Educação' FROM setores_estrategicos WHERE slug = 'educacao';

-- Inserir contactos para outros setores
INSERT INTO setores_contactos (setor_id, endereco, telefone, email, horario, responsavel) 
SELECT id, 'Rua da Saúde, Bairro Central, Chipindo', '+244 XXX XXX XXX', 'saude@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Dra. Maria Santos - Diretora Municipal de Saúde' FROM setores_estrategicos WHERE slug = 'saude'
UNION ALL
SELECT id, 'Rua da Agricultura, Bairro Rural, Chipindo', '+244 XXX XXX XXX', 'agricultura@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Eng. Carlos Ferreira - Diretor Municipal de Agricultura' FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Rua da Mineração, Bairro Industrial, Chipindo', '+244 XXX XXX XXX', 'mineracao@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Eng. Pedro Costa - Diretor Municipal de Mineração' FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Rua do Desenvolvimento, Bairro Comercial, Chipindo', '+244 XXX XXX XXX', 'desenvolvimento@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Dr. Ana Oliveira - Diretora Municipal de Desenvolvimento Económico' FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Rua da Cultura, Bairro Histórico, Chipindo', '+244 XXX XXX XXX', 'cultura@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Prof. Manuel Rodrigues - Diretor Municipal de Cultura' FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Rua da Tecnologia, Bairro da Inovação, Chipindo', '+244 XXX XXX XXX', 'tecnologia@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Eng. Sofia Martins - Diretora Municipal de Tecnologia' FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Rua da Energia, Bairro Industrial, Chipindo', '+244 XXX XXX XXX', 'energia@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Eng. Luís Pereira - Diretor Municipal de Energia e Água' FROM setores_estrategicos WHERE slug = 'energia-agua'; 