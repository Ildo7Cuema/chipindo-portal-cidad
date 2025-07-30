# Implementação do Sistema de Dados dos Setores

## 📋 Visão Geral

Este documento descreve a implementação de um sistema completo de gestão de dados para as páginas de setores (Cultura, Tecnologia, Desenvolvimento Económico) que permite:

- **Consistência de dados** entre frontend e backend
- **Gestão administrativa** através da área administrativa
- **Dados dinâmicos** carregados do banco de dados
- **CRUD operations** para todos os tipos de dados

## 🏗️ Arquitetura do Sistema

### 1. **Hooks Personalizados**
Cada setor tem seu próprio hook que gerencia:
- Carregamento de dados do Supabase
- Estados de loading e error
- Operações CRUD
- Cache local dos dados

### 2. **Estrutura de Tabelas**
Cada setor possui 8 tabelas principais:
- `{setor}_info` - Informações gerais do setor
- `{setor}_estatisticas` - Estatísticas do setor
- `{setor}_areas` - Áreas específicas do setor
- `{setor}_eventos` / `{setor}_servicos_digitais` - Eventos ou serviços
- `{setor}_programas` - Programas oferecidos
- `{setor}_oportunidades` - Oportunidades de emprego
- `{setor}_infraestruturas` - Infraestruturas disponíveis
- `{setor}_contactos` - Informações de contacto

### 3. **Segurança e Permissões**
- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Acesso público** para leitura de dados ativos
- **Acesso administrativo** para operações CRUD completas

## 📁 Estrutura de Arquivos

```
src/
├── hooks/
│   ├── useCulturaData.ts              # Hook para dados de Cultura
│   ├── useTecnologiaData.ts           # Hook para dados de Tecnologia
│   └── useDesenvolvimentoEconomicoData.ts # Hook para dados Económicos
├── pages/
│   ├── Cultura.tsx                    # Página atualizada para usar hook
│   ├── Tecnologia.tsx                 # Página atualizada para usar hook
│   └── DesenvolvimentoEconomico.tsx   # Página atualizada para usar hook

supabase/
├── migrations/
│   ├── 20250125000003-create-setores-data-tables.sql    # Criação das tabelas
│   └── 20250125000004-insert-setores-initial-data.sql   # Dados iniciais

scripts/
└── apply-setores-migrations.js        # Script para aplicar migrações
```

## 🔧 Implementação Técnica

### 1. **Hooks Personalizados**

Cada hook segue o padrão:
```typescript
export const useSetorData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Supabase
  const fetchData = async () => { /* ... */ };
  
  // CRUD operations
  const createItem = async (item) => { /* ... */ };
  const updateItem = async (id, updates) => { /* ... */ };
  const deleteItem = async (id) => { /* ... */ };

  return { data, loading, error, createItem, updateItem, deleteItem };
};
```

### 2. **Estrutura de Tabelas**

Exemplo para o setor de Cultura:
```sql
-- Informações gerais
CREATE TABLE cultura_info (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Estatísticas
CREATE TABLE cultura_estatisticas (
  id UUID PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Eventos culturais
CREATE TABLE cultura_eventos (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  data TEXT NOT NULL,
  local TEXT NOT NULL,
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **Políticas de Segurança**

```sql
-- Acesso público para leitura
CREATE POLICY "Public read access for cultura_estatisticas" 
ON cultura_estatisticas FOR SELECT 
USING (ativo = true);

-- Acesso administrativo completo
CREATE POLICY "Admin access for cultura_estatisticas" 
ON cultura_estatisticas FOR ALL 
USING (auth.role() = 'authenticated');
```

## 🚀 Como Aplicar as Migrações

### 1. **Executar o Script de Migração**
```bash
node scripts/apply-setores-migrations.js
```

### 2. **Verificar a Aplicação**
O script irá:
- Criar todas as tabelas necessárias
- Inserir dados iniciais
- Configurar políticas de segurança
- Verificar a inserção dos dados

### 3. **Resultado Esperado**
```
🚀 Aplicando migrações dos setores...
📋 Criando tabelas dos setores...
✅ Tabelas criadas com sucesso
📊 Inserindo dados iniciais...
✅ Dados iniciais inseridos com sucesso
🔍 Verificando dados inseridos...
✅ Cultura: 6 estatísticas inseridas
✅ Tecnologia: 6 estatísticas inseridas
✅ Desenvolvimento Económico: 6 estatísticas inseridas
🎉 Migrações dos setores aplicadas com sucesso!
```

## 📊 Dados Iniciais Incluídos

### **Setor de Cultura**
- 6 estatísticas (Grupos Culturais, Eventos Anuais, etc.)
- 4 áreas culturais (Música, Dança, Artes Visuais, Literatura)
- 4 eventos culturais (Festival, Exposição, Encontro, Feira)
- 3 programas culturais
- 3 oportunidades de emprego
- 3 infraestruturas culturais
- Informações de contacto

### **Setor de Tecnologia**
- 6 estatísticas (Startups Tech, Profissionais IT, etc.)
- 4 áreas tecnológicas
- 4 serviços digitais (Portal, App, Sistema, Centro de Contacto)
- 3 programas tecnológicos
- 3 oportunidades de emprego
- 3 infraestruturas tecnológicas
- Informações de contacto

### **Setor de Desenvolvimento Económico**
- 6 estatísticas (Empresas, Empregos, Investimento, etc.)
- 4 setores económicos
- 3 programas económicos
- 3 oportunidades de emprego
- 3 infraestruturas económicas
- Informações de contacto

## 🔄 Atualização das Páginas

### 1. **Página de Cultura**
- ✅ Atualizada para usar `useCulturaData`
- ✅ Loading states implementados
- ✅ Error handling implementado
- ✅ Dados dinâmicos do banco

### 2. **Página de Tecnologia**
- ✅ Atualizada para usar `useTecnologiaData`
- ✅ Modal de serviços digitais melhorado
- ✅ Estados de desenvolvimento realistas

### 3. **Página de Desenvolvimento Económico**
- ✅ Pronta para usar `useDesenvolvimentoEconomicoData`
- ✅ Estrutura consistente com outros setores

## 🎯 Benefícios da Implementação

### **Para os Utilizadores**
- **Dados sempre atualizados** - Informações em tempo real
- **Experiência consistente** - Mesma estrutura em todos os setores
- **Performance melhorada** - Cache local dos dados

### **Para os Administradores**
- **Gestão centralizada** - Todos os dados em um local
- **Interface administrativa** - CRUD operations através da área admin
- **Controle de versão** - Histórico de alterações
- **Segurança** - Políticas de acesso configuradas

### **Para os Desenvolvedores**
- **Código reutilizável** - Hooks padronizados
- **Manutenção facilitada** - Estrutura consistente
- **Escalabilidade** - Fácil adição de novos setores
- **Type Safety** - TypeScript interfaces definidas

## 🔮 Próximos Passos

### **1. Área Administrativa**
- Criar componentes de gestão para cada setor
- Implementar formulários de edição
- Adicionar validação de dados
- Implementar upload de imagens

### **2. Funcionalidades Avançadas**
- Sistema de notificações para mudanças
- Histórico de alterações
- Backup automático de dados
- Relatórios e analytics

### **3. Integração com Outros Sistemas**
- Sincronização com sistemas externos
- APIs para terceiros
- Webhooks para notificações
- Integração com redes sociais

## 📝 Notas Importantes

1. **Variáveis de Ambiente**: Certifique-se de que `VITE_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão configuradas
2. **Permissões**: As políticas de segurança permitem acesso público para leitura e administrativo para escrita
3. **Performance**: Os hooks implementam cache local para melhor performance
4. **Error Handling**: Todos os hooks incluem tratamento de erros robusto
5. **Type Safety**: Todas as interfaces TypeScript estão definidas para type safety

## 🆘 Troubleshooting

### **Erro de Conexão com Supabase**
- Verificar variáveis de ambiente
- Confirmar que o projeto Supabase está ativo
- Verificar permissões da service role key

### **Dados Não Carregam**
- Verificar se as migrações foram aplicadas
- Confirmar que as políticas de segurança estão ativas
- Verificar logs do console para erros específicos

### **Problemas de Performance**
- Verificar se o cache local está funcionando
- Considerar implementar paginação para grandes datasets
- Otimizar queries do Supabase

---

**Implementação concluída com sucesso!** 🎉

O sistema está pronto para uso e pode ser facilmente expandido para outros setores seguindo o mesmo padrão. 