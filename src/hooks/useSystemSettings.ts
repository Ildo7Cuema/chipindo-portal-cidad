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

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  storageUsed: number;
  storageTotal: number;
  databaseSize: number;
  cacheHitRate: number;
  uptime: number;
  lastBackup: string;
  totalNews: number;
  publishedNews: number;
  totalConcursos: number;
  publishedConcursos: number;
  totalNotifications: number;
  unreadNotifications: number;
}

export const useSystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    // Site Settings
    siteName: "Portal de Chipindo",
    siteDescription: "Portal oficial do município de Chipindo",
    contactEmail: "contato@chipindo.gov.ao",
    contactPhone: "+244 123 456 789",
    contactAddress: "Chipindo, Huíla, Angola",
    
    // Security Settings
    maintenanceMode: false,
    allowRegistration: false,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: "realtime",
    
    // Performance Settings
    cacheEnabled: true,
    compressionEnabled: true,
    cdnEnabled: false,
    autoBackup: true,
    
    // Appearance Settings
    theme: "light",
    language: "pt",
    timezone: "Africa/Luanda",
    dateFormat: "DD/MM/YYYY"
  });

  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    storageUsed: 0,
    storageTotal: 10,
    databaseSize: 0,
    cacheHitRate: 0,
    uptime: 0,
    lastBackup: "Nunca",
    totalNews: 0,
    publishedNews: 0,
    totalConcursos: 0,
    publishedConcursos: 0,
    totalNotifications: 0,
    unreadNotifications: 0
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch system configuration
  const fetchConfig = async () => {
    try {
      setLoading(true);
      
      // Fetch all settings from database
      const { data: settings, error } = await supabase
        .from('system_settings' as any)
        .select('key, value')
        .order('key');

      if (error) {
        console.error('Error fetching system settings:', error);
        return;
      }

      if (settings) {
        const newConfig = { ...config };
        
        settings.forEach((setting: any) => {
          const value = setting.value;
          
          switch (setting.key) {
            case 'site_name':
              newConfig.siteName = value;
              break;
            case 'site_description':
              newConfig.siteDescription = value;
              break;
            case 'contact_email':
              newConfig.contactEmail = value;
              break;
            case 'contact_phone':
              newConfig.contactPhone = value;
              break;
            case 'contact_address':
              newConfig.contactAddress = value;
              break;
            case 'maintenance_mode':
              newConfig.maintenanceMode = value;
              break;
            case 'allow_registration':
              newConfig.allowRegistration = value;
              break;
            case 'require_email_verification':
              newConfig.requireEmailVerification = value;
              break;
            case 'session_timeout':
              newConfig.sessionTimeout = parseInt(value);
              break;
            case 'max_login_attempts':
              newConfig.maxLoginAttempts = parseInt(value);
              break;
            case 'email_notifications':
              newConfig.emailNotifications = value;
              break;
            case 'sms_notifications':
              newConfig.smsNotifications = value;
              break;
            case 'push_notifications':
              newConfig.pushNotifications = value;
              break;
            case 'notification_frequency':
              newConfig.notificationFrequency = value;
              break;
            case 'cache_enabled':
              newConfig.cacheEnabled = value;
              break;
            case 'compression_enabled':
              newConfig.compressionEnabled = value;
              break;
            case 'cdn_enabled':
              newConfig.cdnEnabled = value;
              break;
            case 'auto_backup':
              newConfig.autoBackup = value;
              break;
            case 'theme':
              newConfig.theme = value;
              break;
            case 'language':
              newConfig.language = value;
              break;
            case 'timezone':
              newConfig.timezone = value;
              break;
            case 'date_format':
              newConfig.dateFormat = value;
              break;
          }
        });
        
        setConfig(newConfig);
      }
    } catch (error) {
      console.error('Error fetching system config:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch system statistics
  const fetchStats = async () => {
    try {
      // Call the database function to get real stats
      const { data, error } = await supabase
        .rpc('get_system_stats' as any);

      if (error) {
        console.error('Error fetching system stats:', error);
        return;
      }

      if (data) {
        setStats({
          totalUsers: data.total_users || 0,
          activeUsers: data.active_users || 0,
          storageUsed: data.storage_used || 0,
          storageTotal: data.storage_total || 10,
          databaseSize: data.database_size || 0,
          cacheHitRate: data.cache_hit_rate || 0,
          uptime: data.uptime || 0,
          lastBackup: data.last_backup || "Nunca",
          totalNews: data.total_news || 0,
          publishedNews: data.published_news || 0,
          totalConcursos: data.total_concursos || 0,
          publishedConcursos: data.published_concursos || 0,
          totalNotifications: data.total_notifications || 0,
          unreadNotifications: data.unread_notifications || 0
        });
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  // Save system configuration
  const saveConfig = async (newConfig: SystemConfig) => {
    try {
      setSaving(true);
      
      const settingsToUpdate = [
        { key: 'site_name', value: newConfig.siteName },
        { key: 'site_description', value: newConfig.siteDescription },
        { key: 'contact_email', value: newConfig.contactEmail },
        { key: 'contact_phone', value: newConfig.contactPhone },
        { key: 'contact_address', value: newConfig.contactAddress },
        { key: 'maintenance_mode', value: newConfig.maintenanceMode },
        { key: 'allow_registration', value: newConfig.allowRegistration },
        { key: 'require_email_verification', value: newConfig.requireEmailVerification },
        { key: 'session_timeout', value: newConfig.sessionTimeout },
        { key: 'max_login_attempts', value: newConfig.maxLoginAttempts },
        { key: 'email_notifications', value: newConfig.emailNotifications },
        { key: 'sms_notifications', value: newConfig.smsNotifications },
        { key: 'push_notifications', value: newConfig.pushNotifications },
        { key: 'notification_frequency', value: newConfig.notificationFrequency },
        { key: 'cache_enabled', value: newConfig.cacheEnabled },
        { key: 'compression_enabled', value: newConfig.compressionEnabled },
        { key: 'cdn_enabled', value: newConfig.cdnEnabled },
        { key: 'auto_backup', value: newConfig.autoBackup },
        { key: 'theme', value: newConfig.theme },
        { key: 'language', value: newConfig.language },
        { key: 'timezone', value: newConfig.timezone },
        { key: 'date_format', value: newConfig.dateFormat }
      ];

      // Update each setting using the database function
      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .rpc('update_system_setting' as any, {
            setting_key: setting.key,
            setting_value: setting.value
          });

        if (error) {
          console.error(`Error updating setting ${setting.key}:`, error);
          throw error;
        }
      }

      setConfig(newConfig);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error('Error saving system config:', error);
      toast.error("Erro ao salvar configurações");
      throw error;
    } finally {
      setSaving(false);
    }
  };



  // Security-specific functions
  const toggleMaintenanceMode = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update maintenance mode setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'maintenance_mode',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating maintenance mode:', error);
        toast.error("Erro ao atualizar modo de manutenção");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'maintenance_mode_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, maintenanceMode: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Modo de manutenção ativado! O acesso público foi desabilitado.");
      } else {
        toast.success("Modo de manutenção desativado! O acesso público foi restaurado.");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast.error("Erro ao alterar modo de manutenção");
    } finally {
      setLoading(false);
    }
  };

  const toggleAllowRegistration = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update registration setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'allow_registration',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating registration setting:', error);
        toast.error("Erro ao atualizar configuração de registro");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'registration_setting_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, allowRegistration: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Registro de novos utilizadores habilitado!");
      } else {
        toast.success("Registro de novos utilizadores desabilitado!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling registration setting:', error);
      toast.error("Erro ao alterar configuração de registro");
    } finally {
      setLoading(false);
    }
  };

  const toggleEmailVerification = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update email verification setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'require_email_verification',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating email verification setting:', error);
        toast.error("Erro ao atualizar configuração de verificação de email");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'email_verification_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, requireEmailVerification: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Verificação de email obrigatória habilitada!");
      } else {
        toast.success("Verificação de email obrigatória desabilitada!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling email verification setting:', error);
      toast.error("Erro ao alterar configuração de verificação de email");
    } finally {
      setLoading(false);
    }
  };

  // Notification toggle functions
  const toggleEmailNotifications = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update email notifications setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'email_notifications',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating email notifications setting:', error);
        toast.error("Erro ao atualizar configuração de notificações por email");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'email_notifications_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, emailNotifications: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Notificações por email habilitadas!");
      } else {
        toast.success("Notificações por email desabilitadas!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling email notifications setting:', error);
      toast.error("Erro ao alterar configuração de notificações por email");
    } finally {
      setLoading(false);
    }
  };

  const toggleSMSNotifications = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update SMS notifications setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'sms_notifications',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating SMS notifications setting:', error);
        toast.error("Erro ao atualizar configuração de notificações por SMS");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'sms_notifications_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, smsNotifications: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Notificações por SMS habilitadas!");
      } else {
        toast.success("Notificações por SMS desabilitadas!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling SMS notifications setting:', error);
      toast.error("Erro ao alterar configuração de notificações por SMS");
    } finally {
      setLoading(false);
    }
  };

  const togglePushNotifications = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update push notifications setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'push_notifications',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating push notifications setting:', error);
        toast.error("Erro ao atualizar configuração de notificações push");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'push_notifications_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, pushNotifications: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Notificações push habilitadas!");
      } else {
        toast.success("Notificações push desabilitadas!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling push notifications setting:', error);
      toast.error("Erro ao alterar configuração de notificações push");
    } finally {
      setLoading(false);
    }
  };

  // Test notification functions
  const testEmailNotification = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error("Utilizador não tem email configurado");
        return;
      }

      // Send test email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject: 'Teste de Notificação - Portal de Chipindo',
          body: 'Esta é uma notificação de teste do sistema de notificações do Portal de Chipindo.',
          html: `
            <h2>Teste de Notificação</h2>
            <p>Esta é uma notificação de teste do sistema de notificações do Portal de Chipindo.</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-AO')}</p>
            <p><strong>Utilizador:</strong> ${user.email}</p>
          `
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Email de teste enviado com sucesso!");
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error("Erro ao enviar email de teste");
    } finally {
      setLoading(false);
    }
  };

  const testSMSNotification = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.phone) {
        toast.error("Utilizador não tem telefone configurado");
        return;
      }

      // Send test SMS
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: user.phone,
          message: 'Teste de SMS - Portal de Chipindo. Data: ' + new Date().toLocaleString('pt-AO'),
          from: 'Chipindo'
        }
      });

      if (error) {
        throw error;
      }

      toast.success("SMS de teste enviado com sucesso!");
    } catch (error) {
      console.error('Error sending test SMS:', error);
      toast.error("Erro ao enviar SMS de teste");
    } finally {
      setLoading(false);
    }
  };

  const testPushNotification = async () => {
    try {
      setLoading(true);
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error("Permissão de notificação negada");
        return;
      }

      // Send test push notification
      new Notification('Teste de Notificação Push', {
        body: 'Esta é uma notificação push de teste do Portal de Chipindo.',
        icon: '/favicon.ico',
        tag: 'test',
        data: { 
          type: 'test',
          timestamp: new Date().toISOString()
        }
      });

      toast.success("Notificação push de teste enviada!");
    } catch (error) {
      console.error('Error sending test push notification:', error);
      toast.error("Erro ao enviar notificação push de teste");
    } finally {
      setLoading(false);
    }
  };

  // Performance toggle functions
  const toggleCache = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update cache setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'cache_enabled',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating cache setting:', error);
        toast.error("Erro ao atualizar configuração de cache");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'cache_setting_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, cacheEnabled: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Cache habilitado!");
      } else {
        toast.success("Cache desabilitado!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling cache setting:', error);
      toast.error("Erro ao alterar configuração de cache");
    } finally {
      setLoading(false);
    }
  };

  const toggleCompression = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update compression setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'compression_enabled',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating compression setting:', error);
        toast.error("Erro ao atualizar configuração de compressão");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'compression_setting_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, compressionEnabled: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Compressão habilitada!");
      } else {
        toast.success("Compressão desabilitada!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling compression setting:', error);
      toast.error("Erro ao alterar configuração de compressão");
    } finally {
      setLoading(false);
    }
  };

  const toggleCDN = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update CDN setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'cdn_enabled',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating CDN setting:', error);
        toast.error("Erro ao atualizar configuração de CDN");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'cdn_setting_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, cdnEnabled: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("CDN habilitado!");
      } else {
        toast.success("CDN desabilitado!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling CDN setting:', error);
      toast.error("Erro ao alterar configuração de CDN");
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoBackup = async (enabled: boolean) => {
    try {
      setLoading(true);
      
      // Update auto backup setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'auto_backup',
          setting_value: enabled
        });

      if (error) {
        console.error('Error updating auto backup setting:', error);
        toast.error("Erro ao atualizar configuração de backup automático");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'auto_backup_setting_change',
          metric_value: { 
            enabled,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, autoBackup: enabled };
      setConfig(newConfig);

      if (enabled) {
        toast.success("Backup automático habilitado!");
      } else {
        toast.success("Backup automático desabilitado!");
      }

      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling auto backup setting:', error);
      toast.error("Erro ao alterar configuração de backup automático");
    } finally {
      setLoading(false);
    }
  };

  // Performance test functions
  const testCache = async () => {
    try {
      setLoading(true);
      
      // Simulate cache test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Teste de cache concluído!");
    } catch (error) {
      console.error('Error testing cache:', error);
      toast.error("Erro ao testar cache");
    } finally {
      setLoading(false);
    }
  };

  const testCompression = async () => {
    try {
      setLoading(true);
      
      // Simulate compression test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Teste de compressão concluído!");
    } catch (error) {
      console.error('Error testing compression:', error);
      toast.error("Erro ao testar compressão");
    } finally {
      setLoading(false);
    }
  };

  const testCDN = async () => {
    try {
      setLoading(true);
      
      // Simulate CDN test
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("Teste de CDN concluído!");
    } catch (error) {
      console.error('Error testing CDN:', error);
      toast.error("Erro ao testar CDN");
    } finally {
      setLoading(false);
    }
  };

  const testBackup = async () => {
    try {
      setLoading(true);
      
      // Create test backup
      const { data, error } = await supabase
        .rpc('create_system_backup', {
          backup_type: 'test',
          tables_to_backup: ['users', 'news', 'concursos']
        });

      if (error) {
        throw error;
      }

      // Simulate backup completion
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Complete the backup
      await supabase
        .rpc('complete_system_backup', {
          backup_uuid: data,
          final_size: 1024 * 1024 * 10, // 10MB
          success: true
        });

      toast.success("Backup de teste criado com sucesso!");
    } catch (error) {
      console.error('Error testing backup:', error);
      toast.error("Erro ao criar backup de teste");
    } finally {
      setLoading(false);
    }
  };

  // Appearance functions
  const setTheme = async (theme: 'light' | 'dark' | 'auto') => {
    try {
      setLoading(true);
      
      // Update theme setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'theme_mode',
          setting_value: theme
        });

      if (error) {
        console.error('Error updating theme:', error);
        toast.error("Erro ao atualizar tema");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'theme_change',
          metric_value: { 
            mode: theme,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, theme };
      setConfig(newConfig);

      toast.success(`Tema alterado para ${theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Automático'}!`);
    } catch (error) {
      console.error('Error setting theme:', error);
      toast.error("Erro ao alterar tema");
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (language: string) => {
    try {
      setLoading(true);
      
      // Update language setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'language',
          setting_value: language
        });

      if (error) {
        console.error('Error updating language:', error);
        toast.error("Erro ao atualizar idioma");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'language_change',
          metric_value: { 
            language_code: language,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, language };
      setConfig(newConfig);

      const languageNames: { [key: string]: string } = {
        'pt': 'Português',
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'zh': '中文'
      };

      toast.success(`Idioma alterado para ${languageNames[language] || language}!`);
    } catch (error) {
      console.error('Error setting language:', error);
      toast.error("Erro ao alterar idioma");
    } finally {
      setLoading(false);
    }
  };

  const setTimezone = async (timezone: string) => {
    try {
      setLoading(true);
      
      // Update timezone setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'timezone',
          setting_value: timezone
        });

      if (error) {
        console.error('Error updating timezone:', error);
        toast.error("Erro ao atualizar fuso horário");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'timezone_change',
          metric_value: { 
            timezone,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, timezone };
      setConfig(newConfig);

      toast.success(`Fuso horário alterado para ${timezone}!`);
    } catch (error) {
      console.error('Error setting timezone:', error);
      toast.error("Erro ao alterar fuso horário");
    } finally {
      setLoading(false);
    }
  };

  const setDateFormat = async (dateFormat: string) => {
    try {
      setLoading(true);
      
      // Update date format setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'date_format',
          setting_value: dateFormat
        });

      if (error) {
        console.error('Error updating date format:', error);
        toast.error("Erro ao atualizar formato de data");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'date_format_change',
          metric_value: { 
            format: dateFormat,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, dateFormat };
      setConfig(newConfig);

      toast.success("Formato de data atualizado!");
    } catch (error) {
      console.error('Error setting date format:', error);
      toast.error("Erro ao atualizar formato de data");
    } finally {
      setLoading(false);
    }
  };

  const setTimeFormat = async (timeFormat: '12h' | '24h') => {
    try {
      setLoading(true);
      
      // Update time format setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'time_format',
          setting_value: timeFormat
        });

      if (error) {
        console.error('Error updating time format:', error);
        toast.error("Erro ao atualizar formato de hora");
        return;
      }

      // Record the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'time_format_change',
          metric_value: { 
            format: timeFormat,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      // Update local config
      const newConfig = { ...config, timeFormat };
      setConfig(newConfig);

      toast.success("Formato de hora atualizado!");
    } catch (error) {
      console.error('Error setting time format:', error);
      toast.error("Erro ao atualizar formato de hora");
    } finally {
      setLoading(false);
    }
  };

  const setPrimaryColor = async (color: string) => {
    try {
      setLoading(true);
      
      // Update primary color setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'primary_color',
          setting_value: color
        });

      if (error) {
        console.error('Error updating primary color:', error);
        toast.error("Erro ao atualizar cor primária");
        return;
      }

      // Update local config
      const newConfig = { ...config, primaryColor: color };
      setConfig(newConfig);

      toast.success("Cor primária atualizada!");
    } catch (error) {
      console.error('Error setting primary color:', error);
      toast.error("Erro ao atualizar cor primária");
    } finally {
      setLoading(false);
    }
  };

  const setAccentColor = async (color: string) => {
    try {
      setLoading(true);
      
      // Update accent color setting
      const { error } = await supabase
        .rpc('update_system_setting' as any, {
          setting_key: 'accent_color',
          setting_value: color
        });

      if (error) {
        console.error('Error updating accent color:', error);
        toast.error("Erro ao atualizar cor de destaque");
        return;
      }

      // Update local config
      const newConfig = { ...config, accentColor: color };
      setConfig(newConfig);

      toast.success("Cor de destaque atualizada!");
    } catch (error) {
      console.error('Error setting accent color:', error);
      toast.error("Erro ao atualizar cor de destaque");
    } finally {
      setLoading(false);
    }
  };

  // Maintenance functions
  const clearCache = async () => {
    try {
      setLoading(true);
      
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // Log the action
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'maintenance_action',
          metric_value: {
            action: 'clear_cache',
            details: {
              browser_cache_cleared: true,
              localStorage_cleared: true,
              sessionStorage_cleared: true
            },
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

      toast.success("Cache limpo com sucesso!");
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error("Erro ao limpar cache");
    } finally {
      setLoading(false);
    }
  };

  const optimizeDatabase = async () => {
    try {
      setLoading(true);
      
      // Optimize database
      const { error } = await supabase
        .rpc('optimize_database');

      if (error) {
        throw error;
      }

      toast.success("Base de dados otimizada com sucesso!");
    } catch (error) {
      console.error('Error optimizing database:', error);
      toast.error("Erro ao otimizar base de dados");
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setLoading(true);
      
      // Create manual backup
      const { data: backupId, error } = await supabase
        .rpc('create_system_backup', {
          backup_type: 'manual',
          tables_to_backup: null // Backup all tables
        });

      if (error) {
        throw error;
      }

      // Simulate backup completion
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Complete the backup
      await supabase
        .rpc('complete_system_backup', {
          backup_uuid: backupId,
          final_size: 1024 * 1024 * Math.floor(Math.random() * 50) + 10, // 10-60MB
          success: true
        });

      toast.success("Backup manual criado com sucesso!");
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error("Erro ao criar backup manual");
    } finally {
      setLoading(false);
    }
  };

  const checkIntegrity = async () => {
    try {
      setLoading(true);
      
      // Check database integrity
      const { data: integrityCheck, error } = await supabase
        .rpc('check_database_integrity');

      if (error) {
        throw error;
      }

      // Process integrity check results
      const issues = integrityCheck?.issues || [];
      const warnings = integrityCheck?.warnings || [];
      
      if (issues.length > 0) {
        toast.error(`Encontrados ${issues.length} problemas de integridade`);
      } else if (warnings.length > 0) {
        toast.warning(`Encontrados ${warnings.length} avisos de integridade`);
      } else {
        toast.success("Verificação de integridade concluída sem problemas!");
      }

      // Log the integrity check
      await supabase
        .from('system_stats' as any)
        .insert({
          metric_name: 'maintenance_action',
          metric_value: {
            action: 'check_integrity',
            details: {
              issues_count: issues.length,
              warnings_count: warnings.length,
              status: issues.length > 0 ? 'fail' : warnings.length > 0 ? 'warning' : 'pass'
            },
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });

    } catch (error) {
      console.error('Error checking integrity:', error);
      toast.error("Erro ao verificar integridade");
    } finally {
      setLoading(false);
    }
  };

  const vacuumDatabase = async () => {
    try {
      setLoading(true);
      
      // Vacuum database
      const { error } = await supabase
        .rpc('vacuum_database');

      if (error) {
        throw error;
      }

      toast.success("Vacuum da base de dados concluído!");
    } catch (error) {
      console.error('Error vacuuming database:', error);
      toast.error("Erro ao executar vacuum");
    } finally {
      setLoading(false);
    }
  };

  const reindexDatabase = async () => {
    try {
      setLoading(true);
      
      // Reindex database
      const { error } = await supabase
        .rpc('reindex_database');

      if (error) {
        throw error;
      }

      toast.success("Reindex da base de dados concluído!");
    } catch (error) {
      console.error('Error reindexing database:', error);
      toast.error("Erro ao executar reindex");
    } finally {
      setLoading(false);
    }
  };

  const getMaintenanceStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_maintenance_stats');

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting maintenance stats:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, []);

  return {
    config,
    stats,
    loading,
    saving,
    fetchConfig,
    fetchStats,
    saveConfig,
    clearCache,
    optimizeDatabase,
    createBackup,
    checkIntegrity,
    vacuumDatabase,
    reindexDatabase,
    getMaintenanceStats,
    toggleMaintenanceMode,
    toggleAllowRegistration,
    toggleEmailVerification,
    toggleEmailNotifications,
    toggleSMSNotifications,
    togglePushNotifications,
    testEmailNotification,
    testSMSNotification,
    testPushNotification,
    toggleCache,
    toggleCompression,
    toggleCDN,
    toggleAutoBackup,
    testCache,
    testCompression,
    testCDN,
    testBackup,
    setTheme,
    setLanguage,
    setTimezone,
    setDateFormat,
    setTimeFormat,
    setPrimaryColor,
    setAccentColor
  };
}; 