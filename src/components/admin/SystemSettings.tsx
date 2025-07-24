import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Settings, Save, RefreshCw, Database, Shield, Mail } from "lucide-react";
import { BackupManager } from "./BackupManager";

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
}

export const SystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "Portal de Chipindo",
    siteDescription: "Portal oficial do município de Chipindo",
    contactEmail: "contato@chipindo.gov.ao",
    maintenanceMode: false,
    allowRegistration: false,
    emailNotifications: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular salvamento - em uma aplicação real, isso seria salvo no banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig({
      siteName: "Portal de Chipindo",
      siteDescription: "Portal oficial do município de Chipindo",
      contactEmail: "contato@chipindo.gov.ao",
      maintenanceMode: false,
      allowRegistration: false,
      emailNotifications: true,
    });
    toast({
      title: "Configurações restauradas",
      description: "As configurações foram restauradas aos valores padrão.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Configure as informações básicas do portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={config.siteName}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Textarea
                id="siteDescription"
                value={config.siteDescription}
                onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input
                id="contactEmail"
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Configurações de Segurança
            </CardTitle>
            <CardDescription>
              Controle o acesso e a segurança do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">
                  Temporariamente desabilita o acesso público ao site
                </p>
              </div>
              <Switch
                checked={config.maintenanceMode}
                onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Registro</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que novos usuários se registrem no sistema
                </p>
              </div>
              <Switch
                checked={config.allowRegistration}
                onCheckedChange={(checked) => setConfig({ ...config, allowRegistration: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Configurações de Notificação
            </CardTitle>
            <CardDescription>
              Configure as notificações por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar notificações importantes por email
                </p>
              </div>
              <Switch
                checked={config.emailNotifications}
                onCheckedChange={(checked) => setConfig({ ...config, emailNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Manutenção do Sistema
            </CardTitle>
            <CardDescription>
              Ferramentas para manutenção e diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Limpar Cache
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Otimizar Banco
              </Button>
            </div>
            
            <Separator />
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Última limpeza de cache:</strong> Nunca</p>
              <p><strong>Última otimização:</strong> Nunca</p>
              <p><strong>Espaço usado:</strong> Calculando...</p>
            </div>
          </CardContent>
        </Card>

        <BackupManager />

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Configurações"}
          </Button>
          
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
        </div>
      </div>
    </div>
  );
};