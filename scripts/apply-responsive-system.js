#!/usr/bin/env node

/**
 * Script para aplicar automaticamente o sistema responsivo em todas as páginas
 * Este script analisa as páginas existentes e aplica as melhorias responsivas
 */

const fs = require('fs');
const path = require('path');

// Configurações
const PAGES_DIR = path.join(__dirname, '../src/pages');
const COMPONENTS_DIR = path.join(__dirname, '../src/components');

// Padrões de substituição para tornar as páginas responsivas
const RESPONSIVE_PATTERNS = [
  // Substituir containers básicos
  {
    from: /<div className="container mx-auto px-4 py-(\d+)">/g,
    to: '<ResponsiveContainer spacing="lg">',
    requires: ['ResponsiveContainer']
  },
  {
    from: /<div className="container mx-auto px-4">/g,
    to: '<ResponsiveContainer>',
    requires: ['ResponsiveContainer']
  },
  
  // Substituir grids básicos
  {
    from: /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-(\d+) gap-(\d+)">/g,
    to: (match, cols, gap) => {
      const gapMap = { '4': 'sm', '6': 'md', '8': 'lg', '10': 'xl' };
      return `<ResponsiveGrid cols={{ sm: 1, md: 2, lg: ${cols} }} gap="${gapMap[gap] || 'md'}">`;
    },
    requires: ['ResponsiveGrid']
  },
  {
    from: /<div className="grid grid-cols-1 md:grid-cols-2 gap-(\d+)">/g,
    to: (match, gap) => {
      const gapMap = { '4': 'sm', '6': 'md', '8': 'lg', '10': 'xl' };
      return `<ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="${gapMap[gap] || 'md'}">`;
    },
    requires: ['ResponsiveGrid']
  },
  
  // Substituir cards básicos
  {
    from: /<Card className="hover:shadow-elegant transition-all duration-300">/g,
    to: '<ResponsiveCard interactive elevated>',
    requires: ['ResponsiveCard']
  },
  {
    from: /<Card className="text-center hover:shadow-elegant transition-all duration-300">/g,
    to: '<ResponsiveCard interactive elevated className="text-center">',
    requires: ['ResponsiveCard']
  },
  
  // Substituir seções básicas
  {
    from: /<section className="mb-(\d+)">/g,
    to: '<ResponsiveSection spacing="lg">',
    requires: ['ResponsiveSection']
  },
  
  // Substituir títulos responsivos
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
    from: /<h3 className="text-(\d+)xl md:text-(\d+)xl lg:text-(\d+)xl font-semibold([^>]*)>/g,
    to: '<ResponsiveText variant="h3"$4>',
    requires: ['ResponsiveText']
  },
  
  // Substituir parágrafos responsivos
  {
    from: /<p className="text-sm sm:text-base([^>]*)>/g,
    to: '<ResponsiveText variant="body"$1>',
    requires: ['ResponsiveText']
  },
  
  // Fechar tags de texto responsivo
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
  }
];

// Função para ler arquivo
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error.message);
    return null;
  }
}

// Função para escrever arquivo
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error.message);
    return false;
  }
}

// Função para verificar se os imports necessários já existem
function hasRequiredImports(content, requiredImports) {
  return requiredImports.every(importName => 
    content.includes(`import { ${importName}`) || 
    content.includes(`import ${importName}`)
  );
}

// Função para adicionar imports necessários
function addRequiredImports(content, requiredImports) {
  const existingImports = new Set();
  
  // Extrair imports existentes do ResponsiveLayout
  const importMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*["']@\/components\/layout\/ResponsiveLayout["']/);
  if (importMatch) {
    const existing = importMatch[1].split(',').map(s => s.trim());
    existing.forEach(imp => existingImports.add(imp));
  }
  
  // Adicionar novos imports necessários
  requiredImports.forEach(importName => {
    if (!existingImports.has(importName)) {
      existingImports.add(importName);
    }
  });
  
  // Reconstruir a linha de import
  const importLine = `import { ${Array.from(existingImports).join(', ')} } from "@/components/layout/ResponsiveLayout";`;
  
  // Substituir ou adicionar a linha de import
  if (importMatch) {
    return content.replace(importMatch[0], importLine);
  } else {
    // Adicionar após os imports existentes
    const lines = content.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '') {
        break;
      }
    }
    
    lines.splice(insertIndex, 0, importLine);
    return lines.join('\n');
  }
}

// Função para aplicar transformações responsivas
function applyResponsiveTransformations(content) {
  let transformedContent = content;
  const requiredImports = new Set();
  
  // Aplicar cada padrão de substituição
  RESPONSIVE_PATTERNS.forEach(pattern => {
    if (typeof pattern.to === 'function') {
      transformedContent = transformedContent.replace(pattern.from, pattern.to);
    } else {
      transformedContent = transformedContent.replace(pattern.from, pattern.to);
    }
    
    // Coletar imports necessários
    if (pattern.requires) {
      pattern.requires.forEach(imp => requiredImports.add(imp));
    }
  });
  
  // Adicionar imports necessários se não existirem
  if (requiredImports.size > 0) {
    transformedContent = addRequiredImports(transformedContent, Array.from(requiredImports));
  }
  
  return transformedContent;
}

// Função para processar um arquivo
function processFile(filePath) {
  console.log(`Processando: ${path.relative(process.cwd(), filePath)}`);
  
  const content = readFile(filePath);
  if (!content) return false;
  
  const transformedContent = applyResponsiveTransformations(content);
  
  if (transformedContent !== content) {
    const success = writeFile(filePath, transformedContent);
    if (success) {
      console.log(`✅ Atualizado: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
  } else {
    console.log(`⏭️  Sem alterações: ${path.relative(process.cwd(), filePath)}`);
  }
  
  return false;
}

// Função para encontrar todos os arquivos de páginas
function findPageFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(itemPath);
      }
    });
  }
  
  scanDirectory(dir);
  return files;
}

// Função principal
function main() {
  console.log('🚀 Aplicando sistema responsivo mobile-first...\n');
  
  // Verificar se os diretórios existem
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Diretório de páginas não encontrado: ${PAGES_DIR}`);
    process.exit(1);
  }
  
  // Encontrar todos os arquivos de páginas
  const pageFiles = findPageFiles(PAGES_DIR);
  
  if (pageFiles.length === 0) {
    console.log('⚠️  Nenhum arquivo de página encontrado');
    return;
  }
  
  console.log(`📁 Encontrados ${pageFiles.length} arquivos de páginas\n`);
  
  // Processar cada arquivo
  let processedCount = 0;
  let updatedCount = 0;
  
  pageFiles.forEach(filePath => {
    processedCount++;
    const updated = processFile(filePath);
    if (updated) updatedCount++;
  });
  
  console.log(`\n📊 Resumo:`);
  console.log(`   • Arquivos processados: ${processedCount}`);
  console.log(`   • Arquivos atualizados: ${updatedCount}`);
  console.log(`   • Arquivos sem alterações: ${processedCount - updatedCount}`);
  
  if (updatedCount > 0) {
    console.log(`\n✅ Sistema responsivo aplicado com sucesso em ${updatedCount} arquivos!`);
    console.log(`\n📖 Consulte o guia RESPONSIVE_SYSTEM_GUIDE.md para mais informações.`);
  } else {
    console.log(`\nℹ️  Nenhuma alteração foi necessária.`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  applyResponsiveTransformations,
  processFile,
  findPageFiles
}; 