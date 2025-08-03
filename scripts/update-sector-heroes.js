import fs from 'fs';
import path from 'path';

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

function updateSectorPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
         // Add SectorHero import
     if (!content.includes('import { SectorHero }')) {
       const importMatch = content.match(/import { SetorStats } from "@\/components\/ui\/setor-stats";/);
       if (importMatch) {
         content = content.replace(
           importMatch[0],
           `${importMatch[0]}\nimport { SectorHero } from "@/components/ui/sector-hero";`
         );
       }
     }
    
    // Replace old hero section with new SectorHero component
    const oldHeroPattern = /<section className="bg-gradient-primary py-20">[\s\S]*?<\/section>/;
    const newHeroSection = `      {/* Modern Hero Section */}
      <SectorHero setor={setor} />`;
    
    if (oldHeroPattern.test(content)) {
      content = content.replace(oldHeroPattern, newHeroSection);
    }
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🚀 Updating sector pages with modern Hero component...\n');

sectorPages.forEach(pagePath => {
  if (fs.existsSync(pagePath)) {
    updateSectorPage(pagePath);
  } else {
    console.log(`⚠️  File not found: ${pagePath}`);
  }
});

console.log('\n🎉 Sector pages updated successfully!');
console.log('\n📝 Next steps:');
console.log('   1. Test the new Hero component on each sector page');
console.log('   2. Verify that all imports are working correctly');
console.log('   3. Check responsive design on different screen sizes'); 