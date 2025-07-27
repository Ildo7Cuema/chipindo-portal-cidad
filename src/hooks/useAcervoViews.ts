import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAcervoViewsReturn {
  registerView: (acervoId: string) => Promise<void>;
  getViewsCount: (acervoId: string) => Promise<number>;
  isLoading: boolean;
}

export const useAcervoViews = (): UseAcervoViewsReturn => {
  const [isLoading, setIsLoading] = useState(false);

  // Função para obter IP do usuário (simplificada)
  const getClientIP = async (): Promise<string> => {
    try {
      // Tentar obter IP através de um serviço externo
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      // Fallback para um IP genérico baseado no timestamp
      return `client-${Date.now()}`;
    }
  };

  // Função para obter User Agent
  const getUserAgent = (): string => {
    return navigator.userAgent || 'unknown';
  };

  // Registrar visualização
  const registerView = async (acervoId: string): Promise<void> => {
    try {
      setIsLoading(true);

      // Obter dados do usuário
      const { data: { user } } = await supabase.auth.getUser();
      const ipAddress = await getClientIP();
      const userAgent = getUserAgent();

      // Tentar registrar visualização usando a função do banco
      try {
        const { data, error } = await supabase.rpc('register_acervo_view' as any, {
          p_acervo_id: acervoId,
          p_user_id: user?.id || null,
          p_ip_address: ipAddress,
          p_user_agent: userAgent
        });

        if (error) {
          console.error('Erro ao registrar visualização do acervo:', error);
          throw error;
        } else {
          console.log('✅ Visualização do acervo registrada com sucesso');
          return;
        }
      } catch (rpcError) {
        console.log('Função RPC não disponível, usando inserção direta');
        
        // Fallback: inserção direta
        const { error: insertError } = await supabase
          .from('acervo_views' as any)
          .insert({
            acervo_id: acervoId,
            user_id: user?.id || null,
            ip_address: ipAddress,
            user_agent: userAgent
          })
          .select();

        if (insertError) {
          console.error('Erro no fallback de inserção do acervo:', insertError);
        } else {
          console.log('✅ Visualização do acervo registrada com sucesso');
        }
      }
    } catch (error) {
      console.error('Erro ao registrar visualização do acervo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obter contagem de visualizações
  const getViewsCount = async (acervoId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('acervo_views' as any)
        .select('id', { count: 'exact' })
        .eq('acervo_id', acervoId);

      if (error) {
        console.error('Erro ao buscar visualizações do acervo:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Erro ao buscar contagem de visualizações do acervo:', error);
      return 0;
    }
  };

  return {
    registerView,
    getViewsCount,
    isLoading
  };
}; 