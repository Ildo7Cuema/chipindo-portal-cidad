import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SystemConfig {
  // Site Settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  
  // Security Settings
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationFrequency: string;
  
  // Performance Settings
  cacheEnabled: boolean;
  compressionEnabled: boolean;
  cdnEnabled: boolean;
  autoBackup: boolean;
  
  // Appearance Settings
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
}

const DEFAULT_CONFIG: SystemConfig = {
  siteName: 'Portal de Chipindo',
  siteDescription: 'Portal oficial da Administração Municipal de Chipindo',
  contactEmail: 'admin@chipindo.gov.ao',
  contactPhone: '+244 XXX XXX XXX',
  contactAddress: 'Rua Principal, Chipindo, Huíla, Angola',
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  sessionTimeout: 30,
  maxLoginAttempts: 3,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: false,
  notificationFrequency: 'instant',
  cacheEnabled: true,
  compressionEnabled: true,
  cdnEnabled: false,
  autoBackup: true,
  theme: 'system',
  language: 'pt',
  timezone: 'Africa/Luanda',
  dateFormat: 'dd/MM/yyyy',
};

export const useSystemSettings = () => {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load system settings from database
  const loadSystemSettings = async () => {
    try {
      setLoading(true);
      
      // Get system settings from database
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading system settings:', error);
        toast.error('Erro ao carregar configurações do sistema');
      }

      if (data) {
        // Merge with defaults for any missing fields
        const mergedConfig = { ...DEFAULT_CONFIG, ...data };
        setSystemConfig(mergedConfig);
      } else {
        // If no settings exist, create default settings
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error in loadSystemSettings:', error);
      toast.error('Erro ao carregar configurações do sistema');
    } finally {
      setLoading(false);
    }
  };

  // Create default settings in database
  const createDefaultSettings = async () => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .insert([DEFAULT_CONFIG]);

      if (error) {
        console.error('Error creating default settings:', error);
        toast.error('Erro ao criar configurações padrão');
      } else {
        setSystemConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Error in createDefaultSettings:', error);
    }
  };

  // Save system settings to database
  const saveSystemSettings = async (config: Partial<SystemConfig>) => {
    try {
      setSaving(true);
      
      // Update system settings in database
      const { error } = await supabase
        .from('system_settings')
        .upsert([config], { onConflict: 'id' });

      if (error) {
        console.error('Error saving system settings:', error);
        toast.error('Erro ao salvar configurações do sistema');
        return false;
      }

      // Update local state
      setSystemConfig(prev => ({ ...prev, ...config }));
      toast.success('Configurações salvas com sucesso');
      return true;
    } catch (error) {
      console.error('Error in saveSystemSettings:', error);
      toast.error('Erro ao salvar configurações do sistema');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    try {
      setSaving(true);
      const success = await saveSystemSettings(DEFAULT_CONFIG);
      if (success) {
        toast.success('Configurações redefinidas para padrão');
      }
    } catch (error) {
      console.error('Error in resetToDefaults:', error);
      toast.error('Erro ao redefinir configurações');
    } finally {
      setSaving(false);
    }
  };

  // Export settings
  const exportSettings = async () => {
    try {
      const dataStr = JSON.stringify(systemConfig, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `system-settings-${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Configurações exportadas com sucesso');
    } catch (error) {
      console.error('Error in exportSettings:', error);
      toast.error('Erro ao exportar configurações');
    }
  };

  // Import settings
  const importSettings = async (file: File) => {
    try {
      setSaving(true);
      const text = await file.text();
      const importedConfig = JSON.parse(text);
      const success = await saveSystemSettings(importedConfig);
      if (success) {
        toast.success('Configurações importadas com sucesso');
      }
    } catch (error) {
      console.error('Error in importSettings:', error);
      toast.error('Erro ao importar configurações');
    } finally {
      setSaving(false);
    }
  };

  // Database maintenance functions
  const createBackup = async () => {
    try {
      const { data, error } = await supabase
        .rpc('create_system_backup');

      if (error) {
        console.error('Error creating backup:', error);
        toast.error('Erro ao criar backup');
        return null;
      }

      toast.success('Backup criado com sucesso');
      return data;
    } catch (error) {
      console.error('Error in createBackup:', error);
      toast.error('Erro ao criar backup');
      return null;
    }
  };

  const optimizeDatabase = async () => {
    try {
      const { error } = await supabase
        .rpc('optimize_database');

      if (error) {
        console.error('Error optimizing database:', error);
        toast.error('Erro ao otimizar base de dados');
        return false;
      }

      toast.success('Base de dados otimizada com sucesso');
      return true;
    } catch (error) {
      console.error('Error in optimizeDatabase:', error);
      toast.error('Erro ao otimizar base de dados');
      return false;
    }
  };

  const checkDatabaseIntegrity = async () => {
    try {
      const { data, error } = await supabase
        .rpc('check_database_integrity');

      if (error) {
        console.error('Error checking database integrity:', error);
        toast.error('Erro ao verificar integridade da base de dados');
        return { issues: 0, warnings: 0, status: 'error' };
      }

      toast.success('Verificação de integridade concluída');
      return data;
    } catch (error) {
      console.error('Error in checkDatabaseIntegrity:', error);
      toast.error('Erro ao verificar integridade da base de dados');
      return { issues: 0, warnings: 0, status: 'error' };
    }
  };

  const vacuumDatabase = async () => {
    try {
      const { error } = await supabase
        .rpc('vacuum_database');

      if (error) {
        console.error('Error vacuuming database:', error);
        toast.error('Erro ao fazer vacuum da base de dados');
        return false;
      }

      toast.success('Vacuum da base de dados concluído');
      return true;
    } catch (error) {
      console.error('Error in vacuumDatabase:', error);
      toast.error('Erro ao fazer vacuum da base de dados');
      return false;
    }
  };

  const reindexDatabase = async () => {
    try {
      const { error } = await supabase
        .rpc('reindex_database');

      if (error) {
        console.error('Error reindexing database:', error);
        toast.error('Erro ao reindexar base de dados');
        return false;
      }

      toast.success('Reindexação da base de dados concluída');
      return true;
    } catch (error) {
      console.error('Error in reindexDatabase:', error);
      toast.error('Erro ao reindexar base de dados');
      return false;
    }
  };

  const getMaintenanceStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_maintenance_stats');

      if (error) {
        console.error('Error getting maintenance stats:', error);
        return {
          cache_clears: 0,
          db_optimizations: 0,
          backups_created: 0,
          integrity_checks: 0,
          last_maintenance: new Date().toISOString(),
          total_actions: 0
        };
      }

      return data;
    } catch (error) {
      console.error('Error in getMaintenanceStats:', error);
      return {
        cache_clears: 0,
        db_optimizations: 0,
        backups_created: 0,
        integrity_checks: 0,
        last_maintenance: new Date().toISOString(),
        total_actions: 0
      };
    }
  };

  useEffect(() => {
    loadSystemSettings();
  }, []);

  return {
    systemConfig,
    loading,
    saving,
    loadSystemSettings,
    saveSystemSettings,
    createBackup,
    resetToDefaults,
    exportSettings,
    importSettings,
    optimizeDatabase,
    checkDatabaseIntegrity,
    vacuumDatabase,
    reindexDatabase,
    getMaintenanceStats,
  };
};