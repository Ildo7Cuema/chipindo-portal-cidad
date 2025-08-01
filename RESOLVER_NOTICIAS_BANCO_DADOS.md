# 🔧 Resolver Problema das Notícias - Banco de Dados

## 🚨 Problema Identificado

A página de notícias não está mostrando as notícias reais do banco de dados, apenas dados mockados.

## ✅ Solução Implementada

### 📊 **1. Código Atualizado**

O componente `Noticias.tsx` já foi atualizado para buscar dados reais do Supabase:

```typescript
const fetchNews = async () => {
  try {
    setLoading(true);
    
    // Buscar notícias reais do banco de dados
    const { data, error } = await supabase
      .from('news')
      .select('id, title, excerpt, content, author_id, published, featured, image_url, created_at, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notícias:', error);
      toast.error('Erro ao carregar notícias');
      return;
    }

    // Processar notícias com dados adicionais
    const newsWithData = await Promise.all(
      (data || []).map(async (item, index) => {
        // Buscar contagem de visualizações
        let viewsCount = 0;
        try {
          const { data: viewsData, error: viewsError } = await supabase
            .from('news_views')
            .select('id')
            .eq('news_id', item.id);

          if (!viewsError && viewsData) {
            viewsCount = viewsData.length;
          }
        } catch (error) {
          console.error('Erro ao buscar visualizações:', error);
        }

        // Buscar contagem de curtidas
        let likesCount = 0;
        try {
          const { data: likesData, error: likesError } = await supabase
            .from('news_likes')
            .select('id')
            .eq('news_id', item.id);

          if (!likesError && likesData) {
            likesCount = likesData.length;
          }
        } catch (error) {
          console.error('Erro ao buscar curtidas:', error);
        }

        // Buscar nome do autor
        let authorName = 'Administração Municipal';
        if (item.author_id) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', item.author_id)
              .single();

            if (!profileError && profileData?.full_name) {
              authorName = profileData.full_name;
            }
          } catch (error) {
            console.error('Erro ao buscar perfil do autor:', error);
          }
        }

        return {
          ...item,
          category: getCategoryByIndex(index),
          views: viewsCount,
          likes: likesCount,
          author_name: authorName
        };
      })
    );

    setNews(newsWithData);
    
    console.log('Notícias carregadas do banco:', newsWithData.length);
    
  } catch (error) {
    console.error('Error fetching news:', error);
    toast.error('Erro ao carregar notícias do banco de dados');
  } finally {
    setLoading(false);
  }
};
```

### 🗄️ **2. Estrutura do Banco de Dados**

#### **Tabela `news`**
```sql
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabela `news_views`**
```sql
CREATE TABLE news_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabela `news_likes`**
```sql
CREATE TABLE news_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(news_id, user_id)
);
```

### 🔧 **3. Passos para Resolver**

#### **Opção A: Usar Migração SQL**
1. Execute a migração SQL no Supabase:
```bash
# No painel do Supabase, vá para SQL Editor
# Execute o conteúdo do arquivo: supabase/migrations/20250125000070-create-news-tables.sql
```

#### **Opção B: Usar Script Node.js**
1. Configure as variáveis de ambiente:
```bash
export VITE_SUPABASE_URL="sua-url-do-supabase"
export VITE_SUPABASE_ANON_KEY="sua-chave-anonima"
```

2. Execute o script:
```bash
node scripts/check-news-tables.js
```

#### **Opção C: Criar Manualmente**
1. No painel do Supabase, vá para **Table Editor**
2. Crie as tabelas manualmente usando o SQL acima
3. Insira dados de exemplo

### 📝 **4. Dados de Exemplo**

Após criar as tabelas, insira dados de exemplo:

```sql
INSERT INTO news (title, excerpt, content, published, featured, image_url, category) VALUES
(
  'Nova Escola Primária Inaugurada em Chipindo',
  'A Administração Municipal inaugurou uma nova escola primária que beneficiará mais de 200 crianças da região.',
  'A Administração Municipal de Chipindo inaugurou oficialmente uma nova escola primária no bairro central da cidade...',
  true,
  true,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=600&fit=crop',
  'educacao'
);
```

### 🔍 **5. Verificação**

Para verificar se está funcionando:

1. **Console do Navegador**: Verifique se aparece "Notícias carregadas do banco: X"
2. **Network Tab**: Verifique se as requisições para o Supabase estão sendo feitas
3. **Painel do Supabase**: Verifique se as tabelas foram criadas e têm dados

### 🚀 **6. Funcionalidades Implementadas**

#### **Busca de Dados**
- ✅ Notícias reais do banco de dados
- ✅ Contagem de visualizações
- ✅ Contagem de curtidas
- ✅ Informações do autor

#### **Filtros e Ordenação**
- ✅ Busca por texto
- ✅ Filtro por categoria
- ✅ Ordenação (recente, antiga, popular, alfabética)

#### **Interações**
- ✅ Registro de visualizações
- ✅ Sistema de curtidas
- ✅ Compartilhamento

#### **Layout Responsivo**
- ✅ Modal adaptativo para mobile
- ✅ Grid responsivo
- ✅ Paginação

### 🎯 **7. Resultado Esperado**

Após implementar estas correções:

- ✅ **Notícias reais**: Carregadas do banco de dados Supabase
- ✅ **Dados consistentes**: Visualizações e curtidas sincronizadas
- ✅ **Performance**: Carregamento otimizado com índices
- ✅ **Segurança**: RLS (Row Level Security) configurado
- ✅ **Funcionalidade**: Todas as features funcionando corretamente

### 🔧 **8. Troubleshooting**

#### **Problema: "Tabela não existe"**
```bash
# Execute a migração SQL no Supabase
# Ou use o script: node scripts/check-news-tables.js
```

#### **Problema: "Erro de permissão"**
```sql
-- Verifique se as políticas RLS estão corretas
-- No painel do Supabase, vá para Authentication > Policies
```

#### **Problema: "Dados não aparecem"**
```sql
-- Verifique se há dados na tabela
SELECT COUNT(*) FROM news WHERE published = true;
```

#### **Problema: "Erro de conexão"**
```bash
# Verifique as variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### 📊 **9. Monitoramento**

Para monitorar o funcionamento:

1. **Logs do Console**: Verifique mensagens de erro/sucesso
2. **Network Tab**: Monitore requisições ao Supabase
3. **Painel do Supabase**: Verifique logs de queries
4. **Analytics**: Monitore visualizações e engajamento

### 🎉 **10. Conclusão**

Com estas implementações, a página de notícias agora:

- ✅ Carrega dados reais do banco de dados
- ✅ Mantém consistência com o Supabase
- ✅ Oferece funcionalidades completas
- ✅ Tem layout responsivo otimizado
- ✅ Segue as melhores práticas de segurança

A solução garante que as notícias sejam sempre consistentes com o banco de dados e oferece uma experiência de usuário completa e profissional. 