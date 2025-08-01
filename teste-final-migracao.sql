-- Teste Final da Migração: Setor de Turismo e Meio Ambiente
-- Execute este script no SQL Editor do Supabase para verificar se tudo foi criado corretamente

-- 1. Verificar se o setor foi criado
SELECT 
  'Setor Principal' as tipo,
  nome,
  slug,
  ativo,
  cor_primaria,
  cor_secundaria
FROM setores_estrategicos 
WHERE slug = 'turismo-meio-ambiente';

-- 2. Verificar estatísticas
SELECT 
  'Estatísticas' as tipo,
  nome,
  valor,
  icone,
  ordem
FROM setores_estatisticas 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
ORDER BY ordem;

-- 3. Verificar programas
SELECT 
  'Programas' as tipo,
  titulo,
  descricao,
  beneficios,
  requisitos,
  contacto,
  ordem
FROM setores_programas 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
AND ativo = true
ORDER BY ordem;

-- 4. Verificar oportunidades
SELECT 
  'Oportunidades' as tipo,
  titulo,
  descricao,
  requisitos,
  beneficios,
  prazo,
  vagas,
  ordem
FROM setores_oportunidades 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
AND ativo = true
ORDER BY ordem;

-- 5. Verificar infraestruturas
SELECT 
  'Infraestruturas' as tipo,
  nome,
  localizacao,
  capacidade,
  estado,
  equipamentos,
  ordem
FROM setores_infraestruturas 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
AND ativo = true
ORDER BY ordem;

-- 6. Verificar contactos
SELECT 
  'Contactos' as tipo,
  responsavel,
  email,
  telefone,
  horario,
  endereco
FROM setores_contactos 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
);

-- 7. Resumo final
SELECT 
  'RESUMO' as tipo,
  'Setor de Turismo e Meio Ambiente' as nome,
  COUNT(DISTINCT se.id) as total_setores,
  COUNT(DISTINCT ses.id) as total_estatisticas,
  COUNT(DISTINCT sp.id) as total_programas,
  COUNT(DISTINCT so.id) as total_oportunidades,
  COUNT(DISTINCT si.id) as total_infraestruturas,
  COUNT(DISTINCT sc.id) as total_contactos
FROM setores_estrategicos se
LEFT JOIN setores_estatisticas ses ON se.id = ses.setor_id
LEFT JOIN setores_programas sp ON se.id = sp.setor_id AND sp.ativo = true
LEFT JOIN setores_oportunidades so ON se.id = so.setor_id AND so.ativo = true
LEFT JOIN setores_infraestruturas si ON se.id = si.setor_id AND si.ativo = true
LEFT JOIN setores_contactos sc ON se.id = sc.setor_id
WHERE se.slug = 'turismo-meio-ambiente'; 