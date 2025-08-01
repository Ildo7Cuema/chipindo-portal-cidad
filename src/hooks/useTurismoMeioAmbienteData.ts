import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TurismoMeioAmbienteInfo {
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

export interface TurismoMeioAmbienteEstatistica {
  id: string;
  setor_id: string;
  nome: string;
  valor: string;
  icone: string;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface TurismoMeioAmbientePrograma {
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

export interface TurismoMeioAmbienteOportunidade {
  id: string;
  setor_id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  prazo: string | null;
  vagas: number;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface TurismoMeioAmbienteInfraestrutura {
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

export interface TurismoMeioAmbienteContacto {
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

export interface TurismoMeioAmbienteCarousel {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useTurismoMeioAmbienteData = () => {
  const [turismoInfo, setTurismoInfo] = useState<TurismoMeioAmbienteInfo | null>(null);
  const [estatisticas, setEstatisticas] = useState<TurismoMeioAmbienteEstatistica[]>([]);
  const [programas, setProgramas] = useState<TurismoMeioAmbientePrograma[]>([]);
  const [oportunidades, setOportunidades] = useState<TurismoMeioAmbienteOportunidade[]>([]);
  const [infraestruturas, setInfraestruturas] = useState<TurismoMeioAmbienteInfraestrutura[]>([]);
  const [contactInfo, setContactInfo] = useState<TurismoMeioAmbienteContacto | null>(null);
  const [carouselImages, setCarouselImages] = useState<TurismoMeioAmbienteCarousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTurismoData();
  }, []);

  const fetchTurismoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar informações do setor
      const { data: setorData, error: setorError } = await supabase
        .from('setores_estrategicos')
        .select('*')
        .eq('slug', 'turismo-meio-ambiente')
        .eq('ativo', true)
        .single();

      if (setorError) {
        console.error('Erro ao buscar informações do setor:', setorError);
        throw setorError;
      }

      setTurismoInfo(setorData);

      // Buscar estatísticas
      const { data: estatisticasData, error: estatisticasError } = await supabase
        .from('setores_estatisticas')
        .select('*')
        .eq('setor_id', setorData.id)
        .order('ordem');

      if (estatisticasError) {
        console.error('Erro ao buscar estatísticas:', estatisticasError);
      } else {
        setEstatisticas(estatisticasData || []);
      }

      // Buscar programas
      const { data: programasData, error: programasError } = await supabase
        .from('setores_programas')
        .select('*')
        .eq('setor_id', setorData.id)
        .eq('ativo', true)
        .order('ordem');

      if (programasError) {
        console.error('Erro ao buscar programas:', programasError);
      } else {
        setProgramas(programasData || []);
      }

      // Buscar oportunidades
      const { data: oportunidadesData, error: oportunidadesError } = await supabase
        .from('setores_oportunidades')
        .select('*')
        .eq('setor_id', setorData.id)
        .eq('ativo', true)
        .order('ordem');

      if (oportunidadesError) {
        console.error('Erro ao buscar oportunidades:', oportunidadesError);
      } else {
        setOportunidades(oportunidadesData || []);
      }

      // Buscar infraestruturas
      const { data: infraestruturasData, error: infraestruturasError } = await supabase
        .from('setores_infraestruturas')
        .select('*')
        .eq('setor_id', setorData.id)
        .eq('ativo', true)
        .order('ordem');

      if (infraestruturasError) {
        console.error('Erro ao buscar infraestruturas:', infraestruturasError);
      } else {
        setInfraestruturas(infraestruturasData || []);
      }

      // Buscar contactos
      const { data: contactosData, error: contactosError } = await supabase
        .from('setores_contactos')
        .select('*')
        .eq('setor_id', setorData.id);

      if (contactosError) {
        console.error('Erro ao buscar contactos:', contactosError);
      } else {
        setContactInfo(contactosData?.[0] || null);
      }

      // Buscar imagens do carrossel
      const { data: carouselData, error: carouselError } = await supabase
        .from('turismo_ambiente_carousel')
        .select('*')
        .eq('active', true)
        .order('order_index');

      if (carouselError) {
        console.error('Erro ao buscar imagens do carrossel:', carouselError);
      } else {
        setCarouselImages(carouselData || []);
      }

    } catch (err) {
      console.error('Erro ao carregar dados do turismo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do turismo');
    } finally {
      setLoading(false);
    }
  };

  return {
    turismoInfo,
    estatisticas,
    programas,
    oportunidades,
    infraestruturas,
    contactInfo,
    carouselImages,
    loading,
    error,
    refetch: fetchTurismoData
  };
}; 