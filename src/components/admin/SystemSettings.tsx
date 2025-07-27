import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Shield, 
  Mail, 
  Globe, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Activity,
  Zap,
  Eye,
  EyeOff,
  Server,
  Key,
  Users,
  Bell,
  FileText,
  Globe2,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  Database as DatabaseIcon,
  HardDrive as HardDriveIcon,
  Activity as ActivityIcon,
  TrendingUp,
  AlertCircle,
  Info,
  Download,
  CheckSquare,
  AlertCircle as AlertCircleIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/hooks/useSystemSettings";

export const SystemSettings = () => {
  const {
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
  } = useSystemSettings();

  const [activeTab, setActiveTab] = useState("general");
  const [localConfig, setLocalConfig] = useState(config);

  // Update local config when config changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = async () => {
    try {
      await saveConfig(localConfig);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleReset = () => {
    setLocalConfig(config);
    toast.success("Configurações restauradas aos valores atuais");
  };

  // Security switch handlers
  const handleMaintenanceModeToggle = async (enabled: boolean) => {
    try {
      await toggleMaintenanceMode(enabled);
      setLocalConfig(prev => ({ ...prev, maintenanceMode: enabled }));
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
    }
  };

  const handleAllowRegistrationToggle = async (enabled: boolean) => {
    try {
      await toggleAllowRegistration(enabled);
      setLocalConfig(prev => ({ ...prev, allowRegistration: enabled }));
    } catch (error) {
      console.error('Error toggling registration setting:', error);
    }
  };

  const handleEmailVerificationToggle = async (enabled: boolean) => {
    try {
      await toggleEmailVerification(enabled);
      setLocalConfig(prev => ({ ...prev, requireEmailVerification: enabled }));
    } catch (error) {
      console.error('Error toggling email verification setting:', error);
    }
  };

  const getStoragePercentage = () => (stats.storageUsed / stats.storageTotal) * 100;
  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-green-600";
    if (uptime >= 99.5) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Utilizadores Ativos</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.activeUsers}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">de {stats.totalUsers} total</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Uptime</p>
                <p className={cn("text-2xl font-bold", getUptimeColor(stats.uptime))}>{stats.uptime}%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Disponibilidade</p>
              </div>
              <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Armazenamento</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.storageUsed.toFixed(1)}GB</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">de {stats.storageTotal}GB</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.cacheHitRate}%</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Performance</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Notícias</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.publishedNews}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">de {stats.totalNews} total</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Concursos</p>
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{stats.publishedConcursos}</p>
                <p className="text-xs text-teal-600 dark:text-teal-400">de {stats.totalConcursos} total</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Notificações</p>
                <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">{stats.unreadNotifications}</p>
                <p className="text-xs text-pink-600 dark:text-pink-400">de {stats.totalNotifications} total</p>
              </div>
              <Bell className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Base de Dados</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.databaseSize.toFixed(2)}GB</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Tamanho atual</p>
              </div>
              <Database className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={saving}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restaurar Padrões
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? 'A Guardar...' : 'Guardar Configurações'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Aparência
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Manutenção
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Globe2 className="h-5 w-5" />
                    Informações do Site
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nome do Site *</Label>
                      <Input
                        id="siteName"
                        value={localConfig.siteName}
                        onChange={(e) => setLocalConfig({ ...localConfig, siteName: e.target.value })}
                        placeholder="Portal de Chipindo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Descrição do Site</Label>
                      <Textarea
                        id="siteDescription"
                        value={localConfig.siteDescription}
                        onChange={(e) => setLocalConfig({ ...localConfig, siteDescription: e.target.value })}
                        placeholder="Portal oficial do município de Chipindo"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Informações de Contacto
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contacto *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={localConfig.contactEmail}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactEmail: e.target.value })}
                        placeholder="contato@chipindo.gov.ao"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Telefone</Label>
                      <Input
                        id="contactPhone"
                        value={localConfig.contactPhone}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactPhone: e.target.value })}
                        placeholder="+244 123 456 789"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactAddress">Endereço</Label>
                      <Textarea
                        id="contactAddress"
                        value={localConfig.contactAddress}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactAddress: e.target.value })}
                        placeholder="Chipindo, Huíla, Angola"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configurações de Segurança
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo de Manutenção</Label>
                        <p className="text-sm text-muted-foreground">
                          Desabilita temporariamente o acesso público
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.maintenanceMode}
                        onCheckedChange={handleMaintenanceModeToggle}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Permitir Registro</Label>
                        <p className="text-sm text-muted-foreground">
                          Permite novos utilizadores se registrarem
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.allowRegistration}
                        onCheckedChange={handleAllowRegistrationToggle}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Verificação de Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Requer verificação de email para ativação
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.requireEmailVerification}
                        onCheckedChange={handleEmailVerificationToggle}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Configurações Avançadas
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
                      <Select value={localConfig.sessionTimeout.toString()} onValueChange={(value) => setLocalConfig({ ...localConfig, sessionTimeout: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Tentativas de Login Máximas</Label>
                      <Select value={localConfig.maxLoginAttempts.toString()} onValueChange={(value) => setLocalConfig({ ...localConfig, maxLoginAttempts: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 tentativas</SelectItem>
                          <SelectItem value="5">5 tentativas</SelectItem>
                          <SelectItem value="10">10 tentativas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Tipos de Notificação
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar notificações importantes por email
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.emailNotifications}
                        onCheckedChange={toggleEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar notificações por SMS
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.smsNotifications}
                        onCheckedChange={toggleSMSNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificações push no navegador
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.pushNotifications}
                        onCheckedChange={togglePushNotifications}
                      />
                    </div>
                  </div>
                  
                  {/* Test Buttons */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Testar Notificações</h4>
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testEmailNotification}
                        disabled={loading || !localConfig.emailNotifications}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Testar Email
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testSMSNotification}
                        disabled={loading || !localConfig.smsNotifications}
                        className="flex items-center gap-2"
                      >
                        <Smartphone className="h-4 w-4" />
                        Testar SMS
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testPushNotification}
                        disabled={loading || !localConfig.pushNotifications}
                        className="flex items-center gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        Testar Push
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Frequência
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notificationFrequency">Frequência de Notificações</Label>
                      <Select value={localConfig.notificationFrequency} onValueChange={(value) => setLocalConfig({ ...localConfig, notificationFrequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Tempo real</SelectItem>
                          <SelectItem value="hourly">A cada hora</SelectItem>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Configurações Avançadas</Label>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Permitir notificações urgentes</span>
                          <Badge variant="outline">Sempre ativo</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Notificações de manutenção</span>
                          <Badge variant="outline">Automático</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Notificações de sistema</span>
                          <Badge variant="outline">Habilitado</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Performance Settings */}
            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Otimizações
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cache Habilitado</Label>
                        <p className="text-sm text-muted-foreground">
                          Melhora a performance do site
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.cacheEnabled}
                        onCheckedChange={toggleCache}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compressão</Label>
                        <p className="text-sm text-muted-foreground">
                          Comprime arquivos para carregamento mais rápido
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.compressionEnabled}
                        onCheckedChange={toggleCompression}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>CDN</Label>
                        <p className="text-sm text-muted-foreground">
                          Usa CDN para distribuição global
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.cdnEnabled}
                        onCheckedChange={toggleCDN}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Backup Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Faz backup automático dos dados
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.autoBackup}
                        onCheckedChange={toggleAutoBackup}
                      />
                    </div>
                  </div>
                  
                  {/* Test Buttons */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Testar Funcionalidades</h4>
                    <div className="grid gap-2 grid-cols-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testCache}
                        disabled={loading || !localConfig.cacheEnabled}
                        className="flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        Testar Cache
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testCompression}
                        disabled={loading || !localConfig.compressionEnabled}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Testar Compressão
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testCDN}
                        disabled={loading || !localConfig.cdnEnabled}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Testar CDN
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testBackup}
                        disabled={loading || !localConfig.autoBackup}
                        className="flex items-center gap-2"
                      >
                        <HardDrive className="h-4 w-4" />
                        Testar Backup
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Estatísticas de Performance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Armazenamento</span>
                        <span>{stats.storageUsed.toFixed(1)}GB / {stats.storageTotal}GB</span>
                      </div>
                      <Progress value={getStoragePercentage()} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cache Hit Rate</span>
                        <span>{stats.cacheHitRate}%</span>
                      </div>
                      <Progress value={stats.cacheHitRate} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uptime</span>
                        <span>{stats.uptime}%</span>
                      </div>
                      <Progress value={stats.uptime} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Compressão</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CDN Hit Rate</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Aparência
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select value={localConfig.theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="auto">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select value={localConfig.language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">🇦🇴 Português</SelectItem>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Español</SelectItem>
                          <SelectItem value="fr">🇫🇷 Français</SelectItem>
                          <SelectItem value="zh">🇨🇳 中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select value={localConfig.timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Luanda">🌍 Luanda (GMT+1)</SelectItem>
                          <SelectItem value="UTC">🌐 UTC (GMT+0)</SelectItem>
                          <SelectItem value="Europe/London">🇬🇧 London (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">🇺🇸 New York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/Paris">🇫🇷 Paris (GMT+1)</SelectItem>
                          <SelectItem value="Asia/Tokyo">🇯🇵 Tokyo (GMT+9)</SelectItem>
                          <SelectItem value="Australia/Sydney">🇦🇺 Sydney (GMT+10)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Formato de Data</Label>
                      <Select value={localConfig.dateFormat} onValueChange={setDateFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Formato de Hora</Label>
                      <Select value={localConfig.timeFormat || '24h'} onValueChange={setTimeFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 horas</SelectItem>
                          <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Custom Colors */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Cores Personalizadas</h4>
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Cor Primária</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="primaryColor"
                            value={localConfig.primaryColor || '#0f172a'}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-8 rounded border cursor-pointer"
                          />
                          <span className="text-sm text-muted-foreground">
                            {localConfig.primaryColor || '#0f172a'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Cor de Destaque</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="accentColor"
                            value={localConfig.accentColor || '#3b82f6'}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-12 h-8 rounded border cursor-pointer"
                          />
                          <span className="text-sm text-muted-foreground">
                            {localConfig.accentColor || '#3b82f6'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Dispositivos
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Desktop</p>
                          <p className="text-sm text-muted-foreground">1920x1080</p>
                        </div>
                      </div>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Tablet className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Tablet</p>
                          <p className="text-sm text-muted-foreground">768x1024</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Inativo</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Mobile</p>
                          <p className="text-sm text-muted-foreground">375x667</p>
                        </div>
                      </div>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Maintenance Settings */}
            <TabsContent value="maintenance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Ferramentas de Manutenção
                  </h3>
                  
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={clearCache}
                      disabled={loading}
                    >
                      <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                      Limpar Cache
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={optimizeDatabase}
                      disabled={loading}
                    >
                      <DatabaseIcon className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                      Otimizar Base de Dados
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={createBackup}
                      disabled={loading}
                    >
                      <HardDriveIcon className="h-4 w-4 mr-2" />
                      Backup Manual
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={checkIntegrity}
                      disabled={loading}
                    >
                      <ActivityIcon className="h-4 w-4 mr-2" />
                      Verificar Integridade
                    </Button>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Ferramentas Avançadas</h4>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={vacuumDatabase}
                      disabled={loading}
                    >
                      <DatabaseIcon className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                      Vacuum Database
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={reindexDatabase}
                      disabled={loading}
                    >
                      <DatabaseIcon className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                      Reindex Database
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informações do Sistema
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tamanho da Base de Dados:</span>
                        <span>{stats.databaseSize.toFixed(2)}GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Último Backup:</span>
                        <span>{stats.lastBackup}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Uptime:</span>
                        <span>{stats.uptime}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Utilizadores Ativos:</span>
                        <span>{stats.activeUsers}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Servidor Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Base de Dados Conectada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Conexão Estável</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};