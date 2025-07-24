import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  description: string | null;
  priority: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('active', true)
        .order('priority');

      if (error) {
        console.error('Error fetching emergency contacts:', error);
      } else {
        setContacts(data || []);
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([contact])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchContacts();
      return data;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  };

  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchContacts();
      return data;
    } catch (error) {
      console.error('Error updating emergency contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchContacts();
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
}