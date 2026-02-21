import { useUserRole, UserRole, isSectorRole, getSectorName } from './useUserRole';

export interface AccessControlConfig {
  // Itens que apenas admin pode aceder
  adminOnly: string[];
  // Itens que editor pode aceder
  editorItems: string[];
  // Mapeamento de itens por setor
  sectorItems: Record<string, string[]>;
  // Itens que todos os utilizadores autenticados podem aceder
  publicItems: string[];
}

// Configuração padrão de controle de acesso
export const defaultAccessConfig: AccessControlConfig = {
  adminOnly: [
    'gestao-utilizadores',
    'logs-auditoria',
    'configuracoes-sistema',
    'backup-restore',
    'acesso-setor',
    'audit-logs',
    'users',
    'sector-access',
    'settings',
    'organigrama',
    'departamentos',
    'content',
    'carousel',
    'events',
    'event-registrations',
    'turismo-carousel',
    'locations',
    'emergency-contacts',
    'transparency',
    'population',
    'characterization'
  ],
  editorItems: [
    // Editor tem acesso exclusivo a Notícias e Acervo Digital
    'news',
    'acervo',
  ],
  sectorItems: {
    'educacao': [
      'sector-content',        // Gestão do Conteúdo da Página Pública do Sector
      'concursos',             // Gestão de Concursos
      'service-requests',      // Gestão de Solicitações
      'ouvidoria',             // Ouvidoria
      'interest-registrations' // Registos de Interesse
    ],
    'saude': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ],
    'agricultura': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ],
    'setor-mineiro': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ],
    'desenvolvimento-economico': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ],
    'cultura': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ],
    'tecnologia': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ],
    'energia-agua': [
      'sector-content',
      'concursos',
      'service-requests',
      'ouvidoria',
      'interest-registrations'
    ]
  },
  publicItems: [
    'dashboard',
    'notifications'
  ]
};

export function useAccessControl(config: AccessControlConfig = defaultAccessConfig) {
  const { profile, isAdmin, isEditor, isSectorUser, role } = useUserRole();

  // Função para verificar se o utilizador pode aceder a um item específico
  const canAccessItem = (itemId: string): boolean => {
    if (isAdmin) return true; // Admin tem acesso total

    const userRole = profile?.role as UserRole;

    // Verificar se é item apenas para admin
    if (config.adminOnly.includes(itemId)) {
      return isAdmin;
    }

    // Verificar se é item público
    if (config.publicItems.includes(itemId)) {
      return true;
    }

    // Verificar se é item para editor
    if (config.editorItems.includes(itemId)) {
      return isAdmin || isEditor;
    }

    // Verificar se é item específico do setor
    if (isSectorUser && config.sectorItems[userRole]) {
      return config.sectorItems[userRole].includes(itemId);
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

  // Função para verificar se pode gerir conteúdo
  const canManageContent = isAdmin || isEditor || isSectorUser;

  // Função para obter o setor atual do utilizador
  const getCurrentSector = (): string | null => {
    if (isSectorUser && profile?.setor_id) {
      return profile.setor_id;
    }
    return null;
  };

  // Função para obter o nome do setor atual
  const getCurrentSectorName = (): string | null => {
    if (isSectorUser) {
      return getSectorName(role);
    }
    return null;
  };

  // Função para verificar se o utilizador tem acesso a um setor específico
  const canAccessSector = (sectorId: string): boolean => {
    if (isAdmin) return true;
    if (isSectorUser && profile?.setor_id === sectorId) return true;
    return false;
  };

  return {
    // Estados
    isAdmin,
    isEditor,
    isSectorUser,
    role,
    profile,

    // Funções de verificação
    canAccessItem,
    canManageUsers,
    canViewAuditLogs,
    canAccessSystemSettings,
    canManageContent,
    canAccessSector,

    // Funções de filtro
    getFilteredMenuItems,

    // Funções de setor
    getCurrentSector,
    getCurrentSectorName,

    // Configuração
    accessConfig: config
  };
} 