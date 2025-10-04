import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateEnvForTwilio() {
  try {
    console.log('🔄 Atualizando arquivo .env para usar Twilio...');
    
    const envPath = path.join(__dirname, '..', '.env');
    
    // Ler o arquivo .env atual
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Remover configuração custom antiga
    envContent = envContent.replace(/# Configuração da API de SMS[\s\S]*?VITE_SMS_PROVIDER=custom/g, '');
    
    // Adicionar configuração Twilio correta
    const twilioConfig = `
# Configuração da API de SMS - Twilio
VITE_SMS_PROVIDER=twilio
VITE_TWILIO_ACCOUNT_SID=ACc1bd611c7996830c142e9588b40644b1
VITE_TWILIO_AUTH_TOKEN=798db1c1607c1b63ee908f059ee4ddc1
VITE_TWILIO_PHONE_NUMBER=+19033458291
`;
    
    // Adicionar no final do arquivo
    envContent += twilioConfig;
    
    // Escrever de volta no arquivo
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Arquivo .env atualizado com sucesso!');
    console.log('📋 Configuração Twilio adicionada');
    console.log('🔧 VITE_SMS_PROVIDER=twilio');
    console.log('📞 Número Twilio: +19033458291');
    
    // Mostrar as últimas linhas do arquivo
    console.log('\n📄 Últimas linhas do arquivo .env:');
    const lines = envContent.split('\n').slice(-6);
    lines.forEach(line => console.log(line));
    
  } catch (error) {
    console.error('❌ Erro ao atualizar arquivo .env:', error);
  }
}

updateEnvForTwilio(); 