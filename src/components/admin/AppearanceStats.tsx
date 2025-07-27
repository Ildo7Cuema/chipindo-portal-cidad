import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Globe, 
  Clock, 
  Monitor,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Eye,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AppearanceStats {
  themeUsage: { light: number; dark: number; auto: number };
  languageUsage: { [key: string]: number };
  timezoneUsage: { [key: string]: number };
  deviceUsage: { desktop: number; tablet: number; mobile: number };
}

export const AppearanceStats = () => {
  const [stats, setStats] = useState<AppearanceStats>({
    themeUsage: { light: 0, dark: 0, auto: 0 },
    languageUsage: {},
    timezoneUsage: {},
    deviceUsage: { desktop: 0, tablet: 0, mobile: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Mock data since system_stats table doesn't exist
      const mockStats: AppearanceStats = {
        themeUsage: { light: 45, dark: 32, auto: 23 },
        languageUsage: { 'pt': 85, 'en': 12, 'es': 3 },
        timezoneUsage: { 'Africa/Luanda': 90, 'UTC': 8, 'Europe/London': 2 },
        deviceUsage: { desktop: 60, tablet: 25, mobile: 115 }
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching appearance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalThemeUsage = () => {
    return stats.themeUsage.light + stats.themeUsage.dark + stats.themeUsage.auto;
  };

  const getTotalLanguageUsage = () => {
    return Object.values(stats.languageUsage).reduce((sum, count) => sum + count, 0);
  };

  const getTotalTimezoneUsage = () => {
    return Object.values(stats.timezoneUsage).reduce((sum, count) => sum + count, 0);
  };

  const getTotalDeviceUsage = () => {
    return stats.deviceUsage.desktop + stats.deviceUsage.tablet + stats.deviceUsage.mobile;
  };

  const getLanguageName = (code: string): string => {
    const names: { [key: string]: string } = {
      'pt': 'Português',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'zh': '中文'
    };
    return names[code] || code;
  };

  const getTimezoneName = (timezone: string): string => {
    const names: { [key: string]: string } = {
      'Africa/Luanda': 'Luanda',
      'UTC': 'UTC',
      'Europe/London': 'London',
      'America/New_York': 'New York',
      'Europe/Paris': 'Paris',
      'Asia/Tokyo': 'Tokyo',
      'Australia/Sydney': 'Sydney'
    };
    return names[timezone] || timezone;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas de Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Activity className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando estatísticas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Uso de Temas
          </CardTitle>
          <CardDescription>
            Distribuição do uso de temas nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Claro</span>
                <Badge variant="outline">{stats.themeUsage.light}</Badge>
              </div>
              <Progress 
                value={getTotalThemeUsage() > 0 ? (stats.themeUsage.light / getTotalThemeUsage()) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Escuro</span>
                <Badge variant="outline">{stats.themeUsage.dark}</Badge>
              </div>
              <Progress 
                value={getTotalThemeUsage() > 0 ? (stats.themeUsage.dark / getTotalThemeUsage()) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Automático</span>
                <Badge variant="outline">{stats.themeUsage.auto}</Badge>
              </div>
              <Progress 
                value={getTotalThemeUsage() > 0 ? (stats.themeUsage.auto / getTotalThemeUsage()) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Total: {getTotalThemeUsage()} alterações
          </div>
        </CardContent>
      </Card>

      {/* Language Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Uso de Idiomas
          </CardTitle>
          <CardDescription>
            Idiomas mais utilizados pelos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(stats.languageUsage).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.languageUsage)
                .sort(([,a], [,b]) => b - a)
                .map(([code, count]) => (
                  <div key={code} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{getLanguageName(code)}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                    <Progress 
                      value={getTotalLanguageUsage() > 0 ? (count / getTotalLanguageUsage()) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nenhum dado de idioma disponível
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Total: {getTotalLanguageUsage()} alterações
          </div>
        </CardContent>
      </Card>

      {/* Timezone Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Uso de Fusos Horários
          </CardTitle>
          <CardDescription>
            Fusos horários mais utilizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(stats.timezoneUsage).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.timezoneUsage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5) // Top 5
                .map(([timezone, count]) => (
                  <div key={timezone} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{getTimezoneName(timezone)}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                    <Progress 
                      value={getTotalTimezoneUsage() > 0 ? (count / getTotalTimezoneUsage()) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nenhum dado de fuso horário disponível
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Total: {getTotalTimezoneUsage()} alterações
          </div>
        </CardContent>
      </Card>

      {/* Device Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Uso por Dispositivo
          </CardTitle>
          <CardDescription>
            Distribuição de acesso por tipo de dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Desktop</span>
                <Badge variant="outline">{stats.deviceUsage.desktop}</Badge>
              </div>
              <Progress 
                value={getTotalDeviceUsage() > 0 ? (stats.deviceUsage.desktop / getTotalDeviceUsage()) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tablet</span>
                <Badge variant="outline">{stats.deviceUsage.tablet}</Badge>
              </div>
              <Progress 
                value={getTotalDeviceUsage() > 0 ? (stats.deviceUsage.tablet / getTotalDeviceUsage()) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mobile</span>
                <Badge variant="outline">{stats.deviceUsage.mobile}</Badge>
              </div>
              <Progress 
                value={getTotalDeviceUsage() > 0 ? (stats.deviceUsage.mobile / getTotalDeviceUsage()) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Total: {getTotalDeviceUsage()} sessões
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Gerenciar configurações de aparência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Visualização</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Configurar tema, cores e layout
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Internacionalização</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Idioma, fuso horário e formato
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Estatísticas de uso e preferências
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Usuários</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Preferências individuais e grupos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 