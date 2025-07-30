import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TecnologiaInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  vision: string;
  mission: string;
  created_at: string;
  updated_at: string;
}

export interface EstatisticaTecnologia {
  id: string;
  label: string;
  value: string;
  icon: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AreaTecnologica {
  id: string;
  nome: string;
  empresas: string;
  profissionais: string;
  projetos: string;
  estado: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicoDigital {
  id: string;
  nome: string;
  descricao: string;
  utilizadores: string;
  servicos: string;
  estado: string;
  funcionalidades: string[];
  url_acesso: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramaTecnologico {
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

export interface OportunidadeTecnologia {
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

export interface InfraestruturaTecnologia {
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

export interface ContactoTecnologia {
  id: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export const useTecnologiaData = () => {
  const [tecnologiaInfo, setTecnologiaInfo] = useState<TecnologiaInfo | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticaTecnologia[]>([]);
  const [areasTecnologicas, setAreasTecnologicas] = useState<AreaTecnologica[]>([]);
  const [servicosDigitais, setServicosDigitais] = useState<ServicoDigital[]>([]);
  const [programasTecnologicos, setProgramasTecnologicos] = useState<ProgramaTecnologico[]>([]);
  const [oportunidades, setOportunidades] = useState<OportunidadeTecnologia[]>([]);
  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaTecnologia[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactoTecnologia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTecnologiaData();
  }, []);

  const fetchTecnologiaData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tecnologia info
      const { data: infoData, error: infoError } = await supabase
        .from('tecnologia_info')
        .select('*')
        .single();

      if (infoError && infoError.code !== 'PGRST116') {
        throw infoError;
      }

      if (infoData) {
        setTecnologiaInfo(infoData);
      }

      // Fetch estatisticas
      const { data: statsData, error: statsError } = await supabase
        .from('tecnologia_estatisticas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (statsError) throw statsError;
      setEstatisticas(statsData || []);

      // Fetch areas tecnologicas
      const { data: areasData, error: areasError } = await supabase
        .from('tecnologia_areas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (areasError) throw areasError;
      setAreasTecnologicas(areasData || []);

      // Fetch servicos digitais
      const { data: servicosData, error: servicosError } = await supabase
        .from('tecnologia_servicos_digitais')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (servicosError) throw servicosError;
      setServicosDigitais(servicosData || []);

      // Fetch programas tecnologicos
      const { data: programasData, error: programasError } = await supabase
        .from('tecnologia_programas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (programasError) throw programasError;
      setProgramasTecnologicos(programasData || []);

      // Fetch oportunidades
      const { data: oportunidadesData, error: oportunidadesError } = await supabase
        .from('tecnologia_oportunidades')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (oportunidadesError) throw oportunidadesError;
      setOportunidades(oportunidadesData || []);

      // Fetch infraestruturas
      const { data: infraData, error: infraError } = await supabase
        .from('tecnologia_infraestruturas')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (infraError) throw infraError;
      setInfraestruturas(infraData || []);

      // Fetch contact info
      const { data: contactData, error: contactError } = await supabase
        .from('tecnologia_contactos')
        .select('*')
        .single();

      if (contactError && contactError.code !== 'PGRST116') {
        throw contactError;
      }

      if (contactData) {
        setContactInfo(contactData);
      }

    } catch (err) {
      console.error('Error fetching tecnologia data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for servicos digitais
  const createServicoDigital = async (servico: Omit<ServicoDigital, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tecnologia_servicos_digitais')
        .insert([servico])
        .select()
        .single();

      if (error) throw error;
      
      setServicosDigitais(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating servico digital:', err);
      throw err;
    }
  };

  const updateServicoDigital = async (id: string, updates: Partial<ServicoDigital>) => {
    try {
      const { data, error } = await supabase
        .from('tecnologia_servicos_digitais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setServicosDigitais(prev => prev.map(servico => 
        servico.id === id ? data : servico
      ));
      return data;
    } catch (err) {
      console.error('Error updating servico digital:', err);
      throw err;
    }
  };

  const deleteServicoDigital = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tecnologia_servicos_digitais')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setServicosDigitais(prev => prev.filter(servico => servico.id !== id));
    } catch (err) {
      console.error('Error deleting servico digital:', err);
      throw err;
    }
  };

  // CRUD operations for estatisticas
  const createEstatistica = async (estatistica: Omit<EstatisticaTecnologia, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tecnologia_estatisticas')
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

  const updateEstatistica = async (id: string, updates: Partial<EstatisticaTecnologia>) => {
    try {
      const { data, error } = await supabase
        .from('tecnologia_estatisticas')
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
        .from('tecnologia_estatisticas')
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
    tecnologiaInfo,
    estatisticas,
    areasTecnologicas,
    servicosDigitais,
    programasTecnologicos,
    oportunidades,
    infraestruturas,
    contactInfo,
    loading,
    error,
    fetchTecnologiaData,
    createServicoDigital,
    updateServicoDigital,
    deleteServicoDigital,
    createEstatistica,
    updateEstatistica,
    deleteEstatistica,
  };
}; 