import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContactInfo = async () => {
    try {
      // Buscar informações de contacto do departamento administrativo principal
      const { data: departamento, error } = await supabase
        .from('departamentos')
        .select('nome, descricao')
        .eq('nome', 'Administração Municipal')
        .eq('ativo', true)
        .single();

      if (error) {
        console.error('Error fetching contact info:', error);
        // Fallback para dados padrão
        setContactInfo({
          address: "Rua Principal, Bairro Central, Chipindo",
          phone: "+244 XXX XXX XXX",
          email: "servicos@chipindo.gov.ao",
          hours: {
            weekdays: "Segunda a Sexta: 08:00 - 16:00",
            saturday: "Sábado: 08:00 - 12:00",
            sunday: "Domingo: Encerrado"
          }
        });
      } else if (departamento) {
        setContactInfo({
          address: "Rua Principal, Bairro Central, Chipindo",
          phone: "+244 XXX XXX XXX",
          email: "servicos@chipindo.gov.ao",
          hours: {
            weekdays: "Segunda a Sexta: 08:00 - 16:00",
            saturday: "Sábado: 08:00 - 12:00",
            sunday: "Domingo: Encerrado"
          }
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      // Fallback para dados padrão
      setContactInfo({
        address: "Rua Principal, Bairro Central, Chipindo",
        phone: "+244 XXX XXX XXX",
        email: "servicos@chipindo.gov.ao",
        hours: {
          weekdays: "Segunda a Sexta: 08:00 - 16:00",
          saturday: "Sábado: 08:00 - 12:00",
          sunday: "Domingo: Encerrado"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return {
    contactInfo,
    loading,
    refetch: fetchContactInfo
  };
}