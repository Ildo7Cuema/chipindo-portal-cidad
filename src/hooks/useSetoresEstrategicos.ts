import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SetorEstrategico {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  visao: string;
  missao: string;
  cor_primaria: string;
  cor_secundaria: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface EstatisticaSetor {
  id: string;
  setor_id: string;
  nome: string;
  valor: string;
  icone: string;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramaSetor {
  id: string;
  setor_id: string;
  titulo: string;
  descricao: string;
  beneficios: string[];
  requisitos: string[];
  contacto: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface OportunidadeSetor {
  id: string;
  setor_id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  prazo: string;
  vagas: number;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface InfraestruturaSetor {
  id: string;
  setor_id: string;
  nome: string;
  localizacao: string;
  capacidade: string;
  estado: string;
  equipamentos: string[];
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface ContactoSetor {
  id: string;
  setor_id: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export interface SetorCompleto extends SetorEstrategico {
  estatisticas: EstatisticaSetor[];
  programas: ProgramaSetor[];
  oportunidades: OportunidadeSetor[];
  infraestruturas: InfraestruturaSetor[];
  contactos: ContactoSetor[];
}

export const useSetoresEstrategicos = () => {
  const [setores, setSetores] = useState<SetorEstrategico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSetores();
  }, []);

  const fetchSetores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('setores_estrategicos')
        .select('*')
        .order('ordem');

      if (error) {
        console.error('Erro ao buscar setores:', error);
        throw error;
      }
      
      setSetores(data || []);
    } catch (err) {
      console.error('Erro ao carregar setores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  };

  const getSetorBySlug = async (slug: string): Promise<SetorCompleto | null> => {
    try {
      // Buscar setor principal
      const { data: setor, error: setorError } = await supabase
        .from('setores_estrategicos')
        .select('*')
        .eq('slug', slug)
        .eq('ativo', true)
        .single();

      if (setorError || !setor) {
        console.error('Erro ao buscar setor:', setorError);
        return null;
      }

      // Buscar estatísticas
      const { data: estatisticas, error: estatisticasError } = await supabase
        .from('setores_estatisticas')
        .select('*')
        .eq('setor_id', setor.id)
        .order('ordem');

      if (estatisticasError) {
        console.error('Erro ao buscar estatísticas:', estatisticasError);
      }

      // Buscar programas
      const { data: programas, error: programasError } = await supabase
        .from('setores_programas')
        .select('*')
        .eq('setor_id', setor.id)
        .eq('ativo', true)
        .order('ordem');

      if (programasError) {
        console.error('Erro ao buscar programas:', programasError);
      }

      // Buscar oportunidades
      const { data: oportunidades, error: oportunidadesError } = await supabase
        .from('setores_oportunidades')
        .select('*')
        .eq('setor_id', setor.id)
        .eq('ativo', true)
        .order('ordem');

      if (oportunidadesError) {
        console.error('Erro ao buscar oportunidades:', oportunidadesError);
      }

      // Buscar infraestruturas
      const { data: infraestruturas, error: infraestruturasError } = await supabase
        .from('setores_infraestruturas')
        .select('*')
        .eq('setor_id', setor.id)
        .eq('ativo', true)
        .order('ordem');

      if (infraestruturasError) {
        console.error('Erro ao buscar infraestruturas:', infraestruturasError);
      }

      // Buscar contactos
      const { data: contactos, error: contactosError } = await supabase
        .from('setores_contactos')
        .select('*')
        .eq('setor_id', setor.id);

      if (contactosError) {
        console.error('Erro ao buscar contactos:', contactosError);
      }

      return {
        ...setor,
        estatisticas: estatisticas || [],
        programas: programas || [],
        oportunidades: oportunidades || [],
        infraestruturas: infraestruturas || [],
        contactos: contactos || []
      };
    } catch (err) {
      console.error('Erro ao buscar setor completo:', err);
      return null;
    }
  };

  const createSetor = async (setor: Omit<SetorEstrategico, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores_estrategicos')
        .insert([setor])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar setor:', error);
        throw error;
      }
      
      await fetchSetores();
      return data;
    } catch (err) {
      console.error('Erro ao criar setor:', err);
      throw err;
    }
  };

  const updateSetor = async (id: string, updates: Partial<SetorEstrategico>) => {
    try {
      const { data, error } = await supabase
        .from('setores_estrategicos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar setor:', error);
        throw error;
      }
      
      await fetchSetores();
      return data;
    } catch (err) {
      console.error('Erro ao atualizar setor:', err);
      throw err;
    }
  };

  const deleteSetor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores_estrategicos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir setor:', error);
        throw error;
      }
      
      await fetchSetores();
    } catch (err) {
      console.error('Erro ao excluir setor:', err);
      throw err;
    }
  };

  return {
    setores,
    loading,
    error,
    fetchSetores,
    getSetorBySlug,
    createSetor,
    updateSetor,
    deleteSetor
  };
}; 