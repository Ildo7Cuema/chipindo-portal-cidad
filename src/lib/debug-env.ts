// Script para debugar variáveis de ambiente
export function debugEnvironmentVariables() {
  console.log('🔍 Debugando variáveis de ambiente...');
  
  const envVars = {
    'VITE_SMS_API_URL': import.meta.env.VITE_SMS_API_URL,
    'VITE_SMS_API_KEY': import.meta.env.VITE_SMS_API_KEY,
    'VITE_SMS_PROVIDER': import.meta.env.VITE_SMS_PROVIDER,
    'VITE_TWILIO_ACCOUNT_SID': import.meta.env.VITE_TWILIO_ACCOUNT_SID,
    'VITE_TWILIO_AUTH_TOKEN': import.meta.env.VITE_TWILIO_AUTH_TOKEN,
    'VITE_AWS_REGION': import.meta.env.VITE_AWS_REGION,
    'VITE_AFRICASTALKING_API_KEY': import.meta.env.VITE_AFRICASTALKING_API_KEY,
  };

  console.log('📋 Variáveis de ambiente:', envVars);
  
  // Verificar se as variáveis essenciais estão definidas
  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente ausentes:', missingVars);
    console.error('💡 Adicione estas variáveis ao seu arquivo .env:');
    missingVars.forEach(key => {
      console.error(`   ${key}=seu_valor_aqui`);
    });
  } else {
    console.log('✅ Todas as variáveis de ambiente estão definidas');
  }

  return envVars;
}

// Função para testar a configuração de SMS
export function testSMSConfig() {
  console.log('🧪 Testando configuração de SMS...');
  
  try {
    const { getSMSConfig } = require('./sms-config');
    const config = getSMSConfig();
    
    console.log('⚙️ Configuração de SMS:', config);
    
    if (!config.apiUrl) {
      console.error('❌ URL da API não configurada');
      return false;
    }
    
    console.log('✅ Configuração de SMS válida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao testar configuração:', error);
    return false;
  }
} 