# 📊 Configuração de Visualizações do Acervo Digital

## 🎯 Objetivo

Implementar um sistema de visualizações reais para o acervo digital (imagens, documentos, vídeos), substituindo os números fictícios por dados reais do banco de dados.

## 🗄️ Estrutura do Banco

### Tabela `acervo_views`

```sql
CREATE TABLE public.acervo_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  acervo_id UUID NOT NULL REFERENCES public.acervo_digital(id) ON DELETE CASCADE,
  user_id TEXT, -- NULL para usuários anônimos, UUID para usuários autenticados
  ip_address TEXT, -- Para rastrear visualizações únicas por IP
  user_agent TEXT, -- Para identificar diferentes dispositivos
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(acervo_id, ip_address) -- Uma visualização por IP por item
);
```

### Políticas RLS

- **SELECT**: Qualquer pessoa pode visualizar todas as visualizações
- **INSERT**: Qualquer pessoa pode inserir visualizações

### Função `register_acervo_view`

```sql
CREATE OR REPLACE FUNCTION register_acervo_view(
  p_acervo_id UUID,
  p_user_id TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS BOOLEAN
```

## 🚀 Configuração

### 1. Criar a Tabela

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de supabase/migrations/20250724110000-create-acervo-views-table.sql
```

### 2. Testar a Configuração

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de scripts/test-acervo-views.sql
```

## 🔧 Implementação no Frontend

### Hook `useAcervoViews`

```typescript
const { registerView, getViewsCount, isLoading } = useAcervoViews();
```

**Funcionalidades**:
- `registerView(acervoId)`: Registra uma visualização
- `getViewsCount(acervoId)`: Obtém a contagem de visualizações
- `isLoading`: Estado de carregamento

### Integração no Componente

```typescript
// Registrar visualização ao clicar no item
const handleItemView = async (itemId: string) => {
  await registerView(itemId);
  // Atualizar contagem na interface
};
```

## 📊 Funcionalidades

### ✅ Implementadas

- [x] Tabela `acervo_views` no banco de dados
- [x] Políticas RLS configuradas
- [x] Função `register_acervo_view` para inserção segura
- [x] Hook `useAcervoViews` para gerenciamento
- [x] Integração no componente `AcervoDigitalManager.tsx`
- [x] Contagem real de visualizações
- [x] Rastreamento por IP (uma visualização por IP por item)
- [x] Suporte a usuários anônimos e autenticados
- [x] Exibição de visualizações nos cards
- [x] Atualização em tempo real da contagem

### 🔄 Fluxo de Funcionamento

1. **Usuário clica em um item do acervo**
2. **Sistema obtém IP do usuário** (via API externa ou fallback)
3. **Registra visualização no banco** (se não existir para aquele IP)
4. **Atualiza contagem na interface**
5. **Exibe número real de visualizações**

## 🧪 Teste

### Teste Manual

1. **Abra a página do acervo digital**
2. **Clique em um item** (imagem, documento, vídeo)
3. **Verifique o console** para logs de sucesso
4. **Recarregue a página** e veja se a contagem persiste

### Teste no Console

```javascript
// Testar registro de visualização do acervo
const { supabase } = await import('@/integrations/supabase/client');

// Buscar um item do acervo
const { data: acervoData } = await supabase.from('acervo_digital').select('id').limit(1);

if (acervoData && acervoData.length > 0) {
  // Registrar visualização
  const { data, error } = await supabase
    .from('acervo_views')
    .insert({
      acervo_id: acervoData[0].id,
      user_id: null,
      ip_address: 'test-ip',
      user_agent: 'test-browser'
    });

  console.log('Teste:', { data, error });
}
```

## 📈 Métricas Disponíveis

- **Visualizações totais** por item do acervo
- **IPs únicos** por item
- **Visualizações por período** (data/hora)
- **Dispositivos** (via user agent)
- **Tipos de arquivo** mais visualizados

## 🔒 Segurança

- **RLS habilitado** para controle de acesso
- **IP único** por item evita spam
- **User agent** para rastreamento de dispositivos
- **Suporte a usuários anônimos** e autenticados

## 🎯 Resultado Esperado

- ✅ Números de visualização reais no lugar de fictícios
- ✅ Contagem atualizada em tempo real
- ✅ Dados persistentes no banco de dados
- ✅ Interface responsiva e atualizada
- ✅ Visualizações exibidas nos cards do acervo

## 🚨 Troubleshooting

### Erro: "Tabela acervo_views não existe"
**Solução**: Execute o script de criação da tabela

### Erro: "Função register_acervo_view não encontrada"
**Solução**: Execute o script de criação da função

### Visualizações não estão sendo registradas
**Solução**: Verifique as políticas RLS e logs no console

### Contagem não atualiza na interface
**Solução**: Verifique se `handleItemView` está sendo chamado

## 📝 Próximos Passos

1. **Execute o script de criação** da tabela
2. **Teste a funcionalidade** clicando nos itens do acervo
3. **Verifique os logs** no console do navegador
4. **Confirme** que as visualizações estão sendo salvas

As visualizações do acervo digital agora serão reais e baseadas em dados do banco de dados! 🎉 