# 📊 Configuração de Visualizações de Notícias

## 🎯 Objetivo

Implementar um sistema de visualizações reais para as notícias, substituindo os números fictícios por dados reais do banco de dados.

## 🗄️ Estrutura do Banco

### Tabela `news_views`

```sql
CREATE TABLE public.news_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id TEXT, -- NULL para usuários anônimos, UUID para usuários autenticados
  ip_address TEXT, -- Para rastrear visualizações únicas por IP
  user_agent TEXT, -- Para identificar diferentes dispositivos
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, ip_address) -- Uma visualização por IP por notícia
);
```

### Políticas RLS

- **SELECT**: Qualquer pessoa pode visualizar todas as visualizações
- **INSERT**: Qualquer pessoa pode inserir visualizações

### Função `register_news_view`

```sql
CREATE OR REPLACE FUNCTION register_news_view(
  p_news_id UUID,
  p_user_id TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS BOOLEAN
```

## 🚀 Configuração

### 1. Criar a Tabela

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de supabase/migrations/20250724100000-create-news-views-table.sql
```

### 2. Testar a Configuração

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de scripts/test-news-views.sql
```

## 🔧 Implementação no Frontend

### Hook `useNewsViews`

```typescript
const { registerView, getViewsCount, isLoading } = useNewsViews();
```

**Funcionalidades**:
- `registerView(newsId)`: Registra uma visualização
- `getViewsCount(newsId)`: Obtém a contagem de visualizações
- `isLoading`: Estado de carregamento

### Integração no Componente

```typescript
// Registrar visualização ao clicar na notícia
const handleNewsClick = async (newsId: string) => {
  await registerView(newsId);
  // Atualizar contagem na interface
};
```

## 📊 Funcionalidades

### ✅ Implementadas

- [x] Tabela `news_views` no banco de dados
- [x] Políticas RLS configuradas
- [x] Função `register_news_view` para inserção segura
- [x] Hook `useNewsViews` para gerenciamento
- [x] Integração no componente `Noticias.tsx`
- [x] Contagem real de visualizações
- [x] Rastreamento por IP (uma visualização por IP por notícia)
- [x] Suporte a usuários anônimos e autenticados

### 🔄 Fluxo de Funcionamento

1. **Usuário clica em uma notícia**
2. **Sistema obtém IP do usuário** (via API externa ou fallback)
3. **Registra visualização no banco** (se não existir para aquele IP)
4. **Atualiza contagem na interface**
5. **Exibe número real de visualizações**

## 🧪 Teste

### Teste Manual

1. **Abra a página de notícias**
2. **Clique em uma notícia**
3. **Verifique o console** para logs de sucesso
4. **Recarregue a página** e veja se a contagem persiste

### Teste no Console

```javascript
// Testar registro de visualização
const { supabase } = await import('@/integrations/supabase/client');

// Buscar uma notícia
const { data: newsData } = await supabase.from('news').select('id').limit(1);

if (newsData && newsData.length > 0) {
  // Registrar visualização
  const { data, error } = await supabase
    .from('news_views')
    .insert({
      news_id: newsData[0].id,
      user_id: null,
      ip_address: 'test-ip',
      user_agent: 'test-browser'
    });

  console.log('Teste:', { data, error });
}
```

## 📈 Métricas Disponíveis

- **Visualizações totais** por notícia
- **IPs únicos** por notícia
- **Visualizações por período** (data/hora)
- **Dispositivos** (via user agent)

## 🔒 Segurança

- **RLS habilitado** para controle de acesso
- **IP único** por notícia evita spam
- **User agent** para rastreamento de dispositivos
- **Suporte a usuários anônimos** e autenticados

## 🎯 Resultado Esperado

- ✅ Números de visualização reais no lugar de fictícios
- ✅ Contagem atualizada em tempo real
- ✅ Dados persistentes no banco de dados
- ✅ Interface responsiva e atualizada

## 🚨 Troubleshooting

### Erro: "Tabela news_views não existe"
**Solução**: Execute o script de criação da tabela

### Erro: "Função register_news_view não encontrada"
**Solução**: Execute o script de criação da função

### Visualizações não estão sendo registradas
**Solução**: Verifique as políticas RLS e logs no console

### Contagem não atualiza na interface
**Solução**: Verifique se `handleNewsClick` está sendo chamado

## 📝 Próximos Passos

1. **Execute o script de criação** da tabela
2. **Teste a funcionalidade** clicando nas notícias
3. **Verifique os logs** no console do navegador
4. **Confirme** que as visualizações estão sendo salvas

As visualizações agora serão reais e baseadas em dados do banco de dados! 🎉 