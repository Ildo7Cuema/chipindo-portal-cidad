import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  event_time: string;
  location: string;
  organizer: string;
  contact: string;
  email: string;
  website?: string;
  price: string;
  max_participants: number;
  current_participants: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  featured: boolean;
  created_at: string;
  updated_at: string;
  setor_id?: string | null;
}

export interface EventFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  search?: string;
  setorId?: string | null;
}

export function useEvents(filters?: EventFilters) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      // Aplicar filtros
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      if (filters?.setorId) {
        query = query.eq('setor_id', filters.setorId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      let filteredData = data || [];

      // Aplicar filtro de pesquisa no frontend
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(event =>
          event.title?.toLowerCase().includes(searchTerm) ||
          event.description?.toLowerCase().includes(searchTerm) ||
          event.location?.toLowerCase().includes(searchTerm) ||
          event.organizer?.toLowerCase().includes(searchTerm)
        );
      }

      setEvents(filteredData as unknown as Event[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar eventos';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data as unknown as Event]);
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso"
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => event.id === id ? (data as unknown as Event) : event));
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso"
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      console.log('Deleting event with id:', id);
      
      // First verify the event exists
      const { data: existingEvent, error: checkError } = await supabase
        .from('events')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError) {
        console.error('Event not found or check error:', checkError);
        throw new Error(`Evento não encontrado (ID: ${id})`);
      }
      
      console.log('Event found, proceeding with delete:', existingEvent);
      
      const { error, count } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      // Verify deletion was successful by checking if event still exists
      const { data: verifyEvent } = await supabase
        .from('events')
        .select('id')
        .eq('id', id)
        .single();
      
      if (verifyEvent) {
        console.error('Event still exists after delete:', verifyEvent);
        throw new Error('Falha ao excluir evento. O evento ainda existe no banco de dados. Verifique as permissões de RLS.');
      }
      
      console.log('Event successfully deleted from database');
      
      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir evento';
      console.error('Delete event error:', err);
      toast({
        title: "Erro ao excluir evento",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters?.category, filters?.status, filters?.featured, filters?.search, filters?.setorId]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
} 