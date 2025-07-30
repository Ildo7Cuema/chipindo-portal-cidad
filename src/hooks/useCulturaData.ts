import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CulturaInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
}

export interface EstatisticaCultura {
  id: string;
  label: string;
  value: string;
  icon: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AreaCultural {
  id: string;
  nome: string;
  grupos: string;
  eventos: string;
  participantes: string;
  estado: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventoCultural {
  id: string;
  nome: string;
  data: string;
  local: string;
  tipo: string;
  estado: string;
  descricao: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramaCultural {
  id: string;
  title: string;
  description: string;
  beneficios: string[];
  requisitos: string[];
  contact: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface OportunidadeCultura {
  id: string;
  title: string;
  description: string;
  requisitos: string[];
  beneficios: string[];
  prazo: string;
  vagas: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface InfraestruturaCultura {
  id: string;
  nome: string;
  localizacao: string;
  capacidade: string;
  equipamentos: string[];
  estado: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactoCultura {
  id: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export const useCulturaData = () => {
  const [culturaInfo, setCulturaInfo] = useState<CulturaInfo | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticaCultura[]>([]);
  const [areasCulturais, setAreasCulturais] = useState<AreaCultural[]>([]);
  const [eventosCulturais, setEventosCulturais] = useState<EventoCultural[]>([]);
  const [programasCulturais, setProgramasCulturais] = useState<ProgramaCultural[]>([]);
  const [oportunidades, setOportunidades] = useState<OportunidadeCultura[]>([]);
  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaCultura[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactoCultura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCulturaData();
  }, []);

  const fetchCulturaData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch cultura info
      const { data: infoData, error: infoError } = await supabase
        .from('cultura_info')
        .select('*')
        .single();

      if (infoError && infoError.code !== 'PGRST116') {
        throw infoError;
      }

      if (infoData) {
        setCulturaInfo(infoData);
      }

      // Fetch estatisticas
      const { data: statsData, error: statsError } = await supabase
        .from('cultura_estatisticas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (statsError) throw statsError;
      setEstatisticas(statsData || []);

      // Fetch areas culturais
      const { data: areasData, error: areasError } = await supabase
        .from('cultura_areas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (areasError) throw areasError;
      setAreasCulturais(areasData || []);

      // Fetch eventos culturais
      const { data: eventosData, error: eventosError } = await supabase
        .from('cultura_eventos')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (eventosError) throw eventosError;
      setEventosCulturais(eventosData || []);

      // Fetch programas culturais
      const { data: programasData, error: programasError } = await supabase
        .from('cultura_programas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (programasError) throw programasError;
      setProgramasCulturais(programasData || []);

      // Fetch oportunidades
      const { data: oportunidadesData, error: oportunidadesError } = await supabase
        .from('cultura_oportunidades')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (oportunidadesError) throw oportunidadesError;
      setOportunidades(oportunidadesData || []);

      // Fetch infraestruturas
      const { data: infraData, error: infraError } = await supabase
        .from('cultura_infraestruturas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (infraError) throw infraError;
      setInfraestruturas(infraData || []);

      // Fetch contact info
      const { data: contactData, error: contactError } = await supabase
        .from('cultura_contactos')
        .select('*')
        .single();

      if (contactError && contactError.code !== 'PGRST116') {
        throw contactError;
      }

      if (contactData) {
        setContactInfo(contactData);
      }

    } catch (err) {
      console.error('Error fetching cultura data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for eventos culturais
  const createEvento = async (evento: Omit<EventoCultural, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('cultura_eventos')
        .insert([evento])
        .select()
        .single();

      if (error) throw error;
      
      setEventosCulturais(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating evento:', err);
      throw err;
    }
  };

  const updateEvento = async (id: string, updates: Partial<EventoCultural>) => {
    try {
      const { data, error } = await supabase
        .from('cultura_eventos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEventosCulturais(prev => prev.map(evento => 
        evento.id === id ? data : evento
      ));
      return data;
    } catch (err) {
      console.error('Error updating evento:', err);
      throw err;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cultura_eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEventosCulturais(prev => prev.filter(evento => evento.id !== id));
    } catch (err) {
      console.error('Error deleting evento:', err);
      throw err;
    }
  };

  // CRUD operations for estatisticas
  const createEstatistica = async (estatistica: Omit<EstatisticaCultura, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('cultura_estatisticas')
        .insert([estatistica])
        .select()
        .single();

      if (error) throw error;
      
      setEstatisticas(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating estatistica:', err);
      throw err;
    }
  };

  const updateEstatistica = async (id: string, updates: Partial<EstatisticaCultura>) => {
    try {
      const { data, error } = await supabase
        .from('cultura_estatisticas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEstatisticas(prev => prev.map(stat => 
        stat.id === id ? data : stat
      ));
      return data;
    } catch (err) {
      console.error('Error updating estatistica:', err);
      throw err;
    }
  };

  const deleteEstatistica = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cultura_estatisticas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEstatisticas(prev => prev.filter(stat => stat.id !== id));
    } catch (err) {
      console.error('Error deleting estatistica:', err);
      throw err;
    }
  };

  return {
    culturaInfo,
    estatisticas,
    areasCulturais,
    eventosCulturais,
    programasCulturais,
    oportunidades,
    infraestruturas,
    contactInfo,
    loading,
    error,
    fetchCulturaData,
    createEvento,
    updateEvento,
    deleteEvento,
    createEstatistica,
    updateEstatistica,
    deleteEstatistica,
  };
}; 