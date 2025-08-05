# 🔐 Sistema de Controle de Acesso - Portal Administrativo

## 📋 **Visão Geral**

O sistema de controle de acesso implementado garante que utilizadores da área administrativa tenham acesso apenas aos itens e funcionalidades relacionadas com a sua direção específica, exceto o Administrador que tem acesso total.

## 🎯 **Objetivos**

- ✅ **Acesso Baseado em Roles**: Diferentes níveis de acesso conforme o role do utilizador
- ✅ **Filtro por Setor**: Utilizadores de setores específicos veem apenas itens relacionados
- ✅ **Menu Dinâmico**: Itens do sidebar são filtrados automaticamente
- ✅ **Proteção de Rotas**: Componentes protegidos com mensagens de acesso negado
- ✅ **Interface Intuitiva**: Feedback visual claro sobre permissões

## 👥 **Tipos de Utilizadores**

### **1. Administrador (`admin`)**
- **Acesso**: Total a todas as funcionalidades
- **Pode**: Gerir utilizadores, ver logs, configurar sistema
- **Menu**: Todos os itens visíveis

### **2. Editor (`editor`)**
- **Acesso**: Gestão de conteúdo geral
- **Pode**: Gerir notícias, eventos, concursos, etc.
- **Menu**: Itens de conteúdo + dashboard + notificações

### **3. Utilizador de Setor (`educacao`, `saude`, etc.)**
- **Acesso**: Apenas ao seu setor específico
- **Pode**: Ver e gerir informações do seu setor
- **Menu**: Apenas itens relacionados ao seu setor + dashboard + notificações

## 🏗️ **Arquitetura do Sistema**

### **Hooks Principais**

#### **`useUserRole`** (`src/hooks/useUserRole.ts`)
```typescript
// Funções principais
const { 
  profile, 
  isAdmin, 
  isEditor, 
  isSectorUser, 
  role,
  canAccessItem,
  getFilteredMenuItems 
} = useUserRole(user);
```

#### **`useAccessControl`** (`src/hooks/useAccessControl.ts`)
```typescript
// Hook especializado para controle de acesso
const {
  canManageUsers,
  canViewAuditLogs,
  canAccessSystemSettings,
  getCurrentSector,
  getCurrentSectorName
} = useAccessControl();
```

### **Componentes de Interface**

#### **`AccessDenied`** (`src/components/ui/access-denied.tsx`)
- Mostra mensagem quando acesso é negado
- Botões para voltar ou ir para dashboard
- Ícones diferentes para diferentes tipos de erro

#### **`SectorFilter`** (`src/components/admin/SectorFilter.tsx`)
- Indica o setor atual do utilizador
- Mostra filtros aplicados
- Feedback visual sobre limitações

## 📊 **Configuração de Acesso**

### **Itens Apenas para Admin**
```typescript
adminOnly: [
  'gestao-utilizadores',
  'logs-auditoria', 
  'configuracoes-sistema',
  'backup-restore',
  'acesso-setor',
  'audit-logs',
  'users',
  'sector-access',
  'settings'
]
```

### **Itens para Editor**
```typescript
editorItems: [
  'gestao-conteudo',
  'gestao-noticias',
  'gestao-eventos',
  'gestao-concursos',
  'news',
  'concursos',
  'acervo',
  'organigrama',
  'departamentos',
  'content',
  'carousel',
  'events',
  'event-registrations',
  'turismo-carousel'
]
```

### **Itens Públicos**
```typescript
publicItems: [
  'dashboard',
  'notifications'
]
```

### **Mapeamento por Setor**
```typescript
sectorItems: {
  'educacao': ['educacao', 'gestao-educacao', 'estatisticas-educacao'],
  'saude': ['saude', 'gestao-saude', 'estatisticas-saude'],
  'agricultura': ['agricultura', 'gestao-agricultura', 'estatisticas-agricultura'],
  'sector-mineiro': ['sector-mineiro', 'gestao-mineiro', 'estatisticas-mineiro'],
  'desenvolvimento-economico': ['desenvolvimento-economico', 'gestao-economico', 'estatisticas-economico'],
  'cultura': ['cultura', 'gestao-cultura', 'estatisticas-cultura'],
  'tecnologia': ['tecnologia', 'gestao-tecnologia', 'estatisticas-tecnologia'],
  'energia-agua': ['energia-agua', 'gestao-energia', 'estatisticas-energia']
}
```

## 🔧 **Implementação na Página Admin**

### **Filtro de Menu**
```typescript
// Filtrar itens baseado nas permissões
const allItems = [...navigationItems, ...adminOnlyItems];
const filteredItems = getFilteredMenuItems(allItems);

// Agrupar itens filtrados por categoria
const groupedItems = filteredItems.reduce((acc, item) => {
  const category = item.category || 'Geral';
  if (!acc[category]) acc[category] = [];
  acc[category].push(item);
  return acc;
}, {} as Record<string, NavigationItem[]>);
```

### **Proteção de Componentes**
```typescript
{activeTab === "users" && (
  canManageUsers ? 
    <UserManager currentUserRole={role} /> : 
    <AccessDenied 
      title="Gestão de Utilizadores" 
      message="Apenas administradores podem gerir utilizadores do sistema." 
    />
)}
```

## 🎨 **Interface do Utilizador**

### **Para Administradores**
- ✅ **Menu Completo**: Todos os itens visíveis
- ✅ **Badge**: "Todos os Setores" 
- ✅ **Acesso Total**: Sem restrições

### **Para Editores**
- ✅ **Menu Limitado**: Apenas itens de conteúdo
- ✅ **Badge**: "Editor"
- ✅ **Acesso**: Gestão de conteúdo + dashboard

### **Para Utilizadores de Setor**
- ✅ **Menu Específico**: Apenas itens do seu setor
- ✅ **Badge**: Nome do setor (ex: "Educação")
- ✅ **Filtro Visual**: Indicador de setor atual
- ✅ **Acesso Limitado**: Apenas dados do seu setor

## 🔒 **Segurança**

### **Verificações Implementadas**
1. **Nível de Menu**: Itens filtrados por permissão
2. **Nível de Componente**: Componentes protegidos com AccessDenied
3. **Nível de Hook**: Funções de verificação de acesso
4. **Nível de Dados**: Filtros por setor nos componentes

### **Mensagens de Acesso Negado**
- **Título Específico**: Indica qual área foi negada
- **Mensagem Clara**: Explica por que o acesso foi negado
- **Ações Disponíveis**: Botões para voltar ou ir para dashboard
- **Ícones Visuais**: Diferentes ícones para diferentes situações

## 📱 **Responsividade**

### **Desktop**
- Sidebar com itens filtrados
- Indicadores visuais de permissão
- Filtros de setor visíveis

### **Mobile**
- Menu mobile com itens filtrados
- Navegação inferior adaptada
- Componentes responsivos

## 🧪 **Testes**

### **Cenários de Teste**

#### **1. Administrador**
- [ ] Acesso a todos os itens do menu
- [ ] Pode gerir utilizadores
- [ ] Pode ver logs de auditoria
- [ ] Pode aceder a configurações

#### **2. Editor**
- [ ] Acesso apenas a itens de conteúdo
- [ ] Não pode gerir utilizadores
- [ ] Não pode ver logs de auditoria
- [ ] Pode gerir notícias, eventos, etc.

#### **3. Utilizador de Setor**
- [ ] Acesso apenas a itens do seu setor
- [ ] Menu limitado ao setor
- [ ] Filtro visual de setor
- [ ] Mensagem de acesso negado para outras áreas

### **Como Testar**

1. **Criar Utilizadores de Teste**:
   ```sql
   -- Utilizador de Educação
   INSERT INTO profiles (user_id, email, full_name, role, setor_id)
   VALUES (gen_random_uuid(), 'educacao@teste.com', 'Utilizador Educação', 'educacao', 'educacao-id');
   
   -- Utilizador de Saúde
   INSERT INTO profiles (user_id, email, full_name, role, setor_id)
   VALUES (gen_random_uuid(), 'saude@teste.com', 'Utilizador Saúde', 'saude', 'saude-id');
   ```

2. **Verificar Menu**:
   - Login com cada tipo de utilizador
   - Verificar itens visíveis no sidebar
   - Confirmar que itens restritos não aparecem

3. **Testar Acesso Negado**:
   - Tentar aceder a URLs diretas de áreas restritas
   - Verificar mensagens de acesso negado
   - Confirmar que botões de navegação funcionam

## 🔄 **Manutenção**

### **Adicionar Novo Setor**
1. Atualizar `UserRole` type em `useUserRole.ts`
2. Adicionar mapeamento em `sectorItems`
3. Atualizar função `getSectorName`
4. Testar com utilizador do novo setor

### **Adicionar Novo Item de Menu**
1. Definir ID único para o item
2. Adicionar ao array apropriado (`adminOnly`, `editorItems`, `publicItems`, ou `sectorItems`)
3. Atualizar interface se necessário
4. Testar com diferentes tipos de utilizador

### **Modificar Permissões**
1. Atualizar configuração em `useAccessControl.ts`
2. Verificar lógica de verificação
3. Testar com utilizadores afetados
4. Atualizar documentação

## 📈 **Monitorização**

### **Logs de Acesso**
- Tentativas de acesso a áreas restritas
- Utilizadores que tentam aceder a funcionalidades não autorizadas
- Mudanças de permissões

### **Métricas**
- Utilização por tipo de utilizador
- Itens mais acedidos por setor
- Tentativas de acesso negado

## 🚀 **Próximos Passos**

### **Melhorias Futuras**
1. **Auditoria de Acesso**: Logs detalhados de todas as ações
2. **Permissões Granulares**: Controle mais fino por funcionalidade
3. **Temporização**: Permissões com prazo de validade
4. **Notificações**: Alertas quando acesso é negado
5. **Relatórios**: Dashboard de utilização por setor

### **Integração**
1. **API de Permissões**: Endpoint para verificar permissões
2. **Cache de Permissões**: Otimização de performance
3. **Sincronização**: Sincronização automática de mudanças de role

## ✅ **Checklist de Implementação**

- [x] Hook `useUserRole` atualizado com controle de acesso
- [x] Hook `useAccessControl` criado
- [x] Componente `AccessDenied` implementado
- [x] Componente `SectorFilter` criado
- [x] Página Admin atualizada com filtros
- [x] Menu sidebar filtrado por permissões
- [x] Componentes protegidos com mensagens de acesso negado
- [x] Configuração de acesso por setor
- [x] Interface responsiva implementada
- [x] Documentação completa criada
- [x] Testes de compilação passados

## 🎉 **Resultado Final**

O sistema de controle de acesso está completamente implementado e funcional, garantindo que:

- **Administradores** têm acesso total
- **Editores** podem gerir conteúdo
- **Utilizadores de setor** veem apenas informações relacionadas à sua direção
- **Interface** é intuitiva e responsiva
- **Segurança** é mantida em todos os níveis
- **Experiência** é consistente e profissional 