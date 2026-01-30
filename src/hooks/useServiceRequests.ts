import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ServiceRequest {
  id: string;
  service_id: string;
  service_name: string;
  service_direction: string;
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_to?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  notification_sent: boolean;
  notification_sent_at?: string;
  // Additional fields from view
  service_title?: string;
  service_description?: string;
  service_direction_full?: string;
  service_category?: string;
  service_contact?: string;
  service_email?: string;
}

export interface ServiceRequestStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  urgent: number;
  today: number;
}

export function useServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ServiceRequestStats>({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    urgent: 0,
    today: 0
  });
  const { toast } = useToast();

  // Fetch all service requests
  const fetchRequests = async (sectorFilter?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      let filteredRequests = data || [];
      
      // Filtrar por setor se especificado
      if (sectorFilter && sectorFilter !== 'all') {
        console.log('ServiceRequests - Aplicando filtro para setor:', sectorFilter);
        filteredRequests = (data || []).filter(request => {
          const serviceName = request.service_name?.toLowerCase() || '';
          const serviceDirection = request.service_direction?.toLowerCase() || '';
          const subject = request.subject?.toLowerCase() || '';
          const message = request.message?.toLowerCase() || '';
          const sectorName = sectorFilter.toLowerCase();
          
          // Mapeamento de setores para palavras-chave
          const sectorKeywords: Record<string, string[]> = {
            'educação': ['educação', 'escola', 'escolar', 'académico', 'professor', 'aluno'],
            'saúde': ['saúde', 'hospital', 'médico', 'enfermeiro', 'clínica', 'atendimento médico'],
            'agricultura': ['agricultura', 'agricultor', 'fazenda', 'colheita', 'campo'],
            'setor mineiro': ['mina', 'mineiro', 'mineração', 'mineral'],
            'desenvolvimento económico': ['desenvolvimento económico', 'emprego', 'economia', 'negócio'],
            'cultura': ['cultura', 'cultural', 'arte', 'evento cultural', 'teatro'],
            'tecnologia': ['tecnologia', 'tecnológico', 'sistema', 'digital', 'computador'],
            'energia e água': ['energia', 'água', 'eletricidade', 'abastecimento de água']
          };
          
          // Verificar se o setor tem palavras-chave específicas
          const keywords = sectorKeywords[sectorName] || [sectorName];
          
          // Filtrar baseado no serviço ou conteúdo da solicitação
          const matches = keywords.some(keyword => 
            serviceName.includes(keyword) || 
            serviceDirection.includes(keyword) ||
            subject.includes(keyword) ||
            message.includes(keyword)
          );
          
          if (matches) {
            console.log('ServiceRequests - Match encontrado:', {
              serviceName,
              subject,
              sectorName,
              keywords
            });
          }
          
          return matches;
        });
        console.log('ServiceRequests - Total filtrado:', filteredRequests.length);
      }

      setRequests(filteredRequests);
      calculateStats(filteredRequests);
    } catch (error: any) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar solicitações de serviços",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (requestsList: ServiceRequest[]) => {
    const today = new Date().toDateString();
    
    const stats: ServiceRequestStats = {
      total: requestsList.length,
      pending: requestsList.filter(r => r.status === 'pending').length,
      in_progress: requestsList.filter(r => r.status === 'in_progress').length,
      completed: requestsList.filter(r => r.status === 'completed').length,
      cancelled: requestsList.filter(r => r.status === 'cancelled').length,
      urgent: requestsList.filter(r => r.priority === 'urgent').length,
      today: requestsList.filter(r => 
        new Date(r.created_at).toDateString() === today
      ).length
    };

    setStats(stats);
  };

  // Create a new service request
  const createRequest = async (requestData: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at' | 'notification_sent'>) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRequests(prev => [data, ...prev]);
      calculateStats([data, ...requests]);

      toast({
        title: "Solicitação Enviada!",
        description: "Sua solicitação foi enviada com sucesso. Entraremos em contacto em breve.",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating service request:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update service request status
  const updateRequestStatus = async (requestId: string, status: ServiceRequest['status'], adminNotes?: string) => {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('service_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRequests(prev => prev.map(r => r.id === requestId ? data : r));
      calculateStats(requests.map(r => r.id === requestId ? data : r));

      toast({
        title: "Status Actualizado",
        description: `Solicitação marcada como ${status}`,
      });

      return data;
    } catch (error: any) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da solicitação",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Assign request to admin
  const assignRequest = async (requestId: string, assignedTo: string) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .update({ assigned_to: assignedTo })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRequests(prev => prev.map(r => r.id === requestId ? data : r));

      toast({
        title: "Solicitação Atribuída",
        description: "Solicitação atribuída com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error('Error assigning request:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir solicitação",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete service request
  const deleteRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      const updatedRequests = requests.filter(r => r.id !== requestId);
      setRequests(updatedRequests);
      calculateStats(updatedRequests);

      toast({
        title: "Solicitação Removida",
        description: "Solicitação removida com sucesso",
      });
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover solicitação",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Get requests by status
  const getRequestsByStatus = (status: ServiceRequest['status']) => {
    return requests.filter(r => r.status === status);
  };

  // Get urgent requests
  const getUrgentRequests = () => {
    return requests.filter(r => r.priority === 'urgent' || r.priority === 'high');
  };

  // Get today's requests
  const getTodayRequests = () => {
    const today = new Date().toDateString();
    return requests.filter(r => 
      new Date(r.created_at).toDateString() === today
    );
  };

  useEffect(() => {
    // Removido fetchRequests() daqui para evitar conflito
    // As solicitações serão carregadas pelo componente
  }, []);

  return {
    requests,
    loading,
    stats,
    fetchRequests,
    createRequest,
    updateRequestStatus,
    assignRequest,
    deleteRequest,
    getRequestsByStatus,
    getUrgentRequests,
    getTodayRequests
  };
} 