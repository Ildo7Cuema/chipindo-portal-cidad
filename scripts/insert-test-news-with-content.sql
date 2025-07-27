-- Script para inserir notícias de teste com conteúdo completo
-- Execute este script no Supabase SQL Editor

-- Limpar notícias existentes (opcional)
-- DELETE FROM news WHERE title LIKE '%Teste%';

-- Inserir notícias de teste com conteúdo completo
INSERT INTO news (title, excerpt, content, author_id, published, featured, image_url, created_at, updated_at) VALUES
(
  'Desenvolvimento Sustentável em Chipindo',
  'O município de Chipindo avança com projetos de desenvolvimento sustentável, focando na preservação ambiental e crescimento econômico.',
  'O município de Chipindo tem se destacado nos últimos anos por suas iniciativas de desenvolvimento sustentável. Com uma população crescente e recursos naturais abundantes, a administração municipal tem implementado políticas públicas que equilibram o progresso econômico com a preservação ambiental.

Um dos projetos mais importantes é o programa de agricultura sustentável, que capacita agricultores locais em técnicas modernas de cultivo que respeitam o meio ambiente. Este programa já beneficiou mais de 500 famílias da região, aumentando a produtividade agrícola em 40% nos últimos dois anos.

A infraestrutura também tem recebido atenção especial. Novas estradas rurais foram construídas, conectando comunidades isoladas e facilitando o transporte de produtos agrícolas. O sistema de abastecimento de água foi expandido, garantindo água potável para 90% da população rural.

O turismo sustentável é outra área de foco. Chipindo possui paisagens naturais deslumbrantes, incluindo cachoeiras, montanhas e vales verdejantes. A administração tem investido na criação de trilhas ecológicas e na capacitação de guias locais, criando oportunidades de emprego e preservando a biodiversidade local.

A educação ambiental é prioridade nas escolas municipais. Crianças e jovens aprendem sobre a importância da conservação ambiental e participam de projetos práticos de reflorestamento e reciclagem.

O futuro de Chipindo está sendo construído com base em princípios de sustentabilidade, garantindo que as próximas gerações possam desfrutar de uma região próspera e ambientalmente preservada.',
  '1',
  true,
  true,
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  NOW(),
  NOW()
),
(
  'Melhorias na Educação Municipal',
  'Novas escolas e programas educacionais transformam a realidade educacional de Chipindo.',
  'A educação em Chipindo está passando por uma transformação significativa. Nos últimos meses, foram inauguradas três novas escolas rurais, beneficiando mais de 800 crianças que antes precisavam percorrer longas distâncias para estudar.

As novas escolas seguem padrões modernos de arquitetura escolar, com salas de aula bem iluminadas, bibliotecas equipadas e laboratórios de informática. Cada escola possui também uma quadra poliesportiva e áreas de recreação adequadas para as diferentes faixas etárias.

O programa de capacitação de professores foi ampliado, com cursos regulares sobre metodologias de ensino modernas e uso de tecnologia em sala de aula. Mais de 150 professores participaram de formações este ano, resultando em uma melhoria significativa na qualidade do ensino.

A merenda escolar foi reformulada, seguindo orientações nutricionais que garantem uma alimentação balanceada e adequada ao desenvolvimento das crianças. O programa inclui produtos da agricultura local, fortalecendo a economia rural.

Para os alunos do ensino médio, foi criado um programa de orientação profissional que os prepara para o mercado de trabalho ou para continuar os estudos. Parcerias com empresas locais e instituições de ensino superior foram estabelecidas.

A tecnologia também chegou às escolas rurais, com a instalação de computadores e acesso à internet. Os alunos agora podem participar de aulas online e acessar recursos educacionais digitais.

Os resultados já são visíveis: a taxa de evasão escolar caiu 30% e o desempenho dos alunos melhorou significativamente nos exames nacionais. Chipindo está se tornando referência em educação rural no país.',
  '1',
  true,
  false,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'Saúde Pública: Novos Postos de Atendimento',
  'Ampliação da rede de saúde municipal melhora o acesso aos serviços de saúde em Chipindo.',
  'A rede de saúde municipal de Chipindo foi significativamente ampliada com a inauguração de dois novos postos de saúde e a reforma completa do hospital municipal. Estas melhorias representam um investimento de mais de 2 milhões de dólares em infraestrutura de saúde.

Os novos postos de saúde estão localizados estrategicamente para atender comunidades que antes tinham dificuldade de acesso aos serviços médicos. Cada posto possui equipes multidisciplinares, incluindo médicos, enfermeiros, técnicos de laboratório e agentes comunitários de saúde.

O hospital municipal foi completamente reformado e equipado com tecnologia moderna. Novas alas foram construídas, incluindo uma maternidade com 20 leitos, uma unidade de terapia intensiva e um centro cirúrgico com duas salas de operação.

O programa de vacinação foi ampliado e agora inclui campanhas regulares contra doenças comuns na região. A cobertura vacinal atingiu 95% da população, contribuindo para a erradicação de várias doenças infecciosas.

A atenção primária à saúde foi fortalecida com o programa "Saúde na Comunidade", que leva serviços médicos básicos até as comunidades mais remotas. Equipes móveis visitam regularmente as aldeias, realizando consultas, exames preventivos e educação em saúde.

A maternidade do hospital municipal foi reconhecida como "Hospital Amigo da Criança" pela Organização Mundial da Saúde, garantindo que mães e bebês recebam cuidados adequados durante o parto e pós-parto.

O programa de combate à desnutrição infantil foi implementado com sucesso, reduzindo a taxa de desnutrição em 60% nos últimos dois anos. Crianças em risco recebem acompanhamento nutricional e suplementação alimentar.

A saúde mental também recebe atenção especial, com psicólogos disponíveis em todos os postos de saúde e um programa de prevenção ao suicídio que já salvou muitas vidas.

Estas melhorias na saúde pública estão resultando em uma população mais saudável e produtiva, contribuindo para o desenvolvimento sustentável de Chipindo.',
  '1',
  true,
  false,
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);

-- Verificar se as notícias foram inseridas
SELECT 
  id,
  title,
  excerpt,
  LENGTH(content) as content_length,
  image_url,
  published,
  created_at
FROM news 
WHERE title LIKE '%Chipindo%'
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position; 