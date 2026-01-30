import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Save,
  RefreshCw,
  Database,
  Shield,
  Mail,
  Globe,
  Bell,
  Activity,
  Palette,
  Monitor,
  Users,
  HardDrive,
  Zap,
  Phone,
  AlertCircle,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useSystemSettings } from "@/hooks/useSystemSettings";

export const SystemSettings = () => {
  const {
    systemConfig,
    loading,
    saving,
    saveSystemSettings,
    resetToDefaults,
    exportSettings,
    importSettings,
    createBackup,
    optimizeDatabase,
    vacuumDatabase,
    reindexDatabase,
    checkDatabaseIntegrity,
    getMaintenanceStats
  } = useSystemSettings();

  const [activeTab, setActiveTab] = useState("general");
  const [localConfig, setLocalConfig] = useState(systemConfig);

  // Update local config when systemConfig changes
  useEffect(() => {
    setLocalConfig(systemConfig);
  }, [systemConfig]);

  const handleSave = async () => {
    await saveSystemSettings(localConfig);
  };

  const handleReset = async () => {
    await resetToDefaults();
  };

  // Mock stats for display
  const mockStats = {
    activeUsers: 45,
    totalUsers: 120,
    uptime: 99.8,
    storageUsed: 2.4,
    storageTotal: 10,
    cacheHitRate: 87.5,
    databaseSize: 1.2,
    lastBackup: "Hoje às 03:00",
    publishedNews: 25,
    totalNews: 30,
    publishedConcursos: 5,
    totalConcursos: 8,
    unreadNotifications: 3,
    totalNotifications: 15
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
      {/* Stats Header */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Utilizadores Activos</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {mockStats.activeUsers}
                </p>
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
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {mockStats.uptime}%
                </p>
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
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {mockStats.storageUsed}GB
                </p>
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
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {mockStats.cacheHitRate}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </CardTitle>
          <CardDescription>
            Gerencie as configurações gerais, segurança, notificações e performance do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações Gerais</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nome do Site</Label>
                      <Input
                        id="siteName"
                        value={localConfig.siteName}
                        onChange={(e) => setLocalConfig({ ...localConfig, siteName: e.target.value })}
                        placeholder="Nome do portal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Descrição do Site</Label>
                      <Textarea
                        id="siteDescription"
                        value={localConfig.siteDescription}
                        onChange={(e) => setLocalConfig({ ...localConfig, siteDescription: e.target.value })}
                        placeholder="Descrição do portal"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contacto</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={localConfig.contactEmail}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactEmail: e.target.value })}
                        placeholder="admin@chipindo.gov.ao"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Telefone de Contacto</Label>
                      <Input
                        id="contactPhone"
                        value={localConfig.contactPhone}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactPhone: e.target.value })}
                        placeholder="+244 XXX XXX XXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactAddress">Endereço</Label>
                      <Textarea
                        id="contactAddress"
                        value={localConfig.contactAddress}
                        onChange={(e) => setLocalConfig({ ...localConfig, contactAddress: e.target.value })}
                        placeholder="Endereço completo"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de Aparência</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select
                        value={localConfig.theme}
                        onValueChange={(value) => setLocalConfig({ ...localConfig, theme: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select
                        value={localConfig.language}
                        onValueChange={(value) => setLocalConfig({ ...localConfig, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select
                        value={localConfig.timezone}
                        onValueChange={(value) => setLocalConfig({ ...localConfig, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Luanda">Africa/Luanda</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Formato de Data</Label>
                      <Select
                        value={localConfig.dateFormat}
                        onValueChange={(value) => setLocalConfig({ ...localConfig, dateFormat: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                          <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                          <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Events Settings */}
            <TabsContent value="events" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de Eventos</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventsContactEmail">Email para Eventos</Label>
                      <div className="flex">
                        <Mail className="w-4 h-4 mr-2 mt-3 text-muted-foreground" />
                        <Input
                          id="eventsContactEmail"
                          type="email"
                          value={localConfig.eventsContactEmail}
                          onChange={(e) => setLocalConfig({ ...localConfig, eventsContactEmail: e.target.value })}
                          placeholder="eventos@chipindo.gov.ao"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Exibido no modal de diretrizes de eventos.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventsContactPhone">Telefone para Eventos</Label>
                      <div className="flex">
                        <Phone className="w-4 h-4 mr-2 mt-3 text-muted-foreground" />
                        <Input
                          id="eventsContactPhone"
                          value={localConfig.eventsContactPhone}
                          onChange={(e) => setLocalConfig({ ...localConfig, eventsContactPhone: e.target.value })}
                          placeholder="+244 9XX XXX XXX"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Exibido no modal de diretrizes de eventos.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Gestão de Eventos</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          As informações de contacto configuradas aqui aparecerão automaticamente nas áreas públicas onde os cidadãos buscam informações sobre como promover ou participar de eventos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de Segurança</h3>

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
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, maintenanceMode: checked })}
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
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, allowRegistration: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Verificação de Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Requer verificação de email para novos registos
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.requireEmailVerification}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, requireEmailVerification: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de Sessão</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={localConfig.sessionTimeout}
                        onChange={(e) => setLocalConfig({ ...localConfig, sessionTimeout: parseInt(e.target.value) })}
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Tentativas de Login Máximas</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={localConfig.maxLoginAttempts}
                        onChange={(e) => setLocalConfig({ ...localConfig, maxLoginAttempts: parseInt(e.target.value) })}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tipos de Notificação</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar notificações por email
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.emailNotifications}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, emailNotifications: checked })}
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
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, smsNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar notificações push
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.pushNotifications}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, pushNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de Frequência</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notificationFrequency">Frequência de Notificações</Label>
                      <Select
                        value={localConfig.notificationFrequency}
                        onValueChange={(value) => setLocalConfig({ ...localConfig, notificationFrequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instantânea</SelectItem>
                          <SelectItem value="hourly">A cada hora</SelectItem>
                          <SelectItem value="daily">Diária</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Performance Settings */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações de Performance</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cache Habilitado</Label>
                        <p className="text-sm text-muted-foreground">
                          Usar cache para melhorar performance
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.cacheEnabled}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, cacheEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compressão Habilitada</Label>
                        <p className="text-sm text-muted-foreground">
                          Comprimir dados para reduzir tamanho
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.compressionEnabled}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, compressionEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>CDN Habilitado</Label>
                        <p className="text-sm text-muted-foreground">
                          Usar CDN para distribuição de conteúdo
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.cdnEnabled}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, cdnEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Backup Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Criar backups automáticos
                        </p>
                      </div>
                      <Switch
                        checked={localConfig.autoBackup}
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, autoBackup: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Manutenção da Base de Dados</h3>

                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      onClick={optimizeDatabase}
                      className="w-full"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Otimizar Base de Dados
                    </Button>

                    <Button
                      variant="outline"
                      onClick={vacuumDatabase}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Vacuum da Base de Dados
                    </Button>

                    <Button
                      variant="outline"
                      onClick={reindexDatabase}
                      className="w-full"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Reindexar Base de Dados
                    </Button>

                    <Button
                      variant="outline"
                      onClick={checkDatabaseIntegrity}
                      className="w-full"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verificar Integridade
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={exportSettings}
              >
                <Globe className="h-4 w-4 mr-2" />
                Exportar
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                disabled={saving}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Redefinir
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={createBackup}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Criar Backup
              </Button>

              <Button
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 