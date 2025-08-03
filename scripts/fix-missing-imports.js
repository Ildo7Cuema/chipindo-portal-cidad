import fs from 'fs';
import path from 'path';

// Verificar e corrigir imports faltantes em todas as páginas dos sectores
const sectorPages = [
  'src/pages/Educacao.tsx',
  'src/pages/Saude.tsx',
  'src/pages/Agricultura.tsx',
  'src/pages/SectorMineiro.tsx',
  'src/pages/DesenvolvimentoEconomico.tsx',
  'src/pages/Cultura.tsx',
  'src/pages/Tecnologia.tsx',
  'src/pages/EnergiaAgua.tsx'
];

// Imports necessários para cada página
const requiredImports = [
  'SetorStats',
  'SetorBreadcrumb',
  'SetorNavigation',
  'CandidaturaForm',
  'InscricaoProgramaForm'
];

function fixMissingImports() {
  console.log('🔧 Verificando e corrigindo imports faltantes...\n');

  for (const pagePath of sectorPages) {
    if (!fs.existsSync(pagePath)) {
      console.log(`❌ Arquivo não encontrado: ${pagePath}`);
      continue;
    }

    try {
      let content = fs.readFileSync(pagePath, 'utf8');
      let modified = false;
      const filename = path.basename(pagePath);

      console.log(`📄 ${filename}:`);

      // Verificar cada import necessário
      for (const importName of requiredImports) {
        const hasImport = content.includes(`import { ${importName} }`);
        const hasUsage = content.includes(`<${importName}`);
        
        if (hasUsage && !hasImport) {
          console.log(`   ❌ ${importName} - Usado mas não importado`);
          
          // Adicionar o import
          const importStatement = `import { ${importName} } from "@/components/ui/${getImportPath(importName)}";`;
          
          // Encontrar onde adicionar o import (após os imports existentes)
          const importLines = content.split('\n');
          let insertIndex = -1;
          
          for (let i = 0; i < importLines.length; i++) {
            if (importLines[i].startsWith('import {') && importLines[i].includes('setor-')) {
              insertIndex = i + 1;
              break;
            }
          }
          
          if (insertIndex === -1) {
            // Se não encontrar, adicionar após o primeiro import
            for (let i = 0; i < importLines.length; i++) {
              if (importLines[i].startsWith('import')) {
                insertIndex = i + 1;
                break;
              }
            }
          }
          
          if (insertIndex !== -1) {
            importLines.splice(insertIndex, 0, importStatement);
            content = importLines.join('\n');
            modified = true;
            console.log(`   ✅ ${importName} - Import adicionado`);
          }
        } else if (hasImport && hasUsage) {
          console.log(`   ✅ ${importName} - Import e uso OK`);
        } else if (hasImport && !hasUsage) {
          console.log(`   ⚠️  ${importName} - Importado mas não usado`);
        } else {
          console.log(`   ❌ ${importName} - Não importado nem usado`);
        }
      }

      if (modified) {
        fs.writeFileSync(pagePath, content);
        console.log(`   💾 Arquivo atualizado`);
      }

    } catch (error) {
      console.error(`❌ Erro ao processar ${pagePath}:`, error.message);
    }

    console.log('');
  }

  console.log('🎉 Verificação e correção concluída!');
}

function getImportPath(componentName) {
  const importPaths = {
    'SetorStats': 'setor-stats',
    'SetorBreadcrumb': 'setor-breadcrumb',
    'SetorNavigation': 'setor-navigation',
    'CandidaturaForm': 'candidatura-form',
    'InscricaoProgramaForm': 'inscricao-programa-form'
  };
  
  return importPaths[componentName] || componentName.toLowerCase();
}

function checkComponentUsage() {
  console.log('\n🔍 Verificando uso dos componentes...\n');

  for (const pagePath of sectorPages) {
    if (!fs.existsSync(pagePath)) continue;

    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      const filename = path.basename(pagePath);
      
      console.log(`📄 ${filename}:`);
      
      // Verificar uso dos componentes
      const componentUsage = [
        { name: 'SetorBreadcrumb', pattern: '<SetorBreadcrumb' },
        { name: 'SetorNavigation', pattern: '<SetorNavigation' },
        { name: 'SetorStats', pattern: '<SetorStats' },
        { name: 'CandidaturaForm', pattern: '<CandidaturaForm' },
        { name: 'InscricaoProgramaForm', pattern: '<InscricaoProgramaForm' }
      ];

      for (const component of componentUsage) {
        const hasUsage = content.includes(component.pattern);
        const hasImport = content.includes(`import { ${component.name} }`);
        
        if (hasUsage && hasImport) {
          console.log(`   ✅ ${component.name} - OK`);
        } else if (hasUsage && !hasImport) {
          console.log(`   ❌ ${component.name} - Usado sem import`);
        } else if (!hasUsage && hasImport) {
          console.log(`   ⚠️  ${component.name} - Importado sem uso`);
        } else {
          console.log(`   ❌ ${component.name} - Não usado nem importado`);
        }
      }

    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}`);
    }

    console.log('');
  }
}

function main() {
  console.log('🔧 Correção de Imports Faltantes nas Páginas dos Sectores\n');
  
  fixMissingImports();
  checkComponentUsage();
  
  console.log('📝 Próximos passos:');
  console.log('   1. Teste as páginas dos sectores');
  console.log('   2. Verifique se não há mais erros de import');
  console.log('   3. Confirme que todos os componentes estão funcionando');
}

main(); 