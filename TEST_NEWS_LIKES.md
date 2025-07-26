# Guia de Teste - Funcionalidade de Curtidas

## 🧪 Como Testar

### 1. Teste como Usuário Público (Não Autenticado)

1. **Abra a aplicação em modo incógnito**
2. **Vá para a página de Notícias**
3. **Clique no botão de curtir** em qualquer notícia
4. **Verifique no console**: Deve aparecer "Curtida persistida no banco de dados (usuário público)"
5. **Verifique no localStorage**: Dados devem ser salvos
6. **Recarregue a página**: Curtidas devem persistir

### 2. Teste como Usuário Autenticado

1. **Faça login na aplicação**
2. **Vá para a página de Notícias**
3. **Clique no botão de curtir** em qualquer notícia
4. **Verifique no console**: Deve aparecer "Curtida persistida no banco de dados (usuário autenticado)"
5. **Teste em outro dispositivo**: Curtidas devem sincronizar

### 3. Teste de Tempo Real

1. **Abra a aplicação em duas abas diferentes**
2. **Em uma aba, clique em curtir** uma notícia
3. **Na outra aba**: A curtida deve aparecer automaticamente
4. **Verifique no console**: Deve aparecer "Mudança nas curtidas:"

## 📊 Verificações no Banco de Dados

### Verificar Curtidas Públicas
```sql
SELECT * FROM news_likes WHERE user_id = 'anonymous';
```

### Verificar Curtidas Autenticadas
```sql
SELECT * FROM news_likes WHERE user_id != 'anonymous';
```

### Contar Total de Curtidas por Notícia
```sql
SELECT 
  news_id,
  COUNT(*) as total_likes,
  COUNT(CASE WHEN user_id = 'anonymous' THEN 1 END) as public_likes,
  COUNT(CASE WHEN user_id != 'anonymous' THEN 1 END) as authenticated_likes
FROM news_likes 
GROUP BY news_id;
```

## 🔍 Debugging

### Verificar localStorage
```javascript
// No console do navegador
console.log('Curtidas salvas:', JSON.parse(localStorage.getItem('likedNews') || '[]'));
console.log('Contadores salvos:', JSON.parse(localStorage.getItem('newsLikes') || '{}'));
```

### Verificar Estado do Hook
```javascript
// No console do navegador (se estiver usando React DevTools)
// Procure pelo componente que usa useNewsLikes
// Verifique os estados: likedNews, newsLikes, isLoading
```

### Verificar Conexão com Supabase
```javascript
// No console do navegador
import { supabase } from '@/integrations/supabase/client';
const { data, error } = await supabase.from('news_likes').select('*').limit(1);
console.log('Teste de conexão:', { data, error });
```

## 🐛 Problemas Comuns

### Problema: Curtidas não persistem
**Verificar**:
1. Console para erros
2. localStorage no DevTools
3. Conexão com Supabase
4. Políticas RLS

### Problema: Tempo real não funciona
**Verificar**:
1. Supabase Realtime habilitado
2. Políticas de SELECT
3. Console para erros de subscription

### Problema: Contadores incorretos
**Verificar**:
1. Dados no banco de dados
2. Cache do localStorage
3. Sincronização entre localStorage e banco

## ✅ Checklist de Teste

- [ ] Curtidas funcionam sem autenticação
- [ ] Curtidas funcionam com autenticação
- [ ] Dados persistem no localStorage
- [ ] Dados persistem no Supabase
- [ ] Tempo real funciona
- [ ] Contadores atualizam corretamente
- [ ] Estados visuais funcionam
- [ ] Feedback de toast aparece
- [ ] Prevenção de duplicatas funciona
- [ ] Fallback funciona quando banco não está disponível

## 📈 Métricas de Performance

### Tempo de Resposta
- **localStorage**: < 10ms
- **Supabase**: < 100ms
- **Tempo real**: < 500ms

### Limitações
- **Curtidas públicas**: Uma por dispositivo
- **Curtidas autenticadas**: Uma por usuário
- **Sincronização**: Depende da conexão com internet

## 🎯 Resultados Esperados

### ✅ Sucesso
- Curtidas funcionam para todos os usuários
- Dados persistem localmente e no banco
- Tempo real sincroniza entre dispositivos
- Interface responde imediatamente

### ❌ Falha
- Erros no console
- Dados não persistem
- Tempo real não funciona
- Interface não responde 