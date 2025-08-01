#!/usr/bin/env node

/**
 * Script simples para aplicar responsividade à área administrativa
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Aplicando responsividade à área administrativa...\n');

// Função para ler arquivo
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Erro ao ler ${filePath}:`, error.message);
    return null;
  }
}

// Função para escrever arquivo
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao escrever ${filePath}:`, error.message);
    return false;
  }
}

// Função para processar Admin.tsx
function processAdminPage() {
  const adminPath = path.join(__dirname, '../src/pages/Admin.tsx');
  
  if (!fs.existsSync(adminPath)) {
    console.log('❌ Arquivo Admin.tsx não encontrado');
    return false;
  }
  
  console.log('📝 Processando Admin.tsx...');
  
  let content = readFile(adminPath);
  if (!content) return false;
  
  // Adicionar imports responsivos se não existirem
  if (!content.includes('ResponsiveContainer')) {
    const importStatement = `import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { useSafeScrollListener } from "@/hooks/useSafeEventListeners";`;
    
    // Inserir após os imports existentes
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importStatement);
      content = lines.join('\n');
    }
  }
  
  // Adicionar estados mobile se não existirem
  if (!content.includes('sidebarOpen')) {
    content = content.replace(
      /const \[showHelp, setShowHelp\] = useState\(false\);/,
      `const [showHelp, setShowHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);`
    );
  }
  
  // Adicionar hook de scroll se não existir
  if (!content.includes('useSafeScrollListener')) {
    content = content.replace(
      /const navigate = useNavigate\(\);/,
      `const navigate = useNavigate();
  
  // Usar hook seguro para scroll
  useSafeScrollListener(() => {
    const scrollY = window.scrollY;
    setShowBottomNav(scrollY > 100);
    setHeaderCollapsed(scrollY > 50);
  }, { throttle: 100 });`
    );
  }
  
  // Adicionar categorias aos itens de navegação
  content = content.replace(
    /{ id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Visão geral do sistema" }/g,
    '{ id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Visão geral do sistema", category: "Principal" }'
  );
  
  content = content.replace(
    /{ id: "notifications", label: "Notificações", icon: Bell, description: "Gerir notificações" }/g,
    '{ id: "notifications", label: "Notificações", icon: Bell, description: "Gerir notificações", category: "Principal" }'
  );
  
  content = content.replace(
    /{ id: "news", label: "Notícias", icon: FileText, description: "Gerir notícias" }/g,
    '{ id: "news", label: "Notícias", icon: FileText, description: "Gerir notícias", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "concursos", label: "Concursos", icon: Trophy, description: "Gerir concursos" }/g,
    '{ id: "concursos", label: "Concursos", icon: Trophy, description: "Gerir concursos", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "acervo", label: "Acervo Digital", icon: Archive, description: "Gerir acervo digital" }/g,
    '{ id: "acervo", label: "Acervo Digital", icon: Archive, description: "Gerir acervo digital", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "organigrama", label: "Organigrama", icon: Network, description: "Gerir estrutura organizacional" }/g,
    '{ id: "organigrama", label: "Organigrama", icon: Network, description: "Gerir estrutura organizacional", category: "Estrutura" }'
  );
  
  content = content.replace(
    /{ id: "departamentos", label: "Direcções", icon: Building2, description: "Gerir departamentos" }/g,
    '{ id: "departamentos", label: "Direcções", icon: Building2, description: "Gerir departamentos", category: "Estrutura" }'
  );
  
  content = content.replace(
    /{ id: "setores", label: "Sectores Estratégicos", icon: Building2, description: "Gerir sectores estratégicos" }/g,
    '{ id: "setores", label: "Sectores Estratégicos", icon: Building2, description: "Gerir sectores estratégicos", category: "Estrutura" }'
  );
  
  content = content.replace(
    /{ id: "content", label: "Conteúdo", icon: FileText, description: "Gerir conteúdo do site" }/g,
    '{ id: "content", label: "Conteúdo", icon: FileText, description: "Gerir conteúdo do site", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "carousel", label: "Carousel", icon: ImageUp, description: "Gerir imagens do carousel" }/g,
    '{ id: "carousel", label: "Carousel", icon: ImageUp, description: "Gerir imagens do carousel", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "locations", label: "Localizações", icon: MapPin, description: "Gerir localizações" }/g,
    '{ id: "locations", label: "Localizações", icon: MapPin, description: "Gerir localizações", category: "Dados" }'
  );
  
  content = content.replace(
    /{ id: "emergency-contacts", label: "Contactos", icon: AlertTriangle, description: "Contactos de emergência" }/g,
    '{ id: "emergency-contacts", label: "Contactos", icon: AlertTriangle, description: "Contactos de emergência", category: "Dados" }'
  );
  
  content = content.replace(
    /{ id: "transparency", label: "Transparência", icon: EyeIcon, description: "Gerir documentos de transparência" }/g,
    '{ id: "transparency", label: "Transparência", icon: EyeIcon, description: "Gerir documentos de transparência", category: "Dados" }'
  );
  
  content = content.replace(
    /{ id: "ouvidoria", label: "Ouvidoria", icon: MessageSquare, description: "Gerir manifestações da ouvidoria" }/g,
    '{ id: "ouvidoria", label: "Ouvidoria", icon: MessageSquare, description: "Gerir manifestações da ouvidoria", category: "Dados" }'
  );
  
  content = content.replace(
    /{ id: "population", label: "População", icon: Users, description: "Gestão do histórico populacional" }/g,
    '{ id: "population", label: "População", icon: Users, description: "Gestão do histórico populacional", category: "Dados" }'
  );
  
  content = content.replace(
    /{ id: "characterization", label: "Caracterização", icon: MapPin, description: "Caracterização do município" }/g,
    '{ id: "characterization", label: "Caracterização", icon: MapPin, description: "Caracterização do município", category: "Dados" }'
  );
  
  content = content.replace(
    /{ id: "events", label: "Eventos", icon: Calendar, description: "Gerir eventos do município" }/g,
    '{ id: "events", label: "Eventos", icon: Calendar, description: "Gerir eventos do município", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "turismo-carousel", label: "Carrossel Turismo", icon: ImageIcon, description: "Gerir carrossel turístico e ambiental" }/g,
    '{ id: "turismo-carousel", label: "Carrossel Turismo", icon: ImageIcon, description: "Gerir carrossel turístico e ambiental", category: "Conteúdo" }'
  );
  
  content = content.replace(
    /{ id: "users", label: "Utilizadores", icon: Users, description: "Gerir utilizadores do sistema" }/g,
    '{ id: "users", label: "Utilizadores", icon: Users, description: "Gerir utilizadores do sistema", category: "Sistema" }'
  );
  
  content = content.replace(
    /{ id: "settings", label: "Configurações", icon: Settings, description: "Configurações do sistema" }/g,
    '{ id: "settings", label: "Configurações", icon: Settings, description: "Configurações do sistema", category: "Sistema" }'
  );
  
  // Adicionar agrupamento de itens
  if (!content.includes('groupedItems')) {
    content = content.replace(
      /const allItems = isAdmin \? \[\.\.\.navigationItems, \.\.\.adminOnlyItems\] : navigationItems;/,
      `const allItems = isAdmin ? [...navigationItems, ...adminOnlyItems] : navigationItems;

  // Agrupar itens por categoria
  const groupedItems = allItems.reduce((acc, item) => {
    const category = item.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);`
    );
  }
  
  if (writeFile(adminPath, content)) {
    console.log('✅ Admin.tsx atualizado com sucesso');
    return true;
  }
  
  return false;
}

// Função principal
function main() {
  console.log('🛠️  Iniciando aplicação de responsividade...\n');
  
  // Processar página Admin
  const success = processAdminPage();
  
  if (success) {
    console.log('\n🎉 Responsividade aplicada com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Execute: npm run dev');
    console.log('   2. Teste a área administrativa em dispositivos móveis');
    console.log('   3. Verifique se a navegação mobile está funcionando');
    console.log('   4. Teste os componentes responsivos');
  } else {
    console.log('\n❌ Erro ao aplicar responsividade');
  }
}

if (require.main === module) {
  main();
} 