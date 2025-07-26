import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 
  | 'interest_registration' 
  | 'new_user' 
  | 'news_published' 
  | 'concurso_created' 
  | 'system_update' 
  | 'maintenance' 
  | 'urgent' 
  | 'info';

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

/**
 * Helper function to create a notification in the database
 */
export async function createNotification({
  type,
  title,
  message,
  data = {}
}: CreateNotificationParams): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .insert([{
        type,
        title,
        message,
        data,
        read: false
      }]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    return false;
  }
}

/**
 * Create notification when a new user registers
 */
export async function notifyNewUser(userEmail: string, userName?: string): Promise<boolean> {
  return createNotification({
    type: 'new_user',
    title: 'Novo Utilizador Registado',
    message: `Um novo utilizador registou-se no sistema: ${userName || userEmail}`,
    data: {
      email: userEmail,
      name: userName,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create notification when a news article is published
 */
export async function notifyNewsPublished(newsTitle: string, newsId: string, authorName?: string): Promise<boolean> {
  return createNotification({
    type: 'news_published',
    title: 'Nova Notícia Publicada',
    message: `A notícia "${newsTitle}" foi publicada${authorName ? ` por ${authorName}` : ''}.`,
    data: {
      newsId,
      newsTitle,
      author: authorName,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create notification when a new concurso is created
 */
export async function notifyConcursoCreated(concursoTitle: string, concursoId: string, authorName?: string): Promise<boolean> {
  return createNotification({
    type: 'concurso_created',
    title: 'Novo Concurso Criado',
    message: `O concurso "${concursoTitle}" foi criado${authorName ? ` por ${authorName}` : ''}.`,
    data: {
      concursoId,
      concursoTitle,
      author: authorName,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create notification for system updates
 */
export async function notifySystemUpdate(updateTitle: string, updateDescription: string): Promise<boolean> {
  return createNotification({
    type: 'system_update',
    title: `Atualização do Sistema: ${updateTitle}`,
    message: updateDescription,
    data: {
      updateTitle,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create notification for maintenance alerts
 */
export async function notifyMaintenance(maintenanceTitle: string, scheduledDate?: Date): Promise<boolean> {
  const scheduledText = scheduledDate 
    ? ` agendada para ${scheduledDate.toLocaleDateString('pt-AO')}`
    : '';
    
  return createNotification({
    type: 'maintenance',
    title: 'Manutenção do Sistema',
    message: `${maintenanceTitle}${scheduledText}`,
    data: {
      maintenanceTitle,
      scheduledDate: scheduledDate?.toISOString(),
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create urgent notification
 */
export async function notifyUrgent(title: string, message: string, additionalData?: any): Promise<boolean> {
  return createNotification({
    type: 'urgent',
    title: `URGENTE: ${title}`,
    message,
    data: {
      ...additionalData,
      timestamp: new Date().toISOString(),
      priority: 'high'
    }
  });
}

/**
 * Create informational notification
 */
export async function notifyInfo(title: string, message: string, additionalData?: any): Promise<boolean> {
  return createNotification({
    type: 'info',
    title,
    message,
    data: {
      ...additionalData,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Create notification when someone registers interest
 */
export async function notifyInterestRegistration(
  fullName: string, 
  email: string, 
  areasOfInterest: string[],
  phone?: string,
  profession?: string,
  experience_years?: number,
  additional_info?: string
): Promise<boolean> {
  return createNotification({
    type: 'interest_registration',
    title: 'Novo Registo de Interesse',
    message: `${fullName} registou interesse nas áreas: ${areasOfInterest.join(', ')}`,
    data: {
      fullName,
      email,
      phone,
      profession,
      experience_years,
      areasOfInterest,
      additional_info,
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Bulk create multiple notifications
 */
export async function createBulkNotifications(notifications: CreateNotificationParams[]): Promise<boolean> {
  try {
    const notificationData = notifications.map(notification => ({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data || {},
      read: false
    }));

    const { error } = await supabase
      .from('admin_notifications')
      .insert(notificationData);

    if (error) {
      console.error('Error creating bulk notifications:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error creating bulk notifications:', error);
    return false;
  }
}

/**
 * Get notification count for header badge
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('admin_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);

    if (error) {
      console.error('Error getting notification count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Unexpected error getting notification count:', error);
    return 0;
  }
} 