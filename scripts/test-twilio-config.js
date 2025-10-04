import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function testTwilioConfig() {
  console.log('🧪 Testando configuração do Twilio...\n');
  
  // Verificar variáveis de ambiente
  const envVars = {
    'VITE_SMS_PROVIDER': process.env.VITE_SMS_PROVIDER,
    'VITE_TWILIO_ACCOUNT_SID': process.env.VITE_TWILIO_ACCOUNT_SID,
    'VITE_TWILIO_AUTH_TOKEN': process.env.VITE_TWILIO_AUTH_TOKEN,
    'VITE_TWILIO_PHONE_NUMBER': process.env.VITE_TWILIO_PHONE_NUMBER
  };
  
  console.log('📋 Variáveis de ambiente:');
  Object.entries(envVars).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    const displayValue = value ? (key.includes('TOKEN') ? '***' + value.slice(-4) : value) : 'Ausente';
    console.log(`   ${status} ${key}: ${displayValue}`);
  });
  
  // Verificar se todas as variáveis estão presentes
  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.log('\n❌ Variáveis ausentes:', missingVars);
    return false;
  }
  
  // Verificar formato das credenciais
  const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
  
  if (!accountSid.startsWith('AC')) {
    console.log('\n❌ Account SID deve começar com "AC"');
    return false;
  }
  
  if (authToken.length !== 32) {
    console.log('\n❌ Auth Token deve ter 32 caracteres');
    return false;
  }
  
  // Simular configuração
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  console.log('\n✅ Configuração válida!');
  console.log('🔗 API URL:', apiUrl);
  console.log('🔑 Credenciais Base64:', credentials.substring(0, 20) + '...');
  console.log('📞 Número Twilio:', process.env.VITE_TWILIO_PHONE_NUMBER);
  
  console.log('\n📝 Exemplo de requisição:');
  console.log('POST', apiUrl);
  console.log('Headers:');
  console.log('  Content-Type: application/x-www-form-urlencoded');
  console.log('  Authorization: Basic', credentials.substring(0, 20) + '...');
  console.log('Body:');
  console.log('  From:', process.env.VITE_TWILIO_PHONE_NUMBER);
  console.log('  To: +244123456789');
  console.log('  Body: Teste de SMS');
  
  return true;
}

// Executar teste
const isValid = testTwilioConfig();

if (isValid) {
  console.log('\n🎉 Configuração do Twilio está pronta para uso!');
  console.log('💡 Agora você pode testar o envio de SMS no sistema.');
} else {
  console.log('\n⚠️ Corrija os problemas acima antes de testar.');
} 