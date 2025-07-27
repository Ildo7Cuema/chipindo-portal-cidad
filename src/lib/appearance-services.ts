import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for appearance services
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
}

export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  numberFormat: string;
}

export interface TimezoneConfig {
  timezone: string;
  offset: string;
  dst: boolean;
  dstOffset: string;
}

export interface DateFormatConfig {
  format: string;
  locale: string;
  timeFormat: '12h' | '24h';
  weekStart: 'monday' | 'sunday';
}

export interface DeviceConfig {
  type: 'desktop' | 'tablet' | 'mobile';
  resolution: string;
  active: boolean;
  lastSeen: string;
}

export interface AppearanceStats {
  themeUsage: { light: number; dark: number; auto: number };
  languageUsage: { [key: string]: number };
  timezoneUsage: { [key: string]: number };
  deviceUsage: { desktop: number; tablet: number; mobile: number };
}

// Theme Service
export class ThemeService {
  private static instance: ThemeService;
  private config: ThemeConfig;

  constructor() {
    this.config = {
      mode: 'auto',
      primaryColor: '#0f172a',
      accentColor: '#3b82f6',
      borderRadius: 6,
      fontFamily: 'Inter',
      fontSize: 'medium'
    };
  }

  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  async setTheme(mode: 'light' | 'dark' | 'auto'): Promise<void> {
    try {
      this.config.mode = mode;
      
      // Apply theme to document
      this.applyTheme(mode);
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'theme_mode',
          setting_value: mode
        });

      // Log theme change
      await this.logThemeChange(mode);
      
      toast.success(`Tema alterado para ${this.getThemeName(mode)}`);
    } catch (error) {
      console.error('Error setting theme:', error);
      toast.error("Erro ao alterar tema");
    }
  }

  async setPrimaryColor(color: string): Promise<void> {
    try {
      this.config.primaryColor = color;
      
      // Apply color to CSS variables
      document.documentElement.style.setProperty('--primary', color);
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'primary_color',
          setting_value: color
        });

      toast.success("Cor primária atualizada!");
    } catch (error) {
      console.error('Error setting primary color:', error);
      toast.error("Erro ao atualizar cor primária");
    }
  }

  async setAccentColor(color: string): Promise<void> {
    try {
      this.config.accentColor = color;
      
      // Apply color to CSS variables
      document.documentElement.style.setProperty('--accent', color);
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'accent_color',
          setting_value: color
        });

      toast.success("Cor de destaque atualizada!");
    } catch (error) {
      console.error('Error setting accent color:', error);
      toast.error("Erro ao atualizar cor de destaque");
    }
  }

  private applyTheme(mode: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;
    
    if (mode === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', mode === 'dark');
    }
  }

  private getThemeName(mode: string): string {
    switch (mode) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'auto': return 'Automático';
      default: return 'Desconhecido';
    }
  }

  private async logThemeChange(mode: string): Promise<void> {
    try {
      await supabase
        .from('system_stats')
        .insert({
          metric_name: 'theme_change',
          metric_value: {
            mode,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });
    } catch (error) {
      console.error('Error logging theme change:', error);
    }
  }

  getConfig(): ThemeConfig {
    return this.config;
  }

  setConfig(config: Partial<ThemeConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Language Service
export class LanguageService {
  private static instance: LanguageService;
  private config: LanguageConfig;
  private supportedLanguages: LanguageConfig[] = [
    { code: 'pt', name: 'Português', flag: '🇦🇴', direction: 'ltr', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', currency: 'AOA', numberFormat: 'pt-AO' },
    { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr', dateFormat: 'MM/DD/YYYY', timeFormat: '12h', currency: 'USD', numberFormat: 'en-US' },
    { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', currency: 'EUR', numberFormat: 'es-ES' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr', dateFormat: 'DD/MM/YYYY', timeFormat: '24h', currency: 'EUR', numberFormat: 'fr-FR' },
    { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr', dateFormat: 'YYYY-MM-DD', timeFormat: '24h', currency: 'CNY', numberFormat: 'zh-CN' }
  ];

  constructor() {
    this.config = this.supportedLanguages[0]; // Default to Portuguese
  }

  static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  async setLanguage(code: string): Promise<void> {
    try {
      const language = this.supportedLanguages.find(lang => lang.code === code);
      if (!language) {
        throw new Error(`Language ${code} not supported`);
      }

      this.config = language;
      
      // Apply language to document
      document.documentElement.lang = code;
      document.documentElement.dir = language.direction;
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'language',
          setting_value: code
        });

      // Log language change
      await this.logLanguageChange(code);
      
      toast.success(`Idioma alterado para ${language.name}`);
    } catch (error) {
      console.error('Error setting language:', error);
      toast.error("Erro ao alterar idioma");
    }
  }

  getSupportedLanguages(): LanguageConfig[] {
    return this.supportedLanguages;
  }

  getCurrentLanguage(): LanguageConfig {
    return this.config;
  }

  private async logLanguageChange(code: string): Promise<void> {
    try {
      await supabase
        .from('system_stats')
        .insert({
          metric_name: 'language_change',
          metric_value: {
            language_code: code,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });
    } catch (error) {
      console.error('Error logging language change:', error);
    }
  }
}

// Timezone Service
export class TimezoneService {
  private static instance: TimezoneService;
  private config: TimezoneConfig;
  private supportedTimezones: { value: string; label: string; offset: string }[] = [
    { value: 'Africa/Luanda', label: 'Luanda (GMT+1)', offset: '+01:00' },
    { value: 'UTC', label: 'UTC (GMT+0)', offset: '+00:00' },
    { value: 'Europe/London', label: 'London (GMT+0)', offset: '+00:00' },
    { value: 'America/New_York', label: 'New York (GMT-5)', offset: '-05:00' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1)', offset: '+01:00' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', offset: '+09:00' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+10)', offset: '+10:00' }
  ];

  constructor() {
    this.config = {
      timezone: 'Africa/Luanda',
      offset: '+01:00',
      dst: false,
      dstOffset: '+01:00'
    };
  }

  static getInstance(): TimezoneService {
    if (!TimezoneService.instance) {
      TimezoneService.instance = new TimezoneService();
    }
    return TimezoneService.instance;
  }

  async setTimezone(timezone: string): Promise<void> {
    try {
      const tzInfo = this.supportedTimezones.find(tz => tz.value === timezone);
      if (!tzInfo) {
        throw new Error(`Timezone ${timezone} not supported`);
      }

      this.config.timezone = timezone;
      this.config.offset = tzInfo.offset;
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'timezone',
          setting_value: timezone
        });

      // Log timezone change
      await this.logTimezoneChange(timezone);
      
      toast.success(`Fuso horário alterado para ${tzInfo.label}`);
    } catch (error) {
      console.error('Error setting timezone:', error);
      toast.error("Erro ao alterar fuso horário");
    }
  }

  getSupportedTimezones(): { value: string; label: string; offset: string }[] {
    return this.supportedTimezones;
  }

  getCurrentTimezone(): TimezoneConfig {
    return this.config;
  }

  formatDate(date: Date, format: string = 'DD/MM/YYYY'): string {
    // Simple date formatting - in production, use a library like date-fns
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  }

  formatTime(date: Date, format: '12h' | '24h' = '24h'): string {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${period}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  private async logTimezoneChange(timezone: string): Promise<void> {
    try {
      await supabase
        .from('system_stats')
        .insert({
          metric_name: 'timezone_change',
          metric_value: {
            timezone,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });
    } catch (error) {
      console.error('Error logging timezone change:', error);
    }
  }
}

// Date Format Service
export class DateFormatService {
  private static instance: DateFormatService;
  private config: DateFormatConfig;

  constructor() {
    this.config = {
      format: 'DD/MM/YYYY',
      locale: 'pt-AO',
      timeFormat: '24h',
      weekStart: 'monday'
    };
  }

  static getInstance(): DateFormatService {
    if (!DateFormatService.instance) {
      DateFormatService.instance = new DateFormatService();
    }
    return DateFormatService.instance;
  }

  async setDateFormat(format: string): Promise<void> {
    try {
      this.config.format = format;
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'date_format',
          setting_value: format
        });

      // Log date format change
      await this.logDateFormatChange(format);
      
      toast.success("Formato de data atualizado!");
    } catch (error) {
      console.error('Error setting date format:', error);
      toast.error("Erro ao atualizar formato de data");
    }
  }

  async setTimeFormat(format: '12h' | '24h'): Promise<void> {
    try {
      this.config.timeFormat = format;
      
      // Save to database
      await supabase
        .rpc('update_system_setting', {
          setting_key: 'time_format',
          setting_value: format
        });

      toast.success("Formato de hora atualizado!");
    } catch (error) {
      console.error('Error setting time format:', error);
      toast.error("Erro ao atualizar formato de hora");
    }
  }

  getConfig(): DateFormatConfig {
    return this.config;
  }

  private async logDateFormatChange(format: string): Promise<void> {
    try {
      await supabase
        .from('system_stats')
        .insert({
          metric_name: 'date_format_change',
          metric_value: {
            format,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });
    } catch (error) {
      console.error('Error logging date format change:', error);
    }
  }
}

// Device Service
export class DeviceService {
  private static instance: DeviceService;
  private devices: DeviceConfig[] = [];

  constructor() {
    this.devices = [
      { type: 'desktop', resolution: '1920x1080', active: true, lastSeen: new Date().toISOString() },
      { type: 'tablet', resolution: '768x1024', active: false, lastSeen: new Date().toISOString() },
      { type: 'mobile', resolution: '375x667', active: true, lastSeen: new Date().toISOString() }
    ];
  }

  static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  async getDevices(): Promise<DeviceConfig[]> {
    try {
      // In a real app, this would fetch from database
      return this.devices;
    } catch (error) {
      console.error('Error fetching devices:', error);
      return [];
    }
  }

  async updateDeviceStatus(type: string, active: boolean): Promise<void> {
    try {
      const device = this.devices.find(d => d.type === type);
      if (device) {
        device.active = active;
        device.lastSeen = new Date().toISOString();
      }

      // Log device status change
      await this.logDeviceStatusChange(type, active);
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  }

  private async logDeviceStatusChange(type: string, active: boolean): Promise<void> {
    try {
      await supabase
        .from('system_stats')
        .insert({
          metric_name: 'device_status_change',
          metric_value: {
            device_type: type,
            active,
            timestamp: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        });
    } catch (error) {
      console.error('Error logging device status change:', error);
    }
  }
}

// Appearance Manager
export class AppearanceManager {
  private static instance: AppearanceManager;
  private themeService: ThemeService;
  private languageService: LanguageService;
  private timezoneService: TimezoneService;
  private dateFormatService: DateFormatService;
  private deviceService: DeviceService;

  constructor() {
    this.themeService = ThemeService.getInstance();
    this.languageService = LanguageService.getInstance();
    this.timezoneService = TimezoneService.getInstance();
    this.dateFormatService = DateFormatService.getInstance();
    this.deviceService = DeviceService.getInstance();
  }

  static getInstance(): AppearanceManager {
    if (!AppearanceManager.instance) {
      AppearanceManager.instance = new AppearanceManager();
    }
    return AppearanceManager.instance;
  }

  async initialize(): Promise<void> {
    // Load configuration from database
    await this.loadConfig();
  }

  async loadConfig(): Promise<void> {
    try {
      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['theme_mode', 'language', 'timezone', 'date_format', 'time_format', 'primary_color', 'accent_color']);

      if (error) {
        console.error('Error loading appearance config:', error);
        return;
      }

      settings?.forEach((setting: any) => {
        switch (setting.key) {
          case 'theme_mode':
            this.themeService.setTheme(setting.value);
            break;
          case 'language':
            this.languageService.setLanguage(setting.value);
            break;
          case 'timezone':
            this.timezoneService.setTimezone(setting.value);
            break;
          case 'date_format':
            this.dateFormatService.setDateFormat(setting.value);
            break;
          case 'time_format':
            this.dateFormatService.setTimeFormat(setting.value);
            break;
          case 'primary_color':
            this.themeService.setPrimaryColor(setting.value);
            break;
          case 'accent_color':
            this.themeService.setAccentColor(setting.value);
            break;
        }
      });
    } catch (error) {
      console.error('Error loading appearance configuration:', error);
    }
  }

  async getStats(): Promise<AppearanceStats> {
    try {
      const { data, error } = await supabase
        .from('system_stats')
        .select('metric_name, metric_value')
        .in('metric_name', ['theme_change', 'language_change', 'timezone_change', 'device_status_change']);

      if (error) {
        console.error('Error fetching appearance stats:', error);
        return this.getDefaultStats();
      }

      // Process stats
      const stats = this.getDefaultStats();
      
      data?.forEach(record => {
        const value = record.metric_value;
        
        switch (record.metric_name) {
          case 'theme_change':
            if (value.mode) {
              stats.themeUsage[value.mode as keyof typeof stats.themeUsage]++;
            }
            break;
          case 'language_change':
            if (value.language_code) {
              stats.languageUsage[value.language_code] = (stats.languageUsage[value.language_code] || 0) + 1;
            }
            break;
          case 'timezone_change':
            if (value.timezone) {
              stats.timezoneUsage[value.timezone] = (stats.timezoneUsage[value.timezone] || 0) + 1;
            }
            break;
          case 'device_status_change':
            if (value.device_type && value.active) {
              stats.deviceUsage[value.device_type as keyof typeof stats.deviceUsage]++;
            }
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting appearance stats:', error);
      return this.getDefaultStats();
    }
  }

  private getDefaultStats(): AppearanceStats {
    return {
      themeUsage: { light: 0, dark: 0, auto: 0 },
      languageUsage: {},
      timezoneUsage: {},
      deviceUsage: { desktop: 0, tablet: 0, mobile: 0 }
    };
  }

  // Theme operations
  async setTheme(mode: 'light' | 'dark' | 'auto'): Promise<void> {
    return this.themeService.setTheme(mode);
  }

  async setPrimaryColor(color: string): Promise<void> {
    return this.themeService.setPrimaryColor(color);
  }

  async setAccentColor(color: string): Promise<void> {
    return this.themeService.setAccentColor(color);
  }

  // Language operations
  async setLanguage(code: string): Promise<void> {
    return this.languageService.setLanguage(code);
  }

  getSupportedLanguages(): LanguageConfig[] {
    return this.languageService.getSupportedLanguages();
  }

  // Timezone operations
  async setTimezone(timezone: string): Promise<void> {
    return this.timezoneService.setTimezone(timezone);
  }

  getSupportedTimezones(): { value: string; label: string; offset: string }[] {
    return this.timezoneService.getSupportedTimezones();
  }

  // Date format operations
  async setDateFormat(format: string): Promise<void> {
    return this.dateFormatService.setDateFormat(format);
  }

  async setTimeFormat(format: '12h' | '24h'): Promise<void> {
    return this.dateFormatService.setTimeFormat(format);
  }

  // Device operations
  async getDevices(): Promise<DeviceConfig[]> {
    return this.deviceService.getDevices();
  }

  async updateDeviceStatus(type: string, active: boolean): Promise<void> {
    return this.deviceService.updateDeviceStatus(type, active);
  }
}

// Export singleton instance
export const appearanceManager = AppearanceManager.getInstance(); 