# Correção do Erro 400 no Modal de Inscrição

## Problema Identificado

Ao clicar no botão "Confirmar Inscrição" no modal de concursos, está ocorrendo o seguinte erro:

```
POST https://murdhrdqqnuntfxmwtqx.supabase.co/rest/v1/inscricoes 400 (Bad Request)
```

## Causa Raiz

O erro 400 (Bad Request) está sendo causado porque:

1. **A tabela `inscricoes` existe** no banco de dados
2. **A coluna `categoria` não existe** na tabela `inscricoes`
3. **O frontend está tentando inserir** dados com a coluna `categoria`
4. **O Supabase rejeita** a inserção porque a coluna não existe

### Estrutura Atual da Tabela `inscricoes`

```sql
-- Colunas existentes:
- id (UUID, PRIMARY KEY)
- concurso_id (UUID, FOREIGN KEY)
- nome_completo (TEXT)
- bilhete_identidade (TEXT)
- data_nascimento (DATE)
- telefone (TEXT)
- email (TEXT)
- observacoes (TEXT)
- arquivos (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

-- Coluna FALTANDO:
- categoria (TEXT) ❌
```

### Dados que o Frontend Está Tentando Inserir

```typescript
{
  concurso_id: "0ea64698-1636-4779-a675-b216c57f884b",
  nome_completo: "João Silva",
  bilhete_identidade: "123456789",
  data_nascimento: "1990-01-01",
  telefone: "123456789",
  email: "joao@teste.com",
  observacoes: "Teste de inscrição",
  categoria: "Professor de Matemática", // ❌ Esta coluna não existe
  arquivos: [...]
}
```

## Solução

### Passo 1: Acessar o Painel do Supabase

1. Acesse: https://supabase.com/dashboard/project/murdhrdqqnuntfxmwtqx
2. Faça login com suas credenciais

### Passo 2: Ir para SQL Editor

1. No menu lateral, clique em "SQL Editor"
2. Clique em "New query"

### Passo 3: Executar a Migração

Cole e execute o seguinte SQL:

```sql
-- Adicionar coluna categoria à tabela inscricoes
ALTER TABLE public.inscricoes 
ADD COLUMN categoria TEXT;

-- Adicionar comentário à coluna
COMMENT ON COLUMN public.inscricoes.categoria IS 'Categoria selecionada pelo candidato no concurso';

-- Criar índice para melhorar performance de consultas por categoria
CREATE INDEX IF NOT EXISTS idx_inscricoes_categoria ON public.inscricoes(categoria);
```

### Passo 4: Verificar a Execução

1. Clique em "Run" para executar
2. Verifique se não há erros na execução
3. A mensagem deve ser: "Success. No rows returned"

## Verificação da Correção

### Teste 1: Verificar se a Coluna Foi Criada

Execute no SQL Editor:

```sql
-- Verificar se a coluna categoria existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inscricoes' 
AND column_name = 'categoria';
```

**Resultado esperado:**
```
column_name | data_type | is_nullable
------------|-----------|-------------
categoria   | text      | YES
```

### Teste 2: Testar Inserção com Categoria

Execute no SQL Editor:

```sql
-- Testar inserção com categoria
INSERT INTO public.inscricoes (
  concurso_id,
  nome_completo,
  bilhete_identidade,
  data_nascimento,
  telefone,
  email,
  observacoes,
  categoria,
  arquivos
) VALUES (
  '0ea64698-1636-4779-a675-b216c57f884b',
  'Teste Categoria',
  '123456789',
  '1990-01-01',
  '123456789',
  'teste@categoria.com',
  'Teste da nova coluna',
  'Professor de Matemática',
  '[{"name": "teste.pdf", "size": 1024, "type": "application/pdf", "url": "https://example.com/teste.pdf"}]'
);

-- Verificar se foi inserido
SELECT id, nome_completo, categoria FROM public.inscricoes WHERE email = 'teste@categoria.com';

-- Limpar dados de teste
DELETE FROM public.inscricoes WHERE email = 'teste@categoria.com';
```

## Resultado Esperado

Após aplicar a migração:

1. ✅ **Erro 400 resolvido** - O modal de inscrição funcionará normalmente
2. ✅ **Categoria salva** - A categoria selecionada será persistida no banco
3. ✅ **Dados consistentes** - Todas as inscrições terão a categoria registrada
4. ✅ **Performance otimizada** - Índice criado para consultas por categoria

## Arquivos Envolvidos

### Frontend (Já Funcionando)
- `src/pages/Concursos.tsx` - Modal de inscrição
- `src/components/admin/ConcursosManager.tsx` - Gestão de concursos

### Banco de Dados (Precisa de Correção)
- Tabela `inscricoes` - Adicionar coluna `categoria`

### Migração Criada
- `supabase/migrations/20250805000000-add-categoria-to-inscricoes.sql`

## Fluxo Completo Após Correção

1. **Usuário seleciona concurso** → Modal abre
2. **Usuário preenche dados** → Incluindo categoria
3. **Usuário clica "Confirmar"** → Dados enviados para Supabase
4. **Supabase salva dados** → Incluindo categoria na nova coluna
5. **Sucesso** → Modal fecha, toast de confirmação

## Observações Importantes

- A migração é **segura** e não afeta dados existentes
- A coluna `categoria` será `NULL` para inscrições antigas
- O índice melhora a performance de consultas por categoria
- A correção é **permanente** e resolve o problema definitivamente 