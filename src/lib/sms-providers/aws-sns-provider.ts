// Exemplo de integração com AWS SNS para envio de SMS
// Instalar: npm install @aws-sdk/client-sns

import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export interface AWSSNSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  defaultSenderId?: string;
}

export interface SMSResponse {
  success: boolean;
  message: string;
  error?: string;
  messageId?: string;
}

export class AWSSNSProvider {
  private client: SNSClient;
  private config: AWSSNSConfig;

  constructor(config: AWSSNSConfig) {
    this.config = config;
    this.client = new SNSClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async sendSMS(to: string, message: string): Promise<SMSResponse> {
    try {
      // Limpar o número de telefone
      const cleanPhone = this.cleanPhoneNumber(to);
      
      // Validar formato do número
      if (!this.isValidPhoneNumber(cleanPhone)) {
        return {
          success: false,
          message: 'Número de telefone inválido',
          error: 'Formato de telefone não suportado'
        };
      }

      // Preparar parâmetros para envio
      const params = {
        Message: message,
        PhoneNumber: cleanPhone,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: this.config.defaultSenderId || 'OUVIDORIA'
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional' // ou 'Promotional'
          }
        }
      };

      // Enviar SMS via AWS SNS
      const command = new PublishCommand(params);
      const result = await this.client.send(command);

      return {
        success: true,
        message: 'SMS enviado com sucesso',
        messageId: result.MessageId
      };

    } catch (error) {
      console.error('Erro ao enviar SMS via AWS SNS:', error);
      
      return {
        success: false,
        message: 'Falha ao enviar SMS',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  private cleanPhoneNumber(phone: string): string {
    // Remover todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, '');
    
    // Adicionar código do país se não existir
    if (!cleaned.startsWith('244')) {
      cleaned = '244' + cleaned;
    }
    
    // Adicionar + no início
    return '+' + cleaned;
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Validar formato básico para Angola (+244)
    const phoneRegex = /^\+244[0-9]{9}$/;
    return phoneRegex.test(phone);
  }

  // Enviar SMS em lote
  async sendBulkSMS(recipients: string[], message: string): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];
    
    for (const recipient of recipients) {
      const result = await this.sendSMS(recipient, message);
      results.push(result);
      
      // Pequeno delay entre envios para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Verificar atributos da conta
  async getAccountAttributes(): Promise<any> {
    try {
      // AWS SNS não tem uma API direta para verificar saldo
      // Mas podemos verificar atributos da conta
      return {
        region: this.config.region,
        senderId: this.config.defaultSenderId,
        message: 'AWS SNS não fornece saldo via API'
      };
    } catch (error) {
      console.error('Erro ao obter atributos da conta:', error);
      return null;
    }
  }
}

// Exemplo de uso:
/*
import { AWSSNSProvider } from './aws-sns-provider';

const awsConfig: AWSSNSConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  defaultSenderId: 'OUVIDORIA'
};

const smsProvider = new AWSSNSProvider(awsConfig);

// Enviar SMS individual
const result = await smsProvider.sendSMS(
  '+244123456789',
  'Teste de SMS via AWS SNS'
);

if (result.success) {
  console.log('SMS enviado:', result.messageId);
} else {
  console.error('Erro:', result.error);
}

// Enviar SMS em lote
const recipients = ['+244123456789', '+244987654321'];
const bulkResults = await smsProvider.sendBulkSMS(
  recipients,
  'Mensagem em lote via AWS SNS'
);

console.log('Resultados do envio em lote:', bulkResults);
*/ 