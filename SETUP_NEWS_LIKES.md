# Configuração da Funcionalidade de Curtidas

## 🚀 Como Ativar a Persistência no Banco de Dados

### 1. Criar a Tabela no Supabase

#### Opção A: Via Supabase Dashboard
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em "SQL Editor"
4. Execute o script em `scripts/create-news-likes-table.sql`

#### Opção B: Via Supabase CLI
```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g @supabase/cli

# Aplicar migração
supabase db push
```

### 2. Verificar se a Tabela foi Criada

No SQL Editor do Supabase, execute:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'news_likes';
```

### 3. Testar a Funcionalidade

1. Abra a aplicação
2. Vá para a página de Notícias
3. Clique no botão de curtir em qualquer notícia
4. Verifique no console do navegador se aparece "Curtida persistida no banco de dados"

## 🔧 Funcionalidades Implementadas

### ✅ Curtidas Públicas e Autenticadas
- **Usuários Públicos**: Podem curtir sem autenticação
- **Usuários Autenticados**: Podem curtir com identificação
- **Persistência Dupla**: localStorage + Supabase
- **Tempo Real**: Atualização automática

### ✅ Segurança Flexível
- **RLS (Row Level Security)** habilitado
- **Políticas específicas** para usuários públicos e autenticados
- **Prevenção de duplicatas** com UNIQUE constraint
- **Validação de dados** no banco

### ✅ Interface Universal
- **Botões de curtir** em todos os cards de notícias
- **Estados visuais** (curtido/não curtido)
- **Contadores de curtidas** (públicas + autenticadas)
- **Feedback visual** imediato

## 🔐 Tipos de Curtidas

### 👥 Curtidas Públicas
- **user_id**: `'anonymous'`
- **Acesso**: Qualquer visitante
- **Persistência**: localStorage + Supabase
- **Limitação**: Uma curtida por dispositivo

### 👤 Curtidas Autenticadas
- **user_id**: UUID do usuário
- **Acesso**: Usuários logados
- **Persistência**: localStorage + Supabase
- **Vantagem**: Sincronização entre dispositivos

## 🐛 Troubleshooting

### Problema: "Tabela news_likes ainda não criada"
**Solução**: Execute o script SQL no Supabase Dashboard

### Problema: "Erro ao persistir no banco"
**Solução**: 
1. Verifique se as políticas RLS estão corretas
2. Verifique se a tabela foi criada corretamente
3. Verifique os logs no console

### Problema: Curtidas não aparecem em tempo real
**Solução**:
1. Verifique se o Supabase Realtime está habilitado
2. Verifique se as políticas permitem SELECT para todos os usuários

## 📊 Monitoramento

### Logs no Console
- `"Curtida persistida no banco de dados (usuário autenticado)"` - Sucesso para usuários logados
- `"Curtida persistida no banco de dados (usuário público)"` - Sucesso para visitantes
- `"Erro ao persistir no banco, usando apenas localStorage"` - Fallback

### Verificar Dados
```sql
-- Ver todas as curtidas
SELECT * FROM news_likes;

-- Ver curtidas públicas
SELECT * FROM news_likes WHERE user_id = 'anonymous';

-- Ver curtidas de usuários autenticados
SELECT * FROM news_likes WHERE user_id != 'anonymous';

-- Contar curtidas por notícia (todas)
SELECT news_id, COUNT(*) as likes 
FROM news_likes 
GROUP BY news_id;

-- Contar curtidas públicas por notícia
SELECT news_id, COUNT(*) as public_likes 
FROM news_likes 
WHERE user_id = 'anonymous'
GROUP BY news_id;
```

## 🔄 Migração de Dados

Se você já tem curtidas no localStorage e quer migrar para o banco:

```javascript
// No console do navegador
const savedLikes = JSON.parse(localStorage.getItem('likedNews') || '[]');
const savedCounts = JSON.parse(localStorage.getItem('newsLikes') || '{}');

console.log('Curtidas para migrar:', savedLikes);
console.log('Contadores para migrar:', savedCounts);
```

## 📝 Notas Importantes

1. **Acessibilidade**: Qualquer visitante pode curtir
2. **Performance**: localStorage é mais rápido para operações locais
3. **Sincronização**: Supabase garante consistência entre dispositivos
4. **Segurança**: RLS protege contra acesso não autorizado
5. **Flexibilidade**: Suporte para usuários públicos e autenticados

## 🎯 Próximos Passos

1. ✅ Criar tabela no Supabase
2. ✅ Testar persistência no banco
3. ✅ Verificar tempo real
4. ✅ Implementar curtidas públicas
5. 🔄 Monitorar performance
6. 🔄 Adicionar analytics de curtidas 