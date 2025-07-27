// Simplified hook without push_subscriptions table
import { useState } from 'react';
import { toast } from 'sonner';

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export function usePushNotifications() {
  const [loading, setLoading] = useState(false);
  const [subscriptions] = useState<PushSubscription[]>([]);

  const requestPermission = async () => {
    try {
      setLoading(true);
      
      if (!('Notification' in window)) {
        toast.error('Este navegador não suporta notificações push');
        return false;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast.success('Permissão para notificações concedida');
        return true;
      } else {
        toast.error('Permissão para notificações negada');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Erro ao solicitar permissão para notificações');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        new Notification('Teste de Notificação', {
          body: 'Esta é uma notificação de teste do Portal de Chipindo',
          icon: '/favicon.ico'
        });
        toast.success('Notificação de teste enviada');
      } else {
        toast.error('Permissão para notificações necessária');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Erro ao enviar notificação de teste');
    }
  };

  return {
    loading,
    subscriptions,
    requestPermission,
    sendTestNotification
  };
}