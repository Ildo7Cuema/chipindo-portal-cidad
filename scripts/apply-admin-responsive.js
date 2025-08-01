#!/usr/bin/env node

/**
 * Script para aplicar melhorias responsivas aos componentes administrativos
 * Transforma a área administrativa em mobile-first e totalmente responsiva
 */

const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(__dirname, '../src/components/admin');
const ADMIN_PAGE = path.join(__dirname, '../src/pages/Admin.tsx');

// Padrões de transformação para componentes administrativos
const ADMIN_RESPONSIVE_PATTERNS = [
  // Substituir containers por ResponsiveContainer
  {
    from: /<div className="container mx-auto px-(\d+) py-(\d+)">/g,
    to: '<ResponsiveContainer spacing="lg">',
    requires: ['ResponsiveContainer']
  },
  
  // Substituir grids por ResponsiveGrid
  {
    from: /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-(\d+) gap-(\d+)">/g,
    to: (match, cols, gap) => {
      const colsMap = { '2': { sm: 1, md: 2, lg: 2 }, '3': { sm: 1, md: 2, lg: 3 }, '4': { sm: 1, md: 2, lg: 4 } };
      const gapMap = { '4': 'sm', '6': 'md', '8': 'lg' };
      return `<ResponsiveGrid cols={${JSON.stringify(colsMap[cols] || { sm: 1, md: 2, lg: parseInt(cols) })} gap="${gapMap[gap] || 'md'}">`;
    },
    requires: ['ResponsiveGrid']
  },
  
  // Substituir cards por ResponsiveCard
  {
    from: /<Card className="hover:shadow-elegant transition-all duration-300">/g,
    to: '<ResponsiveCard interactive elevated>',
    requires: ['ResponsiveCard']
  },
  
  // Substituir seções por ResponsiveSection
  {
    from: /<section className="mb-(\d+)">/g,
    to: '<ResponsiveSection spacing="lg">',
    requires: ['ResponsiveSection']
  },
  
  // Substituir títulos por ResponsiveText
  {
    from: /<h1 className="text-(\d+)xl md:text-(\d+)xl lg:text-(\d+)xl font-bold([^>]*)>/g,
    to: '<ResponsiveText variant="h1"$4>',
    requires: ['ResponsiveText']
  },
  {
    from: /<h2 className="text-(\d+)xl md:text-(\d+)xl lg:text-(\d+)xl font-bold([^>]*)>/g,
    to: '<ResponsiveText variant="h2"$4>',
    requires: ['ResponsiveText']
  },
  {
    from: /<h3 className="text-(\d+)xl md:text-(\d+)xl lg:text-(\d+)xl font-bold([^>]*)>/g,
    to: '<ResponsiveText variant="h3"$4>',
    requires: ['ResponsiveText']
  },
  
  // Substituir parágrafos por ResponsiveText
  {
    from: /<p className="text-sm md:text-base lg:text-lg([^>]*)>/g,
    to: '<ResponsiveText variant="body"$1>',
    requires: ['ResponsiveText']
  },
  
  // Fechar tags ResponsiveText
  {
    from: /<\/h1>/g,
    to: '</ResponsiveText>'
  },
  {
    from: /<\/h2>/g,
    to: '</ResponsiveText>'
  },
  {
    from: /<\/h3>/g,
    to: '</ResponsiveText>'
  },
  {
    from: /<\/p>/g,
    to: '</ResponsiveText>'
  },
  
  // Fechar containers responsivos
  {
    from: /<\/div>\s*<!-- ResponsiveContainer -->/g,
    to: '</ResponsiveContainer>'
  },
  {
    from: /<\/div>\s*<!-- ResponsiveGrid -->/g,
    to: '</ResponsiveGrid>'
  },
  {
    from: /<\/div>\s*<!-- ResponsiveCard -->/g,
    to: '</ResponsiveCard>'
  },
  {
    from: /<\/div>\s*<!-- ResponsiveSection -->/g,
    to: '</ResponsiveSection>'
  }
];

// Padrões específicos para Admin.tsx
const ADMIN_PAGE_PATTERNS = [
  // Adicionar imports responsivos
  {
    from: /import { cn } from "@/lib\/utils";/g,
    to: `import { cn } from "@/lib/utils";
import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { useSafeScrollListener } from "@/hooks/useSafeEventListeners";`
  },
  
  // Adicionar estado para navegação mobile
  {
    from: /const \[showHelp, setShowHelp\] = useState\(false\);/g,
    to: `const [showHelp, setShowHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);`
  },
  
  // Adicionar hook de scroll seguro
  {
    from: /const navigate = useNavigate\(\);/g,
    to: `const navigate = useNavigate();
  
  // Usar hook seguro para scroll
  useSafeScrollListener(() => {
    const scrollY = window.scrollY;
    setShowBottomNav(scrollY > 100);
    setHeaderCollapsed(scrollY > 50);
  }, { throttle: 100 });`
  },
  
  // Adicionar categorias aos itens de navegação
  {
    from: /{ id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Visão geral do sistema" }/g,
    to: '{ id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Visão geral do sistema", category: "Principal" }'
  },
  {
    from: /{ id: "notifications", label: "Notificações", icon: Bell, description: "Gerir notificações" }/g,
    to: '{ id: "notifications", label: "Notificações", icon: Bell, description: "Gerir notificações", category: "Principal" }'
  },
  {
    from: /{ id: "news", label: "Notícias", icon: FileText, description: "Gerir notícias" }/g,
    to: '{ id: "news", label: "Notícias", icon: FileText, description: "Gerir notícias", category: "Conteúdo" }'
  }
];

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error.message);
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error.message);
    return false;
  }
}

function hasRequiredImports(content, requiredImports) {
  return requiredImports.every(importName => 
    content.includes(`import { ${importName}`) || 
    content.includes(`import ${importName}`)
  );
}

function addRequiredImports(content, requiredImports) {
  const existingImports = requiredImports.filter(importName => 
    content.includes(`import { ${importName}`) || 
    content.includes(`import ${importName}`)
  );
  
  const missingImports = requiredImports.filter(importName => !existingImports.includes(importName));
  
  if (missingImports.length === 0) {
    return content;
  }
  
  // Adicionar imports faltantes
  const importStatement = `import { ${missingImports.join(', ')} } from "@/components/layout/ResponsiveLayout";`;
  
  // Encontrar última linha de import
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
    return lines.join('\n');
  }
  
  return content;
}

function applyResponsiveTransformations(content, patterns) {
  let transformedContent = content;
  
  patterns.forEach(pattern => {
    if (typeof pattern.to === 'function') {
      transformedContent = transformedContent.replace(pattern.from, pattern.to);
    } else {
      transformedContent = transformedContent.replace(pattern.from, pattern.to);
    }
  });
  
  return transformedContent;
}

function processAdminFile(filePath) {
  console.log(`📝 Processando: ${path.basename(filePath)}`);
  
  const content = readFile(filePath);
  if (!content) return false;
  
  // Determinar padrões baseado no tipo de arquivo
  let patterns = ADMIN_RESPONSIVE_PATTERNS;
  if (filePath.includes('Admin.tsx')) {
    patterns = [...ADMIN_RESPONSIVE_PATTERNS, ...ADMIN_PAGE_PATTERNS];
  }
  
  // Aplicar transformações
  let transformedContent = applyResponsiveTransformations(content, patterns);
  
  // Adicionar imports necessários
  const requiredImports = [];
  patterns.forEach(pattern => {
    if (pattern.requires) {
      requiredImports.push(...pattern.requires);
    }
  });
  
  if (requiredImports.length > 0) {
    transformedContent = addRequiredImports(transformedContent, requiredImports);
  }
  
  // Escrever arquivo transformado
  if (writeFile(filePath, transformedContent)) {
    console.log(`✅ ${path.basename(filePath)} atualizado`);
    return true;
  }
  
  return false;
}

function findAdminFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  scanDirectory(dir);
  return files;
}

function main() {
  console.log('🎨 Aplicando melhorias responsivas à área administrativa...\n');
  
  // Processar página Admin.tsx
  if (fs.existsSync(ADMIN_PAGE)) {
    processAdminFile(ADMIN_PAGE);
  }
  
  // Processar componentes administrativos
  if (fs.existsSync(ADMIN_DIR)) {
    const adminFiles = findAdminFiles(ADMIN_DIR);
    
    console.log(`📁 Encontrados ${adminFiles.length} arquivos administrativos`);
    
    let processedCount = 0;
    adminFiles.forEach(filePath => {
      if (processAdminFile(filePath)) {
        processedCount++;
      }
    });
    
    console.log(`\n✅ Processados ${processedCount} arquivos administrativos`);
  }
  
  console.log('\n🎉 Melhorias responsivas aplicadas com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Execute: npm run dev');
  console.log('   2. Teste a área administrativa em dispositivos móveis');
  console.log('   3. Verifique se a navegação mobile está funcionando');
  console.log('   4. Teste os componentes responsivos');
}

if (require.main === module) {
  main();
}

module.exports = {
  applyResponsiveTransformations,
  processAdminFile,
  findAdminFiles
}; 