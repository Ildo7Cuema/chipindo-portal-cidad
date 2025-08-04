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
}

export interface RegistrationFormData {
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
}

export function useEventRegistrations() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Buscar inscrições
  const fetchRegistrations = async (eventId?: number, status?: string) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            title,
            date,
            location
          )
        `)
        .order('registration_date', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
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
        event_location: registration.events?.location
      })) || [];

      setRegistrations(transformedData);
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

  // Registrar para um evento
  const registerForEvent = async (formData: RegistrationFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: registerError } = await supabase.rpc('register_for_event', {
        p_event_id: formData.event_id,
        p_participant_name: formData.participant_name,
        p_participant_email: formData.participant_email,
        p_participant_phone: formData.participant_phone,
        p_participant_age: formData.participant_age,
        p_participant_gender: formData.participant_gender,
        p_participant_address: formData.participant_address,
        p_participant_occupation: formData.participant_occupation,
        p_participant_organization: formData.participant_organization,
        p_special_needs: formData.special_needs,
        p_dietary_restrictions: formData.dietary_restrictions,
        p_emergency_contact_name: formData.emergency_contact_name,
        p_emergency_contact_phone: formData.emergency_contact_phone
      });

      if (registerError) {
        throw registerError;
      }

      toast({
        title: "Inscrição realizada!",
        description: "Sua inscrição foi processada com sucesso. Você receberá uma confirmação por email.",
      });

      // Atualizar lista de inscrições
      await fetchRegistrations();

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar inscrição';
      setError(errorMessage);
      
      // Mensagens de erro mais amigáveis
      let userMessage = "Não foi possível realizar a inscrição. Tente novamente.";
      
      if (errorMessage.includes('Event not found')) {
        userMessage = "Evento não encontrado.";
      } else if (errorMessage.includes('Event is full')) {
        userMessage = "Este evento está lotado.";
      } else if (errorMessage.includes('Already registered')) {
        userMessage = "Você já está inscrito neste evento.";
      }

      toast({
        title: "Erro na inscrição",
        description: userMessage,
        variant: "destructive"
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status da inscrição
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

      toast({
        title: "Status atualizado",
        description: `Status da inscrição atualizado para "${status}"`,
      });

      // Atualizar lista de inscrições
      await fetchRegistrations();
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

  // Verificar se usuário já está inscrito
  const checkIfRegistered = async (eventId: number, email: string) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('id, status')
        .eq('event_id', eventId)
        .eq('participant_email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data || null;
    } catch (err) {
      console.error('Erro ao verificar inscrição:', err);
      return null;
    }
  };

  // Buscar estatísticas de inscrições
  const getRegistrationStats = async (eventId?: number) => {
    try {
      let query = supabase
        .from('event_registrations')
        .select('status');

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        confirmed: data?.filter(r => r.status === 'confirmed').length || 0,
        pending: data?.filter(r => r.status === 'pending').length || 0,
        cancelled: data?.filter(r => r.status === 'cancelled').length || 0,
        attended: data?.filter(r => r.status === 'attended').length || 0
      };

      return stats;
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        attended: 0
      };
    }
  };

  // Buscar inscrições por email (para participantes)
  const getRegistrationsByEmail = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            title,
            date,
            location,
            organizer
          )
        `)
        .eq('participant_email', email)
        .order('registration_date', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData = data?.map(registration => ({
        ...registration,
        event_title: registration.events?.title,
        event_date: registration.events?.date,
        event_location: registration.events?.location,
        event_organizer: registration.events?.organizer
      })) || [];

      setRegistrations(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar inscrições');
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas inscrições",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancelar inscrição
  const cancelRegistration = async (registrationId: number) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Inscrição cancelada",
        description: "Sua inscrição foi cancelada com sucesso",
      });

      // Atualizar lista de inscrições
      await fetchRegistrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar inscrição');
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a inscrição",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    registrations,
    loading,
    error,
    fetchRegistrations,
    registerForEvent,
    updateRegistrationStatus,
    checkIfRegistered,
    getRegistrationStats,
    getRegistrationsByEmail,
    cancelRegistration
  };
} 