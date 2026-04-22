import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type MusicRequestStatus = 'pending' | 'played' | 'rejected';

export interface MusicRequest {
  id: string;
  listener_name: string;
  listener_contact: string | null;
  location: string | null;
  song_title: string;
  artist: string | null;
  dedication: string | null;
  status: MusicRequestStatus;
  played_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewMusicRequest {
  listener_name: string;
  listener_contact?: string | null;
  location?: string | null;
  song_title: string;
  artist?: string | null;
  dedication?: string | null;
}

type SupabaseClient = typeof supabase;

/**
 * Hook de submissão pública para pedidos musicais.
 * Não busca lista — apenas submete (o site público não deve expor pedidos).
 */
export function useMusicRequestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (payload: NewMusicRequest) => {
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: err } = await (supabase as unknown as {
        from: (t: string) => {
          insert: (v: unknown) => {
            select: () => {
              single: () => Promise<{ data: unknown; error: unknown }>;
            };
          };
        };
      })
        .from('music_requests')
        .insert({ ...payload, status: 'pending' })
        .select()
        .single();

      if (err) throw err;
      return data as MusicRequest;
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Não foi possível enviar o pedido. Tente novamente em alguns instantes.';
      setError(message);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error };
}

/**
 * Hook administrativo para listar e gerir pedidos musicais.
 * Requer utilizador autenticado.
 */
export function useMusicRequestsAdmin() {
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableAvailable, setTableAvailable] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const client = supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => {
            order: (
              c: string,
              o: { ascending: boolean }
            ) => Promise<{ data: unknown; error: unknown }>;
          };
        };
      };
      const { data, error } = await client
        .from('music_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[useMusicRequests] tabela indisponível:', error);
        setTableAvailable(false);
        setRequests([]);
        return;
      }
      setTableAvailable(true);
      setRequests((data as MusicRequest[]) || []);
    } catch (e) {
      console.warn('[useMusicRequests] erro:', e);
      setTableAvailable(false);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(
    async (id: string, status: MusicRequestStatus, notes?: string) => {
      const patch: Partial<MusicRequest> = {
        status,
        admin_notes: notes ?? null,
        played_at: status === 'played' ? new Date().toISOString() : null,
      };
      const { error } = await (supabase as unknown as {
        from: (t: string) => {
          update: (v: unknown) => {
            eq: (c: string, v: string) => Promise<{ error: unknown }>;
          };
        };
      })
        .from('music_requests')
        .update(patch)
        .eq('id', id);
      if (error) throw error;
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? ({ ...r, ...patch } as MusicRequest) : r))
      );
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    const { error } = await (supabase as unknown as {
      from: (t: string) => {
        delete: () => {
          eq: (c: string, v: string) => Promise<{ error: unknown }>;
        };
      };
    })
      .from('music_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { requests, loading, tableAvailable, refresh, updateStatus, remove };
}

// Satisfy imports that want to silence unused client type
export type { SupabaseClient };
