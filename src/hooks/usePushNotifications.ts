import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PushNotificationState {
  isSupported: boolean;
  isEnabled: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isEnabled: false,
    permission: 'default',
    subscription: null
  });

  const [loading, setLoading] = useState(false);

  // Check if push notifications are supported
  const checkSupport = useCallback(() => {
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    const permission = 'Notification' in window ? Notification.permission : 'denied';
    
    setState(prev => ({
      ...prev,
      isSupported,
      permission
    }));
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      toast.error("Notificações push não são suportadas neste navegador");
      return false;
    }

    try {
      setLoading(true);
      const permission = await Notification.requestPermission();
      
      setState(prev => ({
        ...prev,
        permission,
        isEnabled: permission === 'granted'
      }));

      if (permission === 'granted') {
        toast.success("Permissão de notificação concedida!");
        return true;
      } else {
        toast.error("Permissão de notificação negada");
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error("Erro ao solicitar permissão de notificação");
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.isSupported]);

  // Register service worker
  const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    if (!state.isSupported) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Error registering service worker:', error);
      toast.error("Erro ao registrar service worker");
      return null;
    }
  }, [state.isSupported]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported || state.permission !== 'granted') {
      toast.error("Notificações push não estão disponíveis");
      return false;
    }

    try {
      setLoading(true);

      const registration = await registerServiceWorker();
      if (!registration) {
        return false;
      }

      // Get existing subscription
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          toast.error("Chave VAPID não configurada");
          return false;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      // Save subscription to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            subscription: subscription.toJSON(),
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving push subscription:', error);
          toast.error("Erro ao salvar subscrição push");
          return false;
        }
      }

      setState(prev => ({
        ...prev,
        subscription,
        isEnabled: true
      }));

      toast.success("Subscrição push ativada com sucesso!");
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error("Erro ao ativar notificações push");
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.isSupported, state.permission]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      return true;
    }

    try {
      setLoading(true);

      // Unsubscribe from push manager
      await state.subscription.unsubscribe();

      // Remove from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing push subscription:', error);
        }
      }

      setState(prev => ({
        ...prev,
        subscription: null,
        isEnabled: false
      }));

      toast.success("Notificações push desativadas!");
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast.error("Erro ao desativar notificações push");
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.subscription]);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    if (!state.isEnabled) {
      toast.error("Notificações push não estão ativadas");
      return false;
    }

    try {
      setLoading(true);

      const notification = new Notification('Teste de Notificação Push', {
        body: 'Esta é uma notificação push de teste do Portal de Chipindo.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test',
        data: {
          type: 'test',
          timestamp: new Date().toISOString()
        }
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      toast.success("Notificação push de teste enviada!");
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error("Erro ao enviar notificação de teste");
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.isEnabled]);

  // Initialize push notifications
  const initialize = useCallback(async (): Promise<boolean> => {
    checkSupport();

    if (!state.isSupported) {
      return false;
    }

    try {
      setLoading(true);

      // Check existing subscription
      const registration = await registerServiceWorker();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          setState(prev => ({
            ...prev,
            subscription,
            isEnabled: true
          }));
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.isSupported, checkSupport, registerServiceWorker]);

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    loading,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
    initialize
  };
}; 