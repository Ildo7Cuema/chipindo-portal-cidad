import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, CheckCircle, Clock, User, FileText, Trophy, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

const NotificationsManager = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
          toast({
            title: 'Nova Notificação',
            description: (payload.new as Notification).title,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as notificações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error: any) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );

      toast({
        title: 'Sucesso',
        description: 'Todas as notificações foram marcadas como lidas.',
      });
    } catch (error: any) {
      console.error('Erro ao marcar todas como lidas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar todas as notificações como lidas.',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interest_registration':
        return <User className="w-4 h-4" />;
      case 'news_published':
        return <FileText className="w-4 h-4" />;
      case 'contest_published':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'interest_registration':
        return 'bg-blue-500';
      case 'news_published':
        return 'bg-green-500';
      case 'contest_published':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notificações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações do Sistema
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Acompanhe todas as atividades do sistema em tempo real
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma notificação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  notification.read ? 'bg-muted/50' : 'bg-background border-primary/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 px-2"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {notification.message}
                  </p>
                  
                  {notification.data && notification.type === 'interest_registration' && (
                    <div className="mt-2 space-y-2">
                      <div className="p-2 bg-muted rounded text-xs">
                        <p><strong>Email:</strong> {notification.data.email}</p>
                        <p><strong>Áreas:</strong> {notification.data.areas_of_interest?.join(', ')}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Eye className="w-3 h-3 mr-1" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Registo de Interesse</DialogTitle>
                            <DialogDescription>
                              Informações completas da pessoa que registou interesse
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Nome Completo</h4>
                                <p className="text-sm">{notification.data.full_name}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                                <p className="text-sm">{notification.data.email}</p>
                              </div>
                              {notification.data.phone && (
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground">Telefone</h4>
                                  <p className="text-sm">{notification.data.phone}</p>
                                </div>
                              )}
                              {notification.data.profession && (
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground">Profissão</h4>
                                  <p className="text-sm">{notification.data.profession}</p>
                                </div>
                              )}
                              {notification.data.experience_years && (
                                <div>
                                  <h4 className="font-medium text-sm text-muted-foreground">Anos de Experiência</h4>
                                  <p className="text-sm">{notification.data.experience_years} anos</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground">Áreas de Interesse</h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {notification.data.areas_of_interest?.map((area: string, index: number) => (
                                  <Badge key={index} variant="secondary">{area}</Badge>
                                ))}
                              </div>
                            </div>
                            {notification.data.additional_info && (
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Informações Adicionais</h4>
                                <p className="text-sm mt-1 p-3 bg-muted rounded">{notification.data.additional_info}</p>
                              </div>
                            )}
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground">
                                Registado em: {new Date(notification.created_at).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsManager;