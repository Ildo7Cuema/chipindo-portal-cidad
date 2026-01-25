-- Inserção de dados iniciais para Setores Estratégicos
-- Portal Cidadão de Chipindo

-- Inserir setores estratégicos
INSERT INTO setores_estrategicos (nome, slug, descricao, visao, missao, cor_primaria, cor_secundaria, icone, ordem) VALUES
('Educação', 'educacao', 'O setor de educação de Chipindo está comprometido em proporcionar uma educação inclusiva, de qualidade e acessível a todos os cidadãos, desde a primeira infância até a formação superior.', 'Ser referência em educação municipal, formando cidadãos competentes e preparados para os desafios do futuro.', 'Proporcionar educação de qualidade, inclusiva e inovadora, promovendo o desenvolvimento integral dos estudantes e contribuindo para o progresso da comunidade.', '#3B82F6', '#1E40AF', 'GraduationCap', 1),

('Saúde', 'saude', 'O setor da saúde de Chipindo está dedicado a proporcionar cuidados de saúde de qualidade, acessíveis e equitativos para todos os cidadãos, promovendo o bem-estar e a qualidade de vida da população.', 'Ser referência em saúde municipal, garantindo acesso universal a serviços de qualidade e promovendo uma comunidade saudável e resiliente.', 'Proporcionar cuidados de saúde integrais, preventivos e curativos, promovendo a saúde pública e o bem-estar da população de Chipindo.', '#EF4444', '#DC2626', 'Heart', 2),

('Agricultura', 'agricultura', 'O setor agrícola de Chipindo está focado em promover o desenvolvimento rural sustentável, modernizar as práticas agrícolas e garantir a segurança alimentar da população.', 'Ser referência em agricultura sustentável e moderna, promovendo o desenvolvimento rural e garantindo a segurança alimentar do município.', 'Promover o desenvolvimento agrícola sustentável, modernizar as práticas rurais e apoiar os agricultores locais para aumentar a produção e qualidade.', '#22C55E', '#16A34A', 'Sprout', 3),

('Setor Mineiro', 'sector-mineiro', 'O setor mineiro de Chipindo está comprometido com a exploração sustentável dos recursos minerais, promovendo o desenvolvimento económico e a proteção ambiental.', 'Ser referência em mineração sustentável e responsável, contribuindo para o desenvolvimento económico e social do município.', 'Explorar os recursos minerais de forma sustentável e responsável, promovendo o desenvolvimento económico e a proteção ambiental.', '#EAB308', '#CA8A04', 'Pickaxe', 4),

('Desenvolvimento Económico', 'desenvolvimento-economico', 'O setor de desenvolvimento económico de Chipindo está focado em promover o crescimento económico sustentável, atrair investimentos e criar oportunidades de emprego.', 'Ser referência em desenvolvimento económico municipal, promovendo o crescimento sustentável e a criação de oportunidades para todos os cidadãos.', 'Promover o desenvolvimento económico sustentável, atrair investimentos e criar oportunidades de emprego e negócio para a população.', '#10B981', '#059669', 'TrendingUp', 5),

('Cultura', 'cultura', 'O setor cultural de Chipindo está dedicado a preservar, promover e desenvolver a rica herança cultural local, fomentando a criatividade e a expressão artística.', 'Ser referência em promoção cultural municipal, preservando a herança local e fomentando a criatividade e expressão artística.', 'Preservar e promover a herança cultural local, fomentar a criatividade e proporcionar oportunidades de expressão artística para todos.', '#A855F7', '#9333EA', 'Palette', 6),

('Tecnologia', 'tecnologia', 'O setor tecnológico de Chipindo está comprometido em promover a inovação digital, modernizar os serviços públicos e fomentar o desenvolvimento de competências tecnológicas.', 'Ser referência em inovação tecnológica municipal, promovendo a transformação digital e o desenvolvimento de competências tecnológicas.', 'Promover a inovação tecnológica, modernizar os serviços públicos e fomentar o desenvolvimento de competências digitais na população.', '#6366F1', '#4F46E5', 'Cpu', 7),

('Energia e Água', 'energia-agua', 'O setor de energia e água de Chipindo está comprometido em fornecer serviços de qualidade, promover a eficiência energética e garantir o acesso universal a estes recursos essenciais.', 'Ser referência em fornecimento sustentável de energia e água, garantindo qualidade e acessibilidade.', 'Proporcionar serviços de energia e água de qualidade, promovendo a sustentabilidade e eficiência.', '#06B6D4', '#0891B2', 'Zap', 8);

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
SELECT id, 'Hectares Cultivados', '8.750', 'Map', 2 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Produção Anual', '12.500 ton', 'TrendingUp', 3 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Programas Ativos', '8', 'HeartHandshake', 4 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Cooperativas', '15', 'Building', 5 FROM setores_estrategicos WHERE slug = 'agricultura'
UNION ALL
SELECT id, 'Técnicos Agrícolas', '23', 'UserCheck', 6 FROM setores_estrategicos WHERE slug = 'agricultura';

-- Inserir estatísticas para Setor Mineiro
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Minas Ativas', '8', 'Building', 1 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Empregos Diretos', '450', 'Users', 2 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Produção Anual', '25.000 ton', 'TrendingUp', 3 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Recursos Minerais', '4', 'Gem', 4 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Programas de Segurança', '6', 'Shield', 5 FROM setores_estrategicos WHERE slug = 'sector-mineiro'
UNION ALL
SELECT id, 'Investimento Anual', '5.2M USD', 'DollarSign', 6 FROM setores_estrategicos WHERE slug = 'sector-mineiro';

-- Inserir estatísticas para Desenvolvimento Económico
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Empresas Registadas', '245', 'Building', 1 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Empregos Criados', '1.850', 'Users', 2 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Investimento Total', '25M USD', 'DollarSign', 3 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Programas Ativos', '12', 'HeartHandshake', 4 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Startups Apoiadas', '18', 'Zap', 5 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico'
UNION ALL
SELECT id, 'Crescimento PIB', '4.2%', 'TrendingUp', 6 FROM setores_estrategicos WHERE slug = 'desenvolvimento-economico';

-- Inserir estatísticas para Cultura
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Grupos Culturais', '25', 'Users', 1 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Eventos Anuais', '48', 'Calendar', 2 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Artistas Registados', '156', 'UserCheck', 3 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Programas Culturais', '8', 'HeartHandshake', 4 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Espaços Culturais', '6', 'Building', 5 FROM setores_estrategicos WHERE slug = 'cultura'
UNION ALL
SELECT id, 'Participantes/Ano', '12.450', 'Users', 6 FROM setores_estrategicos WHERE slug = 'cultura';

-- Inserir estatísticas para Tecnologia
INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) 
SELECT id, 'Startups Tech', '15', 'Zap', 1 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Profissionais IT', '89', 'Users', 2 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Projetos Digitais', '32', 'Code', 3 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Programas de Formação', '8', 'GraduationCap', 4 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Cobertura Internet', '65%', 'Wifi', 5 FROM setores_estrategicos WHERE slug = 'tecnologia'
UNION ALL
SELECT id, 'Serviços Digitais', '12', 'Smartphone', 6 FROM setores_estrategicos WHERE slug = 'tecnologia';

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
SELECT id, 'Estações de Água', '5', 'Gauge', 5 FROM setores_estrategicos WHERE slug = 'energia-agua'
UNION ALL
SELECT id, 'Projetos Ativos', '15', 'HeartHandshake', 6 FROM setores_estrategicos WHERE slug = 'energia-agua'; 