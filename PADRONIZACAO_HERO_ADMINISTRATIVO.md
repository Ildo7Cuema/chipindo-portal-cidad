# Padronização do Hero das Páginas Administrativas

## Visão Geral

Este documento explica como padronizar o hero/header das páginas da área administrativa para seguir o padrão visual do Dashboard Executivo, utilizando o componente compartilhado `AdminHeroHeader`.

## Componente AdminHeroHeader

O componente `AdminHeroHeader` foi criado em `src/components/admin/AdminHeroHeader.tsx` e oferece:

- **Layout responsivo** (mobile e desktop)
- **Título grande e destacado** com gradiente
- **Subtítulo descritivo**
- **Badges de status** personalizáveis
- **Ícone principal** configurável
- **Ações principais** (botões)
- **Ações de exportação** (CSV, Excel, PDF)
- **Status do sistema** (online/offline, tempo de resposta)
- **Design consistente** com o Dashboard Executivo

## Como Aplicar

### 1. Importar o Componente

```tsx
import { AdminHeroHeader } from "./AdminHeroHeader";
```

### 2. Substituir o Header Atual

**Antes:**
```tsx
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-border/50 shadow-sm">
  <div className="flex-1 min-w-0">
    <h2 className="text-2xl font-bold text-foreground mb-2">Título da Página</h2>
    <p className="text-muted-foreground leading-relaxed">
      Descrição da página
    </p>
  </div>
  {/* Botões e ações */}
</div>
```

**Depois:**
```tsx
<AdminHeroHeader
  title="Título da Página"
  subtitle="Descrição da página"
  icon={IconComponent}
  badges={[
    {
      label: "Admin",
      variant: "outline",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      label: "Sistema Online",
      variant: "outline", 
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      icon: CheckCircle,
      pulse: true
    }
  ]}
  actions={[
    {
      label: "Ação Principal",
      icon: Plus,
      variant: "default",
      onClick: handleAction,
      className: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
    }
  ]}
  exportActions={[
    {
      label: "Exportar CSV",
      icon: FileSpreadsheet,
      onClick: exportToCSV,
      disabled: exportLoading === 'csv',
      loading: exportLoading === 'csv'
    }
  ]}
  systemStatus={{
    online: true,
    responseTime: 0.8,
    statusText: "Sistema Operacional"
  }}
/>
```

## Exemplo Implementado: NotificationsManager

A página de Notificações foi refatorada como exemplo:

### Características do Hero:
- **Título:** "Gestão de Notificações"
- **Subtítulo:** "Gerencie notificações do sistema e comunicações administrativas"
- **Ícone:** Bell (sino)
- **Badges:** Admin + Sistema Online (com pulse)
- **Ações:** Nova Notificação (botão principal)
- **Exportações:** CSV, Excel, PDF
- **Status:** Sistema Operacional

### Código de Implementação:

```tsx
<AdminHeroHeader
  title="Gestão de Notificações"
  subtitle="Gerencie notificações do sistema e comunicações administrativas"
  icon={Bell}
  badges={[
    {
      label: "Admin",
      variant: "outline",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      label: "Sistema Online",
      variant: "outline", 
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      icon: CheckCircle,
      pulse: true
    }
  ]}
  actions={[
    {
      label: "Nova Notificação",
      icon: Plus,
      variant: "default",
      onClick: resetForm,
      className: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
    }
  ]}
  exportActions={[
    {
      label: "Exportar CSV",
      icon: FileSpreadsheet,
      onClick: exportNotificationsToCSV,
      disabled: exportLoading === 'csv',
      loading: exportLoading === 'csv'
    },
    {
      label: "Exportar Excel", 
      icon: FileDown,
      onClick: exportNotificationsToExcel,
      disabled: exportLoading === 'excel',
      loading: exportLoading === 'excel'
    },
    {
      label: "Exportar PDF",
      icon: Download,
      onClick: exportNotificationsToPDF,
      disabled: exportLoading === 'pdf',
      loading: exportLoading === 'pdf'
    }
  ]}
  systemStatus={{
    online: true,
    responseTime: 0.8,
    statusText: "Sistema Operacional"
  }}
/>
```

## Páginas a Padronizar

### 1. NewsManager
- **Título:** "Gestão de Notícias"
- **Ícone:** FileText
- **Ações:** Nova Notícia, Exportar
- **Badges:** Admin, Publicado

### 2. ConcursosManager
- **Título:** "Gestão de Concursos Públicos"
- **Ícone:** Trophy
- **Ações:** Novo Concurso, Exportar
- **Badges:** Admin, Ativo

### 3. AcervoDigitalManager
- **Título:** "Gestão do Acervo Digital"
- **Ícone:** Archive
- **Ações:** Upload, Exportar
- **Badges:** Admin, Digital

### 4. DepartamentosManager
- **Título:** "Gestão de Direcções"
- **Ícone:** Building2
- **Ações:** Nova Direcção, Exportar
- **Badges:** Admin, Estrutural

### 5. SetoresEstrategicosManager
- **Título:** "Gestão de Sectores Estratégicos"
- **Ícone:** Target
- **Ações:** Novo Setor, Exportar
- **Badges:** Admin, Estratégico

### 6. OuvidoriaManager
- **Título:** "Gestão da Ouvidoria"
- **Ícone:** MessageSquare
- **Ações:** Nova Manifestação, Exportar
- **Badges:** Admin, Ativo

## Benefícios da Padronização

1. **Consistência Visual:** Todas as páginas administrativas seguem o mesmo padrão
2. **Manutenibilidade:** Mudanças no design centralizadas em um componente
3. **Responsividade:** Layout adaptativo para mobile e desktop
4. **Acessibilidade:** Estrutura semântica consistente
5. **Performance:** Componente otimizado e reutilizável
6. **UX Melhorada:** Interface familiar e intuitiva

## Próximos Passos

1. Aplicar o padrão em todas as páginas administrativas listadas
2. Testar responsividade em diferentes dispositivos
3. Validar acessibilidade e usabilidade
4. Documentar padrões específicos para cada tipo de página
5. Criar testes automatizados para o componente

## Notas Técnicas

- O componente utiliza Tailwind CSS para estilização
- Ícones do Lucide React
- Suporte completo a tema claro/escuro
- Animações CSS para feedback visual
- Estrutura semântica com HTML5
- Compatível com React 18+ 