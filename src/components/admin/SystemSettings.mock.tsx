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
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useSystemSettings } from "@/hooks/useSystemSettings.mock";

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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Utilizadores Ativos</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{mockStats.activeUsers}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">de {mockStats.totalUsers} total</p>
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
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{mockStats.uptime}%</p>
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
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{mockStats.storageUsed}GB</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">de {mockStats.storageTotal}GB</p>
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
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{mockStats.cacheHitRate}%</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Performance</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
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
              <Button variant="outline" onClick={handleReset} disabled={saving}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Restaurar Padrões
              </Button>
              <Button onClick={handleSave} disabled={saving}>
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">
                <Globe className="h-4 w-4 mr-2" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Activity className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <Database className="h-4 w-4 mr-2" />
                Manutenção
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações do Site</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nome do Site</Label>
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
                  <h3 className="text-lg font-semibold">Informações de Contacto</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contacto</Label>
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
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6 mt-6">
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
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tipos de Notificação</h3>
                  
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
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Performance Settings */}
            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Otimizações</h3>
                  
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
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, cacheEnabled: checked })}
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
                        onCheckedChange={(checked) => setLocalConfig({ ...localConfig, autoBackup: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Maintenance Settings */}
            <TabsContent value="maintenance" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ferramentas de Manutenção</h3>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={async () => {
                        await optimizeDatabase();
                        toast.success('Base de dados otimizada com sucesso');
                      }}
                      disabled={loading}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Otimizar Base de Dados
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={async () => {
                        await createBackup();
                        toast.success('Backup criado com sucesso');
                      }}
                      disabled={loading}
                    >
                      <HardDrive className="h-4 w-4 mr-2" />
                      Backup Manual
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={async () => {
                        await checkDatabaseIntegrity();
                        toast.success('Verificação de integridade concluída');
                      }}
                      disabled={loading}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Verificar Integridade
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações do Sistema</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tamanho da Base de Dados:</span>
                      <span>{mockStats.databaseSize}GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Último Backup:</span>
                      <span>{mockStats.lastBackup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span>{mockStats.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilizadores Ativos:</span>
                      <span>{mockStats.activeUsers}</span>
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