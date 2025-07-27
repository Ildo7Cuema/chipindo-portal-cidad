import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  description: string | null;
  priority: number;
  active: boolean;
  type: string;
  email: string | null;
  address: string | null;
  department: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
}

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for testing
  const mockContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Polícia Municipal',
      phone: '+244 123 456 789',
      description: 'Polícia Municipal de Chipindo',
      priority: 9,
      active: true,
      type: 'police',
      email: 'policia@chipindo.gov.ao',
      address: 'Rua Principal, Chipindo',
      department: 'Segurança',
      availability: '24/7',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Bombeiros',
      phone: '+244 123 456 790',
      description: 'Corpo de Bombeiros de Chipindo',
      priority: 9,
      active: true,
      type: 'fire',
      email: 'bombeiros@chipindo.gov.ao',
      address: 'Rua dos Bombeiros, Chipindo',
      department: 'Proteção Civil',
      availability: '24/7',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Hospital Municipal',
      phone: '+244 123 456 791',
      description: 'Hospital Municipal de Chipindo',
      priority: 8,
      active: true,
      type: 'hospital',
      email: 'hospital@chipindo.gov.ao',
      address: 'Rua da Saúde, Chipindo',
      department: 'Saúde',
      availability: '24/7',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Ambulância',
      phone: '+244 123 456 792',
      description: 'Serviço de Ambulância Municipal',
      priority: 8,
      active: true,
      type: 'ambulance',
      email: 'ambulancia@chipindo.gov.ao',
      address: 'Rua da Ambulância, Chipindo',
      department: 'Saúde',
      availability: '24/7',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Emergência Geral',
      phone: '+244 123 456 793',
      description: 'Número de emergência geral',
      priority: 7,
      active: true,
      type: 'emergency',
      email: 'emergencia@chipindo.gov.ao',
      address: 'Administração Municipal, Chipindo',
      department: 'Administração',
      availability: '24/7',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      name: 'Segurança Municipal',
      phone: '+244 123 456 794',
      description: 'Serviço de Segurança Municipal',
      priority: 6,
      active: false,
      type: 'security',
      email: 'seguranca@chipindo.gov.ao',
      address: 'Rua da Segurança, Chipindo',
      department: 'Segurança',
      availability: 'Segunda a Sexta, 8h-18h',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  const fetchContacts = async () => {
    try {
      // Use mock data for now
      setContacts(mockContacts);
      
      // TODO: Uncomment when database is available
      // const { data, error } = await supabase
      //   .from('emergency_contacts')
      //   .select('*')
      //   .order('priority', { ascending: false });

      // if (error) {
      //   console.error('Error fetching emergency contacts:', error);
      // } else {
      //   // Map data to include default values for new fields
      //   const mappedContacts = (data || []).map(contact => ({
      //     ...contact,
      //     type: (contact as any).type || 'emergency',
      //     email: (contact as any).email || null,
      //     address: (contact as any).address || null,
      //     department: (contact as any).department || null,
      //     availability: (contact as any).availability || null
      //   }));
      //   setContacts(mappedContacts);
      // }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Mock implementation
      const newContact: EmergencyContact = {
        ...contact,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setContacts(prev => [newContact, ...prev]);
      return newContact;
      
      // TODO: Uncomment when database is available
      // const { data, error } = await supabase
      //   .from('emergency_contacts')
      //   .insert([contact])
      //   .select()
      //   .single();

      // if (error) {
      //   throw error;
      // }

      // await fetchContacts();
      // return data;
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      throw error;
    }
  };

  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    try {
      // Mock implementation
      setContacts(prev => prev.map(contact => 
        contact.id === id 
          ? { ...contact, ...updates, updated_at: new Date().toISOString() }
          : contact
      ));
      
      // TODO: Uncomment when database is available
      // const { data, error } = await supabase
      //   .from('emergency_contacts')
      //   .update(updates)
      //   .eq('id', id)
      //   .select()
      //   .single();

      // if (error) {
      //   throw error;
      // }

      // await fetchContacts();
      // return data;
    } catch (error) {
      console.error('Error updating emergency contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      // Mock implementation
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      // TODO: Uncomment when database is available
      // const { error } = await supabase
      //   .from('emergency_contacts')
      //   .delete()
      //   .eq('id', id);

      // if (error) {
      //   throw error;
      // }

      // await fetchContacts();
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