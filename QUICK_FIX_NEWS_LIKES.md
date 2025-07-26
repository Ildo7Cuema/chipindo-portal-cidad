# 🔧 Correção Rápida - Erro UUID nas Curtidas

## 🚨 Problema Identificado

O erro `invalid input syntax for type uuid: "anonymous"` indica que o campo `user_id` na tabela `news_likes` está definido como UUID, mas estamos tentando inserir "anonymous" (string).

## ✅ Soluções

### Opção 1: Recriar a Tabela (Recomendado)

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de scripts/recreate-news-likes-table.sql
```

**Vantagens**:
- ✅ Resolve o problema definitivamente
- ✅ Configura tudo corretamente desde o início
- ✅ Remove qualquer configuração incorreta anterior
- ✅ Não tem constraint de foreign key (mais flexível)

### Opção 2: Recriar com Foreign Key

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de scripts/recreate-news-likes-with-fk.sql
```

**Vantagens**:
- ✅ Mantém integridade referencial
- ✅ Cria notícia de teste se necessário
- ✅ Adiciona foreign key constraint automaticamente

### Opção 3: Corrigir a Tabela Existente

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de scripts/fix-news-likes-user-id.sql
```

**Nota**: Esta opção pode falhar se houver políticas RLS dependendo da coluna.

## 🧪 Teste Rápido

Após executar o script, teste no console do navegador:

```javascript
// Testar inserção de curtida pública
const { supabase } = await import('@/integrations/supabase/client');

// Primeiro, buscar um news_id válido
const { data: newsData } = await supabase.from('news').select('id').limit(1);

if (newsData && newsData.length > 0) {
  const { data, error } = await supabase
    .from('news_likes')
    .insert({
      news_id: newsData[0].id,
      user_id: 'anonymous'
    });

  console.log('Teste:', { data, error });
} else {
  console.log('Nenhuma notícia encontrada para teste');
}
```

**Resultado esperado**: `{ data: [...], error: null }`

## 📋 Checklist de Verificação

- [ ] Execute o script SQL no Supabase
- [ ] Verifique se não há erros no console
- [ ] Teste a inserção manual no console
- [ ] Clique em curtir uma notícia
- [ ] Verifique se aparece "✅ Curtida persistida no banco de dados"

## 🔍 Verificação no Banco

Execute no Supabase SQL Editor:

```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'news_likes';

-- Verificar políticas
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'news_likes';

-- Verificar se há notícias para testar
SELECT COUNT(*) as total_news FROM news;
```

**Resultado esperado**:
- `user_id` deve ser `TEXT`
- Deve ter 5 políticas configuradas
- Deve ter pelo menos uma notícia na tabela `news`

## 🚨 Se o Erro Persistir

Se ainda houver problemas com políticas RLS ou foreign key, use a **Opção 1** (recriar tabela sem foreign key) que é a mais segura e resolve todos os problemas de uma vez.

## 🎯 Próximos Passos

1. **Execute o script de recriação** (Opção 1 recomendada)
2. **Teste a funcionalidade**
3. **Verifique os logs no console**
4. **Confirme que as curtidas estão sendo salvas**

O problema será resolvido e as curtidas funcionarão tanto para usuários públicos quanto autenticados! 