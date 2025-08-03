import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactoSetor } from './useSetoresEstrategicos';

export const useSetoresContactos = (setorId?: string) => {
  const [contactos, setContactos] = useState<ContactoSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactos = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('setores_contactos')
        .select('*')
        .order('created_at', { ascending: true });

      if (id) {
        query = query.eq('setor_id', id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar contactos:', error);
        setError('Erro ao carregar contactos');
        return;
      }

      setContactos(data || []);
    } catch (err) {
      console.error('Erro ao buscar contactos:', err);
      setError('Erro ao carregar contactos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setorId) {
      fetchContactos(setorId);
    }
  }, [setorId]);

  const createContacto = async (contacto: Omit<ContactoSetor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores_contactos')
        .insert([contacto])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar contacto:', error);
        throw error;
      }
      
      await fetchContactos(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao criar contacto:', err);
      throw err;
    }
  };

  const updateContacto = async (id: string, updates: Partial<ContactoSetor>) => {
    try {
      const { data, error } = await supabase
        .from('setores_contactos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao actualizar contacto:', error);
        throw error;
      }
      
      await fetchContactos(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao actualizar contacto:', err);
      throw err;
    }
  };

  const deleteContacto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores_contactos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir contacto:', error);
        throw error;
      }
      
      await fetchContactos(setorId);
    } catch (err) {
      console.error('Erro ao excluir contacto:', err);
      throw err;
    }
  };

  return {
    contactos,
    loading,
    error,
    fetchContactos,
    createContacto,
    updateContacto,
    deleteContacto
  };
}; 