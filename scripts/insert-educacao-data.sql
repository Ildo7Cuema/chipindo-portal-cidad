-- Inserir dados específicos para o Setor de Educação
-- Execute este SQL no Supabase SQL Editor

-- 1. Inserir setor de Educação (se não existir)
INSERT INTO setores_estrategicos (nome, slug, descricao, visao, missao, cor_primaria, cor_secundaria, icone, ordem, ativo)
VALUES (
  'Educação',
  'educacao',
  'Sistema educacional completo do município de Chipindo, focado em proporcionar educação de qualidade para todos os cidadãos.',
  'Ser referência em educação municipal, garantindo acesso universal à educação de qualidade.',
  'Proporcionar educação inclusiva, equitativa e de qualidade, promovendo oportunidades de aprendizagem para todos.',
  '#3B82F6',
  '#1E40AF',
  'GraduationCap',
  1,
  true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Inserir estatísticas para Educação
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

-- 3. Inserir programas para Educação
INSERT INTO setores_programas (setor_id, titulo, descricao, beneficios, requisitos, contacto, ativo, ordem)
SELECT id, 'Programa de Alfabetização de Adultos', 'Iniciativa para reduzir o analfabetismo na população adulta', '["Aulas gratuitas em horário flexível", "Material didático fornecido", "Certificação oficial", "Apoio psicopedagógico"]', '["Idade mínima 18 anos", "Residir no município", "Interesse em aprender"]', 'Coordenação de Educação Básica', true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Bolsa de Estudo Municipal', 'Programa de apoio financeiro para estudantes carenciados', '["Subsídio mensal para material escolar", "Apoio para uniformes", "Transporte escolar gratuito", "Acompanhamento pedagógico"]', '["Rendimento familiar baixo", "Bom aproveitamento escolar", "Frequência regular"]', 'Gabinete de Ação Social', true, 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Formação Profissional', 'Programa de capacitação profissional para jovens', '["Formação gratuita", "Certificação reconhecida", "Apoio na inserção no mercado", "Material de formação"]', '["Idade entre 16 e 25 anos", "Ensino básico completo", "Disponibilidade para formação"]', 'Centro de Formação Profissional', true, 3 FROM setores_estrategicos WHERE slug = 'educacao';

-- 4. Inserir oportunidades para Educação
INSERT INTO setores_oportunidades (setor_id, titulo, descricao, requisitos, beneficios, prazo, vagas, ativo, ordem)
SELECT id, 'Concurso para Professores', 'Abertura de vagas para professores do ensino primário e secundário', '["Licenciatura em Educação", "Experiência mínima de 2 anos", "Disponibilidade para residir no município"]', '["Salário competitivo", "Plano de carreira", "Formação contínua", "Apoio habitacional"]', '2025-03-15', 8, true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Estágio em Gestão Educacional', 'Oportunidade de estágio na área de gestão educacional', '["Estudante de Pedagogia ou Administração", "Bom domínio de informática", "Disponibilidade para estágio"]', '["Bolsa de estágio", "Experiência profissional", "Possibilidade de contratação"]', '2025-02-28', 3, true, 2 FROM setores_estrategicos WHERE slug = 'educacao';

-- 5. Inserir infraestruturas para Educação
INSERT INTO setores_infraestruturas (setor_id, nome, localizacao, capacidade, estado, equipamentos, ativo, ordem) 
SELECT id, 'Escola Primária Central', 'Bairro Central', '450 alunos', 'Operacional', '["Biblioteca", "Laboratório de Informática", "Sala Multimédia", "Ginásio"]', true, 1 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Escola Secundária Municipal', 'Bairro da Administração', '600 alunos', 'Operacional', '["Biblioteca", "Laboratórios de Ciências", "Sala de Informática", "Auditório"]', true, 2 FROM setores_estrategicos WHERE slug = 'educacao'
UNION ALL
SELECT id, 'Centro de Formação', 'Bairro Industrial', '200 formandos', 'Operacional', '["Salas de Formação", "Laboratórios", "Sala de Conferências", "Cantina"]', true, 3 FROM setores_estrategicos WHERE slug = 'educacao';

-- 6. Inserir contactos para Educação
INSERT INTO setores_contactos (setor_id, endereco, telefone, email, horario, responsavel) 
SELECT id, 'Rua da Educação, Bairro Central, Chipindo', '+244 XXX XXX XXX', 'educacao@chipindo.gov.ao', 'Segunda a Sexta: 08:00 - 16:00', 'Dr. João Silva - Diretor Municipal de Educação' FROM setores_estrategicos WHERE slug = 'educacao';

-- Verificar se os dados foram inseridos corretamente
SELECT 'Setor de Educação criado com sucesso!' as status; 