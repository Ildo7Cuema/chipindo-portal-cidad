import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EventRegistration {
  id: number;
  event_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_age: number;
  participant_gender: string;
  participant_address: string;
  participant_occupation: string;
  participant_organization: string;
  special_needs: string;
  dietary_restrictions: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  registration_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  notes: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
  event_organizer?: string;
  event_category?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  event_time: string;
  location: string;
  organizer: string;
  category: string;
  status: string;
  max_participants: number;
  current_participants: number;
}

export interface RegistrationStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  attended: number;
  confirmedPercentage: number;
  pendingPercentage: number;
  cancelledPercentage: number;
  attendedPercentage: number;
}

export interface AdminFilters {
  eventId?: number;
  status?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}

export function useEventRegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    attended: 0,
    confirmedPercentage: 0,
    pendingPercentage: 0,
    cancelledPercentage: 0,
    attendedPercentage: 0
  });
  const { toast } = useToast();

  // Buscar todos os eventos
  const fetchEvents = async () => {
    try {
      const { data, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (eventsError) {
        throw eventsError;
      }

      setEvents(data || []);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    }
  };

  // Buscar todas as inscrições
  const fetchRegistrations = async (filters?: AdminFilters) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            title,
            description,
            date,
            event_time,
            location,
            organizer,
            category,
            status,
            max_participants,
            current_participants
          )
        `)
        .order('registration_date', { ascending: false });

      // Aplicar filtros
      if (filters?.eventId) {
        query = query.eq('event_id', filters.eventId);
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateFrom) {
        query = query.gte('registration_date', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('registration_date', filters.dateTo);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transformar dados para incluir informações do evento
      const transformedData = data?.map(registration => ({
        ...registration,
        event_title: registration.events?.title,
        event_date: registration.events?.date,
        event_location: registration.events?.location,
        event_organizer: registration.events?.organizer,
        event_category: registration.events?.category
      })) || [];

      setRegistrations(transformedData);
      setFilteredRegistrations(transformedData);
      
      // Calcular estatísticas
      calculateStats(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar inscrições');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as inscrições",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar inscrições localmente
  const filterRegistrations = (searchTerm?: string, category?: string) => {
    let filtered = registrations;
    
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participant_phone.includes(searchTerm) ||
        reg.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participant_occupation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(reg => reg.event_category === category);
    }
    
    setFilteredRegistrations(filtered);
    calculateStats(filtered);
  };

  // Calcular estatísticas
  const calculateStats = (data: EventRegistration[]) => {
    const total = data.length;
    const confirmed = data.filter(r => r.status === 'confirmed').length;
    const pending = data.filter(r => r.status === 'pending').length;
    const cancelled = data.filter(r => r.status === 'cancelled').length;
    const attended = data.filter(r => r.status === 'attended').length;

    setStats({
      total,
      confirmed,
      pending,
      cancelled,
      attended,
      confirmedPercentage: total > 0 ? (confirmed / total) * 100 : 0,
      pendingPercentage: total > 0 ? (pending / total) * 100 : 0,
      cancelledPercentage: total > 0 ? (cancelled / total) * 100 : 0,
      attendedPercentage: total > 0 ? (attended / total) * 100 : 0
    });
  };

  // Atualizar status de uma inscrição
  const updateRegistrationStatus = async (registrationId: number, status: string, notes?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({ 
          status, 
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (updateError) {
        throw updateError;
      }

      // Atualizar estado local
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: status as any, notes: notes || reg.notes }
            : reg
        )
      );

      setFilteredRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: status as any, notes: notes || reg.notes }
            : reg
        )
      );

      toast({
        title: "Status atualizado",
        description: `Status da inscrição atualizado para "${status}"`,
      });

      // Recalcular estatísticas
      calculateStats(filteredRegistrations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da inscrição",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualização em lote
  const bulkUpdateStatus = async (registrationIds: number[], status: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({ 
          status, 
          updated_at: new Date().toISOString()
        })
        .in('id', registrationIds);

      if (updateError) {
        throw updateError;
      }

      // Atualizar estado local
      setRegistrations(prev => 
        prev.map(reg => 
          registrationIds.includes(reg.id)
            ? { ...reg, status: status as any }
            : reg
        )
      );

      setFilteredRegistrations(prev => 
        prev.map(reg => 
          registrationIds.includes(reg.id)
            ? { ...reg, status: status as any }
            : reg
        )
      );

      toast({
        title: "Atualização em lote",
        description: `${registrationIds.length} inscrições atualizadas para "${status}"`,
      });

      // Recalcular estatísticas
      calculateStats(filteredRegistrations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na atualização em lote');
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as inscrições selecionadas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Enviar notificação
  const sendNotification = async (message: string, registrationIds: number[]) => {
    setLoading(true);
    setError(null);

    try {
      // Buscar emails dos participantes selecionados
      const selectedRegistrations = registrations.filter(reg => registrationIds.includes(reg.id));
      const emails = selectedRegistrations.map(reg => reg.participant_email);

      // Chamar edge function para enviar notificação
      const { error: notificationError } = await supabase.functions.invoke('send-event-notification', {
        body: {
          emails,
          message,
          subject: 'Notificação sobre sua inscrição em evento'
        }
      });

      if (notificationError) {
        throw notificationError;
      }

      toast({
        title: "Notificação enviada",
        description: `Notificação enviada para ${emails.length} participantes`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar notificação');
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Exportar dados
  const exportRegistrations = async (registrationIds?: number[]) => {
    try {
      const dataToExport = registrationIds 
        ? registrations.filter(reg => registrationIds.includes(reg.id))
        : registrations;

      // Converter para CSV
      const headers = [
        'ID',
        'Nome',
        'Email',
        'Telefone',
        'Idade',
        'Gênero',
        'Profissão',
        'Organização',
        'Status',
        'Data de Inscrição',
        'Evento',
        'Local do Evento',
        'Organizador',
        'Categoria'
      ];

      const csvContent = [
        headers.join(','),
        ...dataToExport.map(reg => [
          reg.id,
          `"${reg.participant_name}"`,
          reg.participant_email,
          reg.participant_phone,
          reg.participant_age,
          reg.participant_gender,
          `"${reg.participant_occupation}"`,
          `"${reg.participant_organization}"`,
          reg.status,
          reg.registration_date,
          `"${reg.event_title}"`,
          `"${reg.event_location}"`,
          `"${reg.event_organizer}"`,
          `"${reg.event_category}"`
        ].join(','))
      ].join('\n');

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `inscricoes_eventos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportação concluída",
        description: `${dataToExport.length} inscrições exportadas com sucesso`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar dados');
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados",
        variant: "destructive"
      });
    }
  };

  // Buscar estatísticas por evento
  const getEventStats = async (eventId: number) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('status')
        .eq('event_id', eventId);

      if (error) throw error;

      const total = data.length;
      const confirmed = data.filter(r => r.status === 'confirmed').length;
      const pending = data.filter(r => r.status === 'pending').length;
      const cancelled = data.filter(r => r.status === 'cancelled').length;
      const attended = data.filter(r => r.status === 'attended').length;

      return {
        total,
        confirmed,
        pending,
        cancelled,
        attended,
        confirmedPercentage: total > 0 ? (confirmed / total) * 100 : 0,
        pendingPercentage: total > 0 ? (pending / total) * 100 : 0,
        cancelledPercentage: total > 0 ? (cancelled / total) * 100 : 0,
        attendedPercentage: total > 0 ? (attended / total) * 100 : 0
      };
    } catch (err) {
      console.error('Erro ao buscar estatísticas do evento:', err);
      return null;
    }
  };

  // Buscar estatísticas por categoria
  const getCategoryStats = () => {
    const categoryStats: Record<string, number> = {};
    
    registrations.forEach(reg => {
      const category = reg.event_category || 'Sem categoria';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    return categoryStats;
  };

  // Inicializar dados
  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  return {
    registrations,
    filteredRegistrations,
    events,
    loading,
    error,
    stats,
    fetchRegistrations,
    filterRegistrations,
    updateRegistrationStatus,
    bulkUpdateStatus,
    sendNotification,
    exportRegistrations,
    getEventStats,
    getCategoryStats
  };
} 