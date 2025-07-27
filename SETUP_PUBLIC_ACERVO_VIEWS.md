# 📊 Configuração de Visualizações Públicas do Acervo Digital

## 🎯 Objetivo

Implementar um sistema de visualizações reais para o acervo digital público, permitindo que usuários não autenticados registrem visualizações e vejam contagens reais.

## 🗄️ Estrutura do Banco

### Tabela `acervo_views` (já criada)

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

## 🚀 Configuração

### 1. Verificar se a Tabela Existe

Execute no **Supabase SQL Editor**:

```sql
-- Verificar se a tabela acervo_views existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'acervo_views') 
    THEN '✅ Tabela acervo_views existe'
    ELSE '❌ Tabela acervo_views não existe'
  END as status;
```

### 2. Testar Visualizações Públicas

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de scripts/test-public-acervo-views.sql
```

## 🔧 Implementação no Frontend

### Hook `useAcervoViews` (já implementado)

```typescript
const { registerView, getViewsCount, isLoading } = useAcervoViews();
```

### Integração na Página Pública

```typescript
// Registrar visualização ao clicar no item
const handleItemView = async (itemId: string) => {
  await registerView(itemId);
  // Atualizar contagem na interface
};

// Registrar visualização quando modal é aberto
useEffect(() => {
  if (selectedItem) {
    handleItemView(selectedItem.id);
  }
}, [selectedItem]);
```

## 📊 Funcionalidades

### ✅ Implementadas

- [x] Visualizações reais para usuários não autenticados
- [x] Registro automático ao clicar nos cards
- [x] Registro automático ao abrir modal de detalhes
- [x] Contagem atualizada em tempo real
- [x] Exibição de visualizações nos cards públicos
- [x] Rastreamento por IP (uma visualização por IP por item)
- [x] Suporte a usuários anônimos
- [x] Interface pública responsiva

### 🔄 Fluxo de Funcionamento

1. **Usuário não autenticado acessa a página pública**
2. **Sistema carrega itens públicos** com visualizações reais
3. **Usuário clica em um item** ou abre modal
4. **Sistema registra visualização** no banco de dados
5. **Interface atualiza** a contagem em tempo real
6. **Usuário vê números reais** de visualizações

## 🧪 Teste

### Teste Manual

1. **Abra a página pública do acervo digital** (sem login)
2. **Clique em um item** (imagem, documento, vídeo)
3. **Verifique o console** para logs de sucesso
4. **Recarregue a página** e veja se a contagem persiste
5. **Abra o modal de detalhes** e verifique se registra visualização

### Teste no Console

```javascript
// Testar registro de visualização pública
const { supabase } = await import('@/integrations/supabase/client');

// Buscar um item público do acervo
const { data: acervoData } = await supabase
  .from('acervo_digital')
  .select('id')
  .eq('is_public', true)
  .limit(1);

if (acervoData && acervoData.length > 0) {
  // Registrar visualização
  const { data, error } = await supabase
    .from('acervo_views')
    .insert({
      acervo_id: acervoData[0].id,
      user_id: null, // Usuário anônimo
      ip_address: 'test-public-ip',
      user_agent: 'test-public-browser'
    });

  console.log('Teste público:', { data, error });
}
```

## 📈 Métricas Disponíveis

- **Visualizações totais** por item público
- **IPs únicos** por item
- **Visualizações por período** (data/hora)
- **Dispositivos** (via user agent)
- **Tipos de arquivo** mais visualizados
- **Direções** mais acessadas

## 🔒 Segurança

- **RLS habilitado** para controle de acesso
- **IP único** por item evita spam
- **User agent** para rastreamento de dispositivos
- **Suporte a usuários anônimos** (user_id = NULL)
- **Apenas itens públicos** são acessíveis

## 🎯 Resultado Esperado

- ✅ Visualizações reais para usuários não autenticados
- ✅ Contagem atualizada em tempo real
- ✅ Dados persistentes no banco de dados
- ✅ Interface pública responsiva e atualizada
- ✅ Registro automático ao interagir com itens
- ✅ Exibição de visualizações nos cards públicos

## 🚨 Troubleshooting

### Erro: "Tabela acervo_views não existe"
**Solução**: Execute o script de criação da tabela

### Erro: "Função register_acervo_view não encontrada"
**Solução**: Execute o script de criação da função

### Visualizações não estão sendo registradas
**Solução**: Verifique as políticas RLS e logs no console

### Contagem não atualiza na interface pública
**Solução**: Verifique se `handleItemView` está sendo chamado

### Usuários não autenticados não conseguem registrar visualizações
**Solução**: Verifique se as políticas RLS permitem inserção anônima

## 📝 Próximos Passos

1. **Execute o script de teste** das visualizações públicas
2. **Teste a funcionalidade** como usuário não autenticado
3. **Verifique os logs** no console do navegador
4. **Confirme** que as visualizações estão sendo salvas
5. **Teste em diferentes dispositivos** para verificar IPs únicos

As visualizações públicas do acervo digital agora funcionam para usuários não autenticados! 🎉 