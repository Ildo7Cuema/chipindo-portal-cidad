import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function checkTwilioNumber() {
  console.log('🔍 Verificando número Twilio...\n');
  
  const twilioNumber = process.env.VITE_TWILIO_PHONE_NUMBER;
  const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
  
  console.log('📞 Número Twilio:', twilioNumber);
  console.log('🌍 País do número:', twilioNumber?.startsWith('+1') ? 'EUA' : 'Outro');
  
  console.log('\n💡 Possíveis soluções:');
  console.log('1. Verificar se o número Twilio tem permissão internacional');
  console.log('2. Comprar um número Twilio com permissão internacional');
  console.log('3. Usar um número Twilio de outro país (ex: +44 para Reino Unido)');
  console.log('4. Configurar uma API alternativa para SMS internacionais');
  
  console.log('\n🔧 Para verificar no painel Twilio:');
  console.log('1. Acesse: https://console.twilio.com/');
  console.log('2. Vá em Phone Numbers > Manage > Active numbers');
  console.log('3. Clique no número +19033458291');
  console.log('4. Verifique se "SMS" está habilitado e se tem permissão internacional');
  
  console.log('\n📋 Informações do erro:');
  console.log('- Código: 21606');
  console.log('- Mensagem: Número não é válido para este destino');
  console.log('- Destino: Angola (+244)');
  console.log('- Origem: EUA (+1)');
  
  console.log('\n🌐 Soluções recomendadas:');
  console.log('✅ Comprar número Twilio com permissão internacional');
  console.log('✅ Usar API alternativa (AfricasTalking, AWS SNS)');
  console.log('✅ Configurar número Twilio de outro país');
}

checkTwilioNumber(); 