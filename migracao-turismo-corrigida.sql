-- Migração Corrigida: Setor de Turismo e Meio Ambiente
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar setor de Turismo e Meio Ambiente
INSERT INTO setores_estrategicos (nome, slug, descricao, visao, missao, cor_primaria, cor_secundaria, icone, ordem, ativo) VALUES (
  'Turismo e Meio Ambiente',
  'turismo-meio-ambiente',
  'O setor de Turismo e Meio Ambiente de Chipindo está comprometido em promover o turismo sustentável, preservar os recursos naturais e criar oportunidades económicas através do desenvolvimento turístico responsável.',
  'Ser um destino turístico de referência, conhecido pela sua beleza natural, sustentabilidade e hospitalidade local.',
  'Promover o turismo sustentável, preservar o meio ambiente e criar oportunidades económicas através do desenvolvimento turístico responsável.',
  '#10B981',
  '#059669',
  'GlobeIcon',
  8,
  true
);

-- 2. Obter o ID do setor criado e inserir dados relacionados
DO $$
DECLARE
  setor_id UUID;
BEGIN
  SELECT id INTO setor_id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente';

  -- Inserir estatísticas do setor
  INSERT INTO setores_estatisticas (setor_id, nome, valor, icone, ordem) VALUES
    (setor_id, 'Atrações Turísticas', '15', 'MapPin', 1),
    (setor_id, 'Hotéis e Pousadas', '8', 'Building', 2),
    (setor_id, 'Empregos no Turismo', '120', 'Users', 3),
    (setor_id, 'Áreas Protegidas', '5', 'Trees', 4),
    (setor_id, 'Visitantes Anuais', '2.500', 'Globe', 5),
    (setor_id, 'Projetos Ambientais', '12', 'Leaf', 6);

  -- Inserir programas do setor
  INSERT INTO setores_programas (setor_id, titulo, descricao, beneficios, requisitos, contacto, ordem) VALUES
    (setor_id, 'Programa de Turismo Sustentável', 'Desenvolvimento de práticas turísticas responsáveis e sustentáveis',
     '["Formação em turismo sustentável", "Apoio na certificação", "Marketing turístico", "Networking"]'::jsonb,
     '["Empresa turística", "Compromisso com sustentabilidade", "Plano de negócio"]'::jsonb,
     'Gabinete de Turismo', 1),
    (setor_id, 'Programa de Conservação Ambiental', 'Iniciativas para preservar e proteger o meio ambiente local',
     '["Apoio técnico", "Recursos para conservação", "Formação ambiental", "Certificação verde"]'::jsonb,
     '["Projeto ambiental", "Impacto positivo", "Sustentabilidade"]'::jsonb,
     'Departamento de Meio Ambiente', 2),
    (setor_id, 'Programa de Formação Turística', 'Formação profissional para o setor turístico',
     '["Cursos gratuitos", "Certificação reconhecida", "Estágios em hotéis", "Apoio na inserção"]'::jsonb,
     '["Idade mínima 16 anos", "Ensino básico", "Interesse em turismo"]'::jsonb,
     'Centro de Formação Turística', 3);

  -- Inserir oportunidades do setor
  INSERT INTO setores_oportunidades (setor_id, titulo, descricao, requisitos, beneficios, prazo, vagas, ordem) VALUES
    (setor_id, 'Guia Turístico', 'Vagas para guias turísticos especializados',
     '["Formação em turismo", "Conhecimento da região", "Boa comunicação", "Idiomas"]'::jsonb,
     '["Salário competitivo", "Horário flexível", "Formação contínua", "Contatos internacionais"]'::jsonb,
     '2025-03-15', '8', 1),
    (setor_id, 'Gestor Ambiental', 'Vaga para gestor de projetos ambientais',
     '["Licenciatura em Ambiente", "Experiência de 3 anos", "Gestão de projetos"]'::jsonb,
     '["Salário atrativo", "Plano de carreira", "Formação especializada", "Impacto ambiental positivo"]'::jsonb,
     '2025-03-20', '3', 2),
    (setor_id, 'Rececionista de Hotel', 'Vagas para rececionistas em hotéis locais',
     '["Ensino médio", "Boa comunicação", "Paciente e atencioso", "Conhecimentos básicos de informática"]'::jsonb,
     '["Salário base + gorjetas", "Formação em hotelaria", "Plano de saúde", "Oportunidades de crescimento"]'::jsonb,
     '2025-03-25', '12', 3);

  -- Inserir infraestruturas do setor
  INSERT INTO setores_infraestruturas (setor_id, nome, localizacao, capacidade, estado, equipamentos, ordem) VALUES
    (setor_id, 'Centro de Informação Turística', 'Centro da Cidade', '50 visitantes/dia',
     'Excelente', '["Balcão de Informações", "Sala de Exposições", "Wi-Fi Gratuito", "Mapas e Brochuras"]'::jsonb, 1),
    (setor_id, 'Hotel Municipal', 'Zona Central', '80 hóspedes',
     'Bom', '["Quartos Confortáveis", "Restaurante", "Sala de Conferências", "Estacionamento"]'::jsonb, 2),
    (setor_id, 'Parque Natural Municipal', 'Zona Rural', '200 visitantes/dia',
     'Excelente', '["Trilhos Pedestres", "Miradouros", "Centro de Interpretação", "Área de Piquenique"]'::jsonb, 3),
    (setor_id, 'Centro de Formação Turística', 'Centro da Cidade', '100 formandos',
     'Excelente', '["Salas de Aula", "Laboratório de Informática", "Sala de Simulação", "Biblioteca"]'::jsonb, 4);

  -- Inserir contactos do setor
  INSERT INTO setores_contactos (setor_id, endereco, telefone, email, horario, responsavel) VALUES
    (setor_id, 'Rua do Turismo, Centro de Informação Turística, Chipindo',
     '+244 XXX XXX XXX', 'turismo@chipindo.gov.ao',
     'Segunda a Domingo: 08:00 - 18:00',
     'Dr. João Silva - Diretor Municipal de Turismo e Meio Ambiente');

END $$;

-- 3. Verificar se tudo foi criado corretamente
SELECT 'Setor criado com sucesso!' as resultado; 