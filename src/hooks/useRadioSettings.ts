import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type RadioStreamType = 'icecast' | 'shoutcast' | 'mp3' | 'aac' | 'hls';

export interface RadioSettings {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  stream_url: string;
  stream_type: RadioStreamType;
  logo_url: string | null;
  cover_url: string | null;
  website_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  is_live: boolean;
  enabled: boolean;
  social_facebook: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RadioProgram {
  id: string;
  title: string;
  presenter: string | null;
  description: string | null;
  day_of_week: number; // 0=Domingo ... 6=Sábado
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  category: string | null;
  active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_RADIO_SETTINGS: RadioSettings = {
  id: 'default',
  name: 'Rádio Chipindo',
  tagline: 'A voz do Município',
  description:
    'Rádio oficial do Município de Chipindo. Ouça notícias, música e programas culturais em directo, a partir de qualquer lugar do mundo.',
  stream_url: '',
  stream_type: 'icecast',
  logo_url: null,
  cover_url: null,
  website_url: null,
  contact_phone: null,
  contact_email: null,
  is_live: false,
  enabled: true,
  social_facebook: null,
  social_instagram: null,
  social_youtube: null,
};

const DAYS_PT = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export const getDayLabel = (day: number) => DAYS_PT[day] || '';

export function useRadioSettings() {
  const [settings, setSettings] = useState<RadioSettings>(DEFAULT_RADIO_SETTINGS);
  const [schedule, setSchedule] = useState<RadioProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [tablesAvailable, setTablesAvailable] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // Acedemos via "any" porque as tabelas podem ainda não estar no types.ts gerado.
      const client = supabase as unknown as {
        from: (table: string) => {
          select: (c: string) => {
            limit: (n: number) => {
              maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
            };
            order: (
              c: string,
              o: { ascending: boolean }
            ) => Promise<{ data: unknown; error: unknown }>;
          };
        };
      };

      const settingsRes = await client
        .from('radio_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsRes.error) {
        console.warn('[useRadioSettings] tabela radio_settings indisponível, usando defaults:', settingsRes.error);
        setTablesAvailable(false);
        setSettings(DEFAULT_RADIO_SETTINGS);
        setSchedule([]);
        return;
      }

      if (settingsRes.data) {
        const merged = { ...DEFAULT_RADIO_SETTINGS, ...(settingsRes.data as RadioSettings) };
        setSettings(merged);
      }

      const scheduleRes = await client
        .from('radio_schedule')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (!scheduleRes.error && Array.isArray(scheduleRes.data)) {
        setSchedule(scheduleRes.data as RadioProgram[]);
      }
      setTablesAvailable(true);
    } catch (err) {
      console.warn('[useRadioSettings] erro ao ler dados da rádio, a usar defaults:', err);
      setTablesAvailable(false);
      setSettings(DEFAULT_RADIO_SETTINGS);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateSettings = useCallback(
    async (partial: Partial<RadioSettings>) => {
      if (!tablesAvailable || settings.id === 'default') {
        const { data, error } = await (supabase as unknown as {
          from: (t: string) => {
            insert: (v: unknown) => {
              select: () => {
                single: () => Promise<{ data: unknown; error: unknown }>;
              };
            };
          };
        })
          .from('radio_settings')
          .insert({ ...DEFAULT_RADIO_SETTINGS, ...partial, id: undefined })
          .select()
          .single();
        if (error) throw error;
        setSettings(data as RadioSettings);
        setTablesAvailable(true);
        return data as RadioSettings;
      }

      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          update: (v: unknown) => {
            eq: (
              c: string,
              v: string
            ) => {
              select: () => {
                single: () => Promise<{ data: unknown; error: unknown }>;
              };
            };
          };
        };
      })
        .from('radio_settings')
        .update(partial)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data as RadioSettings);
      return data as RadioSettings;
    },
    [settings.id, tablesAvailable]
  );

  const addProgram = useCallback(async (program: Omit<RadioProgram, 'id'>) => {
    const { data, error } = await (supabase as unknown as {
      from: (t: string) => {
        insert: (v: unknown) => {
          select: () => {
            single: () => Promise<{ data: unknown; error: unknown }>;
          };
        };
      };
    })
      .from('radio_schedule')
      .insert(program)
      .select()
      .single();
    if (error) throw error;
    setSchedule((prev) => [...prev, data as RadioProgram]);
    return data as RadioProgram;
  }, []);

  const updateProgram = useCallback(
    async (id: string, partial: Partial<RadioProgram>) => {
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          update: (v: unknown) => {
            eq: (
              c: string,
              v: string
            ) => {
              select: () => {
                single: () => Promise<{ data: unknown; error: unknown }>;
              };
            };
          };
        };
      })
        .from('radio_schedule')
        .update(partial)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setSchedule((prev) => prev.map((p) => (p.id === id ? (data as RadioProgram) : p)));
      return data as RadioProgram;
    },
    []
  );

  const deleteProgram = useCallback(async (id: string) => {
    const { error } = await (supabase as unknown as {
      from: (t: string) => {
        delete: () => {
          eq: (c: string, v: string) => Promise<{ error: unknown }>;
        };
      };
    })
      .from('radio_schedule')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setSchedule((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getCurrentProgram = useCallback((): RadioProgram | null => {
    if (!schedule.length) return null;
    const now = new Date();
    const day = now.getDay();
    const hhmm = now.toTimeString().slice(0, 8);
    return (
      schedule.find(
        (p) =>
          p.active &&
          p.day_of_week === day &&
          p.start_time <= hhmm &&
          p.end_time > hhmm
      ) || null
    );
  }, [schedule]);

  return {
    settings,
    schedule,
    loading,
    tablesAvailable,
    updateSettings,
    addProgram,
    updateProgram,
    deleteProgram,
    getCurrentProgram,
    refresh: fetchAll,
  };
}
