import fs from 'fs';
import path from 'path';

// Verificar e corrigir o uso do SetorStats em todas as páginas
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

function fixSetorStatsUsage() {
  console.log('🔧 Verificando e corrigindo uso do SetorStats...\n');

  for (const pagePath of sectorPages) {
    if (!fs.existsSync(pagePath)) {
      console.log(`❌ Arquivo não encontrado: ${pagePath}`);
      continue;
    }

    try {
      let content = fs.readFileSync(pagePath, 'utf8');
      let modified = false;

      // Verificar se há uso incorreto do SetorStats
      if (content.includes('<SetorStats setorSlug=')) {
        console.log(`📝 Corrigindo ${path.basename(pagePath)}...`);
        
        // Substituir setorSlug por setor
        content = content.replace(
          /<SetorStats setorSlug="([^"]+)"/g,
          '<SetorStats setor={setor}'
        );
        
        modified = true;
        console.log(`   ✅ Corrigido: setorSlug -> setor`);
      }

      // Verificar se há uso incorreto do SetorBreadcrumb
      if (content.includes('<SetorBreadcrumb setorName=') || content.includes('<SetorBreadcrumb setorSlug=')) {
        console.log(`📝 Corrigindo SetorBreadcrumb em ${path.basename(pagePath)}...`);
        
        // Substituir setorName e setorSlug por setor
        content = content.replace(
          /<SetorBreadcrumb setorName="([^"]+)" setorSlug="([^"]+)"/g,
          '<SetorBreadcrumb setor={setor}'
        );
        
        modified = true;
        console.log(`   ✅ Corrigido: setorName/setorSlug -> setor`);
      }

      // Verificar se há verificações de segurança necessárias
      if (!content.includes('setor &&') && content.includes('setor.')) {
        console.log(`⚠️  Verificação de segurança necessária em ${path.basename(pagePath)}`);
      }

      if (modified) {
        fs.writeFileSync(pagePath, content);
        console.log(`   💾 Arquivo atualizado`);
      } else {
        console.log(`✅ ${path.basename(pagePath)} - Sem correções necessárias`);
      }

    } catch (error) {
      console.error(`❌ Erro ao processar ${pagePath}:`, error.message);
    }
  }

  console.log('\n🎉 Verificação e correção concluída!');
}

function checkComponentUsage() {
  console.log('\n🔍 Verificando uso dos componentes...\n');

  for (const pagePath of sectorPages) {
    if (!fs.existsSync(pagePath)) continue;

    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      const filename = path.basename(pagePath);
      
      console.log(`📄 ${filename}:`);
      
      // Verificar uso correto dos componentes
      const checks = [
        { name: 'SetorBreadcrumb', pattern: '<SetorBreadcrumb setor={setor}' },
        { name: 'SetorNavigation', pattern: '<SetorNavigation' },
        { name: 'SetorStats', pattern: '<SetorStats setor={setor}' },
        { name: 'CandidaturaForm', pattern: '<CandidaturaForm' },
        { name: 'InscricaoProgramaForm', pattern: '<InscricaoProgramaForm' }
      ];

      for (const check of checks) {
        const hasCorrectUsage = content.includes(check.pattern);
        console.log(`   ${hasCorrectUsage ? '✅' : '❌'} ${check.name}`);
      }

      // Verificar verificações de segurança
      const safetyChecks = [
        { name: 'setor &&', pattern: 'setor &&' },
        { name: 'setor?.', pattern: 'setor?.' },
        { name: 'setor ||', pattern: 'setor ||' }
      ];

      let hasSafetyChecks = false;
      for (const check of safetyChecks) {
        if (content.includes(check.pattern)) {
          hasSafetyChecks = true;
          break;
        }
      }

      console.log(`   ${hasSafetyChecks ? '✅' : '⚠️'} Verificações de segurança`);

    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}`);
    }

    console.log('');
  }
}

function main() {
  console.log('🔧 Correção de Uso dos Componentes dos Sectores\n');
  
  fixSetorStatsUsage();
  checkComponentUsage();
  
  console.log('📝 Próximos passos:');
  console.log('   1. Teste as páginas dos sectores');
  console.log('   2. Verifique se não há mais erros de undefined');
  console.log('   3. Confirme que os dados estão carregando corretamente');
}

main(); 