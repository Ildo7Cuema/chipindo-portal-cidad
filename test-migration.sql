-- Teste da migração do setor de Turismo e Meio Ambiente
-- Execute este script no SQL Editor do Supabase para testar

-- 1. Testar se o setor já existe
SELECT * FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente';

-- 2. Se não existir, executar a migração
-- Copie e cole o conteúdo do arquivo 20250725000012-create-turismo-meio-ambiente.sql aqui

-- 3. Verificar se foi criado
SELECT 
  nome,
  slug,
  ativo,
  cor_primaria,
  cor_secundaria
FROM setores_estrategicos 
WHERE slug = 'turismo-meio-ambiente';

-- 4. Verificar estatísticas
SELECT 
  nome,
  valor,
  icone,
  ordem
FROM setores_estatisticas 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
ORDER BY ordem;

-- 5. Verificar programas
SELECT 
  titulo,
  descricao,
  ordem
FROM setores_programas 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
AND ativo = true
ORDER BY ordem;

-- 6. Verificar oportunidades
SELECT 
  titulo,
  vagas,
  prazo,
  ordem
FROM setores_oportunidades 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
AND ativo = true
ORDER BY ordem;

-- 7. Verificar infraestruturas
SELECT 
  nome,
  localizacao,
  capacidade,
  estado,
  ordem
FROM setores_infraestruturas 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
)
AND ativo = true
ORDER BY ordem;

-- 8. Verificar contactos
SELECT 
  responsavel,
  email,
  telefone,
  horario
FROM setores_contactos 
WHERE setor_id = (
  SELECT id FROM setores_estrategicos WHERE slug = 'turismo-meio-ambiente'
); 