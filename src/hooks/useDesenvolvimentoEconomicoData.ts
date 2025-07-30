import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EconomicoInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
}

export interface EstatisticaEconomica {
  id: string;
  label: string;
  value: string;
  icon: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetorEconomico {
  id: string;
  nome: string;
  empresas: string;
  empregos: string;
  contribuicao: string;
  estado: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramaEconomico {
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

export interface OportunidadeEconomica {
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

export interface InfraestruturaEconomica {
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

export interface ContactoEconomico {
  id: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export const useDesenvolvimentoEconomicoData = () => {
  const [economicoInfo, setEconomicoInfo] = useState<EconomicoInfo | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticaEconomica[]>([]);
  const [setoresEconomicos, setSetoresEconomicos] = useState<SetorEconomico[]>([]);
  const [programasEconomicos, setProgramasEconomicos] = useState<ProgramaEconomico[]>([]);
  const [oportunidades, setOportunidades] = useState<OportunidadeEconomica[]>([]);
  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaEconomica[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactoEconomico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEconomicoData();
  }, []);

  const fetchEconomicoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch economico info
      const { data: infoData, error: infoError } = await supabase
        .from('economico_info')
        .select('*')
        .single();

      if (infoError && infoError.code !== 'PGRST116') {
        throw infoError;
      }

      if (infoData) {
        setEconomicoInfo(infoData);
      }

      // Fetch estatisticas
      const { data: statsData, error: statsError } = await supabase
        .from('economico_estatisticas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (statsError) throw statsError;
      setEstatisticas(statsData || []);

      // Fetch setores economicos
      const { data: setoresData, error: setoresError } = await supabase
        .from('economico_setores')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (setoresError) throw setoresError;
      setSetoresEconomicos(setoresData || []);

      // Fetch programas economicos
      const { data: programasData, error: programasError } = await supabase
        .from('economico_programas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (programasError) throw programasError;
      setProgramasEconomicos(programasData || []);

      // Fetch oportunidades
      const { data: oportunidadesData, error: oportunidadesError } = await supabase
        .from('economico_oportunidades')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (oportunidadesError) throw oportunidadesError;
      setOportunidades(oportunidadesData || []);

      // Fetch infraestruturas
      const { data: infraData, error: infraError } = await supabase
        .from('economico_infraestruturas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (infraError) throw infraError;
      setInfraestruturas(infraData || []);

      // Fetch contact info
      const { data: contactData, error: contactError } = await supabase
        .from('economico_contactos')
        .select('*')
        .single();

      if (contactError && contactError.code !== 'PGRST116') {
        throw contactError;
      }

      if (contactData) {
        setContactInfo(contactData);
      }

    } catch (err) {
      console.error('Error fetching economico data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for setores economicos
  const createSetorEconomico = async (setor: Omit<SetorEconomico, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('economico_setores')
        .insert([setor])
        .select()
        .single();

      if (error) throw error;
      
      setSetoresEconomicos(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating setor economico:', err);
      throw err;
    }
  };

  const updateSetorEconomico = async (id: string, updates: Partial<SetorEconomico>) => {
    try {
      const { data, error } = await supabase
        .from('economico_setores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSetoresEconomicos(prev => prev.map(setor => 
        setor.id === id ? data : setor
      ));
      return data;
    } catch (err) {
      console.error('Error updating setor economico:', err);
      throw err;
    }
  };

  const deleteSetorEconomico = async (id: string) => {
    try {
      const { error } = await supabase
        .from('economico_setores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSetoresEconomicos(prev => prev.filter(setor => setor.id !== id));
    } catch (err) {
      console.error('Error deleting setor economico:', err);
      throw err;
    }
  };

  // CRUD operations for estatisticas
  const createEstatistica = async (estatistica: Omit<EstatisticaEconomica, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('economico_estatisticas')
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

  const updateEstatistica = async (id: string, updates: Partial<EstatisticaEconomica>) => {
    try {
      const { data, error } = await supabase
        .from('economico_estatisticas')
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
        .from('economico_estatisticas')
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
    economicoInfo,
    estatisticas,
    setoresEconomicos,
    programasEconomicos,
    oportunidades,
    infraestruturas,
    contactInfo,
    loading,
    error,
    fetchEconomicoData,
    createSetorEconomico,
    updateSetorEconomico,
    deleteSetorEconomico,
    createEstatistica,
    updateEstatistica,
    deleteEstatistica,
  };
}; 