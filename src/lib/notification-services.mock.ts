// Mock notification services for build compatibility

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  frequency: string;
}

export interface PushSubscription {
  id: string;
  endpoint: string;
  userId: string;
  createdAt: string;
}

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  return {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    frequency: 'daily'
  };
};

export const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<boolean> => {
  console.log('Mock notification settings update:', settings);
  return true;
};

export const sendTestEmail = async (email: string): Promise<boolean> => {
  console.log('Mock test email sent to:', email);
  return true;
};

export const sendTestSMS = async (phone: string): Promise<boolean> => {
  console.log('Mock test SMS sent to:', phone);
  return true;
};

export const sendTestPushNotification = async (): Promise<boolean> => {
  console.log('Mock test push notification sent');
  return true;
};

export const getPushSubscriptions = async (): Promise<PushSubscription[]> => {
  return [
    {
      id: '1',
      endpoint: 'mock-endpoint-1',
      userId: 'user-1',
      createdAt: new Date().toISOString()
    }
  ];
};

export const registerPushSubscription = async (subscription: any): Promise<boolean> => {
  console.log('Mock push subscription registered:', subscription);
  return true;
};

export const unregisterPushSubscription = async (subscriptionId: string): Promise<boolean> => {
  console.log('Mock push subscription unregistered:', subscriptionId);
  return true;
};

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    return true;
  },
  subscribe: async (): Promise<boolean> => {
    return true;
  },
  unsubscribe: async (): Promise<boolean> => {
    return true;
  },
  sendNotification: async (title: string, body: string): Promise<boolean> => {
    console.log('Mock notification:', title, body);
    return true;
  }
};