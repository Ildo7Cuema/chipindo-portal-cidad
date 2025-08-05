import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'editor' | 'user' | 'educacao' | 'saude' | 'agricultura' | 'sector-mineiro' | 'desenvolvimento-economico' | 'cultura' | 'tecnologia' | 'energia-agua';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  setor_id: string | null;
  created_at: string;
  updated_at: string;
}

// Função para verificar se um role é de setor específico
export const isSectorRole = (role: UserRole): boolean => {
  return ['educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua'].includes(role);
};

// Função para obter o nome do setor a partir do role
export const getSectorName = (role: UserRole): string => {
  const sectorNames: Record<string, string> = {
    'educacao': 'Educação',
    'saude': 'Saúde',
    'agricultura': 'Agricultura',
    'sector-mineiro': 'Setor Mineiro',
    'desenvolvimento-economico': 'Desenvolvimento Económico',
    'cultura': 'Cultura',
    'tecnologia': 'Tecnologia',
    'energia-agua': 'Energia e Água'
  };
  
  return sectorNames[role] || role;
};

// Função para obter o slug do setor a partir do role
export const getSectorSlug = (role: UserRole): string => {
  const sectorSlugs: Record<string, string> = {
    'educacao': 'educacao',
    'saude': 'saude',
    'agricultura': 'agricultura',
    'sector-mineiro': 'sector-mineiro',
    'desenvolvimento-economico': 'desenvolvimento-economico',
    'cultura': 'cultura',
    'tecnologia': 'tecnologia',
    'energia-agua': 'energia-agua'
  };
  
  return sectorSlugs[role] || '';
};

export function useUserRole(user: User | null = null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } else {
          // Type cast to ensure role is treated as UserRole
          setProfile(data as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Se não foi fornecido user, tentar obter da sessão atual
  useEffect(() => {
    if (!user) {
      const getCurrentUser = async () => {
        try {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', currentUser.id)
              .maybeSingle();

            if (error) {
              console.error('Error fetching profile:', error);
              setProfile(null);
            } else {
              setProfile(data as UserProfile);
            }
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching current user profile:', error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      };

      getCurrentUser();
    }
  }, [user]);

  const isAdmin = profile?.role === 'admin';
  const isEditor = profile?.role === 'editor';
  const isSectorUser = isSectorRole(profile?.role as UserRole);
  const canManageContent = isAdmin || isEditor || isSectorUser;

  // Função para verificar se o utilizador pode aceder a um item específico
  const canAccessItem = (itemId: string): boolean => {
    if (isAdmin) return true; // Admin tem acesso total
    
    const userRole = profile?.role as UserRole;
    
    // Mapeamento de itens por setor
    const sectorItems: Record<string, string[]> = {
      'educacao': ['educacao', 'gestao-educacao', 'estatisticas-educacao'],
      'saude': ['saude', 'gestao-saude', 'estatisticas-saude'],
      'agricultura': ['agricultura', 'gestao-agricultura', 'estatisticas-agricultura'],
      'sector-mineiro': ['sector-mineiro', 'gestao-mineiro', 'estatisticas-mineiro'],
      'desenvolvimento-economico': ['desenvolvimento-economico', 'gestao-economico', 'estatisticas-economico'],
      'cultura': ['cultura', 'gestao-cultura', 'estatisticas-cultura'],
      'tecnologia': ['tecnologia', 'gestao-tecnologia', 'estatisticas-tecnologia'],
      'energia-agua': ['energia-agua', 'gestao-energia', 'estatisticas-energia']
    };
    
    // Itens que apenas admin pode aceder
    const adminOnlyItems = [
      'gestao-utilizadores',
      'logs-auditoria',
      'configuracoes-sistema',
      'backup-restore',
      'acesso-setor',
      'audit-logs'
    ];
    
    // Itens que editor pode aceder
    const editorItems = [
      'gestao-conteudo',
      'gestao-noticias',
      'gestao-eventos',
      'gestao-concursos',
      'gestao-servicos',
      'gestao-departamentos',
      'gestao-organigrama',
      'gestao-acervo',
      'gestao-turismo',
      'gestao-caracterizacao',
      'gestao-inscricoes',
      'gestao-atividades'
    ];
    
    // Verificar se é item apenas para admin
    if (adminOnlyItems.includes(itemId)) {
      return isAdmin;
    }
    
    // Verificar se é item para editor
    if (editorItems.includes(itemId)) {
      return isAdmin || isEditor;
    }
    
    // Verificar se é item específico do setor
    if (isSectorUser && sectorItems[userRole]) {
      return sectorItems[userRole].includes(itemId);
    }
    
    return false;
  };

  // Função para obter itens de menu filtrados por permissão
  const getFilteredMenuItems = (allItems: any[]): any[] => {
    return allItems.filter(item => canAccessItem(item.id));
  };

  // Função para verificar se pode gerir utilizadores
  const canManageUsers = isAdmin;

  // Função para verificar se pode ver logs de auditoria
  const canViewAuditLogs = isAdmin;

  // Função para verificar se pode aceder a configurações do sistema
  const canAccessSystemSettings = isAdmin;

  return {
    profile,
    loading,
    isAdmin,
    isEditor,
    isSectorUser,
    canManageContent,
    canManageUsers,
    canViewAuditLogs,
    canAccessSystemSettings,
    canAccessItem,
    getFilteredMenuItems,
    role: (profile?.role as UserRole) || 'user',
    setorId: profile?.setor_id || null
  };
}