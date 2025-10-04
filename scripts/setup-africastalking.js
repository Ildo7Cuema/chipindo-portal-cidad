import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupAfricasTalking() {
  try {
    console.log('🔄 Configurando AfricasTalking para SMS internacionais...');
    
    const envPath = path.join(__dirname, '..', '.env');
    
    // Ler o arquivo .env atual
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Adicionar configuração AfricasTalking
    const africastalkingConfig = `
# Configuração AfricasTalking para SMS internacionais
# VITE_SMS_PROVIDER=africastalking
# VITE_AFRICASTALKING_API_KEY=sua_chave_api_aqui
# VITE_AFRICASTALKING_USERNAME=seu_username_aqui
`;
    
    // Adicionar no final do arquivo
    envContent += africastalkingConfig;
    
    // Escrever de volta no arquivo
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Configuração AfricasTalking adicionada!');
    console.log('📋 Para usar AfricasTalking:');
    console.log('1. Registre-se em: https://africastalking.com/');
    console.log('2. Obtenha sua API Key e Username');
    console.log('3. Descomente as linhas no arquivo .env');
    console.log('4. Mude VITE_SMS_PROVIDER para "africastalking"');
    
    console.log('\n🌍 Vantagens do AfricasTalking:');
    console.log('✅ Otimizado para África');
    console.log('✅ Suporte a números angolanos (+244)');
    console.log('✅ Preços competitivos');
    console.log('✅ API simples e confiável');
    
    console.log('\n📄 Exemplo de configuração:');
    console.log('VITE_SMS_PROVIDER=africastalking');
    console.log('VITE_AFRICASTALKING_API_KEY=1234567890abcdef');
    console.log('VITE_AFRICASTALKING_USERNAME=seu_username');
    
  } catch (error) {
    console.error('❌ Erro ao configurar AfricasTalking:', error);
  }
}

setupAfricasTalking(); 