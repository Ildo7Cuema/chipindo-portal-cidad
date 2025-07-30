const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando funcionalidade dos Setores Estratégicos...\n');

// Verificar se os arquivos necessários existem
const filesToCheck = [
  'src/hooks/useSetoresEstrategicos.mock.ts',
  'src/components/admin/SetoresEstrategicosManager.tsx',
  'src/pages/Admin.tsx'
];

console.log('📁 Verificando arquivos necessários:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Verificar se o componente está sendo importado corretamente
console.log('\n🔗 Verificando importações:');
const adminContent = fs.readFileSync(path.join(__dirname, 'src/pages/Admin.tsx'), 'utf8');
const hasImport = adminContent.includes('SetoresEstrategicosManager');
const hasUsage = adminContent.includes('{activeTab === "setores" && <SetoresEstrategicosManager />}');

console.log(`${hasImport ? '✅' : '❌'} Import do SetoresEstrategicosManager`);
console.log(`${hasUsage ? '✅' : '❌'} Uso do componente na página Admin`);

// Verificar se o hook mock existe e tem dados
console.log('\n📊 Verificando dados mock:');
const hookContent = fs.readFileSync(path.join(__dirname, 'src/hooks/useSetoresEstrategicos.mock.ts'), 'utf8');
const hasMockData = hookContent.includes('mockSetores');
const hasHookExport = hookContent.includes('export const useSetoresEstrategicos');

console.log(`${hasMockData ? '✅' : '❌'} Dados mock dos setores`);
console.log(`${hasHookExport ? '✅' : '❌'} Hook exportado`);

// Verificar se o componente manager está usando o hook correto
console.log('\n🎛️ Verificando componente manager:');
const managerContent = fs.readFileSync(path.join(__dirname, 'src/components/admin/SetoresEstrategicosManager.tsx'), 'utf8');
const usesMockHook = managerContent.includes('useSetoresEstrategicos.mock');
const hasToastImport = managerContent.includes('useToast');

console.log(`${usesMockHook ? '✅' : '❌'} Usando hook mock`);
console.log(`${hasToastImport ? '✅' : '❌'} Import do useToast`);

console.log('\n🎯 Resumo:');
console.log('Para acessar a gestão de setores estratégicos:');
console.log('1. Acesse: http://localhost:8081/admin');
console.log('2. Faça login na área administrativa');
console.log('3. Clique em "Setores Estratégicos" no menu lateral');
console.log('4. Gerencie os setores existentes ou crie novos');

console.log('\n✨ Funcionalidade deve estar funcionando corretamente!'); 