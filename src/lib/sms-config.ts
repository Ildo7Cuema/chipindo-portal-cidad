// Configuração para API de SMS
export interface SMSConfig {
  apiUrl: string;
  apiKey?: string;
  method: 'POST' | 'GET';
  headers?: Record<string, string>;
  bodyFormat: 'json' | 'form-data' | 'url-encoded';
  phoneField: string;
  messageField: string;
  fromField?: string;
  successField?: string;
  errorField?: string;
  messageIdField?: string;
}

// Configurações para diferentes provedores de SMS
export const SMS_PROVIDERS = {
  // Exemplo para Twilio
  twilio: {
    apiUrl: 'https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json',
    method: 'POST' as const,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic {Base64EncodedCredentials}'
    },
    bodyFormat: 'url-encoded' as const,
    phoneField: 'To',
    messageField: 'Body',
    fromField: 'From',
    successField: 'status',
    messageIdField: 'sid'
  },

  // Exemplo para AWS SNS
  aws_sns: {
    apiUrl: 'https://sns.{region}.amazonaws.com/',
    method: 'POST' as const,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    bodyFormat: 'url-encoded' as const,
    phoneField: 'PhoneNumber',
    messageField: 'Message',
    successField: 'ResponseMetadata'
  },

  // Exemplo para AfricasTalking
  africastalking: {
    apiUrl: 'https://api.africastalking.com/version1/messaging',
    method: 'POST' as const,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': '{API_KEY}'
    },
    bodyFormat: 'url-encoded' as const,
    phoneField: 'to',
    messageField: 'message',
    successField: 'SMSMessageData'
  },

  // Configuração genérica para API customizada
  custom: {
    apiUrl: import.meta.env.VITE_SMS_API_URL || '',
    method: 'POST' as const,
    headers: {
      'Content-Type': 'application/json'
    },
    bodyFormat: 'json' as const,
    phoneField: 'phone',
    messageField: 'message',
    successField: 'success',
    errorField: 'error',
    messageIdField: 'id'
  }
};

// Função para obter configuração da API de SMS
export function getSMSConfig(): SMSConfig {
  const provider = import.meta.env.VITE_SMS_PROVIDER || 'custom';
  const config = SMS_PROVIDERS[provider as keyof typeof SMS_PROVIDERS] || SMS_PROVIDERS.custom;

  // Substituir placeholders com variáveis de ambiente
  if (provider === 'twilio') {
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    return {
      ...config,
      apiUrl: config.apiUrl.replace('{AccountSid}', accountSid || ''),
      headers: {
        ...config.headers,
        'Authorization': `Basic ${credentials}`
      }
    };
  }

  if (provider === 'aws_sns') {
    const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
    return {
      ...config,
      apiUrl: config.apiUrl.replace('{region}', region)
    };
  }

  if (provider === 'africastalking') {
    const apiKey = import.meta.env.VITE_AFRICASTALKING_API_KEY;
    return {
      ...config,
      headers: {
        ...config.headers,
        'apiKey': apiKey || ''
      }
    };
  }

  // Configuração customizada
  return {
    ...config,
    apiUrl: import.meta.env.VITE_SMS_API_URL || '',
    apiKey: import.meta.env.VITE_SMS_API_KEY,
    headers: {
      ...config.headers,
      ...(import.meta.env.VITE_SMS_API_KEY && {
        'Authorization': `Bearer ${import.meta.env.VITE_SMS_API_KEY}`
      })
    }
  };
}

// Função para formatar dados para a API
export function formatSMSRequest(config: SMSConfig, phone: string, message: string): {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | FormData;
} {
  const cleanPhone = cleanPhoneNumber(phone);
  
  let body: string | FormData;
  
  if (config.bodyFormat === 'json') {
    const data: any = {
      [config.phoneField]: cleanPhone,
      [config.messageField]: message,
      timestamp: new Date().toISOString()
    };
    
    // Adicionar campo From se configurado
    if (config.fromField) {
      data[config.fromField] = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
    }
    
    body = JSON.stringify(data);
  } else if (config.bodyFormat === 'form-data') {
    const formData = new FormData();
    formData.append(config.phoneField, cleanPhone);
    formData.append(config.messageField, message);
    formData.append('timestamp', new Date().toISOString());
    
    // Adicionar campo From se configurado
    if (config.fromField) {
      formData.append(config.fromField, import.meta.env.VITE_TWILIO_PHONE_NUMBER);
    }
    
    body = formData;
  } else {
    // url-encoded
    const params = new URLSearchParams();
    params.append(config.phoneField, cleanPhone);
    params.append(config.messageField, message);
    params.append('timestamp', new Date().toISOString());
    
    // Adicionar campo From se configurado
    if (config.fromField) {
      params.append(config.fromField, import.meta.env.VITE_TWILIO_PHONE_NUMBER);
    }
    
    body = params.toString();
  }

  return {
    url: config.apiUrl,
    method: config.method,
    headers: config.headers || {},
    body
  };
}

// Função para limpar número de telefone
function cleanPhoneNumber(phone: string): string {
  // Remover todos os caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');
  
  // Adicionar código do país se não existir
  if (!cleaned.startsWith('244')) {
    cleaned = '244' + cleaned;
  }
  
  // Adicionar + no início
  return '+' + cleaned;
}

// Função para validar resposta da API
export function validateSMSResponse(config: SMSConfig, response: any): {
  success: boolean;
  messageId?: string;
  error?: string;
} {
  if (config.successField) {
    const success = response[config.successField];
    if (!success) {
      return {
        success: false,
        error: response[config.errorField] || 'Resposta da API indica falha'
      };
    }
  }

  return {
    success: true,
    messageId: config.messageIdField ? response[config.messageIdField] : undefined
  };
} 