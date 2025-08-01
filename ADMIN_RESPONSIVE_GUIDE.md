# Guia de Responsividade para Área Administrativa

## 🎯 Objetivo

Transformar completamente a área administrativa do Portal de Chipindo em uma experiência mobile-first e totalmente responsiva, seguindo os princípios estabelecidos anteriormente.

## 🚀 Melhorias Implementadas

### 1. **Layout Mobile-First**
- Header colapsável em dispositivos móveis
- Sidebar transformada em drawer lateral
- Navegação inferior com ações rápidas
- Grid responsivo adaptativo

### 2. **Componentes Responsivos**
- `ResponsiveContainer` para largura e padding
- `ResponsiveGrid` para layouts de grid
- `ResponsiveCard` para cards interativos
- `ResponsiveSection` para seções de conteúdo
- `ResponsiveText` para tipografia escalável

### 3. **Navegação Inteligente**
- Menu lateral com categorização
- Navegação inferior com scroll detection
- Breadcrumbs responsivos
- Ações rápidas acessíveis

## 📱 Características Mobile

### **Header Responsivo**
```tsx
// Header que colapsa em mobile
<div className={cn(
  "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg transition-all duration-300 lg:hidden",
  headerCollapsed ? "h-12" : "h-16"
)}>
  {/* Conteúdo do header */}
</div>
```

### **Sidebar Mobile (Drawer)**
```tsx
<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
    {/* Navegação categorizada */}
    {Object.entries(groupedItems).map(([category, items]) => (
      <div key={category} className="p-4 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {category}
        </div>
        {/* Itens de navegação */}
      </div>
    ))}
  </SheetContent>
</Sheet>
```

### **Navegação Inferior**
```tsx
<div className={cn(
  "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
  showBottomNav ? "translate-y-0" : "translate-y-full"
)}>
  <div className="bg-white/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
    <div className="flex items-center justify-around p-2">
      {/* Ações rápidas */}
    </div>
  </div>
</div>
```

## 🛠️ Como Implementar

### **Passo 1: Executar Script de Transformação**
```bash
node scripts/apply-admin-responsive.js
```

### **Passo 2: Atualizar Imports**
```tsx
import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { useSafeScrollListener } from "@/hooks/useSafeEventListeners";
```

### **Passo 3: Adicionar Estados Mobile**
```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);
const [showBottomNav, setShowBottomNav] = useState(false);
const [headerCollapsed, setHeaderCollapsed] = useState(false);
```

### **Passo 4: Implementar Hook de Scroll**
```tsx
useSafeScrollListener(() => {
  const scrollY = window.scrollY;
  setShowBottomNav(scrollY > 100);
  setHeaderCollapsed(scrollY > 50);
}, { throttle: 100 });
```

### **Passo 5: Categorizar Navegação**
```tsx
const navigationItems: NavigationItem[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: BarChart3, 
    description: "Visão geral do sistema",
    category: "Principal" 
  },
  // ... outros itens
];
```

## 📋 Padrões de Componentes

### **Container Responsivo**
```tsx
<ResponsiveContainer spacing="lg">
  {/* Conteúdo */}
</ResponsiveContainer>
```

### **Grid Responsivo**
```tsx
<ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
  {/* Cards */}
</ResponsiveGrid>
```

### **Card Responsivo**
```tsx
<ResponsiveCard interactive elevated>
  {/* Conteúdo do card */}
</ResponsiveCard>
```

### **Seção Responsiva**
```tsx
<ResponsiveSection spacing="lg">
  {/* Conteúdo da seção */}
</ResponsiveSection>
```

### **Texto Responsivo**
```tsx
<ResponsiveText variant="h1" className="mb-4">
  Título Principal
</ResponsiveText>

<ResponsiveText variant="body" className="text-muted-foreground">
  Descrição do conteúdo
</ResponsiveText>
```

## 🎨 Design System Mobile

### **Cores e Temas**
```css
/* Variáveis CSS para consistência */
:root {
  --mobile-header-height: 4rem;
  --mobile-header-collapsed: 3rem;
  --bottom-nav-height: 4rem;
  --sidebar-width: 85vw;
  --sidebar-max-width: 20rem;
}
```

### **Espaçamentos**
```tsx
// Espaçamentos consistentes
const spacing = {
  xs: "0.5rem",    // 8px
  sm: "1rem",      // 16px
  md: "1.5rem",    // 24px
  lg: "2rem",      // 32px
  xl: "3rem"       // 48px
};
```

### **Breakpoints**
```tsx
// Breakpoints do sistema
const breakpoints = {
  sm: "640px",   // Mobile landscape
  md: "768px",   // Tablet portrait
  lg: "1024px",  // Tablet landscape
  xl: "1280px",  // Desktop
  "2xl": "1536px" // Large desktop
};
```

## 📊 Componentes Administrativos

### **Dashboard Stats**
```tsx
<ResponsiveGrid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
  {stats.map((stat, index) => (
    <ResponsiveCard key={index} interactive elevated>
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <ResponsiveText variant="small" className="text-muted-foreground">
            {stat.title}
          </ResponsiveText>
          <ResponsiveText variant="h3" className="font-bold">
            {stat.value}
          </ResponsiveText>
        </div>
        <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
          <stat.icon className="w-6 h-6" />
        </div>
      </div>
    </ResponsiveCard>
  ))}
</ResponsiveGrid>
```

### **Tabelas Responsivas**
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-muted/50">
      <tr>
        <th className="text-left p-4 font-medium">Título</th>
        <th className="text-left p-4 font-medium hidden md:table-cell">Autor</th>
        <th className="text-left p-4 font-medium hidden lg:table-cell">Data</th>
        <th className="text-right p-4 font-medium">Ações</th>
      </tr>
    </thead>
    <tbody>
      {/* Linhas da tabela */}
    </tbody>
  </table>
</div>
```

### **Formulários Responsivos**
```tsx
<ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="md">
  <div className="space-y-4">
    <label className="block">
      <ResponsiveText variant="small" className="font-medium mb-2">
        Nome
      </ResponsiveText>
      <input 
        type="text" 
        className="w-full p-3 rounded-lg border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </label>
  </div>
</ResponsiveGrid>
```

## 🔧 Funcionalidades Avançadas

### **Scroll Detection**
```tsx
// Detectar scroll para mostrar/ocultar navegação
useSafeScrollListener(() => {
  const scrollY = window.scrollY;
  const direction = scrollY > lastScrollY ? 'down' : 'up';
  
  if (direction === 'down' && scrollY > 100) {
    setShowBottomNav(false);
  } else {
    setShowBottomNav(true);
  }
  
  setHeaderCollapsed(scrollY > 50);
  setLastScrollY(scrollY);
}, { throttle: 100 });
```

### **Gestos Touch**
```tsx
// Suporte a gestos para abrir/fechar sidebar
const handleSwipe = (direction: 'left' | 'right') => {
  if (direction === 'right') {
    setSidebarOpen(true);
  } else if (direction === 'left') {
    setSidebarOpen(false);
  }
};
```

### **Orientação do Dispositivo**
```tsx
// Detectar mudanças de orientação
useEffect(() => {
  const handleOrientationChange = () => {
    // Ajustar layout baseado na orientação
    if (window.orientation === 0 || window.orientation === 180) {
      // Portrait
      setLayoutMode('portrait');
    } else {
      // Landscape
      setLayoutMode('landscape');
    }
  };
  
  window.addEventListener('orientationchange', handleOrientationChange);
  return () => window.removeEventListener('orientationchange', handleOrientationChange);
}, []);
```

## 📱 Testes Mobile

### **Dispositivos de Teste**
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPhone 12/13 Pro Max (428px)
- Samsung Galaxy S21 (360px)
- iPad (768px)
- iPad Pro (1024px)

### **Funcionalidades a Testar**
- [ ] Navegação lateral (drawer)
- [ ] Navegação inferior
- [ ] Header colapsável
- [ ] Grid responsivo
- [ ] Tabelas com scroll horizontal
- [ ] Formulários em mobile
- [ ] Botões e touch targets (mínimo 44px)
- [ ] Zoom e pinch gestures
- [ ] Orientação do dispositivo

### **Performance Mobile**
- [ ] Tempo de carregamento < 3s
- [ ] Scroll suave (60fps)
- [ ] Animações otimizadas
- [ ] Lazy loading de imagens
- [ ] Cache de dados

## 🎯 Boas Práticas

### **1. Mobile-First Design**
```tsx
// Sempre começar com mobile
<div className="w-full sm:w-auto">
  <button className="w-full sm:w-auto">
    Ação
  </button>
</div>
```

### **2. Touch-Friendly**
```tsx
// Botões com tamanho mínimo para touch
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon className="w-5 h-5" />
</button>
```

### **3. Feedback Visual**
```tsx
// Feedback imediato para ações
<button 
  className="transition-all duration-200 active:scale-95"
  onClick={handleAction}
>
  Ação
</button>
```

### **4. Acessibilidade**
```tsx
// Suporte a leitores de tela
<button 
  aria-label="Abrir menu de navegação"
  aria-expanded={sidebarOpen}
>
  <MenuIcon className="w-5 h-5" />
</button>
```

## 🚀 Scripts de Automação

### **Aplicar Responsividade**
```bash
# Aplicar sistema responsivo
node scripts/apply-responsive-system.js

# Aplicar responsividade administrativa
node scripts/apply-admin-responsive.js

# Limpar e reiniciar
node scripts/fix-errors.js
```

### **Verificações**
```bash
# Verificar TypeScript
npm run type-check

# Verificar linting
npm run lint

# Build de produção
npm run build

# Testar em diferentes dispositivos
npm run dev
```

## 📈 Métricas de Sucesso

### **UX Mobile**
- [ ] Navegação intuitiva
- [ ] Acesso rápido às funcionalidades
- [ ] Feedback visual adequado
- [ ] Performance otimizada

### **Acessibilidade**
- [ ] Suporte a leitores de tela
- [ ] Navegação por teclado
- [ ] Contraste adequado
- [ ] Tamanhos de fonte legíveis

### **Performance**
- [ ] Carregamento rápido
- [ ] Scroll suave
- [ ] Animações fluidas
- [ ] Uso eficiente de memória

---

**Status**: ✅ Implementado  
**Versão**: 2.0.0  
**Última atualização**: Janeiro 2025 