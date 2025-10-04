import { supabase } from "@/integrations/supabase/client";
import { getSMSConfig, formatSMSRequest, validateSMSResponse } from "./sms-config";
import { debugEnvironmentVariables } from "./debug-env";

export interface ForwardMessageRequest {
  manifestacao_id?: string;
  request_id?: string;
  forward_type: 'sms' | 'whatsapp';
  recipient_phone: string;
  message: string;
  forwarded_by: string;
}

export interface ForwardMessageResponse {
  success: boolean;
  message: string;
  error?: string;
}

export class ForwardService {
  // Função para enviar SMS via API real
  static async sendSMS(phone: string, message: string): Promise<ForwardMessageResponse> {
    try {
      // Debug das variáveis de ambiente
      debugEnvironmentVariables();
      
      // Obter configuração da API de SMS
      const config = getSMSConfig();
      
      if (!config.apiUrl) {
        console.error('❌ API de SMS não configurada');
        console.error('💡 Verifique se VITE_SMS_API_URL está definida no arquivo .env');
        return {
          success: false,
          message: 'API de SMS não configurada',
          error: 'VITE_SMS_API_URL não encontrada nas variáveis de ambiente'
        };
      }

      console.log('📱 Enviando SMS via API real...');
      console.log('📞 Telefone:', phone);
      console.log('📝 Mensagem:', message);
      console.log('🔗 API URL:', config.apiUrl);
      console.log('⚙️ Configuração:', config);

      // Formatar requisição para a API
      const request = formatSMSRequest(config, phone, message);

      // Fazer requisição para a API de SMS
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });

      console.log('📡 Resposta da API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API de SMS:', errorText);
        
        return {
          success: false,
          message: 'Falha ao enviar SMS',
          error: `API retornou status ${response.status}: ${errorText}`
        };
      }

      const result = await response.json();
      console.log('✅ Resposta da API:', result);

      // Validar resposta da API
      const validation = validateSMSResponse(config, result);
      
      if (!validation.success) {
        return {
          success: false,
          message: 'Falha ao enviar SMS',
          error: validation.error || 'Resposta da API indica falha'
        };
      }

      return {
        success: true,
        message: 'SMS enviado com sucesso via API',
        messageId: validation.messageId
      };

    } catch (error) {
      console.error('❌ Erro ao enviar SMS:', error);
      return {
        success: false,
        message: 'Falha ao enviar SMS',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Função para limpar número de telefone
  private static cleanPhoneNumber(phone: string): string {
    // Remover todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, '');
    
    // Adicionar código do país se não existir
    if (!cleaned.startsWith('244')) {
      cleaned = '244' + cleaned;
    }
    
    // Adicionar + no início
    return '+' + cleaned;
  }

  // Função para abrir WhatsApp Web
  static openWhatsApp(phone: string, message: string): void {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  // Função para registrar o reencaminhamento no banco de dados
  static async logForward(request: ForwardMessageRequest): Promise<ForwardMessageResponse> {
    try {
      // Preparar dados para inserção
      const insertData: any = {
        forward_type: request.forward_type,
        recipient_phone: request.recipient_phone,
        message: request.message,
        forwarded_by: request.forwarded_by,
        status: 'sent',
        forwarded_at: new Date().toISOString()
      };

      // Adicionar manifestacao_id se existir
      if (request.manifestacao_id) {
        insertData.manifestacao_id = request.manifestacao_id;
      }

      // Adicionar request_id se existir (e se a coluna existir na tabela)
      if (request.request_id) {
        // Tentar adicionar request_id, mas não falhar se a coluna não existir
        try {
          insertData.request_id = request.request_id;
        } catch (e) {
          console.warn('Campo request_id não disponível na tabela, continuando sem ele...');
        }
      }

      const { data, error } = await supabase
        .from('ouvidoria_forward_logs')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao registrar reencaminhamento:', error);
        
        // Se o erro for relacionado ao campo request_id, tentar sem ele
        if (error.message.includes('request_id') && request.request_id) {
          console.log('Tentando registrar sem request_id...');
          delete insertData.request_id;
          
          const { data: retryData, error: retryError } = await supabase
            .from('ouvidoria_forward_logs')
            .insert(insertData)
            .select()
            .single();

          if (retryError) {
            return {
              success: false,
              message: 'Erro ao registrar reencaminhamento',
              error: retryError.message
            };
          }

          return {
            success: true,
            message: 'Reencaminhamento registrado com sucesso (sem request_id)'
          };
        }

        return {
          success: false,
          message: 'Erro ao registrar reencaminhamento',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Reencaminhamento registrado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao registrar reencaminhamento:', error);
      return {
        success: false,
        message: 'Erro ao registrar reencaminhamento',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Função principal para reencaminhar mensagem
  static async forwardMessage(request: ForwardMessageRequest): Promise<ForwardMessageResponse> {
    try {
      let result: ForwardMessageResponse;

      if (request.forward_type === 'sms') {
        result = await this.sendSMS(request.recipient_phone, request.message);
      } else {
        // Para WhatsApp, apenas abrir o link
        this.openWhatsApp(request.recipient_phone, request.message);
        result = {
          success: true,
          message: 'WhatsApp aberto! Envie a mensagem manualmente.'
        };
      }

      // Registrar o log independentemente do resultado
      await this.logForward(request);

      return result;
    } catch (error) {
      console.error('Erro ao reencaminhar mensagem:', error);
      return {
        success: false,
        message: 'Erro ao reencaminhar mensagem',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Função para obter histórico de reencaminhamentos
  static async getForwardHistory(manifestacaoId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('ouvidoria_forward_logs')
        .select(`
          *,
          manifestacao:ouvidoria_manifestacoes(
            protocolo,
            assunto,
            nome
          )
        `)
        .order('forwarded_at', { ascending: false });

      if (manifestacaoId) {
        query = query.eq('manifestacao_id', manifestacaoId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  // Função para gerar mensagem padrão
  static generateDefaultMessage(manifestacao: any, categoryName: string): string {
    return `🔔 NOVA MANIFESTAÇÃO - OUVIDORIA MUNICIPAL

📋 Protocolo: ${manifestacao.protocolo}
👤 Solicitante: ${manifestacao.nome}
📧 Email: ${manifestacao.email}
📱 Telefone: ${manifestacao.telefone}
📝 Assunto: ${manifestacao.assunto}
🏷️ Categoria: ${categoryName}
📊 Prioridade: ${manifestacao.prioridade}
📅 Data: ${new Date(manifestacao.data_abertura).toLocaleDateString('pt-AO')}

📄 DESCRIÇÃO:
${manifestacao.descricao}

⚠️ Esta manifestação requer atenção imediata da direção.

---
Enviado via Sistema de Ouvidoria Municipal`;
  }

  // Função para gerar mensagem padrão para solicitações de serviços
  static generateServiceRequestMessage(request: any, serviceDirection: string): string {
    return `🔔 NOVA SOLICITAÇÃO DE SERVIÇO - MUNICÍPIO

📋 ID: ${request.id}
👤 Requerente: ${request.requester_name}
📧 Email: ${request.requester_email}
📱 Telefone: ${request.requester_phone || 'Não informado'}
📝 Assunto: ${request.subject}
🏷️ Serviço: ${request.service_name}
🏢 Direcção: ${serviceDirection}
📊 Prioridade: ${request.priority}
📅 Data: ${new Date(request.created_at).toLocaleDateString('pt-AO')}

📄 MENSAGEM:
${request.message}

⚠️ Esta solicitação requer atenção imediata da direção.

---
Enviado via Sistema de Solicitações de Serviços`;
  }

  // Função para reencaminhar solicitação de serviço
  static async forwardServiceRequest(request: ForwardMessageRequest): Promise<ForwardMessageResponse> {
    try {
      let result: ForwardMessageResponse;

      if (request.forward_type === 'sms') {
        result = await this.sendSMS(request.recipient_phone, request.message);
      } else {
        // Para WhatsApp, apenas abrir o link
        this.openWhatsApp(request.recipient_phone, request.message);
        result = {
          success: true,
          message: 'WhatsApp aberto! Envie a mensagem manualmente.'
        };
      }

      // Registrar o log independentemente do resultado
      await this.logForward(request);

      return result;
    } catch (error) {
      console.error('Erro ao reencaminhar solicitação:', error);
      return {
        success: false,
        message: 'Erro ao reencaminhar solicitação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
} 