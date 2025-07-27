// Simplified appearance services without system_stats table
import { toast } from 'sonner';

export const updateTheme = async (theme: 'light' | 'dark' | 'auto') => {
  try {
    // Apply theme locally
    if (theme === 'auto') {
      document.documentElement.classList.remove('light', 'dark');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.remove('light', 'dark', 'auto');
      document.documentElement.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
    toast.success(`Tema alterado para ${theme}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating theme:', error);
    toast.error('Erro ao alterar tema');
    return { success: false, error };
  }
};

export const updateLanguage = async (language: string) => {
  try {
    localStorage.setItem('language', language);
    toast.success(`Idioma alterado para ${language}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating language:', error);
    toast.error('Erro ao alterar idioma');
    return { success: false, error };
  }
};

export const updateTimezone = async (timezone: string) => {
  try {
    localStorage.setItem('timezone', timezone);
    toast.success(`Fuso horário alterado para ${timezone}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating timezone:', error);
    toast.error('Erro ao alterar fuso horário');
    return { success: false, error };
  }
};

export const trackUserInteraction = async (action: string, details: any) => {
  try {
    // Mock tracking since system_stats table doesn't exist
    console.log('User interaction tracked:', { action, details });
    return { success: true };
  } catch (error) {
    console.error('Error tracking user interaction:', error);
    return { success: false, error };
  }
};