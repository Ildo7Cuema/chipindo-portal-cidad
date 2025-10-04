// Exemplo de integração com Twilio para envio de SMS
// Instalar: npm install twilio

import twilio from 'twilio';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface SMSResponse {
  success: boolean;
  message: string;
  error?: string;
  messageId?: string;
}

export class TwilioSMSProvider {
  private client: twilio.Twilio;
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
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

      // Enviar SMS via Twilio
      const twilioMessage = await this.client.messages.create({
        body: message,
        from: this.config.phoneNumber,
        to: cleanPhone
      });

      return {
        success: true,
        message: 'SMS enviado com sucesso',
        messageId: twilioMessage.sid
      };

    } catch (error) {
      console.error('Erro ao enviar SMS via Twilio:', error);
      
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

  // Verificar saldo da conta
  async getAccountBalance(): Promise<number> {
    try {
      const account = await this.client.api.accounts(this.config.accountSid).fetch();
      return parseFloat(account.balance);
    } catch (error) {
      console.error('Erro ao obter saldo da conta:', error);
      return 0;
    }
  }

  // Obter histórico de mensagens
  async getMessageHistory(limit: number = 50): Promise<any[]> {
    try {
      const messages = await this.client.messages.list({ limit });
      return messages.map(msg => ({
        id: msg.sid,
        to: msg.to,
        from: msg.from,
        body: msg.body,
        status: msg.status,
        dateCreated: msg.dateCreated,
        price: msg.price
      }));
    } catch (error) {
      console.error('Erro ao obter histórico de mensagens:', error);
      return [];
    }
  }
}

// Exemplo de uso:
/*
import { TwilioSMSProvider } from './twilio-provider';

const twilioConfig: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER!
};

const smsProvider = new TwilioSMSProvider(twilioConfig);

// Enviar SMS
const result = await smsProvider.sendSMS(
  '+244123456789',
  'Teste de SMS via Twilio'
);

if (result.success) {
  console.log('SMS enviado:', result.messageId);
} else {
  console.error('Erro:', result.error);
}
*/ 