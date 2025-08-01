import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 
  | 'interest_registration' 
  | 'new_user' 
  | 'news_published' 
  | 'concurso_created' 
  | 'system_update' 
  | 'maintenance' 
  | 'urgent' 
  | 'info';

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  today: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
    today: 0
  });

  // Fetch notifications from database
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setNotifications(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar notificações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate notification statistics
  const calculateStats = (notificationList: NotificationItem[]) => {
    const today = new Date().toDateString();
    
    const stats: NotificationStats = {
      total: notificationList.length,
      unread: notificationList.filter(n => !n.read).length,
      read: notificationList.filter(n => n.read).length,
      today: notificationList.filter(n => 
        new Date(n.created_at).toDateString() === today
      ).length
    };

    setStats(stats);
  };

  // Create a new notification
  const createNotification = async (
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .insert([{
          type,
          title,
          message,
          data: data || {},
          read: false
        }]);

      if (error) {
        throw error;
      }

      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: "Notificação criada",
        description: "A notificação foi criada com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao criar notificação",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Update notification
  const updateNotification = async (
    id: string,
    updates: Partial<Omit<NotificationItem, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: "Notificação atualizada",
        description: "A notificação foi atualizada com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao actualizar notificação",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao excluir notificação",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Mark notification as read/unread
  const markAsRead = async (id: string, read: boolean = true) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state without full refresh for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read }
            : notification
        )
      );

      // Recalculate stats
      const updatedNotifications = notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read }
          : notification
      );
      calculateStats(updatedNotifications);

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar notificação",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) {
        throw error;
      }

      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: "Todas as notificações marcadas como lidas",
        description: "Todas as notificações foram marcadas como lidas.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao marcar notificações",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete multiple notifications
  const deleteMultiple = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .in('id', ids);

      if (error) {
        throw error;
      }

      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: "Notificações excluídas",
        description: `${ids.length} notificações foram excluídas.`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao excluir notificações",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Mark multiple notifications as read/unread
  const markMultipleAsRead = async (ids: string[], read: boolean = true) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read })
        .in('id', ids);

      if (error) {
        throw error;
      }

      // Refresh notifications
      await fetchNotifications();
      
      toast({
        title: `Notificações marcadas como ${read ? 'lidas' : 'não lidas'}`,
        description: `${ids.length} notificações foram atualizadas.`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao actualizar notificações",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('admin_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          console.log('Notification change received:', payload);
          // Refresh notifications when there are changes
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    notifications,
    stats,
    loading,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    deleteMultiple,
    markMultipleAsRead
  };
} 