-- ============================================================
-- SEED: Novos Sectores Estratégicos - Chipindo Portal
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

INSERT INTO setores_estrategicos
  (nome, slug, descricao, visao, missao, cor_primaria, cor_secundaria, icone, ordem, ativo)
VALUES
  (
    'Recursos Humanos',
    'recursos-humanos',
    'Gestão e desenvolvimento do capital humano da Administração Municipal de Chipindo, promovendo a valorização dos funcionários públicos e a melhoria dos serviços prestados.',
    'Ser referência em gestão de recursos humanos, promovendo um serviço público eficiente e comprometido.',
    'Gerir, valorizar e desenvolver o capital humano da administração municipal, garantindo um serviço público de qualidade.',
    '#6366F1', '#4F46E5', 'Users2', 9, true
  ),
  (
    'Gabinete Jurídico',
    'juridico',
    'Assessoria jurídica e legal à Administração Municipal de Chipindo, garantindo a conformidade legal de todos os actos administrativos.',
    'Ser referência em assessoria jurídica municipal, garantindo a legalidade e transparência da administração.',
    'Prestar assessoria jurídica de qualidade, assegurando que todos os actos administrativos estejam em conformidade com a lei.',
    '#64748B', '#475569', 'Scale', 10, true
  ),
  (
    'Infraestrutura e Obras',
    'infraestrutura',
    'Planificação, execução e manutenção das obras e infraestruturas públicas do Município de Chipindo.',
    'Ser referência em gestão de infraestruturas, garantindo obras de qualidade e durabilidade.',
    'Planificar, executar e manter as infraestruturas públicas do município, melhorando a qualidade de vida dos cidadãos.',
    '#F97316', '#EA580C', 'Building2', 11, true
  ),
  (
    'Transportes e Comunicações',
    'transporte',
    'Gestão e regulação dos transportes públicos e das comunicações no Município de Chipindo.',
    'Garantir um sistema de transportes eficiente, seguro e acessível a todos os cidadãos.',
    'Regular e desenvolver o sector de transportes e comunicações, promovendo a mobilidade e conectividade do município.',
    '#0EA5E9', '#0284C7', 'Truck', 12, true
  ),
  (
    'Ambiente e Recursos Naturais',
    'ambiente',
    'Protecção ambiental e gestão sustentável dos recursos naturais do Município de Chipindo.',
    'Ser referência em gestão ambiental, garantindo um ambiente saudável e sustentável para as gerações futuras.',
    'Proteger o ambiente e gerir de forma sustentável os recursos naturais do município, promovendo o desenvolvimento sustentável.',
    '#22C55E', '#16A34A', 'Leaf', 13, true
  ),
  (
    'Urbanismo e Ordenamento',
    'urbanismo',
    'Planeamento urbano e ordenamento do território do Município de Chipindo, promovendo um crescimento urbano ordenado e sustentável.',
    'Ser referência em urbanismo, garantindo um desenvolvimento urbano ordenado, inclusivo e sustentável.',
    'Planear e ordenar o território municipal, garantindo um crescimento urbano harmonioso e de qualidade.',
    '#F59E0B', '#D97706', 'Building', 14, true
  ),
  (
    'Fiscalização Municipal',
    'fiscalizacao',
    'Controlo, inspecção e fiscalização das actividades e estabelecimentos no Município de Chipindo.',
    'Ser referência em fiscalização municipal, garantindo o cumprimento das normas e regulamentos.',
    'Fiscalizar e controlar as actividades no município, garantindo o cumprimento da legislação e a protecção dos cidadãos.',
    '#EF4444', '#DC2626', 'Search', 15, true
  ),
  (
    'ANIESA',
    'aniesa',
    'Acção social, assistência e apoio às famílias vulneráveis do Município de Chipindo.',
    'Ser referência em acção social, garantindo apoio e assistência a todas as famílias vulneráveis.',
    'Prestar serviços de acção social e assistência às famílias vulneráveis, promovendo a inclusão e o bem-estar social.',
    '#14B8A6', '#0D9488', 'Shield', 16, true
  )
ON CONFLICT (slug) DO NOTHING;
