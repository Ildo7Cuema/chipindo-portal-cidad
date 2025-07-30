import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_location_badge: string;
  population_count: string;
  population_description: string;
  departments_count: string;
  departments_description: string;
  services_count: string;
  services_description: string;
  area_total_count: string;
  area_total_description: string;
  growth_rate: string;
  growth_description: string;
  growth_period: string;
  footer_about_title: string;
  footer_about_subtitle: string;
  footer_about_description: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  opening_hours_weekdays: string;
  opening_hours_saturday: string;
  opening_hours_sunday: string;
  copyright_text: string;
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_youtube: string | null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching site settings:', error);
        } else {
          // Ensure all required fields are present with defaults
          const settingsWithDefaults: SiteSettings = {
            ...data,
            area_total_count: (data as any).area_total_count || '2.100',
            area_total_description: (data as any).area_total_description || 'Quilómetros quadrados',
            growth_rate: (data as any).growth_rate || '5.4',
            growth_description: (data as any).growth_description || 'Taxa anual',
            growth_period: (data as any).growth_period || '2024'
          };
          setSettings(settingsWithDefaults);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    if (!settings) return;

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ensure all required fields are present with defaults
      const settingsWithDefaults: SiteSettings = {
        ...data,
        area_total_count: (data as any).area_total_count || '2.100',
        area_total_description: (data as any).area_total_description || 'Quilómetros quadrados',
        growth_rate: (data as any).growth_rate || '5.4',
        growth_description: (data as any).growth_description || 'Taxa anual',
        growth_period: (data as any).growth_period || '2024'
      };
      setSettings(settingsWithDefaults);
      return settingsWithDefaults;
    } catch (error) {
      console.error('Error updating site settings:', error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings
  };
}