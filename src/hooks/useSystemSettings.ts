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
  // Events Settings
  eventsContactEmail: string;
  eventsContactPhone: string;
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
  eventsContactEmail: 'eventos@chipindo.gov.ao',
  eventsContactPhone: '+244 123 456 789',
};

// Helper to map DB snake_case to frontend camelCase
const mapFromDb = (data: any): SystemConfig => ({
  // Site Settings
  siteName: data.site_name || DEFAULT_CONFIG.siteName,
  siteDescription: data.site_description || DEFAULT_CONFIG.siteDescription,
  contactEmail: data.contact_email || DEFAULT_CONFIG.contactEmail,
  contactPhone: data.contact_phone || DEFAULT_CONFIG.contactPhone,
  contactAddress: data.contact_address || DEFAULT_CONFIG.contactAddress,

  // Security Settings
  maintenanceMode: data.maintenance_mode ?? DEFAULT_CONFIG.maintenanceMode,
  allowRegistration: data.allow_registration ?? DEFAULT_CONFIG.allowRegistration,
  requireEmailVerification: data.require_email_verification ?? DEFAULT_CONFIG.requireEmailVerification,
  sessionTimeout: data.session_timeout || DEFAULT_CONFIG.sessionTimeout,
  maxLoginAttempts: data.max_login_attempts || DEFAULT_CONFIG.maxLoginAttempts,

  // Notification Settings
  emailNotifications: data.email_notifications ?? DEFAULT_CONFIG.emailNotifications,
  smsNotifications: data.sms_notifications ?? DEFAULT_CONFIG.smsNotifications,
  pushNotifications: data.push_notifications ?? DEFAULT_CONFIG.pushNotifications,
  notificationFrequency: data.notification_frequency || DEFAULT_CONFIG.notificationFrequency,

  // Performance Settings
  cacheEnabled: data.cache_enabled ?? DEFAULT_CONFIG.cacheEnabled,
  compressionEnabled: data.compression_enabled ?? DEFAULT_CONFIG.compressionEnabled,
  cdnEnabled: data.cdn_enabled ?? DEFAULT_CONFIG.cdnEnabled,
  autoBackup: data.auto_backup ?? DEFAULT_CONFIG.autoBackup,

  // Appearance Settings
  theme: data.theme || DEFAULT_CONFIG.theme,
  language: data.language || DEFAULT_CONFIG.language,
  timezone: data.timezone || DEFAULT_CONFIG.timezone,
  dateFormat: data.date_format || DEFAULT_CONFIG.dateFormat,

  // Event Settings (check flat columns first, then JSON value field, then defaults)
  eventsContactEmail: data.events_contact_email || data.value?.events?.contactEmail || DEFAULT_CONFIG.eventsContactEmail,
  eventsContactPhone: data.events_contact_phone || data.value?.events?.contactPhone || DEFAULT_CONFIG.eventsContactPhone,
});

// Helper to map frontend camelCase to DB snake_case
const mapToDb = (config: Partial<SystemConfig>) => {
  const mapped: any = {};

  if (config.siteName !== undefined) mapped.site_name = config.siteName;
  if (config.siteDescription !== undefined) mapped.site_description = config.siteDescription;
  if (config.contactEmail !== undefined) mapped.contact_email = config.contactEmail;
  if (config.contactPhone !== undefined) mapped.contact_phone = config.contactPhone;
  if (config.contactAddress !== undefined) mapped.contact_address = config.contactAddress;

  if (config.maintenanceMode !== undefined) mapped.maintenance_mode = config.maintenanceMode;
  if (config.allowRegistration !== undefined) mapped.allow_registration = config.allowRegistration;
  if (config.requireEmailVerification !== undefined) mapped.require_email_verification = config.requireEmailVerification;
  if (config.sessionTimeout !== undefined) mapped.session_timeout = config.sessionTimeout;
  if (config.maxLoginAttempts !== undefined) mapped.max_login_attempts = config.maxLoginAttempts;

  if (config.emailNotifications !== undefined) mapped.email_notifications = config.emailNotifications;
  if (config.smsNotifications !== undefined) mapped.sms_notifications = config.smsNotifications;
  if (config.pushNotifications !== undefined) mapped.push_notifications = config.pushNotifications;
  if (config.notificationFrequency !== undefined) mapped.notification_frequency = config.notificationFrequency;

  if (config.cacheEnabled !== undefined) mapped.cache_enabled = config.cacheEnabled;
  if (config.compressionEnabled !== undefined) mapped.compression_enabled = config.compressionEnabled;
  if (config.cdnEnabled !== undefined) mapped.cdn_enabled = config.cdnEnabled;
  if (config.autoBackup !== undefined) mapped.auto_backup = config.autoBackup;

  if (config.theme !== undefined) mapped.theme = config.theme;
  if (config.language !== undefined) mapped.language = config.language;
  if (config.timezone !== undefined) mapped.timezone = config.timezone;
  if (config.dateFormat !== undefined) mapped.date_format = config.dateFormat;

  // Events Settings - map to both flat columns and JSON value field
  if (config.eventsContactEmail !== undefined) mapped.events_contact_email = config.eventsContactEmail;
  if (config.eventsContactPhone !== undefined) mapped.events_contact_phone = config.eventsContactPhone;

  return mapped;
};

// Add key helper
const addKey = (data: any, config: Partial<SystemConfig>) => {
  const value: any = {};

  if (config.eventsContactEmail !== undefined || config.eventsContactPhone !== undefined) {
    value.events = {
      contactEmail: config.eventsContactEmail,
      contactPhone: config.eventsContactPhone
    };
  }

  return { ...data, key: 'system_config', value };
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
        .eq('key', 'system_config') // Filter by our fixed key
        .maybeSingle();

      if (error) {
        console.error('Error loading system settings:', error);
        toast.error('Erro ao carregar configurações do sistema');
      }

      if (data) {
        // Map from DB format to local format
        setSystemConfig(mapFromDb(data));
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
      const dbConfig = addKey(mapToDb(DEFAULT_CONFIG), DEFAULT_CONFIG);
      const { error } = await supabase
        .from('system_settings')
        .insert([dbConfig])
        .select();

      if (error) {
        if (error.code === '42501') {
          console.warn('Cannot create default settings (RLS restricted). Using defaults.');
          setSystemConfig(DEFAULT_CONFIG);
          return;
        }
        console.error('Error creating default settings:', error);
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

      const dbConfig = mapToDb(config);

      // Check if we need to insert or update
      // First get existing ID if any
      const { data: existingData } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'system_config')
        .limit(1)
        .maybeSingle();

      let error;

      if (existingData?.id) {
        // Update existing
        // We need to merge with existing value if possible, but for now we reconstruct
        const finalConfig = addKey(dbConfig, { ...systemConfig, ...config });

        const { error: updateError } = await supabase
          .from('system_settings')
          .update(finalConfig)
          .eq('id', existingData.id)
          .eq('key', 'system_config');
        error = updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert([addKey(dbConfig, config)]);
        error = insertError;
      }

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
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `system-settings-${new Date().toISOString().slice(0, 10)}.json`;

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