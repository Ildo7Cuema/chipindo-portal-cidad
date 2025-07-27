import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for notification services
export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  html?: string;
  from?: string;
}

export interface SMSNotification {
  to: string;
  message: string;
  from?: string;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

// Email Service
export class EmailService {
  private static instance: EmailService;
  private isEnabled: boolean = true;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(notification: EmailNotification): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Email notifications are disabled');
      return false;
    }

    try {
      // Use Supabase Edge Function for email sending
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: notification.to,
          subject: notification.subject,
          body: notification.body,
          html: notification.html,
          from: notification.from || 'noreply@chipindo.gov.ao'
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error sending email:', error);
      return false;
    }
  }

  async sendBulkEmails(notifications: EmailNotification[]): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Email notifications are disabled');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-emails', {
        body: {
          emails: notifications
        }
      });

      if (error) {
        console.error('Error sending bulk emails:', error);
        return false;
      }

      console.log('Bulk emails sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error sending bulk emails:', error);
      return false;
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// SMS Service
export class SMSService {
  private static instance: SMSService;
  private isEnabled: boolean = false;

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  async sendSMS(notification: SMSNotification): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('SMS notifications are disabled');
      return false;
    }

    try {
      // Use Supabase Edge Function for SMS sending
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: notification.to,
          message: notification.message,
          from: notification.from || 'Chipindo'
        }
      });

      if (error) {
        console.error('Error sending SMS:', error);
        return false;
      }

      console.log('SMS sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error sending SMS:', error);
      return false;
    }
  }

  async sendBulkSMS(notifications: SMSNotification[]): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('SMS notifications are disabled');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-sms', {
        body: {
          messages: notifications
        }
      });

      if (error) {
        console.error('Error sending bulk SMS:', error);
        return false;
      }

      console.log('Bulk SMS sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error sending bulk SMS:', error);
      return false;
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Push Notification Service
export class PushNotificationService {
  private static instance: PushNotificationService;
  private isEnabled: boolean = true;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Push notifications are disabled');
      return false;
    }

    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', this.registration);
        return true;
      } else {
        console.log('Push notifications not supported');
        return false;
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Push notifications are disabled');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async sendPushNotification(notification: PushNotification): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Push notifications are disabled');
      return false;
    }

    try {
      if (!this.registration) {
        await this.initialize();
      }

      if (!this.registration) {
        console.error('Service Worker not registered');
        return false;
      }

      const permission = await this.requestPermission();
      if (!permission) {
        console.log('Notification permission denied');
        return false;
      }

      // Send push notification through service worker
      await this.registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge,
        tag: notification.tag,
        data: notification.data,
        actions: notification.actions,
        requireInteraction: notification.tag === 'urgent',
        silent: false
      });

      console.log('Push notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  async subscribeToPush(): Promise<boolean> {
    if (!this.isEnabled || !this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || '')
      });

      // Save subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          subscription: subscription,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving push subscription:', error);
        return false;
      }

      console.log('Push subscription saved successfully');
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
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
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Notification Manager
export class NotificationManager {
  private static instance: NotificationManager;
  private emailService: EmailService;
  private smsService: SMSService;
  private pushService: PushNotificationService;
  private config: NotificationConfig;

  constructor() {
    this.emailService = EmailService.getInstance();
    this.smsService = SMSService.getInstance();
    this.pushService = PushNotificationService.getInstance();
    this.config = {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      frequency: 'realtime'
    };
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<void> {
    // Load configuration from database
    await this.loadConfig();
    
    // Initialize push notifications
    await this.pushService.initialize();
  }

  async loadConfig(): Promise<void> {
    try {
      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['email_notifications', 'sms_notifications', 'push_notifications', 'notification_frequency']);

      if (error) {
        console.error('Error loading notification config:', error);
        return;
      }

      settings?.forEach((setting: any) => {
        switch (setting.key) {
          case 'email_notifications':
            this.config.emailEnabled = setting.value;
            this.emailService.setEnabled(setting.value);
            break;
          case 'sms_notifications':
            this.config.smsEnabled = setting.value;
            this.smsService.setEnabled(setting.value);
            break;
          case 'push_notifications':
            this.config.pushEnabled = setting.value;
            this.pushService.setEnabled(setting.value);
            break;
          case 'notification_frequency':
            this.config.frequency = setting.value;
            break;
        }
      });
    } catch (error) {
      console.error('Error loading notification configuration:', error);
    }
  }

  async sendNotification(
    type: 'email' | 'sms' | 'push' | 'all',
    notification: EmailNotification | SMSNotification | PushNotification
  ): Promise<boolean> {
    try {
      let success = false;

      switch (type) {
        case 'email':
          success = await this.emailService.sendEmail(notification as EmailNotification);
          break;
        case 'sms':
          success = await this.smsService.sendSMS(notification as SMSNotification);
          break;
        case 'push':
          success = await this.pushService.sendPushNotification(notification as PushNotification);
          break;
        case 'all':
          const results = await Promise.allSettled([
            this.emailService.sendEmail(notification as EmailNotification),
            this.smsService.sendSMS(notification as SMSNotification),
            this.pushService.sendPushNotification(notification as PushNotification)
          ]);
          success = results.some(result => result.status === 'fulfilled' && result.value);
          break;
      }

      if (success) {
        toast.success('Notificação enviada com sucesso');
      } else {
        toast.error('Erro ao enviar notificação');
      }

      return success;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
      return false;
    }
  }

  async sendSystemNotification(
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success' = 'info'
  ): Promise<boolean> {
    const notification: PushNotification = {
      title,
      body: message,
      icon: `/icons/${type}.png`,
      tag: type,
      data: { type, timestamp: new Date().toISOString() }
    };

    return this.sendNotification('all', notification);
  }

  async sendUrgentNotification(
    title: string,
    message: string,
    recipients?: string[]
  ): Promise<boolean> {
    const urgentNotification: PushNotification = {
      title: `URGENTE: ${title}`,
      body: message,
      icon: '/icons/urgent.png',
      tag: 'urgent',
      requireInteraction: true,
      data: { priority: 'high', timestamp: new Date().toISOString() }
    };

    // Send to all channels for urgent notifications
    const results = await Promise.allSettled([
      this.pushService.sendPushNotification(urgentNotification),
      ...(recipients?.map(email => 
        this.emailService.sendEmail({
          to: email,
          subject: `URGENTE: ${title}`,
          body: message
        })
      ) || [])
    ]);

    const success = results.some(result => result.status === 'fulfilled' && result.value);
    
    if (success) {
      toast.success('Notificação urgente enviada');
    } else {
      toast.error('Erro ao enviar notificação urgente');
    }

    return success;
  }

  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  async updateConfig(newConfig: Partial<NotificationConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    
    // Update services
    this.emailService.setEnabled(this.config.emailEnabled);
    this.smsService.setEnabled(this.config.smsEnabled);
    this.pushService.setEnabled(this.config.pushEnabled);

    // Save to database
    const settingsToUpdate = [
      { key: 'email_notifications', value: this.config.emailEnabled },
      { key: 'sms_notifications', value: this.config.smsEnabled },
      { key: 'push_notifications', value: this.config.pushEnabled },
      { key: 'notification_frequency', value: this.config.frequency }
    ];

    for (const setting of settingsToUpdate) {
      await supabase.rpc('update_system_setting', {
        setting_key: setting.key,
        setting_value: setting.value
      });
    }
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance(); 