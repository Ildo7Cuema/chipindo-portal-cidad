-- Inserir dados de exemplo para inscrições em eventos
-- Primeiro, vamos inserir algumas inscrições para os eventos existentes

-- Inscrições para Festival Cultural de Chipindo (ID: 1)
INSERT INTO event_registrations (
    event_id, participant_name, participant_email, participant_phone, 
    participant_age, participant_gender, participant_address, 
    participant_occupation, participant_organization, special_needs, 
    dietary_restrictions, emergency_contact_name, emergency_contact_phone, 
    status, notes
) VALUES
(1, 'Maria Silva Santos', 'maria.silva@email.com', '+244 123 456 789', 
 28, 'Feminino', 'Rua Principal, Bairro Central, Chipindo', 
 'Professora', 'Escola Primária de Chipindo', '', 
 'Vegetariana', 'João Silva', '+244 987 654 321', 
 'confirmed', 'Participante interessada em workshops culturais'),

(1, 'João Pedro Santos', 'joao.santos@email.com', '+244 987 654 321', 
 35, 'Masculino', 'Avenida da Liberdade, Chipindo', 
 'Agricultor', 'Associação de Agricultores', '', 
 '', 'Ana Santos', '+244 555 123 456', 
 'pending', ''),

(1, 'Ana Costa Ferreira', 'ana.costa@email.com', '+244 555 123 456', 
 42, 'Feminino', 'Rua do Comércio, Chipindo', 
 'Comerciante', 'Associação de Comerciantes', 'Acesso para cadeira de rodas', 
 '', 'Pedro Costa', '+244 777 888 999', 
 'attended', 'Participou ativamente do evento'),

(1, 'Carlos Manuel Oliveira', 'carlos.oliveira@email.com', '+244 777 888 999', 
 31, 'Masculino', 'Bairro dos Funcionários, Chipindo', 
 'Funcionário Público', 'Câmara Municipal', '', 
 'Sem glúten', 'Maria Oliveira', '+244 111 222 333', 
 'confirmed', 'Interessado em apresentações musicais'),

(1, 'Isabel Rosa Mendes', 'isabel.mendes@email.com', '+244 111 222 333', 
 25, 'Feminino', 'Rua da Juventude, Chipindo', 
 'Estudante', 'Universidade Agostinho Neto', '', 
 'Vegana', 'António Mendes', '+244 333 444 555', 
 'pending', 'Estudante de artes plásticas');

-- Inscrições para Feira de Agricultura (ID: 2)
INSERT INTO event_registrations (
    event_id, participant_name, participant_email, participant_phone, 
    participant_age, participant_gender, participant_address, 
    participant_occupation, participant_organization, special_needs, 
    dietary_restrictions, emergency_contact_name, emergency_contact_phone, 
    status, notes
) VALUES
(2, 'Manuel António Pereira', 'manuel.pereira@email.com', '+244 333 444 555', 
 45, 'Masculino', 'Zona Rural, Chipindo', 
 'Agricultor', 'Cooperativa Agrícola', '', 
 '', 'Maria Pereira', '+244 666 777 888', 
 'confirmed', 'Produtor de milho e feijão'),

(2, 'Rosa Maria Fernandes', 'rosa.fernandes@email.com', '+244 666 777 888', 
 38, 'Feminino', 'Quinta dos Santos, Chipindo', 
 'Agricultora', 'Associação de Mulheres Rurais', '', 
 'Vegetariana', 'João Fernandes', '+244 999 000 111', 
 'confirmed', 'Especialista em horticultura'),

(2, 'António José Silva', 'antonio.silva@email.com', '+244 999 000 111', 
 52, 'Masculino', 'Fazenda Grande, Chipindo', 
 'Produtor Rural', 'Sindicato dos Agricultores', '', 
 '', 'Ana Silva', '+244 222 333 444', 
 'cancelled', 'Cancelou por motivos pessoais'),

(2, 'Lucia Santos Costa', 'lucia.costa@email.com', '+244 222 333 444', 
 29, 'Feminino', 'Bairro Agrícola, Chipindo', 
 'Engenheira Agrónoma', 'Direção de Agricultura', '', 
 '', 'Carlos Costa', '+244 444 555 666', 
 'confirmed', 'Técnica agrícola interessada em novas técnicas');

-- Inscrições para Campeonato de Futebol Local (ID: 3)
INSERT INTO event_registrations (
    event_id, participant_name, participant_email, participant_phone, 
    participant_age, participant_gender, participant_address, 
    participant_occupation, participant_organization, special_needs, 
    dietary_restrictions, emergency_contact_name, emergency_contact_phone, 
    status, notes
) VALUES
(3, 'Pedro Miguel Santos', 'pedro.santos@email.com', '+244 444 555 666', 
 22, 'Masculino', 'Bairro Desportivo, Chipindo', 
 'Jogador', 'Clube Desportivo Chipindo', '', 
 '', 'Maria Santos', '+244 777 888 999', 
 'confirmed', 'Jogador titular da equipa local'),

(3, 'Francisco José Oliveira', 'francisco.oliveira@email.com', '+244 777 888 999', 
 19, 'Masculino', 'Rua dos Atletas, Chipindo', 
 'Estudante', 'Escola Secundária', '', 
 '', 'João Oliveira', '+244 111 222 333', 
 'confirmed', 'Jovem promessa do futebol local'),

(3, 'Manuel Carlos Pereira', 'manuel.carlos@email.com', '+244 111 222 333', 
 35, 'Masculino', 'Avenida dos Desportos, Chipindo', 
 'Treinador', 'Federação de Futebol', '', 
 '', 'Ana Pereira', '+244 333 444 555', 
 'attended', 'Treinador da equipa vencedora'),

(3, 'João Paulo Mendes', 'joao.paulo@email.com', '+244 333 444 555', 
 28, 'Masculino', 'Bairro Central, Chipindo', 
 'Arbitro', 'Associação de Arbitros', '', 
 '', 'Isabel Mendes', '+244 666 777 888', 
 'confirmed', 'Arbitro principal do campeonato');

-- Inscrições para Workshop de Empreendedorismo (ID: 4)
INSERT INTO event_registrations (
    event_id, participant_name, participant_email, participant_phone, 
    participant_age, participant_gender, participant_address, 
    participant_occupation, participant_organization, special_needs, 
    dietary_restrictions, emergency_contact_name, emergency_contact_phone, 
    status, notes
) VALUES
(4, 'Ana Sofia Costa', 'ana.sofia@email.com', '+244 666 777 888', 
 26, 'Feminino', 'Rua dos Negócios, Chipindo', 
 'Empresária', 'Associação de Empresários', '', 
 'Vegetariana', 'Carlos Costa', '+244 999 000 111', 
 'confirmed', 'Interessada em expandir seu negócio'),

(4, 'Miguel António Silva', 'miguel.silva@email.com', '+244 999 000 111', 
 32, 'Masculino', 'Avenida Comercial, Chipindo', 
 'Consultor', 'Consultoria Empresarial', '', 
 '', 'Maria Silva', '+244 222 333 444', 
 'confirmed', 'Consultor financeiro experiente'),

(4, 'Sofia Maria Oliveira', 'sofia.oliveira@email.com', '+244 222 333 444', 
 24, 'Feminino', 'Bairro Universitário, Chipindo', 
 'Estudante', 'Universidade Católica', '', 
 'Vegana', 'António Oliveira', '+244 444 555 666', 
 'pending', 'Estudante de gestão empresarial'),

(4, 'Ricardo José Pereira', 'ricardo.pereira@email.com', '+244 444 555 666', 
 40, 'Masculino', 'Rua da Indústria, Chipindo', 
 'Industrial', 'Associação Industrial', '', 
 '', 'Lucia Pereira', '+244 777 888 999', 
 'confirmed', 'Industrial com 15 anos de experiência'),

(4, 'Catarina Santos Mendes', 'catarina.mendes@email.com', '+244 777 888 999', 
 29, 'Feminino', 'Avenida dos Empreendedores, Chipindo', 
 'Startup Founder', 'Incubadora de Startups', '', 
 'Sem lactose', 'João Mendes', '+244 111 222 333', 
 'attended', 'Fundadora de startup de tecnologia');

-- Inscrições para Limpeza Comunitária (ID: 5)
INSERT INTO event_registrations (
    event_id, participant_name, participant_email, participant_phone, 
    participant_age, participant_gender, participant_address, 
    participant_occupation, participant_organization, special_needs, 
    dietary_restrictions, emergency_contact_name, emergency_contact_phone, 
    status, notes
) VALUES
(5, 'Luisa Maria Santos', 'luisa.santos@email.com', '+244 111 222 333', 
 35, 'Feminino', 'Bairro Ecológico, Chipindo', 
 'Ambientalista', 'Associação Ambiental', '', 
 'Vegetariana', 'Carlos Santos', '+244 333 444 555', 
 'confirmed', 'Coordenadora da iniciativa ambiental'),

(5, 'José Manuel Costa', 'jose.costa@email.com', '+244 333 444 555', 
 48, 'Masculino', 'Rua Verde, Chipindo', 
 'Professor', 'Escola Primária', '', 
 '', 'Ana Costa', '+244 666 777 888', 
 'confirmed', 'Professor de ciências naturais'),

(5, 'Maria Antónia Oliveira', 'maria.antonia@email.com', '+244 666 777 888', 
 42, 'Feminino', 'Avenida da Natureza, Chipindo', 
 'Funcionária Pública', 'Direção de Ambiente', '', 
 'Vegetariana', 'João Oliveira', '+244 999 000 111', 
 'attended', 'Funcionária da direção de ambiente'),

(5, 'António Carlos Silva', 'antonio.carlos@email.com', '+244 999 000 111', 
 55, 'Masculino', 'Bairro dos Aposentados, Chipindo', 
 'Aposentado', 'Associação de Aposentados', '', 
 '', 'Maria Silva', '+244 222 333 444', 
 'confirmed', 'Aposentado ativo em causas ambientais'),

(5, 'Isabel Rosa Pereira', 'isabel.rosa@email.com', '+244 222 333 444', 
 31, 'Feminino', 'Rua da Juventude Verde, Chipindo', 
 'Voluntária', 'Grupo de Voluntários Ambientais', '', 
 'Vegana', 'Manuel Pereira', '+244 444 555 666', 
 'pending', 'Voluntária experiente em limpeza comunitária');

-- Atualizar contadores de participantes nos eventos
UPDATE events SET current_participants = 5 WHERE id = 1; -- Festival Cultural
UPDATE events SET current_participants = 4 WHERE id = 2; -- Feira de Agricultura  
UPDATE events SET current_participants = 4 WHERE id = 3; -- Campeonato de Futebol
UPDATE events SET current_participants = 5 WHERE id = 4; -- Workshop de Empreendedorismo
UPDATE events SET current_participants = 5 WHERE id = 5; -- Limpeza Comunitária 