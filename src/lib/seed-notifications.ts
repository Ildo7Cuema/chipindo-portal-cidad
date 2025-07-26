import { createBulkNotifications } from './notification-helpers';

/**
 * Seed sample notifications for testing the system
 */
export async function seedSampleNotifications(): Promise<boolean> {
  const sampleNotifications = [
    {
      type: 'new_user' as const,
      title: 'Novo Utilizador Registado',
      message: 'João Silva registou-se no sistema como editor.',
      data: {
        userId: 'sample-user-1',
        email: 'joao.silva@chipindo.gov.ao',
        role: 'editor',
        timestamp: new Date().toISOString()
      }
    },
    {
      type: 'news_published' as const,
      title: 'Nova Notícia Publicada',
      message: 'A notícia "Inauguração da Nova Escola Primária" foi publicada com sucesso.',
      data: {
        newsId: 'sample-news-1',
        author: 'Maria Santos',
        category: 'educacao',
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    },
    {
      type: 'concurso_created' as const,
      title: 'Novo Concurso Criado',
      message: 'Concurso Público para Professor de Matemática foi criado e está disponível.',
      data: {
        concursoId: 'sample-concurso-1',
        area: 'educacao',
        vagas: 5,
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
      }
    },
    {
      type: 'interest_registration' as const,
      title: 'Novo Registo de Interesse',
      message: 'Ana Costa registou interesse nas áreas de Saúde e Educação.',
      data: {
        fullName: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '+244 923 456 789',
        profession: 'Enfermeira',
        experience_years: 8,
        areasOfInterest: ['Saúde', 'Educação'],
        additional_info: 'Tenho especialização em enfermagem comunitária e experiência em programas de vacinação. Gostaria de contribuir para melhorar os serviços de saúde no município de Chipindo, especialmente em áreas rurais.',
        timestamp: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
      }
    },
    {
      type: 'system_update' as const,
      title: 'Atualização do Sistema: Nova Funcionalidade',
      message: 'O sistema de notificações foi implementado com sucesso. Agora você pode acompanhar todas as atividades em tempo real.',
      data: {
        version: '1.2.0',
        features: ['Sistema de Notificações', 'Exportação de Dados', 'Central de Ajuda'],
        timestamp: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
      }
    },
    {
      type: 'maintenance' as const,
      title: 'Manutenção do Sistema',
      message: 'Manutenção programada do servidor agendada para este fim de semana.',
      data: {
        scheduledDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        duration: '2 horas',
        affectedServices: ['Portal Principal', 'Área Administrativa'],
        timestamp: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
      }
    },
    {
      type: 'urgent' as const,
      title: 'URGENTE: Problema de Conectividade',
      message: 'Foi detectado um problema intermitente de conectividade. A equipe técnica está trabalhando na resolução.',
      data: {
        severity: 'medium',
        affectedUsers: 15,
        estimatedResolution: '1 hora',
        timestamp: new Date(Date.now() - 21600000).toISOString() // 6 hours ago
      }
    },
    {
      type: 'info' as const,
      title: 'Relatório Mensal Disponível',
      message: 'O relatório mensal de atividades do portal está disponível para download na seção de relatórios.',
      data: {
        reportType: 'monthly',
        period: 'Janeiro 2024',
        totalPages: 45,
        downloadUrl: '/reports/monthly-jan-2024.pdf',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    },
    {
      type: 'interest_registration' as const,
      title: 'Novo Registo de Interesse',
      message: 'Carlos Mendes registou interesse na área de Engenharia Civil.',
      data: {
        fullName: 'Carlos Mendes',
        email: 'carlos.mendes@engenharia.ao',
        phone: '+244 912 345 678',
        profession: 'Engenheiro Civil',
        experience_years: 12,
        areasOfInterest: ['Infraestrutura', 'Obras Públicas'],
        additional_info: 'Engenheiro Civil com vasta experiência em gestão de projetos de infraestrutura urbana e rural. Tenho interesse em contribuir para o desenvolvimento sustentável do município.',
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
      }
    }
  ];

  try {
    const success = await createBulkNotifications(sampleNotifications);
    
    if (success) {
      console.log('Sample notifications created successfully');
    } else {
      console.error('Failed to create sample notifications');
    }
    
    return success;
  } catch (error) {
    console.error('Error seeding sample notifications:', error);
    return false;
  }
}

/**
 * Clear all notifications from the database (use with caution)
 */
export async function clearAllNotifications(): Promise<boolean> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
    
    console.log('All notifications cleared successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error clearing notifications:', error);
    return false;
  }
} 