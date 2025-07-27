import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthSettings {
  allowRegistration: boolean;
  requireEmailVerification: boolean;
}

export const useAuthSettings = () => {
  const [settings, setSettings] = useState<AuthSettings>({
    allowRegistration: false,
    requireEmailVerification: true
  });
  const [loading, setLoading] = useState(true);

  const fetchAuthSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch registration setting
      const { data: registrationData } = await supabase
        .rpc('get_system_setting' as any, {
          setting_key: 'allow_registration'
        });

      // Fetch email verification setting
      const { data: emailVerificationData } = await supabase
        .rpc('get_system_setting' as any, {
          setting_key: 'require_email_verification'
        });

      setSettings({
        allowRegistration: registrationData === true,
        requireEmailVerification: emailVerificationData === true
      });
    } catch (error) {
      console.error('Error fetching auth settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthSettings();
  }, []);

  return {
    settings,
    loading,
    fetchAuthSettings
  };
}; 