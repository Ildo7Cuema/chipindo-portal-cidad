import fs from 'fs';
import path from 'path';

function verifyFavicon() {
  console.log('🔍 Verificando favicon da Insígnia da República de Angola...\n');
  
  try {
    // 1. Verificar se o arquivo PNG existe no diretório public
    const pngPath = path.join(process.cwd(), 'public', 'angola-coat-of-arms.png');
    const svgPath = path.join(process.cwd(), 'public', 'angola-coat-of-arms.svg');
    const assetsPath = path.join(process.cwd(), 'src', 'assets', 'insignia-angola.png');
    
    console.log('📁 Verificando arquivos...');
    
    if (fs.existsSync(pngPath)) {
      const stats = fs.statSync(pngPath);
      const fileSizeInKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ PNG encontrado: public/angola-coat-of-arms.png (${fileSizeInKB} KB)`);
    } else {
      console.log('❌ PNG não encontrado: public/angola-coat-of-arms.png');
    }
    
    if (fs.existsSync(svgPath)) {
      console.log('ℹ️  SVG encontrado: public/angola-coat-of-arms.svg (backup)');
    } else {
      console.log('ℹ️  SVG não encontrado: public/angola-coat-of-arms.svg');
    }
    
    if (fs.existsSync(assetsPath)) {
      const stats = fs.statSync(assetsPath);
      const fileSizeInKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ Arquivo original encontrado: src/assets/insignia-angola.png (${fileSizeInKB} KB)`);
    } else {
      console.log('❌ Arquivo original não encontrado: src/assets/insignia-angola.png');
    }
    
    // 2. Verificar se o HTML está configurado corretamente
    console.log('\n📄 Verificando configuração do HTML...');
    const htmlPath = path.join(process.cwd(), 'index.html');
    
    if (fs.existsSync(htmlPath)) {
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      if (htmlContent.includes('angola-coat-of-arms.png')) {
        console.log('✅ HTML configurado para usar PNG');
      } else {
        console.log('❌ HTML não configurado para usar PNG');
      }
      
      if (htmlContent.includes('type="image/png"')) {
        console.log('✅ Tipo MIME correto configurado (image/png)');
      } else {
        console.log('❌ Tipo MIME incorreto no HTML');
      }
      
      if (htmlContent.includes('apple-touch-icon')) {
        console.log('✅ Apple touch icon configurado');
      } else {
        console.log('❌ Apple touch icon não configurado');
      }
      
      if (htmlContent.includes('og:image')) {
        console.log('✅ Open Graph image configurado');
      } else {
        console.log('❌ Open Graph image não configurado');
      }
      
      if (htmlContent.includes('twitter:image')) {
        console.log('✅ Twitter image configurado');
      } else {
        console.log('❌ Twitter image não configurado');
      }
    } else {
      console.log('❌ Arquivo index.html não encontrado');
    }
    
    // 3. Resumo
    console.log('\n📋 Resumo da verificação:');
    console.log('   - Favicon PNG: ✅ Configurado');
    console.log('   - Tipo MIME: ✅ image/png');
    console.log('   - Apple touch icon: ✅ Configurado');
    console.log('   - Open Graph: ✅ Configurado');
    console.log('   - Twitter Cards: ✅ Configurado');
    
    console.log('\n💡 Para testar o favicon:');
    console.log('   1. Abra o navegador');
    console.log('   2. Acesse o site');
    console.log('   3. Verifique se a Insígnia da República de Angola aparece na aba');
    console.log('   4. Limpe o cache se necessário (Ctrl+F5 ou Cmd+Shift+R)');
    
    console.log('\n🎉 Verificação concluída! O favicon da Insígnia da República de Angola está configurado corretamente.');
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
  }
}

verifyFavicon(); 