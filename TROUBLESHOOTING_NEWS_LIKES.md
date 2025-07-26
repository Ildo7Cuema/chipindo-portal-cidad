# Troubleshooting - Curtidas não sendo salvas no Supabase

## 🔍 Diagnóstico do Problema

### 1. Verificar se a Tabela Existe

Execute no Supabase SQL Editor:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'news_likes';
```

**Se não retornar nada**: A tabela não foi criada.

### 2. Verificar Console do Navegador

Abra o DevTools (F12) e vá para a aba Console. Clique em curtir uma notícia e verifique:

**Logs esperados**:
- `"Tentando persistir curtida no Supabase..."`
- `"Usuário atual: Público"` ou `"Usuário atual: Autenticado"`
- `"✅ Curtida persistida no banco de dados (usuário público/autenticado)"`

**Logs de erro**:
- `"❌ Erro ao persistir no banco: [erro]"`
- `"📋 Tabela news_likes não existe. Execute o script SQL para criá-la."`

### 3. Verificar Configuração do Supabase

#### A. Verificar URL e Chave
No arquivo `src/integrations/supabase/client.ts`:
```typescript
const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseKey = 'sua-chave-anon'
```

#### B. Testar Conexão
No console do navegador:
```javascript
import { supabase } from '@/integrations/supabase/client';

// Testar conexão básica
const { data, error } = await supabase.from('news').select('id').limit(1);
console.log('Teste de conexão:', { data, error });
```

## 🛠️ Soluções

### Solução 1: Criar a Tabela

Se a tabela não existe, execute no Supabase SQL Editor:

```sql
-- Criar tabela news_likes
CREATE TABLE IF NOT EXISTS public.news_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, user_id)
);

-- Habilitar RLS
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Anyone can view all likes" 
ON public.news_likes FOR SELECT USING (true);

CREATE POLICY "Anyone can insert public likes" 
ON public.news_likes FOR INSERT 
WITH CHECK (user_id = 'anonymous');

CREATE POLICY "Authenticated users can insert their likes" 
ON public.news_likes FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Anyone can delete public likes" 
ON public.news_likes FOR DELETE 
USING (user_id = 'anonymous');

CREATE POLICY "Users can delete their own likes" 
ON public.news_likes FOR DELETE 
USING (auth.uid()::text = user_id);
```

### Solução 2: Verificar Políticas RLS

Execute para verificar as políticas:
```sql
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'news_likes';
```

### Solução 3: Testar Inserção Manual

Execute para testar se as políticas funcionam:
```sql
-- Testar inserção pública
INSERT INTO news_likes (news_id, user_id) 
VALUES ('00000000-0000-0000-0000-000000000000', 'anonymous');

-- Verificar se foi inserido
SELECT * FROM news_likes WHERE user_id = 'anonymous';

-- Limpar teste
DELETE FROM news_likes WHERE news_id = '00000000-0000-0000-0000-000000000000';
```

## 🔧 Debugging Avançado

### 1. Verificar Erros Específicos

No console do navegador, execute:
```javascript
// Testar inserção direta
const { data, error } = await supabase
  .from('news_likes')
  .insert({
    news_id: '00000000-0000-0000-0000-000000000000',
    user_id: 'anonymous'
  });

console.log('Teste de inserção:', { data, error });
```

### 2. Verificar Autenticação

```javascript
// Verificar se o usuário está autenticado
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuário:', user);
```

### 3. Verificar Configuração do Projeto

No Supabase Dashboard:
1. Vá para **Settings** > **API**
2. Verifique se a URL e chave estão corretas
3. Vá para **Authentication** > **Policies**
4. Verifique se as políticas estão ativas

## 📊 Verificações Finais

### Checklist de Verificação

- [ ] Tabela `news_likes` existe
- [ ] RLS está habilitado
- [ ] Políticas estão configuradas
- [ ] URL e chave do Supabase estão corretas
- [ ] Console mostra logs de sucesso
- [ ] localStorage está funcionando
- [ ] Toast de feedback aparece

### Comandos de Verificação

```sql
-- Verificar tabela
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'news_likes'
) as table_exists;

-- Verificar políticas
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'news_likes';

-- Verificar dados
SELECT COUNT(*) as total_likes FROM news_likes;
```

## 🚨 Problemas Comuns

### Problema: "relation does not exist"
**Solução**: Execute o script de criação da tabela

### Problema: "permission denied"
**Solução**: Verifique as políticas RLS

### Problema: "invalid input syntax"
**Solução**: Verifique se o `news_id` é um UUID válido

### Problema: "duplicate key value"
**Solução**: A curtida já existe, isso é normal

## 📞 Próximos Passos

Se o problema persistir:

1. **Execute o script de teste**: `scripts/test-news-likes.sql`
2. **Verifique os logs**: Console do navegador
3. **Teste a conexão**: Verifique URL e chave do Supabase
4. **Verifique as políticas**: Execute as consultas de verificação

O sistema continuará funcionando com localStorage mesmo se o Supabase não estiver configurado corretamente. 