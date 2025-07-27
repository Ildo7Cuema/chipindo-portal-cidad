import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Smartphone,
  Mail,
  Settings,
  TestTube,
  Users,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const PushNotificationManager = () => {
  const {
    isSupported,
    isEnabled,
    permission,
    subscription,
    loading,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification
  } = usePushNotifications();

  const [testLoading, setTestLoading] = useState(false);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        await subscribeToPush();
      }
    } else {
      await unsubscribeFromPush();
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    try {
      await sendTestNotification();
    } finally {
      setTestLoading(false);
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Concedida</Badge>;
      case 'denied':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Negada</Badge>;
      default:
        return <Badge variant="outline">Não solicitada</Badge>;
    }
  };

  const getStatusIcon = () => {
    if (!isSupported) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (isEnabled && subscription) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (!isSupported) {
      return "Não suportado";
    }
    if (isEnabled && subscription) {
      return "Ativo";
    }
    if (permission === 'denied') {
      return "Permissão negada";
    }
    return "Inativo";
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notificações Push</CardTitle>
            </div>
            {getStatusIcon()}
          </div>
          <CardDescription>
            Gerencie as notificações push do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Status</Label>
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {getStatusText()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Permissão</Label>
                {getPermissionBadge()}
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Suporte</Label>
                <Badge variant={isSupported ? "default" : "destructive"}>
                  {isSupported ? "Disponível" : "Não disponível"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ativar Notificações</Label>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={handleToggleNotifications}
                  disabled={loading || !isSupported}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Testar Notificação</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestNotification}
                  disabled={testLoading || !isEnabled}
                  className="flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" />
                  {testLoading ? 'Enviando...' : 'Testar'}
                </Button>
              </div>
            </div>
          </div>

          {!isSupported && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Notificações push não são suportadas neste navegador. 
                  Certifique-se de estar usando HTTPS e um navegador moderno.
                </p>
              </div>
            </div>
          )}

          {isSupported && permission === 'denied' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  Permissão de notificação foi negada. 
                  Para ativar as notificações, permita-as nas configurações do navegador.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Estatísticas</CardTitle>
          </div>
          <CardDescription>
            Informações sobre o uso das notificações push
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {subscription ? '1' : '0'}
              </div>
              <p className="text-sm text-muted-foreground">Subscrições Ativas</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {permission === 'granted' ? '1' : '0'}
              </div>
              <p className="text-sm text-muted-foreground">Permissões Concedidas</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {isSupported ? '1' : '0'}
              </div>
              <p className="text-sm text-muted-foreground">Navegadores Suportados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>Configuração</CardTitle>
          </div>
          <CardDescription>
            Configurações avançadas das notificações push
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Notificações Gerais</p>
                  <p className="text-sm text-muted-foreground">Notícias e atualizações</p>
                </div>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Notificações Urgentes</p>
                  <p className="text-sm text-muted-foreground">Alertas importantes</p>
                </div>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Notificações de Sistema</p>
                  <p className="text-sm text-muted-foreground">Manutenção e updates</p>
                </div>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Informações Técnicas</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Service Worker: {isSupported ? 'Registrado' : 'Não disponível'}</div>
              <div>Push Manager: {isSupported ? 'Disponível' : 'Não disponível'}</div>
              <div>VAPID Key: {import.meta.env.VITE_VAPID_PUBLIC_KEY ? 'Configurada' : 'Não configurada'}</div>
              {subscription && (
                <div>Subscription ID: {subscription.endpoint.slice(-20)}...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 