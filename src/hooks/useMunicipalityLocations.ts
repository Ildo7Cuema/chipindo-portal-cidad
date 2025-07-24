import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MunicipalityLocation {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  type: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useMunicipalityLocations() {
  const [locations, setLocations] = useState<MunicipalityLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('municipality_locations')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching locations:', error);
      } else {
        setLocations(data || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (location: Omit<MunicipalityLocation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('municipality_locations')
        .insert([location])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchLocations();
      return data;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const updateLocation = async (id: string, updates: Partial<MunicipalityLocation>) => {
    try {
      const { data, error } = await supabase
        .from('municipality_locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchLocations();
      return data;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('municipality_locations')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    addLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations
  };
}